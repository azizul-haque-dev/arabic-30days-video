import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";

const A = theme.art;
const C = theme.colors;
type G = { x?: number; y?: number; s?: number; r?: number; children?: React.ReactNode };
const T = ({ x = 0, y = 0, s = 1, r = 0, children }: G) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>{children}</g>
);

/* ---------- animated helpers (deterministic, frame based) ---------- */
export const Steam: React.FC<{ x?: number; y?: number; count?: number; height?: number }> = ({ x = 0, y = 0, count = 3, height = 90 }) => {
  const frame = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke={A.steam} strokeLinecap="round" strokeWidth={7}>
      {Array.from({ length: count }).map((_, i) => {
        const phase = (frame / 48 + i / count) % 1;
        const rise = phase * height;
        const sway = Math.sin(frame / 11 + i * 1.7) * 7;
        const cx = (i - (count - 1) / 2) * 38;
        return (
          <path key={i} opacity={Math.sin(phase * Math.PI) * 0.85}
            d={`M${cx} ${-rise} q${14 + sway} -20 0 -40 q${-14 + sway} -20 0 -40`} />
        );
      })}
    </g>
  );
};

/* ---------- 2. Restaurant table ---------- */
export const Table: React.FC<G & { w?: number }> = ({ w = 760, ...g }) => (
  <T {...g}>
    <rect x={-18} y={60} width={36} height={300} fill={A.woodDark} />
    <ellipse cx={0} cy={360} rx={110} ry={22} fill={A.woodDark} />
    <ellipse cx={0} cy={20} rx={w / 2} ry={74} fill={A.woodDark} />
    <ellipse cx={0} cy={0} rx={w / 2} ry={74} fill={A.wood} />
    <ellipse cx={0} cy={-6} rx={w / 2 - 36} ry={56} fill="none" stroke={A.woodDark} strokeOpacity={0.25} strokeWidth={3} />
  </T>
);

/* ---------- plates / food ---------- */
export const Plate: React.FC<G & { rx?: number; ry?: number }> = ({ rx = 170, ry = 48, children, ...g }) => (
  <T {...g}>
    <ellipse cx={0} cy={ry * 0.6} rx={rx * 1.03} ry={ry} fill={A.shadow} />
    <ellipse cx={0} cy={0} rx={rx} ry={ry} fill={A.plateRim} />
    <ellipse cx={0} cy={-5} rx={rx * 0.86} ry={ry * 0.8} fill={A.plate} />
    {children}
  </T>
);

const RiceGrains: React.FC<{ n?: number; w?: number; h?: number }> = ({ n = 22, w = 120, h = 70 }) => (
  <g fill={A.riceDark} opacity={0.55}>
    {Array.from({ length: n }).map((_, i) => {
      const a = (i * 137.5 * Math.PI) / 180;
      const rr = Math.sqrt((i + 1) / n);
      return <ellipse key={i} cx={Math.cos(a) * w * rr} cy={-h * 0.5 + Math.sin(a) * h * 0.45 * rr} rx={7} ry={3} transform={`rotate(${(i * 47) % 180} ${Math.cos(a) * w * rr} ${-h * 0.5 + Math.sin(a) * h * 0.45 * rr})`} />;
    })}
  </g>
);

/* ---------- 5. Kabsa rice platter ---------- */
export const KabsaPlatter: React.FC<G & { children?: React.ReactNode }> = ({ children, ...g }) => (
  <T {...g}>
    <Plate rx={230} ry={62}>
      <path d="M-170 -8 C-150 -105 -70 -138 0 -138 C70 -138 150 -105 170 -8 C100 18 -100 18 -170 -8Z" fill={A.rice} />
      <path d="M-170 -8 C-100 18 100 18 170 -8 C150 6 60 22 0 22 C-60 22 -150 6 -170 -8Z" fill={A.riceDark} opacity={0.5} />
      <RiceGrains n={34} w={140} h={150} />
      {[[-70, -90], [-10, -110], [55, -84], [100, -50], [-110, -48]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={7} fill={A.raisin} />
      ))}
      {[[-40, -66], [30, -98], [80, -70], [-90, -78]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={11} ry={4.5} fill={A.almond} transform={`rotate(${i * 38 - 30} ${x} ${y})`} />
      ))}
      {children}
    </Plate>
  </T>
);

