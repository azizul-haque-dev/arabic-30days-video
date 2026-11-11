import React from "react";
import { theme } from "../config/theme";
import { easeInOut, easeOut, idleWave, lerp } from "../animation/motion";
import {
  AirportSign, AirportTerminal, Basket, CabInterior, Counter, Crate, Cucumber, DigitalScale, Lettuce, MeatCase, MeatCut,
  Person, PlaneIcon, Pin, PriceTag, QuestionBubble, RiceBag, RoadBackdrop, Shelf, Taxi, Tomato, WeighScale,
} from "./parts";

const C = theme.colors;
const I = theme.ill;

export type IllustrationProps = { t: number; qty?: string };
export type IllustrationKey =
  | "crowdedMarket" | "nearestShop" | "buyRice" | "buyMeat" | "freshCheck"
  | "hailTaxi" | "toAirport" | "askFare" | "meterOn" | "stopHere";

export const VIEW_W = 940;
export const VIEW_H = 620;

const MarketWall: React.FC = () => (
  <g>
    <rect x={0} y={0} width={940} height={620} rx={28} fill={C.white} />
    <rect x={0} y={0} width={940} height={620} rx={28} fill={C.bgAlt} opacity={0.55} />
    <rect x={0} y={480} width={940} height={140} fill={I.sand} opacity={0.9} />
    <path d="M0 592 a28 28 0 0 0 28 28 H912 a28 28 0 0 0 28 -28 V590 H0 Z" fill={I.sand} />
    {[130, 470, 810].map((x) => (
      <g key={x}>
        <rect x={x - 3} y={0} width={6} height={36} fill={I.metalDark} />
        <ellipse cx={x} cy={44} rx={44} ry={12} fill={C.accent} opacity={0.9} />
      </g>
    ))}
  </g>
);

/* 121 — crowded market ------------------------------------------------- */
const CrowdedMarket: React.FC<IllustrationProps> = ({ t }) => (
  <g>
    <MarketWall />
    <Shelf x={40} y={90} w={400} h={250} rows={3} seed={1} />
    <Shelf x={500} y={90} w={400} h={250} rows={3} seed={4} />
    <PriceTag x={150} y={78} s={0.9} rot={-6} />
    <PriceTag x={690} y={78} s={0.9} rot={5} />
    {[
      { x: 110, y: 560, s: 0.95, shirt: I.shirt[0], skin: I.skin[0], hair: I.hair[0], ph: 0, arm: "hold" as const },
      { x: 290, y: 575, s: 1.05, shirt: I.shirt[1], skin: I.skin[1], hair: I.hair[2], ph: 0.8, arm: "down" as const },
      { x: 470, y: 560, s: 0.95, shirt: I.shirt[2], skin: I.skin[2], hair: I.hair[1], ph: 1.6, arm: "hold" as const },
      { x: 650, y: 578, s: 1.05, shirt: I.shirt[3], skin: I.skin[0], hair: I.hair[0], ph: 2.2, arm: "down" as const, flip: true },
      { x: 830, y: 562, s: 0.95, shirt: I.shirt[4], skin: I.skin[1], hair: I.hair[2], ph: 3.1, arm: "hold" as const, flip: true },
    ].map((p, i) => (
      <Person key={i} x={p.x + idleWave(t, 4, p.ph) * 14} y={p.y} s={p.s} shirt={p.shirt} skin={p.skin} hair={p.hair} arm={p.arm} flip={p.flip} bob={Math.abs(idleWave(t, 1.1, p.ph)) * -6} />
    ))}
    <Basket x={178} y={560} s={0.55} />
    <Basket x={560} y={560} s={0.55} />
  </g>
);

