import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { ArtKey } from "../data";

const C = theme.colors;
const W = 880, H = 800;
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (fr: number, a: number, b: number, from: number, to: number, e = theme.ease.out) =>
  interpolate(fr, [a, b], [from, to], { easing: e, ...cl });

/* ---------- primitives ---------- */
const Wheel: React.FC<{ cx: number; cy: number; r: number; rot: number }> = ({ cx, cy, r, rot }) => (
  <g transform={`translate(${cx},${cy}) rotate(${rot})`}>
    <circle r={r} fill={C.ink2} />
    <circle r={r * 0.55} fill={C.glass} />
    {[0, 60, 120].map((a) => <rect key={a} x={-r * 0.5} y={-2.5} width={r} height={5} fill={C.ink2} transform={`rotate(${a})`} />)}
    <circle r={r * 0.15} fill={C.ink2} />
  </g>
);

const Person: React.FC<{ x: number; y: number; s?: number; shirt?: string; pants?: string; arm?: number; bob?: number; flip?: boolean }> =
  ({ x, y, s = 1, shirt = C.primary, pants = C.ink2, arm = 0, bob = 0, flip }) => (
    <g transform={`translate(${x},${y + bob}) scale(${flip ? -s : s},${s})`}>
      <rect x={-17} y={-70} width={14} height={70} rx={6} fill={pants} />
      <rect x={3} y={-70} width={14} height={70} rx={6} fill={pants} />
      <rect x={-26} y={-150} width={52} height={90} rx={22} fill={shirt} />
      <g transform={`translate(22,-135) rotate(${arm})`}><rect x={-7} y={0} width={14} height={62} rx={7} fill={shirt} /><circle cy={64} r={8} fill={C.skin} /></g>
      <rect x={-27} y={-135} width={14} height={62} rx={7} fill={shirt} />
      <circle cx={0} cy={-178} r={28} fill={C.skin} />
      <path d="M-29 -182 Q-26 -214 0 -212 Q28 -214 29 -182 Q14 -196 -29 -182Z" fill={C.hair} />
    </g>
  );

const Suitcase: React.FC<{ x: number; y: number; s?: number; color?: string; rot?: number }> = ({ x, y, s = 1, color = C.accent, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-8} y={-98} width={16} height={22} rx={5} fill="none" stroke={C.ink2} strokeWidth={5} />
    <rect x={-42} y={-80} width={84} height={72} rx={12} fill={color} />
    <rect x={-22} y={-80} width={8} height={72} fill="rgba(16,35,29,0.18)" />
    <rect x={14} y={-80} width={8} height={72} fill="rgba(16,35,29,0.18)" />
    <circle cx={-26} cy={-4} r={6} fill={C.ink2} /><circle cx={26} cy={-4} r={6} fill={C.ink2} />
  </g>
);

const Clock: React.FC<{ cx: number; cy: number; r: number; t: number }> = ({ cx, cy, r, t }) => (
  <g transform={`translate(${cx},${cy})`}>
    <circle r={r} fill="#fff" stroke={C.ink2} strokeWidth={r * 0.1} />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-1.5} y={-r * 0.86} width={3} height={r * 0.12} fill={C.ink2} transform={`rotate(${i * 30})`} />)}
    <rect x={-2.5} y={-r * 0.55} width={5} height={r * 0.55} rx={2.5} fill={C.ink2} transform={`rotate(${t / 12})`} />
    <rect x={-1.8} y={-r * 0.78} width={3.6} height={r * 0.78} rx={1.8} fill={C.accent} transform={`rotate(${t})`} />
    <circle r={r * 0.07} fill={C.ink2} />
  </g>
);

