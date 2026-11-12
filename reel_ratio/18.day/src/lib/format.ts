const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export const toBengaliDigits = (value: number | string): string =>
  String(value).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

/** progress in percent, rounded to max 2 decimals, no trailing zeros: 56.67 / 60 */
export const progressPercent = (done: number, total: number): number =>
  Number(((done / total) * 100).toFixed(2));

export const formatPercent = (value: number): string => `${Number(value.toFixed(2))}%`;
