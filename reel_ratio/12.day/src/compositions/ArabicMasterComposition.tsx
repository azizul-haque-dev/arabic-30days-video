import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { BgMesh, Finish } from "../components/Backdrop";
import { episode, timeline } from "../config/episode";
import { BrandScene, EpisodeScene, ProgressDoneScene, StoryScene, ThumbnailScene, TopicScene } from "../scenes/IntroScenes";
import { OutroCommentScene, OutroDoneScene, OutroFollowScene, OutroGoodbyeScene, OutroPracticeScene, OutroProgressScene } from "../scenes/OutroScenes";
import { SentenceScene } from "../scenes/SentenceScene";
import { theme } from "../theme";
import type { SceneKind, TimelineScene } from "../types";

const SCENES: Record<SceneKind, React.FC<{ scene: TimelineScene }>> = {
  thumbnail: ThumbnailScene, story: StoryScene, brand: BrandScene, episode: EpisodeScene,
  progressDone: ProgressDoneScene, topic: TopicScene, sentence: SentenceScene,
  outroDone: OutroDoneScene, outroProgress: OutroProgressScene, outroPractice: OutroPracticeScene,
  outroFollow: OutroFollowScene, outroComment: OutroCommentScene, outroGoodbye: OutroGoodbyeScene,
};

/**
 * Data-driven composition: one <Sequence> per timeline scene, positioned from the SRT.
 * Narration audio is opt-in via episode.config.json -> audio.enabled (off while no narration file is supplied).
 */
export const ArabicMasterComposition: React.FC = () => (
  <AbsoluteFill style={{ background: theme.colors.bg }}>
    <BgMesh />
    {episode.audio.enabled && <Audio src={staticFile(episode.audio.src)} volume={episode.audio.volume} startFrom={Math.round(episode.audio.startOffsetSeconds * episode.video.fps)} />}
    {timeline.scenes.map((s) => {
      const Scene = SCENES[s.kind];
      return (
        <Sequence key={s.id} name={s.id} from={s.startFrame} durationInFrames={s.durationFrames} layout="none">
          <Scene scene={s} />
        </Sequence>
      );
    })}
    <Finish />
  </AbsoluteFill>
);
