import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { LOGO } from "../config/assets";
import { theme } from "../theme";
import { fadeIn, useBreathe, useEnter } from "../utils/motion";
import type { Rect, SceneSpec } from "../types";

export const rectOf = (spec: SceneSpec, id: string): Rect => {
  const u = spec.ui.find((x) => x.id === id);
  if (!u) throw new Error(`ui box "${id}" missing in scene spec`);
  return u.rect;
};
const box = (r: Rect): React.CSSProperties => ({ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h });

export const Logo: React.FC<{ rect: Rect; delay?: number }> = ({ rect, delay = 0 }) => {
  const p = useEnter(delay, "pop");
  const b = useBreathe(0.015, 3.4);
  return (
    <Img src={staticFile(LOGO.file)} style={{ ...box(rect), opacity: fadeIn(p), transform: `scale(${(0.5 + 0.5 * p) * (1 + b)}) rotate(${(1 - p) * -12}deg)`, filter: `drop-shadow(0 14px 24px ${theme.colors.shadow})` }} />
  );
};

/** Brand row: logo + (spec text) brand name on the left, episode/sentence badge panel on the right. */
export const BrandHeader: React.FC<{ spec: SceneSpec }> = ({ spec }) => (
  <>
    <Logo rect={rectOf(spec, "logo")} />
    <Panel rect={rectOf(spec, "badgePanel")} fill="primary" radius={40} delay={4} />
  </>
);

export const Panel: React.FC<{ rect: Rect; fill: "primary" | "accent" | "white" | "soft"; radius?: number; delay?: number; border?: boolean; round?: boolean; shadow?: boolean }> = ({ rect, fill, radius = 40, delay = 0, border, round, shadow = true }) => {
  const p = useEnter(delay, "pop");
  const b = useBreathe(0.008, 3.6, rect.x);
  const bg = { primary: theme.colors.primary, accent: theme.colors.accent, white: theme.colors.white, soft: theme.colors.primarySoft }[fill];
  return (
    <div style={{ ...box(rect), background: bg, borderRadius: round ? "50%" : radius, opacity: fadeIn(p), transform: `scale(${(0.8 + 0.2 * p) * (1 + b)})`, boxShadow: shadow ? `0 18px 44px ${theme.colors.shadow}` : "none", border: border ? `4px solid ${theme.colors.line}` : "none" }} />
  );
};

