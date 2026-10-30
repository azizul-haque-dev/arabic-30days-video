import { spawn } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const audioConfig = JSON.parse(fs.readFileSync(path.join(projectDir, "src/audio-config.json"), "utf8"));
const publicDir = path.join(projectDir, "public");
const output = path.join(projectDir, "out/video.mp4");

const requireAudioFile = (file) => {
  const fullPath = path.resolve(publicDir, file);
  const relative = path.relative(publicDir, fullPath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Audio asset path is outside public/: ${file}`);
  }
  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile() || fs.statSync(fullPath).size === 0) {
    throw new Error(`Required audio file is missing or empty: ${fullPath}`);
  }
};

const readBox = async (handle, offset, parentEnd) => {
  if (offset + 8 > parentEnd) throw new Error("Invalid MP4 box header.");
  const header = Buffer.alloc(8);
  const { bytesRead } = await handle.read(header, 0, header.length, offset);
  if (bytesRead !== header.length) throw new Error("Could not read MP4 box header.");

  let size = header.readUInt32BE(0);
  const type = header.toString("ascii", 4, 8);
  let headerSize = 8;
  if (size === 1) {
    const extendedSize = Buffer.alloc(8);
    const extendedRead = await handle.read(extendedSize, 0, 8, offset + 8);
    if (extendedRead.bytesRead !== 8) throw new Error("Could not read extended MP4 box size.");
    const largeSize = extendedSize.readBigUInt64BE(0);
    if (largeSize > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error("MP4 box is too large to inspect.");
    size = Number(largeSize);
    headerSize = 16;
  } else if (size === 0) {
    size = parentEnd - offset;
  }
  if (size < headerSize || offset + size > parentEnd) throw new Error(`Invalid MP4 ${type} box size.`);
  return { type, start: offset, end: offset + size, headerSize };
};

const children = async (handle, parent) => {
  const result = [];
  let offset = parent.start + parent.headerSize;
  while (offset < parent.end) {
    const box = await readBox(handle, offset, parent.end);
    result.push(box);
    offset = box.end;
  }
  return result;
};

const hasAudioTrack = async (filename) => {
  const handle = await fs.promises.open(filename, "r");
  try {
    const { size } = await handle.stat();
    const topLevel = [];
    for (let offset = 0; offset < size;) {
      const box = await readBox(handle, offset, size);
      topLevel.push(box);
      offset = box.end;
    }

    for (const moov of topLevel.filter((box) => box.type === "moov")) {
      for (const trak of (await children(handle, moov)).filter((box) => box.type === "trak")) {
        for (const mdia of (await children(handle, trak)).filter((box) => box.type === "mdia")) {
          for (const hdlr of (await children(handle, mdia)).filter((box) => box.type === "hdlr")) {
            const handler = Buffer.alloc(4);
            const position = hdlr.start + hdlr.headerSize + 8;
            const { bytesRead } = await handle.read(handler, 0, 4, position);
            if (bytesRead === 4 && handler.toString("ascii") === "soun") return true;
          }
        }
      }
    }
    return false;
  } finally {
    await handle.close();
  }
};

const findAvailablePort = () => new Promise((resolve, reject) => {
  const server = net.createServer();
  server.once("error", reject);
  server.listen(0, "127.0.0.1", () => {
    const address = server.address();
    if (!address || typeof address === "string") {
      server.close();
      reject(new Error("Could not determine an available render port."));
      return;
    }
    server.close((error) => error ? reject(error) : resolve(address.port));
  });
});

const runRender = async () => {
  const port = await findAvailablePort();
  const command = process.platform === "win32" ? (process.env.ComSpec ?? "cmd.exe") : "npm";
  const args = process.platform === "win32"
    ? ["/d", "/s", "/c", `npm run render:remotion -- --port ${port} --enforce-audio-track`]
    : ["run", "render:remotion", "--", "--port", String(port), "--enforce-audio-track"];
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: projectDir, stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`Remotion render failed${signal ? ` with signal ${signal}` : ` with exit code ${code}`}.`));
    });
  });
};

try {
  if (audioConfig.voiceover?.enabled !== true || audioConfig.voiceover?.includeInRender !== true) {
    throw new Error("Voiceover must be enabled and included in renders in src/audio-config.json.");
  }
  if (audioConfig.sfx?.enabled !== true || audioConfig.sfx?.includeInRender !== true) {
    throw new Error("Sound effects must be enabled and included in renders in src/audio-config.json.");
  }
  if (!Array.isArray(audioConfig.sfx.files) || audioConfig.sfx.files.length === 0) {
    throw new Error("No required sound-effect files are configured in src/audio-config.json.");
  }

  requireAudioFile(audioConfig.voiceover.file);
  audioConfig.sfx.files.forEach((file) => requireAudioFile(path.join("sfx", file)));
  fs.mkdirSync(path.dirname(output), { recursive: true });

  console.log(`Audio preflight passed: voiceover and ${audioConfig.sfx.files.length} sound-effect files are enabled and present.`);
  await runRender();
  if (!fs.existsSync(output) || fs.statSync(output).size === 0) {
    throw new Error(`Render completed without producing a non-empty MP4: ${output}`);
  }
  if (!(await hasAudioTrack(output))) {
    throw new Error(`Audio verification failed: ${output} contains no audio stream.`);
  }
  console.log(`Render verified: ${output} contains an audio stream.`);
} catch (error) {
  console.error(`Render failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
