import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { BrandChip, Entrance, Pill, clampI } from "../components/fx";
import { ArtCanvas, Pin } from "../components/art";
import { Sentence, f, toBn } from "../data";

const C = theme.colors;

const Waves: React.FC<{ on: boolean; fr: number }> = ({ on, fr }) => (
  <div style={{ display: "flex", gap: 8, alignItems: "center", height: 60 }}>
    {[0, 1, 2, 3, 4].map((i) => (
      <div key={i} style={{ width: 10, borderRadius: 5, background: C.accent, height: on ? 14 + Math.abs(Math.sin(fr / 3 + i * 1.3)) * 42 : 12, opacity: on ? 1 : 0.35 }} />
    ))}
  </div>
);

const ArabicLine: React.FC<{ s: Sentence; lf: number; arF: number; t: number }> = ({ s, lf, arF, t }) => {
  const { fps } = useVideoConfig();
  const tokens = s.ar.split(" ");
  const real = tokens.filter((w) => w !== "/");
  const u = [s.u1, s.u2].find(([a, b]) => t >= a - s.S && t <= b - s.S + 0.05); // t is seconds since scene start
  let activeReal = -1;
  if (u) activeReal = Math.min(real.length - 1, Math.floor(((t - (u[0] - s.S)) / (u[1] - u[0])) * real.length));
  const len = s.ar.length;
  const size = len <= 10 ? 150 : len <= 14 ? 126 : len <= 18 ? 104 : 92;
  let ri = -1;
  return (
    <div dir="rtl" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignContent: "center", columnGap: size * 0.22, rowGap: 6,
      fontFamily: theme.fonts.ar, fontWeight: 700, fontSize: size, lineHeight: 1.5, width: "100%", height: "100%" }}>
      {tokens.map((w, i) => {
        const slash = w === "/";
        if (!slash) ri++;
        const p = spring({ frame: lf - arF - i * 4, fps, config: theme.spring.snappy });
        const active = !slash && ri === activeReal;
        return (
          <span key={i} style={{ display: "inline-block", opacity: p, position: "relative",
            transform: `translateY(${(1 - p) * 34}px) scale(${(0.9 + 0.1 * p) * (active ? 1.07 : 1)})`,
            color: slash ? C.textDim : active ? C.primary : C.text, textShadow: active ? `0 0 40px ${C.glow}` : "none" }}>
            {w}
            {active && <span style={{ position: "absolute", left: 0, right: 0, bottom: size * 0.05, height: 8, borderRadius: 4, background: C.accent }} />}
          </span>
        );
      })}
    </div>
  );
};