const Pin: React.FC<{ x: number; y: number; s?: number; color?: string; label?: string }> = ({ x, y, s = 1, color = C.accent, label = "?" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cy={4} rx={20} ry={6} fill={C.shadow} />
    <path d="M0 0 C-34 -44 -40 -58 -40 -76 A40 40 0 1 1 40 -76 C40 -58 34 -44 0 0Z" fill={color} />
    <circle cy={-76} r={26} fill="#fff" />
    <text y={-64} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={800} fontSize={38} fill={C.ink2}>{label}</text>
  </g>
);

const Bubble: React.FC<{ x: number; y: number; w: number; h?: number; children: React.ReactNode; s?: number }> = ({ x, y, w, h = 70, children, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-w / 2} y={-h} width={w} height={h} rx={h / 2} fill="#fff" stroke={C.ink2} strokeWidth={4} />
    <path d="M-12 0 L0 24 L12 0Z" fill="#fff" stroke={C.ink2} strokeWidth={4} strokeLinejoin="round" />
    <rect x={-14} y={-4} width={28} height={8} fill="#fff" />
    {children}
  </g>
);

const Palm: React.FC<{ x: number; y: number; s?: number; sway: number }> = ({ x, y, s = 1, sway }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M0 0 Q8 -80 -4 -150" stroke="#7A5A3A" strokeWidth={10} fill="none" strokeLinecap="round" />
    <g transform={`translate(-4,-150) rotate(${sway})`}>
      {[-70, -35, 0, 35, 70].map((a) => (
        <path key={a} d="M0 0 Q40 -30 78 8 Q40 -12 0 4Z" fill={C.primary} transform={`rotate(${a - 90})`} />
      ))}
    </g>
  </g>
);

/* ---------- vehicles ---------- */
const Taxi: React.FC<{ x: number; y: number; s?: number; rot: number; bob?: number; passenger?: boolean }> = ({ x, y, s = 1, rot, bob = 0, passenger = true }) => (
  <g transform={`translate(${x},${y + bob}) scale(${s})`}>
    <ellipse cx={150} cy={4} rx={150} ry={9} fill={C.shadow} />
    <path d="M4 -24 Q0 -70 40 -72 L70 -72 L100 -116 L210 -116 L245 -72 L280 -68 Q300 -62 298 -24Z" fill={C.accent} />
    <path d="M82 -76 L106 -108 L150 -108 L150 -76Z" fill={C.glass} />
    <path d="M160 -76 L160 -108 L204 -108 L232 -76Z" fill={C.glass} />
    {passenger && <><circle cx={122} cy={-92} r={13} fill={C.skin} /><rect x={108} y={-80} width={28} height={8} rx={4} fill={C.primary} /></>}
    {passenger && <><circle cx={190} cy={-92} r={13} fill={C.skin} /><rect x={176} y={-80} width={28} height={8} rx={4} fill={C.ink2} /></>}
    <rect x={118} y={-132} width={64} height={18} rx={5} fill={C.ink2} />
    <text x={150} y={-118} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={800} fontSize={13} fill="#fff">TAXI</text>
    {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={10 + i * 28} y={-50 + (i % 2) * 8} width={14} height={8} fill={C.ink2} opacity={0.85} />)}
    <rect x={284} y={-44} width={14} height={12} rx={4} fill="#fff" />
    <Wheel cx={70} cy={-6} r={30} rot={rot} /><Wheel cx={232} cy={-6} r={30} rot={rot} />
  </g>
);

