import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { findCue, useScene } from "../context";
import { ArtFrame, BrandHeader, Card, Entrance, Pill, SceneShell, WordReveal } from "../components/common";
import { SentenceIllustration } from "../illustrations/compositions";
import { clamp01, fitFont, ramp, useSpring } from "../utils/anim";
import { heroFont } from "./helpers";

const C = theme.colors;
const L = theme.layout;
const W = 1080 - 2 * L.margin; // 960 content width

const WordChip: React.FC<{ term: string; meaning: string; delay: number }> = ({ term, meaning, delay }) => (
  <Entrance delay={delay} y={30} preset="snappy">
    <Card style={{ height: 96, borderRadius: 30, display: "flex", alignItems: "center", gap: 24, padding: "0 28px" }}>
      <div style={{ background: C.primary, color: C.white, borderRadius: 20, padding: "6px 24px", fontSize: 44, fontWeight: 700, whiteSpace: "nowrap" }}>{term}</div>
      <div style={{ fontSize: 40, fontWeight: 700, color: C.accent }}>=</div>
      <div style={{ fontSize: 44, fontWeight: 600, color: C.text }}>{meaning}</div>
    </Card>
  </Entrance>
);

export const SentenceScene: React.FC = () => {
  const { episode, scene } = useScene();
  const frame = useCurrentFrame();
  const st = episode.sentences.find((s) => s.number === scene.cfg.sentenceNumber);
  if (!st) throw new Error(`No sentence data for ${scene.cfg.sentenceNumber}`);

  const at = (i?: number) => findCue(scene, i)?.start ?? 0;
  const ctxIn = Math.max(at(st.cues.context[0]), 10);
  const pronStart = at(st.cues.pronunciation[0]);
  const repeatStart = st.cues.pronunciation[1] !== undefined ? at(st.cues.pronunciation[1]) : pronStart;
  const meaningStart = at(st.cues.meaning);
  const wordsStart = st.cues.words !== undefined ? at(st.cues.words) : undefined;

  const ctxP = useSpring(ctxIn, "smooth");
  const ctxFade = 1 - ramp(frame, pronStart - 8, pronStart, theme.ease.in);
  const pronP = useSpring(pronStart, "bouncy");
  const meaningP = useSpring(meaningStart, "smooth");
  const pulse = frame >= repeatStart ? Math.sin(clamp01((frame - repeatStart) / 16) * Math.PI) : 0;
  const breathe = 1 + Math.sin(frame / 22) * 0.008;

  const pronSize = fitFont(st.pronunciation, 840, 104, 62, 2);
  const meaningSize = fitFont(st.meaning, 820, 66, 46, 2);
  const ctxSize = fitFont(st.context, 840, 58, 40, 3);

  return (
    <SceneShell>
      <BrandHeader />

      <div style={{ position: "absolute", left: 0, right: 0, top: L.badgeTop, display: "flex", justifyContent: "center" }}>
        <Entrance delay={2} preset="bouncy" scale={0.7}>
          <Pill bg={C.accent} color={C.text} size={38} pad={38}>SENTENCE {st.number}</Pill>
        </Entrance>
      </div>

      <ArtFrame left={L.margin + 20} top={L.artTop} width={920} height={L.artH} delay={4}>
        <SentenceIllustration kind={st.illustration} />
      </ArtFrame>

      {/* teaching context -> replaced by the pronunciation when it is spoken */}
      <div style={{ position: "absolute", left: L.margin, width: W, top: L.pronTop, height: L.pronH, display: "flex", alignItems: "center", justifyContent: "center", opacity: clamp01(ctxP) * ctxFade, transform: `translateY(${(1 - ctxP) * 40}px)` }}>
        <Card style={{ width: W, height: L.pronH, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 44px", textAlign: "center" }}>
          <div style={{ fontSize: ctxSize, fontWeight: 600, lineHeight: 1.3, color: C.text }}>{st.context}</div>
        </Card>
      </div>

      {/* Bengali pronunciation (main learning text) */}
      <div style={{ position: "absolute", left: L.margin, width: W, top: L.pronTop, height: L.pronH, opacity: clamp01(pronP), transform: `scale(${(0.9 + 0.1 * pronP) * (1 + pulse * 0.035) * breathe})` }}>
        <div style={{ width: W, height: L.pronH, borderRadius: 48, background: C.primary, boxShadow: `0 30px 60px -22px ${C.glow}, 0 0 0 ${pulse * 14}px ${C.accent}66`, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 40px", color: C.white, textAlign: "center" }}>
          <WordReveal text={st.pronunciation} delay={pronStart + 1} per={4} gap={22} style={{ fontSize: pronSize, fontWeight: 700, lineHeight: 1.2 }} />
        </div>
      </div>

      {/* Bengali meaning */}
      <div style={{ position: "absolute", left: L.margin, width: W, top: L.meaningTop, height: L.meaningH, opacity: clamp01(meaningP), transform: `translateY(${(1 - meaningP) * 40}px)` }}>
        <Card style={{ width: W, height: L.meaningH, display: "flex", alignItems: "center", gap: 26, padding: "0 40px", borderLeft: `18px solid ${C.accent}` }}>
          <div style={{ ...heroFont, fontSize: 56, color: C.accent }}>=</div>
          <div style={{ fontSize: meaningSize, fontWeight: 600, lineHeight: 1.2, color: C.text }}>{st.meaning}</div>
        </Card>
      </div>

      {/* word-by-word explanation (only when narrated) */}
      {wordsStart !== undefined && st.words.length > 0 && (
        <div style={{ position: "absolute", left: L.margin, width: W, top: L.wordsTop, display: "flex", flexDirection: "column", gap: 16 }}>
          {st.words.map((w, i) => (
            <WordChip key={w.term} term={w.term} meaning={w.meaning} delay={wordsStart + i * 6} />
          ))}
        </div>
      )}
    </SceneShell>
  );
};
