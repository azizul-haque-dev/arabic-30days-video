import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Premium entrance: opacity + rise + scale, spring driven. */
export const Entrance: React.FC<{
  delay?: number; children: React.ReactNode; from?: number; scaleFrom?: number; style?: React.CSSProperties;
  config?: typeof theme.spring.smooth | typeof theme.spring.snappy | typeof theme.spring.bouncy; x?: number;
}> = ({ delay = 0, children, from = 40, scaleFrom = 0.94, style, config = theme.spring.smooth, x = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config });
  return (
    <div style={{
      opacity: interpolate(p, [0, 0.6], [0, 1], clamp),
      transform: `translate(${interpolate(p, [0, 1], [x, 0])}px, ${interpolate(p, [0, 1], [from, 0])}px) scale(${interpolate(p, [0, 1], [scaleFrom, 1])})`,
      ...style,
    }}>{children}</div>
  );
};

/** Word-by-word staggered reveal. Splits ONLY on spaces — never per letter (Bengali conjuncts). */
export const WordReveal: React.FC<{
  text: string; delay?: number; per?: number; style?: React.CSSProperties; wordStyle?: (i: number, w: string) => React.CSSProperties;
  justify?: React.CSSProperties["justifyContent"]; gap?: number;
}> = ({ text, delay = 0, per = 4, style, wordStyle, justify = "flex-start", gap = 18 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: gap, rowGap: 4, justifyContent: justify, letterSpacing: 0, ...style }}>
      {text.split(" ").map((word, i) => {
        const p = spring({ frame: frame - delay - i * per, fps, config: theme.spring.snappy });
        return (
          <span key={i} style={{
            display: "inline-block", opacity: interpolate(p, [0, 0.7], [0, 1], clamp),
            transform: `translateY(${interpolate(p, [0, 1], [34, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
            ...(wordStyle ? wordStyle(i, word) : {}),
          }}>{word}</span>
        );
      })}
    </div>
  );
};

/** Wraps a scene: faster exit (~10f) than entrance. */
export const SceneExit: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [dur - 11, dur - 2], [1, 0], { ...clamp, easing: theme.ease.in });
  const y = interpolate(frame, [dur - 11, dur - 2], [0, -36], { ...clamp, easing: theme.ease.in });
  const s = interpolate(frame, [dur - 11, dur - 2], [1, 0.97], { ...clamp, easing: theme.ease.in });
  return <AbsoluteFill style={{ opacity: o, transform: `translateY(${y}px) scale(${s})` }}>{children}</AbsoluteFill>;
};

/** Idle breathing helper. */
export const useBreath = (period = 26, amp = 0.014) => {
  const frame = useCurrentFrame();
  return { scale: 1 + Math.sin(frame / period) * amp, float: Math.sin(frame / (period * 1.3)) * 4 };
};

export const Pill: React.FC<{ children: React.ReactNode; tone?: "soft" | "accent" | "hero" | "white"; size?: number; style?: React.CSSProperties }> = ({ children, tone = "soft", size = 34, style }) => {
  const map = {
    soft: { bg: theme.colors.primarySoft, fg: theme.colors.primaryDeep },
    accent: { bg: theme.colors.accentSoft, fg: theme.colors.text },
    hero: { bg: theme.colors.primary, fg: theme.colors.white },
    white: { bg: theme.colors.surface, fg: theme.colors.text },
  }[tone];
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 12, padding: `${size * 0.28}px ${size * 0.7}px`, borderRadius: theme.radius.pill,
      background: map.bg, color: map.fg, fontSize: size, fontWeight: theme.weights.strong, lineHeight: 1.2, letterSpacing: 0,
      boxShadow: tone === "white" ? theme.shadow.soft : undefined, ...style,
    }}>{children}</div>
  );
};

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{
    background: theme.colors.surface, borderRadius: theme.radius.md, boxShadow: theme.shadow.card,
    border: `1px solid ${theme.colors.line}`, ...style,
  }}>{children}</div>
);

/** Progress counter "১ / ১০" + 10 dots. */
export const Counter: React.FC<{ n: number; nBn: string; delay?: number }> = ({ n, nBn, delay = 0 }) => (
  <Entrance delay={delay} from={-24} style={{ display: "flex", alignItems: "center", gap: 22 }}>
    <Pill tone="white" size={34}><span style={{ color: theme.colors.primaryDeep }}>{nBn}</span><span style={{ color: theme.colors.textDim }}>/ ১০</span></Pill>
    <div style={{ display: "flex", gap: 9 }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} style={{ width: i + 1 === n ? 34 : 14, height: 14, borderRadius: 14, background: i + 1 <= n ? theme.colors.primary : theme.colors.primarySoft }} />
      ))}
    </div>
  </Entrance>
);
