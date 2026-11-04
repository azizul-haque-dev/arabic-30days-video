import React from "react";
import { Easing, interpolate, spring, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { AlarmClock, Mosque, Sofa, WashingMachine } from "./objects";
import { Backdrop, Crescent, INK, Person, Sparkle, SW } from "./primitives";

const c = theme.colors;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const eo = Easing.bezier(0.16, 1, 0.3, 1);
const eio = Easing.bezier(0.83, 0, 0.17, 1);

type A = { frame: number };
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width="100%" height="100%" viewBox="0 0 920 560" style={{ display: "block" }}>{children}</svg>
);

// 71 ───────────────────────────── washing machine broken
export const ArtWash: React.FC<A> = ({ frame }) => {
  const puddle = interpolate(frame, [20, 110], [0, 1], { easing: eo, ...clamp });
  return (
    <Svg>
      <Backdrop />
      <ellipse cx={460} cy={448} rx={90 + puddle * 120} ry={10 + puddle * 12} fill="#8FD0E8" opacity={0.75} />
      {[0, 1, 2].map((i) => {
        const t = ((frame + i * 17) % 50) / 50;
        return <ellipse key={i} cx={330 + i * 14} cy={420 + t * 22} rx={6} ry={9} fill="#8FD0E8" opacity={puddle * (1 - t)} />;
      })}
      <WashingMachine x={460} y={446} s={1.0} frame={frame} broken />
    </Svg>
  );
};

// 72 ───────────────────────────── plumber
export const ArtPlumber: React.FC<A> = ({ frame }) => {
  const wr = Math.sin(frame / 7) * 14;
  const phoneY = Math.sin(frame / 18) * 6;
  return (
    <Svg>
      <Backdrop />
      <rect x={60} y={120} width={420} height={44} rx={10} fill="#9DB5AC" stroke={INK} strokeWidth={SW} />
      <rect x={462} y={106} width={36} height={72} rx={8} fill="#7C968B" stroke={INK} strokeWidth={SW} />
      <rect x={470} y={170} width={20} height={60} rx={6} fill="#9DB5AC" stroke={INK} strokeWidth={SW} />
      {[0, 1].map((i) => {
        const t = ((frame + i * 14) % 34) / 34;
        return <path key={i} transform={`translate(480,${232 + t * 190})`} d="M0,-12 Q9,2 0,10 Q-9,2 0,-12Z" fill="#6DC3E6" opacity={1 - t * 0.5} />;
      })}
      <path d="M440,440 l14,-52 h56 l14,52z" fill={c.accent} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <Person x={270} y={440} frame={frame} shirt={c.primary} cap={c.accent} armFront={138} armBack={-6}
        held={<g transform={`rotate(${wr * 0.6})`}><rect x={-7} y={-90} width={14} height={110} rx={6} fill="#9DB5AC" stroke={INK} strokeWidth={4} /><circle cx={0} cy={-98} r={22} fill="#9DB5AC" stroke={INK} strokeWidth={4} /></g>} />
      <g transform={`translate(700,${150 + phoneY}) rotate(${Math.sin(frame * 1.6) * 2.5} 80 150)`}>
        {[1, 2].map((k) => (
          <path key={k} d={`M${-20 - k * 22},110 q-12,40 0,80`} fill="none" stroke={c.primary} strokeWidth={7} strokeLinecap="round" opacity={0.3 + ((Math.sin(frame / 4 - k) + 1) / 2) * 0.6} />
        ))}
        <rect width={160} height={300} rx={30} fill={INK} />
        <rect x={10} y={14} width={140} height={272} rx={22} fill="#fff" />
        <circle cx={80} cy={96} r={38} fill={c.primarySoft} />
        <circle cx={80} cy={86} r={14} fill={c.skin} /><path d="M54,126 q26,-32 52,0z" fill={c.primary} />
        <rect x={40} y={158} width={80} height={12} rx={6} fill={c.primarySoft} />
        <circle cx={80} cy={234} r={28} fill={c.primary} />
        <path d="M70,224 q-2,16 12,24 l8,-8 l-9,-7 l-5,3 q-3,-4 0,-9z" fill="#fff" />
      </g>
    </Svg>
  );
};

