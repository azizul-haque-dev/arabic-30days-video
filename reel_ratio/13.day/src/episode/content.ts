/**
 * Day 13 — episode-specific prose and mapping to the ORIGINAL SRT.
 * Reusable components never contain any of this text.
 * Pronunciations and meanings are copied exactly as supplied (including the
 * two different versions in sentence 122 and the spelling "মাংশ" in 124).
 */
import { episodeConfig as E } from "../config/episode";
import type { IllustrationKey } from "../illustrations/compose";
import type { TimeRef, TimingOverrides } from "../timeline/resolve";
import { toBn } from "../utils/bn";

export type PronVariant = {
  text: string;
  label: string;
  /** SRT cues in which this pronunciation is spoken (first = entrance, others = repeat pulses) */
  cues: number[];
};

export type SentenceContent = {
  number: number;
  /** SRT cue where the narrator says "Sentence N," */
  labelCue: number | TimeRef;
  /** SRT cue whose text holds the Arabic (text before the first "।") */
  arabicCue: number;
  pronunciations: PronVariant[];
  meaning: string;
  meaningAt: TimeRef;
  illustration: IllustrationKey;
  qty?: string;
};

const LABEL = { one: "উচ্চারণ", first: "প্রথম উচ্চারণ", second: "দ্বিতীয় উচ্চারণ" };

export const sentences: SentenceContent[] = [
  {
    number: 121, labelCue: 6, arabicCue: 7,
    pronunciations: [{ text: "আস-সুক যাহমা মাররা।", label: LABEL.one, cues: [7] }],
    meaning: "বাজারে অনেক ভিড়।", meaningAt: { cue: 8 }, illustration: "crowdedMarket",
  },
  {
    number: 122, labelCue: 9, arabicCue: 10,
    pronunciations: [
      { text: "ফেইন আগরাব বাক্কালা?", label: LABEL.first, cues: [10] },
      { text: "ফেইন আকরাব বাক্কালা?", label: LABEL.second, cues: [11] },
    ],
    meaning: "সবচেয়ে কাছের মুদি দোকান কোথায়?", meaningAt: { cue: 12 }, illustration: "nearestShop",
  },
  {
    number: 123, labelCue: 13, arabicCue: 14,
    pronunciations: [{ text: "আবগা কিলো রুজ্জ।", label: LABEL.one, cues: [14, 15] }],
    meaning: "আমি এক কেজি চাল চাই।", meaningAt: { cue: 16 }, illustration: "buyRice", qty: "1 KG",
  },
  {
    number: 124, labelCue: 18, arabicCue: 19,
    pronunciations: [{ text: "আত'তিনী নুস কিলো লাহাম।", label: LABEL.one, cues: [19] }],
    meaning: "আমাকে আধা কেজি মাংশ দিন।", meaningAt: { cue: 20 }, illustration: "buyMeat", qty: "½ KG",
  },
  {
    number: 125, labelCue: 21, arabicCue: 22,
    pronunciations: [{ text: "হাদা তাজাজ?", label: LABEL.one, cues: [22, 23] }],
    meaning: "এটা কি তাজা?", meaningAt: { cue: 24 }, illustration: "freshCheck",
  },
  {
    number: 126, labelCue: 25, arabicCue: 26,
    pronunciations: [{ text: "আবগা লেমুজিন", label: LABEL.one, cues: [26, 27] }],
    meaning: "একটা ট্যাক্সি চাই।", meaningAt: { cue: 28 }, illustration: "hailTaxi",
  },
  {
    number: 127, labelCue: 29, arabicCue: 30,
    pronunciations: [{ text: "ওয়াদ্দীনি আল-মাতার।", label: LABEL.one, cues: [30, 31] }],
    meaning: "আমাকে এয়ারপোর্টে নিয়ে যান।", meaningAt: { cue: 31, marker: "অর্থ," }, illustration: "toAirport",
  },
  {
    number: 128, labelCue: 32, arabicCue: 33,
    pronunciations: [{ text: "বিকাম আল-মিশওয়ার?", label: LABEL.one, cues: [33, 34] }],
    meaning: "ট্রিপের ভাড়া কত?", meaningAt: { cue: 34, marker: "অর্থ," }, illustration: "askFare",
  },
  {
    number: 129, labelCue: 35, arabicCue: 36,
    pronunciations: [{ text: "শাগ্গিল আল-আদ্দাদ।", label: LABEL.one, cues: [36] }],
    meaning: "মিটার চালু করুন।", meaningAt: { cue: 37, marker: "অর্থ," }, illustration: "meterOn",
  },
  {
    number: 130, labelCue: { cue: 37, marker: "Sentence 130" }, arabicCue: 38,
    pronunciations: [{ text: "ওয়াগ্গিফ হিনা লাও সামাহত।", label: LABEL.one, cues: [38] }],
    meaning: "দয়া করে এখানে থামুন।", meaningAt: { cue: 39, marker: "অর্থ," }, illustration: "stopHere",
  },
];

