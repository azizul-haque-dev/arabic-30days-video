import React from "react";
import { ease, idle, sec, springIn } from "../lib/anim";
import { theme } from "../theme";
import {
  ARM_DOWN,
  Arm,
  Badge,
  Bag,
  Basket,
  Bread,
  Chair,
  Clock,
  Counter,
  Fork,
  G,
  Glass,
  Knife,
  Person,
  Plate,
  QuestionBubble,
  Receipt,
  Sign,
  Snowflake,
  Spoon,
  Stage,
  Steam,
  Table,
  TakeBox,
} from "./primitives";

const A = theme.art;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mixArm = (a: Arm, b: Arm, t: number): Arm => ({
  ex: lerp(a.ex, b.ex, t),
  ey: lerp(a.ey, b.ey, t),
  hx: lerp(a.hx, b.hx, t),
  hy: lerp(a.hy, b.hy, t),
  finger: b.finger && t > 0.5,
});

export interface SceneProps {
  frame: number;
  fps: number;
}

const useE = ({ frame, fps }: SceneProps) => (delaySec: number, preset: keyof typeof theme.springs = "soft") =>
  springIn(frame, fps, sec(delaySec, fps), preset);

const TABLE_X = 470;
const TABLE_Y = 420;
const CUST = { x: 250, y: 300 };
const WAIT = { x: 790, y: 280 };

/** 161 - customer asks for the bill, waiter brings the receipt. */
export const BillScene: React.FC<SceneProps> = (p) => {
  const e = useE(p);
  const { frame, fps } = p;
  const table = e(0.05);
  const cust = e(0.2);
  const wait = e(0.45);
  const hand = e(0.7);
  const rec = e(1.1, "gentle");
  const bob = idle(frame, fps, 3.4) * 3;
  const raise: Arm = { ex: 74, ey: -6, hx: 70, hy: -92 };
  return (
    <Stage>
      <Person x={CUST.x} y={CUST.y} role="customer" shirt={A.shirtBlue} hair={A.hairDark} dir={1} torsoLen={130} opacity={cust} bob={bob} talk={hand > 0.8 ? 0.5 + 0.5 * idle(frame, fps, 0.7) : 0} armR={mixArm(ARM_DOWN(1), raise, hand)} />
      <G x={0} y={lerp(30, 0, table)} opacity={table}>
        <Table cx={TABLE_X} topY={TABLE_Y} w={440} />
        <Plate cx={380} baseY={TABLE_Y + 2} r={76} food="crumbs" />
        <Plate cx={560} baseY={TABLE_Y + 2} r={76} food="crumbs" />
        <Glass x={470} baseY={TABLE_Y} />
      </G>
      <Person x={lerp(WAIT.x + 50, WAIT.x, wait)} y={WAIT.y} role="waiter" skin={A.skinB} dir={-1} legs opacity={wait} bob={-bob * 0.5} armL={{ ex: -64, ey: 60, hx: -104, hy: 104 }} />
      <Receipt x={lerp(WAIT.x - 110 + 50 * (1 - wait), TABLE_X, rec)} y={lerp(WAIT.y + 120, 312, rec)} rot={lerp(-10, 3, rec)} opacity={wait} w={124} h={166} />
    </Stage>
  );
};

/** 162 - customer points at their plate. */
export const OrderScene: React.FC<SceneProps> = (p) => {
  const e = useE(p);
  const { frame, fps } = p;
  const table = e(0.05);
  const plate = e(0.35);
  const cust = e(0.2);
  const point = e(0.8);
  const pulse = 0.5 + 0.5 * idle(frame, fps, 1.6);
  const pointing: Arm = { ex: 90, ey: 26, hx: 176, hy: 74, finger: true };
  return (
    <Stage>
      <Person x={CUST.x} y={CUST.y} role="customer" shirt={A.shirtGreen} hair={A.hairBrown} longHair dir={1} torsoLen={130} opacity={cust} armR={mixArm(ARM_DOWN(1), pointing, point)} talk={point > 0.8 ? 0.4 + 0.5 * idle(frame, fps, 0.8) : 0} />
      <G y={lerp(30, 0, table)} opacity={table}>
        <Table cx={TABLE_X} topY={TABLE_Y} w={440} />
        <Glass x={640} baseY={TABLE_Y} />
      </G>
      <G x={lerp(110, 0, plate)} opacity={plate}>
        <ellipse cx={TABLE_X + 18} cy={TABLE_Y - 4} rx={118 + 14 * pulse} ry={30 + 4 * pulse} fill="none" stroke={theme.colors.accent} strokeWidth={6} opacity={0.35 + 0.5 * (1 - pulse)} />
        <Plate cx={TABLE_X + 18} baseY={TABLE_Y + 2} r={98} food="meal" />
        <Steam cx={TABLE_X + 18} baseY={TABLE_Y - 58} frame={frame} fps={fps} strength={plate} />
      </G>
    </Stage>
  );
};

