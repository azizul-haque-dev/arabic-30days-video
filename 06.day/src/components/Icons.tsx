import React from 'react';
import {theme} from '../theme';
import type {IconName} from '../data/content';

const c = theme.colors;
const S: React.CSSProperties = {width: '100%', height: '100%', display: 'block', overflow: 'visible'};
const ink = c.text;

// ফ্ল্যাট ভেক্টর আইকন, সব রং থিম থেকে। ক্যানভাস ২০০×২০০।
const icons: Record<IconName, React.ReactNode> = {
  plate: (
    <>
      <circle cx="100" cy="108" r="54" fill={c.white} />
      <circle cx="100" cy="108" r="54" fill="none" stroke={c.heroSoft} strokeWidth="6" />
      <circle cx="100" cy="108" r="35" fill={c.heroTint} />
      {/* কাঁটাচামচ */}
      <rect x="14" y="46" width="5" height="36" rx="2.5" fill={ink} />
      <rect x="24" y="46" width="5" height="36" rx="2.5" fill={ink} />
      <rect x="34" y="46" width="5" height="36" rx="2.5" fill={ink} />
      <rect x="14" y="76" width="25" height="12" rx="6" fill={ink} />
      <rect x="22" y="84" width="9" height="78" rx="4.5" fill={ink} />
      {/* ছুরি */}
      <path d="M170 44 C188 56 188 98 170 108 Z" fill={ink} />
      <rect x="166" y="100" width="9" height="62" rx="4.5" fill={ink} />
      <path d="M92 94 q8 -10 16 0 q-8 14 -16 0z" fill={c.accent} />
    </>
  ),
  water: (
    <>
      <path d="M52 34 H148 L136 168 Q135 180 123 180 H77 Q65 180 64 168 Z" fill={c.white} />
      <path d="M58 86 Q79 74 100 86 T142 86 L136 168 Q135 180 123 180 H77 Q65 180 64 168 Z" fill={c.hero} opacity="0.88" />
      <rect x="76" y="98" width="30" height="30" rx="8" fill={c.white} opacity="0.85" transform="rotate(-12 91 113)" />
      <rect x="106" y="114" width="25" height="25" rx="7" fill={c.white} opacity="0.7" transform="rotate(14 118 126)" />
      <path d="M52 34 H148" stroke={c.heroSoft} strokeWidth="8" strokeLinecap="round" />
      <path d="M170 38 l5 13 13 5 -13 5 -5 13 -5 -13 -13 -5 13 -5z" fill={c.accent} />
      <circle cx="32" cy="70" r="7" fill={c.heroSoft} />
      <circle cx="22" cy="96" r="4.5" fill={c.heroSoft} />
    </>
  ),
  breakfast: (
    <>
      <circle cx="100" cy="122" r="62" fill={c.white} />
      <circle cx="100" cy="122" r="62" fill="none" stroke={c.heroSoft} strokeWidth="6" />
      <path d="M58 122 C52 94 88 82 108 94 C134 84 154 108 144 132 C150 154 120 166 100 158 C78 168 52 150 58 122 Z" fill={c.heroTint} stroke={c.heroSoft} strokeWidth="3" />
      <circle cx="104" cy="122" r="22" fill={c.accent} />
      <circle cx="96" cy="113" r="6" fill={c.white} opacity="0.7" />
      <path d="M74 56 q-10 -14 0 -26 M100 52 q-10 -14 0 -26 M126 56 q-10 -14 0 -26" fill="none" stroke={c.muted} strokeWidth="6" strokeLinecap="round" opacity="0.55" />
    </>
  ),
  cloche: (
    <>
      <path d="M26 136 A74 74 0 0 1 174 136 Z" fill={c.hero} />
      <path d="M50 118 A54 54 0 0 1 82 78" fill="none" stroke={c.white} strokeWidth="7" strokeLinecap="round" opacity="0.6" />
      <circle cx="100" cy="52" r="11" fill={c.heroDeep} />
      <rect x="14" y="136" width="172" height="16" rx="8" fill={ink} />
      <path d="M170 44 l4 11 11 4 -11 4 -4 11 -4 -11 -11 -4 11 -4z" fill={c.accent} />
      <path d="M30 60 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" fill={c.accent} opacity="0.8" />
    </>
  ),
  bowl: (
    <>
      <path d="M34 112 H166 C166 152 136 178 100 178 C64 178 34 152 34 112 Z" fill={c.hero} />
      <path d="M46 100 C56 70 90 66 100 82 C112 66 146 72 154 100 Z" fill={c.accent} />
      <rect x="26" y="100" width="148" height="16" rx="8" fill={c.heroDeep} />
      <rect x="74" y="178" width="52" height="9" rx="4.5" fill={ink} />
      <path d="M100 52 c-18 -16 -34 4 -14 20 l14 12 14 -12 c20 -16 4 -36 -14 -20z" fill={c.hero} transform="translate(0,-26) scale(1)" opacity="0.95" />
      <path d="M52 66 q-8 -12 0 -22 M148 66 q8 -12 0 -22" fill="none" stroke={c.muted} strokeWidth="6" strokeLinecap="round" opacity="0.5" />
    </>
  ),
  yum: (
    <>
      <circle cx="100" cy="100" r="74" fill={c.accent} />
      <circle cx="56" cy="116" r="11" fill={c.white} opacity="0.4" />
      <circle cx="144" cy="116" r="11" fill={c.white} opacity="0.4" />
      <path d="M64 88 q12 -18 26 0" fill="none" stroke={ink} strokeWidth="8" strokeLinecap="round" />
      <path d="M110 88 q12 -18 26 0" fill="none" stroke={ink} strokeWidth="8" strokeLinecap="round" />
      <path d="M62 112 Q100 176 138 112 Z" fill={ink} />
      <path d="M82 144 Q100 128 118 144 Q100 166 82 144Z" fill={c.white} opacity="0.9" />
      <path d="M170 34 l4 11 11 4 -11 4 -4 11 -4 -11 -11 -4 11 -4z" fill={c.hero} />
      <path d="M26 46 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" fill={c.hero} opacity="0.8" />
    </>
  ),
  tea: (
    <>
      <path d="M40 88 H144 V116 C144 150 122 170 92 170 C62 170 40 150 40 116 Z" fill={c.hero} />
      <ellipse cx="92" cy="88" rx="52" ry="11" fill={c.accent} />
      <path d="M144 98 q32 0 32 26 q0 24 -32 24" fill="none" stroke={c.hero} strokeWidth="11" strokeLinecap="round" />
      <ellipse cx="92" cy="174" rx="68" ry="9" fill={ink} />
      <path d="M112 86 Q128 58 146 50" fill="none" stroke={ink} strokeWidth="3.5" />
      <rect x="140" y="30" width="24" height="24" rx="5" fill={c.white} transform="rotate(10 152 42)" />
      <path d="M70 62 q-9 -12 0 -24 M94 58 q-9 -12 0 -24" fill="none" stroke={c.muted} strokeWidth="6" strokeLinecap="round" opacity="0.5" />
      <circle cx="152" cy="150" r="30" fill={c.white} />
      <rect x="140" y="138" width="24" height="24" rx="5" fill={c.heroTint} stroke={c.line} strokeWidth="3" />
      <circle cx="152" cy="150" r="30" fill="none" stroke={ink} strokeWidth="6" />
      <path d="M131 171 L173 129" stroke={ink} strokeWidth="7" strokeLinecap="round" />
    </>
  ),
  coffee: (
    <>
      <rect x="36" y="70" width="104" height="98" rx="20" fill={ink} />
      <rect x="36" y="100" width="104" height="14" fill={c.hero} />
      <path d="M140 92 H156 Q178 92 178 118 Q178 144 156 144 H140" fill="none" stroke={ink} strokeWidth="13" strokeLinecap="round" />
      <path d="M66 54 q-10 -13 0 -26 M92 50 q-10 -13 0 -26 M118 54 q-10 -13 0 -26" fill="none" stroke={c.muted} strokeWidth="6" strokeLinecap="round" opacity="0.55" />
      <g transform="rotate(-28 150 172)">
        <ellipse cx="150" cy="172" rx="21" ry="14" fill={c.accent} />
        <path d="M130 172 Q150 160 170 172" fill="none" stroke={ink} strokeWidth="4" />
      </g>
    </>
  ),
  sauce: (
    <>
      <rect x="62" y="80" width="72" height="100" rx="22" fill={c.hero} />
      <rect x="82" y="56" width="32" height="30" rx="6" fill={c.heroDeep} />
      <path d="M88 56 L98 22 L108 56 Z" fill={c.accent} />
      <rect x="72" y="108" width="52" height="48" rx="11" fill={c.white} />
      <path d="M98 114 q14 14 6 26 q-12 8 -18 -6 q2 6 8 4 q-4 -10 4 -24z" fill={c.accent} />
      <path d="M146 116 C176 104 194 138 178 174 C176 150 160 140 144 138 Z" fill={c.accent} />
      <path d="M144 118 q-5 -12 -14 -10" fill="none" stroke={c.heroDeep} strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  sandwich: (
    <>
      <path d="M32 104 C32 66 68 50 100 50 C132 50 168 66 168 104 Z" fill={c.accent} />
      <ellipse cx="78" cy="74" rx="6" ry="3.5" fill={c.white} opacity="0.85" />
      <ellipse cx="104" cy="66" rx="6" ry="3.5" fill={c.white} opacity="0.85" />
      <ellipse cx="128" cy="78" rx="6" ry="3.5" fill={c.white} opacity="0.85" />
      <path d="M26 116 q10 -14 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 v16 H26 Z" fill={c.hero} />
      <rect x="34" y="130" width="132" height="16" rx="8" fill={c.heroDeep} />
      <rect x="30" y="144" width="140" height="26" rx="13" fill={c.accent} />
      <circle cx="152" cy="150" r="32" fill={c.white} />
      <circle cx="152" cy="150" r="15" fill="none" stroke={c.accentSoft} strokeWidth="9" />
      <circle cx="152" cy="150" r="32" fill="none" stroke={ink} strokeWidth="6" />
      <path d="M129 173 L175 127" stroke={ink} strokeWidth="7" strokeLinecap="round" />
    </>
  ),
  skyline: (
    <>
      <rect x="22" y="112" width="40" height="66" rx="4" fill={c.heroSoft} />
      <rect x="70" y="70" width="34" height="108" rx="4" fill={c.hero} />
      <path d="M87 70 V36" stroke={ink} strokeWidth="5" strokeLinecap="round" />
      <path d="M112 150 V122 A26 26 0 0 1 164 122 V150 Z" fill={c.accent} />
      <path d="M138 96 V80" stroke={ink} strokeWidth="5" strokeLinecap="round" />
      <rect x="168" y="96" width="14" height="82" rx="4" fill={c.heroDeep} />
      <rect x="112" y="148" width="52" height="30" rx="4" fill={c.hero} />
      <rect x="14" y="176" width="176" height="10" rx="5" fill={ink} />
      <g fill={c.white} opacity="0.8">
        <rect x="78" y="88" width="6" height="8" rx="2" /><rect x="90" y="88" width="6" height="8" rx="2" />
        <rect x="78" y="108" width="6" height="8" rx="2" /><rect x="90" y="108" width="6" height="8" rx="2" />
        <rect x="78" y="128" width="6" height="8" rx="2" /><rect x="90" y="128" width="6" height="8" rx="2" />
      </g>
    </>
  ),
  sun: (
    <>
      <circle cx="100" cy="100" r="44" fill={c.accent} />
      <g stroke={c.accent} strokeWidth="9" strokeLinecap="round">
        {Array.from({length: 8}).map((_, i) => {
          const a = (i * Math.PI) / 4;
          return <line key={i} x1={100 + Math.cos(a) * 62} y1={100 + Math.sin(a) * 62} x2={100 + Math.cos(a) * 82} y2={100 + Math.sin(a) * 82} />;
        })}
      </g>
      <circle cx="88" cy="88" r="12" fill={c.white} opacity="0.55" />
    </>
  ),
  house: (
    <>
      <path d="M22 100 L100 32 L178 100 Z" fill={c.hero} />
      <rect x="40" y="96" width="120" height="82" rx="8" fill={c.white} />
      <rect x="40" y="96" width="120" height="82" rx="8" fill="none" stroke={c.heroSoft} strokeWidth="5" />
      <rect x="84" y="124" width="32" height="54" rx="8" fill={c.accent} />
      <rect x="52" y="112" width="22" height="22" rx="5" fill={c.heroSoft} />
      <rect x="126" y="112" width="22" height="22" rx="5" fill={c.heroSoft} />
    </>
  ),
  speaker: (
    <>
      <path d="M30 80 H62 L104 44 V156 L62 120 H30 Z" fill={c.hero} />
      <path d="M126 76 q22 24 0 48" fill="none" stroke={c.accent} strokeWidth="11" strokeLinecap="round" />
      <path d="M146 54 q40 46 0 92" fill="none" stroke={c.heroSoft} strokeWidth="11" strokeLinecap="round" />
    </>
  ),
  mic: (
    <>
      <rect x="72" y="26" width="56" height="94" rx="28" fill={c.hero} />
      <path d="M52 98 q0 50 48 50 q48 0 48 -50" fill="none" stroke={ink} strokeWidth="10" strokeLinecap="round" />
      <path d="M100 148 V176 M72 178 H128" stroke={ink} strokeWidth="10" strokeLinecap="round" />
      <path d="M84 52 H116 M84 70 H116" stroke={c.white} strokeWidth="6" strokeLinecap="round" opacity="0.6" />
    </>
  ),
  bubble: (
    <>
      <path d="M28 40 Q28 24 44 24 H156 Q172 24 172 40 V120 Q172 136 156 136 H88 L52 172 V136 H44 Q28 136 28 120 Z" fill={c.hero} />
      <circle cx="72" cy="80" r="9" fill={c.white} />
      <circle cx="100" cy="80" r="9" fill={c.white} />
      <circle cx="128" cy="80" r="9" fill={c.white} />
    </>
  ),
  check: (
    <>
      <circle cx="100" cy="100" r="78" fill={c.hero} />
      <path d="M62 102 L90 130 L142 72" fill="none" stroke={c.white} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

export const Icon: React.FC<{name: IconName; style?: React.CSSProperties}> = ({name, style}) => (
  <svg viewBox="0 0 200 200" style={{...S, ...style}}>{icons[name]}</svg>
);
