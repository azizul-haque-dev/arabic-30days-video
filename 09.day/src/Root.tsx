import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { Thumbnail } from "./scenes/Thumbnail";
import { FPS, TOTAL_FRAMES } from "./timing";
import { theme } from "./theme";

export const Root: React.FC = () => (
  <>
    <Composition
      id="Main"
      component={Main}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={theme.size.w}
      height={theme.size.h}
    />
    <Composition
      id="Thumbnail"
      component={Thumbnail}
      durationInFrames={1}
      fps={FPS}
      width={theme.size.w}
      height={theme.size.h}
    />
  </>
);
