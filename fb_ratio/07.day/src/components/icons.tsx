import React from "react";
import { interpolate } from "remotion";
import { alpha, theme } from "../theme";

const ink = theme.colors.text, amber = theme.colors.accent, green = theme.colors.primary;
const soft = theme.colors.primarySoft, white = theme.colors.surface, faint = theme.colors.line;
const sw = { stroke: ink, strokeWidth: 7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const c01 = (v: number) => Math.max(0, Math.min(1, v));

type P = { p: number; t: number }; // p = action progress (can overshoot), t = frame for idle motion

const I61: React.FC<P> = ({ p }) => {
  const C = 2 * Math.PI * 98, q = c01(p);
  return (<>
    <circle cx={120} cy={120} r={98} fill="none" stroke={faint} strokeWidth={16} />
    <circle cx={120} cy={120} r={98} fill="none" stroke={green} strokeWidth={16} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - q)} transform="rotate(-90 120 120)" />
    <circle cx={120} cy={120} r={44} fill={white} {...sw} />
    <circle cx={120} cy={120} r={26} fill="none" stroke={ink} strokeWidth={4} opacity={0.3} />
    <path d="M62 92v58M54 92v18a8 8 0 0 0 16 0V92" fill="none" {...sw} strokeWidth={5} />
    <path d="M178 92c-10 8-10 30 0 36v22" fill="none" {...sw} strokeWidth={5} />
    <g transform={`translate(120 120) scale(${c01(p * 1.2)})`}>
      <circle r={22} fill={amber} stroke={ink} strokeWidth={5} />
      <path d="M-10 0l7 8 14-16" fill="none" {...sw} strokeWidth={6} />
    </g>
  </>);
};

const I62: React.FC<P> = ({ p, t }) => {
  const drop = -Math.sin(Math.PI * c01(p)) * 28;
  const ring = (k: number) => { const u = ((t + k * 20) % 60) / 60; return { r: 20 + u * 62, o: (1 - u) * 0.6 }; };
  return (<>
    {[0, 1].map((k) => { const { r, o } = ring(k); return <ellipse key={k} cx={120} cy={206} rx={r} ry={r * 0.32} fill="none" stroke={amber} strokeWidth={6} opacity={c01(p) * o} />; })}
    <g transform={`translate(0 ${drop})`} >
      <path d="M120 206C120 206 56 146 56 98a64 64 0 1 1 128 0c0 48-64 108-64 108z" fill={ink} />
      <circle cx={120} cy={98} r={46} fill={white} />
      <text x={120} y={112} textAnchor="middle" fontSize={40} fontWeight={700} fill={ink} fontFamily={theme.font.family}>WC</text>
    </g>
  </>);
};

const I63: React.FC<P> = ({ p }) => {
  const q = c01(p), s = 1 - 0.72 * q;
  return (<>
    <rect x={36} y={26} width={168} height={190} rx={16} fill={white} {...sw} />
    <rect x={50} y={40} width={140} height={162} rx={8} fill={soft} />
    <circle cx={150} cy={86} r={20} fill={amber} opacity={q} />
    {[0, 1, 2].map((k) => <path key={k} d={`M${74 + k * 6} ${112 + k * 24}h${70 - k * 8}`} stroke={green} strokeWidth={6} strokeLinecap="round" opacity={q} strokeDasharray="60" strokeDashoffset={60 * (1 - q)} />)}
    <g transform={`translate(50 40) scale(${s} 1)`}><rect width={70} height={162} rx={6} fill={white} stroke={ink} strokeWidth={6 / Math.max(0.3, s)} /><rect x={10} y={14} width={50} height={64} rx={4} fill={soft} /></g>
    <g transform={`translate(190 40) scale(${-s} 1)`}><rect width={70} height={162} rx={6} fill={white} stroke={ink} strokeWidth={6 / Math.max(0.3, s)} /><rect x={10} y={14} width={50} height={64} rx={4} fill={soft} /></g>
  </>);
};

