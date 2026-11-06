import React from "react";
import {C, E, I} from "../../theme";
import {ip, breathe} from "../../anim";
import {Person} from "../../components/Person";
import {KeyIcon, BoltIcon, DropIcon} from "../../components/Icons";
import {Room, Sparkle, Table, IllProps} from "./common";

/* ───────── 66 · turn off the light, I'll sleep ───────── */
export const S66: React.FC<IllProps> = ({t, p1, m}) => {
  const flip = ip(t, [p1 + 1.0, p1 + 1.25], [0, 1], E.back);
  const dark = ip(t, [p1 + 1.2, p1 + 2.4], [0, 1], E.inOut);
  const zzz = ip(t, [p1 + 2.2, p1 + 2.8], [0, 1]);
  return (
    <g>
      <Room id="s66" top="#EAF9EF" bottom="#D5F0DD" />
      {/* window with moon */}
      <rect x={70} y={90} width={200} height={230} rx={12} fill={I.night2} />
      <circle cx={190} cy={170} r={36} fill="#FEF3C7" />
      <circle cx={204} cy={160} r={32} fill={I.night2} opacity={dark} />
      {[[110, 130], [150, 250], [235, 240], [120, 200]].map(([x, y], i) => <Sparkle key={i} x={x} y={y} s={9} t={t} ph={i * 1.7} color={C.white} />)}
      <rect x={70} y={90} width={200} height={230} rx={12} fill="none" stroke={C.white} strokeWidth={12} />
      <line x1={170} y1={90} x2={170} y2={320} stroke={C.white} strokeWidth={8} />
      {/* ceiling lamp */}
      <line x1={500} y1={0} x2={500} y2={92} stroke={I.metalDark} strokeWidth={4} />
      <path d="M460 112 q40 -50 80 0Z" fill={C.primary} />
      <polygon points="470,112 530,112 700,440 300,440" fill={C.amber} opacity={0.2 * (1 - dark)} />
      <circle cx={500} cy={118} r={14} fill={dark > 0.5 ? I.metal : C.amber} />
      {/* bed */}
      <rect x={300} y={360} width={520} height={110} rx={18} fill={I.woodDark} />
      <rect x={300} y={300} width={40} height={170} rx={14} fill={I.wood} />
      <rect x={318} y={330} width={500} height={70} rx={26} fill={C.white} />
      <rect x={330} y={310} width={130} height={50} rx={22} fill={C.soft} stroke={I.metal} strokeWidth={3} />
      <path d="M470 345 h340 a20 20 0 0 1 0 60 h-340 Z" fill={C.primary} />
      <rect x={300} y={470} width={520} height={16} fill={I.woodDark} />
      {/* wall switch */}
      <g transform="translate(820 230)">
        <rect x={-34} y={-50} width={68} height={100} rx={14} fill={C.white} stroke={I.metal} strokeWidth={4} />
        <rect x={-14} y={-30} width={28} height={60} rx={8} fill={I.gray} />
        <rect x={-12} y={flip ? 2 : -28} width={24} height={26} rx={7} fill={flip ? I.hot : C.primary} />
      </g>
      <Person x={185} y={530} s={1} mood={dark > 0.7 ? "tired" : "smile"} armR={dark < 0.1 ? [150, -20] : [12, 8]} armL={[10, 8]} />
      {/* darkness */}
      <rect x={0} y={0} width={920} height={580} fill={I.night} opacity={0.72 * dark} />
      {/* things that glow in the dark */}
      <circle cx={190} cy={170} r={36} fill="#FEF3C7" opacity={dark} />
      <circle cx={190} cy={170} r={60 + breathe(t, 4, 2)} fill="#FEF3C7" opacity={0.12 * dark} />
      <rect x={786} y={180} width={68} height={100} rx={14} fill="none" stroke={C.amber} strokeWidth={4} opacity={dark} />
      {["Z", "z", "Z"].map((z, i) => (
        <text key={i} x={330 + i * 46} y={290 - i * 40 - ((t * 24 + i * 10) % 20)} fontFamily="Poppins" fontWeight={800} fontSize={44 - i * 6} fill={C.white} opacity={zzz * (0.9 - i * 0.2)}>{z}</text>
      ))}
    </g>
  );
};

/* ───────── 67 · where did you put the key? ───────── */
const Items: React.FC<{t?: number}> = () => (
  <g>
    {/* mug */}
    <rect x={190} y={338} width={44} height={54} rx={8} fill={C.white} stroke={I.metal} strokeWidth={3} />
    <path d="M234 350 q 22 0 0 28" stroke={I.metal} strokeWidth={6} fill="none" />
    {/* books */}
    <rect x={340} y={366} width={110} height={26} rx={5} fill={C.primary} />
    <rect x={350} y={342} width={92} height={24} rx={5} fill={C.amber} />
    <rect x={360} y={320} width={74} height={22} rx={5} fill={I.cool} />
    {/* plant */}
    <rect x={540} y={350} width={56} height={42} rx={8} fill={I.wood} />
    {[-24, 0, 24].map((a, i) => <ellipse key={i} cx={568} cy={326} rx={11} ry={34} fill={C.primary} transform={`rotate(${a} 568 350)`} />)}
    {/* bag */}
    <rect x={660} y={338} width={78} height={54} rx={14} fill={I.woodDark} />
    <path d="M680 338 q 20 -34 38 0" stroke={I.woodDark} strokeWidth={8} fill="none" />
  </g>
);

