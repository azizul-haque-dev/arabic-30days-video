import React from "react";
import {theme} from "../theme";

// All icons are drawn in code (viewBox 200x200) using theme colours only. `t` = local frame for micro-animation.
type IconProps = {size?: number; t: number};
const INK = theme.colors.text;
const PAPER = theme.colors.surface;
const MINT = theme.colors.mint;
const DEEP = theme.colors.mintDeep;
const ACC = theme.colors.accent;
const SW = 7;
const base = {stroke: INK, strokeWidth: SW, strokeLinecap: "round" as const, strokeLinejoin: "round" as const};

const line = {...base, fill: "none" as const};

const Svg: React.FC<{size: number; children: React.ReactNode}> = ({size, children}) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: "visible"}}>{children}</svg>
);
const Star: React.FC<{x: number; y: number; r: number; fill?: string}> = ({x, y, r, fill = ACC}) => (
  <path d={`M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r}Z`} fill={fill} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
);

export const WashingMachine: React.FC<IconProps> = ({size = 300, t}) => {
  const shake = Math.sin(t * 1.7) * 2 * (0.5 + 0.5 * Math.sin(t / 9));
  const wob = Math.sin(t / 2.2) * 9;
  return (
    <Svg size={size}>
      <g transform={`translate(${shake} 0)`}>
        <rect x={35} y={22} width={130} height={156} rx={20} fill={PAPER} {...base} />
        <path d="M35 62H165" {...line} />
        <circle cx={62} cy={43} r={8} fill={ACC} {...base} strokeWidth={5} />
        <path d="M88 43H140" {...line} strokeWidth={6} />
        <circle cx={100} cy={118} r={44} fill={MINT} {...base} />
        <g transform={`rotate(${wob} 100 118)`}>
          <circle cx={100} cy={118} r={30} fill={PAPER} {...base} strokeWidth={5} />
          <path d="M76 118Q88 106 100 118T124 118" {...line} strokeWidth={5} />
        </g>
      </g>
      <g transform={`translate(${158 + Math.sin(t / 6) * 2} ${36}) scale(${1 + Math.sin(t / 5) * 0.05})`}>
        <circle r={25} fill={ACC} {...base} />
        <path d="M0 -12V4" {...line} strokeWidth={7} />
        <circle cx={0} cy={13} r={2.5} fill={INK} stroke={INK} strokeWidth={3} />
      </g>
    </Svg>
  );
};

export const Plumber: React.FC<IconProps> = ({size = 300, t}) => {
  const drop = (t % 40) / 40;
  return (
    <Svg size={size}>
      <path d="M22 66H112Q142 66 142 96V128" stroke={INK} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M22 66H112Q142 66 142 96V128" stroke={MINT} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x={126} y={124} width={32} height={14} rx={5} fill={PAPER} {...base} strokeWidth={5} />
      <path d={`M142 ${150 + drop * 34}c-7 10-9 15-9 20a9 9 0 0 0 18 0c0-5-2-10-9-20z`} fill={DEEP} {...base} strokeWidth={4} opacity={1 - drop * 0.6} transform={`translate(0 ${-14})`} />
      <g transform={`rotate(${-38 + Math.sin(t / 10) * 4} 62 140)`}>
        <rect x={52} y={62} width={20} height={104} rx={10} fill={ACC} {...base} />
        <path d="M44 62V36a18 18 0 0 1 36 0V62" fill={ACC} {...base} />
        <rect x={53} y={22} width={14} height={26} rx={4} fill={MINT} stroke="none" />
      </g>
    </Svg>
  );
};

export const TrashBin: React.FC<IconProps> = ({size = 300, t}) => {
  const k = (t % 54) / 54;
  const e = k * k * (3 - 2 * k);
  const bx = 100 + e * 76;
  const by = 36 - Math.sin(e * Math.PI) * 34 + e * 66;
  const lid = Math.sin(Math.min(1, k * 4) * Math.PI) * -22;
  return (
    <Svg size={size}>
      <path d="M52 78H128L120 172H60Z" fill={PAPER} {...base} />
      <path d="M78 96V152M102 96V152" {...line} strokeWidth={5} />
      <g transform={`rotate(${lid} 48 66)`}>
        <rect x={44} y={58} width={90} height={16} rx={8} fill={MINT} {...base} />
      </g>
      <g transform={`translate(${bx - 22} ${by}) rotate(${e * 40})`} opacity={Math.min(1, (1 - k) * 4)}>
        <ellipse cx={0} cy={20} rx={22} ry={26} fill={DEEP} {...base} strokeWidth={5} />
        <path d="M-6 -6L0 -14L6 -6" {...line} strokeWidth={5} />
      </g>
      <path d="M130 120H182M166 104L182 120L166 136" {...line} stroke={ACC} strokeDasharray="5 12" opacity={0.9} />
    </Svg>
  );
};

