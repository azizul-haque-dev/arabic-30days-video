/** Normalise text for matching SRT lines with the sentence table. Matching only; display text is never altered. */
export function norm(s: string): string {
  return s
    .normalize("NFC")
    .replace(/[\u200B-\u200D\u2060\uFEFF]/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[।॥.,!?;:"'“”‘’()[\]{}«»…\-–—_؟،]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const A = [...a];
  const B = [...b];
  let prev = Array.from({ length: B.length + 1 }, (_, i) => i);
  for (let i = 1; i <= A.length; i++) {
    const cur = [i];
    for (let j = 1; j <= B.length; j++) {
      const cost = A[i - 1] === B[j - 1] ? 0 : 1;
      cur[j] = Math.min((prev[j] ?? 0) + 1, (cur[j - 1] ?? 0) + 1, (prev[j - 1] ?? 0) + cost);
    }
    prev = cur;
  }
  return prev[B.length] ?? 0;
}

export const similarity = (a: string, b: string): number => {
  const max = Math.max([...a].length, [...b].length) || 1;
  return 1 - levenshtein(a, b) / max;
};
