import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {alpha, colors} from '../theme';

/** layer 1: animated mint mesh + faint dot grid (never a flat background) */
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const dx = Math.sin(t * 0.5) * 60;
  const dy = Math.cos(t * 0.4) * 70;
  return (
    <AbsoluteFill style={{background: colors.bg}}>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(900px 900px at ${860 + dx}px ${260 + dy}px, ${alpha(colors.hero, 0.2)}, transparent 70%)`,
            `radial-gradient(1000px 1000px at ${140 - dx}px ${1560 - dy}px, ${alpha(colors.accent, 0.17)}, transparent 70%)`,
            `radial-gradient(900px 900px at ${220 + dy}px ${760 + dx}px, ${alpha(colors.hero, 0.1)}, transparent 70%)`,
          ].join(','),
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${alpha(colors.hero, 0.16)} 2.5px, transparent 3px)`,
          backgroundSize: '54px 54px',
          backgroundPosition: `${(t * 6) % 54}px ${(t * 6) % 54}px`,
          opacity: 0.55,
        }}
      />
    </AbsoluteFill>
  );
};

/** layer 4: subtle colour grade (warm top, minty bottom) */
export const Grade: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, ${alpha(colors.accent, 0.035)} 0%, transparent 40%, ${alpha(colors.hero, 0.04)} 100%)`,
      pointerEvents: 'none',
    }}
  />
);

const noiseSvg = encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
);

/** layer 5a: film grain, jittered every 2 frames */
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const k = Math.floor(frame / 2);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("data:image/svg+xml,${noiseSvg}")`,
        backgroundSize: '256px 256px',
        backgroundPosition: `${(k * 97) % 256}px ${(k * 53) % 256}px`,
        opacity: 0.16,
        mixBlendMode: 'soft-light',
        pointerEvents: 'none',
      }}
    />
  );
};

/** layer 5b: soft vignette */
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 75% 62% at 50% 50%, transparent 60%, ${alpha(colors.hero, 0.1)} 100%)`,
      pointerEvents: 'none',
    }}
  />
);
