import React from "react";
import { interpolate } from "remotion";
import { theme } from "../theme";
import { useFloat, ramp } from "../animations/presets";
import { Avatar, Bolt, Bubble, C, Charger, Handset, IllusProps, Phone, QMark, WifiGlyph, arcPath, clamp01, useSp } from "./atoms";

/* 81 — low battery + charging cable */
export const LowBattery: React.FC<IllusProps> = ({ ar, m, dur }) => {
  const { f, sp } = useSp();
  const float = useFloat(80, 7);
  const ent = sp(0, "bouncy");
  const blink = 0.6 + 0.4 * Math.sin(f / 4.5);
  const plugAt = Math.min(m + 24, dur - 64);
  const slide = ramp(f, plugAt, plugAt + 26);
  const plugged = sp(plugAt + 22, "bouncy");
  const level = interpolate(plugged, [0, 1], [0.08, 0.42], { extrapolateRight: "clamp" });
  const lowCol = level > 0.2 ? C.primary : C.accent;
  const py = interpolate(slide, [0, 1], [640, 452]);
  const alert = sp(ar - 20, "bouncy");
  return (
    <g>
      <g transform={`translate(0 ${float}) scale(1)`} style={{ transformOrigin: "300px 260px", transform: `translateY(${float}px) scale(${interpolate(ent, [0, 1], [0.7, 1])})` }}>
        <Phone id="lb" cx={300} cy={232} w={240} h={440} rot={-3}>
          <rect x={-120} y={-220} width={240} height={440} fill={C.screen} />
          <g opacity={level > 0.2 ? 1 : blink}>
            <rect x={-74} y={-44} width={148} height={80} rx={20} fill="none" stroke={C.text} strokeWidth={9} />
            <rect x={78} y={-20} width={16} height={32} rx={6} fill={C.text} />
            <rect x={-64} y={-34} width={Math.max(10, 128 * level)} height={60} rx={12} fill={lowCol} />
          </g>
          <text x={0} y={104} textAnchor="middle" fontFamily={theme.fonts.latin} fontWeight={700} fontSize={50} fill={lowCol} style={{ fontVariantNumeric: "tabular-nums" }}>
            {Math.round(level * 100)}%
          </text>
          {plugged > 0.05 && <g transform={`translate(0 ${-110}) scale(${plugged})`}><Bolt x={0} y={0} s={1.7} /></g>}
        </Phone>
      </g>
      {/* cable */}
      <g>
        <path d={`M300 ${py + 40} C300 ${py + 140} 420 ${py + 90} 470 640`} fill="none" stroke={C.text} strokeWidth={11} strokeLinecap="round" />
        <rect x={278} y={py - 34} width={44} height={74} rx={10} fill={C.text} />
        <rect x={289} y={py - 56} width={22} height={26} rx={5} fill={C.textSoft} />
      </g>
      <g transform={`translate(468 110) scale(${alert})`}>
        <circle r={36} fill={C.accent} stroke={C.text} strokeWidth={6} />
        <text y={16} textAnchor="middle" fontFamily={theme.fonts.latin} fontWeight={700} fontSize={50} fill={C.text}>!</text>
      </g>
    </g>
  );
};

