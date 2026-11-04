// src/content.ts
// On-screen content derived from script.txt and day10.srt.

export type IconId =
  | "order"
  | "fridge"
  | "bread"
  | "groceries"
  | "coldTea"
  | "salt"
  | "dinner"
  | "lightFood"
  | "washHands"
  | "bonAppetit";

export interface SentenceItem {
  n: number;
  nBn: string;
  icon: IconId;
  arabic: string;
  pronunciation: string;
  meaning: string;
  situation: string;
  recap: string;
}

export const SENTENCES: SentenceItem[] = [
  {
    n: 91,
    nBn: "৯১",
    icon: "order",
    arabic: "هذا طلب من المطعم",
    pronunciation: "হাদা তালব মিন আল-মাতআম",
    meaning: "এটা রেস্টুরেন্ট থেকে আনা অর্ডার।",
    situation: "রেস্টুরেন্টের অর্ডার আসলে বলতে?",
    recap: "রেস্টুরেন্ট অর্ডার",
  },
  {
    n: 92,
    nBn: "৯২",
    icon: "fridge",
    arabic: "حط الأغراض في الثلاجة",
    pronunciation: "হুত্ত আল-আগরাদ ফিথ-থাল্লাজা",
    meaning: "জিনিসগুলো ফ্রিজে রাখুন।",
    situation: "বাজার ফ্রিজে রাখতে বলতে?",
    recap: "ফ্রিজে রাখুন",
  },
  {
    n: 93,
    nBn: "৯৩",
    icon: "bread",
    arabic: "خلص العيش من البيت",
    pronunciation: "খালাস আল-আয়েশ মিন আল-বেইত",
    meaning: "বাসায় রুটি শেষ হয়ে গেছে।",
    situation: "বাসার রুটি ফুরিয়ে গেলে?",
    recap: "রুটি শেষ",
  },
  {
    n: 94,
    nBn: "৯৪",
    icon: "groceries",
    arabic: "جيب معاك حليب وبيض",
    pronunciation: "জীব মা'আক হালীব ও বেদ",
    meaning: "আসার সময় দুধ আর ডিম নিয়ে আসবেন।",
    situation: "দুধ ও ডিম আনতে বলতে?",
    recap: "দুধ ও ডিম আনা",
  },
  {
    n: 95,
    nBn: "৯৫",
    icon: "coldTea",
    arabic: "الشاهي بارد، سوي غيره",
    pronunciation: "আশ-শাহী বারিদ, সাওই গাই’য়েরাহ",
    meaning: "চা ঠান্ডা হয়ে গেছে, আরেক কাপ বানান।",
    situation: "চা ঠান্ডা হলে নতুন করে চাইতে?",
    recap: "চা ঠান্ডা হয়েছে",
  },
  {
    n: 96,
    nBn: "৯৬",
    icon: "salt",
    arabic: "لا تكثر الملح في الأكل",
    pronunciation: "লাত কাত’তের আল-মালাহ ফিল-আকেল",
    meaning: "খাবারে বেশি লবণ দেবেন না।",
    situation: "খাবারে কম লবণ দিতে বলতে?",
    recap: "বেশি লবণ না",
  },
  {
    n: 97,
    nBn: "৯৭",
    icon: "dinner",
    arabic: "ايش تبغى تتعشى؟",
    pronunciation: "ঈশ তিবগা তিত’আশশা?",
    meaning: "রাতে কী খেতে চান?",
    situation: "রাতের খাবারের পছন্দ জানতে?",
    recap: "রাতে কী খাবেন",
  },
  {
    n: 98,
    nBn: "৯৮",
    icon: "lightFood",
    arabic: "أي شيء خفيف",
    pronunciation: "আই শাই খাফীফ",
    meaning: "হালকা কিছু হলেই হবে।",
    situation: "হালকা খাবারের উত্তর দিতে?",
    recap: "হালকা কিছু",
  },
  {
    n: 99,
    nBn: "৯৯",
    icon: "washHands",
    arabic: "غسل يدك قبل الأكل",
    pronunciation: "গাসসিল ইয়াদ’দাক গাবল আল-আকল",
    meaning: "খাওয়ার আগে হাত ধুয়ে নিন।",
    situation: "খাওয়ার আগে হাত ধুতে বলতে?",
    recap: "হাত ধুয়ে নিন",
  },
  {
    n: 100,
    nBn: "১০০",
    icon: "bonAppetit",
    arabic: "بالعافية عليكم",
    pronunciation: "বিল-আফিয়া আলাইকুম",
    meaning: "খাবারটি আপনাদের জন্য উপভোগ্য হোক।",
    situation: "খাবারের পর শুভকামনা জানাতে?",
    recap: "তৃপ্তি করে খান",
  },
];

