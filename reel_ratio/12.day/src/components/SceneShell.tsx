import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

/** Every scene exits in its last ~10 frames (opacity + lift + shrink). Scenes never overlap in time. */
export const SceneShell: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = Math.round(theme.motion.exitSeconds * fps);
  const p = interpolate(frame, [duration - exit, duration - 1], [0, 1], { easing: theme.easing.exit, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: 1 - p, transform: `translateY(${-16 * p}px) scale(${1 - 0.02 * p})`, fontFamily: theme.fonts.main }}>
      {children}
    </AbsoluteFill>
  );
};
