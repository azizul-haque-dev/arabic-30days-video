/**
 * Programmatic rendering entry point for a future backend/API.
 * NOT part of the normal generate/package workflow (which never renders MP4).
 *
 *   import { renderEpisode } from "./scripts/render-entry";
 *   await renderEpisode({ episodeDir: "episodes/episode-10", outputPath: "out/day-10.mp4",
 *                         audioSrc: "audio/narration.wav" });   // file placed in public/audio/
 */
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { video } from "../src/config/video.config";
import type { EpisodeConfig } from "../src/types";

export interface RenderOptions {
  episodeDir: string;
  outputPath: string;
  compositionId?: string;
  audioSrc?: string; // path inside public/ or an http(s) URL; omit for a silent video
  crf?: number;
  browserExecutable?: string;
}

export async function renderEpisode(o: RenderOptions): Promise<string> {
  const episode = JSON.parse(readFileSync(join(o.episodeDir, "episode.config.json"), "utf8")) as EpisodeConfig;
  const serveUrl = await bundle({ entryPoint: resolve("src/index.ts") });
  const inputProps = { episode, ...(o.audioSrc ? { audioSrc: o.audioSrc } : {}) };
  const composition = await selectComposition({
    serveUrl,
    id: o.compositionId ?? video.compositionId,
    inputProps,
    browserExecutable: o.browserExecutable ?? null,
  });
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    crf: o.crf ?? 18,
    outputLocation: o.outputPath,
    inputProps,
    browserExecutable: o.browserExecutable ?? null,
  });
  return o.outputPath;
}

// CLI: npx tsx scripts/render-entry.ts episodes/episode-10 out/day-10.mp4 [audio/narration.wav]
if (process.argv[1]?.replace(/\\/g, "/").endsWith("scripts/render-entry.ts")) {
  const [dir, out, audio] = process.argv.slice(2);
  if (!dir || !out) {
    console.error("usage: tsx scripts/render-entry.ts <episodeDir> <output.mp4> [audioSrc]");
    process.exit(1);
  }
  renderEpisode({ episodeDir: dir, outputPath: out, ...(audio ? { audioSrc: audio } : {}) })
    .then((p) => console.log("rendered", p))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
