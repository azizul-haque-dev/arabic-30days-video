import React from "react";
import {C, I} from "../../theme";

export type IllProps = {t: number; p1: number; p2: number; m: number; end: number};

export const Room: React.FC<{id: string; top?: string; bottom?: string; floorY?: number; floor?: string; dark?: number}> = ({
  id, top = I.wall, bottom = I.wall2, floorY = 440, floor = I.floor,
}) => (
  <g>
    <defs>
      <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={top} />
        <stop offset="1" stopColor={bottom} />
      </linearGradient>
      <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={floor} />
        <stop offset="1" stopColor={C.primary} stopOpacity={0.55} />
      </linearGradient>
    </defs>
    <rect x={0} y={0} width={920} height={floorY} fill={`url(#${id}-wall)`} />
    <rect x={0} y={floorY} width={920} height={580 - floorY} fill={`url(#${id}-floor)`} />
    <rect x={0} y={floorY - 14} width={920} height={14} fill={C.white} opacity={0.7} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <line key={i} x1={i * 190 - 40} y1={floorY} x2={i * 230 - 150} y2={580} stroke={C.white} strokeOpacity={0.25} strokeWidth={3} />
    ))}
  </g>
);

export const Sparkle: React.FC<{x: number; y: number; s: number; t: number; ph?: number; color?: string}> = ({x, y, s, t, ph = 0, color = C.amber}) => {
  const k = 0.55 + 0.45 * Math.sin(t * 4 + ph);
  return (
    <path
      d="M0 -1 Q0.12 -0.12 1 0 Q0.12 0.12 0 1 Q-0.12 0.12 -1 0 Q-0.12 -0.12 0 -1Z"
      transform={`translate(${x} ${y}) scale(${s * k}) rotate(${t * 20})`}
      fill={color}
    />
  );
};

export const Table: React.FC<{x: number; y: number; w: number; legH?: number}> = ({x, y, w, legH = 150}) => (
  <g>
    <rect x={x + 30} y={y} width={22} height={legH} rx={6} fill={I.woodDark} />
    <rect x={x + w - 52} y={y} width={22} height={legH} rx={6} fill={I.woodDark} />
    <rect x={x + 10} y={y + 24} width={w - 20} height={28} fill={I.woodDark} />
    <rect x={x} y={y} width={w} height={26} rx={10} fill={I.wood} />
    <rect x={x} y={y} width={w} height={8} rx={4} fill={C.white} opacity={0.28} />
  </g>
);
