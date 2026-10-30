import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Card, Chip, Enter, Sfx, Sweep, Words, clamp, useP } from "../components/primitives";
import { T, loc } from "../timeline";
import { alpha, theme } from "../theme";
import { bn } from "../data/script";

const C = theme.colors;

/* ───────── Scene 1: Hook (Kinetic Typography) ───────── */
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const fK = loc("hook", T.hook.kintu), fA = loc("hook", T.hook.atke), fC = loc("hook", T.hook.chinta), fAp = loc("hook", T.hook.apnar);
  const outA = interpolate(frame, [fC - 4, fC + 6], [0, 1], { ...clamp, easing: theme.ease.in });
  const relief = useP(fC, theme.spring.bouncy);
  const bubbleIn = useP(2, theme.spring.bouncy);
  return (
    <AbsoluteFill>
      {/* speech bubble: stuck dots → check */}
      <div style={{ position: "absolute", left: 390, top: 110, width: 300, height: 190, transform: `scale(${bubbleIn * (1 + 0.08 * relief)})`, opacity: Math.min(1, bubbleIn * 2) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 70, background: relief > 0.05 ? C.accent : C.surface, boxShadow: theme.shadow.card, border: `1px solid ${C.line}` }} />
        <div style={{ position: "absolute", left: 60, bottom: -22, width: 50, height: 50, background: relief > 0.05 ? C.accent : C.surface, transform: "rotate(45deg)", borderRadius: 10 }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 22, opacity: 1 - Math.min(1, relief * 3) }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ width: 34, height: 34, borderRadius: 17, background: C.text, transform: `translateY(${Math.sin(frame / 5 - i * 0.9) * 14}px)` }} />)}
        </div>
        <svg viewBox="0 0 100 100" style={{ position: "absolute", left: 100, top: 45, width: 100, height: 100 }}>
          <path d="M22 52l20 20 38-42" fill="none" stroke={C.text} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={100} strokeDashoffset={100 * (1 - Math.min(1, relief))} />
        </svg>
      </div>

      {/* phase A */}
      <div style={{ position: "absolute", left: 72, right: 72, top: 380, opacity: 1 - outA, transform: `translateY(${-30 * outA}px)` }}>
        <Words text="আরব দেশে থাকেন" delay={6} size={80} />
        <div style={{ height: 8 }} />
        <Words text="কিন্তু আরবি বলতে গিয়ে" delay={fK} size={80} />
        <div style={{ height: 14 }} />
        <Words text="আটকে যান?" delay={fA} size={160} color={C.primary} per={6} />
      </div>

      {/* phase B */}
      <div style={{ position: "absolute", left: 72, right: 72, top: 400 }}>
        <Words text="চিন্তা নেই!" delay={fC} size={190} color={C.primary} per={6} />
        <Sweep delay={fC + 8} dur={14}><div style={{ margin: "0 auto", width: 640, height: 20, borderRadius: 10, background: C.accent }} /></Sweep>
        <div style={{ height: 50 }} />
        <Sweep delay={fAp} dur={20}>
          <div style={{ textAlign: "center", fontSize: 60, fontWeight: theme.font.mid, color: C.text, lineHeight: 1.4, letterSpacing: 0 }}>আপনার প্রতিদিনের আরবি শেখার সঙ্গী</div>
        </Sweep>
      </div>
      <Sfx name="whoosh" at={2} />
      <Sfx name="thud" at={fC} />
    </AbsoluteFill>
  );
};

