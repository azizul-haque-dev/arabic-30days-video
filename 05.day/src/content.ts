// On-screen text — taken from the user's script (transliteration + Bengali meaning), trimmed to key phrases.
export type IconId =
  | "heart" | "cake" | "rings" | "kids" | "shield" | "plane" | "calendar" | "cloud" | "sun" | "sunrise";

export const SENTENCES: Array<{
  n: number; nBn: string; icon: IconId; situation: string; phrase: string; meaning: string; recap: string;
}> = [
  { n: 1, nBn: "১", icon: "heart", situation: "কেউ আপনার উদারতার প্রশংসা করলে?", phrase: "হাদা মিন তাইয়্যিব আসলাক।", meaning: "এটা আপনার উদারতা।", recap: "উদারতা" },
  { n: 2, nBn: "২", icon: "cake", situation: "নতুন কারও বয়স জানতে চান?", phrase: "কাম উমরাক?", meaning: "আপনার বয়স কত?", recap: "বয়স" },
  { n: 3, nBn: "৩", icon: "rings", situation: "কারও বৈবাহিক অবস্থা জানতে চান?", phrase: "ইন্তা মিতজাওয়িজ?", meaning: "আপনি বিবাহিত?", recap: "বিবাহিত?" },
  { n: 4, nBn: "৪", icon: "kids", situation: "নিজের সন্তানদের কথা বলতে চান?", phrase: "ইন্দি তালাথা আওলাদ।", meaning: "আমার তিনটি সন্তান আছে।", recap: "সন্তান" },
  { n: 5, nBn: "৫", icon: "shield", situation: "সন্তানদের জন্য দোয়া করতে চান?", phrase: "আল্লাহ ইহফাযহুম", meaning: "আল্লাহ তাদেরকে হেফাজত করুন।", recap: "দোয়া" },
  { n: 6, nBn: "৬", icon: "plane", situation: "সৌদি আরবে কত দিন ধরে আছেন?", phrase: "মাতা জীত আস-সুঊদিয়্যা?", meaning: "সৌদি আরবে কবে এসেছেন?", recap: "কবে এসেছেন" },
  { n: 7, nBn: "৭", icon: "calendar", situation: "কত বছর ধরে আছেন, বলতে চান?", phrase: "লি খামসা সিনীন হিনা।", meaning: "আমি এখানে পাঁচ বছর ধরে আছি।", recap: "পাঁচ বছর" },
  { n: 8, nBn: "৮", icon: "cloud", situation: "এলাকার আবহাওয়া জানতে চান?", phrase: "কেইফ আল-জাও ইন্দাকুম?", meaning: "আপনাদের ওখানে আবহাওয়া কেমন?", recap: "আবহাওয়া" },
  { n: 9, nBn: "৯", icon: "sun", situation: "আজ প্রচণ্ড গরম, সেটা বলতে চান?", phrase: "আল-জাও হার্র মাররা আল-ইয়াওম।", meaning: "আজ আবহাওয়া প্রচণ্ড গরম।", recap: "প্রচণ্ড গরম" },
  { n: 10, nBn: "১০", icon: "sunrise", situation: "আগামীকাল দেখা হবে বলে বিদায় জানাতে চান?", phrase: "আশুফাক বুকরা ইনশাআল্লাহ।", meaning: "আগামীকাল দেখা হবে, ইনশাআল্লাহ!", recap: "বিদায়" },
];
