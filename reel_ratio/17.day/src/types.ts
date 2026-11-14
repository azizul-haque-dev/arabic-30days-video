export type Unit = {
  /** Bengali pronunciation of this unit (the main learning element) */
  bn: string;
  /** Arabic text for exactly the same unit */
  ar: string;
};

export type IllustrationId =
  | "ask-bill"
  | "my-order"
  | "no-order"
  | "cold-food"
  | "extra-bread"
  | "missing-spoon"
  | "pack-leftover"
  | "takeaway"
  | "reserved-table"
  | "table-for-two";

export type SentenceConfig = {
  /** Global sentence number (161 ... 170) */
  no: number;
  slug: string;
  titleEn: string;
  /** Pronunciation split in aligned units (pause points = unit borders) */
  units: Unit[];
  meaning: string;
  illustration: IllustrationId;
  /** 1-based SRT cue numbers that drive timing */
  cues: {
    intro: number; // "Sentence 161 ... say"
    say1: number; // first pronunciation
    say2: number; // repeated pronunciation
    meaning: number; // "অর্থ: ..."
  };
};

export type BeatKind =
  | "thumbnail"
  | "welcome"
  | "day"
  | "progress"
  | "range"
  | "start"
  | "outro-progress"
  | "save"
  | "follow"
  | "closing";

export type BeatConfig = {
  kind: BeatKind;
  /** first and last SRT cue (1-based) narrated while this beat is on screen */
  cues: [number, number];
};

export type EpisodeConfig = {
  id: string;
  day: number;
  brand: string;
  series: string;
  title: string;
  titleBn: string;
  sentenceFrom: number;
  sentenceTo: number;
  totalSeries: number;
  previousCompleted: number;
  currentCompleted: number;
  nextDay: number;
  fps: number;
  width: number;
  height: number;
  /** relative to /public. Dropping a file with this name in /public is all that is needed */
  audioFile: string;
  /** relative to /public */
  srtFile: string;
  /** seconds appended after the last SRT cue when there is NO audio file yet */
  silentTailSec: number;
  introBeats: BeatConfig[];
  outroBeats: BeatConfig[];
};

export type GeneratedCue = { start: number; end: number; text: string };

export type GeneratedMeta = {
  episodeId: string;
  fps: number;
  durationSec: number;
  durationInFrames: number;
  /** null => no audio file found, composition is silent but still renders */
  audio: null | {
    file: string;
    durationSec: number;
    sampleRate: number;
    channels: number;
    bitDepth: number;
  };
  timingSource: "srt";
  /** SRT timing is the authoritative cue source; sub-cue (per word) timing is ESTIMATED */
  subCueTimingEstimated: true;
  srtEndSec: number;
  cues: Record<string, GeneratedCue>;
  warnings: string[];
};
