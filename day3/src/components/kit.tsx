import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";

const clampOpt = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const bn = (n: number | string) =>
  String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);

/* ───────────── global layers ───────────── */

export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 55) * 60;
  const d2 = Math.cos(frame / 70) * 50;
  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <div
        style={{
          position: "absolute", width: 1100, height: 1100, borderRadius: "50%",
          top: -480, left: -380 + d1, filter: "blur(40px)",
          background: `radial-gradient(circle, ${theme.colors.primary}40, transparent 64%)`,
        }}
      />
      <div
        style={{
          position: "absolute", width: 900, height: 900, borderRadius: "50%",
          bottom: -420, right: -300 - d2, filter: "blur(50px)",
          background: `radial-gradient(circle, ${theme.colors.accent}38, transparent 66%)`,
        }}
      />
      <div
        style={{
          position: "absolute", inset: 0, opacity: 0.5,
          backgroundImage: `radial-gradient(${theme.colors.line} 2px, transparent 2.5px)`,
          backgroundSize: "54px 54px",
          backgroundPosition: `${(frame * 0.25) % 54}px ${(frame * 0.15) % 54}px`,
        }}
      />
    </AbsoluteFill>
  );
};

export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{ backgroundColor: theme.colors.primary, mixBlendMode: "soft-light", opacity: 0.12 }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.10), transparent 25%, transparent 75%, rgba(16,35,29,0.06))",
      }}
    />
  </AbsoluteFill>
);

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none", backgroundImage: noise, backgroundSize: "220px",
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.05, mixBlendMode: "multiply",
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: "radial-gradient(ellipse at center, transparent 60%, rgba(16,35,29,0.10) 100%)",
    }}
  />
);

/* ───────────── motion primitives ───────────── */

/** Scene wrapper: transparent, exits (fast) during its last frames. */
export const SceneFrame: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const x = dur - theme.motion.exit;
  const o = interpolate(frame, [x, dur - 1], [1, 0], { ...clampOpt, easing: theme.ease.in });
  const y = interpolate(frame, [x, dur - 1], [0, -26], { ...clampOpt, easing: theme.ease.in });
  const s = interpolate(frame, [x, dur - 1], [1, 0.97], { ...clampOpt, easing: theme.ease.in });
  return (
    <AbsoluteFill style={{ opacity: o, transform: `translateY(${y}px) scale(${s})` }}>
      {children}
    </AbsoluteFill>
  );
};

type Dir = "up" | "down" | "left" | "right" | "scale";

