/**
 * Dev helper: renders single PNG stills (NOT a video) for visual review.
 * Usage: npx tsx scripts/stills.ts 0 330 870 ...   (frame numbers) -> out/still_<frame>.png
 * Set CHROMIUM_PATH to a Chromium/headless-shell binary if Remotion cannot download its own.
 */
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { readFileSync } from "node:fs";
import path from "node:path";
import { parseSrt } from "../src/utils/srt";
import { episodeConfig as cfg } from "../src/config/episodeConfig";

(async () => {
  const frames = process.argv.slice(2).map(Number).filter((n) => !Number.isNaN(n));
  const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
  const cues = parseSrt(readFileSync(`public/${cfg.srtFile}`, "utf8"));
  const browserExecutable = process.env.CHROMIUM_PATH || null;
  const composition = await selectComposition({ serveUrl, id: "ArabicMasterDay14", inputProps: { cues }, browserExecutable });
  for (const frame of frames) {
    const output = `out/still_${frame}.png`;
    await renderStill({ composition, serveUrl, frame, output, inputProps: { cues }, browserExecutable, imageFormat: "png", overwrite: true });
    console.log("wrote", output);
  }
})();
