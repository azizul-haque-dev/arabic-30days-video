/** Static QA: `npm run validate`. Does not render anything. */
import fs from "node:fs";
import path from "node:path";
import { parseSrt } from "../src/utils/srtParser";
import { buildTimeline, TOTAL_FRAMES, FPS } from "../src/utils/timeline";
import scenes from "../src/data/scenes.json";
import script from "../src/data/script.json";
import { illustrationMap } from "../src/illustrations";

const root = path.resolve(__dirname, "..");
const read = (p: string) => fs.readFileSync(path.join(root, p));
const audioCfg = JSON.parse(read("config/audio.config.json").toString());
const videoCfg = JSON.parse(read("config/video.config.json").toString());
const results: [boolean, string][] = [];
const check = (ok: boolean, msg: string) => results.push([ok, msg]);

// WAV duration
const wav = read("public/" + audioCfg.source);
let dur = 0;
if (wav.toString("ascii", 0, 4) === "RIFF") {
  let off = 12, byteRate = 0, dataLen = 0;
  while (off < wav.length - 8) {
    const id = wav.toString("ascii", off, off + 4), len = wav.readUInt32LE(off + 4);
    if (id === "fmt ") byteRate = wav.readUInt32LE(off + 16);
    if (id === "data") { dataLen = len; break; }
    off += 8 + len;
  }
  dur = dataLen / byteRate;
}
check(Math.abs(dur - audioCfg.durationSec) < 0.01, `audio file exists, duration ${dur.toFixed(4)}s matches config`);
check(audioCfg.enabled === true && audioCfg.volume > 0, "audio enabled by default, volume > 0");
check(TOTAL_FRAMES === Math.ceil(dur * FPS), `composition frames ${TOTAL_FRAMES} cover audio at ${FPS}fps`);
check(videoCfg.width === 1080 && videoCfg.height === 1920 && videoCfg.fps === 30, "1080x1920 @ 30fps");
check(videoCfg.durationInFrames === TOTAL_FRAMES, "video.config durationInFrames matches timeline");

const cues = parseSrt(read("input/subtitles.srt").toString());
check(cues.length === 23, `SRT parsed: ${cues.length} cues`);
check(Math.abs(cues[cues.length - 1].endSec - dur) < 0.1, "SRT end ≈ audio end");

const tl = buildTimeline();
check(tl[0].from === 0 && tl[0].config.type === "thumbnail", "first scene is the thumbnail at frame 0");
let contiguous = true;
tl.forEach((t, i) => { if (i && t.from !== tl[i - 1].from + tl[i - 1].duration) contiguous = false; });
check(contiguous, "scenes contiguous: no gaps, no overlaps");
const last = tl[tl.length - 1];
check(last.from + last.duration === TOTAL_FRAMES, "last scene ends on final frame");
check(tl.every((t) => t.duration > 0), "all scene durations positive");

let cuesOk = true;
for (const s of scenes.scenes) {
  for (const n of s.srtCues) {
    const c = cues.find((x) => x.index === n);
    if (!c || c.endSec < s.start - 0.01 || c.startSec > s.end + 1.0) { cuesOk = false; console.log("cue mismatch", s.id, n); }
  }
}
check(cuesOk, "every scene overlaps the SRT cues it references");

let beatsOk = true;
for (const s of scenes.scenes as any[]) {
  if (s.type !== "sentence") continue;
  const b = s.beats;
  if (!(s.start <= b.number && b.number < b.arabic && b.arabic < b.arabic2 && b.arabic2 < b.meaning && b.meaning < s.end)) { beatsOk = false; console.log("bad beats", s.id); }
}
check(beatsOk, "sentence beats ordered inside each scene");

const nums = script.sentences.map((s) => s.n);
check(nums.join() === Array.from({ length: 10 }, (_, i) => 81 + i).join(), "sentences numbered 81-90");
check(script.sentences.every((s) => illustrationMap[s.illustration]), "every sentence has an illustration");
check(script.sentences.every((s) => /[\u0600-\u06FF]/.test(s.arabic) && /[\u0980-\u09FF]/.test(s.pron + s.meaning)), "Arabic + Bengali present for every sentence");

for (const f of ["fonts/fonts.css", "audio/original-voice.wav", ...fs.readdirSync(path.join(root, "public/fonts")).filter((x) => x.endsWith(".woff2")).map((x) => "fonts/" + x)])
  if (!fs.existsSync(path.join(root, "public", f))) check(false, "missing asset " + f);
check(!results.some(([ok, m]) => !ok && m.startsWith("missing")), "all public assets present");

for (const [ok, m] of results) console.log(ok ? "PASS" : "FAIL", m);
process.exit(results.every(([ok]) => ok) ? 0 : 1);
