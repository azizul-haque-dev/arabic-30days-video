/**
 * Layout validation.
 *   npm run validate-layout            → STATIC checks (no browser): regions, margins, font scaling, hierarchy
 *   npm run validate-layout -- --dom   → ALSO renders real frames headlessly and runs a bounding-box guard on
 *                                        the actual DOM (text-vs-text, text-vs-art, margins, screen edges).
 *   --browser=/path/to/chrome          → use a specific Chrome/Chromium binary
 *   --keep=out/stills                  → keep the sampled PNGs (default: out/stills)
 */
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { episodeConfig } from "../src/episodes/day-18/config";
import { SENTENCES } from "../src/episodes/day-18/sentences";
import { cueFrame, placeScenes, totalFramesFor } from "../src/episodes/day-18/timeline";
import {
  CONTENT_W, H, MARGIN, SAFE_BOTTOM, SAFE_TOP, SENTENCE_REGIONS, THUMB_ZONES, W, layoutSentenceText, rectsOverlap, type Rect,
} from "../src/lib/layout";

const root = resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const flag = (n: string) => args.find((a) => a.startsWith(`--${n}=`))?.split("=")[1];
const errors: string[] = [];
const notes: string[] = [];

// ───────────── STATIC ─────────────
const regions = Object.entries(SENTENCE_REGIONS) as [string, Rect][];
for (const [name, r] of regions) {
  if (r.x < MARGIN || r.x + r.w > W - MARGIN) errors.push(`region ${name}: violates ${MARGIN}px horizontal margin`);
  if (r.y < SAFE_TOP || r.y + r.h > SAFE_BOTTOM) errors.push(`region ${name}: outside safe vertical area ${SAFE_TOP}–${SAFE_BOTTOM}`);
}
for (let i = 0; i < regions.length; i++) for (let j = i + 1; j < regions.length; j++) {
  if (rectsOverlap(regions[i][1], regions[j][1])) errors.push(`regions overlap: ${regions[i][0]} × ${regions[j][0]}`);
}
const thumb = Object.entries(THUMB_ZONES).map(([k, z]) => [k, { x: MARGIN, y: z.y, w: CONTENT_W, h: z.h }] as [string, Rect]);
for (let i = 0; i < thumb.length; i++) for (let j = i + 1; j < thumb.length; j++) {
  if (rectsOverlap(thumb[i][1], thumb[j][1])) errors.push(`thumbnail zones overlap: ${thumb[i][0]} × ${thumb[j][0]}`);
}

const R = SENTENCE_REGIONS;
for (const s of SENTENCES) {
  const t = layoutSentenceText(s);
  const tag = `sentence ${s.id}`;
  (["pron", "arabic", "meaning"] as const).forEach((k) => {
    const f = t[k];
    if (!f.fits) errors.push(`${tag}: ${k} does not fit (size ${f.size}, lines ${f.lines.length}, width ${Math.round(f.maxLineWidth)})`);
    if (f.height > R[k].h) errors.push(`${tag}: ${k} height ${f.height} > region ${R[k].h}`);
  });
  if (t.usage && (!t.usage.fits || t.usage.height > R.meaning.h)) errors.push(`${tag}: usage text does not fit`);
  if (!(t.pron.size >= t.arabic.size * 1.3)) errors.push(`${tag}: Arabic (${t.arabic.size}) not clearly smaller than pronunciation (${t.pron.size})`);
  if (!(t.pron.size > t.meaning.size)) errors.push(`${tag}: meaning larger than pronunciation`);
  notes.push(`${tag}: pron ${t.pron.size}px ×${t.pron.lines.length}  arabic ${t.arabic.size}px  meaning ${t.meaning.size}px ×${t.meaning.lines.length}`);
}
console.log(notes.map((n) => `  ${n}`).join("\n"));

if (errors.length) {
  errors.forEach((e) => console.error(`✖ ${e}`));
  process.exit(1);
}
console.log("✔ STATIC layout checks passed (estimate-based; see --dom for real-DOM validation)");

// ───────────── DOM (optional) ─────────────
if (args.includes("--dom")) {
  const { bundle } = await import("@remotion/bundler");
  const { openBrowser, renderStill, selectComposition } = await import("@remotion/renderer");
  const browserExecutable = flag("browser") ?? process.env.BROWSER_EXECUTABLE ?? null;
  const outDir = join(root, flag("keep") ?? "out/stills");
  mkdirSync(outDir, { recursive: true });
  const { fps } = episodeConfig.video;
  const totalFrames = totalFramesFor(fps, null);
  const scenes = placeScenes(fps, totalFrames);

  const samples: { scene: string; frame: number }[] = [];
  for (const sc of scenes) {
    const set = new Set<number>([sc.from + Math.round(sc.durationInFrames * 0.45), sc.from + sc.durationInFrames - 14]);
    if (sc.kind === "opening") set.add(0);
    if (sc.kind === "sentence") {
      const s = SENTENCES.find((x) => x.id === sc.sentenceId)!;
      const lf = (id: string) => sc.from + cueFrame(id, fps, sc.from);
      set.add(lf(s.cues.pron1) + 30);
      set.add(lf(s.cues.pron2) + 24);
      if (s.cues.usage) set.add(lf(s.cues.usage) + 30);
      set.add(lf(s.cues.meaning) + 30);
    }
    for (const f of set) samples.push({ scene: sc.id, frame: Math.min(Math.max(0, f), totalFrames - 1) });
  }

  console.log(`\nDOM validation: bundling… (${samples.length} sample frames)`);
  const serveUrl = await bundle({ entryPoint: join(root, "src/index.ts"), onProgress: () => undefined });
  const inputProps = { fps, totalFrames, guard: true };
  const browser = await openBrowser("chrome", { browserExecutable, chromiumOptions: { gl: "swangle" as const } });
  const composition = await selectComposition({ serveUrl, id: "Day18", inputProps, puppeteerInstance: browser, browserExecutable });
  let failed = 0;
  for (const smp of samples) {
    const output = join(outDir, `${smp.scene}-f${smp.frame}.png`);
    try {
      await renderStill({ composition, serveUrl, frame: smp.frame, output, inputProps, puppeteerInstance: browser, scale: 0.5, browserExecutable, timeoutInMilliseconds: 60_000 });
      console.log(`  ✔ ${smp.scene} @${smp.frame}`);
    } catch (e) {
      failed++;
      console.error(`  ✖ ${smp.scene} @${smp.frame}\n${String((e as Error).message).split("\n").slice(0, 8).map((l) => `      ${l}`).join("\n")}`);
    }
  }
  await browser.close({ silent: true });
  if (failed) {
    console.error(`\n✖ DOM validation FAILED on ${failed}/${samples.length} sampled frames`);
    process.exit(1);
  }
  console.log(`\n✔ DOM validation passed on ${samples.length} sampled frames (stills in ${outDir})`);
}
void H;
