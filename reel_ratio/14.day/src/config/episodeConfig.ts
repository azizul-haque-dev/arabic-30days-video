export type VisualKey =
  | "turnRight" | "turnLeft" | "goStraight" | "nearby" | "farAway"
  | "howFar" | "howLong" | "trafficJam" | "otherRoad" | "imLate";

export type SentenceConfig = {
  n: number;
  visual: VisualKey;
  /** [first occurrence, repeated occurrence] - kept exactly as in the source script. */
  pronunciation: [string, string];
  meaning: string;
  /** Optional Arabic phrase. Only rendered if the source script provides it. */
  arabic?: string;
};

export const episodeConfig = {
  episodeNumber: 14,
  episodeTitle: "Directions & Road Navigation",
  topicBn: "যাতায়াত ও রাস্তার দিকনির্দেশনা",
  thumbTitleBn: "রাস্তার দিকনির্দেশনা",

  sentenceStart: 131,
  sentenceEnd: 140,
  totalSentences: 300,

  previousCompletedSentences: 130,
  completedSentences: 140,
  progressPercentage: 46.67,
  previousProgressPercentage: 43.33,

  ctaText: "DAY 14 DONE!",
  nextEpisodeNumber: 15,

  video: { width: 1080, height: 1920, fps: 30, aspectRatio: "9:16" },

  /** Narration audio. */
  audio: { enabled: true, file: "audio/voiceover.mp3" },
  srtFile: "subtitles/day14.srt",

  /** SRT cue numbers that are shown as on-screen captions (intro + outro narration). */
  captionCueRanges: [[1, 5], [35, 38]] as [number, number][],

  sentences: [
    { n: 131, visual: "turnRight", pronunciation: ["লিফ ইয়ামীন।", "লিফ ইয়ামীন।"], meaning: "ডানে ঘুরুন।" },
    { n: 132, visual: "turnLeft", pronunciation: ["লিফ ইয়াসার।", "লিফ ইয়াসার।"], meaning: "বামে ঘুরুন।" },
    { n: 133, visual: "goStraight", pronunciation: ["কাম্মিল আলা তূল।", "কাম্মিল আলা তূল।"], meaning: "সোজা চলুন।" },
    { n: 134, visual: "nearby", pronunciation: ["গারীব মিন হিনা।", "গারীব মিন হিনা।"], meaning: "এখান থেকে কাছেই।" },
    { n: 135, visual: "farAway", pronunciation: ["বা'ঈদ মাররা।", "বা'ঈদ মাররা।"], meaning: "অনেক দূর।" },
    // Sentence 136: the two pronunciation lines differ in the source script. Both are preserved verbatim.
    { n: 136, visual: "howFar", pronunciation: ["কাম আল মাছাফাআল মাসাফাহ?", "কাম আল আল মাসাফাহ?"], meaning: "কতটা দূর?" },
    { n: 137, visual: "howLong", pronunciation: ["কাম ইয়াখুদ ওয়াক্ত?", "কাম ইয়াখুদ ওয়াক্ত?"], meaning: "কতক্ষণ লাগবে?" },
    { n: 138, visual: "trafficJam", pronunciation: ["আত-তারীগ যাহমা।", "আত-তারীগ যাহমা।"], meaning: "রাস্তায় অনেক জ্যাম।" },
    { n: 139, visual: "otherRoad", pronunciation: ["খুদ তারীগ তানি।", "খুদ তারীগ তানি।"], meaning: "অন্য রাস্তা ধরুন।" },
    { n: 140, visual: "imLate", pronunciation: ["আনা তা'আখখারত।", "আনা তা'আখখারত।"], meaning: "আমার দেরি হয়ে গেছে।" },
  ] as SentenceConfig[],
};

export type EpisodeConfig = typeof episodeConfig;
