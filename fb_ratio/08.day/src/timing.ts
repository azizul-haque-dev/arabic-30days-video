// timing.ts — EVERY time in this video is derived from subtitle.srt (via data/cues.ts).
// Markers are looked up in the full SRT text; inside a cue the position is interpolated by character share.
import {CUES} from "./data/cues";
import {theme} from "./theme";

export const FPS = theme.video.fps;
const LEAD = theme.motion.lead;

// ---------- full-text index ----------
let full = "";
const ranges: {c0: number; c1: number; start: number; end: number}[] = [];
CUES.forEach((c, i) => {
  if (i > 0) full += " ";
  const c0 = full.length;
  full += c.text;
  ranges.push({c0, c1: full.length, start: c.start, end: c.end});
});

const timeAtIndex = (idx: number): number => {
  for (let i = 0; i < ranges.length; i++) {
    const r = ranges[i];
    if (idx >= r.c0 && idx < r.c1) return r.start + ((idx - r.c0) / (r.c1 - r.c0)) * (r.end - r.start);
    if (idx >= r.c1 && i + 1 < ranges.length && idx < ranges[i + 1].c0) return ranges[i + 1].start; // joining space
  }
  return ranges[ranges.length - 1].end;
};

export type Mark = {idx: number; t: number};
const mark = (marker: string, after = 0): Mark => {
  const idx = full.indexOf(marker, after);
  if (idx < 0) throw new Error(`Marker not found in SRT: "${marker}" (after ${after})`);
  // snap to a cue boundary when it is within 0.25s (scene bounds follow cue bounds)
  let t = timeAtIndex(idx);
  for (const r of ranges) for (const b of [r.start, r.end]) if (Math.abs(b - t) <= 0.25) t = b;
  return {idx, t};
};

// ---------- content (script text is authoritative for Bengali; Arabic script comes from the SRT) ----------
export type Sentence = {n: number; arabic: string; key: string; translit: string; meaning: string};
export const SENTENCES: Sentence[] = [
  {n: 71, arabic: "الغسالة خربانة", key: "الغسالة", translit: "আল-গাসসালা খারবানা।", meaning: "ওয়াশিং মেশিনটা নষ্ট।"},
  {n: 72, arabic: "لازم نكلم السباك", key: "لازم نكلم", translit: "লাজিম নিকাল্লিম আস-সাব্বাক।", meaning: "আমাদের প্লাম্বারকে ডাকতে হবে।"},
  {n: 73, arabic: "ارمي الزبالة برة", key: "ارمي الزبالة", translit: "এরমি আয-যিবালা বারা।", meaning: "ময়লাটা বাইরে ফেলে আসুন।"},
  {n: 74, arabic: "الغرفة تحتاج تنظيف", key: "الغرفة", translit: "আল-গুরফা তিহতাজ তানদীফ।", meaning: "ঘরটা পরিষ্কার করা দরকার।"},
  {n: 75, arabic: "غسلت الملابس ولا باقي؟", key: "غسلت الملابس", translit: "গাসসিলত আল-মালাবিস, ওয়াল্লা বাকি?", meaning: "কাপড় ধুয়েছেন, নাকি এখনো বাকি?"},
  {n: 76, arabic: "أنا رايح المسجد أصلي", key: "أنا رايح", translit: "আনা রায়াহ আল-মাসজিদ আসাল্লি।", meaning: "আমি মসজিদে নামাজ পড়তে যাচ্ছি।"},
  {n: 77, arabic: "صحيني الساعة ستة الصباح", key: "صحيني", translit: "সাহহীনি আস-সা'আ সিত্তা আস-সাবাহ।", meaning: "আমাকে সকাল ছয়টায় ডেকে দেবেন।"},
  {n: 78, arabic: "نمت متأخر أمس", key: "نمت متأخر", translit: "নিমত মিতআখখির আমস।", meaning: "গতকাল দেরিতে ঘুমিয়েছি।"},
  {n: 79, arabic: "صحيت بدري اليوم", key: "صحيت بدري", translit: "সাহীত বাদরি আল-ইয়াওম।", meaning: "আজ তাড়াতাড়ি ঘুম থেকে উঠেছি।"},
  {n: 80, arabic: "أبغى أرتاح شوية", key: "أبغى أرتاح", translit: "আবগা আরতাহ শুয়াইয়্যা।", meaning: "আমি একটু বিশ্রাম নিতে চাই।"},
];

