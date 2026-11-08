import React from "react";
import { interpolate } from "remotion";
import { theme } from "../theme";
import type { IllustrationId } from "../types/episode";
import {
  Arrow, Bubble, Cart, Coin, Counter, Glyph, Person, Pop, PriceTag, Shirt, ShoppingBag, Sparkle, Stage, useT,
} from "./kit";

const c = theme.colors;
const TAU = Math.PI * 2;
const clampI = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Rod: React.FC<{ x1: number; x2: number; y: number }> = ({ x1, x2, y }) => (
  <g>
    <line x1={x1} y1={y} x2={x2} y2={y} stroke={c.slate} strokeWidth={8} strokeLinecap="round" />
    <line x1={x1} y1={y} x2={x1} y2={560} stroke={c.slate} strokeWidth={8} opacity={0.5} />
  </g>
);

/* 101 — asking the price */
const PriceAsk: React.FC = () => {
  const t = useT();
  const point = Math.sin(t * TAU * 0.9) * 8;
  return (
    <Stage>
      <Pop delay={0.1} x={700} y={640} dy={0}>
        <Person x={0} y={0} kind="shop" mood="smile" armL={[-10, 100]} armR={[40 + Math.sin(t * 3) * 6, -60]} />
      </Pop>
      <Counter x={500} w={360} />
      <Pop delay={0.25} x={190} y={640} dx={-60} dy={0}>
        <Person x={0} y={0} kind="customer" mood="ask" armR={[170 + point, -30]} />
      </Pop>
      <Rod x1={300} x2={620} y={150} />
      <Pop delay={0.45} x={450} y={150} dy={-60}>
        <Shirt x={0} y={30} s={1.25} color={c.sky} rotate={Math.sin(t * 1.6) * 2} />
        <PriceTag x={20} y={190} label="?" s={1.15} rotate={Math.sin(t * 2.4) * 6} fontSize={52} />
      </Pop>
      <Pop delay={0.8} x={150} y={150}>
        <Bubble x={-30} y={0} w={190} h={110} tail="left">
          <Coin x={-44} y={0} s={0.9} />
          <Glyph x={34} size={64} color={c.accentDark}>?</Glyph>
        </Bubble>
      </Pop>
    </Stage>
  );
};

/* 102 — too expensive */
const TooExpensive: React.FC = () => {
  const t = useT();
  const drop = (t * 1.4) % 1;
  return (
    <Stage>
      <Pop delay={0.1} x={260} y={640} dx={-40} dy={0}>
        <Person x={0} y={0} kind="customer" mood="surprised" armL={[-8, -62]} armR={[8, -62]} tilt={Math.sin(t * 5) * 2} />
      </Pop>
      <g opacity={interpolate(t, [0.9, 1.0], [0, 1], clampI)}>
        <ellipse cx={330 + 4} cy={250 + drop * 50} rx={7} ry={11} fill={c.sky} opacity={1 - drop} />
      </g>
      <Rod x1={470} x2={830} y={170} />
      <Pop delay={0.35} x={650} y={170} dy={-60}>
        <Shirt x={0} y={30} s={1.2} color={c.violet} rotate={Math.sin(t * 1.5) * 2} />
        <PriceTag x={20} y={200} label="950 SAR" s={1.25} fill={c.danger} textColor={c.white} fontSize={34} rotate={Math.sin(t * 7) * 5} />
      </Pop>
      <Pop delay={0.7} x={640} y={470}>
        <Arrow x={0} y={0} dir="up" color={c.danger} s={1.1} />
      </Pop>
      {[0, 1, 2].map((i) => {
        const k = (t * 0.7 + i * 0.33) % 1;
        return <g key={i} opacity={1 - k}><Coin x={520 + i * 110} y={560 - k * 140} s={0.7} /></g>;
      })}
      <Pop delay={0.6} x={140} y={110}>
        <Bubble x={0} y={0} w={170} h={100} tail="right" fill={c.dangerSoft}>
          <Glyph size={70} color={c.danger}>!!</Glyph>
        </Bubble>
      </Pop>
    </Stage>
  );
};

