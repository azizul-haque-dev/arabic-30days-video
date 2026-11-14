import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CSSProperties } from "react";
import { theme, type SpringPreset } from "./theme";

export const sec = (s: number, fps: number) => Math.round(s * fps);

/** spring 0→1 starting `delaySec` after the local scene start */
export const useEnter = (delaySec = 0, preset: SpringPreset = "snappy") => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - sec(delaySec, fps), fps, config: theme.spring[preset] });
};

/** opacity + translateY + scale together (never a lone fade) */
export const enterStyle = (p: number, y = 28, from = 0.94): CSSProperties => ({
  opacity: interpolate(p, [0, 0.55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  transform: `translateY(${(1 - p) * y}px) scale(${from + (1 - from) * p})`,
});

/** 0→1 across the final `exitSec` of a scene (faster than entrances) */
export const useExit = (durationInFrames: number, exitSec: number = theme.timing.exitSec) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = sec(exitSec, fps);
  return interpolate(frame, [durationInFrames - n, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.easing.in,
  });
};

export const exitStyle = (e: number): CSSProperties => ({
  opacity: 1 - e,
  transform: `translateY(${-26 * e}px) scale(${1 - 0.03 * e})`,
});

/** idle micro-motion, value in [-1,1] */
export const breathe = (frame: number, fps: number, periodSec = 3.2, phase = 0) =>
  Math.sin((frame / fps) * ((Math.PI * 2) / periodSec) + phase);

export const ease = (frame: number, from: number, to: number, a: number, b: number) =>
  interpolate(frame, [from, to], [a, b], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.easing.out,
  });
