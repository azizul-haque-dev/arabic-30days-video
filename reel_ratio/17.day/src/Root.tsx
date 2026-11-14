import React from "react";
import { Composition } from "remotion";
import { Episode } from "./Episode";
import { episode } from "./episodes/active";
import { generated } from "./episodes/timeline";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Episode"
    component={Episode}
    durationInFrames={generated.durationInFrames}
    fps={episode.fps}
    width={episode.width}
    height={episode.height}
    defaultProps={{ showCues: false }}
  />
);