/* 103 — negotiate: price goes down */
const Negotiate: React.FC = () => {
  const t = useT();
  const price = Math.round(interpolate(t, [1.4, 2.6], [120, 90], { easing: theme.ease.inOut, ...clampI }));
  const dropped = t > 1.4;
  return (
    <Stage>
      <Pop delay={0.1} x={730} y={640} dx={60} dy={0}>
        <Person x={0} y={0} kind="shop" mood="neutral" flip armL={[-40, -30]} armR={[40, -30]} />
      </Pop>
      <Counter x={560} w={320} />
      <Pop delay={0.2} x={170} y={640} dx={-60} dy={0}>
        <Person x={0} y={0} kind="customer" mood="smile" armR={[120, -50 + Math.sin(t * 3) * 8]} armL={[-30, 110]} />
      </Pop>
      <Pop delay={0.5} x={440} y={200}>
        <rect x={-150} y={-110} width={300} height={260} rx={36} fill={c.white} stroke={c.mint} strokeWidth={6} />
        <PriceTag x={-24} y={-40} label="120" s={0.9} fill={c.mint} textColor={c.textSoft} strike={dropped} />
        <PriceTag x={-10} y={72} label={`${price}`} s={1.4} fill={c.accent} fontSize={46} rotate={dropped ? Math.sin(t * 6) * 3 : 0} />
      </Pop>
      <Pop delay={1.4} x={620} y={190} dy={-40}>
        <circle r={46} fill={c.primary} />
        <Arrow x={0} y={0} dir="down" color={c.white} s={0.7} />
      </Pop>
      <Sparkle x={330} y={150} s={0.8} />
      <Sparkle x={560} y={330} s={0.6} phase={2} />
      <Pop delay={1.9} x={450} y={430}><Coin x={-40} y={0} s={0.8} /><Coin x={40} y={0} s={0.8} /></Pop>
    </Stage>
  );
};

/* 104 — final price */
const FinalPrice: React.FC = () => {
  const t = useT();
  const pulse = 1 + Math.sin(t * TAU * 0.9) * 0.04;
  const star = "M0 -46 L13 -16 L46 -14 L20 8 L29 40 L0 22 L-29 40 L-20 8 L-46 -14 L-13 -16Z";
  return (
    <Stage>
      <Pop delay={0.1} x={710} y={640} dy={0} dx={50}>
        <Person x={0} y={0} kind="shop" mood="smile" armR={[30, -50]} />
      </Pop>
      <Counter x={510} w={350} />
      <Pop delay={0.5} x={640} y={400}>
        <g transform={`scale(${pulse})`}>
          <rect x={-64} y={-118} width={128} height={168} rx={20} fill={c.slate} />
          <rect x={-48} y={-102} width={96} height={46} rx={10} fill={c.mint} />
          <Glyph y={-80} size={34} color={c.text}>??</Glyph>
          {[0, 1, 2].map((r) => [0, 1, 2].map((q) => <circle key={`${r}${q}`} cx={-30 + q * 30} cy={-30 + r * 28} r={9} fill={c.white} opacity={0.85} />))}
        </g>
      </Pop>
      <Pop delay={0.25} x={200} y={640} dx={-60} dy={0}>
        <Person x={0} y={0} kind="customer" mood="ask" armR={[190, -60 + Math.sin(t * 4) * 8]} />
      </Pop>
      <Rod x1={300} x2={560} y={150} />
      <Pop delay={0.5} x={430} y={150} dy={-60}>
        <Shirt x={0} y={30} s={1.1} color={c.rose} rotate={Math.sin(t * 1.6) * 2} />
        <PriceTag x={14} y={170} label="?" s={1.1} fontSize={52} />
      </Pop>
      <Pop delay={1.0} x={560} y={130} rotate={12}>
        <path d={star} fill={c.accent} transform={`scale(${1.4 * pulse})`} />
        <Glyph size={30} color={c.white}>LAST</Glyph>
      </Pop>
    </Stage>
  );
};

