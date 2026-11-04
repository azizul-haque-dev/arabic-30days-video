import React from "react";
import { theme } from "../theme";
import { Crescent, INK, SW } from "./primitives";

const c = theme.colors;

// ---------- Washing machine (origin: bottom centre, 300 x 340) ----------
export const WashingMachine: React.FC<{ x: number; y: number; s?: number; frame: number; broken?: boolean; showWarning?: boolean }> = ({
  x, y, s = 1, frame, broken = false, showWarning = true,
}) => {
  const burst = broken ? Math.max(0, Math.sin(frame / 9)) : 0;
  const shake = Math.sin(frame * 2.1) * 5 * burst;
  const drum = broken ? frame * 3 * (0.3 + burst) + Math.sin(frame / 4) * 20 : frame * 9;
  const warn = 1 + Math.sin(frame / 5) * 0.08;
  return (
    <g transform={`translate(${x + shake},${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={170} ry={14} fill={INK} opacity={0.12} />
      {broken && [0, 1, 2].map((i) => {
        const t = ((frame + i * 24) % 72) / 72;
        return <circle key={i} cx={-30 + i * 34 + Math.sin(t * 6) * 10} cy={-350 - t * 110} r={20 + t * 26} fill="#9DB5AC" opacity={(1 - t) * 0.7} />;
      })}
      <rect x={-150} y={-340} width={300} height={340} rx={30} fill="#fff" stroke={INK} strokeWidth={SW} />
      <rect x={-150} y={-340} width={300} height={72} rx={30} fill={c.primarySoft} stroke={INK} strokeWidth={SW} />
      <rect x={-150} y={-296} width={300} height={28} fill={c.primarySoft} />
      <line x1={-150} y1={-268} x2={150} y2={-268} stroke={INK} strokeWidth={SW} />
      <circle cx={-100} cy={-304} r={14} fill={c.accent} stroke={INK} strokeWidth={4} />
      <circle cx={-56} cy={-304} r={14} fill="#fff" stroke={INK} strokeWidth={4} />
      <rect x={40} y={-322} width={86} height={36} rx={10} fill={INK} />
      <rect x={52} y={-310} width={broken ? 20 : 46} height={12} rx={6} fill={broken ? c.accent : c.primary} />
      <circle cx={0} cy={-135} r={104} fill={c.primarySoft} stroke={INK} strokeWidth={SW} />
      <circle cx={0} cy={-135} r={80} fill="#BDE6D7" stroke={INK} strokeWidth={4} />
      <g transform={`translate(0,-135) rotate(${drum})`} opacity={0.95}>
        <ellipse cx={-28} cy={-14} rx={30} ry={18} fill={c.accent} />
        <ellipse cx={26} cy={22} rx={32} ry={19} fill="#fff" stroke={INK} strokeWidth={3} />
        <ellipse cx={14} cy={-34} rx={22} ry={14} fill={c.primary} />
        <ellipse cx={-30} cy={34} rx={20} ry={12} fill="#fff" stroke={INK} strokeWidth={3} />
      </g>
      <path d="M-62,-170 a70,70 0 0 1 44,-30" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.8} />
      <rect x={-120} y={-14} width={34} height={14} rx={5} fill={INK} />
      <rect x={86} y={-14} width={34} height={14} rx={5} fill={INK} />
      {broken && showWarning && (
        <g transform={`translate(128,-352) scale(${warn})`}>
          <path d="M0,-58 L58,40 L-58,40Z" fill={c.accent} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
          <rect x={-6} y={-24} width={12} height={36} rx={6} fill={INK} />
          <circle cx={0} cy={26} r={7} fill={INK} />
        </g>
      )}
    </g>
  );
};

// ---------- Alarm clock (origin: centre) ----------
export const AlarmClock: React.FC<{ x: number; y: number; r?: number; frame: number; hourDeg: number; minDeg: number; ring?: boolean; body?: string }> = ({
  x, y, r = 150, frame, hourDeg, minDeg, ring = false, body = c.accent,
}) => {
  const rot = ring ? Math.sin(frame * 1.7) * 3.2 : 0;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {ring && [1, 2].map((k) => {
        const pulse = (Math.sin(frame / 4 - k) + 1) / 2;
        return (
          <g key={k} opacity={0.25 + pulse * 0.6} fill="none" stroke={c.primary} strokeWidth={7} strokeLinecap="round">
            <path d={`M${-r - 26 * k},-26 q-14,26 0,52`} />
            <path d={`M${r + 26 * k},-26 q14,26 0,52`} />
          </g>
        );
      })}
      {[-1, 1].map((d) => (
        <g key={d}>
          <line x1={d * r * 0.62} y1={r * 0.72} x2={d * r * 0.8} y2={r * 1.02} stroke={INK} strokeWidth={14} strokeLinecap="round" />
          <g transform={`rotate(${d * 40}) translate(0,${-r - 8})`}>
            <path d={`M-${r * 0.3},0 a${r * 0.3},${r * 0.3} 0 0 1 ${r * 0.6},0z`} fill={c.primary} stroke={INK} strokeWidth={SW} />
          </g>
        </g>
      ))}
      <circle r={r} fill={body} stroke={INK} strokeWidth={SW} />
      <circle r={r * 0.82} fill="#fff" stroke={INK} strokeWidth={4} />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1={0} y1={-r * 0.7} x2={0} y2={-r * (i % 3 === 0 ? 0.55 : 0.62)} stroke={INK} strokeWidth={i % 3 === 0 ? 7 : 4} strokeLinecap="round" transform={`rotate(${i * 30})`} />
      ))}
      <line x1={0} y1={0} x2={0} y2={-r * 0.44} stroke={INK} strokeWidth={11} strokeLinecap="round" transform={`rotate(${hourDeg})`} />
      <line x1={0} y1={0} x2={0} y2={-r * 0.66} stroke={c.primaryDark} strokeWidth={8} strokeLinecap="round" transform={`rotate(${minDeg})`} />
      <circle r={11} fill={INK} />
    </g>
  );
};

// ---------- Mosque (origin: bottom centre, ~520 wide) ----------
export const Mosque: React.FC<{ x: number; y: number; s?: number; frame: number; idp?: string }> = ({ x, y, s = 1, frame, idp = "m" }) => {
  const glow = 0.75 + Math.sin(frame / 20) * 0.15;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {[-1, 1].map((d) => (
        <g key={d} transform={`translate(${d * 220},0)`}>
          <rect x={-24} y={-320} width={48} height={320} fill="#fff" stroke={INK} strokeWidth={SW} />
          <rect x={-24} y={-250} width={48} height={20} fill={c.primarySoft} stroke={INK} strokeWidth={4} />
          <rect x={-34} y={-330} width={68} height={16} rx={6} fill={c.primary} stroke={INK} strokeWidth={4} />
          <path d="M-26,-330 Q0,-410 26,-330z" fill={c.primaryDark} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
          <rect x={-8} y={-210} width={16} height={34} rx={8} fill={c.accent} opacity={glow} />
        </g>
      ))}
      <rect x={-170} y={-190} width={340} height={190} fill="#fff" stroke={INK} strokeWidth={SW} />
      <path d="M-120,-190 a120,120 0 0 1 240,0z" fill={c.primary} stroke={INK} strokeWidth={SW} />
      <line x1={0} y1={-310} x2={0} y2={-345} stroke={INK} strokeWidth={5} />
      <g transform="translate(0,-366)"><Crescent id={`${idp}-cr`} r={22} /></g>
      <path d="M-46,0 L-46,-86 a46,46 0 0 1 92,0 L46,0z" fill={c.accent} opacity={glow} stroke={INK} strokeWidth={SW} />
      {[-120, 120].map((px) => (
        <path key={px} d={`M${px - 20},-60 L${px - 20},-110 a20,20 0 0 1 40,0 L${px + 20},-60z`} fill={c.primarySoft} stroke={INK} strokeWidth={4} />
      ))}
    </g>
  );
};

// ---------- Sofa (origin: bottom centre, ~420 wide) ----------
export const Sofa: React.FC<{ x: number; y: number; s?: number; frame?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={230} ry={13} fill={INK} opacity={0.12} />
    <rect x={-200} y={-200} width={400} height={150} rx={40} fill={c.primary} stroke={INK} strokeWidth={SW} />
    <rect x={-232} y={-130} width={74} height={130} rx={32} fill={c.primaryDark} stroke={INK} strokeWidth={SW} />
    <rect x={158} y={-130} width={74} height={130} rx={32} fill={c.primaryDark} stroke={INK} strokeWidth={SW} />
    <rect x={-170} y={-100} width={340} height={78} rx={26} fill={c.primary} stroke={INK} strokeWidth={SW} />
    <line x1={0} y1={-100} x2={0} y2={-22} stroke={INK} strokeWidth={4} />
    <rect x={-150} y={-168} width={96} height={86} rx={22} fill={c.accent} stroke={INK} strokeWidth={SW} transform="rotate(-8 -100 -126)" />
    <rect x={-30} y={-24} width={14} height={24} rx={4} fill={INK} />
    <rect x={16} y={-24} width={14} height={24} rx={4} fill={INK} />
  </g>
);

// ---------- Simple house icon (thumbnail) ----------
export const House: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-120} y={-170} width={240} height={170} fill="#fff" stroke={INK} strokeWidth={SW} />
    <path d="M-150,-170 L0,-290 L150,-170z" fill={c.primary} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <rect x={-34} y={-110} width={68} height={110} rx={10} fill={c.accent} stroke={INK} strokeWidth={SW} />
    <rect x={62} y={-136} width={42} height={42} rx={8} fill={c.primarySoft} stroke={INK} strokeWidth={4} />
    <rect x={-104} y={-136} width={42} height={42} rx={8} fill={c.primarySoft} stroke={INK} strokeWidth={4} />
  </g>
);