/* ───────── Scene 2: Brand + 30-day tracker ───────── */
export const Brand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fT = loc("brand", T.brand.tirish), fS = loc("brand", T.brand.saptam);
  const q = spring({ frame: frame - fT, fps, config: theme.spring.smooth });
  const day7 = useP(fS, theme.spring.bouncy);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 410, transform: `translateY(${-300 * q}px) scale(${1 - 0.4 * q})` }}>
        <Words text="Arabic Master" delay={4} per={7} size={170} hot={(w) => (w === "Master" ? { color: C.primary } : undefined)} />
        <Sweep delay={20} dur={16}><div style={{ margin: "6px auto 0", width: 520, height: 16, borderRadius: 8, background: C.accent }} /></Sweep>
      </div>
      <Enter delay={fT + 4} y={80} style={{ position: "absolute", left: 72, top: 330, width: 936, height: 600 }}>
        <Card style={{ width: 936, height: 600 }}>
          <div style={{ padding: "40px 44px", display: "flex", flexDirection: "column", gap: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 60, fontWeight: theme.font.heavy, lineHeight: 1.35, color: C.text }}>৩০ দিনের Survival Arabic</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 14 }}>
              {Array.from({ length: 30 }).map((_, i) => {
                const lit = i < 6 ? frame > fT + 22 + i * 4 : i === 6 ? frame > fS : false;
                const isSeven = i === 6;
                const pop = isSeven ? day7 : 1;
                return (
                  <div key={i} style={{ aspectRatio: "1", borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 30, fontWeight: theme.font.heavy, lineHeight: 1, background: lit ? (isSeven ? C.accent : C.text) : C.faint, color: lit ? (isSeven ? C.text : "#FFFFFF") : C.textDim, transform: `scale(${isSeven && lit ? 0.9 + 0.35 * pop : 1})`, boxShadow: isSeven && lit ? `0 0 0 ${10 * (1 - Math.min(1, pop))}px ${alpha(C.accent, 0.4)}` : undefined }}>{bn(i + 1)}</div>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "center", opacity: Math.min(1, day7 * 2), transform: `translateY(${(1 - Math.min(1, day7)) * 20}px)` }}>
              <Chip size={52} fill={C.accent} color={C.text}>আজ সপ্তম দিন</Chip>
            </div>
          </div>
        </Card>
      </Enter>
      <Sfx name="chime" at={4} />
      <Sfx name="pop" at={fT + 4} />
      <Sfx name="click" at={fS + 2} />
    </AbsoluteFill>
  );
};

/* ───────── Scene 3: Progress 60 / 300 (Data ring) ───────── */
export const Progress60: React.FC = () => {
  const frame = useCurrentFrame();
  const fTin = loc("p60", T.p60.tinsho), fShat = loc("p60", T.p60.shat);
  const R = 215, CIR = 2 * Math.PI * R;
  const q = interpolate(frame, [fShat, fShat + 34], [0, 1], { ...clamp, easing: theme.ease.out });
  const frac = (60 / 300) * q;
  const ang = (-90 + 360 * frac) * (Math.PI / 180);
  const track = interpolate(frame, [8, 30], [0, 1], { ...clamp, easing: theme.ease.out });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 72, right: 72, top: 90 }}><Words text="আলহামদুলিল্লাহ," delay={2} size={84} /></div>
      <Enter delay={fTin} y={20} style={{ position: "absolute", left: 0, right: 0, top: 215, display: "flex", justifyContent: "center" }}>
        <Chip size={46} fill={C.text}>৩০০টি দরকারি বাক্য</Chip>
      </Enter>
      <svg width={620} height={620} viewBox="0 0 620 620" style={{ position: "absolute", left: 230, top: 330, overflow: "visible" }}>
        <circle cx={310} cy={310} r={R} fill="none" stroke={C.line} strokeWidth={46} strokeDasharray={CIR} strokeDashoffset={CIR * (1 - track)} />
        <circle cx={310} cy={310} r={R} fill="none" stroke={C.primary} strokeWidth={46} strokeLinecap="round" strokeDasharray={CIR} strokeDashoffset={CIR * (1 - frac)} transform="rotate(-90 310 310)" opacity={q > 0 ? 1 : 0} />
        <circle cx={310 + R * Math.cos(ang)} cy={310 + R * Math.sin(ang)} r={q > 0 ? 17 : 0} fill={C.accent} stroke={C.surface} strokeWidth={5} />
      </svg>
      <div style={{ position: "absolute", left: 230, top: 330, width: 620, height: 620, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 230, fontWeight: theme.font.heavy, lineHeight: 1.15, color: C.text, opacity: Math.min(1, track * 1.5) }}>{bn(Math.round(60 * q))}</div>
        <div style={{ fontSize: 48, fontWeight: theme.font.mid, color: C.textDim, lineHeight: 1.3 }}>শিখে ফেলেছি</div>
      </div>
      <Sfx name="pop" at={6} />
      <Sfx name="pop" at={fTin} rate={1.04} />
      <Sfx name="click" at={fShat + 34} />
    </AbsoluteFill>
  );
};

