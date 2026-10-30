import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { clamp } from "./kit";

/** Layer 1 — animated mint mesh + faint dot grid (never a flat background). */
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 80) * 60, d2 = Math.cos(frame / 95) * 50;
  const dots = `radial-gradient(${theme.colors.line} 2px, transparent 2.5px)`;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${theme.colors.bg}, ${theme.colors.bgAlt})` }}>
      <div style={{ position: "absolute", width: 980, height: 980, borderRadius: "50%", top: -420, left: -260 + d1, filter: "blur(40px)",
        background: `radial-gradient(circle, ${theme.colors.primary}2E, transparent 64%)` }} />
      <div style={{ position: "absolute", width: 800, height: 800, borderRadius: "50%", bottom: -360, right: -240 - d2, filter: "blur(50px)",
        background: `radial-gradient(circle, ${theme.colors.accent}30, transparent 66%)` }} />
      <AbsoluteFill style={{ backgroundImage: dots, backgroundSize: "54px 54px", backgroundPosition: `${frame * 0.25}px ${frame * 0.15}px`, opacity: 0.55 }} />
    </AbsoluteFill>
  );
};

/** Layer 4 — colour grade (soft-light, light-theme strength). */
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.primary, mixBlendMode: "soft-light", opacity: 0.12 }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.10), transparent 28%, transparent 74%, rgba(16,35,29,0.06))" }} />
  </AbsoluteFill>
);

/** Layer 5a — procedural film grain. */
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: noise, backgroundSize: "220px",
      backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`, opacity: 0.045, mixBlendMode: "multiply" }} />
  );
};

/** Layer 5b — vignette (topmost). */
export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 62%, rgba(16,35,29,0.10) 100%)" }} />
);

/** Scene-boundary transition: layered colour sweep (3 rotating variants), cut hidden under full cover. */
export const Transition: React.FC<{ at: number; variant: number }> = ({ at, variant }) => {
  const frame = useCurrentFrame();
  const local = frame - (at - 9);
  if (local < 0 || local > 17) return null;
  const a = interpolate(local, [0, 9], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const b = interpolate(local, [8, 17], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const layer = (lead: number, trail: number, color: string, delay: number) => {
    const inn = interpolate(local - delay, [0, 9], [0, 1], { ...clamp, easing: theme.ease.inOut });
    const out = interpolate(local - delay, [8, 17], [0, 1], { ...clamp, easing: theme.ease.inOut });
    void lead; void trail; void a; void b;
    const v = variant % 3;
    if (v === 0) return <AbsoluteFill style={{ background: color, transform: `translateX(${(-100 + inn * 100 + out * 100)}%)`, borderRadius: out > 0 ? "0 60% 60% 0 / 0 50% 50% 0" : undefined }} />;
    if (v === 1) return <AbsoluteFill style={{ background: color, transform: `translateY(${(100 - inn * 100 - out * 100)}%)` }} />;
    const r = (inn - out * 0.0) * 1500;
    const hole = out * 1500;
    return <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, transparent ${hole}px, ${color} ${hole + 1}px, ${color} ${r}px, transparent ${r + 1}px)` }} />;
  };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {layer(0, 0, theme.colors.primarySoft, 0)}
      {layer(0, 0, theme.colors.primary, 3)}
    </AbsoluteFill>
  );
};
