import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

type SpringCfg = (typeof theme.spring)[keyof typeof theme.spring];

export const useEnter = (delay = 0, config: SpringCfg = theme.spring.smooth) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

// Entrance: opacity + rise + scale together, never a lone fade.
export const Enter: React.FC<{
  delay?: number; y?: number; from?: number; config?: SpringCfg; style?: React.CSSProperties; children: React.ReactNode;
}> = ({ delay = 0, y = 40, from = 0.94, config = theme.spring.smooth, style, children }) => {
  const p = useEnter(delay, config);
  return (
    <div style={{ opacity: Math.min(1, p * 1.6), transform: `translateY(${interpolate(p, [0, 1], [y, 0])}px) scale(${interpolate(p, [0, 1], [from, 1])})`, ...style }}>
      {children}
    </div>
  );
};

// Word-by-word reveal; pixel gaps (not em) for big type.
export const WordReveal: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  style?: React.CSSProperties;
  gap?: number;
  wordStyle?: (i: number, w: string) => React.CSSProperties;
}> = ({
  text, delay = 0, per = 3, style, gap = 22, wordStyle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = text.split("\n");
  let wordIndex = 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, ...style }}>
      {lines.map((line, lineIdx) => (
        <div key={lineIdx} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: gap, rowGap: 4 }}>
          {line.split(" ").filter(Boolean).map((word) => {
            const i = wordIndex++;
            const p = spring({ frame: frame - delay - i * per, fps, config: theme.spring.snappy });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: Math.min(1, p * 1.5),
                  transform: `translateY(${interpolate(p, [0, 1], [34, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
                  ...(wordStyle ? wordStyle(i, word) : {}),
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Scene-boundary mask wipe. Midpoint (full cover) lands one frame before the cut.
export const WipePanel: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 14], [0, 1], { easing: theme.ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const left = interpolate(p, [0, 1], [-1900, 1180]);
  return (
    <div style={{ position: "absolute", top: -100, bottom: -100, left, width: 1800, transform: "skewX(-9deg)", pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${theme.colors.primaryDark}, ${theme.colors.primary})` }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, right: -34, width: 34, background: theme.colors.accent }} />
    </div>
  );
};
