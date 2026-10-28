import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { tween, useSpring } from "../anim";
import { Card, HighlightBar, MaskSweep, Pill, WordReveal } from "../components/Text";
import { CheckGlyph, CommentGlyph, PlusGlyph } from "../components/Icons";
import { SceneShell } from "../components/SceneShell";
import { sentences } from "../data/script";
import { marks, relTo, sceneOf } from "../timing";

const C = theme.colors;
const M = theme.size.margin;
const FONT = { fontFamily: theme.fonts.display, fontWeight: theme.weight.display, lineHeight: 1.3 } as const;

// ── RECAP GRID (checklist) ────────────────────────────────────────────────────
export const Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = sceneOf("recap").end - sceneOf("recap").start;
  const per = Math.max(theme.motion.staggerCard - 1, Math.floor((dur * 0.6) / 10)); // equal spacing across the narration
  return (
    <SceneShell dir={-1}>
      <div style={{ position: "absolute", left: M, right: M, top: 64, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <WordReveal text="আজকের ১০টি বাক্য" delay={2} size={64} align="flex-start" highlight={[1]} />
      </div>
      <div style={{ position: "absolute", left: M, top: 176, width: 936, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {sentences.map((s, i) => {
          const at = 8 + i * per;
          const p = useSpring(at, "snappy");
          const chk = tween(frame, at + 6, at + 16, 0, 1);
          return (
            <div key={s.n} style={{ height: 150, borderRadius: 30, background: C.surface, display: "flex", alignItems: "center", gap: 18, padding: "0 26px",
              boxShadow: `0 20px 40px -24px ${C.shadow}`, opacity: Math.min(1, p * 1.5), transform: `translateY(${interpolate(p, [0, 1], [34, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})` }}>
              <div style={{ ...FONT, fontSize: 30, color: C.accent, width: 44 }}>{String(s.n).padStart(2, "0")}</div>
              <div style={{ ...FONT, fontSize: 36, color: C.text, flex: 1 }}>{s.short}</div>
              <div style={{ width: 46, height: 46, borderRadius: 46, background: C.primary, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.6 + 0.4 * chk})` }}>
                <CheckGlyph size={28} p={chk} />
              </div>
            </div>
          );
        })}
      </div>
    </SceneShell>
  );
};

// ── QUESTION (statement card) ─────────────────────────────────────────────────
export const Question: React.FC = () => {
  const frame = useCurrentFrame();
  const comment = relTo("question", marks.q) + 60;
  const bob = (o: number) => Math.sin((frame + o) / 24) * 6;
  return (
    <SceneShell>
      {[[110, 130, -14, 0], [830, 190, 12, 30], [130, 630, 10, 60], [820, 610, -10, 90]].map(([x, y, rot, o], i) => {
        const p = useSpring(6 + i * 4, "bouncy");
        return <div key={i} style={{ position: "absolute", left: x, top: y + bob(o), width: 130, height: 110, borderRadius: 34, background: i % 2 ? C.accentSoft : C.primarySoft,
          transform: `rotate(${rot}deg) scale(${p})`, display: "flex", alignItems: "center", justifyContent: "center", ...FONT, fontSize: 64, color: i % 2 ? C.accent : C.primary }}>?</div>;
      })}
      <Card delay={2} style={{ position: "absolute", left: M + 30, top: 270, width: 876, boxSizing: "border-box", padding: "60px 50px", display: "flex", justifyContent: "center" }}>
        <WordReveal text="আপনার সবচেয়ে কাজে লাগবে কোন বাক্যটি?" delay={10} size={72} highlight={[3, 4]} />
      </Card>
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, display: "flex", justifyContent: "center" }}>
        <Pill size={54} delay={comment} bg={C.primary} color={C.onPrimary}><CommentGlyph size={56} color={C.onPrimary} />কমেন্টে জানাতে পারেন</Pill>
      </div>
    </SceneShell>
  );
};

// ── TAGLINE (minimal kinetic + growing bars) ─────────────────────────────────
export const Tagline: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneShell dir={-1}>
      <div style={{ position: "absolute", left: M, right: M, top: 150, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ position: "relative" }}>
          <HighlightBar delay={24} color={C.primarySoft} height={30} />
          <WordReveal text="আরবি শিখুন সহজভাবে" delay={2} size={88} highlight={[2]} />
        </div>
        <WordReveal text="প্রতিদিন অল্প অল্প করে" delay={22} size={64} weight={theme.weight.body} color={C.textDim} />
      </div>
      <div style={{ position: "absolute", left: M, top: 560, width: 936, height: 330, display: "flex", alignItems: "flex-end", gap: 8 }}>
        {Array.from({ length: 30 }).map((_, i) => {
          const p = useSpring(26 + i * 1.6, "smooth");
          const h = 60 + (i / 29) * 250;
          return <div key={i} style={{ flex: 1, height: h * p, borderRadius: 10, background: i === 29 ? C.accent : C.primary, opacity: 0.35 + (i / 29) * 0.65 }} />;
        })}
      </div>
    </SceneShell>
  );
};

// ── CTA (follow + comment) ────────────────────────────────────────────────────
export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const follow = relTo("cta", marks.follow), day4 = relTo("cta", marks.day4);
  const press = tween(frame, follow + 6, follow + 12, 0, 1) * tween(frame, follow + 12, follow + 20, 1, 0);
  const done = frame >= follow + 12;
  const btn = useSpring(follow - 10, "bouncy");
  const full = "DAY 4 DONE!";
  const typed = Math.max(0, Math.min(full.length, Math.floor((frame - day4 + 4) / 1.6)));
  const cursor = Math.floor(frame / 8) % 2 === 0;
  return (
    <SceneShell>
      <div style={{ position: "absolute", left: M, right: M, top: 84 }}>
        <WordReveal text="প্রতিদিনের Lesson পেতে" delay={2} size={70} highlight={[1]} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 270, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "30px 64px", borderRadius: 999, background: done ? C.surface : C.primary, color: done ? C.primary : C.onPrimary,
          border: `5px solid ${C.primary}`, ...FONT, fontSize: 68, boxShadow: `0 30px 60px -26px ${C.glow}`, opacity: Math.min(1, btn * 1.5),
          transform: `scale(${interpolate(btn, [0, 1], [0.6, 1]) * (1 - 0.06 * press)})` }}>
          {done ? <CheckGlyph size={56} p={tween(frame, follow + 12, follow + 22, 0, 1)} color={C.primary} /> : <PlusGlyph size={56} />}
          ফলো করুন
        </div>
      </div>
      <div style={{ position: "absolute", left: M, right: M, top: 500 }}>
        <WordReveal text="এবং কমেন্টে লিখুন" delay={follow + 10} size={64} weight={theme.weight.body} />
      </div>
      <Card delay={day4 - 18} from="up" style={{ position: "absolute", left: M + 40, top: 680, width: 856, height: 230, boxSizing: "border-box", padding: 34, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}><CommentGlyph size={40} /><span style={{ ...FONT, fontSize: 30, color: C.textDim }}>Comment</span></div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1, background: C.bg, borderRadius: 26, padding: "0 30px" }}>
          <div style={{ ...FONT, fontSize: 62, color: C.text, letterSpacing: 2 }}>
            {full.slice(0, typed)}<span style={{ opacity: cursor ? 1 : 0, color: C.primary }}>|</span>
          </div>
          <div style={{ width: 66, height: 66, borderRadius: 66, background: typed >= full.length ? C.primary : C.line, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckGlyph size={34} p={typed >= full.length ? 1 : 0} />
          </div>
        </div>
      </Card>
    </SceneShell>
  );
};

// ── OUTRO ─────────────────────────────────────────────────────────────────────
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const day = useSpring(4, "bouncy");
  const brand = useSpring(26, "smooth");
  return (
    <SceneShell dir={-1}>
      <div style={{ position: "absolute", left: M, right: M, top: 120 }}>
        <WordReveal text="দেখা হবে" delay={2} size={80} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 36 }}>
        <div style={{ ...FONT, fontSize: 220, color: C.text, opacity: Math.min(1, day * 1.5), transform: `translateX(${interpolate(day, [0, 1], [-80, 0])}px)` }}>DAY</div>
        <div style={{ ...FONT, fontSize: 280, color: C.primary, opacity: Math.min(1, day * 1.5), textShadow: `0 20px 60px ${C.glow}`, transform: `scale(${interpolate(day, [0, 1], [1.6, 1])})` }}>5</div>
        <div style={{ ...FONT, fontSize: 80, color: C.textDim, opacity: tween(frame, 10, 20, 0, 1) }}>-তে</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 610, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative" }}>
          <HighlightBar delay={20} color={C.accentSoft} height={30} />
          <MaskSweep text="ইনশাআল্লাহ!" delay={14} size={110} color={C.text} />
        </div>
      </div>
      <div style={{ position: "absolute", left: M, top: 810, width: 936, opacity: Math.min(1, brand * 2) }}>
        <div style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 26, borderRadius: 8, background: i < 4 ? C.primary : i === 4 ? C.accent : C.line,
              transform: `scaleY(${i === 4 ? 1 + 0.25 * Math.sin(frame / 5) : 1})` }} />
          ))}
        </div>
        <div style={{ ...FONT, fontSize: 56, color: C.primary, textAlign: "center", marginTop: 26, transform: `translateY(${interpolate(brand, [0, 1], [30, 0])}px)` }}>Survival Arabic</div>
      </div>
    </SceneShell>
  );
};