/* 122 — nearest grocery ------------------------------------------------ */
const NearestShop: React.FC<IllustrationProps> = ({ t }) => {
  const march = (t * 40) % 24;
  const pulse = 1 + 0.12 * Math.sin(t * 4);
  return (
    <g>
      <rect x={0} y={0} width={940} height={620} rx={28} fill={C.bgAlt} />
      {[110, 300, 470, 600].map((y) => <rect key={y} x={0} y={y} width={940} height={34} fill={C.white} />)}
      {[150, 400, 650, 860].map((x) => <rect key={x} x={x} y={0} width={34} height={620} fill={C.white} />)}
      {[[30, 150], [200, 330], [450, 150], [700, 330], [30, 520], [450, 520]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={100} height={80} rx={14} fill={C.line} />
      ))}
      <rect x={705} y={140} width={130} height={90} rx={14} fill={I.leaf} opacity={0.35} />
      <path d="M 130 500 V 316 H 417 V 127 H 750" stroke={C.primary} strokeWidth={14} strokeDasharray="22 12" strokeDashoffset={-march} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M742 104 L790 127 L742 150 Z" fill={C.primary} />
      {/* shop */}
      <g transform="translate(830 150)">
        <rect x={-70} y={-70} width={140} height={110} rx={12} fill={C.white} stroke={I.woodDark} strokeWidth={5} />
        {[-70, -35, 0, 35].map((x, i) => <rect key={x} x={x} y={-88} width={35} height={30} fill={i % 2 ? C.white : C.accent} />)}
        <rect x={-48} y={-36} width={40} height={60} rx={6} fill={I.glass} />
        <rect x={6} y={-36} width={40} height={76} rx={6} fill={I.wood} />
      </g>
      <g transform={`translate(830 90) scale(${pulse})`}><Pin x={0} y={0} s={0.7} color={C.danger} /></g>
      {/* you */}
      <circle cx={130} cy={500} r={26 + (t * 30) % 22} fill={C.primary} opacity={0.18} />
      <circle cx={130} cy={500} r={20} fill={C.primary} stroke={C.white} strokeWidth={6} />
      <Person x={250} y={610} s={0.82} shirt={I.shirt[0]} arm="point" />
      <QuestionBubble x={330} y={420} s={0.7} />
    </g>
  );
};

/* 123 — rice ------------------------------------------------------------ */
const BuyRice: React.FC<IllustrationProps> = ({ t, qty = "1 KG" }) => {
  const pour = easeInOut((t - 1) / 2.4);
  return (
    <g>
      <MarketWall />
      <Shelf x={690} y={70} w={210} h={230} rows={2} seed={2} />
      {[750, 840].map((x) => <RiceBag key={x} x={x} y={190} s={0.36} />)}
      <Counter x={200} y={440} w={560} h={150} />
      <RiceBag x={290} y={440} s={0.92} />
      <WeighScale x={560} y={440} s={0.98} needle={pour * 0.45} rice={pour} />
      {[0, 1, 2, 3, 4].map((i) => {
        const p = ((t * 1.4 + i * 0.2) % 1);
        return pour > 0.02 && pour < 0.98 ? <circle key={i} cx={470 + p * 90 + i * 4} cy={300 + p * 120} r={5} fill={I.rice} stroke={I.woodDark} strokeWidth={1.5} /> : null;
      })}
      <g transform={`translate(560 ${222 + Math.sin(t * 2.4) * 4})`}>
        <rect x={-62} y={-26} width={124} height={50} rx={25} fill={C.primary} />
        <text x={0} y={9} textAnchor="middle" fontFamily={theme.fonts.en} fontWeight={800} fontSize={30} fill={C.white}>{qty}</text>
      </g>
      <Person x={780} y={590} s={0.98} shirt={I.shirt[3]} skin={I.skin[1]} apron flip arm="hold" />
      <Person x={100} y={600} s={1} shirt={I.shirt[0]} arm="up" />
    </g>
  );
};

/* 124 — meat ------------------------------------------------------------ */
const BuyMeat: React.FC<IllustrationProps> = ({ t, qty = "½ KG" }) => {
  const move = easeInOut((t - 1.6) / 2);
  const pkgX = lerp(560, 250, move);
  return (
    <g>
      <MarketWall />
      <Person x={470} y={430} s={0.9} shirt={I.shirt[4]} skin={I.skin[2]} apron arm="hold" />
      <MeatCase x={180} y={310} w={450} h={170} />
      <Counter x={160} y={480} w={640} h={110} />
      <DigitalScale x={720} y={474} s={0.92} qty={qty} />
      <g transform={`translate(${pkgX} ${430 - Math.sin(move * Math.PI) * 40})`}>
        <rect x={-42} y={-30} width={84} height={56} rx={10} fill={C.white} stroke={C.line} strokeWidth={3} />
        <MeatCut x={0} y={-2} s={0.45} />
        <rect x={-42} y={-6} width={84} height={8} fill={C.primary} opacity={0.0} />
      </g>
      <Person x={90} y={600} s={1} shirt={I.shirt[2]} skin={I.skin[0]} arm="point" />
    </g>
  );
};

