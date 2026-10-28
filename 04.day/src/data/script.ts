// On-screen text comes from the user's script (not the SRT, whose transliteration is garbled).
export type Sentence = { n: number; situation: string; say: string; phrase: string; meaning: string; short: string };

export const sentences: Sentence[] = [
  { n: 1, situation: "কেউ কিছু বলেছে, কিন্তু আপনি বুঝতে পারেননি?", say: "বলুন", phrase: "লা ওয়াল্লাহ মা ফিহিমত।", meaning: "সত্যিই, বুঝতে পারিনি।", short: "বুঝতে পারিনি" },
  { n: 2, situation: "কাউকে আরেকবার বলতে বলতে চান?", say: "বলুন", phrase: "গূল মাররা থানিয়া।", meaning: "আরেকবার বলুন।", short: "আরেকবার বলুন" },
  { n: 3, situation: "কেউ খুব দ্রুত কথা বলছে?", say: "বলুন", phrase: "তাকাল্লাম বিশো’য়েশ লও সামাহত।", meaning: "দয়া করে একটু আস্তে কথা বলুন।", short: "আস্তে কথা বলুন" },
  { n: 4, situation: "কোনো কথার অর্থ বুঝতে পারছেন না?", say: "বলুন", phrase: "এশ ইয়ানি হাদা?", meaning: "এটার মানে কী?", short: "এটার মানে কী?" },
  { n: 5, situation: "আপনি কিছু জানেন না?", say: "বলুন", phrase: "মা আরিফ ওয়াল্লাহ।", meaning: "আমি সত্যিই জানি না।", short: "আমি জানি না" },
  { n: 6, situation: "কারো নাম মনে পড়ছে না?", say: "বলুন", phrase: "নাসীত ইসমু।", meaning: "আমি তার নাম ভুলে গেছি।", short: "নাম ভুলে গেছি" },
  { n: 7, situation: "কাউকে পরে মনে করিয়ে দিতে বলতে চান?", say: "বলুন", phrase: "জাক্কিরনি বাদাইন।", meaning: "আমাকে পরে মনে করিয়ে দেবেন।", short: "পরে মনে করিয়ে দিন" },
  { n: 8, situation: "কেউ কোনো বিষয় নিয়ে চিন্তিত?", say: "বলুন", phrase: "লা তিশীল হাম।", meaning: "কোনো চিন্তা করবেন না।", short: "চিন্তা করবেন না" },
  { n: 9, situation: "কোনো কঠিন কাজ সামনে আছে?", say: "বলতে পারেন", phrase: "রাব্বানা ইয়াসাহিল।", meaning: "আল্লাহ সহজ করুন।", short: "আল্লাহ সহজ করুন" },
  { n: 10, situation: "কাউকে ভালো মানুষ হিসেবে প্রশংসা করতে চান?", say: "বলুন", phrase: "ইন্তা রিজ্জাল তাইয়্যিব।", meaning: "আপনি একজন ভালো মানুষ।", short: "আপনি ভালো মানুষ" },
];
