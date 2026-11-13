import type { EpisodeContent } from "../../types";

/**
 * Episode 19 content. Episode-specific data lives here, reusable UI lives in /components.
 * Bengali pronunciation strings are copied verbatim from the master prompt table
 * and MUST match the SRT text. Do not "fix" them silently (see `linguisticFlags` in README).
 */
export const content: EpisodeContent = {
  episode: 19,
  brand: "Arabic Master",
  series: "30-Day Survival Arabic",
  topicEn: "Work & Salary",
  sectionTitle: "কাজ ও বেতন নিয়ে প্রয়োজনীয় বাক্য",
  totalSentences: 300,
  progress: { from: 180, to: 190, fromPercent: 60, toPercent: 63.33 },
  nextEpisode: 20,
  labels: {
    challenge: "Quick Challenge",
    dailyPractice: "Daily Practice",
    next: "NEXT",
  },
  expected: { srtEntries: 71, durationSec: 172.32, durationToleranceSec: 0.5 },
  sceneAnchorsSec: { intro: 10, section: 26, challenge: 145, outro: 160 },
  sentences: [
    { number: 181, pronunciation: "আবগা ইজাজা", arabic: "أبغى إجازة", meaning: "আমি ছুটি চাই।", illustration: "leave-request" },
    { number: 182, pronunciation: "রাতেবি মা নাযিল", arabic: "راتبي ما نزل", meaning: "আমার বেতন আসেনি।", illustration: "salary-missing" },
    { number: 183, pronunciation: "মিতা ইয়েনযিল আর-রাতিব", arabic: "متى ينزل الراتب؟", meaning: "বেতন কবে আসবে?", illustration: "salary-question" },
    { number: 184, pronunciation: "এন্দি শুগুল কাথির", arabic: "عندي شغل كثير", meaning: "আমার অনেক কাজ আছে।", illustration: "busy-desk" },
    { number: 185, pronunciation: "খাল্লাসত আশ শুগুল", arabic: "خلصت الشغل", meaning: "কাজ শেষ করেছি।", illustration: "task-done" },
    { number: 186, pronunciation: "লাযিম আরুহ বদরি", arabic: "لازم أروح بدري", meaning: "আমাকে তাড়াতাড়ি যেতে হবে।", illustration: "leave-early" },
    { number: 187, pronunciation: "তাবান মিন আশ-শুগল", arabic: "تعبان من الشغل", meaning: "কাজ করে ক্লান্ত।", illustration: "tired" },
    { number: 188, pronunciation: "আশ-শুগল সাআব শুয়াই", arabic: "الشغل صعب شوي", meaning: "কাজটি একটু কঠিন।", illustration: "difficult-task" },
    { number: 189, pronunciation: "আল্লিমনি কেফ আসাউই", arabic: "علمني كيف أسوي", meaning: "আমাকে শিখিয়ে দিন কীভাবে করবো।", illustration: "teach-steps" },
    { number: 190, pronunciation: "আনা আসাউই হাদা", arabic: "أنا أسوي هذا", meaning: "আমি এটা করছি।", illustration: "demonstrate" },
  ],
  challengeSentences: [182, 183],
};
