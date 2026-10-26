// On-screen text (Bengali) — taken from the script the user pasted (not from the SRT's garbled transliteration).
export const SENTENCES: { phrase: string; meaning: string }[] = [
  { phrase: "কেইফ হালেক আল-ইয়াওম?", meaning: "আজ আপনি কেমন আছেন?" },
  { phrase: "আনা বিখাইর, আলহামদুলিল্লাহ।", meaning: "আমি ভালো আছি, আলহামদুলিল্লাহ।" },
  { phrase: "ঈশ ইসমাক?", meaning: "আপনার নাম কী?" },
  { phrase: "ইসমি আহমাদ।", meaning: "আমার নাম আহমেদ।" },
  { phrase: "ইন্তা মিন ফেইন?", meaning: "আপনি কোথা থেকে এসেছেন?" },
  { phrase: "আনা মিন বাংলাদেশ।", meaning: "আমি বাংলাদেশ থেকে এসেছি।" },
  { phrase: "আনা সাকিন ফি জিদ্দা।", meaning: "আমি জেদ্দায় থাকি।" },
  { phrase: "ঈশ আখবার আশ-শুগল?", meaning: "কাজের কী খবর?" },
  { phrase: "কুল্লু তামাম, আলহামদুলিল্লাহ।", meaning: "সব ঠিক আছে, আলহামদুলিল্লাহ।" },
  { phrase: "ফেইনাক ইয়া শেইখ?", meaning: "ভাই, আপনি কোথায়?" },
];
// layouts alternate so no two consecutive sentence scenes share one
export const LAYOUTS: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4, 1, 3, 2, 4, 1, 2];
