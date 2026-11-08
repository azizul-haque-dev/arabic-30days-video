import type { Cue, EpisodeConfig, SceneCue, SceneTiming, Timeline } from "../types";

export const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

/** Pure + deterministic: SRT cues + episode config -> frame-accurate scene timeline. */
export const buildTimeline = (episode: EpisodeConfig, cues: Cue[]): Timeline => {
  const fps = episode.video.fps;
  const byIndex = new Map(cues.map((c) => [c.index, c]));
  const scenes = episode.scenes;
  const startFrame = (i: number) => {
    const c = byIndex.get(scenes[i].startCue);
    if (!c) throw new Error(`Scene "${scenes[i].id}": SRT cue ${scenes[i].startCue} not found`);
    return i === 0 ? 0 : msToFrame(c.startMs, fps);
  };
  const last = cues[cues.length - 1];
  const total = msToFrame(last.endMs, fps) + Math.round(episode.srt.tailSeconds * fps);

  const out: SceneTiming[] = scenes.map((cfg, i) => {
    const from = startFrame(i);
    const end = i + 1 < scenes.length ? startFrame(i + 1) : total;
    const lastCueIdx = i + 1 < scenes.length ? scenes[i + 1].startCue - 1 : last.index;
    const sceneCues: SceneCue[] = cues
      .filter((c) => c.index >= cfg.startCue && c.index <= lastCueIdx)
      .map((c) => ({
        index: c.index,
        start: Math.max(0, msToFrame(c.startMs, fps) - from),
        end: msToFrame(c.endMs, fps) - from,
        text: c.text,
      }));
    return { id: cfg.id, kind: cfg.kind, cfg, from, durationInFrames: end - from, cues: sceneCues };
  });
  return { fps, totalFrames: total, scenes: out };
};

export const validateTimeline = (episode: EpisodeConfig, cues: Cue[]): string[] => {
  const issues: string[] = [];
  const idx = new Set(cues.map((c) => c.index));
  const s = episode.scenes;
  if (s[0]?.startCue !== 1) issues.push("First scene must start at SRT cue 1");
  s.forEach((sc, i) => {
    if (!idx.has(sc.startCue)) issues.push(`Scene ${sc.id}: startCue ${sc.startCue} missing in SRT`);
    if (i > 0 && sc.startCue <= s[i - 1].startCue) issues.push(`Scene ${sc.id}: startCue not strictly increasing`);
  });
  const sentenceScenes = s.filter((x) => x.kind === "sentence");
  if (sentenceScenes.length !== episode.sentenceEnd - episode.sentenceStart + 1)
    issues.push(`Expected ${episode.sentenceEnd - episode.sentenceStart + 1} sentence scenes, found ${sentenceScenes.length}`);
  sentenceScenes.forEach((sc, k) => {
    const n = episode.sentenceStart + k;
    if (sc.sentenceNumber !== n) issues.push(`Sentence scene ${sc.id}: expected number ${n}`);
    const st = episode.sentences.find((x) => x.number === sc.sentenceNumber);
    if (!st) return issues.push(`No sentence data for ${sc.sentenceNumber}`);
    const i = s.indexOf(sc);
    const lo = sc.startCue;
    const hi = i + 1 < s.length ? s[i + 1].startCue - 1 : Number.POSITIVE_INFINITY;
    const roles = [st.cues.label, ...st.cues.context, ...st.cues.pronunciation, st.cues.meaning, ...(st.cues.words ? [st.cues.words] : [])];
    roles.forEach((r) => {
      if (!idx.has(r)) issues.push(`Sentence ${st.number}: cue ${r} not in SRT`);
      else if (r < lo || r > hi) issues.push(`Sentence ${st.number}: cue ${r} outside scene range ${lo}-${hi}`);
    });
    if (st.cues.label !== sc.startCue) issues.push(`Sentence ${st.number}: label cue must equal scene startCue`);
  });
  return issues;
};
