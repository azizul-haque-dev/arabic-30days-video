import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "../design/tokens";

/** Layer 1: subtle animated mesh. Never a flat colour. */
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 90) * 60;
  const d2 = Math.cos(frame / 120) * 50;
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          borderRadius: "50%",
          top: -520,
          left: -380 + d1,
          background: `radial-gradient(circle, ${colors.primary}2E, transparent 64%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          bottom: -480,
          right: -360 - d2,
          background: `radial-gradient(circle, ${colors.amber}24, transparent 66%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

/** Layers 4-5: colour grade, grain, vignette. Always on top, never intercept content. */
export const FinishLayers: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ pointerEvents: "none", backgroundColor: colors.primary, mixBlendMode: "soft-light", opacity: 0.1 }} />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          backgroundImage: noise,
          backgroundSize: "220px",
          backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
          opacity: 0.035,
          mixBlendMode: "multiply",
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 62%, rgba(20,83,45,0.08) 100%)",
        }}
      />
    </>
  );
};