/* ───────── Scene 4: Today's range + staircase ───────── */
export const Steps: React.FC = () => {
  const frame = useCurrentFrame();
  const fFrom = loc("steps", T.steps.from), fTo = loc("steps", T.steps.to), fJ = loc("steps", T.steps.jatra), fD = loc("steps", T.steps.dhap);
  const p61 = useP(fFrom, theme.spring.bouncy), p70 = useP(fTo, theme.spring.bouncy);
  const arrow = interpolate(frame, [fFrom + 8, fTo], [0, 1], { ...clamp, easing: theme.ease.out });
  const hop = Math.min(8, Math.max(0, interpolate(frame, [fJ, fD - 2], [0, 8], clamp))) + interpolate(frame, [fD, fD + 10], [0, 1], { ...clamp, easing: theme.ease.out });
  const frac = hop - Math.floor(hop);
  const bw = 70, gap = 14, left = (1080 - (10 * bw + 9 * gap)) / 2, base = 990;
  const bh = (i: number) => 60 + i * 24;
  const hopY = (idx: number) => base - bh(Math.min(9, idx)) - 56;
  const cur = Math.floor(hop), nxt = Math.min(9, cur + 1);
  const hx = left + (cur + (hop - cur)) * (bw + gap) + bw / 2;
  const hy = hopY(cur) + (hopY(nxt) - hopY(cur)) * frac - Math.sin(Math.PI * frac) * 34;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 72, right: 72, top: 100 }}><Words text="আজ শিখব" delay={2} size={76} color={C.textDim} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 215, display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}>
        <div style={{ fontSize: 250, fontWeight: theme.font.heavy, lineHeight: 1.2, color: C.text, opacity: Math.min(1, p61 * 2), transform: `scale(${0.6 + 0.4 * p61})` }}>৬১</div>
        <svg width={170} height={60} viewBox="0 0 170 60"><path d="M6 30h150m-26-22l26 22-26 22" fill="none" stroke={C.accent} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={260} strokeDashoffset={260 * (1 - arrow)} /></svg>
        <div style={{ fontSize: 250, fontWeight: theme.font.heavy, lineHeight: 1.2, color: C.primary, opacity: Math.min(1, p70 * 2), transform: `scale(${0.6 + 0.4 * p70})` }}>৭০</div>
      </div>
      <div style={{ position: "absolute", left: 72, right: 72, top: 520 }}><Words text="নম্বর বাক্য" delay={fTo + 6} size={72} /></div>
      {Array.from({ length: 10 }).map((_, i) => {
        const s = spring({ frame: frame - (fFrom + i * 3), fps: 30, config: theme.spring.snappy });
        const passed = hop >= i + 0.5;
        return <div key={i} style={{ position: "absolute", left: left + i * (bw + gap), top: base - bh(i), width: bw, height: bh(i), borderRadius: 16, background: passed ? C.text : C.faint, border: `2px solid ${C.line}`, transformOrigin: "bottom", transform: `scaleY(${s})` }} />;
      })}
      <div style={{ position: "absolute", left: hx - 24, top: hy - 24, width: 48, height: 48, borderRadius: 24, background: C.accent, border: `5px solid ${C.surface}`, boxShadow: theme.shadow.soft, opacity: Math.min(1, p61 * 2) }} />
      <Sfx name="pop" at={fFrom} />
      <Sfx name="pop" at={fTo} rate={1.05} />
      <Sfx name="click" at={fD + 8} />
    </AbsoluteFill>
  );
};
