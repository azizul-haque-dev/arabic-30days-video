import React from 'react';
import {CalculateMetadataFunction, Composition, getRemotionEnvironment} from 'remotion';
import {Main, MainProps} from './Main';
import {loadFonts} from './fonts';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './timing';
import {findVoiceover, VOICEOVER_CANDIDATES} from './voiceover';

loadFonts();

const calculateMetadata: CalculateMetadataFunction<MainProps> = async () => {
  const voiceover = await findVoiceover();
  if (!voiceover && getRemotionEnvironment().isRendering) {
    // Audio is mandatory in a final render: never silently ship a video without narration.
    throw new Error(
      `Voiceover file not found. Put one of [${VOICEOVER_CANDIDATES.join(', ')}] into the public/ folder before rendering.`,
    );
  }
  return {props: {voiceover}};
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Main"
    component={Main}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{voiceover: null} as MainProps}
    calculateMetadata={calculateMetadata}
  />
);
