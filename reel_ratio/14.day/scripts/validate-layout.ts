/**
 * Layout / overlap validator.
 *
 * Bundles src/validate/harness.tsx, serves it locally, opens it in headless Chromium and seeks
 * through the real composition. On every sampled frame it measures every [data-layout] element and
 * fails on:
 *   - text/logo/cta/caption overlapping each other
 *   - text overlapping illustration (art) - art is clipped to its stage card first
 *   - text outside the 70px side margins or the vertical safe area (160..1700)
 *   - text outside its own zone, or text overflowing its own box
 *
 * Usage: npx tsx scripts/validate-layout.ts [--step=3] [--from=0] [--to=N]
 * Chromium: set CHROMIUM_PATH, otherwise Playwright's bundled browser is used
 *           (install once with: npx playwright-core install chromium).
 */
import { build } from "esbuild";
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright-core";
import { theme } from "../src/config/theme";

const arg = (k: string, d: number) => {
  const a = process.argv.find((x) => x.startsWith(`--${k}=`));
  return a ? Number(a.split("=")[1]) : d;
};
const STEP = arg("step", 3);
const ROOT = process.cwd();
const TOL = 0.5;

type Box = { id: string; kind: string; zone?: string; x: number; y: number; w: number; h: number; overflowX: boolean; overflowY: boolean };
const isText = (b: Box) => b.kind !== "art";

const overlapArea = (a: Box, b: Box) => {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return w > TOL && h > TOL ? w * h : 0;
};

(async () => {
  mkdirSync(join(ROOT, "out"), { recursive: true });
  const out = await build({
    entryPoints: [join(ROOT, "src/validate/harness.tsx")],
    bundle: true,
    write: false,
    format: "iife",
    jsx: "automatic",
    platform: "browser",
    define: { "process.env.NODE_ENV": '"production"' },
    logLevel: "error",
  });
  const js = out.outputFiles[0].text;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#fff}</style>
<script>window.remotion_staticBase="/public";</script></head><body><div id="root"></div><script>${js.replace(/<\/script>/g, "<\\/script>")}</script></body></html>`;

  const mime: Record<string, string> = { ".woff2": "font/woff2", ".srt": "text/plain; charset=utf-8", ".png": "image/png", ".mp3": "audio/mpeg" };
  const server = createServer((req, res) => {
    const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
    if (url === "/") { res.writeHead(200, { "content-type": "text/html; charset=utf-8" }); res.end(html); return; }
    if (url.startsWith("/public/")) {
      const p = normalize(join(ROOT, url));
      if (p.startsWith(join(ROOT, "public")) && existsSync(p)) {
        res.writeHead(200, { "content-type": mime[extname(p)] ?? "application/octet-stream" });
        res.end(readFileSync(p));
        return;
      }
    }
    res.writeHead(404); res.end();
  }).listen(0);
  const port = (server.address() as { port: number }).port;

  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on("pageerror", (e) => console.error("[page error]", e.message));
  await page.goto(`http://localhost:${port}/`);
  await page.waitForFunction("window.__api && window.__timeline", undefined, { timeout: 60000 });
  await page.evaluate("document.fonts.ready");
  const tl = (await page.evaluate("window.__timeline")) as { totalFrames: number; scenes: { id: string; from: number; dur: number }[] };

  const L = theme.layout;
  const from = arg("from", 0);
  const to = Math.min(arg("to", tl.totalFrames - 1), tl.totalFrames - 1);
  const frames = new Set<number>();
  for (let f = from; f <= to; f += STEP) frames.add(f);
  // always include the sensitive frames: scene boundaries +/- 1 and the last frame
  for (const s of tl.scenes) for (const d of [-2, -1, 0, 1, 2, 6, 12, s.dur - 10, s.dur - 3]) { const f = s.from + d; if (f >= from && f <= to) frames.add(f); }
  frames.add(to);
  const list = [...frames].sort((a, b) => a - b);

  const problems: string[] = [];
  const add = (f: number, msg: string) => { if (problems.length < 400) problems.push(`frame ${f} (${(f / 30).toFixed(2)}s): ${msg}`); };
  let measured = 0, textBoxes = 0, artBoxes = 0;

  for (const f of list) {
    const { boxes, zones } = (await page.evaluate(`window.__api.seek(${f})`)) as { boxes: Box[]; zones: Record<string, Box> };
    measured++;
    const texts = boxes.filter(isText);
    const arts = boxes.filter((b) => !isText(b));
    textBoxes += texts.length; artBoxes += arts.length;
    for (let i = 0; i < texts.length; i++) {
      const a = texts[i];
      if (a.x < L.marginX - TOL || a.x + a.w > L.W - L.marginX + TOL) add(f, `"${a.id}" breaks the ${L.marginX}px side margin (x=${a.x.toFixed(1)}..${(a.x + a.w).toFixed(1)})`);
      if (a.y < L.safeTop - TOL || a.y + a.h > L.safeBottom + TOL) add(f, `"${a.id}" outside vertical safe area (y=${a.y.toFixed(1)}..${(a.y + a.h).toFixed(1)})`);
      if (a.overflowX || a.overflowY) add(f, `"${a.id}" text overflows its own box`);
      const z = a.zone ? zones[a.zone] : undefined;
      if (z && (a.x < z.x - 1 || a.y < z.y - 1 || a.x + a.w > z.x + z.w + 1 || a.y + a.h > z.y + z.h + 1)) add(f, `"${a.id}" leaves its zone "${a.zone}"`);
      for (let j = i + 1; j < texts.length; j++) if (overlapArea(a, texts[j])) add(f, `text overlap: "${a.id}" x "${texts[j].id}"`);
      for (const r of arts) if (overlapArea(a, r)) add(f, `text/illustration overlap: "${a.id}" x "${r.id}"`);
    }
  }
  await browser.close();
  server.close();

  const summary = { framesChecked: measured, step: STEP, frameRange: [from, to], textBoxMeasurements: textBoxes, artBoxMeasurements: artBoxes, problems: problems.length };
  writeFileSync(join(ROOT, "out/layout-report.json"), JSON.stringify({ summary, problems }, null, 2));
  console.log(JSON.stringify(summary));
  if (problems.length) {
    console.log(problems.slice(0, 60).join("\n"));
    console.log(`\nLAYOUT VALIDATION FAILED (${problems.length} problem(s)). Full list: out/layout-report.json`);
    process.exit(1);
  }
  console.log("LAYOUT VALIDATION PASSED");
})();
