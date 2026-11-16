import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Ar, Meaning, Reveal, Translit, useBreath} from '../components/Reveal';
import {Card} from '../components/Card';
import {alpha, colors, ease, fonts, springs} from '../theme';
import {PRAISE_SECOND_LINE, WORDS} from '../data/script';
import {cueIn, sceneById} from '../timing';

export const PraiseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = sceneById('praise');
  const at = cueIn(9, scene);
  const w = WORDS[9];
  const spin = frame * 0.35;
  const breathe = 1 + useBreath(0.012, 3.6);
  const sweep = interpolate(frame, [at + 12, at + 28], [0, 1], {
    easing: ease.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <Reveal at={at - 4} y={110} scale={0.9} preset={springs.soft} style={{position: 'absolute', left: 60, top: 330, width: 960, height: 1050, transform: undefined}}>
        <div style={{transform: `scale(${breathe})`}}>
          <Card variant="hero" r={76} style={{width: 960, height: 1050}}>
            {/* calm concentric ornament + glow */}
            <svg width={960} height={1050} style={{position: 'absolute', left: 0, top: 0}}>
              <defs>
                <radialGradient id="glow">
                  <stop offset="0%" stopColor={colors.accent} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={colors.accent} stopOpacity={0} />
                </radialGradient>
              </defs>
              <circle cx={800} cy={170} r={260} fill="url(#glow)" />
              <g transform={`translate(780 950) rotate(${spin})`}>
                {[150, 230, 310, 390].map((r, i) => (
                  <circle key={r} r={r} fill="none" stroke={alpha(colors.bg, 0.16 - i * 0.025)} strokeWidth={4} strokeDasharray={i % 2 ? '2 18' : undefined} />
                ))}
              </g>
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <div style={{position: 'relative'}}>
                <Ar text={w.ar} size={160} at={at} color={colors.bg} stack />
                <div
                  style={{
                    position: 'absolute',
                    right: '18%',
                    bottom: 20,
                    height: 14,
                    width: `${sweep * 64}%`,
                    borderRadius: 10,
                    background: colors.accent,
                  }}
                />
              </div>
              <div style={{height: 18}} />
              <Translit text={w.tr} at={at + 6} size={76} onHero />
              <div style={{height: 10}} />
              <Meaning text={w.bn} at={at + 10} size={80} color={colors.bg} />
              <Meaning text={PRAISE_SECOND_LINE} at={at + 20} size={50} color={colors.bg} />
            </div>
          </Card>
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};
