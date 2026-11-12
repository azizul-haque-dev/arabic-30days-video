import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, getRemotionEnvironment, staticFile } from "remotion";
import { theme } from "./theme";
import { SENTENCES } from "./episode/day20";
import { AUDIO_EXPECTED_PATH, AUDIO_SRC } from "./generated/audio";
import { FontGate } from "./components/FontGate";
import { BgMesh, Finish } from "./components/Backdrop";
import { TopBar } from "./components/TopBar";
import { HookScene } from "./scenes/HookScene";
import { IntroScene } from "./scenes/IntroScene";
import { SentenceScene } from "./scenes/SentenceScene";
import { MilestoneScene } from "./scenes/MilestoneScene";
import { startF, TOTAL_FRAMES } from "./timing";

/** Scene list — every boundary is the start frame of an SRT entry. */
export const buildScenes = () => {
  const hookStart = 0;
  const introStart = startF(9);
  const sentenceStarts = SENTENCES.map((s) => startF(s.srt.label));
  const milestoneStart = startF(64);
  return {
    hook: { from: hookStart, to: introStart },
    intro: { from: introStart, to: sentenceStarts[0] },
    sentences: SENTENCES.map((cfg, i) => ({ cfg, from: sentenceStarts[i], to: i < SENTENCES.length - 1 ? sentenceStarts[i + 1] : milestoneStart })),
    milestone: { from: milestoneStart, to: TOTAL_FRAMES },
  };
};

export const Day20Video: React.FC = () => {
  const scenes = buildScenes();
  const { isStudio } = getRemotionEnvironment();
  return (
    <FontGate>
      <AbsoluteFill style={{ background: theme.colors.bg }}>
        <BgMesh />
        <Sequence from={scenes.hook.from} durationInFrames={scenes.hook.to - scenes.hook.from} name="Hook">
          <HookScene sceneStart={scenes.hook.from} sceneEnd={scenes.hook.to} />
        </Sequence>
        <Sequence from={scenes.intro.from} durationInFrames={scenes.intro.to - scenes.intro.from} name="Series intro">
          <IntroScene sceneStart={scenes.intro.from} sceneEnd={scenes.intro.to} />
        </Sequence>
        {scenes.sentences.map(({ cfg, from, to }) => (
          <Sequence key={cfg.no} from={from} durationInFrames={to - from} name={`Sentence ${cfg.no}`}>
            <SentenceScene cfg={cfg} sceneStart={from} sceneEnd={to} />
          </Sequence>
        ))}
        <Sequence from={scenes.milestone.from} durationInFrames={scenes.milestone.to - scenes.milestone.from} name="Milestone 200/300">
          <MilestoneScene sceneStart={scenes.milestone.from} sceneEnd={scenes.milestone.to} />
        </Sequence>
        <TopBar />
        <Finish />
        {/* Audio is discovered at build time (scripts/prepare-episode.mjs) */}
        {AUDIO_SRC ? <Html5Audio src={staticFile(AUDIO_SRC)} /> : null}
        {!AUDIO_SRC && isStudio ? (
          <div style={{ position: "absolute", left: 60, right: 60, bottom: 60, padding: "18px 24px", borderRadius: 20, background: "#FEF3C7", border: "3px solid #F59E0B", color: "#92400E", fontFamily: theme.fonts.en, fontWeight: 600, fontSize: 26, zIndex: 50 }}>
            Audio file missing — expected: {AUDIO_EXPECTED_PATH} (preview only, not rendered)
          </div>
        ) : null}
      </AbsoluteFill>
    </FontGate>
  );
};
