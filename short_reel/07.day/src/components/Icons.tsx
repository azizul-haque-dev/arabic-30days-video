import React from "react";
import {Person, usePop} from "./Person";
import {theme} from "../theme";
import type {IconKey} from "../data/lessons";

const C = theme.colors;

const Heart: React.FC<{x: number; y: number; s?: number; delay?: number}> = ({x, y, s = 1, delay = 0}) => {
  const {frame, fps, scale, opacity} = usePop(delay);
  const float = Math.sin((frame / fps) * 2.6 + delay) * 6;
  return (
    <g transform={`translate(${x} ${y + float}) scale(${s * scale})`} opacity={opacity}>
      <path d="M0 16 C-34 -8 -24 -34 -9 -31 C-3 -30 0 -25 0 -22 C0 -25 3 -30 9 -31 C24 -34 34 -8 0 16Z" fill={C.coral} />
    </g>
  );
};

const Sparkle: React.FC<{x: number; y: number; s?: number; delay?: number; color?: string}> = ({x, y, s = 1, delay = 0, color = C.mintSoft}) => {
  const {frame, fps, scale, opacity} = usePop(delay);
  const tw = 0.75 + 0.25 * Math.sin((frame / fps) * 4 + delay * 2);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * scale * tw}) rotate(${frame * 0.6})`} opacity={opacity}>
      <path d="M0 -16 C2 -5 5 -2 16 0 C5 2 2 5 0 16 C-2 5 -5 2 -16 0 C-5 -2 -2 -5 0 -16Z" fill={color} />
    </g>
  );
};

const Ring: React.FC<{x: number; y: number; s?: number; delay?: number}> = ({x, y, s = 1, delay = 0}) => {
  const {frame, fps, scale, opacity} = usePop(delay);
  const rot = Math.sin((frame / fps) * 2.2) * 6;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * scale})`} opacity={opacity}>
      <circle cx="0" cy="8" r="34" fill="none" stroke={C.gold} strokeWidth="13" />
      <circle cx="0" cy="8" r="34" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeDasharray="30 200" />
      <path d="M-15 -20 L0 -40 L15 -20 L0 -8Z" fill={C.white} stroke={C.mint} strokeWidth="3" strokeLinejoin="round" />
    </g>
  );
};

const Ground: React.FC = () => <ellipse cx="300" cy="526" rx="235" ry="18" fill="rgba(0,0,0,0.22)" />;

const Ball: React.FC<{x: number; y: number}> = ({x, y}) => {
  const {frame, fps, scale, opacity} = usePop(16);
  const hop = Math.abs(Math.sin((frame / fps) * 3)) * 22;
  return (
    <g transform={`translate(${x} ${y - hop}) scale(${scale}) rotate(${frame * 2})`} opacity={opacity}>
      <circle r="50" fill="#fff" stroke="#d7e9df" strokeWidth="3" />
      <path d="M0 -20 L19 -6 L12 17 L-12 17 L-19 -6Z" fill="#1b2b25" />
      <path d="M0 -20 L0 -50 M19 -6 L47 -16 M12 17 L28 42 M-12 17 L-28 42 M-19 -6 L-47 -16" stroke="#1b2b25" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
};

const Flower: React.FC<{x: number; y: number}> = ({x, y}) => {
  const {frame, fps, scale, opacity} = usePop(16);
  const sway = Math.sin((frame / fps) * 2.2) * 6;
  return (
    <g transform={`translate(${x} ${y}) rotate(${sway}) scale(${scale})`} opacity={opacity}>
      <rect x="-4" y="0" width="8" height="70" rx="4" fill={C.greenDark} />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-30" rx="17" ry="27" fill={C.coral} transform={`rotate(${a})`} />
      ))}
      <circle r="17" fill={C.gold} />
    </g>
  );
};

const House: React.FC<{delay?: number}> = ({delay = 0}) => {
  const {scale, opacity} = usePop(delay);
  return (
    <g opacity={opacity * 0.9} transform={`translate(300 520) scale(${scale}) translate(-300 -520)`}>
      <rect x="62" y="210" width="476" height="312" rx="26" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
      <path d="M34 226 L300 52 L566 226" fill="none" stroke={C.mint} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
    </g>
  );
};

