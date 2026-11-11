import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import type { MainProps } from "./types";
import { SceneProvider } from "./context";
import { FontLoader } from "./fonts";
import { BgMesh, Grade, Grain, Vignette } from "./components/common";
import { sceneRegistry } from "./scenes";

/** Layer stack (bottom -> top): background mesh -> scenes (assets + type) -> colour grade -> grain + vignette. */
export const MainComposition: React.FC<MainProps> = ({ episode, timeline }) => {
  if (!timeline) throw new Error("Timeline missing: calculateMetadata did not run (SRT not loaded).");
  const fps = timeline.fps;
  return (
    <FontLoader>
      <AbsoluteFill>
        <BgMesh />
        {timeline.scenes.map((scene) => {
          const Scene = sceneRegistry[scene.kind];
          return (
            <Sequence key={scene.id} name={scene.id} from={scene.from} durationInFrames={scene.durationInFrames} layout="none">
              <SceneProvider episode={episode} scene={scene}>
                <Scene />
              </SceneProvider>
            </Sequence>
          );
        })}
        {episode.audio.enabled && (
          <Sequence from={Math.round(episode.audio.offsetSeconds * fps)} layout="none">
            <Audio src={staticFile(episode.audio.src)} volume={episode.audio.volume} />
          </Sequence>
        )}
        <Grade />
        <Grain />
        <Vignette />
      </AbsoluteFill>
    </FontLoader>
  );
};
