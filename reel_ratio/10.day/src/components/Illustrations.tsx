import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

const P = theme.colors;
const C = theme.ill;

const useT = (): number => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 880 520" width="100%" height="100%" style={{ display: "block" }}>
    <circle cx={440} cy={268} r={236} fill={P.mint} />
    <circle cx={440} cy={268} r={176} fill={P.mintSoft} />
    {children}
  </svg>
);

const Ground: React.FC<{ cx?: number; cy: number; rx: number }> = ({ cx = 440, cy, rx }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.07} fill={P.shadow} />
);

const Steam: React.FC<{ x: number; y: number; t: number; count?: number; color?: string }> = ({
  x,
  y,
  t,
  count = 3,
  color = C.steam,
}) => (
  <g>
    {Array.from({ length: count }, (_, k) => {
      const p = (t * 0.45 + k / count) % 1;
      return (
        <path
          key={k}
          d="M0 0 c-12 -16 12 -32 0 -48"
          transform={`translate(${x + k * 28 + Math.sin(t * 2 + k) * 4} ${y - p * 50})`}
          stroke={color}
          strokeWidth={9}
          strokeLinecap="round"
          fill="none"
          opacity={Math.sin(p * Math.PI) * 0.9}
        />
      );
    })}
  </g>
);

const Sparkle: React.FC<{ x: number; y: number; s: number; t: number; ph: number; color?: string }> = ({
  x,
  y,
  s,
  t,
  ph,
  color = P.accent,
}) => {
  const k = 0.6 + 0.4 * Math.sin(t * 3 + ph);
  return (
    <path
      d="M0 -1 C0.15 -0.3 0.3 -0.15 1 0 C0.3 0.15 0.15 0.3 0 1 C-0.15 0.3 -0.3 0.15 -1 0 C-0.3 -0.15 -0.15 -0.3 0 -1Z"
      transform={`translate(${x} ${y}) scale(${s * k})`}
      fill={color}
    />
  );
};

const Cup: React.FC<{ x: number; y: number; liquid: string; body?: string; scale?: number }> = ({
  x,
  y,
  liquid,
  body = P.white,
  scale = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx={80} cy={158} rx={110} ry={18} fill={C.plateRim} />
    <path d="M150 30 h44 a34 34 0 0 1 0 68 h-50" fill="none" stroke={body} strokeWidth={16} />
    <path d="M0 20 h160 v70 a70 70 0 0 1 -70 70 h-20 a70 70 0 0 1 -70 -70 z" fill={body} />
    <path d="M10 28 h140 v62 a60 60 0 0 1 -60 60 h-20 a60 60 0 0 1 -60 -60 z" fill={liquid} />
    <ellipse cx={80} cy={22} rx={80} ry={12} fill={liquid} />
    <path d="M20 40 v46" stroke={P.white} strokeWidth={8} strokeLinecap="round" opacity={0.5} />
  </g>
);

const Plate: React.FC<{ cx: number; cy: number; rx: number }> = ({ cx, cy, rx }) => (
  <g>
    <ellipse cx={cx} cy={cy + 10} rx={rx} ry={rx * 0.26} fill={P.shadow} />
    <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.27} fill={C.plate} />
    <ellipse cx={cx} cy={cy} rx={rx * 0.78} ry={rx * 0.2} fill={C.plateRim} />
    <ellipse cx={cx} cy={cy - 2} rx={rx * 0.74} ry={rx * 0.18} fill={C.plate} />
  </g>
);

