import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { tween, useSpring, windowOn } from "../anim";
import { Card, MaskSweep, Pill, WordReveal } from "../components/Text";
import { CheckGlyph, SceneIcon, WaveBars } from "../components/Icons";
import { SceneShell } from "../components/SceneShell";
import { Sentence } from "../data/script";
import { SentenceTiming } from "../timing";

const C = theme.colors;
const M = theme.size.margin;
const pad2 = (n: number) => String(n).padStart(2, "0");

type Rel = { say: number; phrase: number; rep2: number; mean: number };
type Props = { s: Sentence; t: SentenceTiming };

const phraseSize = (txt: string, k = 1) => {
  const len = [...txt].length;
  return Math.round((len <= 14 ? 78 : len <= 20 ? 68 : len <= 26 ? 60 : 54) * k);
};

// ── shared pieces ─────────────────────────────────────────────────────────────
const Header: React.FC<{ n: number }> = ({ n }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: M, top: 56, right: M, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Pill size={34} delay={0}><span style={{ color: C.textDim }}>Sentence</span><span style={{ color: C.primary }}>{pad2(n)}</span></Pill>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: theme.weight.display, fontSize: 34, color: C.textDim,
          opacity: tween(frame, 4, 14, 0, 1) }}>{pad2(n)} / 10</div>
      </div>
      <div style={{ position: "absolute", left: M, right: M, top: 132, display: "flex", gap: 8 }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const done = i < n - 1, cur = i === n - 1;
          const grow = tween(frame, 2 + i * 2, 14 + i * 2, 0, 1);
          return (
            <div key={i} style={{ flex: 1, height: 10, borderRadius: 10, background: C.line, overflow: "hidden", transform: `scaleY(${0.4 + 0.6 * grow})` }}>
              <div style={{ width: done || cur ? "100%" : 0, height: "100%", background: cur ? C.accent : C.primary,
                opacity: done ? 0.5 : 1, transformOrigin: "0 50%", transform: `scaleX(${cur ? tween(frame, 12, 30, 0, 1) : 1})` }} />
            </div>
          );
        })}
      </div>
    </>
  );
};

const RepDots: React.FC<{ r: Rel; on?: string; off?: string }> = ({ r, on = C.primary, off = C.line }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 14 }}>
      {[r.phrase, r.rep2].map((at, i) => {
        const p = useSpring(at, "bouncy");
        return <div key={i} style={{ width: 22, height: 22, borderRadius: 22, background: frame >= at ? on : off,
          transform: `scale(${frame >= at ? 0.8 + 0.4 * Math.min(1, p) : 1})` }} />;
      })}
    </div>
  );
};

const usePulse = (r: Rel) => {
  const frame = useCurrentFrame();
  const k = (at: number) => tween(frame, at, at + 5, 0, 1) * tween(frame, at + 5, at + 18, 1, 0);
  return 1 + 0.045 * Math.max(k(r.phrase), k(r.rep2));
};

const energyOf = (frame: number, r: Rel) => Math.min(1, windowOn(frame, r.phrase, r.rep2) + windowOn(frame, r.rep2, r.mean));

const Meaning: React.FC<{ text: string; r: Rel; style?: React.CSSProperties; size?: number }> = ({ text, r, style, size = 50 }) => {
  const frame = useCurrentFrame();
  const chk = tween(frame, r.mean + 8, r.mean + 18, 0, 1);
  return (
    <Card delay={r.mean} from="up" style={{ display: "flex", alignItems: "center", gap: 26, padding: "26px 38px", ...style }}>
      <div style={{ width: 66, height: 66, borderRadius: 66, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", flex: "none",
        transform: `scale(${0.7 + 0.3 * chk})` }}>
        <CheckGlyph size={38} p={chk} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: theme.weight.display, fontSize: 28, color: C.accent, lineHeight: 1.3 }}>অর্থ</div>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: theme.weight.display, fontSize: size, color: C.text, lineHeight: 1.3 }}>{text}</div>
      </div>
    </Card>
  );
};

const SayTag: React.FC<{ text: string; at: number; bg?: string; color?: string }> = ({ text, at, bg = C.accent, color = C.text }) => (
  <Pill size={32} delay={at} bg={bg} color={color}>{text}</Pill>
);

