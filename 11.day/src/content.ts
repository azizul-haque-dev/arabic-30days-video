// src/content.ts
// On-screen content derived strictly from data/day11.srt (Day 11 — কেনাকাটা / Shopping, Sentences 101–110).

export type IconId =
  | "priceTag"
  | "expensive"
  | "discount"
  | "finalPrice"
  | "sizeUp"
  | "sizeDown"
  | "dislike"
  | "colorPalette"
  | "tryOn"
  | "fittingRoom";

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
    n: 101,
    nBn: "১০১",
    icon: "priceTag",
    arabic: "كم سعر هذا؟",
    pronunciation: "কাম সিআর হাদা?",
    meaning: "এটার দাম কত?",
    situation: "কোনো জিনিসের দাম জানতে?",
    recap: "এটার দাম কত?",
  },
  {
    n: 102,
    nBn: "১০২",
    icon: "expensive",
    arabic: "هذا غالي مرة",
    pronunciation: "হাদা গালি মাররা।",
    meaning: "এটা অনেক দামি।",
    situation: "দাম অনেক বেশি মনে হলে?",
    recap: "এটা অনেক দামি",
  },
  {
    n: 103,
    nBn: "১০৩",
    icon: "discount",
    arabic: "نزل السعر شوي",
    pronunciation: "নাজ্জিল আস-সিআর শুয়াই।",
    meaning: "দামটা একটু কমান।",
    situation: "দাম একটু কমাতে বললে?",
    recap: "দামটা একটু কমান",
  },
  {
    n: 104,
    nBn: "১০৪",
    icon: "finalPrice",
    arabic: "كم السعر آخر؟",
    pronunciation: "কাম আস সিআর আখের?",
    meaning: "শেষ দাম কত?",
    situation: "একদম শেষ দাম জানতে চাইলে?",
    recap: "শেষ দাম কত?",
  },
  {
    n: 105,
    nBn: "১০৫",
    icon: "sizeUp",
    arabic: "عندك مقاس أكبر؟",
    pronunciation: "ইনদাক মাগাস আকবার?",
    meaning: "আপনার কাছে বড় size আছে?",
    situation: "পোশাকের বড় size আছে কি না জানতে?",
    recap: "বড় size আছে?",
  },
  {
    n: 106,
    nBn: "১০৬",
    icon: "sizeDown",
    arabic: "أبغى مقاس أصغر",
    pronunciation: "আবগা মাগাস আসগার।",
    meaning: "আমি ছোট size চাই।",
    situation: "ছোট size-এর পোশাক চাইলে?",
    recap: "ছোট size চাই",
  },
  {
    n: 107,
    nBn: "১০৭",
    icon: "dislike",
    arabic: "هذا ما عجبني",
    pronunciation: "হাদা মা আজিবনি।",
    meaning: "এটা আমার পছন্দ হচ্ছে না।",
    situation: "কোনো জিনিস পছন্দ না হলে?",
    recap: "পছন্দ হচ্ছে না",
  },
  {
    n: 108,
    nBn: "১০৮",
    icon: "colorPalette",
    arabic: "عندكم لون ثاني؟",
    pronunciation: "ইনদাকুম লওন তানি?",
    meaning: "আপনাদের কাছে অন্য রং আছে?",
    situation: "অন্য রঙের অপশন দেখতে চাইলে?",
    recap: "অন্য রং আছে?",
  },
  {
    n: 109,
    nBn: "১০৯",
    icon: "tryOn",
    arabic: "أبغى أجرب هذا",
    pronunciation: "আবগা আজাররিব হাদা।",
    meaning: "আমি এটা try করতে চাই।",
    situation: "পোশাক বা জিনিস try করতে চাইলে?",
    recap: "এটা try করতে চাই",
  },
  {
    n: 110,
    nBn: "১১০",
    icon: "fittingRoom",
    arabic: "وين غرفة القياس؟",
    pronunciation: "ওয়েন গুরফাত আল গিয়াস?",
    meaning: "ট্রায়াল রুম কোথায়?",
    situation: "ট্রায়াল রুম কোথায় জানতে চাইলে?",
    recap: "ট্রায়াল রুম কোথায়?",
  },
];

