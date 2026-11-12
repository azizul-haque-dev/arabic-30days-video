import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { SentenceContent } from "../episodes/types";
import { ease, sceneOpacity, sec } from "../lib/anim";
import { toBengaliDigits } from "../lib/format";
import { computeLearningLayout } from "../layout/learningLayout";
import { theme } from "../theme";
import { ArabicText } from "./ArabicText";
import { LayoutProbe, SafeRect } from "./LayoutProbe";
import { Logo } from "./Logo";
import { MeaningText } from "./MeaningText";
import { PronunciationText } from "./PronunciationText";
import { VectorIllustration } from "./VectorIllustration";

/** Fixed zones of the reusable sentence layout (px on the 1080x1920 canvas). */
export const SENTENCE_ZONES = {
  x: theme.layout.safeX,
  width: theme.canvas.width - 2 * theme.layout.safeX,
  headerTop: theme.layout.headerTop,
  headerHeight: 80,
  pillTop: 236,
  pillHeight: 56,
  artTop: 322,
  learnTop: 1020,
  /** nothing may be drawn below this line: the bottom 330px stay empty for platform UI */
  contentBottom: theme.canvas.height - theme.layout.safeBottom,
} as const;

export interface SentenceSceneProps {
  sentence: SentenceContent;
  dayNumber: number;
  /** all cue times are LOCAL frames (relative to this scene's first frame) */
  cues: {
    durationFrames: number;
    phraseStart: number;
    meaningStart: number;
    unitStarts: number[];
    emphasis: number[];
  };
  safe: SafeRect;
  layoutMode: "throw" | "collect";
}

export const SentenceScene: React.FC<SentenceSceneProps> = ({ sentence, dayNumber, cues, safe, layoutMode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Z = SENTENCE_ZONES;

  const layout = useMemo(
    () =>
      computeLearningLayout(
        { pronunciation: sentence.pronunciation, arabic: sentence.arabic, meaning: sentence.meaning },
        Z.width,
        Z.contentBottom - Z.learnTop,
      ),
    [sentence, Z.width, Z.contentBottom, Z.learnTop],
  );

  const opacity = sceneOpacity(frame, cues.durationFrames, fps, 0);
  const headerT = ease(frame, [sec(0.05, fps), sec(0.55, fps)], [0, 1], theme.easings.out);
  const pillT = ease(frame, [sec(0.2, fps), sec(0.7, fps)], [0, 1], theme.easings.out);

  return (
    <AbsoluteFill data-lroot="true" style={{ opacity }}>
      {/* Top section: logo, Day badge, sentence number */}
      <div
        style={{
          position: "absolute",
          left: Z.x,
          top: Z.headerTop,
          width: Z.width,
          height: Z.headerHeight,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: headerT,
          transform: `translateY(${(1 - headerT) * -16}px)`,
        }}
      >
        <Logo size={Z.headerHeight} id="logo" />
        <div
          data-lbox="day-badge"
          data-lkind="chrome"
          style={{
            height: 64,
            padding: "0 30px",
            borderRadius: 32,
            background: theme.colors.primary,
            color: theme.colors.textOnPrimary,
            fontFamily: theme.fonts.latin,
            fontWeight: 800,
            fontSize: 34,
            lineHeight: "64px",
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
          }}
        >
          Day {dayNumber}
        </div>
      </div>
      <div style={{ position: "absolute", left: Z.x, top: Z.pillTop, width: Z.width, display: "flex", justifyContent: "center", opacity: pillT, transform: `scale(${0.92 + 0.08 * pillT})` }}>
        <div
          data-lbox="sentence-number"
          data-lkind="chrome"
          style={{
            height: Z.pillHeight,
            padding: "0 28px",
            borderRadius: Z.pillHeight / 2,
            background: theme.colors.white,
            border: `3px solid ${theme.colors.primarySoft}`,
            fontFamily: theme.fonts.bengali,
            fontWeight: 600,
            fontSize: 30,
            lineHeight: `${Z.pillHeight - 6}px`,
            color: theme.colors.text,
            whiteSpace: "nowrap",
          }}
        >
          বাক্য <span style={{ color: theme.colors.primary, fontWeight: 700 }}>{toBengaliDigits(sentence.number)}</span>
        </div>
      </div>

      {/* Middle section: reserved illustration region */}
      <div style={{ position: "absolute", left: Z.x, top: Z.artTop }}>
        <VectorIllustration illustration={sentence.illustration} frame={frame} fps={fps} maxWidth={Z.width} maxHeight={Z.learnTop - 24 - Z.artTop} />
      </div>

      {/* Learning section: pronunciation (large) + Arabic (smaller) per unit, then meaning */}
      <div style={{ position: "absolute", left: Z.x, top: Z.learnTop, width: Z.width, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {layout.units.map((u, i) => (
          <div key={i} style={{ marginTop: i === 0 ? 0 : layout.unitGap, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <PronunciationText
              id={`pron-u${i + 1}`}
              lines={u.pronLines}
              fontSize={layout.pronSize}
              lineHeight={layout.pronLineHeight}
              frame={frame}
              fps={fps}
              startFrame={cues.unitStarts[i] ?? cues.phraseStart}
              emphasisFrames={cues.emphasis}
            />
            <div style={{ height: layout.innerGap }} />
            <ArabicText
              id={`arabic-u${i + 1}`}
              lines={u.arabicLines}
              fontSize={layout.arabicSize}
              lineHeight={layout.arabicLineHeight}
              frame={frame}
              fps={fps}
              startFrame={(cues.unitStarts[i] ?? cues.phraseStart) + sec(0.12, fps)}
            />
          </div>
        ))}
        <div style={{ height: layout.meaningGap }} />
        <MeaningText id="meaning" lines={layout.meaningLines} fontSize={layout.meaningSize} lineHeight={layout.meaningLineHeight} frame={frame} fps={fps} startFrame={cues.meaningStart} />
      </div>
      <LayoutProbe label={sentence.id} safe={safe} mode={layoutMode} />
    </AbsoluteFill>
  );
};
