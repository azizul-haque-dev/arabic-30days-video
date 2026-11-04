# Arabic Master – Day 08 (Remotion)

## Setup
```bash
npm install
```

## Preview
```bash
npx remotion studio src/index.ts
```

## Render (1080x1920, 30fps, H.264)
```bash
npx remotion render src/index.ts Day8 out/day8.mp4 --codec h264 --crf 17
```
Note: `remotion.config.ts` sets a browser path for the sandbox. Delete the
`Config.setBrowserExecutable(...)` line on your own machine.

## Where to edit
- `src/timeline.ts` : sentence texts, Bengali pronunciation (DRAFT), SRT-based timings
- `src/theme.ts` : colors, fonts, sizes (type.arabic = 72, type.pronLarge/Mid/Small = 124/114/104)
- `src/illustrations/` : SVG illustrations
- `src/scenes/` : thumbnail, intro, sentence card, outro
