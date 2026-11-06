/**
 * QA helper: renders PNG stills at given seconds (NOT a video render).
 *   npx tsx scripts/stills.ts out/stills 0 1.5 25 ...
 * Env: REMOTION_BROWSER_EXECUTABLE=/path/to/chrome-headless-shell
 */
import path from "node:path";
import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const root = path.resolve(__dirname, "..");
const cfg = JSON.parse(fs.readFileSync(path.join(root, "config/video.config.json"), "utf8"));

const main = async () => {
  const [outDir = "out/stills", ...secs] = process.argv.slice(2);
  fs.mkdirSync(outDir, { recursive: true });
  const serveUrl = await bundle({ entryPoint: path.join(root, cfg.entryPoint) });
  const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || null;
  const composition = await selectComposition({ serveUrl, id: cfg.compositionId, browserExecutable });
  for (const s of secs) {
    const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(s) * cfg.fps));
    const output = path.join(outDir, `t${String(s).replace(".", "_")}.png`);
    await renderStill({ composition, serveUrl, output, frame, browserExecutable });
    console.log("still", s, "s -> frame", frame, output);
  }
};
main().catch((e) => { console.error(e); process.exit(1); });
