import { interpolate, spring } from "remotion";
import { theme } from "../config/theme";

type SpringName = keyof typeof theme.springs;

/** Spring progress 0..1 (slight overshoot allowed), starting at `delay` frames. */
export const enter = (frame: number, fps: number, delay = 0, kind: SpringName = "enter") =>
  spring({ frame: frame - delay, fps, config: theme.springs[kind] });

/** Entrance style: opacity + translateY + scale together (never a lone fade). */
export const enterStyle = (p: number, y = 36, scaleFrom = 0.94) => {
  const o = interpolate(p, [0, 0.55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.easings.out });
  return {
    opacity: o,
    transform: `translateY(${(1 - Math.min(p, 1.2)) * y}px) scale(${scaleFrom + (1 - scaleFrom) * Math.min(p, 1)})`,
  } as const;
};

/** 0 -> 1 over the last `exitFrames` of a clip of `dur` frames. Eased, never linear. */
export const exitProgress = (frame: number, dur: number, exitFrames: number) =>
  interpolate(frame, [dur - exitFrames, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.easings.in,
  });

export const eased = (frame: number, from: number, to: number, a = 0, b = 1, easing = theme.easings.inOut) =>
  interpolate(frame, [from, to], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

export const sec = (s: number, fps: number) => Math.round(s * fps);

/** Idle breathing micro-motion (sin wave). */
export const breathe = (frame: number, fps: number, amp = 1, period = 2.4, phase = 0) =>
  Math.sin(((frame / fps) / period) * Math.PI * 2 + phase) * amp;
