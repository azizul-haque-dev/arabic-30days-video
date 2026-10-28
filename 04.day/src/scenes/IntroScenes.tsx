import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { tween, useSpring, windowOn } from "../anim";
import { Card, HighlightBar, MaskSweep, Pill, WordReveal } from "../components/Text";
import { HeadphoneGlyph, PlayGlyph, WaveBars } from "../components/Icons";
import { SceneShell } from "../components/SceneShell";
import { marks, relTo } from "../timing";

const C = theme.colors;
const M = theme.size.margin;
const FONT = { fontFamily: theme.fonts.display, fontWeight: theme.weight.display, lineHeight: 1.3 } as const;

// 30-day track; the first `lit` squares are filled
const Track: React.FC<{ lit: number; delay: number; litDelay: number; pulseNext?: number }> = ({ lit, delay, litDelay, pulseNext }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 6, width: 936 }}>
      {Array.from({ length: 30 }).map((_, i) => {
        const p = useSpring(delay + i * 1.2, "snappy");
        const on = i < lit && frame >= litDelay + i * 4;
        const next = pulseNext !== undefined && i === lit && frame >= pulseNext;
        const k = on ? Math.min(1, tween(frame, litDelay + i * 4, litDelay + i * 4 + 8, 0, 1)) : 0;
        return <div key={i} style={{ flex: 1, height: 38, borderRadius: 10, opacity: Math.min(1, p * 1.5),
          background: on ? C.primary : next ? C.accent : C.line, transform: `scaleY(${(0.3 + 0.7 * p) * (1 + 0.25 * k * (i === lit - 1 ? 1 : 0)) * (next ? 1 + 0.2 * Math.sin(frame / 5) : 1)})` }} />;
      })}
    </div>
  );
};

// ── 1. HOOK (Kinetic) ─────────────────────────────────────────────────────────
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const trish = relTo("hook", marks.trish), fourth = relTo("hook", marks.fourth);
  const slam = useSpring(fourth, "bouncy");
  const dayP = useSpring(fourth - 8, "smooth");
  return (
    <SceneShell>
      <div style={{ position: "absolute", left: M, right: M, top: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <MaskSweep text="Survival Arabic" delay={2} size={128} color={C.primary} dur={20} />
        <div style={{ position: "relative", ...FONT, fontSize: 52, color: C.text, opacity: tween(frame, trish, trish + 10, 0, 1),
          transform: `translateY(${tween(frame, trish, trish + 14, 26, 0)}px)` }}>
          <HighlightBar delay={trish + 8} />
          <span style={{ position: "relative" }}>৩০ দিনের সিরিজ</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: M, top: 440 }}><Track lit={4} delay={trish - 4} litDelay={fourth - 24} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 540, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 40 }}>
        <div style={{ ...FONT, fontSize: 250, color: C.text, opacity: Math.min(1, dayP * 1.5), transform: `translateX(${interpolate(dayP, [0, 1], [-90, 0])}px)` }}>DAY</div>
        <div style={{ ...FONT, fontSize: 330, color: C.primary, opacity: Math.min(1, slam * 1.5), textShadow: `0 20px 60px ${C.glow}`,
          transform: `scale(${interpolate(slam, [0, 1], [1.7, 1])}) rotate(${interpolate(slam, [0, 1], [-8, 0])}deg)` }}>4</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 900, display: "flex", justifyContent: "center" }}>
        <Pill size={50} delay={fourth + 6} bg={C.accent}>চতুর্থ দিন</Pill>
      </div>
    </SceneShell>
  );
};

