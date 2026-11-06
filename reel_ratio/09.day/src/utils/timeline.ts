// Converts the data-driven scene config (seconds) into frame-exact timing.
import scenesJson from "../data/scenes.json";
import scriptJson from "../data/script.json";
import { theme } from "../theme";

export type SceneBase = {
  id: string;
  start: number;
  end: number;
  srtCues: number[];
};
export type SentenceBeats = { number: number; arabic: number; arabic2: number; meaning: number };
export type SceneConfig =
  | (SceneBase & { type: "thumbnail" })
  | (SceneBase & { type: "intro"; variant: "brand" | "series" | "progress" | "preview" })
  | (SceneBase & { type: "outro"; variant: "complete" | "progress" | "tip" | "follow" | "next" })
  | (SceneBase & { type: "sentence"; sentence: number; beats: SentenceBeats });

export type SentenceData = {
  n: number;
  arabic: string;
  pron: string;
  meaning: string;
  illustration: string;
};

export const FPS: number = scenesJson.fps;
export const script = scriptJson;
export const sceneConfigs = scenesJson.scenes as unknown as SceneConfig[];
export const sentences = scriptJson.sentences as SentenceData[];

export const secToFrame = (s: number, fps = FPS) => Math.round(s * fps);

export const TOTAL_FRAMES = Math.ceil(scenesJson.durationSec * FPS);

export type TimedScene = {
  config: SceneConfig;
  from: number;
  duration: number;
};

// Adjacent scenes share the same rounded boundary => no gaps, no overlaps.
export const buildTimeline = (): TimedScene[] =>
  sceneConfigs.map((config, i) => {
    const from = i === 0 ? 0 : secToFrame(config.start);
    const isLast = i === sceneConfigs.length - 1;
    const to = isLast ? TOTAL_FRAMES : secToFrame(sceneConfigs[i + 1].start);
    return { config, from, duration: to - from };
  });

// Beat time (absolute seconds) -> local frame inside its scene.
export const beatFrame = (beatSec: number, sceneStartSec: number) =>
  secToFrame(beatSec) - secToFrame(sceneStartSec);

export const checkTheme = () => theme.video.fps === FPS;
