/** Pure data types (no React) so Node scripts can import episode configs. */

export type IllustrationKey =
  | "thumbnail"
  | "restaurant"
  | "bill"
  | "order"
  | "late-order"
  | "cold-food"
  | "bread"
  | "missing-spoon"
  | "leftovers"
  | "takeaway"
  | "reserved"
  | "table-two";

export interface SentenceContent {
  id: string;
  number: number;
  titleEn: string;
  /** Original narration, split into the three spoken parts. Joined with a space = original text. */
  narration: { lead: string; phrase: string; meaning: string };
  /** Bengali pronunciation, exactly as written. "..." marks a pause between units. */
  pronunciation: string;
  /** Arabic text; same unit structure as `pronunciation`. */
  arabic: string;
  /** Bengali meaning shown on screen. */
  meaning: string;
  illustration: IllustrationKey;
  visualBrief: string;
}

export interface IntroBeat {
  id: string;
  narration: string;
}

export interface EpisodeConfig {
  episodeId: string;
  seriesTitle: string;
  topicEn: string;
  topicBn: string;
  dayNumber: number;
  nextDayNumber: number;
  sentenceRange: [number, number];
  totalSeriesSentences: number;
  previousCompleted: number;
  currentCompleted: number;
  /** Audio files are looked up in public/<audioDir>/<episodeId>.<ext> */
  audioDir: string;
  audioExtensions: string[];
  subtitleDir: string;
  /** Seconds the thumbnail is held at the start before the intro takes over. */
  thumbnailHoldSec: number;
  /** Shift every visual cue (seconds). Positive = visuals later. */
  syncOffsetSec: number;
  showCaptions: boolean;
  intro: IntroBeat[];
  sentences: SentenceContent[];
  outro: IntroBeat[];
}
