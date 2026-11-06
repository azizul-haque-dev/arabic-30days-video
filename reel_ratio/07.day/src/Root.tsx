import React from "react";
import {Composition} from "remotion";
import {Day7} from "./Day7";
import {AUDIO_SECONDS} from "./timing";
import {FPS, H, W} from "./theme";

export const Root: React.FC = () => (
  <Composition id="Day7" component={Day7} durationInFrames={Math.ceil(AUDIO_SECONDS * FPS)} fps={FPS} width={W} height={H} />
);
