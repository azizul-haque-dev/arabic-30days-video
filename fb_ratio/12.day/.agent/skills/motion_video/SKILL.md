---
name: remotion-motion-graphics
description: Create, improve, and verify professional Remotion motion graphics videos using React and TypeScript. Use for promos, Reels, Shorts, animated typography, transitions, captions, compositing, rendering, and motion-design reviews.
---

# Remotion Motion Graphics — Gemini Universal Instruction File

> **Use this document as the primary instruction for any Gemini environment** (Gemini CLI, Google Antigravity, Gemini web/Custom Gem, or another Gemini-powered coding agent). For environments with a single instruction/system-prompt field, paste or attach this entire file. For coding agents, keep it available in the project and tell the agent to read it before producing or modifying Remotion code.
>
> **Purpose:** Create and edit polished, professional motion-graphics videos with Remotion (React + TypeScript), preserving the original skill's workflow, component patterns, design rules, rendering process, and verification checklist.

## Gemini operating instructions

1. Treat this file as persistent project guidance whenever the user requests video creation/editing, animation, a Reel/Short/promo, captions, compositing, Remotion code, rendering, or asks to improve generic/amateur motion design.
2. Before coding, inspect the existing project and assets. Do not overwrite or restructure unrelated code without a clear need. For existing projects, read the relevant source files and identify the current theme and composition structure first.
3. Ask only for essential missing creative inputs (for example, intended message, aspect ratio, duration, supplied assets, or voice-over language). If reasonable defaults are explicitly accepted or the task can proceed, use them and state them.
4. Follow the rules and implementation patterns below. Adapt examples to the installed Remotion/package versions; do not blindly use an API that is incompatible with the project.
5. Do not claim a video was rendered, visually inspected, or verified unless the environment actually completed those actions. If rendering or visual inspection is unavailable, explain the limitation and provide the exact next steps.
6. Prefer reusable, themed components and readable TypeScript over one giant component. Keep timing derived from `fps`/`useVideoConfig()` rather than arbitrary frame constants.
7. After implementation, run available checks, render when possible, extract representative frames, inspect them, fix issues, and repeat. Never present an unverified render as verified.
8. If a Gemini environment cannot execute shell commands or inspect images, still provide the code and a verification plan—but clearly distinguish planned verification from completed verification.

---

# Remotion Motion Graphics

Remotion renders React components frame-by-frame into video. Code quality is not the
bottleneck — **motion design craft is**. Untrained generation produces linear easing,
opacity-only fades, simultaneous entrances, flat colors, and no texture. That is the
"generic AI video" look. This skill exists to prevent it.

## Non-negotiable rules (apply to EVERY composition)

1. **NEVER use linear interpolation.** Every `interpolate()` gets an easing curve;
   every entrance prefers `spring()`. Always `extrapolateLeft/Right: "clamp"`.
2. **Entrances animate 2–3 properties together** (opacity + translateY + scale).
   A lone fade is forbidden.
3. **Stagger everything.** Lists, words, rays, cards: 3–6 frame offsets. Nothing
   enters simultaneously.
4. **Exits exist and are faster than entrances** (~10 frames vs ~20).
5. **Five-layer stack in every scene**, bottom to top: background mesh → assets →
   graphics/type → color grade → grain + vignette. Never a flat solid background.
6. **Every still image gets Ken Burns** (slow scale 1→1.08 + pan). Every video asset
   uses `<OffthreadVideo>`, never `<Video>`.
7. **Idle elements breathe**: anything on screen >2s gets sin-wave micro-motion.
8. **All timing derives from `fps`** via `useVideoConfig()`. No magic frame numbers.
9. **One theme object** at the top of the project (colors, easings, spring presets,
   fonts). Never inline a hex color or easing in a component.
10. **Render, extract frames, LOOK at them, fix, re-render.** Never deliver an
    unverified render. This loop is mandatory — see Verification below.

## Workflow

### Step 1 — Scope
Determine: duration, fps (30 default; 60 only for heavy fast motion), dimensions
(1080×1920 Reels/Shorts, 1920×1080 landscape), what assets exist (images, footage,
audio, logos), and whether this is a new composition or an edit to an existing project.
If editing an existing project: read `src/` fully first, find the theme (or create one),
and refactor violations of the rules above before adding features.

