import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { LogoMark } from "../components/Ui";
import { AlarmClock, House, Mosque, WashingMachine } from "../illustrations/objects";
import { Sparkle } from "../illustrations/primitives";
import { theme } from "../theme";

const c = theme.colors;
const en = theme.fonts.en;

const Bubble: React.FC<{ x: number; y: number; phase: number; vb: string; children: React.ReactNode; tint: string }> = ({ x, y, phase, vb, children, tint }) => {
  const frame = useCurrentFrame();
  const fy = Math.sin(frame / 16 + phase) * 9;
  return (
    <div style={{ position: "absolute", left: x, top: y + fy, width: 224, height: 224, borderRadius: "50%", background: tint, border: `8px solid ${c.card}`,
      boxShadow: "0 26px 44px -20px rgba(16,35,29,0.4)", overflow: "hidden" }}>
      <svg width="100%" height="100%" viewBox={vb}>{children}</svg>
    </div>
  );
};

// First frame is a fully composed thumbnail; only ambient motion (float, shine, breathing).
export const Thumbnail: React.FC = () => {
  const frame = useCurrentFrame();
  const shine = interpolate(frame % 60, [0, 40], [-300, 900], { extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(frame / 14) * 0.012;
  return (
    <>
      {[[90, 520], [980, 600], [70, 1250], [990, 1180]].map(([x, y], i) => (
        <svg key={i} style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}><Sparkle x={x} y={y} size={26} phase={i * 1.5} frame={frame} /></svg>
      ))}

      <div style={{ position: "absolute", top: 200, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
        <LogoMark size={116} />
        <div style={{ fontFamily: en, fontWeight: 800, fontSize: 56, letterSpacing: "0.04em", color: c.text }}>ARABIC MASTER</div>
      </div>

      <div style={{ position: "absolute", top: 360, left: 0, right: 0, textAlign: "center", transform: `scale(${pulse})`, fontFamily: en, fontWeight: 800, lineHeight: 1 }}>
        <div style={{ fontSize: 176, color: c.text, letterSpacing: "-0.02em" }}>30 DAYS</div>
        <div style={{ fontSize: 142, color: c.primary, letterSpacing: "-0.02em", marginTop: 6 }}>SURVIVAL</div>
        <div style={{ fontSize: 142, color: c.text, letterSpacing: "-0.02em", marginTop: 6, position: "relative", display: "inline-block" }}>
          ARABIC
          <div style={{ position: "absolute", left: 0, right: 0, bottom: -4, height: 16, borderRadius: 8, background: c.accent, opacity: 0.9, zIndex: -1 }} />
        </div>
      </div>

      <div style={{ position: "absolute", top: 930, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", overflow: "hidden", transform: "rotate(-3deg)", background: c.accent, borderRadius: 56, padding: "6px 70px",
          boxShadow: "0 30px 50px -24px rgba(180,100,0,0.6)", border: `8px solid ${c.card}` }}>
          <div style={{ fontFamily: en, fontWeight: 800, fontSize: 190, lineHeight: 1.15, color: c.text, letterSpacing: "0.01em" }}>DAY 08</div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: shine, width: 90, background: "rgba(255,255,255,0.45)", transform: "skewX(-20deg)" }} />
        </div>
      </div>

      <div style={{ position: "absolute", top: 1230, left: 60, right: 60, display: "flex", justifyContent: "center" }}>
        <div style={{ background: c.card, borderRadius: 44, padding: "18px 44px", boxShadow: "0 24px 44px -22px rgba(16,35,29,0.4)",
          fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 68, lineHeight: 1.3, color: c.text, textAlign: "center" }}>
          আজ শিখুন <span style={{ color: c.primary }}>১০টি</span><br />দরকারি আরবি বাক্য!
        </div>
      </div>

      <Bubble x={36} y={1470} phase={0} tint={c.accentSoft} vb="-210 -210 420 420"><AlarmClock x={0} y={0} r={140} frame={frame} hourDeg={180} minDeg={360} ring /></Bubble>
      <Bubble x={284} y={1500} phase={1.2} tint={c.primarySoft} vb="-200 -390 400 420"><WashingMachine x={0} y={0} frame={frame} /></Bubble>
      <Bubble x={532} y={1470} phase={2.4} tint={c.accentSoft} vb="-300 -430 600 460"><Mosque x={0} y={0} frame={frame} idp="thumb" /></Bubble>
      <Bubble x={780} y={1500} phase={3.6} tint={c.primarySoft} vb="-190 -310 380 340"><House x={0} y={0} /></Bubble>
    </>
  );
};