/* 82 — ask for an iPhone charger */
export const ChargerAsk: React.FC<IllusProps> = ({ ar, m }) => {
  const { f, sp } = useSp();
  const bob = useFloat(70, 5);
  const bubble = sp(ar - 6, "bouncy");
  const offer = ramp(f, m, m + 24);
  const ax = sp(0, "smooth");
  const cx = interpolate(offer, [0, 1], [455, 360]);
  const chRot = interpolate(offer, [0, 1], [8, -6]);
  return (
    <g>
      <g transform={`translate(${interpolate(ax, [0, 1], [-80, 0])} ${bob * 0.6})`} opacity={clamp01(ax)}>
        <Avatar x={130} y={300} shirt={C.primary} />
      </g>
      <g transform={`translate(${interpolate(ax, [0, 1], [80, 0])} ${-bob * 0.6})`} opacity={clamp01(ax)}>
        <Avatar x={480} y={310} shirt={C.accent} />
      </g>
      <g transform={`translate(150 ${150}) scale(${bubble})`} style={{ transformOrigin: "0 0" }}>
        <g transform="translate(-100 -90)">
          <Bubble x={0} y={0} w={250} h={140} tail="left">
            <Charger x={92} y={78} s={0.62} />
            <QMark x={178} y={104} size={84} />
          </Bubble>
        </g>
      </g>
      <Charger x={cx} y={330} s={1.05} rot={chRot} />
      <g opacity={ramp(f, m, m + 8)}>
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${300 - i * 12} ${380 - i * 24} l-22 0`} stroke={C.primary} strokeWidth={6} strokeLinecap="round" opacity={0.7 - i * 0.2} />
        ))}
      </g>
    </g>
  );
};

/* 83 — Wi-Fi router + password question */
export const WifiPassword: React.FC<IllusProps> = ({ ar }) => {
  const { f, sp } = useSp();
  const ent = sp(0, "smooth");
  const card = sp(ar - 2, "bouncy");
  const op = (i: number): number => 0.22 + 0.78 * clamp01(Math.sin((f / 14) * 1 - i * 0.9) * 0.5 + 0.5);
  const dots = 6;
  const reveal = ramp(f, ar + 10, ar + 10 + dots * 4);
  return (
    <g>
      <g style={{ transformOrigin: "300px 400px", transform: `scale(${interpolate(ent, [0, 1], [0.8, 1])})`, opacity: clamp01(ent) }}>
        <rect x={150} y={238} width={14} height={110} rx={7} fill={C.text} transform="rotate(-8 157 348)" />
        <rect x={436} y={238} width={14} height={110} rx={7} fill={C.text} transform="rotate(8 443 348)" />
        <WifiGlyph cx={300} cy={318} r={44} sw={15} opacities={[op(0), op(1), op(2)]} />
        <rect x={100} y={342} width={400} height={104} rx={30} fill={C.text} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={168 + i * 44} cy={394} r={10} fill={i === 1 ? C.accent : C.primary} opacity={0.5 + 0.5 * Math.abs(Math.sin(f / 7 + i))} />
        ))}
        <rect x={376} y={380} width={96} height={26} rx={13} fill={C.textSoft} />
      </g>
      <g transform={`translate(300 100) scale(${card})`}>
        <rect x={-210} y={-52} width={420} height={104} rx={34} fill={C.white} stroke={C.text} strokeWidth={6} />
        <g transform="translate(-160 0)">
          <path d="M-12 -4 V-16 C-12 -34 12 -34 12 -16 V-4" fill="none" stroke={C.primary} strokeWidth={8} strokeLinecap="round" />
          <rect x={-22} y={-6} width={44} height={36} rx={9} fill={C.primary} />
          <circle cx={0} cy={11} r={5} fill={C.white} />
        </g>
        {Array.from({ length: dots }).map((_, i) => (
          <circle key={i} cx={-100 + i * 40} cy={0} r={11} fill={C.text} opacity={clamp01(reveal * dots - i)} />
        ))}
        <g transform="translate(168 0)">
          <circle r={30} fill={C.accent} stroke={C.text} strokeWidth={5} />
          <text y={16} textAnchor="middle" fontFamily={theme.fonts.latin} fontWeight={700} fontSize={44} fill={C.text}>?</text>
        </g>
      </g>
    </g>
  );
};

/* 84 — weak internet */
export const WeakSignal: React.FC<IllusProps> = ({ ar }) => {
  const { f, sp } = useSp();
  const ent = sp(0, "bouncy");
  const drop = ramp(f, ar, ar + 70, theme.ease.inOut);
  const lv = 3 - drop * 2; // 3 -> 1
  const flick = 0.55 + 0.45 * Math.sin(f / 3.2);
  const opac = (i: number): [number, number] => {
    const on = clamp01(lv - i);
    return [on, on];
  };
  const arcs: [number, number, number] = [0, 1, 2].map((i) => {
    const [o] = opac(i);
    const base = 0.16 + 0.84 * o;
    return i === 0 && drop > 0.9 ? 0.16 + 0.84 * flick : base;
  }) as [number, number, number];
  const barsLit = Math.max(1, Math.round(lv + 0.3));
  const spin = (f * 9) % 360;
  const warn = sp(ar + 40, "bouncy");
  return (
    <g style={{ transformOrigin: "300px 260px", transform: `scale(${interpolate(ent, [0, 1], [0.75, 1])})`, opacity: clamp01(ent) }}>
      <circle cx={300} cy={236} r={188} fill={C.primarySoft} />
      <WifiGlyph cx={300} cy={300} r={58} sw={20} opacities={arcs} color={drop > 0.5 ? C.accent : C.primary} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={196 + i * 54} y={430 - (i + 1) * 28} width={34} height={(i + 1) * 28} rx={9} fill={i < barsLit ? (drop > 0.5 ? C.accent : C.primary) : C.primaryMid} stroke={C.text} strokeWidth={4} />
      ))}
      <g transform={`translate(470 136) rotate(${spin})`}>
        <circle r={30} fill="none" stroke={C.primaryMid} strokeWidth={10} />
        <path d={arcPath(0, 0, 30, -90, 60)} fill="none" stroke={C.accent} strokeWidth={10} strokeLinecap="round" />
      </g>
      <g transform={`translate(130 150) scale(${warn})`}>
        <path d="M0 -40 L42 30 H-42 Z" fill={C.accent} stroke={C.text} strokeWidth={6} strokeLinejoin="round" />
        <text y={20} textAnchor="middle" fontFamily={theme.fonts.latin} fontWeight={700} fontSize={42} fill={C.text}>!</text>
      </g>
    </g>
  );
};

/* 85 — incoming call -> missed call */
export const MissedCall: React.FC<IllusProps> = ({ m }) => {
  const { f, sp } = useSp();
  const ent = sp(0, "smooth");
  const ringing = f < m;
  const shake = ringing ? Math.sin(f * 1.9) * 3.4 * (1 - ramp(f, m - 10, m)) : 0;
  const card = sp(m - 4, "bouncy");
  return (
    <g>
      {ringing &&
        [0, 1, 2].map((i) => {
          const t = ((f + i * 14) % 42) / 42;
          return <rect key={i} x={170 - t * 70} y={30 - t * 70} width={260 + t * 140} height={440 + t * 140} rx={50 + t * 40} fill="none" stroke={C.primary} strokeWidth={6} opacity={(1 - t) * 0.55} />;
        })}
      <g style={{ transformOrigin: "300px 250px", transform: `scale(${interpolate(ent, [0, 1], [0.8, 1])})`, opacity: clamp01(ent) }}>
        <Phone id="mc" cx={300} cy={250} w={250} h={450} rot={shake}>
          <circle cx={0} cy={-100} r={50} fill={C.primarySoft} />
          <circle cx={0} cy={-114} r={17} fill={C.primary} />
          <path d="M-32 -64 C-32 -86 32 -86 32 -64 Z" fill={C.primary} />
          <rect x={-66} y={-30} width={132} height={18} rx={9} fill={C.textSoft} />
          <rect x={-42} y={2} width={84} height={12} rx={6} fill={C.line} />
          <circle cx={-60} cy={120} r={38} fill={C.text} />
          <path d="M-74 120 H-46" stroke={C.white} strokeWidth={8} strokeLinecap="round" />
          <circle cx={60} cy={120} r={38} fill={C.primary} />
          <Handset x={60} y={120} s={0.9} />
        </Phone>
      </g>
      <g transform={`translate(300 ${interpolate(card, [0, 1], [-120, 92])})`} opacity={clamp01(card)}>
        <rect x={-220} y={-52} width={440} height={104} rx={32} fill={C.white} stroke={C.text} strokeWidth={6} />
        <circle cx={-150} cy={0} r={34} fill={C.accent} stroke={C.text} strokeWidth={5} />
        <g transform="rotate(135 -150 0)"><Handset x={-150} y={0} s={0.85} color={C.text} /></g>
        <text x={-96} y={-4} fontFamily={theme.fonts.latin} fontWeight={700} fontSize={38} fill={C.text}>Missed call</text>
        <rect x={-96} y={12} width={150} height={12} rx={6} fill={C.line} />
        <circle cx={172} cy={0} r={24} fill={C.accent} stroke={C.text} strokeWidth={4} />
        <text x={172} y={12} textAnchor="middle" fontFamily={theme.fonts.latin} fontWeight={700} fontSize={32} fill={C.text}>1</text>
      </g>
    </g>
  );
};
