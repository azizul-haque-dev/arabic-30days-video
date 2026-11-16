import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {alpha, bn, colors, ease, fonts, springs} from '../theme';
import {cues, LEAD, WIDTH} from '../timing';

const starts = cues.map((c) => c.startF - LEAD);
const DOT = 22;
const ACTIVE = 64;

/** persistent progress HUD: rolling counter "০৩ / ১০" + 10 progress dots */
export const Hud: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = starts.filter((s) => s <= frame).length;
  if (n === 0) return null;

  const sp = (i: number) =>
    i >= starts.length ? 0 : spring({frame: frame - starts[i], fps, config: springs.crisp});
  const since = sp(n - 1);
  const intro = interpolate(frame - starts[0], [0, 12], [0, 1], {
    easing: ease.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const numStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'right',
    fontFamily: fonts.stack,
    fontWeight: fonts.displayWeight,
    fontSize: 46,
    lineHeight: '56px',
    color: colors.hero,
    letterSpacing: 0,
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 1548,
        width: WIDTH,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18,
        opacity: intro,
        transform: `translateY(${(1 - intro) * 20}px)`,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 10, height: 56}}>
        <div style={{position: 'relative', width: 64, height: 56, overflow: 'hidden'}}>
          {n > 1 && (
            <div style={{...numStyle, opacity: 1 - since, transform: `translateY(${-since * 30}px)`}}>{bn(n - 1)}</div>
          )}
          <div style={{...numStyle, opacity: since, transform: `translateY(${(1 - since) * 30}px)`}}>{bn(n)}</div>
        </div>
        <span
          style={{
            fontFamily: fonts.stack,
            fontWeight: fonts.bodyWeight,
            fontSize: 40,
            lineHeight: '56px',
            color: colors.textDim,
            letterSpacing: 0,
          }}
        >
          / {bn(cues.length)}
        </span>
      </div>
      <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
        {starts.map((_, i) => {
          const active = Math.max(0, Math.min(1, sp(i) - sp(i + 1)));
          const reached = i < n;
          return (
            <div
              key={i}
              style={{
                height: DOT,
                width: DOT + (ACTIVE - DOT) * active,
                borderRadius: 999,
                background: reached ? (active > 0.5 ? colors.hero : alpha(colors.hero, 0.55)) : alpha(colors.text, 0.16),
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
