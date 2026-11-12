import { msToFrame } from "../../lib/time";
import { cueMs, LAST_CUE_END_MS } from "./cues";
import { SENTENCES, type SectionId } from "./sentences";

export type SceneKind =
  | "opening" | "introSplit" | "introConfidence" | "introTitle" | "introProgress" | "introCount" | "introLayout"
  | "section" | "sentence"
  | "outroDone" | "outroPractice" | "outroGoal" | "outroShare" | "outroFollow" | "outroNext" | "outroFinal";

export type SceneDef = {
  id: string;
  kind: SceneKind;
  firstCue: string;
  section?: SectionId;
  sentenceId?: number;
};

/** Visual timeline (NOT 1:1 with subtitle entries). Scene start = its first cue; scene end = next scene start. */
export const SCENES: SceneDef[] = [
  { id: "opening", kind: "opening", firstCue: "intro-01" },
  { id: "intro-split", kind: "introSplit", firstCue: "intro-02" },
  { id: "intro-confidence", kind: "introConfidence", firstCue: "intro-03" },
  { id: "intro-title", kind: "introTitle", firstCue: "intro-04" },
  { id: "intro-progress", kind: "introProgress", firstCue: "intro-05" },
  { id: "intro-count", kind: "introCount", firstCue: "intro-06" },
  { id: "intro-layout", kind: "introLayout", firstCue: "intro-07" },
  { id: "section-restaurant", kind: "section", firstCue: "section-restaurant", section: "restaurant" },
  ...SENTENCES.filter((s) => s.section === "restaurant").map<SceneDef>((s) => ({
    id: `sentence-${s.id}`, kind: "sentence", firstCue: s.cues.number, sentenceId: s.id, section: s.section,
  })),
  { id: "section-workplace", kind: "section", firstCue: "section-workplace", section: "workplace" },
  ...SENTENCES.filter((s) => s.section === "workplace").map<SceneDef>((s) => ({
    id: `sentence-${s.id}`, kind: "sentence", firstCue: s.cues.number, sentenceId: s.id, section: s.section,
  })),
  { id: "outro-done", kind: "outroDone", firstCue: "outro-01" },
  { id: "outro-practice", kind: "outroPractice", firstCue: "outro-02" },
  { id: "outro-goal", kind: "outroGoal", firstCue: "outro-03" },
  { id: "outro-share", kind: "outroShare", firstCue: "outro-04" },
  { id: "outro-follow", kind: "outroFollow", firstCue: "outro-05" },
  { id: "outro-next", kind: "outroNext", firstCue: "outro-06" },
  { id: "outro-final", kind: "outroFinal", firstCue: "outro-07" },
];

export type PlacedScene = SceneDef & { from: number; durationInFrames: number };

export const totalFramesFor = (fps: number, audioSeconds?: number | null): number => {
  const srtFrames = Math.ceil((LAST_CUE_END_MS / 1000) * fps);
  if (!audioSeconds) return srtFrames;
  // never cut the last subtitle, never leave a silent tail shorter than the audio
  return Math.max(srtFrames, Math.ceil(audioSeconds * fps));
};

export const placeScenes = (fps: number, totalFrames: number): PlacedScene[] =>
  SCENES.map((sc, i) => {
    const from = msToFrame(cueMs(sc.firstCue).startMs, fps);
    const next = SCENES[i + 1];
    const to = next ? msToFrame(cueMs(next.firstCue).startMs, fps) : totalFrames;
    return { ...sc, from, durationInFrames: to - from };
  });

/** Cue start in frames, relative to a scene's `from`. */
export const cueFrame = (cueId: string, fps: number, sceneFrom: number): number =>
  msToFrame(cueMs(cueId).startMs, fps) - sceneFrom;