const Bus: React.FC<{ x: number; y: number; s?: number; rot: number; door?: number }> = ({ x, y, s = 1, rot, door = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={210} cy={4} rx={215} ry={10} fill={C.shadow} />
    <rect x={0} y={-176} width={420} height={150} rx={26} fill={C.primary} />
    <rect x={0} y={-70} width={420} height={18} fill={C.primaryDeep} />
    {[20, 100, 180, 260].map((wx) => <rect key={wx} x={wx} y={-150} width={68} height={58} rx={10} fill={C.glass} />)}
    <rect x={330} y={-150} width={72} height={112} rx={10} fill={C.glass} />
    <rect x={366 - door * 30} y={-150} width={36} height={112} fill={C.primaryDeep} opacity={0.35 + (1 - door) * 0.0} />
    <rect x={332} y={-196} width={84} height={30} rx={8} fill={C.ink2} />
    <text x={374} y={-173} textAnchor="middle" fontFamily={theme.fonts.ar} fontWeight={700} fontSize={22} fill={C.accent}>مطار</text>
    <rect x={400} y={-52} width={14} height={14} rx={4} fill={C.accentSoft} />
    <Wheel cx={90} cy={-8} r={34} rot={rot} /><Wheel cx={320} cy={-8} r={34} rot={rot} />
  </g>
);

const Plane: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-170 -4 Q-170 -34 -120 -36 L120 -36 Q190 -34 220 0 Q190 26 120 28 L-120 28 Q-170 28 -170 -4Z" fill="#fff" stroke={C.ink2} strokeWidth={5} />
    <path d="M-160 -30 L-210 -92 L-170 -92 L-110 -30Z" fill={C.primary} stroke={C.ink2} strokeWidth={5} strokeLinejoin="round" />
    <path d="M-30 -2 L40 -2 L-30 90 L-80 90Z" fill={C.glass} stroke={C.ink2} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-150} y={6} width={320} height={9} fill={C.primary} />
    {Array.from({ length: 11 }).map((_, i) => <circle key={i} cx={-100 + i * 20} cy={-12} r={6} fill={C.glass} stroke={C.ink2} strokeWidth={2} />)}
    <path d="M186 -14 Q214 -8 196 6Z" fill={C.ink2} opacity={0.6} />
    <ellipse cx={-20} cy={50} rx={34} ry={14} fill={C.ink2} />
  </g>
);

/* ---------- backdrop ---------- */
const BLD: [number, number, number, boolean][] = [[0, 90, 190, true], [100, 70, 120, false], [180, 110, 250, true], [300, 60, 150, false], [370, 100, 210, true],
  [480, 80, 130, false], [570, 120, 270, true], [700, 70, 160, false], [780, 100, 200, true]];
const Skyline: React.FC<{ frame: number; base: number; speed: number; dim?: number }> = ({ frame, base, speed, dim = 1 }) => {
  const off = -((frame * speed) % W);
  return (
    <g opacity={dim}>
      {[0, 1].map((k) => (
        <g key={k} transform={`translate(${off + k * W},0)`}>
          {BLD.map(([bx, bw, bh, alt], i) => (
            <g key={i}>
              <rect x={bx} y={base - bh} width={bw} height={bh} rx={6} fill={alt ? C.bldA : C.bldB} />
              {Array.from({ length: Math.floor(bh / 46) }).map((_, r) => <rect key={r} x={bx + 14} y={base - bh + 18 + r * 46} width={bw - 28} height={14} rx={4} fill="#fff" opacity={0.55} />)}
            </g>
          ))}
          <path d={`M600 ${base - 270} Q640 ${base - 330} 680 ${base - 270}Z`} fill={C.bldA} />
        </g>
      ))}
    </g>
  );
};
const Sky: React.FC<{ frame: number; road?: boolean; roadY?: number }> = ({ frame, road = true, roadY = 590 }) => (
  <g>
    <defs>
      <linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#D7F2E8" /><stop offset="1" stopColor="#F4FCF9" /></linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#sk)" />
    <circle cx={700} cy={150 + Math.sin(frame / 40) * 4} r={64} fill={C.accent} opacity={0.9} />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={((i * 360 + frame * 0.6) % (W + 300)) - 150} cy={120 + i * 55} rx={90} ry={24} fill="#fff" opacity={0.85} />)}
    <Skyline frame={frame} base={roadY - 10} speed={0.5} />
    {road && <>
      <rect y={roadY - 10} width={W} height={H - roadY + 10} fill={C.ink2} />
      <rect y={roadY - 10} width={W} height={12} fill="#fff" opacity={0.5} />
      {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={((i * 150 - frame * 12) % 1200 + 1200) % 1200 - 160} y={roadY + 100} width={80} height={10} rx={5} fill="#fff" opacity={0.8} />)}
    </>}
  </g>
);

