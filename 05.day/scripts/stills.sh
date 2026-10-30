#!/bin/bash
# usage: scripts/stills.sh frame [frame ...]  → out/still-<frame>.png
BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
for f in "$@"; do
  npx remotion still src/index.ts Main out/still-$f.png --frame=$f --browser-executable=$BROWSER --chrome-mode=headless-shell --log=error 2>&1 | tail -2
done
