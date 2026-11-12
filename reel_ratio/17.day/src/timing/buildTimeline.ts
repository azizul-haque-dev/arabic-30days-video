import type { EpisodeConfig } from "../episodes/types";
import { splitUnits } from "../lib/format";
import { alignBeatsToCues, dice, normalizeForMatch } from "./align";
import { estimateSeconds } from "./estimate";
import type {
  BeatSpec,
  EpisodeManifestEntry,
  Gap,
  SceneTiming,
  SentenceTiming,
  TimedBeat,
  Timeline,
  TimingSource,
} from "./types";

const MIN_BEAT_SEC = 0.25;

export const buildBeatSpecs = (config: EpisodeConfig): BeatSpec[] => {
  const specs: BeatSpec[] = [];
  config.intro.forEach((b, i) =>
    specs.push({ id: b.id, scene: "intro", sceneId: "intro", role: `intro-${i + 1}`, narration: b.narration }),
  );
  for (const s of config.sentences) {
    specs.push({ id: `${s.id}-lead`, scene: "sentence", sceneId: s.id, role: "lead", narration: s.narration.lead });
    specs.push({ id: `${s.id}-phrase`, scene: "sentence", sceneId: s.id, role: "phrase", narration: s.narration.phrase });
    specs.push({ id: `${s.id}-meaning`, scene: "sentence", sceneId: s.id, role: "meaning", narration: s.narration.meaning });
  }
  config.outro.forEach((b, i) =>
    specs.push({ id: b.id, scene: "outro", sceneId: "outro", role: `outro-${i + 1}`, narration: b.narration }),
  );
  return specs;
};

/** Make starts strictly increasing with a minimum beat length, staying inside [0, duration]. */
const enforceMonotonic = (starts: number[], duration: number): number[] => {
  const n = starts.length;
  const out = [...starts];
  out[0] = 0;
  for (let i = 1; i < n; i++) out[i] = Math.max(out[i], out[i - 1] + MIN_BEAT_SEC);
  // pull back from the end if we overflowed
  for (let i = n - 1; i >= 1; i--) {
    const maxStart = duration - MIN_BEAT_SEC * (n - i);
    if (out[i] > maxStart) out[i] = maxStart;
  }
  for (let i = 1; i < n; i++) out[i] = Math.max(out[i], out[i - 1] + 1e-3);
  return out;
};

const estimatedStarts = (specs: BeatSpec[], from: number, to: number): number[] => {
  const w = specs.map((s) => estimateSeconds(s.narration));
  const total = w.reduce((a, b) => a + b, 0);
  let acc = 0;
  return w.map((x) => {
    const start = from + ((to - from) * acc) / total;
    acc += x;
    return start;
  });
};

const snapToGaps = (specs: BeatSpec[], est: number[], gaps: Gap[]): { starts: number[]; snapped: boolean[] } => {
  const starts = [...est];
  const snapped = specs.map(() => false);
  const used = new Set<number>();
  for (let i = 1; i < specs.length; i++) {
    const prevDur = est[i] - est[i - 1];
    const nextDur = (est[i + 1] ?? est[i] + prevDur) - est[i];
    const window = Math.min(2.2, 0.5 * Math.min(prevDur, nextDur) + 0.4);
    let best = -1;
    let bestScore = -Infinity;
    gaps.forEach((g, gi) => {
      if (used.has(gi)) return;
      const dist = Math.abs(g.endSec - est[i]);
      if (dist > window) return;
      if (g.endSec <= starts[i - 1] + MIN_BEAT_SEC) return;
      const score = (g.endSec - g.startSec) - 0.15 * dist;
      if (score > bestScore) {
        bestScore = score;
        best = gi;
      }
    });
    if (best >= 0) {
      used.add(best);
      starts[i] = gaps[best].endSec;
      snapped[i] = true;
    }
  }
  return { starts, snapped };
};

