import React from "react";
import { interpolate } from "remotion";
import { theme } from "../theme";
import { useFloat, ramp } from "../animations/presets";
import { Avatar, Bubble, C, IllusProps, PhotoArt, Phone, Pin, QMark, WifiGlyph, clamp01, useSp } from "./atoms";

/* 86 — phone on silent */
export const SilentMode: React.FC<IllusProps> = ({ ar }) => {
  const { f, sp } = useSp();
  const ent = sp(0, "bouncy");
  const sw = ramp(f, ar + 6, ar + 22);
  const slash = ramp(f, ar + 10, ar + 34);
  const ring = 1 - ramp(f, ar + 6, ar + 28);
  const wob = Math.sin(f * 1.7) * 7 * ring;
  const float = useFloat(90, 6);
  return (
    <g>
      <g style={{ transformOrigin: "300px 260px", transform: `translateY(${float}px) scale(${interpolate(ent, [0, 1], [0.75, 1])})`, opacity: clamp01(ent) }}>
        <rect x={168} y={74 + 36 + sw * 26} width={14} height={62} rx={7} fill={C.accent} stroke={C.text} strokeWidth={4} />
        <Phone id="sm" cx={300} cy={250} w={250} h={450}>
          <g transform={`rotate(${wob} 0 -50)`}>
            <path d="M0 -92 C-40 -92 -62 -60 -62 -20 V26 L-84 58 H84 L62 26 V-20 C62 -60 40 -92 0 -92 Z" fill={C.primary} stroke={C.text} strokeWidth={8} strokeLinejoin="round" />
            <circle cx={0} cy={80} r={17} fill={C.text} />
            <circle cx={0} cy={-102} r={9} fill={C.text} />
          </g>
          <line x1={-96} y1={-96} x2={96} y2={96} stroke={C.white} strokeWidth={30} strokeLinecap="round" strokeDasharray={272} strokeDashoffset={272 * (1 - slash)} />
          <line x1={-96} y1={-96} x2={96} y2={96} stroke={C.accent} strokeWidth={14} strokeLinecap="round" strokeDasharray={272} strokeDashoffset={272 * (1 - slash)} />
        </Phone>
      </g>
      {[0, 1, 2].map((i) => {
        const t = ramp(f, ar + 30 + i * 12, ar + 80 + i * 12, theme.ease.inOut);
        return (
          <text key={i} x={440 + i * 24 + Math.sin(f / 10 + i) * 6} y={170 - t * 90 - i * 30} fontFamily={theme.fonts.latin} fontWeight={700} fontSize={44 + i * 10} fill={C.primary} opacity={Math.sin(Math.PI * t) * 0.9} stroke={C.text} strokeWidth={2.5} paintOrder="stroke">
            z
          </text>
        );
      })}
    </g>
  );
};

