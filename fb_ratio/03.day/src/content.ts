// src/content.ts
// On-screen content derived from data/day3.srt (Day 3 — আড্ডা ও আপ্যায়নের কথা, Sentences 21–30).

export type IconId =
  | "leaveDoor"
  | "relaxCup"
  | "homeWelcome"
  | "cityLight"
  | "sunGlow"
  | "speakArabic"
  | "littleBit"
  | "clearSpeech"
  | "questionBubble"
  | "understoodCheck";

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
    n: 21,
    nBn: "২১",
    icon: "leaveDoor",
    arabic: "عن إذنك أنا أمشي",
    pronunciation: "আন ইযনাক আনা আমশি।",
    meaning: "অনুমতি দিলে এবার আমি যাই।",
    situation: "আড্ডা শেষে ভদ্রভাবে বিদায় নিতে চাইলে?",
    recap: "অনুমতি দিলে আমি যাই",
  },
  {
    n: 22,
    nBn: "২২",
    icon: "relaxCup",
    arabic: "خذ راحتك",
    pronunciation: "খুদ রাহতাক।",
    meaning: "নিজের মতো আরাম করে থাকুন।",
    situation: "মেহমান বা বন্ধুকে আরাম করে বসতে বললে?",
    recap: "আরাম করে থাকুন",
  },
  {
    n: 23,
    nBn: "২৩",
    icon: "homeWelcome",
    arabic: "البيت بيتك",
    pronunciation: "আল-বেইত বেইতাক।",
    meaning: "এটা তো আপনারই বাড়ি।",
    situation: "বাসায় মেহমান এলে আন্তরিকভাবে স্বাগত জানাতে?",
    recap: "এটা আপনারই বাড়ি",
  },
  {
    n: 24,
    nBn: "২৪",
    icon: "cityLight",
    arabic: "نورت جدة",
    pronunciation: "নাওয়ার্ত জিদ্দা।",
    meaning: "আপনার আসায় জেদ্দা আলোকিত হলো।",
    situation: "প্রিয় মানুষ বা অতিথি শহরে এলে খুশি হয়ে বলুন?",
    recap: "জেদ্দা আলোকিত হলো",
  },
  {
    n: 25,
    nBn: "২৫",
    icon: "sunGlow",
    arabic: "النور نورك",
    pronunciation: "আন-নূর নূরাক।",
    meaning: "এ আলো তো আপনারই।",
    situation: "কেউ “নাওয়ার্ত” বলে স্বাগত জানালে উত্তরে বলুন?",
    recap: "এ আলো আপনারই",
  },
  {
    n: 26,
    nBn: "২৬",
    icon: "speakArabic",
    arabic: "تعرف تتكلم عربي؟",
    pronunciation: "তাআররিফ তিতকাল্লাম আরাবি?",
    meaning: "আপনি কি আরবি বলতে পারেন?",
    situation: "কেউ আরবি বলতে পারে কি না জানতে চাইলে?",
    recap: "আরবি বলতে পারেন?",
  },
  {
    n: 27,
    nBn: "২৭",
    icon: "littleBit",
    arabic: "أتكلم شوية بس",
    pronunciation: "আতকাল্লাম শুয়াইয়া বাস।",
    meaning: "অল্প অল্প পারি।",
    situation: "কেউ আরবি পারেন কি না জিজ্ঞেস করলে উত্তরে?",
    recap: "অল্প অল্প পারি",
  },
  {
    n: 28,
    nBn: "২৮",
    icon: "clearSpeech",
    arabic: "كلامك واضح",
    pronunciation: "কালামাক ওয়াদিহ।",
    meaning: "আপনার কথা পরিষ্কার।",
    situation: "কারো কথা স্পষ্ট বুঝতে পারলে প্রশংসা করে বলুন?",
    recap: "আপনার কথা পরিষ্কার",
  },
  {
    n: 29,
    nBn: "২৯",
    icon: "questionBubble",
    arabic: "فهمت علي؟",
    pronunciation: "ফাহিমত আলাইয়া?",
    meaning: "আমার কথা বুঝেছেন?",
    situation: "সামনের জন আপনার কথা বুঝেছে কি না জানতে?",
    recap: "আমার কথা বুঝেছেন?",
  },
  {
    n: 30,
    nBn: "৩০",
    icon: "understoodCheck",
    arabic: "أيوه فهمت عليك",
    pronunciation: "আইওয়া ফাহিমত আলাইক।",
    meaning: "হ্যাঁ, আপনার কথা বুঝেছি।",
    situation: "কারো কথা পুরোপুরি বুঝতে পারলে জবাবে বলুন?",
    recap: "হ্যাঁ, কথা বুঝেছি",
  },
];

