import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, theme } from "../theme";
import { spr, tween } from "../components/anim";
import { Words } from "../components/Text";
import { Icon } from "../components/Icons";
import { T, ev, scene } from "../timeline";

// Statement card: Day 1 done -> Day 2
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = theme.colors;
  const from = scene("outro").from;
  const e0 = ev(T.outro.start) - from, eM = ev(T.outro.meet) - from;
  const d1 = spr(frame, fps, e0, theme.spring.bouncy), d2 = spr(frame, fps, e0 + 8, theme.spring.bouncy);
  const line = tween(frame, e0 + 12, e0 + 30, 0, 1);
  const br = Math.sin(frame / 16) * 0.02;
  const tile = (extra: React.CSSProperties): React.CSSProperties => ({ width: 280, height: 280, borderRadius: 70, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: theme.fonts.display, ...extra });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center" }}>
        <Words text="DAY 1 DONE!" delay={e0} per={6} size={128} bounce />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", alignItems: "center", gap: 0 }}>
        <div style={{ ...tile({ background: c.primary, boxShadow: theme.shadow.hero }), opacity: Math.min(1, d1 * 1.6), transform: `scale(${(0.4 + 0.6 * d1) * (1 + br)})` }}>
          <Icon name="check" size={96} color={c.onPrimary} stroke={3} progress={tween(frame, e0 + 8, e0 + 22, 0, 1)} />
          <div style={{ fontWeight: 700, fontSize: 56, color: c.onPrimary }}>Day 1</div>
        </div>
        <div style={{ width: 170, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", height: 20 }}>
          <div style={{ position: "absolute", left: 22, width: 126 * line, top: 8, borderTop: `6px dotted ${c.accent}` }} />
          <div style={{ position: "absolute", right: 14, opacity: line > 0.9 ? 1 : 0 }}><Icon name="arrow" size={34} color={c.accent} stroke={3.2} /></div>
        </div>
        <div style={{ ...tile({ background: alpha(c.surface, 0.9), border: `4px dashed ${alpha(c.primary, 0.55)}`, boxShadow: theme.shadow.soft, boxSizing: "border-box" }), opacity: Math.min(1, d2 * 1.6), transform: `scale(${(0.4 + 0.6 * d2) * (1 - br)})` }}>
          <div style={{ fontWeight: 700, fontSize: 56, color: c.primary }}>Day 2</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 60, width: 960, top: 740, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <Words text="দেখা হবে Day 2-তে," delay={eM} per={5} size={78} color={c.textDim} weight={theme.weight.strong} />
        <Words text="ইনশাআল্লাহ" delay={eM + 14} per={5} size={118} color={c.primary} bounce />
      </div>
    </AbsoluteFill>
  );
};
