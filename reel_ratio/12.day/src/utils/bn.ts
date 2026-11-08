const D = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
/** 111 -> "১১১" */
export const toBn = (n: number | string): string => String(n).replace(/\d/g, (d) => D[+d]);