const interpolateMissing = (starts: (number | null)[], specs: BeatSpec[], duration: number): number[] => {
  const n = starts.length;
  const out = starts.map((s) => s);
  if (out[0] === null) out[0] = 0;
  let i = 0;
  while (i < n) {
    if (out[i] !== null) {
      i++;
      continue;
    }
    let j = i;
    while (j < n && out[j] === null) j++;
    const left = out[i - 1] as number;
    const right = j < n ? (out[j] as number) : duration;
    const weights = specs.slice(i - 1, j).map((s) => estimateSeconds(s.narration));
    const total = weights.reduce((a, b) => a + b, 0);
    let acc = weights[0];
    for (let k = i; k < j; k++) {
      out[k] = left + ((right - left) * acc) / total;
      acc += weights[k - i + 1] ?? 0;
    }
    i = j;
  }
  return out as number[];
};

const buildSentenceTiming = (
  unitsCount: number,
  pronunciation: string,
  phraseStart: number,
  phraseEnd: number,
  sentenceStart: number,
  sentenceEnd: number,
  entry: EpisodeManifestEntry | undefined,
  phraseSource: TimingSource,
): SentenceTiming => {
  // Unit starts
  let unitStartsSec: number[] = [phraseStart];
  let unitsSource: TimingSource = "estimated";
  if (unitsCount > 1) {
    const gaps = (entry?.analysis?.gaps ?? []).filter(
      (g) => g.startSec > phraseStart + 0.15 && g.endSec < phraseEnd - 0.1 && g.endSec - g.startSec >= 0.12,
    );
    if (gaps.length >= unitsCount - 1) {
      const top = [...gaps].sort((a, b) => b.endSec - b.startSec - (a.endSec - a.startSec)).slice(0, unitsCount - 1);
      top.sort((a, b) => a.startSec - b.startSec);
      unitStartsSec = [phraseStart, ...top.map((g) => g.endSec)];
      unitsSource = "audio-analysis";
    } else {
      const units = pronunciation.split(/(?<=\.\.\.)\s*/).filter(Boolean);
      const weights = units.map((u) => Array.from(u.replace(/[\s.]/g, "")).length + (u.endsWith("...") ? 2 : 0));
      const total = weights.reduce((a, b) => a + b, 0);
      let acc = 0;
      unitStartsSec = weights.map((w) => {
        const t = phraseStart + ((phraseEnd - phraseStart) * acc) / total;
        acc += w;
        return t;
      });
    }
  } else {
    unitsSource = phraseSource;
  }

  // Emphasis pulses = one per repetition of the phrase in the SRT (if any)
  let emphasisSec: number[] = [phraseStart];
  const cues = entry?.subtitles?.cues ?? [];
  if (cues.length) {
    const target = normalizeForMatch(pronunciation);
    const reps = cues
      .filter((c) => c.startSec >= sentenceStart - 0.01 && c.startSec < sentenceEnd)
      .filter((c) => dice(normalizeForMatch(c.text), target) >= 0.6 && normalizeForMatch(c.text).length <= target.length * 1.6)
      .map((c) => c.startSec);
    if (reps.length > 1) emphasisSec = reps;
  }
  return { unitStartsSec, emphasisSec, unitsSource };
};

