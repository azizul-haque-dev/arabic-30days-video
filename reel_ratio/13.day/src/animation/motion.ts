import { CSSProperties, createContext, useContext } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../config/theme";

export type SpringName = keyof typeof theme.spring;

/** Local scene info (frames are relative to the scene's own Sequence). */
export type SceneInfo = { durationInFrames: number; id: string };
export const SceneContext = createContext<SceneInfo>({ durationInFrames: 1, id: "none" });

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));

/** 0 -> 1 spring (overshoot clamped), starting at `delay` frames. */
export const useSpringProgress = (delay: number, preset: SpringName = "smooth"): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return clamp01(spring({ frame: frame - delay, fps, config: theme.spring[preset] }));
};

/** 0 -> 1 as the scene approaches its last frame. Exits are faster than entrances. */
export const useExitProgress = (): number => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useContext(SceneContext);
  const last = durationInFrames - 1;
  return interpolate(frame, [last - theme.motion.exitFrames, last], [0, 1], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export type RevealOptions = {
  y?: number;
  scale?: number;
  preset?: SpringName;
  /** show instantly (used for the thumbnail: frame 0 must already be a finished design) */
  instant?: boolean;
  exit?: boolean;
};

/**
 * Entrance (opacity + translateY + scale, three properties together) and a
 * faster exit. All travel is bounded by theme.motion.maxTravel.
 */
export const useReveal = (delay: number, opts: RevealOptions = {}): CSSProperties => {
  const { y = theme.motion.maxTravel, scale = 0.94, preset = "smooth", instant = false, exit = true } = opts;
  const p = useSpringProgress(delay, preset);
  const e = useExitProgress();
  const enter = instant ? 1 : p;
  const out = exit ? e : 0;
  const ty = (1 - enter) * Math.min(y, theme.motion.maxTravel) - out * 10;
  const sc = scale + (1 - scale) * enter;
  return {
    opacity: enter * (1 - out),
    transform: `translateY(${ty.toFixed(2)}px) scale(${sc.toFixed(4)})`,
    willChange: "transform, opacity",
  };
};

/** Idle sin-wave value in [-1, 1] for illustration micro-motion. */
export const idleWave = (t: number, periodSec = 3, phase = 0): number =>
  Math.sin(((t + phase) / periodSec) * Math.PI * 2);

export const easeOut = (x: number): number => theme.ease.out(clamp01(x));
export const easeInOut = (x: number): number => theme.ease.inOut(clamp01(x));
export const lerp = (a: number, b: number, p: number): number => a + (b - a) * p;
export { clamp01 };