const I64: React.FC<P> = ({ p }) => {
  const s = 0.22 + 0.78 * c01(p);
  return (<>
    <rect x={38} y={24} width={164} height={196} rx={10} fill={soft} {...sw} />
    <rect x={50} y={36} width={140} height={184} fill={alpha(ink, 0.12)} />
    <g transform={`translate(50 36) scale(${s} 1)`}>
      <rect width={140} height={184} rx={4} fill={white} stroke={ink} strokeWidth={6 / s} />
      <rect x={16} y={20} width={44} height={60} rx={4} fill={soft} />
      <rect x={80} y={20} width={44} height={60} rx={4} fill={soft} />
      <circle cx={120} cy={112} r={8 / Math.max(0.6, s)} fill={amber} />
    </g>
    <path d="M214 120h-30m12-12l-12 12 12 12" fill="none" stroke={amber} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={1 - c01(p)} />
  </>);
};

const I65: React.FC<P> = ({ p, t }) => {
  const q = c01(p);
  return (<>
    <rect x={24} y={40} width={192} height={84} rx={22} fill={white} {...sw} />
    {[0, 1, 2].map((k) => <path key={k} d={`M${52 + k * 6} ${64 + k * 12}h${136 - k * 12}`} stroke={faint} strokeWidth={6} strokeLinecap="round" />)}
    <circle cx={188} cy={64} r={7} fill={q > 0.5 ? green : alpha(ink, 0.25)} />
    <g transform={`rotate(${16 * q} 40 124)`}><rect x={40} y={118} width={160} height={12} rx={6} fill={ink} /></g>
    {[0, 1, 2].map((k) => <path key={k} d={`M${70 + k * 50} ${146 + ((t * 2 + k * 14) % 40)}q10 -10 20 0t20 0`} fill="none" stroke={green} strokeWidth={5} strokeLinecap="round" opacity={q * 0.7} />)}
    <g opacity={1 - 0.85 * q} transform={`translate(52 196) scale(${1 - 0.3 * q})`}>
      <circle r={18} fill={amber} stroke={ink} strokeWidth={5} />
      {Array.from({ length: 8 }).map((_, k) => <path key={k} d="M0 -27v-9" stroke={ink} strokeWidth={5} strokeLinecap="round" transform={`rotate(${k * 45})`} />)}
    </g>
    <g transform={`translate(184 196) scale(${q})`}>{[0, 60, 120].map((r) => <path key={r} d="M0 -22v44" stroke={green} strokeWidth={6} strokeLinecap="round" transform={`rotate(${r})`} />)}</g>
  </>);
};

