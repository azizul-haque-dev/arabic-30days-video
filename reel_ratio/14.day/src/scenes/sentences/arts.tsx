import React from "react";
import { theme } from "../../config/theme";
import type { ArtProps } from "../../components/SentenceScene";
import { Art } from "../../components/layout";
import { Arrow, Block, Bubble, CarTop, ClockFace, DestFlag, MapBackdrop, Palm, Passenger, Pin, QuestionMark, SignBoard, TaxiRear, TaxiSide, TaxiTop } from "../../components/art";
import { arc, curve, line, P, Route } from "../../utils/route";
import { breathe, eased, enter, sec } from "../../utils/motion";

const c = theme.colors;
const E = theme.easings;

const dashLine = (x1: number, y1: number, x2: number, y2: number, color = c.white, w = 8) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeDasharray="34 30" strokeLinecap="round" opacity={0.9} />
);

/** Progressive stroke draw using pathLength normalisation. */
const Trail: React.FC<{ d: string; p: number; color?: string; w?: number; dash?: string }> = ({ d, p, color = c.green, w = 14, dash }) => (
  <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" pathLength={1} strokeDasharray={dash ?? `${Math.max(p, 0.0001)} 2`} opacity={0.95} />
);

/* ------------------------------------------------------------------ 131 */
const rightRoute = new Route([line(P(520, 980), P(520, 560)), arc(P(520, 560), P(590, 490), P(590, 560)), line(P(590, 490), P(990, 490))]);

export const TurnRightArt: React.FC<ArtProps> = ({ frame, fps, w, h }) => {
  const u = eased(frame, sec(0.6, fps), sec(4.6, fps), 0, 1, E.inOut);
  const t = rightRoute.at(u);
  const near = u > 0.5 && u < 0.92 ? 1 : 0;
  const blink = near * (Math.floor(frame / 6) % 2 === 0 ? 1 : 0.15);
  const zoom = 1 + eased(frame, 0, sec(6, fps), 0, 0.07, E.soft);
  const sign = enter(frame, fps, sec(0.35, fps), "pop");
  return (
    <g transform={`translate(${w / 2} ${h / 2}) scale(${zoom}) translate(${-w / 2} ${-h / 2})`}>
      <rect width={w} height={h} fill={c.grass} />
      <Block x={30} y={40} w={310} h={270} />
      <Block x={30} y={600} w={310} h={240} tone="b" />
      <Block x={620} y={40} w={290} h={250} tone="b" />
      <Block x={640} y={600} w={270} h={240} />
      <rect x={360} y={-40} width={220} height={h + 80} fill={c.road} />
      <rect x={-40} y={330} width={w + 80} height={220} fill={c.road} />
      {dashLine(470, -20, 470, 320)}
      {dashLine(470, 560, 470, h + 20)}
      {dashLine(-20, 440, 350, 440)}
      {dashLine(590, 440, w + 20, 440)}
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={372 + i * 42} y={566} width={26} height={44} rx={5} fill={c.white} opacity={0.85} />)}
      <Palm x={110} y={360} s={0.8} sway={breathe(frame, fps, 4, 3)} />
      <Palm x={880} y={580} s={0.8} sway={breathe(frame, fps, 4, 3, 1)} />
      <Trail d={rightRoute.d} p={eased(frame, sec(0.4, fps), sec(3.2, fps), 0, 1, E.out)} color={c.green} w={12} dash={`${eased(frame, sec(0.4, fps), sec(3.2, fps), 0, 1, E.out)} 2`} />
      <Art id="sign-right">
        <SignBoard x={650} y={330} dir="right" s={0.9 + 0.1 * sign} sway={breathe(frame, fps, 1.2, 3)} />
      </Art>
      <Art id="taxi">
        <TaxiTop x={t.x} y={t.y} rot={t.angle} blinkR={blink} />
      </Art>
    </g>
  );
};

