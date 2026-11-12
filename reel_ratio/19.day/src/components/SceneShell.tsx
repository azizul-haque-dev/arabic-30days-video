import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { exitProgress } from "../lib/anim";

/** Wraps a scene: every scene exits quickly (10 frames) so the next one can enter cleanly. */
export const SceneShell: React.FC<{ children: React.ReactNode; exit?: boolean }> = ({ children, exit = true }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const e = exit ? exitProgress(frame, durationInFrames, 10) : 0;
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(e, [0, 1], [1, 0]),
        transform: `translateY(${interpolate(e, [0, 1], [0, -36])}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