/* ---------- 6. Grilled chicken ---------- */
export const GrilledChicken: React.FC<G> = (g) => (
  <T {...g}>
    <ellipse cx={0} cy={50} rx={118} ry={16} fill={A.shadow} />
    <g transform="rotate(-12)">
      <path d="M-120 10 C-120 -50 -40 -78 30 -70 C100 -62 128 -20 118 24 C108 62 40 74 -30 66 C-90 60 -120 44 -120 10Z" fill={A.chicken} />
      <path d="M-100 -4 C-96 -42 -36 -62 24 -56 C80 -50 104 -22 98 8 C60 -20 -20 -30 -100 -4Z" fill={A.glaze} opacity={0.8} />
      {[-70, -40, -10, 20, 50, 80].map((x, i) => (
        <line key={i} x1={x - 14} y1={-34 + Math.abs(x) * 0.12} x2={x + 16} y2={30 - Math.abs(x) * 0.1} stroke={A.chickenDark} strokeWidth={9} strokeLinecap="round" opacity={0.75} />
      ))}
    </g>
    <g transform="translate(112 18) rotate(-22)">
      <rect x={-6} y={-12} width={64} height={24} rx={12} fill={A.chicken} />
      <rect x={34} y={-9} width={34} height={18} rx={9} fill={A.almond} />
      <circle cx={70} cy={-9} r={10} fill={A.almond} />
      <circle cx={70} cy={9} r={10} fill={A.almond} />
    </g>
  </T>
);

/* ---------- 10. Meat kabsa ---------- */
export const MeatKabsa: React.FC<G> = (g) => (
  <KabsaPlatter {...g}>
    {[[-80, -86, -20], [-8, -118, 8], [66, -92, 26], [-40, -52, 12], [30, -62, -14]].map(([x, y, r], i) => (
      <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
        <rect x={-34} y={-20} width={68} height={40} rx={18} fill={A.meat} />
        <rect x={-28} y={-16} width={44} height={13} rx={6.5} fill={A.glaze} opacity={0.55} />
        <rect x={-30} y={4} width={58} height={9} rx={4.5} fill={A.meatDark} opacity={0.45} />
      </g>
    ))}
  </KabsaPlatter>
);

/* ---------- 9. Biryani plate ---------- */
export const BiryaniPlate: React.FC<G> = (g) => (
  <T {...g}>
    <Plate rx={200} ry={56}>
      <path d="M-150 -6 C-130 -96 -60 -126 0 -126 C60 -126 130 -96 150 -6 C90 16 -90 16 -150 -6Z" fill={A.saffron} />
      <RiceGrains n={30} w={120} h={130} />
      {[[-70, -78, A.chili], [20, -100, A.herb], [70, -66, A.chili], [-20, -56, A.herb], [-100, -40, A.herb], [96, -34, A.chili]].map(([x, y, c], i) => (
        <circle key={i} cx={x as number} cy={y as number} r={7} fill={c as string} />
      ))}
      {[[-44, -104], [36, -76], [-92, -66]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={20} ry={6} fill={A.onion} transform={`rotate(${i * 30 - 20} ${x} ${y})`} />
      ))}
      <g transform="translate(112 -40)">
        <ellipse rx={32} ry={22} fill={A.egg} stroke={A.line} strokeWidth={2} />
        <ellipse rx={13} ry={9} fill={A.yolk} />
      </g>
      <g transform="translate(-126 -30) rotate(-20)">
        <ellipse rx={16} ry={7} fill={A.herb} />
        <ellipse cx={14} cy={-8} rx={14} ry={6} fill={A.herb} transform="rotate(-30)" />
      </g>
    </Plate>
  </T>
);

