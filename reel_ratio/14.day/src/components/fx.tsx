import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../config/theme";
import { breathe } from "../utils/motion";

const c = theme.colors;

/** Layer 1: moving gradient mesh + faint lane texture. Never a flat colour. */
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = breathe(frame, fps, 60, 9);
  const b = breathe(frame, fps, 80, 12, 1.7);
  return (
    <AbsoluteFill style={{ background: c.bg }}>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(900px 700px at ${220 + a}px ${260 + b}px, ${c.greenSoft} 0%, rgba(205,239,226,0) 70%)`,
            `radial-gradient(800px 800px at ${900 - a}px ${1500 - b}px, ${c.amberSoft} 0%, rgba(253,230,176,0) 62%)`,
            `radial-gradient(700px 600px at ${820 + b}px ${520 - a}px, ${c.greenMist} 0%, rgba(221,243,234,0) 70%)`,
          ].join(","),
        }}
      />
      <svg width={theme.layout.W} height={theme.layout.H} style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={-200 + i * 260} y={0} width={4} height={theme.layout.H} fill={c.white} transform={`rotate(14 540 960)`} opacity={0.55} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/** Layer 4: very light colour grade. */
export const Grade: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `linear-gradient(160deg, rgba(14,159,110,0.05) 0%, rgba(255,255,255,0) 45%, rgba(245,158,11,0.06) 100%)`,
    }}
  />
);

/** Layer 5: static grain + vignette. */
export const GrainVignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={theme.layout.W} height={theme.layout.H} style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.07 }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(16,35,29,0) 62%, rgba(16,35,29,0.16) 100%)` }} />
  </AbsoluteFill>
);
