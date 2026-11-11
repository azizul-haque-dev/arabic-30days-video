import React from "react";
import { theme } from "../config/theme";

const C = theme.colors;
const I = theme.ill;

type G = { x: number; y: number; s?: number };

/* ------------------------------------------------------------------ people */

export type PersonProps = G & {
  shirt?: string;
  skin?: string;
  hair?: string;
  flip?: boolean;
  arm?: "down" | "up" | "point" | "hold";
  apron?: boolean;
  /** Gulf thobe + ghutra */
  thobe?: boolean;
  bob?: number;
  /** only head + shoulders (used inside vehicles / cab) */
  bust?: boolean;
};

const HAND: Record<NonNullable<PersonProps["arm"]>, [number, number]> = {
  down: [44, -96],
  up: [66, -268],
  point: [100, -196],
  hold: [66, -138],
};

/** Origin = feet centre. ~270 units tall at s=1. */
export const Person: React.FC<PersonProps> = ({
  x,
  y,
  s = 1,
  shirt = I.shirt[0],
  skin = I.skin[0],
  hair = I.hair[0],
  flip,
  arm = "down",
  apron,
  thobe,
  bob = 0,
  bust,
}) => {
  const [hx, hy] = HAND[arm];
  const sx = flip ? -s : s;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${sx} ${s})`}>
      {!bust && <ellipse cx={0} cy={2} rx={50} ry={9} fill={C.shadow} />}
      {!bust && !thobe && (
        <>
          <rect x={-28} y={-98} width={24} height={96} rx={9} fill={I.pants} />
          <rect x={4} y={-98} width={24} height={96} rx={9} fill={I.pants} />
          <rect x={-34} y={-10} width={32} height={14} rx={7} fill={C.text} />
          <rect x={2} y={-10} width={32} height={14} rx={7} fill={C.text} />
        </>
      )}
      {!bust && thobe && (
        <path d="M-40 -190 H40 L50 -6 Q0 6 -50 -6 Z" fill={I.thobe} stroke={C.line} strokeWidth={3} />
      )}
      {!thobe && <rect x={-40} y={-200} width={80} height={bust ? 120 : 118} rx={30} fill={shirt} />}
      {apron && <path d="M-26 -176 H26 V-84 Q0 -76 -26 -84 Z" fill={C.white} opacity={0.96} />}
      <rect x={-9} y={-224} width={18} height={30} rx={8} fill={skin} />
      <line x1={30} y1={-176} x2={hx} y2={hy} stroke={thobe ? I.thobe : shirt} strokeWidth={26} strokeLinecap="round" />
      {thobe && <line x1={30} y1={-176} x2={hx} y2={hy} stroke={C.line} strokeWidth={2} strokeLinecap="round" opacity={0.0} />}
      <circle cx={hx} cy={hy} r={14} fill={skin} />
      <circle cx={0} cy={-236} r={34} fill={skin} />
      {thobe ? (
        <>
          <path d="M-38 -240 a38 38 0 0 1 76 0 v22 q-38 -10 -76 0 z" fill={C.white} stroke={C.line} strokeWidth={2} />
          <ellipse cx={0} cy={-262} rx={30} ry={6} fill={C.text} />
        </>
      ) : (
        <path d="M-35 -240 a35 35 0 0 1 70 0 q-35 -22 -70 0 z" fill={hair} />
      )}
      <circle cx={-12} cy={-232} r={3.6} fill={C.text} />
      <circle cx={12} cy={-232} r={3.6} fill={C.text} />
      <path d="M-9 -218 q9 8 18 0" stroke={C.text} strokeWidth={3} fill="none" strokeLinecap="round" />
    </g>
  );
};

/* ------------------------------------------------------------------ market */

export const Shelf: React.FC<{ x: number; y: number; w: number; h: number; rows?: number; seed?: number }> = ({
  x,
  y,
  w,
  h,
  rows = 3,
  seed = 0,
}) => {
  const rowH = h / rows;
  const items: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    const bw = 34;
    const n = Math.floor((w - 20) / (bw + 8));
    for (let i = 0; i < n; i++) {
      const color = I.products[(i * 3 + r * 2 + seed) % I.products.length];
      const bh = 36 + ((i * 7 + r * 5 + seed) % 4) * 8;
      const bx = x + 14 + i * (bw + 8);
      const by = y + (r + 1) * rowH - 10 - bh;
      items.push(
        <g key={`${r}-${i}`}>
          <rect x={bx} y={by} width={bw} height={bh} rx={6} fill={color} />
          <rect x={bx + 5} y={by + bh * 0.3} width={bw - 10} height={bh * 0.22} rx={3} fill={C.white} opacity={0.75} />
        </g>,
      );
    }
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill={I.buildingShade} stroke={I.woodDark} strokeWidth={5} />
      {Array.from({ length: rows }, (_, r) => (
        <rect key={`p${r}`} x={x - 4} y={y + (r + 1) * rowH - 10} width={w + 8} height={10} rx={4} fill={I.wood} />
      ))}
      {items}
    </g>
  );
};

export const Basket: React.FC<G & { produce?: boolean }> = ({ x, y, s = 1, produce = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {produce && (
      <>
        <circle cx={-26} cy={-62} r={20} fill={I.tomato} />
        <circle cx={14} cy={-70} r={20} fill={I.cucumber} />
        <rect x={20} y={-100} width={26} height={60} rx={13} fill={I.products[0]} />
        <rect x={-58} y={-96} width={26} height={56} rx={6} fill={I.products[2]} />
      </>
    )}
    <path d="M-70 -50 H70 L56 20 Q54 30 44 30 H-44 Q-54 30 -56 20 Z" fill={I.wood} />
    <path d="M-62 -22 H62 M-58 2 H58" stroke={I.woodDark} strokeWidth={4} />
    <path d="M-60 -50 Q0 -150 60 -50" stroke={I.woodDark} strokeWidth={7} fill="none" strokeLinecap="round" />
  </g>
);

export const RiceBag: React.FC<G & { label?: string }> = ({ x, y, s = 1, label }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={2} rx={84} ry={10} fill={C.shadow} />
    <path d="M-70 0 Q-80 -110 -56 -190 H56 Q80 -110 70 0 Z" fill={I.rice} stroke={I.woodDark} strokeWidth={4} />
    <path d="M-56 -190 L-44 -212 H44 L56 -190 Z" fill={I.sand} stroke={I.woodDark} strokeWidth={4} />
    <rect x={-54} y={-132} width={108} height={52} rx={12} fill={C.primary} />
    <text x={0} y={-96} textAnchor="middle" fontFamily={theme.fonts.en} fontWeight={800} fontSize={26} fill={C.white}>
      {label ?? "RICE"}
    </text>
    <circle cx={0} cy={-50} r={12} fill={C.accent} />
  </g>
);

/** Mechanical weighing scale with a dial; `rice` shows a heap on the pan. */
export const WeighScale: React.FC<G & { needle?: number; rice?: number }> = ({ x, y, s = 1, needle = 0, rice = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={2} rx={84} ry={9} fill={C.shadow} />
    <rect x={-70} y={-34} width={140} height={34} rx={12} fill={I.metalDark} />
    <rect x={-22} y={-104} width={44} height={74} rx={10} fill={I.metal} />
    <circle cx={0} cy={-120} r={46} fill={C.white} stroke={I.metalDark} strokeWidth={6} />
    {Array.from({ length: 9 }, (_, i) => {
      const a = (-120 + i * 30) * (Math.PI / 180);
      return (
        <line key={i} x1={Math.cos(a) * 34} y1={-120 + Math.sin(a) * 34} x2={Math.cos(a) * 41} y2={-120 + Math.sin(a) * 41} stroke={C.text} strokeWidth={3} />
      );
    })}
    <line x1={0} y1={-120} x2={Math.cos(((-120 + needle * 240) * Math.PI) / 180) * 32} y2={-120 + Math.sin(((-120 + needle * 240) * Math.PI) / 180) * 32} stroke={C.danger} strokeWidth={4} strokeLinecap="round" />
    <circle cx={0} cy={-120} r={5} fill={C.text} />
    <ellipse cx={0} cy={-176} rx={78} ry={14} fill={I.metal} stroke={I.metalDark} strokeWidth={4} />
    {rice > 0 && <path d={`M-56 -186 Q0 ${-186 - 70 * rice} 56 -186 Z`} fill={I.rice} stroke={I.woodDark} strokeWidth={2} />}
  </g>
);

export const DigitalScale: React.FC<G & { qty: string; on?: boolean }> = ({ x, y, s = 1, qty, on = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={2} rx={110} ry={9} fill={C.shadow} />
    <rect x={-100} y={-70} width={200} height={70} rx={16} fill={I.metalDark} />
    <rect x={-80} y={-60} width={160} height={36} rx={8} fill={I.screen} />
    {on && (
      <text x={0} y={-33} textAnchor="middle" fontFamily={theme.fonts.en} fontWeight={800} fontSize={28} fill={I.screenGlow}>
        {qty}
      </text>
    )}
    <rect x={-96} y={-96} width={192} height={26} rx={10} fill={I.metal} stroke={I.metalDark} strokeWidth={3} />
  </g>
);

export const MeatCut: React.FC<G & { rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-44 0 Q-52 -34 -14 -42 Q30 -50 46 -14 Q54 18 12 24 Q-30 30 -44 0 Z" fill={I.meat} />
    <path d="M-30 -8 Q0 -26 30 -6" stroke={I.fat} strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M-22 8 Q4 -2 26 10" stroke={I.meatDark} strokeWidth={4} fill="none" strokeLinecap="round" />
  </g>
);

export const Tomato: React.FC<G> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={24} fill={I.tomato} />
    <path d="M-10 -22 L0 -12 L10 -22 L0 -30 Z" fill={I.leaf} />
    <circle cx={-8} cy={-6} r={5} fill={C.white} opacity={0.45} />
  </g>
);

export const Cucumber: React.FC<G & { rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-42} y={-14} width={84} height={28} rx={14} fill={I.cucumber} />
    <rect x={-30} y={-6} width={50} height={6} rx={3} fill={I.leaf} opacity={0.6} />
  </g>
);

export const Lettuce: React.FC<G> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={-14} cy={0} r={26} fill={I.leaf} />
    <circle cx={14} cy={0} r={26} fill={I.cucumber} />
    <circle cx={0} cy={-14} r={24} fill={I.leafDark} opacity={0.85} />
  </g>
);

export const Crate: React.FC<{ x: number; y: number; w: number; h?: number }> = ({ x, y, w, h = 64 }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={8} fill={I.wood} stroke={I.woodDark} strokeWidth={4} />
    <line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2} stroke={I.woodDark} strokeWidth={4} />
  </g>
);

export const PriceTag: React.FC<G & { rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-36 -22 H22 L40 0 L22 22 H-36 Z" fill={C.accent} />
    <circle cx={-24} cy={0} r={5} fill={C.white} />
    <rect x={-10} y={-8} width={26} height={6} rx={3} fill={C.white} />
    <rect x={-10} y={4} width={18} height={6} rx={3} fill={C.white} opacity={0.8} />
  </g>
);

export const Counter: React.FC<{ x: number; y: number; w: number; h?: number }> = ({ x, y, w, h = 70 }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={10} fill={I.wood} />
    <rect x={x - 8} y={y - 12} width={w + 16} height={20} rx={8} fill={I.woodDark} />
  </g>
);

export const MeatCase: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={16} fill={I.glass} opacity={0.8} stroke={I.metalDark} strokeWidth={5} />
    <rect x={x + 10} y={y + h * 0.55} width={w - 20} height={10} rx={4} fill={C.white} opacity={0.9} />
    {Array.from({ length: Math.floor(w / 90) }, (_, i) => (
      <g key={i}>
        <MeatCut x={x + 50 + i * 90} y={y + h * 0.5} s={0.8} rot={i % 2 ? 8 : -6} />
        <MeatCut x={x + 62 + i * 90} y={y + h * 0.85} s={0.7} rot={i % 2 ? -10 : 5} />
      </g>
    ))}
    <rect x={x} y={y + h - 14} width={w} height={14} rx={6} fill={I.metalDark} />
  </g>
);

/* --------------------------------------------------------------- transport */

export const Taxi: React.FC<
  G & { flip?: boolean; wheelRot?: number; riders?: boolean; brake?: boolean; passengerArm?: boolean }
> = ({ x, y, s = 1, flip, wheelRot = 0, riders, brake, passengerArm }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={0} cy={4} rx={200} ry={12} fill={C.shadow} />
    {/* cabin */}
    <path d="M-108 -104 L-72 -168 Q-66 -178 -52 -178 H64 Q78 -178 86 -166 L122 -104 Z" fill={I.taxi} />
    <path d="M-92 -108 L-62 -160 H-10 V-108 Z" fill={I.glass} />
    <path d="M10 -160 H62 L92 -108 H10 Z" fill={I.glass} />
    {riders && (
      <>
        <circle cx={-34} cy={-126} r={20} fill={I.skin[1]} />
        <path d="M-54 -130 a20 20 0 0 1 40 0 q-20 -12 -40 0 z" fill={I.hair[0]} />
        <circle cx={50} cy={-126} r={20} fill={I.skin[0]} />
        <path d="M30 -134 a20 20 0 0 1 40 0 v8 q-20 -8 -40 0 z" fill={C.white} />
        <ellipse cx={50} cy={-148} rx={17} ry={4} fill={C.text} />
      </>
    )}
    {passengerArm && (
      <>
        <line x1={-30} y1={-112} x2={-96} y2={-132} stroke={I.shirt[0]} strokeWidth={18} strokeLinecap="round" />
        <circle cx={-100} cy={-133} r={11} fill={I.skin[1]} />
      </>
    )}
    {/* lower body */}
    <rect x={-190} y={-106} width={380} height={72} rx={28} fill={I.taxi} />
    <rect x={-190} y={-66} width={380} height={12} fill={I.taxiDark} />
    {Array.from({ length: 19 }, (_, i) => (
      <rect key={i} x={-190 + i * 20} y={-92 + (i % 2) * 10} width={10} height={10} fill={C.text} opacity={0.85} />
    ))}
    <rect x={-36} y={-212} width={72} height={34} rx={8} fill={C.text} />
    <text x={0} y={-188} textAnchor="middle" fontFamily={theme.fonts.en} fontWeight={800} fontSize={20} fill={C.accent}>
      TAXI
    </text>
    <rect x={-6} y={-128} width={12} height={8} rx={4} fill={I.taxiDark} />
    <ellipse cx={176} cy={-78} rx={11} ry={8} fill={C.white} />
    <ellipse cx={-180} cy={-78} rx={8} ry={10} fill={brake ? C.danger : I.taxiDark} />
    {brake && <ellipse cx={-186} cy={-78} rx={22} ry={16} fill={C.danger} opacity={0.25} />}
    <rect x={-60} y={-84} width={36} height={8} rx={4} fill={I.taxiDark} />
    <rect x={28} y={-96} width={58} height={26} rx={6} fill={C.white} />
    <rect x={34} y={-88} width={30} height={5} rx={2.5} fill={C.primary} />
    <rect x={34} y={-79} width={42} height={4} rx={2} fill={I.metal} />
    {[-110, 110].map((cx) => (
      <g key={cx} transform={`translate(${cx} -30)`}>
        <circle r={36} fill={C.text} />
        <g transform={`rotate(${wheelRot})`}>
          <circle r={19} fill={I.metal} />
          {[0, 72, 144, 216, 288].map((a) => (
            <line key={a} x1={0} y1={0} x2={Math.cos((a * Math.PI) / 180) * 17} y2={Math.sin((a * Math.PI) / 180) * 17} stroke={I.metalDark} strokeWidth={4} />
          ))}
        </g>
        <circle r={5} fill={I.metalDark} />
      </g>
    ))}
  </g>
);

/** Fare meter: never shows an amount. Running state = animated segment bars. */
export const MeterBox: React.FC<G & { on: boolean; t: number }> = ({ x, y, s = 1, on, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-110} y={-70} width={220} height={140} rx={22} fill={I.metalDark} />
    <rect x={-92} y={-54} width={184} height={70} rx={12} fill={I.screen} />
    {Array.from({ length: 7 }, (_, i) => {
      const h = on ? 14 + 30 * Math.abs(Math.sin(t * 3 + i * 0.7)) : 8;
      return <rect key={i} x={-80 + i * 25} y={-19 - h / 2 + 8} width={16} height={h} rx={4} fill={I.screenGlow} opacity={on ? 0.95 : 0.25} />;
    })}
    <circle cx={-60} cy={44} r={10} fill={on ? I.screenGlow : I.metal} />
    <rect x={-30} y={34} width={90} height={20} rx={10} fill={I.metal} />
    <circle cx={80} cy={44} r={10} fill={C.accent} />
  </g>
);

export const PlaneIcon: React.FC<G & { rot?: number; color?: string }> = ({ x, y, s = 1, rot = 0, color = C.white }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0 -40 Q8 -40 8 -30 V-8 L44 14 V26 L8 14 V32 L22 42 V50 L0 44 L-22 50 V42 L-8 32 V14 L-44 26 V14 L-8 -8 V-30 Q-8 -40 0 -40 Z" fill={color} />
  </g>
);

export const AirportTerminal: React.FC<G> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-190} y={-150} width={380} height={150} rx={16} fill={I.building} stroke={C.line} strokeWidth={3} />
    <path d="M-190 -150 Q0 -230 190 -150 Z" fill={I.buildingShade} />
    <rect x={-170} y={-120} width={340} height={70} rx={8} fill={I.glass} />
    {Array.from({ length: 6 }, (_, i) => (
      <line key={i} x1={-170 + i * 68} y1={-120} x2={-170 + i * 68} y2={-50} stroke={C.white} strokeWidth={4} />
    ))}
    <rect x={-36} y={-50} width={72} height={50} rx={6} fill={I.metalDark} />
    <rect x={150} y={-250} width={38} height={110} rx={8} fill={I.buildingShade} stroke={C.line} strokeWidth={3} />
    <rect x={142} y={-266} width={54} height={22} rx={8} fill={C.primary} />
  </g>
);

export const AirportSign: React.FC<G> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-6} y={-110} width={12} height={110} rx={4} fill={I.metalDark} />
    <rect x={-104} y={-190} width={208} height={92} rx={16} fill={C.primary} stroke={C.white} strokeWidth={5} />
    <PlaneIcon x={-54} y={-144} s={0.62} rot={90} />
    <text x={26} y={-132} textAnchor="middle" fontFamily={theme.fonts.en} fontWeight={800} fontSize={26} fill={C.white}>
      AIRPORT
    </text>
  </g>
);

export const Pin: React.FC<G & { color?: string }> = ({ x, y, s = 1, color = C.danger }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0 C-34 -46 -40 -70 -40 -88 A40 40 0 0 1 40 -88 C40 -70 34 -46 0 0 Z" fill={color} stroke={C.white} strokeWidth={5} />
    <circle cx={0} cy={-88} r={14} fill={C.white} />
  </g>
);

export const Palm: React.FC<G> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0 Q14 -80 4 -170" stroke={I.woodDark} strokeWidth={14} fill="none" strokeLinecap="round" />
    {[-70, -35, 0, 35, 70].map((a) => (
      <ellipse key={a} cx={4 + Math.sin((a * Math.PI) / 180) * 46} cy={-176 + Math.abs(a) * 0.3} rx={52} ry={12} fill={I.leaf} transform={`rotate(${a - 90 + (a < 0 ? 0 : 0)} ${4} ${-176})`} />
    ))}
  </g>
);

export const Building: React.FC<{ x: number; y: number; w: number; h: number; dome?: boolean }> = ({ x, y, w, h, dome }) => (
  <g>
    <rect x={x} y={y - h} width={w} height={h} rx={6} fill={I.building} stroke={C.line} strokeWidth={3} />
    {dome && <path d={`M${x} ${y - h} Q${x + w / 2} ${y - h - w * 0.5} ${x + w} ${y - h} Z`} fill={I.buildingShade} />}
    {Array.from({ length: Math.max(1, Math.floor(w / 46)) }, (_, i) => (
      <rect key={i} x={x + 14 + i * 40} y={y - h + 22} width={22} height={30} rx={5} fill={I.glass} />
    ))}
  </g>
);

/** Road scene backdrop for 940 x 620. */
export const RoadBackdrop: React.FC = () => (
  <g>
    <rect x={0} y={0} width={940} height={620} rx={28} fill={I.sky} />
    <circle cx={800} cy={90} r={46} fill={C.accent} opacity={0.35} />
    <Building x={20} y={330} w={150} h={150} dome />
    <Building x={190} y={330} w={110} h={110} />
    <Building x={640} y={330} w={130} h={170} />
    <Building x={790} y={330} w={120} h={120} dome />
    <Palm x={330} y={340} s={0.9} />
    <Palm x={600} y={340} s={0.8} />
    <rect x={0} y={330} width={940} height={70} fill={I.curb} />
    <rect x={0} y={400} width={940} height={220} rx={0} fill={I.road} />
    <path d="M0 592 a28 28 0 0 0 28 28 H912 a28 28 0 0 0 28 -28 V590 H0 Z" fill={I.road} />
    {Array.from({ length: 8 }, (_, i) => (
      <rect key={i} x={30 + i * 120} y={505} width={70} height={10} rx={5} fill={I.roadLine} />
    ))}
  </g>
);

/** Cab interior (front view) used by the fare and meter sentences. */
export const CabInterior: React.FC<{ t: number; meterOn: boolean; pressing?: number; bubble?: boolean }> = ({ t, meterOn, pressing = 0, bubble }) => (
  <g>
    <rect x={0} y={0} width={940} height={620} rx={28} fill={I.sky} />
    <rect x={30} y={30} width={880} height={290} rx={26} fill={I.glass} />
    <Building x={70} y={300} w={140} h={120} />
    <Building x={240} y={300} w={110} h={90} dome />
    <Palm x={470} y={300} s={0.7} />
    <Building x={600} y={300} w={150} h={140} />
    <rect x={30} y={300} width={880} height={20} fill={I.road} opacity={0.6} />
    <rect x={0} y={330} width={940} height={290} rx={28} fill={C.text} opacity={0.92} />
    <rect x={0} y={330} width={940} height={36} fill={I.metalDark} />
    {/* driver (left) */}
    <Person x={200} y={620} s={1.25} bust shirt={I.shirt[3]} skin={I.skin[1]} hair={I.hair[2]} />
    <circle cx={200} cy={470} r={92} fill="none" stroke={I.metalDark} strokeWidth={16} />
    <circle cx={200} cy={470} r={20} fill={I.metalDark} />
    {/* passenger (right) */}
    <Person x={740} y={620} s={1.25} bust shirt={I.shirt[1]} skin={I.skin[0]} hair={I.hair[1]} flip />
    {/* dash + meter */}
    <rect x={330} y={470} width={280} height={150} rx={26} fill={I.metalDark} />
    <MeterBox x={470} y={520} s={0.95} on={meterOn} t={t} />
    {/* driver reaching to the meter */}
    <line x1={250} y1={450} x2={250 + 150 * pressing + 10} y2={500 + 14 * pressing - 6} stroke={I.shirt[3]} strokeWidth={28} strokeLinecap="round" />
    <circle cx={250 + 150 * pressing + 10} cy={500 + 14 * pressing - 6} r={15} fill={I.skin[1]} />
    {bubble && (
      <g transform={`translate(${690} ${150 + Math.sin(t * 2) * 4})`}>
        <path d="M-100 -70 H100 Q124 -70 124 -46 V30 Q124 54 100 54 H40 L20 100 L6 54 H-100 Q-124 54 -124 30 V-46 Q-124 -70 -100 -70 Z" fill={C.white} stroke={C.line} strokeWidth={4} />
        <rect x={-96} y={-30} width={78} height={46} rx={8} fill={I.cucumber} stroke={I.leafDark} strokeWidth={3} />
        <circle cx={-57} cy={-7} r={13} fill={C.white} opacity={0.8} />
        <circle cx={-4} cy={-8} r={24} fill={C.accent} stroke={I.taxiDark} strokeWidth={4} />
        <text x={72} y={22} textAnchor="middle" fontFamily={theme.fonts.en} fontWeight={800} fontSize={72} fill={C.primary}>
          ?
        </text>
      </g>
    )}
  </g>
);

export const QuestionBubble: React.FC<G & { flip?: boolean }> = ({ x, y, s = 1, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M-52 -46 H52 Q72 -46 72 -26 V26 Q72 46 52 46 H20 L6 78 L-4 46 H-52 Q-72 46 -72 26 V-26 Q-72 -46 -52 -46 Z" fill={C.white} stroke={C.line} strokeWidth={4} />
    <text x={flip ? 0 : 0} y={26} textAnchor="middle" fontFamily={theme.fonts.en} fontWeight={800} fontSize={64} fill={C.primary} transform={flip ? "scale(-1 1)" : undefined}>
      ?
    </text>
  </g>
);
