import React from "react";
import { Composition, staticFile } from "remotion";
import { ArabicMasterDay, DayProps } from "./compositions/ArabicMasterDay";
import { episodeConfig as cfg } from "./config/episodeConfig";
import { buildTimeline } from "./config/timeline";
import { parseSrt } from "./utils/srt";

const loadCues = async () => {
  const res = await fetch(staticFile(cfg.srtFile));
  if (!res.ok) throw new Error(`Could not load ${cfg.srtFile}`);
  return parseSrt(await res.text());
};

export const RemotionRoot: React.FC = () => {
  const { width, height, fps } = cfg.video;
  return (
    <>
      <Composition
        id="ArabicMasterDay14"
        component={ArabicMasterDay}
        width={width}
        height={height}
        fps={fps}
        durationInFrames={3600}
        defaultProps={{ cues: [] } as DayProps}
        calculateMetadata={async () => {
          const cues = await loadCues();
          return { durationInFrames: buildTimeline(cues, fps).totalFrames, props: { cues } };
        }}
      />
      {/* Single-frame thumbnail (frame 0 of the video, no blank opening). */}
      <Composition
        id="Day14Thumbnail"
        component={ArabicMasterDay}
        width={width}
        height={height}
        fps={fps}
        durationInFrames={1}
        defaultProps={{ cues: [] } as DayProps}
        calculateMetadata={async () => ({ props: { cues: await loadCues() } })}
      />
    </>
  );
};
