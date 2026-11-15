import React from "react";
import { Composition, Still } from "remotion";
import { Reel } from "./Reel";
import { Thumbnail } from "./Thumbnail";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./data";

export const Root: React.FC = () => (
  <>
    <Composition id="ArabicMasterReel" component={Reel} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Still id="Thumbnail" component={Thumbnail} width={WIDTH} height={HEIGHT} />
  </>
);
