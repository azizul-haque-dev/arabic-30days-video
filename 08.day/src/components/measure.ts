// Measures real text width (after fonts are loaded) so Arabic phrases are split into balanced lines and sized to fit.
const cache = new Map<string, number>();
let ctx: CanvasRenderingContext2D | null = null;

export const textWidth100 = (text: string, family: string, weight: number): number => {
  const key = `${weight}|${family}|${text}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  if (!ctx) ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return text.length * 62;
  ctx.font = `${weight} 100px ${family}`;
  const w = ctx.measureText(text).width;
  cache.set(key, w);
  return w;
};

// split words into L lines minimising the widest line
const splits = (words: string[], L: number): string[][][] => {
  if (L === 1) return [[words]];
  const out: string[][][] = [];
  for (let k = 1; k <= words.length - (L - 1); k++) {
    for (const rest of splits(words.slice(k), L - 1)) out.push([words.slice(0, k), ...rest]);
  }
  return out;
};

export const layoutLines = (text: string, family: string, weight: number, width: number, maxSize: number, maxH: number, lineHeight = 1.35) => {
  const words = text.split(" ");
  let best: {lines: string[]; size: number; widest: number} | null = null;
  for (let L = 1; L <= Math.min(3, words.length); L++) {
    let cand: {lines: string[]; size: number; widest: number} | null = null;
    for (const split of splits(words, L)) {
      const lines = split.map((w) => w.join(" "));
      const widest = Math.max(...lines.map((l) => textWidth100(l, family, weight))) * 1.05;
      const size = Math.min(maxSize, (width / widest) * 100, maxH / (L * lineHeight));
      if (!cand || size > cand.size + 0.5 || (Math.abs(size - cand.size) <= 0.5 && widest < cand.widest)) cand = {lines, size, widest};
    }
    // prefer fewer lines unless more lines give a clearly larger size
    if (cand && (!best || cand.size > best.size * 1.22)) best = cand;
  }
  return best!;
};
