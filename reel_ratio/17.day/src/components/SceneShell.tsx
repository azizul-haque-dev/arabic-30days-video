import React, { useRef } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { exitStyle, sec, useExit } from "../motion";
import { useLayoutAudit } from "../layout/audit";
import { theme } from "../theme";

/** Wraps every scene: layout audit on each frame + fast exit + optional wipe in/out. */
export const SceneShell: React.FC<{
  label: string;
  durationInFrames: number;
  wipeIn?: boolean;
  wipeOut?: boolean;
  noExit?: boolean;
  children: React.ReactNode;
}> = ({ label, durationInFrames, wipeIn, wipeOut, noExit, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const exit = useExit(durationInFrames);
  useLayoutAudit(ref, label);

  const wn = sec(0.4, fps);
  const wipeInX = wipeIn
    ? interpolate(frame, [0, wn], [0, width], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.easing.inOut })
    : width;
  const wipeOutX = wipeOut
    ? interpolate(frame, [durationInFrames - wn, durationInFrames], [-width, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: theme.easing.inOut,
      })
    : -width;

  return (
    <AbsoluteFill ref={ref}>
      <AbsoluteFill style={wipeOut || noExit ? undefined : exitStyle(exit)}>{children}</AbsoluteFill>
      {wipeIn && wipeInX < width && <Wipe x={wipeInX} />}
      {wipeOut && wipeOutX > -width && <Wipe x={wipeOutX} />}
    </AbsoluteFill>
  );
};

const Wipe: React.FC<{ x: number }> = ({ x }) => (
  <AbsoluteFill
    style={{
      transform: `translateX(${x}px)`,
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
      borderLeft: `14px solid ${theme.colors.accent}`,
    }}
  />
);
