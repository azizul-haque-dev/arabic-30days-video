import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, springOf, SpringName } from "../theme";

const c = theme.colors;
const TAU = Math.PI * 2;

/** Seconds since the illustration entered (local Sequence frame / fps). */
export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/** Spring pop-in for an SVG group. Animates opacity + translate + scale together. */
export const Pop: React.FC<{
  x?: number;
  y?: number;
  delay?: number;
  dx?: number;
  dy?: number;
  from?: number;
  preset?: SpringName;
  rotate?: number;
  children: React.ReactNode;
}> = ({ x = 0, y = 0, delay = 0, dx = 0, dy = 30, from = 0.7, preset = "pop", rotate = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springOf(frame, fps, Math.round(delay * fps), preset);
  const op = interpolate(frame, [delay * fps, delay * fps + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = interpolate(p, [0, 1], [from, 1]);
  return (
    <g opacity={op} transform={`translate(${x + (1 - p) * dx} ${y + (1 - p) * dy}) rotate(${rotate}) scale(${s})`}>
      {children}
    </g>
  );
};

/** Wraps SVG content: soft backdrop disc + floor shadow. Canvas is 900×720. */
export const Stage: React.FC<{ children: React.ReactNode; wall?: boolean }> = ({ children, wall = true }) => (
  <svg viewBox="0 0 900 720" width="100%" height="100%" style={{ overflow: "visible" }}>
    {wall && (
      <g>
        <rect x="20" y="40" width="860" height="620" rx="64" fill={c.white} opacity={0.72} />
        <rect x="20" y="560" width="860" height="100" rx="0" fill={c.mint} opacity={0.9} />
        <path d="M20 560 H880 V596 a64 64 0 0 1 -64 64 H84 a64 64 0 0 1 -64 -64z" fill={c.mint} />
        <rect x="20" y="556" width="860" height="8" fill={c.primary} opacity={0.15} />
      </g>
    )}
    {children}
  </svg>
);

/* ───────────── Characters ───────────── */

export type Mood = "neutral" | "smile" | "surprised" | "frown" | "ask";

export const Person: React.FC<{
  x: number;
  y: number;
  s?: number;
  kind: "customer" | "shop";
  mood?: Mood;
  /** hand positions relative to the shoulder (unscaled) */
  armL?: [number, number];
  armR?: [number, number];
  holdR?: React.ReactNode;
  tilt?: number;
  flip?: boolean;
  bob?: number;
  top?: string;
}> = ({ x, y, s = 1, kind, mood = "neutral", armL = [-28, 120], armR = [28, 120], holdR, tilt = 0, flip = false, bob = 1, top }) => {
  const t = useT();
  const bobY = Math.sin(t * TAU * 0.55) * 3 * bob;
  const shop = kind === "shop";
  const sleeve = shop ? c.cloth : top ?? c.primary;
  const SH = { l: [-62, -292], r: [62, -292] };
  const handL = [SH.l[0] + armL[0], SH.l[1] + armL[1]];
  const handR = [SH.r[0] + armR[0], SH.r[1] + armR[1]];
  const eyeR = mood === "surprised" ? 8 : 6;
  const brow = (side: -1 | 1) => {
    if (mood === "surprised") return `M ${side * 30} -412 q ${-side * 12} -14 ${-side * 28} -2`;
    if (mood === "frown") return `M ${side * 34} -404 L ${side * 10} -412`;
    if (mood === "ask") return `M ${side * 30} -406 q ${-side * 12} ${side === 1 ? -14 : -4} ${-side * 26} 0`;
    return `M ${side * 30} -408 q ${-side * 12} -6 ${-side * 26} 0`;
  };
  const mouth =
    mood === "smile" ? <path d="M -24 -360 q 24 26 48 0" fill="none" stroke={c.text} strokeWidth={6} strokeLinecap="round" /> :
    mood === "surprised" ? <ellipse cx={0} cy={-352} rx={13} ry={18} fill={c.text} /> :
    mood === "frown" ? <path d="M -22 -348 q 22 -20 44 0" fill="none" stroke={c.text} strokeWidth={6} strokeLinecap="round" /> :
    mood === "ask" ? <ellipse cx={0} cy={-354} rx={11} ry={9} fill={c.text} /> :
    <path d="M -16 -356 h 32" stroke={c.text} strokeWidth={6} strokeLinecap="round" />;

  return (
    <g transform={`translate(${x} ${y + bobY}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={0} cy={4} rx={100} ry={16} fill={c.shadow} />
      {shop ? (
        <path d="M -70 -300 Q -74 -150 -86 -10 H 86 Q 74 -150 70 -300 Q 0 -330 -70 -300Z" fill={c.cloth} stroke={c.mint} strokeWidth={4} />
      ) : (
        <>
          <rect x={-42} y={-140} width={34} height={136} rx={14} fill={c.slate} />
          <rect x={8} y={-140} width={34} height={136} rx={14} fill={c.slate} />
          <ellipse cx={-30} cy={-4} rx={30} ry={11} fill={c.text} />
          <ellipse cx={30} cy={-4} rx={30} ry={11} fill={c.text} />
          <rect x={-66} y={-314} width={132} height={196} rx={40} fill={sleeve} />
        </>
      )}
      {/* arms */}
      <line x1={SH.l[0]} y1={SH.l[1]} x2={handL[0]} y2={handL[1]} stroke={sleeve} strokeWidth={32} strokeLinecap="round" />
      <circle cx={handL[0]} cy={handL[1]} r={18} fill={c.skin} />
      <line x1={SH.r[0]} y1={SH.r[1]} x2={handR[0]} y2={handR[1]} stroke={sleeve} strokeWidth={32} strokeLinecap="round" />
      <circle cx={handR[0]} cy={handR[1]} r={18} fill={c.skin} />
      {holdR && <g transform={`translate(${handR[0]} ${handR[1]})`}>{holdR}</g>}
      {/* head */}
      <g transform={`rotate(${tilt} 0 -330)`}>
        <rect x={-15} y={-336} width={30} height={30} rx={10} fill={c.skinDark} />
        {shop && <path d="M -74 -380 a 74 74 0 0 1 148 0 v 70 Q 0 -290 -74 -310z" fill={c.cloth} stroke={c.mint} strokeWidth={4} />}
        <circle cx={0} cy={-380} r={shop ? 54 : 58} fill={c.skin} />
        {shop ? (
          <>
            <path d="M -60 -392 a 60 60 0 0 1 120 0 q -60 -26 -120 0z" fill={c.cloth} stroke={c.mint} strokeWidth={4} />
            <ellipse cx={0} cy={-436} rx={50} ry={10} fill="none" stroke={c.hair} strokeWidth={10} />
          </>
        ) : (
          <path d="M -58 -386 a 58 58 0 0 1 116 0 q -30 -30 -58 -24 q -30 -6 -58 24z" fill={c.hair} />
        )}
        <circle cx={-21} cy={-382} r={eyeR} fill={c.text} />
        <circle cx={21} cy={-382} r={eyeR} fill={c.text} />
        <path d={brow(-1)} fill="none" stroke={c.text} strokeWidth={5} strokeLinecap="round" />
        <path d={brow(1)} fill="none" stroke={c.text} strokeWidth={5} strokeLinecap="round" />
        <circle cx={-38} cy={-362} r={9} fill={c.rose} opacity={0.35} />
        <circle cx={38} cy={-362} r={9} fill={c.rose} opacity={0.35} />
        {mouth}
      </g>
    </g>
  );
};

/* ───────────── Props ───────────── */

export const Shirt: React.FC<{
  x: number;
  y: number;
  s?: number;
  color: string;
  hanger?: boolean;
  rotate?: number;
  label?: string;
  labelColor?: string;
}> = ({ x, y, s = 1, color, hanger = true, rotate = 0, label, labelColor = c.white }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
    {hanger && (
      <g stroke={c.slate} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 0 6 V -10 q 0 -16 16 -16 q 12 0 12 12" />
        <path d="M -86 34 L 0 6 L 86 34" />
      </g>
    )}
    <path d="M -40 8 L -100 44 L -72 94 L -48 80 L -48 196 L 48 196 L 48 80 L 72 94 L 100 44 L 40 8 Q 0 40 -40 8Z" fill={color} />
    <path d="M -40 8 Q 0 40 40 8" fill="none" stroke={c.white} strokeWidth={6} opacity={0.45} strokeLinecap="round" />
    <path d="M -48 80 L -48 196 M 48 80 L 48 196" stroke={c.text} strokeWidth={3} opacity={0.1} />
    {label && (
      <text x={0} y={140} textAnchor="middle" fontFamily={theme.fonts.en} fontWeight={700} fontSize={58} fill={labelColor}>
        {label}
      </text>
    )}
  </g>
);

export const PriceTag: React.FC<{
  x: number;
  y: number;
  label: string;
  s?: number;
  rotate?: number;
  fill?: string;
  textColor?: string;
  strike?: boolean;
  fontSize?: number;
}> = ({ x, y, label, s = 1, rotate = 0, fill = c.accent, textColor = c.text, strike = false, fontSize = 40 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
    <path d="M -16 -30 Q -40 -80 -90 -78" fill="none" stroke={c.slate} strokeWidth={4} strokeLinecap="round" />
    <path d="M -70 -36 H 40 L 80 0 L 40 36 H -70 a 14 14 0 0 1 -14 -14 V -22 a 14 14 0 0 1 14 -14z" fill={fill} />
    <circle cx={-56} cy={0} r={8} fill={c.white} />
    <text x={4} y={fontSize * 0.36} textAnchor="middle" fontFamily={theme.fonts.en} fontWeight={700} fontSize={fontSize} fill={textColor}>
      {label}
    </text>
    {strike && <line x1={-50} y1={20} x2={50} y2={-18} stroke={c.danger} strokeWidth={6} strokeLinecap="round" />}
  </g>
);

export const Coin: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={28} fill={c.accent} />
    <circle r={20} fill="none" stroke={c.accentDark} strokeWidth={4} />
    <rect x={-4} y={-12} width={8} height={24} rx={4} fill={c.accentDark} />
  </g>
);

export const Counter: React.FC<{ x: number; w: number }> = ({ x, w }) => (
  <g>
    <rect x={x} y={470} width={w} height={170} rx={18} fill={c.accentDark} />
    <rect x={x - 14} y={450} width={w + 28} height={30} rx={14} fill={c.accent} />
    <rect x={x + 22} y={500} width={w - 44} height={110} rx={12} fill={c.accent} opacity={0.35} />
  </g>
);

export const Bubble: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  tail?: "left" | "right";
  children?: React.ReactNode;
  fill?: string;
}> = ({ x, y, w, h, tail = "left", children, fill = c.white }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={0} width={w} height={h} rx={h / 2.4} fill={fill} stroke={c.primary} strokeWidth={5} />
    <path
      d={tail === "left" ? `M ${w * 0.22} ${h - 2} l -14 34 l 40 -34z` : `M ${w * 0.78} ${h - 2} l 14 34 l -40 -34z`}
      fill={fill}
      stroke={c.primary}
      strokeWidth={5}
      strokeLinejoin="round"
    />
    <rect x={w * 0.22 - 6} y={h - 8} width={44} height={10} fill={fill} />
    <g transform={`translate(${w / 2} ${h / 2})`}>{children}</g>
  </g>
);

export const Glyph: React.FC<{ children: React.ReactNode; size?: number; color?: string; x?: number; y?: number }> = ({
  children,
  size = 64,
  color = c.primary,
  x = 0,
  y = 0,
}) => (
  <text x={x} y={y + size * 0.35} textAnchor="middle" fontFamily={theme.fonts.en} fontWeight={700} fontSize={size} fill={color}>
    {children}
  </text>
);

export const Arrow: React.FC<{ x: number; y: number; dir: "up" | "down" | "right"; color?: string; s?: number }> = ({ x, y, dir, color = c.primary, s = 1 }) => {
  const rot = dir === "up" ? 180 : dir === "right" ? -90 : 0;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M -16 -34 H 16 V 4 H 36 L 0 44 L -36 4 H -16Z" fill={color} strokeLinejoin="round" />
    </g>
  );
};

export const Sparkle: React.FC<{ x: number; y: number; s?: number; color?: string; phase?: number }> = ({ x, y, s = 1, color = c.accent, phase = 0 }) => {
  const t = useT();
  const k = 0.75 + 0.25 * Math.sin(t * TAU * 0.8 + phase);
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s * k}) rotate(${Math.sin(t + phase) * 10})`}
      d="M 0 -26 Q 4 -4 26 0 Q 4 4 0 26 Q -4 4 -26 0 Q -4 -4 0 -26Z"
      fill={color}
    />
  );
};

export const ShoppingBag: React.FC<{ x: number; y: number; s?: number; color: string; accent?: string; rotate?: number }> = ({
  x,
  y,
  s = 1,
  color,
  accent = c.white,
  rotate = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
    <path d="M -34 -86 q 0 -42 34 -42 q 34 0 34 42" fill="none" stroke={c.slate} strokeWidth={9} strokeLinecap="round" />
    <path d="M -76 -84 H 76 L 88 120 Q 88 134 74 134 H -74 Q -88 134 -88 120Z" fill={color} />
    <path d="M -76 -84 H 76 L 80 -40 H -80Z" fill={c.text} opacity={0.1} />
    <circle cx={0} cy={22} r={26} fill={accent} opacity={0.95} />
    <path d="M -10 22 l 7 8 l 14 -16" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

export const Cart: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -120 -110 H -80 L -40 40 H 100 L 130 -60 H -66" fill="none" stroke={c.slate} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M -62 -50 H 118 L 96 28 H -38Z" fill={c.primary} opacity={0.9} />
    <circle cx={-20} cy={78} r={20} fill={c.slate} />
    <circle cx={80} cy={78} r={20} fill={c.slate} />
    <circle cx={-20} cy={78} r={8} fill={c.white} />
    <circle cx={80} cy={78} r={8} fill={c.white} />
  </g>
);
