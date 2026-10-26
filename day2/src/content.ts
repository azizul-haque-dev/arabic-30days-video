import type {IconName} from './icons';
// Text taken from the user's script (SRT has "[আরবি ভাষা]" placeholders).
export const PHRASES: {n: number; ar: string; meaning: string; icon: IconName}[] = [
  {n: 1, ar: "ওয়াল্লাহ, মাশগুল শুয়াইয়া।", meaning: 'সত্যি বলতে, একটু ব্যস্ত আছি।', icon: 'clock'},
  {n: 2, ar: "নিতগাবাল বা'দেইন।", meaning: 'পরে দেখা হবে।', icon: 'calendar'},
  {n: 3, ar: 'আলা খাইর, ইনশাআল্লাহ।', meaning: 'ইনশাআল্লাহ, ভালোভাবে হবে। / ভালো থাকবেন।', icon: 'crescent'},
  {n: 4, ar: 'সাল্লিম আলাল-আহল।', meaning: 'পরিবারের সবাইকে আমার সালাম দেবেন।', icon: 'family'},
  {n: 5, ar: "আল্লাহ ইয়িসাল্লিমাক ওয়া ইয়ি'আফিক।", meaning: 'আল্লাহ আপনাকে নিরাপদে ও সুস্থ রাখুন।', icon: 'shield'},
  {n: 6, ar: 'ঈশ তিসাওয়ি দাহীন?', meaning: 'এখন কী করছেন?', icon: 'question'},
  {n: 7, ar: 'মা আসাওয়ি শাই।', meaning: 'কিছু করছি না।', icon: 'dash'},
  {n: 8, ar: 'আনা ফাদি আল-ইয়াওম।', meaning: 'আমি আজ ফ্রি আছি।', icon: 'sun'},
  {n: 9, ar: "তা'আল ইশরাব শাহী মা'আয়া।", meaning: 'আসুন, আমার সঙ্গে চা খান।', icon: 'cup'},
  {n: 10, ar: 'শুকরান, মা তিগাসসির।', meaning: 'ধন্যবাদ, আপনি অনেক করেছেন। / আপনার সহযোগিতার জন্য ধন্যবাদ।', icon: 'heart'},
];
export const REPEAT_PROMPT = 'আমার সঙ্গে বলুন';
