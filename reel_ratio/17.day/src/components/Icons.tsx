import React from "react";
import { theme } from "../theme";

const A = theme.art;

export const WaveHand: React.FC<{ size: number; angle: number }> = ({ size, angle }) => (
  <div data-lbox="wave-hand" data-lkind="chrome" style={{ width: size, height: size }}>
    <svg width={size} height={size} viewBox="0 0 140 140" style={{ display: "block", overflow: "hidden" }}>
      <g transform={`rotate(${angle} 70 124)`}>
        {[
          { x: 30, y: 26, h: 56 },
          { x: 50, y: 14, h: 66 },
          { x: 70, y: 12, h: 68 },
          { x: 90, y: 22, h: 58 },
        ].map((f) => (
          <rect key={f.x} x={f.x} y={f.y} width={17} height={f.h} rx={8.5} fill={A.skinA} />
        ))}
        <rect x={26} y={60} width={82} height={58} rx={26} fill={A.skinA} />
        <rect x={10} y={72} width={44} height={17} rx={8.5} fill={A.skinA} transform="rotate(-34 30 80)" />
      </g>
    </svg>
  </div>
);

export const BookmarkIcon: React.FC<{ size: number; id: string; pop: number }> = ({ size, id, pop }) => (
  <div data-lbox={id} data-lkind="chrome" style={{ width: size, height: size, transform: `scale(${0.85 + 0.15 * pop})`, opacity: pop }}>
    <svg width={size} height={size} viewBox="0 0 140 140" style={{ display: "block", overflow: "hidden" }}>
      <rect x={0} y={0} width={140} height={140} rx={36} fill={theme.colors.primarySoft} />
      <path d="M 44 28 H 96 V 112 L 70 92 L 44 112 Z" fill={theme.colors.primary} />
      <path d="M 58 58 L 67 67 L 84 48" stroke={theme.colors.white} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  </div>
);

export const RepeatIcon: React.FC<{ size: number; id: string; pop: number; angle: number }> = ({ size, id, pop, angle }) => (
  <div data-lbox={id} data-lkind="chrome" style={{ width: size, height: size, transform: `scale(${0.85 + 0.15 * pop})`, opacity: pop }}>
    <svg width={size} height={size} viewBox="0 0 140 140" style={{ display: "block", overflow: "hidden" }}>
      <rect x={0} y={0} width={140} height={140} rx={36} fill={theme.colors.accentSoft} />
      <g transform={`rotate(${angle} 70 70)`}>
        <path d="M 38 70 A 32 32 0 0 1 96 50" stroke={theme.colors.accent} strokeWidth={10} strokeLinecap="round" fill="none" />
        <polygon points="104,28 108,60 78,50" fill={theme.colors.accent} />
        <path d="M 102 70 A 32 32 0 0 1 44 90" stroke={theme.colors.accent} strokeWidth={10} strokeLinecap="round" fill="none" />
        <polygon points="36,112 32,80 62,90" fill={theme.colors.accent} />
      </g>
    </svg>
  </div>
);

export const PlusIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block" }}>
    <path d="M 20 6 V 34 M 6 20 H 34" stroke={theme.colors.white} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

export const ArrowIcon: React.FC<{ size: number; id: string; shift: number }> = ({ size, id, shift }) => (
  <div data-lbox={id} data-lkind="chrome" style={{ width: size, height: size, transform: `translateX(${shift}px)` }}>
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ display: "block", overflow: "hidden" }}>
      <circle cx={60} cy={60} r={56} fill={theme.colors.primary} />
      <path d="M 40 60 H 80 M 62 40 L 82 60 L 62 80" stroke={theme.colors.white} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  </div>
);
