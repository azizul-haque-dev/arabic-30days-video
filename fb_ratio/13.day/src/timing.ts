// সব টাইমিং SRT (src/data/script.srt → cues.json) থেকে। হাতে কোনো সেকেন্ড বসানো নেই।
import cuesRaw from "./data/cues.json";
import { theme, SfxType } from "./theme";

export const FPS = 30;
const LEAD = theme.leadFrames;
const TAIL_FRAMES = 15; // শেষ cue-র পর ০.৫ সেকেন্ড হোল্ড

type Cue = { i: number; start: number; end: number; text: string };
const cues = cuesRaw as Cue[];
const norm = (s: string) => s.replace(/\s+/g, " ").trim();

/** cue n-এর সময় (সেকেন্ড)। marker দিলে cue-র ভেতর ওই শব্দের আনুমানিক অবস্থান (অক্ষর-অনুপাতে)। */
export function t(n: number, marker?: string, edge: "start" | "end" = "start"): number {
  const c = cues[n - 1];
  if (!c) throw new Error(`cue ${n} নেই`);
  if (marker) {
    const text = norm(c.text);
    const idx = text.indexOf(marker);
    if (idx < 0) throw new Error(`cue ${n}-এ "${marker}" পাওয়া যায়নি`);
    return c.start + (idx / text.length) * (c.end - c.start);
  }
  return edge === "start" ? c.start : c.end;
}
const frame = (sec: number) => Math.round(sec * FPS);
/** ভিজ্যুয়াল কথার LEAD ফ্রেম আগে ঢোকে */
const at = (n: number, marker?: string) => Math.max(0, frame(t(n, marker)) - LEAD);

export const TOTAL_FRAMES = frame(t(42, undefined, "end")) + TAIL_FRAMES;

// ---------- বাক্যের সংজ্ঞা (উচ্চারণ ও অর্থ ইউজারের স্ক্রিপ্ট থেকে) ----------
export type IconId =
  | "crowd" | "shop" | "rice" | "meat" | "fresh" | "taxi" | "plane" | "fare" | "meter" | "stop";
export type LayoutId = "stack" | "row" | "card" | "bubble";

type SentenceDef = {
  n: number;
  icon: IconId;
  layout: LayoutId;
  tag?: string;
  keyword: string;
  pron: string;
  meaning: string;
  label: [number, string?];
  pronCue: number;
  mean: [number, string?];
  meanTextCue?: number;
};

// লেআউট পরপর দুই সিনে এক নয়
const SENTENCES: SentenceDef[] = [
  { n: 121, icon: "crowd", layout: "stack", keyword: "ভিড়", pron: "আস-সুক যাহমা মাররা।", meaning: "বাজারে অনেক ভিড়।", label: [6], pronCue: 7, mean: [8] },
  { n: 122, icon: "shop", layout: "row", keyword: "মুদির দোকান", pron: "ফেইন আগরাব বাক্কালা?", meaning: "সবচেয়ে কাছের মুদির দোকান কোথায়?", label: [9], pronCue: 10, mean: [12] },
  { n: 123, icon: "rice", layout: "card", tag: "এক কেজি", keyword: "চাল", pron: "আবগা কিলো রুজ্জ।", meaning: "আমি এক কেজি চাল চাই।", label: [13], pronCue: 14, mean: [16], meanTextCue: 17 },
  { n: 124, icon: "meat", layout: "bubble", tag: "আধা কেজি", keyword: "মাংস", pron: "আত’তিনী নুস কিলো লাহাম।", meaning: "আমাকে আধা কেজি মাংস দিন।", label: [18], pronCue: 19, mean: [20] },
  { n: 125, icon: "fresh", layout: "card", keyword: "তাজা?", pron: "হাদা তাজাজ?", meaning: "এটা কি তাজা?", label: [21], pronCue: 22, mean: [24] },
  { n: 126, icon: "taxi", layout: "stack", keyword: "ট্যাক্সি", pron: "আবগা রেমুজিন।", meaning: "একটা ট্যাক্সি চাই।", label: [25], pronCue: 26, mean: [28] },
  { n: 127, icon: "plane", layout: "bubble", keyword: "এয়ারপোর্ট", pron: "ওয়াদ্দীনি আল-মাতার।", meaning: "আমাকে এয়ারপোর্টে নিয়ে যান।", label: [29], pronCue: 30, mean: [31, "অর্থ"] },
  { n: 128, icon: "fare", layout: "row", keyword: "ভাড়া", pron: "বিকাম আল-মিশওয়ার?", meaning: "ট্রিপের ভাড়া কত?", label: [32], pronCue: 33, mean: [34, "অর্থ"] },
  { n: 129, icon: "meter", layout: "card", keyword: "মিটার", pron: "শাগ্গিল আল-আদ্দাদ।", meaning: "মিটার চালু করুন।", label: [35], pronCue: 36, mean: [37] },
  { n: 130, icon: "stop", layout: "stack", keyword: "থামুন", pron: "ওয়াগ্গিফ হিনা লাও সামাহত।", meaning: "দয়া করে এখানে থামুন।", label: [37, "Sentence 130"], pronCue: 38, mean: [39] },
];

