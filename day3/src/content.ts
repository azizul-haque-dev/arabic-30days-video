// Content = on-screen text from the script file. Timing = SRT (via markerAt/cueStart).
import { cueStart, markerAt, toFrame, TOTAL_FRAMES } from "./timing";
import { theme } from "./theme";
import type { IconKind } from "./components/kit";

export type Sentence = {
  n: number;
  phrase: string;
  situation: string;
  hint?: string;
  meaning: string;
  sub?: string;
  icon: IconKind;
  layout: "chat" | "glass" | "bento" | "statement" | "timeline";
  start: number; // sec — scene begins ("Sentence N")
  situationAt: number;
  hintAt?: number;
  phraseAt: number;
  echoAt: number; // narrator repeats the phrase
  meaningAt: number;
  sayAt?: number; // "আমার সাথে বলুন"
};

export const sentences: Sentence[] = [
  {
    n: 1, icon: "door", layout: "chat",
    phrase: "আন ইযনাক আনা রাইআহ",
    situation: "আড্ডা শেষে হুট করে উঠে যাবেন না", hint: "ভদ্রভাবে বলুন—",
    meaning: "ভাই, অনুমতি দিলে এবার আমি আসি!",
    start: markerAt(7, "Sentence"), situationAt: markerAt(7, "আড্ডা"), hintAt: markerAt(7, "ভদ্রভাবে"),
    phraseAt: cueStart(8), echoAt: cueStart(9), meaningAt: markerAt(9, "মানে"), sayAt: cueStart(10),
  },
  {
    n: 2, icon: "cup", layout: "glass",
    phrase: "খুদ রাহতাক",
    situation: "কেউ একটু তাড়াহুড়ো করছে বা লজ্জা পাচ্ছে?", hint: "তাকে রিল্যাক্স করতে বলুন—",
    meaning: "আরে ভাই, নিজের মতো আরামসে থাকুন তো!", sub: "Take your time / Feel free",
    start: markerAt(11, "Sentence"), situationAt: cueStart(12), hintAt: cueStart(13),
    phraseAt: cueStart(14), echoAt: cueStart(15), meaningAt: markerAt(15, "মানে"),
  },
  {
    n: 3, icon: "house", layout: "bento",
    phrase: "আল-বেইত বেইতাক",
    situation: "বাসায় মেহমান এলে সৌদিরা খুব আদর করে বলে—",
    meaning: "লজ্জা কিসের? এটা তো আপনারই বাড়ি!",
    start: markerAt(17, "Sentence"), situationAt: markerAt(17, "বাসায়"),
    phraseAt: cueStart(18), echoAt: markerAt(18, "আল বাইত", 1), meaningAt: markerAt(18, "মানে"),
  },
  {
    n: 4, icon: "city", layout: "statement",
    phrase: "নাওয়ার্ত জিদ্দা",
    situation: "জেদ্দায় আপনার কোনো বন্ধু বা প্রিয় মানুষ এসেছে?", hint: "তাকে তেল মাখাতে বলুন—",
    meaning: "আপনার আসায় পুরো জেদ্দা শহর আলোকিত হয়ে গেছে!", sub: "জেদ্দায় স্বাগতম",
    start: markerAt(19, "Sentence"), situationAt: cueStart(20), hintAt: cueStart(21),
    phraseAt: cueStart(22), echoAt: markerAt(22, "Nouwart", 1), meaningAt: markerAt(22, "মানে"),
  },
  {
    n: 5, icon: "sun", layout: "timeline",
    phrase: "আন-নূর নূরাক",
    situation: "কেউ যদি আপনাকে বলে “নাওয়ার্ত”", hint: "স্মার্টলি উত্তর দিন—",
    meaning: "আরে, এই আলো তো আপনারই!",
    start: markerAt(24, "Sentence"), situationAt: cueStart(25), hintAt: markerAt(26, "Smartly"),
    phraseAt: cueStart(27), echoAt: markerAt(27, "Annur", 1), meaningAt: markerAt(27, "মানে"),
  },
  {
    n: 6, icon: "chat", layout: "chat",
    phrase: "তাআর্রিফ তিতকাল্লাম আরাবি?",
    situation: "কাউকে জিজ্ঞেস করতে চান সে আরবি পারে কি না?", hint: "বলুন—",
    meaning: "ভাই, আপনি কি আরবি বলতে পারেন?",
    start: markerAt(28, "Sentence"), situationAt: markerAt(29, "কাউকে"), hintAt: cueStart(30),
    phraseAt: cueStart(31), echoAt: cueStart(32), meaningAt: markerAt(32, "মানে"),
  },
  {
    n: 7, icon: "meter", layout: "glass",
    phrase: "আতকাল্লাম শুয়াইয়া বাস",
    situation: "কেউ যদি আপনাকে এই প্রশ্ন করে", hint: "তখন মুচকি হেসে বলুন—",
    meaning: "এই আরকি, অল্প-স্বল্প পারি!",
    start: cueStart(34), situationAt: markerAt(34, "আর যদি"), hintAt: markerAt(35, "মুচকি"),
    phraseAt: cueStart(36), echoAt: cueStart(37), meaningAt: markerAt(37, "মানে"),
  },
  {
    n: 8, icon: "drop", layout: "bento",
    phrase: "কালামাক ওয়াদিহ মাররা",
    situation: "কারো কথা একদম পানির মতো পরিষ্কার বুঝতে পারলে", hint: "প্রশংসা করে বলুন—",
    meaning: "আপনার কথা একদম ফকফকা, মানে একদম পরিষ্কার!",
    start: cueStart(38), situationAt: markerAt(38, "কারো"), hintAt: markerAt(38, "প্রশংসা"),
    phraseAt: cueStart(39), echoAt: markerAt(39, "Kalamak", 1), meaningAt: markerAt(40, "মানে"),
  },
  {
    n: 9, icon: "bubbles", layout: "statement",
    phrase: "ফাহিমত আলাইয়া?",
    situation: "নিজের কথা শেষ করে সামনের জন বুঝলো কি না জানতে", hint: "বলুন—",
    meaning: "আমার কথা কি মাথায় ঢুকেছে?", sub: "বুঝতে পেরেছেন?",
    start: markerAt(40, "Sentence"), situationAt: cueStart(41), hintAt: markerAt(41, "বলুন"),
    phraseAt: cueStart(42), echoAt: markerAt(42, "Fahimt", 1), meaningAt: cueStart(43),
  },
  {
    n: 10, icon: "check", layout: "timeline",
    phrase: "আইওয়া, ফিহিমত আলাইক",
    situation: "আপনি বুঝে থাকলে", hint: "ঘাড় নেড়ে জবাব দিন—",
    meaning: "হ্যাঁ ভাই, একদম বুঝেছি আপনার কথা!",
    start: cueStart(45), situationAt: markerAt(45, "আর আপনি"), hintAt: cueStart(46),
    phraseAt: markerAt(46, "Aywa"), echoAt: markerAt(46, "Aywa", 1), meaningAt: cueStart(47),
  },
];

