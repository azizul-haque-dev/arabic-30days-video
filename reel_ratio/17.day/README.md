# Arabic Master — 30-Day Survival Arabic · Day 17 (Remotion)

Restaurant Communication & Dining · sentences 161–170 · 1080×1920 · 30 fps · TypeScript

## Quick start

```bash
npm install
npm run studio     # opens Remotion Studio (preview/edit)
npm run render     # renders out/video.mp4
```

Both commands first run `scripts/prepare.ts` (audio + SRT detection). `render` also runs the static layout check.

## Adding the narration audio (the only thing you do per episode)

1. Save the narration as **`public/audio.wav`** (exact name).
2. Run `npm run studio` or `npm run render`.

That's all. `scripts/prepare.ts` finds the file, validates the WAV header (sample rate, channels, length) and sets the
composition duration from the audio. The original narration is played as-is — no AI voice is ever generated.

- No `audio.wav` yet → the video is silent and its length is SRT end + `silentTailSec` (works for previewing).
- Studio already open when you drop the file in → run `npm run prepare:episode` once (Studio reloads by itself).
- Audio shorter than the last SRT cue → clear error (wrong audio/SRT pair). Large audio/SRT length mismatch → warning.
- WAV only. Convert MP3 first: `ffmpeg -i narration.mp3 audio.wav`.

## Timing

`public/subtitles/day-17.srt` is the authoritative timing source. Beat text and sentence scenes are keyed to the
referenced SRT cues in `src/episodes/day-17/config.ts` and `sentences.ts`. Timing *inside* a pronunciation cue
(which Bengali unit appears when) is **estimated** from text length — the SRT has no word times. Sentence text
entrances begin 0.3s before their cue so the text is visible when the narration starts.

> If the real audio is longer than the SRT (the last cues, 51–56, are very short), replace the SRT with a re-synced
> one that keeps the same cue order/count, or edit the cue numbers in the config.

## Layout safety (zero overlap)

1. `src/layout/engine.ts` — pure layout engine: reserved regions (header / illustration / learning card), dynamic font
   fitting, controlled wrapping, explicit rectangles for every text box.
2. `npm run validate` — static check of all sentences (regions, margins, edge clipping, overlap, motion envelopes).
   Uses estimated text widths (conservative).
3. In-composition audit (`src/layout/audit.ts`) — measures the **real DOM boxes on every rendered frame** (including
   animation transforms) and fails the render / shows a Studio error on overlap, screen-edge clipping or a broken 70px margin.
4. `npm run audit` — runs that audit across the whole timeline headlessly (every 3rd frame by default; `npm run audit -- 1`
   for every frame). No video is produced.

## Project map

```
public/subtitles/day-17.srt     timing source
public/audio.wav                (you add this)
public/fonts/                   Hind Siliguri, Noto Sans Arabic, Inter (SIL OFL, bundled — works offline)
scripts/prepare.ts              audio + SRT discovery → src/generated/meta.json
scripts/validate-layout.ts      static layout validation
scripts/audit-frames.ts         whole-timeline DOM audit (no video)
scripts/stills.ts               render single PNG frames for review:  npm run stills -- t=32.4 0
src/episodes/day-17/            config.ts, sentences.ts, illustrations/scenes.tsx
src/episodes/active.ts          which episode the project builds
src/components/                 SentenceScene, PronunciationText, ArabicText, MeaningText, ProgressIndicator,
                                VectorIllustration, EpisodeThumbnail, EpisodeIntro, EpisodeOutro, AudioPlayer, SubtitleSync
src/layout/                     engine, measure, audit, keyframes
```

## Next episode

Copy `src/episodes/day-17/` → `day-18/`, edit `config.ts` / `sentences.ts` (units = aligned Bengali + Arabic, cue numbers),
add illustrations, point `src/episodes/active.ts` to it, drop in the new SRT + `public/audio.wav`.

## Notes

- Logo is a vector placeholder in `src/components/Logo.tsx` (the original brand file wasn't available) — swap it there.
- If Remotion can't download Chrome (offline), set `BROWSER_EXECUTABLE` to a Chrome/Chromium path for `stills`/`audit`,
  or `npx remotion render ... --browser-executable=<path>`.
