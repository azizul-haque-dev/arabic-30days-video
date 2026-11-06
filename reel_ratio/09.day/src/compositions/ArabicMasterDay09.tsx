import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import audioConfig from "../../config/audio.config.json";
import { BgMesh, Finish } from "../components/Backdrop";
import { FontLoader } from "../components/FontLoader";
import { IntroScene } from "../scenes/IntroScene";
import { OutroScene } from "../scenes/OutroScene";
import { SentenceScene } from "../scenes/SentenceScene";
import { ThumbnailScene } from "../scenes/ThumbnailScene";
import { TimedScene, buildTimeline, sentences } from "../utils/timeline";

export type DayProps = {
  /** file inside /public */
  audioFile: string;
  audioEnabled: boolean;
  audioVolume: number;
  audioStartFromSec: number;
  /** optional background music (disabled unless explicitly supplied) */
  musicFile: string | null;
  musicVolume: number;
};

export const defaultDayProps: DayProps = {
  audioFile: audioConfig.source,
  audioEnabled: audioConfig.enabled,
  audioVolume: audioConfig.volume,
  audioStartFromSec: audioConfig.startFromSec,
  musicFile: audioConfig.backgroundMusic.enabled ? audioConfig.backgroundMusic.source : null,
  musicVolume: audioConfig.backgroundMusic.volume,
};

const SceneSwitch: React.FC<{ t: TimedScene }> = ({ t }) => {
  const c = t.config;
  switch (c.type) {
    case "thumbnail":
      return <ThumbnailScene />;
    case "intro":
      return <IntroScene variant={c.variant} />;
    case "outro":
      return <OutroScene variant={c.variant} />;
    case "sentence": {
      const data = sentences.find((s) => s.n === c.sentence);
      if (!data) throw new Error(`Sentence ${c.sentence} missing in script.json`);
      return <SentenceScene data={data} beats={c.beats} sceneStart={c.start} duration={t.duration} />;
    }
  }
};

const timeline = buildTimeline();

export const ArabicMasterDay09: React.FC<DayProps> = ({ audioFile, audioEnabled, audioVolume, audioStartFromSec, musicFile, musicVolume }) => (
  <AbsoluteFill style={{ backgroundColor: "#EEF8F5" }}>
    <FontLoader />
    {/* 1 — background mesh */}
    <BgMesh />
    {/* 2/3 — scenes (illustration + type layers) */}
    {timeline.map((t) => (
      <Sequence key={t.config.id} name={t.config.id} from={t.from} durationInFrames={t.duration} layout="none">
        <SceneSwitch t={t} />
      </Sequence>
    ))}
    {/* 4/5 — grade, grain, vignette */}
    <Finish />
    {/* original narration — enabled by default, never muted, unmodified */}
    {audioEnabled && <Audio src={staticFile(audioFile)} volume={audioVolume} startFrom={Math.round(audioStartFromSec * 30)} />}
    {musicFile && <Audio src={staticFile(musicFile)} volume={musicVolume} loop />}
  </AbsoluteFill>
);