/* ------------------------------------------------------------------ 132 */
const leftRoute = new Route([line(P(700, 1010), P(700, 380)), arc(P(700, 380), P(570, 250), P(570, 380)), line(P(570, 250), P(-80, 250))]);

export const TurnLeftArt: React.FC<ArtProps> = ({ frame, fps, w, h }) => {
  const u = eased(frame, sec(0.7, fps), sec(5.6, fps), 0, 1, E.inOut);
  const t = leftRoute.at(u);
  const near = u > 0.42 && u < 0.78 ? 1 : 0;
  const blink = near * (Math.floor(frame / 6) % 2 === 0 ? 1 : 0.15);
  const rot = -7 + eased(frame, 0, sec(7, fps), 0, 4, E.soft);
  const sign = enter(frame, fps, sec(0.35, fps), "pop");
  return (
    <g transform={`translate(${w / 2} ${h / 2}) rotate(${rot}) scale(1.14) translate(${-w / 2} ${-h / 2})`}>
      <rect x={-200} y={-200} width={w + 400} height={h + 400} fill={c.grass} />
      <Block x={-120} y={-130} w={360} h={250} tone="b" />
      <Block x={280} y={-130} w={520} h={250} />
      <Block x={880} y={-130} w={300} h={250} tone="b" />
      <Block x={-120} y={440} w={560} h={520} />
      <Block x={840} y={440} w={300} h={520} tone="b" />
      <rect x={-200} y={140} width={w + 400} height={220} fill={c.road} />
      <rect x={590} y={340} width={220} height={h + 300} fill={c.road} />
      {dashLine(-180, 250, 570, 250, c.white, 8)}
      {dashLine(830, 250, 1140, 250, c.white, 8)}
      {dashLine(700, 560, 700, h + 200, c.white, 8)}
      <rect x={604} y={352} width={192} height={14} fill={c.white} opacity={0.8} />
      <Palm x={150} y={410} s={0.8} sway={breathe(frame, fps, 4, 3)} />
      <Palm x={500} y={450} s={0.7} sway={breathe(frame, fps, 4, 3, 2)} />
      <Trail d={leftRoute.d} p={0} color={c.green} w={12} dash={`${eased(frame, sec(0.5, fps), sec(3.4, fps), 0, 1, E.out)} 2`} />
      <Art id="sign-left">
        <SignBoard x={470} y={700} dir="left" s={0.95 + 0.1 * sign} sway={breathe(frame, fps, 1.2, 3)} />
      </Art>
      <Art id="taxi">
        <TaxiTop x={t.x} y={t.y} rot={t.angle} blinkL={blink} />
      </Art>
    </g>
  );
};

