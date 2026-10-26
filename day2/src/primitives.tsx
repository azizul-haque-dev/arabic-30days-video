import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from './theme';

export const toBn = (n: number | string) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Entrance: opacity + translate + scale together, spring based.
export const Pop: React.FC<{
  delay?: number; x?: number; y?: number; from?: number;
  preset?: keyof typeof theme.spring; style?: React.CSSProperties; children?: React.ReactNode;
}> = ({delay = 0, x = 0, y = 40, from = 0.94, preset = 'smooth', style, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: theme.spring[preset]});
  return (
    <div style={{
      opacity: Math.min(1, Math.max(0, p * 1.4)),
      transform: `translate(${interpolate(p, [0, 1], [x, 0])}px, ${interpolate(p, [0, 1], [y, 0])}px) scale(${interpolate(p, [0, 1], [from, 1])})`,
      ...style,
    }}>{children}</div>
  );
};

// Word-by-word stagger. Splits on SPACES only (never inside Bengali clusters).
export const WordReveal: React.FC<{
  text: string; delay?: number; per?: number; size: number; weight?: number; color?: string;
  justify?: 'center' | 'flex-start' | 'flex-end'; gapX?: number; lineHeight?: number;
  hi?: number[]; hiColor?: string; maxWidth?: number;
}> = ({text, delay = 0, per = 4, size, weight = theme.weight.title, color = theme.colors.text,
  justify = 'center', gapX = 22, lineHeight = 1.28, hi = [], hiColor = theme.colors.primary, maxWidth}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: justify, columnGap: gapX, rowGap: 4, maxWidth}}>
      {text.split(' ').map((w, i) => {
        const p = spring({frame: frame - delay - i * per, fps, config: theme.spring.snappy});
        return (
          <span key={i} style={{
            display: 'inline-block', fontFamily: theme.fonts.display, fontWeight: weight, fontSize: size,
            lineHeight, letterSpacing: 0, color: hi.includes(i) ? hiColor : color,
            opacity: Math.min(1, Math.max(0, p * 1.3)),
            transform: `translateY(${interpolate(p, [0, 1], [34, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
          }}>{w}</span>
        );
      })}
    </div>
  );
};

// Left-to-right mask sweep (safe for Bengali: reveals, never splits glyphs).
export const MaskSweep: React.FC<{delay?: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties}> =
({delay = 0, dur = 18, children, style}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, dur], [0, 1], {easing: theme.ease.out, ...clamp});
  return (
    <div style={{
      clipPath: `inset(-10% ${(1 - p) * 100}% -10% 0)`,
      opacity: p > 0 ? 1 : 0,
      transform: `translateX(${interpolate(p, [0, 1], [-24, 0])}px)`, ...style,
    }}>{children}</div>
  );
};

export const Sweep: React.FC<{delay?: number; dur?: number; height?: number; color?: string; width?: number | string; radius?: number}> =
({delay = 0, dur = 22, height = 12, color = theme.colors.primary, width = '100%', radius = 8}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, dur], [0, 1], {easing: theme.ease.out, ...clamp});
  return <div style={{height, width: typeof width === 'number' ? width : width, borderRadius: radius, background: color,
    transformOrigin: '0 50%', transform: `scaleX(${p})`}}/>;
};

// Five-layer stack pieces
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 55) * 60, d2 = Math.cos(frame / 70) * 50;
  return (
    <AbsoluteFill style={{background: theme.colors.bg}}>
      <div style={{position: 'absolute', width: 1300, height: 1300, borderRadius: '50%', top: -520, left: -340 + d1,
        filter: 'blur(50px)', background: `radial-gradient(circle, ${theme.colors.primary}30, transparent 62%)`}}/>
      <div style={{position: 'absolute', width: 1000, height: 1000, borderRadius: '50%', bottom: -450, right: -280 - d2,
        filter: 'blur(70px)', background: `radial-gradient(circle, ${theme.colors.accent}28, transparent 65%)`}}/>
      <div style={{position: 'absolute', inset: 0, opacity: 0.5,
        backgroundImage: `radial-gradient(${theme.colors.line} 2px, transparent 2px)`, backgroundSize: '56px 56px'}}/>
    </AbsoluteFill>
  );
};
export const Grade: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill style={{backgroundColor: theme.colors.primary, mixBlendMode: 'soft-light', opacity: 0.1}}/>
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${theme.colors.shadow}12, transparent 28%, transparent 72%, ${theme.colors.shadow}18)`}}/>
  </AbsoluteFill>
);
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return <AbsoluteFill style={{pointerEvents: 'none', backgroundImage: noise, backgroundSize: '220px',
    backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`, opacity: 0.05, mixBlendMode: 'multiply'}}/>;
};
export const Vignette: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none',
    background: `radial-gradient(ellipse at center, transparent 58%, ${theme.colors.shadow}22 100%)`}}/>
);

// Scene wrapper: slide+fade in (spring), faster exit (8f)
export const SceneShell: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const enter = spring({frame, fps, config: theme.spring.smooth});
  const exitP = interpolate(frame, [durationInFrames - 8, durationInFrames - 1], [0, 1], {easing: theme.ease.in, ...clamp});
  return (
    <AbsoluteFill style={{
      opacity: Math.min(1, enter * 1.5) * (1 - exitP),
      transform: `translateX(${interpolate(enter, [0, 1], [90, 0]) - exitP * 80}px)`,
    }}>{children}</AbsoluteFill>
  );
};

// Hero-coloured sweep used on a few boundaries (cut hidden mid-sweep)
export const Wipe: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 14], [0, 1], {easing: theme.ease.inOut, ...clamp});
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: -100, bottom: -100, width: '130%', left: 0,
        background: theme.colors.primary, transform: `translateX(${interpolate(p, [0, 1], [-130, 100])}%) skewX(-12deg)`}}/>
    </AbsoluteFill>
  );
};

export const Dots3: React.FC<{color?: string; size?: number}> = ({color = theme.colors.textDim, size = 16}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: 'flex', gap: 12}}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{width: size, height: size, borderRadius: size, background: color,
          transform: `translateY(${Math.sin(frame / 4 - i * 0.9) * -8}px)`, opacity: 0.55 + 0.45 * Math.max(0, Math.sin(frame / 4 - i * 0.9))}}/>
      ))}
    </div>
  );
};
