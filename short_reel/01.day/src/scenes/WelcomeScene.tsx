import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Card, WordFace} from '../components/Card';
import {Reveal, useBreath} from '../components/Reveal';
import {alpha, bn, colors, fonts, radius, springs} from '../theme';
import {cueIn, sceneById} from '../timing';

const Badge: React.FC<{n: number}> = ({n}) => (
  <div
    style={{
      display: 'inline-block',
      padding: '6px 26px',
      borderRadius: radius.pill,
      background: colors.heroSoft,
      color: colors.hero,
      fontFamily: fonts.stack,
      fontWeight: fonts.displayWeight,
      fontSize: 38,
      lineHeight: 1.35,
      letterSpacing: 0,
    }}
  >
    {bn(n).padStart(2, '০')}
  </div>
);

export const WelcomeScene: React.FC = () => {
  const scene = sceneById('welcome');
  const a = cueIn(1, scene);
  const b = cueIn(2, scene);
  const floatA = useBreath(9, 3.4);
  const floatB = useBreath(9, 3.4, Math.PI);
  const spin = useBreath(1, 6);

  return (
    <AbsoluteFill>
      {/* depth: tilted plate + accent disc + ring behind the cards */}
      <Reveal at={a - 4} x={-200} y={0} scale={0.8} rotate={-14} preset={springs.soft} style={{position: 'absolute', left: 20, top: 300}}>
        <div
          style={{
            width: 760,
            height: 600,
            borderRadius: 72,
            background: `linear-gradient(160deg, ${colors.hero}, ${colors.heroDeep})`,
            transform: `rotate(${-6 + spin}deg)`,
            opacity: 0.92,
          }}
        />
      </Reveal>
      <Reveal at={b - 4} y={0} scale={0.3} preset={springs.bounce} style={{position: 'absolute', left: 975, top: 850}}>
        <div style={{width: 250, height: 250, borderRadius: 250, background: colors.accent}} />
      </Reveal>
      <Reveal at={b} y={0} scale={0.5} preset={springs.soft} style={{position: 'absolute', left: -60, top: 1380}}>
        <div style={{width: 210, height: 210, borderRadius: 210, border: `14px solid ${alpha(colors.hero, 0.35)}`}} />
      </Reveal>

      <Reveal at={a - 3} x={-260} y={0} scale={0.92} rotate={-4} preset={springs.soft} style={{position: 'absolute', left: 80, top: 285 + floatA, width: 800, height: 570}}>
        <Card style={{width: 800, height: 570}}>
          <div style={{padding: '34px 42px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
            <div style={{alignSelf: 'flex-start'}}>
              <Badge n={2} />
            </div>
            <WordFace k={1} scene={scene} arSize={130} trSize={68} bnSize={68} gap={2} />
          </div>
        </Card>
      </Reveal>

      <Reveal at={b - 3} x={260} y={0} scale={0.92} rotate={4} preset={springs.soft} style={{position: 'absolute', left: 200, top: 915 + floatB, width: 800, height: 570}}>
        <Card style={{width: 800, height: 570}}>
          <div style={{padding: '34px 42px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
            <div style={{alignSelf: 'flex-start'}}>
              <Badge n={3} />
            </div>
            <WordFace k={2} scene={scene} arSize={130} trSize={68} bnSize={68} gap={2} />
          </div>
        </Card>
      </Reveal>
    </AbsoluteFill>
  );
};
