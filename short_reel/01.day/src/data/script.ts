// Script text (from the user's message). The SRT supplies timing only; where the SRT
// text is garbled (e.g. "صبح" instead of "صباح") this script text wins.
export type Word = {
  ar: string;
  tr: string; // transliteration
  bn: string; // Bengali meaning
  bnShort: string;
  reply?: boolean; // "(উত্তর)"
};

export const WORDS: Word[] = [
  { ar: 'مرحبا', tr: 'মারহাবা', bn: 'হ্যালো / স্বাগতম', bnShort: 'হ্যালো / স্বাগতম' },
  { ar: 'أهلا', tr: 'আহলান', bn: 'স্বাগতম', bnShort: 'স্বাগতম' },
  { ar: 'هلا', tr: 'হালা', bn: 'হ্যালো / ওহে', bnShort: 'হ্যালো / ওহে' },
  { ar: 'صباح الخير', tr: 'সুবাহ আল-খায়ের', bn: 'শুভ সকাল', bnShort: 'শুভ সকাল' },
  { ar: 'صباح النور', tr: 'সুবাহ আন-নূর', bn: 'শুভ সকাল', bnShort: 'শুভ সকাল', reply: true },
  { ar: 'مساء الخير', tr: 'মাসা আল-খায়ের', bn: 'শুভ সন্ধ্যা', bnShort: 'শুভ সন্ধ্যা' },
  { ar: 'مساء النور', tr: 'মাসা আন-নূর', bn: 'শুভ সন্ধ্যা', bnShort: 'শুভ সন্ধ্যা', reply: true },
  { ar: 'كيف حالك', tr: 'কেইফ হালেক', bn: 'আপনি কেমন আছেন?', bnShort: 'আপনি কেমন আছেন?' },
  { ar: 'إيش أخبارك', tr: 'এশ আখবারাক', bn: 'আপনার কী খবর?', bnShort: 'আপনার কী খবর?' },
  {
    ar: 'الحمد لله',
    tr: 'আল-হামদুলিল্লাহ',
    bn: 'আলহামদুলিল্লাহ',
    bnShort: 'আলহামদুলিল্লাহ',
  },
];
export const PRAISE_SECOND_LINE = 'সকল প্রশংসা আল্লাহর।';
export const REPLY_LABEL = 'উত্তর';
