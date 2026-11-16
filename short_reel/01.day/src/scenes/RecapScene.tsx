import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Card} from '../components/Card';
import {Reveal, useBreath, useSpringAt} from '../components/Reveal';
import {alpha, bn, colors, ease, fonts, radius, shadow, springs} from '../theme';
import {WORDS} from '../data/script';
import {RECAP} from '../timing';

const GRID_TOP = 452;
const CARD_H = 180;
const GAP = 22;

const RecapCard: React.FC<{i: number}> = ({i}) => {
  const frame = useCurrentFrame();
  const w = WORDS[i];
  const col = i % 2;
  const row = Math.floor(i / 2);
  const tick = interpolate(frame, [RECAP.ticks + i * 3, RECAP.ticks + i * 3 + 9], [0, 1], {
    easing: ease.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dot = useSpringAt(RECAP.ticks + i * 3, springs.bounce);
  return (
    <Reveal
      at={RECAP.cards + i * 3}
      y={50}
      scale={0.88}
      preset={springs.pop}
      style={{position: 'absolute', left: 50 + col * 500, top: GRID_TOP + row * (CARD_H + GAP), width: 480, height: CARD_H}}
    >
      <Card r={44} style={{width: 480, height: CARD_H}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, height: CARD_H, padding: '0 26px'}}>
          <div
            style={{
              flexShrink: 0,
              width: 66,
              height: 66,
              borderRadius: 66,
              background: tick > 0 ? colors.hero : colors.heroSoft,
              transform: `scale(${0.85 + 0.15 * dot})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width={40} height={40} viewBox="0 0 40 40" fill="none">
              <path
                d="M 8 21 L 17 30 L 33 11"
                stroke={tick > 0 ? colors.bg : alpha(colors.hero, 0.5)}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={40}
                strokeDashoffset={tick > 0 ? 40 * (1 - tick) : 0}
              />
            </svg>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0}}>
            <span
              style={{
                direction: 'rtl',
                unicodeBidi: 'isolate',
                whiteSpace: 'nowrap',
                fontFamily: fonts.stack,
                fontWeight: fonts.arabicWeight,
                fontSize: 58,
                lineHeight: 1.3,
                letterSpacing: 0,
                color: colors.text,
              }}
            >
              {w.ar}
            </span>
            <span
              style={{
                whiteSpace: 'nowrap',
                fontFamily: fonts.stack,
                fontWeight: fonts.bodyWeight,
                fontSize: 31,
                lineHeight: 1.3,
                letterSpacing: 0,
                color: colors.textDim,
              }}
            >
              {w.bnShort}
            </span>
          </div>
        </div>
      </Card>
    </Reveal>
  );
};

export const RecapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const count = Math.round(
    interpolate(frame, [RECAP.header, RECAP.header + 24], [0, WORDS.length], {
      easing: ease.out,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  const pulse = 1 + useBreath(0.018, 2);

  return (
    <AbsoluteFill>
      <Reveal at={RECAP.header} y={-40} scale={0.85} preset={springs.bounce} style={{position: 'absolute', top: 262, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div style={{fontFamily: fonts.stack, fontWeight: fonts.displayWeight, fontSize: 120, lineHeight: 1.3, color: colors.text, letterSpacing: 0, whiteSpace: 'nowrap'}}>
          <span style={{color: colors.hero}}>{bn(count)}</span>টি শব্দ
        </div>
      </Reveal>

      {WORDS.map((_, i) => (
        <RecapCard key={i} i={i} />
      ))}

      <Reveal at={RECAP.cta} y={50} scale={0.7} preset={springs.bounce} style={{position: 'absolute', top: 1474, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            transform: `scale(${pulse})`,
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            padding: '16px 56px',
            borderRadius: radius.pill,
            background: `linear-gradient(160deg, ${colors.hero}, ${colors.heroDeep})`,
            boxShadow: shadow.hero,
            color: colors.bg,
            fontFamily: fonts.stack,
            fontSize: 48,
            lineHeight: 1.3,
            letterSpacing: 0,
          }}
        >
          <span style={{fontWeight: fonts.displayWeight}}>Arabic Master</span>
          <span style={{width: 14, height: 14, borderRadius: 14, background: colors.accent}} />
          <span style={{fontWeight: fonts.bodyWeight}}>ফলো করুন</span>
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};