const Hand: React.FC<{ x: number; y: number; rot: number; flip?: boolean }> = ({ x, y, rot, flip }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -1 : 1} 1)`}>
    <rect x={-8} y={-70} width={24} height={86} rx={12} fill={C.skin} />
    <rect x={20} y={-84} width={24} height={100} rx={12} fill={C.skin} />
    <rect x={48} y={-78} width={24} height={94} rx={12} fill={C.skin} />
    <rect x={76} y={-62} width={22} height={78} rx={11} fill={C.skin} />
    <rect x={-30} y={-6} width={26} height={62} rx={13} fill={C.skinDark} transform="rotate(-28 -17 25)" />
    <rect x={-14} y={-10} width={124} height={96} rx={42} fill={C.skin} />
  </g>
);

/* 91 — takeaway order from a restaurant */
export const TakeawayOrder: React.FC = () => {
  const t = useT();
  const bob = Math.sin(t * 2) * 5;
  return (
    <Frame>
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <rect x={150 + i * 80} y={78} width={80} height={72} fill={i % 2 ? P.white : P.primary} />
          <circle cx={190 + i * 80} cy={150} r={40} fill={i % 2 ? P.white : P.primary} />
        </g>
      ))}
      <rect x={138} y={62} width={604} height={24} rx={12} fill={P.primaryDark} />
      <Ground cy={474} rx={340} />
      <rect x={110} y={336} width={660} height={34} rx={17} fill={C.woodDark} />
      <rect x={130} y={368} width={620} height={104} rx={16} fill={C.wood} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={196 + i * 100} y={382} width={6} height={76} rx={3} fill={C.woodDark} opacity={0.4} />
      ))}
      <rect x={232} y={290} width={104} height={46} rx={10} fill={P.white} />
      <rect x={232} y={290} width={104} height={14} rx={7} fill={P.mintSoft} />
      <Steam x={410} y={214} t={t} count={2} />
      <g transform={`translate(0 ${bob})`}>
        <path d="M404 232 C404 170 476 170 476 232" fill="none" stroke={C.kraftDark} strokeWidth={9} />
        <rect x={366} y={222} width={148} height={114} rx={12} fill={C.kraft} />
        <rect x={360} y={208} width={160} height={30} rx={8} fill={C.kraftDark} />
        <circle cx={440} cy={288} r={30} fill={P.white} />
        <circle cx={440} cy={288} r={17} fill="none" stroke={P.primary} strokeWidth={6} />
        <circle cx={440} cy={288} r={6} fill={P.accent} />
      </g>
      <rect x={560} y={264} width={86} height={72} rx={10} fill={P.white} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={574} y={278 + i * 16} width={i === 2 ? 30 : 58} height={7} rx={3.5} fill={P.line} />
      ))}
      <circle cx={640} cy={262} r={14} fill={P.accent} />
    </Frame>
  );
};

/* 92 — put groceries in the fridge */
export const FridgeGroceries: React.FC = () => {
  const t = useT();
  const arrow = (t * 40) % 40;
  const bob = Math.sin(t * 2.4) * 5;
  return (
    <Frame>
      <Ground cy={462} rx={330} />
      <path d="M330 92 L238 124 L238 424 L330 448 Z" fill={C.fridgeShade} />
      <rect x={252} y={176} width={18} height={62} rx={8} fill={C.blue} />
      <rect x={278} y={196} width={18} height={44} rx={8} fill={P.accent} />
      <rect x={252} y={300} width={18} height={62} rx={8} fill={C.leaf} />
      <rect x={330} y={60} width={236} height={392} rx={30} fill={C.fridge} />
      <rect x={346} y={76} width={204} height={360} rx={20} fill={C.fridgeInner} />
      {[196, 308, 410].map((y) => (
        <rect key={y} x={346} y={y} width={204} height={10} fill={C.fridgeShade} />
      ))}
      <rect x={370} y={126} width={44} height={70} rx={8} fill={P.white} />
      <path d="M370 126 l22 -22 l22 22z" fill={C.blue} />
      <circle cx={392} cy={164} r={11} fill={C.blue} />
      <circle cx={462} cy={170} r={24} fill={C.red} />
      <path d="M462 146 q6 -16 18 -14" stroke={C.leaf} strokeWidth={7} fill="none" strokeLinecap="round" />
      <rect x={496} y={144} width={40} height={52} rx={10} fill={P.accent} />
      <circle cx={396} cy={262} r={36} fill={C.leaf} />
      <path d="M380 258 q16 -22 32 0 M386 274 q10 -14 20 0" stroke={P.primaryDark} strokeWidth={5} fill="none" />
      <rect x={450} y={274} width={84} height={34} rx={12} fill={C.cream} />
      {[0, 1, 2].map((i) => (
        <ellipse key={i} cx={472 + i * 28} cy={270} rx={13} ry={17} fill={C.cream} stroke={C.kraftDark} strokeWidth={3} />
      ))}
      <rect x={372} y={340} width={34} height={68} rx={10} fill={C.blueSoft} />
      <rect x={420} y={356} width={110} height={52} rx={12} fill={C.redSoft} />
      <circle cx={452} cy={382} r={14} fill={C.red} />
      <circle cx={494} cy={382} r={14} fill={C.red} />
      <g transform={`translate(0 ${bob})`}>
        <path d="M600 330 h130 l-10 128 h-110 z" fill={C.kraft} />
        <rect x={594} y={318} width={142} height={22} rx={8} fill={C.kraftDark} />
        <rect x={628} y={250} width={22} height={84} rx={11} fill={C.bread} transform="rotate(-14 639 292)" />
        <path d="M690 330 c-6 -50 8 -72 26 -86 c12 30 4 60 -4 86z" fill={C.leaf} />
      </g>
      <path
        d="M596 250 C 580 190 600 150 574 120"
        fill="none"
        stroke={P.accent}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray="14 14"
        strokeDashoffset={-arrow}
      />
      <path d="M560 128 l20 -18 l6 26z" fill={P.accent} />
    </Frame>
  );
};

/* 93 — the bread is finished */
export const EmptyBreadBasket: React.FC = () => {
  const t = useT();
  const ghost = 0.3 + 0.12 * Math.sin(t * 2);
  return (
    <Frame>
      <Ground cy={452} rx={300} />
      <path d="M270 306 L610 306 L566 440 Q440 462 314 440 Z" fill={C.wood} />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${296 + i * 14} 322 Q440 ${360 + i * 4} ${584 - i * 14} 322`} fill="none" stroke={C.woodDark} strokeWidth={5} opacity={0.5} />
      ))}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path key={i} d={`M${300 + i * 46} 312 L${326 + i * 36} 436`} stroke={C.woodDark} strokeWidth={5} opacity={0.4} />
      ))}
      <ellipse cx={440} cy={306} rx={190} ry={40} fill={C.woodDark} />
      <ellipse cx={440} cy={310} rx={168} ry={28} fill="#7A4E26" />
      <path d="M262 304 q-30 30 -20 90 l60 -6 q-10 -50 20 -78z" fill={P.white} />
      <path d="M262 304 q-30 30 -20 90 l30 -3 q-8 -50 8 -86z" fill={P.mint} />
      <g opacity={ghost}>
        <rect x={380} y={176} width={190} height={64} rx={32} fill="none" stroke={C.breadDark} strokeWidth={6} strokeDasharray="12 10" transform="rotate(-12 475 208)" />
      </g>
      <circle cx={600} cy={170} r={44} fill={C.redSoft} />
      <path d="M582 152 l36 36 M618 152 l-36 36" stroke={C.red} strokeWidth={10} strokeLinecap="round" />
      {[[420, 316], [470, 322], [506, 314], [446, 326]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4 + (i % 2) * 2} fill={C.bread} />
      ))}
    </Frame>
  );
};

