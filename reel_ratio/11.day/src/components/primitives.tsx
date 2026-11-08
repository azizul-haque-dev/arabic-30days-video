import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, springOf, SpringName } from "../theme";

const TAU = Math.PI * 2;

/* ───────────── Layer 1–5 stack: mesh → (content) → grade → grain → vignette ───────────── */

export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { bg, mint, accentSoft, primary } = theme.colors;
  const blob = (cx: number, cy: number, r: number, color: string, ph: number, a = 40) => (
    <div
      style={{
        position: "absolute",
        left: cx + Math.sin(t * 0.5 + ph) * a - r,
        top: cy + Math.cos(t * 0.4 + ph) * a - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
      }}
    />
  );
  const shapes = [
    { x: 120, y: 420, s: 120, r: 24, sp: 0.9 },
    { x: 900, y: 760, s: 90, r: 45, sp: 1.3 },
    { x: 80, y: 1320, s: 70, r: 35, sp: 1.1 },
    { x: 960, y: 1480, s: 140, r: 36, sp: 0.7 },
  ];
  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      {blob(180, 260, 640, mint, 0)}
      {blob(940, 980, 620, accentSoft, 2, 50)}
      {blob(260, 1700, 700, mint, 4)}
      {shapes.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: s.x + Math.sin(t * s.sp + i) * 14,
            top: s.y + Math.cos(t * s.sp * 0.8 + i) * 22,
            width: s.s,
            height: s.s,
            borderRadius: s.r,
            border: `4px solid ${primary}`,
            opacity: 0.09,
            transform: `rotate(${Math.sin(t * 0.4 + i) * 12 + i * 20}deg)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

export const Grade: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, ${theme.colors.primaryDeep}14 0%, transparent 35%, ${theme.colors.accent}12 100%)`,
      mixBlendMode: "multiply",
      pointerEvents: "none",
    }}
  />
);

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.07, mixBlendMode: "multiply" }}>
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 6} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 45%, transparent 55%, ${theme.colors.text}22 100%)`,
      pointerEvents: "none",
    }}
  />
);

/** Wraps every scene: background mesh below, grade/grain/vignette above, fast exit. */
export const SceneShell: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const exitStart = Math.max(0, duration - theme.frames.exit);
  const ex =
    duration <= theme.frames.exit || !Number.isFinite(duration)
      ? 0
      : interpolate(frame, [exitStart, duration], [0, 1], {
        easing: theme.ease.in,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  return (
    <AbsoluteFill>
      <BgMesh />
      <AbsoluteFill style={{ opacity: 1 - ex, transform: `translateY(${-ex * 24}px) scale(${1 - ex * 0.015})` }}>
        {children}
      </AbsoluteFill>
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};

/* ───────────── Motion helpers ───────────── */

type EnterProps = {
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  preset?: SpringName;
  /** sin-wave idle motion amplitude in px */
  breathe?: number;
  /** relative frame where a fast exit starts */
  exitAt?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/** Entrance = opacity + translate + scale together (never a lone fade). */
export const Enter: React.FC<EnterProps> = ({
  delay = 0,
  y = 40,
  x = 0,
  scale = 0.92,
  preset = "snappy",
  breathe = 0,
  exitAt,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springOf(frame, fps, delay, preset);
  const op = interpolate(frame - delay, [0, 8], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ex =
    exitAt === undefined || !Number.isFinite(exitAt)
      ? 0
      : interpolate(frame, [exitAt, exitAt + theme.frames.exit], [0, 1], {
        easing: theme.ease.in,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  const idle = breathe && frame > delay ? Math.sin(((frame - delay) / fps) * TAU * 0.35) * breathe : 0;
  const sc = interpolate(p, [0, 1], [scale, 1]) * (1 - ex * 0.04);
  return (
    <div
      style={{
        opacity: op * (1 - ex),
        transform: `translate(${(1 - p) * x}px, ${(1 - p) * y + idle - ex * 18}px) scale(${sc})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Word-by-word staggered reveal. Splits on spaces only, so Bengali conjuncts stay intact. */
