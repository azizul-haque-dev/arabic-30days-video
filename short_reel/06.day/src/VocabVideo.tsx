import React, {useMemo} from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from "remotion";
import media from "./data/generated/media.json";
import {BgMesh, Grade, Grain, Vignette} from "./components/Layers";
import {Subtitles} from "./components/Subtitles";
import {VocabCard} from "./components/VocabCard";
import {BrandOverlay} from "./components/BrandOverlay";
import {buildTimeline, cues} from "./lib/timeline";

export const VocabVideo: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();
  const rows = useMemo(() => buildTimeline(fps, durationInFrames), [fps, durationInFrames]);

  return (
    <AbsoluteFill>
      {/* 1. background */}
      <BgMesh />

      {/* audio: untouched narration from frame 0 */}
      {media.hasAudio ? <Audio src={staticFile("audio.wav")} /> : null}

      {/* 2-3. vocabulary cards (assets + type) */}
      {rows.map((row) => (
        <Sequence
          key={row.item.id}
          from={row.start}
          durationInFrames={Math.max(1, row.end - row.start)}
          layout="none"
          name={`${row.item.id} ${row.item.arabic}`}
        >
          <VocabCard row={row} />
        </Sequence>
      ))}

      <Subtitles cues={cues} />

      {/* page name and follow call-to-action */}
      <BrandOverlay />

      {/* 4-5. grade, grain, vignette */}
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