/* ---------- 10 scenes ---------- */
const TaxiHurry: React.FC<{ f: number }> = ({ f }) => {
  const x = ease(f, 0, 40, -420, 210), bob = Math.sin(f / 2.2) * 2.2;
  const tick = f * 16;
  return (
    <g>
      <Sky frame={f * 2} />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={(x - 40 - ((f * 22 + i * 90) % 360)) } y={470 + i * 24} width={150} height={8} rx={4} fill="#fff" opacity={0.75 - i * 0.1} />)}
      <Taxi x={x} y={640} s={1.15} rot={f * 22} bob={bob} />
      <g transform={`translate(660,330) scale(${1 + Math.sin(f / 6) * 0.03})`}>
        <circle r={96} fill="#fff" opacity={0.0} />
        <Clock cx={0} cy={0} r={86} t={tick} />
        {[-1, 1].map((d) => <rect key={d} x={d * 96 - 4} y={-14} width={8} height={28} rx={4} fill={C.danger} transform={`rotate(${d * 24 * Math.sin(f / 3)} ${d * 96} 0)`} />)}
      </g>
      <Person x={110} y={700} s={0.9} shirt={C.accent} arm={ease(f, 20, 60, 0, -140)} bob={Math.sin(f / 5) * 2} />
    </g>
  );
};

const Speedo: React.FC<{ f: number }> = ({ f }) => {
  const needle = f < 60 ? ease(f, 0, 55, -75, 62, theme.ease.inOut) : ease(f, 60, 170, 62, -30, theme.ease.inOut) + Math.sin(f / 2) * (f < 150 ? 1.5 : 0);
  const rolling = f < 60 ? 26 : ease(f, 60, 170, 26, 6);
  const shake = f < 60 ? Math.sin(f * 2.2) * 3 : 0;
  return (
    <g>
      <Sky frame={f * 1.2} />
      <g transform="translate(440,250)">
        <circle r={190} fill="#fff" stroke={C.ink2} strokeWidth={10} />
        {Array.from({ length: 28 }).map((_, i) => { const a = -135 + i * 10; const hot = i > 18; return <rect key={i} x={-3} y={-170} width={6} height={i % 3 === 0 ? 30 : 18} fill={hot ? C.danger : C.ink2} transform={`rotate(${a})`} />; })}
        <path d="M-120 100 A150 150 0 1 1 120 100" fill="none" stroke={C.primary} strokeWidth={18} strokeLinecap="round" strokeDasharray="520 900" opacity={0.0} />
        <g transform={`rotate(${needle})`}><rect x={-7} y={-150} width={14} height={150} rx={7} fill={C.danger} /><circle r={20} fill={C.ink2} /></g>
        <text y={110} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={800} fontSize={34} fill={C.ink2}>km/h</text>
      </g>
      <Taxi x={290} y={700} s={0.95} rot={f * rolling} bob={shake * 0.4} />
      {f < 80 && [0, 1, 2].map((i) => <rect key={i} x={120 - ((f * 20 + i * 60) % 200)} y={600 + i * 28} width={110} height={7} rx={3.5} fill="#fff" opacity={0.8} />)}
      {f >= 80 && <g transform={`translate(710,430) scale(${spring({ frame: f - 80, fps: 30, config: theme.spring.bouncy })})`}>
        <path d="M-70 -60 L70 -60 L70 40 L0 40 L-24 78 L-24 40 L-70 40Z" fill={C.primary} />
        <path d="M-34 -8 L-8 20 L38 -34" stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>}
    </g>
  );
};

