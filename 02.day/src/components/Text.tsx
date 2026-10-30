import React from "react";
import { useCurrentFrame } from "remotion";
import { C, EASE, FONT, SPRING } from "../theme";
import { bn, tween, useSp } from "../lib/motion";

// বাংলা: কখনো অক্ষর ধরে ভাঙা নয় — শুধু স্পেসে শব্দ-বিভাজন, letterSpacing 0
const Word: React.FC<{ delay: number; dist: number; color: string; children: React.ReactNode }> = ({ delay, dist, color, children }) => {
  const s = useSp(delay, SPRING.pop);
  const f = useCurrentFrame();
  return (
    <span style={{
      display: "inline-block", color, opacity: tween(f, delay, delay + 8, 0, 1),
      transform: `translateY(${(1 - s) * dist}px) scale(${0.86 + 0.14 * s})`,
    }}>{children}</span>
  );
};

export const Words: React.FC<{
  text: string; delay?: number; gap?: number; size: number; weight?: number; color?: string;
  hi?: number[]; hiColor?: string; align?: "center" | "left"; width?: number; lh?: number;
}> = ({ text, delay = 0, gap = 4, size, weight = FONT.w.heavy, color = C.text, hi = [], hiColor = C.hero, align = "center", width, lh = 1.32 }) => (
  <div style={{
    display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start",
    columnGap: size * 0.26, width, fontSize: size, fontWeight: weight, lineHeight: lh,
    letterSpacing: 0, textAlign: align,
  }}>
    {text.split(" ").map((w, i) => (
      <Word key={i} delay={delay + i * gap} dist={size * 0.5} color={hi.includes(i) ? hiColor : color}>{w}</Word>
    ))}
  </div>
);

// হাইলাইট সুইপ
export const Sweep: React.FC<{ delay: number; color?: string; dur?: number; children: React.ReactNode }> = ({ delay, color = C.accentSoft, dur = 14, children }) => {
  const f = useCurrentFrame();
  const p = tween(f, delay, delay + dur, 0, 1, EASE.inOut);
  return (
    <span style={{
      backgroundImage: `linear-gradient(${color}, ${color})`, backgroundRepeat: "no-repeat",
      backgroundSize: `${p * 100}% 42%`, backgroundPosition: "0 90%", padding: "0 0.1em",
      WebkitBoxDecorationBreak: "clone", boxDecorationBreak: "clone",
    }}>{children}</span>
  );
};

// টাইপরাইটার — বাংলায় শব্দ ধরে; লেআউট স্থির রাখতে সব শব্দ আগে থেকেই জায়গা নেয়
export const TypeWords: React.FC<{ text: string; start: number; end: number; color?: string; caret?: string }> = ({ text, start, end, color = C.text, caret = C.hero }) => {
  const f = useCurrentFrame();
  const words = text.split(" ");
  const n = Math.floor(tween(f, start, end, 0, words.length + 0.99, EASE.inOut));
  const blink = Math.floor(f / 8) % 2 === 0;
  return (
    <span style={{ letterSpacing: 0 }}>
      {words.map((w, i) => (
        <span key={i} style={{ opacity: i < n ? 1 : 0, color }}>{w}{i < words.length - 1 ? " " : ""}</span>
      ))}
      <span style={{ display: "inline-block", width: 5, height: "0.9em", marginLeft: 6, verticalAlign: "-0.1em", background: caret, borderRadius: 3, opacity: n < words.length || blink ? 1 : 0 }} />
    </span>
  );
};

// কাউন্টার (শুধু স্ক্রিপ্টের সংখ্যা)
export const Counter: React.FC<{ from: number; to: number; start: number; end: number; style?: React.CSSProperties; suffix?: string }> = ({ from, to, start, end, style, suffix = "" }) => {
  const f = useCurrentFrame();
  const v = Math.round(tween(f, start, end, from, to, EASE.out));
  const s = useSp(start, SPRING.snap);
  return <span style={{ display: "inline-block", transform: `scale(${0.9 + 0.1 * s})`, ...style }}>{bn(v)}{suffix}</span>;
};
