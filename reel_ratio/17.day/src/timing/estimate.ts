/** Rough speech-duration model for Bengali narration (used only when no audio/SRT cues exist). */
export const estimateSeconds = (text: string): number => {
  const letters = Array.from(text.replace(/[\s.…—–:;,!?।\-]/g, "")).length;
  const pauses =
    (text.match(/\.\.\./g)?.length ?? 0) * 0.45 +
    (text.match(/—/g)?.length ?? 0) * 0.2 +
    (text.match(/[।?!]/g)?.length ?? 0) * 0.25 +
    (text.match(/,/g)?.length ?? 0) * 0.15;
  return 0.35 + letters / 11 + pauses;
};
