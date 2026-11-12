import React from "react";
import { interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { L } from "../design/layout";
import { colors, fonts, radius, shadow, springs } from "../design/tokens";
import { enter, secToFrame } from "../lib/anim";
import { fitText } from "../lib/fit";
import type { EpisodeContent, SceneTiming } from "../types";
import { AnimatedIllustration } from "./AnimatedIllustration";
import { BrandTag } from "./BrandTag";
import { SceneShell } from "./SceneShell";

type ChallengeTiming = Extract<SceneTiming, { type: "challenge" }>;

/** Placeholder card shown before the first challenge sentence is spoken (keeps the layout stable, reveals nothing). */
const BaseCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, 6, springs.smooth);
  return (
    <div
      style={{
        position: "absolute",
        left: L.side,
        top: L.card.top,
        width: L.contentWidth,
        height: L.card.height,
        borderRadius: radius.card,
        background: colors.white,
        border: `2px solid ${colors.border}`,
        boxShadow: shadow.card,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px)`,
      }}
    >
      <div style={{ width: 170, height: 170, borderRadius: 85, background: colors.amber, color: colors.white, fontFamily: fonts.latin, fontWeight: 700, fontSize: 120, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${Math.sin(frame / 10) * 6}px)` }}>
        ?
      </div>
    </div>
  );
};

const ItemCard: React.FC<{ index: number; count: number; text: string }> = ({ index, count, text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, 0, springs.smooth);
  const fit = React.useMemo(
    () => fitText({ text, fontFamily: fonts.bengali, fontWeight: 700, maxWidth: L.contentWidth - 96, maxFont: 72, minFont: 44, singleLineMinFont: 56, maxLines: 2, lineHeight: 1.3 }),
    [text],
  );
  return (
    <SceneShell>
      <div
        style={{
          position: "absolute",
          left: L.side,
          top: L.card.top,
          width: L.contentWidth,
          height: L.card.height,
          boxSizing: "border-box",
          padding: "40px 48px",
          borderRadius: radius.card,
          background: colors.white,
          border: `2px solid ${colors.border}`,
          boxShadow: shadow.card,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px)`,
        }}
      >
        <div style={{ fontFamily: fonts.latin, fontWeight: 700, fontSize: 38, color: colors.white, background: colors.primary, padding: "10px 34px", borderRadius: 999, height: 64, boxSizing: "border-box", display: "flex", alignItems: "center" }}>
          {index + 1} / {count}
        </div>
        <div style={{ height: 300, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          {fit.lines.map((l, i) => (
            <div key={i} style={{ fontFamily: fonts.bengali, fontWeight: 700, fontSize: fit.fontSize, lineHeight: `${fit.lineHeightPx}px`, color: colors.dark, whiteSpace: "nowrap" }}>
              {l}
            </div>
          ))}
        </div>
        <div style={{ height: 80, display: "flex", gap: 20, alignItems: "center" }}>
          {[0, 1, 2].map((i) => {
            const s = 1 + 0.35 * Math.max(0, Math.sin((frame - i * 8) / 8));
            return <div key={i} style={{ width: 26, height: 26, borderRadius: 13, background: colors.amber, transform: `scale(${s})` }} />;
          })}
        </div>
      </div>
    </SceneShell>
  );
};

/** Quick challenge: two Bengali sentences shown one at a time, answers deliberately NOT revealed. */
export const ChallengeScene: React.FC<{ scene: ChallengeTiming; content: EpisodeContent; sample: boolean }> = ({ scene, content, sample }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, 2, springs.snappy);
  return (
    <SceneShell>
      <BrandTag brand={content.brand} day={content.episode} sample={sample} />
      <div style={{ position: "absolute", top: L.numberRow.top, left: 0, width: 1080, height: L.numberRow.height, display: "flex", justifyContent: "center", alignItems: "center", opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.9, 1])})` }}>
        <div style={{ fontFamily: fonts.latin, fontWeight: 700, fontSize: 60, color: colors.dark, borderBottom: `10px solid ${colors.amber}`, lineHeight: "70px" }}>{content.labels.challenge}</div>
      </div>
      <AnimatedIllustration id="challenge" />
      <BaseCard />
      {scene.items.map((it, i) => {
        const from = secToFrame(it.startSec, fps) - scene.startFrame;
        const to = secToFrame(it.endSec, fps) - scene.startFrame;
        const sentence = content.sentences.find((s) => s.number === it.sentence);
        if (!sentence) throw new Error(`Challenge refers to unknown sentence ${it.sentence}`);
        return (
          <Sequence key={it.sentence} from={from} durationInFrames={Math.max(1, to - from)} layout="none">
            <ItemCard index={i} count={scene.items.length} text={sentence.meaning} />
          </Sequence>
        );
      })}
    </SceneShell>
  );
};
