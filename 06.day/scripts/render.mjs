import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

// 1. Locate ffmpeg executable
function getFfmpegPath() {
  try {
    const test = spawnSync('ffmpeg', ['-version'], {stdio: 'ignore'});
    if (test.status === 0) return 'ffmpeg';
  } catch {}

  const localCandidates = [
    path.resolve('node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'),
    path.resolve('../node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'),
  ];
  for (const c of localCandidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

// 2. Pre-flight verification
console.log('=== [1/3] PRE-RENDER AUDIO VERIFICATION ===');

// a) Verify voiceover is enabled in render configuration
const previewAudioCode = fs.readFileSync(path.resolve('src/components/PreviewAudio.tsx'), 'utf-8');
const renderVoMatch = previewAudioCode.match(/export\s+const\s+PREVIEW_AUDIO_IN_RENDER\s*=\s*(true|false)/);
if (!renderVoMatch || renderVoMatch[1] !== 'true') {
  console.error('❌ VERIFICATION FAILED: PREVIEW_AUDIO_IN_RENDER is not enabled (true) in src/components/PreviewAudio.tsx');
  process.exit(1);
}
console.log('✔ Voiceover is ENABLED for render (PREVIEW_AUDIO_IN_RENDER = true)');

// b) Verify required voiceover file exists and has content
const voPath = path.resolve('public/voiceover.mp3');
if (!fs.existsSync(voPath)) {
  console.error(`❌ VERIFICATION FAILED: Required voiceover file missing: ${voPath}`);
  process.exit(1);
}
const voStats = fs.statSync(voPath);
if (voStats.size === 0) {
  console.error(`❌ VERIFICATION FAILED: Voiceover file is empty (0 bytes): ${voPath}`);
  process.exit(1);
}
console.log(`✔ Voiceover file exists (${(voStats.size / 1024 / 1024).toFixed(2)} MB): public/voiceover.mp3`);

// c) Verify required sound effects exist and are non-empty
const requiredSfx = ['pop.wav', 'whoosh.wav', 'click.wav', 'chime.wav', 'thud.wav'];
for (const sfx of requiredSfx) {
  const p = path.resolve('public/sfx', sfx);
  if (!fs.existsSync(p)) {
    console.error(`❌ VERIFICATION FAILED: Required sound effect missing: ${p}`);
    process.exit(1);
  }
  const s = fs.statSync(p);
  if (s.size === 0) {
    console.error(`❌ VERIFICATION FAILED: Sound effect file is empty (0 bytes): ${p}`);
    process.exit(1);
  }
  console.log(`✔ Sound effect exists (${(s.size / 1024).toFixed(1)} KB): public/sfx/${sfx}`);
}

// 3. Render video
console.log('\n=== [2/3] EXECUTING REMOTION RENDER ===');
const isWin = process.platform === 'win32';
const remotionBin = path.resolve('node_modules/.bin', isWin ? 'remotion.cmd' : 'remotion');
const renderArgs = [
  'render',
  'src/index.ts',
  'Main',
  'out/video.mp4',
  '--codec=h264',
  '--crf=17',
  '--overwrite',
];

const renderResult = isWin
  ? spawnSync(process.env.ComSpec || 'cmd.exe', ['/c', remotionBin, ...renderArgs], {stdio: 'inherit'})
  : spawnSync(remotionBin, renderArgs, {stdio: 'inherit'});

if (renderResult.status !== 0) {
  console.error(`❌ ERROR: Remotion render process failed with exit code ${renderResult.status}`);
  process.exit(renderResult.status ?? 1);
}

// 4. Post-render verification
console.log('\n=== [3/3] POST-RENDER AUDIO VERIFICATION ===');
const outFile = path.resolve('out/video.mp4');
if (!fs.existsSync(outFile)) {
  console.error(`❌ VERIFICATION FAILED: Render output file does not exist: ${outFile}`);
  process.exit(1);
}

const outStats = fs.statSync(outFile);
if (outStats.size === 0) {
  console.error(`❌ VERIFICATION FAILED: Render output file is empty (0 bytes): ${outFile}`);
  process.exit(1);
}

const ffmpeg = getFfmpegPath();
if (!ffmpeg) {
  console.error('❌ VERIFICATION FAILED: Could not find ffmpeg to inspect audio stream in output MP4');
  process.exit(1);
}

const probe = spawnSync(ffmpeg, ['-i', outFile], {encoding: 'utf8'});
const probeOutput = (probe.stderr || '') + (probe.stdout || '');

const audioMatch = probeOutput.match(/Stream\s+#\d+:\d+(?:\[0x[0-9a-f]+\])?(?:\([^)]*\))?:\s+Audio:\s+(.+)/i);
if (!audioMatch) {
  console.error('❌ VERIFICATION FAILED: Output video MP4 does NOT contain an audio stream!');
  console.error('ffmpeg probe output:\n' + probeOutput);
  process.exit(1);
}

console.log('✔ Audio stream verified successfully in output MP4:');
console.log('   ' + audioMatch[0].trim());
console.log(`\n🎉 Render complete! Output verified with audio: ${outFile} (${(outStats.size / 1024 / 1024).toFixed(2)} MB)`);
