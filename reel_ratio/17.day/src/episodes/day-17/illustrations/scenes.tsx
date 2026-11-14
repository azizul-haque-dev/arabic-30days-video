import React from "react";
import { theme } from "../../../theme";
import type { IllustrationId } from "../../../types";
import {
  Bag, Basket, Bread, Bubble, Chair, Clock, Fork, G, Knife, Person, Plate, QuestionMark, Receipt, ReservedSign, Room, Snowflake, Spoon,
  Steam, Table, TakeoutBox, FLOOR_Y, clamp01, mapRange, useAnim,
} from "../../../components/art/primitives";

const c = theme.colors;
const a = c.art;

const TABLE = { x: 450, y: 400, w: 560 };
const PLANE_Y = 366; // vertical centre of the table surface

const useBlink = (frame: number, offset = 0) => clamp01(1 - Math.abs(((frame + offset) % 110) - 5) / 5);

/* ---------- 161 · asking for the bill ---------- */
const AskBill: React.FC = () => {
  const { frame, t, enter, lerp, idle } = useAnim();
  const w = enter(0.25, "soft");
  const r = enter(1.0, "bouncy");
  const wave = Math.sin(t * 5) * 7;
  return (
    <g>
      <Room />
      <Person x={240} y={455} armR={138 + wave} mouth="open" look={0.6} bob={idle(3) * 2} blink={useBlink(frame)} handR={null} />
      <Table {...TABLE} />
      <Plate x={340} y={PLANE_Y} rx={92} food="empty" />
      <Plate x={540} y={PLANE_Y} rx={92} food="empty" />
      <G x={470} y={236 + idle(2.6) * 6} s={lerp(r, 0.2, 1.15)} rot={lerp(r, -20, -4)} o={clamp01(r * 1.6)}>
        <Receipt />
      </G>
      <Person
        x={lerp(w, 1060, 810)}
        y={470}
        legs
        shirt={a.waiterShirt}
        apron
        hairStyle="cap"
        skin={a.skin2}
        armL={84}
        handL={
          <G rot={-84} y={-8}>
            <Receipt s={0.55} />
          </G>
        }
        look={-0.8}
        blink={useBlink(frame, 40)}
      />
    </g>
  );
};

/* ---------- 162 · confirming your order ---------- */
const MyOrder: React.FC = () => {
  const { frame, t, enter, lerp, idle } = useAnim();
  const p = enter(0.35, "soft");
  const ring = 1 + idle(1.6) * 0.04;
  const bob = Math.sin(t * 4) * 6;
  const arrow = enter(1.3, "bouncy");
  return (
    <g>
      <Room />
      <Person x={240} y={455} armR={58} mouth="open" look={0.7} bob={idle(3) * 2} blink={useBlink(frame)} />
      <Table {...TABLE} />
      <g opacity={clamp01(p * 2)}>
        <Plate x={lerp(p, 900, 470)} y={PLANE_Y} rx={128} food="meal" />
      </g>
      <g opacity={clamp01(arrow * 1.4)}>
        <ellipse cx={470} cy={PLANE_Y} rx={158 * ring} ry={52 * ring} fill="none" stroke={c.accent} strokeWidth={6} strokeDasharray="16 12" strokeDashoffset={-t * 40} />
        <G x={470} y={240 + bob} s={lerp(arrow, 0.3, 1)}>
          <path d="M-34 -30 H34 L0 30Z" fill={c.accent} stroke={c.white} strokeWidth={6} strokeLinejoin="round" />
        </G>
      </g>
      <Person x={830} y={470} legs shirt={a.waiterShirt} apron hairStyle="cap" skin={a.skin2} armL={138 + Math.sin(t * 3) * 8} look={-0.8} blink={useBlink(frame, 30)} />
    </g>
  );
};