/* 87 — WhatsApp-style chat with a location pin */
export const SendLocation: React.FC<IllusProps> = ({ ar }) => {
  const { f, sp } = useSp();
  const ent = sp(0, "smooth");
  const out = sp(ar + 4, "bouncy");
  const pinDrop = sp(ar + 16, "bouncy");
  const ticks = ramp(f, ar + 44, ar + 56);
  const inc = sp(ar - 14, "smooth");
  return (
    <g>
      <g style={{ transformOrigin: "300px 270px", transform: `scale(${interpolate(ent, [0, 1], [0.8, 1])})`, opacity: clamp01(ent) }}>
        <Phone id="sl" cx={300} cy={264} w={290} h={450}>
          <rect x={-150} y={-240} width={300} height={480} fill={C.primarySoft} />
          <rect x={-150} y={-240} width={300} height={92} fill={C.primary} />
          <circle cx={-100} cy={-186} r={25} fill={C.white} />
          <circle cx={-100} cy={-193} r={9} fill={C.primary} />
          <path d="M-114 -170 C-114 -184 -86 -184 -86 -170 Z" fill={C.primary} />
          <rect x={-60} y={-196} width={110} height={14} rx={7} fill={C.white} />
          <rect x={-60} y={-174} width={66} height={10} rx={5} fill={C.white} opacity={0.6} />
          <g transform={`translate(0 ${interpolate(inc, [0, 1], [30, 0])})`} opacity={clamp01(inc)}>
            <rect x={-132} y={-120} width={150} height={48} rx={20} fill={C.white} stroke={C.line} strokeWidth={3} />
            <rect x={-114} y={-102} width={90} height={12} rx={6} fill={C.textSoft} />
          </g>
          <g transform={`translate(0 ${interpolate(out, [0, 1], [50, 0])})`} opacity={clamp01(out)}>
            <rect x={-30} y={-48} width={160} height={196} rx={24} fill={C.white} stroke={C.primary} strokeWidth={4} />
            <rect x={-20} y={-38} width={140} height={116} rx={16} fill={C.screen} />
            <path d="M-20 22 H120 M30 -38 V78 M-20 -8 L120 36" stroke={C.primaryMid} strokeWidth={8} fill="none" />
            <path d="M-20 52 L120 8" stroke={C.accentSoft} strokeWidth={9} />
            <g transform={`translate(50 ${interpolate(pinDrop, [0, 1], [-190, 8])})`} opacity={clamp01(pinDrop * 2)}>
              <Pin x={0} y={0} s={0.9} />
            </g>
            <ellipse cx={50} cy={50} rx={interpolate(clamp01(pinDrop), [0, 1], [4, 22])} ry={6} fill={C.text} opacity={0.18} />
            <rect x={-8} y={96} width={96} height={12} rx={6} fill={C.textSoft} />
            <rect x={-8} y={118} width={56} height={10} rx={5} fill={C.line} />
            <g opacity={ticks} transform="translate(98 132)">
              <path d="M0 0 l7 8 l15 -16 M12 0 l7 8 l15 -16" fill="none" stroke={C.primary} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        </Phone>
      </g>
    </g>
  );
};

/* 88 — photo gallery -> picture card */
export const Gallery: React.FC<IllusProps> = ({ ar }) => {
  const { f, sp } = useSp();
  const ent = sp(0, "smooth");
  const open = sp(ar + 22, "bouncy");
  const dim = ramp(f, ar + 18, ar + 34);
  const tints = [C.primaryMid, C.accentSoft, C.primarySoft, C.accentSoft, C.primaryMid, C.primarySoft];
  const pulse = 1 + Math.sin(f / 6) * 0.03;
  const float = useFloat(80, 5);
  return (
    <g>
      <g style={{ transformOrigin: "300px 260px", transform: `scale(${interpolate(ent, [0, 1], [0.85, 1])})`, opacity: clamp01(ent) * (1 - dim * 0.55) }}>
        <rect x={80} y={50} width={440} height={400} rx={40} fill={C.white} stroke={C.text} strokeWidth={6} />
        {[0, 1, 2].map((i) => <circle key={i} cx={122 + i * 26} cy={86} r={8} fill={i === 0 ? C.accent : i === 1 ? C.primary : C.primaryMid} />)}
        {tints.map((t, i) => {
          const col = i % 3, row = Math.floor(i / 3);
          const x = 104 + col * 132, y = 122 + row * 150;
          const sel = i === 4;
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <g transform={sel ? `translate(60 60) scale(${pulse}) translate(-60 -60)` : undefined}>
                <PhotoArt w={120} h={130} rx={18} tint={t} />
                {sel && <rect width={120} height={130} rx={18} fill="none" stroke={C.primary} strokeWidth={7} />}
              </g>
            </g>
          );
        })}
      </g>
      <g transform={`translate(300 ${262 + float}) rotate(${interpolate(open, [0, 1], [10, -4])}) scale(${interpolate(open, [0, 1], [0.2, 1])})`} opacity={clamp01(open * 1.5)}>
        <rect x={-168} y={-196} width={336} height={394} rx={30} fill={C.text} opacity={0.12} transform="translate(10 16)" />
        <rect x={-168} y={-196} width={336} height={394} rx={30} fill={C.white} stroke={C.text} strokeWidth={6} />
        <g transform="translate(-140 -168)"><PhotoArt w={280} h={266} rx={18} tint={C.primaryMid} /></g>
        <rect x={-100} y={134} width={150} height={16} rx={8} fill={C.textSoft} />
        <rect x={-100} y={162} width={90} height={12} rx={6} fill={C.line} />
        <circle cx={122} cy={152} r={20} fill={C.accent} stroke={C.text} strokeWidth={4} />
      </g>
    </g>
  );
};

