import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";

// Layer 1: animated mint mesh (never flat)
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 80) * 60, d2 = Math.cos(frame / 95) * 50, d3 = Math.sin(frame / 120) * 40;
  const c = theme.colors;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${c.bg}, ${c.bgAlt})` }}>
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", top: -380 + d3, left: -260 + d1, filter: "blur(40px)",
        background: `radial-gradient(circle, ${c.primary}2E, transparent 64%)` }} />
      <div style={{ position: "absolute", width: 760, height: 760, borderRadius: "50%", bottom: -330, right: -240 - d2, filter: "blur(50px)",
        background: `radial-gradient(circle, ${c.accent}26, transparent 66%)` }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.5,
        backgroundImage: `radial-gradient(${c.line} 1.5px, transparent 1.6px)`, backgroundSize: "54px 54px",
        backgroundPosition: `${d1 * 0.2}px ${d2 * 0.2}px` }} />
    </AbsoluteFill>
  );
};

// Layer 4: colour grade (above content)
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.primary, mixBlendMode: "soft-light", opacity: 0.05 }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(16,35,29,0.02), transparent 25%, transparent 75%, rgba(16,35,29,0.03))" }} />
  </AbsoluteFill>
);

// Layer 5a: procedural grain
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: noise, backgroundSize: "220px",
      backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`, opacity: 0.045, mixBlendMode: "multiply" }} />
  );
};

// Layer 5b: vignette
export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none",
    background: "radial-gradient(ellipse at center, transparent 65%, rgba(16,35,29,0.04) 100%)" }} />
);
