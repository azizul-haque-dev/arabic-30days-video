import { interpolate, spring } from "remotion";
import { ease, springs } from "../design/tokens";

type SpringCfg = (typeof springs)[keyof typeof springs];

/** Entrance progress 0 -> 1 (spring). */
export const enter = (frame: number, fps: number, delay = 0, config: SpringCfg = springs.smooth): number =>
  spring({ frame: frame - delay, fps, config });

/** Exit progress 0 -> 1 over the last `len` frames of a scene (faster than entrances). */
export const exitProgress = (frame: number, duration: number, len = 10): number =>
  interpolate(frame, [duration - len, duration - 1], [0, 1], {
    easing: ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));

/** Smooth 0..1..0 bump for one-shot emphasis pulses. */
export const bump = (frame: number, start: number, len: number): number => {
  const t = clamp01((frame - start) / len);
  return Math.sin(Math.PI * ease.out(t));
};

/** Smooth ramp helper (eased, clamped). */
export const ramp = (frame: number, from: number, to: number, a = 0, b = 1): number =>
  interpolate(frame, [from, to], [a, b], { easing: ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const secToFrame = (sec: number, fps: number): number => Math.round(sec * fps);
