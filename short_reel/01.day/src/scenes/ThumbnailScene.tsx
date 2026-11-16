import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Reveal} from '../components/Reveal';
import {alpha, colors, fonts, radius, springs} from '../theme';
import {WORDS} from '../data/script';
import {HEIGHT, WIDTH} from '../timing';

export const ThumbnailScene: React.FC = () => {
  const frame = useCurrentFrame();
  const w = WORDS[0]; // مرحبا

  const sweep = interpolate(frame, [8, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      {/* Ripple circles */}
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', left: 0, top: 0}}>
        {[0, 1, 2].map((k) => {
          const delay = k * 6;
          const p = interpolate(frame - delay, [0, 30], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <circle
              key={k}
              cx={WIDTH / 2}
              cy={1040}
              r={210 + p * 350}
              fill="none"
              stroke={colors.hero}
              strokeWidth={5}
              opacity={Math.pow(1 - p, 1.6) * 0.25}
            />
          );
        })}
      </svg>

      <AbsoluteFill style={{alignItems: 'center', paddingTop: 240}}>
        {/* Brand pill */}
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
              boxShadow: `0 44px 80px -30px ${alpha(colors.heroDeep, 0.6)}`,
            }}
          >
            <span style={{width: 18, height: 18, borderRadius: 18, background: colors.accent}} />
            Arabic Master
          </div>
        </Reveal>

        <div style={{height: 24}} />

        {/* Greetings title */}
        <Reveal at={2} y={-60} scale={1.35} rotate={-5} preset={springs.bounce}>
          <div
            style={{
              fontFamily: fonts.stack,
              fontWeight: fonts.displayWeight,
              fontSize: 176,
              lineHeight: 1.2,
              color: colors.text,
              letterSpacing: -2,
            }}
          >
            Greetings
          </div>
        </Reveal>

        {/* Count row */}
        <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
          <Reveal at={6} y={40} scale={0.7} preset={springs.bounce}>
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
                  color: colors.hero,
                }}
              >
                ১০টি
              </span>
            </div>
          </Reveal>
          <Reveal at={10} y={40} scale={0.7} preset={springs.bounce}>
            <span
              style={{
                fontFamily: fonts.stack,
                fontWeight: fonts.displayWeight,
                fontSize: 124,
                lineHeight: 1.35,
                color: colors.text,
              }}
            >
              শব্দ
            </span>
          </Reveal>
        </div>

        <div style={{height: 18}} />

        {/* Arabic word */}
        <Reveal at={14} y={60} scale={0.7} preset={springs.bounce}>
          <div
            style={{
              fontFamily: fonts.stack,
              fontWeight: fonts.arabicWeight,
              fontSize: 180,
              lineHeight: 1.28,
              color: colors.text,
              direction: 'rtl',
              textShadow: `0 8px 30px ${alpha(colors.heroDeep, 0.12)}`,
            }}
          >
            {w.ar}
          </div>
        </Reveal>

        <div style={{height: 28}} />

        {/* Transliteration pill (Bangla pronunciation) */}
        <Reveal at={20} y={26} scale={0.85} preset={springs.crisp}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 18,
              padding: '12px 36px',
              borderRadius: radius.pill,
              background: colors.heroSoft,
              color: colors.hero,
              fontFamily: fonts.stack,
              fontWeight: fonts.bodyWeight,
              fontSize: 76,
              lineHeight: 1.2,
            }}
          >
            <svg width={52} height={52} viewBox="0 0 24 24" fill="none">
              <path d="M4 9v6h4l5 4V5L8 9H4z" fill={colors.hero} />
              <path
                d="M16 8.6a4.6 4.6 0 0 1 0 6.8"
                stroke={colors.hero}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M18.7 6a8.4 8.4 0 0 1 0 12"
                stroke={colors.hero}
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity={0.6}
              />
            </svg>
            {w.tr}
          </div>
        </Reveal>

        <div style={{height: 10}} />

        {/* Bengali meaning */}
        <Reveal at={24} y={30} scale={0.9} preset={springs.pop}>
          <div
            style={{
              fontFamily: fonts.stack,
              fontWeight: fonts.bodyWeight,
              fontSize: 72,
              lineHeight: 1.4,
              color: colors.text,
            }}
          >
            {w.bn}
          </div>
        </Reveal>
      </AbsoluteFill>

      {/* Bottom word chips */}
      <div
        style={{
          position: 'absolute',
          bottom: 200,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
          flexWrap: 'wrap',
          padding: '0 60px',
        }}
      >
        {[
          {text: WORDS[1].ar, green: true},
          {text: WORDS[3].ar, green: false},
          {text: WORDS[5].ar, green: true},
          {text: WORDS[7].ar, green: false},
          {text: WORDS[9].ar, green: true},
        ].map((chip, i) => (
          <Reveal key={i} at={30 + i * 3} y={20} scale={0.8} preset={springs.pop}>
            <div
              style={{
                padding: '10px 28px',
                borderRadius: radius.pill,
                fontFamily: fonts.stack,
                fontWeight: fonts.bodyWeight,
                fontSize: 38,
                lineHeight: 1.3,
                direction: 'rtl',
                background: chip.green ? alpha(colors.hero, 0.12) : alpha(colors.accent, 0.15),
                color: chip.green ? colors.hero : '#b47a08',
              }}
            >
              {chip.text}
            </div>
          </Reveal>
        ))}
      </div>
    </AbsoluteFill>
  );
};
