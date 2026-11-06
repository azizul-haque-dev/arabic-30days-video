import React from "react";
import {C, I} from "../theme";

/** Consistent flat icon set drawn in a 100×100 box (centred on 50,50). */
type P = {size?: number; x?: number; y?: number; rot?: number; opacity?: number};
const wrap = (p: P, children: React.ReactNode) => {
  const s = (p.size ?? 100) / 100;
  return (
    <g transform={`translate(${p.x ?? 0} ${p.y ?? 0}) rotate(${p.rot ?? 0}) scale(${s}) translate(-50 -50)`} opacity={p.opacity ?? 1}>
      {children}
    </g>
  );
};

export const KeyIcon = (p: P & {color?: string}) =>
  wrap(p, (
    <>
      <circle cx={30} cy={50} r={20} fill={p.color ?? C.amber} />
      <circle cx={30} cy={50} r={8} fill={C.white} />
      <rect x={46} y={44} width={44} height={12} rx={5} fill={p.color ?? C.amber} />
      <rect x={72} y={54} width={8} height={14} rx={3} fill={p.color ?? C.amber} />
      <rect x={84} y={54} width={8} height={10} rx={3} fill={p.color ?? C.amber} />
    </>
  ));

export const DoorIcon = (p: P) =>
  wrap(p, (
    <>
      <rect x={24} y={8} width={52} height={86} rx={6} fill={I.wood} />
      <rect x={32} y={18} width={36} height={30} rx={4} fill={I.woodDark} opacity={0.5} />
      <rect x={32} y={54} width={36} height={30} rx={4} fill={I.woodDark} opacity={0.5} />
      <circle cx={66} cy={56} r={5} fill={C.amber} />
    </>
  ));

export const WindowIcon = (p: P) =>
  wrap(p, (
    <>
      <rect x={12} y={12} width={76} height={76} rx={8} fill={I.sky} stroke={C.white} strokeWidth={8} />
      <path d="M50 12 V88 M12 50 H88" stroke={C.white} strokeWidth={6} />
      <circle cx={34} cy={32} r={8} fill={C.amber} />
    </>
  ));

export const ACIcon = (p: P) =>
  wrap(p, (
    <>
      <rect x={6} y={22} width={88} height={38} rx={12} fill={C.white} stroke={I.metalDark} strokeWidth={3} />
      <rect x={16} y={46} width={68} height={6} rx={3} fill={I.metal} />
      <circle cx={80} cy={34} r={3.5} fill={C.primary} />
      <path d="M24 72 q6 8 0 16 M50 72 q6 8 0 16 M76 72 q6 8 0 16" stroke={I.cool} strokeWidth={4} fill="none" strokeLinecap="round" />
    </>
  ));

export const BoltIcon = (p: P & {color?: string}) =>
  wrap(p, <path d="M56 6 L22 56 H46 L38 94 L78 40 H54 Z" fill={p.color ?? C.amber} stroke={C.white} strokeWidth={4} strokeLinejoin="round" />);

export const DropIcon = (p: P & {color?: string}) =>
  wrap(p, (
    <>
      <path d="M50 8 C50 8 18 46 18 64 a32 32 0 0 0 64 0 C82 46 50 8 50 8Z" fill={p.color ?? I.cool} />
      <path d="M36 62 a14 14 0 0 0 10 16" stroke={C.white} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />
    </>
  ));

export const ToiletIcon = (p: P) =>
  wrap(p, (
    <>
      <circle cx={30} cy={20} r={9} fill={C.white} />
      <path d="M20 34 h20 l4 26 h-6 v24 h-8 v-24 h-4 v24 h-8 v-24 h-6 Z" fill={C.white} transform="translate(0 -2)" />
      <circle cx={72} cy={20} r={9} fill={C.white} />
      <path d="M72 32 l16 40 h-12 v14 h-8 v-14 h-12 Z" fill={C.white} transform="translate(0 -2)" />
    </>
  ));

export const Bubble: React.FC<{x: number; y: number; w: number; h: number; text: string; fill?: string; color?: string; size?: number; tail?: "l" | "r"; opacity?: number; scale?: number}> = ({
  x, y, w, h, text, fill = C.white, color = C.dark, size = 40, tail = "l", opacity = 1, scale = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2.6} fill={fill} />
    <path d={tail === "l" ? `M${-w / 4} ${h / 2 - 2} l-16 26 l36 -26Z` : `M${w / 4} ${h / 2 - 2} l16 26 l-36 -26Z`} fill={fill} />
    <text x={0} y={size * 0.34} textAnchor="middle" fontFamily="'Noto Naskh Arabic'" fontWeight={700} fontSize={size} fill={color} direction="rtl">
      {text}
    </text>
  </g>
);
