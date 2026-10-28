import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, glass, theme } from "../theme";
import { enter, spr, toBn, tween } from "../components/anim";
import { Words } from "../components/Text";
import { Icon } from "../components/Icons";
import { SENTENCES } from "../content";
import { RECAP, T, ev, scene } from "../timeline";

// Checklist Recap Grid — 10 cells, each ticks once
export const Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = theme.colors;
  const from = scene("recap").from;
  const e0 = ev(T.recap.start) - from;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 84, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <Words text="দারুণ!" delay={e0} per={5} size={128} bounce />
        <Words text={`${toBn(10)}টি সৌদি আরবি বাক্য`} delay={e0 + 10} per={4} size={56} color={c.textDim} weight={theme.weight.strong} />
      </div>
      <div style={{ position: "absolute", left: 60, top: 330, width: 960, display: "grid", gridTemplateColumns: "repeat(2, 471px)", gap: "16px 18px" }}>
        {SENTENCES.map((s, i) => {
          const at = e0 + 6 + i * RECAP.per;
          const p = spr(frame, fps, at, theme.spring.snappy);
          const ck = spr(frame, fps, at + RECAP.checkDelay, theme.spring.bouncy);
          return (
            <div key={i} style={{ ...glass(36), height: 112, display: "flex", alignItems: "center", gap: 20, padding: "0 24px", boxSizing: "border-box",
              opacity: Math.min(1, p * 1.7), transform: `translateY(${(1 - p) * 44}px) scale(${0.88 + 0.12 * p})` }}>
              <div style={{ width: 64, height: 64, flex: "none", borderRadius: 64, background: c.primary, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${ck})` }}>
                <Icon name="check" size={38} color={c.onPrimary} stroke={3.2} progress={tween(frame, at + RECAP.checkDelay + 2, at + RECAP.checkDelay + 12, 0, 1)} />
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: s.phrase.length > 20 ? 32 : 38, lineHeight: 1.15, color: c.text, display: "flex", flexWrap: "wrap", columnGap: 10 }}>{s.phrase.split(" ").map((w, k) => <span key={k} style={{ whiteSpace: "nowrap" }}>{w}</span>)}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
