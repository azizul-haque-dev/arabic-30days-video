/**
 * Render script — produces out/day-13.mp4 (H.264, 1080×1920, 30fps, 9:16).
 *
 * Usage:
 *   npx tsx scripts/render.ts                        # default: out/day-13.mp4
 *   npx tsx scripts/render.ts --out=out/custom.mp4   # custom output path
 *   npx tsx scripts/render.ts --concurrency=4        # parallel frames (default: CPU cores)
 *
 * Prerequisites already in this project (no extra installs needed):
 *   @remotion/cli, @remotion/renderer, remotion  — all at 4.0.541
 *   public/voiceover.wav                          — the narration (133.80 s)
 *   audio.enabled = true in src/config/episode.ts — set by the sync step
 */

import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";

const root = resolve(__dirname, "..");

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

const browserExecutable = findBrowser();

// --- CLI args ----------------------------------------------------------
const outArg = process.argv.find((a) => a.startsWith("--out="));
const outFile = outArg ? outArg.split("=")[1] : resolve(root, "out", "day-13.mp4");

const concArg = process.argv.find((a) => a.startsWith("--concurrency="));
const concurrency = concArg ? Number(concArg.split("=")[1]) : null; // null = auto (CPU cores)

const framesArg = process.argv.find((a) => a.startsWith("--frames="));
const frameRange = framesArg
  ? (framesArg.split("=")[1].split("-").map(Number) as [number, number])
  : undefined;

// --- Ensure output directory exists -----------------------------------
mkdirSync(dirname(outFile), { recursive: true });

// --- Render -----------------------------------------------------------
(async () => {
  console.log("📦  Bundling composition…");
  const serveUrl = await bundle({
    entryPoint: resolve(root, "src/index.ts"),
    webpackOverride: (config) => config,
  });

  console.log("🎬  Selecting composition ArabicMasterComposition…");
  const composition = await selectComposition({
    serveUrl,
    id: "ArabicMasterComposition",
    browserExecutable,
  });

  console.log(`🖥   Duration: ${composition.durationInFrames} frames (${(composition.durationInFrames / composition.fps).toFixed(2)} s)`);
  console.log(`📁  Output  : ${outFile}`);
  console.log("🚀  Rendering… (this takes a few minutes)\n");

  const startMs = Date.now();
  let lastPct = -1;

  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation: outFile,
    browserExecutable,
    frameRange,
    concurrency: concurrency ?? undefined,
    // Audio: Remotion picks up the <Audio> tag from the composition automatically.
    onProgress: ({ renderedFrames, encodedFrames, stitchStage }) => {
      const pct = Math.floor((renderedFrames / composition.durationInFrames) * 100);
      if (pct !== lastPct) {
        lastPct = pct;
        const elapsed = ((Date.now() - startMs) / 1000).toFixed(0);
        process.stdout.write(
          `\r  rendered ${renderedFrames}/${composition.durationInFrames} frames  [${pct}%]  encoded ${encodedFrames}  stage=${stitchStage}  ${elapsed}s elapsed   `,
        );
      }
    },
  });

  const totalSec = ((Date.now() - startMs) / 1000).toFixed(1);
  console.log(`\n\n✅  Done in ${totalSec} s`);
  console.log(`📼  Video saved to: ${outFile}`);
})().catch((err) => {
  console.error("\n❌ Render failed:", err);
  process.exit(1);
});
