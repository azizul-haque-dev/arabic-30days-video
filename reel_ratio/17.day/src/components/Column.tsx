import React from "react";
import { AbsoluteFill } from "remotion";
import { MARGIN } from "../layout/engine";

/** Safe-area flex column used by all non-sentence scenes: nothing can overlap, flow decides positions. */
export const Column: React.FC<{ gap?: number; children: React.ReactNode }> = ({ gap = 40, children }) => (
  <AbsoluteFill
    style={{
      padding: `170px ${MARGIN}px 270px`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap,
    }}
  >
    {children}
  </AbsoluteFill>
);
