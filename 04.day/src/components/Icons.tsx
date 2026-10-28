import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { useSpring } from "../anim";

const C = theme.colors;

// ── helpers ──
const S = (p: number, from = 0, to = 1) => Math.max(0, Math.min(1, (p - from) / (to - from)));
const Line: React.FC<{ d: string; p: number; w?: number; color?: string; from?: number; to?: number; dash?: string }> = ({
  d, p, w = 9, color = C.text, from = 0, to = 1, dash }) => (
  <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"
    strokeDasharray={dash ?? "1"} strokeDashoffset={dash ? 0 : 1 - S(p, from, to)} opacity={dash ? S(p, from, to) : 1} />
);
const Fill: React.FC<{ d: string; p: number; color: string; from?: number; to?: number }> = ({ d, p, color, from = 0.3, to = 0.9 }) => (
  <path d={d} fill={color} opacity={S(p, from, to)} />
);

type IconProps = { p: number };

const Bubble: React.FC<IconProps> = ({ p }) => (
  <>
    <Fill p={p} color={C.primarySoft} d="M40 50h120a20 20 0 0 1 20 20v60a20 20 0 0 1-20 20H90l-30 28v-28H40a20 20 0 0 1-20-20V70a20 20 0 0 1 20-20z" />
    <Line p={p} d="M40 50h120a20 20 0 0 1 20 20v60a20 20 0 0 1-20 20H90l-30 28v-28H40a20 20 0 0 1-20-20V70a20 20 0 0 1 20-20z" />
    <Line p={p} from={0.4} d="M82 90a18 18 0 1 1 28 15c-6 4-10 7-10 15" color={C.accent} />
    <circle cx="100" cy="138" r={6 * S(p, 0.7, 1)} fill={C.accent} />
  </>
);
const Repeat: React.FC<IconProps> = ({ p }) => (
  <>
    <circle cx="100" cy="100" r="62" fill={C.primarySoft} opacity={S(p, 0.3, 0.9)} />
    <Line p={p} to={0.8} d="M46 96a56 56 0 0 1 96-30" />
    <Line p={p} from={0.5} d="M126 58l18 8-6 20" color={C.accent} />
    <Line p={p} to={0.8} d="M154 104a56 56 0 0 1-96 30" />
    <Line p={p} from={0.5} d="M74 142l-18-8 6-20" color={C.accent} />
  </>
);
const Gauge: React.FC<IconProps> = ({ p }) => {
  const needle = interpolate(S(p, 0.4, 1), [0, 1], [30, -52]);
  return (
    <>
      <Fill p={p} color={C.primarySoft} d="M24 140a76 76 0 0 1 152 0z" />
      <Line p={p} d="M24 140a76 76 0 0 1 152 0" />
      <Line p={p} from={0.3} d="M40 140h14M62 86l10 10M100 66v14M138 86l-10 10M146 140h14" w={7} />
      <g transform={`rotate(${needle} 100 140)`} opacity={S(p, 0.4, 0.6)}>
        <line x1="100" y1="140" x2="100" y2="82" stroke={C.accent} strokeWidth="9" strokeLinecap="round" />
      </g>
      <circle cx="100" cy="140" r={11 * S(p, 0.5, 0.8)} fill={C.text} />
      <Line p={p} from={0.6} d="M40 168h120" w={7} color={C.line} />
    </>
  );
};
const Lens: React.FC<IconProps> = ({ p }) => (
  <>
    <Line p={p} to={0.5} d="M34 62h70M34 90h44M34 118h56" w={9} color={C.textDim} />
    <circle cx="106" cy="98" r="44" fill={C.primarySoft} opacity={S(p, 0.3, 0.8)} />
    <Line p={p} from={0.1} d="M106 54a44 44 0 1 1 0 88a44 44 0 1 1 0-88" />
    <Line p={p} from={0.5} d="M138 130l36 36" w={14} color={C.accent} />
    <Line p={p} from={0.6} d="M92 88a14 14 0 1 1 20 12c-4 2-6 5-6 10" w={8} color={C.primary} />
    <circle cx="106" cy="124" r={4.5 * S(p, 0.8, 1)} fill={C.primary} />
  </>
);
const Shrug: React.FC<IconProps> = ({ p }) => (
  <>
    <Fill p={p} color={C.primarySoft} d="M44 176a56 50 0 0 1 112 0z" />
    <Line p={p} d="M44 176a56 50 0 0 1 112 0" />
    <circle cx="100" cy="92" r="30" fill={C.surface} stroke={C.text} strokeWidth="9" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - S(p, 0.1, 0.6)} />
    <Line p={p} from={0.5} d="M86 98h0M114 98h0" w={9} />
    <Line p={p} from={0.6} d="M90 114q10 6 20 0" w={7} />
    <Line p={p} from={0.6} d="M150 38a14 14 0 1 1 20 12c-4 2-6 4-6 9" w={7} color={C.accent} />
    <circle cx="164" cy="74" r={3.5 * S(p, 0.9, 1)} fill={C.accent} />
    <Line p={p} from={0.6} d="M26 56a12 12 0 1 1 18 10c-3 2-5 3-5 8" w={7} color={C.accent} />
    <circle cx="39" cy="86" r={3 * S(p, 0.9, 1)} fill={C.accent} />
  </>
);
const NameTag: React.FC<IconProps> = ({ p }) => (
  <>
    <Fill p={p} color={C.primarySoft} d="M34 56h132a14 14 0 0 1 14 14v92a14 14 0 0 1-14 14H34a14 14 0 0 1-14-14V70a14 14 0 0 1 14-14z" />
    <Line p={p} d="M34 56h132a14 14 0 0 1 14 14v92a14 14 0 0 1-14 14H34a14 14 0 0 1-14-14V70a14 14 0 0 1 14-14z" />
    <Line p={p} from={0.3} d="M84 42h32" w={11} color={C.accent} />
    <circle cx="66" cy="102" r="17" fill="none" stroke={C.text} strokeWidth="8" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - S(p, 0.3, 0.7)} />
    <Line p={p} from={0.4} d="M40 144a26 20 0 0 1 52 0" w={8} />
    <Line p={p} from={0.6} d="M112 96h50M112 126h50" w={9} dash="3 12" color={C.textDim} />
  </>
);
const Clock: React.FC<IconProps> = ({ p }) => {
  const spin = interpolate(S(p, 0.5, 1), [0, 1], [-120, 0]);
  return (
    <>
      <circle cx="100" cy="106" r="66" fill={C.primarySoft} opacity={S(p, 0.3, 0.9)} />
      <Line p={p} d="M100 40a66 66 0 1 1 0 132a66 66 0 1 1 0-132" />
      <g transform={`rotate(${spin} 100 106)`}>
        <Line p={p} from={0.4} d="M100 106V66" w={9} color={C.accent} />
      </g>
      <Line p={p} from={0.5} d="M100 106l30 18" w={9} />
      <circle cx="100" cy="106" r={7 * S(p, 0.6, 0.9)} fill={C.text} />
      <Line p={p} from={0.7} d="M46 40l-14 14M154 40l14 14" w={9} color={C.accent} />
    </>
  );
};
const CloudSun: React.FC<IconProps> = ({ p }) => (
  <>
    <circle cx="136" cy="68" r="26" fill={C.accentSoft} opacity={S(p, 0.2, 0.7)} />
    <Line p={p} from={0.1} d="M136 42a26 26 0 1 1 0 52a26 26 0 1 1 0-52" color={C.accent} />
    <Line p={p} from={0.4} d="M136 18v10M170 32l-7 7M182 68h-10M102 32l7 7" w={7} color={C.accent} />
    <Fill p={p} color={C.primarySoft} d="M58 164a34 34 0 0 1-2-68a44 44 0 0 1 84 10a30 30 0 0 1-2 58z" />
    <Line p={p} d="M58 164a34 34 0 0 1-2-68a44 44 0 0 1 84 10a30 30 0 0 1-2 58z" />
    <Line p={p} from={0.6} d="M80 134q20 14 40 0" w={8} />
  </>
);
const Peak: React.FC<IconProps> = ({ p }) => (
  <>
    <Fill p={p} color={C.primarySoft} d="M16 168L84 54l36 62 22-34 42 86z" />
    <Line p={p} d="M16 168L84 54l36 62 22-34 42 86z" />
    <Line p={p} from={0.5} d="M84 54V22l30 12-30 12" w={8} color={C.accent} />
    <Line p={p} from={0.6} d="M44 150q20-14 38-30t30-6" w={7} dash="2 12" color={C.textDim} />
  </>
);
const HeartBadge: React.FC<IconProps> = ({ p }) => {
  const beat = 1 + Math.sin(useCurrentFrame() / 7) * 0.025;
  return (
    <>
      <circle cx="100" cy="100" r="74" fill={C.primarySoft} opacity={S(p, 0.2, 0.8)} />
      <Line p={p} d="M100 26a74 74 0 1 1 0 148a74 74 0 1 1 0-148" />
      <g transform={`translate(100 108) scale(${beat}) translate(-100 -108)`}>
        <Fill p={p} color={C.accent} from={0.5} to={1} d="M100 140C60 114 56 84 76 72c12-7 22-2 24 8c2-10 12-15 24-8c20 12 16 42-24 68z" />
        <Line p={p} from={0.3} d="M100 140C60 114 56 84 76 72c12-7 22-2 24 8c2-10 12-15 24-8c20 12 16 42-24 68z" />
      </g>
      <Line p={p} from={0.7} d="M162 36l0 14M155 43h14M36 150l0 12M30 156h12" w={7} color={C.accent} />
    </>
  );
};

