// On-screen text comes from the user's script (the SRT spelling is unreliable).
export type SentenceData = {
  n: number;
  word: string; // narration marker in the SRT: "Sentence sixty one"
  translit: string;
  meaning: string;
  key: string; // exact substring of meaning, highlighted
  layout: 1 | 2 | 3 | 4;
};

export const SENTENCES: SentenceData[] = [
  { n: 61, word: "sixty one", translit: "আলহামদুলিল্লাহ, শাব’আত।", meaning: "আলহামদুলিল্লাহ, আমার পেট ভরে গেছে।", key: "পেট ভরে গেছে", layout: 1 },
  { n: 62, word: "sixty two", translit: "ফেইন আল-হাম্মাম, লাও সামাহত?", meaning: "দয়া করে বলবেন, টয়লেটটা কোথায়?", key: "টয়লেটটা কোথায়", layout: 3 },
  { n: 63, word: "sixty three", translit: "ইফতাহ আশ-শুব্বাক শুয়াইয়্যা।", meaning: "জানালাটা একটু খুলুন।", key: "জানালাটা একটু খুলুন", layout: 2 },
  { n: 64, word: "sixty four", translit: "গাফ্ফিল আল-বাব ওয়ারাক।", meaning: "আপনার পেছনে দরজাটা বন্ধ করুন।", key: "দরজাটা বন্ধ করুন", layout: 4 },
  { n: 65, word: "sixty five", translit: "শাগ্গিল আল-মুকাইয়্যিফ, আল-জাও হার্র।", meaning: "এসিটা চালান, আবহাওয়া গরম।", key: "এসিটা চালান", layout: 1 },
  { n: 66, word: "sixty six", translit: "তাফ্ফি আল-লাম্বা, আবগা আনাম।", meaning: "লাইটটা নিভিয়ে দিন, আমি ঘুমাব।", key: "লাইটটা নিভিয়ে দিন", layout: 2 },
  { n: 67, word: "sixty seven", translit: "ফেইন হাত্তেইত আল-মিফতাহ?", meaning: "চাবিটা কোথায় রেখেছেন?", key: "চাবিটা কোথায়", layout: 3 },
  { n: 68, word: "sixty eight", translit: "আল-মিফতাহ ফাওগ আত-তাওলা।", meaning: "চাবিটা টেবিলের ওপরে।", key: "টেবিলের ওপরে", layout: 4 },
  { n: 69, word: "sixty nine", translit: "আল-মোইয়া মাগতু’আ আল-ইয়াওম।", meaning: "আজ পানির লাইন বন্ধ।", key: "পানির লাইন বন্ধ", layout: 1 },
  { n: 70, word: "seventy", translit: "আল-কাহরাবা তাফাত ফাজআ।", meaning: "হঠাৎ কারেন্ট চলে গেছে।", key: "কারেন্ট চলে গেছে", layout: 3 },
];

const BN = "০১২৩৪৫৬৭৮৯";
export const bn = (v: number | string) => String(v).replace(/\d/g, (d) => BN[Number(d)]);
