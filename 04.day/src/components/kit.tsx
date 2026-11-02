import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";
import { toBn } from "../content";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const Entrance: React.FC<{
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: theme.spring.smooth,
  });
  const y = interpolate(p, [0, 1], [36, 0], clamp);
  const s = interpolate(p, [0, 1], [0.94, 1], clamp);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${y}px) scale(${s})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// বাংলা টেক্সট নিয়ম: শুধুমাত্র স্পেসে শব্দ-বিভাজন, কখনোই অক্ষর ধরে নয়, letterSpacing: 0
export const WordReveal: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  highlightWord?: string;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, per = 4, highlightWord, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.trim().split(/\s+/);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 14,
        letterSpacing: 0,
        fontFamily: theme.fonts.display,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const p = spring({
          frame: frame - delay - i * per,
          fps,
          config: theme.spring.snappy,
        });
        const y = interpolate(p, [0, 1], [28, 0], clamp);
        const s = interpolate(p, [0, 1], [0.92, 1], clamp);
        const isHi = highlightWord && w.includes(highlightWord);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${y}px) scale(${s})`,
              color: isHi ? theme.colors.primary : undefined,
              letterSpacing: 0,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const SceneExit: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
}> = ({ durationInFrames, children }) => {
  const frame = useCurrentFrame();
  const exitO = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames - 1],
    [1, 0],
    clamp
  );
  const exitY = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames - 1],
    [0, -28],
    { easing: theme.ease.in, ...clamp }
  );
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        opacity: exitO,
        transform: `translateY(${exitY}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const Pill: React.FC<{
  children: React.ReactNode;
  tone?: "soft" | "accent" | "hero" | "white";
  style?: React.CSSProperties;
}> = ({ children, tone = "soft", style }) => {
  const bgMap = {
    soft: theme.colors.primarySoft,
    accent: theme.colors.accentSoft,
    hero: theme.colors.primary,
    white: theme.colors.surface,
  };
  const colorMap = {
    soft: theme.colors.primaryDeep,
    accent: theme.colors.text,
    hero: theme.colors.surface,
    white: theme.colors.text,
  };
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 26px",
        borderRadius: theme.radii.pill,
        backgroundColor: bgMap[tone],
        color: colorMap[tone],
        fontFamily: theme.fonts.display,
        fontWeight: theme.weights.strong,
        fontSize: 26,
        letterSpacing: 0,
        boxShadow: theme.shadows.soft,
        border: `1px solid ${theme.colors.line}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.md,
      border: `1.5px solid ${theme.colors.line}`,
      boxShadow: theme.shadows.card,
      padding: 36,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Counter: React.FC<{ index: number; total?: number }> = ({
  index,
  total = 10,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    }}
  >
    <Pill tone="hero" style={{ fontSize: 24, padding: "10px 24px" }}>
      বাক্য {toBn(30 + index)} &bull; {toBn(index)} / {toBn(total)}
    </Pill>
    <div style={{ display: "flex", gap: 10 }}>
      {Array.from({ length: total }).map((_, i) => {
        const active = i + 1 <= index;
        return (
          <div
            key={i}
            style={{
              width: i + 1 === index ? 32 : 14,
              height: 14,
              borderRadius: theme.radii.pill,
              backgroundColor: active
                ? theme.colors.primary
                : theme.colors.primarySoft,
            }}
          />
        );
      })}
    </div>
  </div>
);

export const useBreath = () => {
  const frame = useCurrentFrame();
  const scale = 1 + Math.sin(frame / 24) * 0.014;
  const floatY = Math.sin(frame / 30) * 4;
  return { transform: `translateY(${floatY}px) scale(${scale})` };
};
