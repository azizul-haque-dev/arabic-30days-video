const BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
export const toBengaliDigits = (n: number | string): string =>
  String(n).replace(/[0-9]/g, (d) => BN[Number(d)]);

/** Split on "..." pauses, keeping the "..." attached to the unit that precedes it. */
export const splitUnits = (raw: string): string[] =>
  raw
    .split(/(?<=\.\.\.)\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

/** Split a unit into words without breaking hyphenated words. */
export const splitWords = (unit: string): string[] => unit.split(/\s+/).filter(Boolean);
