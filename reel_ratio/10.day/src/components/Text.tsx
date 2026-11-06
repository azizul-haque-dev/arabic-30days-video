import React from "react";
import { useEnter } from "../lib/anim";
import { theme } from "../theme";
import { font } from "./Brand";

const Word: React.FC<{ word: string; delay: number; color?: string; underline?: boolean; size: number; weight: number }> = ({
  word,
  delay,
  color,
  underline,
  size,
  weight,
}) => {
  const p = useEnter(delay, theme.spring.snappy);
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px) scale(${0.92 + 0.08 * p})`,
        color: color ?? theme.colors.text,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.45,
        ...font,
      }}
    >
      {word}
      {underline ? (
        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 4,
            height: 12,
            borderRadius: 6,
            background: theme.colors.accent,
            opacity: 0.45,
            transform: `scaleX(${Math.max(0, p - 0.3) / 0.7})`,
            transformOrigin: "left center",
            zIndex: -1,
          }}
        />
      ) : null}
    </span>
  );
};

/** Staggered word-by-word kinetic text. Each word: opacity + translateY + scale. */
export const WordReveal: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  size?: number;
  weight?: number;
  color?: string;
  highlight?: string;
  highlightColor?: string;
  align?: "center" | "flex-start";
}> = ({ text, delay = 0, stagger = 3, size = 64, weight = 700, color, highlight, highlightColor, align = "center" }) => {
  const words = text.split(/\s+/).filter(Boolean);
  const hl = new Set((highlight ?? "").split(/\s+/).filter(Boolean));
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: align, columnGap: 18, rowGap: 2 }}>
      {words.map((w, i) => (
        <Word
          key={i}
          word={w}
          delay={delay + i * stagger}
          size={size}
          weight={weight}
          color={hl.has(w) ? (highlightColor ?? theme.colors.primary) : color}
          underline={hl.has(w)}
        />
      ))}
    </div>
  );
};
