import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Ar, Reveal, Translit, Meaning} from '../components/Reveal';
import {alpha, colors, ease, fonts, radius, springs} from '../theme';
import {WORDS} from '../data/script';
import {cueIn, HEIGHT, sceneById, WIDTH} from '../timing';

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = sceneById('hook');
  const at = cueIn(0, scene);
  const w = WORDS[0];
  const sweep = interpolate(frame, [10, 26], [0, 1], {
    easing: ease.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      {/* greeting ripples: motion from frame 2 */}
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', left: 0, top: 0}}>
        {[0, 1, 2].map((k) => {
          const f = frame - 2 - k * 28;
          const p = f < 0 ? 0 : (f % 84) / 84;
          return (
            <circle
              key={k}
              cx={WIDTH / 2}
              cy={1040}
              r={150 + p * 430}
              fill="none"
              stroke={colors.hero}
              strokeWidth={5}
              opacity={f < 0 ? 0 : Math.pow(1 - p, 1.6) * 0.4}
            />
          );
        })}
      </svg>

      <AbsoluteFill style={{alignItems: 'center', paddingTop: 300}}>
        <Reveal at={0} y={-30} scale={0.8} preset={springs.crisp}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '14px 42px',
              borderRadius: radius.pill,
              background: colors.hero,
              color: colors.bg,
              fontFamily: fonts.stack,
              fontWeight: fonts.displayWeight,
              fontSize: 44,
              lineHeight: 1.3,
              letterSpacing: 0,
            }}
          >
            <span style={{width: 18, height: 18, borderRadius: 18, background: colors.accent}} />
            Arabic Master
          </div>
        </Reveal>

        <div style={{height: 20}} />
        <Reveal at={3} y={-60} scale={1.35} rotate={-5} preset={springs.bounce}>
          <div
            style={{
              fontFamily: fonts.stack,
              fontWeight: fonts.displayWeight,
              fontSize: 176,
              lineHeight: 1.25,
              letterSpacing: 0,
              color: colors.text,
            }}
          >
            Greetings
          </div>
        </Reveal>

        <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
          <Reveal at={8} y={40} scale={0.7} preset={springs.bounce}>
            <div style={{position: 'relative', padding: '0 10px'}}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 22,
                  height: 44,
                  width: `${sweep * 100}%`,
                  background: alpha(colors.accent, 0.6),
                  borderRadius: 14,
                }}
              />
              <span
                style={{
                  position: 'relative',
                  fontFamily: fonts.stack,
                  fontWeight: fonts.displayWeight,
                  fontSize: 124,
                  lineHeight: 1.35,
                  letterSpacing: 0,
                  color: colors.hero,
                }}
              >
                ১০টি
              </span>
            </div>
          </Reveal>
          <Reveal at={12} y={40} scale={0.7} preset={springs.bounce}>
            <span
              style={{
                fontFamily: fonts.stack,
                fontWeight: fonts.displayWeight,
                fontSize: 124,
                lineHeight: 1.35,
                letterSpacing: 0,
                color: colors.text,
              }}
            >
              শব্দ
            </span>
          </Reveal>
        </div>

        <div style={{height: 14}} />
        <Ar text={w.ar} size={180} at={at} />
        <div style={{height: 28}} />
        <Translit text={w.tr} at={at + 6} size={76} />
        <div style={{height: 6}} />
        <Meaning text={w.bn} at={at + 10} size={72} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
