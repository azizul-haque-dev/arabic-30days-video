import React, { createContext, useContext } from "react";
import type { EpisodeConfig, SceneCue, SceneTiming } from "./types";

type Ctx = { episode: EpisodeConfig; scene: SceneTiming };
const SceneCtx = createContext<Ctx | null>(null);

export const SceneProvider: React.FC<React.PropsWithChildren<Ctx>> = ({ episode, scene, children }) => (
  <SceneCtx.Provider value={{ episode, scene }}>{children}</SceneCtx.Provider>
);

export const useScene = (): Ctx => {
  const c = useContext(SceneCtx);
  if (!c) throw new Error("useScene must be used inside <SceneProvider>");
  return c;
};

export const findCue = (scene: SceneTiming, index: number | undefined): SceneCue | undefined =>
  index === undefined ? undefined : scene.cues.find((c) => c.index === index);
