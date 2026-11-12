import React, { createContext, useContext } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";

/** Lets short scenes play an illustration faster (rate > 1) without changing its code. */
const RateContext = createContext(1);
export const TimeScale: React.FC<{ rate: number; children: React.ReactNode }> = ({ rate, children }) =>
  React.createElement(RateContext.Provider, { value: rate }, children);

/** Local frame, optionally time-scaled by <TimeScale>. */
export const useFrame = () => {
  const frame = useCurrentFrame();
  return frame * useContext(RateContext);
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Eased 0→1 between two frames (never linear). */
export const ease = (
  frame: number,
  from: number,
  to: number,
  easing: (t: number) => number = theme.ease.out,
) => interpolate(frame, [from, Math.max(from + 1, to)], [0, 1], { ...clamp, easing });

/** Spring 0→1 starting at `start`. */
export const useSpringAt = (start: number, config = theme.spring.pop, delay = 0) => {
  const frame = useFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start - delay, fps, config });
};

/** Entrance: opacity + translateY + scale animate together (never a lone fade). */
export const useEnter = (start: number, opts: { delay?: number; y?: number; from?: number; config?: typeof theme.spring.pop } = {}) => {
  const { delay = 0, y = 40, from = 0.92, config = theme.spring.soft } = opts;
  const p = useSpringAt(start, config, delay);
  const frame = useFrame();
  const o = ease(frame, start + delay, start + delay + 10);
  return {
    p,
    opacity: o,
    transform: `translateY(${(1 - p) * y}px) scale(${from + (1 - from) * p})`,
  };
};

/** Exit progress 0→1 (shorter than entrances, ~8 frames). */
export const useExit = (end: number, dur = 8) => {
  const frame = useCurrentFrame();
  return ease(frame, end - dur, end, theme.ease.in);
};

/** Idle "breathing" micro-motion (sin wave). */
export const useBreath = (amp = 1, period = 90, phase = 0) => {
  const frame = useFrame();
  return Math.sin(((frame + phase) / period) * Math.PI * 2) * amp;
};
