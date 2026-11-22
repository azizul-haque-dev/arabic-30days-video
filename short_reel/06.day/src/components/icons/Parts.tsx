import React from "react";
import {theme} from "../../theme";

const {skin, hair, shoe} = theme.illustration;
const {primary, dark, accent} = theme.colors;

export type Pose = "down" | "self" | "toward" | "away";

type PersonProps = {
  gender: "m" | "f";
  pose?: Pose;
  x?: number;
  y?: number;
  s?: number;
  /** father: mustache, mother: bun */
  role?: "father" | "mother";
};

/** Flat 2D character. Local origin = torso center; feet at y=130. */
export const Person: React.FC<PersonProps> = ({gender, pose = "down", x = 0, y = 0, s = 1, role}) => {
  const male = gender === "m";
  const body = male ? dark : primary;
  const arm = (d: string, handX: number, handY: number, r = 12) => (
    <>
      <path d={d} stroke={body} strokeWidth={24} strokeLinecap="round" fill="none" />
      <circle cx={handX} cy={handY} r={r} fill={skin} />
    </>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* hair behind (female) */}
      {!male && <path d="M-46,-100 Q-50,-150 0,-152 Q50,-150 46,-100 L50,-34 Q0,-22 -50,-34 Z" fill={hair} />}
      {role === "mother" && <circle cx={0} cy={-158} r={20} fill={hair} />}
      {/* legs */}
      {male ? (
        <>
          <rect x={-32} y={30} width={28} height={98} rx={13} fill={dark} />
          <rect x={4} y={30} width={28} height={98} rx={13} fill={dark} />
          <rect x={-36} y={118} width={36} height={14} rx={7} fill={shoe} />
          <rect x={0} y={118} width={36} height={14} rx={7} fill={shoe} />
        </>
      ) : (
        <>
          <rect x={-24} y={80} width={16} height={48} rx={8} fill={skin} />
          <rect x={8} y={80} width={16} height={48} rx={8} fill={skin} />
          <rect x={-30} y={120} width={28} height={12} rx={6} fill={shoe} />
          <rect x={2} y={120} width={28} height={12} rx={6} fill={shoe} />
        </>
      )}
      {/* torso */}
      {male ? (
        <rect x={-46} y={-64} width={92} height={110} rx={30} fill={body} />
      ) : (
        <path d="M-38,-64 Q0,-76 38,-64 Q46,-10 70,92 Q0,108 -70,92 Q-46,-10 -38,-64 Z" fill={body} />
      )}
      {male && role === "father" && <path d="M-12,-62 L0,-30 L12,-62 Z" fill={accent} />}
      {/* arms */}
      {pose === "down" && (
        <>
          {arm("M-42,-44 L-58,26", -58, 32)}
          {arm("M42,-44 L58,26", 58, 32)}
        </>
      )}
      {pose === "self" && (
        <>
          {arm("M42,-44 L58,26", 58, 32)}
          {arm("M-42,-44 Q-72,-2 -14,-22", -12, -22, 13)}
        </>
      )}
      {pose === "toward" && (
        <>
          {arm("M-42,-44 L-58,26", -58, 32)}
          {arm("M42,-44 Q82,-30 82,8", 82, 14, 19)}
        </>
      )}
      {pose === "away" && (
        <>
          {arm("M-42,-44 L-58,26", -58, 32)}
          {arm("M42,-44 L112,-44", 118, -44, 13)}
        </>
      )}
      {/* neck + head */}
      <rect x={-12} y={-76} width={24} height={20} fill={skin} />
      <circle cx={0} cy={-104} r={37} fill={skin} />
      {/* hair front */}
      {male ? (
        <path d="M-38,-108 Q-38,-150 0,-148 Q38,-150 38,-108 Q20,-132 -38,-108 Z" fill={hair} />
      ) : (
        <path d="M-38,-104 Q-34,-150 0,-148 Q36,-150 38,-104 Q10,-128 -38,-104 Z" fill={hair} />
      )}
      {!male && <circle cx={30} cy={-128} r={8} fill={accent} />}
      {/* face */}
      <circle cx={-13} cy={-104} r={4.5} fill={hair} />
      <circle cx={13} cy={-104} r={4.5} fill={hair} />
      <path d="M-11,-90 Q0,-80 11,-90" stroke={hair} strokeWidth={4} strokeLinecap="round" fill="none" />
      {role === "father" && <path d="M-16,-94 Q0,-102 16,-94 Q0,-88 -16,-94 Z" fill={hair} />}
    </g>
  );
};

export const Heart: React.FC<{x: number; y: number; size: number; fill?: string}> = ({x, y, size, fill = accent}) => (
  <g transform={`translate(${x} ${y}) scale(${size / 24}) translate(-12 -12)`}>
    <path d="M12 21s-7.5-4.6-9.5-9.2C1 8 3.2 4.5 6.7 4.5c2 0 3.5 1.1 5.3 3.1 1.8-2 3.3-3.1 5.3-3.1 3.5 0 5.7 3.5 4.2 7.3C19.5 16.4 12 21 12 21z" fill={fill} />
  </g>
);

/** Concentric arcs ("ping"). dir: where they open toward. */
export const Ping: React.FC<{x: number; y: number; rotate?: number; progress: number; count?: number}> = ({
  x,
  y,
  rotate = 0,
  progress,
  count = 3,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity={progress}>
    {Array.from({length: count}).map((_, i) => (
      <path
        key={i}
        d={`M${22 + i * 20},-${14 + i * 10} Q${34 + i * 22},0 ${22 + i * 20},${14 + i * 10}`}
        stroke={accent}
        strokeWidth={7}
        strokeLinecap="round"
        fill="none"
        opacity={1 - i * 0.22}
      />
    ))}
  </g>
);

/** Dashed arrow pointing right. */
export const DashArrow: React.FC<{x1: number; x2: number; y: number; progress: number}> = ({x1, x2, y, progress}) => {
  const x = x1 + (x2 - x1) * progress;
  return (
    <g opacity={progress}>
      <line x1={x1} y1={y} x2={x - 14} y2={y} stroke={accent} strokeWidth={8} strokeLinecap="round" strokeDasharray="4 18" />
      <path d={`M${x - 20},${y - 18} L${x},${y} L${x - 20},${y + 18}`} stroke={accent} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  );
};