/* ------------------------------------------------------------------ 133 */
export const GoStraightArt: React.FC<ArtProps> = ({ frame, fps, w, h }) => {
  const horizon = 250;
  const cx = w / 2;
  const speed = (frame / fps) * 0.55;
  const N = 9;
  const yAt = (z: number) => horizon + (h - horizon) * Math.pow(z, 1.9);
  const halfRoad = (z: number) => 26 + (w * 0.46 - 26) * Math.pow(z, 1.9);
  const move = eased(frame, sec(0.3, fps), sec(6, fps), 0, 1, E.inOut);
  return (
    <g>
      <defs>
        <linearGradient id="sky133" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.greenMist} />
          <stop offset="1" stopColor={c.amberSoft} />
        </linearGradient>
      </defs>
      <rect width={w} height={horizon + 4} fill="url(#sky133)" />
      <circle cx={cx + 210} cy={150} r={64} fill={c.amber} opacity={0.85} />
      {[[60, 70], [170, 110], [290, 80], [610, 96], [720, 60], [820, 118]].map(([x, hh], i) => (
        <rect key={i} x={x} y={horizon - hh - 30} width={64} height={hh + 34} rx={10} fill={c.greenSoft} />
      ))}
      <rect y={horizon} width={w} height={h - horizon} fill={c.grass} />
      <path d={`M${cx - 26} ${horizon} L${cx + 26} ${horizon} L${cx + w * 0.46} ${h} L${cx - w * 0.46} ${h} Z`} fill={c.road} />
      <path d={`M${cx - 26} ${horizon} L${cx - w * 0.46} ${h}`} stroke={c.white} strokeWidth={6} />
      <path d={`M${cx + 26} ${horizon} L${cx + w * 0.46} ${h}`} stroke={c.white} strokeWidth={6} />
      {Array.from({ length: N }).map((_, k) => {
        const z = ((k + speed) % N) / N;
        const y = yAt(z);
        const sc = 0.12 + z * 1.15;
        return <rect key={`d${k}`} x={cx - 9 * sc} y={y - 36 * sc} width={18 * sc} height={72 * sc} rx={4 * sc} fill={c.white} opacity={Math.min(1, z * 6)} />;
      })}
      {Array.from({ length: 6 }).map((_, k) => {
        const z = ((k + speed * 0.67) % 6) / 6;
        const y = yAt(z) + 10;
        const sc = 0.14 + z * 1.0;
        const off = halfRoad(z) + 70 * sc + 20;
        return (
          <g key={`p${k}`} opacity={Math.min(1, z * 6)}>
            <Palm x={cx - off} y={y - 90 * sc} s={sc * 1.1} sway={breathe(frame, fps, 3, 3, k)} />
            <Palm x={cx + off} y={y - 90 * sc} s={sc * 1.1} sway={breathe(frame, fps, 3, 3, k + 2)} />
          </g>
        );
      })}
      {[0, 1, 2].map((i) => {
        const prog = (frame / fps) * 0.9 - i * 0.28;
        const f = prog - Math.floor(prog);
        const yy = 600 - f * 260;
        return (
          <g key={`c${i}`} transform={`translate(${cx} ${yy})`} opacity={Math.sin(f * Math.PI)}>
            <Arrow dir="up" s={1.1 - f * 0.45} fill={c.amber} />
          </g>
        );
      })}
      <Art id="taxi">
        <TaxiRear x={cx} y={h - 46 - move * 50} s={1.15 - move * 0.12} />
      </Art>
    </g>
  );
};

/* ------------------------------------------------------------------ 134 */
export const NearbyArt: React.FC<ArtProps> = ({ frame, fps, w, h }) => {
  const zoom = 1.18 + eased(frame, 0, sec(7, fps), 0, 0.06, E.soft);
  const drop1 = (1 - Math.min(enter(frame, fps, sec(0.4, fps), "pop"), 1)) * 120;
  const drop2 = (1 - Math.min(enter(frame, fps, sec(0.9, fps), "pop"), 1)) * 120;
  const pulse = ((frame / fps) % 1.4) / 1.4;
  const route = new Route([curve(P(290, 520), P(360, 420), P(470, 600), P(600, 470))]);
  const p = eased(frame, sec(1.3, fps), sec(2.6, fps), 0, 1, E.out);
  const m = eased(frame, sec(1.4, fps), sec(2.2, fps), 0, 1, E.out);
  return (
    <g>
      <MapBackdrop w={w} h={h} zoom={zoom} shift={-30} />
      <path d={route.d} fill="none" stroke={c.muted} strokeWidth={10} strokeLinecap="round" strokeDasharray="2 22" opacity={0.7} />
      <Trail d={route.d} p={p} color={c.green} w={12} dash={`${p} 2`} />
      <g opacity={m}>
        <line x1={290} y1={680} x2={600} y2={680} stroke={c.text} strokeWidth={6} strokeLinecap="round" />
        <line x1={290} y1={662} x2={290} y2={698} stroke={c.text} strokeWidth={6} strokeLinecap="round" />
        <line x1={600} y1={662} x2={600} y2={698} stroke={c.text} strokeWidth={6} strokeLinecap="round" />
        <path d="M312 680 l18 -12 v24 Z M578 680 l-18 -12 v24 Z" fill={c.text} />
      </g>
      <Art id="pin-here"><Pin x={290} y={520} s={1.5} pulse={pulse} drop={drop1} /></Art>
      <Art id="flag-near"><DestFlag x={600} y={470} s={1.6} drop={drop2} /></Art>
    </g>
  );
};