export const WordReveal: React.FC<{
  text: string;
  delay?: number;
  fontSize: number;
  color?: string;
  weight?: number;
  family?: string;
  lineHeight?: number;
  align?: "center" | "left";
  gap?: number;
  stagger?: number;
  exitAt?: number;
  highlight?: string[];
  highlightColor?: string;
  wrap?: boolean;
}> = ({
  text,
  delay = 0,
  fontSize,
  color = theme.colors.text,
  weight = 700,
  family = theme.fonts.bn,
  lineHeight = 1.35,
  align = "center",
  gap = 16,
  stagger = theme.frames.stagger,
  exitAt,
  highlight = [],
  highlightColor = theme.colors.primary,
  wrap = true,
}) => {
    const words = text.split(" ");
    return (
      <div
        style={{
          display: "flex",
          flexWrap: wrap ? "wrap" : "nowrap",
          justifyContent: align === "center" ? "center" : "flex-start",
          columnGap: gap,
          whiteSpace: wrap ? "normal" : "nowrap",
          fontFamily: family,
          fontSize,
          fontWeight: weight,
          lineHeight,
          color,
        }}
      >
        {words.map((w, i) => (
          <Enter key={i} delay={delay + i * stagger} y={26} scale={0.9} exitAt={exitAt === undefined || !Number.isFinite(exitAt) ? undefined : exitAt + i * 2}>
            <span style={{ color: highlight.includes(w) ? highlightColor : color }}>{w}</span>
          </Enter>
        ))}
      </div>
    );
  };

