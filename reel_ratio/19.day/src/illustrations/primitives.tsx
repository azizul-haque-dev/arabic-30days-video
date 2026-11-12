import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, ease, fonts, springs } from "../design/tokens";
import { enter } from "../lib/anim";

/* ----------------------------------------------------------------------------
 * Vector illustration toolkit. Everything draws in a 920 x 580 viewBox.
 * Flat style, brand palette + a few neutral/skin tones. No stock assets.
 * -------------------------------------------------------------------------- */

export const ill = {
  skinA: "#C68E5E",
  skinB: "#E2B28A",
  skinC: "#A8714A",
  hair: "#1F2937",
  slate: "#334155",
  slateLight: "#CBD5E1",
  paper: "#FFFFFF",
  wall: "#F7FDF9",
  floor: "#CDEBD7",
  wood: "#E7E5E4",
  woodDark: "#D6D3D1",
  ink: "#1F2937",
  red: "#DC2626",
  sky: "#BAE6FD",
} as const;

export const useAnim = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps };
};

/** Pop-in wrapper: translate + fade, children drawn around local (0,0). */
export const Pop: React.FC<{
  x?: number;
  y?: number;
  delay?: number;
  rise?: number;
  scale?: number;
  children: React.ReactNode;
}> = ({ x = 0, y = 0, delay = 0, rise = 26, scale = 1, children }) => {
  const { frame, fps } = useAnim();
  const p = enter(frame, fps, delay, springs.smooth);
  const s = scale * interpolate(p, [0, 1], [0.92, 1]);
  return (
    <g transform={`translate(${x} ${y + (1 - p) * rise}) scale(${s})`} opacity={Math.min(1, p * 1.4)}>
      {children}
    </g>
  );
};

/** Gentle floating motion. */
export const Float: React.FC<{ amp?: number; period?: number; phase?: number; children: React.ReactNode }> = ({
  amp = 6,
  period = 90,
  phase = 0,
  children,
}) => {
  const { frame } = useAnim();
  return <g transform={`translate(0 ${Math.sin((frame + phase) / (period / (2 * Math.PI))) * amp})`}>{children}</g>;
};

/* ------------------------------ Backdrop ---------------------------------- */

export const Backdrop: React.FC<{ window?: { x: number; y: number; w?: number; h?: number } | null; plant?: number | null }> = ({
  window: win = { x: 640, y: 40 },
  plant = 876,
}) => (
  <g>
    <rect x="0" y="0" width="920" height="580" fill={ill.wall} />
    <circle cx="140" cy="90" r="210" fill={colors.soft} opacity="0.55" />
    <rect x="0" y="470" width="920" height="110" fill={ill.floor} />
    <rect x="0" y="466" width="920" height="8" fill="#B6E2C6" />
    {win ? (
      <g>
        <rect x={win.x} y={win.y} width={win.w ?? 220} height={win.h ?? 134} rx="14" fill={ill.sky} stroke="#fff" strokeWidth="8" />
        <line x1={win.x + (win.w ?? 220) / 2} y1={win.y} x2={win.x + (win.w ?? 220) / 2} y2={win.y + (win.h ?? 134)} stroke="#fff" strokeWidth="6" />
        <circle cx={win.x + 56} cy={win.y + 40} r="16" fill="#FDE68A" />
      </g>
    ) : null}
    {plant ? (
      <g transform={`translate(${plant} 470)`}>
        <path d="M-22 0 L-16 -44 L16 -44 L22 0 Z" fill={colors.amber} />
        <path d="M0 -44 C-34 -70 -38 -110 -10 -128 C-6 -96 -2 -74 0 -44Z" fill={colors.primary} />
        <path d="M0 -44 C34 -76 40 -112 14 -134 C8 -100 4 -76 0 -44Z" fill="#22C55E" />
        <path d="M0 -44 C-4 -80 0 -104 4 -150 C14 -110 10 -76 0 -44Z" fill={colors.dark} />
      </g>
    ) : null}
  </g>
);

