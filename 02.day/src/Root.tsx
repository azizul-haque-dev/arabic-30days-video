import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { TOTAL } from "./lib/timeline";
import { VIDEO } from "./theme";

export const RemotionRoot: React.FC = () => (
  <Composition id="Main" component={Main} durationInFrames={TOTAL} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
);
