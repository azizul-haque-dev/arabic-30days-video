import React from "react";
import { theme } from "../theme";
import { idle } from "../lib/anim";

const A = theme.art;

/** Place children at (x,y) with optional scale / rotation / opacity. */
export const G: React.FC<{
  x?: number;
  y?: number;
  s?: number;
  sx?: number;
  sy?: number;
  rot?: number;
  opacity?: number;
  children?: React.ReactNode;
}> = ({ x = 0, y = 0, s = 1, sx, sy, rot = 0, opacity = 1, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sx ?? s} ${sy ?? s})`} style={{ opacity }}>
    {children}
  </g>
);

/** Stage card: defines the reserved art rectangle (0,0)-(940,680) + floor band. */
export const Stage: React.FC<{ floorY?: number; children?: React.ReactNode }> = ({ floorY = 566, children }) => (
  <g>
    <rect x={0} y={0} width={940} height={680} rx={52} fill={theme.colors.white} opacity={0.72} />
    <path d={`M 0 ${floorY} H 940 V 628 A 52 52 0 0 1 888 680 H 52 A 52 52 0 0 1 0 628 Z`} fill={A.ground} />
    {children}
  </g>
);

export const Table: React.FC<{ cx: number; topY: number; w?: number; legH?: number }> = ({ cx, topY, w = 460, legH = 150 }) => (
  <g>
    <ellipse cx={cx} cy={topY + legH + 6} rx={w / 2 + 10} ry={14} fill={theme.colors.shadow} />
    <rect x={cx - w / 2 + 34} y={topY + 10} width={22} height={legH} rx={6} fill={A.tableLeg} />
    <rect x={cx + w / 2 - 56} y={topY + 10} width={22} height={legH} rx={6} fill={A.tableLeg} />
    <rect x={cx - w / 2} y={topY} width={w} height={30} rx={14} fill={A.tableTop} />
    <rect x={cx - w / 2 + 10} y={topY + 3} width={w - 20} height={8} rx={4} fill={A.tableTopLight} />
  </g>
);

export interface Arm {
  ex: number;
  ey: number;
  hx: number;
  hy: number;
  finger?: boolean;
}

export const ARM_DOWN = (side: 1 | -1): Arm => ({ ex: side * 8, ey: 70, hx: side * 4, hy: 128 });

export interface PersonProps {
  x: number;
  y: number;
  s?: number;
  role: "customer" | "waiter";
  skin?: string;
  hair?: string;
  shirt?: string;
  longHair?: boolean;
  /** 1 = looks right, -1 = looks left */
  dir?: 1 | -1;
  armL?: Arm;
  armR?: Arm;
  legs?: boolean;
  torsoLen?: number;
  opacity?: number;
  /** 0..1 mouth open */
  talk?: number;
  bob?: number;
}

const Limb: React.FC<{ sx: number; sy: number; arm: Arm; sleeve: string; skin: string }> = ({ sx, sy, arm, sleeve, skin }) => {
  const ex = sx + arm.ex;
  const ey = sy + arm.ey;
  const hx = sx + arm.hx;
  const hy = sy + arm.hy;
  const ang = Math.atan2(hy - ey, hx - ex);
  return (
    <g>
      <polyline points={`${sx},${sy} ${ex},${ey}`} stroke={sleeve} strokeWidth={30} strokeLinecap="round" fill="none" />
      <polyline points={`${ex},${ey} ${hx},${hy}`} stroke={sleeve} strokeWidth={26} strokeLinecap="round" fill="none" />
      <polyline points={`${ex + Math.cos(ang) * 30},${ey + Math.sin(ang) * 30} ${hx},${hy}`} stroke={skin} strokeWidth={22} strokeLinecap="round" fill="none" />
      <circle cx={hx} cy={hy} r={15} fill={skin} />
      {arm.finger ? (
        <rect x={hx + Math.cos(ang) * 8 - 5} y={hy + Math.sin(ang) * 8 - 5} width={30} height={10} rx={5} fill={skin} transform={`rotate(${(ang * 180) / Math.PI} ${hx} ${hy})`} />
      ) : null}
    </g>
  );
};

/** Flat-vector character. Origin = centre of the neck base; head above, torso below. */
export const Person: React.FC<PersonProps> = ({
  x,
  y,
  s = 1,
  role,
  skin = A.skinA,
  hair = A.hairDark,
  shirt = A.shirtGreen,
  longHair = false,
  dir = 1,
  armL = ARM_DOWN(-1),
  armR = ARM_DOWN(1),
  legs = false,
  torsoLen = 150,
  opacity = 1,
  talk = 0,
  bob = 0,
}) => {
  const isWaiter = role === "waiter";
  const top = isWaiter ? A.shirtWhite : shirt;
  return (
    <G x={x} y={y + bob} s={s} opacity={opacity}>
      {legs ? (
        <g>
          <rect x={-46} y={torsoLen - 10} width={40} height={150} rx={14} fill={A.apron} />
          <rect x={6} y={torsoLen - 10} width={40} height={150} rx={14} fill={A.apron} />
          <ellipse cx={-30} cy={torsoLen + 142} rx={30} ry={13} fill={A.hairDark} />
          <ellipse cx={30} cy={torsoLen + 142} rx={30} ry={13} fill={A.hairDark} />
        </g>
      ) : null}
      {longHair ? <rect x={-56} y={-100} width={112} height={110} rx={40} fill={hair} /> : null}
      <Limb sx={-52} sy={22} arm={armL} sleeve={top} skin={skin} />
      <rect x={-62} y={0} width={124} height={torsoLen} rx={38} fill={top} />
      {isWaiter ? (
        <g>
          <rect x={-40} y={6} width={80} height={torsoLen - 24} rx={26} fill={A.apron} />
          <polygon points="-18,0 18,0 0,26" fill={A.shirtWhite} />
        </g>
      ) : (
        <polygon points="-22,0 22,0 0,32" fill={skin} />
      )}
      <Limb sx={52} sy={22} arm={armR} sleeve={top} skin={skin} />
      <rect x={-14} y={-22} width={28} height={30} rx={10} fill={skin} />
      <circle cx={0} cy={-62} r={50} fill={skin} />
      <path d="M -51 -64 C -54 -124, 54 -124, 51 -64 C 34 -92, -34 -92, -51 -64 Z" fill={hair} />
      <circle cx={-17 + dir * 4} cy={-60} r={5.5} fill={A.outline} />
      <circle cx={17 + dir * 4} cy={-60} r={5.5} fill={A.outline} />
      {talk > 0.05 ? (
        <ellipse cx={dir * 4} cy={-38} rx={11} ry={3 + 7 * talk} fill={A.outline} />
      ) : (
        <path d={`M ${-14 + dir * 4} -40 Q ${dir * 4} -28 ${14 + dir * 4} -40`} stroke={A.outline} strokeWidth={4.5} strokeLinecap="round" fill="none" />
      )}
      {isWaiter ? (
        <g>
          <polygon points="-24,6 0,16 -24,28" fill={A.signRed} />
          <polygon points="24,6 0,16 24,28" fill={A.signRed} />
          <circle cx={0} cy={16} r={6} fill={A.signRed} />
        </g>
      ) : null}
    </G>
  );
};

export const Plate: React.FC<{
  cx: number;
  baseY: number;
  r?: number;
  food?: "meal" | "empty" | "leftover" | "crumbs";
  opacity?: number;
  s?: number;
}> = ({ cx, baseY, r = 86, food = "meal", opacity = 1, s = 1 }) => (
  <G x={cx} y={baseY} s={s} opacity={opacity}>
    <ellipse cx={0} cy={5} rx={r} ry={r * 0.22} fill={A.plateShade} />
    <ellipse cx={0} cy={0} rx={r} ry={r * 0.22} fill={A.plate} />
    <ellipse cx={0} cy={-1} rx={r * 0.7} ry={r * 0.14} fill={A.plateRim} />
    {food === "meal" ? (
      <g>
        <path d={`M ${-r * 0.55} -2 Q ${-r * 0.1} ${-r * 0.78} ${r * 0.4} -2 Z`} fill={A.rice} />
        <ellipse cx={r * 0.3} cy={-r * 0.12} rx={r * 0.3} ry={r * 0.15} fill={A.meat} />
        <ellipse cx={r * 0.3} cy={-r * 0.16} rx={r * 0.2} ry={r * 0.07} fill={A.meatDark} />
        <circle cx={-r * 0.5} cy={-r * 0.1} r={r * 0.1} fill={A.veg} />
        <circle cx={-r * 0.32} cy={-r * 0.06} r={r * 0.08} fill={A.tomato} />
        <circle cx={r * 0.62} cy={-r * 0.05} r={r * 0.07} fill={A.veg} />
      </g>
    ) : null}
    {food === "leftover" ? (
      <g>
        <ellipse cx={-r * 0.25} cy={-r * 0.07} rx={r * 0.22} ry={r * 0.1} fill={A.rice} />
        <ellipse cx={r * 0.2} cy={-r * 0.08} rx={r * 0.2} ry={r * 0.1} fill={A.meat} />
        <circle cx={r * 0.02} cy={-r * 0.06} r={r * 0.07} fill={A.veg} />
      </g>
    ) : null}
    {food === "crumbs" ? (
      <g>
        <circle cx={-r * 0.3} cy={-r * 0.02} r={3} fill={A.rice} />
        <circle cx={r * 0.12} cy={-r * 0.04} r={3.5} fill={A.breadDark} />
        <circle cx={r * 0.35} cy={-r * 0.01} r={2.5} fill={A.meatDark} />
      </g>
    ) : null}
  </G>
);

export const Steam: React.FC<{ cx: number; baseY: number; frame: number; fps: number; strength?: number }> = ({ cx, baseY, frame, fps, strength = 1 }) => (
  <g data-lignore="true">
    {[-34, 0, 34].map((dx, i) => {
      const t = idle(frame, fps, 2.4, i * 1.7);
      return (
        <path
          key={dx}
          d={`M ${cx + dx} ${baseY} C ${cx + dx - 16} ${baseY - 26}, ${cx + dx + 16} ${baseY - 50}, ${cx + dx} ${baseY - 78}`}
          stroke={A.steam}
          strokeWidth={9}
          strokeLinecap="round"
          fill="none"
          style={{ opacity: strength * (0.55 + 0.35 * t) }}
          transform={`translate(0 ${-6 * t})`}
        />
      );
    })}
  </g>
);

export const Fork: React.FC<{ x: number; y: number; rot?: number; s?: number; opacity?: number }> = ({ x, y, rot = 0, s = 1, opacity = 1 }) => (
  <G x={x} y={y} rot={rot} s={s} opacity={opacity}>
    <rect x={-5} y={-10} width={10} height={120} rx={5} fill={A.metal} />
    <rect x={-17} y={-70} width={6} height={64} rx={3} fill={A.metal} />
    <rect x={-3} y={-70} width={6} height={64} rx={3} fill={A.metal} />
    <rect x={11} y={-70} width={6} height={64} rx={3} fill={A.metal} />
    <rect x={-17} y={-16} width={34} height={10} rx={5} fill={A.metal} />
  </G>
);

export const Knife: React.FC<{ x: number; y: number; rot?: number; s?: number; opacity?: number }> = ({ x, y, rot = 0, s = 1, opacity = 1 }) => (
  <G x={x} y={y} rot={rot} s={s} opacity={opacity}>
    <rect x={-5} y={0} width={10} height={110} rx={5} fill={A.metalDark} />
    <path d="M -9 -70 Q 14 -60 9 0 H -9 Z" fill={A.metal} />
  </G>
);

export const Spoon: React.FC<{ x: number; y: number; rot?: number; s?: number; opacity?: number; ghost?: boolean }> = ({ x, y, rot = 0, s = 1, opacity = 1, ghost = false }) => (
  <G x={x} y={y} rot={rot} s={s} opacity={opacity}>
    <rect x={-5} y={0} width={10} height={112} rx={5} fill={ghost ? "none" : A.metal} stroke={ghost ? A.ghost : "none"} strokeWidth={ghost ? 4 : 0} strokeDasharray={ghost ? "10 8" : undefined} />
    <ellipse cx={0} cy={-28} rx={20} ry={34} fill={ghost ? "none" : A.metal} stroke={ghost ? A.ghost : "none"} strokeWidth={ghost ? 4 : 0} strokeDasharray={ghost ? "10 8" : undefined} />
  </G>
);

export const Glass: React.FC<{ x: number; baseY: number; s?: number; opacity?: number }> = ({ x, baseY, s = 1, opacity = 1 }) => (
  <G x={x} y={baseY} s={s} opacity={opacity}>
    <path d="M -22 -78 H 22 L 17 0 H -17 Z" fill={A.water} opacity={0.85} />
    <path d="M -20 -50 H 20 L 17 0 H -17 Z" fill={A.ice} opacity={0.7} />
  </G>
);

export const Receipt: React.FC<{ x: number; y: number; w?: number; h?: number; rot?: number; opacity?: number; s?: number }> = ({ x, y, w = 130, h = 170, rot = 0, opacity = 1, s = 1 }) => {
  const teeth = 8;
  const tw = w / teeth;
  let d = `M ${-w / 2} ${-h / 2} H ${w / 2} V ${h / 2}`;
  for (let i = 0; i < teeth; i++) d += ` l ${-tw / 2} 12 l ${-tw / 2} -12`;
  d += " Z";
  return (
    <G x={x} y={y} rot={rot} s={s} opacity={opacity}>
      <path d={d} fill={A.receipt} />
      <rect x={-w / 2 + 18} y={-h / 2 + 22} width={w * 0.45} height={9} rx={4} fill={A.receiptInk} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={-w / 2 + 18} y={-h / 2 + 52 + i * 22} width={w * 0.4} height={7} rx={3} fill={A.receiptLine} />
          <rect x={w / 2 - 18 - w * 0.2} y={-h / 2 + 52 + i * 22} width={w * 0.2} height={7} rx={3} fill={A.receiptLine} />
        </g>
      ))}
      <rect x={-w / 2 + 18} y={h / 2 - 34} width={w - 36} height={12} rx={6} fill={A.bag} />
    </G>
  );
};

export const Clock: React.FC<{ cx: number; cy: number; r?: number; frame: number; fps: number; opacity?: number; s?: number }> = ({ cx, cy, r = 60, frame, fps, opacity = 1, s = 1 }) => {
  const t = frame / fps;
  const minute = ((t * 45) % 360) - 90;
  const hour = ((t * 45) / 12) % 360;
  return (
    <G x={cx} y={cy} s={s} opacity={opacity}>
      <circle r={r + 8} fill={A.clockRim} />
      <circle r={r} fill={A.clockFace} />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={-2} y={-r + 6} width={4} height={i % 3 === 0 ? 12 : 7} rx={2} fill={A.clockRim} transform={`rotate(${i * 30})`} />
      ))}
      <rect x={-3} y={-r * 0.5} width={6} height={r * 0.5} rx={3} fill={A.clockRim} transform={`rotate(${hour})`} />
      <rect x={-2.5} y={-r * 0.78} width={5} height={r * 0.78} rx={2.5} fill={A.signRed} transform={`rotate(${minute + 90})`} />
      <circle r={6} fill={A.clockRim} />
    </G>
  );
};

export const Bread: React.FC<{ cx: number; cy: number; r?: number; rot?: number; opacity?: number }> = ({ cx, cy, r = 40, rot = 0, opacity = 1 }) => (
  <G x={cx} y={cy} rot={rot} opacity={opacity}>
    <ellipse cx={0} cy={0} rx={r} ry={r * 0.52} fill={A.bread} />
    <ellipse cx={0} cy={-r * 0.08} rx={r * 0.8} ry={r * 0.34} fill={A.breadDark} opacity={0.55} />
    <path d={`M ${-r * 0.4} ${-r * 0.1} l ${r * 0.2} ${-r * 0.16} M ${-r * 0.05} ${-r * 0.1} l ${r * 0.2} ${-r * 0.16}`} stroke={A.breadDark} strokeWidth={4} strokeLinecap="round" fill="none" />
  </G>
);

export const Basket: React.FC<{ cx: number; baseY: number; w?: number; opacity?: number; s?: number }> = ({ cx, baseY, w = 200, opacity = 1, s = 1 }) => (
  <G x={cx} y={baseY} s={s} opacity={opacity}>
    <path d={`M ${-w / 2} -62 H ${w / 2} L ${w / 2 - 22} 0 H ${-w / 2 + 22} Z`} fill={A.basket} />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={-w / 2 + 18 + i * 4} y={-48 + i * 17} width={w - 36 - i * 8} height={6} rx={3} fill={A.basketDark} opacity={0.65} />
    ))}
    <rect x={-w / 2 - 6} y={-72} width={w + 12} height={18} rx={9} fill={A.basketDark} />
  </G>
);

export const TakeBox: React.FC<{ cx: number; baseY: number; w?: number; lid?: number; opacity?: number; s?: number }> = ({ cx, baseY, w = 200, lid = 0, opacity = 1, s = 1 }) => (
  <G x={cx} y={baseY} s={s} opacity={opacity}>
    <path d={`M ${-w / 2} -56 H ${w / 2} L ${w / 2 - 14} 0 H ${-w / 2 + 14} Z`} fill={A.box} />
    <rect x={-w / 2 + 14} y={-46} width={w - 28} height={8} rx={4} fill={A.boxDark} opacity={0.7} />
    {/* lid hinged at the back edge; lid 0 = open (rotated up), 1 = closed */}
    <g transform={`translate(${-w / 2} -56) rotate(${-(1 - lid) * 70})`}>
      <rect x={0} y={-16} width={w} height={16} rx={7} fill={A.boxLid} />
    </g>
  </G>
);

export const Bag: React.FC<{ x: number; y: number; w?: number; h?: number; swing?: number; opacity?: number; s?: number }> = ({ x, y, w = 150, h = 180, swing = 0, opacity = 1, s = 1 }) => (
  <G x={x} y={y} s={s} opacity={opacity} rot={swing}>
    <path d={`M ${-w * 0.25} -${h} C ${-w * 0.25} -${h + 70}, ${w * 0.25} -${h + 70}, ${w * 0.25} -${h}`} stroke={A.bagDark} strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d={`M ${-w / 2} -${h} H ${w / 2} L ${w / 2 - 8} 0 H ${-w / 2 + 8} Z`} fill={A.bag} />
    <path d={`M ${-w / 2} -${h} H ${w / 2} L ${w / 2 - 3} -${h - 40} H ${-w / 2 + 3} Z`} fill={A.bagDark} opacity={0.5} />
    <rect x={-w * 0.22} y={-h * 0.58} width={w * 0.44} height={w * 0.44} rx={14} fill={theme.colors.white} opacity={0.9} />
    <circle cx={0} cy={-h * 0.58 + w * 0.22} r={w * 0.11} fill={A.shirtGreen} />
  </G>
);

export const Chair: React.FC<{ x: number; baseY: number; dir: 1 | -1; opacity?: number; s?: number }> = ({ x, baseY, dir, opacity = 1, s = 1 }) => (
  <G x={x} y={baseY} s={s} opacity={opacity}>
    <ellipse cx={0} cy={4} rx={70} ry={10} fill={theme.colors.shadow} />
    <rect x={-52 * dir - 7} y={-250} width={14} height={160} rx={7} fill={A.chairBack} transform={dir === 1 ? "" : ""} />
    <rect x={-52 * dir - 34} y={-250} width={68} height={120} rx={20} fill={A.chairBack} />
    <rect x={-62} y={-96} width={124} height={22} rx={11} fill={A.chairSeat} />
    <rect x={-52} y={-76} width={14} height={76} rx={6} fill={A.tableLeg} />
    <rect x={38} y={-76} width={14} height={76} rx={6} fill={A.tableLeg} />
  </G>
);

export const Badge: React.FC<{ cx: number; cy: number; r?: number; label: string; fill?: string; ink?: string; size?: number; opacity?: number; s?: number }> = ({
  cx,
  cy,
  r = 56,
  label,
  fill = A.bag,
  ink = theme.colors.white,
  size = 72,
  opacity = 1,
  s = 1,
}) => (
  <G x={cx} y={cy} s={s} opacity={opacity}>
    <circle r={r} fill={fill} />
    <text x={0} y={size * 0.35} textAnchor="middle" fontFamily={theme.fonts.latin} fontWeight={800} fontSize={size} fill={ink}>
      {label}
    </text>
  </G>
);

export const Snowflake: React.FC<{ cx: number; cy: number; r?: number; rot?: number; opacity?: number }> = ({ cx, cy, r = 36, rot = 0, opacity = 1 }) => (
  <G x={cx} y={cy} rot={rot} opacity={opacity}>
    {[0, 60, 120].map((a) => (
      <g key={a} transform={`rotate(${a})`}>
        <rect x={-3.5} y={-r} width={7} height={r * 2} rx={3.5} fill={A.iceDeep} />
        <path d={`M -12 ${-r + 12} L 0 ${-r + 2} L 12 ${-r + 12} M -12 ${r - 12} L 0 ${r - 2} L 12 ${r - 12}`} stroke={A.iceDeep} strokeWidth={5} strokeLinecap="round" fill="none" />
      </g>
    ))}
  </G>
);

export const Counter: React.FC<{ x: number; topY: number; w: number; h?: number }> = ({ x, topY, w, h = 160 }) => (
  <g>
    <rect x={x} y={topY + 24} width={w} height={h} rx={10} fill={A.counterDark} />
    <rect x={x + 18} y={topY + 44} width={w - 36} height={h - 40} rx={8} fill={A.counter} opacity={0.55} />
    <rect x={x - 14} y={topY} width={w + 28} height={30} rx={13} fill={A.counter} />
  </g>
);

export const Sign: React.FC<{ cx: number; baseY: number; opacity?: number; s?: number; rot?: number }> = ({ cx, baseY, opacity = 1, s = 1, rot = 0 }) => (
  <G x={cx} y={baseY} s={s} opacity={opacity} rot={rot}>
    <path d="M -22 0 L 0 -26 L 22 0 Z" fill={A.metalDark} />
    <rect x={-92} y={-94} width={184} height={74} rx={14} fill={A.signRed} />
    <text x={0} y={-45} textAnchor="middle" fontFamily={theme.fonts.latin} fontWeight={800} fontSize={34} letterSpacing={2} fill={A.signText}>
      RESERVED
    </text>
  </G>
);

export const QuestionBubble: React.FC<{ cx: number; cy: number; opacity?: number; s?: number; rot?: number }> = ({ cx, cy, opacity = 1, s = 1, rot = 0 }) => (
  <G x={cx} y={cy} s={s} opacity={opacity} rot={rot}>
    <circle r={50} fill={theme.colors.accent} />
    <path d="M -14 44 L -34 74 L 8 52 Z" fill={theme.colors.accent} />
    <text x={0} y={26} textAnchor="middle" fontFamily={theme.fonts.latin} fontWeight={800} fontSize={72} fill={theme.colors.white}>
      ?
    </text>
  </G>
);
