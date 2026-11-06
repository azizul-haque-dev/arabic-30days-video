import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

const DOTS = Array.from({ length: 16 }, (_, i) => ({
  x: random(`dx-${i}`) * 100,
  y: random(`dy-${i}`) * 100,
  r: 6 + random(`dr-${i}`) * 14,
  speed: 0.2 + random(`ds-${i}`) * 0.4,
  accent: i % 5 === 0,
}));

/** Layer 1: living gradient mesh + parallax dots. Always behind scene content. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const c = theme.colors;
  const blob = (cx: number, cy: number, r: number, color: string, ph: number) => {
    const x = cx + Math.sin(t * 0.25 + ph) * 90;
    const y = cy + Math.cos(t * 0.2 + ph) * 120;
    return `radial-gradient(circle ${r}px at ${x}px ${y}px, ${color}, transparent 70%)`;
  };
  return (
    <AbsoluteFill style={{ backgroundColor: c.bg }}>
      <AbsoluteFill
        style={{
          background: [
            blob(width * 0.15, height * 0.12, 620, "rgba(14,159,110,0.16)", 0),
            blob(width * 0.95, height * 0.55, 560, "rgba(245,158,11,0.12)", 2),
            blob(width * 0.2, height * 0.95, 640, "rgba(14,159,110,0.12)", 4),
          ].join(","),
        }}
      />
      {DOTS.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${d.x}%`,
            top: `${(d.y + t * d.speed * 3) % 110 - 5}%`,
            width: d.r,
            height: d.r,
            borderRadius: "50%",
            backgroundColor: d.accent ? c.accent : c.primary,
            opacity: d.accent ? 0.16 : 0.1,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/** Top layer: subtle vignette. */
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: "radial-gradient(ellipse at center, transparent 62%, rgba(16,35,29,0.10) 100%)",
    }}
  />
);
