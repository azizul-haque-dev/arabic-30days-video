import React from "react";
import { theme } from "../theme";

const c = theme.colors;
export const INK = c.text;
export const SW = 6;
const rad = (d: number) => (d * Math.PI) / 180;

type PersonProps = {
  x: number; y: number; s?: number; frame: number; walking?: boolean;
  shirt?: string; pants?: string; hair?: string; cap?: string;
  armFront?: number; armBack?: number; flip?: boolean; mouth?: "smile" | "o";
  held?: React.ReactNode; // drawn in the front-hand coordinate space
};

// Flat character, origin at feet centre, facing +x. ~240 units tall.
export const Person: React.FC<PersonProps> = ({
  x, y, s = 1, frame, walking = false, shirt = c.primary, pants = c.pants, hair = INK, cap,
  armFront = 8, armBack = -8, flip = false, mouth = "smile", held,
}) => {
  const ph = walking ? frame / 3.2 : 0;
  const swing = walking ? Math.sin(ph) * 26 : 0;
  const bob = walking ? -Math.abs(Math.sin(ph)) * 6 : Math.sin(frame / 24) * -1.5;
  const front = armFront + (walking ? -swing * 0.9 : 0);
  const back = armBack + (walking ? swing * 0.9 : 0);
  const hx = Math.sin(rad(front)) * 66;
  const hy = -160 + Math.cos(rad(front)) * 66;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <ellipse cx={0} cy={2} rx={46} ry={9} fill={INK} opacity={0.12} />
      <g transform={`translate(0,${bob})`}>
        <g transform={`rotate(${-back} 0 -160)`}>
          <line x1={0} y1={-160} x2={0} y2={-96} stroke={shirt} strokeWidth={22} strokeLinecap="round" opacity={0.8} />
          <circle cx={0} cy={-90} r={11} fill={c.skin} />
        </g>
        <g transform={`rotate(${swing} 0 -90)`}>
          <line x1={0} y1={-90} x2={0} y2={-8} stroke={pants} strokeWidth={26} strokeLinecap="round" opacity={0.85} />
          <ellipse cx={9} cy={-2} rx={19} ry={9} fill={INK} />
        </g>
        <g transform={`rotate(${-swing} 0 -90)`}>
          <line x1={0} y1={-90} x2={0} y2={-8} stroke={pants} strokeWidth={26} strokeLinecap="round" />
          <ellipse cx={9} cy={-2} rx={19} ry={9} fill={INK} />
        </g>
        <rect x={-34} y={-178} width={68} height={96} rx={26} fill={shirt} />
        <circle cx={0} cy={-210} r={32} fill={c.skin} />
        <path d="M-33,-210 a33,33 0 0 1 66,0 q-30,-16 -66,0z" fill={hair} />
        {cap && (
          <g>
            <path d="M-34,-214 a34,34 0 0 1 68,0z" fill={cap} />
            <rect x={8} y={-220} width={40} height={10} rx={5} fill={cap} />
          </g>
        )}
        <circle cx={13} cy={-207} r={3.6} fill={INK} />
        {mouth === "smile" ? (
          <path d="M6,-195 q8,9 17,0" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        ) : (
          <ellipse cx={14} cy={-193} rx={5} ry={6.5} fill={INK} />
        )}
        <g transform={`rotate(${-front} 0 -160)`}>
          <line x1={0} y1={-160} x2={0} y2={-96} stroke={shirt} strokeWidth={22} strokeLinecap="round" />
          <circle cx={0} cy={-90} r={11} fill={c.skin} />
        </g>
        {held && <g transform={`translate(${hx},${hy + 6})`}>{held}</g>}
      </g>
    </g>
  );
};

export const Crescent: React.FC<{ id: string; r: number; fill?: string }> = ({ id, r, fill = c.accent }) => (
  <g>
    <mask id={id}>
      <rect x={-r * 2} y={-r * 2} width={r * 4} height={r * 4} fill="#fff" />
      <circle cx={r * 0.42} cy={-r * 0.08} r={r * 0.82} fill="#000" />
    </mask>
    <circle cx={0} cy={0} r={r} fill={fill} mask={`url(#${id})`} />
  </g>
);

export const Sparkle: React.FC<{ x: number; y: number; size: number; phase: number; frame: number; fill?: string }> = ({
  x, y, size, phase, frame, fill = c.accent,
}) => {
  const t = (Math.sin(frame / 8 + phase) + 1) / 2;
  const sc = 0.4 + t * 0.9;
  return (
    <path transform={`translate(${x},${y}) scale(${sc * size}) rotate(${t * 40})`} opacity={0.35 + t * 0.65}
      d="M0,-1 Q0.12,-0.12 1,0 Q0.12,0.12 0,1 Q-0.12,0.12 -1,0 Q-0.12,-0.12 0,-1Z" fill={fill} />
  );
};

export const Backdrop: React.FC<{ tint?: string; floor?: string; night?: boolean }> = ({ tint = c.primarySoft, floor = c.bgAlt, night = false }) => (
  <g>
    <rect width={920} height={560} fill={night ? c.night : "#F6FCFA"} />
    <circle cx={460} cy={250} r={250} fill={night ? c.nightSoft : tint} opacity={night ? 0.7 : 0.55} />
    <rect y={440} width={920} height={120} fill={night ? "#0D2822" : floor} />
  </g>
);
