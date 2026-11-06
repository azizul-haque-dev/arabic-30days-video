import React from "react";
import {C, E, I} from "../../theme";
import {ip, breathe} from "../../anim";
import {Person} from "../../components/Person";
import {ToiletIcon} from "../../components/Icons";
import {Room, Sparkle, Table, IllProps} from "./common";

/* ───────── 61 · finished a meal ───────── */
export const S61: React.FC<IllProps> = ({t, p1}) => {
  const fill = ip(t, [p1 + 0.2, p1 + 2.2], [0, 1], E.inOut);
  const pat = t > p1 ? Math.sin((t - p1) * 5) * 7 : 0;
  const badge = ip(t, [p1 + 2.0, p1 + 2.5], [0, 1], E.back);
  return (
    <g>
      <Room id="s61" />
      <Person x={380} y={520} legs={false} mood={fill > 0.6 ? "happy" : "smile"} armR={[20, -100 + pat]} armL={[14, 10]} />
      <Table x={110} y={392} w={640} />
      {/* empty plate, fork & knife, glass */}
      <ellipse cx={530} cy={394} rx={92} ry={17} fill={C.white} stroke={I.metal} strokeWidth={3} />
      <ellipse cx={530} cy={394} rx={58} ry={9} fill={I.gray} />
      {[[505, 396], [545, 392], [560, 397]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.2} fill={I.woodDark} opacity={0.5} />)}
      <rect x={405} y={382} width={5} height={24} rx={2} fill={I.metalDark} />
      <rect x={652} y={380} width={9} height={26} rx={3} fill={I.metalDark} />
      <path d="M610 392 h22 v-30 h-22 Z" fill={I.skyDeep} opacity={0.55} />
      <rect x={610} y={360} width={22} height={34} rx={4} fill={C.white} opacity={0.35} stroke={I.skyDeep} />
      {/* fullness meter */}
      <g transform="translate(715 60)">
        <rect x={0} y={0} width={150} height={250} rx={30} fill={C.white} />
        <rect x={20} y={22} width={110} height={170} rx={20} fill={C.soft} />
        <clipPath id="s61c"><rect x={20} y={22} width={110} height={170} rx={20} /></clipPath>
        <g clipPath="url(#s61c)">
          <rect x={20} y={192 - 170 * fill} width={110} height={170} fill={C.primary} />
          <path d={`M20 ${192 - 170 * fill} q 27 ${-9 + breathe(t, 5, 3)} 55 0 t 55 0 V 200 H20Z`} fill={C.primary} />
        </g>
        <text x={75} y={228} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={32} fill={C.dark}>{Math.round(fill * 100)}%</text>
      </g>
      <g transform={`translate(840 70) scale(${badge})`}>
        <circle r={30} fill={C.amber} />
        <path d="M-13 1 l9 10 l17 -20" stroke={C.white} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Sparkle x={250} y={150} s={20} t={t} />
      <Sparkle x={520} y={170} s={16} t={t} ph={2} />
      <Sparkle x={300} y={90} s={12} t={t} ph={4} />
    </g>
  );
};

