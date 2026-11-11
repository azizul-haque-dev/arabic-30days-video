/**
 * Single source of truth for everything episode-specific that is NOT prose.
 * Reusable components never contain episode numbers, progress values or CTA text.
 */
export const episodeConfig = {
  brandName: "Arabic Master",
  seriesName: "30 Days Survival Arabic",

  episodeNumber: 13,

  topic: "Market & Taxi",
  topicBn: "বাজার ও ট্যাক্সি",

  sentenceStart: 121,
  sentenceEnd: 130,

  /** length of the whole series in days (used in series/intro lines) */
  totalDays: 30,
  totalSentences: 300,
  previousCompletedSentences: 120,
  completedSentences: 130,

  progressPercentage: 43.33,

  ctaText: "DAY 13 DONE!",
  nextEpisodeNumber: 14,

  video: {
    width: 1080,
    height: 1920,
    fps: 30,
    aspectRatio: "9:16",
  },

  /** Composition id + asset paths are configurable for future API rendering. */
  compositionId: "ArabicMasterComposition",
  srtFile: "subtitles.srt",

  /**
   * Narration audio. NOT bundled yet: the original narration file was not
   * supplied. Put it at public/<file> and set enabled: true (see README).
   */
  audio: {
    enabled: true,
    file: "voiceover.wav",
    volume: 1,
  },
} as const;

export type EpisodeConfig = typeof episodeConfig;
