import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

const c = theme.colors;

export const TopLabel: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
  return (
    <div style={{ position: "absolute", top: 220, left: 0, right: 0, display: "flex", justifyContent: "center",
      opacity: p, transform: `translateY(${interpolate(p, [0, 1], [-24, 0])}px)` }}>
      <div style={{ fontFamily: theme.fonts.en, fontWeight: 600, fontSize: 30, letterSpacing: "0.14em", color: c.text,
        background: c.card, padding: "12px 34px", borderRadius: 999, boxShadow: "0 10px 30px -12px rgba(16,35,29,0.25)" }}>
        ARABIC MASTER <span style={{ color: c.accent, padding: "0 8px" }}>|</span> DAY 08
      </div>
    </div>
  );
};

export const LogoMark: React.FC<{ size?: number }> = ({ size = 160 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.3, background: `linear-gradient(145deg, ${c.primary}, ${c.primaryDark})`,
    display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 ${size * 0.1}px ${size * 0.3}px -${size * 0.08}px ${c.glow}` }}>
    <div style={{ fontFamily: theme.fonts.ar, fontWeight: 700, fontSize: size * 0.7, color: "#fff", lineHeight: 1, marginTop: -size * 0.06 }}>ع</div>
  </div>
);

export const Pill: React.FC<{ children: React.ReactNode; bg?: string; color?: string; size?: number; style?: React.CSSProperties }> = ({
  children, bg = c.card, color = c.text, size = 34, style,
}) => (
  <div style={{ fontFamily: theme.fonts.en, fontWeight: 700, fontSize: size, letterSpacing: "0.06em", color, background: bg,
    padding: `${size * 0.35}px ${size * 0.9}px`, borderRadius: 999, boxShadow: "0 12px 30px -14px rgba(16,35,29,0.3)", ...style }}>
    {children}
  </div>
);

// 10 progress dots (sentence index 0-9 filled up to `upto`).
export const ProgressDots: React.FC<{ upto: number }> = ({ upto }) => (
  <div style={{ display: "flex", gap: 14 }}>
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} style={{ width: i === upto ? 46 : 22, height: 22, borderRadius: 11,
        background: i < upto ? c.primary : i === upto ? c.accent : c.primarySoft }} />
    ))}
  </div>
);

// Listening bars shown before the Arabic phrase is spoken.
export const SoundBars: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, height: 120, opacity }}>
      {Array.from({ length: 11 }).map((_, i) => {
        const h = 26 + Math.abs(Math.sin(frame / 5 + i * 0.9)) * 70;
        return <div key={i} style={{ width: 16, height: h, borderRadius: 8, background: i % 3 === 0 ? c.accent : c.primary }} />;
      })}
    </div>
  );
};
