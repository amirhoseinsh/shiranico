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
        assert.equal(await link.getAttribute("href"), `https://${domain}`);
        assert.equal(await link.getAttribute("target"), "_blank");
        assert.ok((await link.getAttribute("rel")).includes("noopener"));
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
  await replay.click();
  assert.ok(Number(await artwork.getAttribute("data-elapsed")) < 800, "Replay must restart the drawing");
  assert.equal(await replay.isVisible(), false);
  await page.waitForFunction(() => document.querySelector("[data-motion-art]")?.getAttribute("data-phase") === "settled", undefined, {timeout:20000});
  assert.equal(await replay.isVisible(), true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForFunction(() => document.querySelector("[data-motion-art]")?.getAttribute("data-status") === "fallback");
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
