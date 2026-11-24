import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {theme} from "../theme";

/** Layer 1 — animated background mesh + slow-drifting geometric star pattern */
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;
  const c = theme.colors;
  const blobs = [
    {x: 18, y: 14, r: 980, color: c.emerald, a: 0.6, sp: 0.35, ph: 0},
    {x: 88, y: 48, r: 860, color: c.green, a: 0.26, sp: 0.28, ph: 2},
    {x: 24, y: 90, r: 1040, color: c.greenDark, a: 0.42, sp: 0.22, ph: 4},
  ];
  return (
    <AbsoluteFill style={{background: `linear-gradient(165deg, ${c.bgDeep} 0%, ${c.bg} 48%, ${c.bgDeep} 100%)`}}>
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: (b.x / 100) * width + Math.sin(t * b.sp + b.ph) * 70 - b.r / 2,
            top: (b.y / 100) * height + Math.cos(t * b.sp * 1.1 + b.ph) * 90 - b.r / 2,
            width: b.r,
            height: b.r,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${b.color} 0%, transparent 68%)`,
            opacity: b.a,
          }}
        />
      ))}
      <svg width={width} height={height} style={{position: "absolute", inset: 0, opacity: 0.09}}>
        <defs>
          <pattern
            id="star-tile"
            width="180"
            height="180"
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${t * 8} ${t * 5})`}
          >
            <g fill="none" stroke={c.mint} strokeWidth="2">
              <rect x="40" y="40" width="100" height="100" rx="6" />
              <rect x="40" y="40" width="100" height="100" rx="6" transform="rotate(45 90 90)" />
              <circle cx="0" cy="0" r="5" />
              <circle cx="180" cy="0" r="5" />
              <circle cx="0" cy="180" r="5" />
              <circle cx="180" cy="180" r="5" />
            </g>
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#star-tile)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Layer 4 — colour grade */
export const Grade: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "linear-gradient(180deg, rgba(255,214,120,0.07) 0%, rgba(0,60,40,0.14) 100%)",
      mixBlendMode: "soft-light",
      pointerEvents: "none",
    }}
  />
);

/** Layer 5a — film grain */
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.11}}>
      <svg width={720} height={1280} style={{transform: "scale(1.5)", transformOrigin: "0 0"}}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 6} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Layer 5b — vignette */
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.5) 100%)",
      pointerEvents: "none",
    }}
  />
);