### Step 2 — Setup
New project:
```bash
npm install remotion @remotion/cli react react-dom
# optional: @remotion/transitions @remotion/motion-blur @remotion/google-fonts
```
Copy `assets/theme.ts` from this skill into `src/theme.ts` and adjust the palette to
the user's brand. Structure: `src/index.ts` (registerRoot) → `src/Root.tsx`
(Composition, duration/fps/size) → `src/scenes/*.tsx` → `src/components/*.tsx`.
User assets go in `public/`, loaded via `staticFile()`.

### Step 3 — Build
Read `references/motion-patterns.md` for the reusable component implementations
(BgMesh, Grade, Grain, Vignette, KenBurns, WordReveal, Stagger, Counter, Spark,
transitions, parallax). Compose scenes from those patterns. For pacing, rhythm,
typography, color palettes, and sound design rules, read
`references/design-rules.md`.

Scene rhythm: HIT → hold (15–20 still frames) → build → HIT. Something must move
in the first 15 frames. Never >90 frames without a new visual element.

### Step 4 — Render
```bash
npx remotion render src/index.ts <CompId> out/video.mp4 --codec h264 --crf 17
```
Remotion needs a Chromium binary. If its auto-download fails (sandboxes, offline CI),
find one and pass it explicitly:
```bash
which chromium chromium-browser google-chrome 2>/dev/null
ls /opt/pw-browsers 2>/dev/null   # Playwright installs live here
npx remotion render ... --browser-executable=<path>
```
If full Chrome errors with "Old Headless mode has been removed", use a
`headless_shell` binary instead (Playwright ships one as
`chromium_headless_shell-*/chrome-linux/headless_shell`).

