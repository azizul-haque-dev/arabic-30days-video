#!/usr/bin/env node
/**
 * QA helper: bundles once and renders PNG stills (NOT a video) at the given frames.
 *   node scripts/qa-stills.mjs 30 300 1080            -> out/qa/frame-XXXX.png
 * Env: BROWSER_EXECUTABLE=/path/to/chromium (optional)
 */
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const frames = process.argv.slice(2).map(Number).filter((n) => !Number.isNaN(n));
const browserExecutable = process.env.BROWSER_EXECUTABLE || undefined;
const out = path.join(root, "out", "qa");
fs.mkdirSync(out, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.join(root, "src", "index.ts") });
const composition = await selectComposition({ serveUrl, id: "Day20", browserExecutable });
console.log(`Composition ${composition.width}x${composition.height} @${composition.fps}fps, ${composition.durationInFrames} frames`);
for (const frame of frames) {
  const output = path.join(out, `frame-${String(frame).padStart(4, "0")}.png`);
  await renderStill({ composition, serveUrl, frame, output, browserExecutable, overwrite: true });
  console.log("✔", output);
}