/** 163 - order has not arrived. */
export const LateOrderScene: React.FC<SceneProps> = (p) => {
  const e = useE(p);
  const { frame, fps } = p;
  const table = e(0.05);
  const cust = e(0.2);
  const clock = e(0.5, "snappy");
  const wait = e(0.8);
  const talk = idle(frame, fps, 0.8) * 0.5 + 0.5;
  return (
    <Stage>
      <Person x={CUST.x} y={CUST.y} role="customer" shirt={A.shirtBlue} hair={A.hairDark} dir={1} torsoLen={130} opacity={cust} talk={wait > 0.7 ? talk : 0} armR={mixArm(ARM_DOWN(1), { ex: 70, ey: 40, hx: 120, hy: 4 }, wait)} />
      <G y={lerp(30, 0, table)} opacity={table}>
        <Table cx={TABLE_X} topY={TABLE_Y} w={440} />
        <Plate cx={TABLE_X} baseY={TABLE_Y + 2} r={84} food="empty" />
        <Glass x={620} baseY={TABLE_Y} />
      </G>
      <Clock cx={520} cy={196} r={62} frame={frame} fps={fps} opacity={clock} s={lerp(0.6, 1, clock)} />
      <Person x={lerp(WAIT.x + 50, WAIT.x, wait)} y={WAIT.y} role="waiter" skin={A.skinB} dir={-1} legs opacity={wait} armL={mixArm(ARM_DOWN(-1), { ex: -62, ey: 0, hx: -70, hy: -84 }, wait)} bob={Math.sin((frame / fps) * 2) * 3} />
    </Stage>
  );
};

/** 164 - the food is cold (no steam, cold indicator). */
export const ColdFoodScene: React.FC<SceneProps> = (p) => {
  const e = useE(p);
  const { frame, fps } = p;
  const table = e(0.05);
  const plate = e(0.3);
  const cust = e(0.2);
  const badge = e(0.85, "snappy");
  const ghost = e(0.7);
  const shiver = idle(frame, fps, 0.35) * 2 * badge;
  return (
    <Stage>
      <Person x={CUST.x - 20} y={CUST.y} role="customer" shirt={A.shirtGreen} hair={A.hairBrown} longHair dir={1} torsoLen={130} opacity={cust} armR={mixArm(ARM_DOWN(1), { ex: 80, ey: 30, hx: 150, hy: 70, finger: true }, e(0.6))} />
      <G y={lerp(30, 0, table)} opacity={table}>
        <Table cx={TABLE_X} topY={TABLE_Y} w={440} />
      </G>
      <G opacity={plate} s={lerp(0.7, 1, plate)} x={TABLE_X * (1 - lerp(0.7, 1, plate))} y={(TABLE_Y + 2) * (1 - lerp(0.7, 1, plate))}>
        <Plate cx={TABLE_X + 40} baseY={TABLE_Y + 2} r={104} food="meal" />
      </G>
      {/* "no steam": dashed ghost curls fading away + a cross */}
      <g data-lignore="true" style={{ opacity: 0.55 * ghost }}>
        {[-40, 0, 40].map((dx) => (
          <path key={dx} d={`M ${TABLE_X + 40 + dx} ${TABLE_Y - 56} C ${TABLE_X + 24 + dx} ${TABLE_Y - 84}, ${TABLE_X + 56 + dx} ${TABLE_Y - 110}, ${TABLE_X + 40 + dx} ${TABLE_Y - 138}`} stroke={A.ghost} strokeWidth={7} strokeLinecap="round" strokeDasharray="4 14" fill="none" />
        ))}
      </g>
      <G x={730 + shiver} y={206} opacity={badge} s={lerp(0.5, 1, badge)}>
        <circle r={74} fill={A.ice} />
        <circle r={74} fill="none" stroke={A.iceDeep} strokeWidth={6} />
        <Snowflake cx={0} cy={0} r={44} rot={idle(frame, fps, 6) * 10} />
      </G>
      <Snowflake cx={TABLE_X - 62} cy={TABLE_Y - 92} r={20} rot={20} opacity={badge * 0.8} />
      <Snowflake cx={TABLE_X + 160} cy={TABLE_Y - 70} r={16} rot={-10} opacity={badge * 0.8} />
    </Stage>
  );
};

