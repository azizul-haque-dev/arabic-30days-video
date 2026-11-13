# Arabic Master — Day 19 (Remotion প্রজেক্ট)

30-Day Survival Arabic · Day 19 · Work, Salary & Workplace Communication · বাক্য ১৮১–১৯০ · 1080×1920 · 30 FPS

> এই ZIP-এ শুধু **edit করার মতো Remotion প্রজেক্ট** আছে। কোনো MP4 render করা বা দেওয়া হয়নি।

---

## ১. আগে যা জানা জরুরি (সৎ কথা)

**Day 19-এর আসল SRT ফাইল `day19.srt` এই প্রজেক্টের root-এ আছে।** প্রজেক্ট সব timing SRT থেকেই তৈরি করে; কোনো timestamp অনুমান করে না।

- `day19.srt` root-এ না থাকলে ফাইলটি `src/episodes/day-19/day-19.srt` অথবা `public/srt/day-19.srt`-এ রাখুন।
- `scripts/__tests__/fixtures/day-19.sample.srt` একটি **কৃত্রিম (synthetic) নমুনা**, শুধু layout preview ও test-এর জন্য। এটি দিয়ে চললে ভিডিওর উপরে **"SAMPLE TIMING"** badge দেখায়; final render এটি গ্রহণ করে না।

## ২. Setup

```bash
npm install

# ১) আসল SRT ইতিমধ্যে root-এ আছে
day19.srt                             # (অথবা src/episodes/day-19/day-19.srt)

# ২) audio রাখুন (পরে রাখলেও চলবে)
public/audio/day-19.mp3               # অথবা day-19.wav
```

## ৩. Command

| Command | কাজ |
|---|---|
| `npm run studio` | আসল SRT দিয়ে Studio খোলে। audio না থাকলে warning দেয় আর silent চলে |
| `npm run render` | **strict mode**: SRT ও audio দুটোই লাগবে, তারপর audio-সহ `out/day-19.mp4` render করে |

`npm run render` চালালেই audio-সহ MP4 তৈরি হবে। "Do not render" নির্দেশ অনুযায়ী আমি এটা চালাইনি।
আলাদা thumbnail PNG বানাতে চালান: `npx remotion still src/index.ts Day19 public/day-19-thumbnail.png --frame=0`।

## ৪. Audio কীভাবে স্বয়ংক্রিয়ভাবে load হয়

1. `scripts/lib/audio.ts` build-time-এ `public/audio/day-19.mp3` (না থাকলে `.wav`) খোঁজে। browser runtime-এ কোনো filesystem scan নেই।
2. ফাইলের নাম, ধরন, size ও duration `src/generated/day-19.timeline.json`-এ লেখা হয়।
3. `src/Day19Video.tsx` ওই metadata পড়ে `<Html5Audio src={staticFile(...)}>` চালায়। কোনো composition source বদলাতে হয় না।
4. audio না থাকলে:
   - `render`: error দেয় এবং expected path (`public/audio/day-19.mp3`) দেখায়।
   - `studio`: warning দেয়, preview silent চলে।
5. audio আর SRT-এর শেষ সময় ২ সেকেন্ডের বেশি আলাদা হলে warning দেয়।

পরের episode-এর জন্য: `src/episodes/day-19` কপি করে `day-20` বানান, content বদলান, আর `Root.tsx`-এ আরেকটা `<Composition>` যোগ করুন।

## ৫. SRT থেকে timing কীভাবে তৈরি হয়

`scripts/lib/timeline.ts` প্রতিটি SRT entry-র লেখা আপনার বাক্য-তালিকার সাথে মেলায়। এটা punctuation, hyphen ও zero-width character উপেক্ষা করে, কিন্তু অক্ষর হুবহু মিলতে হয়।

- **বাক্য ১৮১–১৯০:** pronunciation ও meaning entry-র আসল start/end দিয়ে scene তৈরি হয়। পুনরাবৃত্ত pronunciation আলাদা event হয়।
- **Quick Challenge:** ১৯০-এর পরে আগের বাক্যে ফিরে গেলে challenge শুরু ধরা হয়। এখানে বাক্য ১৮২ ও ১৮৩-এর meaning ব্যবহার হয়।
- **Opening / Intro / Section / Outro:** prompt-এর আনুমানিক সময় (10s, 26s, 145s, 160s) শুধু ইঙ্গিত। প্রতিটাকে **নিকটতম আসল SRT entry-র start**-এ snap করা হয়। `content.ts`-এ `overrides.sceneStartEntries` দিয়ে নির্দিষ্ট entry নম্বর জোর করা যায়।
- prompt-এর scene সময়ে অসঙ্গতি আছে (Scene 3: 00:26–00:31 আর Scene 4: 00:28–00:38 overlap করে)। তাই SRT-কেই চূড়ান্ত ধরা হয়েছে।
- কোনো বাক্য SRT-তে না পেলে error-এ সবচেয়ে কাছাকাছি SRT লাইন দেখানো হয়। intro-তে বাক্যের preview থাকলে সেই entry `overrides.ignoreEntries`-এ দিন।
- Pronunciation-এর highlight **phrase-level** (entry-র পুরো সময় জুড়ে sweep)। শব্দ-ভিত্তিক timestamp আমি বানাইনি।

