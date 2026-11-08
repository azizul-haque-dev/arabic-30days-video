# Arabic Master — Day 11 · Shopping (কেনাকাটা)

Remotion project for **30 Days Survival Arabic**, Day 11, sentences **101–110** (110 / 300 · 36.67 %).
1080 × 1920 · 30 fps · 9:16. This ZIP contains the **source project only, no rendered video**.

## Status

| Item | State |
|---|---|
| 15 scenes (thumbnail, brand, episode intro, topic, 10 sentences, outro) | Done |
| Timeline built from `subtitles.srt` | Done |
| Original narration audio | **Not supplied yet.** Wired in but disabled (see below) |
| Visual check in Remotion Studio | Not done yet. Nothing was rendered while building |

## Quick start

```bash
npm install
npm run check      # TypeScript + content/SRT/timeline/asset validation (no rendering)
npm run studio     # preview in Remotion Studio
```

## Adding the narration audio

1. Put the file at `public/audio/narration.mp3` (or change `assets.audio.file`).
2. In `episode.config.json` set `"assets": { "audio": { "enabled": true } }`.
3. Optional: `offsetSec` shifts the audio against the timeline, `volume` sets the level.

When enabled, the composition length becomes `max(SRT end + tail, audio duration)`.
The narration is never muted, re-timed or replaced. Background music is off.

## How timing works

`subtitles.srt` is the timing authority; `episode.config.json` (+ `script.md`) is the content authority.
Everything on screen comes from the script, never from SRT text. Differences found:

* SRT uses Latin digits / English words (`30`, `size`, `try`, `topic`, `রং`); the script uses `৩০`, `সাইজ`, `ট্রাই`, `টপিক`, `রঙ`. The script wins.
* All 10 sentence pronunciations match the SRT. No pronunciation fixes were needed.
* Outro: the script says “১০টি দরকারি **সৌদি** আরবি বাক্য”, but the SRT (the spoken audio) has no “সৌদি”. The script is shown as supplied. Your terminology rule prefers *Gulf Arabic*, so decide whether to change this text and re-record or edit.

Each timing anchor in `episode.config.json` is `{ cue, offsetSec }` (relative to an SRT cue) or `{ sec, cue, estimated: true }`.
Estimated anchors are used where one SRT cue holds several spoken parts (merged cues). They are:
sentence 103 meaning, 105 start (no “Sentence 105” cue), 106 pronunciation and meaning, 107 start, 109 meaning,
the intro and outro line splits, and the brand/episode/topic scene starts.
Adjust those seconds by ear once the audio is available. `npm run validate` checks each anchor lies inside its cue.

SRT timestamps are subtitle timing, not word-level timing, so synchronisation is not claimed as exact.

## Structure

```
episode.config.json   all episode data, scene anchors, audio settings
script.md             supplied Bengali + Arabic script (verified against config)
subtitles.srt         authoritative timing (copy in public/ is what Remotion loads)
public/fonts          Hind Siliguri + Noto Sans Arabic (woff2, OFL licence files included)
public/audio          drop narration.mp3 here
src/parsers           SRT parser + validation
src/services          timeline builder (SRT → scene frames)
src/components        motion primitives (backdrop stack, Enter, WordReveal, ArabicLine, ProgressRing…)
src/scenes            Thumbnail, Intro scenes, SentenceScene (reusable), OutroScene
src/illustrations     original SVG/React illustrations, one per sentence + shopping cluster
scripts/validate.ts   checks, never renders
```

To make another episode: copy the project, replace `episode.config.json`, `script.md`, `subtitles.srt`, the audio, and add or adjust illustrations.

## Future rendering (not run here)

```bash
npx remotion render src/index.ts ArabicMasterComposition out/arabic-master-day-11.mp4 --codec h264
```

Node API:

```ts
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const serveUrl = await bundle({ entryPoint: "src/index.ts" });
const composition = await selectComposition({ serveUrl, id: process.env.COMPOSITION_ID ?? "ArabicMasterComposition" });
await renderMedia({ composition, serveUrl, codec: "h264", outputLocation: process.env.OUTPUT_PATH ?? "out/day-11.mp4" });
```

Composition id comes from `compositionId` in the config; output path is whatever you pass.
Fonts are bundled locally (`@font-face` + `staticFile`), so rendering needs no network.
