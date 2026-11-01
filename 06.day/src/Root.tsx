import React from 'react';
import {Composition} from 'remotion';
import {FPS, HEIGHT, WIDTH} from './config';
import {TOTAL_FRAMES} from './timing';
import {Main} from './Main';
import {Thumbnail} from './scenes/Thumbnail';

export const Root: React.FC = () => (
  <>
    <Composition
      id="Main"
      component={Main}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="Thumbnail"
      component={Thumbnail}
      durationInFrames={1}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);
