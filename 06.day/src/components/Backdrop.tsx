import React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';

const c = theme.colors;

/** স্তর ১: ব্যাকগ্রাউন্ড মেশ (গ্লোবাল, সিনের মাঝে ছিঁড়ে যায় না) */
export const BgMesh: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = f / fps;
  const blob = (x: number, y: number, r: number, col: string, a: number, px: number, py: number) => (
    <div
      style={{
        position: 'absolute',
        left: x + Math.sin(t * px) * 70 - r,
        top: y + Math.cos(t * py) * 60 - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${col} 0%, transparent 68%)`,
        opacity: a,
      }}
    />
  );
  return (
    <AbsoluteFill style={{background: c.bg, overflow: 'hidden'}}>
      {blob(width * 0.15, height * 0.12, 520, c.heroSoft, 0.95, 0.35, 0.28)}
      {blob(width * 0.9, height * 0.35, 460, c.accentSoft, 0.55, 0.26, 0.32)}
      {blob(width * 0.2, height * 0.92, 520, c.heroSoft, 0.8, 0.3, 0.24)}
      {blob(width * 0.85, height * 0.95, 400, c.white, 0.9, 0.22, 0.3)}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${c.line} 2.2px, transparent 2.4px)`,
          backgroundSize: '54px 54px',
          opacity: 0.45,
        }}
      />
    </AbsoluteFill>
  );
};

/** স্তর ৪–৫: কালার গ্রেড + গ্রেইন + ভিনিয়েট (সবার উপরে) */
export const FinishLayers: React.FC = () => {
  const f = useCurrentFrame();
  const jx = ((f * 73) % 256) | 0;
  const jy = ((f * 151) % 256) | 0;
  return (
    <>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 18% 12%, rgba(245,158,11,0.07), transparent 52%), linear-gradient(180deg, rgba(14,159,110,0.02), rgba(16,35,29,0.0))`,
          pointerEvents: 'none',
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile('grain.png')})`,
          backgroundSize: '256px 256px',
          backgroundPosition: `${jx}px ${jy}px`,
          opacity: 0.05,
          mixBlendMode: 'soft-light',
          pointerEvents: 'none',
        }}
      />
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, transparent 66%, rgba(16,35,29,0.07) 100%)',
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

/** সিন ট্রানজিশন: অ্যাকসেন্ট-ধারযুক্ত হিরো প্যানেল সুইপ (বাউন্ডারিতে ঠিক মাঝখানে ঢেকে যায়) */
export const Wipe: React.FC<{at: number; dir: 1 | -1}> = ({at, dir}) => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const W = width * 1.55;
  const run = (delay: number) => {
    const inP = interpolate(f, [at - 9 + delay, at + delay], [0, 1], {easing: theme.easings.inOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const outP = interpolate(f, [at + delay, at + 9 + delay], [0, 1], {easing: theme.easings.inOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    return -W + inP * W + outP * W; // -W → 0 → +W
  };
  if (f < at - 10 || f > at + 14) return null;
  const panel = (x: number, bg: string) => (
    <div
      style={{
        position: 'absolute',
        top: -20,
        left: 0,
        width: W,
        height: height + 40,
        borderRadius: 480,
        background: bg,
        transform: `translateX(${dir * x + (dir === -1 ? width - W : 0)}px)`,
      }}
    />
  );
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      {panel(run(-3), c.accent)}
      {panel(run(0), `linear-gradient(135deg, ${c.hero}, ${c.heroDeep})`)}
    </AbsoluteFill>
  );
};
