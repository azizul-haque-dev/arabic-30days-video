import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { idle } from "../lib/anim";
import { theme } from "../theme";

/**
 * Layered background: flat brand colour -> slow mesh blobs -> colour grade -> grain -> vignette.
 * Everything here is decorative (never registered with the layout probe) and kept very low-contrast
 * so readability always wins over decoration.
 */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const a = idle(frame, fps, 14, 0);
  const b = idle(frame, fps, 17, 2);
  const c = idle(frame, fps, 20, 4);
  const blob = (x: number, y: number, r: number, color: string): React.CSSProperties => ({
    position: "absolute",
    left: x - r,
    top: y - r,
    width: r * 2,
    height: r * 2,
    borderRadius: "50%",
    background: `radial-gradient(circle at 50% 50%, ${color} 0%, ${theme.colors.transparent} 68%)`,
  });
  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }} data-lignore="true">
      <div style={blob(180 + a * 60, 260 + b * 50, 520, theme.colors.meshA)} />
      <div style={blob(900 - b * 70, 1180 + a * 80, 600, theme.colors.meshB)} />
      <div style={blob(300 + c * 80, 1700 - b * 60, 560, theme.colors.meshC)} />
      <AbsoluteFill style={{ backgroundColor: theme.colors.gradeWarm, mixBlendMode: "soft-light" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: 0.045, mixBlendMode: "multiply" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={Math.floor(frame / 2) % 9} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={width} height={height} filter="url(#grain)" fill={theme.colors.grain} />
      </svg>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, ${theme.colors.transparent} 62%, ${theme.colors.vignette} 100%)` }} />
    </AbsoluteFill>
  );
};
