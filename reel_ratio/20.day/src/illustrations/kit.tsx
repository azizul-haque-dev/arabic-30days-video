import React from "react";
import { theme } from "../theme";
import { ease, useBreath, useFrame, useSpringAt } from "../anim";

const c = theme.colors;

/** SVG group that enters with spring (opacity + translate + scale together). */
export const Pop: React.FC<{
  start: number;
  x?: number;
  y?: number;
  dx?: number;
  dy?: number;
  from?: number;
  origin?: [number, number];
  exitAt?: number;
  children: React.ReactNode;
  config?: typeof theme.spring.pop;
}> = ({ start, x = 0, y = 0, dx = 0, dy = 40, from = 0.7, origin = [0, 0], exitAt, children, config = theme.spring.pop }) => {
  const frame = useFrame();
  const p = useSpringAt(start, config);
  const o = ease(frame, start, start + 8);
  const ex = exitAt === undefined ? 0 : ease(frame, exitAt - 8, exitAt, theme.ease.in);
  const s = from + (1 - from) * p;
  const [ox, oy] = origin;
  return (
    <g opacity={o * (1 - ex)} transform={`translate(${x + (1 - p) * dx} ${y + (1 - p) * dy})`}>
      <g transform={`translate(${ox} ${oy}) scale(${s}) translate(${-ox} ${-oy})`}>{children}</g>
    </g>
  );
};

/** Idle breathing wrapper. */
export const Breathe: React.FC<{ amp?: number; period?: number; phase?: number; children: React.ReactNode }> = ({ amp = 4, period = 100, phase = 0, children }) => {
  const b = useBreath(amp, period, phase);
  return <g transform={`translate(0 ${b})`}>{children}</g>;
};

type PersonProps = {
  x: number;
  y: number;
  scale?: number;
  kind: "manager" | "employee" | "colleague";
  flip?: boolean;
  /** arm targets relative to the person origin (shoulder-to-hand) */
  armL?: [number, number];
  armR?: [number, number];
  skin?: string;
};

/** Abstract flat-vector person (bust). Origin = bottom centre of the torso. */
export const Person: React.FC<PersonProps> = ({ x, y, scale = 1, kind, flip = false, armL = [-70, -40], armR = [70, -40], skin }) => {
  const sk = skin ?? (kind === "manager" ? c.skin2 : kind === "employee" ? c.skin3 : c.skin1);
  const shirt = kind === "manager" ? "#F8FAFC" : kind === "employee" ? c.primary : c.slate;
  const sx = flip ? -1 : 1;
  const arm = (to: [number, number], side: -1 | 1) => (
    <g>
      <path d={`M ${side * 52} -128 Q ${side * 70} ${(-128 + to[1]) / 2 - 10} ${to[0]} ${to[1]}`} stroke={shirt} strokeWidth={30} strokeLinecap="round" fill="none" />
      <path d={`M ${side * 52} -128 Q ${side * 70} ${(-128 + to[1]) / 2 - 10} ${to[0]} ${to[1]}`} stroke="rgba(0,0,0,0.06)" strokeWidth={30} strokeLinecap="round" fill="none" />
      <circle cx={to[0]} cy={to[1]} r={16} fill={sk} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${sx * scale} ${scale})`}>
      {/* torso */}
      <path d="M -70 0 L -70 -90 Q -70 -150 -20 -152 L 20 -152 Q 70 -150 70 -90 L 70 0 Z" fill={shirt} />
      <path d="M -70 0 L -70 -90 Q -70 -150 -20 -152 L 20 -152 Q 70 -150 70 -90 L 70 0 Z" fill="rgba(0,0,0,0.04)" />
      {kind === "employee" && <path d="M -26 -152 L 0 -118 L 26 -152 Z" fill="#DCFCE7" />}
      {kind === "manager" && <rect x={-3} y={-146} width={6} height={110} fill="rgba(0,0,0,0.08)" />}
      {kind === "colleague" && <path d="M -26 -152 L 0 -112 L 26 -152 Z" fill="#F8FAFC" />}
      {/* neck + head */}
      <rect x={-14} y={-168} width={28} height={24} rx={8} fill={sk} />
      <circle cx={0} cy={-200} r={46} fill={sk} />
      {/* headwear / hair */}
      {kind === "manager" && (
        <g>
          <path d="M -50 -200 Q -52 -258 0 -258 Q 52 -258 50 -200 Q 50 -214 36 -226 Q 0 -240 -36 -226 Q -50 -214 -50 -200 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth={2} />
          <path d="M -50 -200 Q -64 -170 -52 -140 L -34 -150 Q -42 -180 -40 -214 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth={2} />
          <path d="M 50 -200 Q 64 -170 52 -140 L 34 -150 Q 42 -180 40 -214 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth={2} />
          <rect x={-46} y={-236} width={92} height={9} rx={4.5} fill="#171717" />
        </g>
      )}
      {kind === "employee" && (
        <g>
          <path d="M -48 -204 Q -48 -258 0 -258 Q 48 -258 48 -204 Z" fill={c.amber} />
          <rect x={-54} y={-208} width={108} height={12} rx={6} fill="#D97706" />
          <rect x={-8} y={-262} width={16} height={14} rx={5} fill="#D97706" />
        </g>
      )}
      {kind === "colleague" && <path d="M -46 -204 Q -50 -256 0 -256 Q 50 -256 46 -204 Q 34 -232 0 -232 Q -34 -232 -46 -204 Z" fill="#292524" />}
      {/* face */}
      <circle cx={-16} cy={-196} r={4.5} fill="#171717" />
      <circle cx={16} cy={-196} r={4.5} fill="#171717" />
      <path d="M -13 -178 Q 0 -168 13 -178" stroke="#171717" strokeWidth={4} strokeLinecap="round" fill="none" />
      {arm(armL, -1)}
      {arm(armR, 1)}
    </g>
  );
};

/** Generic card container with soft shadow. */
export const CardBox: React.FC<{ x: number; y: number; w: number; h: number; fill?: string; stroke?: string; r?: number; dashed?: boolean; children?: React.ReactNode }> = ({ x, y, w, h, fill = c.white, stroke = c.border, r = 24, dashed, children }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={4} y={10} width={w} height={h} rx={r} fill="rgba(20,83,45,0.12)" />
    <rect width={w} height={h} rx={r} fill={fill} stroke={stroke} strokeWidth={3} strokeDasharray={dashed ? "14 10" : undefined} />
    {children}
  </g>
);

export const Lines: React.FC<{ x: number; y: number; widths: number[]; gap?: number; color?: string; h?: number }> = ({ x, y, widths, gap = 22, color = c.border, h = 10 }) => (
  <g>
    {widths.map((w, i) => (
      <rect key={i} x={x} y={y + i * gap} width={w} height={h} rx={h / 2} fill={color} />
    ))}
  </g>
);

export const Check: React.FC<{ x: number; y: number; r?: number; color?: string; progress?: number }> = ({ x, y, r = 22, color = c.primary, progress = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${0.4 + 0.6 * progress})`} opacity={progress}>
    <circle r={r} fill={color} />
    <path d={`M ${-r * 0.42} ${r * 0.02} L ${-r * 0.1} ${r * 0.36} L ${r * 0.46} ${-r * 0.3}`} stroke="#fff" strokeWidth={r * 0.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </g>
);

