import { measureText } from "@remotion/layout-utils";
import type { FontKind, Measurer } from "./engine";
import { theme } from "../theme";

const FAMILY: Record<FontKind, string> = {
  bn: "Hind Siliguri",
  ar: "Noto Sans Arabic",
  en: "Inter",
};

/** Real measurement through the browser (Studio / render). Fonts must be loaded first. */
export const browserMeasure: Measurer = (text, font, size, weight) =>
  measureText({
    text,
    fontFamily: FAMILY[font],
    fontSize: size,
    fontWeight: String(weight),
    validateFontIsLoaded: true,
  }).width;

export const fontFamilyCss = (f: FontKind) => theme.fonts[f];

/**
 * Node-safe conservative estimator used by scripts/validate-layout.ts (no DOM there).
 * Deliberately over-estimates; the real check happens in the browser at render time.
 */
export const estimateMeasure: Measurer = (text, font, size) => {
  let em = 0;
  for (const ch of text) {
    const c = ch.codePointAt(0)!;
    if (ch === " ") em += 0.3;
    else if (c >= 0x0980 && c <= 0x09ff) {
      if (c === 0x09cd) em += 0; // hasanta (joins)
      else if ((c >= 0x09be && c <= 0x09cc) || c === 0x09d7 || c === 0x0981 || c === 0x0982 || c === 0x0983) em += 0.3; // vowel signs
      else em += 0.66; // letters / conjunct share
    } else if (c >= 0x0600 && c <= 0x06ff) {
      em += c >= 0x064b && c <= 0x065f ? 0 : 0.6;
    } else em += 0.62;
  }
  return em * size * 1.08;
};
