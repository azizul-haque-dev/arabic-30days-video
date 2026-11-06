export interface SrtCue {
  index: number;
  startSec: number;
  endSec: number;
  text: string;
}

export interface TimedWord {
  text: string;
  startSec: number;
  endSec: number;
  cueIndex: number;
}

export interface Sentence {
  number: number;
  arabic?: string; // only when supplied by the script; never generated
  pronunciation: string;
  meaning: string;
  illustration: string;
  startSec: number;
  pronStartSec: number;
  repeatSec: number;
  meaningStartSec: number;
  endSec: number;
}

export interface Stage {
  text: string;
  startSec: number;
  visual: string;
}

export interface EpisodeConfig {
  episodeNumber: number;
  brandName: string;
  dialectLabel: string;
  seriesTitle: string;
  totalDays: number;
  totalSentences: number;
  completedBefore: number;
  completedSentences: number;
  sentenceStartNumber: number;
  sentenceEndNumber: number;
  hook: string;
  hookHighlight: string;
  ctaText: string;
  nextEpisodeNumber: number;
  introStages: Stage[];
  outroStages: Stage[];
  sentences: Sentence[];
  timing: {
    thumbnailEndSec: number;
    introEndSec: number;
    outroStartSec: number;
    endSec: number;
  };
  warnings: string[];
}

export interface EpisodeMeta {
  brandName: string;
  dialectLabel: string;
  arabicPlaceholder: string;
  meaningMarker: string;
  thumbnailEndAnchor: string;
  introAnchors: string[];
  introVisuals: string[];
  outroStartAnchor: string;
  outroAnchors: string[];
  outroVisuals: string[];
  textNormalizations: { find: string; replace: string; reason?: string }[];
  illustrations: Record<string, string>;
  tailSec: number;
}
