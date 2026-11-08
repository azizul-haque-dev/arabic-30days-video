import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { ramp, useSpring } from "../utils/anim";
import type { IllustrationKey } from "../types";
import {
  BiryaniPlate, Bubble, Chili, Fish, GrilledChicken, Glass, Interior, KabsaPlatter, MeatKabsa, MenuCard, NonSpicyFood, NoChili,
  OrangeJuice, Oranges, Person, Plate, SeafoodDisplay, SpecialBoard, SpicyFood, Steam, Table, WaterBottle, WaterGlass,
} from "./parts";

const A = theme.art;
const C = theme.colors;
const SVG: React.FC<{ w: number; h: number; children: React.ReactNode }> = ({ w, h, children }) => (
  <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
    {children}
  </svg>
);

const useBob = (speed = 26, amp = 3, phase = 0) => Math.sin(useCurrentFrame() / speed + phase) * amp;

const FoodBackdrop: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <g>
    <rect width={920} height={600} fill={A.wall} />
    <circle cx={460} cy={250} r={300} fill="#FFFBF0" />
    <ellipse cx={460} cy={630} rx={560} ry={160} fill={A.woodDark} />
    <ellipse cx={460} cy={610} rx={560} ry={160} fill={A.wood} />
    <ellipse cx={460} cy={600} rx={470} ry={110} fill="none" stroke={A.woodDark} strokeOpacity={0.25} strokeWidth={3} />
    {children}
  </g>
);

/* ===================== Sentence illustrations (920 x 600) ===================== */
const MenuArt: React.FC = () => {
  const b = useBob(24, 3);
  const b2 = useBob(30, 3, 1.5);
  return (
    <SVG w={920} h={600}>
      <Interior w={920} h={600} floorY={380} />
      <Person role="customer" mood="smile" arm="rest" x={300} y={250 + b2} s={1.02} />
      <Table x={330} y={470} w={640} />
      <Plate x={250} y={452} rx={80} ry={22} />
      <Glass x={470} y={430} s={0.5} level={0.7} liquid={A.water} liquidDark={A.waterDark} />
      <Person role="waiter" mood="smile" arm="menu" flip full x={790} y={205 + b} s={0.95}
        held={<g transform="rotate(-10)"><MenuCard s={0.72} /></g>} />
    </SVG>
  );
};

const BoardArt: React.FC = () => {
  const b = useBob(26, 3);
  const q = useSpring(14, "bouncy");
  return (
    <SVG w={920} h={600}>
      <Interior w={920} h={600} floorY={400} />
      <SpecialBoard x={270} y={255} s={1.0} />
      <Person role="waiter" mood="smile" arm="point" flip full x={690} y={215 + b} s={0.95} />
      <Bubble x={640} y={80} s={q} label="?" />
    </SVG>
  );
};

const GrilledArt: React.FC = () => {
  const p = useSpring(2, "bouncy");
  const ring = 1 + Math.sin(useCurrentFrame() / 14) * 0.03;
  return (
    <SVG w={920} h={600}>
      <FoodBackdrop>
        <ellipse cx={460} cy={456} rx={330} ry={72} fill={A.woodDark} />
        <ellipse cx={460} cy={446} rx={330} ry={72} fill={A.wood} stroke={A.woodDark} strokeWidth={6} />
        <g transform={`translate(460 ${300 + (1 - p) * -120}) scale(${p})`}>
          <Plate x={0} y={146} rx={250} ry={64} />
          <GrilledChicken x={0} y={96} s={1.5} />
          <ellipse cx={8} cy={102} rx={225 * ring} ry={112 * ring} fill="none" stroke={C.accent} strokeWidth={6} strokeDasharray="14 16" opacity={0.85} />
        </g>
        <Steam x={430} y={190} count={3} height={100} />
      </FoodBackdrop>
    </SVG>
  );
};

