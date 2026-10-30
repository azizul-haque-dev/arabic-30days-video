import React from 'react';
import {Composition} from 'remotion';
import {FPS, HEIGHT, WIDTH} from './config';
import {TOTAL_FRAMES} from './timing';
import {Main} from './Main';

export const Root: React.FC = () => (
  <Composition id="Main" component={Main} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
);
