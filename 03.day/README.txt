1) npm install
2) npx remotion studio
3) npm run render

Render runs an audio preflight, requires voiceover and sound effects to be enabled,
checks the configured audio files, and verifies that out/video.mp4 contains an audio stream.
Do not use the internal render:remotion script directly; use npm run render.

voiceover: public/voiceover.mp3 (preview and final render)
timing: public/audio.srt -> src/srt.ts (SRT বদলালে src/srt.ts-এর টেক্সট আপডেট করুন)
