import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, theme } from "../theme";
import { enter, exitAt, spr, tween } from "../components/anim";
import { Words } from "../components/Text";
import { Icon } from "../components/Icons";
import { LEAD, T, f } from "../timeline";

const LINES = ["সৌদি আরবে থাকেন,", "কিন্তু আরবি বলতে", "পারেন না?"];
const WEIGHTS = [15, 20, 12]; // share of the question's speech time per line (from the SRT cue)

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = theme.colors;
  const t0 = f(T.hook.start), tC = f(T.hook.chinta);
  const total = WEIGHTS.reduce((a, b) => a + b, 0);
  let acc = 0;
  const starts = WEIGHTS.map((w) => { const s = t0 + ((tC - t0) * acc) / total - LEAD; acc += w; return Math.max(2, s); });
  const e2 = tC - LEAD; // "চিন্তা নেই!" lands
  const out1 = exitAt(frame, e2 - 4, 10);
  const bub = spr(frame, fps, 0, theme.spring.bouncy);

  return (
    <AbsoluteFill>
      {/* phase 1 — the problem */}
      <AbsoluteFill style={{ opacity: 1 - out1, transform: `translateY(${-70 * out1}px) scale(${1 - 0.05 * out1})` }}>
        <div style={{ position: "absolute", left: 390, top: 262, width: 300, height: 190, transform: `scale(${0.4 + 0.6 * bub}) rotate(${(1 - bub) * -10}deg)`, opacity: Math.min(1, bub * 1.6) }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 66, background: c.surface, border: `2px solid ${c.line}`, boxShadow: theme.shadow.card }} />
          <div style={{ position: "absolute", left: 52, bottom: -26, width: 52, height: 52, background: c.surface, borderRadius: 10, transform: "rotate(45deg)", borderRight: `2px solid ${c.line}`, borderBottom: `2px solid ${c.line}` }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 30, height: 30, borderRadius: 30, background: c.textDim, opacity: 0.8, transform: `translateY(${Math.sin(frame / 5 - i * 0.9) * -9}px)` }} />
            ))}
          </div>
          <div style={{ position: "absolute", right: -30, top: -34, width: 84, height: 84, borderRadius: 84, background: c.accent, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: theme.shadow.soft, transform: `scale(${spr(frame, fps, 10, theme.spring.bouncy)})` }}>
            <Icon name="micOff" size={44} color={c.onPrimary} stroke={2.4} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 72, width: 936, top: 520, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {LINES.map((l, i) => (
            <div key={i} style={{ position: "relative" }}>
              {i === 2 && (
                <div style={{ position: "absolute", left: -18, right: -18, top: 22, bottom: 6, borderRadius: 30, background: alpha(c.accent, 0.55), transformOrigin: "left center",
                  transform: `scaleX(${tween(frame, starts[2] + 12, starts[2] + 30, 0, 1)})` }} />
              )}
              <Words text={l} delay={starts[i]} per={4} size={104} style={{ position: "relative" }} />
            </div>
          ))}
        </div>
      </AbsoluteFill>

      {/* phase 2 — "চিন্তা নেই!" */}
      {frame >= e2 - 2 && (
        <AbsoluteFill>
          {Array.from({ length: 12 }).map((_, i) => {
            const p = spr(frame, fps, e2 + 2 + i * 1.2, theme.spring.snappy);
            return (
              <div key={i} style={{ position: "absolute", left: 540, top: 400, width: 16, height: 110 * p, borderRadius: 16, background: c.accent, opacity: 0.9 * p,
                transformOrigin: "50% 0%", transform: `translateX(-50%) rotate(${i * 30}deg) translateY(120px)` }} />
            );
          })}
          <div style={{ position: "absolute", left: 440, top: 300, width: 200, height: 200, borderRadius: 200, background: c.primary, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `${theme.shadow.hero}, 0 0 80px ${alpha(c.primary, 0.35)}`, transform: `scale(${(0.3 + 0.7 * spr(frame, fps, e2, theme.spring.bouncy)) * (1 + Math.sin(frame / 14) * 0.015)})`,
            opacity: Math.min(1, spr(frame, fps, e2, theme.spring.bouncy) * 1.6) }}>
            <Icon name="check" size={118} color={c.onPrimary} stroke={3} progress={tween(frame, e2 + 6, e2 + 20, 0, 1)} />
          </div>
          <div style={{ position: "absolute", left: 72, width: 936, top: 660, display: "flex", justifyContent: "center", ...enter(frame, fps, e2 + 4, { y: 30, s: 0.9 }) }}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 292, right: -6, top: 150, height: 26, borderRadius: 18, background: alpha(c.accent, 0.6), transformOrigin: "left center", transform: `scaleX(${tween(frame, e2 + 16, e2 + 32, 0, 1)})` }} />
              <Words text="চিন্তা নেই!" delay={e2 + 4} per={7} size={190} bounce style={{ position: "relative" }} />
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
