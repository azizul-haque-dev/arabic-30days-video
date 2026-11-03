import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { Thumbnail } from "./scenes/Thumbnail";
import { FPS, TOTAL_FRAMES } from "./timing";
import "./fonts";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Main"
        component={Main}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1080}
      />
      <Composition
        id="Thumbnail"
        component={Thumbnail}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1080}
      />
    </>
  );
};
