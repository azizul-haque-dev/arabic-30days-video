# Arabic Master - Day 14: Directions & Road Navigation

Remotion project (1080x1920, 30 fps, 9:16). Sentences 131-140. **The video is not rendered; no MP4 is included.**

## Quick start
```bash
npm install
npm run studio          # preview in Remotion Studio, composition: ArabicMasterDay14
npm run render          # render the video to out/day14.mp4
npm run check:timeline  # prints SRT -> scene timing and which beats are estimated
npm run validate:layout # overlap / safe-area validator (needs Chromium, see below)
npm run typecheck
```
Validator browser: `CHROMIUM_PATH=/path/to/chromium npm run validate:layout` or `npx playwright-core install chromium` once.
Single frames for review (PNG only, not video): `npx tsx scripts/stills.ts 0 900 2500`.

## IMPORTANT - status of the source files
| Source | Status |
|---|---|
| SRT (`public/subtitles/day14.srt`) | Included. 38 cues, ends 1:58.9. All timing is derived from it at runtime. |
| Narration audio | Included at `public/audio/voiceover.mp3` and enabled in `src/config/episodeConfig.ts`. Sync has NOT been checked against audio. |
| Original script file | **NOT supplied.** Pronunciations/meanings come from the master prompt. No Arabic phrases are shown because none were in the supplied sources (`arabic?` field exists per sentence). |

### Estimated timing (needs audio to confirm)
Some SRT cues contain several narration beats (e.g. cue 10 holds all of sentence 132). Those beats are placed by character proportion inside the cue (`frac` in `src/config/timeline.ts`). Everything else uses exact cue starts. Run `npm run check:timeline` for the list. Refine the `frac` values after listening to the audio.

### Source mismatches (nothing was changed silently)
- Sentence 136: master prompt gives two different pronunciations (`কাম আল মাছাফাআল মাসাফাহ?` then `কাম আল আল মাসাফাহ?`). The SRT shows the second form both times. Both prompt variants are kept in config; the first is shown at first occurrence, the second at the repeat. Please confirm against audio.
- SRT spells "দিক নির্দেশনা" (prompt: "দিকনির্দেশনা") and "Day 14 Done" (prompt: "DAY 14 DONE!"). Captions show SRT text verbatim; the CTA uses `ctaText`.

## Structure
```
src/config/   episodeConfig.ts (all episode data), timeline.ts (SRT -> scenes), theme.ts (colours, fonts, zones)
src/components/  layout (Zone/TextBox/Art/Stage), art (vector parts), caption, sentencePanel, SentenceScene, fx, brand
src/scenes/   introOutro.tsx, sentences/arts.tsx (10 illustrations)
src/compositions/ArabicMasterDay.tsx
src/validate/ + scripts/  validate-layout.ts, check-timeline.ts, stills.ts
public/       subtitles, fonts (OFL: Hind Siliguri, Noto Sans Arabic, Inter), audio (empty)
```
The `Day14Thumbnail` composition is frame 0 of the video (thumbnail-style opening, never blank).

## Overlap strategy
Text lives only in fixed zones outside the illustration stage; illustrations are clipped to the stage card; scene exits finish before the next scene's entrances; captions use their own zone. `validate-layout.ts` seeks the real composition and measures every text and illustration bounding box (text-text, text-art, side margins 70px, safe area 160-1700, zone containment).
