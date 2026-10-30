import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';

const c = theme.colors;
type SpringCfg = {damping: number; stiffness: number; mass: number};

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const toBn = (n: number | string) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);

/** spring প্রবেশ (০→১); start-এর আগে ০ */
export const useEnter = (start: number, cfg: SpringCfg = theme.springs.soft) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < start) return 0;
  return spring({frame: f - start, fps, config: cfg});
};

/** দ্রুত এক্সিট (০→১), প্রবেশের চেয়ে ছোট সময় */
export const useExit = (at: number | undefined, dur: number = theme.motion.exit) => {
  const f = useCurrentFrame();
  if (at === undefined) return 0;
  return interpolate(f, [at, at + dur], [0, 1], {easing: theme.easings.in, ...clamp});
};

export const useBreathe = (period = 3.2, amp = 0.012, phase = 0) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return 1 + Math.sin((f / fps) * ((Math.PI * 2) / period) + phase) * amp;
};
export const useFloat = (period = 3.6, amp = 8, phase = 0) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return Math.sin((f / fps) * ((Math.PI * 2) / period) + phase) * amp;
};

/** opacity + translateY + scale একসাথে; এক্সিট দ্রুত */
export const Reveal: React.FC<{
  start: number;
  exitAt?: number;
  y?: number;
  x?: number;
  from?: number;
  cfg?: SpringCfg;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({start, exitAt, y = 36, x = 0, from = 0.9, cfg, style, children}) => {
  const p = useEnter(start, cfg);
  const ex = useExit(exitAt);
  const op = Math.min(1, p * 1.7) * (1 - ex);
  return (
    <div
      style={{
        opacity: op,
        transform: `translate(${(1 - p) * x}px, ${(1 - p) * y - ex * 16}px) scale(${(from + (1 - from) * p) * (1 - 0.03 * ex)})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

type TextProps = {
  text: string;
  start: number;
  size: number;
  weight?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
  stagger?: number;
  hi?: number[]; // হাইলাইট সুইপ হবে যে শব্দগুলোতে
  hiStart?: number;
  maxWidth?: number;
  lineHeight?: number;
  exitAt?: number;
  cfg?: SpringCfg;
  style?: React.CSSProperties;
};

/** ওয়ার্ড-বাই-ওয়ার্ড স্ট্যাগার্ড। শব্দ-বিভাজন শুধু স্পেসে; letterSpacing 0 */
export const WordStagger: React.FC<TextProps> = ({
  text, start, size, weight = 700, color = c.text, align = 'center', stagger = theme.motion.stagger,
  hi = [], hiStart, maxWidth, lineHeight = 1.32, exitAt, cfg, style,
}) => {
  const words = text.split(' ');
  return (
    <div
      style={{
        display: 'flex', flexWrap: 'wrap', columnGap: size * 0.26, rowGap: size * 0.04,
        justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        maxWidth, fontFamily: theme.fonts.family, fontWeight: weight, fontSize: size, lineHeight,
        color, letterSpacing: 0, ...style,
      }}
    >
      {words.map((w, i) => (
        <Word key={i} word={w} start={start + i * stagger} hi={hi.includes(i)} hiStart={(hiStart ?? start + words.length * stagger) + hi.indexOf(i) * 7} exitAt={exitAt === undefined ? undefined : exitAt + i} cfg={cfg} />
      ))}
    </div>
  );
};

const Word: React.FC<{word: string; start: number; hi: boolean; hiStart: number; exitAt?: number; cfg?: SpringCfg}> = ({word, start, hi, hiStart, exitAt, cfg}) => {
  const f = useCurrentFrame();
  const p = useEnter(start, cfg ?? theme.springs.pop);
  const ex = useExit(exitAt);
  const sweep = hi ? interpolate(f, [hiStart, hiStart + 14], [0, 1], {easing: theme.easings.out, ...clamp}) : 0;
  return (
    <span
      style={{
        display: 'inline-block',
        whiteSpace: 'nowrap',
        opacity: Math.min(1, p * 1.8) * (1 - ex),
        transform: `translateY(${(1 - p) * 26 - ex * 12}px) scale(${0.86 + 0.14 * p})`,
        backgroundImage: `linear-gradient(${c.accent}66, ${c.accent}66)`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0 88%',
        backgroundSize: `${sweep * 100}% 38%`,
        borderRadius: 8,
      }}
    >
      {word}
    </span>
  );
};

/** কারাওকে-স্টাইল: উচ্চারণের সময় শব্দ ধরে অ্যাকসেন্ট পিল। windows = প্রতিটি পুনরাবৃত্তির [শুরু, শেষ] */
export const Karaoke: React.FC<{
  text: string;
  windows: [number, number][];
  size: number;
  tone: 'hero' | 'light';
  start: number;
  align?: 'left' | 'center';
  maxWidth?: number;
}> = ({text, windows, size, tone, start, align = 'center', maxWidth}) => {
  const f = useCurrentFrame();
  const words = text.split(' ');
  const lens = words.map((w) => w.length + 1);
  const total = lens.reduce((a, b) => a + b, 0);
  const bounds: number[] = [];
  lens.reduce((acc, l) => { bounds.push(acc / total); return acc + l; }, 0);
  bounds.push(1);

  let w = -1;
  windows.forEach(([s], i) => { if (f >= s) w = i; });
  const base = tone === 'hero' ? c.white : c.text;

  return (
    <div
      style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : 'flex-start',
        columnGap: size * 0.2, rowGap: size * 0.02, maxWidth,
        fontFamily: theme.fonts.family, fontWeight: 700, fontSize: size, lineHeight: 1.3, letterSpacing: 0,
      }}
    >
      {words.map((word, i) => {
        const enter = useEnterRaw(f, start + i * 3);
        let state: 'idle' | 'future' | 'active' | 'past' = 'idle';
        let pill = 0;
        if (w >= 0) {
          const [s, e] = windows[w];
          const prog = (f - s) / Math.max(1, e - s);
          if (f > e) state = 'past';
          else if (prog < bounds[i]) state = 'future';
          else if (prog < bounds[i + 1]) state = 'active';
          else state = 'past';
          if (state === 'active') {
            const wf = f - (s + bounds[i] * (e - s));
            pill = interpolate(wf, [0, 4], [0, 1], {easing: theme.easings.out, ...clamp});
          }
        }
        const dim = state === 'idle' || state === 'future';
        return (
          <span
            key={i}
            style={{
              position: 'relative', display: 'inline-block', whiteSpace: 'nowrap', padding: '0 0.16em',
              opacity: Math.min(1, enter * 1.8),
              transform: `translateY(${(1 - enter) * 24}px) scale(${0.9 + 0.1 * enter})`,
            }}
          >
            <span
              style={{
                position: 'absolute', inset: '0.1em 0', borderRadius: '0.32em', background: c.accent,
                opacity: pill, transform: `scale(${0.82 + 0.18 * pill})`,
              }}
            />
            <span style={{position: 'relative', color: pill > 0.5 ? c.text : base, opacity: dim ? (tone === 'hero' ? 0.62 : 0.5) : 1}}>{word}</span>
          </span>
        );
      })}
    </div>
  );
};

const useEnterRaw = (f: number, start: number) => {
  const {fps} = useVideoConfig();
  if (f < start) return 0;
  return spring({frame: f - start, fps, config: theme.springs.pop});
};

/** অডিও-ইন্ডিকেটর বার: active থাকলে স্পন্দিত, না থাকলে শান্ত */
export const Waveform: React.FC<{bars?: number; width: number; height: number; color: string; active: [number, number][]}> = ({bars = 14, width, height, color, active}) => {
  const f = useCurrentFrame();
  const on = active.some(([s, e]) => f >= s && f <= e);
  const gap = width / bars;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{display: 'block'}}>
      {Array.from({length: bars}).map((_, i) => {
        const wave = 0.5 + 0.5 * Math.sin(f * 0.42 + i * 0.9) * Math.sin(f * 0.17 + i * 0.5);
        const h = on ? height * (0.22 + 0.78 * Math.abs(wave)) : height * 0.16;
        return <rect key={i} x={i * gap + gap * 0.2} y={(height - h) / 2} width={gap * 0.6} height={h} rx={gap * 0.3} fill={color} opacity={on ? 1 : 0.5} />;
      })}
    </svg>
  );
};

export const Pill: React.FC<{children: React.ReactNode; bg: string; color: string; size?: number; style?: React.CSSProperties}> = ({children, bg, color, size = 30, style}) => (
  <div
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 10, padding: `${size * 0.28}px ${size * 0.8}px`, borderRadius: theme.radius.pill,
      background: bg, color, fontFamily: theme.fonts.family, fontWeight: 700, fontSize: size, lineHeight: 1.2, letterSpacing: 0, ...style,
    }}
  >
    {children}
  </div>
);

/** সব সেন্টেন্স-সিনে একই হেডার: Sentence পিল + ১০টি ডট */
export const SentenceHeader: React.FC<{n: number; start: number; exitAt?: number}> = ({n, start, exitAt}) => (
  <Reveal start={start} exitAt={exitAt} y={-24} style={{position: 'absolute', left: 70, right: 70, top: 54, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
    <Pill bg={c.hero} color={c.white} size={30}>
      <span>Sentence</span>
      <span style={{background: c.white, color: c.heroDeep, borderRadius: 999, padding: '0 14px'}}>{String(n).padStart(2, '0')}</span>
    </Pill>
    <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
      {Array.from({length: 10}).map((_, i) => (
        <div
          key={i}
          style={{
            width: i + 1 === n ? 34 : 14, height: 14, borderRadius: 14,
            background: i + 1 === n ? c.hero : i + 1 < n ? c.heroSoft : 'transparent',
            border: `2.5px solid ${i + 1 <= n ? (i + 1 === n ? c.hero : c.heroSoft) : c.line}`,
          }}
        />
      ))}
    </div>
  </Reveal>
);

/** আইকন-মেডালিয়ন: সাদা গোলক + রিং + ভাসমান ছায়া */
export const Medallion: React.FC<{size: number; start: number; exitAt?: number; children: React.ReactNode; ring?: boolean; style?: React.CSSProperties}> = ({size, start, exitAt, children, ring = true, style}) => {
  const f = useCurrentFrame();
  const fl = useFloat(3.4, 7);
  const br = useBreathe(3, 0.018);
  const ringP = interpolate(f, [start + 4, start + 30], [0, 1], {easing: theme.easings.out, ...clamp});
  return (
    <Reveal start={start} exitAt={exitAt} cfg={theme.springs.pop} from={0.5} y={30} style={style}>
      <div style={{position: 'relative', width: size, height: size, transform: `translateY(${fl}px) scale(${br})`}}>
        {ring && (
          <div style={{position: 'absolute', inset: -size * 0.1 * ringP, borderRadius: '50%', border: `3px solid ${c.heroSoft}`, opacity: 1 - ringP * 0.4}} />
        )}
        <div
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: `radial-gradient(circle at 32% 24%, ${c.white}, ${c.heroTint} 78%)`,
            boxShadow: `${theme.shadow.soft}, 0 0 0 ${size * 0.035}px ${c.white}`,
          }}
        />
        <div style={{position: 'absolute', inset: size * 0.14}}>{children}</div>
      </div>
    </Reveal>
  );
};

export const Counter: React.FC<{to: number; start: number; dur?: number; bn?: boolean}> = ({to, start, dur = 30, bn = true}) => {
  const f = useCurrentFrame();
  const v = Math.round(interpolate(f, [start, start + dur], [0, to], {easing: theme.easings.out, ...clamp}));
  return <>{bn ? toBn(v) : v}</>;
};

export const cardStyle: React.CSSProperties = {
  background: c.glass,
  borderRadius: theme.radius.card,
  boxShadow: theme.shadow.card,
  border: `2px solid ${c.white}`,
};
