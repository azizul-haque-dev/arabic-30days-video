import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, R, SHADOW } from "../theme";
import { Icon, IconName } from "./Icons";
import { tween, useBreath } from "../lib/motion";

export const glossy = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  background: `linear-gradient(180deg, ${C.white} 0%, #F5FBF8 100%)`,
  borderRadius: R.card,
  boxShadow: `${SHADOW.card}, inset 0 2px 0 rgba(255,255,255,1), inset 0 0 0 1.5px rgba(14,159,110,0.10)`,
  ...extra,
});

export const Pill: React.FC<{ bg: string; color: string; size?: number; shadow?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ bg, color, size = 40, shadow, style, children }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: bg, color, fontSize: size, fontWeight: 700, lineHeight: 1.3, padding: `${size * 0.22}px ${size * 0.6}px`, borderRadius: R.pill, boxShadow: shadow, letterSpacing: 0, ...style }}>{children}</div>
);

// হিরো রঙের গ্লসি মেডালিয়ন + (ঐচ্ছিক) ছড়িয়ে পড়া রিং
export const Medallion: React.FC<{ size: number; icon: IconName; rings?: boolean; light?: boolean }> = ({ size, icon, rings = false, light = false }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const breath = useBreath(size * 0.02, 2.6);
  return (
    <div style={{ position: "relative", width: size, height: size, transform: `translateY(${breath}px)` }}>
      {rings && [0, 1].map((i) => {
        const p = ((f / fps) / 1.8 + i * 0.5) % 1;
        return <div key={i} style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `4px solid ${C.hero}`, opacity: 0.35 * (1 - p), transform: `scale(${1 + p * 0.7})` }} />;
      })}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: light ? `linear-gradient(180deg, ${C.white}, ${C.heroTint})` : `linear-gradient(150deg, ${C.hero} 0%, ${C.heroDeep} 100%)`,
        boxShadow: light ? SHADOW.soft : SHADOW.hero, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {!light && <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 30% 22%, rgba(255,255,255,0.38), rgba(255,255,255,0) 55%)" }} />}
        <Icon name={icon} size={size * 0.52} color={light ? C.hero : C.onHero} stroke={3.6} />
      </div>
    </div>
  );
};

// ছড়িয়ে পড়া রশ্মি (বার্স্ট)
export const Burst: React.FC<{ cx: number; cy: number; delay: number; n?: number; r0: number; r1: number; color: string; w?: number }> = ({ cx, cy, delay, n = 10, r0, r1, color, w = 10 }) => {
  const f = useCurrentFrame();
  const p = tween(f, delay, delay + 18, 0, 1, EASE.out);
  const o = 1 - tween(f, delay + 8, delay + 24, 0, 1, EASE.in);
  if (f < delay) return null;
  return (
    <div style={{ position: "absolute", left: cx, top: cy, width: 0, height: 0, opacity: o }}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: -w / 2, top: 0, width: w, height: Math.max(2, (r1 - r0) * 0.55 * p), borderRadius: w, background: color, transformOrigin: "50% 0", transform: `rotate(${(i / n) * 360}deg) translateY(${r0 + (r1 - r0) * 0.45 * p}px)` }} />
      ))}
    </div>
  );
};

// আঁকা হয় এমন টিক
export const DrawCheck: React.FC<{ size: number; color: string; delay: number; stroke?: number }> = ({ size, color, delay, stroke = 6 }) => {
  const f = useCurrentFrame();
  const p = tween(f, delay, delay + 12, 0, 1, EASE.out);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ display: "block" }}>
      <path d="M14 34 27 46 50 20" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={60} strokeDashoffset={60 * (1 - p)} />
    </svg>
  );
};
