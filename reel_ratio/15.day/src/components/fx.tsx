import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Img } from "remotion";
import { theme } from "../theme";

export const clampI = (frame: number, a: number[], b: number[], easing = theme.ease.out) =>
  interpolate(frame, a, b, { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 80) * 60, d2 = Math.cos(frame / 95) * 50;
  const c = theme.colors;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${c.bg} 0%, ${c.bgAlt} 100%)` }}>
      <div style={{ position: "absolute", width: 1300, height: 1300, borderRadius: "50%", top: -600, left: -300 + d1,
        background: `radial-gradient(circle, ${c.primary}26, transparent 62%)` }} />
      <div style={{ position: "absolute", width: 1000, height: 1000, borderRadius: "50%", bottom: -520, right: -250 - d2,
        background: `radial-gradient(circle, ${c.accent}22, transparent 65%)` }} />
    </AbsoluteFill>
  );
};

export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.primary, opacity: 0.04 }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.10), transparent 25%, transparent 75%, rgba(16,35,29,0.06))" }} />
  </AbsoluteFill>
);

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: `url(${staticFile("grain.png")})`, backgroundSize: "256px",
      backgroundPosition: `${(frame * 37) % 256}px ${(frame * 71) % 256}px`, opacity: 0.035 }} />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 62%, rgba(16,35,29,0.10) 100%)" }} />
);

/** fade + rise + scale entrance (spring), optional exit */
export const Entrance: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties;
  dy?: number; dx?: number; exitAt?: number; cfg?: keyof typeof theme.spring }> = ({ delay = 0, children, style, dy = 40, dx = 0, exitAt, cfg = "smooth" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring[cfg] });
  const ex = exitAt === undefined ? 0 : clampI(frame, [exitAt, exitAt + 9], [0, 1], theme.ease.in);
  const k = p * (1 - ex);
  return (
    <div style={{ opacity: k, transform: `translate(${(1 - p) * dx - ex * dx * 0.3}px, ${(1 - p) * dy - ex * 22}px) scale(${0.94 + 0.06 * p - ex * 0.03})`, ...style }}>
      {children}
    </div>
  );
};

/** Brand wipe covering scene changes (centered on frame `at`) */
export const Wipe: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const r = 8;
  if (frame < at - r - 1 || frame > at + r + 1) return null;
  const x = frame < at
    ? interpolate(frame, [at - r, at], [-110, 0], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : interpolate(frame, [at, at + r], [0, 110], { easing: theme.ease.in, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", transform: `translateX(${x}%) skewX(-12deg)`, width: "112%", left: "-6%" }}>
      <div style={{ position: "absolute", inset: 0, background: theme.colors.primary }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 70, background: theme.colors.accent }} />
    </AbsoluteFill>
  );
};

export const Pill: React.FC<{ children: React.ReactNode; bg?: string; color?: string; size?: number; style?: React.CSSProperties }> =
  ({ children, bg = theme.colors.primary, color = "#fff", size = 40, style }) => (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: `${size * 0.28}px ${size * 0.7}px`, borderRadius: 999,
      background: bg, color, fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: size, lineHeight: 1.3, ...style }}>{children}</div>
  );

export const BrandChip: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 62, height: 62, borderRadius: 18, background: theme.colors.primary, display: "grid", placeItems: "center",
      boxShadow: `0 10px 24px ${theme.colors.glow}` }}>
      <span style={{ fontFamily: theme.fonts.ar, fontWeight: 700, fontSize: 40, color: "#fff", lineHeight: 1, marginTop: -4 }}>ع</span>
    </div>
    <div style={{ lineHeight: 1.1 }}>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 34, color: theme.colors.text }}>Arabic Master</div>
      <div style={{ fontFamily: theme.fonts.bn, fontWeight: 500, fontSize: 24, color: theme.colors.textDim }}>আরবিক মাস্টার</div>
    </div>
  </div>
);
