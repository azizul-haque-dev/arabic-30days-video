export type IconId =
  | "question"
  | "repeat"
  | "volume"
  | "pointer"
  | "shrug"
  | "userTag"
  | "bell"
  | "shield"
  | "sparkle"
  | "heart";

export interface LessonItem {
  num: number;
  numBn: string;
  arabic: string;
  pronunciation: string;
  meaning: string;
  situation: string;
  icon: IconId;
}

export const LESSONS: LessonItem[] = [
  {
    num: 31,
    numBn: "৩১",
    arabic: "لا والله ما فهمت",
    pronunciation: "লা ওয়াল্লাহ মা ফিহিমত",
    meaning: "সত্যিই বুঝতে পারিনি",
    situation: "কেউ কিছু বললে না বুঝলে",
    icon: "question",
  },
  {
    num: 32,
    numBn: "৩২",
    arabic: "قل مرة ثانية",
    pronunciation: "গুল মাররা তানিয়া",
    meaning: "আরেকবার বলুন",
    situation: "কথা পরিষ্কার না শুনলে",
    icon: "repeat",
  },
  {
    num: 33,
    numBn: "৩৩",
    arabic: "تكلم بشوي لو سمحت",
    pronunciation: "তাকাল্লাম বিশুয়াই লাউ সামাহত",
    meaning: "দয়া করে একটু আস্তে কথা বলুন",
    situation: "কেউ খুব দ্রুত কথা বললে",
    icon: "volume",
  },
  {
    num: 34,
    numBn: "৩৪",
    arabic: "إيش يعني هذا؟",
    pronunciation: "এইশ ইয়ানি হাদা?",
    meaning: "এটার মানে কী?",
    situation: "নতুন কোনো শব্দ বা জিনিস দেখলে",
    icon: "pointer",
  },
  {
    num: 35,
    numBn: "৩৫",
    arabic: "ما أعرف والله",
    pronunciation: "মা আরিফ ওয়াল্লাহ",
    meaning: "আমি সত্যিই জানি না",
    situation: "কোনো কিছুর উত্তর জানা না থাকলে",
    icon: "shrug",
  },
  {
    num: 36,
    numBn: "৩৬",
    arabic: "نسيت اسمه",
    pronunciation: "নাসীত ইসমু",
    meaning: "আমি তার নাম ভুলে গেছি",
    situation: "কারো নাম মনে না পড়লে",
    icon: "userTag",
  },
  {
    num: 37,
    numBn: "৩৭",
    arabic: "ذكرني بعدين",
    pronunciation: "জাক্কিরনি বাদেইন",
    meaning: "আমাকে পরে মনে করিয়ে দিবেন",
    situation: "ব্যস্ততার সময় কোনো কাজের কথা বললে",
    icon: "bell",
  },
  {
    num: 38,
    numBn: "৩৮",
    arabic: "لا تشيل هم",
    pronunciation: "লাত শীল হাম",
    meaning: "কোনো চিন্তা করবেন না",
    situation: "কাউকে আশ্বস্ত করতে বা ভরসা দিতে",
    icon: "shield",
  },
  {
    num: 39,
    numBn: "৩৯",
    arabic: "ربنا يسهل",
    pronunciation: "রাব্বানা ইয়াসাহহিল",
    meaning: "আল্লাহ সহজ করুন",
    situation: "কঠিন কাজে দোয়া বা শুভকামনা জানাতে",
    icon: "sparkle",
  },
  {
    num: 40,
    numBn: "৪০",
    arabic: "أنت رجل طيب",
    pronunciation: "ইনতা রিজ্জাল তাইয়্যিব",
    meaning: "আপনি একজন ভালো মানুষ",
    situation: "কারো ভালো ব্যবহারের প্রশংসা করতে",
    icon: "heart",
  },
];

export const toBn = (n: number | string): string =>
  String(n).replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);
