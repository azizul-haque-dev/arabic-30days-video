const BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** 13 -> "১৩" */
export const toBn = (n: number | string): string =>
  String(n).replace(/\d/g, (d) => BN[Number(d)]);

/** 43.33 -> "43.33", 40 -> "40" (no trailing zeros) */
export const formatPercent = (n: number): string => n.toFixed(2).replace(/\.?0+$/, "");

export const percentOf = (part: number, total: number): number => (part / total) * 100;