export const SentenceScene: React.FC<{ s: Sentence }> = ({ s }) => {
  const lf = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const narrF = f(s.narr - s.S), arF = f(s.arabicIn - s.S), mF = f(s.meaningIn - s.S);
  const t = lf / fps;
  const buildAt = narrF - 12;
  const exitAt = durationInFrames - 9;
  const exit = clampI(lf, [exitAt, durationInFrames - 1], [0, 1], theme.ease.in);

  // number intro overlay
  const numP = spring({ frame: lf - 5, fps, config: theme.spring.bouncy });
  const numOut = clampI(lf, [buildAt, buildAt + 10], [0, 1], theme.ease.in);

  const speaking = [s.u1, s.u2].some(([a, b]) => t >= a - s.S && t <= b - s.S);
  const situOut = clampI(lf, [arF - 6, arF + 2], [0, 1], theme.ease.in);
  const prog = (s.n - 140) / 10;

  return (
    <AbsoluteFill style={{ opacity: 1 - exit * 0.5, transform: `translateY(${-exit * 18}px)` }}>
      {/* top bar */}
      <div style={{ position: "absolute", left: 60, top: 40, right: 60, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <BrandChip />
        <Pill bg={C.white} color={C.primaryDeep} size={28} style={{ border: `3px solid ${C.primary}` }}>Day 15 • বাক্য {toBn(141)}–{toBn(150)}</Pill>
      </div>

      {/* number intro */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: 1 - numOut, transform: `scale(${1 + numOut * 0.12})` }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", width: 440 + i * 230 + Math.sin(lf / 18 + i) * 14, height: 440 + i * 230 + Math.sin(lf / 18 + i) * 14, borderRadius: "50%",
            border: `4px solid ${C.primary}`, opacity: (0.35 - i * 0.1) * numP }} />
        ))}
        <div style={{ textAlign: "center", opacity: numP, transform: `scale(${0.6 + 0.4 * numP}) translateY(${(1 - numP) * 40}px)` }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.textDim, letterSpacing: 5 }}>SENTENCE {s.n}</div>
          <div style={{ fontFamily: theme.fonts.bn, fontWeight: 800, fontSize: 210, color: C.primary, lineHeight: 1.1, textShadow: `0 0 80px ${C.glow}` }}>বাক্য {toBn(s.n)}</div>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 10 }}>
            {Array.from({ length: 10 }).map((_, i) => <div key={i} style={{ width: 30, height: 30, borderRadius: "50%", background: i < s.n - 140 ? C.accent : C.primarySoft, border: `3px solid ${C.primary}` }} />)}
          </div>
        </div>
      </AbsoluteFill>

      {/* art card */}
      <Sequence from={buildAt} layout="none">
        <Entrance delay={0} dx={-80} dy={30} style={{ position: "absolute", left: 60, top: 140 }}>
          <div style={{ width: 960, height: 873, borderRadius: 44, overflow: "hidden", boxShadow: `0 40px 80px -30px ${C.shadow}`, border: `6px solid ${C.white}`, position: "relative" }}>
            <ArtCanvas art={s.art} width={948} />
            <div style={{ position: "absolute", left: 24, bottom: 24 }}>
              <Pill bg={C.ink2} color="#fff" size={36}>
                <svg width={28} height={34} viewBox="0 0 40 50"><path d="M20 48 C4 28 2 22 2 17 A18 18 0 1 1 38 17 C38 22 36 28 20 48Z" fill={C.accent} /><circle cx={20} cy={17} r={7} fill="#fff" /></svg>
                {s.chip}
              </Pill>
            </div>
          </div>
        </Entrance>
      </Sequence>

      {/* content card */}
      <Entrance delay={buildAt + 4} dx={0} dy={60} style={{ position: "absolute", left: 60, top: 1040 }}>
        <div style={{ width: 960, height: 790, borderRadius: 44, background: C.white, boxShadow: `0 40px 80px -30px ${C.shadow}`, padding: 32, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ height: 80, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Pill bg={C.accent} color={C.ink2} size={44}>বাক্য {toBn(s.n)}</Pill>
            <div style={{ display: "flex", gap: 10 }}>
              {Array.from({ length: 10 }).map((_, i) => <div key={i} style={{ width: 22, height: 22, borderRadius: "50%", background: i < s.n - 140 ? C.primary : C.primarySoft, transform: i === s.n - 141 ? `scale(${1.25 + Math.sin(lf / 8) * 0.12})` : "scale(1)" }} />)}
            </div>
          </div>

          {/* slot: situation -> Arabic */}
          <div style={{ height: 290, position: "relative", borderRadius: 30, background: `linear-gradient(180deg, ${C.primarySoft}, #F4FCF9)` }}>
            <div style={{ position: "absolute", inset: 0, padding: "26px 34px", opacity: 1 - situOut, transform: `translateY(${-situOut * 24}px)`, display: "flex", flexDirection: "column", gap: 16 }}>
              <Entrance delay={buildAt + 14 - 0}><Pill bg={C.primary} size={34}>কখন বলবেন?</Pill></Entrance>
              <Entrance delay={buildAt + 20}><div style={{ fontFamily: theme.fonts.bn, fontWeight: 800, fontSize: 52, lineHeight: 1.3, color: C.text }}>{s.situation}</div></Entrance>
            </div>
            {lf >= arF - 2 && (
              <div style={{ position: "absolute", inset: 0 }}>
                <div style={{ position: "absolute", left: 24, bottom: 10 }}><Waves on={speaking} fr={lf} /></div>
                <ArabicLine s={s} lf={lf} arF={arF} t={t} />
              </div>
            )}
          </div>

          {/* pronunciation */}
          <div style={{ height: 150, borderRadius: 28, background: "#F4FCF9", border: `3px solid ${C.primarySoft}`, padding: "16px 28px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 28, color: C.textDim, marginBottom: 4 }}>উচ্চারণ</div>
            <Entrance delay={arF + 12} dy={22}>
              <div style={{ fontFamily: theme.fonts.bn, fontWeight: 800, fontSize: s.pron.length > 24 ? 44 : 54, lineHeight: 1.25, color: C.primaryDeep }}>{s.pron}</div>
            </Entrance>
          </div>

          {/* meaning */}
          <div style={{ height: 150, borderRadius: 28, background: C.accentSoft, border: `3px solid ${C.accent}`, padding: "16px 28px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 28, color: C.textDim, marginBottom: 4 }}>অর্থ</div>
            <Entrance delay={mF} dy={26} cfg="bouncy">
              <div style={{ fontFamily: theme.fonts.bn, fontWeight: 800, fontSize: 54, lineHeight: 1.25, color: C.text }}>{s.meaning}</div>
            </Entrance>
          </div>
        </div>
      </Entrance>

      {/* progress strip */}
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 34, height: 14, borderRadius: 7, background: "rgba(14,159,110,0.18)" }}>
        <div style={{ width: `${(prog - 0.1 + 0.1 * clampI(lf, [0, durationInFrames], [0, 1], theme.ease.inOut)) * 100}%`, height: "100%", borderRadius: 7, background: C.primary }} />
      </div>
    </AbsoluteFill>
  );
};
