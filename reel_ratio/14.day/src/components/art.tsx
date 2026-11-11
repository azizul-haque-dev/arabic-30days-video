import React from "react";
import { theme } from "../config/theme";

const c = theme.colors;

export const Arrow: React.FC<{ dir?: "up" | "left" | "right" | "down"; s?: number; fill?: string }> = ({ dir = "up", s = 1, fill = c.white }) => {
  const rot = { up: 0, right: 90, down: 180, left: -90 }[dir];
  return <path d="M0 -42 L32 -4 L12 -4 L12 40 L-12 40 L-12 -4 L-32 -4 Z" fill={fill} transform={`rotate(${rot}) scale(${s})`} strokeLinejoin="round" />;
};

/** Top-down taxi, facing up, origin at centre (~64x128). */
export const TaxiTop: React.FC<{ x?: number; y?: number; rot?: number; s?: number; brake?: number; blinkR?: number; blinkL?: number }> = ({
  x = 0, y = 0, rot = 0, s = 1, brake = 0, blinkR = 0, blinkL = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-36} y={-60} width={72} height={132} rx={22} fill={c.roadEdge} opacity={0.18} />
    <rect x={-32} y={-64} width={64} height={128} rx={20} fill={c.amber} />
    <rect x={-32} y={-64} width={64} height={128} rx={20} fill="none" stroke={c.amberDark} strokeWidth={3} />
    <rect x={-25} y={-46} width={50} height={18} rx={6} fill={c.glass} />
    <rect x={-25} y={34} width={50} height={14} rx={6} fill={c.glass} />
    <rect x={-25} y={-26} width={50} height={58} rx={10} fill={c.amberSoft} />
    {[-22, -10, 2, 14].map((px, i) => (
      <rect key={i} x={px} y={-6} width={8} height={8} fill={i % 2 ? c.white : c.text} opacity={0.85} />
    ))}
    <rect x={-13} y={-18} width={26} height={11} rx={3} fill={c.white} />
    <circle cx={-20} cy={-61} r={5} fill={c.white} />
    <circle cx={20} cy={-61} r={5} fill={c.white} />
    <circle cx={-21} cy={60} r={5.5} fill={c.red} opacity={0.55 + brake * 0.45} />
    <circle cx={21} cy={60} r={5.5} fill={c.red} opacity={0.55 + brake * 0.45} />
    {brake > 0 && <circle cx={-21} cy={62} r={14} fill={c.red} opacity={0.28 * brake} />}
    {brake > 0 && <circle cx={21} cy={62} r={14} fill={c.red} opacity={0.28 * brake} />}
    <circle cx={34} cy={-48} r={6} fill={c.amber} stroke={c.white} strokeWidth={2} opacity={blinkR} />
    <circle cx={-34} cy={-48} r={6} fill={c.amber} stroke={c.white} strokeWidth={2} opacity={blinkL} />
  </g>
);

export const CarTop: React.FC<{ x: number; y: number; body: string; roof: string; brake?: number; s?: number }> = ({ x, y, body, roof, brake = 1, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-34} y={-58} width={68} height={124} rx={20} fill={c.roadEdge} opacity={0.2} />
    <rect x={-30} y={-62} width={60} height={124} rx={18} fill={body} />
    <rect x={-23} y={-44} width={46} height={16} rx={6} fill={c.glass} />
    <rect x={-23} y={-26} width={46} height={52} rx={10} fill={roof} />
    <rect x={-23} y={30} width={46} height={12} rx={5} fill={c.glass} />
    <circle cx={-19} cy={-58} r={4.5} fill={c.white} />
    <circle cx={19} cy={-58} r={4.5} fill={c.white} />
    <circle cx={-20} cy={58} r={6} fill={c.red} opacity={0.5 + brake * 0.5} />
    <circle cx={20} cy={58} r={6} fill={c.red} opacity={0.5 + brake * 0.5} />
    <circle cx={-20} cy={64} r={22} fill={c.red} opacity={0.42 * brake} />
    <circle cx={20} cy={64} r={22} fill={c.red} opacity={0.42 * brake} />
  </g>
);