// ── L1: Glossy chat UI ───────────────────────────────────────────────────────
const Chat: React.FC<Props> = ({ s, t }) => {
  const frame = useCurrentFrame();
  const r = t;
  const pulse = usePulse(r);
  const energy = energyOf(frame, r);
  const typing = frame >= r.say + 6 && frame < r.phrase;
  const replyP = useSpring(r.phrase, "snappy");
  const dots = [0, 1, 2].map((i) => Math.sin(frame / 3 - i * 1.1) * 0.5 + 0.5);
  return (
    <>
      <Card delay={4} style={{ position: "absolute", left: M, top: 188, width: 936, height: 610, padding: 44, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 22 }}>
          <div style={{ width: 88, height: 88, borderRadius: 88, background: C.bgAlt, flex: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <SceneIcon n={s.n} size={64} delay={8} />
          </div>
          <Card delay={10} float={false} bg={C.bgAlt} from="left" style={{ padding: "22px 32px", borderRadius: "10px 34px 34px 34px", maxWidth: 700, boxShadow: "none" }}>
            <WordReveal text={s.situation} delay={14} size={42} weight={theme.weight.body} align="flex-start" />
          </Card>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 26, height: 62 }}>
          <SayTag text={s.say} at={r.say} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20, position: "relative" }}>
          {typing && (
            <div style={{ display: "flex", gap: 10, padding: "24px 34px", borderRadius: "34px 34px 10px 34px", background: C.primary }}>
              {dots.map((d, i) => <div key={i} style={{ width: 16, height: 16, borderRadius: 16, background: C.onPrimary, opacity: 0.45 + d * 0.55, transform: `translateY(${-d * 6}px)` }} />)}
            </div>
          )}
          {frame >= r.phrase && (
            <div style={{ display: "flex", alignItems: "center", gap: 26, padding: "26px 40px", borderRadius: "34px 34px 10px 34px", background: C.primary,
              maxWidth: 800, transform: `scale(${pulse * (0.9 + 0.1 * Math.min(1, replyP))})`, transformOrigin: "100% 100%", boxShadow: `0 24px 50px -22px ${C.glow}` }}>
              <WaveBars count={5} w={64} h={64} energy={energy} color={C.onPrimary} gap={7} />
              <MaskSweep text={s.phrase} delay={r.phrase} size={phraseSize(s.phrase, 0.86)} color={C.onPrimary} align="left" />
            </div>
          )}
        </div>
      </Card>
      <Meaning text={s.meaning} r={r} style={{ position: "absolute", left: M, top: 840, width: 936, boxSizing: "border-box" }} />
    </>
  );
};

// ── L2: Stacked cards ────────────────────────────────────────────────────────
const Stack: React.FC<Props> = ({ s, t }) => {
  const frame = useCurrentFrame();
  const r = t;
  const pulse = usePulse(r);
  const energy = energyOf(frame, r);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 176, display: "flex", justifyContent: "center" }}>
        <Card delay={3} float={false} style={{ width: 270, height: 270, borderRadius: 270, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <SceneIcon n={s.n} size={200} delay={8} />
        </Card>
      </div>
      <div style={{ position: "absolute", left: M, right: M, top: 470, display: "flex", justifyContent: "center" }}>
        <WordReveal text={s.situation} delay={12} size={46} weight={theme.weight.body} style={{ maxWidth: 860 }} />
      </div>
      <Card delay={r.phrase - 6} from="up" style={{ position: "absolute", left: M, top: 628, width: 936, height: 228, boxSizing: "border-box",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, transform: undefined }}>
        <div style={{ position: "absolute", left: 34, top: -26 }}><SayTag text={s.say} at={r.say} /></div>
        <div style={{ position: "absolute", right: 36, top: 26 }}><WaveBars count={5} w={54} h={44} energy={energy} /></div>
        <div style={{ transform: `scale(${pulse})`, padding: "0 56px" }}>
          <MaskSweep text={s.phrase} delay={r.phrase} size={phraseSize(s.phrase, 0.95)} color={C.primary} />
        </div>
        <RepDots r={r} />
      </Card>
      <Meaning text={s.meaning} r={r} style={{ position: "absolute", left: M, top: 886, width: 936, boxSizing: "border-box", padding: "20px 38px" }} size={46} />
    </>
  );
};

