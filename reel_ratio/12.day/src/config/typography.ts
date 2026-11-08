export const FONT_FAMILY = "Hind Siliguri";
export const FONT_STACK = `"${FONT_FAMILY}", "Noto Sans Bengali", "Helvetica Neue", Arial, sans-serif`;
export const ARABIC_STACK = `"Noto Sans Arabic", "${FONT_FAMILY}", sans-serif`;
/** Unicode ranges taken from the @fontsource CSS so Bengali and Latin glyphs resolve to the right subset. */
export const FONT_FILES = [
  { weight: 400, script: "bengali", range: "U+0951-0952,U+0964-0965,U+0980-09FE,U+1CD0,U+1CD2,U+1CD5-1CD6,U+1CD8,U+1CF7,U+200C-200D,U+20B9,U+25CC" },
  { weight: 600, script: "bengali", range: "U+0951-0952,U+0964-0965,U+0980-09FE,U+1CD0,U+1CD2,U+1CD5-1CD6,U+1CD8,U+1CF7,U+200C-200D,U+20B9,U+25CC" },
  { weight: 700, script: "bengali", range: "U+0951-0952,U+0964-0965,U+0980-09FE,U+1CD0,U+1CD2,U+1CD5-1CD6,U+1CD8,U+1CF7,U+200C-200D,U+20B9,U+25CC" },
  { weight: 400, script: "latin", range: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" },
  { weight: 600, script: "latin", range: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" },
  { weight: 700, script: "latin", range: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" },
] as const;
export const fontFile = (weight: number, script: string) => `fonts/hind-siliguri-${script}-${weight}-normal.woff2`;
