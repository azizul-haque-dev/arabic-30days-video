import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {E, SPRING} from "./theme";

/** Local time helpers — every duration is expressed in seconds, derived from fps. */
export const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {frame, fps, t: frame / fps};
};

export const ip = (
  t: number,
  inR: [number, number],
  outR: [number, number],
  ease: (x: number) => number = E.out,
) =>
  interpolate(t, inR, outR, {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Spring that starts at `at` seconds (0 before). */
export const useSpr = (at: number, cfg: keyof typeof SPRING = "pop") => {
  const {frame, fps} = useT();
  return spring({frame: frame - at * fps, fps, config: SPRING[cfg]});
};

/** 2–3 property entrance: opacity + translateY + scale. */
export const useEnter = (at: number, dy = 40, cfg: keyof typeof SPRING = "pop") => {
  const p = useSpr(at, cfg);
  return {
    opacity: Math.min(1, p * 1.6),
    transform: `translateY(${(1 - p) * dy}px) scale(${0.9 + 0.1 * p})`,
    p,
  };
};

export const breathe = (t: number, amp = 1, speed = 1.6, phase = 0) =>
  Math.sin(t * speed + phase) * amp;
