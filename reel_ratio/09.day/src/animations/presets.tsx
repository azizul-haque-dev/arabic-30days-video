import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

type SpringName = keyof typeof theme.spring;

export const useSpringIn = (delay = 0, preset: SpringName = "smooth") => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: theme.spring[preset] });
};

/** Fade + rise + scale entrance (3 properties together). */
export const Entrance: React.FC<{
  delay?: number;
  y?: number;
  x?: number;
  scaleFrom?: number;
  preset?: SpringName;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, y = 40, x = 0, scaleFrom = 0.94, preset = "smooth", style, children }) => {
  const p = useSpringIn(delay, preset);
  const o = Math.min(1, Math.max(0, p));
  return (
    <div
      style={{
        opacity: o,
        transform: `translate(${interpolate(p, [0, 1], [x, 0])}px, ${interpolate(p, [0, 1], [y, 0])}px) scale(${interpolate(p, [0, 1], [scaleFrom, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Exit progress 0..1 over the last `frames` frames of the current Sequence. */
export const useExit = (frames: number = theme.layout.exitFrames) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(frame, [durationInFrames - frames, durationInFrames - 1], [0, 1], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/** Wraps a whole scene so that it leaves quickly (faster than it entered). */
export const SceneExit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const e = useExit();
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 1 - e,
        transform: `translateY(${-34 * e}px) scale(${1 - 0.025 * e})`,
      }}
    >
      {children}
    </div>
  );
};

/** Slow idle motion for elements that stay on screen > 2s. */
export const useBreathe = (period = 70, amp = 0.015) => {
  const frame = useCurrentFrame();
  return 1 + Math.sin((frame / period) * Math.PI * 2) * amp;
};
export const useFloat = (period = 90, amp = 6, phase = 0) => {
  const frame = useCurrentFrame();
  return Math.sin((frame / period) * Math.PI * 2 + phase) * amp;
};

/** Eased 0..1 progress between two frames. */
export const ramp = (frame: number, from: number, to: number, easing = theme.ease.out) =>
  interpolate(frame, [from, to], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Word-by-word reveal. Splits on spaces; rtl for Arabic. */
export const WordReveal: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  rtl?: boolean;
  gap?: number;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, per = 3, rtl = false, gap = 16, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: gap, rowGap: 4, ...style }}
    >
      {text.split(" ").map((w, i) => {
        const p = spring({ frame: frame - delay - i * per, fps, config: theme.spring.snappy });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: Math.min(1, Math.max(0, p)),
              transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
