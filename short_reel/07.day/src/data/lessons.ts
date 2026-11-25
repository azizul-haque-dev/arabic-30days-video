export type IconKey =
  | "brother" | "sister" | "boy" | "girl" | "husband"
  | "wife" | "family" | "friend" | "people" | "men";

export type Lesson = {
  id: string;
  /** Arabic WITHOUT harakat (diacritics) */
  arabic: string;
  /** Bangla pronunciation — must match the SRT */
  pron: string;
  /** Bangla meaning — must match the SRT */
  meaning: string;
  icon: IconKey;
};

// Order = SRT order. Words 61–70.
export const LESSONS: Lesson[] = [
  {id: "akh", arabic: "أخ", pron: "আখু", meaning: "ভাই", icon: "brother"},
  {id: "ukht", arabic: "أخت", pron: "উখত", meaning: "বোন", icon: "sister"},
  {id: "walad", arabic: "ولد", pron: "ওয়ালাদ", meaning: "ছেলে", icon: "boy"},
  {id: "bint", arabic: "بنت", pron: "বিন্ত", meaning: "মেয়ে", icon: "girl"},
  {id: "zawj", arabic: "زوج", pron: "জাওজ", meaning: "স্বামী", icon: "husband"},
  {id: "zawja", arabic: "زوجة", pron: "জাওজাহ", meaning: "স্ত্রী", icon: "wife"},
  {id: "aila", arabic: "عائلة", pron: "আয়লা", meaning: "পরিবার", icon: "family"},
  {id: "sahib", arabic: "صاحب", pron: "সাহেব", meaning: "বন্ধু", icon: "friend"},
  {id: "nas", arabic: "ناس", pron: "নাস", meaning: "মানুষ", icon: "people"},
  {id: "rijal", arabic: "رجال", pron: "রিজজাল", meaning: "পুরুষ", icon: "men"},
];
