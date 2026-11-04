// Dev helper: render still frames for visual QA.  node scripts/stills.mjs 100 250 ...
import {bundle} from "@remotion/bundler";
import {renderStill, selectComposition} from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const frames = process.argv.slice(2).map(Number);
const outDir = process.env.OUT || "/tmp/stills";
fs.mkdirSync(outDir, {recursive: true});
const browserExecutable = process.env.BROWSER || undefined;
const serveUrl = await bundle({entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public")});
const comp = await selectComposition({serveUrl, id: "Main", browserExecutable});
for (const f of frames) {
  await renderStill({composition: comp, serveUrl, frame: f, output: path.join(outDir, `f${String(f).padStart(4, "0")}.png`), browserExecutable, imageFormat: "png", chromiumOptions: {gl: "swangle"}});
  console.log("frame", f);
}
