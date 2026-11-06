import React from "react";
import { interpolate } from "remotion";
import { theme } from "../theme";
import { Entrance, ramp } from "../animations/presets";
import { useCurrentFrame } from "remotion";

type Weight = 400 | 500 | 600 | 700;

/** Generic Bengali text block (Hind Siliguri). Text is rendered exactly as supplied. */
export const BengaliText: React.FC<{
  text: string;
  size?: number;
  weight?: Weight;
  color?: string;
  align?: "center" | "left" | "right";
  maxWidth?: number;
  lineHeight?: number;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ text, size = 52, weight = 500, color = theme.colors.text, align = "center", maxWidth = 900, lineHeight = 1.4, delay = 0, style }) => (
  <Entrance delay={delay} y={30}>
    <div
      lang="bn"
      style={{
        fontFamily: theme.fonts.bengali,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        color,
        textAlign: align,
        maxWidth,
        ...style,
      }}
    >
      {text}
    </div>
  </Entrance>
);

/** Bengali pronunciation — Medium weight, highlights while the Arabic is spoken. */
export const BengaliPronunciation: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  activeRanges?: [number, number][];
}> = ({ text, delay = 0, size = 54, activeRanges = [] }) => {
  const frame = useCurrentFrame();
  let active = 0;
  for (const [a, b] of activeRanges) {
    const up = ramp(frame, a, a + 6);
    const down = 1 - ramp(frame, b - 6, b, theme.ease.in);
    active = Math.max(active, Math.min(up, down));
  }
  return (
    <BengaliText
      text={text}
      size={size}
      weight={500}
      delay={delay}
      color={active > 0.5 ? theme.colors.primary : theme.colors.text}
      style={{ letterSpacing: "0.005em", transform: `scale(${interpolate(active, [0, 1], [1, 1.025])})` }}
    />
  );
};

/** Bengali meaning with the "অর্থ" label — Regular/Medium. */
export const BengaliMeaning: React.FC<{ text: string; delay?: number; size?: number }> = ({ text, delay = 0, size = 50 }) => (
  <Entrance delay={delay} y={36} preset="snappy">
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div
        lang="bn"
        style={{
          fontFamily: theme.fonts.bengali,
          fontWeight: 600,
          fontSize: 30,
          color: theme.colors.text,
          background: theme.colors.accent,
          padding: "2px 26px 6px",
          borderRadius: 999,
          lineHeight: 1.3,
        }}
      >
        অর্থ
      </div>
      <div
        lang="bn"
        style={{
          fontFamily: theme.fonts.bengali,
          fontWeight: 500,
          fontSize: size,
          lineHeight: 1.4,
          color: theme.colors.text,
          textAlign: "center",
          maxWidth: 880,
        }}
      >
        {text}
      </div>
    </div>
  </Entrance>
);