// 73 ───────────────────────────── taking garbage out
export const ArtTrash: React.FC<A> = ({ frame }) => {
  const px = interpolate(frame, [8, 100], [90, 520], { easing: eio, ...clamp });
  const walking = frame > 10 && frame < 100;
  const throwP = interpolate(frame, [104, 140], [0, 1], { easing: eo, ...clamp });
  const flying = frame >= 104;
  const bagX = interpolate(throwP, [0, 1], [px + 60, 790]);
  const bagY = interpolate(throwP, [0, 1], [330, 372]) - Math.sin(throwP * Math.PI) * 120;
  const lid = frame > 140 ? Math.max(0, Math.sin((frame - 140) / 4)) * 14 * Math.max(0, 1 - (frame - 140) / 40) : 0;
  const tick = spring({ frame: frame - 150, fps: 30, config: theme.spring.bouncy });
  const Bag: React.FC = () => (
    <g><path d="M-30,-4 q-10,-52 30,-60 q40,8 30,60 q-30,20 -60,0z" fill={c.pants} stroke={INK} strokeWidth={4} /><path d="M-8,-62 l8,-18 l8,18z" fill={c.pants} stroke={INK} strokeWidth={4} /></g>
  );
  return (
    <Svg>
      <Backdrop />
      <rect x={610} y={440} width={310} height={120} fill={c.primarySoft} />
      <rect x={650} y={110} width={170} height={330} fill="#fff" stroke={INK} strokeWidth={SW} />
      <path d="M650,110 L720,128 L720,440 L650,440z" fill={c.accent} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M720,128 L820,110 L820,440 L720,440z" fill="#FFF6DD" />
      <circle cx={700} cy={290} r={7} fill={INK} />
      <g transform="translate(800,440)">
        <rect x={-48} y={-110} width={96} height={110} rx={10} fill={c.primary} stroke={INK} strokeWidth={SW} />
        <g transform={`rotate(${-lid} -48 -110)`}><rect x={-58} y={-130} width={116} height={22} rx={8} fill={c.primaryDark} stroke={INK} strokeWidth={SW} /></g>
        {[-20, 0, 20].map((x) => <line key={x} x1={x} y1={-86} x2={x} y2={-18} stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.7} />)}
      </g>
      {!flying && <Person x={px} y={440} frame={frame} walking={walking} shirt={c.accent} armFront={30} held={<g transform="translate(6,24)"><Bag /></g>} />}
      {flying && <Person x={px} y={440} frame={frame} shirt={c.accent} armFront={80} />}
      {flying && frame < 142 && <g transform={`translate(${bagX},${bagY}) rotate(${throwP * 220})`}><Bag /></g>}
      {frame >= 140 && (
        <g transform={`translate(800,300) scale(${tick})`}>
          <circle r={34} fill={c.primary} stroke={INK} strokeWidth={SW} />
          <path d="M-14,2 l10,12 l20,-24" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </Svg>
  );
};

// 74 ───────────────────────────── messy → clean room
export const ArtRoom: React.FC<A> = ({ frame }) => {
  const rx = interpolate(frame, [70, 170], [0, 920], { easing: eio, ...clamp });
  const Furniture = () => (
    <g>
      <rect y={0} width={920} height={440} fill="#FFFDF5" />
      <rect x={90} y={80} width={190} height={170} rx={14} fill="#CDEBFA" stroke={INK} strokeWidth={SW} />
      <line x1={185} y1={80} x2={185} y2={250} stroke={INK} strokeWidth={5} /><line x1={90} y1={165} x2={280} y2={165} stroke={INK} strokeWidth={5} />
      <rect x={520} y={300} width={340} height={110} rx={18} fill={c.primary} stroke={INK} strokeWidth={SW} />
      <rect x={520} y={270} width={110} height={60} rx={20} fill="#fff" stroke={INK} strokeWidth={SW} />
      <rect x={500} y={250} width={26} height={190} rx={10} fill={c.primaryDark} stroke={INK} strokeWidth={SW} />
      <rect x={540} y={410} width={14} height={30} fill={INK} /><rect x={830} y={410} width={14} height={30} fill={INK} />
      <rect x={330} y={110} width={150} height={20} rx={6} fill={c.accent} stroke={INK} strokeWidth={SW} />
    </g>
  );
  return (
    <Svg>
      <rect width={920} height={560} fill="#F6FCFA" /><rect y={440} width={920} height={120} fill={c.bgAlt} />
      <Furniture />
      <defs>
        <clipPath id="room-messy"><rect x={rx} y={0} width={920} height={560} /></clipPath>
        <clipPath id="room-clean"><rect x={0} y={0} width={rx} height={560} /></clipPath>
      </defs>
      <g clipPath="url(#room-messy)">
        <rect y={440} width={920} height={120} fill="#E4EDE9" />
        <g transform="rotate(-18 405 90)"><rect x={350} y={60} width={110} height={80} rx={8} fill="#fff" stroke={INK} strokeWidth={SW} /></g>
        <path d="M90,440 q40,-50 90,-6 q36,18 -10,34 q-70,10 -80,-28z" fill={c.accent} stroke={INK} strokeWidth={4} />
        <path d="M230,456 q30,-40 74,-10 q24,22 -20,34 q-52,4 -54,-24z" fill="#fff" stroke={INK} strokeWidth={4} />
        <path d="M380,470 q40,-30 80,2 q10,24 -36,28 q-46,-2 -44,-30z" fill={c.primarySoft} stroke={INK} strokeWidth={4} />
        {[[640, 492], [700, 470], [760, 500], [180, 500], [330, 440]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={16 + (i % 2) * 6} fill="#fff" stroke={INK} strokeWidth={4} />)}
        {[0, 1, 2].map((i) => <circle key={i} cx={150 + i * 300 + Math.sin(frame / 12 + i) * 14} cy={380 + Math.cos(frame / 9 + i) * 10} r={30 + i * 8} fill="#C6D3CD" opacity={0.55} />)}
        <path d="M540,290 q40,-20 90,0 l-6,26 q-40,12 -84,0z" fill={c.accent} stroke={INK} strokeWidth={4} />
      </g>
      <g clipPath="url(#room-clean)">
        <rect y={440} width={920} height={120} fill="#D2F0E4" />
        <rect x={350} y={90} width={110} height={76} rx={8} fill="#fff" stroke={INK} strokeWidth={SW} />
        <circle cx={405} cy={128} r={18} fill={c.primarySoft} />
        {[[348, 96, c.primary], [378, 92, c.accent], [408, 96, c.primaryDark]].map(([x, y, f], i) => <rect key={i} x={Number(x) - 8} y={Number(y) - 34} width={22} height={34} rx={4} fill={String(f)} stroke={INK} strokeWidth={4} transform={`translate(${i * 26 - 20},34)`} />)}
        <g transform="translate(150,440)"><path d="M-34,0 l-6,-70 h80 l-6,70z" fill={c.accent} stroke={INK} strokeWidth={SW} /><path d="M0,-70 q-40,-50 -50,-90 q40,6 50,60 q10,-54 50,-60 q-10,40 -50,90z" fill={c.primary} stroke={INK} strokeWidth={5} /></g>
        <ellipse cx={400} cy={490} rx={170} ry={26} fill={c.primarySoft} stroke={INK} strokeWidth={4} />
        {[[120, 330], [300, 250], [660, 220], [820, 460], [520, 480]].map(([x, y], i) => <Sparkle key={i} x={x} y={y} size={22} phase={i * 1.3} frame={frame} />)}
      </g>
      {frame > 66 && frame < 176 && (
        <g transform={`translate(${rx},0)`}>
          <rect x={-6} y={0} width={12} height={440} fill={c.accent} opacity={0.9} />
          <g transform={`translate(0,${380 + Math.sin(frame / 3) * 10}) rotate(${-24 + Math.sin(frame / 3) * 12})`}>
            <rect x={-6} y={-230} width={12} height={200} rx={6} fill={c.primaryDark} stroke={INK} strokeWidth={4} />
            <path d="M-46,-30 h92 l16,46 h-124z" fill={c.accent} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
          </g>
        </g>
      )}
    </Svg>
  );
};

// 75 ───────────────────────────── laundry
export const ArtLaundry: React.FC<A> = ({ frame }) => {
  const q = 1 + Math.sin(frame / 7) * 0.06;
  const Shirt: React.FC<{ fill: string }> = ({ fill }) => (
    <path d="M-34,0 l-26,16 l-14,-24 l30,-22 h28 q10,12 20,0 h28 l30,22 l-14,24 l-26,-16 v78 h-56z" transform="scale(0.8)" fill={fill} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
  );
  return (
    <Svg>
      <Backdrop />
      <line x1={80} y1={110} x2={840} y2={110} stroke={INK} strokeWidth={5} />
      <rect x={70} y={100} width={14} height={340} fill={INK} opacity={0.25} /><rect x={836} y={100} width={14} height={340} fill={INK} opacity={0.25} />
      {[[250, c.accent], [420, "#fff"], [590, c.primarySoft]].map(([x, f], i) => (
        <g key={i} transform={`translate(${x},112) rotate(${Math.sin(frame / 16 + i * 1.7) * 6} 0 0)`}><g transform="translate(0,0)"><Shirt fill={String(f)} /></g></g>
      ))}
      <g transform="translate(210,440)">
        <path d="M-110,-150 l20,150 h180 l20,-150z" fill={c.accent} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        {[-60, -20, 20, 60].map((x) => <line key={x} x1={x} y1={-136} x2={x * 0.92} y2={-14} stroke={INK} strokeWidth={3} opacity={0.45} />)}
        <line x1={-100} y1={-90} x2={100} y2={-90} stroke={INK} strokeWidth={3} opacity={0.45} />
        <ellipse cx={-30} cy={-160} rx={60} ry={30} fill="#fff" stroke={INK} strokeWidth={SW} />
        <ellipse cx={34} cy={-170} rx={58} ry={30} fill={c.primary} stroke={INK} strokeWidth={SW} />
        <ellipse cx={0} cy={-190} rx={44} ry={24} fill={c.primarySoft} stroke={INK} strokeWidth={SW} />
      </g>
      <g transform={`translate(445,${250}) scale(${q})`}>
        <circle r={46} fill={c.accent} stroke={INK} strokeWidth={SW} />
        <text textAnchor="middle" y={22} fontFamily={theme.fonts.en} fontWeight={800} fontSize={64} fill={INK}>?</text>
      </g>
      <WashingMachine x={680} y={440} s={0.74} frame={frame} />
    </Svg>
  );
};

// 76 ───────────────────────────── walking to mosque
export const ArtMosque: React.FC<A> = ({ frame }) => {
  const px = interpolate(frame, [10, 150], [60, 330], { easing: eio, ...clamp });
  const walking = frame > 12 && frame < 148;
  return (
    <Svg>
      <Backdrop tint="#FDE9C2" />
      <circle cx={760} cy={120} r={54} fill={c.accent} opacity={0.9} />
      {[0, 1].map((i) => <g key={i} transform={`translate(${((frame * 0.4 + i * 480) % 1100) - 140},${70 + i * 50})`} opacity={0.9}><ellipse rx={60} ry={20} fill="#fff" /><ellipse cx={34} cy={-14} rx={36} ry={22} fill="#fff" /></g>)}
      <Mosque x={640} y={440} s={0.92} frame={frame} />
      <path d="M0,440 q460,-20 920,0 v20 h-920z" fill={c.primarySoft} />
      <Person x={px} y={440} frame={frame} walking={walking} shirt="#fff" cap="#fff" />
    </Svg>
  );
};

// 77 ───────────────────────────── 6:00 AM alarm
export const ArtAlarm: React.FC<A> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 14, fps, config: { damping: 18, stiffness: 70, mass: 1 } });
  const minDeg = interpolate(p, [0, 1], [240, 360]);
  const hourDeg = interpolate(p, [0, 1], [170, 180]);
  const lab = spring({ frame: frame - 70, fps, config: theme.spring.bouncy });
  return (
    <Svg>
      <Backdrop tint="#FDE9C2" />
      {[[120, 120], [800, 170], [160, 330], [780, 360]].map(([x, y], i) => <Sparkle key={i} x={x} y={y} size={20} phase={i} frame={frame} />)}
      <AlarmClock x={460} y={250} r={150} frame={frame} hourDeg={hourDeg} minDeg={minDeg} ring={frame > 64} />
      <g transform={`translate(460,505) scale(${lab})`}>
        <rect x={-120} y={-34} width={240} height={68} rx={34} fill={INK} />
        <text textAnchor="middle" y={14} fontFamily={theme.fonts.en} fontWeight={800} fontSize={40} fill={c.accent} letterSpacing={2}>6:00 AM</text>
      </g>
    </Svg>
  );
};

