#!/bin/bash
# Resumable render: muted video chunks (audio is muxed afterwards by scripts/mux.sh)
cd "$(dirname "$0")/.."
BR_ARG=""; [ -n "$BROWSER" ] && BR_ARG="--browser-executable=$BROWSER"
for s in $(seq 0 400 3520); do
  e=$((s+399)); [ $e -gt 3520 ] && e=3520
  f=out/chunks/c_$(printf %04d $s).mp4
  [ -s "$f" ] && continue
  npx remotion render src/index.ts Day7 "$f" --frames=$s-$e --muted --codec h264 --crf 18 --concurrency=1 $BR_ARG --overwrite || exit 1
done
echo ALLDONE
