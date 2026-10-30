import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Premium entrance: opacity + rise + scale, spring driven. */
export const Entrance: React.FC<{
  delay?: number;
  children: React.ReactNode;
  from?: number;
  scaleFrom?: number;
  style?: React.CSSProperties;
  config?: typeof theme.spring.smooth | typeof theme.spring.snappy | typeof theme.spring.bouncy;
  x?: number;
}> = ({
  delay = 0,
  children,
  from = 40,
  scaleFrom = 0.94,
  style,
  config = theme.spring.smooth,
  x = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config });
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 0.6], [0, 1], clamp),
        transform: `translate(${interpolate(p, [0, 1], [x, 0])}px, ${interpolate(
          p,
          [0, 1],
          [from, 0]
        )}px) scale(${interpolate(p, [0, 1], [scaleFrom, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Word-by-word staggered reveal. Splits ONLY on spaces — never per character (preserves Bengali conjuncts). */
export const WordReveal: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  style?: React.CSSProperties;
  wordStyle?: (i: number, w: string) => React.CSSProperties;
  justify?: React.CSSProperties["justifyContent"];
  gap?: number;
}> = ({
  text,
  delay = 0,
  per = 4,
  style,
  wordStyle,
  justify = "flex-start",
  gap = 18,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: gap,
        rowGap: 6,
        justifyContent: justify,
        letterSpacing: 0,
        ...style,
      }}
    >
      {text.split(" ").map((word, i) => {
        const p = spring({ frame: frame - delay - i * per, fps, config: theme.spring.snappy });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: interpolate(p, [0, 0.7], [0, 1], clamp),
              transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(
                p,
                [0, 1],
                [0.92, 1]
              )})`,
              ...(wordStyle ? wordStyle(i, word) : {}),
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

/** Wraps a scene: faster exit (~10f) than entrance. */
export const SceneExit: React.FC<{ dur: number; children: React.ReactNode }> = ({
  dur,
  children,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [dur - 11, dur - 2], [1, 0], { ...clamp, easing: theme.ease.in });
  const y = interpolate(frame, [dur - 11, dur - 2], [0, -32], { ...clamp, easing: theme.ease.in });
  const s = interpolate(frame, [dur - 11, dur - 2], [1, 0.97], { ...clamp, easing: theme.ease.in });
  return (
    <AbsoluteFill style={{ opacity: o, transform: `translateY(${y}px) scale(${s})` }}>
      {children}
    </AbsoluteFill>
  );
};

/** Idle breathing helper for elements resting on screen. */
export const useBreath = (period = 28, amp = 0.015) => {
  const frame = useCurrentFrame();
  return {
    scale: 1 + Math.sin(frame / period) * amp,
    float: Math.sin(frame / (period * 1.25)) * 4,
  };
};

export const Pill: React.FC<{
  children: React.ReactNode;
  tone?: "soft" | "accent" | "hero" | "white";
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, tone = "soft", size = 32, style }) => {
  const map = {
    soft: { bg: theme.colors.primarySoft, fg: theme.colors.primaryDeep },
    accent: { bg: theme.colors.accentSoft, fg: theme.colors.text },
    hero: { bg: theme.colors.primary, fg: theme.colors.white },
    white: { bg: theme.colors.surface, fg: theme.colors.text },
  }[tone];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: `${size * 0.26}px ${size * 0.65}px`,
        borderRadius: theme.radius.pill,
        background: map.bg,
        color: map.fg,
        fontSize: size,
        fontWeight: theme.weights.strong,
        lineHeight: 1.2,
        letterSpacing: 0,
        boxShadow: tone === "white" ? theme.shadow.soft : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      background: theme.colors.surface,
      borderRadius: theme.radius.md,
      boxShadow: theme.shadow.card,
      border: `1px solid ${theme.colors.line}`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Sentence progress counter badge "৯১ / ১০০" with indicator dots. */
export const Counter: React.FC<{ n: number; nBn: string; delay?: number }> = ({
  n,
  nBn,
  delay = 0,
}) => {
  const localIndex = n - 90; // 1 to 10
  return (
    <Entrance delay={delay} from={-24} style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <Pill tone="white" size={32}>
        <span style={{ color: theme.colors.primaryDeep, fontWeight: theme.weights.hero }}>{nBn}</span>
        <span style={{ color: theme.colors.textDim }}>/ ১০০</span>
      </Pill>
      <div style={{ display: "flex", gap: 8 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i + 1 === localIndex ? 32 : 12,
              height: 12,
              borderRadius: 12,
              background: i + 1 <= localIndex ? theme.colors.primary : theme.colors.primarySoft,
              transition: "all 0.2s ease",
            }}
          />
        ))}
      </div>
    </Entrance>
  );
};

