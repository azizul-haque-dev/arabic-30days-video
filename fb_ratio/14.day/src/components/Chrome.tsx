import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";

export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 50) * 45;
  const d2 = Math.cos(frame / 65) * 40;
  const d3 = Math.sin(frame / 80) * 35;

  return (
    <AbsoluteFill style={{ background: theme.colors.bg, overflow: "hidden" }}>
      {/* Orb 1: Emerald Primary Ambient */}
      <div
        style={{
          position: "absolute",
          width: 850,
          height: 850,
          borderRadius: "50%",
          top: -220,
          left: -180 + d1,
          filter: "blur(90px)",
          background: "radial-gradient(circle, rgba(14, 159, 110, 0.28) 0%, transparent 68%)",
        }}
      />

      {/* Orb 2: Warm Amber Glow */}
      <div
        style={{
          position: "absolute",
          width: 780,
          height: 780,
          borderRadius: "50%",
          bottom: -180,
          right: -140 - d2,
          filter: "blur(95px)",
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, transparent 65%)",
        }}
      />

      {/* Orb 3: Center Mint Diffuser */}
      <div
        style={{
          position: "absolute",
          width: 650,
          height: 650,
          borderRadius: "50%",
          top: "40%",
          left: "25%",
          transform: `translate(${d3}px, ${-d1 * 0.5}px)`,
          filter: "blur(110px)",
          background: "radial-gradient(circle, rgba(205, 235, 223, 0.6) 0%, transparent 70%)",
        }}
      />

      {/* Subtle modern geometric dot matrix */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(rgba(14, 159, 110, 0.12) 1.5px, transparent 1.5px)`,
          backgroundSize: "36px 36px",
          opacity: 0.75,
          maskImage: "radial-gradient(circle at center, black 40%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 95%)",
        }}
      />

      {/* Subtle corner light accents */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent, rgba(14, 159, 110, 0.4) 50%, transparent)",
        }}
      />
    </AbsoluteFill>
  );
};

export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.primary,
        mixBlendMode: "soft-light",
        opacity: 0.10,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(16,35,29,0.05) 0%, transparent 25%, transparent 75%, rgba(16,35,29,0.10) 100%)",
      }}
    />
  </AbsoluteFill>
);

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
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
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        "radial-gradient(ellipse at center, transparent 65%, rgba(16,35,29,0.18) 100%)",
    }}
  />
);

export const Transition: React.FC<{ progress: number }> = ({ progress }) => {
  const wipe = interpolate(progress, [0, 1], [-100, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        transform: `translateX(${wipe}%)`,
        background: `linear-gradient(90deg, transparent, ${theme.colors.primarySoft} 50%, transparent)`,
        opacity: interpolate(progress, [0, 0.5, 1], [0, 0.8, 0]),
      }}
    />
  );
};