/* ---------- 163 · order has not arrived ---------- */
const NoOrder: React.FC = () => {
  const { frame, t, enter, lerp, idle } = useAnim();
  const plate = enter(0.2, "soft");
  const clock = enter(0.7, "bouncy");
  const q = enter(1.3, "bouncy");
  const attention = enter(2.0, "soft");
  return (
    <g>
      <Room showLamp={false} />
      <G s={lerp(clock, 0.3, 1)} o={clamp01(clock * 1.5)} x={0} y={0}>
        <Clock x={560} y={104} frame={frame} />
      </G>
      <Person x={240} y={455} armR={146 + Math.sin(t * 5) * 8} mouth="flat" look={0.7} bob={idle(3) * 2} blink={useBlink(frame)} />
      <Table {...TABLE} />
      <g opacity={clamp01(plate * 2)}>
        <Plate x={450} y={lerp(plate, PLANE_Y - 40, PLANE_Y)} rx={110} food="empty" />
        <Fork x={300} y={PLANE_Y + 8} s={0.5} />
        <Knife x={600} y={PLANE_Y + 8} s={0.5} />
      </g>
      <Bubble x={140} y={350 - Math.abs(Math.sin(t * 3)) * 8} s={lerp(q, 0.2, 1)} tone="amber">
        <QuestionMark />
      </Bubble>
      <Person
        x={830}
        y={470}
        legs
        shirt={a.waiterShirt}
        apron
        hairStyle="cap"
        skin={a.skin2}
        armL={lerp(attention, 8, 146)}
        look={-0.8}
        mouth="smile"
        blink={useBlink(frame, 55)}
      />
    </g>
  );
};

/* ---------- 164 · cold food ---------- */
const ColdFood: React.FC = () => {
  const { frame, t, enter, lerp, idle } = useAnim();
  const p = enter(0.2, "soft");
  const gone = mapRange(frame, 24, 56, 1, 0);
  const badge = enter(1.7, "bouncy");
  return (
    <g>
      <Room />
      <Person x={270} y={455} armR={54} mouth="flat" look={0.7} bob={idle(3) * 2} blink={useBlink(frame)} />
      <Table {...TABLE} />
      <G x={560} y={PLANE_Y} s={lerp(p, 0.5, 1)} o={clamp01(p * 2)}>
        <Plate x={0} y={0} rx={150} food="cold" />
        <ellipse cx={0} cy={-6} rx={140} ry={38} fill={a.ice} opacity={0.2} />
      </G>
      {/* steam that fades out → no steam */}
      <g opacity={gone}>
        <Steam x={560} y={PLANE_Y - 44} frame={frame} fade={1} />
      </g>
      <g opacity={(1 - gone) * 0.9}>
        {[-40, 0, 40].map((dx) => (
          <path key={dx} d={`M${560 + dx} ${PLANE_Y - 50} q10 -20 0 -40`} stroke={c.textSoft} strokeWidth={5} strokeLinecap="round" strokeDasharray="4 10" fill="none" opacity={0.35} />
        ))}
      </g>
      <Bubble x={730} y={236 + Math.sin(t * 2.5) * 5} s={lerp(badge, 0.2, 1.1)} tone="ice">
        <Snowflake rot={t * 20} />
      </Bubble>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={470 + i * 90} cy={PLANE_Y - 70 - (i % 2) * 26 + Math.sin(t * 3 + i) * 4} r={5} fill={a.ice} opacity={clamp01(badge)} />
      ))}
    </g>
  );
};

/* ---------- 165 · extra bread ---------- */
const ExtraBread: React.FC = () => {
  const { frame, t, enter, lerp, idle } = useAnim();
  const basket = enter(0.25, "bouncy");
  const fly = mapRange(frame, 56, 86, 0, 1);
  const landed = fly >= 1;
  const sx = 650,
    sy = 300,
    ex = 470 - 2 * 1.2,
    ey = 382 - 62 * 1.2;
  return (
    <g>
      <Room />
      <Person x={240} y={455} armR={138 + Math.sin(t * 5) * 7} mouth="open" look={0.6} bob={idle(3) * 2} blink={useBlink(frame)} />
      <Table {...TABLE} />
      <Basket x={470} y={382} s={lerp(basket, 0.2, 1.2)} loaves={landed ? 3 : 2} />
      {fly > 0 && !landed && (
        <Bread x={lerp(fly, sx, ex)} y={lerp(fly, sy, ey) - Math.sin(Math.PI * fly) * 90} rot={lerp(fly, 40, -4)} s={1.2} />
      )}
      <Person x={830} y={470} legs shirt={a.waiterShirt} apron hairStyle="cap" skin={a.skin2} armL={lerp(enter(0.9, "soft"), 8, 100)} look={-0.8} blink={useBlink(frame, 20)} />
    </g>
  );
};

