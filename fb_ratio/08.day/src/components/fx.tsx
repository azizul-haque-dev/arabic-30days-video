import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {theme, withAlpha} from "../theme";

// Layer 1 — background mesh (continuous across the whole video, never flat)
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 80) * 60;
  const d2 = Math.cos(frame / 95) * 50;
  const d3 = Math.sin(frame / 120 + 1) * 40;
  return (
    <AbsoluteFill style={{background: `linear-gradient(160deg, ${theme.colors.bg}, ${theme.colors.bgAlt})`}}>
      <div style={{position: "absolute", width: 900, height: 900, borderRadius: "50%", top: -380 + d3, left: -260 + d1, filter: "blur(60px)", background: `radial-gradient(circle, ${withAlpha(theme.colors.primary, 0.22)}, transparent 65%)`}} />
      <div style={{position: "absolute", width: 760, height: 760, borderRadius: "50%", bottom: -330 - d3, right: -240 - d2, filter: "blur(70px)", background: `radial-gradient(circle, ${withAlpha(theme.colors.accent, 0.13)}, transparent 65%)`}} />
      <div style={{position: "absolute", inset: 0, backgroundImage: `radial-gradient(${withAlpha(theme.colors.text, 0.07)} 2px, transparent 2.5px)`, backgroundSize: "44px 44px", backgroundPosition: `${(frame * 0.25) % 44}px ${(frame * 0.15) % 44}px`}} />
    </AbsoluteFill>
  );
};

// Layer 4 — colour grade (above content)
export const Grade: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: "none"}}>
    <AbsoluteFill style={{backgroundColor: theme.colors.primary, mixBlendMode: "soft-light", opacity: 0.1}} />
    <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(255,255,255,0.0), transparent 25%, transparent 75%, rgba(16,35,29,0.03))"}} />
  </AbsoluteFill>
);

// Layer 5 — procedural grain + vignette (topmost)
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill style={{pointerEvents: "none", backgroundImage: noise, backgroundSize: "220px", backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`, opacity: 0.03, mixBlendMode: "multiply"}} />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: "none", background: `radial-gradient(ellipse at center, transparent 60%, ${withAlpha(theme.colors.text, 0.10)} 100%)`}} />
);
