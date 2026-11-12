import React from "react";
import { theme } from "../../../theme";

const I = theme.illus;
const C = theme.colors;

export type IllusProps = {
  frame: number;
  fps: number;
  durationInFrames: number;
  /** scene-local frames of cues */
  cues: { pron1: number; pron2: number; meaning: number; usage?: number };
};

export const VB_W = 940;
export const VB_H = 540;

export const Stage: React.FC<{ children: React.ReactNode; w?: number; h?: number; floorY?: number; wall?: string; floor?: string }> = ({
  children, w = VB_W, h = VB_H, floorY = 430, wall = C.bgAlt, floor = C.primarySoft,
}) => (
  <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: "block" }}>
    <rect width={w} height={h} fill={wall} />
    <rect y={floorY} width={w} height={h - floorY} fill={floor} />
    <rect y={floorY} width={w} height={6} fill={C.line} />
    {children}
  </svg>
);

export type Pose = { armL?: number; armR?: number; legSwing?: number; bob?: number; mouth?: number; lookX?: number };

/** Flat vector person. Origin = feet centre. Height ≈ 275 units. arm angle: 0 = hanging, 90 = sideways, 180 = up. */
export const Person: React.FC<{
  x: number; y: number; scale?: number; flip?: boolean;
  skin?: string; hair?: string; shirt?: string; pants?: string; hairStyle?: "short" | "long" | "none";
  pose?: Pose; sitting?: boolean; front?: React.ReactNode; top?: React.ReactNode; handR?: React.ReactNode; handL?: React.ReactNode;
}> = ({
  x, y, scale = 1, flip = false, skin = I.skin[1], hair = I.hair[0], shirt = I.shirtA, pants = I.pants,
  hairStyle = "short", pose = {}, sitting = false, front, top, handR, handL,
}) => {
  const { armL = 8, armR = 8, legSwing = 0, bob = 0, mouth = 0, lookX = 4 } = pose;
  const arm = (side: -1 | 1, a: number, hand?: React.ReactNode) => (
    <g transform={`translate(${side * 34} -186) rotate(${side === -1 ? a : -a})`}>
      <line x1="0" y1="0" x2="0" y2="72" stroke={shirt} strokeWidth="21" strokeLinecap="round" />
      <circle cx="0" cy="78" r="11" fill={skin} />
      {hand ? <g transform="translate(0 78)">{hand}</g> : null}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${flip ? -scale : scale} ${scale})`}>
      {sitting ? (
        <g>
          <rect x="-6" y="-112" width="74" height="26" rx="13" fill={pants} />
          <rect x="46" y="-104" width="24" height="104" rx="10" fill={pants} />
          <rect x="52" y="-8" width="40" height="14" rx="7" fill={I.ink} />
        </g>
      ) : (
        <g>
          <g transform={`translate(-14 -100) rotate(${legSwing})`}>
            <rect x="-12" y="0" width="24" height="98" rx="10" fill={pants} />
            <rect x="-12" y="92" width="40" height="14" rx="7" fill={I.ink} />
          </g>
          <g transform={`translate(14 -100) rotate(${-legSwing})`}>
            <rect x="-12" y="0" width="24" height="98" rx="10" fill={pants} />
            <rect x="-12" y="92" width="40" height="14" rx="7" fill={I.ink} />
          </g>
        </g>
      )}
      {arm(-1, armL, handL)}
      <rect x="-36" y="-206" width="72" height="112" rx="26" fill={shirt} />
      {front}
      {arm(1, armR, handR)}
      <rect x="-9" y="-222" width="18" height="22" rx="8" fill={skin} />
      {hairStyle === "long" ? <rect x="-38" y="-262" width="76" height="70" rx="30" fill={hair} /> : null}
      <circle cx="0" cy="-242" r="34" fill={skin} />
      {hairStyle !== "none" ? (
        <path d="M-35 -244 A35 35 0 0 1 35 -244 Q22 -264 0 -262 Q-22 -264 -35 -244Z" fill={hair} />
      ) : null}
      <circle cx={-12 + lookX} cy="-242" r="4" fill={I.ink} />
      <circle cx={12 + lookX} cy="-242" r="4" fill={I.ink} />
      {mouth > 0.05 ? (
        <ellipse cx={lookX} cy="-226" rx="9" ry={2 + 7 * mouth} fill={I.ink} />
      ) : (
        <path d={`M${lookX - 8} -228 Q${lookX} -220 ${lookX + 8} -228`} stroke={I.ink} strokeWidth="3" fill="none" strokeLinecap="round" />
      )}
      {top}
    </g>
  );
};

export const Table: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({ x, y, w = 360, h = 22 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2 + 40} y={h} width="18" height="120" rx="6" fill={I.woodDark} />
    <rect x={w / 2 - 58} y={h} width="18" height="120" rx="6" fill={I.woodDark} />
    <rect x={-w / 2} y="0" width={w} height={h} rx="10" fill={I.wood} />
  </g>
);

export const Plate: React.FC<{ x: number; y: number; scale?: number; food?: boolean; steam?: number }> = ({ x, y, scale = 1, food = true, steam = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {steam > 0 ? (
      <g opacity={0.55} fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round">
        <path d={`M-18 -26 q10 ${-14 - steam * 4} 0 -30 q-10 -14 0 -${26 + steam * 4}`} />
        <path d={`M12 -26 q10 ${-12 - steam * 3} 0 -26 q-10 -12 0 -${22 + steam * 3}`} />
      </g>
    ) : null}
    <ellipse cx="0" cy="8" rx="78" ry="16" fill={C.shadow} />
    <ellipse cx="0" cy="0" rx="74" ry="18" fill={C.white} stroke={C.line} strokeWidth="4" />
    {food ? (
      <g>
        <ellipse cx="0" cy="-8" rx="44" ry="16" fill="#F3D9A4" />
        <ellipse cx="-14" cy="-14" rx="22" ry="12" fill={I.red} />
        <ellipse cx="16" cy="-14" rx="16" ry="10" fill={I.leaf} />
      </g>
    ) : null}
  </g>
);

export const Glass: React.FC<{ x: number; y: number; w?: number; h?: number; fill?: number; liquid?: string; children?: React.ReactNode; id: string }> = ({
  x, y, w = 110, h = 170, fill = 0, liquid = I.mango, children, id,
}) => (
  <g transform={`translate(${x} ${y})`}>
    <defs>
      <clipPath id={id}>
        <path d={`M0 0 H${w} L${w - 14} ${h} Q${w / 2} ${h + 10} 14 ${h} Z`} />
      </clipPath>
    </defs>
    <path d={`M0 0 H${w} L${w - 14} ${h} Q${w / 2} ${h + 10} 14 ${h} Z`} fill={I.glass} />
    <g clipPath={`url(#${id})`}>
      <rect x="0" y={h - h * fill} width={w} height={h * fill + 12} fill={liquid} opacity="0.92" />
      {children}
    </g>
    <path d={`M0 0 H${w} L${w - 14} ${h} Q${w / 2} ${h + 10} 14 ${h} Z`} fill="none" stroke={I.glassEdge} strokeWidth="5" strokeLinejoin="round" />
    <path d={`M14 14 L22 ${h - 20}`} stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
  </g>
);

export const Mango: React.FC<{ x: number; y: number; scale?: number; rot?: number }> = ({ x, y, scale = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
    <path d="M0 -50 C48 -56 62 -4 40 30 C20 58 -34 52 -50 14 C-62 -16 -38 -46 0 -50Z" fill={I.mango} />
    <path d="M-30 -26 C-12 -44 18 -46 30 -34" stroke="#FFD27A" strokeWidth="7" fill="none" strokeLinecap="round" />
    <path d="M2 -50 C8 -70 28 -76 40 -70 C32 -58 18 -50 2 -50Z" fill={I.leaf} />
    <rect x="-1" y="-60" width="5" height="14" rx="2" fill={I.woodDark} />
  </g>
);

export const Bubble: React.FC<{ x: number; y: number; w: number; h: number; tail?: "left" | "right" | "down"; children?: React.ReactNode; scale?: number; fill?: string; stroke?: string }> = ({
  x, y, w, h, tail = "down", children, scale = 1, fill = C.white, stroke = C.line,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2.6} fill={fill} stroke={stroke} strokeWidth="4" />
    {tail === "down" ? <path d={`M-14 ${h / 2 - 2} L0 ${h / 2 + 22} L14 ${h / 2 - 2}Z`} fill={fill} stroke={stroke} strokeWidth="4" strokeLinejoin="round" /> : null}
    {tail === "left" ? <path d={`M${-w / 2 + 2} 8 L${-w / 2 - 22} 20 L${-w / 2 + 2} 24Z`} fill={fill} stroke={stroke} strokeWidth="4" strokeLinejoin="round" /> : null}
    {tail === "right" ? <path d={`M${w / 2 - 2} 8 L${w / 2 + 22} 20 L${w / 2 - 2} 24Z`} fill={fill} stroke={stroke} strokeWidth="4" strokeLinejoin="round" /> : null}
    {tail === "down" ? <rect x={-12} y={h / 2 - 6} width="24" height="8" fill={fill} /> : null}
    {children}
  </g>
);

export const QuestionMark: React.FC<{ x: number; y: number; size?: number; color?: string }> = ({ x, y, size = 64, color = C.accent }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={theme.fonts.en} fontWeight="700" fontSize={size} fill={color}>?</text>
);

export const Dots: React.FC<{ x: number; y: number; n?: number; active?: number; r?: number }> = ({ x, y, n = 3, active = 0, r = 7 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => (
      <circle key={i} cx={x + (i - (n - 1) / 2) * r * 3} cy={y} r={r} fill={C.textDim} opacity={0.35 + 0.65 * (i === active ? 1 : 0)} />
    ))}
  </g>
);

export const Heart: React.FC<{ x: number; y: number; s?: number; color?: string; o?: number }> = ({ x, y, s = 1, color = I.red, o = 1 }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} opacity={o} fill={color}
    d="M0 12 C-22 -4 -20 -24 -8 -24 C-3 -24 0 -20 0 -16 C0 -20 3 -24 8 -24 C20 -24 22 -4 0 12Z" />
);

