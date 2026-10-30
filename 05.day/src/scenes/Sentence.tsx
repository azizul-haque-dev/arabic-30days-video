import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { BEATS, SCENES } from "../timing";
import { SENTENCES } from "../content";
import { Card, Counter, Entrance, Pill, SceneExit, WordReveal, clamp } from "../components/kit";
import { Icon } from "../components/Icons";
import { Sfx } from "../components/Sfx";

const C = theme.colors;
const txt = (size: number, weight: number = theme.weights.hero, color: string = C.text): React.CSSProperties => ({
  fontFamily: theme.fonts.display, fontSize: size, fontWeight: weight, color, lineHeight: 1.16, letterSpacing: 0,
});
const phraseSize = (p: string, big: number, small: number) => (p.length > 22 ? small : big);
const CHIME_RATES = [1, 1.12, 0.94, 1.06];

type P = { i: number; dur: number };
const useBeats = (i: number) => {
  const from = SCENES.find((s) => s.id === `s${i + 1}`)!.from;
  return { say: BEATS[i].say - from, mean: BEATS[i].mean - from };
};

/** Highlight sweep that passes twice under the phrase (the phrase is spoken twice between "বলুন" and "অর্থ"). */
const RepeatSweep: React.FC<{ say: number; mean: number; color: string; height?: number }> = ({ say, mean, color, height = 10 }) => {
  const frame = useCurrentFrame();
  const half = Math.max(20, (mean - say) / 2);
  const k = (frame - say - 10) / half;
  const s = k < 0 || k >= 2 ? 0 : interpolate(k % 1, [0, 0.82], [0, 1], { ...clamp, easing: theme.ease.out });
  const fade = k < 0 || k >= 2 ? 0 : 1 - interpolate(k % 1, [0.82, 1], [0, 1], clamp) * 0.7;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: -6, height, borderRadius: height, background: color, opacity: fade,
      clipPath: `inset(0 ${100 - s * 100}% 0 0)` }} />
  );
};

const Phrase: React.FC<{ text: string; size: number; delay: number; say: number; mean: number; color: string; sweep: string; justify?: React.CSSProperties["justifyContent"] }> = ({ text, size, delay, say, mean, color, sweep, justify = "center" }) => (
  <div style={{ position: "relative", display: "inline-block", paddingBottom: 6 }}>
    <WordReveal text={text} delay={delay} per={5} justify={justify} gap={size * 0.28} style={txt(size, theme.weights.hero, color)} />
    <RepeatSweep say={say} mean={mean} color={sweep} />
  </div>
);

const Meaning: React.FC<{ text: string; delay: number; size: number; tone?: "accent" | "white" }> = ({ text, delay, size, tone = "accent" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 26, justifyContent: "center", flexWrap: "wrap" }}>
    <Entrance delay={delay} config={theme.spring.bouncy} from={20} scaleFrom={0.7}><Pill tone={tone} size={size * 0.62}>অর্থ</Pill></Entrance>
    <WordReveal text={text} delay={delay + 4} per={3} justify="center" gap={size * 0.26} style={txt(size, theme.weights.strong)} />
  </div>
);

