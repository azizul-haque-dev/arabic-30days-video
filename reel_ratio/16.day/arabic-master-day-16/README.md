# Arabic Master — Day 16 · Restaurant Food Ordering (Remotion প্রজেক্ট)

30 Days Survival Arabic · বাক্য 151–160 · 1080×1920 · 30 fps · 9:16

> **এই ZIP-এ কোনো ভিডিও রেন্ডার করা নেই।** এটি সম্পূর্ণ এডিটযোগ্য Remotion সোর্স। অডিও ছাড়া (নীরব) সেটআপ — অডিও পরে যোগ করা যায়।

## দ্রুত শুরু
```bash
npm install
npm run studio        # Remotion Studio-তে প্রিভিউ
npm run typecheck     # TypeScript চেক
npm run validate      # কনফিগ + SRT + টাইমলাইন + কনটেন্ট যাচাই (রেন্ডার ছাড়া)
npm run smoke         # প্রতিটি সিনের রানটাইম চেক (SSR, ভিডিও/ছবি রেন্ডার ছাড়া)
```

## স্ট্রাকচার
```
episode.config.json     ← এপিসোডের সব ডেটা (সংখ্যা, বাক্য, সিন→SRT ম্যাপিং, অডিও সুইচ)
script.md               ← SRT থেকে স্ক্রিপ্ট
public/subtitles.srt    ← একমাত্র টাইমলাইন সোর্স (৭৫ এন্ট্রি)
public/fonts/           ← Hind Siliguri (বাংলা+ল্যাটিন), Inter (ইংরেজি) — অফলাইন woff2
public/audio/           ← narration.mp3 এখানে রাখুন (ঐচ্ছিক)
src/Root.tsx            ← Composition + calculateMetadata (SRT পড়ে duration/টাইমিং বানায়)
src/parsers/srt.ts      ← UTF-8/মাল্টিলাইন SRT পার্সার + ভ্যালিডেশন
src/services/timeline.ts← SRT → ফ্রেম-নির্ভুল সিন টাইমলাইন
src/scenes/             ← Thumbnail, Intro, SentenceScene, Outro
src/components/         ← পুনর্ব্যবহারযোগ্য UI/মোশন কম্পোনেন্ট
src/illustrations/      ← সব ভেক্টর ইলাস্ট্রেশন (React SVG: টেবিল, ওয়েটার, কাবছা, চিকেন, বিরিয়ানি, মাছ, ঝাল, জুস, পানি…)
src/theme.ts            ← রঙ, ফন্ট, ইজিং, স্প্রিং, ইলাস্ট্রেশন প্যালেট
```

## টাইমিং কীভাবে কাজ করে
- প্রতিটি সিন `episode.config.json`-এ `startCue` (SRT নম্বর) দিয়ে শুরু হয় এবং পরের সিন যেখানে শুরু সেখানে শেষ হয়।
- মোট দৈর্ঘ্য = শেষ SRT এন্ট্রির শেষ + `srt.tailSeconds`। বর্তমানে ৬৫৬৪ ফ্রেম (≈ ২১৮.৮ সেকেন্ড)।
- বাক্য সিনে উচ্চারণ/অর্থ/শব্দ-ব্যাখ্যা তাদের নিজ নিজ SRT এন্ট্রির শুরুতে আসে; দ্বিতীয়বার বলার (repeat) সময় উচ্চারণ কার্ডে হালকা পালস হয়।
- SRT টাইমস্ট্যাম্প সাবটাইটেল টাইমিং; ওয়ার্ড-লেভেল ওয়েভফর্ম নয়। অডিও যোগ করলে সিঙ্ক চোখে দেখে যাচাই করুন (`audio.offsetSeconds` আছে)।

## অডিও যোগ করা
`public/audio/narration.mp3` রেখে `episode.config.json`-এ `audio.enabled: true` করুন।

## ফন্ট
বাংলা: Hind Siliguri, ইংরেজি: Inter (লাইসেন্স `public/fonts/`-এ)। এই এপিসোডে কোনো আরবি লিপি দেখানো হয় না (স্ক্রিপ্টে নেই), তাই Noto Sans Arabic লোড হয় না। ভবিষ্যতে দরকার হলে `NotoSansArabic-*.woff2` `public/fonts/`-এ রেখে `src/fonts.tsx`-এর `faces` তালিকায় যোগ করুন (`theme.fonts.ar` তৈরি আছে)।

## পরে রেন্ডার করতে (শুধু ডকুমেন্টেশন — এখানে চালানো হয়নি)
```bash
npx remotion render src/index.ts ArabicMasterComposition out/day-16.mp4 --codec h264 --crf 17
```
Node API:
```ts
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
const serveUrl = await bundle({ entryPoint: "src/index.ts" });
const composition = await selectComposition({ serveUrl, id: "ArabicMasterComposition", inputProps: {/* optional: { episode } override */} });
await renderMedia({ composition, serveUrl, codec: "h264", outputLocation: "out/day-16.mp4", inputProps: {/* same */} });
```
(`@remotion/bundler`, `@remotion/renderer` আলাদা ইনস্টল করতে হবে।) ভিন্ন এপিসোডের জন্য `episode.config.json` + `public/subtitles.srt` বদলান বা `inputProps.episode` দিন; composition id/ফাইল পাথ কনফিগে।

## জানা নোট
- সেন্টেন্স 159-এর "অর্থ" আলাদা SRT এন্ট্রিতে বলা হয়নি; শব্দ-ব্যাখ্যার এন্ট্রি (৬১) শুরুতে একসাথে দেখানো হয়।
- সেন্টেন্স 153: SRT-এ "পুরানো বা গ্রিল করা", স্ক্রিনে লেবেল "গ্রিল করা" (নির্দেশ অনুযায়ী)। SRT ফাইল অপরিবর্তিত।
- সেন্টেন্স 152-এর শব্দ-চিপ (এশ = কি, আল ইয়াওম = আজ) SRT এন্ট্রি ২০ থেকে হুবহু নেওয়া।
- ভিজ্যুয়াল লেআউট Remotion Studio-তে চোখে দেখে যাচাই করুন — এখানে ভিডিও/ফ্রেম রেন্ডার করা হয়নি।
