import React from "react";
import { theme } from "../theme";
import { ease, useBreath, useFrame } from "../anim";
import { Breathe, Briefcase, CardBox, Check, Clock, Cross, IdCard, Lines, Person, Pop, Spark } from "./kit";

const c = theme.colors;
const W = 960;
const H = 580;

const Floor: React.FC = () => (
  <g>
    <ellipse cx={W / 2} cy={H - 18} rx={400} ry={22} fill="rgba(20,83,45,0.10)" />
  </g>
);

/* 191 — task outside the employee's responsibility */
export const NotMyTask: React.FC = () => {
  const f = useFrame();
  const slide = ease(f, 26, 56, theme.ease.out);
  const fly = ease(f, 40, 70, theme.ease.inOut);
  const zone = ease(f, 70, 90);
  const pulse = useBreath(0.03, 70);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <Floor />
      {/* employee's responsibility zone */}
      <Pop start={4} x={150} y={150} dy={30}>
        <rect width={360} height={300} rx={36} fill={c.soft} stroke={c.primary} strokeWidth={4} strokeDasharray="16 12" transform={`scale(${1 + pulse * zone})`} style={{ transformOrigin: "180px 150px" }} />
        <CardBox x={34} y={40} w={130} h={92} r={16}><Lines x={18} y={22} widths={[70, 90, 50]} gap={20} /><Check x={104} y={66} r={14} /></CardBox>
        <CardBox x={184} y={40} w={130} h={92} r={16}><Lines x={18} y={22} widths={[90, 60, 80]} gap={20} /><Check x={104} y={66} r={14} /></CardBox>
      </Pop>
      <Pop start={10} x={330} y={H - 22} dy={60} origin={[0, -100]}>
        <Breathe amp={3}><Person x={0} y={0} kind="employee" armL={[-60, -52]} armR={[78 + (1 - slide) * 0, -62]} scale={1.05} /></Breathe>
      </Pop>
      <Pop start={14} x={790} y={H - 22} dy={60} origin={[0, -100]}>
        <Breathe amp={3} phase={40}><Person x={0} y={0} kind="manager" flip armL={[-70 - slide * 30, -64]} armR={[70, -40]} scale={1.05} /></Breathe>
      </Pop>
      {/* task card travelling from the manager, landing OUTSIDE the zone */}
      <g transform={`translate(${620 - fly * 70} ${180 + fly * 110 - Math.sin(fly * Math.PI) * 50}) rotate(${(1 - fly) * 8 - 4})`} opacity={ease(f, 28, 38)}>
        <CardBox x={0} y={0} w={170} h={120} r={18} stroke={c.amber}>
          <rect width={170} height={30} rx={18} fill={c.amberSoft} />
          <rect y={14} width={170} height={16} fill={c.amberSoft} />
          <Lines x={20} y={50} widths={[110, 80]} gap={22} />
          <circle cx={140} cy={92} r={14} fill={c.amber} />
          <text x={140} y={99} textAnchor="middle" fontFamily={theme.fonts.en} fontWeight={700} fontSize={20} fill="#fff">!</text>
        </CardBox>
      </g>
      <Pop start={78} x={560} y={330} dy={16} from={0.5}>
        <Cross x={0} y={0} r={26} color={c.amber} />
      </Pop>
    </svg>
  );
};