/* ───────── 62 · where is the restroom ───────── */
export const S62: React.FC<IllProps> = ({t, p1, m}) => {
  const walk = ip(t, [p1, m + 1.5], [0, 170], E.inOut);
  const walking = t > p1 && walk < 169;
  const q = ip(t, [0.2, 0.6], [0, 1], E.back);
  const arrow = Math.abs(Math.sin(t * 3)) * 20;
  const path = ip(t, [p1 + 0.5, p1 + 2.2], [0, 1]);
  return (
    <g>
      <Room id="s62" top="#EAF9EF" bottom="#D5F0DD" />
      {/* doors */}
      <rect x={90} y={150} width={140} height={292} rx={8} fill={I.wood} opacity={0.75} />
      <rect x={90} y={150} width={140} height={292} rx={8} fill="none" stroke={C.white} strokeWidth={6} />
      <circle cx={210} cy={300} r={7} fill={C.amber} />
      <rect x={700} y={150} width={140} height={292} rx={8} fill={I.woodDark} />
      <rect x={700} y={150} width={140} height={292} rx={8} fill="none" stroke={C.white} strokeWidth={6} />
      <circle cx={716} cy={300} r={7} fill={C.amber} />
      <rect x={724} y={170} width={92} height={92} rx={22} fill={C.primary} />
      <ToiletIcon x={770} y={216} size={76} />
      {/* hanging directional sign */}
      <g transform={`translate(0 ${breathe(t, 3, 1.4)})`}>
        <line x1={340} y1={0} x2={340} y2={64} stroke={I.metalDark} strokeWidth={4} />
        <line x1={560} y1={0} x2={560} y2={64} stroke={I.metalDark} strokeWidth={4} />
        <rect x={270} y={64} width={360} height={110} rx={26} fill={C.primary} />
        <rect x={270} y={64} width={360} height={110} rx={26} fill="none" stroke={C.white} strokeWidth={5} />
        <ToiletIcon x={340} y={120} size={70} />
        <g transform={`translate(${520 + arrow} 120)`}>
          <path d="M-46 0 H36 M8 -28 L38 0 L8 28" stroke={C.white} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
      {/* guiding dashed path on the floor */}
      <path d="M250 520 Q 450 560 700 490" stroke={C.amber} strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray="4 22"
        pathLength={1} style={{strokeDashoffset: 1 - path}} opacity={path > 0 ? 1 : 0} />
      <Person x={190 + walk} y={520} mood="think" walk={walking ? t * 9 : 0} armL={[10, 6]} armR={[40, -130]} />
      <g transform={`translate(${280 + walk} 220) scale(${q})`}>
        <circle r={38} fill={C.white} />
        <text y={16} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={52} fill={C.amber}>?</text>
      </g>
    </g>
  );
};