## ৬. Layout নিয়ম (overlap ছাড়া)

`src/design/layout.ts`-এ প্রতিটি অংশের নিজস্ব নির্দিষ্ট band আছে:

| অংশ | y (px) |
|---|---|
| Sentence number | 250–322 |
| Illustration | 350–930 |
| Text card | 960–1680 |

Card-এর ভেতরে pronunciation slot (262), Arabic (150), meaning (132)। সব content ৯:১৬ safe area (240–1680) ভিতরে।

- Text-এর আসল glyph-width `@remotion/layout-utils` দিয়ে মাপা হয় (font আগে load করে)।
- Pronunciation আগে এক লাইনে (≥৮০px) বসাতে চেষ্টা করে। না হলে ভারসাম্য রেখে দুই লাইনে (≤৮৬px) ভাঙে।
- Arabic সবসময় pronunciation-এর **৭২% বা কম**। meaning সবসময় ছোট।
- কোনো text slot-এ না ধরলে render **error দিয়ে থামে**, চুপচাপ overlap করে না।
- Arabic `dir="rtl"`, `lang="ar"`।
- Font `public/fonts/`-এ local (OFL): Hind Siliguri, Noto Sans Arabic, Inter। render-এ internet লাগে না।

## ৭. Linguistic flag (আমি কিছু বদলাইনি)

Pronunciation আপনার তালিকা অনুযায়ী হুবহু রাখা হয়েছে। নিচের জায়গাগুলো একবার যাচাই করে নিন:

1. **১৮২:** Arabic `ما نزل` (mā nazal) কিন্তু pronunciation `নাযিল` (nāzil, যা `نازل`-এর কাছাকাছি)। আরবি লেখা ও উচ্চারণ হুবহু মেলে না।
2. **১৮৩:** `ইয়েনযিল` — Gulf উচ্চারণে সাধারণত `yinzil` / `ইনযিল` শোনা যায়। দুটোই চলতে পারে, তবে নিশ্চিত হয়ে নিন।
3. **১৮৫ বনাম ১৮৭/১৮৮:** একই শব্দ الشغل তিন রকম বানানে আছে: `আশ শুগুল` (১৮৫), `আশ-শুগল` (১৮৭, ১৮৮)। hyphen আর `শুগুল`/`শুগল` অসামঞ্জস্যপূর্ণ।
4. **১৮৯:** `আসাউই` (أسوي) — `আসাওয়ি` লেখাও প্রচলিত। বর্তমান বানান গ্রহণযোগ্য।

এগুলো ঠিক করলে `content.ts` **এবং** SRT দুটোই একসাথে একই বানানে বদলাতে হবে, নাহলে matching ব্যর্থ হবে।

## ৮. যা আমি যাচাই করেছি এবং যা করিনি

**করেছি (কৃত্রিম SRT দিয়ে):**
- composition 1080×1920, 30 FPS, ৫১৭০ frame (172.32s)
- ১০টি বাক্য ১৮১–১৯০, progress 180 → 190 / 300 (60% → 63.33%)
- ১৫টি scene gap ছাড়া পরপর বসে
- সব scene-এর key frame render করে দেখেছি: কোনো clipping বা overlap নেই, pronunciation সবচেয়ে বড়
- audio auto-discovery (`.mp3` ও `.wav`), অনুপস্থিত audio/SRT-এর error message
- ৩ সেকেন্ডের টুকরো audio সহ render করে AAC stream পেয়েছি
- `npx tsc --noEmit` পাস। Unit test-এ ১১টির মধ্যে ১০টি পাস; strict entry-count test-টি ব্যর্থ।

**করিনি / পারিনি:**
- **আসল SRT দিয়ে চালাইনি**, কারণ সেটা আমার কাছে নেই। আপনার SRT-এর লাইন-গঠন আলাদা হলে matching error দিতে পারে। error message বলে দেবে কোন লাইন মেলেনি।
- পুরো ৫১৭০ frame-এর MP4 render করিনি (নির্দেশ ছিল না করার)।
- আপনার আসল audio দিয়ে sync মিলিয়ে দেখিনি।
- Illustration-গুলো কোডে আঁকা সরল flat vector। final publish-এর আগে Studio-তে preview দেখে নিন।

## ৯. ফোল্ডার

```text
scripts/
  prepare-episode.ts      # build-time: audio + SRT -> timeline JSON
  qa-stills.ts            # key-frame QA render
  lib/{srt,text,audio,timeline}.ts
  __tests__/              # unit tests + synthetic sample SRT
public/{audio,fonts}/
src/
  Root.tsx  Day19Video.tsx  index.ts  config.ts  types.ts
  design/{tokens,layout,fonts}
  lib/{fit,anim}.ts
  components/             # IntroScene, EpisodeProgress, SectionTitle, SentenceCard,
                          # PronunciationText, ArabicText, MeaningText, ChallengeScene,
                          # OutroScene, AnimatedIllustration, ...
  illustrations/          # primitives + scene library (pure SVG)
  episodes/day-19/        # content.ts (episode data) + day-19.srt (আপনি দেবেন)
  generated/              # auto-generated, git-ignored
```
