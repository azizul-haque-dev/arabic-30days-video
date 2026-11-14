import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, type SpringPreset } from "../../theme";
import { breathe } from "../../motion";

const c = theme.colors;
const a = c.art;

/** animation helpers for illustrations (local frame of the scene) */
export const useAnim = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = (delaySec: number, preset: SpringPreset = "snappy") =>
    spring({ frame: frame - Math.round(delaySec * fps), fps, config: theme.spring[preset] });
  const lerp = (p: number, from: number, to: number) => from + (to - from) * p;
  const idle = (period = 3.2, phase = 0) => breathe(frame, fps, period, phase);
  const t = frame / fps;
  return { frame, fps, t, enter, lerp, idle };
};

export const G: React.FC<{
  x?: number;
  y?: number;
  s?: number;
  rot?: number;
  o?: number;
  children?: React.ReactNode;
}> = ({ x = 0, y = 0, s = 1, rot = 0, o = 1, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    {children}
  </g>
);

/* ---------------- room ---------------- */
export const FLOOR_Y = 520;

export const Room: React.FC<{ showLamp?: boolean }> = ({ showLamp = true }) => {
  const { idle } = useAnim();
  return (
    <g>
      <rect x={0} y={0} width={940} height={640} fill={a.wall} />
      <rect x={0} y={FLOOR_Y} width={940} height={120} fill={a.floor} />
      <rect x={0} y={FLOOR_Y} width={940} height={6} fill={c.line} />
      {/* window */}
      <g opacity={0.9}>
        <rect x={70} y={70} width={170} height={190} rx={18} fill={c.white} />
        <rect x={82} y={82} width={146} height={166} rx={10} fill="#DDF1FA" />
        <rect x={152} y={82} width={6} height={166} fill={c.white} />
        <rect x={82} y={162} width={146} height={6} fill={c.white} />
      </g>
      {showLamp && (
        <G x={760} y={0} rot={idle(4.2) * 1.6}>
          <rect x={-2} y={0} width={4} height={90} fill={c.textSoft} />
          <path d="M-52 150 Q-52 96 0 90 Q52 96 52 150 Z" fill={c.accent} />
          <ellipse cx={0} cy={150} rx={52} ry={9} fill={c.accentDark} />
          <ellipse cx={0} cy={156} rx={30} ry={7} fill="#FFE7A6" opacity={0.9} />
        </G>
      )}
    </g>
  );
};

/* ---------------- furniture ---------------- */
export const Table: React.FC<{ x: number; y: number; w: number; plane?: number }> = ({ x, y, w, plane = 70 }) => (
  <g>
    <rect x={x - w / 2 + 34} y={y + 20} width={20} height={FLOOR_Y + 70 - y - 20} rx={6} fill={a.woodDark} />
    <rect x={x + w / 2 - 54} y={y + 20} width={20} height={FLOOR_Y + 70 - y - 20} rx={6} fill={a.woodDark} />
    {plane > 0 && <path d={`M${x - w / 2 + 34} ${y - plane} H${x + w / 2 - 34} L${x + w / 2} ${y} H${x - w / 2}Z`} fill={a.woodLight} />}
    <rect x={x - w / 2} y={y} width={w} height={26} rx={13} fill={a.wood} />
    <rect x={x - w / 2} y={y + 18} width={w} height={8} rx={4} fill={a.woodDark} opacity={0.55} />
  </g>
);

export const Chair: React.FC<{ x: number; y: number; flip?: boolean; s?: number }> = ({ x, y, flip, s = 1 }) => (
  <G x={x} y={y} s={s}>
    <g transform={flip ? "scale(-1 1)" : undefined}>
      <rect x={-62} y={-150} width={22} height={150} rx={10} fill={a.woodDark} />
      <rect x={-62} y={-150} width={22} height={84} rx={10} fill={a.chairSeat} />
      <rect x={-62} y={-20} width={124} height={26} rx={12} fill={a.chairSeat} />
      <rect x={-62} y={-8} width={124} height={14} rx={7} fill={c.primaryDark} opacity={0.5} />
      <rect x={-52} y={6} width={16} height={92} rx={6} fill={a.woodDark} />
      <rect x={34} y={6} width={16} height={92} rx={6} fill={a.woodDark} />
    </g>
  </G>
);

/* ---------------- people ---------------- */
type PersonProps = {
  x: number;
  y: number; // hip centre
  s?: number;
  shirt?: string;
  skin?: string;
  hair?: string;
  hairStyle?: "short" | "bun" | "cap";
  apron?: boolean;
  legs?: boolean;
  /** degrees; 0 = hanging, 90 = horizontal outward, 180 = straight up */
  armR?: number;
  armL?: number;
  handR?: React.ReactNode;
  handL?: React.ReactNode;
  mouth?: "smile" | "open" | "flat";
  look?: number; // -1..1
  bob?: number;
  blink?: number; // 0..1 closed
};

export const Person: React.FC<PersonProps> = ({
  x,
  y,
  s = 1,
  shirt = c.primary,
  skin = a.skin1,
  hair = a.hair1,
  hairStyle = "short",
  apron,
  legs,
  armR = 6,
  armL = 6,
  handR,
  handL,
  mouth = "smile",
  look = 0,
  bob = 0,
  blink = 0,
}) => {
  const arm = (side: 1 | -1, angle: number, held?: React.ReactNode) => (
    <g transform={`translate(${side * 50} -128) rotate(${side === 1 ? -angle : angle})`}>
      <rect x={-12} y={-4} width={24} height={104} rx={12} fill={shirt} />
      <circle cx={0} cy={108} r={14} fill={skin} />
      {held && <g transform="translate(0 108)">{held}</g>}
    </g>
  );
  return (
    <G x={x} y={y + bob} s={s}>
      {legs && (
        <>
          <rect x={-32} y={-6} width={28} height={118} rx={12} fill="#2E3B55" />
          <rect x={4} y={-6} width={28} height={118} rx={12} fill="#2E3B55" />
          <rect x={-40} y={102} width={40} height={16} rx={8} fill={c.text} />
          <rect x={0} y={102} width={40} height={16} rx={8} fill={c.text} />
        </>
      )}
      {arm(-1, armL, handL)}
      <rect x={-52} y={-150} width={104} height={152} rx={30} fill={shirt} />
      {apron && (
        <>
          <rect x={-40} y={-92} width={80} height={96} rx={14} fill={c.white} />
          <rect x={-40} y={-92} width={80} height={14} rx={7} fill={c.accent} />
        </>
      )}
      <rect x={-11} y={-166} width={22} height={24} rx={8} fill={skin} />
      {arm(1, armR, handR)}
      {/* head */}
      <circle cx={0} cy={-206} r={46} fill={skin} />
      <circle cx={-46} cy={-204} r={9} fill={skin} />
      <circle cx={46} cy={-204} r={9} fill={skin} />
      {hairStyle === "short" && <path d="M-47 -210 Q-44 -262 0 -262 Q44 -262 47 -210 Q30 -236 0 -236 Q-30 -236 -47 -210Z" fill={hair} />}
      {hairStyle === "bun" && (
        <>
          <path d="M-47 -208 Q-46 -260 0 -260 Q46 -260 47 -208 Q28 -238 0 -238 Q-28 -238 -47 -208Z" fill={hair} />
          <circle cx={0} cy={-270} r={17} fill={hair} />
        </>
      )}
      {hairStyle === "cap" && (
        <>
          <path d="M-48 -214 Q-46 -266 0 -266 Q46 -266 48 -214Z" fill={c.text} />
          <rect x={-52} y={-220} width={104} height={12} rx={6} fill={c.text} />
        </>
      )}
      <ellipse cx={-16 + look * 4} cy={-206} rx={5} ry={Math.max(0.6, 6 * (1 - blink))} fill={c.text} />
      <ellipse cx={16 + look * 4} cy={-206} rx={5} ry={Math.max(0.6, 6 * (1 - blink))} fill={c.text} />
      <circle cx={-28} cy={-190} r={8} fill="#F5A08A" opacity={0.45} />
      <circle cx={28} cy={-190} r={8} fill="#F5A08A" opacity={0.45} />
      {mouth === "smile" && <path d="M-14 -184 Q0 -170 14 -184" stroke={c.text} strokeWidth={4} fill="none" strokeLinecap="round" />}
      {mouth === "open" && <ellipse cx={0} cy={-181} rx={11} ry={9} fill={c.text} />}
      {mouth === "flat" && <path d="M-12 -180 Q0 -186 12 -180" stroke={c.text} strokeWidth={4} fill="none" strokeLinecap="round" />}
    </G>
  );
};

/* ---------------- objects ---------------- */
export const Receipt: React.FC<{ s?: number; rot?: number }> = ({ s = 1, rot = 0 }) => (
  <G s={s} rot={rot}>
    <path d="M-52 -80 H52 V80 L44 72 L36 80 L28 72 L20 80 L12 72 L4 80 L-4 72 L-12 80 L-20 72 L-28 80 L-36 72 L-44 80 L-52 72Z" fill={a.paper} stroke={a.plateRim} strokeWidth={3} />
    <rect x={-34} y={-62} width={68} height={12} rx={6} fill={c.primary} />
    <rect x={-34} y={-34} width={68} height={7} rx={3.5} fill={a.plateRim} />
    <rect x={-34} y={-16} width={52} height={7} rx={3.5} fill={a.plateRim} />
    <rect x={-34} y={2} width={60} height={7} rx={3.5} fill={a.plateRim} />
    <rect x={-34} y={26} width={68} height={10} rx={5} fill={c.accent} />
    <text x={0} y={60} textAnchor="middle" fontFamily={theme.fonts.en} fontWeight={800} fontSize={17} fill={c.text}>
      BILL
    </text>
  </G>
);

export type Food = "meal" | "empty" | "leftover" | "cold";

export const Plate: React.FC<{ x: number; y: number; rx?: number; food?: Food }> = ({ x, y, rx = 100, food = "meal" }) => {
  const ry = rx * 0.27;
  return (
    <G x={x} y={y}>
      <ellipse cx={0} cy={ry * 0.5} rx={rx * 1.02} ry={ry * 1.05} fill="rgba(16,35,29,0.12)" />
      <ellipse cx={0} cy={0} rx={rx} ry={ry} fill={a.plateRim} />
      <ellipse cx={0} cy={-2} rx={rx * 0.9} ry={ry * 0.88} fill={a.plate} />
      <ellipse cx={0} cy={-2} rx={rx * 0.62} ry={ry * 0.58} fill="#F4F8F6" />
      {(food === "meal" || food === "cold") && (
        <g>
          <ellipse cx={-rx * 0.18} cy={-ry * 0.5} rx={rx * 0.36} ry={ry * 0.62} fill={a.rice} />
          <ellipse cx={rx * 0.28} cy={-ry * 0.45} rx={rx * 0.26} ry={ry * 0.5} fill={a.chicken} />
          <ellipse cx={rx * 0.22} cy={-ry * 0.62} rx={rx * 0.14} ry={ry * 0.22} fill="#EDA95A" />
          <circle cx={-rx * 0.5} cy={-ry * 0.3} r={rx * 0.1} fill={a.tomato} />
          <ellipse cx={-rx * 0.02} cy={-ry * 0.92} rx={rx * 0.1} ry={ry * 0.22} fill={a.leaf} />
        </g>
      )}
      {food === "leftover" && (
        <g>
          <ellipse cx={-rx * 0.1} cy={-ry * 0.3} rx={rx * 0.2} ry={ry * 0.34} fill={a.rice} />
          <ellipse cx={rx * 0.26} cy={-ry * 0.25} rx={rx * 0.14} ry={ry * 0.3} fill={a.chicken} />
        </g>
      )}
    </G>
  );
};

export const Steam: React.FC<{ x: number; y: number; frame: number; fade?: number }> = ({ x, y, frame, fade = 1 }) => (
  <g opacity={0.8 * fade}>
    {[-28, 0, 28].map((dx, i) => {
      const w = Math.sin(frame / 7 + i * 1.6) * 6;
      const rise = ((frame / 1.2 + i * 14) % 44) / 44;
      return (
        <path
          key={dx}
          d={`M${x + dx} ${y} q${10 + w} -22 0 -44 q${-10 - w} -22 0 -44`}
          stroke={c.textSoft}
          strokeWidth={6}
          strokeLinecap="round"
          fill="none"
          opacity={0.75 - rise * 0.6}
          transform={`translate(0 ${-rise * 22})`}
        />
      );
    })}
  </g>
);

export const Snowflake: React.FC<{ s?: number; rot?: number }> = ({ s = 1, rot = 0 }) => (
  <G s={s} rot={rot}>
    {[0, 60, 120].map((r) => (
      <g key={r} transform={`rotate(${r})`}>
        <line x1={0} y1={-26} x2={0} y2={26} stroke={c.white} strokeWidth={6} strokeLinecap="round" />
        <polyline points="-8,-16 0,-24 8,-16" stroke={c.white} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="-8,16 0,24 8,16" stroke={c.white} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    ))}
  </G>
);

export const Clock: React.FC<{ x: number; y: number; r?: number; frame: number }> = ({ x, y, r = 58, frame }) => (
  <G x={x} y={y}>
    <circle r={r + 8} fill={c.text} />
    <circle r={r} fill={c.white} />
    {Array.from({ length: 12 }).map((_, i) => (
      <line key={i} x1={0} y1={-r + 6} x2={0} y2={-r + (i % 3 === 0 ? 18 : 12)} stroke={c.text} strokeWidth={i % 3 === 0 ? 4 : 2} transform={`rotate(${i * 30})`} />
    ))}
    <line x1={0} y1={0} x2={0} y2={-r * 0.5} stroke={c.text} strokeWidth={6} strokeLinecap="round" transform={`rotate(${frame * 0.5 + 40})`} />
    <line x1={0} y1={0} x2={0} y2={-r * 0.78} stroke={c.accent} strokeWidth={4} strokeLinecap="round" transform={`rotate(${frame * 6})`} />
    <circle r={6} fill={c.text} />
  </G>
);

export const Bread: React.FC<{ x?: number; y?: number; rot?: number; s?: number }> = ({ x = 0, y = 0, rot = 0, s = 1 }) => (
  <G x={x} y={y} rot={rot} s={s}>
    <ellipse cx={0} cy={0} rx={46} ry={22} fill={a.bread} />
    <path d="M-20 -14 q8 10 2 24 M0 -18 q8 12 2 32 M20 -14 q8 10 2 24" stroke={a.breadDark} strokeWidth={4} fill="none" strokeLinecap="round" />
  </G>
);

export const Basket: React.FC<{ x: number; y: number; s?: number; loaves?: number }> = ({ x, y, s = 1, loaves = 2 }) => (
  <G x={x} y={y} s={s}>
    <ellipse cx={0} cy={4} rx={86} ry={18} fill="rgba(16,35,29,0.12)" />
    {loaves >= 1 && <Bread x={-30} y={-40} rot={-12} />}
    {loaves >= 2 && <Bread x={26} y={-46} rot={10} />}
    {loaves >= 3 && <Bread x={-2} y={-62} rot={-4} />}
    <path d="M-80 -34 H80 L62 0 H-62Z" fill={a.kraft} />
    <path d="M-76 -22 H76 M-70 -10 H70" stroke={a.kraftDark} strokeWidth={4} />
    <path d="M-80 -34 H80" stroke={c.white} strokeWidth={10} strokeLinecap="round" opacity={0.9} />
    <rect x={-80} y={-42} width={160} height={10} rx={5} fill={c.primary} />
  </G>
);

export const Spoon: React.FC<{ x: number; y: number; rot?: number; s?: number; outline?: boolean; dash?: number; o?: number }> = ({
  x,
  y,
  rot = 0,
  s = 1,
  outline,
  dash = 0,
  o = 1,
}) => (
  <G x={x} y={y} rot={rot} s={s} o={o}>
    <g
      fill={outline ? "none" : a.steel}
      stroke={outline ? c.accent : "none"}
      strokeWidth={outline ? 5 : 0}
      strokeDasharray={outline ? "14 10" : undefined}
      strokeDashoffset={outline ? dash : undefined}
      strokeLinecap="round"
    >
      <ellipse cx={0} cy={-46} rx={19} ry={27} />
      <rect x={-6} y={-24} width={12} height={92} rx={6} />
    </g>
  </G>
);

export const Fork: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <G x={x} y={y} rot={rot} s={s}>
    <g fill={a.steel}>
      <rect x={-17} y={-70} width={6} height={36} rx={3} />
      <rect x={-3} y={-70} width={6} height={36} rx={3} />
      <rect x={11} y={-70} width={6} height={36} rx={3} />
      <path d="M-17 -40 H17 V-30 Q17 -16 0 -16 Q-17 -16 -17 -30Z" />
      <rect x={-6} y={-24} width={12} height={92} rx={6} />
    </g>
  </G>
);

