/* Runtime smoke test WITHOUT rendering video/images: server-renders React markup of selected frames
   through @remotion/player's Thumbnail (SSR) and checks no scene throws + key Bengali text is present. */
import { renderToStaticMarkup } from "react-dom/server";
import { Thumbnail } from "@remotion/player";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MainComposition } from "../src/MainComposition";
import { parseSrt } from "../src/parsers/srt";
import { buildTimeline } from "../src/services/timeline";
import type { EpisodeConfig } from "../src/types";

const root = join(__dirname, "..");
const episode = JSON.parse(readFileSync(join(root, "episode.config.json"), "utf8")) as EpisodeConfig;
const timeline = buildTimeline(episode, parseSrt(readFileSync(join(root, "public", episode.srt.path), "utf8")));
let failures = 0;
const html = (frame: number) =>
  renderToStaticMarkup(
    <Thumbnail component={MainComposition} compositionWidth={episode.video.width} compositionHeight={episode.video.height}
      frameToDisplay={frame} durationInFrames={timeline.totalFrames} fps={timeline.fps} inputProps={{ episode, timeline }} />,
  );
const decode = (h: string) => h.replace(/<[^>]+>/g, " ").replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&").replace(/\s+/g, " ");
const check = (label: string, ok: boolean) => { if (!ok) failures++; console.log(ok ? "  ✓" : "  ✗", label); };

for (const sc of timeline.scenes) {
  const frames = [0, 8, Math.floor(sc.durationInFrames / 2), sc.durationInFrames - 1].map((f) => sc.from + Math.min(f, sc.durationInFrames - 1));
  try {
    frames.forEach(html);
    check(`${sc.id}: ${frames.length} frames render without error`, true);
  } catch (e) {
    check(`${sc.id}: THREW ${(e as Error).message.slice(0, 160)}`, false);
  }
}

console.log("Text visibility");
const first = decode(html(0));
check("frame 0 is a full thumbnail (title lines + DAY 16 present)", episode.thumbnail.lines.every((l) => first.includes(l.split(" ")[0])) && first.includes(`DAY ${episode.episodeNumber}`) && first.includes(episode.thumbnail.seriesLine));
for (const st of episode.sentences) {
  const sc = timeline.scenes.find((s) => s.cfg.sentenceNumber === st.number)!;
  const endCue = st.cues.words ?? st.cues.meaning;
  const cue = sc.cues.find((c) => c.index === endCue)!;
  const d = decode(html(sc.from + Math.min(cue.start + 50, sc.durationInFrames - 12)));
  const pron = st.pronunciation.split(/\s+/).every((w) => d.includes(w));
  const meaning = st.meaning.split(/\s+/).every((w) => d.includes(w));
  const words = st.words.every((w) => d.includes(w.term) && d.includes(w.meaning.split(" ")[0]));
  check(`${st.number}: pronunciation + meaning${st.words.length ? " + word chips" : ""} visible`, pron && meaning && words);
}
const lastScene = timeline.scenes[timeline.scenes.length - 1];
const bye = decode(html(lastScene.from + 20));
check("goodbye scene shows SRT text", bye.includes("আসসালামা"));
console.log(failures ? `\nSMOKE FAILED (${failures})` : "\nSMOKE PASSED");
process.exit(failures ? 1 : 0);
