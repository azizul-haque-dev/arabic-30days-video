/**
 * Static validation of episode data + self-test of the timing engine (no browser needed).
 *   npm run validate:config
 */
import { episodes } from "../src/episodes/registry";
import { splitUnits, toBengaliDigits } from "../src/lib/format";
import { theme } from "../src/theme";
import { buildBeatSpecs, buildTimeline } from "../src/timing/buildTimeline";
import { parseSrt } from "../src/timing/srt";
import type { EpisodeManifestEntry } from "../src/timing/types";

let failures = 0;
const check = (name: string, cond: boolean, detail = "") => {
  if (!cond) failures++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${!cond && detail ? `  -> ${detail}` : ""}`);
};

const fmtTs = (s: number) => {
  const ms = Math.round(s * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`;
};

for (const ep of episodes) {
  console.log(`\n== ${ep.episodeId} ==`);
  const [from, to] = ep.sentenceRange;
  check("sentence count matches range", ep.sentences.length === to - from + 1, `${ep.sentences.length} vs ${to - from + 1}`);
  check(
    "sentence numbers are consecutive and match range",
    ep.sentences.every((s, i) => s.number === from + i),
  );
  check("previousCompleted = range start - 1", ep.previousCompleted === from - 1);
  check("currentCompleted = range end", ep.currentCompleted === to);
  const pct = (n: number) => +((n / ep.totalSeriesSentences) * 100).toFixed(2);
  check("progress before = 53.33%", pct(ep.previousCompleted) === 53.33, String(pct(ep.previousCompleted)));
  check("progress after = 56.67%", pct(ep.currentCompleted) === 56.67, String(pct(ep.currentCompleted)));
  check("canvas is 1080x1920 @ 30fps (9:16)", theme.canvas.width === 1080 && theme.canvas.height === 1920 && theme.canvas.fps === 30);

  for (const s of ep.sentences) {
    const pu = splitUnits(s.pronunciation);
    const au = splitUnits(s.arabic);
    check(`${s.id}: pronunciation/arabic units aligned (${pu.length}/${au.length})`, pu.length === au.length);
    check(`${s.id}: pronunciation + arabic + meaning non-empty`, !!(s.pronunciation && s.arabic && s.meaning));
    check(`${s.id}: narration.phrase equals pronunciation`, s.narration.phrase === s.pronunciation);
    check(
      `${s.id}: narration lead mentions its number`,
      s.narration.lead.includes(toBengaliDigits(s.number)),
    );
    check(`${s.id}: narration meaning contains on-screen meaning`, s.narration.meaning.includes(s.meaning));
  }

  const intro4 = ep.intro[3].narration;
  check("intro mentions previous progress (১৬০)", intro4.includes(toBengaliDigits(ep.previousCompleted)));
  check("outro mentions current progress (১৭০)", ep.outro[0].narration.includes(toBengaliDigits(ep.currentCompleted)));

  // ---- timing engine self-test ----
  const fps = 30;
  const specs = buildBeatSpecs(ep);
  check(`beat count = ${ep.intro.length}+${ep.sentences.length * 3}+${ep.outro.length}`, specs.length === ep.intro.length + ep.sentences.length * 3 + ep.outro.length);

  const draft = buildTimeline(ep, undefined, fps);
  const mono = draft.beats.every((b, i) => i === 0 || b.startFrame > draft.beats[i - 1].startFrame);
  check("draft timeline: beats strictly increasing", mono);
  check("draft timeline: starts at frame 0, ends at duration", draft.beats[0].startFrame === 0 && draft.beats[draft.beats.length - 1].endFrame === draft.durationInFrames);
  check("draft timeline is flagged unverified/estimated", !draft.verified && draft.source === "estimated");

  // Synthetic SRT built from a known timeline -> alignment must recover it exactly.
  const total = 200;
  const synthetic = buildTimeline(ep, { episodeId: ep.episodeId, audio: { publicPath: "x", durationSec: total, sampleRate: 44100, channels: 1, codec: "t", bitrateKbps: 0, warnings: [] }, subtitles: null, analysis: null, searched: [] }, fps);
  const srt = synthetic.beats
    .map((b, i) => `${i + 1}\n${fmtTs(b.startSec)} --> ${fmtTs(b.endSec - 0.05)}\n${b.narration}\n`)
    .join("\n");
  const cues = parseSrt(srt);
  check("SRT parser reads every cue", cues.length === specs.length, `${cues.length}`);
  const entry: EpisodeManifestEntry = { episodeId: ep.episodeId, audio: synthetic.hasAudio ? { publicPath: "x", durationSec: total, sampleRate: 44100, channels: 1, codec: "t", bitrateKbps: 0, warnings: [] } : null, subtitles: { publicPath: "s", cues }, analysis: null, searched: [] };
  const fromSrt = buildTimeline(ep, entry, fps);
  check("SRT alignment: every beat matched -> verified", fromSrt.verified && fromSrt.source === "srt", fromSrt.warnings.join(" | "));
  const maxErr = Math.max(...fromSrt.beats.map((b, i) => Math.abs(b.startSec - synthetic.beats[i].startSec)));
  check("SRT alignment: beat starts recovered within 2 ms (ms-rounded SRT)", maxErr < 0.002 || fromSrt.beats.every((b, i) => i === 0 || Math.abs(b.startSec - synthetic.beats[i].startSec) < 0.002), `maxErr=${maxErr}`);

  // SRT with a repeated pronunciation -> two emphasis pulses
  const s0 = ep.sentences[0];
  const phraseBeat = synthetic.beats.find((b) => b.id === `${s0.id}-phrase`)!;
  const rep = cues.slice();
  const idx = rep.findIndex((c) => c.text === s0.narration.phrase);
  rep.splice(idx + 1, 0, { index: 0, startSec: phraseBeat.startSec + 1, endSec: phraseBeat.startSec + 1.8, text: s0.narration.phrase });
  const withRep = buildTimeline(ep, { ...entry, subtitles: { publicPath: "s", cues: rep.map((c, i) => ({ ...c, index: i })) } }, fps);
  check("repeated pronunciation in SRT -> 2 emphasis pulses", withRep.sentenceTimings[s0.id].emphasisSec.length === 2, JSON.stringify(withRep.sentenceTimings[s0.id].emphasisSec));
}

console.log(failures === 0 ? "\nALL CONFIG CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
