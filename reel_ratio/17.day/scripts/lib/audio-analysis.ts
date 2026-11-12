import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { Gap } from "../../src/timing/types";

const TARGET_RATE = 16000;

/** Native WAV (PCM16 / float32) reader. Returns null for anything it can't handle. */
const readWav = (file: string): { samples: Float32Array; rate: number } | null => {
  const buf = readFileSync(file);
  if (buf.length < 44 || buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WAVE") return null;
  let pos = 12;
  let fmt: { format: number; channels: number; rate: number; bits: number } | null = null;
  while (pos + 8 <= buf.length) {
    const id = buf.toString("ascii", pos, pos + 4);
    const size = buf.readUInt32LE(pos + 4);
    const body = pos + 8;
    if (id === "fmt ") {
      fmt = {
        format: buf.readUInt16LE(body),
        channels: buf.readUInt16LE(body + 2),
        rate: buf.readUInt32LE(body + 4),
        bits: buf.readUInt16LE(body + 14),
      };
    } else if (id === "data" && fmt) {
      const bytes = Math.min(size, buf.length - body);
      const bps = fmt.bits / 8;
      const frames = Math.floor(bytes / (bps * fmt.channels));
      const out = new Float32Array(frames);
      for (let i = 0; i < frames; i++) {
        let acc = 0;
        for (let c = 0; c < fmt.channels; c++) {
          const o = body + (i * fmt.channels + c) * bps;
          if (fmt.format === 1 && fmt.bits === 16) acc += buf.readInt16LE(o) / 32768;
          else if (fmt.format === 3 && fmt.bits === 32) acc += buf.readFloatLE(o);
          else return null;
        }
        out[i] = acc / fmt.channels;
      }
      return { samples: out, rate: fmt.rate };
    }
    pos = body + size + (size % 2);
  }
  return null;
};

const decodeWithFfmpeg = (file: string): { samples: Float32Array; rate: number } => {
  const args = ["-v", "error", "-i", file, "-ac", "1", "-ar", String(TARGET_RATE), "-f", "s16le", "-"];
  const attempts: [string, string[]][] = [
    ["ffmpeg", args],
    [process.platform === "win32" ? "npx.cmd" : "npx", ["--no-install", "remotion", "ffmpeg", ...args]],
  ];
  let lastErr = "";
  for (const [cmd, a] of attempts) {
    const r = spawnSync(cmd, a, { maxBuffer: 1024 * 1024 * 1024, cwd: path.resolve(__dirname, "../..") });
    if (r.status === 0 && r.stdout.length > 0) {
      const b = r.stdout;
      const n = Math.floor(b.length / 2);
      const out = new Float32Array(n);
      for (let i = 0; i < n; i++) out[i] = b.readInt16LE(i * 2) / 32768;
      return { samples: out, rate: TARGET_RATE };
    }
    lastErr = r.error?.message ?? r.stderr?.toString() ?? `exit ${r.status}`;
  }
  throw new Error(`Could not decode audio for speech analysis (tried system ffmpeg and "remotion ffmpeg"): ${lastErr}`);
};

export interface SpeechAnalysis {
  method: string;
  speechStartSec: number;
  speechEndSec: number;
  gaps: Gap[];
}

/** Energy-based speech/silence segmentation (20 ms windows, adaptive threshold). */
export const analyzeSpeech = (file: string): SpeechAnalysis => {
  const decoded = readWav(file) ?? decodeWithFfmpeg(file);
  const { samples, rate } = decoded;
  const win = Math.max(1, Math.round(rate * 0.02));
  const n = Math.floor(samples.length / win);
  if (n < 10) throw new Error("Audio is too short to analyse.");
  const db = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let j = 0; j < win; j++) {
      const v = samples[i * win + j];
      s += v * v;
    }
    db[i] = 10 * Math.log10(s / win + 1e-10);
  }
  const sorted = Array.from(db).sort((a, b) => a - b);
  const floor = sorted[Math.floor(n * 0.1)];
  const peak = sorted[Math.floor(n * 0.95)];
  const threshold = Math.max(floor + 8, peak - 30);
  const voiced = Array.from(db, (v) => v > threshold);
  const winSec = win / rate;

  const first = voiced.indexOf(true);
  const last = voiced.lastIndexOf(true);
  if (first < 0) throw new Error("No speech detected in the audio (it may be silent).");

  const gaps: Gap[] = [];
  let i = first;
  while (i <= last) {
    if (voiced[i]) {
      i++;
      continue;
    }
    let j = i;
    while (j <= last && !voiced[j]) j++;
    const len = (j - i) * winSec;
    if (len >= 0.12) gaps.push({ startSec: +(i * winSec).toFixed(3), endSec: +(j * winSec).toFixed(3) });
    i = j;
  }
  return {
    method: `energy-silence (20ms windows, threshold ${threshold.toFixed(1)} dB)`,
    speechStartSec: +(first * winSec).toFixed(3),
    speechEndSec: +((last + 1) * winSec).toFixed(3),
    gaps,
  };
};
