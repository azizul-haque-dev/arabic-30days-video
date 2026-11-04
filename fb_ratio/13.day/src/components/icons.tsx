import React from "react";
import { theme } from "../theme";
import type { IconId } from "../timing";

const c = theme.colors;
const sw = 6; // একই স্ট্রোক সব আইকনে
const Svg: React.FC<{ size: number; children: React.ReactNode }> = ({ size, children }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" strokeLinejoin="round" strokeLinecap="round">{children}</svg>
);

const Crowd = () => (
  <>
    <path d="M24 66 L44 28 H156 L176 66 Z" fill={c.hero} stroke={c.text} strokeWidth={sw} />
    <path d="M66 28 L58 66 H90 L94 28 Z" fill={c.white} />
    <path d="M110 28 L114 66 H146 L138 28 Z" fill={c.white} />
    <rect x="24" y="62" width="152" height="12" rx="6" fill={c.heroDeep} stroke={c.text} strokeWidth={sw} />
    <circle cx="54" cy="116" r="15" fill={c.text} /><path d="M30 178 a24 24 0 0 1 48 0 Z" fill={c.text} />
    <circle cx="146" cy="116" r="15" fill={c.text} /><path d="M122 178 a24 24 0 0 1 48 0 Z" fill={c.text} />
    <circle cx="100" cy="106" r="19" fill={c.accent} stroke={c.text} strokeWidth={sw} /><path d="M68 182 a32 32 0 0 1 64 0 Z" fill={c.accent} stroke={c.text} strokeWidth={sw} />
  </>
);
const Shop = () => (
  <>
    <rect x="34" y="88" width="132" height="90" rx="10" fill={c.white} stroke={c.text} strokeWidth={sw} />
    <path d="M26 90 L44 54 H156 L174 90 Z" fill={c.hero} stroke={c.text} strokeWidth={sw} />
    <path d="M70 54 L62 90 H92 L96 54 Z" fill={c.white} /><path d="M112 54 L116 90 H146 L138 54 Z" fill={c.white} />
    <rect x="82" y="120" width="36" height="58" rx="6" fill={c.accent} stroke={c.text} strokeWidth={sw} />
    <rect x="46" y="108" width="28" height="28" rx="6" fill={c.heroSoft} stroke={c.text} strokeWidth={sw} />
    <rect x="128" y="108" width="28" height="28" rx="6" fill={c.heroSoft} stroke={c.text} strokeWidth={sw} />
    <path d="M160 12 a18 18 0 0 1 18 18 c0 16 -18 34 -18 34 s-18 -18 -18 -34 a18 18 0 0 1 18 -18Z" fill={c.accent} stroke={c.text} strokeWidth={sw} />
    <circle cx="160" cy="30" r="6.5" fill={c.white} />
  </>
);
const Rice = () => (
  <>
    <path d="M62 58 C46 84 34 114 38 152 C40 178 60 186 100 186 C140 186 160 178 162 152 C166 114 154 84 138 58 Z" fill={c.sand} stroke={c.text} strokeWidth={sw} />
    <path d="M58 58 Q70 26 100 34 Q130 26 142 58 Z" fill={c.sand} stroke={c.text} strokeWidth={sw} />
    <path d="M62 60 Q100 74 138 60" stroke={c.accentDeep} strokeWidth={10} />
    <rect x="68" y="102" width="64" height="48" rx="12" fill={c.white} stroke={c.text} strokeWidth={sw} />
    {[[84, 126, -30], [100, 120, 20], [116, 128, -10]].map(([x, y, r], i) => (
      <ellipse key={i} cx={x} cy={y} rx="9" ry="4.5" fill={c.hero} transform={`rotate(${r} ${x} ${y})`} />
    ))}
  </>
);
const Meat = () => (
  <>
    <path d="M42 100 C38 58 92 38 132 50 C174 64 178 114 150 146 C126 176 80 182 54 154 C44 142 43 120 42 100Z" fill={c.meat} stroke={c.text} strokeWidth={sw} />
    <path d="M60 104 C58 74 96 60 126 68 C152 78 154 112 134 132 C116 152 88 156 72 140 C64 130 61 118 60 104Z" fill={c.meatDark} opacity={0.45} />
    <circle cx="124" cy="96" r="21" fill={c.white} stroke={c.text} strokeWidth={sw} /><circle cx="124" cy="96" r="8" fill={c.sand} />
    <path d="M66 150 q14 8 30 4" stroke={c.white} strokeWidth={6} opacity={0.7} />
  </>
);
const Fresh = () => (
  <>
    <path d="M36 156 C26 84 90 30 168 36 C176 112 128 172 54 164 Z" fill={c.hero} stroke={c.text} strokeWidth={sw} />
    <path d="M52 152 C84 112 118 82 152 54" stroke={c.white} strokeWidth={7} />
    <path d="M86 118 C86 98 96 88 108 82 M104 98 C112 112 112 124 108 134" stroke={c.white} strokeWidth={5} opacity={0.8} />
    <circle cx="150" cy="150" r="30" fill={c.accent} stroke={c.text} strokeWidth={sw} />
    <path d="M136 151 l10 10 l19 -22" stroke={c.white} strokeWidth={9} />
    <path d="M40 40 l5 14 l14 5 l-14 5 l-5 14 l-5 -14 l-14 -5 l14 -5Z" fill={c.accent} stroke={c.text} strokeWidth={4} />
  </>
);
const Taxi = () => (
  <>
    <rect x="86" y="46" width="28" height="18" rx="5" fill={c.text} />
    <path d="M48 120 L60 84 Q64 72 78 72 H122 Q136 72 140 84 L152 120 Z" fill={c.accent} stroke={c.text} strokeWidth={sw} />
    <path d="M64 112 L72 86 H96 V112Z" fill={c.white} /><path d="M104 86 H126 L134 112 H104Z" fill={c.white} />
    <rect x="18" y="114" width="164" height="44" rx="16" fill={c.accent} stroke={c.text} strokeWidth={sw} />
    <path d="M26 132 H174" stroke={c.text} strokeWidth={8} strokeDasharray="9 9" />
    <circle cx="56" cy="160" r="21" fill={c.text} /><circle cx="56" cy="160" r="8" fill={c.white} />
    <circle cx="144" cy="160" r="21" fill={c.text} /><circle cx="144" cy="160" r="8" fill={c.white} />
  </>
);
const Plane = () => (
  <>
    <path d="M18 176 Q 50 70 170 34" stroke={c.textFaint} strokeWidth={5} strokeDasharray="4 12" />
    <g transform="rotate(-24 100 100)">
      <path d="M96 98 L66 46 L88 46 L132 96Z" fill={c.hero} stroke={c.text} strokeWidth={sw} />
      <path d="M96 104 L66 156 L88 156 L132 106Z" fill={c.hero} stroke={c.text} strokeWidth={sw} />
      <path d="M44 98 L26 66 L46 66 L62 96Z" fill={c.hero} stroke={c.text} strokeWidth={sw} />
      <ellipse cx="100" cy="101" rx="74" ry="14" fill={c.white} stroke={c.text} strokeWidth={sw} />
      {[96, 114, 132].map((x) => <circle key={x} cx={x} cy="99" r="3.6" fill={c.accent} />)}
    </g>
  </>
);
const Fare = () => (
  <>
    <path d="M92 36 H164 Q178 36 178 50 V120 Q178 127 173 132 L122 183 Q112 192 102 183 L26 107 Q20 100 26 93 Z" fill={c.accent} stroke={c.text} strokeWidth={sw} />
    <circle cx="150" cy="68" r="11" fill={c.white} stroke={c.text} strokeWidth={5} />
    <text x="106" y="136" textAnchor="middle" fontSize="84" fontWeight={700} fontFamily={theme.fonts.display} fill={c.text}>?</text>
    <circle cx="48" cy="156" r="24" fill={c.hero} stroke={c.text} strokeWidth={sw} /><circle cx="48" cy="156" r="11" stroke={c.white} strokeWidth={5} />
  </>
);
const Meter = () => (
  <>
    <rect x="28" y="46" width="144" height="118" rx="24" fill={c.text} />
    <rect x="46" y="64" width="108" height="46" rx="10" fill={c.white} />
    {[56, 90, 124].map((x, i) => <rect key={x} x={x - 4} y="78" width={i === 2 ? 24 : 26} height="18" rx="4" fill={i === 2 ? c.accent : c.heroSoft} stroke={c.hero} strokeWidth={0} />)}
    <circle cx="68" cy="136" r="10" fill={c.hero} /><circle cx="100" cy="136" r="10" fill={c.accent} /><circle cx="132" cy="136" r="10" fill={c.white} />
    <rect x="84" y="30" width="32" height="14" rx="5" fill={c.hero} stroke={c.text} strokeWidth={sw} />
  </>
);
const Stop = () => (
  <>
    <rect x="92" y="150" width="16" height="40" rx="5" fill={c.text} />
    <path d="M72 18 H128 L170 60 V116 L128 158 H72 L30 116 V60Z" fill={c.hero} stroke={c.text} strokeWidth={sw} />
    <path d="M78 30 H122 L156 64 V112 L122 146 H78 L44 112 V64Z" stroke={c.white} strokeWidth={5} opacity={0.9} />
    <rect x="62" y="80" width="76" height="18" rx="9" fill={c.white} />
  </>
);

const MAP: Record<IconId, React.FC> = { crowd: Crowd, shop: Shop, rice: Rice, meat: Meat, fresh: Fresh, taxi: Taxi, plane: Plane, fare: Fare, meter: Meter, stop: Stop };

export const Icon: React.FC<{ id: IconId; size: number }> = ({ id, size }) => {
  const C = MAP[id];
  return <Svg size={size}><C /></Svg>;
};

export const CheckBadge: React.FC<{ size: number; fill?: string }> = ({ size, fill = c.text }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="20" fill={fill} />
    <path d="M11 21 l6 6 l12 -14" stroke={c.white} strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
