// Concatenates video chunks and muxes voiceover + SFX at the exact timeline positions.
import {execSync} from "node:child_process";
import fs from "node:fs";
const {BOUNDARIES, SENTENCES, OUTRO} = await import("../src/timing.ts");
const ev = [];
BOUNDARIES.forEach((b) => ev.push(["whoosh", b - 0.28, 0.16]));
ev.push(["thunk", SENTENCES[9].p1 + 0.9, 0.3]);
const o0 = BOUNDARIES[10];
ev.push(["ding", o0 + 0.2, 0.22], ["ding", OUTRO.follow, 0.18]);
const files = fs.readdirSync("out/chunks").filter((f) => f.endsWith(".mp4")).sort();
fs.writeFileSync("out/list.txt", files.map((f) => `file 'chunks/${f}'`).join("\n"));
const inputs = ev.map(([n]) => `-i public/sfx/${n}.wav`).join(" ");
const filt = ev.map(([, t, v], i) => `[${i + 2}:a]adelay=${Math.round(t * 1000)}|${Math.round(t * 1000)},volume=${v}[s${i}]`).join(";");
const mix = `[1:a]${ev.map((_, i) => `[s${i}]`).join("")}amix=inputs=${ev.length + 1}:normalize=0:duration=first[a]`;
execSync(`ffmpeg -v error -y -f concat -safe 0 -i out/list.txt -i public/voiceover.mp3 ${inputs} -filter_complex "${filt};${mix}" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest out/Arabic-Master-Day7.mp4`, {stdio: "inherit"});
