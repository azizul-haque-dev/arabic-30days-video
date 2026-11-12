import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../design/tokens";
import { enter } from "../lib/anim";
import type { EpisodeContent } from "../types";
import { LogoMark } from "./BrandTag";
import { EpisodeProgress } from "./EpisodeProgress";
import { SceneShell } from "./SceneShell";

const Rise: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, delay, springs.smooth);
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, display: "flex", justifyContent: "center", opacity: p, transform: `translateY(${interpolate(p, [0, 1], [44, 0])}px)`, ...style }}>
      {children}
    </div>
  );
};

/** Episode introduction: branding, series, DAY 19, progress 180 -> 190, topic. */
export const IntroScene: React.FC<{ content: EpisodeContent }> = ({ content }) => {
  const { progress, totalSentences } = content;
  return (
    <SceneShell>
      <Rise delay={2} style={{ top: 270 }}>
        <LogoMark size={150} />
      </Rise>
      <Rise delay={8} style={{ top: 450 }}>
        <div style={{ fontFamily: fonts.latin, fontWeight: 700, fontSize: 74, letterSpacing: "0.1em", color: colors.dark, textTransform: "uppercase" }}>{content.brand}</div>
      </Rise>
      <Rise delay={14} style={{ top: 570 }}>
        <div style={{ fontFamily: fonts.latin, fontWeight: 600, fontSize: 40, color: colors.dark, background: colors.soft, border: `2px solid ${colors.primary}55`, padding: "20px 44px", borderRadius: 999 }}>
          {content.series}
        </div>
      </Rise>
      <Rise delay={20} style={{ top: 720 }}>
        <div style={{ fontFamily: fonts.latin, fontWeight: 700, fontSize: 250, lineHeight: "270px", color: colors.primary, letterSpacing: "-0.02em" }}>
          DAY <span style={{ color: colors.dark }}>{content.episode}</span>
        </div>
      </Rise>
      <Rise delay={28} style={{ top: 1060 }}>
        <EpisodeProgress from={progress.from} to={progress.to} total={totalSentences} fromPercent={progress.fromPercent} toPercent={progress.toPercent} startFrame={44} />
      </Rise>
      <Rise delay={36} style={{ top: 1430 }}>
        <div style={{ fontFamily: fonts.latin, fontWeight: 700, fontSize: 54, color: colors.white, background: colors.primary, padding: "22px 54px", borderRadius: 999, boxShadow: "0 18px 30px -16px rgba(22,163,74,0.7)" }}>
          {content.topicEn}
        </div>
      </Rise>
    </SceneShell>
  );
};
