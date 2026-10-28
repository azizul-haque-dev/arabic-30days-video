import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { clampX } from "../anim";

// Wraps every scene: quick eased entrance of the whole scene + faster exit (shorter than entrance).
export const SceneShell: React.FC<{ children: React.ReactNode; dir?: 1 | -1 }> = ({ children, dir = 1 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame, fps, config: theme.spring.smooth });
  const exit = interpolate(frame, [durationInFrames - theme.motion.exit, durationInFrames], [0, 1], { easing: theme.ease.in, ...clampX });
  return (
    <AbsoluteFill style={{
      opacity: 1 - exit,
      transform: `translateX(${(1 - enter) * 56 * dir - exit * 36 * dir}px) scale(${1 - exit * 0.04})`,
    }}>
      {children}
    </AbsoluteFill>
  );
};
