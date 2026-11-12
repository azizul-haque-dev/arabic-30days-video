/**
 * QA helper: renders PNG stills (NOT video) of chosen frames so you can eyeball layout.
 *   npm run stills -- day-17 100,950,1700
 * Stills are written to out/stills/. Works without audio (draft timing) because it passes allowDraft.
 */
import { mkdirSync } from "node:fs";
import path from "node:path";
import { renderStill } from "@remotion/renderer";
import { prepare } from "./lib/render-env";

const [episode = "day-17", frames = "0"] = process.argv.slice(2);
const main = async () => {
  const props = { allowDraft: true, layoutMode: "collect" };
  const env = await prepare(episode, props);
  const outDir = path.resolve(__dirname, "../out/stills");
  mkdirSync(outDir, { recursive: true });
  for (const f of frames.split(",").map(Number)) {
    const output = path.join(outDir, `${episode}-f${String(f).padStart(5, "0")}.png`);
    await renderStill({ composition: env.composition, serveUrl: env.serveUrl, frame: f, output, inputProps: props, puppeteerInstance: env.browser, logLevel: "error", overwrite: true, onBrowserLog: (l) => { if (l.text.includes("LAYOUT_VIOLATION")) console.log(`  [f${f}] ${l.text}`); } });
    console.log(`wrote ${output}`);
  }
  await env.browser.close({ silent: true });
};
main().catch((e) => { console.error(e); process.exit(1); });
