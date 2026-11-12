import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.06  0 0 0 0 0.14  0 0 0 0 0.11  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/** Layer 1 (bottom): animated brand-color mesh. Persistent behind every scene. */
export const BackgroundMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const c = theme.colors;
  return (
    <AbsoluteFill style={{ backgroundColor: c.bg }}>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(900px 760px at ${28 + 7 * Math.sin(t * 0.25)}% ${16 + 4 * Math.cos(t * 0.2)}%, ${c.primarySoft}CC, transparent 62%)`,
            `radial-gradient(820px 720px at ${78 + 6 * Math.cos(t * 0.22)}% ${84 + 4 * Math.sin(t * 0.18)}%, ${c.accentSoft}AA, transparent 62%)`,
            `radial-gradient(700px 600px at 85% 30%, ${c.bgAlt}, transparent 65%)`,
          ].join(","),
        }}
      />
    </AbsoluteFill>
  );
};

/** Layers 4-5 (top): colour grade, film grain, vignette. Purely decorative, never touches layout. */
export const PostLayers: React.FC = () => {
  const c = theme.colors;
  return (
    <>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `linear-gradient(180deg, ${c.white}00 0%, ${c.primary}0A 100%)`,
          mixBlendMode: "multiply",
        }}
      />
      <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: GRAIN, opacity: 0.05 }} />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(ellipse at 50% 50%, transparent 62%, ${c.text}1A 100%)`,
        }}
      />
    </>
  );
};
