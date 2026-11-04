import React, {useEffect, useState} from 'react';
import {Audio, cancelRender, continueRender, delayRender, getRemotionEnvironment, staticFile} from 'remotion';

// ───── ফ্ল্যাগ ─────
export const PREVIEW_AUDIO_ENABLED = true; // Studio প্রিভিউতে ভয়েসওভার বাজবে
export const PREVIEW_AUDIO_IN_RENDER = true; // রেন্ডারে ভয়েসওভার আবশ্যক (MP4-তে নিশ্চিত অডিও স্ট্রিম)

/** public/voiceover.mp3 লোড করে; কোনো ত্রুটি হলে রেন্ডার বাতিল করে এবং এরর রিপোর্ট করে। */
export const PreviewAudio: React.FC = () => {
  const {isRendering} = getRemotionEnvironment();
  const active = PREVIEW_AUDIO_ENABLED && (!isRendering || PREVIEW_AUDIO_IN_RENDER);
  const [exists, setExists] = useState(false);
  const [handle] = useState(() => (active ? delayRender('voiceover check') : null));

  useEffect(() => {
    if (isRendering && (!PREVIEW_AUDIO_ENABLED || !PREVIEW_AUDIO_IN_RENDER)) {
      const err = new Error(
        'Audio is mandatory in final video render! Voiceover is disabled in render configuration.'
      );
      cancelRender(err);
      return;
    }

    if (!active || handle === null) return;

    fetch(staticFile('voiceover.mp3'), {method: 'HEAD'})
      .then((r) => {
        const ct = r.headers.get('content-type') ?? '';
        const isAudio = r.ok && (/audio|mpeg|octet-stream/i.test(ct) || r.status === 200);
        if (!r.ok || !isAudio) {
          const err = new Error(
            `Required voiceover file "public/voiceover.mp3" is missing or returned invalid status (${r.status}, ${ct}). Audio is mandatory in render.`
          );
          cancelRender(err);
          throw err;
        }
        setExists(true);
      })
      .catch((err) => {
        cancelRender(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => continueRender(handle));
  }, [active, handle, isRendering]);

  if (!active || !exists) return null;

  return (
    <Audio
      src={staticFile('voiceover.mp3')}
      volume={1}
      onError={(err) => {
        cancelRender(new Error('Voiceover audio failed to decode/play during render'));
      }}
    />
  );
};
