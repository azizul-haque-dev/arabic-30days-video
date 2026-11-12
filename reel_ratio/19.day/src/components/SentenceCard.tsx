import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { L } from "../design/layout";
import { colors, fonts, radius, shadow, springs } from "../design/tokens";
import { enter } from "../lib/anim";
import { fitText, type FitResult } from "../lib/fit";
import type { SentenceContent } from "../types";
import { ArabicText } from "./ArabicText";
import { MeaningText } from "./MeaningText";
import { PronunciationText, type LocalSpan } from "./PronunciationText";

const INNER_W = L.contentWidth - L.cardPadX * 2; // 824

export interface SentenceFits {
  pron: FitResult;
  arabic: FitResult;
  meaning: FitResult;
}

/** Measures all three lines. Hierarchy is enforced here: Arabic is always <= 72% of the pronunciation size. */
export function fitSentence(s: SentenceContent): SentenceFits {
  const pron = fitText({
    text: s.pronunciation,
    fontFamily: fonts.bengali,
    fontWeight: 700,
    maxWidth: INNER_W,
    maxFont: 96,
    minFont: 64,
    singleLineMinFont: 80,
    twoLineMaxFont: 86,
    maxLines: 2,
    lineHeight: 1.25,
  });
  const arabic = fitText({
    text: s.arabic,
    fontFamily: fonts.arabic,
    fontWeight: 500,
    maxWidth: INNER_W,
    maxFont: Math.min(66, Math.floor(pron.fontSize * 0.72)),
    minFont: 36,
    maxLines: 2,
    lineHeight: 1.4,
  });
  const meaning = fitText({
    text: s.meaning,
    fontFamily: fonts.bengali,
    fontWeight: 600,
    maxWidth: INNER_W,
    maxFont: 48,
    minFont: 34,
    maxLines: 2,
    lineHeight: 1.3,
  });

  const checks: [string, number, number][] = [
    ["pronunciation", pron.blockHeight + 18, L.slots.pron],
    ["arabic", arabic.blockHeight, L.slots.arabic],
    ["meaning", meaning.blockHeight, L.slots.meaning],
  ];
  for (const [name, h, slot] of checks) {
    if (h > slot) throw new Error(`Sentence ${s.number}: ${name} block (${h}px) exceeds its slot (${slot}px).`);
  }
  if (arabic.fontSize >= pron.fontSize || meaning.fontSize >= pron.fontSize) {
    throw new Error(`Sentence ${s.number}: hierarchy violated (pronunciation must be the largest text).`);
  }
  return { pron, arabic, meaning };
}

export const SentenceCard: React.FC<{
  sentence: SentenceContent;
  pronSpans: LocalSpan[];
  meaningSpans: LocalSpan[];
}> = ({ sentence, pronSpans, meaningSpans }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fits = React.useMemo(() => fitSentence(sentence), [sentence]);
  const p = enter(frame, fps, 0, springs.smooth);
  const arabicAppear = (pronSpans[0]?.startF ?? 0) + 6;

  return (
    <div
      style={{
        position: "absolute",
        left: L.side,
        top: L.card.top,
        width: L.contentWidth,
        height: L.card.height,
        boxSizing: "border-box",
        padding: `${L.cardPadY}px ${L.cardPadX}px`,
        borderRadius: radius.card,
        background: colors.white,
        border: `2px solid ${colors.border}`,
        boxShadow: shadow.card,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px)`,
      }}
    >
      <div style={{ height: L.slots.pron }}>
        <PronunciationText fit={fits.pron} spans={pronSpans} />
      </div>
      <div style={{ height: L.slots.arabic }}>
        <ArabicText fit={fits.arabic} appearF={arabicAppear} />
      </div>
      <div style={{ height: L.slots.meaning }}>
        <MeaningText fit={fits.meaning} spans={meaningSpans} />
      </div>
    </div>
  );
};
