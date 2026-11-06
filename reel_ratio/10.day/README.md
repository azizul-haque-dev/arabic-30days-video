# Arabic Master — Video Generator (Remotion)

একটি পুনঃব্যবহারযোগ্য Remotion ইঞ্জিন। প্রতিটি এপিসোডের বাংলা script আর SRT দিলে এটি 1080×1920, 30 FPS-এর একটি মোশন গ্রাফিক্স কম্পোজিশন তৈরি করে (Thumbnail → Intro → ১০টি Sentence → Outro)।

> **গুরুত্বপূর্ণ:** এই ZIP-এ **MP4 নেই** এবং **অডিও ফাইল নেই**। কম্পোজিশন অডিও ছাড়া কাজ করে। অডিও যোগ করা বা রেন্ডার করা পরে আপনি নিজে করবেন (নিচে দেখুন)।

## টেক স্ট্যাক

React 19, TypeScript (strict), Remotion 4.0.540 (সব `@remotion/*` প্যাকেজ একই ভার্সনে পিন করা), Node.js 20+ (LTS), Hind Siliguri ফন্ট (প্রজেক্টের ভেতরেই বান্ডল, ইন্টারনেট লাগে না), `archiver` (ZIP)।

## ইনস্টল (Windows 11 / PowerShell)

```powershell
# Node.js 20+ আছে কি না দেখুন
node -v

# ZIP এক্সট্র্যাক্ট করে ফোল্ডারে ঢুকুন
Expand-Archive .\arabic-master-day-10.zip -DestinationPath .
cd .\arabic-master-day-10

npm ci
```

## দৈনন্দিন কমান্ড

```powershell
npm run studio            # Remotion Studio-তে প্রিভিউ (http://localhost:3000)
npm run build:episode     # script.md + subtitles.srt থেকে episode.config.json তৈরি
npm run validate:episode  # ৭০+ যাচাই (সংখ্যা, ক্রম, টাইমিং, ফন্ট, ইলাস্ট্রেশন…)
npm run typecheck         # TypeScript যাচাই
npm run package:episode   # build + validate + typecheck, তারপর output/ ফোল্ডারে ZIP
```

`package:episode` কোনো যাচাই ব্যর্থ হলে ZIP বানায় না।

## ফোল্ডার কাঠামো

```
public/fonts/                 Hind Siliguri (Bengali + Latin)
src/config/video.config.ts    রেজোলিউশন, FPS, composition ID (একমাত্র উৎস)
src/theme.ts                  ব্র্যান্ড রং, easing, spring, ইলাস্ট্রেশন প্যালেট
src/parsers/                  srtParser.ts, scriptParser.ts
src/services/timelineService.ts   SRT শব্দ-স্তরের সময় + "Sentence N" মার্কার
src/components/               Brand, Background, Text, Illustrations, StageVisuals
src/scenes/                   ThumbnailScene, StagedScene (Intro/Outro), SentenceScene
src/compositions/             ArabicMasterComposition
scripts/                      build-episode, validate-episode, package-episode, render-entry
episodes/episode-10/          script.md, subtitles.srt, episode.meta.json, episode.config.json
```

ইঞ্জিন (`src/`) আর এপিসোডের কনটেন্ট (`episodes/`) আলাদা। কোনো কম্পোনেন্টে এপিসোড-নির্দিষ্ট লেখা হার্ডকোড করা নেই।

## নতুন এপিসোড যোগ করা

1. `episodes/episode-11/` ফোল্ডার বানান।
2. `script.md` (বাংলা script) আর `subtitles.srt` রাখুন।
3. `episode-10/episode.meta.json` কপি করে বদলান: প্রতিটি বাক্যের ইলাস্ট্রেশন key, intro/outro-এর anchor শব্দ ইত্যাদি।
4. `npx tsx scripts/build-episode.ts episodes/episode-11`
5. `npx tsx scripts/validate-episode.ts episodes/episode-11`
6. `src/Root.tsx`-এ `episodeJson` import-এর পাথ বদলান (অথবা API থেকে `episode` প্রপস হিসেবে পাঠান)।

নতুন ইলাস্ট্রেশন লাগলে `src/components/Illustrations.tsx`-এ একটি SVG কম্পোনেন্ট বানিয়ে নিচের `illustrations` রেজিস্ট্রিতে যোগ করুন।

## Script ফরম্যাট

- প্রথম কয়েক লাইন: hook (প্রথম `?` পর্যন্ত) এবং intro।
- প্রতিটি বাক্য: `Sentence N`, তারপর উচ্চারণ (একই লাইন দুইবার থাকলে একবার দেখানো হয়), তারপর `অর্থ: ...`।
- শেষে outro লাইনগুলো। `DAY N DONE!` এবং `Day N-এ` থেকে এপিসোড নম্বর ও পরের এপিসোড নেওয়া হয়।
- আরবি লিপি না থাকলে ভিডিওতে আরবি দেখানো হয় না। কিছুই বানিয়ে লেখা হয় না।

## SRT ও টাইমিং কীভাবে কাজ করে