/* ------------------------------------------------------------------ 135 */
const farRoute = new Route([
  curve(P(130, 760), P(130, 560), P(420, 640), P(400, 470)),
  curve(P(400, 470), P(380, 300), P(180, 330), P(280, 190)),
  curve(P(280, 190), P(380, 70), P(720, 190), P(800, 110)),
]);

export const FarAwayArt: React.FC<ArtProps> = ({ frame, fps, w, h }) => {
  const p = eased(frame, sec(0.5, fps), sec(6.2, fps), 0, 1, E.inOut);
  const pos = farRoute.at(p);
  const zoom = 0.9 + eased(frame, 0, sec(7, fps), 0, 0.05, E.soft);
  const d1 = (1 - Math.min(enter(frame, fps, sec(0.3, fps), "pop"), 1)) * 100;
  const d2 = (1 - Math.min(enter(frame, fps, sec(0.7, fps), "pop"), 1)) * 100;
  return (
    <g>
      <MapBackdrop w={w} h={h} zoom={zoom} shift={20} />
      <path d={farRoute.d} fill="none" stroke={c.muted} strokeWidth={8} strokeLinecap="round" strokeDasharray="2 20" opacity={0.65} />
      <Trail d={farRoute.d} p={p} color={c.green} w={12} dash={`${p} 2`} />
      <Art id="pin-start"><Pin x={130} y={760} s={1.0} drop={d1} /></Art>
      <Art id="flag-far"><DestFlag x={800} y={110} s={1.1} drop={d2} /></Art>
      <Art id="moving-dot">
        <circle cx={pos.x} cy={pos.y} r={18} fill={c.amber} stroke={c.white} strokeWidth={6} />
      </Art>
      <g opacity={eased(frame, sec(1, fps), sec(1.8, fps))}>
        <line x1={150} y1={840} x2={790} y2={840} stroke={c.text} strokeWidth={6} strokeLinecap="round" />
        <line x1={150} y1={822} x2={150} y2={858} stroke={c.text} strokeWidth={6} strokeLinecap="round" />
        <line x1={790} y1={822} x2={790} y2={858} stroke={c.text} strokeWidth={6} strokeLinecap="round" />
        {[1, 2, 3, 4, 5, 6, 7].map((i) => <line key={i} x1={150 + i * 80} y1={830} x2={150 + i * 80} y2={850} stroke={c.text} strokeWidth={4} />)}
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ 136 */
export const HowFarArt: React.FC<ArtProps> = ({ frame, fps, w, h }) => {
  const bubble = Math.min(enter(frame, fps, sec(1.0, fps), "pop"), 1.1);
  const grow = eased(frame, sec(2.2, fps), sec(5.2, fps), 0, 1, E.inOut);
  const roll = frame * 5;
  const x1 = 150;
  const x2 = 150 + 640 * grow;
  const ticks = Math.floor(grow * 8);
  return (
    <g>
      <rect width={w} height={h} fill={c.greenMist} />
      <rect y={520} width={w} height={160} fill={c.road} />
      {dashLine(0, 600, w, 600)}
      <rect y={680} width={w} height={200} fill={c.grass} />
      <Palm x={80} y={470} s={0.8} sway={breathe(frame, fps, 4, 3)} />
      <Palm x={870} y={470} s={0.8} sway={breathe(frame, fps, 4, 3, 1)} />
      <Art id="taxi"><TaxiSide x={470 + breathe(frame, fps, 3, 2)} y={600} s={1.35} wheel={roll} passenger /></Art>
      <g transform={`translate(${470 - 30} ${200}) scale(${bubble})`} opacity={Math.min(1, bubble)}>
        <Art id="speech-bubble">
          <Bubble x={0} y={0} w={190} h={150}>
            <QuestionMark x={0} y={0} s={1.15} color={c.green} />
          </Bubble>
        </Art>
      </g>
      <Art id="pin-start"><Pin x={x1} y={800} s={0.9} /></Art>
      <line x1={x1} y1={750} x2={x2} y2={750} stroke={c.green} strokeWidth={10} strokeLinecap="round" />
      {Array.from({ length: ticks + 1 }).map((_, i) => <line key={i} x1={x1 + i * 80} y1={738} x2={x1 + i * 80} y2={762} stroke={c.text} strokeWidth={4} />)}
      <g transform={`translate(${x2} 750)`}>
        <path d="M0 0 l-22 -14 v28 Z" fill={c.green} transform="translate(0 0)" />
      </g>
      <Art id="flag-end"><DestFlag x={820} y={800} s={0.9} /></Art>
    </g>
  );
};

/* ------------------------------------------------------------------ 137 */
export const HowLongArt: React.FC<ArtProps> = ({ frame, fps, w, h }) => {
  const t = frame / fps;
  const minute = (t * 70) % 360;
  const hour = minute / 12;
  const move = eased(frame, sec(0.6, fps), sec(6.6, fps), 0, 1, E.inOut);
  const sweep = eased(frame, sec(0.5, fps), sec(6.6, fps), 0, 1, E.inOut);
  const clock = Math.min(enter(frame, fps, sec(0.2, fps), "pop"), 1.1);
  const R = 138;
  return (
    <g>
      <rect width={w} height={h} fill={c.greenMist} />
      <g transform={`translate(${w / 2} 250) scale(${clock}) translate(${-w / 2} -250)`}>
        <Art id="clock"><ClockFace cx={w / 2} cy={250} r={R} hour={hour} minute={minute} ring={c.green} /></Art>
        <circle cx={w / 2} cy={250} r={R + 34} fill="none" stroke={c.greenSoft} strokeWidth={14} />
        <circle cx={w / 2} cy={250} r={R + 34} fill="none" stroke={c.amber} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${sweep} 2`} transform={`rotate(-90 ${w / 2} 250)`} />
      </g>
      <rect y={570} width={w} height={150} fill={c.road} />
      {dashLine(0, 645, w, 645)}
      <rect y={720} width={w} height={160} fill={c.grass} />
      <line x1={150} y1={800} x2={790} y2={800} stroke={c.greenSoft} strokeWidth={14} strokeLinecap="round" />
      <line x1={150} y1={800} x2={150 + 640 * move} y2={800} stroke={c.green} strokeWidth={14} strokeLinecap="round" />
      {[0, 0.5, 1].map((f, i) => <circle key={i} cx={150 + 640 * f} cy={800} r={18} fill={move >= f ? c.green : c.white} stroke={c.green} strokeWidth={6} />)}
      <Art id="taxi"><TaxiSide x={90 + 700 * move} y={650} s={1.0} wheel={frame * 14} /></Art>
    </g>
  );
};

/* ------------------------------------------------------------------ 138 */
export const TrafficJamArt: React.FC<ArtProps> = ({ frame, fps, w, h }) => {
  const t = frame / fps;
  const pulse = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t * 5));
  const scroll = (t * 14) % 72;
  const lanes = [250, 470, 690];
  const bodies: [string, string][] = [[c.green, c.greenSoft], [c.text, c.muted], [c.white, c.greenSoft], [c.greenDark, c.greenSoft], [c.muted, c.white]];
  const rows = 5;
  return (
    <g>
      <rect width={w} height={h} fill={c.grass} />
      <rect x={110} width={720} height={h} fill={c.road} />
      <rect x={110} width={10} height={h} fill={c.white} opacity={0.9} />
      <rect x={820} width={10} height={h} fill={c.white} opacity={0.9} />
      {[360, 580].map((x) => (
        <g key={x}>
          {Array.from({ length: 14 }).map((_, i) => (
            <rect key={i} x={x - 4} y={-72 + i * 72 + scroll} width={8} height={36} rx={3} fill={c.white} opacity={0.85} />
          ))}
        </g>
      ))}
      <Palm x={50} y={160} s={0.8} sway={breathe(frame, fps, 3, 3)} />
      <Palm x={50} y={470} s={0.8} sway={breathe(frame, fps, 3, 3, 1)} />
      <Palm x={50} y={780} s={0.8} sway={breathe(frame, fps, 3, 3, 2)} />
      <Palm x={890} y={310} s={0.8} sway={breathe(frame, fps, 3, 3, 3)} />
      <Palm x={890} y={620} s={0.8} sway={breathe(frame, fps, 3, 3, 4)} />
      {lanes.map((lx, li) =>
        Array.from({ length: rows }).map((_, r) => {
          const y = 100 + r * 168 + breathe(frame, fps, 5, 2.6, li * 1.3 + r * 0.7) + 40 * Math.sin((t * 0.35 + li) % 6.28) * 0;
          const isTaxi = (li === 1 && r === 2) || (li === 0 && r === 4);
          const enterP = Math.min(enter(frame, fps, li * 3 + r * 4, "enter"), 1);
          const bodyC = bodies[(li * 2 + r) % bodies.length];
          return (
            <g key={`${li}-${r}`} opacity={Math.min(1, enterP * 1.4)} transform={`translate(0 ${(1 - enterP) * -80})`}>
              <Art id={`car-${li}-${r}`}>
                {isTaxi ? <TaxiTop x={lx} y={y} rot={0} s={0.98} brake={pulse} /> : <CarTop x={lx} y={y} body={bodyC[0]} roof={bodyC[1]} brake={pulse} s={0.98} />}
              </Art>
            </g>
          );
        }),
      )}
    </g>
  );
};

/* ------------------------------------------------------------------ 139 */
const blockedRoute = new Route([curve(P(470, 800), P(120, 780), P(120, 360), P(300, 150)), curve(P(300, 150), P(380, 90), P(430, 100), P(470, 100))]);
const goodRoute = new Route([curve(P(470, 800), P(830, 780), P(830, 360), P(640, 150)), curve(P(640, 150), P(570, 90), P(510, 100), P(470, 100))]);
const connector = new Route([curve(P(205, 560), P(260, 600), P(420, 780), P(470, 800))]);

export const OtherRoadArt: React.FC<ArtProps> = ({ frame, fps, w, h }) => {
  const t = frame / fps;
  const toBlock = eased(frame, sec(0.5, fps), sec(2.4, fps), 0, 0.5, E.inOut);
  const back = eased(frame, sec(3.0, fps), sec(3.9, fps), 0, 1, E.inOut);
  const run = eased(frame, sec(3.9, fps), sec(7.0, fps), 0, 1, E.inOut);
  let pos: { x: number; y: number; angle: number };
  if (frame < sec(3.0, fps)) pos = blockedRoute.at(toBlock);
  else if (frame < sec(3.9, fps)) { const b = blockedRoute.at(0.5); const g = goodRoute.at(0.0); pos = { x: b.x + (g.x - b.x) * back, y: b.y + (g.y - b.y) * back, angle: back < 0.5 ? 180 : 0 }; }
  else pos = goodRoute.at(run);
  const redP = 0.6 + 0.4 * Math.sin(t * 6);
  const goodDraw = eased(frame, sec(3.0, fps), sec(7.0, fps), 0, 1, E.inOut);
  const blockedPt = blockedRoute.at(0.52);
  const d1 = (1 - Math.min(enter(frame, fps, sec(0.2, fps), "pop"), 1)) * 100;
  const d2 = (1 - Math.min(enter(frame, fps, sec(0.5, fps), "pop"), 1)) * 100;
  return (
    <g>
      <MapBackdrop w={w} h={h} zoom={1} shift={0} />
      <path d={blockedRoute.d} fill="none" stroke={c.red} strokeWidth={16} strokeLinecap="round" opacity={0.35} />
      <path d={blockedRoute.d} fill="none" stroke={c.red} strokeWidth={8} strokeLinecap="round" strokeDasharray="2 22" opacity={0.9} />
      <path d={goodRoute.d} fill="none" stroke={c.greenSoft} strokeWidth={18} strokeLinecap="round" />
      <path d={goodRoute.d} fill="none" stroke={c.green} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${goodDraw} 2`} />
      <Art id="block">
        <g transform={`translate(${blockedPt.x} ${blockedPt.y})`}>
          <circle r={44 + redP * 6} fill={c.red} opacity={0.25} />
          <circle r={34} fill={c.red} stroke={c.white} strokeWidth={6} />
          <path d="M-12 -12 L12 12 M12 -12 L-12 12" stroke={c.white} strokeWidth={9} strokeLinecap="round" />
        </g>
      </Art>
      <Art id="pin-start"><Pin x={470} y={830} s={0.95} drop={d1} /></Art>
      <Art id="flag-end"><DestFlag x={470} y={112} s={1.0} drop={d2} /></Art>
      <Art id="taxi"><TaxiTop x={pos.x} y={pos.y} rot={pos.angle} s={0.62} /></Art>
    </g>
  );
};

/* ------------------------------------------------------------------ 140 */
export const ImLateArt: React.FC<ArtProps> = ({ frame, fps, w, h }) => {
  const t = frame / fps;
  const shake = Math.sin(t * 38) * 1.6 * eased(frame, sec(0.8, fps), sec(1.2, fps));
  const minute = (t * 140) % 360;
  const ringP = (t % 0.9) / 0.9;
  const clockIn = Math.min(enter(frame, fps, sec(0.2, fps), "pop"), 1.1);
  const speed = (t * 420) % 200;
  const arm = 118 + breathe(frame, fps, 4, 0.7);
  const move = (t * 0.22) % 1;
  return (
    <g>
      <rect width={w} height={h} fill={c.greenMist} />
      <g transform={`translate(${270 + shake} 330) scale(${clockIn}) translate(-270 -330)`}>
        <circle cx={270} cy={330} r={205 + ringP * 70} fill="none" stroke={c.amber} strokeWidth={10} opacity={0.5 * (1 - ringP)} />
        <Art id="clock"><ClockFace cx={270} cy={330} r={178} hour={minute / 12} minute={minute} ring={c.amber} second={(t * 540) % 360} /></Art>
      </g>
      <Art id="passenger">
        <Passenger x={700} y={560} s={1.0} arm={arm} flip />
      </Art>
      <rect y={650} width={w} height={130} fill={c.road} />
      {dashLine(0, 715, w, 715)}
      <rect y={780} width={w} height={100} fill={c.grass} />
      {[0, 1, 2].map((i) => <line key={i} x1={-200 + ((speed + i * 90) % 400) + 30} y1={664 + i * 34} x2={-200 + ((speed + i * 90) % 400) + 130} y2={664 + i * 34} stroke={c.white} strokeWidth={5} strokeLinecap="round" opacity={0.7} />)}
      <Art id="taxi"><TaxiSide x={150 + move * 640} y={720} s={0.8} wheel={frame * 24} /></Art>
    </g>
  );
};

export const ARTS = {
  turnRight: TurnRightArt, turnLeft: TurnLeftArt, goStraight: GoStraightArt, nearby: NearbyArt, farAway: FarAwayArt,
  howFar: HowFarArt, howLong: HowLongArt, trafficJam: TrafficJamArt, otherRoad: OtherRoadArt, imLate: ImLateArt,
} as const;
