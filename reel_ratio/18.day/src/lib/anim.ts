import { interpolate, spring } from "remotion";
import { theme } from "../theme";

type Ease = (t: number) => number;

/** Eased 0→1 progress between start and start+dur (never linear, always clamped). */
export const prog = (frame: number, start: number, dur: number, easing: Ease = theme.ease.out): number =>
  interpolate(frame, [start, start + Math.max(1, dur)], [0, 1], {
    easing, extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

export const springIn = (
  frame: number, fps: number, delay = 0,
  config: { damping: number; stiffness: number; mass: number } = theme.spring.snappy,
): number => spring({ frame: frame - delay, fps, config });

/** Entrance = opacity + translate + scale together (3 properties). */
export const entrance = (
  frame: number, fps: number, delay = 0,
  o: { x?: number; y?: number; scale?: number; config?: { damping: number; stiffness: number; mass: number } } = {},
): { opacity: number; transform: string } => {
  const { x = 0, y = 22, scale = 0.94, config = theme.spring.smooth } = o;
  const s = springIn(frame, fps, delay, config);
  const opacity = prog(frame, delay, Math.round(fps * 0.35));
  return {
    opacity,
    transform: `translate(${(1 - s) * x}px, ${(1 - s) * y}px) scale(${scale + (1 - scale) * s})`,
  };
};

/** Exit (faster than entrance): 1→0 over `dur` frames ending at `endFrame`. */
export const exitFade = (frame: number, endFrame: number, dur = 8): number =>
  interpolate(frame, [endFrame - dur, endFrame], [1, 0], {
    easing: theme.ease.in, extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

export const breathe = (frame: number, fps: number, amp = 1, period = 3, phase = 0): number =>
  Math.sin((frame / fps / period) * Math.PI * 2 + phase) * amp;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
