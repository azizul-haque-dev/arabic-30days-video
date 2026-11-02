// যাচাই: একবার bundle করে অনেকগুলো ফ্রেমের স্টিল। ব্যবহার: node scripts/stills.mjs 0 120 300 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const frames = process.argv.slice(2).map(Number);
const browserExecutable = process.env.BROWSER || undefined;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const inputProps = { requireVoiceover: false };
const comp = await selectComposition({ serveUrl, id: "Main", inputProps, browserExecutable });
fs.mkdirSync("out/check", { recursive: true });
for (const f of frames) {
  await renderStill({ composition: comp, serveUrl, frame: f, output: `out/check/f${String(f).padStart(4, "0")}.png`, inputProps, browserExecutable, imageFormat: "png", overwrite: true });
  console.log("ok", f);
}