/** Premium entrance: opacity + translate + scale together. */
export const Pop: React.FC<{
  at?: number;
  dir?: Dir;
  dist?: number;
  cfg?: keyof typeof theme.spring;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at = 0, dir = "up", dist = 44, cfg = "smooth", style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring[cfg] });
  const dx = dir === "left" ? -dist : dir === "right" ? dist : 0;
  const dy = dir === "up" ? dist : dir === "down" ? -dist : 0;
  const s0 = dir === "scale" ? 0.78 : 0.94;
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 0.6], [0, 1], clampOpt),
        transform: `translate(${interpolate(p, [0, 1], [dx, 0])}px, ${interpolate(p, [0, 1], [dy, 0])}px) scale(${interpolate(p, [0, 1], [s0, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Word-by-word staggered text. Splits ONLY on spaces — Bengali clusters are never broken. */
export const Words: React.FC<{
  text: string;
  at?: number;
  per?: number;
  size: number;
  color?: string;
  weight?: number;
  align?: "left" | "center" | "right";
  gap?: number;
  lineHeight?: number;
  accent?: number[];
  accentColor?: string;
  style?: React.CSSProperties;
}> = ({
  text, at = 0, per = theme.motion.wordGap, size, color = theme.colors.text,
  weight = theme.weight.display, align = "left", gap, lineHeight = 1.28,
  accent = [], accentColor = theme.colors.primary, style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = gap ?? Math.round(size * 0.26);
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex", flexWrap: "wrap", columnGap: g, rowGap: 0,
        justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        fontFamily: theme.fonts.display, fontSize: size, fontWeight: weight,
        lineHeight, letterSpacing: 0, color, textAlign: align, ...style,
      }}
    >
      {words.map((w, i) => {
        const p = spring({ frame: frame - at - i * per, fps, config: theme.spring.snappy });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: interpolate(p, [0, 0.7], [0, 1], clampOpt),
              transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
              color: accent.includes(i) ? accentColor : color,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Diagonal light sweep across a card (overflow hidden by the parent). */
export const Shine: React.FC<{ at: number; dur?: number; tone?: "light" | "amber"; every?: number }> = ({
  at: at0, dur = 22, tone = "light", every,
}) => {
  const frame = useCurrentFrame();
  // `every` → repeating idle shine (keeps long holds alive)
  const at = every && frame >= at0 ? at0 + Math.floor((frame - at0) / every) * every : at0;
  const x = interpolate(frame, [at, at + dur], [-40, 140], { ...clampOpt, easing: theme.ease.inOut });
  const o = interpolate(frame, [at, at + 4, at + dur - 4, at + dur], [0, 1, 1, 0], clampOpt);
  const c = tone === "light" ? "rgba(255,255,255,0.38)" : `${theme.colors.accent}66`;
  return (
    <div
      style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: o, overflow: "hidden",
        borderRadius: "inherit",
      }}
    >
      <div
        style={{
          position: "absolute", top: "-20%", bottom: "-20%", width: "26%", left: `${x}%`,
          transform: "skewX(-18deg)",
          background: `linear-gradient(90deg, transparent, ${c}, transparent)`,
        }}
      />
    </div>
  );
};

/** One-shot spring pulse at frame `at` → returns scale multiplier. */
export const usePulse = (at: number, amount = 0.035) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - at, fps,
    config: { damping: 9, stiffness: 180, mass: 0.6 },
  });
  const live = frame >= at ? 1 : 0;
  return 1 + live * amount * (1 - p) * 1.0 * (frame - at < 40 ? 1 : 0);
};

export const useBreathe = (period = 22, amp = 0.015, floatPx = 4) => {
  const frame = useCurrentFrame();
  return {
    scale: 1 + Math.sin(frame / period) * amp,
    y: Math.sin(frame / (period * 1.4)) * floatPx,
  };
};

/* ───────────── shared card shells ───────────── */

export const GlassCard: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({
  style, children,
}) => (
  <div
    style={{
      position: "relative", background: theme.colors.card, borderRadius: theme.radius.card,
      boxShadow: theme.shadow.card, border: `2px solid ${theme.colors.line}`, ...style,
    }}
  >
    {children}
  </div>
);

export const HeroCard: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({
  style, children,
}) => (
  <div
    style={{
      position: "relative", overflow: "hidden", borderRadius: theme.radius.card,
      background: `linear-gradient(145deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
      boxShadow: theme.shadow.hero, ...style,
    }}
  >
    {children}
  </div>
);

export const Tag: React.FC<{ children: React.ReactNode; tone?: "amber" | "hero" | "soft"; size?: number }> = ({
  children, tone = "amber", size = 30,
}) => {
  const bg = tone === "amber" ? theme.colors.accent : tone === "hero" ? theme.colors.primary : theme.colors.primarySoft;
  const fg = tone === "hero" ? theme.colors.onPrimary : theme.colors.text;
  return (
    <span
      style={{
        display: "inline-block", padding: `${Math.round(size * 0.12)}px ${Math.round(size * 0.55)}px`,
        borderRadius: theme.radius.pill, background: bg, color: fg, fontFamily: theme.fonts.display,
        fontWeight: theme.weight.display, fontSize: size, lineHeight: 1.3, letterSpacing: 0,
      }}
    >
      {children}
    </span>
  );
};

/* ───────────── icons (SVG, theme colors only) ───────────── */

export type IconKind =
  | "door" | "cup" | "house" | "city" | "sun" | "chat" | "meter" | "drop" | "bubbles" | "check";

