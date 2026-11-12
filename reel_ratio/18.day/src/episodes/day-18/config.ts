import { formatPercent, progressPercent } from "../../lib/format";

export const episodeConfig = {
  id: "day-18",
  project: "Arabic Master",
  series: "30-Day Survival Arabic",
  day: 18,
  topicEn: "Restaurant & Workplace Communication",
  topicBn: "রেস্টুরেন্ট ও কর্মক্ষেত্রের প্রয়োজনীয় কথোপকথন",
  sentenceRange: [171, 180] as const,
  totalSentences: 10,
  previousCompleted: 170,
  currentCompleted: 180,
  totalSeries: 300,
  nextDay: 19,
  video: { width: 1080, height: 1920, fps: 30 },
  /** Expected final subtitle end 00:02:25.450 */
  expectedDurationMs: 145_450,
  audio: { dir: "audio", baseName: "day-18", extensions: ["mp3", "wav"] as const },
  subtitle: "subtitles/day-18.srt",
  /** Brand logo: "vector" = built-in placeholder mark; "image" = use public/<src> */
  logo: { mode: "vector" as "vector" | "image", src: "assets/logo.png" },
} as const;

export const progress = {
  before: progressPercent(episodeConfig.previousCompleted, episodeConfig.totalSeries), // 56.67
  after: progressPercent(episodeConfig.currentCompleted, episodeConfig.totalSeries), // 60
  beforeLabel: formatPercent(progressPercent(episodeConfig.previousCompleted, episodeConfig.totalSeries)),
  afterLabel: formatPercent(progressPercent(episodeConfig.currentCompleted, episodeConfig.totalSeries)),
};