const BiryaniArt: React.FC = () => {
  const p = useSpring(2, "bouncy");
  const f = useCurrentFrame();
  return (
    <SVG w={920} h={600}>
      <FoodBackdrop>
        <g transform={`translate(460 ${360 + (1 - p) * -140}) scale(${1.3 * p})`}>
          <BiryaniPlate />
        </g>
        <Steam x={460} y={225} count={3} height={100} />
        {[[170, 170], [770, 200], [700, 90]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${0.6 + Math.sin(f / 10 + i) * 0.12})`}>
            <path d="M0 -20 L5 -5 L20 0 L5 5 L0 20 L-5 5 L-20 0 L-5 -5Z" fill={C.accent} />
          </g>
        ))}
      </FoodBackdrop>
    </SVG>
  );
};

const MeatKabsaArt: React.FC = () => {
  const p = useSpring(2, "bouncy");
  return (
    <SVG w={920} h={600}>
      <FoodBackdrop>
        <g transform={`translate(460 ${375 + (1 - p) * -140}) scale(${1.2 * p})`}>
          <MeatKabsa />
        </g>
        <Steam x={460} y={190} count={3} height={110} />
      </FoodBackdrop>
    </SVG>
  );
};

const FishArt: React.FC = () => {
  const p = useSpring(2, "smooth");
  const q = useSpring(14, "bouncy");
  const f = useCurrentFrame();
  return (
    <SVG w={920} h={600}>
      <FoodBackdrop>
        <g transform={`translate(460 ${340 + (1 - p) * 60}) scale(${1.45 * p})`}>
          <SeafoodDisplay />
        </g>
        {[0, 1, 2].map((i) => {
          const ph = (f / 70 + i / 3) % 1;
          return <circle key={i} cx={330 + i * 130} cy={270 - ph * 120} r={10 + i * 3} fill="none" stroke={A.fishDark} strokeWidth={4} opacity={Math.sin(ph * Math.PI)} />;
        })}
        <Bubble x={770} y={110} s={q} label="?" />
      </FoodBackdrop>
    </SVG>
  );
};

const SpicyArt: React.FC = () => {
  const p = useSpring(2, "bouncy");
  const q = useSpring(16, "bouncy");
  const b = useBob(26, 3);
  return (
    <SVG w={920} h={600}>
      <FoodBackdrop>
        <Person role="customer" mood="confused" arm="rest" x={170} y={240 + b} s={0.95} />
        <ellipse cx={170} cy={560} rx={190} ry={60} fill={A.wood} />
        <g transform={`translate(590 ${400 + (1 - p) * -120}) scale(${1.25 * p})`}>
          <SpicyFood />
        </g>
        <Bubble x={380} y={130} s={q} label="?" tail="left" />
      </FoodBackdrop>
    </SVG>
  );
};

const NoSpiceArt: React.FC = () => {
  const p = useSpring(2, "bouncy");
  const q = useSpring(12, "bouncy");
  const b = useBob(26, 3);
  return (
    <SVG w={920} h={600}>
      <FoodBackdrop>
        <Person role="waiter" mood="smile" arm="menu" x={180} y={235 + b} s={0.95}
          held={<g transform="rotate(8)"><rect x={-4} y={-44} width={96} height={124} rx={10} fill={A.paper} stroke={A.line} strokeWidth={3} /><NoChili x={44} y={18} s={0.5} /></g>} />
        <g transform={`translate(650 ${420 + (1 - p) * -120}) scale(${1.15 * p})`}>
          <NonSpicyFood />
        </g>
        <NoChili x={650} y={150} s={q} />
      </FoodBackdrop>
    </SVG>
  );
};

const OrangeJuiceArt: React.FC = () => {
  const f = useCurrentFrame();
  const level = interpolate(f, [6, 70], [0.12, 0.78], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pour = ramp(f, 4, 14);
  const gx = 520, gy = 400, h = 200, w = 120;
  const surface = gy + h / 2 - h * level;
  const tilt = -40 * pour;
  return (
    <SVG w={920} h={600}>
      <FoodBackdrop>
        <Oranges x={250} y={455} s={1.25} />
        <Glass x={gx} y={gy} level={level} w={w} h={h} />
        <line x1={gx + 4} y1={178} x2={gx + 4} y2={surface} stroke={A.orange} strokeWidth={13 * pour} strokeLinecap="round" opacity={pour} />
        <g transform={`translate(${gx + 74} 190) rotate(${tilt})`}>
          <path d="M-45 -62 L-62 -78 L-30 -70Z" fill={A.orangeLight} />
          <rect x={-45} y={-70} width={90} height={118} rx={18} fill={A.glass} stroke={A.glassEdge} strokeWidth={4} />
          <rect x={-39} y={-24} width={78} height={66} rx={12} fill={A.orange} />
          <path d="M45 -48 q40 6 40 44 q0 38 -40 40" fill="none" stroke={A.glassEdge} strokeWidth={9} strokeLinecap="round" />
        </g>
        <OrangeJuice x={760} y={430} s={0.72} level={0.74} />
      </FoodBackdrop>
    </SVG>
  );
};

const WaterArt: React.FC = () => {
  const f = useCurrentFrame();
  const level = interpolate(f, [6, 66], [0.1, 0.8], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pour = ramp(f, 4, 14);
  const gx = 470, gy = 410, h = 190;
  const surface = gy + h / 2 - h * level;
  return (
    <SVG w={920} h={600}>
      <FoodBackdrop>
        <WaterGlass x={gx} y={gy} level={level} />
        <line x1={gx + 2} y1={170} x2={gx + 2} y2={surface} stroke={A.water} strokeWidth={12 * pour} strokeLinecap="round" opacity={pour} />
        <g transform={`translate(${gx + 78} 130) rotate(${-135 * pour})`}>
          <WaterBottle />
        </g>
        {[0, 1, 2, 3].map((i) => {
          const ph = (f / 28 + i / 4) % 1;
          return <circle key={i} cx={gx - 40 + i * 28} cy={surface - ph * 26} r={5} fill={A.waterDark} opacity={pour * Math.sin(ph * Math.PI)} />;
        })}
        <WaterBottle x={760} y={420} s={0.8} />
      </FoodBackdrop>
    </SVG>
  );
};

const registry: Record<IllustrationKey, React.FC> = {
  menu: MenuArt, board: BoardArt, grilledChicken: GrilledArt, biryani: BiryaniArt, meatKabsa: MeatKabsaArt,
  fish: FishArt, spicy: SpicyArt, noSpice: NoSpiceArt, orangeJuice: OrangeJuiceArt, water: WaterArt,
};

export const SentenceIllustration: React.FC<{ kind: IllustrationKey }> = ({ kind }) => {
  const Art = registry[kind];
  return <Art />;
};

/* ===================== Intro illustrations (920 x 800) ===================== */
export const EntranceArt: React.FC<{ splitT: number; t: number }> = ({ splitT, t }) => {
  const f = useCurrentFrame();
  const s = ramp(t, splitT - 0.07, splitT + 0.02, theme.ease.inOut);
  const walk = ramp(t, 0, splitT, theme.ease.inOut);
  const cx = 150 + walk * 380;
  const bob = Math.abs(Math.sin(f / 4)) * 6;
  return (
    <SVG w={920} h={800}>
      <g transform={`translate(${-920 * s} 0)`}>
        <rect width={920} height={800} fill={A.sky} />
        <rect y={640} width={920} height={160} fill={A.floorDark} />
        <rect x={430} y={150} width={460} height={500} fill={A.wall} stroke={A.woodDark} strokeWidth={8} />
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={i} d={`M${430 + i * 57.5} 150 L${430 + (i + 1) * 57.5} 150 L${430 + (i + 1) * 57.5 + 8} 230 L${430 + i * 57.5 + 8} 230Z`} fill={i % 2 ? C.white : C.primary} />
        ))}
        <path d="M530 640 L530 360 A100 100 0 0 1 730 360 L730 640Z" fill={A.woodDark} />
        <path d="M550 640 L550 366 A80 80 0 0 1 710 366 L710 640Z" fill={A.wood} />
        <circle cx={680} cy={520} r={9} fill={C.accent} />
        <circle cx={660} cy={100} r={52} fill={C.accent} />
        <path d="M640 78 l0 44 M652 78 l0 44 M646 78 l0 18 M690 78 q-14 22 0 44 M690 78 l0 44" stroke={C.white} strokeWidth={6} strokeLinecap="round" fill="none" transform="translate(-12 -2)" />
        {[470, 850].map((x) => (
          <g key={x}><line x1={x} y1={250} x2={x} y2={290} stroke={A.woodDark} strokeWidth={5} /><circle cx={x} cy={306} r={16} fill="#FFE29A" /></g>
        ))}
        <Person role="customer" mood="smile" arm="down" full x={cx} y={358 - bob} s={0.82} />
      </g>
      <g transform={`translate(${920 * (1 - s)} 0)`}>
        <Interior w={920} h={800} floorY={430} />
        <Table x={460} y={560} w={820} />
        <KabsaPlatter x={310} y={520} s={0.95} />
        <Plate x={640} y={534} rx={150} ry={42}>
          <GrilledChicken x={0} y={-14} s={0.85} />
        </Plate>
        <Steam x={300} y={380} count={3} height={110} />
        <Steam x={640} y={430} count={3} height={90} />
      </g>
    </SVG>
  );
};

export const WaiterArt: React.FC = () => {
  const f = useCurrentFrame();
  const walk = ramp(f, 4, 34, theme.ease.out);
  const wx = 960 - walk * 250;
  const bob = walk < 1 ? Math.abs(Math.sin(f / 3)) * 6 : Math.sin(f / 26) * 3;
  const q = useSpring(26, "bouncy");
  return (
    <SVG w={920} h={800}>
      <Interior w={920} h={800} floorY={470} />
      <Person role="customer" mood="confused" arm="rest" x={290} y={345} s={1.1} />
      <Table x={320} y={610} w={600} />
      <Plate x={250} y={596} rx={70} ry={18} />
      <Bubble x={500} y={190} s={q} w={170} h={100} label="..." fontSize={72} color={C.textDim} />
      <Person role="waiter" mood="smile" arm="menu" flip full x={wx} y={370 - bob} s={0.98}
        held={<g transform="rotate(-10)"><MenuCard s={0.6} /></g>} />
    </SVG>
  );
};

const Wave: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`} fill="none" stroke={C.primary} strokeWidth={7} strokeLinecap="round">
    <path d="M-26 -22 q14 22 0 44" /><path d="M0 -34 q22 34 0 68" />
  </g>
);

export const PointingArt: React.FC = () => {
  const f = useCurrentFrame();
  const l = useSpring(2, "smooth");
  const r = useSpring(14, "smooth");
  const tap = Math.sin(f / 6) * 5;
  const bubble = useSpring(22, "bouncy");
  return (
    <SVG w={920} h={800}>
      <g transform={`translate(0 ${(1 - l) * 60})`} opacity={l}>
        <rect x={10} y={40} width={440} height={720} rx={36} fill={C.white} stroke={C.danger} strokeWidth={6} />
        <Person role="customer" mood="confused" arm="point" x={190} y={400} s={0.88} />
        <MenuCard x={375 + tap} y={250} s={0.78} r={6} />
        <circle cx={70} cy={100} r={38} fill={C.danger} />
        <path d="M54 84 L86 116 M86 84 L54 116" stroke={C.white} strokeWidth={9} strokeLinecap="round" />
        <Plate x={230} y={710} rx={110} ry={28} />
      </g>
      <g transform={`translate(0 ${(1 - r) * 60})`} opacity={r}>
        <rect x={470} y={40} width={440} height={720} rx={36} fill={C.white} stroke={C.primary} strokeWidth={6} />
        <Person role="customer" mood="smile" arm="rest" x={640} y={400} s={0.88} />
        <Bubble x={770} y={160} s={bubble} w={170} h={110} label="" tail="left" />
        <Wave x={770} y={160} />
        <circle cx={850} cy={100} r={38} fill={C.primary} />
        <path d="M832 100 L846 114 L870 88" fill="none" stroke={C.white} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        <Plate x={690} y={710} rx={110} ry={28}>
          <GrilledChicken x={0} y={-10} s={0.55} />
        </Plate>
      </g>
    </SVG>
  );
};

/* ===================== Thumbnail art (1000 x 620) ===================== */
export const ThumbnailArt: React.FC = () => {
  const b = useBob(26, 3);
  const f = useCurrentFrame();
  return (
    <SVG w={1000} h={620}>
      <Interior w={1000} h={620} floorY={340} />
      <Person role="waiter" mood="smile" arm="menu" flip full x={880} y={170 + b} s={0.9}
        held={<g transform="rotate(-10)"><MenuCard s={0.6} /></g>} />
      <Table x={470} y={480} w={860} />
      <KabsaPlatter x={330} y={440} s={0.9} />
      <Plate x={650} y={452} rx={150} ry={42}>
        <GrilledChicken x={0} y={-14} s={0.85} />
      </Plate>
      <Steam x={320} y={300} count={3} height={110} />
      <Steam x={650} y={350} count={3} height={90} />
      {[[90, 120], [940, 60], [60, 330]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${0.7 + Math.sin(f / 12 + i * 2) * 0.12})`}>
          <path d="M0 -22 L6 -6 L22 0 L6 6 L0 22 L-6 6 L-22 0 L-6 -6Z" fill={C.accent} />
        </g>
      ))}
    </SVG>
  );
};

/* ===================== Small food icons (for summary / compare) ===================== */
export type IconKind = "grilledChicken" | "biryani" | "meatKabsa" | "fish" | "orangeJuice" | "water";
export const FoodIcon: React.FC<{ kind: IconKind; size: number }> = ({ kind, size }) => (
  <svg viewBox="0 0 300 300" width={size} height={size} style={{ display: "block" }}>
    <g transform="translate(150 175)">
      {kind === "grilledChicken" && <><Plate rx={130} ry={34} y={30} /><GrilledChicken y={0} s={0.95} /></>}
      {kind === "biryani" && <BiryaniPlate s={0.7} y={20} />}
      {kind === "meatKabsa" && <MeatKabsa s={0.6} y={20} />}
      {kind === "fish" && <Fish s={0.95} />}
      {kind === "orangeJuice" && <OrangeJuice s={0.95} />}
      {kind === "water" && <WaterGlass s={0.95} level={0.75} />}
    </g>
  </svg>
);

export { Chili };
