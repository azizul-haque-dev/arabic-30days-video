import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { episodeConfig as cfg } from "./config/episode";
import { FontGate } from "./utils/fonts";
import { SentenceScene } from "./scenes/SentenceScene";
import { ThumbnailScene } from "./scenes/ThumbnailScene";
import { BrandIntroScene, EpisodeIntroScene, TopicScene } from "./scenes/IntroScenes";
import { OutroScene } from "./scenes/OutroScene";
import type { SceneTiming, Timeline } from "./types/episode";

export type EpisodeProps = { timeline: Timeline | null };

const renderScene = (s: SceneTiming) => {
  switch (s.type) {
    case "thumbnail": return <ThumbnailScene timing={s} />;
    case "brand": return <BrandIntroScene timing={s} />;
    case "episode": return <EpisodeIntroScene timing={s} />;
    case "topic": return <TopicScene timing={s} />;
    case "sentence": return <SentenceScene timing={s} />;
    case "outro": return <OutroScene timing={s} />;
  }
};

export const Episode: React.FC<EpisodeProps> = ({ timeline }) => {
  const a = cfg.assets.audio;
  const offset = Math.round(a.offsetSec * cfg.video.fps);
  return (
    <AbsoluteFill style={{ backgroundColor: "#EEF8F5" }}>
      <FontGate>
        {timeline?.scenes.map((s) => (
          <Sequence key={s.id} from={s.from} durationInFrames={s.duration} name={s.id}>
            {renderScene(s)}
          </Sequence>
        ))}
        {/* Original narration is the primary track. Enabled via episode.config.json → assets.audio.enabled */}
        {a.enabled && (
          <Sequence from={Math.max(0, offset)} name="narration">
            <Audio src={staticFile(a.file)} volume={a.volume} startFrom={offset < 0 ? -offset : 0} />
          </Sequence>
        )}
      </FontGate>
    </AbsoluteFill>
  );
};