/* 94 — bring milk and eggs */
export const MilkEggs: React.FC = () => {
  const t = useT();
  const pop = Math.sin(t * 2.2) * 6;
  return (
    <Frame>
      <Ground cy={462} rx={340} />
      <path d="M216 250 h260 l-18 208 h-224 z" fill={P.primary} />
      <path d="M262 250 c0 -70 120 -70 120 0" fill="none" stroke={P.primaryDark} strokeWidth={12} />
      <rect x={236} y={296} width={220} height={16} fill={P.primaryDark} opacity={0.4} />
      <g transform={`translate(0 ${pop})`}>
        <rect x={290} y={150} width={92} height={150} rx={10} fill={P.white} />
        <path d="M290 150 l46 -46 l46 46z" fill={C.blueSoft} />
        <rect x={322} y={96} width={28} height={18} rx={5} fill={C.blue} />
        <path d="M336 186 c-20 28 -20 46 0 46 c20 0 20 -18 0 -46z" fill={C.blue} />
        <rect x={290} y={252} width={92} height={48} fill={C.blueSoft} />
      </g>
      <rect x={520} y={380} width={250} height={80} rx={22} fill="#D8BE98" />
      <rect x={520} y={380} width={250} height={22} rx={11} fill="#C9AA7E" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <ellipse cx={566 + i * 78} cy={374} rx={30} ry={38} fill={C.cream} />
          <ellipse cx={557 + i * 78} cy={360} rx={8} ry={12} fill={P.white} opacity={0.7} />
        </g>
      ))}
      <path d="M520 404 h250" stroke="#B8976A" strokeWidth={4} />
    </Frame>
  );
};

