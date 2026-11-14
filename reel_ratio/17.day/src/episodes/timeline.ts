import meta from "../generated/meta.json";
import type { BeatKind, GeneratedMeta, SentenceConfig } from "../types";
import { episode, sentences } from "./active";

export const generated = meta as unknown as GeneratedMeta;
export const fps = generated.fps;

export const cueStart = (n: number): number => {
  const c = generated.cues[String(n)];
  if (!c) throw new Error(`SRT cue #${n} missing — run \`npm run prepare:episode\`.`);
  return c.start;
};
export const cueEnd = (n: number): number => {
  const c = generated.cues[String(n)];
  if (!c) throw new Error(`SRT cue #${n} missing — run \`npm run prepare:episode\`.`);
  return c.end;
};
export const cueOffset = (n: number, sceneStartSec: number): number => cueStart(n) - sceneStartSec;

export type Scene =
  | { type: "beat"; kind: BeatKind; key: string; from: number; duration: number; startSec: number; cues: [number, number] }
  | { type: "sentence"; key: string; from: number; duration: number; startSec: number; sentence: SentenceConfig };

/** Scenes are contiguous: each one lasts until the next one starts (no dead frames). */
export const buildScenes = (): Scene[] => {
  const raw: { start: number; make: (from: number, duration: number, startSec: number) => Scene }[] = [];

  episode.introBeats.forEach((b, i) => {
    const start = i === 0 ? 0 : cueStart(b.cues[0]);
    raw.push({
      start,
      make: (from, duration, startSec) => ({ type: "beat", kind: b.kind, key: `intro-${b.kind}`, from, duration, startSec, cues: b.cues }),
    });
  });
  sentences.forEach((s) => {
    raw.push({
      start: cueStart(s.cues.intro),
      make: (from, duration, startSec) => ({ type: "sentence", key: `s-${s.no}`, from, duration, startSec, sentence: s }),
    });
  });
  episode.outroBeats.forEach((b) => {
    raw.push({
      start: cueStart(b.cues[0]),
      make: (from, duration, startSec) => ({ type: "beat", kind: b.kind, key: `outro-${b.kind}`, from, duration, startSec, cues: b.cues }),
    });
  });

  for (let i = 1; i < raw.length; i++) {
    if (raw[i].start <= raw[i - 1].start) throw new Error(`Scene ${i} starts before the previous one — check cue numbers in config.`);
  }

  const total = generated.durationInFrames;
  return raw.map((r, i) => {
    const from = Math.round(r.start * fps);
    const next = i + 1 < raw.length ? Math.round(raw[i + 1].start * fps) : total;
    return r.make(from, Math.max(1, next - from), r.start);
  });
};
