import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Enter, WordReveal } from "../components/Motion";
import { ProgressDots, SoundBars, TopLabel } from "../components/Ui";
import { ART } from "../illustrations/scenes";
import { SentenceData, sec } from "../timeline";
import { theme } from "../theme";

const c = theme.colors;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const pronSize = (t: string) => {
  const n = [...t].length;
  if (t.includes("\n")) return 86;
  return n <= 19 ? theme.type.pronLarge : n <= 24 ? theme.type.pronMid : 86;
};

export const SentenceScene: React.FC<{ s: SentenceData; index: number }> = ({ s, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dA = sec(s.tArabic) - sec(s.tScene);
  const dM = sec(s.tMeaning) - sec(s.tScene);
  const Art = ART[s.art];
  const bars = interpolate(frame, [dA - 4, dA + 6], [1, 0], { ...clamp });
  const float = Math.sin(frame / 34) * 4;
  const badge = spring({ frame: frame - 4, fps, config: theme.spring.bouncy });

  return (
    <>
      <TopLabel delay={3} />

      {/* number + progress */}
      <div style={{ position: "absolute", left: 60, top: 336, width: 196, height: 196, borderRadius: "50%", background: c.accent, zIndex: 3,
        border: `8px solid ${c.card}`, boxShadow: "0 18px 40px -14px rgba(16,35,29,0.45)", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", transform: `scale(${interpolate(badge, [0, 1], [0.4, 1])})`, opacity: Math.min(1, badge * 2) }}>
        <div style={{ fontFamily: theme.fonts.en, fontWeight: 600, fontSize: 20, letterSpacing: "0.18em", color: c.text, marginBottom: -2 }}>SENTENCE</div>
        <div style={{ fontFamily: theme.fonts.en, fontWeight: 800, fontSize: 96, lineHeight: 1.05, color: c.text }}>{s.n}</div>
      </div>
      <Enter delay={8} y={-16} style={{ position: "absolute", left: 290, top: 388 }}>
        <ProgressDots upto={index} />
      </Enter>

      {/* illustration card */}
      <Enter delay={6} y={60} from={0.9} style={{ position: "absolute", left: 80, top: 460, width: 920, height: 560 }}>
        <div style={{ width: 920, height: 560, borderRadius: 52, overflow: "hidden", background: c.card, border: `8px solid ${c.card}`,
          boxShadow: "0 40px 70px -30px rgba(16,35,29,0.35)", transform: `translateY(${float}px)`, boxSizing: "border-box" }}>
          <Art frame={frame} />
        </div>
      </Enter>

      {/* Arabic (smaller) */}
      <div style={{ position: "absolute", top: 1046, left: 0, right: 0, height: 116, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "absolute" }}><SoundBars opacity={bars} /></div>
        <Enter delay={dA - 2} y={30} config={theme.spring.snappy}>
          <div dir="rtl" style={{ fontFamily: theme.fonts.ar, fontWeight: 600, fontSize: theme.type.arabic, lineHeight: 1.5, color: c.text, background: c.card,
            padding: "6px 46px", borderRadius: 999, boxShadow: "0 14px 30px -16px rgba(16,35,29,0.35)", whiteSpace: "nowrap" }}>
            {s.ar}
          </div>
        </Enter>
      </div>

      {/* Bengali pronunciation (hero) */}
      <div style={{ position: "absolute", top: 1194, left: 70, right: 70, height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <WordReveal text={s.pron} delay={dA + 4} per={4} gap={26}
          style={{ fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: pronSize(s.pron), lineHeight: 1.2, color: c.primary, textAlign: "center" }} />
      </div>

      {/* Bengali meaning */}
      <div style={{ position: "absolute", top: 1514, left: 70, right: 70, height: 150, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
        <Enter delay={dM} y={30}>
          <div style={{ fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: theme.type.meaning, lineHeight: 1.3, color: c.text, textAlign: "center" }}>
            <span style={{ display: "inline-block", fontWeight: 700, fontSize: 32, background: c.accent, color: c.text, borderRadius: 999, padding: "2px 22px", marginRight: 16, verticalAlign: "middle", lineHeight: 1.5 }}>অর্থ</span>
            {s.meaning}
          </div>
        </Enter>
      </div>
    </>
  );
};
