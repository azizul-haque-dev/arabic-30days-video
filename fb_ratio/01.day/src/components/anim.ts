import type { CSSProperties } from "react";
import { interpolate, spring } from "remotion";
import { theme } from "../theme";

export const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const tween = (frame: number, a: number, b: number, x: number, y: number, easing: (t: number) => number = theme.ease.out) =>
  interpolate(frame, [a, b], [x, y], { easing, ...CL });

export const spr = (frame: number, fps: number, delay: number, config: { damping: number; stiffness: number; mass: number } = theme.spring.snappy) =>
  spring({ frame: frame - delay, fps, config });

/** Entrance: opacity + translateY + scale (never a lone fade). */
export const enter = (
  frame: number, fps: number, delay: number,
  o: { y?: number; s?: number; x?: number; cfg?: { damping: number; stiffness: number; mass: number } } = {}
): CSSProperties => {
  const p = spr(frame, fps, delay, o.cfg ?? theme.spring.smooth);
  return {
    opacity: Math.min(1, p * 1.6),
    transform: `translate(${(o.x ?? 0) * (1 - p)}px, ${(o.y ?? 40) * (1 - p)}px) scale(${1 - (1 - (o.s ?? 0.94)) * (1 - p)})`,
  };
};

/** Exit that is faster than entrances (10 frames). */
export const exitAt = (frame: number, at: number, len = 10) => tween(frame, at, at + len, 0, 1, theme.ease.in);

/** 0..1 ramp window used for waveform amplitude. */
export const win = (frame: number, a: number, b: number) =>
  tween(frame, a, a + 5, 0, 1, theme.ease.soft) * tween(frame, b - 4, b, 1, 0, theme.ease.soft);

const BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
export const toBn = (n: number | string) => String(n).replace(/\d/g, (d) => BN[+d]);