/* ---------- 166 · missing spoon ---------- */
const MissingSpoon: React.FC = () => {
  const { frame, t, enter, lerp, idle } = useAnim();
  const setUp = enter(0.2, "soft");
  const gap = enter(1.0, "soft");
  const q = enter(1.8, "bouncy");
  const pulse = 1 + idle(1.4) * 0.05;
  return (
    <g>
      <Room />
      <Person x={250} y={455} armR={36} armL={36} mouth="flat" look={0.6} bob={idle(3) * 2} blink={useBlink(frame)} />
      <Table {...TABLE} />
      <g opacity={clamp01(setUp * 2)} transform={`translate(0 ${(1 - setUp) * 24})`}>
        <Plate x={450} y={PLANE_Y} rx={96} food="empty" />
        <Fork x={318} y={PLANE_Y + 6} s={0.5} />
        <Knife x={582} y={PLANE_Y + 6} s={0.5} />
      </g>
      <g opacity={clamp01(gap * 2)}>
        <ellipse cx={650} cy={PLANE_Y + 6} rx={52 * pulse} ry={58 * pulse} fill={c.accentSoft} opacity={0.6} />
        <Spoon x={650} y={PLANE_Y + 14} s={0.62} outline dash={-t * 30} />
      </g>
      <Bubble x={650} y={236 + Math.sin(t * 3) * 5} s={lerp(q, 0.2, 0.95)} tone="amber">
        <QuestionMark />
      </Bubble>
    </g>
  );
};

/* ---------- 167 · packing leftover food ---------- */
const PackLeftover: React.FC = () => {
  const { frame, lerp, enter, idle } = useAnim();
  const box = enter(0.3, "soft");
  const bits = [0, 1, 2].map((i) => mapRange(frame, 60 + i * 10, 84 + i * 10, 0, 1));
  const done = bits[2] >= 1;
  const lid = mapRange(frame, 100, 120, 1, 0);
  return (
    <g>
      <Room />
      <Person x={230} y={455} armR={30} mouth="smile" look={0.6} bob={idle(3) * 2} blink={useBlink(frame)} />
      <Table {...TABLE} />
      <Plate x={340} y={PLANE_Y} rx={110} food="leftover" />
      <g opacity={clamp01(box * 2)}>
        <TakeoutBox x={lerp(box, 900, 590)} y={400} s={1.15} lid={done ? lid : 1} filled={done} />
      </g>
      {bits.map((b, i) =>
        b > 0 && b < 1 ? (
          <ellipse key={i} cx={lerp(b, 340 + i * 14, 590 - 10 + i * 12)} cy={lerp(b, PLANE_Y - 10, 322) - Math.sin(Math.PI * b) * 80} rx={13} ry={9} fill={i === 1 ? a.chicken : a.rice} />
        ) : null,
      )}
      <Person x={830} y={470} legs shirt={a.waiterShirt} apron hairStyle="cap" skin={a.skin2} armL={96} look={-0.8} blink={useBlink(frame, 35)} />
    </g>
  );
};

/* ---------- 168 · takeaway order ---------- */
const Takeaway: React.FC = () => {
  const { frame, t, enter, lerp, idle } = useAnim();
  const arms = enter(0.4, "soft");
  const bag = enter(0.8, "bouncy");
  const hand = mapRange(frame, 70, 100, 0, 1);
  const bagX = lerp(hand, 505, 420);
  const swing = Math.sin(t * 4) * 5 * (1 - hand * 0.6);
  return (
    <g>
      <Room />
      <Person x={250} y={452} armR={lerp(arms, 8, 94)} mouth="smile" look={0.6} bob={idle(3) * 2} blink={useBlink(frame)} />
      <Person x={660} y={452} legs shirt={a.waiterShirt} apron hairStyle="cap" skin={a.skin2} armL={lerp(arms, 8, 94)} look={-0.8} blink={useBlink(frame, 25)} />
      {/* counter */}
      <rect x={0} y={418} width={940} height={24} rx={10} fill={a.wood} />
      <rect x={0} y={442} width={940} height={110} fill={c.primary} />
      <rect x={0} y={442} width={940} height={12} fill={c.primaryDark} opacity={0.5} />
      <rect x={0} y={494} width={940} height={8} fill={c.white} opacity={0.6} />
      <G x={bagX} y={540} s={lerp(bag, 0.3, 1.1)} o={clamp01(bag * 2)}>
        <Bag swing={swing} />
      </G>
    </g>
  );
};