// 78 ───────────────────────────── late night
export const ArtNight: React.FC<A> = ({ frame }) => {
  const stars = [[120, 90], [250, 60], [330, 150], [180, 190], [90, 230], [300, 250]];
  return (
    <Svg>
      <Backdrop night />
      <rect x={90} y={70} width={250} height={230} rx={16} fill="#0A1F1A" stroke="#fff" strokeWidth={SW} opacity={0.95} />
      {stars.map(([x, y], i) => <circle key={i} cx={x + 10} cy={y + 20} r={3 + ((Math.sin(frame / 10 + i * 1.4) + 1) / 2) * 3} fill="#fff" opacity={0.5 + ((Math.sin(frame / 10 + i) + 1) / 4)} />)}
      <g transform="translate(255,150)"><Crescent id="night-cr" r={42} fill="#FDE9C2" /></g>
      <line x1={215} y1={70} x2={215} y2={300} stroke="#fff" strokeWidth={4} opacity={0.8} />
      <rect x={410} y={300} width={450} height={110} rx={18} fill={c.nightSoft} stroke="#fff" strokeWidth={4} />
      <rect x={392} y={250} width={26} height={190} rx={10} fill={c.primaryDark} stroke="#fff" strokeWidth={4} />
      <rect x={430} y={282} width={100} height={46} rx={22} fill="#CFE8DF" />
      <circle cx={474} cy={282} r={34} fill={c.skin} /><path d="M440,280 a34,34 0 0 1 68,0 q-30,-12 -68,0z" fill={INK} />
      <path d="M458,290 q8,6 16,0 M484,290 q8,6 16,0" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
      <path d="M520,300 q150,-24 340,16 v94 h-340z" fill={c.primary} stroke="#fff" strokeWidth={4} transform={`scale(1,${1 + Math.sin(frame / 26) * 0.012})`} />
      <rect x={430} y={410} width={14} height={32} fill="#fff" opacity={0.7} /><rect x={830} y={410} width={14} height={32} fill="#fff" opacity={0.7} />
      {[0, 1, 2].map((i) => { const t = ((frame + i * 28) % 84) / 84; return <text key={i} x={540 + t * 90} y={250 - t * 120} fontFamily={theme.fonts.en} fontWeight={800} fontSize={34 + i * 10} fill={c.accent} opacity={Math.sin(t * Math.PI)}>Z</text>; })}
      <g transform="translate(150,440)">
        <rect x={-70} y={-120} width={140} height={120} rx={14} fill={c.nightSoft} stroke="#fff" strokeWidth={4} />
        <rect x={-56} y={-168} width={112} height={56} rx={12} fill="#0A1F1A" stroke={c.accent} strokeWidth={4} />
        <text textAnchor="middle" x={0} y={-126} fontFamily={theme.fonts.en} fontWeight={800} fontSize={34} fill={c.accent}>2:30</text>
      </g>
    </Svg>
  );
};