/* ---------- 11. Fish ---------- */
export const Fish: React.FC<G> = (g) => (
  <T {...g}>
    <path d="M-110 0 C-70 -56 40 -60 90 -6 L150 -48 C142 -10 142 10 150 48 L90 6 C40 60 -70 56 -110 0Z" fill={A.fish} />
    <path d="M-100 8 C-60 40 40 44 84 6 C40 20 -60 20 -100 8Z" fill={A.fishBelly} />
    <path d="M-20 -46 C0 -88 40 -84 56 -44Z" fill={A.fishDark} />
    <path d="M-10 26 C10 56 40 58 52 34Z" fill={A.fishDark} />
    <path d="M-52 -30 C-70 -10 -70 10 -52 30" fill="none" stroke={A.fishDark} strokeWidth={5} strokeLinecap="round" />
    {[[-10, -14], [20, -14], [46, -10], [5, 6], [34, 6]].map(([x, y], i) => (
      <path key={i} d={`M${x - 9} ${y} q9 -12 18 0`} fill="none" stroke={A.fishDark} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
    ))}
    <circle cx={-80} cy={-8} r={9} fill={C.white} />
    <circle cx={-82} cy={-8} r={4.5} fill={A.black} />
  </T>
);

export const SeafoodDisplay: React.FC<G> = (g) => (
  <T {...g}>
    <rect x={-250} y={-20} width={500} height={110} rx={26} fill={A.woodDark} />
    <rect x={-236} y={-34} width={472} height={84} rx={30} fill={A.ice} />
    {[[-150, 0], [-60, 20], [60, -4], [150, 16]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={20 + (i % 2) * 8} fill={C.white} opacity={0.55} />
    ))}
    <Fish x={-96} y={-24} s={0.78} r={-6} />
    <Fish x={104} y={-14} s={0.7} r={6} />
  </T>
);

/* ---------- 12. Spicy food + chili ---------- */
export const Chili: React.FC<G> = (g) => (
  <T {...g}>
    <path d="M-8 -6 C40 -6 78 38 70 108 C66 134 48 134 44 114 C46 64 18 36 -16 30Z" fill={A.chili} />
    <path d="M10 6 C44 14 62 44 58 80 C50 50 30 30 6 22Z" fill="#F87171" opacity={0.7} />
    <path d="M-8 -6 C-18 -22 -4 -34 8 -26 C0 -20 4 -10 -8 -6Z" fill={A.stem} />
    <path d="M-8 -6 C-16 4 -14 24 -16 30" fill="none" stroke={A.chiliDark} strokeWidth={3} opacity={0.5} />
  </T>
);

export const SpicyFood: React.FC<G> = (g) => {
  const frame = useCurrentFrame();
  return (
    <T {...g}>
      <Plate rx={200} ry={56}>
        <ellipse cx={0} cy={-26} rx={140} ry={52} fill={A.curryDark} />
        <ellipse cx={0} cy={-34} rx={128} ry={44} fill={A.curry} />
        {[[-70, -40], [-10, -56], [60, -38], [20, -22], [-40, -22]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={9} fill={A.glaze} opacity={0.85} />
        ))}
        <Chili x={-60} y={-66} s={0.55} r={-70} />
        <Chili x={30} y={-76} s={0.5} r={-20} />
        <Chili x={90} y={-46} s={0.45} r={50} />
      </Plate>
      <g fill="none" stroke={A.chili} strokeWidth={6} strokeLinecap="round" opacity={0.75}>
        {[-90, 0, 90].map((x, i) => {
          const w = Math.sin(frame / 7 + i * 2) * 8;
          return <path key={i} d={`M${x} -110 q${12 + w} -22 0 -44 q${-12 + w} -22 0 -44`} />;
        })}
      </g>
    </T>
  );
};

/* ---------- 13. Non-spicy food ---------- */
export const NonSpicyFood: React.FC<G> = (g) => (
  <T {...g}>
    <Plate rx={190} ry={54}>
      <ellipse cx={0} cy={-18} rx={120} ry={42} fill={A.plateRim} />
      <ellipse cx={0} cy={-26} rx={106} ry={34} fill={A.cream} />
      {[[-50, -32], [0, -40], [50, -30], [20, -22], [-24, -22]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={8} fill={A.herb} opacity={0.9} />
      ))}
      <ellipse cx={74} cy={-48} rx={14} ry={6} fill={A.herb} transform="rotate(-25 74 -48)" />
    </Plate>
  </T>
);

/** Chili with a "no" sign over it */
export const NoChili: React.FC<G> = (g) => (
  <T {...g}>
    <circle r={64} fill={C.white} stroke={C.danger} strokeWidth={10} />
    <Chili x={-18} y={-34} s={0.62} r={-10} />
    <line x1={-46} y1={-46} x2={46} y2={46} stroke={C.danger} strokeWidth={11} strokeLinecap="round" />
  </T>
);

