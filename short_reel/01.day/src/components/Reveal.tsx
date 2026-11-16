import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {alpha, bn, colors, fonts, motion, radius, springs} from '../theme';

type Preset = {damping?: number; stiffness?: number; mass?: number; overshootClamping?: boolean};

/** spring progress (0 -> 1) starting at local frame `at` */
export const useSpringAt = (at: number, config: Preset = springs.pop) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - at, fps, config});
};

/** idle micro-motion: smooth sine, period in seconds */
export const useBreath = (amp: number, periodSec = 3, phase = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return Math.sin((frame / fps) * ((Math.PI * 2) / periodSec) + phase) * amp;
};

type RevealProps = {
  at: number;
  x?: number;
  y?: number;
  scale?: number;
  rotate?: number;
  preset?: Preset;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/** entrance = opacity + translate + scale (+ optional rotate), never a lone fade */
export const Reveal: React.FC<RevealProps> = ({
  at,
  x = 0,
  y = 46,
  scale = 0.9,
  rotate = 0,
  preset = springs.pop,
  style,
  children,
}) => {
  const p = useSpringAt(at, preset);
  const opacity = interpolate(p, [0, 0.45], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const s = scale + (1 - scale) * p;
  return (
    <div
      style={{
        opacity,
        transform: `translate(${x * (1 - p)}px, ${y * (1 - p)}px) scale(${s}) rotate(${rotate * (1 - p)}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Arabic word(s): split on spaces only (never per letter), RTL, bounce-pop stagger */
export const Ar: React.FC<{
  text: string;
  size: number;
  at: number;
  color?: string;
  stack?: boolean;
}> = ({text, size, at, color = colors.text, stack = false}) => {
  const words = text.split(' ');
  const float = useBreath(size * 0.016, 3.2);
  return (
    <div
      style={{
        direction: 'rtl',
        display: 'flex',
        flexDirection: stack ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: Math.round(size * 0.24),
        rowGap: 0,
        transform: `translateY(${float}px)`,
      }}
    >
      {words.map((w, i) => (
        <Reveal key={i} at={at + i * motion.stagger} y={size * 0.28} scale={0.7} preset={springs.bounce}>
          <span
            style={{
              display: 'inline-block',
              fontFamily: fonts.stack,
              fontWeight: fonts.arabicWeight,
              fontSize: size,
              lineHeight: stack ? 1.12 : 1.28,
              letterSpacing: 0,
              color,
              unicodeBidi: 'isolate',
              whiteSpace: 'nowrap',
            }}
          >
            {w}
          </span>
        </Reveal>
      ))}
    </div>
  );
};

const Speaker: React.FC<{size: number; color: string}> = ({size, color}) => {
  const pulse = 0.55 + 0.45 * Math.abs(useBreath(1, 1.6));
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{flexShrink: 0}}>
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill={color} />
      <path d="M16 8.6a4.6 4.6 0 0 1 0 6.8" stroke={color} strokeWidth="2" strokeLinecap="round" opacity={pulse} />
      <path d="M18.7 6a8.4 8.4 0 0 1 0 12" stroke={color} strokeWidth="2" strokeLinecap="round" opacity={pulse * 0.8} />
    </svg>
  );
};

/** transliteration pill with a little speaker glyph */
export const Translit: React.FC<{text: string; at: number; size?: number; onHero?: boolean}> = ({
  text,
  at,
  size = 46,
  onHero = false,
}) => (
  <Reveal at={at} y={26} scale={0.85} preset={springs.crisp}>
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.3),
        padding: `${Math.round(size * 0.18)}px ${Math.round(size * 0.55)}px`,
        borderRadius: radius.pill,
        background: onHero ? alpha(colors.bg, 0.18) : colors.heroSoft,
        color: onHero ? colors.bg : colors.hero,
        fontFamily: fonts.stack,
        fontWeight: fonts.bodyWeight,
        fontSize: size,
        lineHeight: 1.2,
        letterSpacing: 0,
        whiteSpace: 'nowrap',
      }}
    >
      <Speaker size={Math.round(size * 0.82)} color={onHero ? colors.bg : colors.hero} />
      {text}
    </div>
  </Reveal>
);

/** Bengali text, word-by-word stagger (split on spaces only, letterSpacing 0) */
export const Meaning: React.FC<{
  text: string;
  at: number;
  size?: number;
  color?: string;
  align?: 'center' | 'flex-start';
}> = ({text, at, size = 72, color = colors.text, align = 'center'}) => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: align,
      columnGap: Math.round(size * 0.26),
      rowGap: 0,
    }}
  >
    {text.split(' ').map((w, i) => (
      <Reveal key={i} at={at + i * motion.stagger} y={30} scale={0.9} preset={springs.pop}>
        <span
          style={{
            display: 'inline-block',
            fontFamily: fonts.stack,
            fontWeight: fonts.bodyWeight,
            fontSize: size,
            lineHeight: 1.4,
            letterSpacing: 0,
            color,
            whiteSpace: 'nowrap',
          }}
        >
          {w}
        </span>
      </Reveal>
    ))}
  </div>
);

/** small accent tag (e.g. "উত্তর") */
export const Tag: React.FC<{text: string; at: number; size?: number}> = ({text, at, size = 36}) => (
  <Reveal at={at} y={18} scale={0.6} preset={springs.bounce}>
    <div
      style={{
        display: 'inline-block',
        padding: `${Math.round(size * 0.16)}px ${Math.round(size * 0.6)}px`,
        borderRadius: radius.pill,
        background: colors.accent,
        color: colors.text,
        fontFamily: fonts.stack,
        fontWeight: fonts.bodyWeight,
        fontSize: size,
        lineHeight: 1.3,
        letterSpacing: 0,
      }}
    >
      {text}
    </div>
  </Reveal>
);

export const BnNumber: React.FC<{n: number}> = ({n}) => <>{bn(n)}</>;
