import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { launchBrowser } from "./browser.mjs";

const base = process.env.SITE_URL || "http://127.0.0.1:3100";
const server = process.env.SITE_URL ? null : spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", "3100", "-H", "127.0.0.1"], { windowsHide: true, stdio: "pipe" });
let serverLog = "";
server?.stdout.on("data", (chunk) => { serverLog += chunk; });
server?.stderr.on("data", (chunk) => { serverLog += chunk; });
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt++) {
    try { if ((await fetch(base)).ok) { ready = true; break; } } catch { /* Server is still starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  assert.ok(ready, `Production server did not become ready. ${serverLog}`);
  mkdirSync("test-results", { recursive: true });
  browser = await launchBrowser();
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const failedAssets = [];
  page.on("response", (response) => { if (response.status() >= 400) failedAssets.push(`${response.status()} ${response.url()}`); });

  // Hold application scripts: the header must draw before hydration/WebGL.
  for (const locale of ["fa", "en"]) {
    const headerContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    let releaseScripts;
    const scriptsReleased = new Promise(resolve => { releaseScripts = resolve; });
    await headerContext.route("**/_next/static/**/*.js", async route => { await scriptsReleased; await route.continue(); });
    const headerPage = await headerContext.newPage();
    try {
      await headerPage.goto(`${base}${locale === 'fa' ? '/' : '/en'}`, { waitUntil: "commit" });
      await headerPage.waitForFunction(() => document.querySelector('header')?.getAnimations({ subtree: true }).some(animation => animation.animationName?.includes('headerDraw')));
      const drawing = await headerPage.evaluate(() => {
        const header = document.querySelector('header');
        const animations = header.getAnimations({ subtree: true });
        animations.forEach(animation => { animation.pause(); animation.currentTime = 400; });
        const rule = getComputedStyle(header, '::after');
        const highlight = getComputedStyle(header, '::before');
        return { scale: new DOMMatrixReadOnly(rule.transform).a, origin: parseFloat(rule.transformOrigin), width: header.clientWidth, duration: rule.animationDuration, delay: rule.animationDelay, highlight: Number(highlight.opacity), interactive: rule.pointerEvents, elapsed: document.querySelector('[data-motion-art]').getAttribute('data-elapsed') };
      });
      assert.ok(drawing.scale > 0 && drawing.scale < 1, "Header should be partially drawn at 400ms");
      assert.ok(Math.abs(drawing.origin - (locale === 'fa' ? drawing.width : 0)) < 1, "Header must draw from the brand side");
      assert.equal(drawing.duration, "0.88s");
      assert.equal(drawing.delay, "0.12s");
      assert.ok(drawing.highlight > 0);
      assert.equal(drawing.interactive, "none", "Divider must not intercept navigation");
      assert.equal(drawing.elapsed, null, "Header should animate while application scripts are still pending");
      await headerPage.screenshot({ path: `test-results/${locale}-header-drawing.png`, clip: { x: 0, y: 0, width: 1440, height: 115 } });
      await headerPage.evaluate(() => document.querySelector('header').getAnimations({ subtree: true }).forEach(animation => { animation.currentTime = 1000; }));
      assert.equal(await headerPage.locator('header').evaluate(header => new DOMMatrixReadOnly(getComputedStyle(header, '::after').transform).a), 1);
      assert.equal(await headerPage.locator('header').evaluate(header => getComputedStyle(header, '::before').opacity), "0");
    } finally {
      releaseScripts();
      await headerPage.waitForLoadState('load');
      await headerContext.close();
    }
  }
  console.log("PASS header drawing before application scripts: brand-side direction in both languages, 120ms delay, 880ms duration, highlight and completion");

  // Real phone heights: the artwork belongs in the first screen, before the description.
  const phoneContext = await browser.newContext({ reducedMotion: 'reduce' });
  const phonePage = await phoneContext.newPage();
  phonePage.on('pageerror', error => errors.push(error.message));
  for (const locale of ['fa', 'en']) {
    const route = locale === 'fa' ? '/' : '/en';
    for (const [width, height] of [[320, 568], [360, 640], [390, 844]]) {
      await phonePage.setViewportSize({ width, height });
      await phonePage.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      await phonePage.evaluate(() => document.fonts.ready);
      const layout = await phonePage.evaluate(() => {
        const stage = document.querySelector('#arch-sculpture').getBoundingClientRect();
        const heading = document.querySelector('h1').getBoundingClientRect();
        const description = document.querySelector('h1').closest('section').querySelector('p').getBoundingClientRect();
        return { top: stage.top, bottom: stage.bottom, headingBottom: heading.bottom, descriptionTop: description.top, overflow: document.documentElement.scrollWidth > innerWidth };
      });
      assert.ok(layout.top >= layout.headingBottom, `${locale}: artwork should follow the headline`);
      assert.ok(layout.bottom <= height, `${locale}/${width}x${height}: artwork should fit in the first screen (${layout.bottom})`);
      assert.ok(layout.descriptionTop >= layout.bottom, `${locale}: description should follow the artwork on phones`);
      assert.equal(layout.overflow, false);
      assert.equal(await phonePage.locator('header a[hreflang] svg').count(), 1);
      assert.ok(!/[↗↖⬆⬇]/u.test(await phonePage.locator('header a[hreflang]').innerText()), 'Language arrow must be SVG, not a font glyph');
      await phonePage.screenshot({ path: `test-results/${locale}-${width}x${height}-first-screen.png` });
    }
  }
  await phoneContext.close();

  // Land below the hero, then expose just a sliver before bringing it fully into view.
  const entryContext = await browser.newContext({ viewport: { width: 360, height: 320 } });
  const entryPage = await entryContext.newPage();
  entryPage.on('pageerror', error => errors.push(error.message));
  for (const locale of ['fa', 'en']) {
    await entryPage.setViewportSize({ width: 360, height: 320 });
    await entryPage.goto(`${base}${locale === 'fa' ? '/' : '/en'}#contact`, { waitUntil: 'networkidle' });
    const motion = entryPage.locator('[data-motion-art]');
    await entryPage.waitForFunction(() => document.querySelector('[data-motion-art]')?.getAttribute('data-running') === 'false');
    // A browser may briefly pass the artwork while scrolling to the initial
    // anchor. Preserve that elapsed time rather than assuming it was never seen.
    const entryTime = Number(await motion.getAttribute('data-elapsed'));
    assert.ok(entryTime < 500, 'Opening must remain near the drawing start when landing below the hero');
    await entryPage.evaluate(() => {
      const stage = document.querySelector('#arch-sculpture').getBoundingClientRect();
      window.scrollTo({ top: scrollY + stage.bottom - 40, behavior: 'instant' });
    });
    await entryPage.waitForTimeout(400);
    assert.equal(Number(await motion.getAttribute('data-elapsed')), entryTime, 'A 40px sliver must not start or resume the opening');
    await entryPage.locator('#arch-sculpture').scrollIntoViewIfNeeded();
    await entryPage.waitForFunction(time => Number(document.querySelector('[data-motion-art]')?.getAttribute('data-elapsed')) > time + 100, entryTime);
    assert.ok(Number(await motion.getAttribute('data-elapsed')) < 1000, 'Entering the artwork should start from the drawing');
    await entryPage.waitForFunction(() => document.querySelector('[data-motion-art]')?.getAttribute('data-phase') === 'settled', undefined, { timeout: 20000 });
    await entryPage.setViewportSize({ width: 360, height: 640 });
    await entryPage.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await entryPage.screenshot({ path: `test-results/${locale}-360x640-animated-hero.png` });
  }
  // A short landscape viewport must still be able to trigger playback.
  await entryPage.setViewportSize({ width: 844, height: 320 });
  await entryPage.goto(base, { waitUntil: 'networkidle' });
  await entryPage.locator('#arch-sculpture').scrollIntoViewIfNeeded();
  await entryPage.waitForFunction(() => Number(document.querySelector('[data-motion-art]')?.getAttribute('data-elapsed')) > 100);
  await entryContext.close();
  console.log('PASS SVG language arrow, first-screen artwork at three phone sizes in both languages, delayed entry playback, and short landscape viewport');

  const lineContext = await browser.newContext();
  const linePage = await lineContext.newPage();
  linePage.on('pageerror', error => errors.push(error.message));
  for (const locale of ['fa', 'en']) for (const width of [360, 1440]) {
    await linePage.setViewportSize({ width, height: 900 });
    await linePage.goto(`${base}${locale === 'fa' ? '/' : '/en'}`, { waitUntil: 'networkidle' });
    const rule = linePage.locator('#portfolio [data-draw-line][data-axis="x"]').first();
    await linePage.waitForFunction(() => document.querySelector('#portfolio [data-draw-line]')?.getAttribute('data-line-state') === 'pending');
    assert.equal(await rule.locator('span').evaluate(ink => new DOMMatrixReadOnly(getComputedStyle(ink).transform).a), 0, 'Offscreen ink should wait to draw');
    const before = await rule.boundingBox();
    await rule.evaluate(rule => window.scrollTo({ top: scrollY + rule.getBoundingClientRect().top - innerHeight * .65, behavior: 'instant' }));
    await linePage.waitForFunction(() => document.querySelector('#portfolio [data-draw-line]')?.getAttribute('data-line-state') === 'drawn');
    await linePage.waitForTimeout(200);
    const partial = await rule.locator('span').evaluate(ink => ({ scale: new DOMMatrixReadOnly(getComputedStyle(ink).transform).a, origin: parseFloat(getComputedStyle(ink).transformOrigin), duration: ink.getAnimations()[0].effect.getTiming().duration, start: ink.getAnimations()[0].startTime }));
    assert.ok(partial.scale > 0 && partial.scale < 1, 'Rule must visibly draw through an intermediate width');
    assert.ok(Math.abs(partial.origin - (locale === 'fa' ? before.width : 0)) < 1, 'Rules should draw in the document reading direction');
    assert.equal(partial.duration, 1500);
    const during = await rule.boundingBox();
    assert.equal(during.width, before.width, 'Drawing must not change the rule layout box');
    assert.equal(during.height, before.height);
    await linePage.screenshot({ path: `test-results/${locale}-${width}-line-drawing.png` });
    const vertical = linePage.locator('#portfolio [data-draw-line][data-axis="y"]').first();
    await vertical.scrollIntoViewIfNeeded();
    await linePage.waitForFunction(() => document.querySelector('#portfolio [data-axis="y"]')?.getAttribute('data-line-state') === 'drawn');
    assert.equal(await vertical.locator('span').evaluate(ink => ink.getAnimations()[0].effect.getTiming().duration), 2000);
    const art = linePage.locator('#sectors [data-draw-art]').first();
    await art.scrollIntoViewIfNeeded();
    await linePage.waitForFunction(() => document.querySelector('#sectors [data-draw-art]')?.getAttribute('data-line-state') === 'drawn');
    assert.equal(await art.locator('path').first().getAttribute('pathLength'), '1');
    await linePage.waitForFunction(() => getComputedStyle(document.querySelector('#sectors [data-draw-art] path')).strokeDashoffset === '0px');
    const heroColumn = await linePage.locator('main > section [data-column-rule]').first().boundingBox();
    assert.ok(heroColumn.height > 400 && heroColumn.width === 1, 'Hero should have a tall, visible structural rule');
    if (width > 700) {
      const sectorColumn = linePage.locator('#sectors [data-column-rule]');
      const columnBox = await sectorColumn.boundingBox();
      assert.ok(columnBox.height > 600 && columnBox.width === 1, 'Sector divider must span the table, not just an icon or label');
      const firstRow = linePage.locator('#sectors article').first();
      const titleBox = await firstRow.locator('h3').boundingBox();
      const descriptionBox = await firstRow.locator('p').boundingBox();
      if (locale === 'fa') {
        assert.ok(columnBox.x < titleBox.x && columnBox.x > descriptionBox.x + descriptionBox.width, 'RTL table rule belongs between title and description');
      } else {
        assert.ok(columnBox.x > titleBox.x + titleBox.width && columnBox.x < descriptionBox.x, 'LTR table rule belongs between title and description');
      }
      for (const column of await linePage.locator('#portfolio [data-column-rule]').all()) {
        const box = await column.boundingBox();
        assert.ok(box.height > 300 && box.width === 1, 'Portfolio divider must span the full company column');
      }
      await sectorColumn.locator('[data-draw-line] > span').evaluate(ink => Promise.all(ink.getAnimations().map(animation => animation.finished)));
      await linePage.locator('#sectors').screenshot({ path: `test-results/${locale}-${width}-vertical-sectors.png` });
    } else {
      const rail = linePage.locator('main > div:has(> #approach) > [data-column-rule]');
      const railBox = await rail.boundingBox();
      assert.ok(railBox.height > 1500 && railBox.width === 1, 'Stacked phone sections should keep a continuous vertical gutter rail');
      assert.ok(locale === 'fa' ? railBox.x > width - 24 : railBox.x < 24, 'Phone rail must stay in the gutter, away from copy');
    }
    await linePage.locator('#about').scrollIntoViewIfNeeded();
    const aboutColumn = linePage.locator('#about [data-column-rule]:visible');
    assert.equal(await aboutColumn.count(), 1);
    assert.ok((await aboutColumn.boundingBox()).height >= 430, 'About divider must span the section height');
    await linePage.waitForFunction(() => [...document.querySelectorAll('#about [data-column-rule]')].filter(column => column.getBoundingClientRect().width > 0).every(column => column.querySelector('[data-draw-line]').getAttribute('data-line-state') === 'drawn'));
    await aboutColumn.locator('[data-draw-line] > span').evaluate(ink => Promise.all(ink.getAnimations().map(animation => animation.finished)));
    await linePage.locator('#about').screenshot({ path: `test-results/${locale}-${width}-vertical-about.png` });
    await linePage.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await rule.scrollIntoViewIfNeeded();
    const finished = await rule.locator('span').evaluate(ink => ({ scale: new DOMMatrixReadOnly(getComputedStyle(ink).transform).a, start: ink.getAnimations()[0].startTime, state: ink.getAnimations()[0].playState }));
    assert.equal(finished.scale, 1);
    assert.equal(finished.start, partial.start, 'Returning to a section must not replay or erase its lines');
    assert.equal(finished.state, 'finished');
  }
  await linePage.emulateMedia({ reducedMotion: 'reduce' });
  await linePage.waitForFunction(() => [...document.querySelectorAll('[data-draw-line], [data-draw-art]')].every(line => line.getAttribute('data-line-state') === 'complete'));
  assert.equal(await linePage.locator('[data-draw-line] > span').first().evaluate(ink => getComputedStyle(ink).animationName), 'none');
  await linePage.emulateMedia({ reducedMotion: 'no-preference' });
  assert.equal(await linePage.locator('[data-line-state="pending"]').count(), 0, 'Changing preferences must leave rules complete');
  await lineContext.close();
  console.log('PASS scroll-entry rules, tall grid dividers and mobile rails, SVG drawing, 1.5s/2s timing, stable layout, one-time playback, and reduced-motion changes');

  for (const locale of ["fa", "en"]) {
    const route = locale === "fa" ? "/" : "/en";
    for (const width of [360, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      const response = await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator("html").getAttribute("lang"), locale);
      assert.equal(await page.locator("html").getAttribute("dir"), locale === "fa" ? "rtl" : "ltr");
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(await page.locator("main section").count(), 6);
      assert.equal(await page.locator("#sectors article").count(), 5);
      assert.equal(await page.locator("#portfolio a[data-company]").count(), 3);
      for (const [company, domain] of [["wishwork", "wishwork.org"], ["spash", "spash.space"], ["iranchina", "www.iranchina.org"]]) {
        const link = page.locator(`#portfolio a[data-company="${company}"]`);
        assert.equal(await link.getAttribute("href"), `${locale === 'en' ? '/en' : ''}/portfolio/${company}`);
        assert.equal(await link.getAttribute("target"), null);
        const logo = link.locator("img");
        await logo.scrollIntoViewIfNeeded();
        await logo.evaluate(image => image.decode());
        assert.ok(await logo.evaluate(image => image.naturalWidth > 0 && image.src.startsWith(location.origin)));
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${locale}/${width}`);
      assert.ok(await page.evaluate(() => document.fonts.check('500 16px "' + getComputedStyle(document.body).fontFamily.split(',')[0].replaceAll('"', '').trim() + '"')));
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), `https://shirani.co${locale === "fa" ? "" : "/en"}`);
      assert.equal(await page.locator('link[rel="alternate"][hreflang="fa"]').getAttribute("href"), "https://shirani.co");
      assert.equal(await page.locator('link[rel="alternate"][hreflang="en"]').getAttribute("href"), "https://shirani.co/en");
      assert.equal(await page.locator("#contact a").getAttribute("href"), "mailto:contact@shirani.co");
      assert.equal(await page.getByText('کشف کنید', { exact: true }).count(), 0);
      assert.equal(await page.locator('[src*="design/"], [href*="design/"]').count(), 0);
      const toggle = page.locator('button[aria-controls="main-navigation"]');
      if (width <= 1000) {
        assert.equal(await page.locator("#main-navigation").isVisible(), false);
        await toggle.click();
        assert.equal(await toggle.getAttribute("aria-expanded"), "true");
        await page.keyboard.press("Escape");
        assert.equal(await toggle.getAttribute("aria-expanded"), "false");
        assert.equal(await toggle.evaluate((element) => element === document.activeElement), true);
        await toggle.click();
        await page.locator('#main-navigation a[href="#sectors"]').click();
        assert.equal(await toggle.getAttribute("aria-expanded"), "false");
        assert.equal(new URL(page.url()).hash, "#sectors");
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      } else {
        assert.equal(await page.locator("#main-navigation").isVisible(), true);
      }
      await page.waitForFunction(() => ["scene","fallback"].includes(document.querySelector("[data-motion-art]")?.getAttribute("data-status")), undefined, {timeout:20000});
      assert.equal(await page.locator("[data-motion-art]").getAttribute("data-status"), "scene", "The normal browser should render the real 3D scene");
      await page.waitForFunction(() => document.querySelector("[data-motion-art]")?.getAttribute("data-phase") === "settled", undefined, {timeout:20000});
      await page.screenshot({ path: `test-results/${locale}-${width}.png`, fullPage: true, animations: "disabled" });
      if (width !== 768) await page.screenshot({ path: `test-results/${locale}-${width}-hero.png`, animations: "disabled" });
      console.log(`PASS ${route} at ${width}px: layout, language, metadata, navigation, portfolio logos and links, contact`);
    }
  }
  const profileContext = await browser.newContext({ reducedMotion: 'reduce' });
  const profilePage = await profileContext.newPage();
  profilePage.on('pageerror', error => errors.push(error.message));
  for (const locale of ['fa', 'en']) for (const [id, domain] of [['wishwork', 'wishwork.org'], ['spash', 'spash.space'], ['iranchina', 'www.iranchina.org']]) {
    const profilePath = `${locale === 'en' ? '/en' : ''}/portfolio/${id}`;
    for (const width of [360, 768, 1440]) {
      await profilePage.setViewportSize({ width, height: 900 });
      const response = await profilePage.goto(`${base}${profilePath}`, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      await profilePage.evaluate(() => document.fonts.ready);
      assert.equal(await profilePage.locator('html').getAttribute('lang'), locale);
      assert.equal(await profilePage.locator('html').getAttribute('dir'), locale === 'fa' ? 'rtl' : 'ltr');
      assert.equal(await profilePage.locator('h1').count(), 1);
      assert.ok(await profilePage.locator('h1').innerText());
      assert.equal(await profilePage.locator('main article').count(), 3);
      assert.equal(await profilePage.locator('#backing h2').innerText(), locale === 'fa' ? 'چرا همراه شدیم' : 'Why we backed them');
      assert.equal(await profilePage.locator('#backing h3').count(), 2);
      assert.ok((await profilePage.locator('#backing').innerText()).includes(locale === 'fa' ? 'ارزش' : 'value'));
      assert.ok(await profilePage.locator('#backing p').evaluateAll(paragraphs => paragraphs.every(paragraph => paragraph.textContent.trim().length > 50)), 'Each business needs a complete investment rationale');
      assert.equal(await profilePage.locator('canvas').count(), 0, 'Company profiles should not load the hero scene');
      assert.ok(await profilePage.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Profile overflow: ${profilePath}/${width}`);
      assert.equal(await profilePage.locator('link[rel="canonical"]').getAttribute('href'), `https://shirani.co${profilePath}`);
      assert.equal(await profilePage.locator('link[rel="alternate"][hreflang="fa"]').getAttribute('href'), `https://shirani.co/portfolio/${id}`);
      assert.equal(await profilePage.locator('link[rel="alternate"][hreflang="en"]').getAttribute('href'), `https://shirani.co/en/portfolio/${id}`);
      assert.ok((await profilePage.title()).includes(await profilePage.locator('h1').innerText()));
      const website = profilePage.locator('[data-company-website]');
      assert.equal(await website.getAttribute('href'), `https://${domain}`);
      assert.equal(await website.getAttribute('target'), '_blank');
      assert.ok((await website.getAttribute('rel')).includes('noopener'));
      const image = profilePage.locator('main img');
      await image.evaluate(image => image.decode());
      assert.ok(await image.evaluate(image => image.naturalWidth > 0 && image.src.startsWith(location.origin)));
      assert.equal(await profilePage.locator('header nav a[href$="#portfolio"]').getAttribute('href'), `${locale === 'fa' ? '/' : '/en'}#portfolio`);
      await profilePage.screenshot({ path: `test-results/${locale}-${id}-${width}-profile.png`, fullPage: true });
    }
    const otherPath = `${locale === 'fa' ? '/en' : ''}/portfolio/${id}`;
    await profilePage.locator('header a[hreflang]').click();
    await profilePage.waitForURL(`${base}${otherPath}`);
    assert.equal(await profilePage.locator('html').getAttribute('lang'), locale === 'fa' ? 'en' : 'fa');
  }
  await profilePage.setViewportSize({ width: 360, height: 900 });
  await profilePage.goto(base, { waitUntil: 'networkidle' });
  await profilePage.locator('#portfolio [data-company="wishwork"]').click();
  await profilePage.waitForURL(`${base}/portfolio/wishwork`);
  await profilePage.locator('button[aria-controls="main-navigation"]').click();
  await profilePage.locator('header nav a[href="/#portfolio"]').click();
  await profilePage.waitForURL(`${base}/#portfolio`);
  assert.equal(await profilePage.locator('#portfolio').isVisible(), true);
  for (const prefix of ['', '/en']) assert.equal((await fetch(`${base}${prefix}/portfolio/unknown`)).status, 404);
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  for (const id of ['wishwork', 'spash', 'iranchina']) for (const prefix of ['', '/en']) assert.ok(sitemap.includes(`https://shirani.co${prefix}/portfolio/${id}`));
  await profileContext.close();
  console.log('PASS six static portfolio profiles at three widths: investment rationale, local logos, internal card navigation, official websites, same-company language switching, metadata, sitemap and 404s');

  await page.goto(base);
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("href")), "#main");
  await page.keyboard.press("Enter");
  assert.equal(new URL(page.url()).hash, "#main");
  await page.locator('header a[hreflang="en"]').click();
  await page.waitForURL(`${base}/en`);
  assert.equal(await page.locator("html").getAttribute("dir"), "ltr");
  await page.locator('header a[hreflang="fa"]').click();
  await page.waitForURL(`${base}/`);
  assert.equal(await page.locator("html").getAttribute("dir"), "rtl");
  const artwork = page.locator("[data-motion-art]");
  const replay = page.locator('button[aria-controls="arch-sculpture"]');
  await page.waitForFunction(() => Number(document.querySelector("[data-motion-art]")?.getAttribute("data-elapsed")) > 500);
  await page.locator("#portfolio").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector("[data-motion-art]")?.getAttribute("data-running") === "false");
  const paused = await artwork.getAttribute("data-elapsed");
  await page.waitForTimeout(300);
  assert.equal(await artwork.getAttribute("data-elapsed"), paused, "Offscreen time must not advance the opening");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForFunction(() => document.querySelector("[data-motion-art]")?.getAttribute("data-running") === "true");
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', {value:true,configurable:true}); document.dispatchEvent(new Event('visibilitychange')); });
  const hiddenTime = await artwork.getAttribute("data-elapsed");
  await page.waitForTimeout(250);
  assert.equal(await artwork.getAttribute("data-elapsed"), hiddenTime, "Hidden-tab time must not advance the opening");
  await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
  await page.waitForFunction(() => document.querySelector("[data-motion-art]")?.getAttribute("data-phase") === "settled", undefined, {timeout:20000});
  assert.equal(await artwork.getAttribute("data-running"), "false");
  assert.equal(await artwork.getAttribute("data-elapsed"), "4600");
  const beforePointer = await artwork.screenshot();
  const bounds = await artwork.boundingBox();
  await page.mouse.move(bounds.x + bounds.width * .3, bounds.y + bounds.height * .3);
  await page.waitForTimeout(350);
  assert.ok(beforePointer.equals(await artwork.screenshot()), "The settled arch must remain pixel-identical after pointer movement");
  const headerBeforeReplay = await page.locator('header').screenshot();
  await replay.click();
  assert.ok(Number(await artwork.getAttribute("data-elapsed")) < 800, "Replay must restart the drawing");
  assert.equal(await replay.isVisible(), false);
  assert.ok(headerBeforeReplay.equals(await page.locator('header').screenshot()), "Arch replay must not repeat the header animation");
  await page.waitForFunction(() => document.querySelector("[data-motion-art]")?.getAttribute("data-phase") === "settled", undefined, {timeout:20000});
  assert.equal(await replay.isVisible(), true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForFunction(() => {
    const root = document.querySelector('[data-motion-art]');
    const poster = root?.querySelector('img');
    return root?.getAttribute('data-status') === 'fallback' && poster && getComputedStyle(poster).opacity === '1';
  });
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), "auto");
  assert.equal(await artwork.getAttribute("data-running"), "false");
  assert.equal(await replay.isVisible(), false);
  assert.equal(await artwork.locator('img').first().evaluate(image=>getComputedStyle(image).opacity), "1");

  const reducedContext = await browser.newContext({reducedMotion:"reduce"});
  await reducedContext.addInitScript(() => {
    window.webglCalls=0;
    const original=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(type,...args){ if(type==='webgl2')window.webglCalls++;return original.call(this,type,...args); };
  });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(base, {waitUntil:"networkidle"});
  await reducedPage.waitForFunction(()=>document.querySelector('[data-motion-art]')?.getAttribute('data-status')==='fallback');
  assert.equal(await reducedPage.evaluate(()=>window.webglCalls),0,"Reduced-motion visitors should not initialize WebGL");
  assert.equal(await reducedPage.locator('header').evaluate(header=>getComputedStyle(header,'::after').transform),'none');
  assert.equal(await reducedPage.locator('header').evaluate(header=>getComputedStyle(header,'::after').animationName),'none');
  assert.equal(await reducedPage.locator('header').evaluate(header=>getComputedStyle(header,'::before').opacity),'0');
  assert.equal(await reducedPage.locator('[data-line-state="pending"]').count(),0);
  assert.equal(await reducedPage.locator('[data-draw-line] > span').first().evaluate(ink=>getComputedStyle(ink).animationName),'none');
  await reducedContext.close();

  const blocked = await browser.newContext();
  await blocked.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(type,...args){ if(type==='webgl2')return null;return original.call(this,type,...args); };
  });
  const blockedPage=await blocked.newPage();
  await blockedPage.goto(base,{waitUntil:"networkidle"});
  await blockedPage.waitForFunction(()=>document.querySelector('[data-motion-art]')?.getAttribute('data-status')==='fallback');
  assert.ok(await blockedPage.locator('[data-motion-art] img').first().evaluate(image=>image.complete&&image.naturalWidth===1024&&getComputedStyle(image).opacity==='1'));
  await blocked.close();

  const noScript=await browser.newContext({javaScriptEnabled:false});
  const noScriptPage=await noScript.newPage();
  await noScriptPage.goto(base,{waitUntil:"networkidle"});
  const still=noScriptPage.locator('noscript img');
  assert.ok(await still.isVisible());
  assert.ok(await still.evaluate(image=>image.complete&&image.naturalWidth===1024));
  assert.equal(await noScriptPage.locator('header').evaluate(header=>getComputedStyle(header,'::after').transform),'none');
  assert.equal(await noScriptPage.locator('header').evaluate(header=>getComputedStyle(header,'::after').animationName),'none');
  assert.equal(await noScriptPage.locator('header').evaluate(header=>getComputedStyle(header,'::before').opacity),'0');
  assert.equal(await noScriptPage.locator('[data-draw-line] > span').first().evaluate(ink=>getComputedStyle(ink).transform),'none');
  assert.equal(await noScriptPage.locator('[data-draw-art] path').first().evaluate(path=>getComputedStyle(path).strokeDasharray),'none');
  await noScript.close();
  console.log("PASS timed reveal, offscreen/hidden-tab suspension, still final pose, replay, reduced motion, unavailable WebGL and no-JS fallback");
  assert.deepEqual(errors, [], "Browser runtime errors");
  assert.deepEqual(failedAssets, [], "Failed assets");
  for (const path of ["/robots.txt", "/sitemap.xml", "/brand/og-fa.png", "/brand/og-en.png", "/brand/apple-touch-icon.png", "/brand/arch-still.png", "/icon.svg", "/portfolio/wishwork.svg", "/portfolio/spash.svg", "/portfolio/iranchina.svg"]) {
    assert.equal((await fetch(`${base}${path}`)).status, 200, path);
  }
  assert.equal((await fetch(`${base}/design/proposals/proposal.html`)).status, 404);
  console.log("PASS keyboard access, two-way language switching, reduced motion, social assets, and private design archive");
  if (existsSync("design/proposals/proposal.html")) {
    const proposal = await context.newPage();
    await proposal.goto(pathToFileURL(resolve("design/proposals/proposal.html")).href);
    await proposal.evaluate(() => document.fonts.ready);
    assert.ok(await proposal.evaluate(() => document.fonts.status === "loaded" && [...document.images].every((image) => image.complete && image.naturalWidth > 0 && image.src.startsWith("data:"))));
    await proposal.emulateMedia({ media: "print" });
    assert.equal(await proposal.locator(".page").count(), 3);
    assert.ok(await proposal.locator(".page").evaluateAll((pages) => pages.every((page) => page.scrollHeight <= page.clientHeight + 1)), "Archived proposal overflows its A4 pages");
    const printed = await proposal.pdf({ preferCSSPageSize: true, printBackground: true });
    assert.equal((printed.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length, 3);
    const originalPdf = readFileSync("design/proposals/proposal.pdf");
    assert.equal((originalPdf.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length, 3);
    await proposal.close();
    console.log("PASS archived proposal: embedded fonts and logo, three printable A4 pages, original PDF preserved");
  }
} finally {
  await browser?.close();
  server?.kill();
}
