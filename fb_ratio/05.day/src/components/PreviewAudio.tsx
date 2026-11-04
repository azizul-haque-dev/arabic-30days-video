import React, { useEffect, useState } from "react";
import { Audio, cancelRender, continueRender, delayRender, getRemotionEnvironment, staticFile } from "remotion";
import { PREVIEW_VOICEOVER, RENDER_VOICEOVER } from "../config";

/** Plays public/voiceover.wav in Studio preview if the file exists. Off in render by default. */
export const PreviewAudio: React.FC = () => {
  const { isRendering } = getRemotionEnvironment();
  const enabled = isRendering ? RENDER_VOICEOVER : PREVIEW_VOICEOVER;
  const [ok, setOk] = useState(false);
  const [handle] = useState(() => (enabled ? delayRender("voiceover check") : null));

  useEffect(() => {
    if (!enabled || handle === null) return;
    let alive = true;
    fetch(staticFile("voiceover.wav"), { method: "HEAD" })
      .then((response) => {
        const type = response.headers.get("content-type") ?? "";
        if (!response.ok || !/audio|mpeg|octet-stream/i.test(type)) {
          throw new Error(`Voiceover request failed (${response.status}, ${type || "unknown content type"})`);
        }
        if (alive) {
          setOk(true);
          continueRender(handle);
        }
      })
      .catch((error: unknown) => {
        if (alive) {
          const reason = error instanceof Error ? error.message : String(error);
          cancelRender(new Error(`Could not load required voiceover public/voiceover.wav: ${reason}`));
        }
      });
    return () => { alive = false; };
  }, [enabled, handle]);

  if (!enabled || !ok) return null;
  return <Audio src={staticFile("voiceover.wav")} volume={1} />;
};
