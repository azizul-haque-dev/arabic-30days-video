import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';

const BENGALI = 'U+0951-0952,U+0964-0965,U+0980-09FE,U+1CF7,U+200C-200D,U+20B9,U+25CC';
const ARABIC =
  'U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0898-08E1,U+08E3-08FF,U+200E-200F,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC';
const LATIN =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';

const FACES: {family: string; file: string; weight: string; range: string}[] = [
  {family: 'Hind Siliguri', file: 'hind-siliguri-bengali-600-normal.woff2', weight: '600', range: BENGALI},
  {family: 'Hind Siliguri', file: 'hind-siliguri-bengali-700-normal.woff2', weight: '700', range: BENGALI},
  {family: 'Cairo', file: 'cairo-arabic-700-normal.woff2', weight: '700', range: ARABIC},
  {family: 'Cairo', file: 'cairo-arabic-900-normal.woff2', weight: '900', range: ARABIC},
  {family: 'Cairo', file: 'cairo-latin-700-normal.woff2', weight: '700', range: LATIN},
  {family: 'Cairo', file: 'cairo-latin-900-normal.woff2', weight: '900', range: LATIN},
];

// Fonts are bundled in public/fonts -> works fully offline.
export const loadFonts = () => {
  if (typeof document === 'undefined') return;
  const handle = delayRender('Loading bundled fonts');
  Promise.all(
    FACES.map(async (f) => {
      const face = new FontFace(f.family, `url(${staticFile(`fonts/${f.file}`)}) format('woff2')`, {
        weight: f.weight,
        unicodeRange: f.range,
      });
      await face.load();
      document.fonts.add(face);
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => cancelRender(err));
};
