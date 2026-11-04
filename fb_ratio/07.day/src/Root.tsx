import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { Thumbnail } from "./scenes/Thumbnail";
import { loadFonts } from "./fonts";
import { FPS, H, W } from "./theme";
import { TOTAL } from "./timeline";

loadFonts();

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Main"
      component={Main}
      durationInFrames={TOTAL}
      fps={FPS}
      width={W}
      height={H}
    />
    <Composition
      id="Thumbnail"
      component={Thumbnail}
      durationInFrames={1}
      fps={FPS}
      width={W}
      height={H}
    />
  </>
);
