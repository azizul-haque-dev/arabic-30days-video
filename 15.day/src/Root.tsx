import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { DURATION, FPS } from "./data";

export const Root: React.FC = () => (
  <Composition id="Day15" component={Main} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
);