### Step 5 — VERIFY (mandatory, never skip)
Extract frames at key moments and visually inspect each one. The portable
method — works on machines with no system ffmpeg, renders the exact frame:
```bash
for f in 15 45 90 150; do
  npx remotion still src/index.ts <CompId> out/check_$f.png --frame $f --overwrite
done
```
If system ffmpeg IS available, extracting from the finished mp4 also verifies
the encode itself (`-ss` seeking is more portable than `select=` filters, whose
quoting breaks in some shells and in Remotion's bundled ffmpeg):
```bash
ffmpeg -v error -ss 1.5 -i out/video.mp4 -frames:v 1 check_1.png
```
Look for, and fix, in order of frequency:
- **Spacing bugs**: `gap`/`margin` in `em` resolves against the PARENT font-size
  (often 16px), not the text size — use px values in flex containers around big type.
- Text overflowing or touching frame edges (keep critical content in middle 75%
  vertically for 9:16 — platform UI covers top/bottom).
- Elements visible before their entrance or after their exit (missing clamp).
- Color/contrast failures: hero color on >1 element per frame, dim text unreadable
  over the grade.
- Layer order mistakes (grain/vignette must be on top, grade above content).
Fix → re-render → re-extract → re-inspect. Only deliver after a clean pass.
Then run the final checklist at the bottom of `references/design-rules.md`.

### Editing the user's existing footage
To enhance an existing mp4 (captions, grade, intro/outro) rather than build from
scratch: put the file in `public/`, render it as the asset layer with
`<OffthreadVideo src={staticFile("clip.mp4")} />`, set composition duration from the
clip length, and stack graphics/grade/grain above it. Get the clip's duration and fps
with `ffprobe` before setting up the composition. For word-synced captions over
speech, see the captions section of `references/motion-patterns.md`.

## Reference files
- `references/motion-patterns.md` — copy-paste component library: backgrounds,
  grade/grain/vignette, Ken Burns, text reveals, counters, transitions, parallax,
  audio sync, captions. Read before writing components.
- `references/design-rules.md` — palettes, typography rules, scene architecture,
  sound design, pre-delivery checklist. Read before designing scenes and before
  final delivery.
- `assets/theme.ts` — the theme template to copy into every project.

## Common failure modes to actively avoid
- **Emoji as icons.** Emoji render as full-color platform glyphs (green ✳️,
  blue 🌐) that ignore your palette and silently break the one-hero-color rule,
  and they sit on whatever background you gave them (orange mascot on orange
  tile = invisible). Draw glyphs with CSS/SVG in theme colors, or verify every
  emoji against the extracted frames.
- **No SFX assets is not a reason to ship silent.** Synthesize a minimal kit as
  16-bit WAVs from a Node script (noise-burst whoosh, pitch-drop pop, sine-thump
  kick/bass, detuned-sine pad) into `public/sfx/` — see `examples/scripts/` in
  the repo. Zero downloads, fully deterministic.
- Generating one giant component instead of themed, reusable pieces.
- `durationInFrames` mismatch between Composition and scene content (dead air).
- Forgetting `--overwrite` on re-renders, then inspecting the stale file.
- Fonts: never rely on system defaults for hero text; load a display font via
  `@remotion/google-fonts` or `@font-face` + `staticFile`.
- Trying to "describe" the result to the user instead of rendering and verifying it.

---

# Motion Patterns — Component Library

Working implementations. Import `theme` from the project's `src/theme.ts`.
All components assume `useCurrentFrame()` / `useVideoConfig()` from remotion.

## Contents
1. Premium entrance (the workhorse)
2. Staggered children
3. Word-by-word text reveal
4. Background mesh (never flat backgrounds)
5. Color grade overlay
6. Procedural grain (no asset file)
7. Vignette
8. Ken Burns for stills
9. Animated counter
10. Spark / radial logo mark
11. Exits
12. Idle breathing
13. Parallax depth
14. Transitions (library + hand-rolled)
15. Motion blur
16. Audio + SFX sync
17. Word-synced captions over footage

---

## 1. Premium entrance (fade + rise + scale)
```tsx
const Entrance: React.FC<{delay?: number; children: React.ReactNode}> =
({ delay = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
  return (
    <div style={{
      opacity: p,
      transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)
                  scale(${interpolate(p, [0, 1], [0.94, 1])})`,
    }}>{children}</div>
  );
};
```
For bezier instead of spring (controlled slides):
```tsx
const x = interpolate(frame, [0, 25], [60, 0], {
  easing: theme.ease.out,
  extrapolateLeft: "clamp", extrapolateRight: "clamp", // ALWAYS both
});
```

## 2. Staggered children
```tsx
{items.map((item, i) => <Entrance key={i} delay={start + i * 4}>{item}</Entrance>)}
```
3–6 frame offsets. Words: 3. Cards/list items: 4–5. Big blocks: 6.

## 3. Word-by-word text reveal
```tsx
const WordReveal: React.FC<{text: string; delay?: number; per?: number;
  style?: React.CSSProperties}> = ({ text, delay = 0, per = 3, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.26em", ...style }}>
      {text.split(" ").map((word, i) => {
        const p = spring({ frame: frame - delay - i * per, fps,
          config: theme.spring.snappy });
        return (
          <span key={i} style={{
            display: "inline-block", opacity: p,
            transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
          }}>{word}</span>
        );
      })}
    </div>
  );
};
```
GOTCHA: when placing two big text blocks side by side in a flex row, use a
pixel `gap` (e.g. `gap: 42`), NOT em — em resolves against the parent's font
size (usually 16px), producing near-zero gaps next to 150px type.

## 4. Background mesh
```tsx
const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 55) * 50, d2 = Math.cos(frame / 70) * 40;
  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <div style={{ position: "absolute", width: 1200, height: 1200,
        borderRadius: "50%", top: -450, left: -300 + d1, filter: "blur(50px)",
        background: `radial-gradient(circle, ${theme.colors.primary}33, transparent 62%)` }}/>
      <div style={{ position: "absolute", width: 900, height: 900,
        borderRadius: "50%", bottom: -400, right: -250 - d2, filter: "blur(70px)",
        background: `radial-gradient(circle, ${theme.colors.accent}22, transparent 65%)` }}/>
    </AbsoluteFill>
  );
};
```

## 5. Color grade overlay (renders ABOVE all content, below grain)
Unifies mismatched assets (AI stills + B-roll + screenshots) into one look.
```tsx
const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.primary,
      mixBlendMode: "soft-light", opacity: 0.18 }}/>
    <AbsoluteFill style={{ background:
      "linear-gradient(180deg, rgba(0,0,0,0.10), transparent 28%, transparent 72%, rgba(0,0,0,0.2))" }}/>
  </AbsoluteFill>
);
```
Opacity 0.10–0.15 for light themes, 0.18–0.25 for dark. Per-asset correction
when one clip still sticks out: `filter: "saturate(1.1) contrast(1.08)"`.

## 6. Procedural grain — zero asset files
```tsx
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return <AbsoluteFill style={{ pointerEvents: "none",
    backgroundImage: noise, backgroundSize: "220px",
    backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`, // film flicker
    opacity: 0.05, mixBlendMode: "multiply" }}/>; // "overlay" on dark themes
};
```

## 7. Vignette (topmost layer)
```tsx
const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background:
    "radial-gradient(ellipse at center, transparent 56%, rgba(0,0,0,0.22) 100%)" }}/>
);
```

## 8. Ken Burns — every still, no exceptions
```tsx
const KenBurns: React.FC<{src: string; zoomTo?: number}> = ({ src, zoomTo = 1.1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1, zoomTo],
    { easing: theme.ease.inOut });
  const pan = interpolate(frame, [0, durationInFrames], [0, -25]);
  return <Img src={staticFile(src)} style={{ width: "100%", height: "100%",
    objectFit: "cover", transform: `scale(${scale}) translateX(${pan}px)` }}/>;
};
```
Alternate zoom-in/zoom-out between consecutive shots. Mask into rounded cards:
`borderRadius: 32, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)",
boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6)"`.

## 9. Animated counter
```tsx
const value = interpolate(
  spring({ frame: frame - delay, fps, config: { damping: 30, stiffness: 60 } }),
  [0, 1], [0, target]);
<span style={{ fontVariantNumeric: "tabular-nums" }}>{value.toFixed(1)}%</span>
```
`tabular-nums` prevents layout jitter as digits change.

## 10. Spark / radial logo mark (staggered rays)
```tsx
const rays = 12;
{Array.from({ length: rays }).map((_, i) => {
  const p = spring({ frame: frame - delay - i * 1.2, fps,
    config: theme.spring.snappy });
  return <div key={i} style={{ position: "absolute", left: "50%", top: "50%",
    width: size * 0.085, height: size * 0.46 * p, background: theme.colors.primary,
    borderRadius: size, transformOrigin: "50% 0%",
    transform: `translateX(-50%) rotate(${(360 / rays) * i}deg) translateY(${size * 0.07}px)` }}/>;
})}
```
Wrap in a container with bouncy-spring scale + smooth-spring rotation from -120°,
and `filter: drop-shadow(0 0 ${size*0.25}px ${theme.colors.glow})`.

## 11. Exits — faster than entrances
```tsx
const exitY = interpolate(frame, [durationInFrames - 12, durationInFrames - 2],
  [0, -42], { easing: theme.ease.in,
  extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const exitO = interpolate(frame, [durationInFrames - 12, durationInFrames - 2],
  [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
```
Apply to every visible element, or to a scene wrapper.

## 12. Idle breathing (elements on screen >2s)
```tsx
const breathe = 1 + Math.sin(frame / 22) * 0.015;          // scale
const float = Math.sin(frame / 30) * 3;                     // translateY px
const drift = interpolate(frame, [0, 300], [0, -20]);       // slow parallax
```

## 13. Parallax (3 layers, instant depth)
```tsx
const x = interpolate(frame, [0, 90], [0, -120], { easing: theme.ease.inOut });
<Bg style={{ transform: `translateX(${x * 0.3}px)` }}/>
<Mid style={{ transform: `translateX(${x * 0.6}px)` }}/>
<Fg style={{ transform: `translateX(${x}px)` }}/>
```

## 14. Transitions
Library (`npm i @remotion/transitions`):
```tsx
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={90}><A/></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={slide({ direction: "from-right" })}
    timing={linearTiming({ durationInFrames: 12 })}/>
  <TransitionSeries.Sequence durationInFrames={150}><B/></TransitionSeries.Sequence>
</TransitionSeries>
```
Hand-rolled, 8–14 frames each:
- **Whip pan**: bg translates 1500px in 6 frames with `filter: blur(8px)` during the
  move; cut hidden mid-whip.
- **Scale-through**: A scales to 1.3 + fades, B scales 0.8→1 underneath.
- **Mask wipe**: brand-colored shape sweeps across; cut behind it.

## 15. Motion blur (anything moving >30px/frame)
```tsx
import { Trail } from "@remotion/motion-blur";
<Trail layers={4} lagInFrames={0.4}><FastThing/></Trail>
```

## 16. Audio + SFX sync
```tsx
import { Audio, Sequence, staticFile } from "remotion";
<Audio src={staticFile("sfx/music.mp3")} volume={0.25}/>
<Sequence from={entranceFrame - 3}> {/* SFX 2–3 frames BEFORE the visual lands */}
  <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.7}/>
</Sequence>
```
Cut on the music beat: framesPerBeat = fps * 60 / BPM. Place scene cuts and hits
on multiples of it. Background music -18dB under SFX/VO.

## 17. Word-synced captions over footage
For speech footage: get word timestamps (Whisper or `@remotion/install-whisper-cpp`),
then map to `<Sequence>` per caption group using `@remotion/captions`:
```tsx
import { createTikTokStyleCaptions } from "@remotion/captions";
const { pages } = createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: 1200 });
// render each page in a Sequence from msToFrame(page.startMs),
// highlight the active token by comparing currentTime to token timestamps
```
Style: heavy display weight, 2–4 words per page, active word in theme.colors.primary,
positioned at ~65% height (inside the 9:16 safe zone).

---

# Design Rules — Color, Type, Pacing, Sound, Checklist

## Color system
One dark (or light) base + ONE hero color + one accent + neutrals. 60/30/10:
60% base, 30% secondary surfaces, 10% hero. The hero color appears on AT MOST
one element per frame — it directs the eye.

Proven palettes (adapt to user's brand if they have one):
- Dark tech: base #0A0A0F, hero #7C3AED, accent #22D3EE, text #F4F4F5
- Warm editorial (Claude-like): base #FAF7F2, hero #D97757, ink #1F1E1B
- Warm premium: base #1A120B, hero #E8A33D, accent #F4E9DA
- Clean light: base #F7F5F2, ink #1A1A1A + one saturated accent

Glow on the hero element only:
`boxShadow: 0 0 60px ${hero}66, 0 0 120px ${hero}33` (text: textShadow).
More than one glowing element per frame = Vegas. Don't.

## Typography
- Hero text: display face (Clash Display, Cabinet Grotesk, General Sans, Satoshi —
  free on Fontshare; or a Google variable font via @remotion/google-fonts).
  Weight 600–800, letterSpacing -0.03em, lineHeight 1.05.
- Reels hero size: 80–140px at 1080 wide. Landscape: 100–160px at 1920.
- Body/captions: a clean sans (Inter/system) at 400–500, dimmed color.
- Highlight ONE word per headline: hero color, animated underline, or a pill
  scaling in behind it 5 frames after the word lands.
- Numbers: animated counters with tabular-nums (see motion-patterns §9).

## Scene architecture
30s Reel structure:
```
0.0–1.5s  HOOK    boldest visual + claim. Movement within the FIRST 15 frames.
1.5–3.0s  CONTEXT one line, one visual, still moving.
3–22s     BODY    3–4 beats. Each beat: HIT -> hold (15–20 still frames) -> build.
22–27s    PAYOFF  the result/number/demo. Biggest animation of the video.
27–30s    CTA     one action, calm, glow on the CTA word.
```
- New visual element at least every 90 frames.
- Holds are a design tool: fast move -> complete stillness -> next move.
  Constant motion reads amateur; contrast reads expensive.
- 9:16 safe zone: critical text inside the middle ~75% vertically (platform UI
  covers top and bottom).
- 5s logo stings: mark in (0–0.8s) -> wordmark (0.6–1.8s) -> detail/tagline
  (2–3.5s) -> breathe -> exit (last 0.5s).

## Sound design (50% of perceived quality — never deliver silent unless asked)
- Every entrance HIT: short whoosh/click starting 2–3 frames BEFORE the visual
  lands (early feels synced; late feels broken).
- Transitions: riser into the cut, bass hit ON the cut.
- Counters: soft tick loop while counting.
- Music bed at low volume (~0.2–0.3), ducked further under VO.
- Pick music FIRST when possible; compute framesPerBeat = fps*60/BPM and place
  cuts on beats.
- Free SFX sources to suggest: Pixabay, Mixkit, freesound.org. A 10-file kit
  covers everything: 2 whooshes, 2 clicks, riser, bass hit, shimmer, tick, pop,
  reverse-swoosh.

## Asset generation guidance (when user generates images for the video)
Lock a prompt skeleton, vary only the subject, keep lighting + palette words
identical across the set, generate at final aspect ratio:
```
[subject], cinematic product photography, dark moody studio, [hero color] rim
lighting, deep shadows, shallow depth of field, 9:16
```

## Render settings
- Masters for upload: `--codec h264 --crf 16` (platforms re-compress; give headroom)
- Heavy transparency/blur stacks: add `--image-format png`
- Preview suspicious motion at 0.25x in Remotion Studio — easing flaws invisible
  at 1x are obvious at quarter speed.

## PRE-DELIVERY CHECKLIST — run against every video before presenting it
- [ ] Zero linear easing anywhere; every interpolate clamped
- [ ] Entrances = 2–3 properties, staggered; nothing enters simultaneously
- [ ] Exits animated, faster than entrances
- [ ] Every still has Ken Burns; fast moves have motion blur
- [ ] 5-layer stack present (bg mesh, assets, graphics, grade, grain+vignette)
- [ ] One hero color, ≤1 hero-colored/glowing element per frame
- [ ] Display font ≥600 weight on heroes; no default-font hero text
- [ ] Pixel gaps (not em) between large text blocks
- [ ] Holds exist: ≥3 moments of stillness
- [ ] SFX on major hits, cuts on beat (if audio in scope)
- [ ] Text inside safe zone; nothing touching frame edges
- [ ] Rendered, frames extracted with ffmpeg, every extracted frame visually
      inspected, issues fixed, re-rendered, re-inspected

---

## Project theme template (`src/theme.ts`)

Use this as the single source of truth for project colors, fonts, easing curves, and spring presets. Adjust the palette to the user's brand; do not inline colors/easings in components.

```tsx
// theme.ts — single source of truth for every Remotion project.
// NEVER inline colors, easings, or spring configs in components.
import { Easing } from "remotion";

export const theme = {
  colors: {
    // Adjust to the user's brand. Defaults: dark tech.
    bg: "#0A0A0F",
    bgAlt: "#12121A",
    primary: "#7C3AED", // THE hero color — max one element per frame
    accent: "#22D3EE",
    text: "#F4F4F5",
    textDim: "#A1A1AA",
    glow: "rgba(124, 58, 237, 0.4)",
  },
  fonts: {
    display: "Clash Display", // load via @font-face + staticFile, or google-fonts
    body: "Inter",
    mono: "JetBrains Mono",
  },
  // THE easing curves. Linear is forbidden.
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1), // easeOutExpo — entrances
    inOut: Easing.bezier(0.83, 0, 0.17, 1), // easeInOutQuint — moves, Ken Burns
    in: Easing.bezier(0.7, 0, 0.84, 0), // exits only
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 }, // UI pops, words
    smooth: { damping: 20, stiffness: 90, mass: 1 }, // big elements
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 }, // playful accents, logos
  },
} as const;
```

## Gemini final response requirements

When the work is complete, report succinctly:
- What was created or changed.
- Files/components affected.
- Render/verification status (completed, attempted, or not available—be accurate).
- Any remaining user action or limitation.
- If a render exists, provide the actual output location/link only when it is verified by the environment.
