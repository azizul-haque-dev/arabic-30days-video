import React from "react";
import { interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { Phrase, ROW_H, ROW_GAP, ROW_LEFT, ROW_TOP, ROW_W, msToFrame } from "../data";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const PhraseRow: React.FC<{ phrase: Phrase; index: number }> = ({ phrase, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const top = ROW_TOP + index * (ROW_H + ROW_GAP);
  const activeStartF = msToFrame(phrase.startMs) - 3;
  const activeEndF = msToFrame(phrase.endMs) + Math.round(0.35 * fps);

  // ── Card entrance: ALL cards appear at the very start, staggered ──
  const enterDelay = 6 + index * 5; // stagger each card by 5 frames
  const cardIn = spring({ frame: frame - enterDelay, fps, config: theme.spring.smooth });
  const textIn = spring({ frame: frame - enterDelay - 2, fps, config: theme.spring.snappy });

  // ── Active state: when voice is speaking THIS phrase ──
  const actIn = spring({ frame: frame - activeStartF, fps, config: theme.spring.bouncy });
  const actOut = interpolate(frame, [activeEndF, activeEndF + 10], [0, 1], { easing: theme.ease.in, ...clamp });
  const act = Math.max(0, Math.min(1, actIn * (1 - actOut)));
  const actScale = Math.max(0, actIn * (1 - actOut));

  // idle breathing after card fully in
  const float = cardIn > 0.99 ? Math.sin(frame / 30 + index * 0.9) * 2 : 0;

  // ── Colors: default (muted) vs active (highlighted) ──
  const cardBg = interpolateColors(act, [0, 1], [theme.colors.card, "#E6FFF5"]);
  const border = interpolateColors(act, [0, 1], [theme.colors.line, theme.colors.primary]);
  const arColor = interpolateColors(act, [0, 1], [theme.colors.text, theme.colors.primary]);
  const badgeBg = interpolateColors(act, [0, 1], ["rgba(16,35,29,0.06)", theme.colors.accent]);
  const badgeTextColor = interpolateColors(act, [0, 1], [theme.colors.textDim, "#FFFFFF"]);

  return (
    <div style={{ position: "absolute", left: ROW_LEFT, top, width: ROW_W, height: ROW_H, borderRadius: 36,
      boxSizing: "border-box", background: cardBg, border: `3px solid ${border}`,
      boxShadow: `0 18px 38px -20px rgba(16,35,29,0.15), 0 0 ${56 * act}px ${theme.colors.glow}`,
      opacity: cardIn, display: "flex", alignItems: "center", padding: "0 30px", gap: 24,
      transform: `translateY(${interpolate(cardIn, [0, 1], [40, 0]) + float}px) scale(${interpolate(cardIn, [0, 1], [0.94, 1]) * (1 + 0.03 * actScale)})` }}>

      {/* badge: number → sound bars while spoken */}
      <div style={{ position: "relative", width: 60, height: 60, borderRadius: 30, background: badgeBg, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        transform: `scale(${1 + 0.08 * actScale})`,
        transition: "transform 0.15s" }}>
        <span style={{ position: "absolute", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 28,
          color: badgeTextColor, opacity: 1 - act }}>{phrase.n}</span>
        <div style={{ position: "absolute", display: "flex", gap: 4, alignItems: "center", opacity: act }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 6, borderRadius: 3, background: "#FFFFFF",
              height: 12 + (Math.sin(frame / 2.6 + i * 1.9) * 0.5 + 0.5) * 20 }} />
          ))}
        </div>
      </div>

      {/* Arabic + pronunciation */}
      <div style={{ width: 420, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* Pronunciation in Bengali (Bigger than Arabic) */}
        <div style={{ fontFamily: theme.fonts.bengali, fontWeight: 800, fontSize: 52, lineHeight: 1.15,
          color: theme.colors.text, opacity: textIn,
          transform: `translateY(${interpolate(textIn, [0, 1], [10, 0])}px)` }}>{phrase.bn}</div>
        {/* Arabic Text (Subtle & clean below it) */}
        <div dir="rtl" style={{ textAlign: "left", fontFamily: theme.fonts.arabic, fontWeight: 700, fontSize: 36,
          lineHeight: 1.25, color: arColor, opacity: textIn, marginTop: 4,
          transform: `translateY(${interpolate(textIn, [0, 1], [16, 0])}px)`,
          transformOrigin: "left center" }}>{phrase.ar}</div>
      </div>

      <div style={{ width: 2, height: 84, background: theme.colors.line, flexShrink: 0, opacity: textIn }} />

      {/* meaning */}
      <div style={{ flex: 1, fontFamily: theme.fonts.bengali, fontWeight: 700, fontSize: 32, lineHeight: 1.3,
        color: theme.colors.text, opacity: textIn,
        transform: `translateX(${interpolate(textIn, [0, 1], [20, 0])}px)` }}>{phrase.meaning}</div>
    </div>
  );
};