/* 89 — knocking on the door */
export const Knock: React.FC<IllusProps> = ({ ar }) => {
  const { f, sp } = useSp();
  const ent = sp(0, "smooth");
  const q = sp(ar - 8, "bouncy");
  const cyc = ((Math.max(0, f - 6) % 48) / 48);
  const hit = cyc < 0.58 ? Math.pow(Math.abs(Math.sin((cyc / 0.58) * Math.PI * 2)), 1.4) : 0;
  const off = -hit * 40;
  return (
    <g>
      <g style={{ transformOrigin: "300px 260px", transform: `scale(${interpolate(ent, [0, 1], [0.85, 1])})`, opacity: clamp01(ent) }}>
        <rect x={150} y={36} width={300} height={440} rx={22} fill={C.textSoft} />
        <rect x={170} y={58} width={260} height={400} rx={14} fill={C.primary} stroke={C.text} strokeWidth={7} />
        <rect x={198} y={90} width={204} height={140} rx={10} fill="none" stroke={C.white} strokeWidth={5} opacity={0.55} />
        <rect x={198} y={262} width={204} height={160} rx={10} fill="none" stroke={C.white} strokeWidth={5} opacity={0.55} />
        <circle cx={398} cy={252} r={20} fill={C.accent} stroke={C.text} strokeWidth={5} />
        <circle cx={300} cy={150} r={22} fill={C.white} stroke={C.text} strokeWidth={5} />
      </g>
      {/* knock marks */}
      <g opacity={hit > 0.6 ? 1 : 0}>
        {[-1, 0, 1].map((i) => (
          <line key={i} x1={426} y1={230 + i * 34} x2={426 - 26} y2={230 + i * 34 + i * 12} stroke={C.accent} strokeWidth={8} strokeLinecap="round" />
        ))}
      </g>
      {/* fist */}
      <g transform={`translate(${486 + off} 232)`} opacity={clamp01(ent)}>
        <rect x={20} y={-30} width={220} height={60} rx={26} fill={C.white} stroke={C.text} strokeWidth={7} />
        <rect x={-50} y={-46} width={104} height={92} rx={34} fill={C.white} stroke={C.text} strokeWidth={7} />
        {[-24, 0, 24].map((y) => <path key={y} d={`M-50 ${y + 6} H-18`} stroke={C.text} strokeWidth={5} strokeLinecap="round" />)}
        <rect x={20} y={-30} width={36} height={60} fill={C.primary} opacity={0.0} />
      </g>
      <g transform={`translate(110 80) scale(${q})`}>
        <circle r={44} fill={C.white} stroke={C.text} strokeWidth={6} />
        <text y={22} textAnchor="middle" fontFamily={theme.fonts.latin} fontWeight={700} fontSize={64} fill={C.accent} stroke={C.text} strokeWidth={4} paintOrder="stroke">?</text>
      </g>
    </g>
  );
};

