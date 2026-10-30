import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

// ফন্ট অফলাইনে চলে: public/fonts-এর woff2 ফাইল (Hind Siliguri) থেকে লোড হয়।
const RANGES = {
  bengali:
    'U+0951-0952,U+0964-0965,U+0980-09FE,U+1CD0,U+1CD2,U+1CD5-1CD6,U+1CD8,U+1CE1,U+1CEA,U+1CED,U+1CF2,U+1CF5-1CF7,U+200C-200D,U+20B9,U+25CC,U+A8F1',
  latin:
    'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
};

export const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const jobs: Promise<unknown>[] = [];
    for (const w of [500, 600, 700]) {
      for (const subset of ['bengali', 'latin'] as const) {
        const face = new FontFace('Hind Siliguri', `url(${staticFile(`fonts/hind-siliguri-${subset}-${w}-normal.woff2`)}) format('woff2')`, {
          weight: String(w),
          style: 'normal',
          unicodeRange: RANGES[subset],
        });
        jobs.push(face.load().then((f) => (document.fonts as unknown as {add: (x: FontFace) => void}).add(f)));
      }
    }
    Promise.all(jobs)
      .catch((e) => console.error('font load failed', e))
      .finally(() => continueRender(handle));
  }, [handle]);
};
