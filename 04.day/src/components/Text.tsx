import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { clampX, tween, useSpring } from "../anim";

type BaseStyle = React.CSSProperties;

// Word-by-word staggered reveal. Splits ONLY on spaces (never inside a Bengali word).
export const WordReveal: React.FC<{
  text: string; delay?: number; per?: number; size: number; color?: string; weight?: number;
  highlight?: number[]; highlightColor?: string; align?: "center" | "flex-start"; gap?: number; style?: BaseStyle;
}> = ({ text, delay = 0, per = theme.motion.staggerWord, size, color = theme.colors.text, weight = theme.weight.display,
  highlight = [], highlightColor = theme.colors.primary, align = "center", gap, style }) => {
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: align, columnGap: gap ?? Math.round(size * 0.26), rowGap: Math.round(size * 0.08),
      fontSize: size, fontWeight: weight, lineHeight: 1.3, color, fontFamily: theme.fonts.display, ...style }}>
      {words.map((w, i) => <Word key={i} delay={delay + i * per} color={highlight.includes(i) ? highlightColor : color}>{w}</Word>)}
    </div>
  );
};

const Word: React.FC<{ delay: number; color: string; children: React.ReactNode }> = ({ delay, color, children }) => {
  const p = useSpring(delay, "snappy");
  return (
    <span style={{ display: "inline-block", color, opacity: Math.min(1, p * 1.4),
      transform: `translateY(${interpolate(p, [0, 1], [34, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])})` }}>{children}</span>
  );
};

// Left→right mask sweep for a phrase (works for Bengali: whole word run revealed by clip, never split).
export const MaskSweep: React.FC<{
  text: string; delay: number; size: number; color?: string; dur?: number; align?: "center" | "left"; style?: BaseStyle;
}> = ({ text, delay, size, color = theme.colors.text, dur = 16, align = "center", style }) => {
  const frame = useCurrentFrame();
  const t = tween(frame, delay, delay + dur, 0, 1);
  const y = tween(frame, delay, delay + dur, 22, 0);
  return (
    <div style={{ fontFamily: theme.fonts.display, fontWeight: theme.weight.display, fontSize: size, lineHeight: 1.3, color,
      textAlign: align, clipPath: `inset(-12px ${(1 - t) * 100}% -16px -12px)`, transform: `translateY(${y}px)`,
      opacity: t > 0 ? 1 : 0, ...style }}>{text}</div>
  );
};

// Highlight sweep behind a block (pill that scales in from the left)
export const HighlightBar: React.FC<{ delay: number; color?: string; height?: number; style?: BaseStyle }> = ({
  delay, color = theme.colors.accentSoft, height = 18, style }) => {
  const frame = useCurrentFrame();
  const t = tween(frame, delay, delay + 14, 0, 1);
  return <div style={{ position: "absolute", left: 0, bottom: 4, height, width: "100%", background: color, borderRadius: height,
    transform: `scaleX(${t})`, transformOrigin: "0% 50%", ...style }} />;
};

export const Pill: React.FC<{
  children: React.ReactNode; delay?: number; bg?: string; color?: string; size?: number; style?: BaseStyle; pad?: string;
}> = ({ children, delay = 0, bg = theme.colors.surface, color = theme.colors.text, size = 34, style, pad }) => {
  const p = useSpring(delay, "bouncy");
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: pad ?? `${Math.round(size * 0.28)}px ${Math.round(size * 0.7)}px`,
      borderRadius: theme.radius.pill, background: bg, color, fontFamily: theme.fonts.display, fontWeight: theme.weight.display,
      fontSize: size, lineHeight: 1.3, boxShadow: `0 10px 30px -10px ${theme.colors.shadow}`,
      opacity: Math.min(1, p * 1.5), transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px) scale(${interpolate(p, [0, 1], [0.8, 1])})`, ...style }}>
      {children}
    </div>
  );
};

export const Card: React.FC<{
  children: React.ReactNode; delay?: number; style?: BaseStyle; bg?: string; float?: boolean; from?: "up" | "left" | "right";
}> = ({ children, delay = 0, style, bg = theme.colors.surface, float = true, from = "up" }) => {
  const frame = useCurrentFrame();
  const p = useSpring(delay, "smooth");
  const dx = from === "left" ? -70 : from === "right" ? 70 : 0;
  const dy = from === "up" ? 56 : 0;
  const bob = float ? Math.sin((frame + delay * 3) / 34) * 4 : 0;
  return (
    <div style={{ background: bg, borderRadius: theme.radius.card, boxShadow: `0 30px 60px -28px ${theme.colors.shadow}, 0 2px 0 ${theme.colors.line}`,
      opacity: Math.min(1, p * 1.5),
      transform: `translate(${interpolate(p, [0, 1], [dx, 0])}px, ${interpolate(p, [0, 1], [dy, 0]) + bob}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`, ...style }}>
      {children}
    </div>
  );
};

export { clampX };
