import type { At, Cue, EpisodeConfig, SceneTiming, SceneType, Timeline } from "../types/episode";

export const resolveAt = (at: At, cues: Map<number, Cue>, issues: string[], label: string): number => {
  if (typeof at.sec === "number") {
    const c = at.cue ? cues.get(at.cue) : undefined;
    if (at.cue && !c) issues.push(`${label}: cue ${at.cue} not found`);
    if (c && (at.sec < c.startMs / 1000 - 0.1 || at.sec > c.endMs / 1000 + 0.1)) {
      issues.push(`${label}: ${at.sec}s lies outside cue ${at.cue} (${c.startMs / 1000}-${c.endMs / 1000}s)`);
    }
    return at.sec;
  }
  if (at.cue) {
    const c = cues.get(at.cue);
    if (!c) {
      issues.push(`${label}: cue ${at.cue} not found`);
      return 0;
    }
    return Math.max(0, c.startMs / 1000 + (at.offsetSec ?? 0));
  }
  issues.push(`${label}: anchor has neither cue nor sec`);
  return 0;
};

export const buildTimeline = (
  cfg: EpisodeConfig,
  cues: Cue[],
  fps: number,
  audioSeconds: number | null = null,
): Timeline => {
  const issues: string[] = [];
  const cm = new Map(cues.map((c) => [c.index, c]));
  const toF = (s: number) => Math.round(s * fps);
  const at = (a: At, label: string) => toF(resolveAt(a, cm, issues, label));

  type Draft = { id: string; type: SceneType; from: number; sentenceIndex?: number; estimated: boolean };
  const drafts: Draft[] = [];
  (["thumbnail", "brand", "episode", "topic"] as const).forEach((k) =>
    drafts.push({
      id: k,
      type: k,
      from: at(cfg.scenes[k].start, `scene ${k}`),
      estimated: !!cfg.scenes[k].start.estimated,
    }),
  );
  cfg.sentences.forEach((s, i) =>
    drafts.push({
      id: `sentence-${s.number}`,
      type: "sentence",
      from: at(s.start, `sentence ${s.number} start`),
      sentenceIndex: i,
      estimated: !!s.start.estimated || !!s.reveal.arabicAt.estimated || !!s.reveal.meaningAt.estimated,
    }),
  );
  drafts.push({
    id: "outro",
    type: "outro",
    from: at(cfg.scenes.outro.start, "scene outro"),
    estimated: !!cfg.scenes.outro.start.estimated,
  });

  const lastCue = cues[cues.length - 1];
  const narrationEnd = lastCue ? toF(lastCue.endMs / 1000) : 0;
  const audioFrames = audioSeconds === null ? null : toF(audioSeconds + cfg.assets.audio.offsetSec);
  const totalFrames = Math.max(narrationEnd + toF(cfg.timing.tailSec), audioFrames ?? 0);

  const scenes: SceneTiming[] = drafts.map((d, i) => {
    const next = drafts[i + 1];
    const duration = (next ? next.from : totalFrames) - d.from;
    if (duration <= 0) issues.push(`Scene ${d.id}: non-positive duration (${duration})`);
    const lines: Record<string, number> = {};
    if (d.type !== "sentence") {
      const set = d.type === "outro" ? cfg.outro.lines : cfg.intro.lines;
      for (const l of set) lines[l.id] = at(l.at, `line ${l.id}`) - d.from;
    }
    const s = d.sentenceIndex !== undefined ? cfg.sentences[d.sentenceIndex] : null;
    return {
      ...d,
      duration,
      lines,
      arabicAt: s ? at(s.reveal.arabicAt, `sentence ${s.number} arabic`) - d.from : undefined,
      meaningAt: s ? at(s.reveal.meaningAt, `sentence ${s.number} meaning`) - d.from : undefined,
    };
  });

  for (let i = 1; i < scenes.length; i++) {
    if (scenes[i].from <= scenes[i - 1].from) issues.push(`Scene ${scenes[i].id}: not after previous scene`);
  }
  if (cfg.sentences.length !== cfg.sentenceEnd - cfg.sentenceStart + 1) {
    issues.push("sentence count does not match sentenceStart..sentenceEnd");
  }
  cfg.sentences.forEach((s, i) => {
    if (s.number !== cfg.sentenceStart + i) issues.push(`Sentence order: expected ${cfg.sentenceStart + i}, got ${s.number}`);
  });

  return { scenes, totalFrames, audioFrames, issues };
};
