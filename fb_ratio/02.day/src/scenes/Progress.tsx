import React from "react";
import { useCurrentFrame } from "remotion";
import { C, EASE, FONT, MOTION, R, SHADOW, SPRING } from "../theme";
import { BEATS } from "../lib/timeline";
import { Enter, tween, useBreath, useSp } from "../lib/motion";
import { Counter, Words } from "../components/Text";
import { Pill, glossy } from "../components/Ui";
import { Icon } from "../components/Icons";
import { Sfx, SceneShell } from "../components/Scene";

// ── সিন ৩: ১০/৩০০ — Data Dashboard (বার) ──
export const Progress10: React.FC<{ dur: number }> = ({ dur }) => {
  const b = BEATS.progress10;
  const f = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(f / 5);
  const fill1 = tween(f, b.learned, b.learned + 12, 0, 1, EASE.out);
  const todayS = useSp(b.today, SPRING.pop);
  return (
    <SceneShell dur={dur}>
      <div style={{ position: "absolute", left: 90, width: 900, top: 110, display: "flex", justifyContent: "center" }}>
        <Enter delay={0}><Pill bg={C.heroTint} color={C.heroDeep} size={54}><Icon name="sparkle" size={54} color={C.hero} />আলহামদুলিল্লাহ</Pill></Enter>
      </div>
      <div style={{ position: "absolute", left: 90, top: 300, width: 900 }}>
        <Enter delay={4} from="up" sp="soft">
          <div style={{ ...glossy(), display: "flex", padding: "50px 0" }}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 44, fontWeight: FONT.w.semi, color: C.muted }}>দরকারি বাক্য</div>
              <div style={{ fontSize: 176, fontWeight: 700, lineHeight: 1.25, color: C.text }}><Counter from={0} to={300} start={b.total} end={b.total + 26} /></div>
            </div>
            <div style={{ width: 3, background: C.faint, margin: "10px 0" }} />
            <div style={{ flex: 1, textAlign: "center", opacity: tween(f, b.learned, b.learned + 8, 0.25, 1) }}>
              <div style={{ fontSize: 44, fontWeight: FONT.w.semi, color: C.muted }}>শেখা হয়েছে</div>
              <div style={{ fontSize: 176, fontWeight: 700, lineHeight: 1.25, color: C.hero }}><Counter from={0} to={10} start={b.learned} end={b.learned + 14} /></div>
            </div>
          </div>
        </Enter>
      </div>
      {/* ৩০ সেগমেন্ট = ৩০ দিন × ১০ বাক্য */}
      <div style={{ position: "absolute", left: 90, top: 790, width: 900, display: "flex", gap: 6 }}>
        {Array.from({ length: 30 }).map((_, i) => {
          const s = useSp(b.total + i * 1, SPRING.snap);
          const bg = i === 0 ? `rgba(14,159,110,${fill1})` : i === 1 && f >= b.today ? C.accent : C.heroSoft;
          return <div key={i} style={{ flex: 1, height: 52, borderRadius: 12, background: i === 0 ? `linear-gradient(${C.heroSoft},${C.heroSoft})` : bg, transform: `scaleY(${s})`, boxShadow: i === 1 && f >= b.today ? `0 0 0 ${pulse * 8}px rgba(245,158,11,0.25)` : undefined, position: "relative", overflow: "hidden" }}>
            {i === 0 && <div style={{ position: "absolute", inset: 0, background: C.hero, transform: `scaleX(${fill1})`, transformOrigin: "0 50%" }} />}
          </div>;
        })}
      </div>
      <div style={{ position: "absolute", left: 90 + 30 + 6, top: 860, transform: `translateX(-50%) scale(${todayS})`, opacity: Math.min(1, todayS * 2) }}>
        <Pill bg={C.accent} color={C.text} size={40} shadow={SHADOW.accent}>আজ</Pill>
      </div>
      <Sfx name="pop" at={b.total + 2} />
      <Sfx name="pop" at={b.learned + 2} rate={1.12} />
      <Sfx name="pop" at={b.today + 2} rate={0.95} vol={0.8} />
    </SceneShell>
  );
};

// ── সিন ১৫: ২০/৩০০ — Data Dashboard (ডায়াল) ──
export const Progress20: React.FC<{ dur: number }> = ({ dur }) => {
  const b = BEATS.progress20;
  const f = useCurrentFrame();
  const cx = 540, cy = 540, rad = 270;
  const noteS = useSp(b.remember, SPRING.pop);
  const breath = useBreath(4, 2.4);
  return (
    <SceneShell dur={dur} from="scale">
      <div style={{ position: "absolute", left: 90, width: 900, top: 92, display: "flex", justifyContent: "center" }}>
        <Enter delay={0}><Pill bg={C.heroTint} color={C.heroDeep} size={50}><Icon name="sparkle" size={50} color={C.hero} />আলহামদুলিল্লাহ</Pill></Enter>
      </div>
      {Array.from({ length: 30 }).map((_, i) => {
        const ang = (i / 30) * 360 - 90 + 6;
        const inS = useSp(i * 1, SPRING.snap);
        const isNew = i === 1;
        const on = i === 0 || (isNew && f >= b.twenty);
        const grow = isNew ? tween(f, b.twenty, b.twenty + 12, 0, 1) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: cx, top: cy + breath, width: 0, height: 0, transform: `rotate(${ang}deg) translateX(${rad}px)` }}>
            <div style={{ position: "absolute", left: -34, top: -9, width: 68, height: 18, borderRadius: 9, background: on ? (isNew ? C.accent : C.hero) : C.heroSoft, transform: `scaleX(${inS * (isNew && !on ? 1 : 1)}) ${isNew ? `scaleY(${1 + 0.5 * (1 - grow)})` : ""}` }} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: cx - 220, top: cy - 170 + breath, width: 440, textAlign: "center" }}>
        <div style={{ fontSize: 210, fontWeight: 700, lineHeight: 1.2, color: C.text }}><Counter from={10} to={20} start={b.twenty} end={b.twenty + 18} /></div>
        <div style={{ fontSize: 56, fontWeight: FONT.w.semi, color: C.muted, marginTop: -4 }}>/ ৩০০ বাক্য</div>
      </div>
      <div style={{ position: "absolute", left: 90, width: 900, top: 900, display: "flex", justifyContent: "center", transform: `translateY(${(1 - noteS) * 50}px)`, opacity: Math.min(1, noteS * 2) }}>
        <Pill bg={C.accent} color={C.text} size={50} shadow={SHADOW.accent}>মনে রাখবেন</Pill>
      </div>
      <Sfx name="pop" at={4} />
      <Sfx name="pop" at={b.twenty + 2} rate={1.15} />
      <Sfx name="pop" at={b.remember + 2} rate={0.95} vol={0.8} />
    </SceneShell>
  );
};
