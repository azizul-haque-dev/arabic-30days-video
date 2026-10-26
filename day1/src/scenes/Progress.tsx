import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, theme } from "../theme";
import { enter, spr, toBn, tween } from "../components/anim";
import { BnCounter, Words } from "../components/Text";
import { T, ev, scene } from "../timeline";

// Data dashboard: 10 / 300 progress (numbers are from the script)
export const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = theme.colors;
  const from = scene("progress").from;
  const e0 = ev(T.progress.start) - from;
  const fill = tween(frame, e0 + 14, e0 + 40, 0, 10 / 300);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center" }}>
        <Words text={`${toBn(30)} দিনে ${toBn(300)}টি বাক্য`} delay={e0} per={5} size={84} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 24, ...enter(frame, fps, e0 + 6, { y: 50, s: 0.9 }) }}>
        <BnCounter to={10} delay={e0 + 10} size={230} color={c.primary} cfg={{ damping: 24, stiffness: 90, mass: 1 }} />
        <span style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 120, color: c.textDim, opacity: 0.8 }}>/ {toBn(300)}</span>
      </div>
      <div style={{ position: "absolute", left: 110, top: 790, width: 860, ...enter(frame, fps, e0 + 12, { y: 30, s: 0.96 }) }}>
        <div style={{ position: "relative", height: 44, borderRadius: 44, background: alpha(c.surface, 0.9), border: `2px solid ${c.line}`, boxShadow: theme.shadow.soft, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, minWidth: 0, borderRadius: 44, background: c.primary }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, padding: "0 6px" }}>
          {Array.from({ length: 30 }).map((_, i) => {
            const p = spr(frame, fps, e0 + 16 + i * 1.2, theme.spring.snappy);
            return <div key={i} style={{ width: 14, height: 14, borderRadius: 14, background: i === 0 ? c.accent : c.ink12, transform: `scale(${p})` }} />;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