/* 125 — fresh ----------------------------------------------------------- */
const FreshCheck: React.FC<IllustrationProps> = ({ t }) => {
  const badge = 1 + 0.1 * Math.sin(t * 4);
  return (
    <g>
      <MarketWall />
      <Person x={640} y={440} s={0.82} shirt={I.shirt[3]} skin={I.skin[1]} apron arm="up" />
      <Crate x={230} y={400} w={190} />
      <Crate x={440} y={400} w={190} />
      <Crate x={650} y={400} w={190} />
      {[0, 1, 2].map((i) => <Tomato key={i} x={270 + i * 50} y={390} s={0.95} />)}
      {[0, 1, 2].map((i) => <Cucumber key={i} x={510 + (i % 2) * 40} y={376 + i * 8} rot={i * 10 - 10} />)}
      {[0, 1].map((i) => <Lettuce key={i} x={700 + i * 80} y={380} s={0.95} />)}
      <Counter x={200} y={462} w={660} h={110} />
      <Person x={110} y={600} s={1.02} shirt={I.shirt[0]} arm="hold" />
      {/* magnifier */}
      <g transform={`translate(${210 + Math.sin(t * 2.2) * 6} 360)`}>
        <circle r={36} fill={C.white} opacity={0.6} stroke={I.metalDark} strokeWidth={8} />
        <line x1={26} y1={26} x2={58} y2={58} stroke={I.metalDark} strokeWidth={10} strokeLinecap="round" />
        <Tomato x={0} y={0} s={0.8} />
      </g>
      {/* freshness badge */}
      <g transform={`translate(840 130) scale(${badge})`}>
        <circle r={62} fill={C.primary} stroke={C.white} strokeWidth={8} />
        <path d="M-28 4 L-8 24 L30 -20" stroke={C.white} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <QuestionBubble x={120} y={250} s={0.62} />
    </g>
  );
};

/* 126 — hail a taxi ------------------------------------------------------ */
const HailTaxi: React.FC<IllustrationProps> = ({ t }) => {
  const k = easeOut(t / 3.2);
  const x = lerp(1120, 600, k);
  return (
    <g>
      <RoadBackdrop />
      <Person x={170} y={410} s={1.05} shirt={I.shirt[1]} skin={I.skin[0]} arm="up" bob={Math.sin(t * 3) * -3} />
      <Taxi x={x} y={560} s={0.95} wheelRot={t * 280 * (1 - k)} />
    </g>
  );
};

/* 127 — to the airport ---------------------------------------------------- */
const ToAirport: React.FC<IllustrationProps> = ({ t }) => {
  const march = (t * 40) % 28;
  return (
    <g>
      <rect x={0} y={0} width={940} height={620} rx={28} fill={I.sky} />
      <g transform={`translate(${((t * 40) % 1100) - 80} 90)`}><PlaneIcon x={0} y={0} s={0.8} rot={90} color={C.white} /></g>
      <rect x={0} y={420} width={940} height={200} fill={I.road} />
      <path d="M0 592 a28 28 0 0 0 28 28 H912 a28 28 0 0 0 28 -28 V590 H0 Z" fill={I.road} />
      <rect x={0} y={400} width={940} height={26} fill={I.curb} />
      <AirportTerminal x={690} y={410} s={0.8} />
      <AirportSign x={500} y={420} s={0.85} />
      <path d="M 300 520 Q 470 470 620 505" stroke={C.accent} strokeWidth={12} strokeDasharray="20 14" strokeDashoffset={-march} fill="none" strokeLinecap="round" />
      <g transform={`translate(760 ${516 - Math.abs(Math.sin(t * 3)) * 10})`}><Pin x={0} y={0} s={0.6} color={C.danger} /></g>
      <Taxi x={190} y={560} s={0.85} riders wheelRot={t * 220} />
    </g>
  );
};

/* 128 — ask the fare ------------------------------------------------------ */
const AskFare: React.FC<IllustrationProps> = ({ t }) => <CabInterior t={t} meterOn={false} bubble />;

/* 129 — turn on the meter -------------------------------------------------- */
const MeterOn: React.FC<IllustrationProps> = ({ t }) => {
  const press = easeInOut(Math.min(t / 1.2, 1)) * (1 - 0.25 * Math.max(0, Math.sin((t - 1.2) * 4)));
  return <CabInterior t={t} meterOn={t > 1.3} pressing={press} />;
};

