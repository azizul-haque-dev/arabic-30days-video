import { SRT } from "./data/srt";
import { SENTENCES } from "./data/script";
import { FPS } from "./theme";

export const LEAD = 5; // visuals enter this many frames before the spoken words
export const OVERLAP = 8; // frames a scene stays while the next one enters

type Cue = { start: number; end: number; text: string };

const toSec = (s: string) => {
  const m = s.trim().match(/(\d+):(\d+):(\d+)[,.](\d+)/);
  if (!m) throw new Error("Bad SRT time: " + s);
  return +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4] / 1000;
};

const cues: Cue[] = SRT.trim()
  .split(/\n\s*\n/)
  .map((block) => {
    const lines = block.split("\n").map((l) => l.trim());
    const [a, b] = lines[1].split("-->");
    return { start: toSec(a), end: toSec(b), text: lines.slice(2).join(" ").replace(/\s+/g, " ") };
  });

// Global text with a char → time map (linear inside each cue).
const segs: { g0: number; g1: number; t0: number; t1: number }[] = [];
let full = "";
cues.forEach((c, i) => {
  if (i > 0) full += " ";
  segs.push({ g0: full.length, g1: full.length + c.text.length, t0: c.start, t1: c.end });
  full += c.text;
});

const timeAt = (p: number) => {
  const s = segs.find((x) => p <= x.g1) ?? segs[segs.length - 1];
  const f = Math.max(0, Math.min(1, (p - s.g0) / Math.max(1, s.g1 - s.g0)));
  return s.t0 + f * (s.t1 - s.t0);
};

let cursor = 0;
/** Next occurrence of `needle` in narration order → seconds. */
const next = (needle: string, edge: "start" | "end" = "start") => {
  const i = full.indexOf(needle, cursor);
  if (i < 0) throw new Error(`SRT marker not found: "${needle}"`);
  cursor = i + needle.length;
  return timeAt(edge === "start" ? i : i + needle.length);
};

export const SRT_END = cues[cues.length - 1].end;
export const TOTAL = Math.round(SRT_END * FPS);

// ---- markers in narration order ----
const hook = {
  kintu: next("কিন্তু"),
  atke: next("আটকে যান"),
  chinta: next("চিন্তা নেই"),
  apnar: next("আপনার প্রতিদিনের"),
};
const brand = { t0: next("Arabic Master"), tirish: next("তিরিশ"), saptam: next("সপ্তম") };
const p60 = { t0: next("আলহামদুলিল্লাহ"), tinsho: next("তিনশোটি"), shat: next("ষাটটি") };
const steps = { t0: next("আজ"), from: next("একষট্টি"), to: next("সত্তর"), jatra: next("যাত্রা"), dhap: next("এক ধাপ") };

const sentences = SENTENCES.map((s) => {
  const t0 = next("Sentence " + s.word);
  const tr = next(",", "end");
  const mean = next("অর্থ");
  return { ...s, t0, tr, mean };
});

const recap = { t0: next("এই ছিল") };
const bar = { t0: next("তিনশোটি"), sottor: next("সত্তরটি") };
const cta = { t0: next("প্রতিদিন"), follow: next("follow"), comment: next("comment"), done: next("Day seven done") };
const outro = { t0: next("দেখা হবে"), day8: next("Day eight"), insha: next("ইনশাআল্লাহ") };

export const T = { hook, brand, p60, steps, sentences, recap, bar, cta, outro };

/** Scene start times (sec); scene frames begin LEAD frames earlier. */
export const sceneStarts: { id: string; t0: number }[] = [
  { id: "hook", t0: 0 },
  { id: "brand", t0: brand.t0 },
  { id: "p60", t0: p60.t0 },
  { id: "steps", t0: steps.t0 },
  ...sentences.map((s) => ({ id: "s" + s.n, t0: s.t0 })),
  { id: "recap", t0: recap.t0 },
  { id: "bar", t0: bar.t0 },
  { id: "cta", t0: cta.t0 },
  { id: "outro", t0: outro.t0 },
];

export type SceneSpan = { id: string; t0: number; from: number; dur: number };
export const SCENES: SceneSpan[] = sceneStarts.map((s, i) => {
  const from = i === 0 ? 0 : Math.max(0, Math.round(s.t0 * FPS) - LEAD);
  const nextFrom = i + 1 < sceneStarts.length ? Math.max(0, Math.round(sceneStarts[i + 1].t0 * FPS) - LEAD) : TOTAL;
  const dur = nextFrom - from + (i + 1 < sceneStarts.length ? OVERLAP : 0);
  return { id: s.id, t0: s.t0, from, dur };
});

export const spanOf = (id: string) => {
  const s = SCENES.find((x) => x.id === id);
  if (!s) throw new Error("no scene " + id);
  return s;
};

/** Local frame (inside scene) at which something should appear so it lands LEAD frames before time `t`. */
export const loc = (id: string, t: number) => {
  const s = spanOf(id);
  return Math.round(t * FPS) - LEAD - s.from;
};
