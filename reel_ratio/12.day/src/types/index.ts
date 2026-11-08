export interface Rect { x: number; y: number; w: number; h: number }

export type Anchor =
  | { sec: number }
  | { entry: number; text?: string };

export type SceneKind =
  | "thumbnail" | "story" | "brand" | "episode" | "progressDone" | "topic" | "sentence"
  | "outroDone" | "outroProgress" | "outroPractice" | "outroFollow" | "outroComment" | "outroGoodbye";

export interface SceneDef {
  id: string;
  kind: SceneKind;
  group: string;
  sentence?: number;
  start: Anchor;
  cues?: Record<string, Anchor>;
}

export type EnterKind = "none" | "left" | "right" | "up" | "down" | "pop";
export interface LayerDef { a: string; x: number; y: number; w: number; enter?: EnterKind; d?: number; bob?: number; ring?: boolean }

export interface SentenceDef { number: number; pron: string[]; meaning: string; layers: LayerDef[] }

export interface EpisodeConfig {
  brandName: string; seriesName: string; compositionId: string;
  episodeNumber: number; topic: string; topicBn: string;
  sentenceStart: number; sentenceEnd: number;
  totalSentences: number; previousCompletedSentences: number; completedSentences: number;
  progressPercentage: number; ctaText: string; nextEpisodeNumber: number;
  video: { width: number; height: number; fps: number; aspectRatio: string };
  srtFile: string;
  audio: { enabled: boolean; src: string; volume: number; startOffsetSeconds: number };
  tailSeconds: number;
  copy: {
    labels: Record<"day" | "sentence" | "pronunciation" | "meaning" | "or" | "follow" | "save" | "share" | "done", string>;
    thumb: { title: string[]; hook: string; sub: string };
    story: { headline: string };
    brand: { tagline: string };
    episode: { line: string };
    progressDone: { lead: string; line: string };
    topic: { lead: string; go: string };
    outro: {
      done: string[]; progressLead: string; practice: string; practiceSub: string; follow: string;
      commentLead: string; seeYou: string; insha: string;
    };
  };
  timeline: { scenes: SceneDef[] };
  sentences: SentenceDef[];
  illustrations: Record<"thumbnail" | "story" | "topicCard" | "outroStrip" | "outroPractice", LayerDef[]>;
}

export interface TimelineScene {
  id: string; kind: SceneKind; group: string; sentence?: number;
  startFrame: number; endFrame: number; durationFrames: number;
  /** Cue frames, relative to the scene's own start. */
  cues: Record<string, number>;
  /** Human-readable description of how the start boundary was derived from the SRT. */
  startSource: string;
  cueSources: Record<string, string>;
}

export interface Timeline {
  fps: number; totalFrames: number; scenes: TimelineScene[];
  warnings: string[]; errors: string[];
}

export type TextColor = "text" | "primary" | "secondary" | "accent" | "white" | "primaryDark";

export interface TextSpec {
  id: string; zone: Rect; paragraphs: string[];
  weight: 400 | 600 | 700; color: TextColor;
  maxFont: number; minFont: number; lineHeight: number;
  align?: "center" | "left" | "right"; paragraphGap?: number;
  /** Cue name (scene-local) after which the text enters; omitted = enters with the scene. */
  cue?: string; delaySec?: number;
}

export interface UiBox { id: string; rect: Rect; kind: "panel" | "decor" | "logo" | "bar" | "chip" | "icon"; contains?: string[] }
export interface IllusZone { id: string; zone: Rect; layers: LayerDef[]; clip: true }
export interface SceneSpec { texts: TextSpec[]; illustrations: IllusZone[]; ui: UiBox[] }
