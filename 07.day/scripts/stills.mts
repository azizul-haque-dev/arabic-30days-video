// Verification helper: renders still frames of the key moments (does NOT render the MP4).
// Usage: npx tsx scripts/stills.mts [outDir]
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { SCENES } from "../src/timeline";

const out = process.argv[2] ?? "/tmp/stills";
const browserExecutable = process.env.BROWSER_EXE || undefined;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const comp = await selectComposition({ serveUrl, id: "Main", browserExecutable });
const frames: [string, number][] = [];
for (const s of SCENES) {
  const usable = s.dur - 12;
  frames.push([`${s.id}_a`, s.from + Math.round(usable * 0.4)], [`${s.id}_b`, s.from + Math.round(usable * 0.92)]);
}
for (const [name, frame] of frames) {
  await renderStill({ composition: comp, serveUrl, output: `${out}/${name}.png`, frame, browserExecutable, imageFormat: "png" });
  console.log("ok", name, frame);
}
