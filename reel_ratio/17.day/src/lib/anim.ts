import { Easing, interpolate, spring } from "remotion";
import { theme } from "../theme";

/** Seconds -> frames. All timing in the project is expressed in seconds. */
export const sec = (s: number, fps: number): number => Math.round(s * fps);

type EaseFn = (t: number) => number;

/** interpolate() that is always clamped and ALWAYS eased (never linear). */
export const ease = (
  frame: number,
  input: [number, number],
  output: [number, number],
  easing: EaseFn = theme.easings.out,
): number =>
  interpolate(frame, input, output, {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const easeInOut = Easing.inOut(Easing.cubic);

/** 0 -> 1 spring starting at `delayFrames`. */
export const springIn = (
  frame: number,
  fps: number,
  delayFrames = 0,
  preset: keyof typeof theme.springs = "soft",
): number =>
  spring({
    frame: frame - delayFrames,
    fps,
    config: theme.springs[preset],
  });

/** Gentle idle motion (seconds period). Returns -1..1. */
export const idle = (frame: number, fps: number, periodSec = 3.2, phase = 0): number =>
  Math.sin(((frame / fps) * Math.PI * 2) / periodSec + phase);

/**
 * Standard scene fade: eases in at the start, eases out over the last frames.
 * Exit is faster than the entrance (design rule).
 */
export const sceneOpacity = (frame: number, duration: number, fps: number, enterDelaySec = 0): number => {
  const inStart = sec(enterDelaySec, fps);
  const inEnd = inStart + sec(theme.motion.enterSec * 0.6, fps);
  const exitLen = Math.min(sec(theme.motion.exitSec, fps), Math.max(2, Math.floor(duration * 0.3)));
  const a = ease(frame, [inStart, inEnd], [0, 1], theme.easings.out);
  const b = ease(frame, [duration - exitLen, duration], [1, 0], theme.easings.in);
  return Math.min(a, b);
};

export const sceneExitShift = (frame: number, duration: number, fps: number, px = 28): number => {
  const exitLen = Math.min(sec(theme.motion.exitSec, fps), Math.max(2, Math.floor(duration * 0.3)));
  return ease(frame, [duration - exitLen, duration], [0, -px], theme.easings.in);
};
