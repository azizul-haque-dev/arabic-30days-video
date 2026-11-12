import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { EpisodeConfig } from "../episodes/types";
import { ease, idle, sec } from "../lib/anim";
import type { Timeline } from "../timing/types";
import { theme } from "../theme";
import { FitLine } from "./FitLine";
import { BookmarkIcon, PlusIcon, RepeatIcon } from "./Icons";
import { LayoutProbe, SafeRect } from "./LayoutProbe";
import { Logo } from "./Logo";
import { panelState } from "./panel";
import { ProgressIndicator } from "./ProgressIndicator";

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

const IconRow: React.FC<{ icon: React.ReactNode; id: string; text: string; color: string; opacity: number; shift: number }> = ({ icon, id, text, color, opacity, shift }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 36, opacity, transform: `translateY(${shift}px)` }}>
    {icon}
    <FitLine id={id} text={text} maxWidth={W - 190 - 36} maxFontSize={78} fontFamily={theme.fonts.bengali} fontWeight={700} color={color} />
  </div>
);

export const EpisodeOutro: React.FC<{
  config: EpisodeConfig;
  timeline: Timeline;
  /** absolute frame at which this outro scene starts */
  sceneStart: number;
  safe: SafeRect;
  layoutMode: "throw" | "collect";
}> = ({ config, timeline, sceneStart, safe, layoutMode }) => {
  const frame = useCurrentFrame(); // local to the outro Sequence
  const { fps } = useVideoConfig();
  const b = (id: string) => {
    const x = timeline.beats.find((y) => y.id === id)!;
    return { s: x.startFrame - sceneStart, e: x.endFrame - sceneStart };
  };
  const o1 = b("outro-1");
  const o2 = b("outro-2");
  const o3 = b("outro-3");
  const o4 = b("outro-4");
  const o5 = b("outro-5");

  const p1 = panelState(frame, o1.s, o1.e, fps);
  const p2 = panelState(frame, o2.s, o2.e, fps);
  const p3 = panelState(frame, o3.s, o3.e, fps);
  const p4 = panelState(frame, o4.s, o4.e, fps);
  // final panel: smooth fade-out over the last second (to the clean brand background)
  const p5 = panelState(frame, o5.s, o5.e, fps, { exitSec: 1.0 });

  const iconPop = (delay: number, st: number) => ease(frame, [st + sec(delay, fps), st + sec(delay + 0.5, fps)], [0, 1], theme.easings.out);

  return (
    <AbsoluteFill data-lroot="true">
      {p1 ? (
        <>
          <TopLogo opacity={p1.opacity} />
          <Column top={560} gap={36} opacity={p1.opacity}>
            <FitLine id="out-caption" text="মোট শেখা বাক্য" maxWidth={W} maxFontSize={64} fontFamily={theme.fonts.bengali} fontWeight={600} color={theme.colors.textSecondary} />
            <ProgressIndicator
              idPrefix="outro-progress"
              frame={frame}
              fps={fps}
              startFrame={o1.s + sec(0.35, fps)}
              durationSec={Math.min(2.2, Math.max(0.8, (o1.e - o1.s) / fps - 0.9))}
              fromCount={config.previousCompleted}
              toCount={config.currentCompleted}
              total={config.totalSeriesSentences}
              baseCount={config.previousCompleted}
              width={W}
            />
          </Column>
        </>
      ) : null}

      {p2 ? (
        <>
          <TopLogo opacity={p2.opacity} />
          <Column top={640} gap={90} opacity={p2.opacity}>
            <IconRow icon={<BookmarkIcon size={190} id="save-icon" pop={iconPop(0.1, o2.s)} />} id="save-text" text="ভিডিওটি সেভ করুন" color={theme.colors.text} opacity={iconPop(0.1, o2.s)} shift={(1 - iconPop(0.1, o2.s)) * 20} />
            <IconRow icon={<RepeatIcon size={190} id="repeat-icon" pop={iconPop(0.5, o2.s)} angle={ease(frame, [o2.s + sec(0.5, fps), o2.e], [0, 360], theme.easings.inOut)} />} id="repeat-text" text="বারবার প্র্যাকটিস করুন" color={theme.colors.primaryDeep} opacity={iconPop(0.5, o2.s)} shift={(1 - iconPop(0.5, o2.s)) * 20} />
          </Column>
        </>
      ) : null}

      {p3 ? (
        <Column top={520} gap={70} opacity={p3.opacity}>
          <div style={{ transform: `scale(${0.85 + 0.15 * p3.enter})` }}>
            <Logo size={190} id="cta-logo" />
          </div>
          <div
            data-lbox="follow-cta"
            data-lkind="chrome"
            style={{ height: 150, padding: "0 70px", borderRadius: 75, background: theme.colors.primary, color: theme.colors.textOnPrimary, display: "flex", alignItems: "center", gap: 28, boxShadow: `0 18px 40px ${theme.colors.shadow}`, transform: `scale(${1 + 0.03 * idle(frame, fps, 1.4)})` }}
          >
            <PlusIcon size={54} />
            <span style={{ fontFamily: theme.fonts.bengali, fontWeight: 700, fontSize: 80, lineHeight: "150px", whiteSpace: "nowrap" }}>ফলো করুন</span>
          </div>
          <FitLine id="cta-sub" text="৩০ দিনের Survival Arabic সিরিজ" maxWidth={W} maxFontSize={52} fontFamily={theme.fonts.bengali} fontWeight={600} color={theme.colors.textSecondary} />
        </Column>
      ) : null}

      {p4 ? (
        <>
          <TopLogo opacity={p4.opacity} />
          <Column top={470} gap={20} opacity={p4.opacity}>
            <div
              data-lbox="tomorrow-pill"
              data-lkind="chrome"
              style={{ height: 88, padding: "0 50px", borderRadius: 44, background: theme.colors.accent, color: theme.colors.text, fontFamily: theme.fonts.bengali, fontWeight: 700, fontSize: 52, lineHeight: "88px", whiteSpace: "nowrap", transform: `scale(${0.9 + 0.1 * p4.enter})` }}
            >
              আগামীকাল
            </div>
            <FitLine id="next-day-label" text="DAY" maxWidth={W} maxFontSize={110} fontFamily={theme.fonts.latin} fontWeight={800} color={theme.colors.textSecondary} letterSpacing="22px" lineHeightRatio={1.15} />
            <FitLine id="next-day-number" text={String(config.nextDayNumber)} maxWidth={W} maxFontSize={440} fontFamily={theme.fonts.latin} fontWeight={800} color={theme.colors.primary} lineHeightRatio={1.1} />
            <FitLine id="next-series" text={config.seriesTitle} maxWidth={W} maxFontSize={54} fontFamily={theme.fonts.latin} fontWeight={600} color={theme.colors.textSecondary} />
          </Column>
        </>
      ) : null}

      {p5 ? (
        <Column top={640} gap={60} opacity={p5.opacity}>
          <div style={{ transform: `scale(${0.9 + 0.1 * p5.enter})` }}>
            <Logo size={200} id="end-logo" />
          </div>
          <FitLine id="end-text" text="আল্লাহ হাফেজ" maxWidth={W} maxFontSize={120} fontFamily={theme.fonts.bengali} fontWeight={700} color={theme.colors.primaryDeep} />
        </Column>
      ) : null}
      <LayoutProbe label="outro" safe={safe} mode={layoutMode} />
    </AbsoluteFill>
  );
};