/* 130 — stop here ----------------------------------------------------------- */
const StopHere: React.FC<IllustrationProps> = ({ t }) => {
  const k = easeOut(t / 3.4);
  const x = lerp(-180, 430, k);
  return (
    <g>
      <RoadBackdrop />
      <rect x={560} y={440} width={230} height={150} rx={10} fill="none" stroke={C.accent} strokeWidth={6} strokeDasharray="18 12" />
      <g transform="translate(850 380)">
        <rect x={-5} y={-130} width={10} height={130} rx={4} fill={I.metalDark} />
        <path d="M5 -130 H70 L58 -104 L70 -78 H5 Z" fill={C.danger} />
      </g>
      <Taxi x={x} y={560} s={0.95} riders passengerArm brake={k > 0.7} wheelRot={t * 260 * (1 - k)} />
    </g>
  );
};

export const sentenceIllustrations: Record<IllustrationKey, React.FC<IllustrationProps>> = {
  crowdedMarket: CrowdedMarket,
  nearestShop: NearestShop,
  buyRice: BuyRice,
  buyMeat: BuyMeat,
  freshCheck: FreshCheck,
  hailTaxi: HailTaxi,
  toAirport: ToAirport,
  askFare: AskFare,
  meterOn: MeterOn,
  stopHere: StopHere,
};

/* ------------------------------------------------------------------ clusters */

/** 450 x 640 market cluster (thumbnail / topic intro). */
export const MarketCluster: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={0} y={0} width={450} height={640} rx={32} fill={C.white} />
    <rect x={0} y={0} width={450} height={640} rx={32} fill={C.bgAlt} opacity={0.6} />
    <Shelf x={30} y={60} w={390} h={230} rows={3} seed={3} />
    <PriceTag x={90} y={50} s={0.9} rot={-8} />
    <PriceTag x={370} y={50} s={0.9} rot={8} />
    <rect x={0} y={520} width={450} height={120} fill={I.sand} />
    <path d="M0 610 a32 32 0 0 0 32 30 H418 a32 32 0 0 0 32 -30 V608 H0 Z" fill={I.sand} />
    <RiceBag x={110} y={520} s={0.62} />
    <MeatCut x={250} y={490} s={1.0} />
    <Basket x={330} y={540} s={0.95} />
    <Person x={200} y={610 + Math.sin(t * 2) * -2} s={0.82} shirt={I.shirt[0]} arm="up" />
    <QuestionBubble x={300} y={330} s={0.75} />
  </g>
);

/** 450 x 640 taxi cluster. */
export const TaxiCluster: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={0} y={0} width={450} height={640} rx={32} fill={I.sky} />
    <circle cx={360} cy={90} r={44} fill={C.accent} opacity={0.35} />
    <g transform={`translate(${((t * 20) % 560) - 60} 120)`}><PlaneIcon x={0} y={0} s={0.5} rot={90} color={C.white} /></g>
    <AirportSign x={330} y={400} s={0.78} />
    <rect x={0} y={420} width={450} height={220} fill={I.road} />
    <path d="M0 610 a32 32 0 0 0 32 30 H418 a32 32 0 0 0 32 -30 V608 H0 Z" fill={I.road} />
    <rect x={0} y={404} width={450} height={22} fill={I.curb} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={20 + i * 110} y={560} width={60} height={9} rx={4} fill={I.roadLine} />)}
    <Taxi x={225} y={540} s={0.78} riders wheelRot={t * 200} />
  </g>
);

/** Horizontal icon row, viewBox 940 x 380. */
export const IconRow: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={0} y={0} width={940} height={380} rx={32} fill={C.white} opacity={0.75} />
    <Basket x={130} y={290 + Math.sin(t * 2) * -4} s={1.25} />
    <RiceBag x={330} y={300} s={0.85} />
    <Taxi x={590} y={300 + Math.sin(t * 2.2 + 1) * -3} s={0.62} riders />
    <AirportSign x={830} y={310} s={0.8} />
  </g>
);

/** Slim strip (940 x 110) with a taxi driving along: summary completion animation. */
export const DriveStrip: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={0} y={0} width={940} height={110} rx={24} fill={I.sky} />
    <rect x={0} y={84} width={940} height={26} rx={0} fill={I.road} />
    <path d="M0 96 H940 V110 H0 Z" fill={I.road} />
    <Basket x={120} y={80} s={0.42} />
    <AirportSign x={850} y={84} s={0.34} />
    <Taxi x={((t * 90) % 1200) - 120} y={92} s={0.27} wheelRot={t * 300} />
  </g>
);
