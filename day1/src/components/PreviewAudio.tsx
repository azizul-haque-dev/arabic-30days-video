import React, { useEffect, useState } from "react";
import { Audio, getRemotionEnvironment, staticFile } from "remotion";
import { CONFIG } from "../config";

// Plays public/voiceover.mp3 in Studio preview. Missing file => silently skipped.
// Off while rendering unless CONFIG.voiceover.includeInRender is true.
export const PreviewAudio: React.FC = () => {
  const [ok, setOk] = useState(false);
  const env = getRemotionEnvironment();
  useEffect(() => {
    if (!CONFIG.voiceover.enabled) return;
    let dead = false;
    fetch(staticFile(CONFIG.voiceover.file), { method: "HEAD" })
      .then((r) => { const ct = r.headers.get("content-type") ?? ""; if (!dead && r.ok && /audio|mpeg|octet-stream/.test(ct)) setOk(true); })
      .catch(() => {});
    return () => { dead = true; };
  }, []);
  if (!CONFIG.voiceover.enabled) return null;
  if (env.isRendering && !CONFIG.voiceover.includeInRender) return null;
  return ok ? <Audio src={staticFile(CONFIG.voiceover.file)} volume={1} /> : null;
};