export const Cross: React.FC<{ x: number; y: number; r?: number; color?: string; progress?: number }> = ({ x, y, r = 22, color = c.danger, progress = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${0.4 + 0.6 * progress})`} opacity={progress}>
    <circle r={r} fill={color} />
    <path d={`M ${-r * 0.36} ${-r * 0.36} L ${r * 0.36} ${r * 0.36} M ${r * 0.36} ${-r * 0.36} L ${-r * 0.36} ${r * 0.36}`} stroke="#fff" strokeWidth={r * 0.2} strokeLinecap="round" />
  </g>
);

export const Briefcase: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = c.dark }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -22 -34 L -22 -44 Q -22 -52 -14 -52 L 14 -52 Q 22 -52 22 -44 L 22 -34" fill="none" stroke={color} strokeWidth={8} />
    <rect x={-50} y={-36} width={100} height={72} rx={14} fill={color} />
    <rect x={-50} y={-6} width={100} height={8} fill="rgba(255,255,255,0.25)" />
    <rect x={-9} y={-12} width={18} height={20} rx={4} fill={c.amber} />
  </g>
);

export const Clock: React.FC<{ x: number; y: number; r?: number; hour: number; min: number; color?: string }> = ({ x, y, r = 70, hour, min, color = c.dark }) => {
  const ha = ((hour % 12) + min / 60) * 30;
  const ma = min * 6;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={c.white} stroke={color} strokeWidth={8} />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={-2} y={-r + 10} width={4} height={i % 3 === 0 ? 14 : 8} rx={2} fill={color} transform={`rotate(${i * 30})`} />
      ))}
      <rect x={-4} y={-r * 0.5} width={8} height={r * 0.5} rx={4} fill={color} transform={`rotate(${ha})`} />
      <rect x={-3} y={-r * 0.74} width={6} height={r * 0.74} rx={3} fill={c.primary} transform={`rotate(${ma})`} />
      <circle r={7} fill={c.amber} />
    </g>
  );
};

/** Generic ID-style card (no real data) used for Iqama and licence. */
export const IdCard: React.FC<{ x: number; y: number; w?: number; h?: number; accent: string; stripe?: string }> = ({ x, y, w = 420, h = 260, accent, stripe }) => (
  <CardBox x={x} y={y} w={w} h={h} r={28} fill={c.white} stroke={accent}>
    <rect width={w} height={64} rx={28} fill={accent} />
    <rect y={36} width={w} height={28} fill={accent} />
    <circle cx={44} cy={32} r={14} fill="rgba(255,255,255,0.85)" />
    <Lines x={72} y={24} widths={[110, 70]} gap={18} color="rgba(255,255,255,0.7)" h={8} />
    <rect x={28} y={90} width={100} height={120} rx={16} fill={c.soft} />
    <circle cx={78} cy={134} r={24} fill={c.border} />
    <path d="M 38 206 Q 78 150 118 206 Z" fill={c.border} />
    <Lines x={160} y={102} widths={[200, 160, 190, 120]} gap={30} color={c.border} h={12} />
    {stripe && <rect y={h - 26} width={w} height={26} rx={0} fill={stripe} opacity={0.18} />}
  </CardBox>
);

export const Spark: React.FC<{ x: number; y: number; s?: number; color?: string; opacity?: number; rot?: number }> = ({ x, y, s = 1, color = c.amber, opacity = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={opacity}>
    <path d="M 0 -16 Q 2 -2 16 0 Q 2 2 0 16 Q -2 2 -16 0 Q -2 -2 0 -16 Z" fill={color} />
  </g>
);
