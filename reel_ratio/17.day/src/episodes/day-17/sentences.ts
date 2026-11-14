import type { SentenceConfig } from "../../types";

/**
 * Bengali pronunciation / Arabic / meaning are copied verbatim from the master prompt.
 * `units` split pronunciation at the narrator's pauses ("...") and word borders so the
 * Arabic always sits under the exact Bengali unit it belongs to.
 * `cues` are 1-based SRT cue numbers (public/subtitles/day-17.srt).
 */
export const sentences: SentenceConfig[] = [
  {
    no: 161,
    slug: "asking-for-the-bill",
    titleEn: "Asking for the Bill",
    units: [
      { bn: "আল-হিসাব", ar: "الحساب" },
      { bn: "লাও সামাহত।", ar: "لو سمحت" },
    ],
    meaning: "দয়া করে বিলটা দিন।",
    illustration: "ask-bill",
    cues: { intro: 8, say1: 10, say2: 11, meaning: 12 },
  },
  {
    no: 162,
    slug: "confirming-your-order",
    titleEn: "Confirming Your Order",
    units: [
      { bn: "হাদা", ar: "هذا" },
      { bn: "হাগ্গি।", ar: "حقي" },
    ],
    meaning: "এটা আমার অর্ডার।",
    illustration: "my-order",
    cues: { intro: 13, say1: 15, say2: 16, meaning: 17 },
  },
  {
    no: 163,
    slug: "order-has-not-arrived",
    titleEn: "Order Has Not Arrived",
    units: [
      { bn: "মা জা", ar: "ما جا" },
      { bn: "ত্বলাবি।", ar: "طلبي" },
    ],
    meaning: "আমার অর্ডার আসেনি।",
    illustration: "no-order",
    cues: { intro: 18, say1: 20, say2: 21, meaning: 22 },
  },
  {
    no: 164,
    slug: "cold-food",
    titleEn: "Cold Food",
    units: [
      { bn: "আল-আকেল", ar: "الأكل" },
      { bn: "বারিদ।", ar: "بارد" },
    ],
    meaning: "খাবার ঠান্ডা।",
    illustration: "cold-food",
    cues: { intro: 23, say1: 25, say2: 26, meaning: 27 },
  },
  {
    no: 165,
    slug: "extra-bread",
    titleEn: "Extra Bread",
    units: [
      { bn: "আবগা", ar: "أبغى" },
      { bn: "খুবজ যিয়াদা।", ar: "خبز زيادة" },
    ],
    meaning: "আমি বাড়তি রুটি চাই।",
    illustration: "extra-bread",
    cues: { intro: 28, say1: 30, say2: 31, meaning: 32 },
  },
  {
    no: 166,
    slug: "missing-spoon",
    titleEn: "Missing Spoon",
    units: [
      { bn: "নাগিস", ar: "ناقص" },
      { bn: "মিলআগা।", ar: "ملعقة" },
    ],
    meaning: "একটা চামচ কম আছে।",
    illustration: "missing-spoon",
    cues: { intro: 33, say1: 35, say2: 36, meaning: 37 },
  },
  {
    no: 167,
    slug: "packing-leftover-food",
    titleEn: "Packing Leftover Food",
    units: [
      { bn: "আল-বাগি", ar: "الباقي" },
      { bn: "আবগা", ar: "أبغاه" },
      { bn: "সাফারি।", ar: "سفري" },
    ],
    meaning: "বাকিটা প্যাক করে দিন।",
    illustration: "pack-leftover",
    cues: { intro: 38, say1: 40, say2: 41, meaning: 42 },
  },
  {
    no: 168,
    slug: "takeaway-order",
    titleEn: "Takeaway Order",
    units: [
      { bn: "আবগা", ar: "أبغى" },
      { bn: "সাফারি।", ar: "سفري" },
    ],
    meaning: "আমি টেকওয়ে চাই।",
    illustration: "takeaway",
    cues: { intro: 43, say1: 45, say2: 46, meaning: 47 },
  },
  {
    no: 169,
    slug: "reserved-table",
    titleEn: "Reserved Table?",
    units: [
      { bn: "আত-তাওলা", ar: "الطاولة" },
      { bn: "মাহজুযা?", ar: "محجوزة؟" },
    ],
    meaning: "টেবিলটি কি রিজার্ভ?",
    illustration: "reserved-table",
    cues: { intro: 48, say1: 50, say2: 51, meaning: 52 },
  },
  {
    no: 170,
    slug: "table-for-two",
    titleEn: "Table for Two",
    units: [
      { bn: "তাওলা", ar: "طاولة" },
      { bn: "লি ইথনিন।", ar: "لاثنين" },
    ],
    meaning: "দুজনের জন্য টেবিল।",
    illustration: "table-for-two",
    cues: { intro: 53, say1: 55, say2: 56, meaning: 57 },
  },
];
