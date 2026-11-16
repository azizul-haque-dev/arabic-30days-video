import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Card, WordFace} from '../components/Card';
import {Reveal, useBreath, useSpringAt} from '../components/Reveal';
import {alpha, colors, ease, fonts, shadow, springs} from '../theme';
import {cueIn, HEIGHT, sceneById, WIDTH} from '../timing';

const HUB_Y = 880;

const Spoke: React.FC<{y1: number; y2: number; at: number}> = ({y1, y2, at}) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [at, at + 14], [0, 1], {
    easing: ease.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const len = Math.abs(y2 - y1);
  const dir = Math.sign(y2 - y1);
  const t = ((frame - at) * 0.035) % 1;
  return (
    <>
      <line
        x1={WIDTH / 2}
        y1={y1}
        x2={WIDTH / 2}
        y2={y2}
        stroke={colors.hero}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - draw)}
      />
      {draw >= 1 && <circle cx={WIDTH / 2} cy={y1 + dir * len * t} r={11} fill={colors.accent} />}
    </>
  );
};

export const AskScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = sceneById('ask');
  const a = cueIn(7, scene);
  const b = cueIn(8, scene);
  const hubIn = useSpringAt(a - 2, springs.bounce);
  const pulse = 1 + useBreath(0.04, 2.2);
  const floatA = useBreath(6, 3.2);
  const floatB = useBreath(6, 3.2, Math.PI);

  return (
    <AbsoluteFill>
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', left: 0, top: 0}}>
        <Spoke y1={HUB_Y - 100} y2={660} at={a + 2} />
        <Spoke y1={HUB_Y + 100} y2={1100} at={b} />
        <g
          transform={`translate(${WIDTH / 2} ${HUB_Y}) rotate(${frame * 0.8}) scale(${hubIn})`}
          opacity={hubIn}
        >
          <circle r={150} fill="none" stroke={alpha(colors.accent, 0.9)} strokeWidth={6} strokeDasharray="4 22" strokeLinecap="round" />
        </g>
      </svg>

      <Reveal at={a - 3} y={-70} scale={0.88} preset={springs.soft} style={{position: 'absolute', left: 90, top: 270 + floatA, width: 900, height: 390}}>
        <Card r={56} style={{width: 900, height: 390}}>
          <div style={{padding: '22px 30px'}}>
            <WordFace k={7} scene={scene} arSize={105} trSize={58} bnSize={56} gap={2} />
          </div>
        </Card>
      </Reveal>

      <div
        style={{
          position: 'absolute',
          left: WIDTH / 2 - 105,
          top: HUB_Y - 105,
          width: 210,
          height: 210,
          borderRadius: 210,
          background: `linear-gradient(160deg, ${colors.hero}, ${colors.heroDeep})`,
          boxShadow: shadow.hero,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${hubIn * pulse})`,
          opacity: hubIn,
        }}
      >
        <span
          style={{
            fontFamily: fonts.stack,
            fontWeight: fonts.arabicWeight,
            fontSize: 150,
            lineHeight: 1.2,
            color: colors.bg,
            marginTop: 14,
          }}
        >
          ؟
        </span>
      </div>

      <Reveal at={b - 3} y={70} scale={0.88} preset={springs.soft} style={{position: 'absolute', left: 90, top: 1100 + floatB, width: 900, height: 390}}>
        <Card r={56} style={{width: 900, height: 390}}>
          <div style={{padding: '22px 30px'}}>
            <WordFace k={8} scene={scene} arSize={105} trSize={58} bnSize={56} gap={2} />
          </div>
        </Card>
      </Reveal>
    </AbsoluteFill>
  );
};
