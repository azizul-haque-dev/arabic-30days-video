import path from "node:path";
import { bundle } from "@remotion/bundler";
import { openBrowser, selectComposition } from "@remotion/renderer";
import type { HeadlessBrowser } from "@remotion/renderer";

const ROOT = path.resolve(__dirname, "../..");

/** Bundles the project once and opens one headless browser shared by every frame we render. */
export const prepare = async (compositionId: string, inputProps: Record<string, unknown>) => {
  const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? null;
  const serveUrl = await bundle({ entryPoint: path.join(ROOT, "src/index.ts"), onProgress: () => undefined });
  const browser: HeadlessBrowser = await openBrowser("chrome", { browserExecutable, chromiumOptions: {}, logLevel: "error" });
  const composition = await selectComposition({ serveUrl, id: compositionId, inputProps, puppeteerInstance: browser, logLevel: "error" });
  return { serveUrl, browser, composition, browserExecutable, inputProps };
};