/* 192 — organised workplace */
export const Organized: React.FC = () => {
  const f = useFrame();
  const tidy = ease(f, 40, 80, theme.ease.inOut);
  const paper = (i: number, tx: number, ty: number, r0: number, tx0: number, ty0: number, col: string) => (
    <g key={i} transform={`translate(${tx0 + (tx - tx0) * tidy} ${ty0 + (ty - ty0) * tidy}) rotate(${r0 * (1 - tidy)})`}>
      <CardBox x={-70} y={-48} w={140} h={96} r={14} stroke={col}><Lines x={-50} y={-26} widths={[90, 70, 80]} gap={20} /></CardBox>
    </g>
  );
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <Floor />
      <Pop start={4} x={0} y={0} dy={30}>
        {/* desk */}
        <rect x={110} y={400} width={740} height={26} rx={13} fill={c.dark} />
        <rect x={150} y={426} width={26} height={120} rx={8} fill="#166534" />
        <rect x={784} y={426} width={26} height={120} rx={8} fill="#166534" />
        {/* monitor */}
        <rect x={380} y={170} width={260} height={170} rx={18} fill={c.slate} />
        <rect x={394} y={184} width={232} height={140} rx={10} fill={c.soft} />
        <Lines x={412} y={206} widths={[150, 110, 130, 90]} gap={26} color={c.primary} h={12} />
        <rect x={496} y={340} width={28} height={50} fill={c.slate} />
        <rect x={456} y={384} width={108} height={16} rx={8} fill={c.slate} />
      </Pop>
      {/* pen holder + plant */}
      <Pop start={16} x={810} y={400} dy={30}>
        <rect x={-30} y={-80} width={60} height={80} rx={10} fill={c.amber} />
        <rect x={-14} y={-120} width={8} height={44} rx={4} fill={c.primary} transform="rotate(-8 -10 -80)" />
        <rect x={4} y={-112} width={8} height={36} rx={4} fill={c.dark} transform="rotate(10 8 -80)" />
      </Pop>
      <Pop start={20} x={170} y={400} dy={30}>
        <path d="M -34 0 L -26 -60 L 26 -60 L 34 0 Z" fill="#B45309" />
        <path d="M 0 -60 Q -50 -90 -44 -140 Q -4 -120 0 -60 Z" fill={c.primary} />
        <path d="M 0 -60 Q 50 -100 40 -150 Q 4 -120 0 -60 Z" fill="#22C55E" />
      </Pop>
      {/* papers: scattered → neat stack/grid */}
      {paper(0, 300, 372, -18, 340, 290, c.border)}
      {paper(1, 300, 340, 22, 250, 360, c.border)}
      {paper(2, 690, 352, -12, 640, 250, c.border)}
      <Pop start={84} x={810} y={170} dy={20} from={0.4}><Check x={0} y={0} r={38} /></Pop>
      <Spark x={860} y={230} s={1} opacity={ease(f, 90, 100)} />
      <Spark x={150} y={230} s={0.7} opacity={ease(f, 96, 106)} />
    </svg>
  );
};

/* 193 — meeting at 10:00 */
export const Meeting: React.FC = () => {
  const f = useFrame();
  const sweep = ease(f, 24, 70, theme.ease.inOut);
  const min = (1 - sweep) * 38; // minute hand lands on 12
  const hr = 9 + sweep; // hour hand lands on 10
  const ring = Math.sin(f / 3) * 8 * (1 - ease(f, 86, 100));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <Floor />
      <Pop start={4} x={80} y={60} dy={40}>
        <CardBox x={0} y={0} w={440} h={470} r={32}>
          <rect width={440} height={90} rx={32} fill={c.primary} />
          <rect y={50} width={440} height={40} fill={c.primary} />
          <rect x={60} y={-18} width={14} height={40} rx={7} fill={c.dark} />
          <rect x={366} y={-18} width={14} height={40} rx={7} fill={c.dark} />
          {/* timeline rows */}
          {["09:00", "10:00", "11:00"].map((t, i) => (
            <g key={t} transform={`translate(0 ${120 + i * 112})`}>
              <text x={30} y={58} fontFamily={theme.fonts.en} fontWeight={700} fontSize={34} fill={i === 1 ? c.dark : c.muted}>{t}</text>
              <rect x={170} y={6} width={240} height={80} rx={20} fill={i === 1 ? c.soft : "#F5F5F5"} stroke={i === 1 ? c.primary : "transparent"} strokeWidth={4} />
              {i === 1 ? (
                <g opacity={ease(f, 50, 64)}>
                  <circle cx={214} cy={46} r={16} fill={c.primary} />
                  <circle cx={252} cy={46} r={16} fill={c.amber} />
                  <circle cx={290} cy={46} r={16} fill={c.dark} />
                </g>
              ) : (
                <Lines x={190} y={34} widths={[150]} color={c.border} h={14} />
              )}
            </g>
          ))}
        </CardBox>
      </Pop>
      <Pop start={14} x={700} y={250} dy={40} origin={[0, 0]}>
        <Breathe amp={4}><Clock x={0} y={0} r={120} hour={hr} min={min} /></Breathe>
      </Pop>
      {/* meeting notification */}
      <Pop start={60} x={560} y={430} dy={30} from={0.6}>
        <g transform={`rotate(${ring} 140 30)`}>
          <CardBox x={0} y={0} w={280} h={90} r={24} stroke={c.amber}>
            <path d="M 52 60 L 52 44 Q 52 22 70 20 Q 88 22 88 44 L 88 60 Z" fill={c.amber} />
            <circle cx={70} cy={68} r={6} fill={c.amber} />
            <Lines x={112} y={28} widths={[130, 90]} gap={24} />
          </CardBox>
        </g>
      </Pop>
    </svg>
  );
};

