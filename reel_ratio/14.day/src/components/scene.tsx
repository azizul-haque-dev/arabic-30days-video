import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../config/theme";
import { enter, enterStyle, exitProgress, sec } from "../utils/motion";
import { Zone } from "./layout";
import { Logo } from "./brand";

/** Wraps a scene: fast eased exit at the end (shorter than the entrances). */
export const SceneShell: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = exitProgress(frame, dur, sec(theme.timing.exitSec, fps));
  return (
    <AbsoluteFill style={{ opacity: 1 - e, transform: `translateY(${-28 * e}px) scale(${1 - 0.03 * e})`, transformOrigin: "50% 50%" }}>
      {children}
    </AbsoluteFill>
  );
};

/** Top bar: logo on the left, optional right-hand element. Both live in the `top` zone. */
export const TopBar: React.FC<{ right?: React.ReactNode; delay?: number; instant?: boolean }> = ({ right, delay = 0, instant }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = instant ? 1 : enter(frame, fps, delay);
  return (
    <Zone zone="top" dir="row" justify="center">
      <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", ...(instant ? {} : enterStyle(p, 12, 0.97)) }}>
        <Logo />
        {right}
      </div>
    </Zone>
  );
};
