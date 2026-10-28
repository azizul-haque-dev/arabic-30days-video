import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, theme } from "../theme";
import { CL, tween } from "./anim";
import { SCENES, SENT } from "../timeline";

// Scene wrapper: every scene exits (10 frames, faster than its entrance) unless a colour wipe hides the cut.
export const SceneShell: React.FC<{ exit: boolean; children: React.ReactNode }> = ({ exit, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = exit ? tween(frame, durationInFrames - 11, durationInFrames - 1, 0, 1, theme.ease.in) : 0;
  return <AbsoluteFill style={{ opacity: 1 - p, transform: `translateY(${-46 * p}px) scale(${1 - 0.04 * p})` }}>{children}</AbsoluteFill>;
};

// Mask wipe: hero panel sweeps across; the scene cut happens exactly at its centre frame.
export const Wipe: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const p = tween(frame, at - 10, at + 10, 0, 1, Easing.bezier(0.7, 0, 0.3, 1));
  if (p <= 0 || p >= 1) return null;
  const x = (p - 0.5) * 2 * 125; // -125% .. 125%
  const x2 = ((p - 0.5) * 2 - 0.12) * 125;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "-10%", width: "120%", top: 0, bottom: 0, background: theme.colors.accent, transform: `translateX(${x2}%) skewX(-8deg)` }} />
      <div style={{ position: "absolute", left: "-10%", width: "120%", top: 0, bottom: 0, background: theme.colors.primary, transform: `translateX(${x}%) skewX(-8deg)` }} />
    </AbsoluteFill>
  );
};

// Persistent HUD: "Day 1" tag + 10-segment sentence progress (lesson → last sentence)
export const Hud: React.FC = () => {
  const frame = useCurrentFrame();
  const c = theme.colors;
  const lesson = SCENES.find((s) => s.id === "lesson")!;
  const recap = SCENES.find((s) => s.id === "recap")!;
  const vis = tween(frame, lesson.from + 4, lesson.from + 18, 0, 1) * tween(frame, recap.from - 12, recap.from - 2, 1, 0, theme.ease.in);
  if (vis <= 0.001) return null;
  const idx = SENT.filter((s) => frame >= SCENES.find((x) => x.id === `s${s.n}`)!.from).length;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: vis, transform: `translateY(${(1 - vis) * -16}px)` }}>
      <div style={{ position: "absolute", left: 64, top: 48, display: "flex", alignItems: "center", gap: 14, height: 62, padding: "0 26px", borderRadius: 999,
        background: alpha(c.surface, 0.85), border: `2px solid ${c.line}`, boxShadow: theme.shadow.soft, fontFamily: theme.fonts.display }}>
        <span style={{ fontSize: 34, fontWeight: 700, color: c.primary }}>Day 1</span>
        <span style={{ width: 2, height: 26, background: c.ink12 }} />
        <span style={{ fontSize: 30, fontWeight: 600, color: c.textDim }}>সৌদি আরবি</span>
      </div>
      <div style={{ position: "absolute", right: 64, top: 48, height: 62, display: "flex", alignItems: "center", gap: 18, opacity: idx >= 1 ? 1 : 0 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{ width: 16, height: 10, borderRadius: 6, background: i < idx - 1 ? c.primary : i === idx - 1 ? c.accent : c.ink12 }} />
          ))}
        </div>
        <span style={{ fontFamily: theme.fonts.display, fontSize: 32, fontWeight: 700, color: c.text, fontVariantNumeric: "tabular-nums", minWidth: 96 }}>
          {String(Math.max(idx, 0)).padStart(2, "0")} / 10
        </span>
      </div>
    </AbsoluteFill>
  );
};
