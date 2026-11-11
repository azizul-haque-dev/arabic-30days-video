# Arabic Master — Day 13 · Market & Taxi (Remotion project)

30 Days Survival Arabic · Sentences 121–130 · Progress 130 / 300 (43.33%) · 1080×1920 · 30 fps · 9:16

> **No video is included and none was rendered.** This ZIP is the editable Remotion project only.

## Status — read this first

| Item | State |
|---|---|
| Source, scenes, 27 SVG illustrations, SRT-driven timeline | included |
| Zero-overlap layout system + browser QA gate | included, passed (see "Quality gates") |
| **Original narration audio** | **NOT included — it was not supplied.** `audio.enabled = false` |
| Scene boundaries *inside* one SRT cue | **proportional estimates**, not exact (see "Timing") |

## Install & preview

```powershell
npm install
npm run dev            # Remotion Studio preview (no render)
```

Fonts come from npm (`@fontsource/hind-siliguri`, `@fontsource/noto-sans-arabic`, `@fontsource/inter`) and are bundled by Remotion, so no system font installation is needed.

## Add the narration (required before the final render)

1. Copy the original narration to `public/audio/narration.wav` (or change `episodeConfig.audio.file`).
2. In `src/config/episode.ts` set `audio.enabled: true`.
3. Check the audio length against the composition length: **4014 frames = 133.80 s** (SRT ends at 133.78 s).

## Timing

* `public/subtitles.srt` is the **only** timing source. `src/parsers/srt.ts` parses it strictly (order, timestamps, overlap, UTF-8 Bengali/Arabic). `Root.tsx` computes duration and every scene boundary from it.
* Scene mapping lives in `src/episode/content.ts` (`sceneStarts`, `beats`, per-sentence cue numbers). Nothing is hard-coded in frames.
* SRT has no word timing. Where a boundary sits **inside** a cue the builder interpolates by character position and lists it as an estimate (`npm run validate:content` prints them):
  `sentence-130 start (cue 37)`, `summary start (cue 39)`, `outro start (cue 42)`, `topic line B (cue 5)`, `meaning of 127/128 (cues 31/34)`, and the "repeat" highlight pulses inside cues 7, 19, 36, 38.
* When you have word timestamps (e.g. from forced alignment of the real audio) put exact seconds into `timingOverrides` (key `"<cue>:<marker>"`) — no other code changes.

## Content rules followed

* Pronunciations and meanings are exactly as supplied, including the two different versions in sentence 122 (`আগরাব` / `আগরাব`, shown as separate labelled states) and the spelling `মাংশ` in sentence 124.
* The Arabic line is taken **from the SRT** (text before the trailing `।`), shown smaller; the Bengali pronunciation is the large, animated focus. Arabic and pronunciation animate word by word and pulse on every repeat.
* No fare, distance, or price is displayed anywhere. The meter shows only an animated "running" state.
* Known source inconsistencies (kept, not silently fixed): SRT cue 33 `بكم المشوار` vs cue 34 `بكم مشوار` (cue 33 is displayed); prompt pronunciation for sentences 122/125/126 does not match the SRT Arabic exactly (e.g. 126 `ليموزين` vs `লেমুজিন`).

## Zero-overlap system

1. **Slots** (`src/config/layout.ts`): every scene has fixed, disjoint regions with ≥16 px gaps, inside a 70 px side / 80 px top / 200 px bottom safe area.
2. **Measured text** (`components/fitWords.ts`): the largest font size that fits the slot is chosen from real font metrics; below the minimum size it **throws** instead of shrinking/overlapping.
3. **Bounded motion** (`animation/motion.ts`): springs are overshoot-clamped and travel ≤ 22 px, smaller than slot padding; scenes are contiguous `Sequence`s, so outgoing and incoming text are never on screen together.
4. **Validation** (`src/utils/layoutValidation.ts`, reusable): geometry rules for text/text, text/illustration, box/box, safe area, slot containment.

## Quality gates (none of them renders video)

```powershell
npm run typecheck          # tsc
npm run validate:content   # SRT, timeline, content, slot maps
npm run validate:layout    # headless Chromium + Remotion Player: measures real DOM boxes on EVERY frame
npx tsx scripts/selftest-layout.ts   # proves the validator fails on deliberate overlaps
```

`validate:layout` needs a Chromium (`CHROMIUM_PATH`, or `npx playwright install chromium`). It writes `qa/layout-report.json`, no images.

## Rendering later (documentation only — not executed)

```bash
npx remotion render src/index.ts ArabicMasterComposition out/day-13.mp4
```

Programmatic (Node.js):

```ts
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const serveUrl = await bundle({ entryPoint: "src/index.ts" });
const composition = await selectComposition({ serveUrl, id: "ArabicMasterComposition" });
await renderMedia({ composition, serveUrl, codec: "h264", outputLocation: "out/day-13.mp4" });
```

(`@remotion/bundler` / `@remotion/renderer` are not installed here; add them with the same version as `remotion` when you build the API.) Composition id, SRT path, audio path and episode data are all in `src/config/episode.ts`.

## Structure

```
public/subtitles.srt         original SRT (authoritative timing)
public/audio/                put narration.wav here
script.md                    generated Bengali script (npx tsx scripts/export-script.ts)
src/config/                  episode, theme, layout slots
src/episode/content.ts       ALL episode prose + SRT cue mapping
src/parsers/srt.ts           strict SRT parser
src/timeline/                cue references -> frames, scene timeline
src/scenes/ components/ illustrations/ animation/
src/utils/layoutValidation.ts
scripts/ qa/                 validation (no rendering)
```

Reusing for Day 14: change `episodeConfig`, `content.ts`, `public/subtitles.srt`, audio.