/* 194 — equipment ready */
export const Equipment: React.FC = () => {
  const f = useFrame();
  const items = [
    { y: 70, label: "wrench" },
    { y: 200, label: "helmet" },
    { y: 330, label: "drill" },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <Floor />
      <Pop start={4} x={60} y={30} dy={40}>
        <CardBox x={0} y={0} w={500} h={500} r={32}>
          <rect width={500} height={84} rx={32} fill={c.dark} />
          <rect y={44} width={500} height={40} fill={c.dark} />
          <rect x={30} y={30} width={26} height={26} rx={7} fill="none" stroke="#fff" strokeWidth={5} />
          <Lines x={76} y={38} widths={[180]} color="rgba(255,255,255,0.7)" h={12} />
          {items.map((it, i) => {
            const on = ease(f, 30 + i * 16, 42 + i * 16);
            return (
              <g key={it.label} transform={`translate(0 ${it.y + 30})`}>
                <rect x={30} y={20} width={440} height={96} rx={24} fill={on > 0.5 ? c.soft : "#F5F5F5"} />
                <Lines x={150} y={56} widths={[220]} h={14} color={on > 0.5 ? "#86EFAC" : c.border} />
                <Check x={420} y={68} r={26} progress={on} />
                <circle cx={420} cy={68} r={26} fill="none" stroke={c.border} strokeWidth={4} opacity={1 - on} />
              </g>
            );
          })}
        </CardBox>
      </Pop>
      {/* tools */}
      <Pop start={18} x={700} y={110} dy={50} from={0.6}>
        <g transform="rotate(35)">
          <rect x={-10} y={0} width={20} height={190} rx={10} fill={c.slate} />
          <circle cx={0} cy={0} r={42} fill={c.slate} />
          <rect x={-18} y={-52} width={36} height={44} rx={8} fill={c.bg} />
        </g>
      </Pop>
      <Pop start={28} x={640} y={400} dy={50} from={0.6}>
        <path d="M -70 0 Q -70 -90 0 -96 Q 70 -90 70 0 Z" fill={c.amber} />
        <rect x={-84} y={-8} width={168} height={22} rx={11} fill="#D97706" />
        <rect x={-12} y={-110} width={24} height={30} rx={8} fill="#D97706" />
      </Pop>
      <Pop start={38} x={820} y={410} dy={50} from={0.6}>
        <rect x={-70} y={-60} width={110} height={50} rx={16} fill={c.primary} />
        <rect x={40} y={-48} width={40} height={26} rx={8} fill={c.dark} />
        <rect x={-40} y={-18} width={34} height={70} rx={12} fill={c.dark} />
      </Pop>
      <Pop start={62} x={820} y={90} dy={20} from={0.3}><Check x={0} y={0} r={46} /></Pop>
      <Spark x={900} y={150} opacity={ease(f, 70, 80)} />
    </svg>
  );
};

