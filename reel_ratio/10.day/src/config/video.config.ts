// Centralized video specification. Nothing else may hardcode these values.
export const video = {
  width: 1080,
  height: 1920,
  fps: 30,
  compositionId: "ArabicMaster",
  overlapSec: 0.3, // outgoing scene exit / incoming scene entrance overlap
  safe: { x: 80, top: 160, bottom: 240 },
} as const;
