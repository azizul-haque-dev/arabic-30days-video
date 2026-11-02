import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { Pop, Words } from "./primitives";

export const toBn = (n: number | string) =>
  String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);

export const Pill: React.FC<{ children: React.ReactNode; bg: string; color: string; size: number; px?: number; py?: number; style?: React.CSSProperties }> = ({ children, bg, color, size, px = 28, py = 6, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: bg, color, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.3, padding: `${py}px ${px}px`, borderRadius: theme.radius.pill, whiteSpace: "nowrap", ...style }}>{children}</div>
);

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: theme.colors.white, borderRadius: theme.radius.card, boxShadow: theme.shadow.card, ...style }}>{children}</div>
);

/** স্প্রিং-চালিত কাউন্টার (tabular-nums) — শুধু স্ক্রিপ্টের সংখ্যা */
export const useRoll = (at: number, target: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 30, stiffness: 60, mass: 1 } });
  return { value: Math.round(interpolate(p, [0, 1], [0, target])), p: Math.min(1, Math.max(0, p)) };
};

export const MeaningBlock: React.FC<{ at: number; textAt: number; text: string; size: number; align?: "center" | "left"; dark?: boolean }> = ({ at, textAt, text, size, align = "center", dark = false }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", gap: 8 }}>
    <Pop at={at} kind="bouncy" y={20} scale={0.8}>
      <Pill bg={theme.colors.accent} color={theme.colors.text} size={Math.round(size * 0.7)} py={2} px={24}>অর্থ</Pill>
    </Pop>
    <Words text={text} at={textAt + 2} per={4} size={size} weight={700} mask align={align} color={dark ? theme.colors.white : theme.colors.text} lineHeight={1.45} />
  </div>
);
