// All timings in seconds, taken from subtitle.srt segment boundaries and refined
// against silence gaps in voiceover.mp3 (ffmpeg silencedetect) where the SRT
// splits a segment mid-sentence.
import { FPS } from "./theme";

export const sec = (s: number) => Math.round(s * FPS);
export const AUDIO_SECONDS = 130.704;
export const DURATION = Math.floor(AUDIO_SECONDS * FPS);

export type SentenceData = {
  n: number;
  ar: string;
  pron: string;
  meaning: string;
  tScene: number; // "Sentence N" spoken
  tArabic: number; // Arabic phrase starts
  tMeaning: number; // Bengali meaning starts
  art: "wash" | "plumber" | "trash" | "room" | "laundry" | "mosque" | "alarm" | "night" | "sunrise" | "sofa";
};

// Arabic + Bengali meaning are verbatim from the SRT.
// Bengali pronunciation is a DRAFT written for this video (not in the SRT).
export const sentences: SentenceData[] = [
  { n: 71, ar: "الغسالة خربانة", pron: "আল-গাসসালা খারবানা", meaning: "Washing Machine নষ্ট", tScene: 21.75, tArabic: 23.79, tMeaning: 28.4, art: "wash" },
  { n: 72, ar: "لازم نكلم السباك", pron: "লাজিম নিকাল্লিম আস-সাব্বাক", meaning: "আমাদের Plumber কে ডাকতে হবে", tScene: 30.09, tArabic: 32.14, tMeaning: 37.6, art: "plumber" },
  { n: 73, ar: "ارمي الزبالة برة", pron: "এরমি আজ-জুবালা বার্রা", meaning: "ময়লাটা বাইরে ফেলে আসুন", tScene: 40.06, tArabic: 42.26, tMeaning: 46.7, art: "trash" },
  { n: 74, ar: "الغرفة تحتاج تنظيف", pron: "আল-গুরফা তাহতাজ তানদিফ", meaning: "ঘরটা পরিষ্কার করা দরকার", tScene: 48.96, tArabic: 50.81, tMeaning: 57.06, art: "room" },
  { n: 75, ar: "غسلت الملابس ولا باقي؟", pron: "গাছ'ছিত আল-মালাবিস\nওয়ালা বাগি?", meaning: "কাপড় ধুয়েছেন নাকি এখনো বাকি?", tScene: 59.26, tArabic: 61.56, tMeaning: 66.4, art: "laundry" },
  { n: 76, ar: "أنا رايح المسجد أصلي", pron: "আনা রায়াহ আল-মাসজিদ আসাল্লি", meaning: "আমি মসজিদে নামাজ পড়তে যাচ্ছি", tScene: 68.64, tArabic: 70.64, tMeaning: 76.0, art: "mosque" },
  { n: 77, ar: "صحيني الساعة ستة الصباح", pron: "সাহহিনি আস-সায়া\nসিত্তা আস-সুবাহ", meaning: "আমাকে সকাল ছয়টায় ডেকে দিবেন", tScene: 78.26, tArabic: 80.14, tMeaning: 87.7, art: "alarm" },
  { n: 78, ar: "نمت متأخر أمس", pron: "নিমত মুতা'আখখির আমস", meaning: "গতকাল দেরিতে ঘুমিয়েছি", tScene: 89.52, tArabic: 90.44, tMeaning: 95.8, art: "night" },
  { n: 79, ar: "صحيت بدري اليوم", pron: "সাহিত বাদরি আল-ইয়াওম", meaning: "আজ তাড়াতাড়ি ঘুম থেকে উঠেছি", tScene: 97.6, tArabic: 98.55, tMeaning: 103.39, art: "sunrise" },
  { n: 80, ar: "أبغى أرتاح شوية", pron: "আবগা আরতাহ শোওইয়া", meaning: "আমি একটু বিশ্রাম নিতে চাই", tScene: 105.33, tArabic: 106.22, tMeaning: 111.2, art: "sofa" },
];

export type SceneKey =
  | "thumb" | "i1" | "i2" | "i3" | "i4"
  | `s${number}`
  | "o1" | "o2" | "o3" | "o4";

export const sceneStarts: { key: SceneKey; t: number }[] = [
  { key: "thumb", t: 0 },
  { key: "i1", t: 2.5 },
  { key: "i2", t: 5.58 },
  { key: "i3", t: 11.06 },
  { key: "i4", t: 15.96 },
  ...sentences.map((s) => ({ key: `s${s.n}` as SceneKey, t: s.tScene })),
  { key: "o1", t: 113.29 },
  { key: "o2", t: 117.07 },
  { key: "o3", t: 121.31 },
  { key: "o4", t: 125.52 },
];

export const scenes = sceneStarts.map((s, i) => {
  const from = sec(s.t);
  const end = i + 1 < sceneStarts.length ? sec(sceneStarts[i + 1].t) : DURATION;
  return { key: s.key, from, duration: end - from };
});
