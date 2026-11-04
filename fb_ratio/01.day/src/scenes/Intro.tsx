import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, theme } from "../theme";
import { enter, spr, toBn, tween } from "../components/anim";
import { BnCounter, Words } from "../components/Text";
import { Icon } from "../components/Icons";
import { T, ev, scene } from "../timeline";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = theme.colors;
  const from = scene("intro").from;
  const e = (s: number) => ev(s) - from;
  const eD = e(T.intro.d30), e3 = e(T.intro.d300), eT = e(T.intro.today), eG = e(T.intro.go);
  const hi = spr(frame, fps, eT, theme.spring.bouncy);
  const go = spr(frame, fps, eG, theme.spring.bouncy);

  return (
    <AbsoluteFill>
      {/* heading ৩০ দিন */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 96, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 26, ...enter(frame, fps, eD, { y: 40, s: 0.9 }) }}>
        <BnCounter to={30} delay={eD + 2} size={150} color={c.text} cfg={{ damping: 26, stiffness: 70, mass: 1 }} />
        <Words text="দিন" delay={eD + 6} size={150} />
      </div>

      {/* "today" callout */}
      <div style={{ position: "absolute", left: 66, top: 292, opacity: Math.min(1, hi * 1.6), transform: `translateY(${(1 - hi) * 26}px) scale(${0.7 + 0.3 * hi})`, transformOrigin: "40px 100%" }}>
        <div style={{ height: 78, padding: "0 34px", borderRadius: 999, background: c.accent, display: "flex", alignItems: "center", fontFamily: theme.fonts.display, fontSize: 44, fontWeight: 700, color: c.text, boxShadow: theme.shadow.soft }}>
          আজ প্রথম {toBn(10)}টি বাক্য
        </div>
        <div style={{ position: "absolute", left: 36, bottom: -14, width: 30, height: 30, background: c.accent, transform: "rotate(45deg)", borderRadius: 6 }} />
      </div>

      {/* 30 day tiles */}
      <div style={{ position: "absolute", left: 66, top: 392, width: 948, display: "grid", gridTemplateColumns: "repeat(10, 84px)", gap: 12 }}>
        {Array.from({ length: 30 }).map((_, i) => {
          const p = spr(frame, fps, eD + 2 + i * 2, theme.spring.snappy);
          const first = i === 0;
          const on = first ? hi : 0;
          return (
            <div key={i} style={{ width: 84, height: 84, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", opacity: Math.min(1, p * 1.8),
              transform: `scale(${(0.5 + 0.5 * p) * (first ? 1 + 0.07 * on + Math.sin(frame / 8) * 0.02 * on : 1)}) translateY(${(1 - p) * 20}px)`,
              background: first && on > 0.05 ? c.primary : alpha(c.surface, 0.85), border: `2px solid ${first && on > 0.05 ? c.primary : c.line}`,
              boxShadow: first && on > 0.05 ? theme.shadow.hero : theme.shadow.soft, fontFamily: theme.fonts.display, fontWeight: 600, fontSize: 34,
              color: first && on > 0.05 ? c.onPrimary : c.textDim }}>
              {first && go > 0.05 ? <div style={{ transform: `scale(${go})` }}><Icon name="play" size={34} color={c.onPrimary} /></div> : toBn(i + 1)}
            </div>
          );
        })}
      </div>

      {/* ৩০০ counter + label */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, ...enter(frame, fps, e3, { y: 50, s: 0.9 }) }}>
        <BnCounter to={300} delay={e3 + 2} size={210} color={c.primary} />
        <Words text="দরকারি সৌদি আরবি বাক্য" delay={e3 + 12} per={4} size={58} color={c.textDim} weight={theme.weight.strong} />
      </div>
    </AbsoluteFill>
  );
};