/* 195 / 196 — generic Iqama card (fictional, no real data) */
const IqamaCard: React.FC<{ status: "expired" | "renewing" | "renewed"; t: number }> = ({ status, t }) => {
  const accent = status === "expired" ? c.danger : status === "renewing" ? c.amber : c.primary;
  return (
    <g>
      <IdCard x={0} y={0} w={480} h={300} accent={accent} stripe={accent} />
      {/* expiry-date indicator */}
      <g transform="translate(250 188)">
        <rect width={200} height={64} rx={16} fill={status === "expired" ? c.dangerSoft : status === "renewing" ? c.amberSoft : c.soft} />
        <rect x={16} y={16} width={32} height={32} rx={8} fill="none" stroke={accent} strokeWidth={4} />
        <rect x={16} y={16} width={32} height={9} rx={4} fill={accent} />
        <Lines x={64} y={26} widths={[110]} h={12} color={accent} />
      </g>
    </g>
  );
};

export const IqamaExpired: React.FC = () => {
  const f = useFrame();
  const stamp = ease(f, 40, 52, theme.ease.out);
  const shake = Math.sin(f * 1.4) * 5 * (1 - ease(f, 52, 62));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <Floor />
      <Pop start={4} x={240} y={110} dy={50} origin={[240, 150]}>
        <g transform={`rotate(${shake} 240 150)`}><IqamaCard status="expired" t={f} /></g>
      </Pop>
      {/* expired stamp (icon only) */}
      <g transform={`translate(640 380) rotate(-14) scale(${0.5 + 0.5 * stamp})`} opacity={stamp}>
        <circle r={78} fill="rgba(220,38,38,0.08)" stroke={c.danger} strokeWidth={10} />
        <circle r={58} fill="none" stroke={c.danger} strokeWidth={4} strokeDasharray="10 8" />
        <path d="M -30 -30 L 30 30 M 30 -30 L -30 30" stroke={c.danger} strokeWidth={14} strokeLinecap="round" />
      </g>
      <Pop start={60} x={170} y={470} dy={20} from={0.5}>
        <rect width={120} height={16} rx={8} fill={c.danger} opacity={0.2} />
        <rect width={120 * ease(f, 62, 90)} height={16} rx={8} fill={c.danger} />
      </Pop>
    </svg>
  );
};

export const IqamaRenew: React.FC = () => {
  const f = useFrame();
  const turn = ease(f, 20, 80, theme.ease.inOut);
  const done = ease(f, 82, 94, theme.ease.out);
  const accent = done > 0.5 ? "renewed" : turn > 0.05 ? "renewing" : "expired";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <Floor />
      <Pop start={2} x={240} y={110} dy={40}>
        <IqamaCard status={accent as "expired" | "renewing" | "renewed"} t={f} />
      </Pop>
      {/* renewal arrows */}
      <g transform="translate(780 260)">
        <g transform={`rotate(${turn * 360})`} opacity={ease(f, 12, 24)}>
          <path d="M 0 -70 A 70 70 0 1 1 -66 24" fill="none" stroke={c.primary} strokeWidth={16} strokeLinecap="round" />
          <path d="M -86 -2 L -62 34 L -38 -2 Z" fill={c.primary} transform="rotate(8 -62 24)" />
        </g>
        <Check x={0} y={0} r={36} progress={done} />
      </g>
      <Spark x={820} y={160} opacity={done} />
      <Spark x={700} y={380} s={0.7} opacity={done} />
    </svg>
  );
};

