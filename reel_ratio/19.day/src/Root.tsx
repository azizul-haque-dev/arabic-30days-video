import React from "react";
import { Composition } from "remotion";
import { VIDEO } from "./config";
import { EpisodeVideo } from "./Day19Video";
import { episode } from "./episodes/day-19";

/**
 * Add the next episode by copying src/episodes/day-19 -> day-20 and registering another <Composition>.
 * Duration comes from the generated, SRT-derived timeline (no hard-coded frame counts).
 */
export const RemotionRoot: React.FC = () => (
  <Composition
    id="Day19"
    component={() => <EpisodeVideo content={episode.content} timeline={episode.timeline} />}
    durationInFrames={episode.timeline.durationInFrames}
    fps={VIDEO.fps}
    width={VIDEO.width}
    height={VIDEO.height}
  />
);
