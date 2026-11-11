import React from "react";
import type { SceneKind } from "../types";
import { IntroBrandScene, IntroEntranceScene, IntroEpisodeScene, IntroPointingScene, IntroTopicScene, IntroWaiterScene, ThumbnailScene } from "./IntroScenes";
import { SentenceScene } from "./SentenceScene";
import { OutroCommentScene, OutroCompareScene, OutroFollowScene, OutroGoodbyeScene, OutroNextScene, OutroSaveShareScene, OutroSummaryScene } from "./OutroScenes";

export const sceneRegistry: Record<SceneKind, React.FC> = {
  thumbnail: ThumbnailScene,
  introEntrance: IntroEntranceScene,
  introWaiter: IntroWaiterScene,
  introPointing: IntroPointingScene,
  introBrand: IntroBrandScene,
  introEpisode: IntroEpisodeScene,
  introTopic: IntroTopicScene,
  sentence: SentenceScene,
  outroSummary: OutroSummaryScene,
  outroComment: OutroCommentScene,
  outroCompare: OutroCompareScene,
  outroSaveShare: OutroSaveShareScene,
  outroFollow: OutroFollowScene,
  outroNext: OutroNextScene,
  outroGoodbye: OutroGoodbyeScene,
};
