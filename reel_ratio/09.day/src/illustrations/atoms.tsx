import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const C = theme.colors;

export type IllusProps = {
  /** frames (scene-local) of key narration beats */
  ar: number;
  m: number;
  dur: number;
};

/** spring helper bound to current frame */
export const useSp = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return {
    f: frame,
    fps,
    sp: (delay: number, preset: keyof typeof theme.spring = "smooth") =>
      Math.min(1.25, Math.max(0, spring({ frame: frame - delay, fps, config: theme.spring[preset] }))),
  };
};

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Smartphone. Children use screen-centred coordinates and are clipped to the screen. */
export const Phone: React.FC<{
  cx: number; cy: number; w: number; h: number; rot?: number; scale?: number; id: string; children?: React.ReactNode; dark?: boolean;
}> = ({ cx, cy, w, h, rot = 0, scale = 1, id, children }) => (
  <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${scale})`}>
    <defs>
      <clipPath id={`clip-${id}`}>
        <rect x={-w / 2 + 10} y={-h / 2 + 10} width={w - 20} height={h - 20} rx={w * 0.12} />
      </clipPath>
    </defs>
    <rect x={-w / 2 + 6} y={-h / 2 + 18} width={w} height={h} rx={w * 0.17} fill={C.primaryMid} opacity={0.6} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.17} fill={C.text} />
    <rect x={-w / 2 + 10} y={-h / 2 + 10} width={w - 20} height={h - 20} rx={w * 0.12} fill={C.screen} />
    <g clipPath={`url(#clip-${id})`}>{children}</g>
    <rect x={-w * 0.14} y={-h / 2 + 18} width={w * 0.28} height={11} rx={5.5} fill={C.text} />
  </g>
);

export const arcPath = (cx: number, cy: number, r: number, a0 = -135, a1 = -45) => {
  const p = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};

/** Wi-Fi glyph. lit = how many of the 3 arcs are active (can be fractional via litOpacity) */
export const WifiGlyph: React.FC<{ cx: number; cy: number; r?: number; sw?: number; opacities: [number, number, number]; color?: string; dotColor?: string }> = ({
  cx, cy, r = 40, sw = 14, opacities, color = C.primary, dotColor,
}) => (
  <g>
    {[1, 2, 3].map((k, i) => (
      <path key={k} d={arcPath(cx, cy, r * k, -138, -42)} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" opacity={opacities[i]} />
    ))}
    <circle cx={cx} cy={cy} r={sw * 0.85} fill={dotColor ?? color} />
  </g>
);

export const Pin: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = C.accent }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -34 C-20 -34 -30 -20 -30 -6 C-30 16 0 42 0 42 C0 42 30 16 30 -6 C30 -20 20 -34 0 -34 Z" fill={color} stroke={C.text} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={0} cy={-8} r={10} fill={C.white} />
  </g>
);

export const Bolt: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = C.primary }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M6 -26 L-14 6 H-2 L-8 28 L14 -6 H2 Z" fill={color} stroke={C.text} strokeWidth={3} strokeLinejoin="round" />
);

export const Handset: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = C.white }) => (
  <path transform={`translate(${x} ${y}) scale(${s}) translate(-24 -24)`} d="M10 6 L18 4 L22 14 L17 18 C19 24 24 29 30 31 L34 26 L44 30 L42 38 C41 41 38 44 34 44 C18 44 4 30 4 14 C4 10 6 7 10 6 Z" fill={color} />
);

export const Avatar: React.FC<{ x: number; y: number; shirt?: string; s?: number; mood?: "ok" | "worry" }> = ({ x, y, shirt = C.primary, s = 1, mood = "ok" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-74 130 C-74 56 -42 24 0 24 C42 24 74 56 74 130 Z" fill={shirt} stroke={C.text} strokeWidth={7} strokeLinejoin="round" />
    <circle cx={0} cy={-34} r={48} fill={C.white} stroke={C.text} strokeWidth={7} />
    <circle cx={-17} cy={-38} r={5.5} fill={C.text} />
    <circle cx={17} cy={-38} r={5.5} fill={C.text} />
    {mood === "ok" ? (
      <path d="M-15 -14 Q0 -2 15 -14" fill="none" stroke={C.text} strokeWidth={5} strokeLinecap="round" />
    ) : (
      <path d="M-14 -10 Q0 -20 14 -10" fill="none" stroke={C.text} strokeWidth={5} strokeLinecap="round" />
    )}
  </g>
);

export const Bubble: React.FC<{ x: number; y: number; w: number; h: number; tail?: "left" | "right"; fill?: string; children?: React.ReactNode }> = ({
  x, y, w, h, tail = "left", fill = C.white, children,
}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width={w} height={h} rx={Math.min(40, h / 2)} fill={fill} stroke={C.text} strokeWidth={6} />
    <path d={tail === "left" ? `M${w * 0.22} ${h - 3} L${w * 0.14} ${h + 38} L${w * 0.4} ${h - 3}` : `M${w * 0.78} ${h - 3} L${w * 0.86} ${h + 38} L${w * 0.6} ${h - 3}`} fill={fill} stroke={C.text} strokeWidth={6} strokeLinejoin="round" />
    <path d={tail === "left" ? `M${w * 0.225} ${h - 1} L${w * 0.395} ${h - 1}` : `M${w * 0.605} ${h - 1} L${w * 0.775} ${h - 1}`} stroke={fill} strokeWidth={9} />
    {children}
  </g>
);

export const QMark: React.FC<{ x: number; y: number; size?: number; color?: string }> = ({ x, y, size = 80, color = C.accent }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={theme.fonts.latin} fontWeight={700} fontSize={size} fill={color} stroke={C.text} strokeWidth={size * 0.06} paintOrder="stroke">?</text>
);

export const Charger: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-18} y={-76} width={10} height={26} rx={4} fill={C.text} />
    <rect x={8} y={-76} width={10} height={26} rx={4} fill={C.text} />
    <rect x={-38} y={-54} width={76} height={92} rx={18} fill={C.white} stroke={C.text} strokeWidth={6} />
    <Bolt x={0} y={-8} s={1.05} />
    <path d="M0 38 C0 80 -30 80 -30 120" fill="none" stroke={C.text} strokeWidth={8} strokeLinecap="round" />
  </g>
);

export const PhotoArt: React.FC<{ w: number; h: number; rx?: number; tint?: string; sun?: string }> = ({ w, h, rx = 14, tint = C.primaryMid, sun = C.accent }) => {
  const id = `pc-${Math.round(w)}-${Math.round(h)}`;
  return (
    <g>
      <clipPath id={id}><rect width={w} height={h} rx={rx} /></clipPath>
      <g clipPath={`url(#${id})`}>
        <rect width={w} height={h} fill={tint} />
        <circle cx={w * 0.72} cy={h * 0.3} r={Math.min(w, h) * 0.13} fill={sun} />
        <path d={`M0 ${h} L${w * 0.32} ${h * 0.46} L${w * 0.55} ${h * 0.74} L${w * 0.72} ${h * 0.56} L${w} ${h * 0.9} L${w} ${h} Z`} fill={C.primary} opacity={0.9} />
        <path d={`M0 ${h} L${w * 0.32} ${h * 0.46} L${w * 0.42} ${h * 0.62} L${w * 0.2} ${h} Z`} fill={C.text} opacity={0.18} />
      </g>
    </g>
  );
};
