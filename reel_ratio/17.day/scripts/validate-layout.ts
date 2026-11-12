/**
 * Zero-overlap validation in a REAL headless browser (real fonts, real animation frames).
 *   npm run validate:layout                 -> every frame of every episode + thumbnail
 *   npm run validate:layout -- day-17 --step 3   -> every 3rd frame (faster smoke test)
 *
 * No video and no images are produced (imageFormat "none"). The <LayoutProbe/> inside every scene measures
 * the rendered text / art / chrome boxes on each frame and logs "[LAYOUT_VIOLATION]" for:
 *   overlaps, screen-edge clipping, safe-area breaches, animated art escaping its reserved box.
 * Exit code 1 if anything is reported.
 */
import os from "node:os";
import path from "node:path";
import { renderFrames, renderStill } from "@remotion/renderer";
import { findViolations } from "../src/components/LayoutProbe";
import { episodes } from "../src/episodes/registry";
import { prepare } from "./lib/render-env";

const argv = process.argv.slice(2);
const step = Number(argv[argv.indexOf("--step") + 1]) || 1;
const only = argv.find((a) => !a.startsWith("--") && episodes.some((e) => e.episodeId === a));

const selfTest = (): boolean => {
  const safe = { x0: 70, y0: 96, x1: 1010, y1: 1590 };
  const canvas = { w: 1080, h: 1920 };
  const b = (id: string, kind: string, x0: number, y0: number, x1: number, y1: number) => ({ id, kind, x0, y0, x1, y1 });
  const cases: [string, ReturnType<typeof b>[], RegExp | null][] = [
    ["clean layout passes", [b("a", "text", 100, 100, 300, 160), b("b", "text", 100, 160, 300, 220)], null],
    ["overlapping text is caught", [b("a", "text", 100, 100, 300, 170), b("b", "text", 120, 150, 320, 220)], /OVERLAP/],
    ["text over illustration is caught", [b("art", "art", 70, 300, 1010, 900), b("t", "text", 200, 850, 400, 930)], /OVERLAP/],
    ["screen-edge clipping is caught", [b("a", "text", 1000, 100, 1100, 160)], /SCREEN-EDGE/],
    ["safe-area breach is caught", [b("a", "text", 100, 1580, 300, 1640)], /SAFE-AREA/],
    ["animated art escaping its box is caught", [b("art", "art", 70, 300, 1010, 900), b("c", "art-content", 70, 300, 1010, 1010)], /ART-ESCAPE/],
  ];
  let ok = true;
  for (const [name, boxes, expect] of cases) {
    const v = findViolations(boxes, safe, canvas);
    const pass = expect ? v.some((x) => expect.test(x)) : v.length === 0;
    if (!pass) ok = false;
    console.log(`  ${pass ? "PASS" : "FAIL"}  probe self-test: ${name}`);
  }
  return ok;
};

const main = async () => {
  console.log("Layout probe self-test (does the checker actually detect problems?)");
  if (!selfTest()) {
    console.error("Layout checker self-test failed - aborting.");
    process.exit(1);
  }

  let totalViolations = 0;
  for (const ep of episodes) {
    if (only && ep.episodeId !== only) continue;
    const props = { episodeId: ep.episodeId, allowDraft: true, layoutMode: "collect" as const };
    console.log(`\n== ${ep.episodeId}: bundling + opening browser ==`);
    const env = await prepare(ep.episodeId, props);
    const { composition } = env;
    const violations = new Map<string, number[]>();
    const onLog = (l: { text: string }) => {
      const m = /\[LAYOUT_VIOLATION\] (\S+) @frame (\d+): (.*)/.exec(l.text);
      if (!m) return;
      const [, label, frame, rest] = m;
      for (const part of rest.split(" || ")) {
        const key = `${label}: ${part.replace(/\[[^\]]*\]/g, "[..]")}  e.g. ${part}`;
        const arr = violations.get(key) ?? [];
        arr.push(Number(frame));
        violations.set(key, arr);
      }
    };

    // Thumbnail still (frame 0), then every frame of the episode.
    const thumbComp = await (await import("@remotion/renderer")).selectComposition({ serveUrl: env.serveUrl, id: `${ep.episodeId}-thumbnail`, puppeteerInstance: env.browser, logLevel: "error" });
    await renderStill({ composition: thumbComp, serveUrl: env.serveUrl, output: path.join(os.tmpdir(), `${ep.episodeId}-thumb-check.jpg`), imageFormat: "jpeg", jpegQuality: 1, puppeteerInstance: env.browser, logLevel: "error", overwrite: true, onBrowserLog: onLog }).catch((e) => {
      if (!/LAYOUT_VIOLATION/.test(String(e))) throw e;
      onLog({ text: String(e.message ?? e) });
    });

    const frames: number[] = [];
    for (let f = 0; f < composition.durationInFrames; f += step) frames.push(f);
    console.log(`Checking ${frames.length} of ${composition.durationInFrames} frames (${composition.width}x${composition.height} @ ${composition.fps}fps)...`);
    let lastPct = -1;
    for (let start = 0; start < frames.length; ) {
      // render contiguous runs so frameRange can be used
      let end = start;
      while (end + 1 < frames.length && frames[end + 1] === frames[end] + step && step === 1) end++;
      const range: [number, number] = step === 1 ? [frames[start], frames[end]] : [frames[start], frames[start]];
      await renderFrames({
        composition,
        serveUrl: env.serveUrl,
        inputProps: props,
        imageFormat: "none",
        outputDir: null,
        frameRange: range,
        concurrency: Math.max(1, Math.min(4, os.cpus().length)),
        puppeteerInstance: env.browser,
        logLevel: "error",
        onStart: () => undefined,
        onFrameUpdate: () => undefined,
        onBrowserLog: onLog,
      }).catch((e) => {
        if (!/LAYOUT_VIOLATION/.test(String(e))) throw e;
        onLog({ text: String(e.message ?? e) });
      });
      start = end + 1;
      const pct = Math.floor((start / frames.length) * 100);
      if (pct !== lastPct && pct % 10 === 0) {
        console.log(`  ${pct}%`);
        lastPct = pct;
      }
    }
    await env.browser.close({ silent: true });

    if (violations.size === 0) {
      console.log(`PASS  ${ep.episodeId}: no overlap / clipping / safe-area / art-escape violations in ${frames.length} frames`);
    } else {
      for (const [k, fr] of violations) console.log(`FAIL  ${k}  (frames ${fr[0]}..${fr[fr.length - 1]}, ${fr.length} frames)`);
      totalViolations += violations.size;
    }
  }
  if (totalViolations > 0) process.exit(1);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