const count = E.sentenceEnd - E.sentenceStart + 1;

export const texts = {
  dayBadge: `DAY ${E.episodeNumber}`,
  series: `${toBn(E.totalDays)} দিনে ${toBn(E.totalSentences)}টি Survival Arabic`,
  hook: "গালফের দেশগুলোতে বাজার করতে বা ট্যাক্সিতে যাতায়াত করতে গিয়ে আরবি বলতে আটকে যান?",
  brand: `চিন্তা নেই! আপনার প্রতিদিনের আরবি শেখার সঙ্গী ${E.brandName}!`,
  episodeA: `${toBn(E.totalDays)} দিনের Survival Arabic সিরিজের আজ ${toBn(E.episodeNumber)}তম দিন।`,
  episodeB: `আলহামদুলিল্লাহ, আমরা ইতিমধ্যে ${toBn(E.previousCompletedSentences)}টি দরকারি বাক্য শিখেছি।`,
  topicA: `আজ শিখব ${E.topicBn}তে ব্যবহার করার মতো আরও ${toBn(count)}টি বাক্য।`,
  topicB: "চলুন শুরু করি!",
  summaryTitle: `${E.brandName}-এর সঙ্গে আজকের ${toBn(count)}টি দরকারি আরবি বাক্য শেখা শেষ!`,
  summaryLine: `আলহামদুলিল্লাহ, ${toBn(E.totalSentences)}টি বাক্যের মধ্যে আমরা ${toBn(E.completedSentences)}টি শিখে ফেলেছি।`,
  ctaA: `প্রতিদিন নতুন আরবি বাক্য শিখতে ${E.brandName} পেজটি ফলো করুন`,
  ctaB: "এবং কমেন্টে লিখুন:",
  follow: "Follow",
  outro: `দেখা হবে Day ${E.nextEpisodeNumber}-তে, ইনশাআল্লাহ!`,
  nextBadge: `DAY ${E.nextEpisodeNumber}`,
};

/** Scene start points, all expressed against the original SRT. End = next start. */
export const sceneStarts = {
  hook: { sec: 0 } as TimeRef,
  brand: { cue: 2 } as TimeRef,
  episodeIntro: { cue: 3 } as TimeRef,
  topicIntro: { cue: 5 } as TimeRef,
  summary: { cue: 39, marker: E.brandName } as TimeRef,
  cta: { cue: 41 } as TimeRef,
  outro: { cue: 42, marker: "দেখা হবে" } as TimeRef,
};

/** Secondary beats inside intro/outro scenes. */
export const beats = {
  episodeLineB: { cue: 4 } as TimeRef,
  topicLineB: { cue: 5, marker: "চলুন শুরু করি" } as TimeRef,
  summaryLine: { cue: 40 } as TimeRef,
  ctaComment: { cue: 42 } as TimeRef,
};

/**
 * SRT has no word-level timing. Where a scene boundary sits INSIDE a cue,
 * the builder estimates it proportionally. Replace those estimates with real
 * values (key "<cue>:<marker>" -> seconds) once word timestamps are available.
 *
 * Values below were measured from the actual voiceover.wav audio by detecting
 * silence/onset at each boundary (November 2026).
 */
export const timingOverrides: TimingOverrides = {
  // cue 5: "চলুন শুরু করি" starts at ~21.65 s (silence ends at ~21.60 s)
  "5:চলুন শুরু করি": 21.65,
  // cue 37: "Sentence 130" starts at ~106.95 s (measured from cue 37 onset at ~104.70 s, "Sentence 130" ~2.25s in)
  "37:Sentence 130": 106.95,
  // cue 39: "Arabic Master" starts at ~115.95 s (silence clears ~115.90 s, speech re-enters ~116.00 s)
  "39:Arabic Master": 115.95,
  // cue 42: "দেখা হবে" starts at ~131.55 s (silence from ~131.10 s; speech re-enters ~131.55 s)
  "42:দেখা হবে": 131.55,
  // cue 7: second occurrence of Arabic (repeat pulse) at ~28.25 s (silence ends ~28.20 s)
  // Not a marker key — repeat pulses come from secondOccurrence(), not timingOverrides.
  // cue 31: "অর্থ," (meaning of sentence 127) at ~87.65 s (rms drops ~87.60 s, resumes ~87.75 s)
  "31:অর্থ,": 87.65,
  // cue 34: "অর্থ," (meaning of sentence 128) at ~96.05 s (rms dips then resumes ~96.05 s)
  "34:অর্থ,": 96.05,
};