/* ───────── 63 · open the window ───────── */
export const S63: React.FC<IllProps> = ({t, p1}) => {
  const open = ip(t, [p1 + 0.4, p1 + 2.6], [0, 1], E.inOut);
  const th = open * 1.25; // radians
  const wind = ip(t, [p1 + 1.0, p1 + 2.4], [0, 1]);
  const sway = Math.sin(t * 2.2) * 8 * (0.25 + wind);
  const paneW = 150, x0 = 285, y0 = 90, h = 300;
  const pane = (side: -1 | 1) => {
    const hx = side === -1 ? x0 : x0 + paneW * 2;
    return (
      <g transform={`translate(${hx} ${y0}) scale(${Math.cos(th)} 1)`}>
        <g transform={`scale(${side} 1)`}>
          <rect x={0} y={0} width={paneW} height={h} rx={6} fill={I.skyDeep} fillOpacity={0.35} stroke={C.white} strokeWidth={12} />
          <path d={`M12 40 L${paneW - 12} 12 M12 100 L${paneW - 40} 60`} stroke={C.white} strokeWidth={5} opacity={0.6} />
          <circle cx={paneW - 22} cy={h / 2} r={7} fill={C.amber} />
        </g>
      </g>
    );
  };
  return (
    <g>
      <Room id="s63" />
      {/* outdoors */}
      <rect x={x0} y={y0} width={paneW * 2} height={h} fill={I.sky} />
      <circle cx={x0 + 230} cy={y0 + 70} r={34} fill={C.amber} />
      <g transform={`translate(${(t * 12) % 260 - 40} 0)`}>
        <ellipse cx={x0 + 40} cy={y0 + 120} rx={52} ry={18} fill={C.white} />
        <ellipse cx={x0 + 76} cy={y0 + 108} rx={36} ry={20} fill={C.white} />
      </g>
      <path d={`M${x0} ${y0 + h} q 70 -70 150 -20 t 150 -10 V${y0 + h}Z`} fill={C.primary} opacity={0.55} />
      {pane(-1)}
      {pane(1)}
      <rect x={x0 - 12} y={y0 - 12} width={paneW * 2 + 24} height={h + 24} rx={10} fill="none" stroke={C.white} strokeWidth={14} />
      <rect x={x0 - 30} y={y0 + h + 12} width={paneW * 2 + 60} height={20} rx={8} fill={C.white} />
      {/* curtains */}
      {[-1, 1].map((sd) => (
        <path key={sd}
          d={`M${sd === -1 ? 255 : 665} 60 h${sd * -70} V${400} q ${sd * 30} ${sway} ${sd * 70} 0 q ${sd * 10} ${-sway} 0 ${-340}Z`}
          fill={C.primary} opacity={0.9} transform={`translate(${sd * sway * 0.6} 0)`} />
      ))}
      <rect x={200} y={52} width={520} height={10} rx={5} fill={I.woodDark} />
      {/* plant */}
      <g transform={`translate(110 ${y0 + h + 10})`}>
        <rect x={-26} y={-6} width={52} height={40} rx={8} fill={I.wood} />
        {[-30, 0, 30].map((a, i) => (
          <ellipse key={i} cx={0} cy={-50} rx={12} ry={42} fill={C.primary} transform={`rotate(${a + sway * (i - 1)} 0 -6)`} />
        ))}
      </g>
      {/* fresh air streaks */}
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${760 - i * 10} ${150 + i * 55} q -80 -20 -160 0 t -170 10`} stroke={C.white} strokeWidth={7} fill="none"
          strokeLinecap="round" pathLength={1} strokeDasharray="0.25 0.75"
          style={{strokeDashoffset: -((t * 0.6 + i * 0.23) % 1)}} opacity={wind * 0.9} />
      ))}
    </g>
  );
};

/* ───────── 64 · close the door behind you ───────── */
export const S64: React.FC<IllProps> = ({t, p1, p2, m}) => {
  const go = ip(t, [p1 - 0.2, p2 - 0.4], [0, 1], E.inOut);
  const close = ip(t, [m - 0.5, m + 0.9], [70, 0], E.inOut) * 1; // degrees
  const th = (close * Math.PI) / 180;
  const fx = 360 + 200 * Math.cos(th);
  const lift = 34 * Math.sin(th);
  const click = ip(t, [m + 0.85, m + 1.1], [0, 1], E.back);
  const px = 220 + go * 250;
  const sc = 1 - go * 0.34;
  return (
    <g>
      <Room id="s64" />
      {/* doorway + hallway light */}
      <rect x={340} y={96} width={240} height={360} rx={6} fill={C.white} />
      <rect x={360} y={116} width={200} height={340} fill={I.wall2} />
      <rect x={360} y={116} width={200} height={340} fill={C.amber} opacity={0.16} />
      <Person x={px} y={520 - go * 66} s={sc} walk={go < 1 ? t * 9 : 0} mood="smile" armL={[22, 8]} armR={[-18, 6]} />
      {/* door leaf swinging */}
      <polygon points={`360,116 ${fx},${116 - lift} ${fx},${456 + lift} 360,456`} fill={I.wood} />
      <polygon points={`376,140 ${360 + 180 * Math.cos(th)},${140 - lift * 0.9} ${360 + 180 * Math.cos(th)},${250 + lift * 0.2} 376,250`} fill={I.woodDark} opacity={0.4} />
      <circle cx={fx - 20 * Math.cos(th)} cy={290} r={8} fill={C.amber} />
      <rect x={340} y={96} width={240} height={360} rx={6} fill="none" stroke={C.white} strokeWidth={20} />
      {/* click feedback */}
      <g transform={`translate(640 250) scale(${click})`}>
        <circle r={44} fill={C.primary} />
        <path d="M-18 4 v-10 a18 18 0 0 1 36 0 v10 M-24 4 h48 v34 h-48Z" stroke={C.white} strokeWidth={6} fill="none" strokeLinejoin="round" />
      </g>
      {close < 4 && [0, 1, 2].map((i) => (
        <line key={i} x1={600 + i * 16} y1={170} x2={620 + i * 16} y2={150} stroke={C.amber} strokeWidth={6} strokeLinecap="round" opacity={click} />
      ))}
    </g>
  );
};

/* ───────── 65 · switch on the AC, it's hot ───────── */
export const S65: React.FC<IllProps> = ({t, p1, m}) => {
  const on = ip(t, [p1 + 0.9, p1 + 1.3], [0, 1]);
  const cool = ip(t, [p1 + 1.2, m + 1.2], [0, 1], E.inOut);
  const mercury = 190 * (1 - 0.78 * cool);
  const hotMix = 1 - cool;
  return (
    <g>
      <Room id="s65" top="#FFF4E0" bottom="#E7F8EC" />
      {/* hot window */}
      <rect x={60} y={100} width={230} height={250} rx={10} fill={I.hotSoft} opacity={0.25 + 0.45 * hotMix} />
      <rect x={60} y={100} width={230} height={250} rx={10} fill={I.sky} opacity={0.6 * cool + 0.2} />
      <g transform={`translate(175 190) rotate(${t * 18})`} opacity={hotMix * 0.9 + 0.2}>
        {Array.from({length: 10}).map((_, i) => (
          <line key={i} x1={0} y1={-54} x2={0} y2={-72 - 6 * Math.sin(t * 4 + i)} stroke={C.amber} strokeWidth={8} strokeLinecap="round" transform={`rotate(${i * 36})`} />
        ))}
        <circle r={42} fill={C.amber} />
      </g>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${90 + i * 60} 330 q 10 -20 0 -40 t 0 -40`} stroke={I.hot} strokeWidth={5} fill="none" strokeLinecap="round"
          opacity={hotMix * 0.7} transform={`translate(0 ${-((t * 22 + i * 14) % 40)})`} />
      ))}
      <rect x={60} y={100} width={230} height={250} rx={10} fill="none" stroke={C.white} strokeWidth={12} />
      <line x1={175} y1={100} x2={175} y2={350} stroke={C.white} strokeWidth={8} />
      {/* thermometer */}
      <g transform="translate(360 140)">
        <rect x={-18} y={0} width={36} height={210} rx={18} fill={C.white} />
        <rect x={-9} y={200 - mercury} width={18} height={mercury + 8} rx={9} fill={cool > 0.5 ? I.cool : I.hot} />
        <circle cx={0} cy={232} r={30} fill={cool > 0.5 ? I.cool : I.hot} />
        <circle cx={0} cy={232} r={30} fill="none" stroke={C.white} strokeWidth={8} />
      </g>
      {/* AC unit */}
      <g transform="translate(520 56)">
        <rect x={0} y={0} width={320} height={96} rx={26} fill={C.white} stroke={I.metal} strokeWidth={4} />
        <rect x={26} y={62} width={268} height={10} rx={5} fill={I.metal} />
        <rect x={26} y={62} width={268} height={6 + 10 * on} rx={4} fill={I.metalDark} />
        <circle cx={286} cy={26} r={6} fill={on ? C.primary : I.hot} />
        <text x={30} y={40} fontFamily="Poppins" fontWeight={700} fontSize={22} fill={C.muted}>{on ? "24°C" : "OFF"}</text>
      </g>
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${560 + i * 70} 160 q 20 60 -10 120 t 10 120`} stroke={I.cool} strokeWidth={8} fill="none" strokeLinecap="round"
          pathLength={1} strokeDasharray="0.2 0.8" style={{strokeDashoffset: -((t * 0.7 + i * 0.27) % 1)}} opacity={on * 0.85} />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={560 + ((i * 53) % 260)} cy={190 + ((t * 70 + i * 60) % 260)} r={5 + (i % 3)} fill={C.white} opacity={on * 0.9} />
      ))}
      <Person x={680} y={545} mood={cool > 0.6 ? "happy" : "hot"} armR={cool < 0.6 ? [34 + Math.sin(t * 7) * 10, -120] : [10, 8]} armL={[10, 6]} />
      {cool < 0.6 && [0, 1].map((i) => (
        <path key={i} transform={`translate(${650 + i * 56} ${268 + ((t * 40 + i * 20) % 36)})`} d="M0 -9 C0 -9 -7 0 -7 4 a7 7 0 0 0 14 0 C7 0 0 -9 0 -9Z" fill={I.cool} opacity={1 - ((t * 40 + i * 20) % 36) / 40} />
      ))}
    </g>
  );
};
