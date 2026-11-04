import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "./fonts";
import { Main } from "./Main";
import { BgMesh, Grade, Grain, Vignette } from "./components/Layers";
import { Thumbnail as ThumbnailScene } from "./scenes/Thumbnail";
import { DURATION } from "./timeline";
import { FPS, H, W } from "./theme";

const Thumbnail: React.FC = () => (
  <AbsoluteFill>
    <BgMesh />
    <ThumbnailScene />
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <>
    <Composition id="Day8" component={Main} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
    <Composition id="Thumbnail" component={Thumbnail} durationInFrames={1} fps={FPS} width={W} height={H} />
  </>
);