// ── 2. TODAY'S LESSON (Hub & spoke) ───────────────────────────────────────────
export const Lesson: React.FC = () => {
  const frame = useCurrentFrame();
  const gulf = relTo("lesson", marks.gulf), ten = relTo("lesson", marks.ten);
  const hub = useSpring(ten, "bouncy");
  const count = Math.round(interpolate(tween(frame, ten, ten + 40, 0, 1), [0, 1], [0, 10]));
  const R = 168, cx = 540, cy = 770;
  return (
    <SceneShell dir={-1}>
      <div style={{ position: "absolute", left: M, top: 70, display: "flex", alignItems: "center", gap: 22 }}>
        <Pill size={44} delay={2} bg={C.primary} color={C.onPrimary}>পর্ব ৪</Pill>
      </div>
      <div style={{ position: "absolute", left: M, right: M, top: 176 }}>
        <WordReveal text="আজকে আমরা শিখব" delay={8} size={92} align="flex-start" highlight={[2]} />
      </div>
      <Card delay={gulf} from="right" style={{ position: "absolute", left: M, top: 330, width: 936, boxSizing: "border-box", padding: "30px 42px" }}>
        <WordReveal text="গালফের দেশগুলোতে দৈনন্দিন কথাবার্তায় কাজে লাগে" delay={gulf + 6} size={46} weight={theme.weight.body} align="flex-start" />
      </Card>
      {/* hub */}
      <div style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (-90 + (360 / 10) * i) * (Math.PI / 180);
          const ghost = useSpring(gulf + 14 + i * 2, "smooth");
          const act = useSpring(ten + 6 + i * theme.motion.staggerWord, "bouncy");
          const p = ghost;
          const x = cx + Math.cos(a) * R * p, y = cy + Math.sin(a) * R * p;
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: cx, top: cy, width: R * p, height: 3, background: C.line, transformOrigin: "0 50%",
                transform: `rotate(${(a * 180) / Math.PI}deg)` }} />
              <div style={{ position: "absolute", left: x - 19, top: y - 19, width: 38, height: 38, borderRadius: 38,
                background: frame >= ten + 6 + i * theme.motion.staggerWord ? (i === 9 ? C.accent : C.primary) : C.surface,
                border: `4px solid ${frame >= ten + 6 + i * theme.motion.staggerWord ? (i === 9 ? C.accent : C.primary) : C.line}`,
                transform: `scale(${Math.min(1, p) * (1 + 0.25 * Math.max(0, Math.min(1, act)) * (frame < ten + 6 + i * theme.motion.staggerWord + 10 ? 1 : 0))})`,
                boxShadow: `0 8px 20px -8px ${C.shadow}` }} />
            </React.Fragment>
          );
        })}
        <div style={{ position: "absolute", left: cx - 112, top: cy - 112, width: 224, height: 224, borderRadius: 224, background: C.primary,
          opacity: Math.min(1, hub * 2),
          display: "flex", alignItems: "center", justifyContent: "center", ...FONT, fontSize: 130, color: C.onPrimary, fontVariantNumeric: "tabular-nums",
          boxShadow: `0 30px 70px -20px ${C.glow}`, transform: `scale(${interpolate(hub, [0, 1], [0.5, 1 + Math.sin(frame / 22) * 0.015])})` }}>{count}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 968, display: "flex", justifyContent: "center" }}>
        <Pill size={40} delay={ten + 24} bg={C.surface}>টি সহজ আরবি বাক্য</Pill>
      </div>
    </SceneShell>
  );
};

// ── 3. HOW IT WORKS (twice, listening) ────────────────────────────────────────
export const How: React.FC = () => {
  const frame = useCurrentFrame();
  const twice = relTo("how", marks.twice), listen = relTo("how", marks.listen);
  const e1 = windowOn(frame, twice + 8, twice + 38), e2 = windowOn(frame, twice + 44, twice + 74);
  const hp = useSpring(listen, "bouncy");
  return (
    <SceneShell>
      <div style={{ position: "absolute", left: M, right: M, top: 110 }}>
        <WordReveal text="প্রতিটি বাক্যের উচ্চারণ" delay={4} size={74} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center", gap: 40 }}>
        {[e1, e2].map((e, i) => {
          const at = twice + i * 36;
          return (
            <Card key={i} delay={at} from={i ? "right" : "left"} style={{ width: 420, height: 330, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 34 }}>
              <div style={{ width: 92, height: 92, borderRadius: 92, background: i ? C.accent : C.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PlayGlyph size={48} color={i ? C.text : C.onPrimary} />
              </div>
              <WaveBars count={9} w={280} h={90} energy={e} color={i ? C.accent : C.primary} />
            </Card>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 650, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", ...FONT, fontSize: 120, color: C.primary, opacity: tween(frame, twice, twice + 10, 0, 1), transform: `translateY(${tween(frame, twice, twice + 16, 40, 0)}px)` }}>
          <HighlightBar delay={twice + 10} height={24} />
          <span style={{ position: "relative" }}>দুইবার করে</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 850, display: "flex", justifyContent: "center" }}>
        <Card delay={listen} float={false} style={{ display: "flex", alignItems: "center", gap: 24, padding: "24px 48px", borderRadius: 999 }}>
          <div style={{ transform: `scale(${0.6 + 0.4 * Math.min(1, hp)}) rotate(${Math.sin(frame / 6) * 4}deg)` }}><HeadphoneGlyph size={64} /></div>
          <span style={{ ...FONT, fontSize: 52, color: C.text }}>শুনে শুনে প্র্যাকটিস</span>
        </Card>
      </div>
    </SceneShell>
  );
};

// ── 4. LET'S GO (Statement card) ──────────────────────────────────────────────
export const Go: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpring(2, "bouncy");
  return (
    <SceneShell dir={-1}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 40 }}>
        <div style={{ width: 150, height: 150, borderRadius: 150, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 30px 70px -20px ${C.glow}`, transform: `scale(${interpolate(p, [0, 1], [0.3, 1 + Math.sin(frame / 8) * 0.02])}) rotate(${interpolate(p, [0, 1], [-60, 0])}deg)` }}>
          <PlayGlyph size={80} />
        </div>
        <WordReveal text="চলুন শুরু করি" delay={6} size={96} align="flex-start" highlight={[2]} highlightColor={C.primary} style={{ width: 600 }} />
      </div>
    </SceneShell>
  );
};