/** Horizontal progress bar; fill animates with an eased spring. */
export const ProgressBar: React.FC<{ rect: Rect; value: number; delay?: number }> = ({ rect, value, delay = 0 }) => {
  const p = useEnter(delay, "soft");
  const f = Math.min(1, Math.max(0, p));
  return (
    <div style={{ ...box(rect), borderRadius: rect.h / 2, background: theme.colors.primarySoft, overflow: "hidden", opacity: fadeIn(p), boxShadow: `inset 0 2px 6px ${theme.colors.shadow}` }}>
      <div style={{ width: `${value * 100 * f}%`, height: "100%", borderRadius: rect.h / 2, background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryDark})` }} />
    </div>
  );
};

/** Ten dots = the ten sentences of the episode; completed ones are green, the current one is amber. */
export const DotsBar: React.FC<{ rect: Rect; current: number; delay?: number }> = ({ rect, current, delay = 0 }) => {
  const p = useEnter(delay, "soft");
  const size = rect.h;
  const gap = (rect.w - size * 10) / 9;
  return (
    <div style={{ ...box(rect), opacity: fadeIn(p) }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: i * (size + gap), top: 0, width: size, height: size, borderRadius: "50%", background: i < current ? theme.colors.primary : i === current ? theme.colors.accent : theme.colors.primarySoft, transform: i === current ? `scale(${1.12 + Math.sin(i) * 0})` : "scale(1)" }} />
      ))}
    </div>
  );
};

/** Chip panels behind the sentence numbers. */
export const ChipPanels: React.FC<{ spec: SceneSpec; done?: boolean; startSec?: number }> = ({ spec, done, startSec = 0.2 }) => {
  const { fps } = useVideoConfig();
  const chips = spec.ui.filter((u) => u.kind === "chip" && u.id.startsWith("chipPanel-"));
  return (
    <>
      {chips.map((c, i) => (
        <Panel key={c.id} rect={c.rect} fill={done ? "primary" : "white"} radius={30} border={!done} delay={Math.round((startSec + i * theme.motion.staggerSeconds * 0.6) * fps)} />
      ))}
    </>
  );
};

/** Deterministic coin / star / bar confetti (no Math.random) clipped to its own rectangle. */
export const Confetti: React.FC<{ rect: Rect; startFrame?: number }> = ({ rect, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = Array.from({ length: 16 }, (_, i) => i);
  return (
    <div style={{ ...box(rect), overflow: "hidden", borderRadius: 40 }}>
      {items.map((i) => {
        const x = ((i * 137) % 100) / 100;
        const t = Math.max(0, frame - startFrame - (i % 5) * 4) / fps;
        const y = interpolate(t, [0, 2.2], [-60, rect.h + 40], { extrapolateRight: "clamp" }) + Math.sin(t * 3 + i) * 10;
        const color = [theme.colors.accent, theme.colors.primary, theme.colors.primarySoft, theme.colors.accentSoft][i % 4];
        const s = 22 + (i % 3) * 10;
        return <div key={i} style={{ position: "absolute", left: x * (rect.w - s), top: y, width: s, height: i % 2 ? s : s * 0.5, borderRadius: i % 3 === 0 ? "50%" : 6, background: color, transform: `rotate(${t * 220 + i * 40}deg)`, opacity: t > 0 && y < rect.h ? 1 : 0 }} />;
      })}
    </div>
  );
};

/** Three chat bubbles popping in one after another (comment call-to-action decoration, no text). */
export const CommentBubbles: React.FC<{ rect: Rect; delay?: number }> = ({ rect, delay = 0 }) => {
  const rows = [{ y: 0, w: 380, mine: false }, { y: 140, w: 440, mine: true }, { y: 280, w: 340, mine: false }];
  return (
    <div style={box(rect)}>
      {rows.map((r, i) => <Bubble key={i} {...r} rectW={rect.w} delay={delay + i * 8} />)}
    </div>
  );
};
const Bubble: React.FC<{ y: number; w: number; mine: boolean; rectW: number; delay: number }> = ({ y, w, mine, rectW, delay }) => {
  const p = useEnter(delay, "pop");
  const bob = useBreathe(3, 2.8, y);
  return (
    <div style={{ position: "absolute", top: y + bob, left: mine ? rectW - w : 0, width: w, height: 110, borderRadius: 40, background: mine ? theme.colors.primary : theme.colors.white, boxShadow: `0 14px 34px ${theme.colors.shadow}`, opacity: fadeIn(p), transform: `scale(${0.6 + 0.4 * p})`, transformOrigin: mine ? "100% 50%" : "0% 50%" }}>
      <div style={{ position: "absolute", left: 28, top: 28, width: 54, height: 54, borderRadius: "50%", background: mine ? theme.colors.accent : theme.colors.primarySoft }} />
      <div style={{ position: "absolute", left: 104, top: 34, width: w - 150, height: 14, borderRadius: 7, background: mine ? "rgba(255,255,255,0.85)" : theme.colors.line }} />
      <div style={{ position: "absolute", left: 104, top: 62, width: (w - 150) * 0.6, height: 14, borderRadius: 7, background: mine ? "rgba(255,255,255,0.55)" : theme.colors.primarySoft }} />
    </div>
  );
};

/** Round icon button with an inline SVG glyph (Save = bookmark, Share = arrow out of tray). */
export const IconButton: React.FC<{ rect: Rect; kind: "save" | "share"; delay?: number; pulseAt?: number }> = ({ rect, kind, delay = 0, pulseAt }) => {
  const frame = useCurrentFrame();
  const p = useEnter(delay, "pop");
  const pulse = pulseAt === undefined ? 0 : interpolate(frame - pulseAt, [0, 6, 14], [0, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const size = Math.min(rect.w, rect.h);
  return (
    <div style={{ ...box({ x: rect.x + (rect.w - size) / 2, y: rect.y, w: size, h: size }), borderRadius: "50%", background: theme.colors.white, boxShadow: `0 18px 40px ${theme.colors.shadow}`, opacity: fadeIn(p), transform: `scale(${(0.5 + 0.5 * p) * (1 + pulse)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke={theme.colors.primary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {kind === "save" ? <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" fill={theme.colors.accent} stroke={theme.colors.primaryDark} /> : (<><path d="M12 16V4M7 9l5-5 5 5" /><path d="M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" /></>)}
      </svg>
    </div>
  );
};

/** Expanding ring ripples. `maxR` keeps them inside the zone reserved for them. */
export const Ripples: React.FC<{ cx: number; cy: number; minR: number; maxR: number }> = ({ cx, cy, minR, maxR }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {[0, 1, 2].map((i) => {
        const t = ((frame / fps + i * 0.8) % 2.4) / 2.4;
        const r = minR + (maxR - minR) * theme.easing.out(t);
        return <div key={i} style={{ position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: "50%", border: `5px solid ${theme.colors.primary}`, opacity: 0.35 * (1 - t) }} />;
      })}
    </>
  );
};
