import React from "react";
import type { IllustrationKey } from "../episodes/types";
import { ART_H, ART_W, ILLUSTRATIONS } from "../illustrations";

/**
 * Renders one illustration inside its RESERVED box. The box is sized from the available region
 * (contain-fit, aspect locked) and registered with the layout probe together with the rendered
 * art content so any animated element escaping the box is detected.
 */
export const VectorIllustration: React.FC<{
  illustration: IllustrationKey;
  frame: number;
  fps: number;
  maxWidth: number;
  maxHeight: number;
  boxId?: string;
}> = ({ illustration, frame, fps, maxWidth, maxHeight, boxId = "art-region" }) => {
  const scale = Math.min(maxWidth / ART_W, maxHeight / ART_H);
  const w = Math.floor(ART_W * scale);
  const h = Math.floor(ART_H * scale);
  const Scene = ILLUSTRATIONS[illustration];
  return (
    <div style={{ width: maxWidth, height: maxHeight, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div data-lbox={boxId} data-lkind="art" style={{ width: w, height: h }}>
        <svg width={w} height={h} viewBox={`0 0 ${ART_W} ${ART_H}`} style={{ display: "block", overflow: "hidden" }}>
          <g data-lbox={`${boxId}-content`} data-lkind="art-content">
            <Scene frame={frame} fps={fps} />
          </g>
        </svg>
      </div>
    </div>
  );
};