/* 90 — door opens, who is outside? */
export const DoorOpen: React.FC<IllusProps> = ({ ar, m }) => {
  const { f, sp } = useSp();
  const ent = sp(0, "smooth");
  const o = sp(ar + 14, "smooth");
  const eye = sp(ar + 40, "bouncy");
  const q = sp(m - 10, "bouncy");
  const look = Math.sin(f / 14) * 7;
  const lean = ramp(f, ar + 24, ar + 54);
  return (
    <g>
      <g style={{ transformOrigin: "300px 260px", transform: `scale(${interpolate(ent, [0, 1], [0.85, 1])})`, opacity: clamp01(ent) }}>
        <rect x={150} y={36} width={300} height={440} rx={22} fill={C.textSoft} />
        <clipPath id="door-in"><rect x={170} y={58} width={260} height={400} rx={14} /></clipPath>
        <g clipPath="url(#door-in)">
          <rect x={170} y={58} width={260} height={400} fill={C.white} />
          <rect x={170} y={58} width={260} height={400} fill={C.primaryMid} />
          <g transform={`translate(${interpolate(lean, [0, 1], [30, 0])} ${interpolate(lean, [0, 1], [30, 0])})`}>
            <path d="M205 460 C205 340 250 300 300 300 C350 300 395 340 395 460 Z" fill={C.accent} stroke={C.text} strokeWidth={7} />
            <circle cx={300} cy={236} r={52} fill={C.white} stroke={C.text} strokeWidth={7} />
            <circle cx={282 + look * 0.4} cy={232} r={6} fill={C.text} />
            <circle cx={318 + look * 0.4} cy={232} r={6} fill={C.text} />
            <path d="M284 258 Q300 270 316 258" fill="none" stroke={C.text} strokeWidth={5} strokeLinecap="round" />
          </g>
        </g>
        <g transform={`translate(170 58) scale(${interpolate(o, [0, 1], [1, 0.2])} 1) skewY(${interpolate(o, [0, 1], [0, -10])})`}>
          <rect width={260} height={400} rx={14} fill={C.primary} stroke={C.text} strokeWidth={7} />
          <rect x={28} y={32} width={204} height={140} rx={10} fill="none" stroke={C.white} strokeWidth={5} opacity={0.55} />
          <rect x={28} y={204} width={204} height={160} rx={10} fill="none" stroke={C.white} strokeWidth={5} opacity={0.55} />
          <circle cx={228} cy={194} r={20} fill={C.accent} stroke={C.text} strokeWidth={5} />
        </g>
      </g>
      <g transform={`translate(496 150) scale(${eye})`}>
        <circle r={62} fill={C.white} stroke={C.text} strokeWidth={6} />
        <path d="M-36 0 Q0 -34 36 0 Q0 34 -36 0 Z" fill="none" stroke={C.text} strokeWidth={6} strokeLinejoin="round" />
        <circle cx={look} cy={0} r={11} fill={C.primary} stroke={C.text} strokeWidth={3} />
      </g>
      <g transform={`translate(104 96) scale(${q})`}>
        <circle r={44} fill={C.white} stroke={C.text} strokeWidth={6} />
        <text y={22} textAnchor="middle" fontFamily={theme.fonts.latin} fontWeight={700} fontSize={64} fill={C.accent} stroke={C.text} strokeWidth={4} paintOrder="stroke">?</text>
      </g>
    </g>
  );
};

