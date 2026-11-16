// SRT is the single source of truth for timing (copy of public/reel1.srt).
export const SRT_TEXT = `00:00:00,460 --> 00:00:01,020 [Speaker 0]
مرحبا.

00:00:02,800 --> 00:00:03,400 [Speaker 0]
أهلًا.

00:00:05,260 --> 00:00:05,660 [Speaker 0]
هلا.

00:00:07,400 --> 00:00:08,200 [Speaker 0]
صبح الخير.

00:00:09,840 --> 00:00:10,700 [Speaker 0]
صبح النور.

00:00:12,540 --> 00:00:13,420 [Speaker 0]
مساء الخير.

00:00:15,200 --> 00:00:16,100 [Speaker 0]
مساء النور.

00:00:17,840 --> 00:00:18,640 [Speaker 0]
كيف حالك؟

00:00:20,300 --> 00:00:21,400 [Speaker 0]
إيش أخبارك؟

00:00:23,140 --> 00:00:23,960 [Speaker 0]
الحمد لله.
`;

export type Cue = {index: number; start: number; end: number; text: string};

const toSec = (h: string, m: string, s: string, ms: string) =>
  Number(h) * 3600 + Number(m) * 60 + Number(s) + Number(ms) / 1000;

export const parseSrt = (src: string): Cue[] => {
  const re =
    /(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})[^\n]*\n([\s\S]*?)(?=\n\s*\n|$)/g;
  const out: Cue[] = [];
  const text = src.replace(/\r\n/g, '\n');
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    out.push({
      index: out.length,
      start: toSec(m[1], m[2], m[3], m[4]),
      end: toSec(m[5], m[6], m[7], m[8]),
      text: m[9].trim(),
    });
  }
  return out;
};
