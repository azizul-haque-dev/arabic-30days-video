# MEMORY.md — survival-arabic-day5

## 1. Project Overview
- **Project Name & Identity**: `survival-arabic-day5` — an automated, programmatic motion-graphics video generator built on [Remotion](https://remotion.dev/) v4 and React 19.
- **Purpose**: Produces high-quality, 1080×1080 square format video lessons teaching conversational Gulf Arabic ("Survival Arabic — Day 5") to Bengali speakers.
- **Target Audience & Platform**: Social media (Instagram, Facebook, YouTube Shorts / Reels); visual language and typography are specifically customized for Bengali learners with Arabic transliteration in Bengali script.
- **Core Technologies**:
  - **Remotion** (`^4.0.539`): Programmatic video composition, frame interpolation, audio sequencing, and rendering.
  - **React** (`^19.3.1`): Declarative UI composition.
  - **TypeScript** (`^7.0.2`): Strict type safety (`strict: true`, `target: ES2020`, `moduleResolution: Bundler`).
  - **Node.js ESM**: Procedural audio synthesis and subtitle timing extraction scripts.
- **Key Architectural Decisions**:
  - **SRT-Driven Deterministic Timing**: Visual cuts and speech beats are mathematically derived from an audio transcript (`data/day5.srt`) via `scripts/gen-timing.mjs`, avoiding manual keyframing.
  - **Centralized Design System**: All tokens (colors, fonts, spring dynamics, easing curves, dimensions) are governed exclusively by `src/theme.ts`. Inlined values are forbidden.
  - **Rotating Layout Paradigm**: Sentence scenes cycle through three distinct visual layouts (`ChatLayout`, `GlassLayout`, `BentoLayout`) using `i % 3` to prevent visual fatigue.
  - **Offline Self-Contained Assets**: Fonts (Hind Siliguri WOFF2) and UI sound effects (synthesized WAVs) are stored locally in `public/` and bundled with the render engine.

---

## 2. Project Structure

```
c:\Users\as_haque\Desktop\05.day\
├── data\
│   └── day5.srt               # Source audio subtitle file with speech cues
├── out\
│   └── .gitkeep               # Output directory for rendered MP4 and stills
├── public\
│   ├── fonts\                 # Offline Hind Siliguri fonts (Bengali & Latin WOFF2)
│   ├── sfx\                   # 6 synthesized 16-bit 44.1kHz UI WAV effects
│   └── voiceover.mp3          # Optional narration track (user provided)
├── scripts\
│   ├── check-sfx.mjs          # Quality audit script for generated sound effects
│   ├── gen-timing.mjs         # SRT parser generating src/timing.ts
│   ├── make-sfx.mjs           # Algorithmic synthesizer for UI audio files
│   └── stills.sh              # Headless Chrome snapshot extractor
├── src\
│   ├── components\
│   │   ├── Chrome.tsx         # Background mesh, color grade, grain, vignette, scene transitions
│   │   ├── Icons.tsx          # 10 custom animated SVG vector illustrations
│   │   ├── kit.tsx            # Primitives: Entrance, WordReveal, SceneExit, Pill, Card, Counter
│   │   ├── PreviewAudio.tsx   # Studio-only voiceover loader with fallback handling
│   │   └── Sfx.tsx            # Sequence-based UI audio player with gain/pitch control
│   ├── scenes\
│   │   ├── Intro.tsx          # HookScene, GulfScene, CountScene, HubScene, TwiceScene
│   │   ├── Outro.tsx          # RecapScene, CommentScene, StatementScene, FollowScene, EndScene
│   │   └── Sentence.tsx       # ChatLayout, GlassLayout, BentoLayout
│   ├── config.ts              # Feature flags (PREVIEW_VOICEOVER, RENDER_VOICEOVER, SFX_ENABLED)
│   ├── content.ts             # 10 lesson sentences, situation text, transliteration, and metadata
│   ├── fonts.ts               # Web font loader using delayRender and continueRender
│   ├── index.ts               # Remotion entry point registering Root
│   ├── Main.tsx               # Top-level composition assembling scenes, chrome, and SFX
│   ├── Root.tsx               # Remotion <Composition> definition
│   ├── theme.ts               # Single source of truth for design tokens and physics
│   └── timing.ts              # Auto-generated timing constants (FPS, TOTAL_FRAMES, SCENES, BEATS)
├── package.json               # Project manifest and scripts
├── remotion.config.ts         # Remotion engine configurations
└── tsconfig.json              # TypeScript compiler configuration
```

### Module Responsibilities & Placement Guidelines
- **New Lesson Content**: Update `data/day5.srt` (or active day SRT) and `src/content.ts`. Re-run `node scripts/gen-timing.mjs`.
- **New Layouts & Scene Components**: Add under `src/scenes/`.
- **Reusable Design Components & Primitives**: Place in `src/components/kit.tsx`.
- **Vector Graphics & Icons**: Add to `src/components/Icons.tsx` with a corresponding type entry in `src/content.ts` (`IconId`).
- **Global Theme & Tokens**: Extend `src/theme.ts` only; never hardcode colors or physics locally.

---

## 3. Architecture and Data Flow

### Composition Pipeline (`src/Main.tsx` & `src/Root.tsx`)
1. **Root Definition** (`src/Root.tsx`): Sets composition dimensions (1080×1080), duration (`TOTAL_FRAMES = 4859`), and frame rate (`FPS = 30`).
2. **Font Preloading** (`src/fonts.ts`): Invoked at module load in `Main.tsx`. Suspends rendering via `delayRender("fonts")` until all required Hind Siliguri weights (400, 600, 700) are loaded.
3. **Layer Stack** (`src/Main.tsx`):
   - **Layer 1: Background Mesh** (`<BgMesh />`): Animated fluid mint mesh + moving radial gradients + drifting dot grid.
   - **Layer 2: Scene Sequences** (`<Sequence />`): 20 sequentially mapped scenes defined in `src/timing.ts` (Intro → 10 Sentences → Outro).
   - **Layer 3: Transitions & SFX**: `<Transition />` wipes layered at scene boundaries (`s.from`) with synced `<Sfx name="whoosh" />` peaking 12 frames prior to the cut.
   - **Layer 4: Color Grade** (`<Grade />`): Soft-light primary tint + subtle vertical tone gradient.
   - **Layer 5a: Grain Overlay** (`<Grain />`): Procedural SVG fractal noise animated with multiply blend mode.
   - **Layer 5b: Vignette** (`<Vignette />`): Topmost subtle radial shadow.
   - **Layer 6: Narration Audio** (`<PreviewAudio />`): Checks for `public/voiceover.mp3` and mounts Remotion `<Audio />`.

### Data-Driven Timing Generation (`scripts/gen-timing.mjs` → `src/timing.ts`)
- `scripts/gen-timing.mjs` ingests `data/day5.srt`.
- Non-transcribed Arabic speech markers (`[বিদেশি ভাষা]`) are weighted with an equivalent character duration constant (`ARABIC_WEIGHT = 46`).
- Scene boundary timestamps are calculated with a visual lead time (`LEAD = 5` frames) so visual animations land just before speech.
- Inside each sentence, two speech beats are anchored:
  - `say`: The exact moment narration instructs the user to speak ("বলুন,").
  - `mean`: The exact moment narration introduces the Bengali meaning ("অর্থ,").

---

## 4. Coding Conventions

### File & Variable Naming
- **Components & Layouts**: PascalCase (e.g., `Main.tsx`, `ChatLayout`, `BgMesh`, `WordReveal`).
- **Utilities, Configs & Scripts**: camelCase or kebab-case (e.g., `theme.ts`, `fonts.ts`, `gen-timing.mjs`, `make-sfx.mjs`).
- **Constants**: UPPER_SNAKE_CASE for global switches and primitives (e.g., `FPS`, `TOTAL_FRAMES`, `SFX_ENABLED`, `PREVIEW_VOICEOVER`).
- **Design Tokens**: Structured object properties under `theme` (e.g., `theme.colors.primary`, `theme.weights.hero`).

### TypeScript & Type Safety
- Strict mode is enforced (`"strict": true` in `tsconfig.json`).
- Explicit typing on exported components: `React.FC<Props>` or `React.FC`.
- Type-safe string unions for dynamic keys (e.g., `IconId` in `src/content.ts`, `SfxName` in `src/components/Sfx.tsx`, `SceneId` in `src/timing.ts`).
- Avoid `any`. Use `as const` for fixed configurations and Spring/Easing configurations.

### Bengali Text Rendering Rules (CRITICAL)
- **Word-Level Splitting Only**: In `src/components/kit.tsx` (`WordReveal`), text must **always** be split on space (`text.split(" ")`), **never** character-by-character. Splitting Bengali strings by character breaks complex conjunct characters (যুক্তাক্ষর), Hasanta, and Kar signs (মাত্রা/কার).
- **Bangla Digit Conversion**: Use `toBn(num)` (`src/scenes/Intro.tsx`) to map Arabic numerals (`0-9`) to Bengali digits (`০-৯`).

### Animation & Motion Standards
- All animations must derive from Remotion's `useCurrentFrame()`, `spring()`, or `interpolate()`.
- Always pass `{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }` (`clamp` export from `src/components/kit.tsx`) to `interpolate()` calls to avoid runaway scaling or opacity glitches outside intended intervals.
- Use standardized spring presets (`theme.spring.snappy`, `smooth`, `bouncy`). Do not craft arbitrary spring physics inside component files.

---

## 5. UI/UX and Design System

The visual design follows a clean, premium **Mint Fresh ("মিন্ট ফ্রেশ")** theme defined in `src/theme.ts`.

### Design Tokens (`src/theme.ts`)
- **Colors**:
  - `bg`: `#EEF8F5` (Soft mint background)
  - `bgAlt`: `#DDF0EA` (Gradient complement)
  - `surface`: `#FFFFFF` (Card surface)
  - `primary`: `#0E9F6E` (Emerald mint hero color)
  - `primaryDeep`: `#0A7A55` (Deep emerald text/accent)
  - `primarySoft`: `#CDEBDF` (Pastel mint badge/card fill)
  - `accent`: `#F59E0B` (Warm amber highlight)
  - `accentSoft`: `#FDE8BD` (Pastel amber badge fill)
  - `text`: `#10231D` (Dark forest green readable ink)
  - `textDim`: `#4D6A60` (Muted secondary text)
  - `line`: `rgba(16, 35, 29, 0.10)` (Subtle card border)
  - `glow`: `rgba(14, 159, 110, 0.35)` (Primary shadow glow)
  - `shadow`: `rgba(16, 35, 29, 0.16)` (Soft ambient shadow)
- **Typography**:
  - Fonts: `'Hind Siliguri', 'Noto Sans Bengali', sans-serif`
  - Weights: `hero: 700`, `strong: 600`, `body: 400`
- **Border Radii**:
  - `sm: 20px`, `md: 32px`, `lg: 44px`, `pill: 999px`
- **Shadows**:
  - `card`: Elevated card dual shadow
  - `soft`: Low elevation badge shadow
  - `hero`: Intense primary colored glow
- **Motion Physics**:
  - `snappy`: `{ damping: 14, stiffness: 160, mass: 0.6 }` (reveals, pills, quick pops)
  - `smooth`: `{ damping: 20, stiffness: 90, mass: 1 }` (containers, large cards)
  - `bouncy`: `{ damping: 11, stiffness: 170, mass: 0.7 }` (icons, checkmarks, hero bubbles)

### Sentence Layout Rotation
Sentence scenes rotate sequentially across 3 layouts to maintain visual rhythm (`src/Main.tsx`):
1. **`ChatLayout`** (`i % 3 === 0` — sentences 1, 4, 7, 10): Instant messaging mockup with incoming dialogue bubble, typing indicator dots, animated reply bubble, and meaning card.
2. **`GlassLayout`** (`i % 3 === 1` — sentences 2, 5, 8): Center-aligned luxury glassmorphic card with dynamic light glare sweep and stacked badges.
3. **`BentoLayout`** (`i % 3 === 2` — sentences 3, 6, 9): Asymmetric 2×2 grid pairing an oversized icon tile, a situation card, a full-width phrase banner, and a bottom meaning strip.

---

## 6. Reusable Components and Utilities

| Component / Utility | File Path | Purpose & Rules |
| :--- | :--- | :--- |
| `Entrance` | `src/components/kit.tsx` | Spring-driven entrance animation (rise + scale + fade). Wraps UI elements. |
| `WordReveal` | `src/components/kit.tsx` | Staggered reveal for Bengali text. Splits strictly on space. |
| `SceneExit` | `src/components/kit.tsx` | Wraps root of each scene; provides uniform 10-frame exit transition (fade + lift). |
| `Pill` | `src/components/kit.tsx` | Pill-shaped badge supporting `"soft" \| "accent" \| "hero" \| "white"` tones. |
| `Card` | `src/components/kit.tsx` | Standard white surface card with border and shadow. |
| `Counter` | `src/components/kit.tsx` | Progress badge displaying current sentence (`১ / ১০`) + 10 progress indicator dots. |
| `useBreath` | `src/components/kit.tsx` | Hook providing subtle floating and scale oscillation for idle elements. |
| `Icon` | `src/components/Icons.tsx` | Flat animated vector icons (`heart`, `cake`, `rings`, `kids`, `shield`, `plane`, `calendar`, `cloud`, `sun`, `sunrise`). |
| `Sfx` | `src/components/Sfx.tsx` | Sequence-timed sound effect player (`pop`, `click`, `tick`, `whoosh`, `chime`, `thud`). |
| `BgMesh` | `src/components/Chrome.tsx` | Layer 1 background mesh with animated sinusoidal blur orbs and dot pattern. |
| `Transition` | `src/components/Chrome.tsx` | Full-screen color wipe transition (3 variants: horizontal, vertical, iris). |
| `PreviewAudio` | `src/components/PreviewAudio.tsx`| Checks via `HEAD` request for `public/voiceover.mp3` and plays during Studio preview. |

---

## 7. API, State, and Data Management

- **Client State**: Stateless and deterministic. Remotion evaluates frames purely as a function of time (`useCurrentFrame()`). No external state store (Redux, Zustand) is used.
- **Audio Lifecycle**:
  - Sound effects trigger at precise frame offsets (`at={frame}`) using Remotion's `<Sequence layout="none">` and `<Audio />`.
  - Preview narration utilizes `delayRender("voiceover check")` to asynchronously verify file existence via `fetch()` before resolving.
- **Audio Levels**: Base SFX levels are deliberately capped between `0.20` and `0.35` (`src/components/Sfx.tsx`) to guarantee sound effects never overpower the instructor's voiceover.

---

## 8. Dependencies and Configuration

### Primary Dependencies (`package.json`)
- `remotion` & `@remotion/cli` (`^4.0.539`): Core video rendering runtime and CLI tooling.
- `react` & `react-dom` (`^19.3.1`): React 19 UI library.
- `typescript` (`^7.0.2`): Language type checking.

### Remotion Configuration (`remotion.config.ts`)
- `Config.setRendererPort(3030)`: Dedicated local port for rendering.
- `Config.setVideoImageFormat("jpeg")`: Fast rendering image format.
- `Config.setOverwriteOutput(true)`: Automatically overwrites existing render artifacts in `out/`.

### Switches & Flags (`src/config.ts`)
- `PREVIEW_VOICEOVER = true`: Auditions `public/voiceover.mp3` in Remotion Studio.
- `RENDER_VOICEOVER = false`: Excludes narration from final render by default (SFX only), enabling external audio mixing if preferred.
- `SFX_ENABLED = true`: Global switch to toggle UI sound effects.

---

## 9. Development Rules for AI Agents

1. **Maintain Design System Purity**: Never hardcode colors, border-radii, font families, or transition curves in scene components. Always import tokens from `src/theme.ts`.
2. **Preserve Bengali Typographic Integrity**: Never modify `WordReveal` to split text by character or empty string (`""`). Bengali conjuncts (যুক্তাক্ষর) require word-level tokenization.
3. **Keep Animations Deterministic**: Base all visual motion on `useCurrentFrame()`, `spring()`, and `interpolate()`. Do not use non-deterministic sources (such as `Math.random()` or real-time clocks) inside rendering components.
4. **Adhere to the Layout Sequence**: Sentences must strictly maintain the rotating sequence (`ChatLayout` → `GlassLayout` → `BentoLayout`) via `[ChatLayout, GlassLayout, BentoLayout][i % 3]`.
5. **Honor Speech Beat Synchronization**: In `Sentence.tsx`, visual highlights (`RepeatSweep`) and meaning reveals must strictly align with `BEATS[i].say` and `BEATS[i].mean`.
6. **Low Volume for Audio Additions**: Any new sound effect additions must keep gain levels below `0.35` to preserve speech intelligibility.
7. **Smallest Viable Diff**: Implement focused changes without refactoring unrelated layout components or re-ordering timing sequences.
8. **Never Commit Secrets**: Keep configuration free of private API keys, credentials, or personal tokens.

---

## 10. Common Commands and Workflows

All commands must be executed via `npm.cmd` on Windows PowerShell (due to PowerShell Execution Policy disabling `.ps1` scripts):

```powershell
# 1. Type Check (Verified)
npm.cmd run typecheck

# 2. Launch Remotion Studio Preview (Verified)
npm.cmd run studio

# 3. Render Final Video (Verified)
npm.cmd run render

# 4. Regenerate Timing from SRT (Verified)
node scripts/gen-timing.mjs
```

---

## 11. Known Issues and Technical Debt

1. **Windows ESM Path Resolution in Audio Scripts**:
   - In `scripts/check-sfx.mjs` (line 3) and `scripts/make-sfx.mjs` (line 8), path resolution uses `new URL(..., import.meta.url).pathname`. On Windows, `.pathname` produces a leading slash (e.g., `/C:/...`), which causes `ENOENT` when passed to `fs.readdirSync` or `fs.mkdirSync`.
   - *Fix pattern for future updates*: Use `import { fileURLToPath } from "node:url"` and convert with `fileURLToPath(new URL(..., import.meta.url))`. Note that `scripts/gen-timing.mjs` avoids this by passing the `URL` object directly into `fs.readFileSync()`.
2. **Platform Specificity in `stills.sh`**:
   - `scripts/stills.sh` targets a specific Linux headless Chrome path (`/opt/pw-browsers/...`). On Windows, snapshot rendering should be invoked directly using `npx.cmd remotion still src/index.ts Main out/still-<frame>.png --frame=<frame>`.
3. **No Active Git Repository**:
   - The directory is not initialized as a git repository (`fatal: not a git repository`). Exercise care when making destructive file modifications.

---

## 12. Pre-Implementation Checklist

Before modifying or adding features:
- [ ] Read `src/theme.ts` to identify the required design tokens.
- [ ] Inspect `src/timing.ts` and `src/content.ts` to understand active scene boundaries and lesson data.
- [ ] Check if the task affects speech timing; if editing `data/day5.srt`, re-run `node scripts/gen-timing.mjs` and verify output.
- [ ] Confirm that no inline color hex codes or arbitrary springs are being introduced.
- [ ] Verify that any text changes maintain space-separated word splits.

---

## 13. Post-Implementation Checklist

After making changes:
- [ ] Run `npm.cmd run typecheck` to confirm zero TypeScript compilation errors.
- [ ] Confirm no existing source files outside the intended scope were modified or reformatted.
- [ ] If new SFX was added, check that playback volume does not exceed `0.35`.
- [ ] Verify that scene transitions continue to cut seamlessly without overlapping audio or visual artifacts.
- [ ] Ensure `MEMORY.md` remains updated if architectural decisions or tokens were modified.