export const Sparkle: React.FC<{ x: number; y: number; s?: number; color?: string; o?: number; rot?: number }> = ({ x, y, s = 1, color = C.accent, o = 1, rot = 0 }) => (
  <path transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o} fill={color}
    d="M0 -18 Q3 -3 18 0 Q3 3 0 18 Q-3 3 -18 0 Q-3 -3 0 -18Z" />
);

export const Clock: React.FC<{ x: number; y: number; r?: number; hour: number; minute: number }> = ({ x, y, r = 60, hour, minute }) => {
  const ha = ((hour % 12) + minute / 60) * 30;
  const ma = minute * 6;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={C.white} stroke={I.woodDark} strokeWidth="8" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1="0" y1={-r + 10} x2="0" y2={-r + (i % 3 === 0 ? 22 : 16)} stroke={C.text} strokeWidth="3" transform={`rotate(${i * 30})`} />
      ))}
      <line x1="0" y1="4" x2="0" y2={-r * 0.5} stroke={C.text} strokeWidth="7" strokeLinecap="round" transform={`rotate(${ha})`} />
      <line x1="0" y1="6" x2="0" y2={-r * 0.74} stroke={C.primary} strokeWidth="5" strokeLinecap="round" transform={`rotate(${ma})`} />
      <circle r="6" fill={C.text} />
    </g>
  );
};

