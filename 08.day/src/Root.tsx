import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { Thumbnail } from "./scenes/Thumbnail";
import { theme } from "./theme";
import { TOTAL_FRAMES } from "./timing";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Main"
      component={Main}
      durationInFrames={TOTAL_FRAMES}
      fps={theme.video.fps}
      width={theme.video.width}
      height={theme.video.height}
    />
    <Composition
      id="Thumbnail"
      component={Thumbnail}
      durationInFrames={1}
      fps={theme.video.fps}
      width={theme.video.width}
      height={theme.video.height}
    />
  </>
);