/* -------------------------------- Person ---------------------------------- */

export interface ArmPose {
  elbow: [number, number];
  hand: [number, number];
}
export const ARMS = {
  restL: { elbow: [-92, -44], hand: [-50, 2] } as ArmPose,
  restR: { elbow: [92, -44], hand: [50, 2] } as ArmPose,
  typeL: { elbow: [-86, -40], hand: [-30, 4] } as ArmPose,
  typeR: { elbow: [86, -40], hand: [30, 4] } as ArmPose,
  raiseR: { elbow: [104, -112], hand: [100, -188] } as ArmPose,
  raiseL: { elbow: [-104, -112], hand: [-100, -188] } as ArmPose,
  pointR: { elbow: [110, -96], hand: [168, -122] } as ArmPose,
  pointL: { elbow: [-110, -96], hand: [-168, -122] } as ArmPose,
  cheekR: { elbow: [96, -58], hand: [34, -128] } as ArmPose,
  presentR: { elbow: [108, -80], hand: [146, -100] } as ArmPose,
};

export type Expression = "neutral" | "happy" | "tired" | "worried" | "asking" | "focused";

const Face: React.FC<{ e: Expression }> = ({ e }) => {
  const c = ill.ink;
  switch (e) {
    case "happy":
      return (
        <g stroke={c} strokeWidth="3.6" strokeLinecap="round" fill="none">
          <path d="M-22 -164 Q-15 -170 -8 -164" />
          <path d="M8 -164 Q15 -170 22 -164" />
          <path d="M-13 -142 Q0 -128 13 -142" />
        </g>
      );
    case "tired":
      return (
        <g stroke={c} strokeWidth="3.6" strokeLinecap="round" fill="none">
          <path d="M-23 -160 Q-15 -154 -7 -160" />
          <path d="M7 -160 Q15 -154 23 -160" />
          <path d="M-24 -150 Q-15 -146 -8 -150" strokeWidth="2.2" opacity="0.4" />
          <path d="M8 -150 Q15 -146 24 -150" strokeWidth="2.2" opacity="0.4" />
          <path d="M-26 -174 L-8 -169" />
          <path d="M26 -174 L8 -169" />
          <path d="M-9 -138 Q0 -142 9 -138" />
        </g>
      );
    case "worried":
      return (
        <g>
          <circle cx="-15" cy="-160" r="4.2" fill={c} />
          <circle cx="15" cy="-160" r="4.2" fill={c} />
          <g stroke={c} strokeWidth="3.4" strokeLinecap="round" fill="none">
            <path d="M-25 -170 L-8 -176" />
            <path d="M25 -170 L8 -176" />
            <path d="M-9 -138 Q0 -143 9 -138" />
          </g>
        </g>
      );
    case "asking":
      return (
        <g>
          <circle cx="-15" cy="-160" r="4.2" fill={c} />
          <circle cx="15" cy="-160" r="4.2" fill={c} />
          <g stroke={c} strokeWidth="3.4" strokeLinecap="round" fill="none">
            <path d="M-25 -173 Q-16 -179 -7 -173" />
            <path d="M7 -172 L25 -170" />
          </g>
          <ellipse cx="0" cy="-139" rx="5.5" ry="6.5" fill={c} />
        </g>
      );
    case "focused":
      return (
        <g>
          <circle cx="-15" cy="-160" r="4.2" fill={c} />
          <circle cx="15" cy="-160" r="4.2" fill={c} />
          <g stroke={c} strokeWidth="3.4" strokeLinecap="round" fill="none">
            <path d="M-25 -171 L-7 -171" />
            <path d="M7 -171 L25 -171" />
            <path d="M-8 -139 L8 -139" />
          </g>
        </g>
      );
    default:
      return (
        <g>
          <circle cx="-15" cy="-160" r="4.2" fill={c} />
          <circle cx="15" cy="-160" r="4.2" fill={c} />
          <path d="M-10 -140 Q0 -133 10 -140" stroke={c} strokeWidth="3.6" strokeLinecap="round" fill="none" />
        </g>
      );
  }
};