/* ---------- 14/15. Orange juice + oranges ---------- */
export const Orange: React.FC<G> = (g) => (
  <T {...g}>
    <circle r={50} fill={A.orange} />
    <path d="M-34 -28 A50 50 0 0 1 22 -44 A56 56 0 0 0 -34 -28Z" fill={A.orangeLight} opacity={0.55} />
    <path d="M-6 -50 C-2 -66 16 -70 26 -62 C14 -62 8 -54 -6 -50Z" fill={A.leaf} />
    <circle cx={14} cy={20} r={3} fill={A.orangeDark} opacity={0.5} />
    <circle cx={-18} cy={8} r={3} fill={A.orangeDark} opacity={0.5} />
  </T>
);

export const OrangeHalf: React.FC<G> = (g) => (
  <T {...g}>
    <circle r={50} fill={A.orangeDark} />
    <circle r={43} fill={A.orangeLight} />
    {Array.from({ length: 8 }).map((_, i) => (
      <path key={i} d="M0 0 L0 -38 A38 38 0 0 1 27 -27Z" fill={A.orange} opacity={0.85} transform={`rotate(${i * 45 + 6})`} />
    ))}
  </T>
);

export const Oranges: React.FC<G> = (g) => (
  <T {...g}>
    <Orange x={-46} y={0} />
    <Orange x={42} y={8} s={0.92} />
    <OrangeHalf x={-4} y={-58} s={0.8} />
  </T>
);

export const Glass: React.FC<G & { level?: number; liquid?: string; liquidDark?: string; w?: number; h?: number }> = ({
  level = 0.7, liquid = A.orange, liquidDark = A.orangeDark, w = 120, h = 200, ...g
}) => {
  const top = -h / 2;
  const fillH = h * level;
  return (
    <T {...g}>
      <ellipse cx={0} cy={h / 2 + 6} rx={w * 0.55} ry={12} fill={A.shadow} />
      <path d={`M${-w / 2} ${top} L${-w / 2 + 10} ${h / 2} Q0 ${h / 2 + 14} ${w / 2 - 10} ${h / 2} L${w / 2} ${top}Z`} fill={A.glass} opacity={0.85} />
      <path d={`M${-w / 2 + 10 - (level < 1 ? (1 - level) * -0 : 0)} ${h / 2 - fillH} L${-w / 2 + 10} ${h / 2} Q0 ${h / 2 + 14} ${w / 2 - 10} ${h / 2} L${w / 2 - 10} ${h / 2 - fillH}Z`} fill={liquid} />
      <ellipse cx={0} cy={h / 2 - fillH} rx={w / 2 - 10} ry={7} fill={liquidDark} opacity={0.55} />
      <path d={`M${-w / 2 + 16} ${top + 14} L${-w / 2 + 22} ${h / 2 - 24}`} stroke={C.white} strokeWidth={7} strokeLinecap="round" opacity={0.7} />
      <path d={`M${-w / 2} ${top} L${-w / 2 + 10} ${h / 2} Q0 ${h / 2 + 14} ${w / 2 - 10} ${h / 2} L${w / 2} ${top}`} fill="none" stroke={A.glassEdge} strokeWidth={4} />
    </T>
  );
};

export const OrangeJuice: React.FC<G & { level?: number }> = ({ level = 0.72, ...g }) => (
  <T {...g}>
    <Glass level={level} />
    <line x1={20} y1={-130} x2={44} y2={-6} stroke={C.accent} strokeWidth={9} strokeLinecap="round" />
    <OrangeHalf x={-48} y={-98} s={0.52} />
  </T>
);

/* ---------- 16/17. Drinking water ---------- */
export const WaterBottle: React.FC<G> = (g) => (
  <T {...g}>
    <rect x={-44} y={-70} width={88} height={190} rx={34} fill={A.glass} stroke={A.glassEdge} strokeWidth={4} />
    <rect x={-38} y={-8} width={76} height={122} rx={28} fill={A.water} opacity={0.85} />
    <rect x={-24} y={-100} width={48} height={36} rx={10} fill={A.glass} stroke={A.glassEdge} strokeWidth={4} />
    <rect x={-28} y={-122} width={56} height={26} rx={8} fill={C.primary} />
    <path d="M-22 -50 L-20 90" stroke={C.white} strokeWidth={7} strokeLinecap="round" opacity={0.7} />
  </T>
);

