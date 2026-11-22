/**
 * Vocabulary data - kept separate from animation code.
 * `pronCue` / `meaningCue` are SRT cue indexes (1-based, as in the .srt file).
 * Timing always comes from the SRT; edit the SRT and everything re-syncs.
 *
 * Arabic = natural spoken Gulf forms, one consistent spelling each.
 */
export type IconKey =
  | "self"
  | "you-m"
  | "you-f"
  | "he"
  | "she"
  | "we"
  | "you-all"
  | "they"
  | "father"
  | "father-mine"
  | "mother"
  | "mother-mine";

export type VocabItem = {
  id: string;
  arabic: string;
  icon: IconKey;
  pronCue: number;
  meaningCue: number;
  /** Only when pronunciation and meaning share ONE cue (cue 23). */
  split?: {pron: string; meaning: string; meaningOffsetSec: number};
};

export const vocab: VocabItem[] = [
  {id: "ana", arabic: "أنا", icon: "self", pronCue: 1, meaningCue: 2},
  {id: "inta", arabic: "أنتَ", icon: "you-m", pronCue: 3, meaningCue: 4},
  {id: "inti", arabic: "أنتِ", icon: "you-f", pronCue: 5, meaningCue: 6},
  {id: "huwa", arabic: "هو", icon: "he", pronCue: 7, meaningCue: 8},
  {id: "hiya", arabic: "هي", icon: "she", pronCue: 9, meaningCue: 10},
  {id: "ihna", arabic: "إحنا", icon: "we", pronCue: 11, meaningCue: 12},
  {id: "intu", arabic: "أنتو", icon: "you-all", pronCue: 13, meaningCue: 14},
  {id: "humma", arabic: "هم", icon: "they", pronCue: 15, meaningCue: 16},
  {id: "ab", arabic: "أب", icon: "father", pronCue: 17, meaningCue: 18},
  {id: "abuy", arabic: "أبوي", icon: "father-mine", pronCue: 19, meaningCue: 20},
  {id: "umm", arabic: "أم", icon: "mother", pronCue: 21, meaningCue: 22},
  {
    id: "ummi",
    arabic: "أمي",
    icon: "mother-mine",
    pronCue: 23,
    meaningCue: 23,
    split: {pron: "উম্মি", meaning: "আমার মা", meaningOffsetSec: 0.55},
  },
];
