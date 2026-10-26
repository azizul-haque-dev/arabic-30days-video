import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, glass, theme } from "../theme";
import { enter, spr, tween } from "../components/anim";
import { Words } from "../components/Text";
import { Icon } from "../components/Icons";
import { CTA, T, ev, scene } from "../timeline";

// Glossy UI: follow button press, then the comment box types "DAY 1 DONE!"
export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = theme.colors;
  const from = scene("cta").from;
  const e0 = ev(T.cta.start) - from, eC = ev(T.cta.comment) - from;
  const press = CTA.followPress - from, ts = CTA.typeStart - from, send = CTA.sendPress - from;
  const btnIn = spr(frame, fps, e0, theme.spring.bouncy);
  const dip = tween(frame, press, press + 4, 0, 1) * tween(frame, press + 4, press + 14, 1, 0);
  const ripple = tween(frame, press, press + 22, 0, 1);
  const chars = Math.max(0, Math.min(CTA.text.length, Math.floor((frame - ts) / CTA.perChar) + 1));
  const typed = frame >= ts ? CTA.text.slice(0, chars) : "";
  const box = spr(frame, fps, eC, theme.spring.smooth);
  const sendDip = tween(frame, send, send + 4, 0, 1) * tween(frame, send + 4, send + 14, 1, 0);
  const sent = tween(frame, send, send + 18, 0, 1);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", opacity: Math.min(1, btnIn * 1.6), transform: `translateY(${(1 - btnIn) * 60}px) scale(${(0.6 + 0.4 * btnIn) * (1 - 0.06 * dip)})` }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 120, border: `5px solid ${alpha(c.primary, 0.5 * (1 - ripple))}`, transform: `scale(${1 + ripple * 0.35})`, opacity: ripple > 0 && ripple < 1 ? 1 : 0 }} />
          <div style={{ height: 150, padding: "0 70px", borderRadius: 120, background: c.primary, boxShadow: theme.shadow.hero, display: "flex", alignItems: "center", gap: 26,
            fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 78, color: c.onPrimary }}>
            <Icon name="plus" size={64} color={c.onPrimary} stroke={3} /> ফলো করুন
          </div>
          <div style={{ position: "absolute", inset: 0, borderRadius: 120, background: "linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0) 50%)", pointerEvents: "none" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, display: "flex", justifyContent: "center" }}>
        <Words text="কমেন্টে লিখুন" delay={eC} per={5} size={74} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 600, width: 900, height: 190, ...glass(60), display: "flex", alignItems: "center", padding: "0 34px 0 52px", boxSizing: "border-box",
        opacity: Math.min(1, box * 1.6), transform: `translateY(${(1 - box) * 70}px) scale(${0.9 + 0.1 * box})` }}>
        <div style={{ flex: 1, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 88, color: c.text, display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
          {typed}
          <span style={{ display: "inline-block", width: 7, height: 88, marginLeft: 8, borderRadius: 4, background: c.primary, opacity: frame < send + 6 ? (Math.floor(frame / 8) % 2 === 0 ? 1 : 0.15) : 0 }} />
        </div>
        <div style={{ width: 112, height: 112, flex: "none", borderRadius: 112, background: c.accent, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: theme.shadow.soft,
          transform: `scale(${1 - 0.1 * sendDip + (frame >= ts ? Math.sin(frame / 6) * 0.015 : 0)}) translateX(${sent * 8}px)` }}>
          <Icon name="send" size={52} color={c.text} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
