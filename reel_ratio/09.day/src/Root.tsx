import React from "react";
import { Composition, Still } from "remotion";
import videoConfig from "../config/video.config.json";
import { ArabicMasterDay09, defaultDayProps } from "./compositions/ArabicMasterDay09";
import { BgMesh, Finish } from "./components/Backdrop";
import { FontLoader } from "./components/FontLoader";
import { ThumbnailScene } from "./scenes/ThumbnailScene";
import { FPS, TOTAL_FRAMES } from "./utils/timeline";

const ThumbnailStill: React.FC = () => (
  <>
    <FontLoader />
    <BgMesh />
    <ThumbnailScene />
    <Finish />
  </>
);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id={videoConfig.compositionId}
      component={ArabicMasterDay09}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={videoConfig.width}
      height={videoConfig.height}
      defaultProps={defaultDayProps}
    />
    <Still id={videoConfig.stillCompositionId} component={ThumbnailStill} width={videoConfig.width} height={videoConfig.height} />
  </>
);
