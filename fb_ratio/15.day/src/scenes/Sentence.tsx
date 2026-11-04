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

const ArabicLine: React.FC<{ s: Sentence; lf: number; arF: number }> = ({ s, lf, arF }) => {
  const { fps } = useVideoConfig();
  const tokens = s.ar.split(" ");
  const len = s.ar.length;
  // Arabic text made smaller
  const size = len <= 10 ? 74 : len <= 14 ? 64 : len <= 18 ? 56 : 50;
  const p = spring({ frame: lf - arF, fps, config: theme.spring.gentle });

  return (
    <div
      dir="rtl"
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignContent: "center",
        columnGap: 16,
        rowGap: 4,
        fontFamily: theme.fonts.ar,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.45,
        width: "100%",
        height: "100%",
        opacity: p,
        transform: `translateY(${(1 - p) * 16}px)`,
      }}
    >
      {tokens.map((w, i) => (
        <span
          key={i}
          style={{
            color: w === "/" ? C.textDim : C.text,
          }}
        >
          {w}
        </span>
      ))}
    </div>
  );
};

const PronunciationLine: React.FC<{ s: Sentence; lf: number; pronF: number; t: number }> = ({ s, lf, pronF, t }) => {
  const { fps } = useVideoConfig();
  const tokens = s.pron.split(" ");
  const real = tokens.filter((w) => w !== "/");
  const u = [s.u1, s.u2].find(([a, b]) => t >= a - s.S && t <= b - s.S + 0.05);
  let activeReal = -1;
  if (u) {
    activeReal = Math.min(
      real.length - 1,
      Math.floor(((t - (u[0] - s.S)) / (u[1] - u[0])) * real.length)
    );
  }
  const len = s.pron.length;
  // Pronunciation text made bigger and balanced for wrapping
  const size = len > 28 ? 48 : len > 22 ? 54 : 62;
  let ri = -1;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        columnGap: 14,
        rowGap: 6,
        lineHeight: 1.25,
        width: "100%",
      }}
    >
      {tokens.map((w, i) => {
        const slash = w === "/";
        if (!slash) ri++;
        const p = spring({ frame: lf - pronF - i * 3, fps, config: theme.spring.snappy });
        const active = !slash && ri === activeReal;
        return (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              position: "relative",
              opacity: p,
              transform: `translateY(${(1 - p) * 20}px) scale(${active ? 1.1 : 1})`,
              fontFamily: theme.fonts.bn,
              fontWeight: 800,
              fontSize: size,
              color: slash ? C.textDim : active ? C.primaryDeep : C.text,
              backgroundColor: active ? "rgba(14, 159, 110, 0.15)" : "transparent",
              padding: active ? "2px 10px" : "2px 2px",
              borderRadius: 12,
              boxShadow: active ? `0 4px 16px ${C.glow}` : "none",
              transition: "transform 0.12s ease, background-color 0.12s ease",
            }}
          >
            {w}
            {active && (
              <span
                style={{
                  position: "absolute",
                  left: 4,
                  right: 4,
                  bottom: 0,
                  height: 4,
                  borderRadius: 2,
                  background: C.accent,
                }}
              />
            )}
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
      <div style={{ position: "absolute", left: 50, top: 48, right: 50, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <BrandChip />
        <Pill bg={C.white} color={C.primaryDeep} size={30} style={{ border: `3px solid ${C.primary}` }}>Day 15 • বাক্য {toBn(141)}–{toBn(150)}</Pill>
      </div>

      {/* number intro */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: 1 - numOut, transform: `scale(${1 + numOut * 0.12})` }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", width: 380 + i * 160 + Math.sin(lf / 18 + i) * 14, height: 380 + i * 160 + Math.sin(lf / 18 + i) * 14, borderRadius: "50%",
            border: `4px solid ${C.primary}`, opacity: (0.35 - i * 0.1) * numP }} />
        ))}
        <div style={{ textAlign: "center", opacity: numP, transform: `scale(${0.6 + 0.4 * numP}) translateY(${(1 - numP) * 40}px)` }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 52, color: C.textDim, letterSpacing: 6 }}>SENTENCE {s.n}</div>
          <div style={{ fontFamily: theme.fonts.bn, fontWeight: 800, fontSize: 210, color: C.primary, lineHeight: 1.1, textShadow: `0 0 80px ${C.glow}` }}>বাক্য {toBn(s.n)}</div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 14 }}>
            {Array.from({ length: 10 }).map((_, i) => <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: i < s.n - 140 ? C.accent : C.primarySoft, border: `3px solid ${C.primary}` }} />)}
          </div>
        </div>
      </AbsoluteFill>

      {/* art card (top in vertical layout) */}
      <Sequence from={buildAt} layout="none">
        <Entrance delay={0} dy={30} style={{ position: "absolute", left: 50, right: 50, top: 136 }}>
          <div style={{ width: 980, height: 680, borderRadius: 40, overflow: "hidden", boxShadow: `0 30px 60px -20px ${C.shadow}`, border: `5px solid ${C.white}`, position: "relative" }}>
            <ArtCanvas art={s.art} width="100%" height="100%" />
            <div style={{ position: "absolute", left: 24, bottom: 24 }}>
              <Pill bg={C.ink2} color="#fff" size={32}>
                <svg width={24} height={30} viewBox="0 0 40 50"><path d="M20 48 C4 28 2 22 2 17 A18 18 0 1 1 38 17 C38 22 36 28 20 48Z" fill={C.accent} /><circle cx={20} cy={17} r={7} fill="#fff" /></svg>
                {s.chip}
              </Pill>
            </div>
          </div>
        </Entrance>
      </Sequence>

      {/* content card (stacked below art card in vertical layout) */}
      <Entrance delay={buildAt + 4} dy={30} style={{ position: "absolute", left: 50, right: 50, top: 840 }}>
        <div style={{ width: 980, height: 1010, borderRadius: 40, background: C.white, boxShadow: `0 30px 60px -20px ${C.shadow}`, padding: 32, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ height: 72, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Pill bg={C.accent} color={C.ink2} size={42}>বাক্য {toBn(s.n)}</Pill>
            <div style={{ display: "flex", gap: 10 }}>
              {Array.from({ length: 10 }).map((_, i) => <div key={i} style={{ width: 22, height: 22, borderRadius: "50%", background: i < s.n - 140 ? C.primary : C.primarySoft, transform: i === s.n - 141 ? `scale(${1.25 + Math.sin(lf / 8) * 0.12})` : "scale(1)" }} />)}
            </div>
          </div>

          {/* slot: situation -> Arabic (smaller arabic text container) */}
          <div style={{ height: 240, position: "relative", borderRadius: 28, background: `linear-gradient(180deg, ${C.primarySoft}, #F4FCF9)` }}>
            <div style={{ position: "absolute", inset: 0, padding: "20px 28px", opacity: 1 - situOut, transform: `translateY(${-situOut * 24}px)`, display: "flex", flexDirection: "column", gap: 12 }}>
              <Entrance delay={buildAt + 14}><Pill bg={C.primary} size={30}>কখন বলবেন?</Pill></Entrance>
              <Entrance delay={buildAt + 20}><div style={{ fontFamily: theme.fonts.bn, fontWeight: 800, fontSize: 46, lineHeight: 1.3, color: C.text }}>{s.situation}</div></Entrance>
            </div>
            {lf >= arF - 2 && (
              <div style={{ position: "absolute", inset: 0, padding: "12px 24px" }}>
                <div style={{ position: "absolute", left: 24, bottom: 10 }}><Waves on={speaking} fr={lf} /></div>
                <div style={{ position: "absolute", right: 24, top: 12 }}>
                  <Pill bg={C.primarySoft} color={C.primaryDeep} size={26}>আরবি</Pill>
                </div>
                <ArabicLine s={s} lf={lf} arF={arF} />
              </div>
            )}
          </div>

          {/* pronunciation (enlarged container and text with word animation) */}
          <div style={{ height: 310, borderRadius: 28, background: "#F4FCF9", border: `3px solid ${C.primarySoft}`, padding: "20px 28px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 28, color: C.textDim }}>উচ্চারণ</div>
              {speaking && <Pill bg={C.accentSoft} color={C.primaryDeep} size={28}>শুনুন ও বলুন</Pill>}
            </div>
            {lf >= arF - 4 && (
              <PronunciationLine s={s} lf={lf} pronF={arF + 4} t={t} />
            )}
          </div>

          {/* meaning */}
          <div style={{ height: 220, borderRadius: 28, background: C.accentSoft, border: `3px solid ${C.accent}`, padding: "18px 28px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 28, color: C.textDim, marginBottom: 6 }}>অর্থ</div>
            <Entrance delay={mF} dy={22} cfg="bouncy">
              <div style={{ fontFamily: theme.fonts.bn, fontWeight: 800, fontSize: 52, lineHeight: 1.3, color: C.text }}>{s.meaning}</div>
            </Entrance>
          </div>
        </div>
      </Entrance>

      {/* progress strip */}
      <div style={{ position: "absolute", left: 50, right: 50, bottom: 28, height: 12, borderRadius: 6, background: "rgba(14,159,110,0.18)" }}>
        <div style={{ width: `${(prog - 0.1 + 0.1 * clampI(lf, [0, durationInFrames], [0, 1], theme.ease.inOut)) * 100}%`, height: "100%", borderRadius: 6, background: C.primary }} />
      </div>
    </AbsoluteFill>
  );
};
