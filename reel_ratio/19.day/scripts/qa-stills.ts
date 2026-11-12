/**
 * QA helper: renders key frames of every scene to out/qa/*.png so layout (overlap, clipping,
 * hierarchy) can be reviewed without rendering the full video.
 *   npm run qa:stills            (uses the prepared timeline)
 * Set BROWSER_EXECUTABLE to use a specific Chrome / chrome-headless-shell.
 */
import fs from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import type { EpisodeTimeline } from "../src/types";

const ROOT = path.resolve(__dirname, "..");

async function main() {
  const timeline: EpisodeTimeline = JSON.parse(fs.readFileSync(path.join(ROOT, "src/generated/day-19.timeline.json"), "utf8"));
  const out = path.join(ROOT, "out", "qa");
  fs.mkdirSync(out, { recursive: true });

  const frames: { name: string; frame: number }[] = [];
  const fps = timeline.fps;
  timeline.scenes.forEach((s, i) => {
    const tag = `${String(i + 1).padStart(2, "0")}-${s.type}${s.type === "sentence" ? "-" + s.number : ""}`;
    if (s.type === "sentence") {
      const meaning = s.events.find((e) => e.kind === "meaning");
      const pron = s.events.filter((e) => e.kind === "pron");
      frames.push({ name: `${tag}-a-pron`, frame: Math.round((pron[0]!.startSec + 0.8) * fps) });
      frames.push({ name: `${tag}-b-all`, frame: Math.min(s.endFrame - 14, Math.round((meaning!.startSec + 1.2) * fps)) });
    } else if (s.type === "challenge") {
      s.items.forEach((it, k) => frames.push({ name: `${tag}-item${k + 1}`, frame: Math.round((it.startSec + 1) * fps) }));
      frames.push({ name: `${tag}-title`, frame: s.startFrame + 24 });
    } else if (s.type === "opening") {
      const split = s.splitSec !== null ? Math.round(s.splitSec * fps) : s.startFrame + Math.round((s.endFrame - s.startFrame) * 0.55);
      frames.push({ name: `${tag}-a`, frame: s.startFrame + 70 });
      frames.push({ name: `${tag}-b`, frame: Math.min(s.endFrame - 14, split + 60) });
    } else {
      frames.push({ name: tag, frame: Math.min(s.endFrame - 14, s.startFrame + 90) });
    }
  });

  const serveUrl = await bundle({ entryPoint: path.join(ROOT, "src/index.ts") });
  const browserExecutable = process.env.BROWSER_EXECUTABLE ?? null;
  const composition = await selectComposition({ serveUrl, id: "Day19", browserExecutable });
  if (composition.width !== 1080 || composition.height !== 1920 || composition.fps !== 30) {
    throw new Error(`Unexpected composition format ${composition.width}x${composition.height}@${composition.fps}`);
  }
  console.log(`Composition OK: ${composition.width}x${composition.height} @ ${composition.fps}fps, ${composition.durationInFrames} frames`);
  for (const f of frames) {
    await renderStill({ composition, serveUrl, output: path.join(out, `${f.name}.png`), frame: f.frame, browserExecutable });
    console.log(`  ✔ ${f.name}  (frame ${f.frame})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
