import type { IconName } from "../components/Icons";

// স্ক্রিপ্ট টেক্সট (ইউজারের দেওয়া) — SRT-এর টেক্সট গোলমেলে হতে পারে বলে এটাই প্রামাণ্য।
export type Sentence = { n: number; phrase: string; meaning: string; icon: IconName };
export const SENTENCES: Sentence[] = [
  { n: 11, phrase: "ওয়াল্লাহ মাশগুল শুয়াইয়্যা", meaning: "সত্যি বলতে, একটু ব্যস্ত আছি।", icon: "clock" },
  { n: 12, phrase: "নিতগাবাল বা’দেইন", meaning: "পরে দেখা হবে।", icon: "calendar" },
  { n: 13, phrase: "আলা খাইর, ইনশাআল্লাহ", meaning: "ইনশাআল্লাহ, সবকিছু ভালো হবে।", icon: "sparkle" },
  { n: 14, phrase: "সাল্লিম আলাল-আহল", meaning: "পরিবারের সবাইকে আমার সালাম দেবেন।", icon: "home" },
  { n: 15, phrase: "আল্লাহ ইয়িসাল্লিমাক ওয়া ইয়িআফিক", meaning: "আল্লাহ আপনাকে নিরাপদ রাখুন এবং সুস্থতা দান করুন।", icon: "shield" },
  { n: 16, phrase: "ঈশ তিসাওয়ি দাহিন?", meaning: "এখন কী করছেন?", icon: "question" },
  { n: 17, phrase: "মা আসাওয়ি শাই", meaning: "কিছু করছি না।", icon: "pause" },
  { n: 18, phrase: "আনা ফাদি আল-ইয়াওম", meaning: "আমি আজ ফ্রি আছি।", icon: "sun" },
  { n: 19, phrase: "তা’আল ইশরাব শাহী মা’আয়া", meaning: "আসুন, আমার সঙ্গে চা খান।", icon: "cup" },
  { n: 20, phrase: "শুকরান, মা তিগাসসির", meaning: "ধন্যবাদ, আপনি অনেক করেছেন।", icon: "heart" },
];