/* ───────── scene list (boundaries come from SRT cue / marker times) ───────── */

const L = theme.motion.lead;
const sf = (sec: number) => toFrame(sec) - L; // scene start frame (visual leads speech)

export type SceneId =
  | "hook" | "promise" | "challenge" | `s${number}` | "recap" | "follow" | "comment" | "signoff";

const starts: Array<{ id: SceneId; from: number }> = [
  { id: "hook", from: 0 },
  { id: "promise", from: sf(cueStart(2)) },
  { id: "challenge", from: sf(cueStart(4)) },
  ...sentences.map((s) => ({ id: `s${s.n}` as SceneId, from: sf(s.start) })),
  { id: "recap", from: sf(cueStart(48)) },
  { id: "follow", from: sf(markerAt(48, "এভাবে")) },
  { id: "comment", from: sf(markerAt(49, "আর আজকে")) },
  { id: "signoff", from: sf(markerAt(50, "দেখা")) },
];

export const scenes = starts.map((s, i) => ({
  ...s,
  dur: (i + 1 < starts.length ? starts[i + 1].from : TOTAL_FRAMES) - s.from,
}));
export const sceneOf = (id: SceneId) => scenes.find((s) => s.id === id)!;

/** relative frame inside a scene where a visual tied to speech time `sec` should begin */
export const rel = (from: number, sec: number) => Math.max(0, toFrame(sec) - L - from);

/* ───────── SFX plan (all frames derived from the same times) ───────── */

export type Sfx = { frame: number; name: "pop" | "click" | "whoosh" | "thud" | "chime"; vol: number; rate?: number };

export const sfxPlan = (): Sfx[] => {
  const out: Sfx[] = [];
  // whoosh at every scene change (except the very first)
  scenes.slice(1).forEach((s) => out.push({ frame: s.from - 3, name: "whoosh", vol: 0.28 }));
  out.push({ frame: 20, name: "thud", vol: 0.3 }); // hook
  sentences.forEach((s) => {
    const f = sceneOf(`s${s.n}` as SceneId).from;
    out.push({ frame: f + rel(f, s.phraseAt) - 2, name: "pop", vol: 0.3, rate: 1 + (s.n % 3) * 0.04 });
    out.push({ frame: f + rel(f, s.echoAt) - 2, name: "click", vol: 0.22 });
    out.push({ frame: f + rel(f, s.meaningAt) - 2, name: "pop", vol: 0.26, rate: 1.1 });
  });
  const cm = sceneOf("comment").from;
  out.push({ frame: cm + rel(cm, markerAt(50, "Day")) + 11 * 3 + 8, name: "chime", vol: 0.26 });
  out.push({ frame: sceneOf("follow").from + rel(sceneOf("follow").from, markerAt(49, "Follow")), name: "click", vol: 0.25 });
  const so = sceneOf("signoff").from;
  out.push({ frame: so + rel(so, markerAt(50, "ইনশাআল্লাহ")), name: "chime", vol: 0.24, rate: 0.9 });
  return out;
};
