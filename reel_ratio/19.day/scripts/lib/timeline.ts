import type { EpisodeContent, SceneAnchorKey, SceneTiming, SentenceEvent } from "../../src/types";
import { msToSec, type SrtEntry } from "./srt";
import { norm, similarity } from "./text";

export interface BuildOptions {
  lenient: boolean;
  fps: number;
}

export interface BuildResult {
  scenes: SceneTiming[];
  durationSec: number;
  warnings: string[];
  errors: string[];
  info: string[];
}

interface Role {
  pos: number; // index in content.sentences
  kind: "pron" | "meaning";
}

const MIN_SCENE_SEC = 1.0;

/**
 * Builds scene timing from REAL SRT timestamps only.
 * Sentence scenes are located by matching SRT text with the sentence table.
 * Intro/section/challenge/outro boundaries are prompt hints snapped to real SRT entry starts.
 */
export function buildTimeline(entries: SrtEntry[], content: EpisodeContent, opts: BuildOptions): BuildResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const info: string[] = [];
  const sentences = content.sentences;
  const lastPos = sentences.length - 1;
  const soft = (msg: string) => (opts.lenient ? warnings : errors).push(msg);

  if (entries.length === 0) {
    return { scenes: [], durationSec: 0, warnings, errors: ["SRT has no entries."], info };
  }

  const srtEndSec = msToSec(Math.max(...entries.map((e) => e.endMs)));
  const startSec = (i: number) => msToSec(entries[i]!.startMs);

  /* ---- sanity vs. expected episode facts ---- */
  if (entries.length !== content.expected.srtEntries) {
    soft(`SRT has ${entries.length} entries, expected ${content.expected.srtEntries}. Is this the right Day ${content.episode} SRT?`);
  }
  if (Math.abs(srtEndSec - content.expected.durationSec) > content.expected.durationToleranceSec) {
    soft(
      `SRT ends at ${srtEndSec.toFixed(3)}s, expected about ${content.expected.durationSec}s (±${content.expected.durationToleranceSec}s).`,
    );
  }

  /* ---- match each SRT entry to sentence pronunciation / meaning ---- */
  const ignore = new Set(content.overrides?.ignoreEntries ?? []);
  const keys = sentences.flatMap((s, pos) => [
    { pos, kind: "pron" as const, key: norm(s.pronunciation) },
    { pos, kind: "meaning" as const, key: norm(s.meaning) },
  ]);
  const matchEntry = (text: string): Role[] => {
    const t = norm(text);
    let hits = keys.filter((k) => k.key.length > 0 && t.includes(k.key));
    hits = hits.filter((h) => !hits.some((o) => o !== h && o.key.length > h.key.length && o.key.includes(h.key)));
    return hits.map(({ pos, kind }) => ({ pos, kind }));
  };
  const matches: Role[][] = entries.map((e) => (ignore.has(e.index) ? [] : matchEntry(e.text)));

  /* ---- walk entries in order: sentences 1..N, then a backward jump = quick challenge ---- */
  let curPos = -1;
  let challengeFirstIdx = -1;
  for (let i = 0; i < entries.length && challengeFirstIdx === -1; i++) {
    for (const m of matches[i]!) {
      if (curPos === lastPos && m.pos < curPos) {
        challengeFirstIdx = i;
        break;
      }
      if (curPos === -1) {
        if (m.pos !== 0) {
          errors.push(
            `SRT entry #${entries[i]!.index} matches sentence ${sentences[m.pos]!.number} before sentence ${sentences[0]!.number}. ` +
              `If it is intro narration, add ${entries[i]!.index} to overrides.ignoreEntries in content.ts.`,
          );
          continue;
        }
        curPos = 0;
      } else if (m.pos > curPos + 1) {
        errors.push(`SRT entry #${entries[i]!.index} jumps to sentence ${sentences[m.pos]!.number} but sentence ${sentences[curPos + 1]!.number} has not appeared yet.`);
      } else if (m.pos < curPos) {
        errors.push(
          `SRT entry #${entries[i]!.index} goes back to sentence ${sentences[m.pos]!.number} while sentence ${sentences[curPos]!.number} is current. ` +
            `Add it to overrides.ignoreEntries if it is not a sentence line.`,
        );
      } else {
        curPos = m.pos;
      }
    }
  }
  if (challengeFirstIdx === -1) {
    errors.push("Could not find the Quick Challenge in the SRT (no entry repeats an earlier sentence after the last sentence).");
  }

  const sentenceEnd = challengeFirstIdx === -1 ? entries.length : challengeFirstIdx;
  const hits: { idx: number; kind: "pron" | "meaning" }[][] = sentences.map(() => []);
  for (let i = 0; i < sentenceEnd; i++) {
    for (const m of matches[i]!) {
      if (m.pos <= curPos) hits[m.pos]!.push({ idx: i, kind: m.kind });
    }
  }

  const suggest = (target: string): string => {
    const t = norm(target);
    const best = entries
      .map((e) => ({ e, s: similarity(norm(e.text), t) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 2)
      .map((x) => `#${x.e.index} "${x.e.text.replace(/\n/g, " ")}" (${Math.round(x.s * 100)}%)`);
    return best.join("; ");
  };

  sentences.forEach((s, pos) => {
    const h = hits[pos]!;
    if (!h.some((x) => x.kind === "pron")) {
      errors.push(`Sentence ${s.number}: pronunciation "${s.pronunciation}" not found in SRT. Closest: ${suggest(s.pronunciation)}`);
    }
    if (!h.some((x) => x.kind === "meaning")) {
      errors.push(`Sentence ${s.number}: meaning "${s.meaning}" not found in SRT. Closest: ${suggest(s.meaning)}`);
    }
  });

  if (errors.length > 0 && sentences.some((_, p) => hits[p]!.length === 0)) {
    return { scenes: [], durationSec: srtEndSec, warnings, errors, info };
  }

  const firstIdx = sentences.map((_, p) => Math.min(...hits[p]!.map((x) => x.idx)));
  const lastSentenceEntryIdx = Math.max(...hits[lastPos]!.map((x) => x.idx));

  /* ---- quick challenge items ---- */
  const items: { sentence: number; entryIdx: number }[] = [];
  let from = Math.max(challengeFirstIdx, 0);
  for (const num of content.challengeSentences) {
    const pos = sentences.findIndex((s) => s.number === num);
    let found = -1;
    for (let i = from; i < entries.length; i++) {
      if (matches[i]!.some((m) => m.pos === pos && m.kind === "meaning")) {
        found = i;
        break;
      }
    }
    if (found === -1) {
      errors.push(`Quick Challenge: meaning of sentence ${num} not found after the sentences. Closest: ${suggest(sentences[pos]!.meaning)}`);
      break;
    }
    items.push({ sentence: num, entryIdx: found });
    from = found + 1;
  }
  if (errors.length > 0) return { scenes: [], durationSec: srtEndSec, warnings, errors, info };

  /* ---- snapping helpers ---- */
  const idxOfEntryNo = (n: number) => entries.findIndex((e) => e.index === n);
  const nearest = (cands: number[], target: number): number | null =>
    cands.length === 0
      ? null
      : cands.reduce((best, i) => (Math.abs(startSec(i) - target) < Math.abs(startSec(best) - target) ? i : best));
  const forced = (k: SceneAnchorKey): number | null => {
    const n = content.overrides?.sceneStartEntries?.[k];
    if (n === undefined) return null;
    const i = idxOfEntryNo(n);
    if (i === -1) errors.push(`overrides.sceneStartEntries.${k} = ${n} does not exist in the SRT.`);
    return i === -1 ? null : i;
  };
  const range = (a: number, b: number) => Array.from({ length: Math.max(0, b - a + 1) }, (_, k) => a + k);

  const s0 = startSec(firstIdx[0]!);

  /* intro / section boundaries (inside the region before sentence 1) */
  let introStart: number | null = null;
  let sectionStart: number | null = null;
  {
    const fi = forced("intro");
    const preIdx = range(0, firstIdx[0]! - 1).filter((i) => startSec(i) > 0.5);
    const i1 = fi ?? nearest(preIdx, content.sceneAnchorsSec.intro);
    if (i1 !== null) {
      introStart = startSec(i1);
      const fs2 = forced("section");
      const cand2 = preIdx.filter((i) => startSec(i) > introStart! + MIN_SCENE_SEC && startSec(i) < s0 - 0.5);
      const i2 = fs2 ?? nearest(cand2, content.sceneAnchorsSec.section);
      if (i2 !== null) sectionStart = startSec(i2);
    }
  }
  if (introStart === null) warnings.push("No SRT entry available to start the Intro scene; Opening covers the whole pre-lesson region.");
  else if (sectionStart === null) warnings.push("No SRT entry available to start the Section-title scene; Intro runs until sentence 1.");

  /* challenge / outro boundaries */
  const lastItemIdx = items[items.length - 1]!.entryIdx;
  const firstItemIdx = items[0]!.entryIdx;
  let challengeStart: number;
  {
    const fc = forced("challenge");
    const cands = range(lastSentenceEntryIdx + 1, firstItemIdx);
    const i = fc ?? nearest(cands, content.sceneAnchorsSec.challenge) ?? firstItemIdx;
    challengeStart = Math.min(startSec(i), startSec(firstItemIdx));
  }
  let outroStart: number;
  {
    const fo = forced("outro");
    const cands = range(lastItemIdx + 1, entries.length - 1);
    const i = fo ?? nearest(cands, content.sceneAnchorsSec.outro);
    if (i === null) {
      errors.push("No SRT entry exists after the last Quick Challenge item to start the Practice Reminder / CTA scene.");
      return { scenes: [], durationSec: srtEndSec, warnings, errors, info };
    }
    outroStart = startSec(i);
  }
  if (errors.length > 0) return { scenes: [], durationSec: srtEndSec, warnings, errors, info };

  /* ---- assemble scenes (seconds) ---- */
  const durationSec = srtEndSec;
  const fps = opts.fps;
  const frameOf = (sec: number) => Math.round(sec * fps);
  const totalFrames = Math.ceil(durationSec * fps);

  type DistOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
  type Raw = DistOmit<SceneTiming, "startFrame" | "endFrame">;
  const raw: Raw[] = [];

  const openingEnd = introStart ?? s0;
  let splitSec: number | null = null;
  {
    const lo = openingEnd * 0.25;
    const hi = openingEnd * 0.75;
    const cands = range(0, entries.length - 1).filter((i) => startSec(i) > lo && startSec(i) < hi && startSec(i) < openingEnd);
    const i = nearest(cands, openingEnd / 2);
    splitSec = i === null ? null : startSec(i);
  }
  raw.push({ type: "opening", splitSec, startSec: 0, endSec: openingEnd });
  if (introStart !== null) raw.push({ type: "intro", startSec: introStart, endSec: sectionStart ?? s0 });
  if (sectionStart !== null) raw.push({ type: "section", startSec: sectionStart, endSec: s0 });

  sentences.forEach((s, pos) => {
    const evs: SentenceEvent[] = hits[pos]!
      .slice()
      .sort((a, b) => a.idx - b.idx)
      .map((h) => ({
        kind: h.kind,
        entry: entries[h.idx]!.index,
        startSec: msToSec(entries[h.idx]!.startMs),
        endSec: msToSec(entries[h.idx]!.endMs),
      }));
    const start = startSec(firstIdx[pos]!);
    const end = pos === lastPos ? challengeStart : startSec(firstIdx[pos + 1]!);
    raw.push({ type: "sentence", number: s.number, events: evs, startSec: start, endSec: end });

    const covered = new Set(hits[pos]!.map((h) => h.idx));
    const extra = range(firstIdx[pos]!, entries.length - 1).filter((i) => startSec(i) < end && !covered.has(i));
    if (extra.length > 0) {
      info.push(`Sentence ${s.number}: ${extra.length} SRT line(s) inside its window are not sentence text and are not displayed (entries ${extra.map((i) => "#" + entries[i]!.index).join(", ")}).`);
    }
  });

  raw.push({
    type: "challenge",
    startSec: challengeStart,
    endSec: outroStart,
    items: items.map((it, k) => ({
      sentence: it.sentence,
      startSec: startSec(it.entryIdx),
      endSec: k === items.length - 1 ? outroStart : startSec(items[k + 1]!.entryIdx),
    })),
  });
  raw.push({ type: "outro", startSec: outroStart, endSec: durationSec });

  /* ---- monotonic + minimum duration checks ---- */
  for (let i = 0; i < raw.length; i++) {
    const r = raw[i]!;
    if (r.endSec - r.startSec < MIN_SCENE_SEC) {
      const label = r.type === "sentence" ? `sentence ${r.number}` : r.type;
      errors.push(`Scene "${label}" is only ${(r.endSec - r.startSec).toFixed(2)}s long (${r.startSec}s → ${r.endSec}s). Check SRT matching or anchors.`);
    }
    if (i > 0 && r.startSec < raw[i - 1]!.startSec) errors.push(`Scene order broken at "${r.type}".`);
  }

  const scenes = raw.map((r, i) => {
    const startFrame = i === 0 ? 0 : frameOf(r.startSec);
    const endFrame = i === raw.length - 1 ? totalFrames : frameOf(raw[i + 1]!.startSec);
    return { ...r, startFrame, endFrame } as SceneTiming;
  });

  return { scenes, durationSec, warnings, errors, info };
}