/* 197 — driving licence */
export const License: React.FC = () => {
  const f = useFrame();
  const drive = ease(f, 30, 90, theme.ease.out);
  const spin = ease(f, 20, 70, theme.ease.inOut) * 35;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <Floor />
      <Pop start={4} x={60} y={70} dy={50}>
        <Breathe amp={3}><IdCard x={0} y={0} w={500} h={310} accent={c.primary} stripe={c.primary} /></Breathe>
      </Pop>
      {/* steering wheel */}
      <Pop start={18} x={780} y={190} dy={40} from={0.5}>
        <g transform={`rotate(${spin})`}>
          <circle r={96} fill="none" stroke={c.dark} strokeWidth={22} />
          <circle r={20} fill={c.dark} />
          <path d="M -90 10 L -20 10 M 90 10 L 20 10 M 0 20 L 0 90" stroke={c.dark} strokeWidth={20} strokeLinecap="round" />
        </g>
      </Pop>
      {/* car */}
      <g transform={`translate(${-260 + drive * 410} 440)`}>
        <rect x={0} y={20} width={300} height={70} rx={26} fill={c.amber} />
        <path d="M 50 22 Q 70 -34 120 -34 L 190 -34 Q 232 -34 250 22 Z" fill="#FBBF24" />
        <path d="M 78 14 Q 90 -18 122 -18 L 146 -18 L 146 14 Z M 160 14 L 160 -18 L 188 -18 Q 212 -16 226 14 Z" fill="#FEF3C7" />
        <circle cx={78} cy={92} r={30} fill={c.slate} /><circle cx={78} cy={92} r={12} fill="#CBD5E1" />
        <circle cx={226} cy={92} r={30} fill={c.slate} /><circle cx={226} cy={92} r={12} fill="#CBD5E1" />
      </g>
      <Pop start={90} x={620} y={400} dy={20} from={0.4}><Check x={0} y={0} r={34} /></Pop>
    </svg>
  );
};

/* 198 — looking for another job */
export const JobSearch: React.FC = () => {
  const f = useFrame();
  const out = ease(f, 26, 62, theme.ease.inOut);
  const scan = ease(f, 40, 100, theme.ease.inOut);
  const jobCard = (i: number, x: number, y: number, hl: boolean) => (
    <Pop key={i} start={30 + i * 10} x={x} y={y} dx={60} dy={0} from={0.8}>
      <CardBox x={0} y={0} w={320} h={110} r={24} stroke={hl ? c.primary : c.border} fill={hl ? c.soft : c.white}>
        <rect x={20} y={22} width={66} height={66} rx={18} fill={hl ? c.primary : c.border} />
        <Briefcase x={53} y={58} s={0.42} color={hl ? "#fff" : c.muted} />
        <Lines x={108} y={34} widths={[170, 110]} gap={26} color={hl ? "#86EFAC" : c.border} h={14} />
        {hl && <Check x={290} y={30} r={14} />}
      </CardBox>
    </Pop>
  );
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <Floor />
      <Pop start={4} x={170} y={H - 22} dy={60} origin={[0, -100]}>
        <Breathe amp={3}><Person x={0} y={0} kind="employee" scale={1.05} armR={[96, -76]} /></Breathe>
      </Pop>
      {/* current job leaves */}
      <g transform={`translate(${290 - out * 80} 70)`} opacity={1 - out * 0.9}>
        <CardBox x={0} y={0} w={190} h={120} r={22}><Briefcase x={95} y={64} s={0.8} color={c.muted} /></CardBox>
      </g>
      {jobCard(0, 570, 40, false)}
      {jobCard(1, 570, 180, true)}
      {jobCard(2, 570, 320, false)}
      {/* magnifier */}
      <g transform={`translate(${360 + scan * 240} ${290 - Math.sin(scan * Math.PI) * 40 + scan * 20})`} opacity={ease(f, 36, 48)}>
        <circle r={44} fill="rgba(255,255,255,0.55)" stroke={c.dark} strokeWidth={12} />
        <path d="M 32 32 L 74 74" stroke={c.dark} strokeWidth={16} strokeLinecap="round" />
      </g>
    </svg>
  );
};