export const S67: React.FC<IllProps> = ({t, p1, end}) => {
  const stops = [212, 395, 568, 700];
  const dur = end - p1;
  const k = ip(t, [p1, end - 1], [0, 3], E.inOut);
  const i = Math.min(2, Math.floor(k));
  const f = k - i;
  const mx = stops[i] + (stops[i + 1] - stops[i]) * ((Math.sin((f - 0.5) * Math.PI) + 1) / 2);
  const my = 300 + Math.sin(t * 5) * 8;
  const qs = [212, 395, 568, 700];
  void dur;
  return (
    <g>
      <Room id="s67" />
      <Person x={110} y={545} s={1} mood="think" armL={[26, -110]} armR={[15, 8]} />
      <Table x={150} y={392} w={640} />
      <Items />
      {qs.map((x, j) => {
        const p = ip(t, [0.3 + j * 0.25, 0.7 + j * 0.25], [0, 1], E.back);
        return (
          <text key={j} x={x} y={240 - 8 * Math.sin(t * 3 + j)} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={54 * p} fill={C.amber}>?</text>
        );
      })}
      {/* magnifier */}
      <g transform={`translate(${mx} ${my})`}>
        <circle r={48} fill={C.white} fillOpacity={0.35} stroke={C.dark} strokeWidth={10} />
        <line x1={34} y1={34} x2={80} y2={80} stroke={C.dark} strokeWidth={14} strokeLinecap="round" />
      </g>
      {/* thought bubble: the missing key */}
      <g transform={`translate(240 150) scale(${ip(t, [0.2, 0.7], [0, 1], E.back)})`}>
        <circle cx={-70} cy={74} r={8} fill={C.white} />
        <circle cx={-48} cy={54} r={13} fill={C.white} />
        <ellipse cx={0} cy={0} rx={90} ry={52} fill={C.white} />
        <KeyIcon size={64} x={0} y={0} color={I.metalDark} opacity={0.55 + 0.25 * Math.sin(t * 3)} rot={-20} />
      </g>
    </g>
  );
};

/* ───────── 68 · the key is on the table ───────── */
export const S68: React.FC<IllProps> = ({t, p1, p2}) => {
  const zoom = ip(t, [p2 - 0.3, p2 + 2.0], [1, 1.55], E.inOut);
  const drop = ip(t, [p1 - 0.1, p1 + 0.6], [-230, 0], E.back);
  const ring = 1 + 0.12 * Math.sin(t * 4);
  const arrow = Math.abs(Math.sin(t * 3)) * 16;
  const keyX = 470, keyY = 372;
  return (
    <g>
      <g transform={`translate(${keyX} ${keyY}) scale(${zoom}) translate(${-keyX} ${-keyY}) translate(0 ${(zoom - 1) * -40})`}>
        <Room id="s68" />
        <Table x={150} y={392} w={640} />
        <Items />
        <ellipse cx={keyX} cy={394} rx={42} ry={8} fill={C.dark} opacity={0.2} />
        <KeyIcon x={keyX} y={keyY + drop} size={86} rot={-18} />
        <circle cx={keyX} cy={keyY} r={62 * ring} fill="none" stroke={C.primary} strokeWidth={7} strokeDasharray="14 12" opacity={ip(t, [p1 + 0.5, p1 + 0.9], [0, 1])} />
        <g transform={`translate(${keyX} ${keyY - 150 + arrow})`} opacity={ip(t, [p1 + 0.5, p1 + 1.0], [0, 1])}>
          <path d="M0 40 V-30 M-30 10 L0 42 L30 10" stroke={C.primary} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <Sparkle x={keyX + 70} y={keyY - 50} s={18} t={t} />
        <Sparkle x={keyX - 80} y={keyY - 30} s={12} t={t} ph={2} />
      </g>
    </g>
  );
};

