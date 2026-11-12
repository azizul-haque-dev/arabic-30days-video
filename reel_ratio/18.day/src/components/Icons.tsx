import React from "react";

export const LikeIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect x="6" y="28" width="12" height="28" rx="4" fill={color} />
    <path d="M22 54 V30 l10 -20 c5 -1 9 3 8 8 l-2 8 h14 a6 6 0 0 1 6 7 l-3 18 a7 7 0 0 1 -7 5 H26 a4 4 0 0 1 -4 -2z" fill={color} />
  </svg>
);

export const ShareIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <circle cx="48" cy="14" r="8" fill={color} />
    <circle cx="16" cy="32" r="8" fill={color} />
    <circle cx="48" cy="50" r="8" fill={color} />
    <path d="M22 28 L42 17 M22 36 L42 47" stroke={color} strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export const CheckIcon: React.FC<{ size: number; color: string; draw?: number }> = ({ size, color, draw = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M7 21 L16 30 L33 10" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="44" strokeDashoffset={44 * (1 - draw)} />
  </svg>
);

export const PlusIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M20 6 V34 M6 20 H34" stroke={color} strokeWidth="6" strokeLinecap="round" />
  </svg>
);

export const ArrowIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M6 20 H32 M22 9 L33 20 L22 31" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
