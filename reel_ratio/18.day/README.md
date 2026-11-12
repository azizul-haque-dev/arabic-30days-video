# Arabic Master — Day 18 · Restaurant & Workplace Communication

Editable Remotion project (React + TypeScript). 1080×1920 · 30 fps · sentences 171–180 ·
progress 170/300 (56.67%) → 180/300 (60%).

**এই প্রজেক্ট ভিডিও render করে না / MP4 তৈরি করে না — শুধু editable source।**

## Quick start (Windows PowerShell / macOS / Linux)

```powershell
npm install
# 1) original narration  → public/audio/day-18.mp3  (or day-18.wav)
# 2) original subtitles  → public/subtitles/day-18.srt
npm run discover-audio      # reads audio metadata → src/generated/audio-manifest.json
npm run validate            # cue table, SRT compare, layout (static), TypeScript
npm run studio              # preview in Remotion Studio
```

Before rendering (done later, via your own API / CLI): `npm run pre-render` — it **fails** if the audio is missing.
Rendering without audio is also blocked in code (`src/components/AudioPlayer.tsx`): silent videos are not allowed.

## Configuration-driven
| What | Where |
|---|---|
| Episode numbers, progress, audio path, logo mode | `src/episodes/day-18/config.ts` |
| All 57 subtitle cues (authoritative timestamps) | `src/episodes/day-18/cues.ts` |
| 10 sentences (Bengali pronunciation, Arabic, meaning, usage) | `src/episodes/day-18/sentences.ts` |
| Visual timeline (scene ↔ cue mapping) | `src/episodes/day-18/timeline.ts` |
| Brand colours, fonts, easing, springs | `src/theme.ts` |

Composition duration = discovered audio duration (never shorter than the last subtitle, 00:02:25.450 → 4364 frames).
Without audio, the Studio uses the SRT end time.

## Layout & hierarchy (zero overlap)
Learning scene (numbers in `src/lib/layout.ts`): label · illustration (y 324–864) · **Bengali pronunciation (largest, 76–104 px)** ·
repeat marks · Arabic (≤ 62 px, RTL) · Bengali meaning (≤ 56 px). Horizontal margin ≥ 70 px.
Text is wrapped/scaled by a deterministic engine (explicit lines, balanced wrapping, no browser-dependent wrapping).

* `npm run validate-layout` — static checks (regions, margins, font scaling, hierarchy). No browser needed.
* `npm run validate-layout:dom` — renders real sample frames headlessly and runs a **bounding-box guard on the actual DOM**
  (text × text, text × art, margins, screen edges). Needs Chrome (Remotion downloads it automatically,
  or pass `-- --browser=/path/to/chrome`). Sample stills go to `out/stills/` (not part of the deliverable).

## Things you must check / replace
1. **Original SRT was not available** — the master prompt contained the timestamps, not the file. `cues.ts` was transcribed from the prompt.
   Put your SRT at `public/subtitles/day-18.srt` and run `npm run parse-subtitles`: it compares all 57 entries and reports every difference.
2. **Original audio is not included.** Put it at `public/audio/day-18.mp3|wav`.
3. **Brand logo** — no logo file was supplied; a vector placeholder mark is used. For the real logo set `logo.mode = "image"`
   in `config.ts` and place `public/assets/logo.png`.
4. **Arabic text** — see the linguistic notes below. Bengali pronunciations and meanings are verbatim from the brief.
5. The Day 19 teaser shows only "DAY 19" (no topic was supplied).

## Linguistic notes (Arabic script ↔ Bengali pronunciation, Gulf Arabic)
All ten renderings are plausible Gulf expressions matching the supplied pronunciation. Points to confirm with an Arabic reviewer —
nothing was silently changed:
* 172 `أبغى حلى` — "হালা" reflects Gulf pronunciation حلا/حلى; both spellings occur.
* 174 `أبغى كاسة ثلج` — "তালজ" (ث pronounced as ت) is common in Gulf speech; formal pronunciation would be "থালজ".
* 177 `دوامي من الصباح` — the Bengali pronunciation has a hyphen (আস-সুবাহ), the others do not; kept as supplied.
* 180 `الكفيل ما رد` — pronunciation "কাফিল" but the meaning line says "কফিল" (as supplied). The visual is neutral (phone + unanswered call).
* `؟` is used in 173 and 179.

## Fonts
Bundled in `public/fonts/` (SIL OFL): **Hind Siliguri** (Bengali/Latin) and **Noto Sans Arabic**. Loaded by `src/lib/fonts.ts`.

## Structure
```
public/{audio,subtitles,fonts,assets}
scripts/{discover-audio,parse-subtitles,validate-layout}.ts
src/components/        SentenceScene, PronunciationText, ArabicText, MeaningText, SectionIntro, IntroScenes, OutroScenes,
                       EpisodeThumbnail, ProgressIndicator, PracticeReminder, AudioPlayer, SubtitleSync, LayoutGuard …
src/episodes/day-18/   config, cues, sentences, timeline, illustrations/
src/compositions/      Day18Video, ThumbnailStill
src/lib/               layout engine, SRT parser, time/format helpers, animation helpers, DOM guard
```
Compositions: `Day18` (video) and `Day18Thumbnail` (still, identical to the video's first frame).