const BusStop: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Sky frame={f * 1.4} roadY={620} />
    <rect x={0} y={612} width={W} height={26} fill="#C7D7D0" />
    <g transform="translate(560,612)">
      <rect x={-6} y={-330} width={12} height={330} fill={C.ink2} />
      <circle cy={-350} r={62} fill={C.primary} stroke="#fff" strokeWidth={8} />
      <rect x={-34} y={-378} width={68} height={44} rx={9} fill="#fff" /><rect x={-26} y={-370} width={52} height={20} rx={4} fill={C.glass} />
      <circle cx={-18} cy={-332} r={5} fill="#fff" /><circle cx={18} cy={-332} r={5} fill="#fff" />
      <rect x={-30} y={-270} width={60} height={34} rx={8} fill={C.ink2} />
      <text y={-246} textAnchor="middle" fontFamily={theme.fonts.ar} fontWeight={700} fontSize={22} fill="#fff">موقف</text>
      <rect x={30} y={-170} width={220} height={12} fill={C.ink2} /><rect x={30} y={-170} width={12} height={170} fill={C.ink2} />
      <rect x={42} y={-158} width={196} height={110} fill={C.glass} opacity={0.5} />
    </g>
    <Person x={300} y={690} s={1.1} shirt={C.accent} arm={ease(f, 10, 40, 0, 0)} bob={Math.sin(f / 7) * 2} />
    <Bubble x={300} y={440} w={120} h={86} s={ease(f, 8, 28, 0, 1)}>
      <text x={0} y={-24} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={800} fontSize={58} fill={C.primary}>?</text>
    </Bubble>
    <Pin x={640} y={ 330 + Math.sin(f / 9) * 8} s={0.0} />
    <Pin x={130} y={540 + Math.sin(f / 9) * 8} s={0.9} />
  </g>
);

const BusArrive: React.FC<{ f: number }> = ({ f }) => {
  const x = interpolate(spring({ frame: f - 6, fps: 30, config: { damping: 24, stiffness: 55, mass: 1.4 } }), [0, 1], [1000, 330]);
  const speed = Math.max(0, Math.min(1, (x - 330) / 400));
  const door = ease(f, 62, 90, 0, 1);
  return (
    <g>
      <Sky frame={f * 0.8} roadY={620} />
      <rect x={0} y={612} width={W} height={26} fill="#C7D7D0" />
      <rect x={120} y={452} width={12} height={160} fill={C.ink2} /><circle cx={126} cy={440} r={40} fill={C.primary} stroke="#fff" strokeWidth={6} />
      <Bus x={x} y={705} s={0.95} rot={f * 20 * speed} door={door} />
      <Person x={230} y={700} s={1.0} shirt={C.accent} arm={ease(f, 60, 75, 0, 0) + Math.sin(f / 4) * 18 - 150} bob={Math.sin(f / 7) * 2} />
      <g transform={`translate(690,360) scale(${spring({ frame: f - 70, fps: 30, config: theme.spring.bouncy })})`}>
        <circle r={70} fill={C.primary} /><path d="M-30 4 L-8 28 L34 -22" stroke="#fff" strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
};

const Train: React.FC<{ f: number }> = ({ f }) => {
  const x = interpolate(spring({ frame: f - 4, fps: 30, config: { damping: 26, stiffness: 50, mass: 1.5 } }), [0, 1], [-1100, 20]);
  return (
    <g>
      <Sky frame={f * 0.6} roadY={600} road={false} />
      <rect y={590} width={W} height={210} fill="#C7D7D0" /><rect y={640} width={W} height={160} fill={C.ink2} />
      {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={i * 70 - 20} y={650} width={22} height={12} fill="#7C8F88" />)}
      <g transform={`translate(${x},600)`}>
        {[0, 1].map((k) => (
          <g key={k} transform={`translate(${k * 430},0)`}>
            <rect x={0} y={-190} width={420} height={170} rx={34} fill="#fff" stroke={C.ink2} strokeWidth={5} />
            <rect x={0} y={-100} width={420} height={22} fill={C.primary} />
            {[24, 108, 192, 276].map((wx) => <rect key={wx} x={wx} y={-170} width={70} height={56} rx={10} fill={C.glass} />)}
            <rect x={354} y={-170} width={50} height={140} rx={8} fill={C.glass} />
          </g>
        ))}
        <circle cx={80} cy={-12} r={22} fill={C.ink2} /><circle cx={340} cy={-12} r={22} fill={C.ink2} />
      </g>
      <g transform="translate(640,360)">
        <circle r={72} fill={C.primary} stroke="#fff" strokeWidth={8} />
        <text y={26} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={800} fontSize={84} fill="#fff">M</text>
      </g>
      <Pin x={780} y={500 + Math.sin(f / 9) * 8} s={0.8} />
      <Person x={470} y={742} s={1.15} shirt={C.accent} bob={Math.sin(f / 7) * 2} />
    </g>
  );
};

