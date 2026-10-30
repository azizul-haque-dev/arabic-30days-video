import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { SENTENCES } from "../content";
import { Card, Entrance, Pill, SceneExit, WordReveal, clamp } from "../components/kit";
import { Icon } from "../components/Icons";
import { Sfx } from "../components/Sfx";
import { toBn } from "./Intro";

const C = theme.colors;
const txt = (size: number, weight: number = theme.weights.hero, color: string = C.text): React.CSSProperties => ({
  fontFamily: theme.fonts.display, fontSize: size, fontWeight: weight, color, lineHeight: 1.14, letterSpacing: 0,
});

/* ───── Recap · Checklist grid (10 tiles) ───── */
export const RecapScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <SceneExit dur={dur}>
      <Sfx name="pop" at={3} />
      <Sfx name="click" at={22} rate={1.0} />
      <Sfx name="chime" at={60} rate={1.1} />
      <div style={{ position: "absolute", top: 92, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <WordReveal text="আজকের" per={5} justify="center" style={txt(60, theme.weights.strong, C.textDim)} />
        <WordReveal text="পর্ব ৫-এর ১০টি বাক্য" delay={5} per={5} justify="center" style={txt(92)} />
      </div>
      <div style={{ position: "absolute", top: 360, left: 70, right: 70, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20 }}>
        {SENTENCES.map((s, i) => {
          const d = 10 + i * 3;
          const ck = spring({ frame: frame - d - 8, fps, config: theme.spring.bouncy });
          return (
            <Entrance key={i} delay={d} config={theme.spring.snappy} from={34} scaleFrom={0.8}>
              <div style={{ height: 270, borderRadius: 40, background: C.surface, border: `1px solid ${C.line}`, boxShadow: theme.shadow.soft, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "24px 10px 26px" }}>
                <div style={txt(44, theme.weights.hero, C.textDim)}>{s.nBn}</div>
                <div style={{ ...txt(34, theme.weights.strong), textAlign: "center", minHeight: 80, display: "flex", alignItems: "center" }}>{s.recap}</div>
                <div style={{ width: 54, height: 54, borderRadius: 54, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${interpolate(ck, [0, 1], [0, 1])})` }}>
                  <svg viewBox="0 0 24 24" width={32} height={32}><path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke={C.white} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
            </Entrance>
          );
        })}
      </div>
    </SceneExit>
  );
};

/* ───── Comment CTA · input UI ───── */
export const CommentScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const press = spring({ frame: frame - 78, fps, config: theme.spring.bouncy });
  const caret = Math.floor(frame / 12) % 2 === 0;
  const shimmer = (x: number) => 0.55 + 0.25 * Math.sin(frame / 9 - x);
  return (
    <SceneExit dur={dur}>
      <Sfx name="pop" at={3} />
      <Sfx name="click" at={78} />
      <div style={{ position: "absolute", top: 120, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <WordReveal text="সবচেয়ে কাজে লাগবে" per={4} justify="center" style={txt(84)} />
        <WordReveal text="কোন বাক্যটি?" delay={10} per={5} justify="center" style={txt(116)} wordStyle={(i) => (i === 1 ? { color: C.primary } : {})} />
      </div>
      <div style={{ position: "absolute", top: 560, left: 90, right: 90 }}>
        <Entrance delay={16} from={50} config={theme.spring.snappy}>
          <Card style={{ borderRadius: 54, padding: "34px 36px", display: "flex", alignItems: "center", gap: 28 }}>
            <div style={{ width: 96, height: 96, borderRadius: 96, background: C.primarySoft, border: `5px solid ${C.white}`, boxShadow: theme.shadow.soft, flexShrink: 0, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 28, top: 16, width: 40, height: 40, borderRadius: 40, background: C.accent }} />
              <div style={{ position: "absolute", left: 10, top: 62, width: 76, height: 60, borderRadius: 38, background: C.accent }} />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ height: 22, borderRadius: 11, width: "88%", background: C.primarySoft, opacity: shimmer(0) }} />
              <div style={{ height: 22, borderRadius: 11, width: "58%", background: C.primarySoft, opacity: shimmer(1.2), display: "flex", justifyContent: "flex-end" }}>
                {caret && <div style={{ width: 5, height: 30, marginTop: -4, marginRight: -14, background: C.primary }} />}
              </div>
            </div>
            <div style={{ width: 96, height: 96, borderRadius: 96, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              boxShadow: theme.shadow.hero, transform: `scale(${1 - interpolate(press, [0, 1], [0, 0.0]) + (frame > 78 && frame < 90 ? -0.1 : 0)})` }}>
              <svg viewBox="0 0 24 24" width={46} height={46}><path d="M4 12 L20 4 L14 20 L11 13 Z" fill={C.white} stroke={C.white} strokeWidth={1.6} strokeLinejoin="round" /></svg>
            </div>
          </Card>
        </Entrance>
      </div>
      <div style={{ position: "absolute", top: 830, width: "100%", display: "flex", justifyContent: "center" }}>
        <Entrance delay={34} config={theme.spring.bouncy} from={30}><Pill tone="accent" size={54}>কমেন্টে জানান</Pill></Entrance>
      </div>
    </SceneExit>
  );
};

/* ───── Statement · minimal card with growing bars ───── */
export const StatementScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <SceneExit dur={dur}>
      <Sfx name="pop" at={3} />
      <Sfx name="chime" at={30} rate={1.06} />
      <div style={{ position: "absolute", top: 150, width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 28, height: 330 }}>
        {[70, 120, 175, 235, 300].map((h, i) => {
          const p = spring({ frame: frame - 6 - i * 5, fps, config: theme.spring.bouncy });
          return <div key={i} style={{ width: 90, height: h * p, borderRadius: 28, background: i === 4 ? C.primary : C.primarySoft, boxShadow: i === 4 ? theme.shadow.hero : undefined }} />;
        })}
      </div>
      <div style={{ position: "absolute", top: 560, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <WordReveal text="আরবি শিখুন সহজভাবে," delay={4} per={5} justify="center" style={txt(94)} />
        <WordReveal text="প্রতিদিন অল্প অল্প করে।" delay={22} per={5} justify="center" style={txt(80, theme.weights.strong, C.textDim)} wordStyle={(i) => (i >= 1 ? { color: C.primaryDeep } : {})} />
      </div>
    </SceneExit>
  );
};

/* ───── Follow + comment CTA (button click + typed "DAY 5 DONE!") ───── */
export const FollowScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clickAt = 34, typeAt = 66;
  const clicked = frame >= clickAt;
  const pressP = spring({ frame: frame - clickAt, fps, config: theme.spring.bouncy });
  const cursorX = interpolate(frame, [12, clickAt], [140, 0], { ...clamp, easing: theme.ease.out });
  const cursorY = interpolate(frame, [12, clickAt], [110, 0], { ...clamp, easing: theme.ease.out });
  const label = "DAY 5 DONE!";
  const n = Math.max(0, Math.min(label.length, Math.floor((frame - typeAt) / 3)));
  const caret = Math.floor(frame / 10) % 2 === 0 || n < label.length;
  const doneP = spring({ frame: frame - (typeAt + label.length * 3 + 4), fps, config: theme.spring.bouncy });
  return (
    <SceneExit dur={dur}>
      <Sfx name="pop" at={3} />
      <Sfx name="click" at={clickAt} />
      <Sfx name="click" at={typeAt} rate={1.12} />
      <Sfx name="chime" at={typeAt + label.length * 3 + 4} rate={1.1} />
      <div style={{ position: "absolute", top: 110, width: "100%", display: "flex", justifyContent: "center" }}>
        <WordReveal text="follow করুন" per={5} justify="center" style={txt(96)} wordStyle={(i) => (i === 0 ? { color: C.primary } : {})} />
      </div>
      <div style={{ position: "absolute", top: 290, width: "100%", display: "flex", justifyContent: "center" }}>
        <Entrance delay={8} config={theme.spring.snappy}>
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "30px 70px", borderRadius: 100, background: clicked ? C.surface : C.primary,
              boxShadow: clicked ? theme.shadow.card : theme.shadow.hero, border: clicked ? `3px solid ${C.primary}` : "3px solid transparent",
              transform: `scale(${clicked ? interpolate(pressP, [0, 1], [0.9, 1]) : 1})`, ...txt(64, theme.weights.hero, clicked ? C.primaryDeep : C.white) }}>
              {clicked ? (
                <svg viewBox="0 0 24 24" width={56} height={56}><path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke={C.primary} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" width={52} height={52}><path d="M12 4 V20 M4 12 H20" stroke={C.white} strokeWidth={3.6} strokeLinecap="round" /></svg>
              )}
              <span>Follow</span>
            </div>
            {frame < clickAt + 14 && (
              <svg viewBox="0 0 24 24" width={74} height={74} style={{ position: "absolute", right: 70 - cursorX * -1, top: 60 + cursorY, filter: `drop-shadow(0 6px 8px ${C.shadow})`, opacity: interpolate(frame, [8, 14, clickAt + 8, clickAt + 14], [0, 1, 1, 0], clamp) }}>
                <path d="M5 3 L19 12 L12 13.5 L9 20 Z" fill={C.text} stroke={C.white} strokeWidth={1.4} strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </Entrance>
      </div>
      <div style={{ position: "absolute", top: 560, width: "100%", display: "flex", justifyContent: "center" }}>
        <Entrance delay={50} config={theme.spring.bouncy} from={24}><Pill tone="accent" size={52}>কমেন্টে লিখুন</Pill></Entrance>
      </div>
      <div style={{ position: "absolute", top: 690, left: 100, right: 100 }}>
        <Entrance delay={54} from={36} config={theme.spring.snappy}>
          <Card style={{ borderRadius: 60, height: 200, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, border: `3px solid ${C.primary}`, position: "relative" }}>
            <div style={{ ...txt(104, theme.weights.hero, C.text), whiteSpace: "pre" }}>{label.slice(0, n)}</div>
            <div style={{ width: 7, height: 100, background: C.primary, opacity: caret ? 1 : 0, marginLeft: 4 }} />
            <div style={{ position: "absolute", right: -26, top: -30, width: 84, height: 84, borderRadius: 84, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${interpolate(doneP, [0, 1], [0, 1])})`, boxShadow: theme.shadow.soft }}>
              <svg viewBox="0 0 24 24" width={48} height={48}><path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke={C.text} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </Card>
        </Entrance>
      </div>
    </SceneExit>
  );
};

/* ───── End card · "দেখা হবে Day 6-তে" ───── */
export const EndScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const R = 190;
  return (
    <SceneExit dur={dur}>
      <Sfx name="pop" at={3} />
      <Sfx name="chime" at={26} />
      <div style={{ position: "absolute", left: 540 - R - 40, top: 60, width: (R + 40) * 2, height: (R + 40) * 2 }}>
        <svg viewBox={`${-R - 40} ${-R - 40} ${(R + 40) * 2} ${(R + 40) * 2}`} width={(R + 40) * 2} height={(R + 40) * 2}>
          {Array.from({ length: 30 }).map((_, i) => {
            const p = spring({ frame: frame - i * 0.6, fps, config: theme.spring.snappy });
            const six = i === 5 ? spring({ frame: frame - 22, fps, config: theme.spring.bouncy }) : 0;
            const lit = i < 5 || (i === 5 && six > 0.5);
            return <rect key={i} x={-7} y={-R} width={14} height={interpolate(p, [0, 1], [0, 42]) + six * 12} rx={7} fill={lit ? C.primary : C.primarySoft} transform={`rotate(${i * 12})`} />;
          })}
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon id="sunrise" size={250} delay={6} />
        </div>
      </div>
      <div style={{ position: "absolute", top: 560, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <WordReveal text="দেখা হবে" delay={6} per={5} justify="center" style={txt(104)} />
        <WordReveal text="Day 6-তে" delay={14} per={5} justify="center" style={txt(148)} wordStyle={() => ({ color: C.primary })} />
        <Entrance delay={26} from={20}><div style={txt(84, theme.weights.strong, C.textDim)}>ইনশাআল্লাহ!</div></Entrance>
      </div>
    </SceneExit>
  );
};
void AbsoluteFill; void toBn;
