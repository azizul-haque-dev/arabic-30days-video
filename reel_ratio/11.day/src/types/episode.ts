export type At = {
  /** SRT cue index (1-based) used as the anchor */
  cue?: number;
  /** Offset in seconds from the cue start (or from 0 when no cue) */
  offsetSec?: number;
  /** Absolute seconds. Wins over `cue` when both are given. */
  sec?: number;
  /** True when the SRT does not give an exact time (merged cue) */
  estimated?: boolean;
};

export type ScriptLine = { id: string; text: string; at: At };

export type IllustrationId =
  | "priceAsk"
  | "tooExpensive"
  | "negotiate"
  | "finalPrice"
  | "biggerSize"
  | "smallerSize"
  | "dislike"
  | "colors"
  | "tryOn"
  | "fittingRoom";

export type SentenceItem = {
  number: number;
  arabic: string;
  pronunciation: string;
  meaning: string;
  illustration: IllustrationId;
  start: At;
  reveal: { arabicAt: At; meaningAt: At };
};

export type EpisodeConfig = {
  brandName: string;
  seriesName: string;
  seriesBn: string;
  episodeNumber: number;
  topic: string;
  topicBn: string;
  sentenceStart: number;
  sentenceEnd: number;
  totalSentences: number;
  completedSentences: number;
  previousCompletedSentences: number;
  progressPercentage: number;
  ctaText: string;
  nextEpisodeNumber: number;
  video: { width: number; height: number; fps: number; aspectRatio: string };
  compositionId: string;
  assets: {
    subtitles: string;
    audio: { file: string; enabled: boolean; offsetSec: number; volume: number };
  };
  timing: { tailSec: number; sceneExitFrames: number };
  scenes: Record<"thumbnail" | "brand" | "episode" | "topic" | "outro", { start: At }>;
  intro: { lines: ScriptLine[] };
  sentences: SentenceItem[];
  outro: { lines: ScriptLine[] };
};

export type Cue = {
  index: number;
  startMs: number;
  endMs: number;
  text: string;
  lines: string[];
};

export type SceneType = "thumbnail" | "brand" | "episode" | "topic" | "sentence" | "outro";

export type SceneTiming = {
  id: string;
  type: SceneType;
  from: number;
  duration: number;
  sentenceIndex?: number;
  /** frame numbers relative to the scene start */
  lines: Record<string, number>;
  arabicAt?: number;
  meaningAt?: number;
  estimated: boolean;
};

export type Timeline = {
  scenes: SceneTiming[];
  totalFrames: number;
  audioFrames: number | null;
  issues: string[];
};
