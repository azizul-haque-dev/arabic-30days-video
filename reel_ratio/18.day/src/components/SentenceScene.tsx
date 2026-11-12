import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { entrance, exitFade, prog } from "../lib/anim";
import { layoutSentenceText, SENTENCE_REGIONS as R } from "../lib/layout";
import { toBengaliDigits } from "../lib/format";
import { cueFrame } from "../episodes/day-18/timeline";
import { SECTIONS, type SentenceDef } from "../episodes/day-18/sentences";
import { ILLUSTRATIONS } from "../episodes/day-18/illustrations";
import { PronunciationText } from "./PronunciationText";
import { ArabicText } from "./ArabicText";
import { MeaningText } from "./MeaningText";
import { Chip } from "./Chip";
import { Abs } from "./FitText";
import { SceneShell } from "./SceneShell";

const RepeatMarks: React.FC<{ frame: number; first: number; second: number }> = ({ frame, first, second }) => {
  const a = prog(frame, first, 10);
  const b = prog(frame, second, 10);
  const mark = (label: string, p: number, active: boolean) => (
    <div style={{ opacity: p, display: "flex", alignItems: "center", gap: 10, fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 32, color: active ? theme.colors.primaryDark : theme.colors.textDim }}>
      <div style={{ width: 20, height: 20, borderRadius: 10, background: active ? theme.colors.accent : theme.colors.line }} />
      {label}
    </div>
  );
  return (
    <div style={{ display: "flex", gap: 40, alignItems: "center", justifyContent: "center", height: "100%" }}>
      {mark("১ম বার", a, b < 0.5)}
      {mark("২য় বার", b, b >= 0.5)}
    </div>
  );
};

/** Reusable learning scene. ALL data comes from `sentence` (see sentences.ts). */
export const SentenceScene: React.FC<{ sentence: SentenceDef; from: number; durationInFrames: number }> = ({ sentence, from, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const text = layoutSentenceText(sentence);
  const cf = (id: string) => cueFrame(id, fps, from);
  const cues = {
    pron1: cf(sentence.cues.pron1), pron2: cf(sentence.cues.pron2), meaning: cf(sentence.cues.meaning),
    usage: sentence.cues.usage ? cf(sentence.cues.usage) : undefined,
  };
  const Illustration = ILLUSTRATIONS[sentence.illustration];
  const sec = SECTIONS[sentence.section];
  const usageFade = cues.usage !== undefined ? exitFade(frame, cues.meaning, 8) : 0;

  return (
    <SceneShell durationInFrames={durationInFrames}>
      <Abs x={R.label.x} y={R.label.y} w={R.label.w} h={R.label.h} style={{ justifyContent: "space-between", ...entrance(frame, fps, 0, { y: -12 }) }}>
        <Chip label={`বাক্য ${toBengaliDigits(sentence.id)}`} bn size={34} />
        <Chip label={sec.chip} size={30} bg={theme.colors.accentSoft} color={theme.colors.text} />
      </Abs>

      <div style={{ position: "absolute", left: R.illustration.x, top: R.illustration.y, width: R.illustration.w, height: R.illustration.h, borderRadius: 44, overflow: "hidden", boxShadow: `0 18px 40px ${theme.colors.shadow}`, border: `4px solid ${theme.colors.white}`, boxSizing: "border-box", ...entrance(frame, fps, 0, { y: 20, scale: 0.97 }) }}>
        <Illustration frame={frame} fps={fps} durationInFrames={durationInFrames} cues={cues} />
      </div>

      <Abs x={R.pron.x} y={R.pron.y} w={R.pron.w} h={R.pron.h}>
        <PronunciationText fit={text.pron} frame={frame} fps={fps} firstFrame={cues.pron1} secondFrame={cues.pron2} />
      </Abs>
      <Abs x={R.repeat.x} y={R.repeat.y} w={R.repeat.w} h={R.repeat.h}>
        <RepeatMarks frame={frame} first={cues.pron1 + 4} second={cues.pron2 + 2} />
      </Abs>
      <Abs x={R.arabic.x} y={R.arabic.y} w={R.arabic.w} h={R.arabic.h}>
        <ArabicText fit={text.arabic} frame={frame} fps={fps} delay={cues.pron1 + 12} />
      </Abs>
      <Abs x={R.meaning.x} y={R.meaning.y} w={R.meaning.w} h={R.meaning.h}>
        {text.usage && cues.usage !== undefined ? (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MeaningText fit={text.usage} frame={frame} fps={fps} delay={cues.usage} opacityMul={usageFade} color={theme.colors.primaryDark} />
          </div>
        ) : null}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <MeaningText fit={text.meaning} frame={frame} fps={fps} delay={cues.meaning} />
        </div>
      </Abs>
    </SceneShell>
  );
};
