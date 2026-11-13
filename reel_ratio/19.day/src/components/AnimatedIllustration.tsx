import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { L } from "../design/layout";
import { colors, radius, shadow, springs } from "../design/tokens";
import { enter } from "../lib/anim";
import { illustrations } from "../illustrations/library";
import type { IllustrationId } from "../types";

/** Rounded illustration panel with its own reserved band (default y 350 -> 930). */
export const AnimatedIllustration: React.FC<{ id: IllustrationId; top?: number; opacity?: number; visibleAtStart?: boolean }> = ({
  id,
  top = L.illustration.top,
  opacity = 1,
  visibleAtStart = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = Math.max(visibleAtStart ? 0.94 : 0, enter(frame, fps, 0, springs.smooth));
  const Scene = illustrations[id];
  return (
    <div
      style={{
        position: "absolute",
        left: L.side,
        top,
        width: L.contentWidth,
        height: L.illustration.height,
        borderRadius: radius.panel,
        overflow: "hidden",
        border: `2px solid ${colors.border}`,
        boxShadow: shadow.soft,
        background: colors.white,
        opacity: p * opacity,
        transform: `scale(${interpolate(p, [0, 1], [0.95, 1])})`,
      }}
    >
      <svg width={L.contentWidth} height={L.illustration.height} viewBox="0 0 920 580" style={{ display: "block" }}>
        <Scene />
      </svg>
    </div>
  );
};