/* 199 — salary is good */
export const Salary: React.FC = () => {
  const f = useFrame();
  const coins = [0, 1, 2, 3, 4];
  const up = ease(f, 40, 80, theme.ease.out);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <Floor />
      <Pop start={4} x={80} y={50} dy={50}>
        <CardBox x={0} y={0} w={470} h={470} r={32}>
          <rect width={470} height={90} rx={32} fill={c.primary} />
          <rect y={50} width={470} height={40} fill={c.primary} />
          <circle cx={50} cy={45} r={20} fill="rgba(255,255,255,0.9)" />
          <Lines x={86} y={32} widths={[150, 90]} gap={20} color="rgba(255,255,255,0.7)" h={9} />
          <Lines x={36} y={130} widths={[250, 200, 230]} gap={38} h={14} />
          <rect x={30} y={290} width={410} height={140} rx={24} fill={c.soft} />
          <circle cx={100} cy={360} r={44} fill={c.amber} />
          <circle cx={100} cy={360} r={30} fill="none" stroke="#fff" strokeWidth={6} />
          <rect x={86} y={340} width={28} height={40} rx={6} fill="#fff" opacity={0.9} />
          <Lines x={170} y={332} widths={[220, 150]} gap={34} color="#86EFAC" h={18} />
          
        </CardBox>
      </Pop>
      {/* coin stack grows */}
      <g transform="translate(700 470)">
        {coins.map((i) => {
          const on = ease(f, 26 + i * 8, 38 + i * 8, theme.ease.out);
          return (
            <g key={i} transform={`translate(0 ${-i * 34 - (1 - on) * 60})`} opacity={on}>
              <ellipse cx={0} cy={14} rx={92} ry={26} fill="#D97706" />
              <rect x={-92} y={-12} width={184} height={26} fill="#D97706" />
              <ellipse cx={0} cy={-12} rx={92} ry={26} fill={c.amber} />
              <ellipse cx={0} cy={-12} rx={62} ry={16} fill="none" stroke="#FDE68A" strokeWidth={5} />
            </g>
          );
        })}
      </g>
      {/* positive arrow */}
      <g transform={`translate(790 ${150 - up * 20})`} opacity={up}>
        <circle r={54} fill={c.primary} />
        <path d="M 0 28 L 0 -22 M -24 -2 L 0 -26 L 24 -2" stroke="#fff" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  );
};

/* 200 — warm, respectful blessing (abstract, no religious imagery) */
export const Blessing: React.FC = () => {
  const f = useFrame();
  const glow = 0.55 + useBreath(0.12, 80);
  const rays = Array.from({ length: 9 });
  const drift = (i: number) => {
    const p = ease(f, 40 + i * 10, 110 + i * 10, theme.ease.inOut);
    return { x: 300 + i * 20 + p * (200 - i * 20), y: 90 + p * 170, o: Math.min(ease(f, 40 + i * 10, 52 + i * 10), 1 - ease(f, 100 + i * 10, 112 + i * 10)) };
  };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <Floor />
      {/* soft warm light above */}
      <g transform="translate(480 120)" opacity={glow}>
        <circle r={190} fill="url(#glow)" />
        <defs>
          <radialGradient id="glow"><stop offset="0%" stopColor="#FDE68A" stopOpacity={0.95} /><stop offset="100%" stopColor="#FDE68A" stopOpacity={0} /></radialGradient>
        </defs>
        {rays.map((_, i) => (
          <rect key={i} x={-5} y={-200} width={10} height={70} rx={5} fill={c.amber} opacity={0.35} transform={`rotate(${-80 + i * 20})`} />
        ))}
      </g>
      <Pop start={6} x={250} y={H - 22} dy={60} origin={[0, -100]}>
        <Breathe amp={3}><Person x={0} y={0} kind="colleague" scale={1.1} armL={[-64, -52]} armR={[52, -92]} /></Breathe>
      </Pop>
      <Pop start={12} x={710} y={H - 22} dy={60} origin={[0, -100]}>
        <Breathe amp={3} phase={30}><Person x={0} y={0} kind="employee" flip scale={1.1} armL={[-62, -86]} armR={[64, -52]} /></Breathe>
      </Pop>
      {/* gentle provision: coins / sparks drifting toward the receiver */}
      {[0, 1, 2, 3].map((i) => {
        const d = drift(i);
        return (
          <g key={i} transform={`translate(${d.x + 120} ${d.y})`} opacity={d.o}>
            <circle r={22} fill={c.amber} /><circle r={14} fill="none" stroke="#FDE68A" strokeWidth={4} />
          </g>
        );
      })}
      <Spark x={480} y={300} s={1.1} opacity={ease(f, 50, 62) * 0.9} />
      <Spark x={420} y={250} s={0.7} opacity={ease(f, 60, 72) * 0.8} rot={20} />
      <Spark x={540} y={240} s={0.8} opacity={ease(f, 70, 82) * 0.8} rot={-15} />
    </svg>
  );
};
