/**
 * Day 20 — episode-specific content (kept separate from reusable components).
 * Pronunciations are copied EXACTLY from the SRT. Arabic + meanings come from the
 * master prompt reference table. `srt` values are SRT entry numbers (1-based).
 */
export type IllustrationKey =
  | "notMyTask" | "organized" | "meeting" | "equipment" | "iqamaExpired"
  | "iqamaRenew" | "license" | "jobSearch" | "salary" | "blessing";

export type SentenceConfig = {
  no: number;
  pron: string;
  arabic: string;
  meaning: string;
  illustration: IllustrationKey;
  srt: {
    label: number;
    setup: number;
    lead?: number;
    pron1: number;
    pron2: number;
    /** undefined = no meaning entry in the SRT (sentence 200) */
    meaning?: number;
  };
};

export const EPISODE = {
  brand: "Arabic Master",
  series: "30-Day Survival Arabic",
  day: 20,
  total: 300,
  previous: 190,
  current: 200,
  topic: "Workplace Communication, Meetings & Essential Documents",
};

export const SENTENCES: SentenceConfig[] = [
  { no: 191, pron: "হাদা মু শুগলি", arabic: "هذا مو شغلي", meaning: "এটা আমার কাজ না।", illustration: "notMyTask", srt: { label: 13, setup: 14, lead: 15, pron1: 16, pron2: 17, meaning: 18 } },
  { no: 192, pron: "শুগলি হেনা মুরাত্তাব", arabic: "شغلي هنا مرتب", meaning: "এখানে আমার কাজ গোছানো।", illustration: "organized", srt: { label: 19, setup: 20, pron1: 21, pron2: 22, meaning: 23 } },
  { no: 193, pron: "ফিহ ইজতেমা আস-সা'আ আশারা", arabic: "فيه اجتماع الساعة عشرة", meaning: "১০টায় মিটিং আছে।", illustration: "meeting", srt: { label: 24, setup: 25, lead: 26, pron1: 27, pron2: 28, meaning: 29 } },
  { no: 194, pron: "আল-মুইদ্দাত জাহজা", arabic: "المعدات جاهزة", meaning: "যন্ত্রপাতি প্রস্তুত।", illustration: "equipment", srt: { label: 30, setup: 31, pron1: 32, pron2: 33, meaning: 34 } },
  { no: 195, pron: "আল-ইকামা মুনতাহিয়া", arabic: "الإقامة منتهية", meaning: "ইকামার মেয়াদ শেষ।", illustration: "iqamaExpired", srt: { label: 35, setup: 36, pron1: 37, pron2: 38, meaning: 39 } },
  { no: 196, pron: "লাজিম আজাদ্দিদ আল-ইকামা", arabic: "لازم أجدد الإقامة", meaning: "ইকামা নবায়ন করতে হবে।", illustration: "iqamaRenew", srt: { label: 40, setup: 41, pron1: 42, pron2: 43, meaning: 44 } },
  { no: 197, pron: "ইনদি রুখসা সওয়াগা", arabic: "عندي رخصة سواقة", meaning: "আমার ড্রাইভিং লাইসেন্স আছে।", illustration: "license", srt: { label: 45, setup: 46, pron1: 47, pron2: 48, meaning: 49 } },
  { no: 198, pron: "আবগা শুগুল থানি", arabic: "أبغى شغل ثاني", meaning: "আমার অন্য কাজ চাই।", illustration: "jobSearch", srt: { label: 50, setup: 51, pron1: 52, pron2: 53, meaning: 54 } },
  { no: 199, pron: "আর-রাতিব কয়েস", arabic: "الراتب كويس", meaning: "বেতন ভালো।", illustration: "salary", srt: { label: 55, setup: 56, pron1: 57, pron2: 58, meaning: 59 } },
  // SRT has no spoken meaning entry for 200 → meaning is revealed when the 2nd pronunciation starts (flagged in README).
  { no: 200, pron: "আল্লাহ ইয়ারজুগাক", arabic: "الله يرزقك", meaning: "আল্লাহ আপনাকে রিজিক দান করুন।", illustration: "blessing", srt: { label: 60, setup: 61, pron1: 62, pron2: 63 } },
];

/** Scene boundaries expressed as SRT entry numbers. */
export const SCENES = {
  hook: { from: 1, to: 8 },
  intro: { from: 9, to: 12 },
  milestone: { from: 64, to: 69 },
};
