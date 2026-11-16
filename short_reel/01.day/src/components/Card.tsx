import React from 'react';
import {alpha, colors, radius, shadow} from '../theme';
import {Ar, Meaning, Reveal, Translit} from './Reveal';
import {WORDS} from '../data/script';
import {cueIn, Scene} from '../timing';

type CardProps = {
  variant?: 'glass' | 'hero';
  r?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/** glossy UI card: soft gradient, inner highlight, layered shadow */
export const Card: React.FC<CardProps> = ({variant = 'glass', r = radius.card, style, children}) => {
  const hero = variant === 'hero';
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: r,
        background: hero
          ? `linear-gradient(165deg, ${colors.hero} 0%, ${colors.heroDeep} 130%)`
          : `linear-gradient(165deg, ${alpha(colors.surface, 0.98)}, ${alpha(colors.surface, 0.82)})`,
        border: `2px solid ${hero ? alpha(colors.bg, 0.25) : colors.surface}`,
        boxShadow: hero ? shadow.hero : shadow.card,
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${alpha(hero ? colors.bg : colors.surface, hero ? 0.16 : 0.9)} 0%, transparent 34%)`,
          pointerEvents: 'none',
        }}
      />
      <div style={{position: 'relative', width: '100%', height: '100%'}}>{children}</div>
    </div>
  );
};

/** Arabic + transliteration + Bengali meaning for one SRT cue */
export const WordFace: React.FC<{
  k: number;
  scene: Scene;
  arSize: number;
  stack?: boolean;
  trSize?: number;
  bnSize?: number;
  onHero?: boolean;
  gap?: number;
  short?: boolean;
}> = ({k, scene, arSize, stack, trSize = 44, bnSize = 70, onHero = false, gap = 8, short = false}) => {
  const w = WORDS[k];
  const at = cueIn(k, scene);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap}}>
      <Ar text={w.ar} size={arSize} at={at} stack={stack} color={onHero ? colors.bg : colors.text} />
      <div style={{height: Math.round(arSize * 0.1)}} />
      <Translit text={w.tr} at={at + 6} size={trSize} onHero={onHero} />
      <Meaning
        text={short ? w.bnShort : w.bn}
        at={at + 10}
        size={bnSize}
        color={onHero ? colors.bg : colors.text}
      />
    </div>
  );
};

export {Reveal};
