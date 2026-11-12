import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { L } from "../design/layout";
import { colors, fonts, springs } from "../design/tokens";
import { enter } from "../lib/anim";
import type { EpisodeContent } from "../types";
import { AnimatedIllustration } from "./AnimatedIllustration";
import { LogoMark } from "./BrandTag";
import { EpisodeProgress } from "./EpisodeProgress";
import { SceneShell } from "./SceneShell";

const Rise: React.FC<{ delay: number; top: number; children: React.ReactNode }> = ({ delay, top, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, delay, springs.smooth);
  return (
    <div style={{ position: "absolute", top, left: 0, width: 1080, display: "flex", justifyContent: "center", opacity: p, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)` }}>{children}</div>
  );
};

/** Practice reminder + CTA: progress reaches 190 / 300, next episode, branding, clean exit. */
export const OutroScene: React.FC<{ content: EpisodeContent }> = ({ content }) => {
  const { progress, totalSentences } = content;
  return (
    <SceneShell>
      <Rise delay={2} top={L.numberRow.top}>
        <div style={{ fontFamily: fonts.latin, fontWeight: 700, fontSize: 60, color: colors.dark, borderBottom: `10px solid ${colors.amber}`, lineHeight: "70px" }}>{content.labels.dailyPractice}</div>
      </Rise>
      <AnimatedIllustration id="outro" />
      <Rise delay={14} top={960}>
        <EpisodeProgress from={progress.from} to={progress.to} total={totalSentences} fromPercent={progress.fromPercent} toPercent={progress.toPercent} startFrame={24} durationFrames={40} />
      </Rise>
      <Rise delay={24} top={1290}>
        <div style={{ fontFamily: fonts.latin, fontWeight: 700, fontSize: 52, color: colors.white, background: colors.primary, padding: "22px 54px", borderRadius: 999, boxShadow: "0 18px 30px -16px rgba(22,163,74,0.7)" }}>
          {content.labels.next} · DAY {content.nextEpisode}
        </div>
      </Rise>
      <Rise delay={32} top={1470}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <LogoMark size={72} />
          <div style={{ fontFamily: fonts.latin, fontWeight: 700, fontSize: 48, letterSpacing: "0.1em", color: colors.dark, textTransform: "uppercase" }}>{content.brand}</div>
        </div>
      </Rise>
    </SceneShell>
  );
};