const Ticket: React.FC<{ f: number }> = ({ f }) => {
  const slide = spring({ frame: f - 40, fps: 30, config: theme.spring.smooth });
  return (
    <g>
      <rect width={W} height={H} fill="#E4F5EE" />
      <rect y={560} width={W} height={240} fill={C.bldA} />
      <rect x={120} y={140} width={640} height={420} rx={20} fill={C.glass} stroke={C.ink2} strokeWidth={8} />
      <rect x={120} y={140} width={640} height={420} rx={20} fill="#fff" opacity={0.35} />
      <Person x={440} y={560} s={1.5} shirt={C.primaryDeep} bob={Math.sin(f / 9) * 2} />
      <rect x={60} y={540} width={760} height={52} rx={10} fill={C.ink2} />
      <rect x={60} y={592} width={760} height={208} fill={C.primaryDeep} />
      <rect x={300} y={70} width={280} height={56} rx={14} fill={C.ink2} />
      <text x={440} y={110} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={800} fontSize={34} fill={C.accent}>TICKETS</text>
      <g transform={`translate(${200 + slide * 0},${540 - slide * 80}) rotate(${-8 + slide * 8}) scale(${0.9 + slide * 0.15})`}>
        <g transform="translate(0,-60)">
          <rect x={0} y={0} width={320} height={130} rx={14} fill="#fff" stroke={C.ink2} strokeWidth={5} />
          <rect x={0} y={0} width={90} height={130} rx={14} fill={C.accent} />
          <line x1={90} y1={8} x2={90} y2={122} stroke={C.ink2} strokeWidth={3} strokeDasharray="8 8" />
          <text x={45} y={80} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={800} fontSize={54} fill={C.ink2}>1</text>
          <rect x={112} y={30} width={170} height={16} rx={8} fill={C.primary} />
          <rect x={112} y={58} width={120} height={12} rx={6} fill={C.glass} /><rect x={112} y={82} width={150} height={12} rx={6} fill={C.glass} />
        </g>
      </g>
      <Person x={160} y={760} s={1.25} shirt={C.accent} arm={ease(f, 30, 50, 0, -35)} bob={Math.sin(f / 7) * 2} />
    </g>
  );
};

const Delayed: React.FC<{ f: number }> = ({ f }) => {
  const blink = Math.floor(f / 14) % 2 === 0;
  return (
    <g>
      <rect width={W} height={H} fill="#E4F5EE" />
      <rect x={0} y={90} width={W} height={400} fill="url(#sk)" />
      <defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#D7F2E8" /><stop offset="1" stopColor="#F4FCF9" /></linearGradient></defs>
      <rect x={0} y={420} width={W} height={70} fill="#C7D7D0" />
      <Plane x={560} y={400 + Math.sin(f / 30) * 3} s={1.0} />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={i * 220 - 4} y={90} width={10} height={400} fill={C.ink2} />)}
      <rect y={490} width={W} height={310} fill={C.bldA} />
      <g transform="translate(70,150)">
        <rect width={440} height={250} rx={18} fill={C.ink2} />
        <text x={24} y={44} fontFamily={theme.fonts.display} fontWeight={800} fontSize={26} fill="#fff">DEPARTURES</text>
        {[0, 1, 2].map((r) => (
          <g key={r} transform={`translate(24,${70 + r * 58})`}>
            <rect width={392} height={44} rx={8} fill="#fff" opacity={0.08} />
            <text x={12} y={31} fontFamily={theme.fonts.display} fontWeight={700} fontSize={22} fill="#fff">SV 10{r + 4}</text>
            <text x={150} y={31} fontFamily={theme.fonts.display} fontWeight={700} fontSize={22} fill={r === 1 ? (blink ? C.accent : C.danger) : C.primary}>{r === 1 ? "DELAYED" : "ON TIME"}</text>
          </g>
        ))}
      </g>
      <g transform="translate(700,260)"><Clock cx={0} cy={0} r={80} t={f * 9} /></g>
      <Person x={250} y={720} s={1.2} shirt={C.accent} bob={Math.sin(f / 7) * 2} />
      <Suitcase x={330} y={720} s={1.1} color={C.primary} />
      <Person x={600} y={730} s={1.15} shirt={C.primaryDeep} arm={-20} bob={Math.sin(f / 8 + 1) * 2} flip />
      <Suitcase x={520} y={730} s={1.0} color={C.accent} />
    </g>
  );
};

