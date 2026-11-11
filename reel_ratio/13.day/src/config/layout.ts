import { episodeConfig } from "./episode";

export type Rect = { x: number; y: number; w: number; h: number };

export const CANVAS = {
  width: episodeConfig.video.width,
  height: episodeConfig.video.height,
};

/** Platform UI covers the top and bottom of a 9:16 frame. */
export const SAFE = { left: 70, right: 70, top: 80, bottom: 200 };

/** Minimum gap between any two visible boxes. */
export const MIN_GAP = 16;

/** Inner padding every text block keeps inside its slot (room for animation travel). */
export const SLOT_PAD_X = 20;
export const SLOT_PAD_Y = 26;
/** Text blocks animate words by <= 14px, so they need less vertical padding. */
export const TEXT_PAD_Y = 18;

const X = SAFE.left;
const W = CANVAS.width - SAFE.left - SAFE.right; // 940

const row = (y: number, h: number): Rect => ({ x: X, y, w: W, h });

export type SlotMap = Record<string, Rect>;

const header: SlotMap = {
  brand: { x: X, y: 80, w: 560, h: 120 },
  badge: { x: 650, y: 80, w: 360, h: 120 },
};

/** Sentence scene: Header / Number / Illustration / Arabic / Label / Pronunciation / Meaning */
export const sentenceSlots: SlotMap = {
  ...header,
  number: row(225, 110),
  illustration: row(355, 620),
  arabic: row(995, 100),
  pronLabel: row(1115, 66),
  pron: row(1197, 324),
  meaning: row(1541, 179),
};

export const hookSlots: SlotMap = {
  ...header,
  series: row(225, 110),
  market: { x: X, y: 355, w: 450, h: 640 },
  taxi: { x: 560, y: 355, w: 450, h: 640 },
  hook: row(1015, 480),
};

export const brandSlots: SlotMap = {
  logo: row(380, 420),
  text: row(840, 360),
  icons: row(1260, 400),
};

export const episodeIntroSlots: SlotMap = {
  ...header,
  lineA: row(250, 280),
  lineB: row(550, 260),
  progress: row(850, 360),
  icons: row(1240, 440),
};

export const topicIntroSlots: SlotMap = {
  ...header,
  lineA: row(250, 300),
  lineB: row(570, 160),
  market: { x: X, y: 770, w: 450, h: 560 },
  taxi: { x: 560, y: 770, w: 450, h: 560 },
  dots: row(1360, 150),
};

export const summarySlots: SlotMap = {
  ...header,
  title: row(250, 290),
  grid: row(570, 350),
  line: row(950, 250),
  progress: row(1230, 360),
  strip: row(1610, 110),
};

export const ctaSlots: SlotMap = {
  ...header,
  lineA: row(250, 320),
  follow: row(600, 330),
  lineB: row(960, 150),
  comment: row(1140, 360),
};

export const outroSlots: SlotMap = {
  logo: row(420, 420),
  text: row(880, 300),
  badge: { x: 290, y: 1220, w: 500, h: 160 },
};

export const allSlotSets: Record<string, SlotMap> = {
  sentence: sentenceSlots,
  hook: hookSlots,
  brand: brandSlots,
  episodeIntro: episodeIntroSlots,
  topicIntro: topicIntroSlots,
  summary: summarySlots,
  cta: ctaSlots,
  outro: outroSlots,
};
