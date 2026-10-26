import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, glass, theme } from "../theme";
import { enter, exitAt, spr, tween, win } from "../components/anim";
import { PhraseText, Words } from "../components/Text";
import { Waveform } from "../components/Waveform";
import { Icon } from "../components/Icons";
import { LAYOUTS, SENTENCES } from "../content";
import { SENT, ev, f, scene } from "../timeline";

type Ctx = {
  frame: number; fps: number; n: number; phrase: string; meaning: string;
  t: { L: number; P: number; R: number; M: number; Say?: number };
  sweep: [number, number]; amp: number;
};
const c = theme.colors;

// ---------- shared pieces ----------
const LabelTile: React.FC<{ ctx: Ctx }> = ({ ctx }) => {
  const { frame, fps, n, t } = ctx;
  const p = spr(frame, fps, 0, theme.spring.bouncy);
  const out = exitAt(frame, t.P - 8, 10);
  if (frame > t.P + 4) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - out, transform: `translateY(${-130 * out}px) scale(${1 - 0.3 * out})` }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 600, fontSize: 60, color: c.textDim, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 24}px)` }}>Sentence</div>
        <div style={{ position: "relative", width: 300, height: 300 }}>
          {[0, 1].map((i) => {
            const r = ((frame + i * 20) % 40) / 40;
            return <div key={i} style={{ position: "absolute", inset: 0, borderRadius: 76, border: `4px solid ${alpha(c.accent, 0.5 * (1 - r))}`, transform: `scale(${1 + r * 0.45})` }} />;
          })}
          <div style={{ position: "absolute", inset: 0, borderRadius: 76, background: c.primary, boxShadow: theme.shadow.hero, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: theme.fonts.display, fontWeight: 700, fontSize: n === 10 ? 160 : 200, color: c.onPrimary, opacity: Math.min(1, p * 1.6),
            transform: `scale(${(0.35 + 0.65 * p) * (1 + Math.sin(frame / 14) * 0.018)}) rotate(${(1 - p) * -12}deg)` }}>{n}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Chip: React.FC<{ ctx: Ctx; style?: React.CSSProperties }> = ({ ctx, style }) => {
  const { frame, fps, n, t } = ctx;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, height: 66, padding: "0 30px", borderRadius: 999, background: alpha(c.surface, 0.9), border: `2px solid ${c.primary}`,
      whiteSpace: "nowrap", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 38, color: c.text, boxShadow: theme.shadow.soft, ...enter(frame, fps, t.P - 4, { y: -24, s: 0.8, cfg: theme.spring.snappy }), ...style }}>
      <span style={{ width: 14, height: 14, borderRadius: 14, background: c.primary }} /> Sentence {n}
    </div>
  );
};

const ChipTop: React.FC<{ ctx: Ctx; top: number }> = ({ ctx, top }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center" }}><Chip ctx={ctx} /></div>
);

const SayPill: React.FC<{ ctx: Ctx; top: number }> = ({ ctx, top }) => {
  const { frame, fps, t } = ctx;
  if (t.Say === undefined) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", ...enter(frame, fps, t.Say, { y: 50, s: 0.85, cfg: theme.spring.bouncy }) }}>
      <div style={{ height: 80, padding: "0 38px", borderRadius: 999, background: c.surface, border: `3px solid ${c.accent}`, display: "flex", alignItems: "center", gap: 18, boxShadow: theme.shadow.card,
        fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 46, color: c.text }}>
        <div style={{ transform: `scale(${1 + Math.sin(frame / 5) * 0.08})` }}><Icon name="mic" size={44} color={c.primary} stroke={2.2} /></div>
        আমার সঙ্গে বলুন
      </div>
    </div>
  );
};

// ---------- Layout 1: glass card + waveform + meaning panel ----------
const L1: React.FC<{ ctx: Ctx }> = ({ ctx }) => {
  const { frame, fps, t, phrase, meaning, amp, sweep } = ctx;
  const m = spr(frame, fps, t.M, theme.spring.snappy);
  return (
    <AbsoluteFill>
      <ChipTop ctx={ctx} top={138} />
      <div style={{ position: "absolute", left: 90, top: 225, width: 900, height: 400, ...glass(56), ...enter(frame, fps, t.P, { y: 70, s: 0.92 }) }}>
        <div style={{ position: "absolute", left: 40, top: 30, display: "flex", alignItems: "center", gap: 12, fontFamily: theme.fonts.display, fontWeight: 600, fontSize: 32, color: c.textDim }}>
          <Icon name="volume" size={34} color={c.primary} /> শুনুন
        </div>
        <div style={{ position: "absolute", left: 60, right: 60, top: 80, height: 220, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${Math.sin(frame / 30) * 3}px)` }}>
          <PhraseText text={phrase} revealAt={t.P + 3} size={phrase.length > 20 ? 84 : 96} sweep={sweep} />
        </div>
        <div style={{ position: "absolute", left: 120, bottom: 30 }}><Waveform width={660} height={54} amp={amp} color={c.accent} bars={30} /></div>
      </div>
      <div style={{ position: "absolute", left: 90, top: 660, width: 900, height: 240, borderRadius: 52, background: c.primary, boxShadow: theme.shadow.hero, padding: "30px 50px", boxSizing: "border-box",
        opacity: Math.min(1, m * 1.6), transform: `translateY(${(1 - m) * 90}px) scale(${0.9 + 0.1 * m})` }}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 600, fontSize: 32, color: alpha(c.onPrimary, 0.78), marginBottom: 8 }}>অর্থ</div>
        <Words text={meaning} delay={t.M + 4} per={3} size={meaning.length > 22 ? 58 : 64} color={c.onPrimary} align="left" />
      </div>
      <SayPill ctx={ctx} top={925} />
    </AbsoluteFill>
  );
};

