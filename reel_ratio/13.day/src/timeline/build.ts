import { episodeConfig as E } from "../config/episode";
import { SentenceContent, beats, sceneStarts, sentences, timingOverrides } from "../episode/content";
import { Cue, normalizeCueText } from "../parsers/srt";
import { ResolvedTime, TimeRef, resolveRef, secToFrame } from "./resolve";

export type PronTiming = { text: string; label: string; startFrame: number; exitAt?: number; pulses: number[] };

export type SceneData =
  | { kind: "hook" }
  | { kind: "brand" }
  | { kind: "episodeIntro"; lineBAt: number }
  | { kind: "topicIntro"; lineBAt: number }
  | {
      kind: "sentence";
      content: SentenceContent;
      arabic: string;
      arabicAt: number;
      pron: PronTiming[];
      meaningAt: number;
    }
  | { kind: "summary"; lineAt: number }
  | { kind: "cta"; commentAt: number }
  | { kind: "outro" };

export type SceneTimeline = {
  id: string;
  from: number;
  durationInFrames: number;
  data: SceneData;
};

export type Timeline = {
  fps: number;
  durationInFrames: number;
  scenes: SceneTimeline[];
  /** every boundary/beat that is a proportional estimate (not an exact SRT time) */
  estimates: string[];
};

const DANDA = "\u0964";

/** Extra pulse (repeat) positions: second occurrence of the Arabic inside a single cue. */
const secondOccurrence = (cue: Cue, arabic: string): number | null => {
  const text = normalizeCueText(cue.text);
  const first = text.indexOf(arabic);
  if (first < 0) return null;
  const second = text.indexOf(arabic, first + arabic.length);
  if (second < 0) return null;
  return cue.start + (second / text.length) * (cue.end - cue.start);
};

export function buildTimeline(cues: Cue[]): Timeline {
  const fps = E.video.fps;
  const estimates: string[] = [];
  const cueOf = (n: number): Cue => {
    const c = cues.find((x) => x.index === n);
    if (!c) throw new Error(`SRT cue ${n} not found.`);
    return c;
  };
  const at = (ref: TimeRef, what: string): ResolvedTime => {
    const r = resolveRef(ref, cues, timingOverrides);
    if (r.estimated) estimates.push(`${what}: ${r.sec.toFixed(2)}s — ${r.source}`);
    return r;
  };
  const frame = (sec: number): number => secToFrame(sec, fps);

  type Start = { id: string; ref: TimeRef; build: (startFrame: number) => SceneData };
  const starts: Start[] = [];

  starts.push({ id: "hook", ref: sceneStarts.hook, build: () => ({ kind: "hook" }) });
  starts.push({ id: "brand", ref: sceneStarts.brand, build: () => ({ kind: "brand" }) });
  starts.push({
    id: "episodeIntro",
    ref: sceneStarts.episodeIntro,
    build: (s) => ({ kind: "episodeIntro", lineBAt: frame(at(beats.episodeLineB, "episodeIntro line B").sec) - s }),
  });
  starts.push({
    id: "topicIntro",
    ref: sceneStarts.topicIntro,
    build: (s) => ({ kind: "topicIntro", lineBAt: frame(at(beats.topicLineB, "topicIntro line B").sec) - s }),
  });

  for (const c of sentences) {
    const ref: TimeRef = typeof c.labelCue === "number" ? { cue: c.labelCue } : c.labelCue;
    starts.push({
      id: `sentence-${c.number}`,
      ref,
      build: (s) => {
        const arabicCue = cueOf(c.arabicCue);
        const arabic = arabicCue.text.split(DANDA)[0].replace(/\s+/g, " ").trim();
        const arabicAt = frame(arabicCue.start) - s;
        const pron: PronTiming[] = c.pronunciations.map((p, vi, all) => {
          const first = cueOf(p.cues[0]);
          const startFrame = frame(first.start) - s;
          const pulses: number[] = [];
          for (const [ci, n] of p.cues.entries()) {
            const cue = cueOf(n);
            if (ci > 0) pulses.push(frame(cue.start) - s);
            const second = secondOccurrence(cue, arabic);
            if (second !== null) {
              estimates.push(`sentence ${c.number} repeat pulse: ${second.toFixed(2)}s — cue ${n} (proportional estimate)`);
              pulses.push(frame(second) - s);
            }
          }
          const next = all[vi + 1];
          const exitAt = next ? frame(cueOf(next.cues[0]).start) - s - 8 : undefined;
          return { text: p.text, label: p.label, startFrame, exitAt, pulses };
        });
        const meaningAt = frame(at(c.meaningAt, `sentence ${c.number} meaning`).sec) - s;
        return { kind: "sentence", content: c, arabic, arabicAt, pron, meaningAt };
      },
    });
  }

  starts.push({
    id: "summary",
    ref: sceneStarts.summary,
    build: (s) => ({ kind: "summary", lineAt: frame(at(beats.summaryLine, "summary line").sec) - s }),
  });
  starts.push({
    id: "cta",
    ref: sceneStarts.cta,
    build: (s) => ({ kind: "cta", commentAt: frame(at(beats.ctaComment, "cta comment").sec) - s }),
  });
  starts.push({ id: "outro", ref: sceneStarts.outro, build: () => ({ kind: "outro" }) });

  const startFrames = starts.map((s) => frame(at(s.ref, `scene ${s.id} start`).sec));
  const lastCue = cues[cues.length - 1];
  const total = Math.ceil(lastCue.end * fps);

  const scenes: SceneTimeline[] = starts.map((s, i) => {
    const from = startFrames[i];
    const end = i + 1 < starts.length ? startFrames[i + 1] : total;
    return { id: s.id, from, durationInFrames: end - from, data: s.build(from) };
  });

  // Validation: ordered, gap-free, long enough, beats inside their scene.
  scenes.forEach((sc, i) => {
    if (sc.durationInFrames < 30) throw new Error(`Scene "${sc.id}" is only ${sc.durationInFrames} frames long.`);
    if (i > 0 && sc.from !== scenes[i - 1].from + scenes[i - 1].durationInFrames) {
      throw new Error(`Gap/overlap between scenes "${scenes[i - 1].id}" and "${sc.id}".`);
    }
    const d = sc.data;
    const beatsInScene: number[] = [];
    if (d.kind === "sentence") beatsInScene.push(d.arabicAt, d.meaningAt, ...d.pron.map((p) => p.startFrame));
    if (d.kind === "episodeIntro" || d.kind === "topicIntro") beatsInScene.push(d.lineBAt);
    if (d.kind === "summary") beatsInScene.push(d.lineAt);
    if (d.kind === "cta") beatsInScene.push(d.commentAt);
    for (const b of beatsInScene) {
      if (b < 0 || b >= sc.durationInFrames) throw new Error(`Beat at local frame ${b} falls outside scene "${sc.id}" (${sc.durationInFrames} frames).`);
    }
  });

  return { fps, durationInFrames: total, scenes, estimates };
}