/* 105/106 shared: sizes on a rack */
const SizeRack: React.FC<{ mode: "bigger" | "smaller" }> = ({ mode }) => {
  const t = useT();
  const items = [
    { l: "S", x: 450, s: 0.7, col: c.sky },
    { l: "M", x: 600, s: 0.9, col: c.sky },
    { l: "L", x: 790, s: 1.15, col: c.sky },
  ];
  const sel = mode === "bigger" ? 2 : 0;
  const lift = interpolate(t, [1.2, 1.7], [0, 1], { easing: theme.ease.back, ...clampI });
  return (
    <Stage>
      <Rod x1={380} x2={870} y={130} />
      {items.map((it, i) => {
        const chosen = i === sel;
        const bob = chosen ? Math.sin(t * TAU * 0.9) * 5 : 0;
        const dim = !chosen && t > 1.2 ? 0.45 : 1;
        return (
          <Pop key={it.l} delay={0.3 + i * 0.15} x={it.x} y={130 + (chosen ? -lift * 24 + bob : 0)} dy={-70}>
            <g opacity={dim}>
              {chosen && lift > 0.1 && <circle cx={0} cy={140 * it.s} r={150 * it.s} fill={c.accentSoft} opacity={lift * 0.9} />}
              <Shirt x={0} y={30} s={it.s} color={it.col} label={it.l} />
            </g>
          </Pop>
        );
      })}
      <Pop delay={0.15} x={170} y={640} dx={-50} dy={0}>
        <Person
          x={0}
          y={0}
          kind="customer"
          mood={mode === "bigger" ? "ask" : "smile"}
          armR={mode === "bigger" ? [40, -130 + Math.sin(t * 4) * 8] : [60, -90]}
          holdR={mode === "smaller" ? <g transform="translate(18 -70)"><Shirt x={0} y={0} s={0.5} color={c.sky} hanger={false} label="S" /></g> : undefined}
        />
      </Pop>
      <Pop delay={0.8} x={90} y={120}>
        <Bubble x={0} y={0} w={190} h={110} tail="left">
          <Arrow x={-46} y={0} dir={mode === "bigger" ? "up" : "down"} color={c.primary} s={0.8} />
          <Glyph x={40} size={72} color={c.accentDark}>{mode === "bigger" ? "L" : "S"}</Glyph>
        </Bubble>
      </Pop>
      {t > 1.5 && (
        <Pop delay={1.5} x={items[sel].x + 60 * items[sel].s} y={90}>
          <circle r={40} fill={c.primary} />
          <path d="M -17 2 l 12 14 l 24 -28" fill="none" stroke={c.white} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        </Pop>
      )}
    </Stage>
  );
};

/* 107 — dislike */
const Dislike: React.FC = () => {
  const t = useT();
  return (
    <Stage>
      <Pop delay={0.1} x={290} y={640} dy={0} dx={-40}>
        <Person
          x={0}
          y={0}
          kind="customer"
          mood="frown"
          tilt={Math.sin(t * TAU * 1.4) * 8}
          armL={[-70, -100 + Math.sin(t * 6) * 10]}
          armR={[120, -70]}
          holdR={<g transform="translate(40 -10) rotate(-8)"><Shirt x={0} y={0} s={0.62} color={c.accentDark} hanger={false} /></g>}
        />
      </Pop>
      <Pop delay={0.6} x={640} y={290}>
        <circle r={140} fill={c.dangerSoft} />
        <circle r={104} fill={c.danger} />
        <path d="M -42 -42 L 42 42 M 42 -42 L -42 42" stroke={c.white} strokeWidth={22} strokeLinecap="round" />
      </Pop>
      <Pop delay={0.9} x={640} y={500} dy={20}>
        <path d="M -36 -2 v -54 q 0 -26 24 -28 l 6 -22 q 38 8 34 40 l -6 24 h 40 q 22 0 20 24 l -6 56 q -2 18 -20 18 H -12 q -24 0 -24 -22z" transform="scale(1 -1) translate(0 -40)" fill={c.slate} />
      </Pop>
    </Stage>
  );
};

