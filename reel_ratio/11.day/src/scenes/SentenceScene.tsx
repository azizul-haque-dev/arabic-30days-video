import React from "react";
import { Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { episodeConfig as cfg } from "../config/episode";
import { ArabicLine, BrandBar, Card, Enter, Pill, SceneShell, WordReveal } from "../components/primitives";
import { illustrations } from "../illustrations/scenes";
import type { SceneTiming } from "../types/episode";

const c = theme.colors;

/** One reusable scene for every sentence. All content comes from episode.config.json. */
export const SentenceScene: React.FC<{ timing: SceneTiming }> = ({ timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = cfg.sentences[timing.sentenceIndex ?? 0];
  const Illo = illustrations[s.illustration];
  const arabicAt = Math.max(timing.arabicAt ?? 0, Math.round(fps * 0.9));
  const pronAt = arabicAt + Math.round(fps * 0.35);
  const meaningAt = Math.max(timing.meaningAt ?? 0, pronAt + Math.round(fps * 0.5));
  const exitAt = timing.duration - theme.frames.exit;
  const illoDelay = Math.round(fps * 0.3);
  const drift = Math.sin((frame / fps) * 0.7) * 8;
  const idx = timing.sentenceIndex ?? 0;

  return (
    <SceneShell duration={timing.duration}>
      <BrandBar
        name={cfg.brandName}
        delay={0}
        right={
          <Pill bg={c.accent} color={c.text} size={38} px={30} py={12}>
            Sentence {s.number}
          </Pill>
        }
      />
      {/* position dots: 10 sentences */}
      <div style={{ position: "absolute", top: 262, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14 }}>
        {cfg.sentences.map((x, i) => (
          <Enter key={x.number} delay={8 + i * 2} y={10} scale={0.4}>
            <div
              style={{
                width: i === idx ? 54 : 18,
                height: 18,
                borderRadius: 9,
                background: i <= idx ? c.primary : c.mint,
              }}
            />
          </Enter>
        ))}
      </div>

      {/* illustration */}
      <div style={{ position: "absolute", left: theme.safe.x, top: 316 + drift, width: 936, height: 748 }}>
        <Sequence from={illoDelay} layout="none">
          <Enter delay={0} y={60} scale={0.9} preset="soft" exitAt={exitAt - illoDelay} style={{ width: "100%", height: "100%" }}>
            <Illo />
          </Enter>
        </Sequence>
      </div>

      {/* Arabic */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1090, display: "flex", justifyContent: "center" }}>
        <Sequence from={arabicAt} layout="none">
          <ArabicLine text={s.arabic} size={128} exitAt={exitAt - arabicAt} />
        </Sequence>
      </div>

      {/* Bengali pronunciation */}
      <div style={{ position: "absolute", left: theme.safe.x, right: theme.safe.x, top: 1300 }}>
        <Sequence from={pronAt} layout="none">
          <WordReveal text={s.pronunciation} fontSize={66} weight={700} color={c.primaryDark} exitAt={exitAt - pronAt} />
        </Sequence>
      </div>

      {/* Bengali meaning */}
      <div style={{ position: "absolute", left: theme.safe.x, right: theme.safe.x, top: 1430 }}>
        <Sequence from={meaningAt} layout="none">
          <Enter delay={0} y={50} scale={0.94} preset="pop" exitAt={exitAt - meaningAt}>
            <Card style={{ padding: "30px 44px 34px", display: "flex", alignItems: "center", gap: 28, borderLeft: `14px solid ${c.accent}` }}>
              <div style={{ fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 36, color: c.textSoft, letterSpacing: 1 }}>অর্থ</div>
              <div style={{ flex: 1 }}>
                <WordReveal text={s.meaning} delay={6} fontSize={60} weight={700} align="left" gap={14} lineHeight={1.3} />
              </div>
            </Card>
          </Enter>
        </Sequence>
      </div>
    </SceneShell>
  );
};
