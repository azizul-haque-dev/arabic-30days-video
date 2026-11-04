import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, theme } from "../theme";
import { CL, spr, toBn, tween } from "./anim";

// Bengali rule: split ONLY on spaces (never per letter), letterSpacing 0.
const base = (size: number, color: string, weight: number = theme.weight.display): React.CSSProperties => ({
  fontFamily: theme.fonts.display, fontSize: size, fontWeight: weight, color, letterSpacing: 0, lineHeight: 1.18,
});

/** Word-by-word staggered reveal (opacity + rise + scale). */
export const Words: React.FC<{
  text: string; delay: number; per?: number; size: number; color?: string; weight?: number;
  align?: "center" | "left" | "right"; style?: React.CSSProperties; wordStyle?: (i: number) => React.CSSProperties; bounce?: boolean;
}> = ({ text, delay, per = 4, size, color = theme.colors.text, weight, align = "center", style, wordStyle, bounce }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: Math.round(size * 0.27), rowGap: Math.round(size * 0.06),
      justifyContent: align === "center" ? "center" : align === "left" ? "flex-start" : "flex-end", ...base(size, color, weight), ...style }}>
      {text.split(" ").map((w, i) => {
        const p = spr(frame, fps, delay + i * per, bounce ? theme.spring.bouncy : theme.spring.snappy);
        return (
          <span key={i} style={{ display: "inline-block", opacity: Math.min(1, p * 1.8), transform: `translateY(${(1 - p) * size * 0.34}px) scale(${0.86 + 0.14 * p})`, ...wordStyle?.(i) }}>{w}</span>
        );
      })}
    </div>
  );
};

/** Phrase with word reveal + highlight sweep (karaoke) that follows the speech window [sweepFrom, sweepTo]. */
export const PhraseText: React.FC<{
  text: string; revealAt: number; size: number; sweep?: [number, number]; per?: number; align?: "center" | "left";
  color?: string; style?: React.CSSProperties;
}> = ({ text, revealAt, size, sweep, per = 4, align = "center", color = theme.colors.text, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  const total = words.reduce((a, w) => a + w.length, 0);
  let acc = 0;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: Math.round(size * 0.3), rowGap: Math.round(size * 0.04),
      justifyContent: align === "center" ? "center" : "flex-start", ...base(size, color), ...style }}>
      {words.map((w, i) => {
        const c0 = acc / total; acc += w.length;
        const p = spr(frame, fps, revealAt + i * per, theme.spring.snappy);
        const startF = sweep ? sweep[0] + (sweep[1] - sweep[0]) * c0 : 1e9;
        const bar = tween(frame, startF, startF + 8, 0, 1, theme.ease.out);
        return (
          <span key={i} style={{ position: "relative", display: "inline-block", opacity: Math.min(1, p * 1.8), transform: `translateY(${(1 - p) * size * 0.34}px) scale(${0.86 + 0.14 * p})` }}>
            <span style={{ position: "absolute", left: -10, right: -10, top: size * 0.14, bottom: size * 0.02, borderRadius: size * 0.2,
              background: alpha(theme.colors.accent, 0.5), transformOrigin: "left center", transform: `scaleX(${bar})`, opacity: bar > 0 ? 1 : 0 }} />
            <span style={{ position: "relative" }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

/** Counter roll — Bengali digits, fixed-width cells so nothing jitters. */
export const BnCounter: React.FC<{ to: number; delay: number; size: number; color?: string; suffix?: string; cfg?: { damping: number; stiffness: number; mass: number } }> = ({
  to, delay, size, color = theme.colors.primary, suffix = "", cfg = { damping: 30, stiffness: 60, mass: 1 } }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = interpolate(spring({ frame: frame - delay, fps, config: cfg }), [0, 1], [0, to], CL);
  const str = toBn(Math.round(v));
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", ...base(size, color), lineHeight: 1.05 }}>
      {str.split("").map((ch, i) => (
        <span key={i} style={{ display: "inline-block", width: size * 0.56, textAlign: "center" }}>{ch}</span>
      ))}
      {suffix && <span style={{ marginLeft: size * 0.12 }}>{suffix}</span>}
    </div>
  );
};

export const T_ = base;
