import React from "react";
import { Composition, getRemotionEnvironment, staticFile } from "remotion";
import { Main, MainProps } from "./Main";
import { FPS, TOTAL_FRAMES } from "./timing";
import { theme } from "./theme";

const CANDIDATE_AUDIO_FILES = [
  theme.audio.voiceoverFile,
  "13-partcomolete.wav",
  "voiceover.wav",
  "voiceover.mp3",
];

export const resolveVoiceover = async (preferredFile?: string): Promise<string | null> => {
  const candidates = [preferredFile, ...CANDIDATE_AUDIO_FILES].filter(Boolean) as string[];
  for (const candidate of candidates) {
    try {
      const res = await fetch(staticFile(candidate), { method: "HEAD" });
      if (res.ok && !(res.headers.get("content-type") ?? "").includes("text/html")) {
        return candidate;
      }
    } catch {
      // try next candidate
    }
  }
  return null;
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Main"
      component={Main}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1080}
      height={1080}
      defaultProps={{ requireVoiceover: true } as MainProps}
      calculateMetadata={async ({ props }) => {
        const customProps = props as MainProps;
        const isRendering = getRemotionEnvironment().isRendering;
        const resolved = await resolveVoiceover(customProps.voiceoverFile);

        if (customProps.requireVoiceover && theme.audio.voiceoverRequiredInRender && isRendering && !resolved) {
          throw new Error(
            `অডিও এরর: public/${theme.audio.voiceoverFile} বা 13-partcomolete.wav / voiceover.wav পাওয়া যায়নি। ` +
              `ফাইনাল রেন্ডারে ভয়েসওভার অডিও বাধ্যতামূলক।`,
          );
        }

        return {
          props: {
            ...customProps,
            voiceoverFile: resolved ?? theme.audio.voiceoverFile,
          },
        };
      }}
    />
    <Composition
      id="Thumbnail"
      component={Main}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1080}
      defaultProps={{ requireVoiceover: false } as MainProps}
    />
  </>
);