/** Rear view taxi (driving away), origin at bottom centre. */
export const TaxiRear: React.FC<{ x?: number; y?: number; s?: number; brake?: number }> = ({ x = 0, y = 0, s = 1, brake = 0.6 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={118} ry={14} fill={c.roadEdge} opacity={0.25} />
    <rect x={-100} y={-96} width={200} height={84} rx={24} fill={c.amber} />
    <path d="M-72 -96 L-56 -146 Q-52 -156 -40 -156 L40 -156 Q52 -156 56 -146 L72 -96 Z" fill={c.amber} />
    <path d="M-52 -100 L-40 -140 L40 -140 L52 -100 Z" fill={c.glass} />
    <rect x={-26} y={-176} width={52} height={20} rx={5} fill={c.white} />
    <rect x={-100} y={-62} width={200} height={10} fill={c.white} opacity={0.9} />
    <rect x={-84} y={-44} width={36} height={18} rx={6} fill={c.red} opacity={0.6 + brake * 0.4} />
    <rect x={48} y={-44} width={36} height={18} rx={6} fill={c.red} opacity={0.6 + brake * 0.4} />
    <rect x={-26} y={-44} width={52} height={18} rx={4} fill={c.white} />
    <rect x={-92} y={-14} width={34} height={18} rx={6} fill={c.text} />
    <rect x={58} y={-14} width={34} height={18} rx={6} fill={c.text} />
  </g>
);

/** Side view taxi facing right, origin at ground centre. */
export const TaxiSide: React.FC<{ x?: number; y?: number; s?: number; wheel?: number; passenger?: boolean }> = ({ x = 0, y = 0, s = 1, wheel = 0, passenger = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={28} rx={130} ry={10} fill={c.roadEdge} opacity={0.22} />
    <path d="M-120 18 L-120 -14 Q-118 -26 -100 -28 L-66 -30 L-44 -58 Q-40 -64 -32 -64 L44 -64 Q54 -64 60 -56 L80 -30 L108 -26 Q122 -24 122 -10 L122 18 Z" fill={c.amber} stroke={c.amberDark} strokeWidth={3} strokeLinejoin="round" />
    <path d="M-52 -30 L-36 -54 L-4 -54 L-4 -30 Z" fill={c.glass} />
    <path d="M6 -30 L6 -54 L42 -54 L68 -30 Z" fill={c.glass} />
    {passenger && (
      <g>
        <circle cx={-22} cy={-42} r={9} fill={c.amberSoft} stroke={c.amberDark} strokeWidth={2} />
        <path d="M-36 -30 Q-22 -38 -8 -30 Z" fill={c.green} />
      </g>
    )}
    <rect x={-120} y={-8} width={242} height={7} fill={c.white} opacity={0.9} />
    <rect x={-18} y={-80} width={40} height={16} rx={4} fill={c.white} />
    {[-70, 76].map((wx) => (
      <g key={wx} transform={`translate(${wx} 20)`}>
        <circle r={26} fill={c.text} />
        <circle r={12} fill={c.white} />
        <g transform={`rotate(${wheel})`}>
          <line x1={-10} y1={0} x2={10} y2={0} stroke={c.muted} strokeWidth={3} />
          <line x1={0} y1={-10} x2={0} y2={10} stroke={c.muted} strokeWidth={3} />
        </g>
      </g>
    ))}
    <rect x={112} y={-14} width={10} height={10} rx={3} fill={c.white} />
  </g>
);

export const Palm: React.FC<{ x: number; y: number; s?: number; sway?: number }> = ({ x, y, s = 1, sway = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={0} r={34} fill={c.green} opacity={0.12} />
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx={0} cy={-26} rx={9} ry={30} fill={c.green} transform={`rotate(${a + sway})`} opacity={0.95} />
    ))}
    {[36, 108, 180, 252, 324].map((a) => (
      <ellipse key={a} cx={0} cy={-20} rx={7} ry={22} fill={c.greenDark} transform={`rotate(${a + sway})`} />
    ))}
    <circle r={7} fill={c.amberDark} />
  </g>
);