/* 95 — cold tea, make a fresh cup */
export const ColdTea: React.FC = () => {
  const t = useT();
  const flake = Math.sin(t * 2) * 6;
  return (
    <Frame>
      <Ground cy={462} rx={340} />
      <Cup x={110} y={250} liquid="#8F8A86" scale={1.18} />
      <g transform={`translate(${210 + flake * 0.4} ${130 + flake})`}>
        {[0, 60, 120].map((r) => (
          <rect key={r} x={-5} y={-42} width={10} height={84} rx={5} fill={C.blue} transform={`rotate(${r})`} />
        ))}
        <circle r={9} fill={C.blueSoft} />
      </g>
      {[[160, 196], [262, 214], [240, 170]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} q-8 14 0 22 q8 -8 0 -22z`} fill={C.blue} opacity={0.8} />
      ))}
      <circle cx={440} cy={316} r={42} fill={P.accent} />
      <path d="M440 294 v44 M418 316 h44" stroke={P.white} strokeWidth={10} strokeLinecap="round" />
      <Cup x={560} y={250} liquid={C.tea} scale={1.18} />
      <Steam x={620} y={236} t={t} color={P.primary} />
    </Frame>
  );
};

/* 96 — don't add too much salt */
export const SaltFood: React.FC = () => {
  const t = useT();
  const tilt = 28 + Math.sin(t * 3) * 4;
  return (
    <Frame>
      <Ground cy={470} rx={330} />
      <Plate cx={470} cy={398} rx={250} />
      <ellipse cx={470} cy={384} rx={92} ry={42} fill={C.rice} />
      <rect x={400} y={338} width={96} height={52} rx={26} fill={C.bread} transform="rotate(-8 448 364)" />
      {[[536, 392], [560, 380], [520, 408]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={20 - i * 2} fill={C.leaf} />
      ))}
      <circle cx={420} cy={404} r={14} fill={C.red} />
      {Array.from({ length: 10 }, (_, i) => {
        const p = (t * 0.9 + i / 10) % 1;
        return (
          <circle
            key={i}
            cx={286 + p * 70 + Math.sin(i * 3) * 10}
            cy={206 + p * 160}
            r={4}
            fill={P.white}
            stroke={C.plateRim}
            strokeWidth={2}
            opacity={Math.sin(p * Math.PI)}
          />
        );
      })}
      <g transform={`translate(250 170) rotate(${tilt} 40 50)`}>
        <rect x={0} y={20} width={80} height={110} rx={22} fill={C.blueSoft} />
        <rect x={0} y={-6} width={80} height={36} rx={16} fill={C.blue} />
        {[16, 40, 64].map((x) => (
          <circle key={x} cx={x} cy={12} r={4} fill={P.white} />
        ))}
        <rect x={14} y={64} width={52} height={34} rx={10} fill={P.white} opacity={0.8} />
      </g>
      <circle cx={648} cy={160} r={64} fill={C.redSoft} />
      <circle cx={648} cy={160} r={50} fill="none" stroke={C.red} strokeWidth={14} />
      <path d="M612 196 L684 124" stroke={C.red} strokeWidth={14} strokeLinecap="round" />
    </Frame>
  );
};

/* 97 — what do you want for dinner? */
export const DinnerQuestion: React.FC = () => {
  const t = useT();
  const wob = Math.sin(t * 2.4) * 4;
  return (
    <Frame>
      <Ground cy={474} rx={320} />
      <rect x={150} y={366} width={580} height={32} rx={16} fill={C.woodDark} />
      <rect x={190} y={396} width={26} height={78} rx={8} fill={C.wood} />
      <rect x={664} y={396} width={26} height={78} rx={8} fill={C.wood} />
      <Plate cx={440} cy={352} rx={150} />
      <rect x={282} y={300} width={14} height={72} rx={7} fill={C.fridgeShade} />
      <rect x={584} y={300} width={14} height={72} rx={7} fill={C.fridgeShade} />
      <path d="M270 296 h38 v26 a19 19 0 0 1 -38 0z" fill={C.fridgeShade} />
      <path d="M296 300 h38" stroke={C.fridgeShade} strokeWidth={4} />
      <g transform={`translate(${wob} 0)`}>
        <path d="M470 90 h250 a42 42 0 0 1 42 42 v70 a42 42 0 0 1 -42 42 h-130 l-44 40 v-40 h-76 a42 42 0 0 1 -42 -42 v-70 a42 42 0 0 1 42 -42z" fill={P.white} />
        <path d="M586 126 c0 -26 52 -26 52 4 c0 22 -28 24 -28 48" fill="none" stroke={P.accent} strokeWidth={16} strokeLinecap="round" />
        <circle cx={610} cy={208} r={10} fill={P.accent} />
      </g>
      <path d="M170 150 a66 66 0 1 0 74 90 a52 52 0 1 1 -74 -90z" fill={P.accent} />
      <Sparkle x={282} y={130} s={16} t={t} ph={0} />
      <Sparkle x={210} y={300} s={12} t={t} ph={2} color={P.primary} />
      <Sparkle x={330} y={220} s={10} t={t} ph={4} />
    </Frame>
  );
};

/* 98 — a light meal is fine */
export const LightMeal: React.FC = () => {
  const t = useT();
  const sway = Math.sin(t * 2) * 3;
  return (
    <Frame>
      <Ground cy={462} rx={290} />
      <path d="M270 300 h340 a170 150 0 0 1 -340 0z" fill={P.primary} />
      <path d="M270 300 h340 v18 h-340z" fill={P.primaryDark} />
      <g transform={`translate(0 ${sway})`}>
        {[[330, 280, 56], [400, 262, 62], [480, 266, 60], [548, 284, 52]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? C.leaf : "#6FD0A0"} />
        ))}
        <circle cx={440} cy={252} r={38} fill={C.red} />
        <circle cx={440} cy={252} r={22} fill="#FF8A8E" />
        <ellipse cx={380} cy={230} rx={30} ry={24} fill={C.cream} />
        <circle cx={380} cy={230} r={11} fill={P.accent} />
        <circle cx={516} cy={226} r={24} fill="#CFEBB0" />
        <circle cx={516} cy={226} r={13} fill={C.leaf} />
      </g>
      <path d="M690 150 c40 -40 90 -30 108 -8 c-30 6 -50 20 -62 50 c-24 -8 -46 -22 -46 -42z" fill={C.leaf} />
      <path d="M700 188 q40 -30 90 -40" stroke={P.primaryDark} strokeWidth={4} fill="none" />
      <path d="M120 170 c-30 -34 -8 -66 22 -66 c-10 24 4 40 22 56z" fill={C.leaf} opacity={0.8} />
    </Frame>
  );
};

/* 99 — wash your hands before eating */
export const WashHands: React.FC = () => {
  const t = useT();
  const off = (t * 160) % 36;
  return (
    <Frame>
      <Ground cy={474} rx={330} />
      <rect x={236} y={336} width={408} height={130} rx={32} fill={C.fridge} />
      <path d="M236 346 h408 v60 a30 30 0 0 1 -30 30 h-348 a30 30 0 0 1 -30 -30z" fill={C.fridgeShade} opacity={0.6} />
      <path d="M440 150 v-44 a46 46 0 0 1 46 -46 h42" fill="none" stroke={C.fridgeShade} strokeWidth={26} strokeLinecap="round" />
      <rect x={514} y={74} width={30} height={72} rx={14} fill={C.fridgeShade} />
      <rect x={510} y={142} width={38} height={14} rx={7} fill={C.blue} />
      <path d="M529 160 v150" stroke={C.blue} strokeWidth={22} strokeLinecap="round" strokeDasharray="22 14" strokeDashoffset={-off} opacity={0.75} />
      <Hand x={360} y={384} rot={-8} />
      <Hand x={650} y={382} rot={8} flip />
      {[[352, 290, 22], [416, 262, 16], [610, 270, 24], [660, 232, 14], [330, 214, 12]].map(([x, y, r], i) => {
        const p = (t * 0.4 + i * 0.2) % 1;
        return (
          <g key={i} opacity={0.5 + 0.5 * Math.sin(p * Math.PI)}>
            <circle cx={x} cy={y! - p * 24} r={r} fill={P.white} stroke={C.blue} strokeWidth={3} />
            <circle cx={x! - r! * 0.3} cy={y! - p * 24 - r! * 0.3} r={r! * 0.22} fill={C.blueSoft} />
          </g>
        );
      })}
      <rect x={668} y={412} width={74} height={44} rx={16} fill={P.accent} />
    </Frame>
  );
};

/* 100 — enjoy your meal */
export const EnjoyMeal: React.FC = () => {
  const t = useT();
  const glow = 0.75 + 0.25 * Math.sin(t * 2.4);
  return (
    <Frame>
      <Ground cy={472} rx={340} />
      <rect x={130} y={372} width={620} height={34} rx={17} fill={C.woodDark} />
      <rect x={170} y={404} width={28} height={70} rx={8} fill={C.wood} />
      <rect x={682} y={404} width={28} height={70} rx={8} fill={C.wood} />
      <Plate cx={440} cy={366} rx={140} />
      <ellipse cx={440} cy={352} rx={92} ry={38} fill={C.rice} />
      <circle cx={402} cy={336} r={22} fill={C.bread} />
      <circle cx={456} cy={332} r={26} fill={C.breadDark} />
      <circle cx={494} cy={352} r={16} fill={C.leaf} />
      <Steam x={410} y={320} t={t} />
      <path d="M180 372 a56 56 0 0 1 112 0z" fill={C.kraft} />
      <rect x={168} y={366} width={136} height={14} rx={7} fill={C.kraftDark} />
      <path d="M596 372 a62 40 0 0 1 124 0z" fill={C.red} />
      <rect x={590} y={366} width={136} height={14} rx={7} fill={C.redSoft} />
      <Hand x={150} y={250} rot={-28} />
      <path d="M130 118 a120 120 0 0 1 120 -24" fill="none" stroke={P.accent} strokeWidth={8} strokeLinecap="round" strokeDasharray="10 14" />
      <g transform={`translate(700 190) scale(${glow})`}>
        <path d="M0 40 C-60 -4 -34 -62 0 -26 C34 -62 60 -4 0 40z" fill={C.red} />
      </g>
      <Sparkle x={330} y={170} s={18} t={t} ph={0} />
      <Sparkle x={560} y={150} s={14} t={t} ph={2} color={P.primary} />
      <Sparkle x={640} y={290} s={12} t={t} ph={4} />
    </Frame>
  );
};

export const illustrations: Record<string, React.FC> = {
  "takeaway-order": TakeawayOrder,
  "fridge-groceries": FridgeGroceries,
  "empty-bread-basket": EmptyBreadBasket,
  "milk-eggs": MilkEggs,
  "cold-tea": ColdTea,
  "salt-food": SaltFood,
  "dinner-question": DinnerQuestion,
  "light-meal": LightMeal,
  "wash-hands": WashHands,
  "enjoy-meal": EnjoyMeal,
};

/** Thumbnail illustration: a person stuck mid-sentence with speech bubbles. */
export const TalkStuck: React.FC = () => {
  const t = useT();
  const dots = [0, 1, 2].map((i) => 0.25 + 0.75 * Math.max(0, Math.sin(t * 4 - i * 0.9)));
  const float = Math.sin(t * 1.8) * 6;
  return (
    <svg viewBox="0 0 900 560" width="100%" height="100%" style={{ display: "block" }}>
      <circle cx={450} cy={290} r={250} fill={P.mint} />
      <circle cx={450} cy={290} r={186} fill={P.mintSoft} />
      <ellipse cx={450} cy={532} rx={300} ry={20} fill={P.shadow} />
      <path d="M250 520 c0 -110 80 -170 200 -170 s200 60 200 170z" fill={P.primary} />
      <path d="M392 350 l58 62 l58 -62z" fill={P.white} />
      <rect x={414} y={296} width={72} height={66} rx={30} fill={C.skinDark} />
      <ellipse cx={450} cy={236} rx={102} ry={110} fill={C.skin} />
      <path d="M346 226 c-6 -86 60 -122 112 -118 c70 4 98 56 96 118 c-30 -40 -70 -60 -112 -60 c-40 0 -70 22 -96 60z" fill={C.hair} />
      <circle cx={408} cy={246} r={10} fill={P.text} />
      <circle cx={492} cy={246} r={10} fill={P.text} />
      <path d="M386 218 l40 -10 M514 218 l-40 -10" stroke={P.text} strokeWidth={7} strokeLinecap="round" />
      <path d="M418 296 q32 -16 64 0" stroke={P.text} strokeWidth={7} fill="none" strokeLinecap="round" />
      <g transform={`translate(0 ${float})`}>
        <path d="M120 40 h230 a40 40 0 0 1 40 40 v56 a40 40 0 0 1 -40 40 h-120 l-46 44 v-44 h-64 a40 40 0 0 1 -40 -40 v-56 a40 40 0 0 1 40 -40z" fill={P.white} />
        {dots.map((o, i) => (
          <circle key={i} cx={176 + i * 62} cy={108} r={14} fill={P.primary} opacity={o} />
        ))}
      </g>
      <g transform={`translate(0 ${-float})`}>
        <path d="M620 150 a74 74 0 1 1 8 46 l-42 28 l12 -50 a74 74 0 0 1 22 -24z" fill={P.accent} />
        <path d="M640 120 c0 -26 50 -26 50 4 c0 20 -26 22 -26 44" fill="none" stroke={P.white} strokeWidth={14} strokeLinecap="round" />
        <circle cx={664} cy={196} r={9} fill={P.white} />
      </g>
      <Sparkle x={90} y={250} s={18} t={t} ph={0} />
      <Sparkle x={820} y={330} s={16} t={t} ph={2} color={P.primary} />
      <Sparkle x={770} y={470} s={12} t={t} ph={4} />
    </svg>
  );
};
