import React from "react";
import {Composition} from "remotion";
import {Episode} from "./Episode";
import {FPS, HEIGHT, WIDTH} from "./theme";
import {DURATION} from "./timing";

export const RemotionRoot: React.FC = () => (
  <Composition id="ArabicMasterEp07" component={Episode} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
);
