import React from "react";
import {C, I} from "../theme";

type Mood = "smile" | "happy" | "neutral" | "surprised" | "tired" | "hot" | "think";
type Arm = [number, number]; // upper-arm angle, forearm bend (deg, 0 = hanging down, + = outward/forward)

type Props = {
  x: number; y: number; s?: number;
  skin?: string; hair?: string; shirt?: string; pants?: string;
  mood?: Mood; armL?: Arm; armR?: Arm; legs?: boolean; walk?: number; flip?: boolean;
  lookY?: number;
};

const seg = (sx: number, sy: number, a: number, len: number) => {
  const r = (a * Math.PI) / 180;
  return [sx + Math.sin(r) * len, sy + Math.cos(r) * len] as const;
};

/** Flat-vector front-facing character. Origin = centre of the feet. */
export const Person: React.FC<Props> = ({
  x, y, s = 1, skin = I.skinA, hair = I.hairA, shirt = C.primary, pants = C.dark,
  mood = "smile", armL = [8, 6], armR = [8, 6], legs = true, walk = 0, flip = false, lookY = 0,
}) => {
  const SH = -196; // shoulder y
  const arm = (side: -1 | 1, [a, b]: Arm) => {
    const sx = side * 38;
    const [ex, ey] = seg(sx, SH, side * a, 58);
    const [hx, hy] = seg(ex, ey, side * (a + b), 52);
    return (
      <g>
        <line x1={sx} y1={SH} x2={ex} y2={ey} stroke={shirt} strokeWidth={24} strokeLinecap="round" />
        <line x1={ex} y1={ey} x2={hx} y2={hy} stroke={skin} strokeWidth={19} strokeLinecap="round" />
        <circle cx={hx} cy={hy} r={13} fill={skin} />
      </g>
    );
  };
  const leg = (side: -1 | 1) => {
    const sw = Math.sin(walk) * 26 * (side === -1 ? 1 : -1);
    const lift = Math.max(0, Math.sin(walk) * (side === -1 ? 1 : -1)) * 10;
    return (
      <g>
        <line x1={side * 18} y1={-92} x2={side * 20 + sw} y2={-8 - lift} stroke={pants} strokeWidth={26} strokeLinecap="round" />
        <ellipse cx={side * 20 + sw + side * 4} cy={-4 - lift} rx={20} ry={9} fill={C.text} />
      </g>
    );
  };
  const mouth = () => {
    switch (mood) {
      case "happy": return <path d="M-14,-244 Q0,-222 14,-244 Z" fill={C.dark} />;
      case "surprised": return <ellipse cx={0} cy={-238} rx={7} ry={9} fill={C.dark} />;
      case "tired": return <path d="M-9,-238 Q0,-242 9,-238" stroke={C.dark} strokeWidth={4} fill="none" strokeLinecap="round" />;
      case "hot": return <path d="M-12,-236 Q-4,-242 0,-236 T12,-236" stroke={C.dark} strokeWidth={4} fill="none" strokeLinecap="round" />;
      case "think": return <path d="M-8,-238 L8,-240" stroke={C.dark} strokeWidth={4} strokeLinecap="round" />;
      case "neutral": return <path d="M-10,-238 L10,-238" stroke={C.dark} strokeWidth={4} strokeLinecap="round" />;
      default: return <path d="M-13,-242 Q0,-228 13,-242" stroke={C.dark} strokeWidth={4.5} fill="none" strokeLinecap="round" />;
    }
  };
  const eyeH = mood === "tired" ? 1.5 : mood === "surprised" ? 6 : 4.5;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={0} cy={4} rx={70} ry={11} fill={C.dark} opacity={0.14} />
      {legs && (<>{leg(-1)}{leg(1)}</>)}
      {/* torso */}
      <rect x={-46} y={-222} width={92} height={134} rx={34} fill={shirt} />
      <rect x={-12} y={-232} width={24} height={20} rx={8} fill={skin} />
      {arm(-1, armL)}
      {arm(1, armR)}
      {/* head: hair disc behind, face disc shifted down */}
      <circle cx={-39} cy={-254} r={9} fill={skin} />
      <circle cx={39} cy={-254} r={9} fill={skin} />
      <circle cx={0} cy={-262} r={43} fill={hair} />
      <circle cx={0} cy={-256 + lookY} r={38} fill={skin} />
      <path d="M-38,-268 Q-6,-296 38,-268 Q14,-280 -38,-268Z" fill={hair} />
      <ellipse cx={-14} cy={-256 + lookY} rx={4.5} ry={eyeH} fill={C.text} />
      <ellipse cx={14} cy={-256 + lookY} rx={4.5} ry={eyeH} fill={C.text} />
      {mood === "think" && <path d="M-24,-274 L-6,-270 M24,-274 L6,-270" stroke={hair} strokeWidth={4} strokeLinecap="round" />}
      <circle cx={-26} cy={-240} r={7} fill={C.amber} opacity={0.22} />
      <circle cx={26} cy={-240} r={7} fill={C.amber} opacity={0.22} />
      <g transform={`translate(0 ${lookY})`}>{mouth()}</g>
    </g>
  );
};
