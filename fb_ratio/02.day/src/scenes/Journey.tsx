import React from "react";
import { useCurrentFrame } from "remotion";
import { C, EASE, FONT, SHADOW, SPRING } from "../theme";
import { BEATS } from "../lib/timeline";
import { Enter, bn, tween, useSp } from "../lib/motion";
import { Icon } from "../components/Icons";
import { Sfx, SceneShell } from "../components/Scene";

// ── সিন ৪: ১১ → ২০ — Timeline / Process Flow (সাপের মতো দুই সারি) ──
const X0 = 140, DX = 190, Y1 = 650, Y2 = 810, RAD = (Y2 - Y1) / 2;
const ROW = DX * 4, ARC = Math.PI * RAD;
const LEN = ROW * 2 + ARC;
const nodeAt = (i: number) => (i < 5 ? { x: X0 + i * DX, y: Y1, L: i * DX } : { x: X0 + ROW - (i - 5) * DX, y: Y2, L: ROW + ARC + (i - 5) * DX });
const headAt = (L: number) => {
  if (L <= ROW) return { x: X0 + L, y: Y1 };
  if (L <= ROW + ARC) { const a = ((L - ROW) / ARC) * Math.PI; return { x: X0 + ROW + Math.sin(a) * RAD, y: Y1 + RAD - Math.cos(a) * RAD }; }
  return { x: X0 + ROW - (L - ROW - ARC), y: Y2 };
};

export const Journey: React.FC<{ dur: number }> = ({ dur }) => {
  const b = BEATS.journey;
  const f = useCurrentFrame();
  const start = 10, end = Math.max(start + 40, b.trip + 14);
  const L = tween(f, start, end, 0, LEN, EASE.inOut);
  const head = headAt(L);
  const arrow = tween(f, b.to - 6, b.to + 10, 0, 1);
  return (
    <SceneShell dur={dur} from="up">
      <div style={{ position: "absolute", left: 90, width: 900, top: 110, display: "flex", justifyContent: "center", alignItems: "center", gap: 36, fontSize: 200, fontWeight: 700, lineHeight: 1.25 }}>
        <Enter delay={b.from} sp="pop"><span style={{ color: C.text }}>১১</span></Enter>
        <div style={{ opacity: arrow, transform: `translateX(${(1 - arrow) * -30}px)` }}><Icon name="arrow" size={120} color={C.accent} stroke={5} /></div>
        <Enter delay={b.to} sp="pop"><span style={{ color: C.hero }}>২০</span></Enter>
      </div>
      <div style={{ position: "absolute", left: 90, width: 900, top: 380, display: "flex", justifyContent: "center" }}>
        <Enter delay={b.from + 6} from="down" dist={20}><span style={{ fontSize: 60, fontWeight: FONT.w.semi, color: C.muted }}>নম্বর বাক্য</span></Enter>
      </div>
      <svg width={1080} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d={`M${X0} ${Y1}H${X0 + ROW}A${RAD} ${RAD} 0 0 1 ${X0 + ROW} ${Y2}H${X0}`} stroke={C.heroSoft} strokeWidth={14} strokeLinecap="round" fill="none" />
        <path d={`M${X0} ${Y1}H${X0 + ROW}A${RAD} ${RAD} 0 0 1 ${X0 + ROW} ${Y2}H${X0}`} stroke={C.hero} strokeWidth={14} strokeLinecap="round" fill="none" strokeDasharray={LEN} strokeDashoffset={LEN - L} />
      </svg>
      {Array.from({ length: 10 }).map((_, i) => {
        const n = nodeAt(i);
        const reach = Math.max(0, f - (start + (n.L / LEN) * (end - start)));
        const reached = L >= n.L - 1;
        const s = useSp(Math.round(start + (n.L / LEN) * (end - start)) - 6, SPRING.pop);
        const last = i === 9;
        return (
          <div key={i} style={{ position: "absolute", left: n.x - 52, top: n.y - 52, width: 104, height: 104, borderRadius: "50%", transform: `scale(${s})`, opacity: Math.min(1, s * 2), background: reached ? `linear-gradient(150deg, ${C.hero}, ${C.heroDeep})` : C.white, color: reached ? C.onHero : C.text, boxShadow: reached ? SHADOW.hero : SHADOW.soft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46, fontWeight: 700 }}>
            {bn(11 + i)}
            {last && reached && <div style={{ position: "absolute", inset: -10, borderRadius: "50%", border: `5px solid ${C.accent}`, opacity: Math.max(0, 1 - reach / 20), transform: `scale(${1 + reach / 25})` }} />}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: head.x - 18, top: head.y - 18, width: 36, height: 36, borderRadius: "50%", background: C.accent, boxShadow: SHADOW.accent, opacity: L < LEN - 1 ? 1 : 0 }} />
      <Sfx name="pop" at={b.from + 2} />
      <Sfx name="pop" at={end - 4} rate={1.2} vol={0.8} />
    </SceneShell>
  );
};
