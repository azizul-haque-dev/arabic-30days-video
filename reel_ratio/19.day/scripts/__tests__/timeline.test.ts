import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { content } from "../../src/episodes/day-19/content";
import { parseSrt } from "../lib/srt";
import { buildTimeline } from "../lib/timeline";
import { norm } from "../lib/text";

const fixture = fs.readFileSync(path.join(__dirname, "fixtures", "day-19.sample.srt"), "utf8");
const build = (raw = fixture, c = content) => buildTimeline(parseSrt(raw).entries, c, { lenient: false, fps: 30 });

test("content table: 10 sentences numbered 181-190 with progress 180 -> 190 / 300", () => {
  assert.deepEqual(content.sentences.map((s) => s.number), [181, 182, 183, 184, 185, 186, 187, 188, 189, 190]);
  assert.equal(content.progress.to, 190);
  assert.equal(content.totalSentences, 300);
  assert.ok(content.sentences.every((s) => s.pronunciation && s.arabic && s.meaning));
});

test("SRT parser keeps 71 entries and millisecond precision", () => {
  const { entries } = parseSrt(fixture);
  assert.equal(entries.length, 71);
  assert.equal(entries.at(-1)!.endMs, 172_320);
});

test("timeline: 15 scenes, 5170 frames, strictly ordered, gap-free", () => {
  const r = build();
  assert.deepEqual(r.errors, []);
  assert.equal(r.scenes.length, 15);
  assert.equal(Math.ceil(r.durationSec * 30), 5170);
  assert.deepEqual(
    r.scenes.map((s) => s.type),
    ["opening", "intro", "section", ...Array(10).fill("sentence"), "challenge", "outro"],
  );
  r.scenes.forEach((s, i) => {
    if (i > 0) assert.equal(s.startFrame, r.scenes[i - 1]!.endFrame, `gap before scene ${i}`);
    assert.ok(s.endFrame > s.startFrame);
  });
  assert.equal(r.scenes.at(-1)!.endFrame, 5170);
});

test("every sentence has pronunciation and meaning events taken from real SRT times", () => {
  const { entries } = parseSrt(fixture);
  const r = build();
  for (const s of r.scenes) {
    if (s.type !== "sentence") continue;
    assert.ok(s.events.some((e) => e.kind === "pron"));
    assert.ok(s.events.some((e) => e.kind === "meaning"));
    for (const e of s.events) {
      const src = entries.find((x) => x.index === e.entry)!;
      assert.equal(e.startSec, src.startMs / 1000);
      assert.equal(e.endSec, src.endMs / 1000);
    }
  }
});

test("quick challenge uses sentences 182 and 183 in order", () => {
  const r = build();
  const ch = r.scenes.find((s) => s.type === "challenge");
  assert.ok(ch && ch.type === "challenge");
  assert.deepEqual(ch.items.map((i) => i.sentence), [182, 183]);
  assert.ok(ch.items[0]!.startSec < ch.items[1]!.startSec);
});

test("wrong entry count is a hard error in strict mode", () => {
  const cut = fixture.split("\n\n").slice(0, 70).join("\n\n");
  assert.ok(build(cut).errors.length > 0);
});

test("a missing sentence is reported with the closest SRT lines", () => {
  const broken = fixture.replaceAll(content.sentences[3]!.pronunciation, "ভুল লাইন");
  const r = build(broken);
  assert.ok(r.errors.some((e) => e.includes("Sentence 184") && e.includes("Closest")));
});

test("normalisation ignores punctuation, hyphens and ZWNJ but keeps letters", () => {
  assert.equal(norm("আশ-শুগল সাআব!"), norm("আশ শুগল  সাআব"));
  assert.equal(norm("বেতন কবে আসবে?"), "বেতন কবে আসবে");
  assert.notEqual(norm("আশ শুগুল"), norm("আশ শুগল"));
});
