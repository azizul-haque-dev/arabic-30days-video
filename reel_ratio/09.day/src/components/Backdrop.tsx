import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";

/** Layer 1 — animated mint mesh (never a flat background). */
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 55) * 50;
  const d2 = Math.cos(frame / 70) * 40;
  const d3 = Math.sin(frame / 83) * 30;
  const c = theme.colors;
  return (
    <AbsoluteFill style={{ background: c.bg }}>
      <div style={{ position: "absolute", width: 1300, height: 1300, borderRadius: "50%", top: -560, left: -380 + d1, filter: "blur(50px)", background: `radial-gradient(circle, ${c.primary}33, transparent 62%)` }} />
      <div style={{ position: "absolute", width: 1000, height: 1000, borderRadius: "50%", bottom: -460, right: -300 - d2, filter: "blur(70px)", background: `radial-gradient(circle, ${c.accent}1A, transparent 65%)` }} />
      <div style={{ position: "absolute", width: 800, height: 800, borderRadius: "50%", top: 700 + d3, left: -420, filter: "blur(60px)", background: `radial-gradient(circle, ${c.primary}1F, transparent 66%)` }} />
      {/* subtle dotted pattern */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${c.primary}1A 2px, transparent 2.5px)`,
          backgroundSize: "54px 54px",
          backgroundPosition: `${(frame * 0.25) % 54}px ${(frame * 0.15) % 54}px`,
          opacity: 0.55,
        }}
      />
    </AbsoluteFill>
  );
};

/** Layers 4+5 — colour grade, grain and vignette (always topmost). */
export const Finish: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ backgroundColor: theme.colors.primary, mixBlendMode: "soft-light", opacity: 0.08 }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(16,35,29,0.02), transparent 24%, transparent 80%, rgba(16,35,29,0.03))" }} />
      <AbsoluteFill
        style={{
          backgroundImage: noise,
          backgroundSize: "220px",
          backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
          opacity: 0.045,
          mixBlendMode: "multiply",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 58%, rgba(16,35,29,0.05) 100%)" }} />
    </AbsoluteFill>
  );
};