export const Building: React.FC<{ x: number; y: number; w?: number; h?: number; lit?: number }> = ({ x, y, w = 220, h = 300, lit = 1 }) => {
  const cols = 3;
  const rows = 4;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y={-h} width={w} height={h} rx="10" fill={I.shirtC} />
      <rect x="-8" y={-h - 14} width={w + 16} height="18" rx="6" fill={C.text} />
      {Array.from({ length: rows * cols }).map((_, i) => {
        const cx = 26 + (i % cols) * ((w - 52) / cols);
        const cy = -h + 26 + Math.floor(i / cols) * 56;
        return <rect key={i} x={cx} y={cy} width={(w - 52) / cols - 14} height="36" rx="6" fill={i % 4 === 1 ? C.accentSoft : "#CFE3F2"} opacity={0.4 + 0.6 * lit} />;
      })}
      <rect x={w / 2 - 28} y="-62" width="56" height="62" rx="8" fill={I.woodDark} />
    </g>
  );
};

export const Phone: React.FC<{ x: number; y: number; scale?: number; rot?: number; children?: React.ReactNode }> = ({ x, y, scale = 1, rot = 0, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
    <rect x="-80" y="-150" width="160" height="300" rx="28" fill={C.text} />
    <rect x="-68" y="-134" width="136" height="268" rx="18" fill="#F4FAF8" />
    <rect x="-22" y="-146" width="44" height="6" rx="3" fill="#2A3B35" />
    {children}
  </g>
);

export const Monitor: React.FC<{ x: number; y: number; on: number }> = ({ x, y, on }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="-8" y="0" width="16" height="40" fill={I.metal} />
    <rect x="-46" y="38" width="92" height="12" rx="6" fill={I.metal} />
    <rect x="-100" y="-120" width="200" height="124" rx="14" fill={C.text} />
    <rect x="-88" y="-108" width="176" height="100" rx="8" fill={on > 0.5 ? "#E8F6FF" : "#1B2A25"} />
    {on > 0.5 ? (
      <g>
        <rect x="-74" y="-94" width="90" height="10" rx="5" fill={C.primary} opacity={on} />
        <rect x="-74" y="-74" width="140" height="8" rx="4" fill={C.line} />
        <rect x="-74" y="-56" width="120" height="8" rx="4" fill={C.line} />
        <rect x="-74" y="-38" width="132" height="8" rx="4" fill={C.line} />
      </g>
    ) : null}
  </g>
);

export const Chair: React.FC<{ x: number; y: number; flip?: boolean }> = ({ x, y, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
    <rect x="-12" y="-150" width="16" height="108" rx="8" fill={I.woodDark} />
    <rect x="-12" y="-100" width="86" height="18" rx="9" fill={I.wood} />
    <rect x="52" y="-84" width="14" height="84" rx="6" fill={I.woodDark} />
    <rect x="-4" y="-84" width="14" height="84" rx="6" fill={I.woodDark} />
  </g>
);

export const Sun: React.FC<{ x: number; y: number; r?: number; rays?: number }> = ({ x, y, r = 54, rays = 1 }) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: 12 }).map((_, i) => (
      <line key={i} x1="0" y1={-r - 14} x2="0" y2={-r - 14 - 26 * rays} stroke={C.accent} strokeWidth="8" strokeLinecap="round" transform={`rotate(${i * 30})`} opacity={rays} />
    ))}
    <circle r={r} fill={C.accent} />
  </g>
);

export const Counter: React.FC<{ x: number; y: number; w: number; h?: number; chef?: boolean }> = ({ x, y, w, h = 26 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="0" y="0" width={w} height={h} rx="10" fill={I.wood} />
    <rect x="10" y={h} width={w - 20} height="100" fill={I.woodDark} />
  </g>
);
