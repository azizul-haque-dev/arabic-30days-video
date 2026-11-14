/**
 * Whole-timeline layout audit (NO video, NO images written).
 * Mounts every Nth frame in headless Chrome so the in-composition DOM audit
 * (src/layout/audit.ts) checks real bounding boxes for overlap / clipping / safe margins.
 *   npm run audit            -> every 3rd frame
 *   npm run audit -- 1       -> every frame
 */
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderFrames, selectComposition } from "@remotion/renderer";

const root = path.resolve(__dirname, "..");
const nth = Math.max(1, parseInt(process.argv[2] ?? "3", 10) || 3);

(async () => {
  const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), onProgress: () => undefined });
  const browserExecutable = process.env.BROWSER_EXECUTABLE || undefined;
  const composition = await selectComposition({ serveUrl, id: "Episode", browserExecutable });
  let last = 0;
  await renderFrames({
    serveUrl,
    composition,
    inputProps: {},
    outputDir: null,
    imageFormat: "none",
    everyNthFrame: nth,
    browserExecutable,
    concurrency: Number(process.env.AUDIT_CONCURRENCY) || null,
    onStart: () => undefined,
    onFrameUpdate: (n) => {
      if (n - last >= 100) {
        last = n;
        process.stdout.write(`  audited ${n} frames…\r`);
      }
    },
  });
  console.log(`\n✅ Layout audit passed on every ${nth}rd frame of ${composition.durationInFrames} (no overlap / clipping / margin violations).`);
})().catch((e) => {
  console.error(`\n❌ Layout audit FAILED:\n${e?.message ?? e}`);
  process.exit(1);
});