/* ---------- 169 · reserved table ---------- */
const ReservedTable: React.FC = () => {
  const { frame, t, enter, lerp, idle } = useAnim();
  const tableIn = enter(0.15, "soft");
  const sign = enter(0.9, "bouncy");
  const q = enter(1.6, "bouncy");
  return (
    <g>
      <Room />
      <Chair x={215} y={FLOOR_Y + 12} />
      <Chair x={725} y={FLOOR_Y + 12} flip />
      <G x={470} y={400} s={lerp(tableIn, 0.7, 1)} o={clamp01(tableIn * 2)}>
        <G x={-470} y={-400}>
          <Table x={470} y={400} w={340} />
        </G>
      </G>
      <G x={470} y={lerp(sign, 120, 380)} o={clamp01(sign * 2)} rot={lerp(sign, -14, -3)}>
        <ReservedSign s={1.25} />
      </G>
      <Person x={95} y={470} s={0.95} legs armR={52 + Math.sin(t * 4) * 5} mouth="open" look={0.7} bob={idle(3) * 2} blink={useBlink(frame)} />
      <Bubble x={190} y={150 - Math.abs(Math.sin(t * 3)) * 8} s={lerp(q, 0.2, 0.95)} tone="amber">
        <QuestionMark />
      </Bubble>
      <Person x={822} y={470} legs shirt={a.waiterShirt} apron hairStyle="cap" skin={a.skin2} armL={100 + Math.sin(t * 3) * 6} look={-0.8} blink={useBlink(frame, 45)} />
    </g>
  );
};

/* ---------- 170 · table for two ---------- */
const TableForTwo: React.FC = () => {
  const { t, enter, lerp } = useAnim();
  const table = enter(0.2, "soft");
  const chairs = enter(0.7, "soft");
  const two = enter(1.5, "bouncy");
  return (
    <g>
      <Room />
      <Chair x={lerp(chairs, -60, 215)} y={FLOOR_Y + 12} />
      <Chair x={lerp(chairs, 1000, 725)} y={FLOOR_Y + 12} flip />
      <G x={470} y={400} s={lerp(table, 0.5, 1)} o={clamp01(table * 2)}>
        <G x={-470} y={-400}>
          <Table x={470} y={400} w={360} />
          <Plate x={405} y={PLANE_Y + 4} rx={58} food="empty" />
          <Plate x={535} y={PLANE_Y + 4} rx={58} food="empty" />
          {/* flower vase */}
          <rect x={462} y={PLANE_Y - 26} width={16} height={34} rx={6} fill={a.ice} />
          <circle cx={470} cy={PLANE_Y - 36} r={9} fill={c.accent} />
          <circle cx={460} cy={PLANE_Y - 28} r={6} fill={a.tomato} />
          <circle cx={480} cy={PLANE_Y - 28} r={6} fill={a.tomato} />
        </G>
      </G>
      <Bubble x={470} y={206 + Math.sin(t * 2.5) * 6} s={lerp(two, 0.2, 1.4)} tone="amber">
        <text x={0} y={22} textAnchor="middle" fontFamily={theme.fonts.en} fontWeight={800} fontSize={64} fill={c.white}>
          2
        </text>
      </Bubble>
    </g>
  );
};

export const ILLUSTRATIONS: Record<IllustrationId, React.FC> = {
  "ask-bill": AskBill,
  "my-order": MyOrder,
  "no-order": NoOrder,
  "cold-food": ColdFood,
  "extra-bread": ExtraBread,
  "missing-spoon": MissingSpoon,
  "pack-leftover": PackLeftover,
  takeaway: Takeaway,
  "reserved-table": ReservedTable,
  "table-for-two": TableForTwo,
};

/** Thumbnail / intro hero uses the same art kit */
export const HeroTableScene: React.FC = () => {
  const { frame, t, idle } = useAnim();
  return (
    <g>
      <Room />
      <Person x={230} y={455} armR={12} mouth="smile" look={0.6} bob={idle(3) * 2} blink={useBlink(frame)} />
      <Table {...TABLE} />
      <Plate x={400} y={PLANE_Y} rx={120} food="meal" />
      <Steam x={400} y={PLANE_Y - 44} frame={frame} />
      <G x={590} y={312 + idle(2.6) * 5} s={0.8} rot={8}>
        <Receipt />
      </G>
      <G x={660} y={392} s={0.62}>
        <Bag swing={Math.sin(t * 3) * 4} />
      </G>
      <Person x={830} y={470} legs shirt={a.waiterShirt} apron hairStyle="cap" skin={a.skin2} armL={12} look={-0.8} blink={useBlink(frame, 40)} />
    </g>
  );
};