export const Broom: React.FC<IconProps> = ({size = 300, t}) => {
  const sweep = Math.sin(t / 8) * 7;
  return (
    <Svg size={size}>
      <path d="M20 172H180" {...line} strokeWidth={5} opacity={0.5} />
      <g transform={`rotate(${sweep} 100 172)`}>
        <path d="M150 20L104 112" {...line} strokeWidth={9} />
        <path d="M88 108L128 128L112 176H52Z" fill={ACC} {...base} strokeLinejoin="round" />
        <path d="M78 122L70 172M94 128L88 174M108 134L104 174" {...line} strokeWidth={4} />
      </g>
      {[[44, 54, 12, 0], [160, 112, 10, 18], [56, 128, 8, 34]].map(([x, y, r, o], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${0.7 + 0.35 * Math.max(0, Math.sin((t + o) / 8))})`}>
          <Star x={0} y={0} r={r} fill={i === 1 ? MINT : PAPER} />
        </g>
      ))}
    </Svg>
  );
};

export const Shirt: React.FC<IconProps> = ({size = 300, t}) => (
  <Svg size={size}>
    <path d="M68 34L36 58L54 90L76 76V168H124V76L146 90L164 58L132 34Q100 54 68 34Z" fill={PAPER} {...base} />
    <path d="M68 34Q100 54 132 34" {...line} strokeWidth={5} />
    <text x={100} y={132} textAnchor="middle" fontFamily={theme.fonts.bn} fontWeight={700} fontSize={58} fill={ACC} stroke={INK} strokeWidth={2}>?</text>
    {[[160, 150, 14, 0], [178, 114, 9, 14], [32, 146, 8, 26]].map(([x, y, r, o], i) => (
      <circle key={i} cx={x} cy={y - ((t + o) % 60) * 0.5} r={r} fill={MINT} {...base} strokeWidth={4} opacity={1 - ((t + o) % 60) / 70} />
    ))}
  </Svg>
);

export const Mosque: React.FC<IconProps> = ({size = 300, t}) => {
  const glow = 0.5 + 0.5 * Math.sin(t / 14);
  return (
    <Svg size={size}>
      <circle cx={100} cy={84} r={62 + glow * 6} fill={ACC} opacity={0.16} />
      <path d="M48 112Q48 56 100 56Q152 56 152 112Z" fill={MINT} {...base} />
      <path d="M100 56V40" {...line} strokeWidth={5} />
      <path d="M108 22a14 14 0 1 0 0 24a11 11 0 1 1 0-24z" fill={ACC} {...base} strokeWidth={4} />
      <rect x={34} y={112} width={132} height={60} rx={4} fill={PAPER} {...base} />
      <path d="M88 172V146Q100 126 112 146V172" fill={MINT} {...base} strokeWidth={5} />
      {[12, 172].map((x) => (
        <g key={x}>
          <rect x={x} y={78} width={18} height={94} rx={3} fill={PAPER} {...base} strokeWidth={6} />
          <path d={`M${x - 3} 78L${x + 9} 52L${x + 21} 78`} fill={ACC} {...base} strokeWidth={6} />
        </g>
      ))}
    </Svg>
  );
};

export const AlarmClock: React.FC<IconProps> = ({size = 300, t}) => {
  const ring = Math.sin(t * 1.6) * 5;
  return (
    <Svg size={size}>
      <g transform={`rotate(${ring} 100 106)`}>
        <circle cx={52} cy={52} r={22} fill={ACC} {...base} transform={`rotate(-20 52 52)`} />
        <circle cx={148} cy={52} r={22} fill={ACC} {...base} />
        <path d="M60 172L48 186M140 172L152 186" {...line} />
        <circle cx={100} cy={110} r={64} fill={PAPER} {...base} />
        <circle cx={100} cy={110} r={50} fill={MINT} stroke="none" />
        <path d="M100 66V76M100 144V154M56 110H66M134 110H144" {...line} strokeWidth={5} />
        <path d="M100 110V138" {...line} strokeWidth={8} />
        <path d="M100 110V80" {...line} strokeWidth={6} />
        <circle cx={100} cy={110} r={6} fill={INK} stroke="none" />
      </g>
      <path d="M14 96Q8 110 14 124M186 96Q192 110 186 124" {...line} strokeWidth={5} opacity={0.4 + 0.5 * Math.abs(Math.sin(t / 3))} />
    </Svg>
  );
};

export const Moon: React.FC<IconProps> = ({size = 300, t}) => (
  <Svg size={size}>
    <path d="M118 24A76 76 0 1 0 176 130A62 62 0 1 1 118 24Z" fill={ACC} {...base} />
    {[[40, 50, 12, 0], [160, 40, 9, 12], [150, 100, 7, 24]].map(([x, y, r, o], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${0.75 + 0.3 * Math.max(0, Math.sin((t + o) / 9))})`}>
        <Star x={0} y={0} r={r} fill={PAPER} />
      </g>
    ))}
    {["Z", "z"].map((ch, i) => (
      <text key={i} x={118 + i * 28} y={150 - ((t + i * 22) % 66) * 0.7 - i * 22} fontFamily={theme.fonts.bn} fontWeight={700} fontSize={36 - i * 8} fill={INK} opacity={1 - ((t + i * 22) % 66) / 80}>{ch}</text>
    ))}
  </Svg>
);

