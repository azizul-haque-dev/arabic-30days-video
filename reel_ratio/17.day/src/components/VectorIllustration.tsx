import React from "react";
import type { IllustrationId } from "../types";
import { REGIONS, type Rect } from "../layout/engine";
import { theme } from "../theme";
import { ILLUSTRATIONS, HeroTableScene } from "../episodes/day-17/illustrations/scenes";

/**
 * Illustration in its own reserved, clipped box. Nothing drawn inside can leave the box,
 * so animated art can never collide with the text outside it.
 */
export const VectorIllustration: React.FC<{
  id?: IllustrationId | "hero";
  rect?: Rect;
  style?: React.CSSProperties;
  zoom?: number;
  flow?: boolean; // when true the box is laid out by the parent (flex) instead of absolutely
}> = ({ id = "hero", rect = REGIONS.illustration, style, zoom = 1, flow }) => {
  const Art = id === "hero" ? HeroTableScene : ILLUSTRATIONS[id];
  return (
    <div
      data-box="illustration"
      data-kind="art"
      data-region={flow ? undefined : "illustration"}
      style={{
        position: flow ? "relative" : "absolute",
        left: flow ? undefined : rect.x,
        top: flow ? undefined : rect.y,
        width: rect.w,
        height: rect.h,
        flexShrink: 0,
        borderRadius: 44,
        overflow: "hidden",
        background: theme.colors.art.wall,
        boxShadow: `0 24px 60px ${theme.colors.shadow}`,
        border: `6px solid ${theme.colors.white}`,
        boxSizing: "border-box",
        ...style,
      }}
    >
      <svg
        width={rect.w - 12}
        height={rect.h - 12}
        viewBox="0 0 940 640"
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", transform: `scale(${zoom})`, transformOrigin: "50% 60%" }}
      >
        <Art />
      </svg>
    </div>
  );
};
