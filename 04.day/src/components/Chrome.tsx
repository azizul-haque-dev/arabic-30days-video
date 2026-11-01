import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { clamp } from "./kit";

export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const dx = Math.sin(frame / 50) * 45;
  const dy = Math.cos(frame / 65) * 35;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          top: -320 + dy,
          left: -260 + dx,
          filter: "blur(65px)",
          background: `radial-gradient(circle, ${theme.colors.primarySoft}, transparent 68%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 820,
          height: 820,
          borderRadius: "50%",
          bottom: -300 - dy,
          right: -220 - dx,
          filter: "blur(70px)",
          background: `radial-gradient(circle, ${theme.colors.accentSoft}, transparent 68%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${theme.colors.primary}22 1.5px, transparent 1.5px)`,
          backgroundSize: "36px 36px",
          backgroundPosition: `${(frame * 0.4) % 36}px ${(frame * 0.4) % 36}px`,
          opacity: 0.45,
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
        opacity: 0.1,
      }}
    />
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, rgba(16,35,29,0.03), transparent 25%, transparent 78%, rgba(16,35,29,0.08))`,
      }}
    />
  </AbsoluteFill>
);

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const svgNoise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: svgNoise,
        backgroundSize: "180px 180px",
        backgroundPosition: `${(frame * 11) % 180}px ${(frame * 7) % 180}px`,
        opacity: 0.04,
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
        "radial-gradient(ellipse at center, transparent 64%, rgba(16, 35, 29, 0.14) 100%)",
    }}
  />
);

export const TransitionWipe: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const local = frame - (at - 6);
  if (local < 0 || local > 12) return null;
  const p = interpolate(local, [0, 6, 12], [0, 1, 0], {
    easing: theme.ease.inOut,
    ...clamp,
  });
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundColor: theme.colors.primarySoft,
        opacity: p * 0.35,
      }}
    />
  );
};
