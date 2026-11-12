import React from "react";
import { Composition, Still } from "remotion";
import audioManifest from "./generated/audio-manifest.json";
import { Day18Video } from "./compositions/Day18Video";
import { ThumbnailStill } from "./compositions/ThumbnailStill";
import { episodeConfig } from "./episodes/day-18/config";
import { totalFramesFor } from "./episodes/day-18/timeline";
import { loadFonts } from "./lib/fonts";

loadFonts();

const { width, height, fps } = episodeConfig.video;
// Duration follows the discovered audio (build-time manifest); never shorter than the last subtitle.
const totalFrames = totalFramesFor(fps, audioManifest.found ? audioManifest.durationSeconds : null);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Day18"
      component={Day18Video}
      durationInFrames={totalFrames}
      fps={fps}
      width={width}
      height={height}
      defaultProps={{ fps, totalFrames }}
    />
    <Still id="Day18Thumbnail" component={ThumbnailStill} width={width} height={height} />
  </>
);
