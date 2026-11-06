/**
 * API-ready renderer.
 *   CLI:  npx tsx scripts/render.ts --out out/day09.mp4 [--props props.json] [--crf 18] [--codec h264]
 *                                   [--concurrency 4] [--browser /path/to/chrome] [--no-audio]
 *   Code: import { renderEpisode } from "./scripts/render";
 *         await renderEpisode({ outputLocation: "/tmp/job42.mp4", inputProps: {}, onProgress: (p) => ... });
 * Audio is included by default (aac, enforceAudioTrack) and is never muted.
 */
import path from "node:path";
import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const root = path.resolve(__dirname, "..");
const cfg = JSON.parse(fs.readFileSync(path.join(root, "config/video.config.json"), "utf8"));

export type RenderOptions = {
  outputLocation?: string;
  inputProps?: Record<string, unknown>;
  codec?: "h264" | "h265" | "vp8" | "vp9";
  crf?: number;
  concurrency?: number | null;
  browserExecutable?: string | null;
  serveUrl?: string; // pass a pre-built bundle to skip bundling on repeat jobs
  onProgress?: (progress: number) => void;
};

export const renderEpisode = async (o: RenderOptions = {}) => {
  const outputLocation = path.resolve(root, o.outputLocation ?? cfg.render.defaultOutput);
  fs.mkdirSync(path.dirname(outputLocation), { recursive: true });
  const serveUrl = o.serveUrl ?? (await bundle({ entryPoint: path.join(root, cfg.entryPoint) }));
  const browserExecutable = o.browserExecutable ?? process.env.REMOTION_BROWSER_EXECUTABLE ?? null;
  const inputProps = o.inputProps ?? {};
  const composition = await selectComposition({ serveUrl, id: cfg.compositionId, inputProps, browserExecutable });
  await renderMedia({
    composition,
    serveUrl,
    outputLocation,
    inputProps,
    codec: o.codec ?? cfg.render.codec,
    crf: o.crf ?? cfg.render.crf,
    pixelFormat: cfg.render.pixelFormat,
    imageFormat: cfg.render.imageFormat,
    jpegQuality: cfg.render.jpegQuality,
    audioCodec: cfg.render.audioCodec,
    audioBitrate: cfg.render.audioBitrate,
    enforceAudioTrack: cfg.render.enforceAudioTrack,
    muted: cfg.render.muted,
    concurrency: o.concurrency ?? cfg.render.concurrency,
    browserExecutable,
    onProgress: ({ progress }) => o.onProgress?.(progress),
  });
  return { outputLocation, serveUrl, durationInFrames: composition.durationInFrames };
};

const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};

if (require.main === module || process.argv[1]?.endsWith("render.ts")) {
  const propsFile = arg("props");
  const inputProps = propsFile ? JSON.parse(fs.readFileSync(propsFile, "utf8")) : {};
  if (process.argv.includes("--no-audio")) inputProps.audioEnabled = false;
  let last = -1;
  renderEpisode({
    outputLocation: arg("out"),
    inputProps,
    crf: arg("crf") ? Number(arg("crf")) : undefined,
    codec: arg("codec") as RenderOptions["codec"],
    concurrency: arg("concurrency") ? Number(arg("concurrency")) : undefined,
    browserExecutable: arg("browser") ?? null,
    onProgress: (p) => {
      const pct = Math.floor(p * 10) * 10;
      if (pct !== last) { last = pct; console.log(`render ${pct}%`); }
    },
  })
    .then((r) => console.log("DONE", r.outputLocation))
    .catch((e) => { console.error(e); process.exit(1); });
}