export const Block: React.FC<{ x: number; y: number; w: number; h: number; tone?: "a" | "b" }> = ({ x, y, w, h, tone = "a" }) => (
  <g>
    <rect x={x + 6} y={y + 8} width={w} height={h} rx={26} fill={c.roadEdge} opacity={0.1} />
    <rect x={x} y={y} width={w} height={h} rx={26} fill={tone === "a" ? c.block : c.greenSoft} />
    <rect x={x + 16} y={y + 16} width={Math.max(w - 32, 10)} height={Math.max(h - 32, 10)} rx={16} fill={tone === "a" ? c.blockDark : c.green} opacity={tone === "a" ? 0.55 : 0.28} />
  </g>
);

/** Direction sign board on a pole: green board, white arrow. Origin at pole base. */
export const SignBoard: React.FC<{ x: number; y: number; dir: "left" | "right" | "up"; s?: number; sway?: number }> = ({ x, y, dir, s = 1, sway = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${sway}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={26} ry={7} fill={c.roadEdge} opacity={0.25} />
    <rect x={-6} y={-150} width={12} height={152} rx={4} fill={c.muted} />
    <rect x={-84} y={-250} width={168} height={118} rx={20} fill={c.green} stroke={c.white} strokeWidth={6} />
    <rect x={-72} y={-238} width={144} height={94} rx={12} fill="none" stroke={c.white} strokeWidth={2} opacity={0.6} />
    <g transform="translate(0 -191)">
      <Arrow dir={dir} s={1.05} />
    </g>
  </g>
);

export const ClockFace: React.FC<{ cx: number; cy: number; r: number; hour: number; minute: number; ring?: string; second?: number }> = ({ cx, cy, r, hour, minute, ring = c.green, second }) => (
  <g transform={`translate(${cx} ${cy})`}>
    <circle r={r + 14} fill={c.roadEdge} opacity={0.12} cy={10} />
    <circle r={r + 12} fill={ring} />
    <circle r={r} fill={c.white} />
    {Array.from({ length: 12 }).map((_, i) => (
      <line key={i} x1={0} y1={-r + 8} x2={0} y2={-r + (i % 3 === 0 ? 28 : 18)} stroke={c.text} strokeWidth={i % 3 === 0 ? 6 : 3} strokeLinecap="round" transform={`rotate(${i * 30})`} />
    ))}
    <line x1={0} y1={0} x2={0} y2={-r * 0.5} stroke={c.text} strokeWidth={r * 0.075} strokeLinecap="round" transform={`rotate(${hour})`} />
    <line x1={0} y1={0} x2={0} y2={-r * 0.74} stroke={c.green} strokeWidth={r * 0.055} strokeLinecap="round" transform={`rotate(${minute})`} />
    {second !== undefined && <line x1={0} y1={14} x2={0} y2={-r * 0.8} stroke={c.amber} strokeWidth={r * 0.03} strokeLinecap="round" transform={`rotate(${second})`} />}
    <circle r={r * 0.07} fill={c.amber} />
  </g>
);

/** Map pin, tip at origin. */
export const Pin: React.FC<{ x: number; y: number; s?: number; color?: string; pulse?: number; drop?: number }> = ({ x, y, s = 1, color = c.green, pulse = 0, drop = 0 }) => (
  <g transform={`translate(${x} ${y - drop}) scale(${s})`}>
    {pulse > 0 && <circle cx={0} cy={0} r={18 + pulse * 46} fill={color} opacity={0.35 * (1 - pulse)} />}
    <ellipse cx={0} cy={0} rx={16} ry={6} fill={c.roadEdge} opacity={0.25} />
    <path d="M0 0 C-26 -34 -34 -48 -34 -68 A34 34 0 1 1 34 -68 C34 -48 26 -34 0 0 Z" fill={color} stroke={c.white} strokeWidth={5} />
    <circle cx={0} cy={-68} r={13} fill={c.white} />
  </g>
);

export const DestFlag: React.FC<{ x: number; y: number; s?: number; drop?: number }> = ({ x, y, s = 1, drop = 0 }) => (
  <g transform={`translate(${x} ${y - drop}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={18} ry={6} fill={c.roadEdge} opacity={0.25} />
    <rect x={-4} y={-96} width={8} height={96} rx={3} fill={c.text} />
    <path d="M4 -96 L58 -80 L4 -62 Z" fill={c.amber} stroke={c.white} strokeWidth={4} strokeLinejoin="round" />
    <circle cx={0} cy={-98} r={7} fill={c.amber} stroke={c.white} strokeWidth={3} />
  </g>
);

export const QuestionMark: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = c.amber }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-22 -26 C-22 -62 22 -62 22 -28 C22 -6 0 -8 0 16" fill="none" stroke={color} strokeWidth={13} strokeLinecap="round" />
    <circle cx={0} cy={44} r={8.5} fill={color} />
  </g>
);

/** Flat, faceless passenger. Origin at feet. Optional raised arm with watch. */
export const Passenger: React.FC<{ x: number; y: number; s?: number; arm?: number; flip?: boolean }> = ({ x, y, s = 1, arm = 0, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={0} cy={2} rx={34} ry={8} fill={c.roadEdge} opacity={0.22} />
    <rect x={-22} y={-86} width={16} height={86} rx={8} fill={c.text} />
    <rect x={6} y={-86} width={16} height={86} rx={8} fill={c.text} />
    <rect x={-32} y={-190} width={64} height={116} rx={28} fill={c.green} />
    <g transform={`translate(26 -170) rotate(${arm})`}>
      <rect x={-9} y={0} width={18} height={92} rx={9} fill={c.green} />
      <rect x={-12} y={78} width={24} height={14} rx={7} fill={c.amber} />
      <circle cx={0} cy={104} r={11} fill={c.amberSoft} />
    </g>
    <rect x={-40} y={-176} width={18} height={84} rx={9} fill={c.green} />
    <circle cx={0} cy={-224} r={32} fill={c.amberSoft} stroke={c.amberDark} strokeWidth={3} />
  </g>
);

export const Bubble: React.FC<{ x: number; y: number; w: number; h: number; tail?: "left" | "right" | "down"; children?: React.ReactNode }> = ({ x, y, w, h, tail = "down", children }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2.4} fill={c.white} stroke={c.green} strokeWidth={5} />
    {tail === "down" && <path d={`M-18 ${h / 2 - 3} L-4 ${h / 2 + 30} L16 ${h / 2 - 3} Z`} fill={c.white} stroke={c.green} strokeWidth={5} strokeLinejoin="round" />}
    {tail === "down" && <rect x={-14} y={h / 2 - 8} width={26} height={10} fill={c.white} />}
    {children}
  </g>
);

/** Map backdrop: soft tile with a loose street grid. */
export const MapBackdrop: React.FC<{ w: number; h: number; shift?: number; zoom?: number }> = ({ w, h, shift = 0, zoom = 1 }) => (
  <g transform={`translate(${w / 2} ${h / 2}) scale(${zoom}) translate(${-w / 2 + shift} ${-h / 2})`}>
    <rect x={-300} y={-300} width={w + 600} height={h + 600} fill={c.greenMist} />
    {[-2, -1, 0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={`bx${i}`} x={i * 230 - 20} y={-300} width={14} height={h + 600} fill={c.white} />
    ))}
    {[-2, -1, 0, 1, 2, 3, 4].map((i) => (
      <rect key={`by${i}`} x={-300} y={i * 210 + 30} width={w + 600} height={14} fill={c.white} />
    ))}
    {[-1, 0, 1, 2, 3].map((i) =>
      [-1, 0, 1, 2, 3].map((j) => (
        <rect key={`k${i}-${j}`} x={i * 230 + 24} y={j * 210 + 54} width={168} height={140} rx={22} fill={(i + j) % 2 ? c.greenSoft : c.block} opacity={0.9} />
      )),
    )}
    <path d={`M-300 ${h * 0.62} C ${w * 0.2} ${h * 0.4} ${w * 0.6} ${h * 0.9} ${w + 300} ${h * 0.5}`} fill="none" stroke={c.amberSoft} strokeWidth={26} strokeLinecap="round" opacity={0.9} />
  </g>
);