// ---------- markers (seconds) ----------
const m = {
  but: mark("কিন্তু"),
  stuck: mark("আরবি কথা বলতে"),
  relax: mark("চিন্তা নেই"),
  brandIntro: mark("আপনার প্রতিদিনের"),
  brand: mark("Arabic Master"),
  thirty: mark("তিরিশ দিনের"),
  day8: mark("আজ অষ্টম"),
  alhamdu: mark("আলহামদুলিল্লাহ, আমরা"),
  total300: mark("তিনশোটি"),
  learned70: mark("সত্তরটি"),
  today: mark("আজ শিখব"),
  range: mark("একাত্তর"),
  journey: mark("যাত্রা"),
};
m.brand = mark("Arabic Master", m.brandIntro.idx);

export type SentenceMarks = {num: Mark; ar: Mark; ar2: Mark; meaning: Mark};
const sm: Record<number, SentenceMarks> = {};
let cursor = m.journey.idx;
for (const s of SENTENCES) {
  const num = mark(`Sentence ${s.n}`, cursor);
  const ar = mark(s.key, num.idx);
  const ar2 = mark(s.key, ar.idx + 3);
  // the spoken word "অর্থ" is missing from some cues -> fall back to the first words of the meaning
  const nextNum = s.n < 80 ? full.indexOf(`Sentence ${s.n + 1}`, ar2.idx) : -1;
  const artha = full.indexOf("অর্থ", ar2.idx);
  const meaning = artha >= 0 && (nextNum < 0 || artha < nextNum) ? mark("অর্থ", ar2.idx) : mark(s.meaning.split(" ")[0], ar2.idx);
  sm[s.n] = {num, ar, ar2, meaning};
  cursor = meaning.idx;
}
const last = sm[80];
const r = {
  recap: mark("Arabic Master", last.meaning.idx),
  ten: mark("আজকের দশটি", last.meaning.idx),
  alh2: mark("আলহামদুলিল্লাহ", last.meaning.idx + 5),
  eighty: mark("আশিটি", last.meaning.idx),
  follow: mark("প্রতিদিন নতুন", last.meaning.idx),
  followWord: mark("ফলো করুন", last.meaning.idx),
  comment: mark("এবং কমেন্টে", last.meaning.idx),
  done: mark("Day 8 Done", last.meaning.idx),
  see: mark("দেখা হবে", last.meaning.idx),
  day9: mark("Day 9", last.meaning.idx),
  insha: mark("ইনশাআল্লাহ", last.meaning.idx),
};

export const SRT_END = CUES[CUES.length - 1].end;
export const TOTAL_FRAMES = Math.ceil((SRT_END + 0.12) * FPS);

// absolute frame where a visual tied to a spoken moment should land (LEAD frames early)
export const abs = (sec: number) => Math.max(0, Math.round(sec * FPS) - LEAD);

// ---------- scenes ----------
export type SceneDef = {id: string; start: number; end: number};
const starts: [string, number][] = [
  ["hook", 0],
  ["brand", m.brandIntro.t],
  ["days30", m.thirty.t],
  ["progress", m.alhamdu.t],
  ["today", m.today.t],
  ...SENTENCES.map((s) => [`s${s.n}`, sm[s.n].num.t] as [string, number]),
  ["recap", r.recap.t],
  ["dash", r.alh2.t],
  ["social", r.follow.t],
  ["closing", r.see.t],
];
export const SCENES: SceneDef[] = starts.map(([id, t], i) => {
  const start = i === 0 ? 0 : abs(t);
  const end = i + 1 < starts.length ? abs(starts[i + 1][1]) : TOTAL_FRAMES;
  return {id, start, end};
});
export const scene = (id: string): SceneDef => {
  const s = SCENES.find((x) => x.id === id);
  if (!s) throw new Error(`scene ${id}`);
  return s;
};
// frame relative to a scene start for a spoken moment (clamped to >= 0)
export const rel = (id: string, sec: number) => Math.max(0, abs(sec) - scene(id).start);

export const M = {...m, ...r};
export const SM = sm;
