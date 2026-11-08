# Arabic Master — Day 12 (Shopping Part 2, sentences 111–120)

Editable Remotion project, 1080×1920 @ 30 fps (9:16). **Nothing in this package has been rendered** — no MP4/WebM/MOV is included.

## Status — read first
- **Narration audio is NOT included.** It was not supplied, so the project is built with `audio.enabled = false`. To add it: copy the file to `public/audio/narration.mp3`, set `"audio": { "enabled": true, ... }` in `episode.config.json`, then `npm run validate`.
- **Visuals have not been viewed frame-by-frame.** The layout is validated mathematically (see below), but no frames were rendered. Do a first look in `npm run studio` before the real render.
- **Timing comes from the SRT, with 16 interpolated scene boundaries (plus interpolated reveal cues).** The SRT has no word-level timing and several entries mix the end of one sentence with the start of the next. Those boundaries are estimated by character position inside the entry. See `docs/timeline-report.md` and fine-tune anchors in `episode.config.json → timeline.scenes` once the real audio is available.
- The SRT is an auto-transcript (Arabic in Devanagari, stray bracketed Russian pause notes). It is used only for timing; all on-screen text comes from `episode.config.json` (the supplied script).

## Quick start
```bash
npm install
npm run studio        # preview in Remotion Studio (opens a browser; does not render a file)
npm run check         # TypeScript + content/SRT/timeline/asset/layout validation (no rendering)
```
Fonts (Hind Siliguri, Noto Sans Arabic) are bundled in `public/fonts` (copied from `@fontsource`; `npm run sync:fonts` re-copies them). No network needed.

## Layout
```
episode.config.json     all episode data: numbers, copy, sentences, illustration layers, SRT anchors
subtitles.srt           original SRT (byte-identical to the supplied file)
script.md               supplied Bengali script (reference)
src/config/episode.ts   loads config + SRT, builds the timeline
src/config/sceneSpecs.ts  every text zone / illustration zone of every scene (validated == rendered)
src/parsers/srt.ts      SRT parser (BOM, CRLF, multiline, timestamp/overlap/gap checks)
src/services/timeline.ts  SRT anchors -> scene frames
src/utils/layoutValidation.ts, fitText.ts   zero-overlap utilities
src/scenes, components, compositions   reusable engine pieces (no episode values hard-coded)
public/assets/illustrations   25 SVGs     public/assets/branding/logo.svg
scripts/validate.ts     QA script     docs/timeline-report.md   generated mapping report
```
After replacing `subtitles.srt` run `npm run sync:srt`.

## Zero-overlap system
Every text element owns a zone; zones are ≥20 px apart, inside a 70 px side margin and a 100 px top / 190 px bottom safe area. Illustration zones are clipped, so animated art cannot leave them. At render time `TextBlock` measures the real font and picks the largest size that fits (explicit line breaks, 1.3–1.4 line height). `npm run validate` runs the same fitting with the real font files and checks text↔text, text↔illustration, text↔panel, safe-area and spacing for all 22 scene layouts (all 10 sentences included). Scenes never overlap in time; each fades out in its last ~10 frames before the next enters.

## Rendering later (not run here)
```bash
npx remotion render src/index.ts ArabicMasterComposition out/day-12.mp4
```
Node API:
```ts
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
const serveUrl = await bundle({ entryPoint: "src/index.ts" });
const composition = await selectComposition({ serveUrl, id: "ArabicMasterComposition" });
await renderMedia({ composition, serveUrl, codec: "h264", outputLocation: "out/day-12.mp4" });
```
(`@remotion/bundler` / `@remotion/renderer` are not installed here — add them in your render service.) Composition ID, audio path and episode data are all configurable in `episode.config.json`.

## Reusing for another episode
Copy the project, edit `episode.config.json` (numbers, copy, sentences, layers, SRT anchors), replace `subtitles.srt`, run `npm run sync:srt && npm run check`.
