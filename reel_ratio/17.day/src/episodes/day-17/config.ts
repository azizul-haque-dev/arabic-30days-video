import type { EpisodeConfig } from "../types";
import { day17Sentences } from "./sentences";

export const day17: EpisodeConfig = {
  episodeId: "day-17",
  seriesTitle: "30-Day Survival Arabic",
  topicEn: "Restaurant Communication & Dining",
  topicBn: "রেস্টুরেন্টে দৈনন্দিন কথোপকথন",
  dayNumber: 17,
  nextDayNumber: 18,
  sentenceRange: [161, 170],
  totalSeriesSentences: 300,
  previousCompleted: 160,
  currentCompleted: 170,
  audioDir: "audio",
  audioExtensions: ["mp3", "wav", "m4a", "aac", "ogg"],
  subtitleDir: "subtitles",
  thumbnailHoldSec: 1.6,
  syncOffsetSec: 0,
  showCaptions: false,
  intro: [
    { id: "intro-1", narration: "আসসালামু আলাইকুম।" },
    { id: "intro-2", narration: "Arabic Master পেজের পক্ষ থেকে আপনাদের স্বাগতম।" },
    { id: "intro-3", narration: "আমাদের ৩০ দিনে ৩০০ টি — Survival Arabic বাক্য শেখার আজ ১৭তম দিন।" },
    { id: "intro-4", narration: "আলহামদুলিল্লাহ, আমরা ইতিমধ্যে ১৬০টি জরুরি আরবি বাক্য শেষ করেছি।" },
    {
      id: "intro-5",
      narration: "আজকে আমরা শিখব রেস্টুরেন্ট ও কাজের জায়গায় কথা বলার জন্য ১৬১ থেকে ১৭০ নাম্বার বাক্য।",
    },
    { id: "intro-6", narration: "চলুন, শুরু করি।" },
  ],
  sentences: day17Sentences,
  outro: [
    { id: "outro-1", narration: "আজকের এই ১০টি সহ আমাদের মোট ১৭০টি বাক্য শেখা শেষ হলো।" },
    { id: "outro-2", narration: "ভিডিওটি সেভ করে বারবার প্র্যাকটিস করুন।" },
    {
      id: "outro-3",
      narration: "৩০ দিনের Survival Arabic সিরিজের পরের পর্বগুলো পেতে Arabic Master পেজটি ফলো করে রাখুন।",
    },
    { id: "outro-4", narration: "আবার দেখা হবে আগামীকাল, ডে ১৮-তে।" },
    { id: "outro-5", narration: "আল্লাহ হাফেজ।" },
  ],
};
