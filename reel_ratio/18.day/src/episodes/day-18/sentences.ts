// Sentence data lives HERE only — never hard-coded inside components.
// Bengali pronunciation + Bengali meaning are verbatim from the master prompt (do not edit silently).
export type SectionId = "restaurant" | "workplace";

export type IllustrationKey =
  | "deliciousFood" | "dessert" | "mangoJuice" | "iceGlass" | "chefCompliment"
  | "goingToWork" | "morningShift" | "finishWork" | "askManager" | "sponsorNoReply";

export type SentenceDef = {
  id: number;
  section: SectionId;
  titleEn: string;
  pron: string; // Bengali pronunciation (primary element)
  arabic: string; // Gulf Arabic script rendering
  meaning: string; // Bengali meaning
  usage?: string; // optional usage explanation narration (shown on screen)
  illustration: IllustrationKey;
  concept: string;
  cues: { number: string; pron1: string; pron2: string; meaning: string; usage?: string };
};

const cue = (n: number) => ({
  number: `s${n}-number`, pron1: `s${n}-pron1`, pron2: `s${n}-pron2`, meaning: `s${n}-meaning`,
});

export const SENTENCES: SentenceDef[] = [
  { id: 171, section: "restaurant", titleEn: "Delicious Food", pron: "হাদা লাজিজ মাররা", arabic: "هذا لذيذ مرة", meaning: "এটা খুবই সুস্বাদু।", illustration: "deliciousFood", concept: "Customer enjoys a meal", cues: cue(171) },
  { id: 172, section: "restaurant", titleEn: "Asking for Dessert", pron: "আবগা হালা", arabic: "أبغى حلى", meaning: "আমি মিষ্টি চাই।", illustration: "dessert", concept: "Customer asks waiter for dessert", cues: cue(172) },
  { id: 173, section: "restaurant", titleEn: "Asking for Mango Juice", pron: "ইন্দাকুম আসির মাঙ্গো?", arabic: "عندكم عصير مانجو؟", meaning: "আপনাদের কাছে আমের জুস আছে?", illustration: "mangoJuice", concept: "Customer asks about mango juice", cues: cue(173) },
  { id: 174, section: "restaurant", titleEn: "Asking for a Glass of Ice", pron: "আবগা কাসাত তালজ", arabic: "أبغى كاسة ثلج", meaning: "আমি এক গ্লাস বরফ চাই।", illustration: "iceGlass", concept: "Glass with ice cubes", cues: cue(174) },
  {
    id: 175, section: "restaurant", titleEn: "Complimenting Someone's Cooking", pron: "তিসলাম ইয়াদদাক", arabic: "تسلم يدك",
    meaning: "আপনার হাত ভালো থাকুক।", usage: "কেউ দারুণ রান্না করলে তাকে এটি বলতে পারেন।",
    illustration: "chefCompliment", concept: "Chef cooks, someone appreciates",
    cues: { ...cue(175), usage: "s175-usage" },
  },
  { id: 176, section: "workplace", titleEn: "Going to Work", pron: "আনা রায়েহ আশ শুগুল", arabic: "أنا رايح الشغل", meaning: "আমি কাজে যাচ্ছি।", illustration: "goingToWork", concept: "Employee walks to work", cues: cue(176) },
  { id: 177, section: "workplace", titleEn: "Morning Shift", pron: "দাওয়ামি মিন আস-সুবাহ", arabic: "دوامي من الصباح", meaning: "আমার ডিউটি সকাল থেকে।", illustration: "morningShift", concept: "Sunrise, duty starts", cues: cue(177) },
  { id: 178, section: "workplace", titleEn: "Finishing Work", pron: "খাল্লাসত আদ দাওয়াম", arabic: "خلصت الدوام", meaning: "আমার ডিউটি শেষ হয়েছে।", illustration: "finishWork", concept: "Employee finishes the day", cues: cue(178) },
  { id: 179, section: "workplace", titleEn: "Asking for the Manager", pron: "আল মুদির মওজুদ?", arabic: "المدير موجود؟", meaning: "ম্যানেজার কি আছে?", illustration: "askManager", concept: "Employee asks at reception", cues: cue(179) },
  { id: 180, section: "workplace", titleEn: "Sponsor Did Not Respond", pron: "আল কাফিল মা রাদ্দ", arabic: "الكفيل ما رد", meaning: "কফিল উত্তর দেয়নি।", illustration: "sponsorNoReply", concept: "Unanswered call", cues: cue(180) },
];

export const SECTIONS: Record<SectionId, { titleEn: string; titleBn: string; chip: string; cue: string; range: string }> = {
  restaurant: { titleEn: "Restaurant Arabic", titleBn: "রেস্টুরেন্টের প্রয়োজনীয় বাক্য", chip: "Restaurant", cue: "section-restaurant", range: "171–175" },
  workplace: { titleEn: "Workplace Arabic", titleBn: "কর্মক্ষেত্রের প্রয়োজনীয় বাক্য", chip: "Workplace", cue: "section-workplace", range: "176–180" },
};
