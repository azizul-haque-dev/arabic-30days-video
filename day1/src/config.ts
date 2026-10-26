// Project switches. Everything timing-related comes from the SRT (see timeline.ts).
export const CONFIG = {
  fps: 30,
  width: 1080, // 1:1
  height: 1080,
  voiceover: {
    enabled: true, // play public/voiceover.mp3 in Remotion Studio preview (silently skipped if the file is missing)
    includeInRender: false, // keep false: the rendered MP4 carries SFX only
    file: "voiceover.mp3",
  },
  sfxMaster: 1,
};
