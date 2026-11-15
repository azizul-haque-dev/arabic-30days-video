# Arabic Master Reel (1080x1920, 30fps)

## Render
```
npm install
npm run render        # -> out/arabic-master.mp4
npm start             # Remotion Studio-te preview
```

## Voice add korte
1. Voice file (jemon `voice.mp3`) `public/` folder e rakho
2. `src/data.ts` e `VOICE_FILE = "voice.mp3"` koro
3. Voice-er upor pop sound na chaile `SFX_ENABLED = false`

## Edit korar jayga: `src/data.ts`
- Page name / tagline, phrase text, SRT timing (startMs / endMs)
- Duration auto: last cue + CTA tail (`CTA_TAIL_SEC`)
- Colors: `src/theme.ts`
