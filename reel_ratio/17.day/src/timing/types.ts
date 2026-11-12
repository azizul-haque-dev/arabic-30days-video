export type TimingSource = "srt" | "audio-analysis" | "estimated";

export interface Cue {
  index: number;
  startSec: number;
  endSec: number;
  text: string;
}

export interface Gap {
  startSec: number;
  endSec: number;
}

export interface AudioInfo {
  /** Path relative to public/ (use with staticFile). */
  publicPath: string;
  durationSec: number;
  sampleRate: number | null;
  channels: number | null;
  codec: string | null;
  bitrateKbps: number | null;
  warnings: string[];
}

export interface EpisodeManifestEntry {
  episodeId: string;
  audio: AudioInfo | null;
  subtitles: { publicPath: string; cues: Cue[] } | null;
  analysis: { method: string; speechStartSec: number; speechEndSec: number; gaps: Gap[] } | null;
  searched: string[];
}

export interface Manifest {
  generatedAt: string;
  episodes: Record<string, EpisodeManifestEntry>;
}

export type BeatScene = "intro" | "sentence" | "outro";

export interface BeatSpec {
  id: string;
  scene: BeatScene;
  sceneId: string;
  role: string; // intro-N | lead | phrase | meaning | outro-N
  narration: string;
}

export interface TimedBeat extends BeatSpec {
  startSec: number;
  endSec: number;
  startFrame: number;
  endFrame: number;
  source: TimingSource;
}

export interface SceneTiming {
  id: string;
  kind: BeatScene;
  startFrame: number;
  endFrame: number;
}

export interface SentenceTiming {
  /** Absolute seconds at which each pronunciation unit starts to be spoken. */
  unitStartsSec: number[];
  /** Absolute seconds of each pronunciation repetition (emphasis pulses). */
  emphasisSec: number[];
  unitsSource: TimingSource;
}

export interface Timeline {
  episodeId: string;
  fps: number;
  durationSec: number;
  durationInFrames: number;
  /** Overall provenance of the cue timing. Only "srt" with every beat matched is treated as verified. */
  source: TimingSource;
  verified: boolean;
  hasAudio: boolean;
  thumbnailEndFrame: number;
  beats: TimedBeat[];
  scenes: SceneTiming[];
  sentenceTimings: Record<string, SentenceTiming>;
  warnings: string[];
}
