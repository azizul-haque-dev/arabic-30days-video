// Dev helper: render still frames of Main for visual checks.  node scripts/stills.mjs 60 170 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";
const frames = process.argv.slice(2).map(Number);
const browser = process.env.BROWSER_EXE || undefined;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const comp = await selectComposition({ serveUrl, id: "Main", browserExecutable: browser });
fs.mkdirSync("out/stills", { recursive: true });
for (const frame of frames) {
  await renderStill({ composition: comp, serveUrl, frame, output: `out/stills/f${String(frame).padStart(4, "0")}.png`, browserExecutable: browser, overwrite: true, imageFormat: "png" });
  console.log("still", frame);
}
