import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { EpisodeConfig } from "../episodes/types";
import { ease, idle, sec } from "../lib/anim";
import type { Timeline } from "../timing/types";
import { theme } from "../theme";
import { EpisodeThumbnail } from "./EpisodeThumbnail";
import { FitLine } from "./FitLine";
import { ArrowIcon, WaveHand } from "./Icons";
import { LayoutProbe, SafeRect } from "./LayoutProbe";
import { Logo } from "./Logo";
import { panelState } from "./panel";
import { ProgressIndicator } from "./ProgressIndicator";
import { VectorIllustration } from "./VectorIllustration";

const X = theme.layout.safeX;
const W = theme.canvas.width - 2 * theme.layout.safeX;

const Column: React.FC<{ top: number; gap?: number; children: React.ReactNode; opacity: number }> = ({ top, gap = 0, children, opacity }) => (
  <div style={{ position: "absolute", left: X, top, width: W, display: "flex", flexDirection: "column", alignItems: "center", gap, opacity }}>{children}</div>
);

const TopLogo: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div style={{ position: "absolute", left: X, top: theme.layout.headerTop, width: W, display: "flex", justifyContent: "center", opacity }}>
    <Logo size={80} id="logo" />
  </div>
);

export const EpisodeIntro: React.FC<{
  config: EpisodeConfig;
  timeline: Timeline;
  safe: SafeRect;
  layoutMode: "throw" | "collect";
}> = ({ config, timeline, safe, layoutMode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = (id: string) => timeline.beats.find((x) => x.id === id)!;
  const i1 = b("intro-1");
  const i2 = b("intro-2");
  const i3 = b("intro-3");
  const i4 = b("intro-4");
  const i5 = b("intro-5");
  const i6 = b("intro-6");
  const s1 = timeline.beats.find((x) => x.id === `${config.sentences[0].id}-lead`)!;
  const T = timeline.thumbnailEndFrame;

  // 0 -> thumbnail (exit finishes exactly at T), then greeting/welcome share one continuous logo panel.
  const thumb = panelState(frame, 0, T, fps, { enterSec: 0.01, exitSec: 0.3 });
  const greetStart = Math.max(i1.startFrame, T);
  const welcomePanel = panelState(frame, greetStart, i3.startFrame, fps, { enterSec: 0.5, exitSec: 0.3 });
  const greetOpacity = (() => {
    if (!welcomePanel) return 0;
    const end = Math.max(greetStart + 2, i2.startFrame);
    return ease(frame, [end - sec(0.25, fps), end], [1, 0], theme.easings.in);
  })();
  const welcomeOpacity = (() => {
    if (!welcomePanel) return 0;
    const s = Math.max(greetStart + 2, i2.startFrame) + sec(0.05, fps);
    return ease(frame, [s, s + sec(0.5, fps)], [0, 1], theme.easings.out);
  })();
  const dayP = panelState(frame, i3.startFrame, i4.startFrame, fps);
  const progP = panelState(frame, i4.startFrame, i5.startFrame, fps);
  const restP = panelState(frame, i5.startFrame, i6.startFrame, fps);
  const goP = panelState(frame, i6.startFrame, s1.startFrame, fps, { exitSec: 0.1 });

  return (
    <AbsoluteFill data-lroot="true">
      {thumb ? <EpisodeThumbnail config={config} frame={frame} fps={fps} opacity={thumb.opacity} safe={safe} layoutMode={layoutMode} probe={false} /> : null}

      {welcomePanel ? (
        <>
          <Column top={430} gap={70} opacity={welcomePanel.opacity}>
            <div style={{ transform: `scale(${0.8 + 0.2 * welcomePanel.enter})` }}>
              <Logo size={200} id="intro-logo" />
            </div>
            <div style={{ position: "relative", width: W, height: 420, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: W, display: "flex", flexDirection: "column", alignItems: "center", gap: 30, opacity: greetOpacity }}>
                <WaveHand size={170} angle={idle(frame, fps, 1.1) * 14} />
                <FitLine id="greet" text="আসসালামু আলাইকুম" maxWidth={W} maxFontSize={112} fontFamily={theme.fonts.bengali} fontWeight={700} color={theme.colors.text} />
              </div>
              <div style={{ position: "absolute", top: 40, left: 0, width: W, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: welcomeOpacity }}>
                <FitLine id="welcome-1" text="স্বাগতম" maxWidth={W} maxFontSize={150} fontFamily={theme.fonts.bengali} fontWeight={700} color={theme.colors.primary} />
                <FitLine id="welcome-2" text="Arabic Master পেজের পক্ষ থেকে" maxWidth={W} maxFontSize={54} fontFamily={theme.fonts.bengali} fontWeight={600} color={theme.colors.text} />
              </div>
            </div>
          </Column>
        </>
      ) : null}

      {dayP ? (
        <>
          <TopLogo opacity={dayP.opacity} />
          <Column top={400} gap={26} opacity={dayP.opacity}>
            <div
              data-lbox="series-badge"
              data-lkind="chrome"
              style={{ height: 76, padding: "0 40px", borderRadius: 38, background: theme.colors.accent, color: theme.colors.text, fontFamily: theme.fonts.latin, fontWeight: 800, fontSize: 40, lineHeight: "76px", whiteSpace: "nowrap", transform: `scale(${0.9 + 0.1 * dayP.enter})` }}
            >
              {config.seriesTitle}
            </div>
            <FitLine id="day-label" text="DAY" maxWidth={W} maxFontSize={110} fontFamily={theme.fonts.latin} fontWeight={800} color={theme.colors.textSecondary} letterSpacing="22px" lineHeightRatio={1.15} />
            <DayNumber target={config.dayNumber} frame={frame - i3.startFrame} fps={fps} />
          </Column>
        </>
      ) : null}

      {progP ? (
        <>
          <TopLogo opacity={progP.opacity} />
          <Column top={560} gap={36} opacity={progP.opacity}>
            <FitLine id="prog-caption" text="এ পর্যন্ত শেখা বাক্য" maxWidth={W} maxFontSize={64} fontFamily={theme.fonts.bengali} fontWeight={600} color={theme.colors.textSecondary} />
            <ProgressIndicator idPrefix="intro-progress" frame={frame} fps={fps} startFrame={i4.startFrame + sec(0.35, fps)} durationSec={Math.min(2.2, Math.max(0.8, (i5.startFrame - i4.startFrame) / fps - 0.9))} fromCount={0} toCount={config.previousCompleted} total={config.totalSeriesSentences} width={W} />
          </Column>
        </>
      ) : null}

      {restP ? (
        <>
          <TopLogo opacity={restP.opacity} />
          <div style={{ position: "absolute", left: X, top: 322, opacity: restP.opacity }}>
            <VectorIllustration illustration="restaurant" frame={frame - i5.startFrame} fps={fps} maxWidth={W} maxHeight={674} />
          </div>
          <Column top={1030} gap={6} opacity={restP.opacity}>
            <FitLine id="range" text={`${config.sentenceRange[0]}–${config.sentenceRange[1]}`} maxWidth={W} maxFontSize={200} fontFamily={theme.fonts.latin} fontWeight={800} color={theme.colors.primary} lineHeightRatio={1.1} />
            <FitLine id="range-topic" text={config.topicBn} maxWidth={W} maxFontSize={60} fontFamily={theme.fonts.bengali} fontWeight={700} color={theme.colors.text} />
          </Column>
        </>
      ) : null}

      {goP ? (
        <Column top={700} gap={40} opacity={goP.opacity}>
          <FitLine id="lets-start" text="চলুন, শুরু করি।" maxWidth={W} maxFontSize={130} fontFamily={theme.fonts.bengali} fontWeight={700} color={theme.colors.text} />
          <ArrowIcon size={130} id="go-arrow" shift={idle(frame, fps, 0.9) * 14} />
        </Column>
      ) : null}
      <LayoutProbe label="intro" safe={safe} mode={layoutMode} />
    </AbsoluteFill>
  );
};

const DayNumber: React.FC<{ target: number; frame: number; fps: number }> = ({ target, frame, fps }) => {
  const t = ease(frame, [sec(0.2, fps), sec(1.5, fps)], [0, 1], theme.easings.out);
  const n = Math.max(1, Math.round(target * t));
  const pop = 1 + 0.04 * Math.max(0, 1 - Math.abs(ease(frame, [sec(1.4, fps), sec(2.0, fps)], [0, 1], theme.easings.inOut) - 0.5) * 2);
  return (
    <div
      data-lbox="day-number"
      data-lkind="text"
      style={{ fontFamily: theme.fonts.latin, fontWeight: 800, fontSize: 440, lineHeight: "480px", height: 480, color: theme.colors.primary, letterSpacing: -8, transform: `scale(${pop})`, whiteSpace: "nowrap" }}
    >
      {n}
    </div>
  );
};

