import {parseSrt, SRT_TEXT} from './data/srt';
import {WORDS} from './data/script';

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// ---- thumbnail intro (2 s still card before the reel proper) ----
export const THUMB_FRAMES = 2 * FPS;

// ---- every number below derives from the SRT ----
export const LEAD = 5; // visual enters ~5 frames before the spoken word
export const BOUNDARY_LEAD = 16; // scene boundary sits this far before the scene's first cue
export const WIPE_HALF = 8; // transition wipe is centred on the boundary
export const OUTRO_AFTER = 24; // recap starts shortly after the last cue ends
export const RECAP_FRAMES = 4 * FPS;

// Cue frames are offset by THUMB_FRAMES so the voiceover starts after the thumbnail
export const cues = parseSrt(SRT_TEXT).map((c) => ({
  ...c,
  startF: Math.round(c.start * FPS) + THUMB_FRAMES,
  endF: Math.round(c.end * FPS) + THUMB_FRAMES,
}));

if (cues.length !== WORDS.length) {
  throw new Error(`SRT has ${cues.length} cues but the script has ${WORDS.length} words`);
}

export type SceneId = 'thumbnail' | 'hook' | 'welcome' | 'morning' | 'evening' | 'ask' | 'praise' | 'recap';
const GROUPS: {id: SceneId; cues: number[]}[] = [
  {id: 'hook', cues: [0]},
  {id: 'welcome', cues: [1, 2]},
  {id: 'morning', cues: [3, 4]},
  {id: 'evening', cues: [5, 6]},
  {id: 'ask', cues: [7, 8]},
  {id: 'praise', cues: [9]},
];

const starts = [
  ...GROUPS.map((g, i) => (i === 0 ? THUMB_FRAMES : cues[g.cues[0]].startF - BOUNDARY_LEAD)),
  cues[cues.length - 1].endF + OUTRO_AFTER,
];
export const TOTAL_FRAMES = starts[starts.length - 1] + RECAP_FRAMES;

export type Scene = {id: SceneId; cues: number[]; from: number; to: number};
export const scenes: Scene[] = [
  {id: 'thumbnail', cues: [], from: 0, to: THUMB_FRAMES},
  ...GROUPS.map((g, i) => ({id: g.id, cues: g.cues, from: starts[i], to: starts[i + 1]})),
  {id: 'recap', cues: [], from: starts[starts.length - 1], to: TOTAL_FRAMES},
];
export const sceneById = (id: SceneId) => scenes.find((s) => s.id === id)!;

/** local frame (inside the scene) at which the visual for cue k should enter */
export const cueIn = (k: number, scene: Scene) => cues[k].startF - LEAD - scene.from;

// recap-internal beats (local frames)
export const RECAP = {header: 10, cards: 14, ticks: 44, cta: 80} as const;

// ---- SFX events (limited kit, only on main entrances / transitions) ----
export type SfxName = 'whoosh' | 'pop_a' | 'pop_b' | 'click' | 'chime' | 'thud';
export type SfxEvent = {name: SfxName; frame: number; volume: number};

const recapScene = scenes[scenes.length - 1];
const praise = sceneById('praise');
export const SFX_EVENTS: SfxEvent[] = [
  {name: 'thud' as SfxName, frame: THUMB_FRAMES + 4, volume: 1},
  ...cues.map((c, k): SfxEvent => ({
    name: k % 2 === 0 ? 'pop_a' : 'pop_b',
    frame: c.startF - LEAD,
    volume: 0.88 + (k % 3) * 0.06,
  })),
  ...scenes.slice(1).map((s): SfxEvent => ({name: 'whoosh' as SfxName, frame: s.from - 7, volume: 0.95})),
  {name: 'click' as SfxName, frame: praise.from + cueIn(9, praise) + 16, volume: 0.9},
  {name: 'click' as SfxName, frame: recapScene.from + RECAP.ticks, volume: 0.9},
  {name: 'click' as SfxName, frame: recapScene.from + RECAP.ticks + 9 * 3, volume: 0.8},
  {name: 'chime' as SfxName, frame: recapScene.from + RECAP.cta, volume: 1},
].sort((a, b) => a.frame - b.frame);
