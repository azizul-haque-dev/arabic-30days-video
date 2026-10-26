import React from 'react';

// Simple drawn glyphs (no emoji). All colours passed from theme by the caller.
export type IconName = 'clock' | 'calendar' | 'crescent' | 'family' | 'shield' | 'question' | 'dash' | 'sun' | 'cup' | 'heart';

export const Icon: React.FC<{name: IconName; size?: number; color: string; soft?: string}> = ({name, size = 120, color, soft = 'none'}) => {
  const p = {fill: 'none', stroke: color, strokeWidth: 6, strokeLinecap: 'round', strokeLinejoin: 'round'} as const;
  let body: React.ReactNode = null;
  switch (name) {
    case 'clock': body = <><circle cx="50" cy="50" r="34" {...p} fill={soft}/><path d="M50 30 V52 L66 62" {...p}/></>; break;
    case 'calendar': body = <><rect x="16" y="22" width="68" height="62" rx="12" {...p} fill={soft}/><path d="M16 42 H84 M34 14 V28 M66 14 V28" {...p}/><path d="M36 62 L46 72 L66 52" {...p}/></>; break;
    case 'crescent': body = <><path d="M62 14 A36 36 0 1 0 84 66 A30 30 0 0 1 62 14 Z" {...p} fill={soft}/><path d="M74 32 L76 38 L82 38 L77 42 L79 48 L74 44 L69 48 L71 42 L66 38 L72 38 Z" {...p} strokeWidth={3}/></>; break;
    case 'family': body = <><circle cx="30" cy="38" r="10" {...p} fill={soft}/><circle cx="70" cy="38" r="10" {...p} fill={soft}/><circle cx="50" cy="52" r="8" {...p}/><path d="M12 82 C12 66 48 66 48 82 M52 82 C52 66 88 66 88 82 M36 82 C38 66 62 66 64 82" {...p}/></>; break;
    case 'shield': body = <><path d="M50 12 L82 24 V50 C82 70 66 82 50 90 C34 82 18 70 18 50 V24 Z" {...p} fill={soft}/><path d="M36 50 L47 61 L66 40" {...p}/></>; break;
    case 'question': body = <><path d="M16 22 H84 V64 H48 L30 82 V64 H16 Z" {...p} fill={soft}/><path d="M42 38 C42 28 58 28 58 38 C58 46 50 46 50 54 M50 60 V60.5" {...p}/></>; break;
    case 'dash': body = <><circle cx="50" cy="50" r="34" {...p} fill={soft}/><path d="M34 50 H66" {...p}/></>; break;
    case 'sun': body = <><circle cx="50" cy="50" r="17" {...p} fill={soft}/><path d="M50 12 V22 M50 78 V88 M12 50 H22 M78 50 H88 M23 23 L30 30 M70 70 L77 77 M77 23 L70 30 M30 70 L23 77" {...p}/></>; break;
    case 'cup': body = <><path d="M18 40 H70 V58 C70 74 58 84 44 84 C30 84 18 74 18 58 Z" {...p} fill={soft}/><path d="M70 46 H78 C86 46 86 64 76 64 H68" {...p}/><path d="M32 26 C28 20 36 18 32 12 M48 26 C44 20 52 18 48 12" {...p}/></>; break;
    case 'heart': body = <path d="M50 84 C20 62 12 46 12 34 C12 22 22 14 32 14 C40 14 46 19 50 26 C54 19 60 14 68 14 C78 14 88 22 88 34 C88 46 80 62 50 84 Z" {...p} fill={soft}/>; break;
  }
  return <svg width={size} height={size} viewBox="0 0 100 100">{body}</svg>;
};

export const Person: React.FC<{size?: number; color: string; bg: string}> = ({size = 120, color, bg}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill={bg}/>
    <circle cx="50" cy="40" r="15" fill={color}/>
    <path d="M20 84 C24 62 76 62 80 84 C66 94 34 94 20 84 Z" fill={color}/>
  </svg>
);
