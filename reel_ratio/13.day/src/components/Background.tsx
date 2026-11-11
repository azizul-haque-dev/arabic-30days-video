import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../config/theme";

const C = theme.colors;

/** Persistent decorative background (no text, never part of layout validation). */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.bg} 0%, #E6F5F0 100%)` }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0 }}>
        <circle cx={140 + Math.sin(t * 0.4) * 30} cy={1720 + Math.cos(t * 0.3) * 20} r={300} fill={C.primary} opacity={0.07} />
        <circle cx={960 + Math.cos(t * 0.35) * 30} cy={160 + Math.sin(t * 0.3) * 20} r={260} fill={C.accent} opacity={0.08} />
        <circle cx={900 + Math.sin(t * 0.25) * 24} cy={1000} r={180} fill={C.primary} opacity={0.05} />
      </svg>
    </AbsoluteFill>
  );
};
