import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

const NOISE = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' seed='7'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`;

/** Layer 1: slowly drifting gradient mesh (never a flat colour). */
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const a = { x: 22 + Math.sin(t * 0.35) * 8, y: 14 + Math.cos(t * 0.3) * 6 };
  const b = { x: 82 + Math.cos(t * 0.28) * 7, y: 38 + Math.sin(t * 0.33) * 8 };
  const c = { x: 30 + Math.sin(t * 0.22 + 2) * 9, y: 88 + Math.cos(t * 0.26) * 5 };
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(900px 900px at ${a.x}% ${a.y}%, rgba(14,159,110,0.16), transparent 60%),
          radial-gradient(800px 800px at ${b.x}% ${b.y}%, rgba(245,158,11,0.13), transparent 60%),
          radial-gradient(1000px 1000px at ${c.x}% ${c.y}%, rgba(14,159,110,0.12), transparent 62%), ${theme.colors.bg}`,
      }}
    />
  );
};

/** Layers 4-5: colour grade, grain and vignette sit on top of everything and never block pointer events. */
export const Finish: React.FC = () => (
  <>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(14,159,110,0.035), rgba(245,158,11,0.03))", pointerEvents: "none" }} />
    <AbsoluteFill style={{ backgroundImage: NOISE, opacity: 0.05, mixBlendMode: "multiply", pointerEvents: "none" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 58%, rgba(16,35,29,0.10) 100%)", pointerEvents: "none" }} />
  </>
);
