import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { BrandHeader, font } from "../components/Brand";
import { illustrations } from "../components/Illustrations";
import { WordReveal } from "../components/Text";
import { useBreathe, useEnter } from "../lib/anim";
import type { EpisodeConfig, Sentence } from "../types";
import { theme } from "../theme";
import { SceneShell } from "./SceneShell";

const c = theme.colors;

const pronSize = (t: string): number => (t.length <= 22 ? 84 : t.length <= 34 ? 70 : 62);
const meaningSize = (t: string): number => (t.length <= 30 ? 60 : t.length <= 45 ? 54 : 46);

const Dots: React.FC<{ index: number; count: number }> = ({ index, count }) => (
  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
    {Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        style={{
          width: i === index ? 40 : 18,
          height: 18,
          borderRadius: 9,
          background: i === index ? c.accent : i < index ? c.primary : "transparent",
          border: i > index ? `3px solid ${c.line}` : "none",
          boxSizing: "border-box",
        }}
      />
    ))}
  </div>
);

const Ghost: React.FC<{ top: number; height: number }> = ({ top, height }) => (
  <div
    style={{
      position: "absolute",
      left: 80,
      top,
      width: 920,
      height,
      borderRadius: theme.radius.card,
      border: `4px dashed ${c.line}`,
      boxSizing: "border-box",
      opacity: 0.8,
    }}
  />
);

const Speaker: React.FC<{ n: number }> = ({ n }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.2)", borderRadius: 999, padding: "8px 22px", ...font, color: c.white, fontSize: 32, fontWeight: 700 }}>
    <svg width={34} height={34} viewBox="0 0 34 34">
      <path d="M4 12 h7 l9 -7 v24 l-9 -7 h-7z" fill={c.white} />
      <path d="M24 11 q6 6 0 12" fill="none" stroke={c.white} strokeWidth={3.5} strokeLinecap="round" />
      {n === 2 ? <path d="M28 6 q10 11 0 22" fill="none" stroke={c.white} strokeWidth={3.5} strokeLinecap="round" /> : null}
    </svg>
    {n}/2
  </div>
);

export const SentenceScene: React.FC<{ ep: EpisodeConfig; sentence: Sentence; index: number; exitFrames: number }> = ({
  ep,
  sentence: s,
  index,
  exitFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = (sec: number) => Math.round((sec - s.startSec) * fps);
  const pronAt = rel(s.pronStartSec) - 3;
  const repeatAt = rel(s.repeatSec);
  const meaningAt = rel(s.meaningStartSec) - 3;

  const numP = useEnter(0, theme.spring.bouncy);
  const dotsP = useEnter(5, theme.spring.snappy);
  const illP = useEnter(9, theme.spring.smooth);
  const pronP = useEnter(pronAt, theme.spring.smooth);
  const meanP = useEnter(meaningAt, theme.spring.smooth);
  const badge = useEnter(repeatAt, theme.spring.bouncy);
  const breathe = useBreathe(7, 3.4);
  const drift = interpolate(frame, [0, Math.max(60, rel(s.endSec))], [1, 1.05], { extrapolateRight: "clamp", easing: theme.ease.inOut });
  const pulse = interpolate(frame, [repeatAt, repeatAt + 8, repeatAt + 20], [1, 1.035, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const Illustration = illustrations[s.illustration];
  if (!Illustration) throw new Error(`Unknown illustration '${s.illustration}' for sentence ${s.number}`);

  return (
    <SceneShell exitFrames={exitFrames}>
      <BrandHeader brand={ep.brandName} right={`Day ${ep.episodeNumber}`} />

      <div style={{ position: "absolute", left: 80, top: 262, width: 920, display: "flex", justifyContent: "space-between", alignItems: "center", ...font }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 22, opacity: numP, transform: `translateY(${(1 - numP) * 40}px) scale(${0.7 + 0.3 * numP})`, transformOrigin: "left center" }}>
          <span style={{ fontSize: 38, fontWeight: 600, color: c.textDim }}>Sentence</span>
          <span style={{ fontSize: 150, fontWeight: 700, color: c.primary, lineHeight: 1.05, letterSpacing: -4 }}>{s.number}</span>
        </div>
        <div style={{ opacity: dotsP, transform: `translateX(${(1 - dotsP) * 40}px)` }}>
          <Dots index={index} count={ep.sentences.length} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 80,
          top: 470,
          width: 920,
          height: 520,
          borderRadius: theme.radius.card,
          background: c.white,
          boxShadow: theme.shadow.card,
          overflow: "hidden",
          opacity: illP,
          transform: `translateY(${(1 - illP) * 60 + breathe}px) scale(${0.92 + 0.08 * illP})`,
        }}
      >
        <div style={{ position: "absolute", inset: 0, padding: "10px 20px", transform: `scale(${drift})` }}>
          <Illustration />
        </div>
      </div>

      <Ghost top={1020} height={290} />
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 1020,
          width: 920,
          height: 290,
          boxSizing: "border-box",
          borderRadius: theme.radius.card,
          background: `linear-gradient(135deg, ${c.primary}, ${c.primaryDark})`,
          boxShadow: theme.shadow.glow,
          opacity: pronP,
          transform: `translateY(${(1 - pronP) * 50}px) scale(${(0.94 + 0.06 * pronP) * pulse})`,
          padding: "70px 40px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "absolute", left: 36, top: 24, ...font, fontSize: 30, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>উচ্চারণ</div>
        <div style={{ position: "absolute", right: 30, top: 18, transform: `scale(${badge > 0 ? 0.8 + 0.2 * badge : 1})` }}>
          <Speaker n={frame >= repeatAt ? 2 : 1} />
        </div>
        {pronP > 0 ? <WordReveal text={s.pronunciation} size={pronSize(s.pronunciation)} color={c.white} delay={Math.max(0, pronAt)} stagger={3} /> : null}
      </div>

      <Ghost top={1340} height={280} />
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 1340,
          width: 920,
          height: 280,
          boxSizing: "border-box",
          borderRadius: theme.radius.card,
          background: c.white,
          boxShadow: theme.shadow.card,
          opacity: meanP,
          transform: `translateY(${(1 - meanP) * 50}px) scale(${0.94 + 0.06 * meanP})`,
          padding: "66px 44px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "absolute", left: 36, top: 22, ...font, fontSize: 30, fontWeight: 700, color: theme.colors.accentDark, background: c.accentSoft, padding: "4px 22px", borderRadius: 999 }}>অর্থ</div>
        {meanP > 0 ? <WordReveal text={s.meaning} size={meaningSize(s.meaning)} weight={600} delay={Math.max(0, meaningAt)} stagger={2} /> : null}
      </div>
    </SceneShell>
  );
};