export const Sunrise: React.FC<IconProps> = ({size = 300, t}) => {
  const rise = Math.min(1, t / 26);
  const e = 1 - Math.pow(1 - rise, 3);
  return (
    <Svg size={size}>
      <defs>
        <clipPath id="sky"><rect x={-20} y={-20} width={240} height={150} /></clipPath>
      </defs>
      <g clipPath="url(#sky)">
        <g transform={`rotate(${t * 0.4} 100 ${130 + (1 - e) * 52})`}>
          {Array.from({length: 11}).map((_, i) => {
            const a = (i / 11) * Math.PI * 2;
            const cy = 130 + (1 - e) * 52;
            return <path key={i} d={`M${100 + Math.cos(a) * 62} ${cy + Math.sin(a) * 62}L${100 + Math.cos(a) * 80} ${cy + Math.sin(a) * 80}`} {...line} stroke={ACC} strokeWidth={8} />;
          })}
        </g>
        <circle cx={100} cy={130 + (1 - e) * 52} r={46} fill={ACC} {...base} />
      </g>
      <rect x={14} y={130} width={172} height={46} rx={14} fill={MINT} {...base} />
      <path d="M40 150H78M110 150H160" {...line} strokeWidth={5} opacity={0.5} />
    </Svg>
  );
};

export const Rest: React.FC<IconProps> = ({size = 300, t}) => {
  const bob = Math.sin(t / 14) * 3;
  return (
    <Svg size={size}>
      <rect x={38} y={62} width={124} height={70} rx={24} fill={MINT} {...base} />
      <rect x={14} y={96} width={34} height={68} rx={16} fill={PAPER} {...base} />
      <rect x={152} y={96} width={34} height={68} rx={16} fill={PAPER} {...base} />
      <rect x={30} y={118} width={140} height={46} rx={18} fill={PAPER} {...base} />
      <rect x={68} y={78 + bob} width={64} height={30} rx={14} fill={ACC} {...base} />
      <path d="M46 164V178M154 164V178" {...line} />
      {[0, 1].map((i) => (
        <path key={i} d={`M${86 + i * 22} ${50 - ((t + i * 18) % 48) * 0.4}q-8 -8 0 -16q8 -8 0 -16`} {...line} strokeWidth={4} opacity={0.7 - ((t + i * 18) % 48) / 80} />
      ))}
    </Svg>
  );
};

// ---------- hook ----------
export const Pin: React.FC<IconProps> = ({size = 300, t}) => (
  <Svg size={size}>
    <ellipse cx={100} cy={176} rx={34 - Math.sin(t / 6) * 3} ry={8} fill={INK} opacity={0.14} />
    <g transform={`translate(0 ${-Math.abs(Math.sin(t / 10)) * 10})`}>
      <path d="M100 168C62 120 48 100 48 74a52 52 0 0 1 104 0c0 26-14 46-52 94Z" fill={ACC} {...base} />
      <circle cx={100} cy={74} r={20} fill={PAPER} {...base} />
    </g>
  </Svg>
);

export const BubbleDots: React.FC<IconProps & {done?: number}> = ({size = 300, t, done = 0}) => (
  <Svg size={size}>
    <path d="M30 40H170Q184 40 184 54V120Q184 134 170 134H92L56 168V134H30Q16 134 16 120V54Q16 40 30 40Z" fill={done > 0.5 ? theme.colors.primary : PAPER} {...base} />
    {done < 0.5 ? (
      [0, 1, 2].map((i) => (
        <circle key={i} cx={64 + i * 36} cy={88 - Math.max(0, Math.sin((t - i * 4) / 4)) * 10} r={10} fill={INK} stroke="none" />
      ))
    ) : (
      <path d="M62 88L90 114L140 62" fill="none" stroke={theme.colors.onPrimary} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
    )}
  </Svg>
);

export const ICONS: Record<number, React.FC<IconProps>> = {
  71: WashingMachine, 72: Plumber, 73: TrashBin, 74: Broom, 75: Shirt, 76: Mosque, 77: AlarmClock, 78: Moon, 79: Sunrise, 80: Rest,
};

export const CheckMark: React.FC<{size: number; color?: string; stroke?: number}> = ({size, color = theme.colors.onPrimary, stroke = 5}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);