/** 165 - extra bread. */
export const BreadScene: React.FC<SceneProps> = (p) => {
  const e = useE(p);
  const { frame, fps } = p;
  const table = e(0.05);
  const basket = e(0.3, "snappy");
  const cust = e(0.2);
  const ask = e(0.7);
  const wait = e(0.9);
  const more = e(1.2);
  return (
    <Stage>
      <Person x={CUST.x} y={CUST.y} role="customer" shirt={A.shirtBlue} hair={A.hairDark} dir={1} torsoLen={130} opacity={cust} armR={mixArm(ARM_DOWN(1), { ex: 74, ey: -6, hx: 70, hy: -92 }, ask)} talk={ask > 0.8 ? 0.4 + 0.5 * idle(frame, fps, 0.8) : 0} />
      <G y={lerp(30, 0, table)} opacity={table}>
        <Table cx={TABLE_X} topY={TABLE_Y} w={440} />
      </G>
      <G opacity={basket} y={lerp(-60, 0, basket)}>
        <Basket cx={380} baseY={TABLE_Y + 2} w={200} />
        <Bread cx={344} cy={TABLE_Y - 78} r={34} rot={-8} />
        <Bread cx={404} cy={TABLE_Y - 80} r={34} rot={6} />
      </G>
      <Person x={lerp(WAIT.x + 50, WAIT.x, wait)} y={WAIT.y} role="waiter" skin={A.skinB} dir={-1} legs opacity={wait} armL={mixArm(ARM_DOWN(-1), { ex: -74, ey: 50, hx: -120, hy: 96 }, wait)} />
      <G x={lerp(140, 0, more)} opacity={more}>
        <Plate cx={600} baseY={TABLE_Y + 2} r={66} food="empty" />
        <Bread cx={600} cy={TABLE_Y - 14} r={42} />
        <Bread cx={600} cy={TABLE_Y - 34} r={38} rot={4} />
        <Bread cx={600} cy={TABLE_Y - 54} r={34} rot={-4} />
      </G>
    </Stage>
  );
};

/** 166 - missing spoon (top-down table setting). */
export const MissingSpoonScene: React.FC<SceneProps> = (p) => {
  const e = useE(p);
  const { frame, fps } = p;
  const table = e(0.05);
  const setting = e(0.35);
  const ghost = e(0.9);
  const pulse = 0.5 + 0.5 * idle(frame, fps, 1.5);
  return (
    <Stage>
      <G opacity={table} s={lerp(0.92, 1, table)} x={470 * (1 - lerp(0.92, 1, table))} y={340 * (1 - lerp(0.92, 1, table))}>
        <rect x={90} y={96} width={760} height={488} rx={44} fill={A.tableTop} />
        <rect x={112} y={118} width={716} height={444} rx={30} fill={A.cloth} />
        <rect x={128} y={134} width={684} height={412} rx={22} fill={A.clothShade} opacity={0.6} />
      </G>
      <G opacity={setting} y={lerp(24, 0, setting)}>
        <circle cx={470} cy={340} r={134} fill={A.plateShade} />
        <circle cx={470} cy={336} r={134} fill={A.plate} />
        <circle cx={470} cy={336} r={96} fill={A.plateRim} />
        <circle cx={470} cy={336} r={52} fill={A.plate} opacity={0.8} />
        <rect x={236} y={232} width={74} height={216} rx={10} fill={theme.colors.primarySoft} />
        <Fork x={273} y={312} />
        <Knife x={668} y={290} />
        <circle cx={740} cy={196} r={40} fill={A.water} opacity={0.9} />
        <circle cx={740} cy={196} r={26} fill={A.ice} opacity={0.7} />
      </G>
      <G opacity={ghost}>
        <Spoon x={740} y={312} ghost />
        <circle cx={740} cy={330} r={78 + 8 * pulse} fill="none" stroke={theme.colors.accent} strokeWidth={6} opacity={0.35 + 0.5 * (1 - pulse)} />
      </G>
    </Stage>
  );
};

