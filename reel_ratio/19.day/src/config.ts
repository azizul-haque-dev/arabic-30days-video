/**
 * Pure constants (no Remotion imports) so Node scripts and React code can share them.
 */
export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

/** 9:16 safe zone: platform UI covers roughly the top/bottom 12.5%. */
export const SAFE = {
  top: 240,
  bottom: 1680,
  side: 80,
} as const;
