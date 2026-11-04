import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { C, EASE, FONT, MOTION, R, SHADOW, SPRING } from "../theme";
import { BEATS } from "../lib/timeline";
import { Enter, tween, useBreath, useSp } from "../lib/motion";
import { Words } from "../components/Text";
import { Burst, DrawCheck, Pill, glossy } from "../components/Ui";
import { Icon } from "../components/Icons";
import { Sfx, SceneShell } from "../components/Scene";

const Fill: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", inset: 0, ...style }}>{children}</div>
);

// ── সিন ১: হুক — Kinetic Typography ──
export const Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const relief = BEATS.hook.relief;
  const p2 = Math.max(MOTION.exit + 4, relief - MOTION.lead);
  const out = tween(f, p2 - MOTION.exit, p2, 0, 1, EASE.in);
  const bubbleIn = useSp(0, SPRING.heavy);
  const shake = Math.sin(f * 1.6) * 9 * Math.max(0, 1 - (f % 45) / 12);
  const badge = useSp(16, SPRING.pop);
  return (
    <SceneShell dur={dur} from="scale">
      <Sequence from={0} durationInFrames={p2 + MOTION.exit} layout="none">
        <Fill style={{ opacity: 1 - out, transform: `translateY(${-out * 50}px) scale(${1 - out * 0.05})` }}>
          <div style={{ position: "absolute", left: 270, top: 130, width: 540, height: 340, transform: `scale(${0.6 + 0.4 * bubbleIn}) translateX(${shake}px)`, opacity: Math.min(1, bubbleIn * 2) }}>
            <div style={{ ...glossy({ position: "absolute", inset: 0, borderRadius: 120 }) }} />
            <div style={{ position: "absolute", left: 80, bottom: -22, width: 70, height: 70, background: "#F5FBF8", transform: "rotate(45deg)", borderRadius: 14, boxShadow: "8px 8px 18px -10px rgba(10,122,85,0.3)" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 34 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 52, height: 52, borderRadius: "50%", background: C.muted, transform: `translateY(${Math.sin(f / 5 - i * 0.9) * 14}px)` }} />
              ))}
            </div>
            <div style={{ position: "absolute", right: -34, top: -40, width: 104, height: 104, borderRadius: "50%", background: C.accent, boxShadow: SHADOW.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72, fontWeight: 700, color: C.text, transform: `scale(${badge}) rotate(${Math.sin(f / 7) * 8}deg)` }}>?</div>
          </div>
          <div style={{ position: "absolute", left: 70, top: 590 }}>
            <Words text="আরব দেশে থাকেন কিন্তু আরবি বলতে গিয়ে আটকে যান?" delay={8} size={74} width={940} hi={[7, 8]} hiColor={C.accentDeep} />
          </div>
        </Fill>
      </Sequence>
      <Sequence from={p2} layout="none">
        <ReliefPhase brandLine={Math.max(14, BEATS.hook.brandLine - p2)} />
      </Sequence>
      <Sfx name="thud" at={6} vol={0.8} />
      <Sfx name="whoosh" at={p2 - 6} vol={0.75} />
      <Sfx name="pop" at={p2 + 6} rate={1.12} />
    </SceneShell>
  );
};

const ReliefPhase: React.FC<{ brandLine: number }> = ({ brandLine }) => {
  const s = useSp(0, SPRING.pop);
  const breath = useBreath(6, 2.2);
  return (
    <Fill>
      <Burst cx={540} cy={290} delay={4} n={12} r0={170} r1={260} color={C.accent} w={12} />
      <div style={{ position: "absolute", left: 400, top: 150, width: 280, height: 280, borderRadius: "50%", background: `linear-gradient(150deg, ${C.hero}, ${C.heroDeep})`, boxShadow: SHADOW.hero, transform: `scale(${s}) translateY(${breath}px)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 30% 22%, rgba(255,255,255,0.4), rgba(255,255,255,0) 55%)" }} />
        <DrawCheck size={170} color={C.white} delay={8} stroke={5} />
      </div>
      <div style={{ position: "absolute", left: 90, width: 900, top: 500, display: "flex", justifyContent: "center" }}>
        <Words text="চিন্তা নেই!" delay={6} gap={7} size={176} color={C.hero} />
      </div>
      <div style={{ position: "absolute", left: 90, width: 900, top: 800, display: "flex", justifyContent: "center" }}>
        <Words text="আপনার প্রতিদিনের আরবি" delay={brandLine} gap={4} size={58} weight={FONT.w.semi} color={C.muted} />
      </div>
    </Fill>
  );
};

// ── সিন ২: ব্র্যান্ড — Minimal Clean (লোগো অ্যাসেট নেই → শুধু টেক্সট) ──
export const Brand: React.FC<{ dur: number }> = ({ dur }) => {
  const b = BEATS.brand;
  const f = useCurrentFrame();
  const line = tween(f, b.master + 12, b.master + 30, 0, 1, EASE.inOut);
  const dayS = useSp(b.day, SPRING.pop);
  return (
    <SceneShell dur={dur}>
      <div style={{ position: "absolute", left: 90, width: 900, top: 140, display: "flex", justifyContent: "center" }}>
        <Enter delay={2} from="down" dist={24}>
          <div style={{ fontSize: 46, fontWeight: FONT.w.semi, color: C.muted, letterSpacing: 0 }}>আপনার প্রতিদিনের আরবি শেখার সঙ্গী</div>
        </Enter>
      </div>
      <div style={{ position: "absolute", left: 60, width: 960, top: 250, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 36 }}>
          <Words text="Arabic" delay={b.master} size={128} />
          <Words text="Master" delay={b.master + 5} size={128} color={C.hero} />
        </div>
        <div style={{ marginTop: 6, height: 18, width: 560 * line, borderRadius: 9, background: C.accent, opacity: 0.9 }} />
      </div>
      <div style={{ position: "absolute", left: 90, width: 900, top: 620, display: "flex", justifyContent: "center" }}>
        <Enter delay={b.series} from="up">
          <div style={{ ...glossy({ borderRadius: R.pill }), display: "flex", alignItems: "center", gap: 22, padding: "16px 36px 16px 16px" }}>
            <Pill bg={C.hero} color={C.onHero} size={44} shadow={SHADOW.hero}>৩০ দিন</Pill>
            <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: 0 }}>Survival Arabic Series</span>
          </div>
        </Enter>
      </div>
      <div style={{ position: "absolute", left: 90, width: 900, top: 790, display: "flex", justifyContent: "center" }}>
        <div style={{ transform: `scale(${0.5 + 0.5 * dayS}) rotate(${-4 * dayS}deg)`, opacity: Math.min(1, dayS * 2) }}>
          <div style={{ background: C.accent, borderRadius: 44, padding: "6px 70px", fontSize: 112, fontWeight: 700, color: C.text, boxShadow: SHADOW.accent, letterSpacing: 0 }}>DAY 2</div>
        </div>
      </div>
      <Sfx name="chime" at={b.master + 4} />
      <Sfx name="pop" at={b.series + 2} />
      <Sfx name="pop" at={b.day + 2} rate={1.15} />
    </SceneShell>
  );
};