/** 167 - pack the leftovers. */
export const LeftoversScene: React.FC<SceneProps> = (p) => {
  const e = useE(p);
  const { frame, fps } = p;
  const table = e(0.05);
  const cust = e(0.2);
  const wait = e(0.5);
  const box = e(0.7, "snappy");
  const pieces = [
    { dx: -22, color: A.rice, ry: 12, rx: 26, delay: 1.3 },
    { dx: 26, color: A.meat, ry: 12, rx: 24, delay: 1.55 },
    { dx: 2, color: A.veg, ry: 10, rx: 14, delay: 1.8 },
  ];
  const lid = ease(frame, [sec(2.5, p.fps), sec(3.1, p.fps)], [0, 1], theme.easings.inOut);
  const BOX_X = 600;
  const PLATE_X = 360;
  return (
    <Stage>
      <Person x={CUST.x - 30} y={CUST.y} role="customer" shirt={A.shirtGreen} hair={A.hairBrown} longHair dir={1} torsoLen={130} opacity={cust} />
      <G y={lerp(30, 0, table)} opacity={table}>
        <Table cx={TABLE_X + 10} topY={TABLE_Y} w={500} />
        <Plate cx={PLATE_X} baseY={TABLE_Y + 2} r={80} food="crumbs" />
      </G>
      <G opacity={box} y={lerp(-50, 0, box)}>
        <TakeBox cx={BOX_X} baseY={TABLE_Y + 2} w={190} lid={lid} />
      </G>
      {pieces.map((pc, i) => {
        const t = ease(frame, [sec(pc.delay, fps), sec(pc.delay + 0.9, fps)], [0, 1], theme.easings.inOut);
        const x = lerp(PLATE_X + pc.dx, BOX_X + (i - 1) * 26, t);
        const y = lerp(TABLE_Y - 12, TABLE_Y - 20, t) - 120 * Math.sin(Math.PI * t);
        return <ellipse key={i} cx={x} cy={y} rx={pc.rx} ry={pc.ry} fill={pc.color} style={{ opacity: table }} />;
      })}
      <Person x={lerp(WAIT.x + 70, WAIT.x + 20, wait)} y={WAIT.y} role="waiter" skin={A.skinB} dir={-1} legs opacity={wait} armL={mixArm(ARM_DOWN(-1), { ex: -70, ey: 30, hx: -126, hy: 8 }, wait)} />
    </Stage>
  );
};

/** 168 - takeaway bag at the counter. */
export const TakeawayScene: React.FC<SceneProps> = (p) => {
  const e = useE(p);
  const { frame, fps } = p;
  const counter = e(0.05);
  const wait = e(0.25);
  const bag = e(0.7, "gentle");
  const cust = e(0.5);
  const reach = e(1.0);
  const swing = idle(frame, fps, 1.8) * 4 * bag;
  const t = ease(frame, [sec(1.3, fps), sec(2.4, fps)], [0, 1], theme.easings.inOut);
  const bx = lerp(330, 604, t);
  const by = lerp(TABLE_Y, 548, t) - 40 * Math.sin(Math.PI * t);
  return (
    <Stage>
      <Person x={250} y={290} role="waiter" skin={A.skinB} dir={1} torsoLen={130} opacity={wait} talk={0} />
      <G y={lerp(30, 0, counter)} opacity={counter}>
        <Counter x={96} topY={TABLE_Y} w={420} h={150} />
      </G>
      <Person x={770} y={284} role="customer" shirt={A.shirtBlue} hair={A.hairDark} dir={-1} legs opacity={cust} armL={mixArm(ARM_DOWN(-1), { ex: -96, ey: 34, hx: -166, hy: 96 }, reach)} />
      <Bag x={bx} y={by} w={100} h={118} swing={t > 0.95 ? swing : 0} opacity={bag} />
    </Stage>
  );
};

/** 169 - is this table reserved? */
export const ReservedScene: React.FC<SceneProps> = (p) => {
  const e = useE(p);
  const { frame, fps } = p;
  const table = e(0.05);
  const cust = e(0.2);
  const sign = e(0.6, "snappy");
  const q = e(1.0, "snappy");
  const wait = e(0.8);
  return (
    <Stage>
      <Person x={CUST.x - 10} y={CUST.y} role="customer" shirt={A.shirtGreen} hair={A.hairBrown} longHair dir={1} torsoLen={130} opacity={cust} talk={q > 0.8 ? 0.4 + 0.5 * idle(frame, fps, 0.8) : 0} armR={mixArm(ARM_DOWN(1), { ex: 70, ey: 40, hx: 120, hy: 4 }, q)} />
      <G y={lerp(30, 0, table)} opacity={table}>
        <Table cx={TABLE_X + 20} topY={TABLE_Y} w={440} />
      </G>
      <Sign cx={TABLE_X + 20} baseY={lerp(TABLE_Y - 220, TABLE_Y - 2, sign)} opacity={sign} />
      <QuestionBubble cx={lerp(380, 400, q)} cy={150} opacity={q} s={lerp(0.4, 1, q)} rot={idle(frame, fps, 2.2) * 5} />
      <Person x={lerp(WAIT.x + 50, WAIT.x, wait)} y={WAIT.y} role="waiter" skin={A.skinB} dir={-1} legs opacity={wait} armL={mixArm(ARM_DOWN(-1), { ex: -76, ey: 40, hx: -130, hy: 40 }, wait)} />
    </Stage>
  );
};

