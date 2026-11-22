# Arabic Master – Reel 6 (Pronouns + Family) · Remotion project

1080×1920 · 30 fps · vertical vocabulary-card motion graphics.
12 vocabulary items, driven entirely by the SRT timestamps.

## Quick start

```bash
npm install
# 1. Put your narration here (exact filename):
#    public/audio.wav
npm run studio     # live preview
npm run render     # -> out/arabic-master-reel6.mp4 (H.264, CRF 17)
```

`studio` and `render` first run `scripts/sync-media.mjs`, which
- parses the `.srt` in `public/` into `src/data/generated/cues.json`
- detects `public/audio.wav` and sets the video length to the audio length
  (no audio yet → silent preview, length = last cue + 1 s)

You never edit the generated files by hand.

## Structure

```
public/
  reel_6-complete_ben.srt   original SRT (source of truth for timing)
  audio.wav                 <- add your narration here (played untouched from frame 0)
  fonts/                    Noto Sans Arabic + Noto Sans Bengali (bundled, offline)
scripts/sync-media.mjs      SRT + audio -> generated JSON
src/
  theme.ts                  palette, easings, springs, fonts, layout (single source)
  data/vocab.ts             Arabic text + icon + SRT cue numbers per item
  lib/timeline.ts           cues -> frame timeline
  components/VocabCard.tsx  card animation (staggered entrance, highlight, exit)
  components/Subtitles.tsx  exact SRT text at exact SRT time
  components/Layers.tsx     background shapes, grade, grain, vignette
  components/icons/         SVG characters and indicators (no emoji, no images)
  VocabVideo.tsx, Root.tsx  composition
```

## How timing works

- Card *n* appears on the frame its pronunciation cue starts and leaves on the frame the next card starts.
- Arabic, icon and divider follow in a 4-frame stagger; the Bangla meaning appears on its own cue's start.
- Cue 23 ("উম্মি আমার মা।") is a single cue, so the meaning appears 0.55 s into it
  (`meaningOffsetSec` in `src/data/vocab.ts`).
- Subtitles show the SRT text exactly as written, only for each cue's own time range.

## Editing

- Change an Arabic spelling or icon: `src/data/vocab.ts`
- New SRT: replace the `.srt` in `public/`, then keep `pronCue` / `meaningCue` numbers in `vocab.ts` matching.
- Colors / springs / layout: `src/theme.ts`

## Arabic forms used (Gulf, one consistent spelling each)

أنا · أنتَ · أنتِ · هو · هي · إحنا · أنتو · هم · أب · أبوي · أم · أمي

Please check two against your lesson: **أنتو** for ইনতু (plural "you") and **هم** for হুম্মা.

## Rendering offline / in CI

Remotion downloads a headless Chrome on first use. If your machine blocks that, run
`npx remotion browser ensure` once with internet, or pass `--browser-executable=/path/to/chrome`.
