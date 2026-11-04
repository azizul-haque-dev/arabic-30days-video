# Survival Arabic — Day 8 (motion graphics, 1080×1080, 30fps)

    npm install
    npx remotion studio
    npx remotion render src/index.ts Main out/video.mp4

- Composition id: `Main` · entry file: `src/index.ts`
- All timing comes from `subtitle.srt` (`node scripts/gen-cues.mjs` regenerates `src/data/cues.ts`).
- Voiceover is required in both Studio and every final render; it loads from `public/voiceover.mp3`.
- SFX live in `public/sfx/` and are included in the render. Run `npm run render` to check all required audio files, render `out/video.mp4`, and verify that the MP4 contains an audio stream. The command fails if audio is missing or cannot be verified.
- Regenerate SFX with `node scripts/generate-sfx.mjs` and check their levels with `node scripts/verify-sfx.mjs`.
- Colours / fonts / easings / springs: `src/theme.ts` only.
