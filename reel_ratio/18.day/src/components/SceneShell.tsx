import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { exitFade } from "../lib/anim";

/** Wraps a scene: content fades out during the last 8 frames (faster than entrances). */
export const SceneShell: React.FC<{ durationInFrames: number; children: React.ReactNode; noExit?: boolean }> = ({ durationInFrames, children, noExit }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: noExit ? 1 : exitFade(frame, durationInFrames, 8) }}>{children}</AbsoluteFill>;
};