// 79 ───────────────────────────── sunrise
export const ArtSunrise: React.FC<A> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const rise = spring({ frame: frame - 8, fps, config: { damping: 22, stiffness: 50, mass: 1.2 } });
  const sunY = interpolate(rise, [0, 1], [470, 250]);
  const flap = Math.sin(frame / 4) * 8;
  return (
    <Svg>
      <defs><linearGradient id="sky" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#FFD98A" /><stop offset="0.55" stopColor="#FDEFD0" /><stop offset="1" stopColor="#E6F5F0" /></linearGradient></defs>
      <rect width={920} height={560} fill="url(#sky)" />
      <g transform={`translate(460,${sunY})`}>
        {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={-7} y={-190} width={14} height={50} rx={7} fill={c.accent} opacity={0.55} transform={`rotate(${i * (360 / 14) + frame * 0.5})`} />)}
        <circle r={110} fill={c.accent} />
        <circle r={110} fill="none" stroke="#fff" strokeWidth={6} opacity={0.35} />
      </g>
      <path d="M0,420 q150,-100 330,-30 q170,70 300,-40 q150,-70 290,10 v200 h-920z" fill={c.primarySoft} />
      <path d="M0,470 q200,-70 400,-10 q250,60 520,-20 v120 h-920z" fill={c.primary} />
      {[[160, 140], [260, 90]].map(([x, y], i) => <path key={i} d={`M${x - 26},${y} q26,${-flap - 12} 26,0 q0,${-flap - 12} 26,0`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />)}
      <AlarmClock x={770} y={395} r={62} frame={frame} hourDeg={165} minDeg={180} body={c.accent} />
    </Svg>
  );
};

