import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

/**
 * Arabic RTL text. Words reveal right-to-left; while the narrator is saying the
 * sentence (activeRanges, in local frames) the text turns primary and pulses.
 * Each word is its own inline-block, so Arabic shaping/ligatures inside a word
 * are untouched (joining never crosses a space).
 */
export const ArabicText: React.FC<{
  text: string;
  fontSize?: number;
  delay?: number;
  activeRanges?: [number, number][];
  color?: string;
  maxWidth?: number;
}> = ({ text, fontSize = 82, delay = 0, activeRanges = [], color = theme.colors.text, maxWidth = 900 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  let active = 0;
  for (const [a, b] of activeRanges) {
    const up = interpolate(frame, [a, a + 6], [0, 1], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const down = interpolate(frame, [b - 6, b], [1, 0], { easing: theme.ease.in, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    active = Math.max(active, Math.min(up, down));
  }
  const pulse = 1 + active * 0.035;

  return (
    <div
      dir="rtl"
      lang="ar"
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: fontSize * 0.28,
        rowGap: 2,
        maxWidth,
        fontFamily: theme.fonts.arabic,
        fontWeight: 700,
        fontSize,
        lineHeight: 1.45,
        color: active > 0.5 ? theme.colors.primary : color,
        transform: `scale(${pulse})`,
        textShadow: active > 0.01 ? `0 0 ${40 * active}px ${theme.colors.glow}` : undefined,
        unicodeBidi: "isolate",
        fontFeatureSettings: '"liga" 1, "calt" 1, "ccmp" 1',
      }}
    >
      {words.map((w, i) => {
        const p = spring({ frame: frame - delay - i * 3, fps, config: theme.spring.snappy });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: Math.min(1, Math.max(0, p)),
              transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