/** 170 - a table for two. */
export const TableTwoScene: React.FC<SceneProps> = (p) => {
  const e = useE(p);
  const { frame, fps } = p;
  const table = e(0.1);
  const chairs = e(0.4);
  const two = e(1.0, "snappy");
  const bob = idle(frame, fps, 2.6) * 4;
  return (
    <Stage>
      <G x={lerp(-60, 0, chairs)} opacity={chairs}>
        <Chair x={196} baseY={578} dir={1} />
      </G>
      <G x={lerp(60, 0, chairs)} opacity={chairs}>
        <Chair x={744} baseY={578} dir={-1} />
      </G>
      <G opacity={table} s={lerp(0.75, 1, table)} x={TABLE_X * (1 - lerp(0.75, 1, table))} y={500 * (1 - lerp(0.75, 1, table))}>
        <Table cx={TABLE_X} topY={TABLE_Y + 30} w={420} legH={120} />
        <Plate cx={380} baseY={TABLE_Y + 32} r={60} food="empty" />
        <Plate cx={560} baseY={TABLE_Y + 32} r={60} food="empty" />
        <Glass x={470} baseY={TABLE_Y + 30} />
      </G>
      <Badge cx={TABLE_X} cy={168 + bob} r={72} label="2" size={96} opacity={two} s={lerp(0.4, 1, two)} />
    </Stage>
  );
};

/** Intro beat 5 - generic restaurant. */
export const RestaurantScene: React.FC<SceneProps> = (p) => {
  const e = useE(p);
  const { frame, fps } = p;
  const table = e(0.05);
  const cust = e(0.25);
  const wait = e(0.45);
  const lamp = e(0.1);
  const bob = idle(frame, fps, 3.2) * 3;
  return (
    <Stage>
      <G opacity={lamp} y={lerp(-30, 0, lamp)}>
        <rect x={TABLE_X - 3} y={40} width={6} height={74} fill={A.metalDark} />
        <path d={`M ${TABLE_X - 62} 168 Q ${TABLE_X} 90 ${TABLE_X + 62} 168 Z`} fill={theme.colors.accent} />
      </G>
      <Person x={CUST.x} y={CUST.y} role="customer" shirt={A.shirtBlue} hair={A.hairDark} dir={1} torsoLen={130} opacity={cust} bob={bob} />
      <G y={lerp(30, 0, table)} opacity={table}>
        <Table cx={TABLE_X} topY={TABLE_Y} w={440} />
        <Plate cx={TABLE_X} baseY={TABLE_Y + 2} r={86} food="meal" />
        <Glass x={620} baseY={TABLE_Y} />
        <Glass x={330} baseY={TABLE_Y} />
      </G>
      <Steam cx={TABLE_X} baseY={TABLE_Y - 56} frame={frame} fps={fps} strength={table} />
      <Person x={lerp(WAIT.x + 50, WAIT.x, wait)} y={WAIT.y} role="waiter" skin={A.skinB} dir={-1} legs opacity={wait} bob={-bob} armL={{ ex: -70, ey: 36, hx: -122, hy: 70 }} />
    </Stage>
  );
};

/** Thumbnail hero art: table, food plate, waiter, bill receipt, takeaway package. */
export const ThumbnailScene: React.FC<SceneProps> = (p) => {
  const { frame, fps } = p;
  const bob = idle(frame, fps, 3.4) * 4;
  return (
    <Stage>
      <Person x={168} y={282} role="waiter" skin={A.skinB} dir={1} legs bob={bob} armR={{ ex: 76, ey: 6, hx: 108, hy: -72 }} armL={{ ex: -58, ey: 70, hx: -58, hy: 138 }} />
      <Plate cx={330} baseY={214} r={70} food="meal" />
      <Table cx={540} topY={TABLE_Y} w={460} />
      <Plate cx={440} baseY={TABLE_Y + 2} r={80} food="meal" />
      <Steam cx={440} baseY={TABLE_Y - 50} frame={frame} fps={fps} />
      <Glass x={640} baseY={TABLE_Y} />
      <Receipt x={724} y={286} rot={8} w={120} h={156} />
      <Bag x={846} y={566} w={96} h={118} />
    </Stage>
  );
};