// 80 ───────────────────────────── relaxing on sofa
export const ArtSofa: React.FC<A> = ({ frame }) => {
  const breathe = 1 + Math.sin(frame / 28) * 0.012;
  const glow = 0.45 + Math.sin(frame / 30) * 0.08;
  return (
    <Svg>
      <Backdrop />
      <rect x={560} y={90} width={150} height={110} rx={10} fill="#fff" stroke={INK} strokeWidth={SW} /><circle cx={635} cy={145} r={26} fill={c.accentSoft} />
      <g transform="translate(120,440)">
        <circle cx={0} cy={-250} r={120} fill={c.accent} opacity={glow * 0.5} />
        <rect x={-5} y={-250} width={10} height={250} fill={INK} /><ellipse cx={0} cy={0} rx={44} ry={9} fill={INK} />
        <path d="M-52,-250 l14,-64 h76 l14,64z" fill={c.accent} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      </g>
      <Sofa x={420} y={440} s={1} />
      <g transform={`translate(440,372) scale(1,${breathe})`}>
        <rect x={-34} y={-132} width={68} height={104} rx={26} fill="#fff" stroke={INK} strokeWidth={SW} transform="rotate(-10)" />
        <circle cx={-8} cy={-172} r={32} fill={c.skin} /><path d="M-41,-172 a33,33 0 0 1 66,0 q-30,-16 -66,0z" fill={INK} />
        <path d="M-8,-160 q8,9 17,0" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" /><path d="M-20,-176 q5,-4 10,0" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        <rect x={-18} y={-44} width={150} height={28} rx={14} fill={c.pants} />
      </g>
      <g transform="translate(730,440)">
        <rect x={-80} y={-84} width={160} height={16} rx={8} fill={c.primaryDark} stroke={INK} strokeWidth={SW} />
        <rect x={-62} y={-68} width={14} height={68} fill={INK} /><rect x={48} y={-68} width={14} height={68} fill={INK} />
        <rect x={-24} y={-128} width={48} height={44} rx={10} fill="#fff" stroke={INK} strokeWidth={SW} />
        {[0, 1, 2].map((i) => { const t = ((frame + i * 16) % 48) / 48; return <path key={i} d={`M${-12 + i * 12},${-136 - t * 50} q-8,-12 0,-24`} fill="none" stroke="#9DB5AC" strokeWidth={5} strokeLinecap="round" opacity={1 - t} />; })}
      </g>
      <g transform="translate(850,440)"><rect x={-26} y={-60} width={52} height={60} rx={8} fill={c.accent} stroke={INK} strokeWidth={SW} /><path d="M0,-60 q-60,-40 -50,-100 q50,20 50,100z M0,-60 q60,-50 46,-110 q-50,30 -46,110z" fill={c.primary} stroke={INK} strokeWidth={5} /></g>
    </Svg>
  );
};

export const ART: Record<string, React.FC<A>> = {
  wash: ArtWash, plumber: ArtPlumber, trash: ArtTrash, room: ArtRoom, laundry: ArtLaundry,
  mosque: ArtMosque, alarm: ArtAlarm, night: ArtNight, sunrise: ArtSunrise, sofa: ArtSofa,
};
