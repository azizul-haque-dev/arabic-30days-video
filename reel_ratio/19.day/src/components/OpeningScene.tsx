import React from "react";
import { interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, ease, fonts, springs } from "../design/tokens";
import { enter, secToFrame } from "../lib/anim";
import type { EpisodeContent, SceneTiming } from "../types";
import { AnimatedIllustration } from "./AnimatedIllustration";
import { SceneShell } from "./SceneShell";

type OpeningTiming = Extract<SceneTiming, { type: "opening" }>;

const FADE = 12;

/** Thumbnail-style opening: salary / month-end / balance not updated, then the workplace leave request. */
export const OpeningScene: React.FC<{ scene: OpeningTiming; content: EpisodeContent }> = ({ scene, content }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const splitF = scene.splitSec !== null ? secToFrame(scene.splitSec, fps) - scene.startFrame : Math.round(durationInFrames * 0.55);
  const t1 = enter(frame, fps, 2, springs.smooth);
  const t2 = enter(frame, fps, 10, springs.smooth);
  const fadeOut = interpolate(frame, [splitF, splitF + FADE], [1, 0], { easing: ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <SceneShell>
      <div style={{ position: "absolute", top: 330, left: 0, width: 1080, textAlign: "center", opacity: t1, transform: `translateY(${interpolate(t1, [0, 1], [40, 0])}px)` }}>
        <div style={{ fontFamily: fonts.latin, fontWeight: 700, fontSize: 230, lineHeight: "240px", color: colors.primary, letterSpacing: "-0.02em" }}>
          DAY <span style={{ color: colors.dark }}>{content.episode}</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: 600, left: 0, width: 1080, display: "flex", justifyContent: "center", opacity: t2, transform: `translateY(${interpolate(t2, [0, 1], [30, 0])}px)` }}>
        <div style={{ fontFamily: fonts.latin, fontWeight: 700, fontSize: 60, color: colors.white, background: colors.primary, padding: "16px 48px", borderRadius: 999 }}>{content.topicEn}</div>
      </div>
      <Sequence from={0} durationInFrames={splitF + FADE} layout="none">
        <AnimatedIllustration id="opening" top={760} opacity={fadeOut} />
      </Sequence>
      <Sequence from={splitF}>
        <AnimatedIllustration id="leave-request" top={760} />
      </Sequence>
      <div style={{ position: "absolute", top: 1410, left: 0, width: 1080, display: "flex", justifyContent: "center", opacity: t2 }}>
        <div style={{ fontFamily: fonts.latin, fontWeight: 600, fontSize: 38, color: colors.dark, background: colors.soft, padding: "18px 40px", borderRadius: 999, border: `2px solid ${colors.primary}55` }}>
          {content.brand} · {content.series}
        </div>
      </div>
    </SceneShell>
  );
};
