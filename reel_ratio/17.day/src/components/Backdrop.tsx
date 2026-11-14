import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { breathe } from "../motion";

const c = theme.colors;

/** Layer 1 — animated gradient mesh (never a flat solid). Persistent across scenes. */
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const b = (p: number, ph: number) => breathe(frame, fps, p, ph);
  return (
    <AbsoluteFill style={{ background: c.bg }}>
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          left: -300 + b(14, 0) * 60,
          top: -260 + b(17, 1) * 70,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${c.primarySoft} 0%, rgba(212,239,229,0) 68%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 950,
          height: 950,
          left: width - 640 + b(16, 2) * 60,
          top: height - 900 + b(13, 3) * 70,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${c.accentSoft} 0%, rgba(253,239,203,0) 66%)`,
          opacity: 0.85,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          left: width / 2 - 400 + b(19, 4) * 80,
          top: height / 2 - 300 + b(15, 5) * 60,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 65%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const NOISE = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='220' height='220' filter='url(%23n)'/></svg>`,
)}")`;

/** Layers 4–5 — subtle colour grade, film grain and vignette. Always on top, never blocks reading. */
export const FinishLayers: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `linear-gradient(180deg, rgba(14,159,110,0.03) 0%, rgba(255,255,255,0) 40%, rgba(245,158,11,0.03) 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          backgroundImage: NOISE,
          backgroundSize: "220px 220px",
          backgroundPosition: `${(frame * 53) % 220}px ${(frame * 91) % 220}px`,
          opacity: 0.03,
          mixBlendMode: "multiply",
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(ellipse at 50% 50%, rgba(16,35,29,0) 62%, rgba(16,35,29,0.045) 100%)`,
        }}
      />
    </>
  );
};