export const buildTimeline = (
  config: EpisodeConfig,
  entry: EpisodeManifestEntry | undefined,
  fps: number,
): Timeline => {
  const specs = buildBeatSpecs(config);
  const warnings: string[] = [];
  const hasAudio = !!entry?.audio;
  const estimatedTotal = specs.reduce((a, s) => a + estimateSeconds(s.narration), 0);
  const durationSec = hasAudio ? entry!.audio!.durationSec : estimatedTotal;

  let starts: number[];
  const sources: TimingSource[] = specs.map(() => "estimated");
  let overall: TimingSource = "estimated";
  let verified = false;

  const cues = entry?.subtitles?.cues ?? [];
  if (cues.length) {
    const matches = alignBeatsToCues(specs, cues);
    const matched = matches.filter(Boolean).length;
    const raw = matches.map((m) => (m ? m.startSec : null));
    starts = interpolateMissing(raw, specs, durationSec);
    matches.forEach((m, i) => {
      if (m) sources[i] = "srt";
    });
    overall = "srt";
    verified = matched === specs.length;
    if (!verified) {
      warnings.push(
        `SRT: ${matched}/${specs.length} narration beats matched confidently; the other ${specs.length - matched} beats are interpolated (estimated).`,
      );
    }
    const lastCue = cues[cues.length - 1];
    if (hasAudio && lastCue.endSec > durationSec + 1) {
      warnings.push(`SRT runs ${(lastCue.endSec - durationSec).toFixed(1)}s past the end of the audio - check the subtitle file belongs to this audio.`);
    }
  } else if (entry?.analysis) {
    const a = entry.analysis;
    const est = estimatedStarts(specs, a.speechStartSec, Math.max(a.speechEndSec, a.speechStartSec + 1));
    const { starts: snapped, snapped: flags } = snapToGaps(specs, est, a.gaps);
    starts = snapped;
    flags.forEach((f, i) => {
      if (f) sources[i] = "audio-analysis";
    });
    overall = "audio-analysis";
    warnings.push("No SRT supplied: cue timing is APPROXIMATE (speech-gap analysis + text-length estimate), not verified.");
  } else {
    starts = estimatedStarts(specs, 0, durationSec);
    warnings.push(
      hasAudio
        ? "Audio found but no SRT and no speech analysis: cue timing is ESTIMATED from text length scaled to the audio duration."
        : "DRAFT: no audio found - the whole timeline is ESTIMATED from text length. Drop the narration into public/audio/ and re-run.",
    );
  }

  starts = enforceMonotonic(starts.map((s) => s + config.syncOffsetSec), durationSec);
  starts[0] = 0;

  const durationInFrames = Math.max(1, Math.ceil(durationSec * fps));
  const beats: TimedBeat[] = specs.map((s, i) => {
    const startSec = starts[i];
    const endSec = starts[i + 1] ?? durationSec;
    const startFrame = Math.min(durationInFrames - 1, Math.round(startSec * fps));
    const endFrame = i === specs.length - 1 ? durationInFrames : Math.max(startFrame + 1, Math.round(endSec * fps));
    return { ...s, startSec, endSec, startFrame, endFrame, source: sources[i] };
  });

  // Scenes
  const scenes: SceneTiming[] = [];
  for (const b of beats) {
    const last = scenes[scenes.length - 1];
    if (last && last.id === b.sceneId) last.endFrame = b.endFrame;
    else scenes.push({ id: b.sceneId, kind: b.scene, startFrame: b.startFrame, endFrame: b.endFrame });
  }

  // Sentence timings
  const sentenceTimings: Record<string, SentenceTiming> = {};
  for (const s of config.sentences) {
    const lead = beats.find((b) => b.id === `${s.id}-lead`)!;
    const phrase = beats.find((b) => b.id === `${s.id}-phrase`)!;
    const meaning = beats.find((b) => b.id === `${s.id}-meaning`)!;
    sentenceTimings[s.id] = buildSentenceTiming(
      splitUnits(s.pronunciation).length,
      s.pronunciation,
      phrase.startSec,
      phrase.endSec,
      lead.startSec,
      meaning.endSec,
      entry,
      phrase.source,
    );
  }

  const intro1 = beats[0];
  const thumbSec = Math.max(0.6, Math.min(config.thumbnailHoldSec, 0.7 * (intro1.endSec - intro1.startSec)));
  const thumbnailEndFrame = Math.round(thumbSec * fps);

  return {
    episodeId: config.episodeId,
    fps,
    durationSec,
    durationInFrames,
    source: overall,
    verified,
    hasAudio,
    thumbnailEndFrame,
    beats,
    scenes,
    sentenceTimings,
    warnings,
  };
};
