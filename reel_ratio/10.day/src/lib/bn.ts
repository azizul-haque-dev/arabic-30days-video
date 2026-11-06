const BN = "০১২৩৪৫৬৭৮৯";

export const toBn = (n: number | string): string =>
  String(n).replace(/\d/g, (d) => BN[Number(d)] ?? d);

export const fromBn = (s: string): number =>
  Number(s.replace(/[০-৯]/g, (d) => String(BN.indexOf(d))));
