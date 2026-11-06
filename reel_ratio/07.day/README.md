# Arabic Master — Day 7 (Sentences 61–70)

Remotion project: 1080×1920, 30 fps, H.264, original voice-over untouched.

## Run
```bash
npm install
npm start          # Remotion Studio preview
npm run render     # -> out/Arabic-Master-Day7.mp4
```
If Remotion cannot download Chromium, pass `--browser-executable=/path/to/chrome`.

## How it is built
- `src/srt.ts` – your SRT (single source of truth for timing).
- `src/timing.ts` – parses the SRT and derives, per sentence: narration marker, 1st repeat,
  2nd repeat, "অর্থ" (meaning) start and end. Cue text is interpolated by character position,
  so word highlights follow the narration to within a fraction of a second.
  Scene boundaries (`BOUNDARIES`) drive every cut and shape-wipe.
- `src/content.ts` – Bengali pronunciation, Bengali meaning and Arabic text per sentence.
  To fix a word, edit it here.
- `src/theme.ts` – palette, easings, springs, fonts, safe areas.
- `src/scenes/Intro.tsx`, `Outro.tsx`, `SentenceScene.tsx` – scene layouts.
- `src/scenes/ill/part1.tsx`, `part2.tsx` – the ten animated vector illustrations.
- `public/` – voiceover, bundled fonts (Poppins, Noto Sans Bengali, Noto Naskh Arabic),
  grain texture, small synthesized SFX kit (`npm run assets` regenerates them).

## Notes
- Your prompt lists a 2:30 timeline; the real audio is 1:57 (117.3 s), so the SRT/audio
  timestamps are used instead of the prompt's time ranges.
- The SRT contains a few transcription glitches (e.g. "তাফFi", mixed Arabic letters in Bengali words).
  On-screen text uses the cleaned pronunciations/meanings from your brief.
- Frame 0 is a complete thumbnail-style design (no fade-in). The progress counter shows 70/300 on
  the thumbnail, rewinds to 60 when the narrator says 60 are learned, then climbs back to 70.
