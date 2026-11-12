import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";

const Blob: React.FC<{ x: number; y: number; r: number; color: string; phase: number; amp?: number }> = ({ x, y, r, color, phase, amp = 40 }) => {
  const f = useCurrentFrame();
  const dx = Math.sin((f + phase) / 140) * amp;
  const dy = Math.cos((f + phase) / 170) * amp;
  return (
    <div
      style={{
        position: "absolute",
        left: x - r + dx,
        top: y - r + dy,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 68%)`,
      }}
    />
  );
};

/** Layer 1 — soft animated gradient mesh (never a flat background). */
export const BgMesh: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${theme.colors.bg} 0%, #E8F9EE 100%)` }}>
    <Blob x={160} y={260} r={520} color="rgba(22,163,74,0.20)" phase={0} />
    <Blob x={940} y={900} r={560} color="rgba(220,252,231,0.95)" phase={60} />
    <Blob x={200} y={1560} r={520} color="rgba(245,158,11,0.10)" phase={120} />
    <Blob x={900} y={1700} r={480} color="rgba(22,163,74,0.16)" phase={30} />
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
      <defs>
        <pattern id="dots" width="48" height="48" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="2" fill="rgba(20,83,45,0.10)" />
        </pattern>
      </defs>
      <rect width="1080" height="1920" fill="url(#dots)" />
    </svg>
  </AbsoluteFill>
);

/** Top layers — colour grade, vignette and fine grain (always above content). */
export const Finish: React.FC = () => {
  const f = useCurrentFrame();
  const jitter = (f * 37) % 200;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(20,83,45,0.04) 100%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(20,83,45,0.14) 100%)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "multiply", transform: `translate(${-jitter % 17}px, ${-jitter % 13}px)` }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="1200" height="2000" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
