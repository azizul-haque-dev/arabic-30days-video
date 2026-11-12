// Pure helpers (no Remotion / no fs) — usable from Node scripts AND the browser bundle.
export const timecodeToMs = (tc: string): number => {
  const m = /^(\d{2}):(\d{2}):(\d{2})[.,](\d{3})$/.exec(tc.trim());
  if (!m) throw new Error(`Invalid timecode "${tc}" (expected HH:MM:SS.mmm)`);
  const [, h, mi, s, ms] = m;
  return ((Number(h) * 60 + Number(mi)) * 60 + Number(s)) * 1000 + Number(ms);
};

export const msToTimecode = (ms: number): string => {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const r = Math.round(ms % 1000);
  const p = (n: number, w = 2) => String(n).padStart(w, "0");
  return `${p(h)}:${p(m)}:${p(s)}.${p(r, 3)}`;
};

export const msToFrame = (ms: number, fps: number): number => Math.round((ms / 1000) * fps);
