export interface SentenceData {
  num: number;
  arabic: string;
  translit: string;
  meaning: string;
  situation: string;
  icon: string;
}

export const SENTENCES: SentenceData[] = [
  { num: 131, arabic: "لف يمين", translit: "লিফ ইয়ামীন", meaning: "ডানে ঘুরুন", situation: "ডান দিকে মোড় নেওয়ার সময়", icon: "arrow-right" },
  { num: 132, arabic: "لف يسار", translit: "লিফ ইয়াসার", meaning: "বামে ঘুরুন", situation: "বাম দিকে মোড় নেওয়ার নির্দেশ", icon: "arrow-left" },
  { num: 133, arabic: "كمّل على طول", translit: "কাম্মিল আলা তূল", meaning: "সোজা চলুন", situation: "সোজা এগিয়ে যাওয়ার জন্য", icon: "arrow-up" },
  { num: 134, arabic: "قريب من هنا", translit: "গারীব মিন হিনা", meaning: "এখান থেকে কাছেই", situation: "দূরত্ব একদম কাছে হলে", icon: "map-pin" },
  { num: 135, arabic: "بعيد مرّة", translit: "বা'ঈদ মাররা", meaning: "অনেক দূর", situation: "গন্তব্য অনেক দূরে বোঝাতে", icon: "compass" },
  { num: 136, arabic: "كم المسافة؟", translit: "কাম আল-মাসাফাহ?", meaning: "কতটা দূর?", situation: "দূরত্ব জানতে চাওয়ার প্রশ্ন", icon: "ruler" },
  { num: 137, arabic: "كم ياخذ وقت؟", translit: "কাম ইয়াখুদ ওয়াক্ত?", meaning: "কতক্ষণ লাগবে?", situation: "সময় জানতে চাওয়ার প্রশ্ন", icon: "clock" },
  { num: 138, arabic: "الطريق زحمة", translit: "আত-তারীগ যাহমা", meaning: "রাস্তায় অনেক জ্যাম", situation: "ট্রাফিক জ্যামের কথা বলতে", icon: "car" },
  { num: 139, arabic: "خذ طريق ثاني", translit: "খুদ তারীগ তানি", meaning: "অন্য রাস্তা ধরুন", situation: "বিকল্প পথ নিতে অনুরোধ", icon: "git-branch" },
  { num: 140, arabic: "أنا تأخرت", translit: "আনা তা'আখখারত", meaning: "আমার দেরি হয়ে গেছে", situation: "দেরি হওয়ার কথা জানাতে", icon: "alert-circle" },
];
