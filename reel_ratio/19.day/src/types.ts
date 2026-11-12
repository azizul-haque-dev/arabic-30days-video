/** Shared types. No runtime imports so both Node scripts and Remotion can use them. */

export type IllustrationId =
  | "opening"
  | "section"
  | "leave-request"
  | "salary-missing"
  | "salary-question"
  | "busy-desk"
  | "task-done"
  | "leave-early"
  | "tired"
  | "difficult-task"
  | "teach-steps"
  | "demonstrate"
  | "challenge"
  | "outro";

export interface SentenceContent {
  number: number;
  /** Bengali pronunciation, exactly as supplied in the SRT. Never edit. */
  pronunciation: string;
  arabic: string;
  meaning: string;
  illustration: IllustrationId;
}

export type SceneAnchorKey = "intro" | "section" | "challenge" | "outro";

export interface EpisodeContent {
  episode: number;
  brand: string;
  series: string;
  topicEn: string;
  sectionTitle: string;
  totalSentences: number;
  progress: { from: number; to: number; fromPercent: number; toPercent: number };
  nextEpisode: number;
  labels: {
    challenge: string;
    dailyPractice: string;
    next: string;
  };
  expected: {
    srtEntries: number;
    durationSec: number;
    durationToleranceSec: number;
  };
  /**
   * Approximate scene start hints taken from the master prompt (seconds).
   * They are NEVER used as timestamps: each hint is snapped to the nearest REAL
   * SRT entry start. Use `overrides.sceneStartEntries` to force an exact SRT entry.
   */
  sceneAnchorsSec: Record<SceneAnchorKey, number>;
  overrides?: {
    /** SRT entry numbers that must not be matched to sentences (e.g. a preview of sentences in the intro). */
    ignoreEntries?: number[];
    /** Force a scene to start at the given SRT entry number. */
    sceneStartEntries?: Partial<Record<SceneAnchorKey, number>>;
  };
  sentences: SentenceContent[];
  /** Quick challenge: refers to sentences whose Bengali meaning is shown. */
  challengeSentences: number[];
}

/* ---------- Generated timeline (output of scripts/prepare-episode.ts) ---------- */

export interface SentenceEvent {
  kind: "pron" | "meaning";
  startSec: number;
  endSec: number;
  entry: number;
}

interface SceneBase {
  startSec: number;
  endSec: number;
  startFrame: number;
  endFrame: number;
}

export type SceneTiming =
  | (SceneBase & { type: "opening"; splitSec: number | null })
  | (SceneBase & { type: "intro" })
  | (SceneBase & { type: "section" })
  | (SceneBase & { type: "sentence"; number: number; events: SentenceEvent[] })
  | (SceneBase & {
      type: "challenge";
      items: { sentence: number; startSec: number; endSec: number }[];
    })
  | (SceneBase & { type: "outro" });

export interface AudioMeta {
  /** Path relative to /public, for staticFile(). */
  file: string;
  ext: "mp3" | "wav";
  sizeBytes: number;
  durationInSeconds: number | null;
}

export interface EpisodeTimeline {
  episode: number;
  fps: number;
  width: number;
  height: number;
  durationInSeconds: number;
  durationInFrames: number;
  srt: { file: string; entryCount: number; isSample: boolean };
  audio: AudioMeta | null;
  scenes: SceneTiming[];
  warnings: string[];
}
