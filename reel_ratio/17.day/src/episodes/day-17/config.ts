import type { EpisodeConfig } from "../../types";

/**
 * Day 17 — pure data (no React/Remotion imports) so Node scripts can read it too.
 * For the next episode: copy this folder, edit values, change src/episodes/active.ts.
 */
export const episode: EpisodeConfig = {
  id: "day-17",
  day: 17,
  brand: "Arabic Master",
  series: "30-Day Survival Arabic",
  title: "Restaurant Communication & Dining",
  titleBn: "রেস্টুরেন্টে দৈনন্দিন কথোপকথন",
  sentenceFrom: 161,
  sentenceTo: 170,
  totalSeries: 300,
  previousCompleted: 160,
  currentCompleted: 170,
  nextDay: 18,
  fps: 30,
  width: 1080,
  height: 1920,
  audioFile: "audio.wav",
  srtFile: "subtitles/day-17.srt",
  silentTailSec: 1.2,
  introBeats: [
    { kind: "thumbnail", cues: [1, 1] }, // আসসালামু আলাইকুম
    { kind: "welcome", cues: [2, 2] }, // Arabic Master পেজের পক্ষ থেকে স্বাগতম
    { kind: "day", cues: [3, 3] }, // ৩০ দিনে ৩০০ বাক্য — আজ ১৭তম দিন
    { kind: "progress", cues: [4, 4] }, // ১৬০টি শেষ
    { kind: "range", cues: [5, 6] }, // ১৬১ থেকে ১৭০
    { kind: "start", cues: [7, 7] }, // চলুন শুরু করি
  ],
  outroBeats: [
    { kind: "outro-progress", cues: [58, 58] }, // মোট ১৭০টি
    { kind: "save", cues: [59, 59] }, // সেভ করে প্র্যাকটিস
    { kind: "follow", cues: [60, 60] }, // ফলো করে রাখুন
    { kind: "closing", cues: [61, 62] }, // ডে ১৮ + আল্লাহ হাফেজ
  ],
};
