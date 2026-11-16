import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ease, motion} from '../theme';

/** quick exit (8 frames) that hides behind the incoming wipe */
export const SceneShell: React.FC<{exit?: boolean; children: React.ReactNode}> = ({exit = true, children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const out = exit
    ? interpolate(frame, [durationInFrames - motion.exitFrames, durationInFrames], [0, 1], {
        easing: ease.in,
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;
  return (
    <AbsoluteFill
      style={{opacity: 1 - out * 0.9, transform: `translateX(${-out * 70}px) scale(${1 - out * 0.04})`}}
    >
      {children}
    </AbsoluteFill>
  );
};
