import { readFileSync } from "node:fs";
import { launchBrowser } from "./browser.mjs";

const browser = await launchBrowser();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const font = readFileSync("src/assets/fonts/PeydaWeb-Medium.woff2").toString("base64");
  const wordmark = readFileSync("public/brand/wordmark.svg", "utf8");
  const arch = readFileSync("public/brand/arch.svg", "utf8");
  for (const locale of ["fa", "en"]) {
    const title = locale === "fa" ? "سرمایه برای ساختن<br>ارزش ماندگار." : "Capital for<br>enduring value.";
    await page.setContent(`<!doctype html><html lang="${locale}" dir="${locale === "fa" ? "rtl" : "ltr"}"><head><meta charset="utf-8"><style>
      @font-face{font-family:Peyda;src:url(data:font/woff2;base64,${font});font-weight:500}
      *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#151c19;color:#f5f4f0;font-family:Peyda;overflow:hidden;position:relative;padding:64px 80px;display:flex;flex-direction:column;justify-content:space-between}
      body:before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 80% 70%,#00a69318,transparent 65%)}
      header,main,footer{position:relative;z-index:1}header svg{width:265px;height:42px}main{font-size:${locale === "fa" ? 72 : 76}px;line-height:1.35;font-weight:500;letter-spacing:-1px}main span{color:#00a693}footer{display:flex;justify-content:space-between;align-items:center;font-size:15px;color:#a6b6a8;border-top:1px solid #ffffff20;padding-top:24px}footer span:last-child{letter-spacing:3px;font-size:12px}
      .arch{position:absolute;inset-inline-end:90px;top:110px;width:300px;height:390px;color:#729b7f;opacity:.6}.arch svg{width:100%;height:100%}.disc{position:absolute;inset-inline-end:30px;top:63px;width:430px;height:430px;border:1px solid #ffffff0c;border-radius:50%}
      </style></head><body><header>${wordmark}</header><div class="disc"></div><div class="arch">${arch}</div><main>${title}</main><footer><span dir="ltr">SHIRANI.CO</span><span dir="ltr">INVEST / BUILD / OWN</span></footer></body></html>`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `public/brand/og-${locale}.png` });
  }
  await page.setViewportSize({ width: 180, height: 180 });
  const icon = readFileSync("public/icon.svg", "utf8");
  await page.setContent(`<html><body style="margin:0;background:#151c19">${icon.replace('<svg ', '<svg width="180" height="180" ')}</body></html>`);
  await page.screenshot({ path: "public/brand/apple-touch-icon.png" });
  console.log("Generated Persian and English social previews and Apple touch icon.");
} finally {
  await browser.close();
}