/* ------- hero clusters for thumbnail / intro ------- */
export const HeroCluster: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const { f, sp } = useSp();
  const a = sp(delay, "bouncy");
  const b = sp(delay + 6, "bouncy");
  const c = sp(delay + 12, "bouncy");
  const d = sp(delay + 18, "bouncy");
  const e = sp(delay + 24, "bouncy");
  const fl = (p: number, amp = 8) => Math.sin(f / 26 + p) * amp;
  return (
    <g>
      <g transform={`translate(0 ${fl(0, 6)}) `} style={{ transformOrigin: "300px 260px", transform: `translateY(${fl(0, 6)}px) scale(${a})` }}>
        <Phone id="hero" cx={300} cy={262} w={250} h={450} rot={-4}>
          <rect x={-120} y={-220} width={240} height={440} fill={C.primarySoft} />
          <rect x={-120} y={-220} width={240} height={84} fill={C.primary} />
          <rect x={-60} y={-190} width={104} height={14} rx={7} fill={C.white} />
          <rect x={-100} y={-112} width={150} height={44} rx={20} fill={C.white} />
          <rect x={-10} y={-48} width={110} height={44} rx={20} fill={C.primaryMid} />
          <rect x={-100} y={16} width={130} height={44} rx={20} fill={C.white} />
          <rect x={-10} y={80} width={110} height={44} rx={20} fill={C.primaryMid} />
          <circle cx={0} cy={168} r={26} fill={C.primary} />
          <path d="M-8 168 H8 M0 160 V176" stroke={C.white} strokeWidth={5} strokeLinecap="round" />
        </Phone>
      </g>
      <g transform={`translate(112 120) scale(${b})`} style={{ transform: `translate(112px, ${120 + fl(1)}px) scale(${b})` }}>
        <circle r={62} fill={C.primary} stroke={C.text} strokeWidth={6} />
        <WifiGlyph cx={0} cy={22} r={17} sw={9} opacities={[1, 1, 1]} color={C.white} />
      </g>
      <g style={{ transform: `translate(494px, ${112 + fl(2)}px) scale(${c})` }}>
        <Pin x={0} y={0} s={1.7} />
      </g>
      <g style={{ transform: `translate(118px, ${396 + fl(3)}px) scale(${d})` }}>
        <rect x={-48} y={-64} width={96} height={128} rx={26} fill={C.white} stroke={C.text} strokeWidth={6} />
        <circle cy={-10} r={22} fill={C.accent} stroke={C.text} strokeWidth={5} />
        <path d="M-9 -10 h18 M0 -19 v18" stroke={C.text} strokeWidth={0} />
        <path d="M-12 -12 a12 12 0 0 1 24 0 v6 h-24 z M-4 -2 h8" fill={C.text} />
        <rect x={-26} y={28} width={52} height={10} rx={5} fill={C.line} />
      </g>
      <g style={{ transform: `translate(478px, ${392 + fl(4)}px) scale(${e})` }}>
        <Bubble x={-82} y={-60} w={164} h={92} tail="right" fill={C.white}>
          <circle cx={46} cy={46} r={9} fill={C.primary} />
          <circle cx={82} cy={46} r={9} fill={C.primary} />
          <circle cx={118} cy={46} r={9} fill={C.primary} />
        </Bubble>
      </g>
    </g>
  );
};

/* Intro: person who gets stuck speaking Arabic */
export const Struggle: React.FC = () => {
  const { f, sp } = useSp();
  const a = sp(0, "smooth");
  const b = sp(10, "bouncy");
  const sweat = ((f % 40) / 40);
  const shake = Math.sin(f * 0.9) * 2.5;
  return (
    <g transform="translate(300 270) scale(1.22) translate(-300 -260)">
      <g style={{ transform: `translate(${interpolate(a, [0, 1], [-60, 0])}px, 0)`, opacity: clamp01(a) }}>
        <Avatar x={170} y={290} shirt={C.primary} mood="worry" s={1.1} />
        <g transform={`translate(238 214)`}>
          <path d="M0 0 Q-10 14 0 24 Q10 14 0 0 Z" fill={C.primary} opacity={1 - sweat} transform={`translate(0 ${sweat * 40})`} />
        </g>
      </g>
      <g transform={`translate(${340 + shake} 120) scale(${b})`} style={{ transformOrigin: "0 0" }}>
        <Bubble x={0} y={0} w={240} h={170} tail="left">
          <path d="M40 90 C60 40 80 140 100 80 C120 30 140 130 160 80 C175 50 195 100 210 70" fill="none" stroke={C.textSoft} strokeWidth={8} strokeLinecap="round" />
          <QMark x={206} y={60} size={70} />
        </Bubble>
      </g>
      <g style={{ transform: `translate(470px, ${420}px)`, opacity: clamp01(sp(24, "smooth")) }}>
        <Phone id="st" cx={0} cy={0} w={110} h={190} rot={8}>
          <rect x={-60} y={-100} width={120} height={200} fill={C.primarySoft} />
          <WifiGlyph cx={0} cy={20} r={14} sw={8} opacities={[1, 1, 1]} />
        </Phone>
      </g>
    </g>
  );
};