const I66: React.FC<P> = ({ p }) => {
  const q = c01(p);
  return (<>
    <path d="M120 0v52" stroke={ink} strokeWidth={6} strokeLinecap="round" />
    <rect x={102} y={52} width={36} height={26} rx={6} fill={ink} />
    {Array.from({ length: 8 }).map((_, k) => <path key={k} d="M0 -64v-14" stroke={amber} strokeWidth={7} strokeLinecap="round" opacity={1 - q} transform={`translate(120 128) rotate(${k * 45 + 22})`} />)}
    <circle cx={120} cy={128} r={46} fill={white} {...sw} />
    <circle cx={120} cy={128} r={42} fill={amber} opacity={1 - q} />
    <path d="M104 144l8-22 8 12 8-12 8 22" fill="none" stroke={ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    <g opacity={q} transform={`translate(${176 - 6 * (1 - q)} 58) scale(${0.6 + 0.4 * q})`}>
      <path d="M0 -30a30 30 0 1 0 24 48a24 24 0 1 1 -24 -48z" fill={amber} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
    </g>
    <text x={196} y={206} fontSize={34} fontWeight={700} fill={ink} opacity={q} fontFamily={theme.font.family}>Zz</text>
  </>);
};

const I67: React.FC<P> = ({ p, t }) => {
  const wob = Math.sin(t / 5) * 6;
  return (<>
    <g transform={`rotate(${-28 + wob} 112 140)`}>
      <circle cx={70} cy={140} r={36} fill={amber} {...sw} />
      <circle cx={70} cy={140} r={12} fill={white} stroke={ink} strokeWidth={5} />
      <path d="M104 140h96M170 140v26M194 140v20" fill="none" {...sw} />
    </g>
    <g transform={`translate(176 54) scale(${Math.min(1.1, p)})`} opacity={c01(p * 2)}>
      <circle r={38} fill={white} {...sw} />
      <text y={16} textAnchor="middle" fontSize={54} fontWeight={700} fill={ink} fontFamily={theme.font.family}>?</text>
    </g>
  </>);
};

const I68: React.FC<P> = ({ p }) => {
  const y = (1 - Math.min(1.1, p)) * -90;
  return (<>
    <rect x={22} y={170} width={196} height={20} rx={8} fill={white} {...sw} />
    <path d="M52 190v36M188 190v36" {...sw} strokeWidth={10} fill="none" />
    <g transform={`translate(0 ${y}) rotate(-12 120 130)`}>
      <circle cx={64} cy={130} r={28} fill={amber} {...sw} />
      <circle cx={64} cy={130} r={9} fill={white} stroke={ink} strokeWidth={4} />
      <path d="M92 130h84M148 130v22M170 130v16" fill="none" {...sw} />
    </g>
  </>);
};

const I69: React.FC<P> = ({ p, t }) => {
  const q = c01(p), flow = 1 - q;
  const fall = (t * 4) % 60;
  return (<>
    <path d="M20 54h108a32 32 0 0 1 32 32v10" fill="none" {...sw} strokeWidth={22} stroke={ink} />
    <rect x={140} y={92} width={40} height={18} rx={6} fill={ink} />
    <rect x={152} y={110} width={16} height={72 * flow} fill={theme.colors.primaryMid} />
    <path d={`M160 ${118 + fall}c-9 12-14 20-14 27a14 14 0 0 0 28 0c0-7-5-15-14-27z`} fill={soft} stroke={ink} strokeWidth={5} opacity={flow} transform={`translate(0 ${fall * 0.4})`} />
    <path d="M160 188c-10 13-16 21-16 29a16 16 0 0 0 32 0c0-8-6-16-16-29z" fill={theme.colors.primaryMid} stroke={ink} strokeWidth={6} />
    <circle cx={120} cy={124} r={92} fill="none" stroke={amber} strokeWidth={9} strokeDasharray={580} strokeDashoffset={580 * (1 - q)} transform="rotate(-90 120 124)" />
    <path d="M56 60l128 128" stroke={amber} strokeWidth={9} strokeLinecap="round" strokeDasharray={190} strokeDashoffset={190 * (1 - c01((p - 0.3) / 0.7))} />
  </>);
};

const BOLT = "M138 14L56 134h52l-10 92 86-124h-54z";
const I70: React.FC<P> = ({ p, t }) => {
  const q = c01(p), flick = q < 1 ? 1 : 0;
  return (<>
    <circle cx={120} cy={120} r={104} fill="none" stroke={faint} strokeWidth={8} strokeDasharray="4 16" strokeLinecap="round" />
    <defs>
      <clipPath id="top70"><rect x={0} y={0} width={240} height={122} /></clipPath>
      <clipPath id="bot70"><rect x={0} y={122} width={240} height={140} /></clipPath>
    </defs>
    <g clipPath="url(#top70)" transform={`translate(${-6 * q} ${-8 * q}) rotate(${-4 * q} 120 120)`} opacity={1 - 0.55 * q}><path d={BOLT} fill={amber} {...sw} /></g>
    <g clipPath="url(#bot70)" transform={`translate(${8 * q} ${12 * q}) rotate(${6 * q} 120 120)`} opacity={1 - 0.55 * q}><path d={BOLT} fill={amber} {...sw} /></g>
    {flick ? <g opacity={Math.sin(q * Math.PI)}>{[-1, 1].map((d) => <path key={d} d={`M${120 + d * 24} 122h${d * 40}`} stroke={ink} strokeWidth={6} strokeLinecap="round" />)}</g> : null}
    <g opacity={0.4 + 0.2 * Math.sin(t / 8)} />
  </>);
};

const MAP: Record<number, React.FC<P>> = { 61: I61, 62: I62, 63: I63, 64: I64, 65: I65, 66: I66, 67: I67, 68: I68, 69: I69, 70: I70 };

export const Icon: React.FC<{ n: number; p: number; t: number; size: number }> = ({ n, p, t, size }) => {
  const C = MAP[n];
  return <svg width={size} height={size} viewBox="0 0 240 240" style={{ overflow: "visible", display: "block" }}><C p={p} t={t} /></svg>;
};
void interpolate;