/** Arm raised toward the centre for the friendship high-five */
const Arm: React.FC<{x1: number; y1: number; x2: number; y2: number; skin: string; delay: number}> = ({x1, y1, x2, y2, skin, delay}) => {
  const {scale, opacity} = usePop(delay);
  return (
    <g opacity={opacity}>
      <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * scale} y2={y1 + (y2 - y1) * scale} stroke={skin} strokeWidth="26" strokeLinecap="round" />
      <circle cx={x1 + (x2 - x1) * scale} cy={y1 + (y2 - y1) * scale} r="20" fill={skin} />
    </g>
  );
};

const S = theme.colors.skin;
const H = theme.colors.hair;
const SH = theme.colors.shirts;
const SC = theme.colors.scarf;

const IconBrother: React.FC = () => (
  <>
    <Ground />
    <Person kind="boy" x={50} y={140} s={3.3} skin={S[1]} shirt={SH[0]} hair={H[0]} delay={2} phase={0} />
    <Person kind="boy" x={225} y={170} s={3.0} skin={S[1]} shirt={SH[2]} hair={H[1]} delay={7} phase={1} />
    <Heart x={300} y={88} s={1.3} delay={14} />
    <Sparkle x={70} y={110} delay={18} />
    <Sparkle x={540} y={150} s={0.8} delay={22} />
  </>
);
const IconSister: React.FC = () => (
  <>
    <Ground />
    <Person kind="girl" x={50} y={140} s={3.3} skin={S[0]} shirt={SH[5]} hair={H[1]} delay={2} phase={0} />
    <Person kind="girl" x={225} y={170} s={3.0} skin={S[0]} shirt={SH[1]} hair={H[0]} hijab scarf={SC[1]} delay={7} phase={1} />
    <Heart x={300} y={88} s={1.3} delay={14} />
    <Sparkle x={70} y={110} delay={18} />
    <Sparkle x={540} y={150} s={0.8} delay={22} />
  </>
);
const IconBoy: React.FC = () => (
  <>
    <Ground />
    <Person kind="boy" x={90} y={50} s={4.1} skin={S[1]} shirt={SH[4]} hair={H[0]} delay={2} />
    <Ball x={500} y={450} />
    <Sparkle x={500} y={120} delay={14} />
    <Sparkle x={86} y={150} s={0.8} delay={20} />
  </>
);
const IconGirl: React.FC = () => (
  <>
    <Ground />
    <Person kind="girl" x={90} y={50} s={4.1} skin={S[0]} shirt={SH[5]} hair={H[1]} delay={2} />
    <Flower x={510} y={400} />
    <Sparkle x={500} y={110} delay={14} />
    <Sparkle x={80} y={170} s={0.8} delay={20} />
  </>
);
const IconHusband: React.FC = () => (
  <>
    <Ground />
    <Person kind="man" x={50} y={70} s={3.9} skin={S[1]} shirt={SH[1]} hair={H[0]} beard cap delay={2} />
    <Ring x={500} y={190} s={1.5} delay={12} />
    <Heart x={470} y={80} s={0.9} delay={18} />
    <Sparkle x={560} y={300} s={0.8} delay={22} color={C.cream} />
  </>
);
const IconWife: React.FC = () => (
  <>
    <Ground />
    <Person kind="woman" x={50} y={70} s={3.9} skin={S[0]} shirt={SH[2]} hair={H[0]} hijab scarf={SC[2]} delay={2} />
    <Ring x={500} y={190} s={1.5} delay={12} />
    <Heart x={470} y={80} s={0.9} delay={18} />
    <Sparkle x={560} y={300} s={0.8} delay={22} />
  </>
);
const IconFamily: React.FC = () => (
  <>
    <Ground />
    <House />
    <Person kind="man" x={55} y={175} s={2.7} skin={S[1]} shirt={SH[1]} hair={H[0]} beard cap delay={2} phase={0} />
    <Person kind="woman" x={280} y={180} s={2.6} skin={S[0]} shirt={SH[2]} hair={H[0]} hijab scarf={SC[0]} delay={5} phase={1} />
    <Person kind="boy" x={150} y={288} s={2.0} skin={S[1]} shirt={SH[4]} hair={H[0]} delay={9} phase={2} />
    <Person kind="girl" x={300} y={296} s={1.9} skin={S[0]} shirt={SH[5]} hair={H[1]} delay={12} phase={3} />
    <Heart x={300} y={150} s={0.9} delay={16} />
  </>
);
const IconFriend: React.FC = () => (
  <>
    <Ground />
    <Person kind="man" x={12} y={198} s={2.6} skin={S[2]} shirt={SH[0]} hair={H[0]} cap delay={2} phase={0} />
    <Person kind="man" x={328} y={198} s={2.6} skin={S[0]} shirt={SH[4]} hair={H[1]} delay={5} phase={1} />
    <Arm x1={238} y1={430} x2={292} y2={300} skin={S[2]} delay={10} />
    <Arm x1={362} y1={430} x2={308} y2={300} skin={S[0]} delay={12} />
    <Sparkle x={300} y={232} s={1.2} delay={18} />
    <Sparkle x={236} y={270} s={0.7} delay={20} />
    <Sparkle x={364} y={270} s={0.7} delay={22} />
    <Heart x={300} y={140} s={0.95} delay={24} />
  </>
);
const IconPeople: React.FC = () => (
  <>
    <Ground />
    <Person kind="girl" x={50} y={172} s={1.9} skin={S[0]} shirt={SH[5]} hair={H[1]} delay={2} phase={0} />
    <Person kind="man" x={205} y={172} s={1.9} skin={S[2]} shirt={SH[3]} hair={H[0]} beard delay={4} phase={1} />
    <Person kind="woman" x={360} y={172} s={1.9} skin={S[1]} shirt={SH[1]} hair={H[0]} hijab scarf={SC[1]} delay={6} phase={2} />
    <Person kind="man" x={25} y={232} s={2.4} skin={S[1]} shirt={SH[0]} hair={H[0]} cap delay={8} phase={3} />
    <Person kind="woman" x={180} y={232} s={2.4} skin={S[0]} shirt={SH[2]} hair={H[2]} delay={10} phase={4} />
    <Person kind="boy" x={335} y={232} s={2.4} skin={S[3]} shirt={SH[4]} hair={H[0]} delay={12} phase={5} />
    <Sparkle x={520} y={110} delay={18} />
    <Sparkle x={70} y={110} s={0.8} delay={22} />
  </>
);
const IconMen: React.FC = () => (
  <>
    <Ground />
    <Person kind="man" x={95} y={160} s={2.2} skin={S[2]} shirt={SH[3]} hair={H[0]} beard cap delay={2} phase={0} />
    <Person kind="man" x={275} y={160} s={2.2} skin={S[0]} shirt={SH[5]} hair={H[1]} delay={4} phase={1} />
    <Person kind="man" x={12} y={218} s={2.55} skin={S[1]} shirt={SH[1]} hair={H[0]} beard delay={7} phase={2} />
    <Person kind="man" x={170} y={206} s={2.7} skin={S[1]} shirt={SH[0]} hair={H[0]} beard cap delay={10} phase={3} />
    <Person kind="man" x={335} y={218} s={2.55} skin={S[3]} shirt={SH[4]} hair={H[0]} delay={13} phase={4} />
    <Sparkle x={520} y={120} delay={20} />
    <Sparkle x={80} y={110} s={0.8} delay={24} />
  </>
);

const MAP: Record<IconKey, React.FC> = {
  brother: IconBrother,
  sister: IconSister,
  boy: IconBoy,
  girl: IconGirl,
  husband: IconHusband,
  wife: IconWife,
  family: IconFamily,
  friend: IconFriend,
  people: IconPeople,
  men: IconMen,
};

export const VocabIcon: React.FC<{icon: IconKey; size: number}> = ({icon, size}) => {
  const Cmp = MAP[icon];
  return (
    <svg width={size} height={size} viewBox="0 0 600 600" style={{overflow: "visible", display: "block"}}>
      <Cmp />
    </svg>
  );
};