const KINDS = [Bubble, Repeat, Gauge, Lens, Shrug, NameTag, Clock, CloudSun, Peak, HeartBadge];

/** Line-draw doodle for sentence n (1–10). Draws itself on, then idles with a gentle float. */
export const SceneIcon: React.FC<{ n: number; size: number; delay?: number }> = ({ n, size, delay = 0 }) => {
  const frame = useCurrentFrame();
  const draw = useSpring(delay, "smooth");
  const Icon = KINDS[(n - 1) % KINDS.length];
  const float = Math.sin(frame / 28) * 4;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={{ overflow: "visible", transform: `translateY(${float}px)` }}>
      <Icon p={Math.min(1, draw)} />
    </svg>
  );
};

// ── small UI glyphs ──
export const CheckGlyph: React.FC<{ size: number; p: number; color?: string }> = ({ size, p, color = C.onPrimary }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"
      pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Math.max(0, Math.min(1, p))} />
  </svg>
);
export const PlayGlyph: React.FC<{ size: number; color?: string }> = ({ size, color = C.onPrimary }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}><path d="M8 5.5v13l11-6.5z" fill={color} /></svg>
);
export const PlusGlyph: React.FC<{ size: number; color?: string }> = ({ size, color = C.onPrimary }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}><path d="M12 5v14M5 12h14" stroke={color} strokeWidth="3.2" strokeLinecap="round" /></svg>
);
export const CommentGlyph: React.FC<{ size: number; color?: string }> = ({ size, color = C.primary }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-5 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <path d="M8 10h8M8 13h5" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);
export const HeadphoneGlyph: React.FC<{ size: number; color?: string }> = ({ size, color = C.primary }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path d="M4 15v-3a8 8 0 0 1 16 0v3" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <rect x="3" y="14" width="4" height="7" rx="2" fill={color} /><rect x="17" y="14" width="4" height="7" rx="2" fill={color} />
  </svg>
);

/** Sound-wave bars; `energy` (0–1) scales them, so they "speak" only while the phrase is being said. */
export const WaveBars: React.FC<{ count?: number; w: number; h: number; energy: number; color?: string; gap?: number }> = ({
  count = 9, w, h, energy, color = C.primary, gap = 8 }) => {
  const frame = useCurrentFrame();
  const barW = (w - gap * (count - 1)) / count;
  return (
    <div style={{ display: "flex", alignItems: "center", gap, height: h }}>
      {Array.from({ length: count }).map((_, i) => {
        const amp = 0.18 + energy * (0.45 + 0.37 * Math.abs(Math.sin(frame / 4 + i * 1.3)));
        return <div key={i} style={{ width: barW, height: h * amp, borderRadius: barW, background: color, opacity: 0.35 + energy * 0.65 }} />;
      })}
    </div>
  );
};
