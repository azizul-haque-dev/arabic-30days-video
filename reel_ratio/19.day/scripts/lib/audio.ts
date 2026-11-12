import fs from "node:fs";
import path from "node:path";
import type { AudioMeta } from "../../src/types";

const EXTS = ["mp3", "wav"] as const;

export interface AudioDiscovery {
  audio: AudioMeta | null;
  expectedPaths: string[];
  warnings: string[];
}

/**
 * Build-time audio discovery. Looks for public/audio/day-<N>.mp3 (preferred) or .wav.
 * Runs in Node only - the browser never scans the filesystem.
 */
export async function discoverAudio(root: string, episode: number): Promise<AudioDiscovery> {
  const warnings: string[] = [];
  const base = `day-${episode}`;
  const expectedPaths = EXTS.map((e) => path.join("public", "audio", `${base}.${e}`));
  const found = EXTS.map((ext) => ({ ext, abs: path.join(root, "public", "audio", `${base}.${ext}`) })).filter(
    (f) => fs.existsSync(f.abs),
  );
  if (found.length === 0) return { audio: null, expectedPaths, warnings };

  if (found.length > 1) warnings.push(`Both ${base}.mp3 and ${base}.wav exist; using .mp3.`);
  const pick = found[0]!;
  const sizeBytes = fs.statSync(pick.abs).size;
  if (sizeBytes === 0) throw new Error(`Audio file is empty: ${path.relative(root, pick.abs)}`);

  let durationInSeconds: number | null = null;
  try {
    const mm = await import("music-metadata");
    const meta = await mm.parseFile(pick.abs, { duration: true });
    durationInSeconds = meta.format.duration ?? null;
  } catch (err) {
    warnings.push(`Could not read audio duration (${(err as Error).message}). Continuing without it.`);
  }
  return {
    audio: { file: `audio/${base}.${pick.ext}`, ext: pick.ext, sizeBytes, durationInSeconds },
    expectedPaths,
    warnings,
  };
}
