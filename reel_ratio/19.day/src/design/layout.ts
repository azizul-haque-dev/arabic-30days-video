import { SAFE, VIDEO } from "../config";

/**
 * Fixed vertical layout for sentence scenes (1080 x 1920). Every block has its own
 * reserved band, so Bengali / Arabic / meaning / illustration can never overlap.
 */
export const L = {
  width: VIDEO.width,
  height: VIDEO.height,
  side: SAFE.side,
  contentWidth: VIDEO.width - SAFE.side * 2, // 920
  brandTop: 140,
  numberRow: { top: 250, height: 72 },
  illustration: { top: 350, height: 580 }, // 350 -> 930
  card: { top: 960, height: 720 }, // 960 -> 1680
  cardPadX: 48,
  cardPadY: 36,
  slots: { pron: 262, arabic: 150, meaning: 132, gap: 32 },
} as const;
