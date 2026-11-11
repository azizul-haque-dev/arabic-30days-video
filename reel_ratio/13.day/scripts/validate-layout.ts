/**
 * Zero-overlap QA gate. Opens the composition in headless Chromium (via the
 * Remotion Player), steps through frames and validates the REAL DOM boxes:
 * text/text, text/illustration, box/box, safe area, slot containment, clipping.
 * It NEVER renders or encodes a video and writes no images.
 *
 * Run: npm run validate:layout            (every frame)
 *      npm run validate:layout -- --step=3
 * Needs a Chromium: set CHROMIUM_PATH or install via `npx playwright install chromium`.
 */
import * as esbuild from "esbuild";
import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright-core";
import { CANVAS, MIN_GAP, SAFE } from "../src/config/layout";
import { LayoutItem, validateFrame } from "../src/utils/layoutValidation";

const root = resolve(__dirname, "..");
const stepArg = process.argv.find((a) => a.startsWith("--step="));
const step = stepArg ? Number(stepArg.split("=")[1]) : 1;

const findChromium = (): string | undefined => {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  if (process.platform === "win32") {
    for (const p of [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    ]) {
      if (existsSync(p)) return p;
    }
  }
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH ?? "/opt/pw-browsers";
  if (existsSync(base)) {
    for (const d of readdirSync(base).filter((n) => n.startsWith("chromium-"))) {
      for (const rel of ["chrome-linux/chrome", "chrome-linux64/chrome", "chrome-win/chrome.exe", "chrome-mac/Chromium.app/Contents/MacOS/Chromium"]) {
        const p = resolve(base, d, rel);
        if (existsSync(p)) return p;
      }
    }
  }
  return undefined;
};

async function main() {
  esbuild.buildSync({
    entryPoints: [resolve(root, "qa/harness.tsx")],
    bundle: true,
    outfile: resolve(root, "qa/dist/harness.js"),
    loader: {
      ".woff2": "dataurl",
      ".woff": "dataurl",
      ".srt": "text",
    },
    define: {
      "process.env.NODE_ENV": '"development"',
    },
    logLevel: "error",
  });

  const browser = await chromium.launch({ executablePath: findChromium(), args: ["--no-sandbox", "--force-device-scale-factor=1"] });
  const page = await browser.newPage({ viewport: { width: CANVAS.width, height: CANVAS.height }, deviceScaleFactor: 1 });
  const errors: string[] = [];
  page.on("pageerror", (e) => console.error("PAGE ERROR:", e));
  page.on("console", (m) => console.log("PAGE LOG:", m.text()));
  await page.goto(pathToFileURL(resolve(root, "qa/index.html")).href);
  await page.waitForFunction(() => Boolean(window.__qa), undefined, { timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);

  const meta = await page.evaluate(() => ({ total: window.__qa!.total, scenes: window.__qa!.scenes }));
  const failures: Array<{ frame: number; scene: string; message: string }> = [];
  const sceneOf = (f: number) => meta.scenes.find((s) => f >= s.from && f < s.from + s.durationInFrames)?.id ?? "?";
  const frames = new Set<number>();
  for (let f = 0; f < meta.total; f += step) frames.add(f);
  // always include every scene boundary frame and its neighbours
  for (const s of meta.scenes) for (const d of [-2, -1, 0, 1, 2]) { const f = s.from + d; if (f >= 0 && f < meta.total) frames.add(f); }
  frames.add(meta.total - 1);

  let checked = 0;
  let maxItems = 0;
  for (const f of [...frames].sort((a, b) => a - b)) {
    const raw = await page.evaluate((fr) => window.__qa!.measure(fr), f);
    const items: LayoutItem[] = raw.map((r, i) => ({
      id: `${r.id}#${i}`, kind: r.kind as LayoutItem["kind"], box: r.box, slot: r.slot, slotId: r.slotId, opacity: r.opacity,
    }));
    maxItems = Math.max(maxItems, items.length);
    for (const issue of validateFrame(items, CANVAS, SAFE, MIN_GAP)) failures.push({ frame: f, scene: sceneOf(f), message: `[${issue.code}] ${issue.message}` });
    raw.forEach((r) => { if (r.clipped && r.opacity >= 0.04) failures.push({ frame: f, scene: sceneOf(f), message: `[CLIPPED] "${r.id}" content is cropped by its own box` }); });
    const nearBoundary = meta.scenes.some((sc) => Math.abs(f - sc.from) <= 10 || Math.abs(f - (sc.from + sc.durationInFrames - 1)) <= 10);
    if (!nearBoundary && items.filter((i) => i.opacity >= 0.04).length === 0) failures.push({ frame: f, scene: sceneOf(f), message: "[EMPTY] nothing visible in this frame" });
    checked++;
    if (checked % 400 === 0) console.log(`  ...${checked} frames checked`);
  }
  await browser.close();

  const report = { framesChecked: checked, totalFrames: meta.total, step, failures: failures.length, errors, sample: failures.slice(0, 50) };
  writeFileSync(resolve(root, "qa/layout-report.json"), JSON.stringify(report, null, 2));
  console.log(`Checked ${checked}/${meta.total} frames (step ${step}), max ${maxItems} visible items/frame.`);
  if (errors.length) { console.error("Page errors:\n" + errors.slice(0, 10).join("\n")); }
  if (failures.length) {
    const byMsg = new Map<string, { n: number; first: number; scene: string }>();
    failures.forEach((f) => { const k = f.message.replace(/#\d+/g, ""); const e = byMsg.get(k); if (e) e.n++; else byMsg.set(k, { n: 1, first: f.frame, scene: f.scene }); });
    console.error(`\n✗ ${failures.length} layout violations:`);
    [...byMsg.entries()].slice(0, 40).forEach(([m, v]) => console.error(`  x${v.n}  first@${v.first} (${v.scene})  ${m}`));
    process.exit(1);
  }
  if (errors.length) process.exit(1);
  console.log("✓ ZERO overlap, zero clipping, all items inside slots and the safe area on every checked frame.");
}

main().catch((e) => { console.error(e); process.exit(1); });