export type SentenceScene = {
  kind: "sentence";
  id: string;
  start: number;
  end: number;
  idx: number;
  def: SentenceDef;
  b: { pron: number; mean: number; meanText: number }; // দৃশ্যের শুরু থেকে আপেক্ষিক ফ্রেম
};
export type SimpleScene = { kind: "hook" | "series" | "today" | "recap" | "cta"; id: string; start: number; end: number };
export type Scene = SentenceScene | SimpleScene;

const starts: { kind: Scene["kind"]; id: string; start: number; def?: SentenceDef; idx?: number }[] = [
  { kind: "hook", id: "hook", start: 0 },
  { kind: "series", id: "series", start: at(3) },
  { kind: "today", id: "today", start: at(5) },
  ...SENTENCES.map((def, idx) => ({ kind: "sentence" as const, id: `s${def.n}`, start: at(def.label[0], def.label[1]), def, idx })),
  { kind: "recap", id: "recap", start: at(39, "Arabic Master") },
  { kind: "cta", id: "cta", start: at(41) },
];

export const SCENES: Scene[] = starts.map((s, i) => {
  const end = i + 1 < starts.length ? starts[i + 1].start : TOTAL_FRAMES;
  if (s.kind === "sentence" && s.def) {
    const d = s.def;
    const meanF = at(d.mean[0], d.mean[1]);
    return {
      kind: "sentence", id: s.id, start: s.start, end, idx: s.idx!, def: d,
      b: {
        pron: at(d.pronCue) - s.start,
        mean: meanF - s.start,
        meanText: (d.meanTextCue ? at(d.meanTextCue) : meanF) - s.start,
      },
    } as SentenceScene;
  }
  return { kind: s.kind, id: s.id, start: s.start, end } as SimpleScene;
});

export const sceneById = (id: string) => SCENES.find((s) => s.id === id)!;

// ---------- সিনের ভেতরের বিট (দৃশ্যের শুরু থেকে আপেক্ষিক ফ্রেম) ----------
const rel = (id: string, n: number, marker?: string) => at(n, marker) - sceneById(id).start;

export const BEATS = {
  hook: { b: rel("hook", 2) },
  series: { day13: rel("series", 3, "13তম"), count: rel("series", 4), countRoll: rel("series", 4, "120টি") },
  today: {
    market: rel("today", 5, "বাজার"),
    taxi: rel("today", 5, "ট্যাক্সিতে"),
    ten: rel("today", 5, "10টি"),
    go: rel("today", 5, "চলুন"),
  },
  recap: { progress: rel("recap", 40, "আলহামদুলিল্লাহ") },
  cta: { follow: rel("cta", 41, "follow"), comment: rel("cta", 42), typing: rel("cta", 42, "Day 13 Done"), bye: rel("cta", 42, "দেখা হবে") },
};

// ---------- SFX (প্রধান এন্ট্রি, কার্ড/লোগো রিভিল ও ট্রানজিশনে) ----------
export type SfxEvent = { f: number; type: SfxType; rate?: number; vol?: number };
const S = (id: string) => sceneById(id).start;

export const SFX: SfxEvent[] = [];
const add = (f: number, type: SfxType, rate = 1, vol = 1) => SFX.push({ f: Math.max(0, f), type, rate, vol });

// সিন ট্রানজিশন — হালকা whoosh (সামান্য ভ্যারিয়েশন)
SCENES.slice(1).forEach((s, i) => add(s.start - 9, "whoosh", i % 2 ? 1.06 : 0.96, 1));

// হুক
add(2, "thud", 1, 0.8);
add(S("hook") + BEATS.hook.b, "pop", 1, 1);
add(S("hook") + BEATS.hook.b + 14, "chime", 1, 1);
// সিরিজ
add(S("series") + 6, "pop", 1.05);
add(S("series") + BEATS.series.day13, "click");
add(S("series") + BEATS.series.count, "pop", 0.95);
// আজকের পরিকল্পনা
add(S("today") + BEATS.today.market, "pop", 1.0);
add(S("today") + BEATS.today.taxi, "pop", 1.1);
add(S("today") + BEATS.today.go, "click");
// বাক্য
SCENES.forEach((s, i) => {
  if (s.kind !== "sentence") return;
  add(s.start + s.b.pron, "pop", 0.94 + (i % 3) * 0.06);
  add(s.start + s.b.mean, "click", 1 + (i % 2) * 0.05, 0.9);
});
// রিক্যাপ
add(S("recap") + 14, "pop", 1);
add(S("recap") + 30, "click", 1.05);
add(S("recap") + BEATS.recap.progress, "chime", 1.12);
// CTA
add(S("cta") + 6, "pop", 1);
add(S("cta") + BEATS.cta.follow + 10, "click");
add(S("cta") + BEATS.cta.comment, "pop", 1.08);
add(S("cta") + BEATS.cta.bye, "chime", 1);
SFX.sort((a, b) => a.f - b.f);

export const BOUNDARIES = SCENES.slice(1).map((s) => s.start);
