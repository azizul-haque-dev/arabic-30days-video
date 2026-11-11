import { Config } from "@remotion/cli/config";
import { existsSync } from "node:fs";

// Render settings only (nothing here triggers a render).
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(null);

const findBrowser = (): string | undefined => {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  if (process.platform === "win32") {
    for (const p of [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
      "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    ]) {
      if (existsSync(p)) return p;
    }
  }
  return undefined;
};

const browser = findBrowser();
if (browser) {
  Config.setBrowserExecutable(browser);
}
