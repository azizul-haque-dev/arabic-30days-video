import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, glass, theme } from "../theme";
import { enter, spr, tween } from "../components/anim";
import { Words } from "../components/Text";
import { Icon, IconName } from "../components/Icons";
import { T, ev, scene } from "../timeline";

export const Lesson: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = theme.colors;
  const from = scene("lesson").from;
  const e = (s: number) => ev(s) - from;
  const cards: { icon: IconName; label: string; at: number }[] = [
    { icon: "mic", label: "বলুন", at: e(T.lesson.speak) },
    { icon: "headphones", label: "শুনুন", at: e(T.lesson.listen) },
    { icon: "bulb", label: "মুখস্থ করুন", at: e(T.lesson.memorize) },
  ];
  const chip = spr(frame, fps, 0, theme.spring.bouncy);
  const eB = e(T.lesson.basic);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center" }}>
        <div style={{ height: 82, padding: "0 40px", borderRadius: 999, background: c.primary, color: c.onPrimary, display: "flex", alignItems: "center", gap: 14,
          fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 50, boxShadow: theme.shadow.hero, opacity: Math.min(1, chip * 1.6), transform: `scale(${0.5 + 0.5 * chip}) translateY(${(1 - chip) * 20}px)` }}>
          <Icon name="chat" size={44} color={c.onPrimary} stroke={2.4} /> Lesson 1
        </div>
      </div>
      <div style={{ position: "absolute", left: 72, width: 936, top: 270, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Words text="Basic" delay={eB} size={132} />
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: -14, right: -14, top: 78, height: 38, borderRadius: 20, background: alpha(c.accent, 0.55), transformOrigin: "left center", transform: `scaleX(${tween(frame, eB + 14, eB + 34, 0, 1)})` }} />
          <Words text="Conversation" delay={eB + 6} size={132} style={{ position: "relative" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 72, top: 640, width: 936, display: "flex", gap: 24 }}>
        {cards.map((k, i) => {
          const p = spr(frame, fps, k.at, theme.spring.bouncy);
          const br = Math.sin(frame / 22 + i) * 4;
          return (
            <div key={i} style={{ ...glass(theme.radius.panel), width: 296, height: 290, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22,
              opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * 70 + br}px) scale(${0.8 + 0.2 * p})` }}>
              <div style={{ width: 118, height: 118, borderRadius: 118, background: alpha(c.primary, 0.12), display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + Math.sin(frame / 18 + i) * 0.03})` }}>
                <Icon name={k.icon} size={66} color={c.primary} stroke={2} />
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, color: c.text, textAlign: "center", lineHeight: 1.12, padding: "0 14px" }}>{k.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
