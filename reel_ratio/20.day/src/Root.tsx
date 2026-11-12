import React from "react";
import { Composition } from "remotion";
import { Day20Video } from "./Day20Video";
import { theme } from "./theme";
import { TOTAL_FRAMES } from "./timing";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Day20"
    component={Day20Video}
    durationInFrames={TOTAL_FRAMES}
    fps={theme.canvas.fps}
    width={theme.canvas.w}
    height={theme.canvas.h}
  />
);