const Gate: React.FC<{ f: number }> = ({ f }) => {
  const walk = ease(f, 0, 150, 0, 1, theme.ease.inOut);
  const arrow = Math.sin(f / 6) * 14;
  return (
    <g>
      <rect width={W} height={H} fill="#E4F5EE" />
      <polygon points={`0,0 ${W},0 ${W - 170},300 170,300`} fill="#F4FCF9" />
      <polygon points={`0,0 170,300 170,640 0,800`} fill={C.bldA} />
      <polygon points={`${W},0 ${W - 170},300 ${W - 170},640 ${W},800`} fill={C.bldA} />
      <polygon points={`170,640 ${W - 170},640 ${W},800 0,800`} fill="#C7D7D0" />
      <rect x={260} y={300} width={360} height={340} fill={C.glass} opacity={0.9} />
      <Plane x={440} y={470} s={0.55} />
      <rect x={260} y={300} width={360} height={340} fill="none" stroke={C.ink2} strokeWidth={8} />
      <g transform={`translate(440,${150 + Math.sin(f / 20) * 4})`}>
        <rect x={-6} y={-150} width={12} height={90} fill={C.ink2} />
        <rect x={-210} y={-70} width={420} height={140} rx={20} fill={C.primary} stroke="#fff" strokeWidth={8} />
        <text x={-170} y={34} fontFamily={theme.fonts.display} fontWeight={800} fontSize={72} fill="#fff">GATE</text>
        <circle cx={110} cy={0} r={52} fill={C.accent} /><text x={110} y={24} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={800} fontSize={66} fill={C.ink2}>12</text>
      </g>
      <g transform={`translate(${650 + arrow},560)`}><path d="M0 0 L60 0 L60 -24 L110 24 L60 72 L60 48 L0 48Z" fill={C.accent} /></g>
      <Person x={ease(f, 0, 150, 160, 420)} y={ease(f, 0, 150, 760, 700)} s={ease(f, 0, 150, 1.5, 1.15)} shirt={C.accent} bob={Math.sin(f / 3.5) * 4} />
      <Suitcase x={ease(f, 0, 150, 255, 485)} y={ease(f, 0, 150, 760, 700)} s={ease(f, 0, 150, 1.3, 1.0)} color={C.primaryDeep} />
    </g>
  );
};

const LostBag: React.FC<{ f: number }> = ({ f }) => {
  const bags = [C.primary, C.accent, C.primaryDeep, C.accent];
  const pulse = 0.5 + Math.sin(f / 5) * 0.5;
  return (
    <g>
      <rect width={W} height={H} fill="#E4F5EE" />
      <rect y={0} width={W} height={330} fill="#F4FCF9" />
      <g transform="translate(440,180)"><rect x={-240} y={-90} width={480} height={80} rx={14} fill={C.ink2} />
        <text y={-34} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={800} fontSize={44} fill={C.accent}>BAGGAGE CLAIM</text></g>
      <ellipse cx={540} cy={560} rx={320} ry={120} fill={C.ink2} />
      <ellipse cx={540} cy={546} rx={284} ry={96} fill="#37524A" />
      {[0, 1, 2, 3].map((i) => {
        const a = ((f * 0.022 + i * 0.25) % 1) * Math.PI * 2;
        const bx = 540 + Math.cos(a) * 284, by = 546 + Math.sin(a) * 96;
        return <Suitcase key={i} x={bx} y={by + 18} s={0.85} color={bags[i]} />;
      })}
      <g opacity={0.35 + pulse * 0.5} transform="translate(540,440)">
        <rect x={-42} y={-80} width={84} height={72} rx={12} fill="none" stroke={C.danger} strokeWidth={6} strokeDasharray="12 10" />
        <text y={-26} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={800} fontSize={52} fill={C.danger}>?</text>
      </g>
      <Person x={110} y={770} s={1.3} shirt={C.accent} arm={ease(f, 20, 50, 0, -60) + Math.sin(f / 5) * 6} bob={Math.sin(f / 7) * 2} />
      <Bubble x={140} y={470} w={120} h={86} s={ease(f, 10, 30, 0, 1)}>
        <text y={-24} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={800} fontSize={58} fill={C.danger}>!</text>
      </Bubble>
    </g>
  );
};

