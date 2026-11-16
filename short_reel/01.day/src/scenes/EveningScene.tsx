import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Card, WordFace} from '../components/Card';
import {Reveal, Tag, useBreath, useSpringAt} from '../components/Reveal';
import {alpha, colors, springs} from '../theme';
import {REPLY_LABEL} from '../data/script';
import {cueIn, sceneById} from '../timing';

// deterministic star field inside the 1000x420 night tile
const STARS = Array.from({length: 16}).map((_, i) => ({
  x: 60 + ((i * 137) % 880),
  y: 36 + ((i * 71) % 190),
  s: 10 + (i % 4) * 5,
}));

const Star: React.FC<{x: number; y: number; s: number; i: number; at: number}> = ({x, y, s, i, at}) => {
  const frame = useCurrentFrame();
  const p = useSpringAt(at + i * 3, springs.pop);
  const tw = 0.55 + 0.45 * Math.sin(frame * 0.12 + i * 1.7);
  return (
    <path
      d={`M ${x} ${y - s} Q ${x} ${y} ${x + s} ${y} Q ${x} ${y} ${x} ${y + s} Q ${x} ${y} ${x - s} ${y} Q ${x} ${y} ${x} ${y - s} Z`}
      fill={colors.bg}
      opacity={tw * p}
      transform={`translate(${x} ${y}) scale(${p}) translate(${-x} ${-y})`}
    />
  );
};

const NightTile: React.FC<{at: number}> = ({at}) => {
  const rise = useSpringAt(at, springs.soft);
  const glow = 1 + useBreath(0.05, 2.8);
  return (
    <Card variant="hero" r={56} style={{width: 1000, height: 420}}>
      <svg width={1000} height={420} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <radialGradient id="moonGlow">
            <stop offset="0%" stopColor={colors.accent} stopOpacity={0.16} />
            <stop offset="100%" stopColor={colors.accent} stopOpacity={0} />
          </radialGradient>
          <mask id="crescent">
            <rect width={1000} height={420} fill="white" />
            <circle cx={640} cy={170} r={92} fill="black" />
          </mask>
        </defs>
        {STARS.map((s, i) => (
          <Star key={i} {...s} i={i} at={at + 4} />
        ))}
        <circle cx={590} cy={200} r={190 * glow} fill="url(#moonGlow)" opacity={rise} />
        <g transform={`translate(0 ${(1 - rise) * 110}) translate(590 200) scale(${0.7 + 0.3 * rise}) translate(-590 -200)`} opacity={rise}>
          <circle cx={590} cy={200} r={104} fill={colors.accent} mask="url(#crescent)" />
        </g>
        <path d="M 0 420 L 0 330 Q 220 262 470 336 T 1000 316 L 1000 420 Z" fill={alpha(colors.text, 0.28)} />
        <path d="M 0 420 L 0 372 Q 300 330 560 378 T 1000 360 L 1000 420 Z" fill={alpha(colors.text, 0.38)} />
      </svg>
    </Card>
  );
};

export const EveningScene: React.FC = () => {
  const scene = sceneById('evening');
  const a = cueIn(5, scene);
  const b = cueIn(6, scene);
  const floatA = useBreath(6, 3.1);
  const floatB = useBreath(6, 3.1, Math.PI);

  return (
    <AbsoluteFill>
      {/* bento: banner + two tall tiles */}
      <Reveal at={a - 4} y={-90} scale={0.92} preset={springs.soft} style={{position: 'absolute', left: 40, top: 290}}>
        <NightTile at={a - 2} />
      </Reveal>

      <Reveal at={a - 3} x={-120} y={90} scale={0.9} preset={springs.soft} style={{position: 'absolute', left: 40, top: 740 + floatA, width: 490, height: 690}}>
        <Card r={56} style={{width: 490, height: 690}}>
          <div style={{height: 690, padding: '0 24px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <WordFace k={5} scene={scene} arSize={105} stack trSize={54} bnSize={52} gap={4} />
          </div>
        </Card>
      </Reveal>

      <Reveal at={b - 3} x={120} y={90} scale={0.9} preset={springs.soft} style={{position: 'absolute', left: 550, top: 740 + floatB, width: 490, height: 690}}>
        <Card variant="hero" r={56} style={{width: 490, height: 690}}>
          <div style={{height: 690, padding: '0 24px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <WordFace k={6} scene={scene} arSize={105} stack trSize={54} bnSize={52} gap={4} onHero />
          </div>
        </Card>
        <div style={{position: 'absolute', right: 28, top: -26}}>
          <Tag text={REPLY_LABEL} at={b + 4} size={34} />
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};
