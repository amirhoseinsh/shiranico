import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { chromium } from "playwright-core";

export async function launchBrowser() {
  const roots = [
    process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, "ms-playwright"),
    join(homedir(), ".cache", "ms-playwright"),
    join(homedir(), "Library", "Caches", "ms-playwright"),
  ].filter(Boolean);
  const candidates = [process.env.CHROME_PATH, chromium.executablePath()];
  for (const root of roots) {
    if (!existsSync(root)) continue;
    for (const directory of readdirSync(root).filter((name) => name.startsWith("chromium-")).sort().reverse()) {
      candidates.push(
        join(root, directory, "chrome-win64", "chrome.exe"),
        join(root, directory, "chrome-win", "chrome.exe"),
        join(root, directory, "chrome-linux64", "chrome"),
        join(root, directory, "chrome-linux", "chrome"),
        join(root, directory, "chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium"),
      );
    }
  }
  candidates.push(
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  );
  const executablePath = candidates.find((candidate) => candidate && existsSync(candidate));
  if (!executablePath) throw new Error("No Chromium browser found. Set CHROME_PATH or run: npx playwright-core install chromium");
  return chromium.launch({ executablePath, headless: true });
}
