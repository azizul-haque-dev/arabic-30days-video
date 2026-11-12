# Arabic Master — 30-Day Survival Arabic — Day 20

Editable Remotion project · 1080×1920 (9:16) · 30 FPS · 5099 frames (≈ 2:49.95, = last SRT timestamp) · Bangla + spoken Gulf Arabic.
Sentences 191–200 · progress 190 → 200 / 300 (66.67%).

> The final MP4 is **not** included. Audio is **not** included yet either — add it whenever you like (see step 2).

## 1. Install
```bash
npm install
```
Requires Node 18+. Fonts (Hind Siliguri, Noto Sans Arabic, Inter) are bundled in `public/fonts/` — no internet needed.

## 2. Add the audio (later is fine)
Save the narration as **`public/audio.wav`** (`public/audio.mp3` also works). That's all — `npm run studio` and `npm run render` detect it automatically via `scripts/prepare-episode.mjs` (it writes `src/generated/audio.ts`). Fallbacks: `public/audio/audio.*`, `public/audio/day-20.*`.

- No audio yet: `studio` previews silently with a yellow banner (never rendered into video).
- `npm run render` without audio stops with an error showing the expected path (`ALLOW_NO_AUDIO=1 npm run render` renders silent).

## 3. Preview
```bash
npm run studio          # prepares audio + SRT, opens Remotion Studio (composition "Day20")
```

## 4. Build the video (only when you want it)
```bash
npm run render        # → out/day-20.mp4 (H.264, CRF 17)
```
Optional: `node scripts/qa-stills.mjs 1080 2400 5000` renders PNG stills (not video) into `out/qa/` for visual checks.
`npm run typecheck` runs TypeScript.

## Structure
```
content/day20.srt            source SRT (69 entries) — timing source of truth
scripts/prepare-episode.mjs  build-time audio discovery + SRT → src/generated/*
src/theme.ts                 design tokens (palette, fonts, layout, easings, springs)
src/episode/day20.ts         Day 20 content (pronunciation, Arabic, meaning, SRT entry mapping)
src/scenes/                  HookScene, IntroScene, SentenceScene, MilestoneScene
src/components/              SentenceCard, PronunciationText, ArabicText, MeaningText,
                             WorkplaceIllustration, EpisodeProgress, Chip, Caption, Backdrop, TopBar …
src/illustrations/           flat-vector kit + 10 sentence illustrations
```
Scene boundaries and every text appearance use SRT start frames (`src/timing.ts`); nothing is animated before its timestamp.

## Layout safety (zero overlap)
Fixed slots on the 1080×1920 canvas: brand bar (y 96) · illustration slot (y 250–830) · sentence card (y 860–1560). Text is measured (`useFittedText`) and the font size is reduced / wrapped inside fixed-height slots, so overflow never turns into overlap. Hierarchy: pronunciation (76–98 px) > Arabic (≤ 60 px) > meaning (≤ 48 px). Arabic uses `dir="rtl"`.

## Review notes (nothing was silently changed)
1. **Prompt timings vs SRT:** the master prompt's scene times (e.g. hook 0:00–0:09, intro to 0:27, milestone from 2:35) don't match the SRT. The SRT was followed: hook 0:00–0:16.2, intro 0:16.25–0:27.3, milestone from 2:30.3 (entry 64).
2. **Sentence 200:** the SRT has no spoken meaning line, so the meaning is revealed when the 2nd pronunciation starts (entry 63). Change `srt.meaning` in `day20.ts` if you prefer another moment.
3. **Sentence 199 `الراتب كويس`:** understood in the Gulf, but locals more often say `الراتب زين`. Kept as supplied — please review (the Bengali "কয়েস" also approximates كويس).
4. **Pronunciations** are exact copies of the SRT (e.g. `আস-সা'আ` keeps its ASCII apostrophe).
5. Documents (Iqama / licence) are generic illustrations with placeholder lines only — no real data or logos.
6. Illustration timings are authored in frames at 30 FPS (the project FPS).
