# Arabic Master — Episode 07 (Words 61–70)

Editable Remotion project · 1080×1920 · 30 fps · TypeScript. **Not rendered** — open it in Studio or render when you are ready.

## Run
```bash
npm install
npm run studio     # opens Remotion Studio
npm run render     # → out/arabic-master-ep07.mp4
```

## Audio
Save the original narration as **`public/audio.wav`**. It is picked up automatically by that filename
(Studio and render). Without it the project still works (silent).

## Timing = the SRT
`public/reel7complete_ben.srt` is the single source of truth.
After changing the SRT run `npm run sync:srt` → regenerates `src/data/timeline.generated.ts`.

* Arabic RTL reveal + gold highlight start at the **pronunciation cue** start, and end with its end.
* Bangla meaning pops in at the **meaning cue** start; the card leaves at the meaning cue end.
* Cue 8 (`মেয়ে। জাওজ,`) holds two words. It is split: `মেয়ে` at the cue start, `জাওজ` ending at the cue end
  (0.42 s each — `SPLIT_TOKEN_SEC` in `scripts/srt-to-timeline.mjs`).
  If the audio shows `জাওজ` starting at a different moment, change that constant (or edit the generated file).
* Word 10 (رجال) lands exactly on 30.96 s / 32.34 s / 32.80 s.

## Structure
| File | What |
|---|---|
| `src/theme.ts` | colors, fonts, easings, springs, motion constants (one place to restyle) |
| `src/data/lessons.ts` | the 10 words: Arabic (no harakat), Bangla pronunciation, meaning, icon |
| `src/timing.ts` | SRT seconds → frames, scene schedule |
| `src/scenes/ThumbnailScene.tsx` | opening thumbnail (complete from frame 0) |
| `src/scenes/WordScene.tsx` | vocabulary card |
| `src/scenes/OutroScene.tsx` | recap + animated FOLLOW FOR MORE CTA |
| `src/components/Icons.tsx`, `Person.tsx` | vector characters/icons |

`theme.motion.leadInSec` (default 0) can add seconds before the narration if you want a longer thumbnail hold (audio is delayed by the same amount).
Fonts (Noto Sans Arabic, Noto Sans Bengali, Poppins) are bundled in `public/fonts` — works offline.