export const WaterGlass: React.FC<G & { level?: number }> = ({ level = 0.7, ...g }) => (
  <Glass level={level} liquid={A.water} liquidDark={A.waterDark} w={116} h={190} {...g} />
);

/* ---------- 7. Menu card, 8. Daily special board ---------- */
export const MenuCard: React.FC<G> = (g) => (
  <T {...g}>
    <rect x={-70} y={-96} width={140} height={192} rx={14} fill={A.shadow} transform="translate(6 8)" />
    <rect x={-70} y={-96} width={140} height={192} rx={14} fill={A.paper} stroke={A.line} strokeWidth={3} />
    <rect x={-70} y={-96} width={140} height={54} rx={14} fill={C.primary} />
    <rect x={-70} y={-62} width={140} height={20} fill={C.primary} />
    <text x={0} y={-60} textAnchor="middle" fontFamily={theme.fonts.en} fontWeight={800} fontSize={28} fill={C.white} letterSpacing={3}>MENU</text>
    {[-18, 12, 42, 72].map((y, i) => (
      <g key={i}>
        <circle cx={-44} cy={y} r={7} fill={i % 2 ? C.accent : A.leaf} />
        <rect x={-28} y={y - 5} width={i % 2 ? 62 : 80} height={10} rx={5} fill={A.line} />
      </g>
    ))}
  </T>
);

export const SpecialBoard: React.FC<G> = (g) => (
  <T {...g}>
    <rect x={-8} y={150} width={16} height={110} fill={A.woodDark} />
    <rect x={-150} y={-170} width={300} height={330} rx={22} fill={A.woodDark} />
    <rect x={-134} y={-154} width={268} height={298} rx={14} fill={A.chalk} />
    <rect x={-100} y={-128} width={200} height={14} rx={7} fill={C.white} opacity={0.9} />
    {[-70, -20, 30, 80].map((y, i) => (
      <g key={i} opacity={0.92}>
        <circle cx={-90} cy={y} r={11} fill={[C.accent, A.herb, A.orange, A.fish][i]} />
        <rect x={-66} y={y - 6} width={[130, 100, 120, 90][i]} height={12} rx={6} fill={C.white} opacity={0.85} />
        <rect x={80} y={y - 5} width={30} height={10} rx={5} fill={C.accent} />
      </g>
    ))}
    <rect x={-40} y={118} width={80} height={10} rx={5} fill={C.white} opacity={0.5} />
  </T>
);

/* ---------- speech / question bubbles ---------- */
export const Bubble: React.FC<G & { w?: number; h?: number; tail?: "left" | "right"; label?: string; fontSize?: number; fill?: string; color?: string }> = ({
  w = 120, h = 96, tail = "left", label = "?", fontSize = 64, fill = C.white, color = C.primary, ...g
}) => (
  <T {...g}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2.4} fill={A.shadow} transform="translate(4 6)" />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2.4} fill={fill} />
    <path d={tail === "left" ? `M${-w / 2 + 22} ${h / 2 - 4} l-4 28 l30 -26Z` : `M${w / 2 - 22} ${h / 2 - 4} l4 28 l-30 -26Z`} fill={fill} />
    <text x={0} y={fontSize * 0.34} textAnchor="middle" fontFamily={theme.fonts.en} fontWeight={800} fontSize={fontSize} fill={color}>{label}</text>
  </T>
);

/* ---------- 3/4. People ---------- */
type Mood = "smile" | "confused" | "neutral";
type Arm = "down" | "menu" | "point" | "tray" | "wave" | "rest";

const armGeom = (arm: Arm): { d: string; hand: [number, number] } => {
  switch (arm) {
    case "menu": return { d: "M62 14 Q118 40 138 78", hand: [138, 78] };
    case "point": return { d: "M62 14 Q124 -2 172 -26", hand: [172, -26] };
    case "tray": return { d: "M62 16 Q112 40 108 -6", hand: [108, -6] };
    case "wave": return { d: "M62 14 Q112 -20 112 -90", hand: [112, -90] };
    case "rest": return { d: "M62 14 Q96 80 70 140", hand: [70, 140] };
    default: return { d: "M62 14 Q78 80 72 150", hand: [72, 150] };
  }
};

