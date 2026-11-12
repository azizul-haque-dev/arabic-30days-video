/**
 * Generates a SYNTHETIC sample SRT (71 entries) used ONLY for tests and layout previews.
 * These timings are invented on purpose and must never be used for the real episode.
 */
import fs from "node:fs";
import path from "node:path";
import { content } from "../../src/episodes/day-19/content";

const fmt = (sec: number) => {
  const ms = Math.round(sec * 1000);
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const r = ms % 1000;
  const p = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${p(h)}:${p(m)}:${p(s)},${p(r, 3)}`;
};

type Row = [number, number, string];
const rows: Row[] = [];
const add = (a: number, b: number, t: string) => rows.push([a, b, t]);

add(0.0, 4.8, "আজকের পর্বে স্বাগতম");
add(4.9, 9.8, "বেতন আর ছুটির সমস্যা");
add(10.0, 17.5, "আরবি মাস্টার থার্টি ডে সার্ভাইভাল আরবি");
add(17.6, 25.8, "আজ দিন নাইনটিন");
add(26.0, 27.9, content.sectionTitle);

const starts = [28, 40, 52, 64, 75, 84, 96, 108, 121, 132, 145];
content.sentences.forEach((s, k) => {
  const a = starts[k]!;
  const b = starts[k + 1]! - 0.4;
  const step = (b - a) / 6;
  const parts = [s.pronunciation, s.pronunciation, s.meaning, "আবার বলুন", s.pronunciation, s.meaning];
  parts.forEach((t, i) => add(a + i * step, a + (i + 1) * step - 0.1, t));
});
add(145.0, 148.9, "এবার একটি কুইক চ্যালেঞ্জ");
add(149.2, 153.0, "১. আমার বেতন আসেনি।");
add(154.0, 158.0, "২. বেতন কবে আসবে?");
add(160.0, 164.0, "প্রতিদিন অনুশীলন করুন");
add(164.1, 168.0, "পরের পর্বে দেখা হবে");
add(168.2, 172.32, "আরবি মাস্টার");

const out = rows.map(([a, b, t], i) => `${i + 1}\n${fmt(a)} --> ${fmt(b)}\n${t}\n`).join("\n");
const file = path.join(__dirname, "fixtures", "day-19.sample.srt");
fs.writeFileSync(file, out);
console.log(`wrote ${rows.length} entries -> ${path.relative(process.cwd(), file)}`);
