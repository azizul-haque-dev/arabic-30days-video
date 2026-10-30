import React from 'react';
import {Audio, cancelRender, Sequence, staticFile} from 'remotion';
import {theme} from '../theme';

export type SfxName = 'pop' | 'whoosh' | 'click' | 'chime' | 'thud';

/** at = সিন-লোকাল ফ্রেম। Studio প্রিভিউ ও রেন্ডার—দুই জায়গাতেই বাজে। */
export const Sfx: React.FC<{at: number; name: SfxName; volume?: number; rate?: number}> = ({at, name, volume, rate = 1}) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={30} layout="none">
    <Audio
      src={staticFile(`sfx/${name}.wav`)}
      volume={volume ?? theme.sfx[name]}
      playbackRate={rate}
      onError={() => {
        cancelRender(new Error(`[SFX Error] Required sound effect "public/sfx/${name}.wav" failed to load or play.`));
      }}
    />
  </Sequence>
);
