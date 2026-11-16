import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, ease} from '../theme';
import {HEIGHT, WIDTH, WIPE_HALF} from '../timing';

const PANEL_W = 1700;
const SKEW = 10;

/** One skewed wipe (accent edge leads, hero panel follows). Centered on the scene boundary. */
export const Wipe: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const dur = WIPE_HALF * 2;
  const panel = (delay: number) => {
    const p = interpolate(frame - delay, [0, dur], [0, 1], {
      easing: ease.inOut,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return -PANEL_W - 200 + p * (WIDTH + PANEL_W + 400);
  };
  if (frame >= durationInFrames) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          top: -100,
          height: HEIGHT + 200,
          width: PANEL_W,
          left: panel(0),
          background: colors.accent,
          transform: `skewX(-${SKEW}deg)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: -100,
          height: HEIGHT + 200,
          width: PANEL_W,
          left: panel(3),
          background: `linear-gradient(180deg, ${colors.hero}, ${colors.heroDeep})`,
          transform: `skewX(-${SKEW}deg)`,
        }}
      />
    </AbsoluteFill>
  );
};
