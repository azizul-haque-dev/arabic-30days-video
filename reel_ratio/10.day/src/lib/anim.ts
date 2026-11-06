import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

type SpringCfg = { damping: number; stiffness: number; mass: number };

/** Spring entrance progress (0 -> 1), starting after `delayFrames`. */
export const useEnter = (delayFrames = 0, cfg: SpringCfg = theme.spring.smooth): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delayFrames;
  if (f < 0) return 0;
  return spring({ frame: f, fps, config: cfg });
};

/** Eased exit progress (0 -> 1) over the last `exitFrames` frames of the current Sequence. */
export const useExit = (exitFrames: number): number => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  if (exitFrames <= 0) return 0;
  return interpolate(frame, [durationInFrames - exitFrames, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.ease.in,
  });
};

/** Sine micro-motion for idle elements. */
export const useBreathe = (amp = 6, periodSec = 3, phase = 0): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return Math.sin((frame / fps) * ((Math.PI * 2) / periodSec) + phase) * amp;
};

/** Local time in seconds inside the current Sequence. */
export const useSeconds = (): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

export const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));
