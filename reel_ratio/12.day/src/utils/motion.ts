import { createContext, useContext } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

/** When true (thumbnail) every entrance is already complete on frame 0 so the first frame is a finished design. */
export const InstantContext = createContext(false);

export type Preset = keyof typeof theme.springs;

/** 0 -> 1 entrance progress, starting `delay` frames into the scene. */
export function useEnter(delay = 0, preset: Preset = "enter"): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const instant = useContext(InstantContext);
  if (instant) return 1;
  return spring({ frame: frame - delay, fps, config: theme.springs[preset] });
}

/** Sine-wave micro motion for anything that stays on screen. */
export function useBreathe(amp: number, periodSec = 3, phase = 0): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return Math.sin((frame / fps) * ((Math.PI * 2) / periodSec) + phase) * amp;
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Opacity that reaches 1 early in the spring so fades never lag the movement. */
export const fadeIn = (p: number) => interpolate(p, [0, 0.55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
export const secToFrames = (s: number, fps: number) => Math.round(s * fps);
