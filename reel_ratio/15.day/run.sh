#!/bin/bash
cd /home/claude/d15
B=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
mkdir -p out/chunks
TOTAL=5273; STEP=660
i=0
for ((s=0; s<TOTAL; s+=STEP)); do
  e=$((s+STEP-1)); [ $e -ge $((TOTAL-1)) ] && e=$((TOTAL-1))
  out=out/chunks/c$(printf %02d $i).mp4
  if [ ! -s "$out" ]; then
    npx remotion render src/index.ts Day15 "$out.tmp.mp4" --codec h264 --crf 17 --muted --frames=$s-$e --browser-executable=$B --concurrency=1 --overwrite >> out/render.log 2>&1 && mv "$out.tmp.mp4" "$out"
  fi
  i=$((i+1))
done
npx remotion render src/index.ts Day15 out/audio.mp3 --codec mp3 --browser-executable=$B --overwrite >> out/render.log 2>&1
echo ALLDONE >> out/render.log
