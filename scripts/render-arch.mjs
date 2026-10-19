import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, sep } from "node:path";
import { stripTypeScriptTypes } from "node:module";
import { launchBrowser } from "./browser.mjs";

// Render the actual scene source, keeping the no-JS/reduced-motion still in sync.
const vendorRoot = resolve("node_modules/three");
const imports = JSON.stringify({ imports: { three: "/vendor/build/three.module.js", "three/addons/": "/vendor/examples/jsm/" } });
const html = `<!doctype html><html><head><style>*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;background:transparent}canvas{display:block;width:100%;height:100%}</style><script type="importmap">${imports}</script></head><body><canvas></canvas><script type="module">
import {createArchScene} from '/arch-scene';
const canvas=document.querySelector('canvas');
window.archScene=createArchScene(canvas,1);
await window.archScene.ready;
window.archScene.resize(innerWidth,innerHeight);
window.archScene.renderAt(4600);
window.archReady=true;
window.recordArch=async()=>{
  const output=document.createElement('canvas');output.width=720;output.height=720;
  const brush=output.getContext('2d');
  const stream=output.captureStream(30);
  const type=MediaRecorder.isTypeSupported('video/webm;codecs=vp9')?'video/webm;codecs=vp9':'video/webm';
  const recorder=new MediaRecorder(stream,{mimeType:type,videoBitsPerSecond:3500000});
  const chunks=[];recorder.ondataavailable=event=>{if(event.data.size)chunks.push(event.data);};
  const complete=new Promise(resolve=>{recorder.onstop=()=>{
    stream.getTracks().forEach(track=>track.stop());
    const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(new Blob(chunks,{type}));
  };});
  window.archScene.renderAt(0);brush.fillStyle='#151c19';brush.fillRect(0,0,720,720);brush.drawImage(canvas,0,0,720,720);
  recorder.start();const start=performance.now();
  await new Promise(resolve=>{function frame(now){const elapsed=now-start;
    window.archScene.renderAt(Math.min(elapsed,4600));
    brush.fillStyle='#151c19';brush.fillRect(0,0,720,720);brush.drawImage(canvas,0,0,720,720);
    if(elapsed<5300)requestAnimationFrame(frame);else resolve();
  }requestAnimationFrame(frame);});
  recorder.stop();return complete;
};
</script></body></html>`;

const server = createServer((request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  if (pathname === "/") { response.setHeader("content-type", "text/html"); response.end(html); return; }
  if (pathname === "/arch-scene" || pathname === "/arch-model") {
    const source = readFileSync(`src/lib${pathname}.ts`, "utf8");
    response.setHeader("content-type", "text/javascript");
    response.end(stripTypeScriptTypes(source));
    return;
  }
  if (pathname.startsWith("/vendor/")) {
    const file = resolve(vendorRoot, pathname.slice(8));
    if (file.startsWith(vendorRoot + sep) && existsSync(file)) { response.setHeader("content-type", "text/javascript"); response.end(readFileSync(file)); return; }
  }
  response.writeHead(404); response.end();
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const browser = await launchBrowser();
try {
  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });
  page.on("pageerror", error => console.error(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.waitForFunction(() => window.archReady === true, { timeout: 30000 });
  mkdirSync("public/brand", { recursive: true });
  const png = await page.evaluate(() => { window.archScene.renderAt(4600); return document.querySelector("canvas").toDataURL("image/png").split(",")[1]; });
  writeFileSync("public/brand/arch-still.png", Buffer.from(png, "base64"));
  mkdirSync("design/motion", { recursive: true });
  await page.setViewportSize({ width: 720, height: 720 });
  await page.evaluate(() => window.archScene.resize(720, 720));
  await page.addStyleTag({ content: "html,body{background:#151c19}" });
  for (const [name, time] of [["01-drawing", 800], ["02-diagram", 2350], ["03-reveal", 2920], ["04-settled", 4600]]) {
    await page.evaluate(time => window.archScene.renderAt(time), time);
    await page.screenshot({ path: `design/motion/${name}.png` });
  }
  const recording = await page.evaluate(() => window.recordArch());
  writeFileSync("design/motion/arch-opening.webm", Buffer.from(recording, "base64"));
  const font = readFileSync("src/assets/fonts/PeydaWeb-Regular.woff2").toString("base64");
  const frames = [["01-drawing", "۰٫۸ ثانیه · رسم خطوط"], ["02-diagram", "۲٫۳۵ ثانیه · مکث هندسی"], ["03-reveal", "۲٫۹۲ ثانیه · آشکارشدن عمق"], ["04-settled", "۴٫۶ ثانیه · حالت نهایی"]];
  writeFileSync("design/motion/index.html", `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SHIRANI — پیش‌نمایش حرکت</title><style>
  @font-face{font-family:Peyda;src:url(data:font/woff2;base64,${font})}*{box-sizing:border-box}body{margin:0;padding:40px 24px;background:#f5f4f0;color:#202624;font-family:Peyda,Tahoma,sans-serif}main{max-width:1050px;margin:auto}header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #d6d9d2;padding-bottom:20px}header b{font-family:Arial,sans-serif;font-weight:400;letter-spacing:7px}h1{font-size:28px;font-weight:400;margin:30px 0 10px}p{color:#666e68;font-size:15px;line-height:2}video{display:block;width:100%;max-height:650px;background:#151c19;margin-block:28px}.frames{display:grid;grid-template-columns:1fr 1fr;gap:24px}figure{margin:0}figure img{display:block;width:100%}figcaption{font-size:13px;padding-block:12px;color:#666e68}@media(max-width:600px){.frames{grid-template-columns:1fr}body{padding:24px 16px}h1{font-size:23px}}
  </style></head><body><main><header><b dir="ltr">SHIRANI</b><span>مطالعه حرکت</span></header><h1>از هندسه انتزاعی تا قوس سه‌بعدی</h1><p>رسم خطوط، یک مکث کوتاه، آشکارشدن عمق و سپس سکون کامل. توالی آغازین ۴٫۶ ثانیه است؛ ویدیو حالت نهایی را نیز برای لحظه‌ای نگه می‌دارد.</p><video src="arch-opening.webm" controls autoplay muted playsinline></video><div class="frames">${frames.map(([name,label])=>`<figure><img src="${name}.png" alt="${label}"><figcaption>${label}</figcaption></figure>`).join('')}</div></main></body></html>`);
  console.log("Rendered the production fallback, four storyboard stills, an opening recording, and design/motion/index.html.");
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