/* 108 — other colors */
const Colors: React.FC = () => {
  const t = useT();
  const cols = [c.sky, c.accent, c.rose, c.violet, c.primary];
  const sel = Math.floor(Math.max(0, t - 1.2) * 1.3) % 5;
  return (
    <Stage>
      <Rod x1={90} x2={810} y={120} />
      {cols.map((col, i) => {
        const on = t > 1.2 && i === sel;
        return (
          <Pop key={i} delay={0.25 + i * 0.14} x={170 + i * 140} y={120 + (on ? -16 : 0)} dy={-60}>
            {on && <circle cx={0} cy={118} r={92} fill={c.accentSoft} />}
            <Shirt x={0} y={26} s={0.74} color={col} />
          </Pop>
        );
      })}
      <Pop delay={0.9} x={300} y={640} dy={0} dx={-60}>
        <Person x={0} y={0} s={0.82} kind="customer" mood="ask" armR={[70, -110 + Math.sin(t * 4) * 8]} />
      </Pop>
      <Pop delay={1.0} x={470} y={400}>
        <Bubble x={0} y={0} w={250} h={120} tail="left">
          {cols.slice(0, 4).map((col, i) => <circle key={i} cx={-66 + i * 36} cy={-12} r={15} fill={col} />)}
          <Glyph x={78} y={-8} size={56} color={c.accentDark}>?</Glyph>
        </Bubble>
      </Pop>
      <Sparkle x={780} y={470} s={0.9} />
    </Stage>
  );
};

/* 109 — try it on */
const TryOn: React.FC = () => {
  const t = useT();
  return (
    <Stage>
      <Pop delay={0.1} x={300} y={640} dy={0} dx={-50}>
        <Person
          x={0}
          y={0}
          kind="customer"
          mood="smile"
          armL={[30, 40]}
          armR={[-30, 40]}
        />
        <g transform={`translate(0 -150) rotate(${Math.sin(t * 2) * 2})`}>
          <Shirt x={0} y={0} s={0.62} color={c.violet} hanger={false} />
          <PriceTag x={52} y={30} label="OK" s={0.4} fontSize={40} />
        </g>
      </Pop>
      <Pop delay={0.6} x={700} y={330} dx={40} dy={0}>
        <rect x={-110} y={-230} width={220} height={440} rx={110} fill={c.slate} />
        <rect x={-94} y={-214} width={188} height={408} rx={96} fill={c.mint} />
        <g transform="translate(0 -40) scale(-1 1)">
          <Person x={0} y={150} s={0.42} kind="customer" mood="smile" bob={0.5} />
        </g>
        <path d="M -60 -150 L 30 -190" stroke={c.white} strokeWidth={12} strokeLinecap="round" opacity={0.7} />
        <rect x={-70} y={206} width={140} height={22} rx={10} fill={c.slate} />
      </Pop>
      <Sparkle x={780} y={140} s={0.9} />
      <Sparkle x={590} y={230} s={0.6} phase={1.5} />
      <Pop delay={1.0} x={110} y={150}>
        <Bubble x={0} y={0} w={190} h={110} tail="left">
          <Shirt x={-10} y={-34} s={0.34} color={c.violet} />
          <Glyph x={50} size={64} color={c.accentDark}>?</Glyph>
        </Bubble>
      </Pop>
    </Stage>
  );
};