// ---------- Layout 2: chat UI ----------
const Dots: React.FC<{ frame: number }> = ({ frame }) => (
  <div style={{ display: "flex", gap: 12 }}>
    {[0, 1, 2].map((i) => <div key={i} style={{ width: 20, height: 20, borderRadius: 20, background: c.textDim, opacity: 0.75, transform: `translateY(${Math.sin(frame / 4 - i * 0.9) * -7}px)` }} />)}
  </div>
);
const L2: React.FC<{ ctx: Ctx }> = ({ ctx }) => {
  const { frame, fps, t, phrase, meaning, amp, sweep } = ctx;
  const pb = spr(frame, fps, t.P, theme.spring.bouncy);
  const mb = spr(frame, fps, t.M, theme.spring.bouncy);
  const typing = tween(frame, t.R, t.R + 8, 0, 1) * tween(frame, t.M - 6, t.M, 1, 0, theme.ease.in);
  const rep = spr(frame, fps, t.R, theme.spring.bouncy);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 80, top: 170, width: 920, height: 740, ...glass(56), ...enter(frame, fps, 0, { y: 60, s: 0.96 }) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 104, borderBottom: `2px solid ${c.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", left: 40, display: "flex", gap: 12 }}>
            {[c.accent, alpha(c.primary, 0.5), c.ink12].map((col, i) => <div key={i} style={{ width: 20, height: 20, borderRadius: 20, background: col }} />)}
          </div>
          <Chip ctx={ctx} style={{ boxShadow: "none" }} />
        </div>
        {/* phrase bubble (left) */}
        <div style={{ position: "absolute", left: 36, top: 140, maxWidth: 770, padding: "34px 44px 28px", background: c.surface, borderRadius: "46px 46px 46px 12px", boxShadow: theme.shadow.soft, border: `2px solid ${c.line}`,
          opacity: Math.min(1, pb * 1.6), transform: `translateY(${(1 - pb) * 50}px) scale(${0.8 + 0.2 * pb})`, transformOrigin: "0% 100%" }}>
          <PhraseText text={phrase} revealAt={t.P + 4} size={phrase.length > 20 ? 64 : 72} align="left" sweep={sweep} />
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 22 }}>
            <Icon name="volume" size={40} color={c.primary} />
            <Waveform width={300} height={44} amp={amp} color={c.accent} bars={22} />
            <div style={{ height: 44, padding: "0 18px", borderRadius: 22, background: alpha(c.accent, 0.3), display: "flex", alignItems: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 30, color: c.text,
              transform: `scale(${rep})`, opacity: rep }}>×2</div>
          </div>
        </div>
        {/* typing, then meaning bubble (right) */}
        <div style={{ position: "absolute", right: 36, top: 480, padding: "26px 38px", background: c.surface, borderRadius: "40px 40px 12px 40px", border: `2px solid ${c.line}`, boxShadow: theme.shadow.soft,
          opacity: typing, transform: `scale(${0.7 + 0.3 * typing})`, transformOrigin: "100% 100%" }}><Dots frame={frame} /></div>
        <div style={{ position: "absolute", right: 36, top: 450, maxWidth: 760, padding: "26px 44px 32px", background: c.primary, borderRadius: "46px 46px 12px 46px", boxShadow: theme.shadow.hero,
          opacity: Math.min(1, mb * 1.6), transform: `translateY(${(1 - mb) * 50}px) scale(${0.8 + 0.2 * mb})`, transformOrigin: "100% 100%" }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 600, fontSize: 30, color: alpha(c.onPrimary, 0.78), marginBottom: 6 }}>অর্থ</div>
          <Words text={meaning} delay={t.M + 4} per={3} size={meaning.length > 22 ? 56 : 62} color={c.onPrimary} align="left" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Layout 3: spotlight + pulse rings + translation strip ----------
const L3: React.FC<{ ctx: Ctx }> = ({ ctx }) => {
  const { frame, fps, t, phrase, meaning, amp, sweep } = ctx;
  const ps = spr(frame, fps, t.P, theme.spring.smooth);
  const m = spr(frame, fps, t.M, { damping: 16, stiffness: 120, mass: 0.8 });
  return (
    <AbsoluteFill>
      {[0, 1, 2].map((i) => {
        const r = ((frame + i * 28) % 84) / 84;
        return <div key={i} style={{ position: "absolute", left: 540 - 260, top: 460 - 260, width: 520, height: 520, borderRadius: 520, border: `4px solid ${alpha(c.primary, 0.22 * (1 - r) * ps)}`, transform: `scale(${0.6 + r * 0.9})` }} />;
      })}
      <div style={{ position: "absolute", left: 540 - 250, top: 460 - 250, width: 500, height: 500, borderRadius: 500, background: `radial-gradient(circle, ${alpha(c.surface, 0.95)}, ${alpha(c.surface, 0)} 70%)`, opacity: ps }} />
      <ChipTop ctx={ctx} top={150} />
      <div style={{ position: "absolute", left: 60, width: 960, top: 300, height: 320, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${Math.sin(frame / 28) * 4}px)` }}>
        <PhraseText text={phrase} revealAt={t.P + 2} size={phrase.length > 20 ? 104 : 120} sweep={sweep} per={5} />
      </div>
      <div style={{ position: "absolute", left: 270, top: 650, opacity: ps }}><Waveform width={540} height={76} amp={amp} color={c.accent} bars={32} /></div>
      <div style={{ position: "absolute", left: 80, top: 790, width: 920, minHeight: 170, boxSizing: "border-box", padding: "20px 40px 20px 36px", display: "flex", alignItems: "center", gap: 30,
        background: c.surface, border: `3px solid ${c.primary}`, borderRadius: 52, boxShadow: theme.shadow.card,
        opacity: Math.min(1, m * 1.6), transform: `perspective(1200px) rotateX(${(1 - m) * -70}deg) translateY(${(1 - m) * 60}px)`, transformOrigin: "50% 100%" }}>
        <div style={{ width: 100, height: 100, flex: "none", borderRadius: 100, background: c.primary, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: theme.shadow.hero }}>
          <Icon name="arrow" size={54} color={c.onPrimary} stroke={2.6} />
        </div>
        <Words text={meaning} delay={t.M + 5} per={3} size={meaning.length > 22 ? 54 : 60} align="left" />
      </div>
    </AbsoluteFill>
  );
};

