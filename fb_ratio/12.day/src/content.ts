// src/content.ts
// On-screen content derived from data/day12.srt & script.txt (Day 12 — কেনাকাটা Part 2, Sentences 111–120).

export type IconId =
  | "onlyThis"
  | "shoppingBag"
  | "creditCard"
  | "cashPay"
  | "changeCoins"
  | "keepChange"
  | "receipt"
  | "warrantyShield"
  | "returnBox"
  | "discountTag";

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
    n: 111,
    nBn: "১১১",
    icon: "onlyThis",
    arabic: "جيب هذا بس",
    pronunciation: "জিব হাদা বাস।",
    meaning: "শুধু এটা দিন।",
    situation: "শুধু এই জিনিসটাই নিতে চাইলে?",
    recap: "শুধু এটা দিন",
  },
  {
    n: 112,
    nBn: "১১২",
    icon: "shoppingBag",
    arabic: "أبغى كيس لو سمحت",
    pronunciation: "আবগা কীস লাউ সামাহত।",
    meaning: "দয়া করে একটা ব্যাগ দিন।",
    situation: "কেনাকাটার পর ব্যাগ চাইতে হলে?",
    recap: "একটা ব্যাগ দিন",
  },
  {
    n: 113,
    nBn: "১১৩",
    icon: "creditCard",
    arabic: "تقبلون كرت؟",
    pronunciation: "তাকবালুন কার্ত?",
    meaning: "আপনারা কি কার্ড গ্রহণ করেন?",
    situation: "কার্ডে পেমেন্ট করা যাবে কি না জানতে?",
    recap: "কার্ড গ্রহণ করেন?",
  },
  {
    n: 114,
    nBn: "১১৪",
    icon: "cashPay",
    arabic: "أدفع كاش",
    pronunciation: "আদফা' ক্যাশ।",
    meaning: "আমি নগদ দেব।",
    situation: "নগদ টাকায় বিল দিতে চাইলে?",
    recap: "আমি নগদ দেব",
  },
  {
    n: 115,
    nBn: "১১৫",
    icon: "changeCoins",
    arabic: "معك فكة؟ / معك صرف؟",
    pronunciation: "মাআক ফুক্কা? / মাআক সার্ফ?",
    meaning: "আপনার কাছে খুচরা আছে?",
    situation: "দোকানদারের কাছে খুচরা বা ভাঙতি চাইলে?",
    recap: "খুচরা আছে?",
  },
  {
    n: 116,
    nBn: "১১৬",
    icon: "keepChange",
    arabic: "الباقي لك",
    pronunciation: "আল-বাগি লাক।",
    meaning: "বাকিটা আপনার।",
    situation: "বাকি খুচরা টাকা রেখে দিতে বললে?",
    recap: "বাকিটা আপনার",
  },
  {
    n: 117,
    nBn: "১১৭",
    icon: "receipt",
    arabic: "أبغى فاتورة",
    pronunciation: "আবগা ফাতুরা।",
    meaning: "আমি রসিদ চাই।",
    situation: "কেনাকাটার পর রসিদ বা বিল চাইলে?",
    recap: "আমি রসিদ চাই",
  },
  {
    n: 118,
    nBn: "১১৮",
    icon: "warrantyShield",
    arabic: "هذا فيه ضمان؟",
    pronunciation: "হাদা ফীহ দামান?",
    meaning: "এটার কি ওয়ারেন্টি আছে?",
    situation: "পণ্যটির ওয়ারেন্টি আছে কি না জানতে?",
    recap: "ওয়ারেন্টি আছে?",
  },
  {
    n: 119,
    nBn: "১১৯",
    icon: "returnBox",
    arabic: "أبغى أرجع هذا",
    pronunciation: "আবগা আরাজাআ হাদা।",
    meaning: "আমি এটা ফেরত দিতে চাই।",
    situation: "কেনা জিনিস ফেরত দিতে চাইলে?",
    recap: "এটা ফেরত দিতে চাই",
  },
  {
    n: 120,
    nBn: "১২০",
    icon: "discountTag",
    arabic: "فيه خصم اليوم؟",
    pronunciation: "ফীহ খাসম আল-ইওম?",
    meaning: "আজ কি কোনো ছাড় / ডিসকাউন্ট আছে?",
    situation: "আজ কোনো ছাড় বা ডিসকাউন্ট আছে কি না জানতে?",
    recap: "আজ কোনো ছাড় আছে?",
  },
];