/* ───── Layout 1 · Glossy chat mockup (sentences 1, 4, 7, 10) ───── */
export const ChatLayout: React.FC<P> = ({ i, dur }) => {
  const s = SENTENCES[i];
  const { say, mean } = useBeats(i);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const typing = interpolate(frame, [say - 26, say - 18, say - 3, say + 3], [0, 1, 1, 0], clamp);
  const replyP = spring({ frame: frame - say, fps, config: theme.spring.snappy });
  const size = s.phrase.length > 16 ? 66 : 84;
  return (
    <SceneExit dur={dur}>
      <Sfx name="pop" at={5} />
      <Sfx name="chime" at={12} rate={CHIME_RATES[i % 4]} gain={0.8} />
      <Sfx name="pop" at={say} rate={1.04} />
      <Sfx name="pop" at={mean + 1} rate={1.1} />
      <div style={{ position: "absolute", left: 80, top: 64 }}><Counter n={s.n} nBn={s.nBn} /></div>
      <div style={{ position: "absolute", left: 70, top: 170 }}><Icon id={s.icon} size={236} delay={4} /></div>
      <div style={{ position: "absolute", left: 340, top: 200, width: 660 }}>
        <Entrance delay={8} from={26} config={theme.spring.snappy}>
          <Card style={{ padding: "30px 38px", borderRadius: 46, position: "relative" }}>
            <div style={{ position: "absolute", left: -14, top: 62, width: 30, height: 30, background: C.surface, transform: "rotate(45deg)", borderRadius: 6, borderLeft: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }} />
            <WordReveal text={s.situation} delay={10} per={3} gap={14} style={txt(50, theme.weights.strong)} />
          </Card>
        </Entrance>
      </div>
      {/* reply */}
      <div style={{ position: "absolute", right: 70, top: 500, maxWidth: 900, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14 }}>
        <Entrance delay={Math.max(0, say - 22)} from={16}><Pill tone="soft" size={36}>বলুন</Pill></Entrance>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", right: 0, top: 0, opacity: typing, display: "flex", gap: 14, padding: "30px 44px", borderRadius: 46, background: C.primary, boxShadow: theme.shadow.hero }}>
            {[0, 1, 2].map((d) => <div key={d} style={{ width: 20, height: 20, borderRadius: 20, background: C.white, opacity: 0.6 + 0.4 * Math.sin(frame / 4 - d), transform: `translateY(${Math.sin(frame / 4 - d) * -5}px)` }} />)}
          </div>
          {frame >= say - 1 && (
            <div style={{ background: C.primary, borderRadius: 52, padding: "34px 50px 40px", boxShadow: `${theme.shadow.hero}, 0 0 80px ${C.glow}`, opacity: interpolate(replyP, [0, 0.4], [0, 1], clamp),
              transform: `scale(${interpolate(replyP, [0, 1], [0.8, 1])}) translateY(${interpolate(replyP, [0, 1], [24, 0])}px)`, transformOrigin: "right center", textAlign: "center" }}>
              <Phrase text={s.phrase} size={size} delay={say + 1} say={say} mean={mean} color={C.white} sweep={C.accent} />
            </div>
          )}
        </div>
      </div>
      {frame >= mean - 2 && (
        <div style={{ position: "absolute", left: 80, right: 80, top: 835 }}>
          <Entrance delay={mean} from={34} config={theme.spring.snappy}>
            <Card style={{ padding: "30px 40px", borderRadius: 46 }}><Meaning text={s.meaning} delay={mean + 2} size={54} /></Card>
          </Entrance>
        </div>
      )}
    </SceneExit>
  );
};