/* 110 — fitting room */
const FittingRoom: React.FC = () => {
  const t = useT();
  const sway = Math.sin(t * 1.8) * 6;
  const booth = (x: number, col: string, i: number) => (
    <Pop key={i} delay={0.2 + i * 0.15} x={x} y={600} dy={50} from={0.9}>
      <rect x={-6} y={-410} width={232} height={414} rx={16} fill={c.slate} />
      <rect x={14} y={-392} width={192} height={386} rx={6} fill={c.mintSoft} />
      <path d={`M 14 -392 H 110 Q ${100 + sway} -200 ${112 + sway} -6 H 14Z`} fill={col} />
      <path d={`M 206 -392 H 110 Q ${122 + sway} -200 ${112 + sway} -6 H 206Z`} fill={col} opacity={0.85} />
      <circle cx={110} cy={-396} r={0} />
    </Pop>
  );
  return (
    <Stage>
      {booth(380, c.primary, 0)}
      {booth(620, c.accent, 1)}
      <Pop delay={0.6} x={600} y={110} dy={-40}>
        <rect x={-210} y={-44} width={420} height={96} rx={30} fill={c.white} stroke={c.primary} strokeWidth={7} />
        <g transform="translate(-150 4) scale(0.5)">
          <path d="M 0 6 V -10 q 0 -16 16 -16 q 12 0 12 12" fill="none" stroke={c.primary} strokeWidth={9} strokeLinecap="round" />
          <path d="M -50 40 L 0 6 L 50 40Z" fill="none" stroke={c.primary} strokeWidth={9} strokeLinejoin="round" />
        </g>
        <text x={30} y={10} textAnchor="middle" fontFamily={theme.fonts.en} fontWeight={700} fontSize={42} fill={c.text}>FITTING ROOM</text>
      </Pop>
      <Pop delay={0.2} x={150} y={640} dx={-60} dy={0}>
        <Person
          x={0}
          y={0}
          s={0.92}
          kind="customer"
          mood="ask"
          armR={[60, -90]}
          holdR={<g transform="translate(14 -50) rotate(6)"><Shirt x={0} y={0} s={0.42} color={c.sky} /></g>}
        />
      </Pop>
      <Pop delay={1.0} x={285} y={290} dx={-20} dy={0}>
        <g transform={`translate(${Math.sin(t * 4) * 8} 0)`}>
          <Arrow x={0} y={0} dir="right" color={c.accent} s={1.1} />
        </g>
      </Pop>
      <Pop delay={0.9} x={80} y={120}>
        <Bubble x={0} y={0} w={170} h={100} tail="left">
          <Glyph size={68} color={c.accentDark}>?</Glyph>
        </Bubble>
      </Pop>
    </Stage>
  );
};

export const illustrations: Record<IllustrationId, React.FC> = {
  priceAsk: PriceAsk,
  tooExpensive: TooExpensive,
  negotiate: Negotiate,
  finalPrice: FinalPrice,
  biggerSize: () => <SizeRack mode="bigger" />,
  smallerSize: () => <SizeRack mode="smaller" />,
  dislike: Dislike,
  colors: Colors,
  tryOn: TryOn,
  fittingRoom: FittingRoom,
};

/** Shopping cluster used on the thumbnail and topic scenes: bags, tags, shirts, cart. */
export const ShoppingCluster: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const t = useT();
  const fl = (ph: number, a = 8) => Math.sin(t * 1.3 + ph) * a;
  return (
    <svg viewBox="0 0 900 640" width="100%" height="100%" style={{ overflow: "visible" }}>
      <ellipse cx={450} cy={600} rx={380} ry={30} fill={c.shadow} />
      <Pop delay={delay} x={150} y={440 + fl(0)} dy={90}><Shirt x={0} y={-130} s={1.0} color={c.sky} hanger={false} rotate={-8} /></Pop>
      <Pop delay={delay + 0.1} x={290} y={470 + fl(1)} dy={90}><ShoppingBag x={0} y={0} s={1.25} color={c.primary} /></Pop>
      <Pop delay={delay + 0.2} x={610} y={480 + fl(2)} dy={90}><ShoppingBag x={0} y={0} s={1.15} color={c.accent} accent={c.white} rotate={4} /></Pop>
      <Pop delay={delay + 0.3} x={760} y={450 + fl(3)} dy={90}><Shirt x={0} y={-130} s={0.95} color={c.rose} hanger={false} rotate={8} /></Pop>
      <Pop delay={delay + 0.4} x={450} y={500 + fl(4, 5)} dy={90}><Cart x={0} y={0} s={1.2} /></Pop>
      <Pop delay={delay + 0.55} x={170} y={150 + fl(5)} dy={30}><PriceTag x={0} y={0} label="50%" s={1.3} rotate={-12} fill={c.accent} /></Pop>
      <Pop delay={delay + 0.65} x={730} y={130 + fl(6)} dy={30}><PriceTag x={0} y={0} label="SAR" s={1.2} rotate={10} fill={c.primary} textColor={c.white} /></Pop>
      <Sparkle x={450} y={120} s={1.1} />
      <Sparkle x={60} y={330} s={0.7} phase={2} />
      <Sparkle x={850} y={330} s={0.8} phase={4} />
    </svg>
  );
};
