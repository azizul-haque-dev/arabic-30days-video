import React from "react";
import { AbsoluteFill } from "remotion";
import { useExit } from "../lib/anim";

/** Applies the shared exit (faster than entrances): opacity + translateY + scale. */
export const SceneShell: React.FC<{ exitFrames: number; children: React.ReactNode }> = ({ exitFrames, children }) => {
  const x = useExit(exitFrames);
  return (
    <AbsoluteFill style={{ opacity: 1 - x, transform: `translateY(${-36 * x}px) scale(${1 - 0.03 * x})` }}>
      {children}
    </AbsoluteFill>
  );
};