export const Icon: React.FC<{ kind: IconKind; size: number; stroke?: string; fill?: string }> = ({
  kind, size, stroke = theme.colors.primary, fill = theme.colors.accent,
}) => {
  const p = { fill: "none", stroke, strokeWidth: 5, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const rays = Array.from({ length: 8 }).map((_, i) => {
    const a = (i * Math.PI) / 4;
    return (
      <line key={i} {...p} x1={50 + Math.cos(a) * 26} y1={50 + Math.sin(a) * 26}
        x2={50 + Math.cos(a) * 40} y2={50 + Math.sin(a) * 40} />
    );
  });
  let body: React.ReactNode = null;
  switch (kind) {
    case "door":
      body = (<>
        <rect {...p} x={14} y={14} width={44} height={72} rx={7} />
        <circle cx={46} cy={50} r={4} fill={fill} />
        <path {...p} d="M62 50 H90 M80 39 L91 50 L80 61" />
      </>);
      break;
    case "cup":
      body = (<>
        <path {...p} d="M20 44 H68 V60 a20 20 0 0 1 -20 20 H40 a20 20 0 0 1 -20 -20 Z" />
        <path {...p} d="M68 50 h7 a8 8 0 0 1 0 16 h-9" />
        <path {...p} stroke={fill} d="M34 33 q-6 -8 0 -15 M50 33 q-6 -8 0 -15" />
      </>);
      break;
    case "house":
      body = (<>
        <path {...p} d="M12 50 L50 16 L88 50" />
        <path {...p} d="M23 42 V84 H77 V42" />
        <path {...p} stroke={fill} d="M43 84 V62 H57 V84" />
      </>);
      break;
    case "city":
      body = (<>
        <path {...p} d="M10 88 H90 M16 88 V54 H33 V88 M33 88 V38 H52 V88 M52 88 V60 H68 V88 M68 88 V46 H85 V88" />
        <circle cx={50} cy={18} r={8} fill={fill} />
        <path {...p} stroke={fill} d="M30 14 H34 M66 14 H70 M50 2 V4" />
      </>);
      break;
    case "sun":
      body = (<>
        <circle cx={50} cy={50} r={17} fill={fill} stroke={fill} strokeWidth={3} />
        {rays}
      </>);
      break;
    case "chat":
      body = (<>
        <path {...p} d="M18 18 H82 a8 8 0 0 1 8 8 V62 a8 8 0 0 1 -8 8 H48 L30 86 V70 H18 a8 8 0 0 1 -8 -8 V26 a8 8 0 0 1 8 -8 Z" />
        <path {...p} stroke={fill} d="M41 38 a9 9 0 1 1 13 8 c-3 2 -4 4 -4 8" />
        <circle cx={50} cy={61} r={3} fill={fill} />
      </>);
      break;
    case "meter":
      body = (<>
        <rect x={18} y={64} width={16} height={22} rx={5} fill={fill} />
        <rect {...p} x={42} y={44} width={16} height={42} rx={5} />
        <rect {...p} x={66} y={20} width={16} height={66} rx={5} />
      </>);
      break;
    case "drop":
      body = (<>
        <path {...p} d="M50 10 C50 10 22 42 22 62 a28 28 0 0 0 56 0 C78 42 50 10 50 10 Z" />
        <path {...p} stroke={fill} d="M36 64 a14 14 0 0 0 10 13" />
      </>);
      break;
    case "bubbles":
      body = (<>
        <path {...p} d="M14 20 H62 V52 H36 L24 64 V52 H14 Z" />
        <path {...p} stroke={fill} d="M40 48 H86 V76 H76 V88 L62 76 H40 Z" />
      </>);
      break;
    case "check":
      body = (<>
        <circle {...p} cx={50} cy={50} r={36} />
        <path {...p} stroke={fill} strokeWidth={7} d="M32 52 L45 65 L70 36" />
      </>);
      break;
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      {body}
    </svg>
  );
};

/* ───────────── text fitting (estimate, conservative for Bengali) ───────────── */

export const fitSize = (text: string, maxW: number, maxLines: number, max: number, min: number) => {
  for (let s = max; s >= min; s -= 4) {
    const cw = s * 0.47;
    let lines = 1;
    let w = 0;
    let tooWide = false;
    for (const word of text.split(" ")) {
      const ww = [...word].length * cw;
      if (ww > maxW) tooWide = true;
      const need = w === 0 ? ww : w + s * 0.26 + ww;
      if (need > maxW && w > 0) {
        lines++;
        w = ww;
      } else w = need;
    }
    if (!tooWide && lines <= maxLines) return s;
  }
  return min;
};

export const Waveform: React.FC<{ bars?: number; h?: number; color?: string }> = ({
  bars = 7, h = 40, color = theme.colors.primary,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, height: h }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 8, borderRadius: 8, background: color,
            height: h * (0.3 + 0.7 * Math.abs(Math.sin(frame / 5 + i * 0.9))),
          }}
        />
      ))}
    </div>
  );
};

export const Tick: React.FC<{ at: number; size: number; color?: string }> = ({
  at, size, color = theme.colors.primary,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 10], [0, 1], { ...clampOpt, easing: theme.ease.out });
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <path d="M8 21 L17 30 L33 11" fill="none" stroke={color} strokeWidth={5.5}
        strokeLinecap="round" strokeLinejoin="round" strokeDasharray={40} strokeDashoffset={40 * (1 - t)} />
    </svg>
  );
};