const Passport: React.FC<{ f: number }> = ({ f }) => {
  const st = spring({ frame: f - 50, fps: 30, config: { damping: 9, stiffness: 220, mass: 0.6 } });
  const drop = interpolate(st, [0, 1], [-160, 0]);
  const stampOp = ease(f, 52, 58, 0, 1);
  return (
    <g>
      <rect width={W} height={H} fill="#E4F5EE" />
      <rect y={0} width={W} height={300} fill="#F4FCF9" />
      <g transform="translate(440,160)"><rect x={-300} y={-100} width={600} height={140} rx={20} fill={C.primary} stroke="#fff" strokeWidth={8} />
        <text y={-20} textAnchor="middle" fontFamily={theme.fonts.ar} fontWeight={700} fontSize={70} fill="#fff">الجوازات</text>
        <text y={22} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={800} fontSize={30} fill={C.accentSoft}>IMMIGRATION</text></g>
      <rect y={300} width={W} height={500} fill={C.bldA} />
      <rect x={130} y={330} width={620} height={250} rx={18} fill={C.glass} stroke={C.ink2} strokeWidth={8} />
      <Person x={440} y={580} s={1.3} shirt={C.ink2} bob={Math.sin(f / 9) * 2} />
      <rect x={90} y={560} width={700} height={50} rx={10} fill={C.ink2} />
      <rect x={90} y={610} width={700} height={190} fill={C.primaryDeep} />
      <g transform="translate(330,430) rotate(-6)">
        <rect width={240} height={320} rx={16} fill={C.primary} stroke={C.ink2} strokeWidth={6} />
        <circle cx={120} cy={120} r={56} fill="none" stroke={C.accent} strokeWidth={8} />
        <path d="M120 80 L134 112 L168 116 L142 138 L150 172 L120 154 L90 172 L98 138 L72 116 L106 112Z" fill={C.accent} />
        <text x={120} y={240} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={800} fontSize={30} fill="#fff">PASSPORT</text>
        <rect x={40} y={262} width={160} height={10} rx={5} fill="#fff" opacity={0.5} />
      </g>
      <g transform={`translate(560,${520 + drop})`} opacity={1}>
        <rect x={-10} y={-90} width={90} height={70} rx={12} fill={C.accent} /><rect x={20} y={-150} width={30} height={64} rx={10} fill={C.ink2} />
      </g>
      <g transform="translate(590,470) rotate(-14)" opacity={stampOp}>
        <rect x={-60} y={-34} width={120} height={68} rx={10} fill="none" stroke={C.danger} strokeWidth={6} />
        <text y={10} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={800} fontSize={28} fill={C.danger}>ENTRY</text>
      </g>
      <Person x={130} y={770} s={1.2} shirt={C.accent} bob={Math.sin(f / 7) * 2} />
    </g>
  );
};

export const ART: Record<ArtKey, React.FC<{ f: number }>> = {
  taxiHurry: TaxiHurry, speedo: Speedo, busStop: BusStop, busArrive: BusArrive, train: Train,
  ticket: Ticket, delayed: Delayed, gate: Gate, lostBag: LostBag, passport: Passport,
};

export const ArtCanvas: React.FC<{ art: ArtKey; width?: number }> = ({ art, width = W }) => {
  const f = useCurrentFrame();
  useVideoConfig();
  const A = ART[art];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={width} height={(width * H) / W} style={{ display: "block" }}>
      <A f={f} />
    </svg>
  );
};

export { Plane, Taxi, Bus, Suitcase, Person, Palm, Clock, Pin, Sky, Wheel };