export const Person: React.FC<G & {
  role: "waiter" | "customer"; mood?: Mood; arm?: Arm; otherArm?: Arm; full?: boolean; flip?: boolean; held?: React.ReactNode;
}> = ({ role, mood = "smile", arm = "down", otherArm = "down", full = false, flip = false, held, x = 0, y = 0, s = 1 }) => {
  const sleeve = role === "waiter" ? C.white : A.cloth;
  const a = armGeom(arm);
  const b = armGeom(otherArm);
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {full && role === "waiter" && (
        <g>
          <rect x={-46} y={168} width={38} height={170} rx={14} fill={A.black} />
          <rect x={8} y={168} width={38} height={170} rx={14} fill={A.black} />
          <ellipse cx={-30} cy={344} rx={32} ry={12} fill={A.black} />
          <ellipse cx={30} cy={344} rx={32} ry={12} fill={A.black} />
        </g>
      )}
      {/* other arm (behind body) */}
      <g transform="scale(-1 1)">
        <path d={b.d} fill="none" stroke={A.skinDark} strokeWidth={34} strokeLinecap="round" />
        <path d={b.d} fill="none" stroke={sleeve} strokeWidth={36} strokeLinecap="round" strokeDasharray="70 400" />
        <circle cx={b.hand[0]} cy={b.hand[1]} r={19} fill={A.skin} />
      </g>
      {/* torso */}
      {role === "waiter" ? (
        <g>
          <rect x={-66} y={-8} width={132} height={186} rx={34} fill={C.white} stroke={A.line} strokeWidth={3} />
          <path d="M-66 20 L-14 -8 L0 60 L14 -8 L66 20 L66 150 Q0 190 -66 150Z" fill={C.primary} />
          <path d="M-14 -8 L0 60 L14 -8Z" fill={C.white} />
          <path d="M-18 -4 L18 -4 L0 14Z" fill={C.accent} />
          <circle cx={0} cy={86} r={5} fill={C.white} />
          <circle cx={0} cy={120} r={5} fill={C.white} />
        </g>
      ) : (
        <g>
          <path d={`M-62 -6 Q-70 -6 -72 24 L${full ? -90 : -80} ${full ? 332 : 200} L${full ? 90 : 80} ${full ? 332 : 200} L72 24 Q70 -6 62 -6Z`} fill={A.cloth} stroke={A.line} strokeWidth={3} />
          <path d="M-20 -6 L0 36 L20 -6" fill="none" stroke={A.clothShade} strokeWidth={4} />
          {[56, 96, 136].map((yy) => <circle key={yy} cx={0} cy={yy} r={4} fill={A.clothShade} />)}
          {full && <><ellipse cx={-34} cy={338} rx={34} ry={11} fill={A.black} /><ellipse cx={34} cy={338} rx={34} ry={11} fill={A.black} /></>}
        </g>
      )}
      {/* neck + head */}
      <rect x={-16} y={-34} width={32} height={34} fill={A.skinDark} />
      {role === "customer" && (
        <path d="M-64 -96 Q-66 -166 0 -168 Q66 -166 64 -96 L76 -22 Q0 12 -76 -22Z" fill={A.cloth} stroke={A.line} strokeWidth={3} />
      )}
      <ellipse cx={0} cy={-92} rx={50} ry={54} fill={A.skin} />
      {role === "waiter" ? (
        <path d="M-52 -98 Q-54 -154 0 -152 Q54 -154 52 -98 Q40 -124 0 -122 Q-40 -124 -52 -98Z" fill={A.hair} />
      ) : (
        <g>
          <path d="M-54 -100 Q-54 -162 0 -162 Q54 -162 54 -100 Q0 -126 -54 -100Z" fill={A.cloth} stroke={A.line} strokeWidth={3} />
          <path d="M-56 -118 Q0 -98 56 -118" fill="none" stroke={A.black} strokeWidth={10} strokeLinecap="round" />
        </g>
      )}
      {/* face */}
      <circle cx={-18} cy={-92} r={5.5} fill={A.black} />
      <circle cx={18} cy={-92} r={5.5} fill={A.black} />
      {mood === "confused" && (
        <g stroke={A.black} strokeWidth={4} strokeLinecap="round">
          <line x1={-30} y1={-108} x2={-8} y2={-104} />
          <line x1={8} y1={-110} x2={30} y2={-102} />
        </g>
      )}
      {mood === "smile" && <path d="M-17 -70 Q0 -54 17 -70" fill="none" stroke={A.black} strokeWidth={4.5} strokeLinecap="round" />}
      {mood === "neutral" && <line x1={-12} y1={-66} x2={12} y2={-66} stroke={A.black} strokeWidth={4.5} strokeLinecap="round" />}
      {mood === "confused" && <path d="M-16 -64 q8 -9 16 0 t16 0" fill="none" stroke={A.black} strokeWidth={4.5} strokeLinecap="round" />}
      <ellipse cx={-34} cy={-76} rx={8} ry={5} fill="#F29A8A" opacity={0.5} />
      <ellipse cx={34} cy={-76} rx={8} ry={5} fill="#F29A8A" opacity={0.5} />
      {role === "customer" && <path d="M-22 -58 Q0 -42 22 -58 Q0 -50 -22 -58Z" fill={A.hair} opacity={0.8} />}
      {/* active arm */}
      <path d={a.d} fill="none" stroke={A.skinDark} strokeWidth={34} strokeLinecap="round" />
      <path d={a.d} fill="none" stroke={sleeve} strokeWidth={36} strokeLinecap="round" strokeDasharray="70 400" />
      <circle cx={a.hand[0]} cy={a.hand[1]} r={19} fill={A.skin} />
      {arm === "point" && <rect x={a.hand[0] + 4} y={a.hand[1] - 24} width={46} height={13} rx={6.5} fill={A.skin} transform={`rotate(-24 ${a.hand[0]} ${a.hand[1]})`} />}
      {held && <g transform={`translate(${a.hand[0]} ${a.hand[1]})`}>{held}</g>}
    </g>
  );
};