/* ───────── 69 · water supply is off ───────── */
export const S69: React.FC<IllProps> = ({t, p1, p2}) => {
  const flow = 1 - ip(t, [p1 - 0.2, p1 + 1.6], [0, 1], E.inOut);
  const stopped = flow < 0.02;
  const valve = ip(t, [p1, p1 + 1.6], [0, 300], E.inOut);
  const dripPh = (t * 0.9) % 1;
  const dripOp = ip(t, [p1 + 1.4, p2 + 1.2], [1, 0]);
  const no = ip(t, [p2, p2 + 0.7], [0, 1], E.back);
  return (
    <g>
      <Room id="s69" />
      {/* pipe + valve */}
      <rect x={0} y={170} width={440} height={34} fill={I.metalDark} />
      <rect x={440} y={150} width={90} height={34} rx={10} fill={I.metalDark} />
      <rect x={500} y={150} width={36} height={80} rx={12} fill={I.metalDark} />
      <g transform={`translate(240 170) rotate(${valve})`}>
        <circle r={30} fill={I.hot} />
        <rect x={-34} y={-6} width={68} height={12} rx={6} fill={I.hot} />
        <rect x={-6} y={-34} width={12} height={68} rx={6} fill={I.hot} />
        <circle r={9} fill={C.white} />
      </g>
      {/* basin */}
      <rect x={380} y={380} width={240} height={34} rx={12} fill={C.white} />
      <path d="M400 414 h200 v46 a26 26 0 0 1 -26 26 h-148 a26 26 0 0 1 -26 -26Z" fill={C.white} />
      <rect x={470} y={228} width={60} height={4} fill="none" />
      {/* running water (stops) */}
      <rect x={510 - 8 * flow} y={230} width={16 * flow} height={152} rx={8} fill={I.cool} opacity={0.9} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={502} y={230 + ((t * 260 + i * 50) % 150)} width={4} height={20} rx={2} fill={C.white} opacity={0.8 * flow} />
      ))}
      {stopped && (
        <path transform={`translate(518 ${236 + dripPh * 140})`} d="M0 -10 C0 -10 -8 0 -8 5 a8 8 0 0 0 16 0 C8 0 0 -10 0 -10Z" fill={I.cool} opacity={dripOp * (1 - dripPh * 0.4)} />
      )}
      {/* empty bucket */}
      <g transform="translate(730 380)">
        <path d="M0 0 h130 l-16 110 h-98 Z" fill={I.metal} />
        <path d="M18 -4 q47 -60 94 0" stroke={I.metalDark} strokeWidth={8} fill="none" />
        <ellipse cx={65} cy={0} rx={65} ry={12} fill={I.metalDark} />
        <ellipse cx={65} cy={2} rx={52} ry={8} fill={C.text} opacity={0.35} />
      </g>
      {/* water icon crossed out */}
      <g transform="translate(180 360)">
        <circle r={86} fill={C.white} />
        <DropIcon size={100} x={0} y={0} opacity={1 - 0.7 * no} />
        <g opacity={no} transform={`scale(${0.6 + 0.4 * no})`}>
          <circle r={74} fill="none" stroke={I.hot} strokeWidth={12} />
          <line x1={-52} y1={-52} x2={52} y2={52} stroke={I.hot} strokeWidth={12} strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
};

/* ───────── 70 · sudden power cut ───────── */
export const S70: React.FC<IllProps> = ({t, p1}) => {
  const cut = p1 + 0.9;
  const dark = ip(t, [cut, cut + 0.45], [0, 1], E.inOut);
  const emerg = ip(t, [cut + 0.5, cut + 1.1], [0, 1]);
  const pulse = 0.75 + 0.25 * Math.sin(t * 3);
  const slash = ip(t, [cut + 0.3, cut + 0.9], [0, 1], E.back);
  return (
    <g>
      <Room id="s70" />
      <line x1={500} y1={0} x2={500} y2={92} stroke={I.metalDark} strokeWidth={4} />
      <path d="M455 114 q45 -56 90 0Z" fill={C.primary} />
      <polygon points="470,114 530,114 720,440 280,440" fill={C.amber} opacity={0.22 * (1 - dark)} />
      <circle cx={500} cy={120} r={14} fill={dark > 0.4 ? I.metal : C.amber} />
      {/* sofa + window as room context */}
      <rect x={560} y={330} width={280} height={110} rx={26} fill={C.primary} opacity={0.9} />
      <rect x={560} y={296} width={280} height={60} rx={26} fill={C.dark} opacity={0.85} />
      <rect x={80} y={110} width={150} height={190} rx={10} fill={I.sky} />
      <rect x={80} y={110} width={150} height={190} rx={10} fill="none" stroke={C.white} strokeWidth={10} />
      <Person x={330} y={530} mood={dark > 0.5 ? "surprised" : "smile"} armL={dark > 0.5 ? [50, -10] : [10, 6]} armR={dark > 0.5 ? [50, -10] : [10, 6]} />
      <rect x={0} y={0} width={920} height={580} fill={I.night} opacity={0.78 * dark} />
      {/* emergency light */}
      <g transform="translate(790 90)">
        <polygon points="-40,40 40,40 190,420 -190,420" fill={C.amber} opacity={0.18 * emerg * pulse} />
        <rect x={-44} y={0} width={88} height={40} rx={10} fill={C.white} />
        <circle cx={-18} cy={20} r={9} fill={C.amber} opacity={0.4 + 0.6 * emerg * pulse} />
        <circle cx={18} cy={20} r={9} fill={C.amber} opacity={0.4 + 0.6 * emerg * pulse} />
      </g>
      {/* electricity icon disappears */}
      <g transform="translate(130 400)">
        <circle r={74} fill={C.white} opacity={1 - 0.35 * dark} />
        <BoltIcon size={86} x={0} y={0} opacity={1 - 0.8 * slash} />
        <g opacity={slash}>
          <line x1={-50} y1={-50} x2={50} y2={50} stroke={I.hot} strokeWidth={11} strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
};