// ---------- Layout 4: 3D flashcard flip ----------
const L4: React.FC<{ ctx: Ctx }> = ({ ctx }) => {
  const { frame, fps, t, phrase, meaning, amp, sweep } = ctx;
  const ent = spr(frame, fps, t.P, theme.spring.smooth);
  const flip = tween(frame, t.M, t.M + 24, 0, 180, Easing.bezier(0.83, 0, 0.17, 1));
  const tilt = Math.sin(frame / 36) * 2.4;
  const fl = Math.sin(frame / 26) * 7;
  const face: React.CSSProperties = { position: "absolute", inset: 0, borderRadius: 60, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", boxSizing: "border-box" };
  return (
    <AbsoluteFill>
      <ChipTop ctx={ctx} top={135} />
      <div style={{ position: "absolute", left: 540 - 300, top: 880, width: 600, height: 50, borderRadius: 300, background: alpha(c.text, 0.12), filter: "blur(22px)", opacity: ent, transform: `scaleX(${0.9 - Math.abs(Math.sin(frame / 26)) * 0.06})` }} />
      <div style={{ position: "absolute", left: 130, top: 235, width: 820, height: 600, perspective: 1800, opacity: Math.min(1, ent * 1.6), transform: `translateY(${(1 - ent) * 90 + fl}px) scale(${0.88 + 0.12 * ent})` }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateX(${tilt}deg) rotateY(${flip + tilt * 0.6}deg)` }}>
          <div style={{ ...face, ...glass(60), background: c.surface }}>
            <div style={{ position: "absolute", left: 46, top: 36, display: "flex", alignItems: "center", gap: 12, fontFamily: theme.fonts.display, fontWeight: 600, fontSize: 32, color: c.textDim }}>
              <Icon name="volume" size={34} color={c.primary} /> শুনুন
            </div>
            <div style={{ position: "absolute", left: 50, right: 50, top: 100, height: 330, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PhraseText text={phrase} revealAt={t.P + 4} size={phrase.length > 20 ? 80 : 90} sweep={sweep} />
            </div>
            <div style={{ position: "absolute", left: 130, bottom: 50 }}><Waveform width={560} height={58} amp={amp} color={c.accent} bars={28} /></div>
          </div>
          <div style={{ ...face, background: c.primary, boxShadow: theme.shadow.hero, transform: "rotateY(180deg)", padding: "46px 54px", display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 600, fontSize: 38, color: alpha(c.onPrimary, 0.8) }}>অর্থ</div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Words text={meaning} delay={t.M + 14} per={3} size={meaning.length > 22 ? 70 : 78} color={c.onPrimary} />
            </div>
            <div style={{ alignSelf: "flex-end", width: 76, height: 76, borderRadius: 76, background: c.accent, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${spr(frame, fps, t.M + 20, theme.spring.bouncy)})` }}>
              <Icon name="check" size={44} color={c.text} stroke={3} progress={tween(frame, t.M + 24, t.M + 38, 0, 1)} />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SentenceScene: React.FC<{ n: number }> = ({ n }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = SENT[n - 1];
  const from = scene(`s${n}`).from;
  const e = (sec: number) => ev(sec) - from;
  const s = (sec: number) => f(sec) - from;
  const { phrase, meaning } = SENTENCES[n - 1];
  const t = { L: e(S.L), P: e(S.P), R: e(S.R), M: e(S.M), Say: S.Say !== undefined ? e(S.Say) : undefined };
  const amp = Math.max(
    win(frame, s(S.P), s(S.Pe)), win(frame, s(S.R), s(S.Re)),
    S.Say !== undefined && S.SayEnd !== undefined ? win(frame, s(S.Say), s(S.SayEnd)) : 0
  );
  const ctx: Ctx = { frame, fps, n, phrase, meaning, t, sweep: [s(S.R), s(S.Re)], amp };
  const Layout = { 1: L1, 2: L2, 3: L3, 4: L4 }[LAYOUTS[n - 1]];
  return (
    <AbsoluteFill>
      <LabelTile ctx={ctx} />
      {frame >= t.P - 6 && <Layout ctx={ctx} />}
    </AbsoluteFill>
  );
};
