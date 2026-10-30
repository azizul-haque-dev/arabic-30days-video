import React from 'react';
import {AbsoluteFill} from 'remotion';
import {theme} from '../theme';
import {useExit} from './primitives';

/** প্রতিটি সিনের মোড়ক: শেষ দিকে দ্রুত এক্সিট (ট্রানজিশনের আগে) */
export const SceneShell: React.FC<{dur: number; noExit?: boolean; children: React.ReactNode}> = ({dur, noExit, children}) => {
  const ex = useExit(noExit ? undefined : dur - 13, 9);
  return (
    <AbsoluteFill style={{fontFamily: theme.fonts.family, opacity: 1 - ex * 0.9, transform: `scale(${1 - 0.025 * ex}) translateY(${-14 * ex}px)`}}>
      {children}
    </AbsoluteFill>
  );
};