- কনটেন্ট আসে **script** থেকে, সময় আসে **SRT** থেকে।
- SRT-র প্রতিটি cue-র শব্দগুলোতে অক্ষরের দৈর্ঘ্য অনুযায়ী আনুমানিক সময় বসানো হয়। এরপর `Sentence ninety one` ধরনের মার্কার, `[আরবি` প্লেসহোল্ডার ও `অর্থ` শব্দ দিয়ে প্রতিটি বাক্যের শুরু, উচ্চারণ, পুনরাবৃত্তি ও অর্থের সময় বের করা হয়।
- কোনো মার্কার না পেলে `build:episode` ব্যর্থ হয়, অনুমানে ভুল ভিডিও বানায় না।

## অডিও যোগ করা (পরে)

```powershell
mkdir public\audio
copy .\voiceover.wav public\audio\narration.wav
```

`ArabicMasterComposition`-এ `audioSrc` প্রপ আছে (`public/`-এর ভেতরের পাথ বা http URL)। না দিলে ভিডিও নিঃশব্দ।

## পরে রেন্ডার করা

```powershell
# অডিও সহ
npx tsx scripts/render-entry.ts episodes/episode-10 out/day-10.mp4 audio/narration.wav

# অথবা সরাসরি Remotion CLI
npm run render
```

ব্যাকএন্ড থেকে:

```ts
import { renderEpisode } from "./scripts/render-entry";
await renderEpisode({
  episodeDir: "episodes/episode-10",
  outputPath: "out/day-10.mp4",
  audioSrc: "audio/narration.wav",
  compositionId: "ArabicMaster",
});
```

`calculateMetadata` প্রপস থেকে দৈর্ঘ্য নেয়, তাই অন্য `episode` JSON পাঠালেও দৈর্ঘ্য ঠিক হয়।

## সীমাবদ্ধতা (সৎভাবে)

- **সম্পূর্ণ ভিডিও রেন্ডার করে দেখা হয়নি।** স্যান্ডবক্সে ৬টি ফ্রেম (Thumbnail, Intro-র লোগো ও ৩০ দিনের গ্রিড, Sentence 91, Sentence 99, Outro-র ফলো দৃশ্য) চোখে দেখা হয়েছে। বাকি আটটি বাক্যের ইলাস্ট্রেশন, প্রোগ্রেস বার, journey, comment ও next দৃশ্য আমি চোখে দেখিনি। Studio-তে নিজে দেখে নিন।
- **অডিওর সঙ্গে সিঙ্ক যাচাই হয়নি।** টাইমিং শুধু SRT থেকে আনুমানিক। cue-র ভেতরের বাক্য-সীমানা (যেমন Sentence 92 শুরু) interpolation-এ বের করা। Sentence 95-এর "২য় বার" সময় একটি অনুমান (বিল্ডে warning দেখায়)।
- SRT-র `[আরবি ভাষা]` অংশের ভেতরের টাইমিং নির্ভরযোগ্য নয়।
- Thumbnail প্রায় ৪.২ সেকেন্ড (hook বাক্যটি বলা শেষ হওয়া পর্যন্ত), যা ২–৩ সেকেন্ডের লক্ষ্যের চেয়ে সামান্য বেশি। `episode.meta.json`-এর `thumbnailEndAnchor` বদলে ঠিক করা যায়।
- আউট্রোর "সৌদি আরবি" শব্দটি `episode.meta.json`-এর `textNormalizations` অনুযায়ী "আরবি" করা হয়েছে (Gulf Arabic নিয়ম ও অডিওর সঙ্গে মিল রাখতে)। চাইলে ওই এন্ট্রি মুছে দিন।
- ভিডিও ২ মিনিট ৩৬ সেকেন্ডের কাছাকাছি। Shorts/Reels-এর বর্তমান দৈর্ঘ্য-সীমা আপলোডের আগে দেখে নিন।
- Remotion বাণিজ্যিক ব্যবহারে (বড় কোম্পানির ক্ষেত্রে) লাইসেন্স লাগতে পারে। অফিসিয়াল লাইসেন্স পাতা দেখে নিন।
- ইলাস্ট্রেশনগুলো কোডে আঁকা সরল ফ্ল্যাট ভেক্টর। মান আপনার পছন্দমতো না হলে `Illustrations.tsx` সম্পাদনা করুন।

## সমস্যা সমাধান

| সমস্যা | সমাধান |
|---|---|
| `build:episode` বলে marker পাওয়া যায়নি | SRT-তে `Sentence <সংখ্যা>` শব্দ আছে কি দেখুন; `episode.meta.json`-এর anchor মেলান |
| বাংলা অক্ষর ভাঙা | `public/fonts/` ফাইলগুলো আছে কি দেখুন; `npm ci` আবার চালান |
| Studio-তে ফন্ট দেরিতে আসে | কম্পোজিশন ফন্ট লোড হওয়া পর্যন্ত রেন্ডার থামিয়ে রাখে, প্রথমবার একটু অপেক্ষা করুন |
| `npm ci` ব্যর্থ | Node 20+ ও ইন্টারনেট আছে কি দেখুন |
