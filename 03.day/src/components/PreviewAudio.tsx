import React, { useEffect, useState } from "react";
import { Audio, getRemotionEnvironment, staticFile } from "remotion";

// One flag to switch the voiceover on/off in Studio preview.
export const PLAY_VOICEOVER_IN_PREVIEW = true;
// Final renders are SFX-only by default.
export const INCLUDE_VOICEOVER_IN_RENDER = false;

export const PreviewAudio: React.FC = () => {
  const { isRendering } = getRemotionEnvironment();
  const enabled = isRendering ? INCLUDE_VOICEOVER_IN_RENDER : PLAY_VOICEOVER_IN_PREVIEW;
  const [exists, setExists] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    fetch(staticFile("voiceover.mp3"), { method: "HEAD" })
      .then((r) => {
        const type = r.headers.get("content-type") ?? "";
        if (alive) setExists(r.ok && (type.startsWith("audio") || type.includes("mpeg")));
      })
      .catch(() => alive && setExists(false));
    return () => {
      alive = false;
    };
  }, [enabled]);

  if (!enabled || !exists) return null; // no voiceover.mp3 → silently skipped
  return <Audio src={staticFile("voiceover.mp3")} volume={1} />;
};
