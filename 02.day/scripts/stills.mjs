// যাচাইয়ের জন্য স্টিল রেন্ডার (dev only): node scripts/stills.mjs 45 120 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
const frames = process.argv.slice(2).map(Number);
const browserExecutable = process.env.CHROME || null;
const serveUrl = await bundle({ entryPoint: "src/index.ts" });
const comp = await selectComposition({ serveUrl, id: "Main", browserExecutable });
fs.mkdirSync("out/stills", { recursive: true });
for (const f of frames) {
  await renderStill({ composition: comp, serveUrl, frame: f, output: `out/stills/f${String(f).padStart(4, "0")}.png`, browserExecutable, scale: 0.6, imageFormat: "png" });
  console.log("ok", f);
}
