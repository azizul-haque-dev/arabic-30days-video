import audio from "./audio-config.json";

// Project switches. Everything timing-related comes from the SRT (see timeline.ts).
export const CONFIG = {
  fps: 30,
  width: 1080, // 1:1
  height: 1080,
  voiceover: audio.voiceover,
  sfxEnabled: audio.sfx.enabled,
  sfxMaster: 1,
};
