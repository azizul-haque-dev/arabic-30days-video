import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

type SpringName = keyof typeof theme.spring;

/** 0 -> 1 spring progress starting at `delay` (frames, relative to scene). */
export const useSpring = (delay = 0, preset: SpringName = "smooth") => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: theme.spring[preset] });
};

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** eased 0..1 over [start, end] frames */
export const ramp = (frame: number, start: number, end: number, easing = theme.ease.out) =>
  interpolate(frame, [start, Math.max(end, start + 1)], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Fraction of exit animation (0 = fully visible, 1 = gone). Exits are faster than entrances (10 frames). */
export const exitAmount = (frame: number, duration: number, len = 10) =>
  interpolate(frame, [duration - len, duration - 1], [0, 1], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Bengali-safe font-size fitting (conservative width factor, no character splitting). */
export const fitFont = (text: string, maxWidth: number, maxSize: number, minSize: number, lines = 1, factor = 0.6) => {
  const perLine = Math.ceil(text.length / lines);
  const size = maxWidth / (perLine * factor);
  return Math.round(Math.max(minSize, Math.min(maxSize, size)));
};
