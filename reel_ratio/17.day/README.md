# Arabic Master - Remotion project (Day 17: Restaurant Communication & Dining)

30-Day Survival Arabic - Episode **Day 17** - sentences **161-170** - 1080x1920 (9:16) - 30 fps - TypeScript.
Progress shown: intro **160/300 (53.33%)**, outro **170/300 (56.67%)**.

> This project is **render-ready but not rendered**. No MP4 is included.

## Quick start

```bash
npm install
npm run dev          # discovers audio/SRT, then opens Remotion Studio
```

### Narration audio workflow (automatic)

1. Drop the original narration at `public/audio/day-17.mp3` (or `.wav`, `.m4a`, `.aac`, `.ogg`).
2. *(Optional but recommended)* drop the SRT at `public/subtitles/day-17.srt`.
3. `npm run dev` (or `npm run discover`) - a Node build-time script scans `public/`, validates the file
   (duration, sample rate, channels, codec) and writes `src/generated/manifest.json`. The browser never touches the filesystem.
   `npm run dev` also **watches** `public/audio` and `public/subtitles`, so Studio hot-reloads when you add a file.
4. The composition length = audio duration. The original narration is played with `<Html5Audio>`. Nothing is synthesised.

Paths are configuration-driven (`src/episodes/day-17/config.ts` -> `audioDir`, `subtitleDir`, `audioExtensions`). For a new
episode you never edit audio paths in components.

**If audio is missing**: Studio opens in *DRAFT* mode (estimated timing, yellow banner shown in Studio only) so you can design/preview,
but `npm run render:day-17` and any `remotion render` **fail with a clear error** - a silent video is never produced.

### Timing: what is verified and what is estimated

| Situation | Cue source | Status |
|---|---|---|
| Audio + SRT, every narration beat matched | SRT timestamps | **verified** |
| Audio + SRT, some beats not matched | SRT + interpolation | partly estimated (warning printed) |
| Audio, no SRT | speech-gap analysis (energy/silence) snapped onto a text-length estimate | **approximate, NOT verified** |
| No audio | text-length estimate | **draft only** |

`npm run discover` prints the source and every warning. Pauses inside a phrase ("..." in `আল-হিসাব... লাও সামাহত।`) are located from
the longest silent gaps inside the phrase window when audio exists; otherwise split by text weight. A phrase that the narrator repeats
(detected from repeated SRT cues) pulses a highlight once per repetition. Use `syncOffsetSec` in the config to shift all cues.

## Validation

```bash
npm run typecheck        # tsc --noEmit
npm run validate:config  # episode data (161-170, progress maths, narration/units) + timing-engine self-tests (incl. SRT round-trip)
npm run validate:layout  # REAL-browser zero-overlap check on every frame (slow: use `-- day-17 --step 5` for a quick pass)
npm run validate         # all three
```

`validate:layout` bundles the project, opens headless Chromium and renders every frame with `imageFormat: "none"` (no images/video).
Inside each scene a `<LayoutProbe/>` measures the **rendered** boxes (text via real glyph extents + line slot, SVG art via the union of
its visible geometry) and reports: overlaps, screen-edge clipping, safe-area breaches (70px side margins, 330px empty bottom) and animated art
escaping its reserved box. It first runs a self-test proving the checker detects each failure type. During a real render
the same probe **aborts the render** with the offending boxes (`layoutMode: "throw"`).
Text animations use scale/fade only (never vertical offsets) so animated text can't leave its slot.

Set `REMOTION_BROWSER_EXECUTABLE=/path/to/chrome` if Remotion cannot download its own Chromium (offline CI).

## Rendering (when you are ready)

```bash
npm run render:day-17          # strict: needs audio, runs layout validation first, then renders out/day-17.mp4
npm run still:thumbnail        # PNG of the thumbnail (this is a still, not a video)
npm run stills -- day-17 100,950,1700   # QA PNGs of chosen frames -> out/stills/
```

## Structure

```
public/audio, public/subtitles    drop narration + SRT here
public/fonts                      Hind Siliguri, Noto Sans Arabic, Inter (SIL OFL - see public/fonts/licenses)
scripts/discover-audio.ts         audio/SRT discovery + validation + speech analysis -> src/generated/manifest.json
scripts/dev.ts                    discover + watch + Remotion Studio
scripts/validate-config.ts        static data checks + timing self-tests
scripts/validate-layout.ts        browser-based zero-overlap validation
src/episodes/types.ts             data types (pure TS)
src/episodes/registry.ts          list of episodes (add Day 18 here)
src/episodes/day-17/              config.ts (series data, narration, progress), sentences.ts (all 10 sentences)
src/timing/                       SRT parser, text<->cue aligner, estimator, buildTimeline
src/layout/learningLayout.ts      dynamic font-size + controlled line wrapping from real font metrics
src/components/                   SentenceScene, PronunciationText, ArabicText, MeaningText, ProgressIndicator,
                                  VectorIllustration, EpisodeIntro, EpisodeThumbnail, EpisodeOutro, AudioPlayer,
                                  SubtitleSync, LayoutProbe, Logo, ...
src/illustrations/                vector art primitives + one scene per sentence
src/compositions/EpisodeVideo.tsx scene sequencing driven by the timeline
```

### Add the next episode
Copy `src/episodes/day-17/` to `day-18/`, edit `config.ts`/`sentences.ts`, register it in `src/episodes/registry.ts`, add
`public/audio/day-18.mp3`. Composition id = episode id. Components contain no sentence-specific text.

### Notes
- **Logo**: the project had no logo asset, so `src/components/Logo.tsx` draws a placeholder mark (green tile with the letter ع + wordmark).
  Replace that one component with your real artwork; every scene uses it.
- **Display hierarchy**: Bengali pronunciation (largest) > Bengali meaning > Arabic (smaller, RTL, directly under its pronunciation unit).
  Font sizes are calculated per sentence from the loaded fonts and the available height; Arabic is always smaller (enforced in code).
- `showCaptions: true` in the config enables an optional caption strip from the SRT.
