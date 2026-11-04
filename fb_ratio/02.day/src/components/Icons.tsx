import React from "react";

export type IconName =
  | "clock" | "calendar" | "sparkle" | "home" | "shield" | "question" | "pause" | "sun" | "cup"
  | "heart" | "bubble" | "book" | "check" | "cross" | "userPlus" | "volume" | "arrow";

const rays = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2;
  const p = (r: number) => `${(32 + Math.cos(a) * r).toFixed(1)} ${(32 + Math.sin(a) * r).toFixed(1)}`;
  return `M${p(18)}L${p(26)}`;
}).join("");

const P: Record<IconName, React.ReactNode> = {
  clock: <><circle cx="32" cy="32" r="23" /><path d="M32 18v14l10 6" /></>,
  calendar: <><rect x="9" y="14" width="46" height="41" rx="9" /><path d="M9 28h46M22 8v12M42 8v12M22 40h6M36 40h6" /></>,
  sparkle: <><path d="M30 8C32 22 40 30 54 32 40 34 32 42 30 56 28 42 20 34 6 32 20 30 28 22 30 8Z" /><path d="M52 8v10M47 13h10" /></>,
  home: <><path d="M8 30 32 10l24 20" /><path d="M14 26v26a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4V26" /><path d="M26 56V40h12v16" /></>,
  shield: <><path d="M32 7 53 15v15c0 14-9 23-21 28C20 53 11 44 11 30V15Z" /><path d="m22 32 8 8 14-16" /></>,
  question: <><circle cx="32" cy="32" r="23" /><path d="M24 26c0-8 16-8 16 1 0 6-8 6-8 13" /><circle cx="32" cy="47" r="1.6" fill="currentColor" /></>,
  pause: <><circle cx="32" cy="32" r="23" /><path d="M26 23v18M38 23v18" /></>,
  sun: <><circle cx="32" cy="32" r="10" /><path d={rays} /></>,
  cup: <><path d="M12 24h32v14a12 12 0 0 1-12 12h-8a12 12 0 0 1-12-12Z" /><path d="M44 28h4a6 6 0 0 1 0 12h-5M20 8c-3 4 3 6 0 10M30 8c-3 4 3 6 0 10M40 8c-3 4 3 6 0 10" /></>,
  heart: <path d="M32 54C10 39 8 23 19 17c7-4 13 2 13 6 0-4 6-10 13-6 11 6 9 22-13 37Z" />,
  bubble: <><rect x="8" y="10" width="48" height="36" rx="12" /><path d="M20 46v10l11-10" /></>,
  book: <><path d="M8 14h18a6 6 0 0 1 6 6v34a6 6 0 0 0-6-6H8Z" /><path d="M56 14H38a6 6 0 0 0-6 6v34a6 6 0 0 1 6-6h18Z" /></>,
  check: <path d="M14 34 27 46 50 20" />,
  cross: <path d="M18 18l28 28M46 18 18 46" />,
  userPlus: <><circle cx="26" cy="22" r="10" /><path d="M8 54c0-12 9-17 18-17s18 5 18 17" /><path d="M52 20v14M45 27h14" /></>,
  volume: <><path d="M10 25h10l13-11v36L20 39H10Z" /><path d="M42 24c5 5 5 11 0 16M49 17c9 9 9 21 0 30" /></>,
  arrow: <path d="M12 32h38M37 18l14 14-14 14" />,
};

export const Icon: React.FC<{ name: IconName; size?: number; color?: string; stroke?: number; style?: React.CSSProperties }> = ({
  name, size = 64, color = "currentColor", stroke = 4, style,
}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={stroke}
    strokeLinecap="round" strokeLinejoin="round" style={{ color, display: "block", ...style }}>
    {P[name]}
  </svg>
);
