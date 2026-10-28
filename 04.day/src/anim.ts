import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, SpringName } from "./theme";

export const clampX = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** spring progress 0→1 starting at `delay` frames */
export const useSpring = (delay = 0, cfg: SpringName = "smooth") => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: theme.spring[cfg] });
};

/** bezier-eased tween between two frames */
export const tween = (frame: number, a: number, b: number, from: number, to: number, easing = theme.ease.out) =>
  interpolate(frame, [a, b], [from, to], { easing, ...clampX });

/** 1 while frame is between a and b (soft edges), used for "speaking" windows */
export const windowOn = (frame: number, a: number, b: number, soft = 4) =>
  tween(frame, a, a + soft, 0, 1) * tween(frame, b - soft, b, 1, 0, theme.ease.in);