export const Knife: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <G x={x} y={y} rot={rot} s={s}>
    <g fill={a.steel}>
      <path d="M-8 -70 Q16 -64 14 -10 H-8Z" />
      <rect x={-8} y={-12} width={16} height={80} rx={7} />
    </g>
  </G>
);

export const TakeoutBox: React.FC<{ x: number; y: number; s?: number; lid?: number; filled?: boolean }> = ({ x, y, s = 1, lid = 1, filled }) => (
  <G x={x} y={y} s={s}>
    <ellipse cx={0} cy={4} rx={72} ry={12} fill="rgba(16,35,29,0.12)" />
    <path d="M-66 -66 H66 L52 0 H-52Z" fill={a.kraft} />
    <path d="M-60 -40 H60" stroke={a.kraftDark} strokeWidth={4} />
    <ellipse cx={0} cy={-68} rx={66} ry={14} fill={a.kraftDark} />
    {filled && (
      <g>
        <ellipse cx={-14} cy={-72} rx={28} ry={8} fill={a.rice} />
        <ellipse cx={24} cy={-72} rx={18} ry={6} fill={a.chicken} />
      </g>
    )}
    <g transform={`translate(-66 -66) rotate(${-lid * 62} 0 0)`}>
      <rect x={0} y={-12} width={132} height={14} rx={7} fill={a.kraft} />
    </g>
    <rect x={-22} y={-34} width={44} height={22} rx={6} fill={c.primary} />
    <circle cx={0} cy={-23} r={6} fill={c.white} />
  </G>
);