/** Arabic is animated as ONE run (never split) so shaping and ligatures stay correct. */
export const ArabicLine: React.FC<{ text: string; delay?: number; size?: number; color?: string; exitAt?: number }> = ({
  text,
  delay = 0,
  size = 124,
  color = theme.colors.text,
  exitAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springOf(frame, fps, delay, "soft");
  const reveal = interpolate(frame - delay, [0, 18], [100, 0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ex =
    exitAt === undefined || !Number.isFinite(exitAt)
      ? 0
      : interpolate(frame, [exitAt, exitAt + theme.frames.exit], [0, 1], { easing: theme.ease.in, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      lang="ar"
      dir="rtl"
      style={{
        fontFamily: theme.fonts.ar,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.45,
        color,
        textAlign: "center",
        unicodeBidi: "isolate",
        direction: "rtl",
        clipPath: `inset(-40px 0 -40px ${reveal}%)`,
        opacity: (1 - ex) * interpolate(frame - delay, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `translateY(${(1 - p) * 30 - ex * 16}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/* ───────────── Brand pieces ───────────── */

export const LogoMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <rect x="4" y="4" width="112" height="112" rx="32" fill={theme.colors.primary} />
    <path d="M30 34 h60 a14 14 0 0 1 14 14 v28 a14 14 0 0 1 -14 14 h-34 l-20 16 v-16 h-6 a14 14 0 0 1 -14 -14 v-28 a14 14 0 0 1 14 -14z" fill={theme.colors.white} />
    <text x="60" y="78" textAnchor="middle" fontFamily={theme.fonts.ar} fontWeight={800} fontSize="52" fill={theme.colors.primary}>
      ع
    </text>
    <circle cx="96" cy="26" r="10" fill={theme.colors.accent} />
  </svg>
);

export const BrandLockup: React.FC<{ name: string; size?: number; color?: string }> = ({ name, size = 64, color = theme.colors.text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
    <LogoMark size={size} />
    <span style={{ fontFamily: theme.fonts.en, fontWeight: 700, fontSize: size * 0.64, color, letterSpacing: -0.5 }}>{name}</span>
  </div>
);

export const Pill: React.FC<{
  children: React.ReactNode;
  bg?: string;
  color?: string;
  size?: number;
  px?: number;
  py?: number;
  style?: React.CSSProperties;
}> = ({ children, bg = theme.colors.primary, color = theme.colors.white, size = 40, px = 36, py = 14, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      background: bg,
      color,
      fontFamily: theme.fonts.en,
      fontWeight: 700,
      fontSize: size,
      padding: `${py}px ${px}px`,
      borderRadius: theme.radius.pill,
      boxShadow: `0 14px 30px ${theme.colors.shadow}`,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      background: theme.colors.white,
      borderRadius: theme.radius.card,
      boxShadow: `0 24px 60px ${theme.colors.shadow}`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Top bar used on content scenes: brand + optional right badge. */
export const BrandBar: React.FC<{ name: string; right?: React.ReactNode; delay?: number }> = ({ name, right, delay = 0 }) => (
  <div
    style={{
      position: "absolute",
      top: theme.safe.top,
      left: theme.safe.x,
      right: theme.safe.x,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Enter delay={delay} y={-24} x={-10}>
      <BrandLockup name={name} size={68} />
    </Enter>
    <Enter delay={delay + 5} y={-24} x={10} preset="pop">
      {right}
    </Enter>
  </div>
);

export const ProgressRing: React.FC<{
  value: number;
  total: number;
  percent: number;
  delay?: number;
  size?: number;
  fromValue?: number;
}> = ({ value, total, percent, delay = 0, size = 440, fromValue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = interpolate(frame - delay, [0, fps * 1.6], [0, 1], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const start = fromValue ?? 0;
  const shown = Math.round(start + (value - start) * k);
  const r = size / 2 - 28;
  const C = 2 * Math.PI * r;
  const frac = (start + (value - start) * k) / total;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill={theme.colors.white} stroke={theme.colors.mint} strokeWidth={28} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={theme.colors.primary}
          strokeWidth={28}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - frac)}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: theme.fonts.en }}>
        <div style={{ fontSize: size * 0.27, fontWeight: 700, color: theme.colors.text, lineHeight: 1 }}>{shown}</div>
        <div style={{ fontSize: size * 0.085, fontWeight: 600, color: theme.colors.textSoft, marginTop: 8 }}>/ {total}</div>
        <div style={{ fontSize: size * 0.085, fontWeight: 700, color: theme.colors.accentDark, marginTop: 6 }}>{percent}%</div>
      </div>
    </div>
  );
};

/** Shows the script line that is active at the current frame, cleanly switching between lines with zero overlap. */
export const CaptionStack: React.FC<{
  lines: { id: string; text: string }[];
  starts: Record<string, number>;
  fontSize?: number;
  highlight?: string[];
}> = ({ lines, starts, fontSize = 56, highlight }) => {
  const frame = useCurrentFrame();
  const ordered = lines
    .filter((l) => starts[l.id] !== undefined)
    .sort((a, b) => starts[a.id] - starts[b.id]);
  return (
    <div style={{ position: "relative", minHeight: fontSize * 3.4 }}>
      {ordered.map((l, i) => {
        const s = starts[l.id];
        const next = ordered[i + 1] ? starts[ordered[i + 1].id] : undefined;
        // Strictly only show line l while frame is in [s, next)
        if (frame < s || (next !== undefined && frame >= next)) return null;

        const fadeStart = next !== undefined ? Math.max(s + 2, next - 6) : 0;
        const fadeOut =
          next !== undefined && fadeStart < next && frame >= fadeStart
            ? interpolate(frame, [fadeStart, next], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1;

        return (
          <div
            key={l.id}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              opacity: fadeOut,
            }}
          >
            <Sequence_ from={s}>
              <WordReveal
                text={l.text}
                fontSize={fontSize}
                weight={600}
                highlight={highlight}
                highlightColor={theme.colors.primary}
              />
            </Sequence_>
          </div>
        );
      })}
    </div>
  );
};

import { Sequence } from "remotion";
const Sequence_: React.FC<{ from: number; children: React.ReactNode }> = ({ from, children }) => (
  <Sequence from={from} layout="none">
    {children}
  </Sequence>
);
