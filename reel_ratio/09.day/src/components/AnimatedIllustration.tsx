import React from "react";
import { interpolate } from "remotion";
import { theme } from "../theme";
import { illustrationMap } from "../illustrations";
import { useSpringIn } from "../animations/presets";

/** Illustration card: soft panel + the SVG illustration for this sentence. */
export const AnimatedIllustration: React.FC<{
  kind: string;
  ar: number;
  m: number;
  dur: number;
  width?: number;
  height?: number;
}> = ({ kind, ar, m, dur, width = 936, height = 560 }) => {
  const Illus = illustrationMap[kind];
  const p = useSpringIn(4, "smooth");
  if (!Illus) throw new Error(`Unknown illustration "${kind}"`);
  const c = theme.colors;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 56,
        background: `linear-gradient(160deg, ${c.white}, ${c.primarySoft})`,
        border: `2px solid ${c.line}`,
        boxShadow: `0 34px 70px -28px ${c.primaryMid}`,
        overflow: "hidden",
        position: "relative",
        opacity: Math.min(1, p),
        transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px) scale(${interpolate(p, [0, 1], [0.95, 1])})`,
      }}
    >
      <svg viewBox="0 0 600 520" width={width} height={height} preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", inset: 0 }}>
        <Illus ar={ar} m={m} dur={dur} />
      </svg>
    </div>
  );
};
