// src/content.ts
// On-screen content derived from script.txt and day9.srt.

export type IconId =
  | "battery"
  | "charger"
  | "wifi"
  | "signal"
  | "missedCall"
  | "silent"
  | "location"
  | "photo"
  | "knock"
  | "door";

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
    n: 81,
    nBn: "৮১",
    icon: "battery",
    arabic: "جوالي ما في شحن",
    pronunciation: "জাওয়ালি মা ফীহ শাহান",
    meaning: "আমার মোবাইলে চার্জ নেই।",
    situation: "মোবাইলে চার্জ শেষ হয়ে গেলে?",
    recap: "চার্জ নেই",
  },
  {
    n: 82,
    nBn: "৮২",
    icon: "charger",
    arabic: "عندك شاحن iPhone?",
    pronunciation: "ইন্দাক শাহান আইফোন?",
    meaning: "আপনার কাছে আইফোনের চার্জার আছে?",
    situation: "আইফোনের চার্জার চাইতে?",
    recap: "আইফোন চার্জার",
  },
  {
    n: 83,
    nBn: "৮৩",
    icon: "wifi",
    arabic: "كم رمز الواي فاي?",
    pronunciation: "কাম রামজ আল-ওয়াইফাই?",
    meaning: "ওয়াইফাইয়ের পাসওয়ার্ড কত?",
    situation: "ওয়াইফাই পাসওয়ার্ড জানতে?",
    recap: "ওয়াইফাই কোড",
  },
  {
    n: 84,
    nBn: "৮৪",
    icon: "signal",
    arabic: "النت ضعيف مرة",
    pronunciation: "আন-নেট দাঈফ মাররা",
    meaning: "ইন্টারনেট খুবই দুর্বল।",
    situation: "ইন্টারনেট স্লো হলে অভিযোগ করতে?",
    recap: "দুর্বল নেট",
  },
  {
    n: 85,
    nBn: "৮৫",
    icon: "missedCall",
    arabic: "دقيت عليك ما رديت",
    pronunciation: "দাগ্গাইত আলেইক, মা রাদ্দেইত",
    meaning: "আপনাকে কল দিয়েছিলাম, কিন্তু ধরেননি।",
    situation: "মিসড কল দেওয়ার পর জানাতে?",
    recap: "কল ধরেননি",
  },
  {
    n: 86,
    nBn: "৮৬",
    icon: "silent",
    arabic: "كان الجوال على الصامت",
    pronunciation: "কান আল-জাওয়াল আলাস-সামিত",
    meaning: "মোবাইল সাইলেন্ট করা ছিল।",
    situation: "কল না ধরার কারণ বলতে?",
    recap: "সাইলেন্ট ছিল",
  },
  {
    n: 87,
    nBn: "৮৭",
    icon: "location",
    arabic: "أرسلت لك الموقع على الواتساب",
    pronunciation: "আরসালত লাক আল-মাওগা' আলাল-ওয়াতসাব",
    meaning: "WhatsApp-এ লোকেশন পাঠিয়েছি।",
    situation: "লোকেশন শেয়ার করার পর জানাতে?",
    recap: "লোকেশন পাঠানো",
  },
  {
    n: 88,
    nBn: "৮৮",
    icon: "photo",
    arabic: "شوف الصورة هذي",
    pronunciation: "শুফ আস-সূরা হাদি",
    meaning: "এই ছবিটা দেখুন।",
    situation: "কাউকে কোনো ছবি দেখাতে?",
    recap: "ছবি দেখুন",
  },
  {
    n: 89,
    nBn: "৮৯",
    icon: "knock",
    arabic: "مين يدق الباب؟",
    pronunciation: "মীন ইদুগ্গ আল-বাব?",
    meaning: "দরজায় কে নক করছে?",
    situation: "দরজায় কড়া নাড়ার শব্দ শুনলে?",
    recap: "দরজায় নক",
  },
  {
    n: 90,
    nBn: "৯০",
    icon: "door",
    arabic: "شوف مين عند الباب",
    pronunciation: "শুফ মীন ইন্দ আল-বাব",
    meaning: "দেখুন তো, দরজায় কে এসেছে।",
    situation: "কাউকে গিয়ে দেখতে বলতে?",
    recap: "দরজায় কে",
  },
];

