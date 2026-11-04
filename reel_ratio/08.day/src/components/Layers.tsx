import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { theme } from "../theme";

const c = theme.colors;

// Layer 1: animated mesh background (no blur filters: cheap to render).
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 55) * 60;
  const d2 = Math.cos(frame / 70) * 50;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${c.bg} 0%, #E6F5F0 100%)` }}>
      <div style={{ position: "absolute", width: 1400, height: 1400, borderRadius: "50%", top: -600, left: -420 + d1,
        background: `radial-gradient(circle, ${c.primary}1C, transparent 62%)` }} />
      <div style={{ position: "absolute", width: 1200, height: 1200, borderRadius: "50%", bottom: -560, right: -360 - d2,
        background: `radial-gradient(circle, ${c.accent}14, transparent 64%)` }} />
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", top: 760 + d2, left: -520,
        background: `radial-gradient(circle, ${c.primary}10, transparent 66%)` }} />
    </AbsoluteFill>
  );
};

// Layer 4: colour grade (gradient only, soft).
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none",
    background: `linear-gradient(180deg, rgba(255,255,255,0.20), transparent 26%, transparent 74%, ${c.primary}14)` }} />
);

// Layer 5: subtle film grain (pre-rendered noise tile) + vignette.
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: `url(${staticFile("noise.png")})`, backgroundSize: "256px",
      backgroundPosition: `${(frame * 37) % 256}px ${(frame * 59) % 256}px`, opacity: 0.035 }} />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none",
    background: `radial-gradient(ellipse at center, transparent 62%, ${c.text}0C 100%)` }} />
);
