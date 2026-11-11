import { episodeConfig } from "./episodeConfig";
import { theme } from "./theme";
import type { Cue } from "../utils/srt";

/**
 * A time reference resolved against the SRT.
 *  - { cue }                 -> start of that cue (exact)
 *  - { cue, frac }           -> frac (0..1) through that cue. ESTIMATED: used only where one SRT
 *                               cue contains several narration beats (character-proportional).
 *  - { t }                   -> absolute seconds
 */
export type Ref = { cue: number; frac?: number; edge?: "end" } | { t: number };

export const isEstimated = (r: Ref) => "cue" in r && r.frac !== undefined && r.frac > 0 && r.frac < 1;

const resolve = (r: Ref, cues: Cue[]): number => {
  if ("t" in r) return r.t;
  const c = cues.find((x) => x.index === r.cue);
  if (!c) throw new Error(`SRT is missing cue #${r.cue}. Timeline cannot be built.`);
  if (r.edge === "end") return c.end;
  return c.start + (c.end - c.start) * (r.frac ?? 0);
};

type SceneDef =
  | { id: string; kind: "intro1" | "intro2" | "intro3" | "intro4" | "intro5" | "outro1" | "outro2" | "outro3" | "outro4"; start: Ref }
  | { id: string; kind: "sentence"; n: number; start: Ref; pron1: Ref; pron2: Ref; meaning: Ref };

/** Scene order + the SRT cue each scene (and each sentence beat) hangs on. */
export const sceneDefs: SceneDef[] = [
  { id: "intro1", kind: "intro1", start: { t: 0 } },
  { id: "intro2", kind: "intro2", start: { cue: 2, frac: 0.145 } }, // est: "চিন্তা নেই" inside cue 2
  { id: "intro3", kind: "intro3", start: { cue: 2, frac: 0.904 } }, // est: "30 দিনের" at end of cue 2
  { id: "intro4", kind: "intro4", start: { cue: 4 } },
  { id: "intro5", kind: "intro5", start: { cue: 5 } },
  { id: "s131", kind: "sentence", n: 131, start: { cue: 6 }, pron1: { cue: 7 }, pron2: { cue: 8 }, meaning: { cue: 9 } },
  { id: "s132", kind: "sentence", n: 132, start: { cue: 10 }, pron1: { cue: 10, frac: 0.215 }, pron2: { cue: 10, frac: 0.415 }, meaning: { cue: 10, frac: 0.615 } },
  { id: "s133", kind: "sentence", n: 133, start: { cue: 10, frac: 0.877 }, pron1: { cue: 12 }, pron2: { cue: 13 }, meaning: { cue: 14 } },
  { id: "s134", kind: "sentence", n: 134, start: { cue: 14, frac: 0.55 }, pron1: { cue: 15 }, pron2: { cue: 16 }, meaning: { cue: 17 } },
  { id: "s135", kind: "sentence", n: 135, start: { cue: 17, frac: 0.63 }, pron1: { cue: 18 }, pron2: { cue: 19 }, meaning: { cue: 19, frac: 0.222 } },
  { id: "s136", kind: "sentence", n: 136, start: { cue: 19, frac: 0.476 }, pron1: { cue: 19, frac: 0.698 }, pron2: { cue: 20 }, meaning: { cue: 21 } },
  { id: "s137", kind: "sentence", n: 137, start: { cue: 22 }, pron1: { cue: 23 }, pron2: { cue: 23, frac: 0.33 }, meaning: { cue: 23, frac: 0.65 } },
  { id: "s138", kind: "sentence", n: 138, start: { cue: 24 }, pron1: { cue: 25 }, pron2: { cue: 25, frac: 0.5 }, meaning: { cue: 26 } },
  { id: "s139", kind: "sentence", n: 139, start: { cue: 27 }, pron1: { cue: 28 }, pron2: { cue: 29 }, meaning: { cue: 30 } },
  { id: "s140", kind: "sentence", n: 140, start: { cue: 31 }, pron1: { cue: 32 }, pron2: { cue: 33 }, meaning: { cue: 34 } },
  { id: "outro1", kind: "outro1", start: { cue: 35 } },
  { id: "outro2", kind: "outro2", start: { cue: 36 } },
  { id: "outro3", kind: "outro3", start: { cue: 37 } },
  { id: "outro4", kind: "outro4", start: { cue: 38, frac: 0.516 } }, // est: "দেখা হবে Day 15তে"
];

export type BuiltScene = {
  id: string;
  kind: SceneDef["kind"];
  n?: number;
  from: number; // frame
  dur: number; // frames
  /** frames relative to scene start */
  beats?: { pron1: number; pron2: number; meaning: number };
};

export type Timeline = { scenes: BuiltScene[]; totalFrames: number; fps: number; estimated: string[] };

export const buildTimeline = (cues: Cue[], fps: number): Timeline => {
  if (cues.length === 0) throw new Error("SRT has no cues.");
  const lastEnd = Math.max(...cues.map((c) => c.end));
  const total = Math.ceil((lastEnd + theme.timing.tail) * fps);
  const lead = theme.timing.sceneLead;
  const estimated: string[] = [];

  const starts = sceneDefs.map((d, i) => {
    const t = resolve(d.start, cues);
    if (isEstimated(d.start)) estimated.push(`${d.id} start`);
    return i === 0 ? 0 : Math.max(0, Math.round((t - lead) * fps));
  });

  const scenes: BuiltScene[] = sceneDefs.map((d, i) => {
    const from = starts[i];
    const end = i + 1 < starts.length ? starts[i + 1] : total;
    const s: BuiltScene = { id: d.id, kind: d.kind, from, dur: end - from };
    if (d.kind === "sentence") {
      s.n = d.n;
      const rel = (r: Ref, name: string) => {
        if (isEstimated(r)) estimated.push(`${d.id} ${name}`);
        return Math.max(0, Math.round(resolve(r, cues) * fps) - from);
      };
      s.beats = { pron1: rel(d.pron1, "pron1"), pron2: rel(d.pron2, "pron2"), meaning: rel(d.meaning, "meaning") };
    }
    return s;
  });
  return { scenes, totalFrames: total, fps, estimated };
};

export const sentenceFor = (n: number) => {
  const s = episodeConfig.sentences.find((x) => x.n === n);
  if (!s) throw new Error(`Sentence ${n} missing from episodeConfig`);
  return s;
};
