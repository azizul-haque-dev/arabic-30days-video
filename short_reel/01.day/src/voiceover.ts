import {staticFile} from 'remotion';

// Voiceover is NOT bundled. Drop it into public/ with one of these names.
export const VOICEOVER_CANDIDATES = ['voiceover.mp3', 'voiceover.wav', 'audio.wav'];

// Studio preview switch (set false to preview without narration).
// A final render always includes the voiceover, and fails loudly if it is missing.
export const PLAY_VOICEOVER_IN_STUDIO = true;

export const findVoiceover = async (): Promise<string | null> => {
  for (const name of VOICEOVER_CANDIDATES) {
    try {
      const res = await fetch(staticFile(name), {method: 'GET'});
      const type = res.headers.get('content-type') ?? '';
      if (res.ok && !type.includes('text/html')) return name;
    } catch {
      /* try next candidate */
    }
  }
  return null;
};
