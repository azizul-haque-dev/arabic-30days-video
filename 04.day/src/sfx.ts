// Every SFX frame is derived from the same SRT-based timing (visual landing frames), landing 2–3 frames before the visual.
import { SfxEvent } from "./components/Audio";
import { marks, scenes, sentenceTimings } from "./timing";

const L = 2;
export const buildSfx = (): SfxEvent[] => {
  const ev: SfxEvent[] = [];
  const st = (id: string) => scenes.find((s) => s.id === id)!.start;
  // hook
  ev.push({ frame: 2, name: "whoosh" });
  ev.push({ frame: marks.fourth - L, name: "thud" });
  // lesson / how / go
  ev.push({ frame: st("lesson") - L, name: "swipe" });
  ev.push({ frame: marks.gulf - L, name: "pop_a" });
  ev.push({ frame: marks.ten - L, name: "pop_b" });
  ev.push({ frame: st("how") - L, name: "swipe" });
  ev.push({ frame: marks.twice - L, name: "pop_a" });
  ev.push({ frame: marks.listen - L, name: "click" });
  ev.push({ frame: st("go") - L, name: "swipe" });
  ev.push({ frame: st("go") + 4, name: "thud" });
  // sentences
  sentenceTimings.forEach((t, i) => {
    ev.push({ frame: t.start - L, name: "swipe" });
    ev.push({ frame: t.start + t.phrase - L, name: i % 2 ? "pop_b" : "pop_a" });
    ev.push({ frame: t.start + t.mean - L, name: i % 2 ? "pop_a" : "pop_b" });
    ev.push({ frame: t.start + t.mean + 8, name: "click" });
  });
  // recap … outro
  ev.push({ frame: st("recap") - L, name: "swipe" });
  ev.push({ frame: st("recap") + 8, name: "pop_a" });
  ev.push({ frame: scenes.find((s) => s.id === "recap")!.end - 24, name: "chime" });
  ev.push({ frame: st("question") - L, name: "swipe" });
  ev.push({ frame: st("question") + 62, name: "pop_b" });
  ev.push({ frame: st("tagline") - L, name: "whoosh" });
  ev.push({ frame: st("cta") - L, name: "swipe" });
  ev.push({ frame: marks.follow + 4, name: "click" });
  ev.push({ frame: marks.day4 - 18, name: "pop_a" });
  ev.push({ frame: st("outro") - L, name: "swipe" });
  ev.push({ frame: st("outro") + 26, name: "chime" });
  return ev.filter((e) => e.frame >= 0);
};