export const Person: React.FC<{
  x: number;
  y?: number;
  skin?: string;
  shirt?: string;
  collar?: string;
  headwear?: "hair" | "ghutra";
  expression?: Expression;
  lArm?: ArmPose;
  rArm?: ArmPose;
  tilt?: number;
  scale?: number;
  breathe?: boolean;
  wave?: boolean;
}> = ({
  x,
  y = 398,
  skin = ill.skinA,
  shirt = colors.dark,
  collar = "#FFFFFF",
  headwear = "hair",
  expression = "neutral",
  lArm = ARMS.restL,
  rArm = ARMS.restR,
  tilt = 0,
  scale = 1,
  breathe = true,
  wave = false,
}) => {
  const { frame } = useAnim();
  const br = breathe ? Math.sin(frame / 18) * 1.6 : 0;
  const w = wave ? Math.sin(frame / 6) * 7 : 0;
  const arm = (a: ArmPose, side: 1 | -1, dx = 0) => (
    <g>
      <path
        d={`M${side * 56} -94 Q${a.elbow[0] + dx} ${a.elbow[1]} ${a.hand[0] + dx} ${a.hand[1]}`}
        stroke={shirt}
        strokeWidth="28"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx={a.hand[0] + dx} cy={a.hand[1]} r="14" fill={skin} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y + br}) scale(${scale})`}>
      <path d="M-66 14 L-66 -72 Q-66 -108 -30 -112 L30 -112 Q66 -108 66 -72 L66 14 Z" fill={shirt} />
      <path d="M-22 -112 L0 -84 L22 -112 Z" fill={collar} />
      {headwear === "ghutra" ? (
        <path d="M-52 -168 C-56 -230 56 -230 52 -168 L66 -106 L-66 -106 Z" fill="#FFFFFF" stroke={colors.border} strokeWidth="2" />
      ) : null}
      <g transform={`rotate(${tilt} 0 -112)`}>
        <rect x="-13" y="-132" width="26" height="26" rx="8" fill={skin} />
        <circle cx="-42" cy="-158" r="9" fill={skin} />
        <circle cx="42" cy="-158" r="9" fill={skin} />
        <circle cx="0" cy="-160" r="42" fill={skin} />
        {headwear === "hair" ? (
          <path d="M-44 -166 C-48 -214 48 -214 44 -166 C34 -188 -34 -188 -44 -166 Z" fill={ill.hair} />
        ) : (
          <g>
            <path d="M-45 -172 C-46 -214 46 -214 45 -172 C30 -190 -30 -190 -45 -172 Z" fill="#FFFFFF" stroke={colors.border} strokeWidth="2" />
            <ellipse cx="0" cy="-198" rx="44" ry="9" fill="none" stroke={ill.ink} strokeWidth="7" />
          </g>
        )}
        <Face e={expression} />
      </g>
      {arm(lArm, -1)}
      <g transform={`translate(0 ${w})`}>{arm(rArm, 1)}</g>
    </g>
  );
};

/* --------------------------------- Props ---------------------------------- */

export const Desk: React.FC<{ x: number; w: number; y?: number }> = ({ x, w, y = 402 }) => (
  <g>
    <rect x={x - w / 2 + 6} y={y + 14} width={w - 12} height={68} rx="6" fill={ill.woodDark} />
    <rect x={x - w / 2} y={y} width={w} height="18" rx="9" fill={ill.wood} stroke={colors.border} strokeWidth="2" />
    <ellipse cx={x} cy="476" rx={w / 2 + 6} ry="8" fill="#000" opacity="0.05" />
  </g>
);

export const Laptop: React.FC<{ x: number; y?: number; w?: number }> = ({ x, y = 402, w = 120 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y="-80" width={w} height="78" rx="9" fill={colors.dark} />
    <circle cx="0" cy="-41" r="7" fill={colors.primary} />
    <rect x={-w / 2 - 12} y="-4" width={w + 24} height="7" rx="3.5" fill="#94A3B8" />
  </g>
);

export const Briefcase: React.FC<{ x: number; y?: number }> = ({ x, y = 402 }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-16 -50 q0 -14 14 -14 h4 q14 0 14 14" fill="none" stroke={ill.slate} strokeWidth="6" />
    <rect x="-44" y="-52" width="88" height="52" rx="10" fill={colors.amber} />
    <rect x="-44" y="-30" width="88" height="5" fill="#B45309" opacity="0.5" />
    <rect x="-6" y="-34" width="12" height="12" rx="3" fill="#92400E" />
  </g>
);

export const Cup: React.FC<{ x: number; y?: number }> = ({ x, y = 402 }) => {
  const { frame } = useAnim();
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-18 -34 h36 l-4 34 h-28 Z" fill="#FFFFFF" stroke={colors.border} strokeWidth="2" />
      <path d="M18 -26 q16 2 12 14 q-3 8 -14 8" fill="none" stroke={colors.border} strokeWidth="4" />
      {[0, 1].map((i) => (
        <path
          key={i}
          d={`M${-6 + i * 12} -42 q-6 -10 0 -18 q6 -8 0 -16`}
          fill="none"
          stroke="#94A3B8"
          strokeWidth="3"
          strokeLinecap="round"
          opacity={0.5 + 0.4 * Math.sin((frame + i * 20) / 14)}
        />
      ))}
    </g>
  );
};

export const Paper: React.FC<{ w?: number; h?: number; lines?: number; accent?: string; dashed?: boolean }> = ({
  w = 120,
  h = 150,
  lines = 4,
  accent = colors.primary,
  dashed = false,
}) => (
  <g>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="12" fill="#fff" stroke={dashed ? colors.amber : colors.border} strokeWidth="3" strokeDasharray={dashed ? "9 7" : undefined} />
    <rect x={-w / 2 + 14} y={-h / 2 + 16} width={w * 0.45} height="12" rx="6" fill={accent} />
    {Array.from({ length: lines }).map((_, i) => (
      <rect key={i} x={-w / 2 + 14} y={-h / 2 + 44 + i * 22} width={i % 2 ? w * 0.5 : w - 28} height="9" rx="4.5" fill={colors.border} />
    ))}
  </g>
);

export const Calendar: React.FC<{
  x: number;
  y: number;
  w?: number;
  delay?: number;
  fillTo?: number;
  pulseLast?: boolean;
  checks?: number;
}> = ({ x, y, w = 210, delay = 6, fillTo = 29, pulseLast = false, checks = 0 }) => {
  const { frame, fps } = useAnim();
  const p = enter(frame, fps, delay, springs.smooth);
  const cell = (w - 28) / 7;
  const h = 62 + cell * 5 + 14;
  const last = 29;
  const pulse = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <g transform={`translate(${x} ${y + (1 - p) * 24})`} opacity={p}>
      <rect x="0" y="0" width={w} height={h} rx="20" fill="#fff" stroke={colors.border} strokeWidth="3" />
      <path d={`M0 20 a20 20 0 0 1 20 -20 h${w - 40} a20 20 0 0 1 20 20 v28 h-${w} Z`} fill={colors.primary} />
      <rect x={w * 0.24 - 5} y="-10" width="10" height="26" rx="5" fill={colors.dark} />
      <rect x={w * 0.76 - 5} y="-10" width="10" height="26" rx="5" fill={colors.dark} />
      <rect x="22" y="18" width={w * 0.4} height="11" rx="5.5" fill="#fff" opacity="0.85" />
      {Array.from({ length: 30 }).map((_, i) => {
        const cx = 14 + (i % 7) * cell + 3;
        const cy = 62 + Math.floor(i / 7) * cell + 3;
        const filledAt = delay + 8 + i * 1.1;
        const filled = i <= fillTo && frame >= filledAt && !checks;
        const isLast = i === last;
        return (
          <g key={i}>
            <rect x={cx} y={cy} width={cell - 6} height={cell - 6} rx="6" fill={filled && !isLast ? colors.soft : "#F5F5F5"} />
            {checks > 0 && i < checks && frame >= delay + 8 + i * 4 ? (
              <path d={`M${cx + 6} ${cy + (cell - 6) / 2} l ${(cell - 6) / 4} ${(cell - 6) / 4} l ${(cell - 6) / 2.2} -${(cell - 6) / 2.4}`} stroke={colors.primary} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            ) : null}
            {isLast && pulseLast && frame >= delay + 8 + i * 1.1 ? (
              <g>
                <rect x={cx - 3 - pulse * 3} y={cy - 3 - pulse * 3} width={cell + pulse * 6} height={cell + pulse * 6} rx="9" fill="none" stroke={colors.amber} strokeWidth="4" opacity={0.4 + 0.5 * pulse} />
                <rect x={cx} y={cy} width={cell - 6} height={cell - 6} rx="6" fill={colors.amber} />
              </g>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

export const Phone: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({ x, y, w = 200, h = 380 }) => {
  const { frame } = useAnim();
  const spin = (frame * 6) % 360;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx="36" fill="#171717" />
      <rect x="10" y="10" width={w - 20} height={h - 20} rx="28" fill="#fff" />
      <rect x={w / 2 - 28} y="20" width="56" height="10" rx="5" fill="#171717" />
      <circle cx="40" cy="64" r="14" fill={colors.soft} />
      <rect x="62" y="54" width="62" height="9" rx="4.5" fill={colors.border} />
      <rect x="62" y="68" width="40" height="7" rx="3.5" fill="#F0F0F0" />
      <rect x="22" y="94" width={w - 44} height="104" rx="20" fill={colors.primary} />
      <rect x="38" y="112" width="52" height="8" rx="4" fill="#fff" opacity="0.65" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={38 + i * 40} y="140" width="28" height="12" rx="6" fill="#fff" opacity="0.9" />
      ))}
      <g transform={`translate(${w - 54} 124)`}>
        <circle r="15" fill={colors.amber} />
        <circle r="9" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="14 14" transform={`rotate(${spin})`} />
      </g>
      <rect x="22" y="216" width={w - 44} height="62" rx="16" fill="none" stroke={colors.amber} strokeWidth="3" strokeDasharray="9 7" />
      <circle cx="52" cy="247" r="12" fill={colors.amber} opacity={0.35 + 0.3 * Math.sin(frame / 9)} />
      <rect x="76" y="238" width={w - 120} height="9" rx="4.5" fill={colors.border} />
      <rect x="76" y="253" width={(w - 120) * 0.6} height="7" rx="3.5" fill="#F0F0F0" />
      {[0, 1].map((i) => (
        <g key={i}>
          <rect x="22" y={296 + i * 30} width={w - 44} height="22" rx="11" fill="#F5F5F5" />
        </g>
      ))}
    </g>
  );
};

export const Clock: React.FC<{ x: number; y: number; r?: number; from?: number; to?: number; start?: number; dur?: number }> = ({
  x,
  y,
  r = 90,
  from = 0,
  to = 300,
  start = 10,
  dur = 90,
}) => {
  const { frame } = useAnim();
  const q = interpolate(frame, [start, start + dur], [0, 1], { easing: ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const minute = (from + (to - from) * q) % 360;
  const hour = (from + (to - from) * q) / 12 + 150;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 12} fill={colors.dark} />
      <circle r={r} fill="#fff" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1="0" y1={-r + 8} x2="0" y2={-r + (i % 3 === 0 ? 24 : 16)} stroke={colors.dark} strokeWidth={i % 3 === 0 ? 5 : 3} strokeLinecap="round" transform={`rotate(${i * 30})`} />
      ))}
      <line x1="0" y1="0" x2="0" y2={-r * 0.5} stroke={colors.dark} strokeWidth="7" strokeLinecap="round" transform={`rotate(${hour})`} />
      <line x1="0" y1="0" x2="0" y2={-r * 0.74} stroke={colors.primary} strokeWidth="5" strokeLinecap="round" transform={`rotate(${minute})`} />
      <circle r="8" fill={colors.amber} />
    </g>
  );
};

export const Checklist: React.FC<{ x: number; y: number; w?: number; h?: number; rows?: number; start?: number; gap?: number }> = ({
  x,
  y,
  w = 290,
  h = 330,
  rows = 4,
  start = 20,
  gap = 22,
}) => {
  const { frame } = useAnim();
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx="26" fill="#fff" stroke={colors.border} strokeWidth="3" />
      <rect x="26" y="26" width={w * 0.4} height="14" rx="7" fill={colors.primary} />
      {Array.from({ length: rows }).map((_, i) => {
        const t = interpolate(frame, [start + i * gap, start + i * gap + 14], [0, 1], { easing: ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const ry = 70 + i * ((h - 100) / rows);
        return (
          <g key={i} transform={`translate(26 ${ry})`}>
            <rect width="46" height="46" rx="13" fill={t > 0.5 ? colors.primary : "#fff"} stroke={t > 0.5 ? colors.primary : colors.border} strokeWidth="3" />
            <path d="M11 24 l9 9 l17 -18" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="44" strokeDashoffset={44 * (1 - t)} />
            <rect x="66" y="10" width={w - 130 - (i % 2) * 30} height="12" rx="6" fill={t > 0.5 ? colors.soft : colors.border} />
            <rect x="66" y="28" width={(w - 130) * 0.55} height="9" rx="4.5" fill="#F0F0F0" />
          </g>
        );
      })}
    </g>
  );
};

export const TaskCard: React.FC<{ w?: number; h?: number; tone?: string }> = ({ w = 150, h = 104, tone = colors.primary }) => (
  <g>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="16" fill="#fff" stroke={colors.border} strokeWidth="3" />
    <circle cx={-w / 2 + 28} cy={-h / 2 + 28} r="12" fill={tone} />
    <rect x={-w / 2 + 50} y={-h / 2 + 20} width={w * 0.5} height="10" rx="5" fill={colors.border} />
    <rect x={-w / 2 + 18} y={-h / 2 + 52} width={w - 36} height="9" rx="4.5" fill="#F0F0F0" />
    <rect x={-w / 2 + 18} y={-h / 2 + 70} width={(w - 36) * 0.6} height="9" rx="4.5" fill="#F0F0F0" />
  </g>
);

export const Bubble: React.FC<{ x: number; y: number; w: number; h: number; tail?: "down-left" | "down-right" | "down"; children?: React.ReactNode; delay?: number }> = ({
  x,
  y,
  w,
  h,
  tail = "down",
  children,
  delay = 10,
}) => {
  const tx = tail === "down-left" ? w * 0.28 : tail === "down-right" ? w * 0.72 : w / 2;
  return (
    <Pop x={x} y={y} delay={delay} rise={20}>
      <rect width={w} height={h} rx="28" fill="#fff" stroke={colors.border} strokeWidth="3" />
      <path d={`M${tx - 16} ${h - 2} L${tx} ${h + 24} L${tx + 16} ${h - 2} Z`} fill="#fff" stroke={colors.border} strokeWidth="3" strokeLinejoin="round" />
      <rect x={tx - 14} y={h - 6} width="28" height="8" fill="#fff" />
      {children}
    </Pop>
  );
};

export const QMark: React.FC<{ x: number; y: number; size?: number; delay?: number }> = ({ x, y, size = 120, delay = 10 }) => {
  const { frame, fps } = useAnim();
  const p = enter(frame, fps, delay, springs.bouncy);
  const bob = Math.sin(frame / 10) * 4;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${p})`} opacity={Math.min(1, p)}>
      <circle r={size / 2} fill={colors.amber} />
      <text y={size * 0.2} textAnchor="middle" fontFamily={fonts.latin} fontWeight="700" fontSize={size * 0.7} fill="#fff">
        ?
      </text>
    </g>
  );
};
