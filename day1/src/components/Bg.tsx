import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { alpha, theme } from "../theme";

// Layer 1: animated mint mesh (never a flat colour)
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 55) * 50, d2 = Math.cos(frame / 70) * 40, d3 = Math.sin(frame / 90) * 30;
  const c = theme.colors;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${c.bg} 0%, ${c.bgDeep} 140%)` }}>
      <div style={{ position: "absolute", width: 980, height: 980, borderRadius: "50%", top: -380 + d3, left: -260 + d1, filter: "blur(40px)",
        background: `radial-gradient(circle, ${alpha(c.primary, 0.20)}, transparent 62%)` }} />
      <div style={{ position: "absolute", width: 820, height: 820, borderRadius: "50%", bottom: -330, right: -230 - d2, filter: "blur(50px)",
        background: `radial-gradient(circle, ${alpha(c.accent, 0.20)}, transparent 65%)` }} />
      <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", top: 300 - d1, right: -380, filter: "blur(60px)",
        background: `radial-gradient(circle, ${alpha(c.primary, 0.10)}, transparent 65%)` }} />
    </AbsoluteFill>
  );
};

// Layer 2: "assets" — faint floating geometry + dot texture, drifting at different depths (parallax)
export const Decor: React.FC = () => {
  const frame = useCurrentFrame();
  const c = theme.colors;
  const items = Array.from({ length: 11 }).map((_, i) => ({
    x: random(`x${i}`) * 1080, y: random(`y${i}`) * 1080, s: 26 + random(`s${i}`) * 64,
    kind: i % 3, depth: 0.4 + random(`d${i}`) * 0.9, ph: random(`p${i}`) * 6,
  }));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(${alpha(c.primary, 0.13)} 2px, transparent 2.5px)`, backgroundSize: "54px 54px",
        backgroundPosition: `${-frame * 0.25}px ${-frame * 0.15}px`, opacity: 0.55 }} />
      {items.map((it, i) => {
        const dx = Math.sin(frame / 80 + it.ph) * 18 * it.depth, dy = Math.cos(frame / 70 + it.ph) * 22 * it.depth - frame * 0.05 * it.depth;
        const base: React.CSSProperties = { position: "absolute", left: it.x + dx, top: ((it.y + dy) % 1180 + 1180) % 1180 - 50, width: it.s, height: it.s };
        if (it.kind === 0) return <div key={i} style={{ ...base, borderRadius: "50%", border: `4px solid ${alpha(c.primary, 0.14)}` }} />;
        if (it.kind === 1) return <div key={i} style={{ ...base, borderRadius: it.s / 3, background: alpha(c.accent, 0.12), transform: `rotate(${frame * 0.2 * it.depth + it.ph * 30}deg)` }} />;
        return (
          <svg key={i} style={base} viewBox="0 0 24 24" fill="none" stroke={alpha(c.primary, 0.2)} strokeWidth="2.6" strokeLinecap="round">
            <path d="M12 4v16M4 12h16" />
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};

// Layer 4: colour grade (above content)
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.primary, mixBlendMode: "soft-light", opacity: 0.12 }} />
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${alpha(theme.colors.text, 0.05)}, transparent 26%, transparent 74%, ${alpha(theme.colors.text, 0.08)})` }} />
  </AbsoluteFill>
);

// Layer 5a: procedural film grain
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: noise, backgroundSize: "220px",
    backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`, opacity: 0.05, mixBlendMode: "multiply" }} />;
};

// Layer 5b: vignette (topmost)
export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at center, transparent 58%, ${alpha(theme.colors.text, 0.13)} 100%)` }} />
);