/* ---------- 1. Restaurant interior (backdrop) ---------- */
export const Interior: React.FC<{ w?: number; h?: number; floorY?: number; sway?: number }> = ({ w = 920, h = 800, floorY = 520, sway = 0 }) => (
  <g>
    <rect width={w} height={h} fill={A.wall} />
    <rect y={floorY} width={w} height={h - floorY} fill={A.floor} />
    {Array.from({ length: 8 }).map((_, i) => (
      <line key={i} x1={i * (w / 6) - 60} y1={h} x2={i * (w / 8) + 20} y2={floorY} stroke={A.floorDark} strokeWidth={3} opacity={0.6} />
    ))}
    <rect y={floorY - 8} width={w} height={14} fill={A.wallDark} />
    {[0.2, 0.8].map((fx, i) => (
      <g key={i} transform={`translate(${w * fx + sway * (i ? -1 : 1)} 0)`}>
        <path d={`M-62 ${floorY - 150} L-62 120 A62 62 0 0 1 62 120 L62 ${floorY - 150}Z`} fill={A.sky} stroke={A.woodDark} strokeWidth={10} />
        <line x1={0} y1={60} x2={0} y2={floorY - 150} stroke={A.woodDark} strokeWidth={6} />
        <line x1={-62} y1={230} x2={62} y2={230} stroke={A.woodDark} strokeWidth={6} />
      </g>
    ))}
    {[0.5].map((fx) => (
      <g key={fx} transform={`translate(${w * fx} 0)`}>
        <line x1={0} y1={0} x2={0} y2={80} stroke={A.woodDark} strokeWidth={4} />
        <path d="M-50 140 Q0 60 50 140Z" fill={C.accent} />
        <ellipse cx={0} cy={142} rx={50} ry={9} fill="#FFE29A" />
        <ellipse cx={0} cy={168} rx={90} ry={34} fill="#FFE29A" opacity={0.28} />
      </g>
    ))}
    <g transform={`translate(${w - 70} ${floorY - 10})`}>
      <rect x={-30} y={-40} width={60} height={50} rx={10} fill={A.woodDark} />
      {[-30, -8, 16].map((r, i) => <ellipse key={i} cx={r} cy={-72 - (i % 2) * 20} rx={18} ry={36} fill={A.herb} transform={`rotate(${r} ${r} -44)`} />)}
    </g>
  </g>
);
