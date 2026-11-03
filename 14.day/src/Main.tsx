import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { SCENES, BEATS } from "./timing";
import { SENTENCES } from "./content";
import { BgMesh, Grade, Grain, Vignette } from "./components/Chrome";
import { HookScene, TitleScene, CountScene, ReadyScene } from "./scenes/Intro";
import { ChatLayout, GlassLayout, BentoLayout } from "./scenes/Sentence";
import { RecapScene, FollowScene, EndScene } from "./scenes/Outro";
import { Thumbnail } from "./scenes/Thumbnail";
import { PreviewAudio } from "./components/PreviewAudio";
import { Sfx } from "./components/Sfx";
import "./fonts";

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const sentenceLayouts = [ChatLayout, GlassLayout, BentoLayout];

  // Thumbnail overlay transition at video start (ensures frame 0 is NEVER blank for social media CTR)
  const THUMBNAIL_HOLD = 18;
  const THUMBNAIL_FADE_END = 26;
  const thumbnailOpacity = interpolate(
    frame,
    [THUMBNAIL_HOLD, THUMBNAIL_FADE_END],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const thumbnailScale = interpolate(
    frame,
    [0, THUMBNAIL_FADE_END],
    [1, 1.04],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ width: 1080, height: 1080, backgroundColor: "#EEF8F5" }}>
      {/* Layer 1: Background Mesh */}
      <BgMesh />

      {/* Layer 2: Scenes */}
      {/* Intro Scenes */}
      <Sequence from={SCENES[0].from} durationInFrames={SCENES[0].duration}>
        <HookScene />
      </Sequence>
      <Sequence from={SCENES[1].from} durationInFrames={SCENES[1].duration}>
        <TitleScene />
      </Sequence>
      <Sequence from={SCENES[2].from} durationInFrames={SCENES[2].duration}>
        <CountScene />
      </Sequence>
      <Sequence from={SCENES[3].from} durationInFrames={SCENES[3].duration}>
        <ReadyScene />
      </Sequence>

      {/* 10 Sentence Scenes (131 - 140) */}
      {SENTENCES.map((item, idx) => {
        const sceneInfo = SCENES[4 + idx];
        const beats = BEATS[idx];
        const LayoutComp = sentenceLayouts[idx % 3];

        return (
          <Sequence
            key={item.num}
            from={sceneInfo.from}
            durationInFrames={sceneInfo.duration}
          >
            <LayoutComp
              data={item}
              sayBeat={beats.say}
              meanBeat={beats.mean}
            />
          </Sequence>
        );
      })}

      {/* Outro Scenes */}
      <Sequence from={SCENES[14].from} durationInFrames={SCENES[14].duration}>
        <RecapScene />
      </Sequence>
      <Sequence from={SCENES[15].from} durationInFrames={SCENES[15].duration}>
        <FollowScene dur={SCENES[15].duration} />
      </Sequence>
      <Sequence from={SCENES[16].from} durationInFrames={SCENES[16].duration}>
        <EndScene />
      </Sequence>

      {/* Video Opening Thumbnail Cover (Frame 0-26) to guarantee social preview & impressions */}
      {frame <= THUMBNAIL_FADE_END && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: thumbnailOpacity,
            transform: `scale(${thumbnailScale})`,
            zIndex: 40,
            pointerEvents: "none",
          }}
        >
          <Thumbnail isVideoIntro />
        </div>
      )}

      {/* Scene Transitions SFX */}
      <Sfx name="whoosh" at={18} volume={0.2} />
      {SCENES.map((s, idx) => (
        <Sfx key={idx} name="whoosh" at={Math.max(0, s.from - 8)} volume={0.22} />
      ))}

      {/* Layer 4: Color Grade */}
      <Grade />

      {/* Layer 5: Procedural Grain & Vignette */}
      <Grain />
      <Vignette />

      {/* Layer 6: Voiceover Audio Track */}
      <PreviewAudio />
    </AbsoluteFill>
  );
};