/* ───── Layout 2 · Glass card stack (sentences 2, 5, 8) ───── */
export const GlassLayout: React.FC<P> = ({ i, dur }) => {
  const s = SENTENCES[i];
  const { say, mean } = useBeats(i);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardP = spring({ frame: frame - say, fps, config: theme.spring.smooth });
  const glare = interpolate((frame - say) % 150, [0, 60], [-40, 160], clamp);
  const size = s.phrase.length <= 15 ? 100 : 76;
  return (
    <SceneExit dur={dur}>
      <Sfx name="pop" at={5} />
      <Sfx name="chime" at={14} rate={CHIME_RATES[i % 4]} gain={0.8} />
      <Sfx name="pop" at={say} rate={0.96} />
      <Sfx name="pop" at={mean + 1} rate={1.08} />
      <div style={{ position: "absolute", top: 64, width: "100%", display: "flex", justifyContent: "center" }}><Counter n={s.n} nBn={s.nBn} /></div>
      <div style={{ position: "absolute", top: 172, width: "100%", display: "flex", justifyContent: "center" }}>
        <Entrance delay={6} config={theme.spring.snappy}><Pill tone="white" size={46} style={{ maxWidth: 940, textAlign: "center" }}>{s.situation}</Pill></Entrance>
      </div>
      <div style={{ position: "absolute", top: 292, width: "100%", display: "flex", justifyContent: "center" }}>
        <Icon id={s.icon} size={236} delay={10} />
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 552, height: 250 }}>
        {frame >= say - 1 && (
          <div style={{ position: "relative", height: "100%", borderRadius: 56, overflow: "hidden", background: "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,255,255,0.62))",
            border: "2px solid rgba(255,255,255,0.9)", boxShadow: theme.shadow.card, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 50px",
            opacity: interpolate(cardP, [0, 0.4], [0, 1], clamp), transform: `translateY(${interpolate(cardP, [0, 1], [50, 0])}px) scale(${interpolate(cardP, [0, 1], [0.94, 1])})` }}>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${glare}%`, width: 130, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)", transform: "skewX(-20deg)" }} />
            <Phrase text={s.phrase} size={size} delay={say + 1} say={say} mean={mean} color={C.primary} sweep={C.accent} />
          </div>
        )}
      </div>
      {frame >= mean - 2 && (
        <div style={{ position: "absolute", left: 90, right: 90, top: 832 }}>
          <Entrance delay={mean} from={30}>
            <div style={{ background: C.accentSoft, borderRadius: 50, padding: "34px 40px", boxShadow: theme.shadow.soft, border: `1px solid ${C.line}` }}>
              <Meaning text={s.meaning} delay={mean + 2} size={56} tone="white" />
            </div>
          </Entrance>
        </div>
      )}
    </SceneExit>
  );
};

/* ───── Layout 3 · Bento grid (sentences 3, 6, 9) ───── */
export const BentoLayout: React.FC<P> = ({ i, dur }) => {
  const s = SENTENCES[i];
  const { say, mean } = useBeats(i);
  const frame = useCurrentFrame();
  const size = phraseSize(s.phrase, 90, 70);
  return (
    <SceneExit dur={dur}>
      <Sfx name="pop" at={5} />
      <Sfx name="chime" at={13} rate={CHIME_RATES[i % 4]} gain={0.8} />
      <Sfx name="pop" at={say} rate={1.0} />
      <Sfx name="pop" at={mean + 1} rate={1.06} />
      <div style={{ position: "absolute", left: 80, top: 64 }}><Counter n={s.n} nBn={s.nBn} /></div>
      <div style={{ position: "absolute", left: 80, top: 170, width: 410, height: 380 }}>
        <Entrance delay={4} from={40} config={theme.spring.smooth} style={{ height: "100%" }}>
          <div style={{ height: "100%", borderRadius: 56, background: C.primarySoft, border: `1px solid ${C.line}`, boxShadow: theme.shadow.card, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon id={s.icon} size={300} delay={8} />
          </div>
        </Entrance>
      </div>
      <div style={{ position: "absolute", left: 520, top: 170, width: 480, height: 380 }}>
        <Entrance delay={9} from={40} config={theme.spring.smooth} style={{ height: "100%" }}>
          <Card style={{ height: "100%", borderRadius: 56, padding: "0 40px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 22 }}>
            <Pill tone="soft" size={32} style={{ alignSelf: "flex-start" }}>পরিস্থিতি</Pill>
            <WordReveal text={s.situation} delay={12} per={3} gap={13} style={txt(54, theme.weights.strong)} />
          </Card>
        </Entrance>
      </div>
      <div style={{ position: "absolute", left: 80, top: 590, width: 920, height: 250 }}>
        {frame >= say - 2 && (
          <Entrance delay={say} from={44} config={theme.spring.snappy} style={{ height: "100%" }}>
            <div style={{ height: "100%", borderRadius: 56, background: C.primary, boxShadow: `${theme.shadow.hero}, 0 0 80px ${C.glow}`, position: "relative", overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center", padding: "0 44px" }}>
              <div style={{ position: "absolute", right: -60, top: -80, width: 240, height: 240, borderRadius: 240, background: "rgba(255,255,255,0.10)" }} />
              <div style={{ position: "absolute", left: -50, bottom: -90, width: 200, height: 200, borderRadius: 200, background: "rgba(255,255,255,0.08)" }} />
              <Phrase text={s.phrase} size={size} delay={say + 2} say={say} mean={mean} color={C.white} sweep={C.accent} />
            </div>
          </Entrance>
        )}
      </div>
      <div style={{ position: "absolute", left: 80, top: 870, width: 920, height: 140 }}>
        {frame >= mean - 2 && (
          <Entrance delay={mean} from={34} config={theme.spring.snappy} style={{ height: "100%" }}>
            <Card style={{ height: "100%", borderRadius: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 34px" }}><Meaning text={s.meaning} delay={mean + 2} size={50} /></Card>
          </Entrance>
        )}
      </div>
    </SceneExit>
  );
};
void AbsoluteFill;
