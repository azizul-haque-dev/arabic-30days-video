import { CUES } from "../data/cues";
import { F, MOTION } from "../theme";

// ── SRT → টোকেন-টাইমিং। সব হিসাব SRT থেকে, হাতে বসানো কিছু নেই ──
const AR_RAW = "[আরবি ভাষা]";
const AR = "§AR§";
export type Tok = { cue: number; text: string; ar: boolean; s: number; e: number };

const parsed = CUES.map((c) => ({
  c,
  words: c.text.replace(AR_RAW, ` ${AR} `).split(/\s+/).filter(Boolean),
}));
const wlen = (w: string) => w.length + 1;
const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);

// বলার গতি: আরবি-ছাড়া cue থেকে; আরবি অংশের ওজন: আরবি-সহ cue-র অবশিষ্ট সময়ের মধ্যমা
const plain = parsed.filter((p) => !p.words.includes(AR));
const rate = sum(plain.map((p) => sum(p.words.map(wlen)))) / sum(plain.map((p) => p.c.end - p.c.start));
const arDurs = parsed
  .filter((p) => p.words.includes(AR) && p.words.length > 1)
  .map((p) => p.c.end - p.c.start - sum(p.words.filter((w) => w !== AR).map(wlen)) / rate)
  .sort((a, b) => a - b);
const arWeight = Math.max(0.8, arDurs[Math.floor(arDurs.length / 2)]) * rate;

export const tokens: Tok[] = parsed.flatMap(({ c, words }) => {
  const ws = words.map((w) => (w === AR ? arWeight : wlen(w)));
  const total = sum(ws);
  let cum = 0;
  return words.map((w, i) => {
    const s = c.start + (cum / total) * (c.end - c.start);
    cum += ws[i];
    return { cue: c.index, text: w, ar: w === AR, s, e: c.start + (cum / total) * (c.end - c.start) };
  });
});

export const tokIn = (cue: number, text: string): Tok => {
  const t = tokens.find((x) => x.cue === cue && x.text.startsWith(text));
  if (!t) throw new Error(`token not found: cue ${cue} "${text}"`);
  return t;
};
const sentenceToks = tokens.filter((t) => t.text === "Sentence");
const arToks = tokens.filter((t) => t.ar);
const meaningToks = tokens.filter((t) => t.text.startsWith("অর্থ"));
if (sentenceToks.length !== 10 || arToks.length !== 10 || meaningToks.length !== 10) {
  throw new Error(`marker mismatch ${sentenceToks.length}/${arToks.length}/${meaningToks.length}`);
}

// ── সিন-সীমা: cue / বাক্য-মার্কারে মেলে ──
const cueStart = (n: number) => CUES.find((c) => c.index === n)!.start;
export const MAJOR_WIPES = ["brand", "s11", "recap", "cta", "outro"];
const marks: { id: string; sec: number; k?: number }[] = [
  { id: "hook", sec: 0 },
  { id: "brand", sec: cueStart(2) },
  { id: "progress10", sec: cueStart(3) },
  { id: "journey", sec: cueStart(4) },
  ...sentenceToks.map((t, k) => ({ id: `s${11 + k}`, sec: t.s, k })),
  { id: "recap", sec: tokIn(16, "Arabic").s },
  { id: "progress20", sec: cueStart(17) },
  { id: "contrast", sec: cueStart(18) },
  { id: "cta", sec: cueStart(19) },
  { id: "outro", sec: tokIn(20, "দেখা").s },
];

export const TOTAL = F(CUES[CUES.length - 1].end);
export type Scene = { id: string; from: number; dur: number; k?: number; last: boolean; noExit: boolean };
export const SCENES: Scene[] = marks.map((m, i) => {
  const from = i === 0 ? 0 : F(m.sec) - MOTION.lead;
  const nextFrom = i === marks.length - 1 ? TOTAL : F(marks[i + 1].sec) - MOTION.lead;
  const last = i === marks.length - 1;
  // পরের সিনে মেজর wipe থাকলে: ওভারল্যাপ/এক্সিট নেই — wipe-এর নিচে কেটে যায়
  const noExit = !last && MAJOR_WIPES.includes(marks[i + 1].id);
  return { id: m.id, from, dur: nextFrom - from + (last || noExit ? 0 : MOTION.overlap), k: m.k, last, noExit };
});
const sc = (id: string) => SCENES.find((s) => s.id === id)!;
// টোকেনের সময় → সিনের লোকাল ফ্রেম (ভিজ্যুয়াল ~lead ফ্রেম আগে)
const r = (id: string, t: Tok) => Math.max(0, F(t.s) - sc(id).from - MOTION.lead);

export const BEATS = {
  hook: { relief: r("hook", tokIn(1, "চিন্তা")), brandLine: r("hook", tokIn(1, "আপনার")) },
  brand: { master: r("brand", tokIn(2, "Arabic")), series: r("brand", tokIn(2, "৩০")), day: r("brand", tokIn(2, "দ্বিতীয়")) },
  progress10: { total: r("progress10", tokIn(3, "তিনশোটি")), learned: r("progress10", tokIn(3, "দশটি")), today: r("progress10", tokIn(3, "আজ")) },
  journey: { from: r("journey", tokIn(4, "এগারো")), to: r("journey", tokIn(4, "বিশ")), trip: r("journey", tokIn(4, "যাত্রা")) },
  sentences: sentenceToks.map((_, k) => {
    const id = `s${11 + k}`;
    const meaning = r(id, meaningToks[k]);
    return { phrase: Math.min(r(id, arToks[k]), Math.max(8, meaning - 24)), meaning };
  }),
  recap: { count: r("recap", tokIn(16, "দশটি")), done: r("recap", tokIn(16, "শেষ")) },
  progress20: { twenty: r("progress20", tokIn(17, "বিশটি")), remember: r("progress20", tokIn(17, "মনে")) },
  contrast: { left: r("contrast", tokIn(18, "শুধু")), strike: r("contrast", tokIn(18, "হবে")), right: r("contrast", tokIn(18, "প্রতিদিনের")) },
  cta: { follow: r("cta", tokIn(19, "ফলো")), comment: r("cta", tokIn(19, "কমেন্টে")), done: r("cta", tokIn(20, "done")) },
  outro: { day3: r("outro", tokIn(20, "Day")), insha: r("outro", tokIn(20, "ইনশাআল্লাহ")) },
};