// ── L3: Split panels ─────────────────────────────────────────────────────────
const Split: React.FC<Props> = ({ s, t }) => {
  const frame = useCurrentFrame();
  const r = t;
  const pulse = usePulse(r);
  const energy = energyOf(frame, r);
  const sweep = tween(frame, r.phrase - 8, r.phrase + 10, 0, 1);
  return (
    <>
      <Card delay={4} from="left" style={{ position: "absolute", left: M, top: 186, width: 936, height: 360, boxSizing: "border-box", padding: "0 48px",
        display: "flex", alignItems: "center", gap: 36 }}>
        <div style={{ flex: "none" }}><SceneIcon n={s.n} size={230} delay={8} /></div>
        <WordReveal text={s.situation} delay={12} size={46} weight={theme.weight.body} align="flex-start" style={{ flex: 1 }} />
      </Card>
      <div style={{ position: "absolute", left: M, top: 574, width: 936, height: 330, borderRadius: theme.radius.card, overflow: "hidden",
        background: C.primary, boxShadow: `0 40px 70px -30px ${C.glow}`,
        transform: `translateY(${interpolate(sweep, [0, 1], [70, 0])}px)`, opacity: Math.min(1, sweep * 2) }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 85% 0%, rgba(255,255,255,0.22), transparent 55%)` }} />
        <div style={{ position: "absolute", left: 36, top: 28 }}><SayTag text={s.say} at={r.say} /></div>
        <div style={{ position: "absolute", right: 40, top: 34 }}><WaveBars count={7} w={90} h={52} energy={energy} color={C.onPrimary} /></div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 108, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, padding: "0 50px" }}>
          <div style={{ transform: `scale(${pulse})` }}><MaskSweep text={s.phrase} delay={r.phrase} size={phraseSize(s.phrase, 0.98)} color={C.onPrimary} /></div>
          <RepDots r={r} on={C.accent} off="rgba(255,255,255,0.35)" />
        </div>
      </div>
      <Meaning text={s.meaning} r={r} style={{ position: "absolute", left: M + 60, top: 868, width: 816, boxSizing: "border-box", padding: "18px 38px" }} size={46} />
    </>
  );
};

// ── L4: Spotlight rings ──────────────────────────────────────────────────────
const Spot: React.FC<Props> = ({ s, t }) => {
  const frame = useCurrentFrame();
  const r = t;
  const pulse = usePulse(r);
  const energy = energyOf(frame, r);
  const ring = (at: number, k: number) => {
    const p = tween(frame, at, at + 34, 0, 1);
    return <div key={at + "-" + k} style={{ position: "absolute", left: 540 - (150 + k * 70 + p * 150), top: 722 - (150 + k * 70 + p * 150),
      width: (150 + k * 70 + p * 150) * 2, height: (150 + k * 70 + p * 150) * 2, borderRadius: "50%",
      border: `4px solid ${C.primary}`, opacity: (1 - p) * 0.35 * (frame >= at ? 1 : 0) }} />;
  };
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 168, display: "flex", justifyContent: "center" }}>
        <SceneIcon n={s.n} size={214} delay={4} />
      </div>
      <div style={{ position: "absolute", left: M, right: M, top: 410, display: "flex", justifyContent: "center" }}>
        <WordReveal text={s.situation} delay={10} size={46} weight={theme.weight.body} style={{ maxWidth: 860 }} />
      </div>
      <div style={{ position: "absolute", inset: 0 }}>
        {[0, 1].map((k) => ring(r.phrase, k))}
        {[0, 1].map((k) => ring(r.rep2, k))}
        <div style={{ position: "absolute", left: 540 - 300, top: 722 - 300, width: 600, height: 600, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.primary}22, transparent 65%)`, opacity: tween(frame, r.say, r.say + 14, 0, 1) }} />
      </div>
      <div style={{ position: "absolute", left: M, top: 560, width: 936, display: "flex", justifyContent: "center" }}>
        <SayTag text={s.say} at={r.say} />
      </div>
      <Card delay={r.phrase - 6} from="up" style={{ position: "absolute", left: M + 24, top: 636, width: 888, height: 188, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", gap: 28, padding: "0 40px" }}>
        <WaveBars count={5} w={60} h={56} energy={energy} />
        <div style={{ transform: `scale(${pulse})` }}><MaskSweep text={s.phrase} delay={r.phrase} size={phraseSize(s.phrase, 0.92)} color={C.primary} /></div>
      </Card>
      <div style={{ position: "absolute", left: 0, right: 0, top: 850, display: "flex", justifyContent: "center" }}><RepDots r={r} /></div>
      <Meaning text={s.meaning} r={r} style={{ position: "absolute", left: M + 24, top: 890, width: 888, boxSizing: "border-box", padding: "16px 38px" }} size={44} />
    </>
  );
};

const LAYOUTS = [Chat, Stack, Split, Spot];

export const SentenceScene: React.FC<Props> = (props) => {
  const Layout = LAYOUTS[(props.s.n - 1) % LAYOUTS.length];
  return (
    <SceneShell dir={props.s.n % 2 ? 1 : -1}>
      <AbsoluteFill>
        <Header n={props.s.n} />
        <Layout {...props} />
      </AbsoluteFill>
    </SceneShell>
  );
};
