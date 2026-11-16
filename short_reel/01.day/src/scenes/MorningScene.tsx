import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Card, WordFace} from '../components/Card';
import {Reveal, Tag, useBreath, useSpringAt} from '../components/Reveal';
import {alpha, colors, ease, springs} from '../theme';
import {REPLY_LABEL} from '../data/script';
import {cueIn, sceneById, WIDTH} from '../timing';

const RAYS = 14;

const Sun: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const rise = useSpringAt(at, springs.soft);
  const breathe = 1 + useBreath(0.025, 3);
  const cx = WIDTH / 2;
  const cy = 340;
  const sunY = (1 - rise) * 190;
  return (
    <svg width={WIDTH} height={470} style={{position: 'absolute', left: 0, top: 260}}>
      <defs>
        <clipPath id="sky">
          <rect x={0} y={0} width={WIDTH} height={470} />
        </clipPath>
        <radialGradient id="sunGrad" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor={colors.accentSoft} />
          <stop offset="45%" stopColor={colors.accent} />
          <stop offset="100%" stopColor={colors.accent} />
        </radialGradient>
        <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.hero} />
          <stop offset="100%" stopColor={colors.heroDeep} />
        </linearGradient>
      </defs>
      <g clipPath="url(#sky)">
        <g transform={`translate(${cx} ${cy + sunY}) rotate(${frame * 0.5})`}>
          {Array.from({length: RAYS}).map((_, i) => {
            const p = useSpringAt(at + 6 + i * 2, springs.pop);
            const len = 60 * p;
            return (
              <line
                key={i}
                x1={0}
                y1={-150}
                x2={0}
                y2={-150 - len}
                stroke={colors.accent}
                strokeWidth={14}
                strokeLinecap="round"
                opacity={p}
                transform={`rotate(${(360 / RAYS) * i})`}
              />
            );
          })}
        </g>
        <circle cx={cx} cy={cy + sunY} r={112 * breathe} fill="url(#sunGrad)" />
        <path d={`M 40 470 A 500 112 0 0 1 ${WIDTH - 40} 470 Z`} fill="url(#hill)" />
      </g>
    </svg>
  );
};

export const MorningScene: React.FC = () => {
  const scene = sceneById('morning');
  const a = cueIn(3, scene);
  const b = cueIn(4, scene);
  const floatA = useBreath(6, 3.2);
  const floatB = useBreath(6, 3.2, Math.PI);
  const tail = interpolate(useSpringAt(b, springs.crisp), [0, 1], [0, 1]);

  return (
    <AbsoluteFill>
      <Sun at={a - 4} />

      {/* greeting bubble (left) */}
      <Reveal at={a - 3} x={-240} y={0} scale={0.85} preset={springs.soft} style={{position: 'absolute', left: 50, top: 760 + floatA, width: 800, height: 340}}>
        <Card r={56} style={{width: 800, height: 340}}>
          <div style={{padding: '14px 30px'}}>
            <WordFace k={3} scene={scene} arSize={95} trSize={58} bnSize={52} gap={0} />
          </div>
        </Card>
      </Reveal>

      {/* reply bubble (right) */}
      <Reveal at={b - 3} x={240} y={0} scale={0.85} preset={springs.soft} style={{position: 'absolute', left: 230, top: 1140 + floatB, width: 800, height: 340}}>
        <Card variant="hero" r={56} style={{width: 800, height: 340}}>
          <div style={{padding: '14px 30px'}}>
            <WordFace k={4} scene={scene} arSize={95} trSize={58} bnSize={52} gap={0} onHero />
          </div>
        </Card>
        <div style={{position: 'absolute', right: 40, top: -26, opacity: tail}}>
          <Tag text={REPLY_LABEL} at={b + 4} size={34} />
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};
