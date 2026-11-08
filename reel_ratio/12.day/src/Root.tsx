import React from "react";
import { Composition } from "remotion";
import "./fonts";
import { ArabicMasterComposition } from "./compositions/ArabicMasterComposition";
import { episode, timeline } from "./config/episode";

export const RemotionRoot: React.FC = () => (
  <Composition
    id={episode.compositionId}
    component={ArabicMasterComposition}
    durationInFrames={timeline.totalFrames}
    fps={episode.video.fps}
    width={episode.video.width}
    height={episode.video.height}
  />
);
