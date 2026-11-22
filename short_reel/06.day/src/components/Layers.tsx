import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {theme} from "../theme";

/** Layer 1: soft geometric shapes drifting slowly (gentle background movement). */
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;
  const blobs = [
    {x: 0.12, y: 0.14, r: 460, color: theme.colors.light, ax: 40, ay: 60, sp: 0.35, o: 0.95},
    {x: 0.92, y: 0.38, r: 380, color: theme.colors.light, ax: 50, ay: 40, sp: 0.28, o: 0.8},
    {x: 0.18, y: 0.86, r: 520, color: theme.colors.light, ax: 60, ay: 50, sp: 0.22, o: 0.9},
    {x: 0.86, y: 0.92, r: 260, color: theme.colors.accentSoft, ax: 30, ay: 40, sp: 0.4, o: 0.35},
  ];
  return (
    <AbsoluteFill style={{backgroundColor: theme.colors.bg}}>
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.x * width - b.r / 2 + Math.sin(t * b.sp * 2 + i) * b.ax,
            top: b.y * height - b.r / 2 + Math.cos(t * b.sp * 2 + i * 1.7) * b.ay,
            width: b.r,
            height: b.r,
            borderRadius: "50%",
            backgroundColor: b.color,
            opacity: b.o,
            filter: "blur(70px)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/** Layer 4: very light color grade. */
export const Grade: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: "rgba(245, 158, 11, 0.025)", mixBlendMode: "multiply", pointerEvents: "none"}} />
);

/** Layer 5a: fine film grain. */
export const Grain: React.FC = () => (
  <AbsoluteFill style={{opacity: 0.045, mixBlendMode: "multiply", pointerEvents: "none"}}>
    <svg width="100%" height="100%">
      <filter id="am-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#am-grain)" />
    </svg>
  </AbsoluteFill>
);

/** Layer 5b: soft vignette. */
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 62%, ${theme.colors.shadow} 135%)`,
    }}
  />
);