export const Bag: React.FC<{ x?: number; y?: number; s?: number; swing?: number }> = ({ x = 0, y = 0, s = 1, swing = 0 }) => (
  <G x={x} y={y} s={s}>
    <g transform={`rotate(${swing} 0 -150)`}>
      <path d="M-44 -140 Q-44 -200 0 -200 Q44 -200 44 -140" stroke={a.kraftDark} strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d="M-82 -150 H82 L96 0 H-96Z" fill={a.kraft} />
      <path d="M-82 -150 H82 L84 -134 H-84Z" fill={a.kraftDark} opacity={0.5} />
      <circle cx={0} cy={-70} r={34} fill={c.primary} />
      <text x={0} y={-56} textAnchor="middle" fontFamily={theme.fonts.ar} fontWeight={700} fontSize={44} fill={c.white}>
        م
      </text>
      <circle cx={22} cy={-92} r={6} fill={c.accent} />
      <path d="M-70 -20 H70" stroke={a.kraftDark} strokeWidth={4} opacity={0.6} />
    </g>
  </G>
);

export const ReservedSign: React.FC<{ s?: number; rot?: number }> = ({ s = 1, rot = 0 }) => (
  <G s={s} rot={rot}>
    <path d="M-70 0 L-60 -78 H60 L70 0Z" fill={c.accent} />
    <path d="M-70 0 H70 V8 H-70Z" fill={c.accentDark} />
    <rect x={-46} y={-60} width={92} height={5} rx={2.5} fill={c.white} opacity={0.9} />
    <text x={0} y={-24} textAnchor="middle" fontFamily={theme.fonts.en} fontWeight={800} fontSize={20} letterSpacing={1} fill={c.text}>
      RESERVED
    </text>
  </G>
);

export const Bubble: React.FC<{ x: number; y: number; s?: number; tone?: "amber" | "green" | "ice"; children: React.ReactNode }> = ({
  x,
  y,
  s = 1,
  tone = "amber",
  children,
}) => (
  <G x={x} y={y} s={s}>
    <circle r={44} fill={tone === "amber" ? c.accent : tone === "green" ? c.primary : a.ice} />
    <circle r={44} fill="none" stroke={c.white} strokeWidth={5} opacity={0.9} />
    {children}
  </G>
);

export const QuestionMark: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <G s={s}>
    <text x={0} y={22} textAnchor="middle" fontFamily={theme.fonts.en} fontWeight={800} fontSize={64} fill={c.white}>
      ?
    </text>
  </G>
);

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const mapRange = (frame: number, a0: number, a1: number, b0: number, b1: number) =>
  interpolate(frame, [a0, a1], [b0, b1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.easing.out });
