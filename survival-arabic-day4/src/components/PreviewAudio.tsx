import React, { useEffect, useState } from "react";
import {
  Audio,
  continueRender,
  delayRender,
  getRemotionEnvironment,
  staticFile,
} from "remotion";
import { PREVIEW_VOICEOVER, RENDER_VOICEOVER } from "../config";

export const PreviewAudio: React.FC = () => {
  const env = getRemotionEnvironment();
  const enabled = env.isRendering ? RENDER_VOICEOVER : PREVIEW_VOICEOVER;
  const [src, setSrc] = useState<string | null>(null);
  const [handle] = useState(() =>
    enabled ? delayRender("check-voiceover") : null
  );

  useEffect(() => {
    if (!enabled || handle === null) return;
    const mp3 = staticFile("voiceover.mp3");
    const wav = staticFile("voiceover.wav");
    fetch(mp3, { method: "HEAD" })
      .then((r) => {
        if (r.ok) {
          setSrc(mp3);
          continueRender(handle);
        } else {
          return fetch(wav, { method: "HEAD" }).then((r2) => {
            if (r2.ok) setSrc(wav);
            continueRender(handle);
          });
        }
      })
      .catch(() => {
        continueRender(handle);
      });
  }, [enabled, handle]);

  if (!enabled || !src) return null;
  return <Audio src={src} volume={1} />;
};
