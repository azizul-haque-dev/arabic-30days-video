# Arabic Master — 30 Days Survival Arabic — Day 09 (Remotion)

Sentences 81–90 · 1080×1920 · 30 fps · 3790 frames (126.33 s) · original narration included.
**No MP4 is included — this is the source project for rendering through your own API.**

## 1. Install
```bash
npm install          # Node 18+; Remotion needs Chrome/Chromium (auto-downloaded, or set REMOTION_BROWSER_EXECUTABLE)
npm run validate     # static QA (audio, SRT, timeline, assets) – renders nothing
```
## 2. Preview
```bash
npm run dev          # Remotion Studio, composition "ArabicMasterDay09" (+ still "ArabicMasterDay09Thumbnail")
```
## 3. Audio
`config/audio.config.json` — source `public/audio/original-voice.wav`, enabled, volume 1, never muted.
Your upload `voiceover.mp3` is actually a WAV (RIFF PCM) file, so it is kept byte-for-byte as `.wav`.
Override per render via input props: `audioFile`, `audioEnabled`, `audioVolume`, `audioStartFromSec`, `musicFile` (background music is off unless supplied).

## 4. Render via API
```ts
import { renderEpisode } from "./scripts/render";
const { outputLocation } = await renderEpisode({
  outputLocation: "/data/jobs/42/day09.mp4",   // 5. output path
  inputProps: { audioEnabled: true },
  crf: 18, concurrency: 4,
  // serveUrl: reuse a bundle across jobs
});
```
CLI: `npx tsx scripts/render.ts --out out/day09.mp4 [--props props.json --crf 18 --concurrency 4 --browser /path/chrome]`
Plain Remotion: `npx remotion render src/index.ts ArabicMasterDay09 out/day09.mp4`
Defaults (codec h264, aac audio, `enforceAudioTrack`) live in `config/video.config.json`.
QA stills only (PNG, no video): `npx tsx scripts/stills.ts out/stills 0 12 30`.

## 6. Reuse for Day 10
1. Replace `public/audio/original-voice.wav` and `input/subtitles.srt`, `input/script.md`; update `config/audio.config.json` (`durationSec`) and `config/video.config.json` (`durationInFrames` = ceil(sec×30)).
2. Edit `src/data/script.json` (episode numbers, sentences, Arabic, pronunciation, meaning, `illustration` key) and add new illustrations in `src/illustrations/` + `index.tsx`.
3. Edit `src/data/scenes.json`: seconds for each scene and the beats `number / arabic / arabic2 / meaning`. Cue starts in the SRT lag the audible onset by ≈0.45 s, so align boundaries to the narration pauses.
4. `npm run validate`, preview, render.

## Notes & flagged inputs
- Script gives Arabic only as Bengali transliteration; the **Arabic script is taken from the SRT** (not invented). Trailing "।" removed, "?" shown as "؟".
- Script has no "Sentence 81" heading; numbering 81–90 follows the SRT/brief.
- Fonts (SIL OFL, bundled in `public/fonts`, via @fontsource): Hind Siliguri 400–700, Noto Sans Arabic 500–700; licences included.
- Structure: `src/components` (BrandLogo, ArabicText, BengaliText[Pronunciation/Meaning], SentenceCard, AnimatedIllustration, ProgressIndicator, Backdrop), `src/scenes` (Thumbnail, Intro, Sentence, Outro), `src/illustrations`, `src/utils` (srtParser, timeline), `src/theme.ts`.
- All animation is frame-based and deterministic; no external assets or network requests.
