/**
 * Dev helper: render a few single frames (PNG) to eyeball the layout. NOT a video render.
 *   npm run stills -- 0 300 960        (frame numbers)
 *   npm run stills -- t=31.9 t=121.5   (seconds)
 * Set BROWSER_EXECUTABLE if Remotion cannot download its own Chrome (offline machines).
 */
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const root = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
if (!args.length) {
  console.error("Usage: npm run stills -- <frame|t=seconds> ...");
  process.exit(1);
}

(async () => {
  const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), onProgress: () => undefined });
  const browserExecutable = process.env.BROWSER_EXECUTABLE || undefined;
  const comp = await selectComposition({ serveUrl, id: "Episode", browserExecutable });
  for (const a of args) {
    const frame = a.startsWith("t=") ? Math.round(parseFloat(a.slice(2)) * comp.fps) : parseInt(a, 10);
    const output = path.join(root, "out", `still_${String(frame).padStart(5, "0")}.png`);
    await renderStill({ serveUrl, composition: comp, frame, output, browserExecutable, overwrite: true });
    console.log(`✔ frame ${frame} → ${path.relative(root, output)}`);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
