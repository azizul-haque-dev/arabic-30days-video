// Single source of truth. No colours, easings, springs or fonts anywhere else.
import {Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/HindSiliguri';

// Bundled via @remotion/google-fonts. For a fully offline machine, also drop
// HindSiliguri-Bold.ttf into public/fonts/ (picked up by FontFace in Root.tsx).
const {fontFamily} = loadFont('normal', {weights: ['500', '700'], subsets: ['bengali', 'latin']});

export const theme = {
  colors: {
    bg: '#EEF8F5',        // মিন্ট ফ্রেশ - background
    primary: '#0E9F6E',   // hero (max one hero element per frame)
    accent: '#F59E0B',
    text: '#10231D',
    textDim: '#4B6A60',
    surface: '#FFFFFF',
    primarySoft: '#D4F0E5',
    accentSoft: '#FDF0D2',
    line: '#CFE5DC',
    shadow: '#10231D',
  },
  fonts: {
    display: `'HS Local', ${fontFamily}, 'Noto Sans Bengali', sans-serif`,
    body: `'HS Local', ${fontFamily}, 'Noto Sans Bengali', sans-serif`,
  },
  weight: {title: 700, body: 500},
  radius: {card: 44, pill: 999, small: 24},
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: {damping: 14, stiffness: 160, mass: 0.6},
    smooth: {damping: 20, stiffness: 90, mass: 1},
    bouncy: {damping: 11, stiffness: 170, mass: 0.7},
  },
} as const;

export const FPS = 30;
export const W = 1920;
export const H = 1080;
