export type Cue = { index: number; startMs: number; endMs: number; text: string };

export type VideoSpec = { width: number; height: number; fps: number; aspectRatio: string };

export type WordPair = { term: string; meaning: string };

export type IllustrationKey =
  | "menu"
  | "board"
  | "grilledChicken"
  | "biryani"
  | "meatKabsa"
  | "fish"
  | "spicy"
  | "noSpice"
  | "orangeJuice"
  | "water";

export type SentenceCues = {
  label: number;
  context: number[];
  /** [first pronunciation, repeated pronunciation] */
  pronunciation: number[];
  meaning: number;
  words?: number;
};

export type SentenceCfg = {
  number: number;
  pronunciation: string;
  meaning: string;
  context: string;
  illustration: IllustrationKey;
  cues: SentenceCues;
  words: WordPair[];
  notes?: string;
};

export type SceneKind =
  | "thumbnail"
  | "introEntrance"
  | "introWaiter"
  | "introPointing"
  | "introBrand"
  | "introEpisode"
  | "introTopic"
  | "sentence"
  | "outroSummary"
  | "outroComment"
  | "outroCompare"
  | "outroSaveShare"
  | "outroFollow"
  | "outroNext"
  | "outroGoodbye";

export type SceneCfg = {
  id: string;
  kind: SceneKind;
  /** SRT index at whose start this scene begins. Ends where the next scene begins. */
  startCue: number;
  sentenceNumber?: number;
  splitAt?: number;
  compareLabels?: [string, string];
};

export type EpisodeConfig = {
  compositionId: string;
  brandName: string;
  seriesName: string;
  episodeNumber: number;
  totalDays: number;
  topic: string;
  topicBn: string;
  sentenceStart: number;
  sentenceEnd: number;
  totalSentences: number;
  previousCompletedSentences: number;
  completedSentences: number;
  progressPercentage: number;
  ctaText: string;
  nextEpisodeNumber: number;
  video: VideoSpec;
  srt: { path: string; expectedEntries: number; tailSeconds: number };
  audio: { enabled: boolean; src: string; volume: number; offsetSeconds: number };
  thumbnail: { seriesLine: string; lines: string[]; highlight: string };
  scenes: SceneCfg[];
  sentences: SentenceCfg[];
};

export type SceneCue = { index: number; start: number; end: number; text: string };

export type SceneTiming = {
  id: string;
  kind: SceneKind;
  cfg: SceneCfg;
  from: number;
  durationInFrames: number;
  /** cues that belong to this scene, frames are RELATIVE to scene start */
  cues: SceneCue[];
};

export type Timeline = {
  fps: number;
  totalFrames: number;
  scenes: SceneTiming[];
};

export type MainProps = {
  episode: EpisodeConfig;
  timeline: Timeline | null;
};
