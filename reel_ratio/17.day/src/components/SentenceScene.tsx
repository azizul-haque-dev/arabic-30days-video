import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { SentenceConfig } from "../types";
import { HEADER, layoutSentence } from "../layout/engine";
import { browserMeasure } from "../layout/measure";
import { cueEnd, cueStart } from "../episodes/timeline";
import { episode } from "../episodes/active";
import { ease, enterStyle, useEnter } from "../motion";
import { theme } from "../theme";
import { ArabicText } from "./ArabicText";
import { Logo } from "./Logo";
import { MeaningChip, MeaningText } from "./MeaningText";
import { PronunciationText } from "./PronunciationText";
import { SceneShell } from "./SceneShell";
import { VectorIllustration } from "./VectorIllustration";

const c = theme.colors;
const CUE_REVEAL_LEAD_SEC = 0.3;

const pulse = (t: number, t0: number, dur = 0.8) => {
  if (t < t0) return 0;
  const x = Math.min(1, (t - t0) / dur);
  return Math.pow(1 - x, 2);
};

/**
 * Reusable sentence scene. Everything (text, order, timing, art) comes from the SentenceConfig + SRT.
 * Per-word timing inside a cue is ESTIMATED (SRT only has cue-level times).
 */
export const SentenceScene: React.FC<{
  sentence: SentenceConfig;
  sceneStartSec: number;
  durationInFrames: number;
  wipeIn?: boolean;
}> = ({ sentence, sceneStartSec, durationInFrames, wipeIn }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const layout = useMemo(() => layoutSentence(sentence.units, sentence.meaning, browserMeasure), [sentence]);

  // ---- timing (local seconds) ----
  const rel = (n: number) => cueStart(n) - sceneStartSec;
  const s1 = rel(sentence.cues.say1);
  const s1End = cueEnd(sentence.cues.say1) - sceneStartSec;
  const s2 = rel(sentence.cues.say2);
  const s2End = cueEnd(sentence.cues.say2) - sceneStartSec;
  const sMean = rel(sentence.cues.meaning);

  const weights = sentence.units.map((u) => Math.max(1, [...u.bn].length));
  const total = weights.reduce((a, b) => a + b, 0);
  const startsIn = (w0: number, w1: number) => {
    let acc = 0;
    return weights.map((w) => {
      const f = acc / total;
      acc += w;
      return w0 + (w1 - w0) * f * 0.8;
    });
  };
  const unitStart1 = startsIn(s1, s1End);
  const unitStart2 = startsIn(s2, s2End);

  const wipeDelay = wipeIn ? 0.25 : 0;
  const sceneLead = wipeIn ? 0 : CUE_REVEAL_LEAD_SEC;
  const header = useEnter(wipeDelay + 0.02 - sceneLead, "soft");
  const illo = useEnter(wipeDelay + 0.1 - sceneLead, "soft");
  const card = useEnter(wipeDelay + 0.3 - sceneLead, "soft");
  const numberPop = useEnter(wipeDelay + 0.12 - sceneLead, "bouncy");

  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.045], { extrapolateRight: "clamp" });
  const learn = layout.card;

  return (
    <SceneShell label={`sentence ${sentence.no}`} durationInFrames={durationInFrames} wipeIn={wipeIn}>
      {/* header */}
      <div style={{ position: "absolute", left: HEADER.logo.x, top: HEADER.logo.y, ...enterStyle(header, -18) }}>
        <Logo width={HEADER.logo.w} height={HEADER.logo.h} />
      </div>
      <div
        data-box="day-badge"
        data-kind="chrome"
        style={{
          position: "absolute",
          left: HEADER.day.x,
          top: HEADER.day.y,
          width: HEADER.day.w,
          height: HEADER.day.h,
          borderRadius: HEADER.day.h / 2,
          background: c.primary,
          color: c.white,
          fontFamily: theme.fonts.en,
          fontWeight: 800,
          fontSize: 28,
          letterSpacing: 1,
          lineHeight: `${HEADER.day.h}px`,
          textAlign: "center",
          ...enterStyle(header, -18),
        }}
      >
        DAY {episode.day}
      </div>
      <div
        data-box="sentence-number"
        data-kind="chrome"
        style={{
          position: "absolute",
          left: HEADER.sentence.x,
          top: HEADER.sentence.y,
          width: HEADER.sentence.w,
          height: HEADER.sentence.h,
          borderRadius: 22,
          background: c.white,
          border: `3px solid ${c.accent}`,
          boxSizing: "border-box",
          textAlign: "center",
          fontFamily: theme.fonts.en,
          color: c.text,
          ...enterStyle(numberPop, -10, 0.8),
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: 2, color: c.textSoft, lineHeight: "24px", paddingTop: 5 }}>SENTENCE</div>
        <div style={{ fontSize: 34, fontWeight: 800, lineHeight: "36px" }}>{sentence.no}</div>
      </div>

      {/* assets layer: illustration */}
      <VectorIllustration id={sentence.illustration} zoom={zoom} style={enterStyle(illo, 20, 0.97)} />

      {/* learning card */}
      <div
        data-box="learn-card"
        data-kind="container"
        style={{
          position: "absolute",
          left: learn.x,
          top: learn.y,
          width: learn.w,
          height: learn.h,
          borderRadius: 44,
          background: c.white,
          boxShadow: `0 24px 60px ${c.shadow}`,
          ...enterStyle(card, 40, 0.97),
        }}
      />

      {/* units: Bengali (large) + Arabic (smaller) share one reveal clock */}
      {layout.pron.map((u, i) => {
        const bn = useEnterAt(unitStart1[i]);
        const ar = useEnterAt(unitStart1[i] + 0.14);
        const g = Math.max(pulse(t, unitStart1[i]), pulse(t, unitStart2[i]));
        const lift = 1 + 0.035 * g;
        return (
          <React.Fragment key={i}>
            <div
              data-box={`glow-${i}`}
              data-kind="bg"
              style={{
                position: "absolute",
                left: u.box.x - 12,
                top: u.box.y - 8,
                width: u.box.w + 24,
                height: u.box.h + 16,
                borderRadius: 26,
                background: c.accentSoft,
                opacity: g * 0.9,
              }}
            />
            <PronunciationText
              rect={u.bn}
              size={layout.bnSize}
              text={u.unit.bn}
              index={i}
              style={{ ...enterStyle(bn, -14, 0.92), transform: `${enterStyle(bn, -14, 0.92).transform} scale(${lift})` }}
            />
            <ArabicText rect={u.ar} size={layout.arSize} text={u.unit.ar} index={i} style={enterStyle(ar, 12, 0.94)} />
          </React.Fragment>
        );
      })}

      {/* meaning, on its own cue */}
      <MeaningChip rect={layout.chip} style={enterStyle(useEnterAt(sMean), 10, 0.9)} />
      <MeaningText rect={layout.meaningText} size={layout.meaningSize} lines={layout.meaningLines} style={enterStyle(useEnterAt(sMean + 0.12), 16, 0.95)} />
    </SceneShell>
  );
};

/** spring that starts at an absolute local time (seconds) — used for cue-driven reveals */
function useEnterAt(startSec: number) {
  return useEnter(Math.max(0, startSec - CUE_REVEAL_LEAD_SEC), "snappy");
}
