import { normalizeText, type SrtEntry } from "../parsers/srt";
import type { Anchor, EpisodeConfig, Timeline, TimelineScene } from "../types";

interface Resolved { sec: number; source: string }

/**
 * Resolve an anchor to seconds using ONLY the SRT:
 *  - {sec}           explicit time
 *  - {entry}         start time of that SRT entry (exact)
 *  - {entry, text}   position of `text` inside that entry, linearly interpolated over the entry's
 *                    duration by character offset (the SRT has no word-level timing, so this is an
 *                    estimate - it is reported as such). Missing text is an error, never a guess.
 */
export function resolveAnchor(a: Anchor, entries: SrtEntry[], errors: string[], label: string): Resolved {
  if ("sec" in a) return { sec: a.sec, source: `fixed ${a.sec}s` };
  const e = entries.find((x) => x.index === a.entry);
  if (!e) { errors.push(`${label}: SRT entry ${a.entry} does not exist`); return { sec: 0, source: "missing" }; }
  if (!a.text) return { sec: e.startSec, source: `entry ${e.index} start (exact)` };
  const norm = normalizeText(e.text);
  const idx = norm.indexOf(a.text);
  if (idx < 0) { errors.push(`${label}: text "${a.text}" not found in SRT entry ${e.index}`); return { sec: e.startSec, source: "missing" }; }
  const sec = e.startSec + (idx / norm.length) * (e.endSec - e.startSec);
  return { sec, source: `entry ${e.index} "${a.text}" (interpolated ${Math.round((idx / norm.length) * 100)}% into ${e.startSec.toFixed(2)}-${e.endSec.toFixed(2)}s)` };
}

export function buildTimeline(cfg: EpisodeConfig, entries: SrtEntry[]): Timeline {
  const fps = cfg.video.fps;
  const warnings: string[] = [];
  const errors: string[] = [];
  const defs = cfg.timeline.scenes;
  const starts = defs.map((d) => resolveAnchor(d.start, entries, errors, `scene ${d.id}`));
  const lastEnd = entries.length ? entries[entries.length - 1].endSec : 0;
  const total = Math.ceil((lastEnd + cfg.tailSeconds) * fps);
  const scenes: TimelineScene[] = [];
  defs.forEach((d, i) => {
    const startFrame = Math.round(starts[i].sec * fps);
    const endFrame = i + 1 < defs.length ? Math.round(starts[i + 1].sec * fps) : total;
    const cues: Record<string, number> = {};
    const cueSources: Record<string, string> = {};
    for (const [name, anchor] of Object.entries(d.cues ?? {})) {
      const r = resolveAnchor(anchor, entries, errors, `scene ${d.id} cue ${name}`);
      cues[name] = Math.max(0, Math.round(r.sec * fps) - startFrame);
      cueSources[name] = r.source;
    }
    scenes.push({ id: d.id, kind: d.kind, group: d.group, sentence: d.sentence, startFrame, endFrame, durationFrames: endFrame - startFrame, cues, startSource: starts[i].source, cueSources });
  });
  // sanity rules
  scenes.forEach((s, i) => {
    if (s.durationFrames <= 0) errors.push(`scene ${s.id}: non-positive duration (${s.durationFrames} frames)`);
    if (i > 0 && s.startFrame !== scenes[i - 1].endFrame) errors.push(`scene ${s.id}: gap/overlap with previous scene`);
    const dur = s.durationFrames / fps;
    if (s.kind === "sentence" && dur < 4) warnings.push(`scene ${s.id}: only ${dur.toFixed(2)}s long`);
    else if (dur < 1.5) warnings.push(`scene ${s.id}: very short (${dur.toFixed(2)}s)`);
    if (s.kind === "sentence") {
      const { pron, meaning, alt } = s.cues;
      if (pron === undefined || meaning === undefined) errors.push(`scene ${s.id}: missing pron/meaning cue`);
      else {
        // keep reveal order readable: pronunciation after the number/illustration settle, meaning after pronunciation
        const minPron = Math.round(0.5 * fps);
        s.cues.pron = Math.min(Math.max(pron, minPron), s.durationFrames - 2 * fps);
        s.cues.meaning = Math.min(Math.max(meaning, s.cues.pron + Math.round(0.8 * fps)), s.durationFrames - Math.round(0.6 * fps));
        if (alt !== undefined) s.cues.alt = Math.min(Math.max(alt, s.cues.pron + Math.round(0.6 * fps)), s.cues.meaning - Math.round(0.3 * fps));
        if (s.cues.meaning >= s.durationFrames) errors.push(`scene ${s.id}: meaning cue is outside the scene`);
      }
    }
  });
  if (scenes.length && scenes[0].startFrame !== 0) errors.push("first scene must start at frame 0");
  return { fps, totalFrames: total, scenes, warnings, errors };
}
