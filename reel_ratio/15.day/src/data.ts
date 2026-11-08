export const FPS = 30;
export const DURATION = 5273; // 175.75s voice-over
export const f = (s: number) => Math.round(s * FPS);

export type ArtKey =
  | "taxiHurry" | "speedo" | "busStop" | "busArrive" | "train"
  | "ticket" | "delayed" | "gate" | "lostBag" | "passport";

export type Sentence = {
  n: number; ar: string; pron: string; meaning: string; situation: string; chip: string;
  art: ArtKey; S: number; narr: number; arabicIn: number;
  u1: [number, number]; u2: [number, number]; meaningIn: number; E: number;
};

// All timings (seconds) come from the SRT + silence analysis of the voice-over.
export const sentences: Sentence[] = [
  { n: 141, ar: "أسرع شوية لو سمحت", pron: "আসরা শুওয়াইয়া লাও সামাহত", meaning: "দয়া করে একটু জোরে চালান।",
    situation: "ট্যাক্সি বা বাসে তাড়া থাকলে ড্রাইভারকে বলুন", chip: "ট্যাক্সি / বাসে", art: "taxiHurry",
    S: 23.3, narr: 25.59, arabicIn: 29.4, u1: [29.7, 31.18], u2: [32.15, 33.79], meaningIn: 34.48, E: 37.42 },
  { n: 142, ar: "هدّي السرعة", pron: "হাদ্দি আস-সুর'আ", meaning: "গতি কমান।",
    situation: "ড্রাইভার খুব জোরে চালালে বলুন", chip: "ট্যাক্সিতে", art: "speedo",
    S: 37.42, narr: 40.03, arabicIn: 43.9, u1: [44.08, 45.16], u2: [45.95, 47.36], meaningIn: 48.11, E: 50.37 },
  { n: 143, ar: "فين / وين موقف الباص؟", pron: "ফেইন / ওয়েন মাওগিফ আল-বাস?", meaning: "বাস স্ট্যান্ড কোথায়?",
    situation: "রাস্তায় কাউকে বাস স্ট্যান্ড জিজ্ঞেস করুন", chip: "রাস্তায়", art: "busStop",
    S: 50.37, narr: 52.77, arabicIn: 56.55, u1: [56.75, 58.15], u2: [59.27, 60.8], meaningIn: 61.79, E: 64.69 },
  { n: 144, ar: "الباص جا", pron: "আল-বাস জা", meaning: "বাস এসে গেছে।",
    situation: "অপেক্ষার পর বাস এলে বলুন", chip: "বাস স্ট্যান্ডে", art: "busArrive",
    S: 64.69, narr: 67.31, arabicIn: 70.4, u1: [70.59, 71.58], u2: [72.43, 73.72], meaningIn: 74.52, E: 76.7 },
  { n: 145, ar: "فين / وين محطة القطار؟", pron: "ফেইন / ওয়েন আল-মাহাত্তা গিতার?", meaning: "ট্রেন স্টেশন কোথায়?",
    situation: "ট্রেন বা মেট্রো স্টেশন খুঁজতে বলুন", chip: "মেট্রো স্টেশনে", art: "train",
    S: 76.7, narr: 79.41, arabicIn: 82.0, u1: [82.22, 84.03], u2: [84.87, 86.6], meaningIn: 87.46, E: 90.25 },
  { n: 146, ar: "أبغى تذكرة واحدة", pron: "আবগা তাজকারা ওয়াহ’দা", meaning: "আমি একটা টিকিট চাই।",
    situation: "কাউন্টার থেকে টিকিট কেনার সময় বলুন", chip: "টিকিট কাউন্টারে", art: "ticket",
    S: 90.25, narr: 92.52, arabicIn: 95.7, u1: [95.92, 97.44], u2: [98.3, 99.82], meaningIn: 100.66, E: 103.16 },
  { n: 147, ar: "الطيارة تأخرت", pron: "আত-তাইয়ারা তা'আখখারাত", meaning: "বিমান দেরি করেছে।",
    situation: "ফ্লাইট লেট করলে বলবেন", chip: "বিমানবন্দরে", art: "delayed",
    S: 105.7, narr: 108.16, arabicIn: 110.5, u1: [110.71, 112.35], u2: [112.91, 114.65], meaningIn: 115.51, E: 117.95 },
  { n: 148, ar: "فين / وين البوابة؟", pron: "ফেইন / ওয়েন আল-বাওয়াবা?", meaning: "গেট কোথায়?",
    situation: "বোর্ডিং গেট খুঁজতে জিজ্ঞেস করুন", chip: "বোর্ডিং গেটে", art: "gate",
    S: 117.95, narr: 120.26, arabicIn: 123.05, u1: [123.25, 124.22], u2: [124.93, 126.31], meaningIn: 127.16, E: 128.92 },
  { n: 149, ar: "ضاعت شنطتي", pron: "দায়াত শানতাতি", meaning: "আমার ব্যাগ হারিয়ে গেছে।",
    situation: "সফরে ব্যাগ হারিয়ে গেলে দ্রুত বলুন", chip: "লাগেজ বেল্টে", art: "lostBag",
    S: 128.92, narr: 131.57, arabicIn: 135.7, u1: [135.88, 136.96], u2: [137.84, 139.24], meaningIn: 140.03, E: 142.82 },
  { n: 150, ar: "فين / وين الجوازات؟", pron: "ফেইন / ওয়েন আল-জাওয়াজাত?", meaning: "পাসপোর্ট অফিস কোথায়?",
    situation: "ইমিগ্রেশন বা পাসপোর্ট অফিস খুঁজতে বলুন", chip: "ইমিগ্রেশনে", art: "passport",
    S: 142.82, narr: 145.21, arabicIn: 149.55, u1: [149.75, 151.12], u2: [151.97, 153.25], meaningIn: 154.04, E: 156.64 },
];

export const T = {
  opening: [0, 6.0], range: [6.0, 12.6], uses: [12.6, 23.3],
  airportIntro: [103.16, 105.7], outro: [156.64, 175.75],
} as const;

const bn = "০১২৩৪৫৬৭৮৯";
export const toBn = (n: number | string) => String(n).replace(/\d/g, (d) => bn[+d]);
