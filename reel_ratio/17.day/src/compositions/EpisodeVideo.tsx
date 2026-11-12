import React from "react";
import { AbsoluteFill, Sequence, getRemotionEnvironment, useCurrentFrame, useVideoConfig } from "remotion";
import { AudioPlayer } from "../components/AudioPlayer";
import { Background } from "../components/Background";
import { EpisodeIntro } from "../components/EpisodeIntro";
import { EpisodeOutro } from "../components/EpisodeOutro";
import { FontGate } from "../components/FontGate";
import type { SafeRect } from "../components/LayoutProbe";
import { SentenceScene } from "../components/SentenceScene";
import { SubtitleSync } from "../components/SubtitleSync";
import { getEpisode } from "../episodes/registry";
import { ease, sec } from "../lib/anim";
import { theme } from "../theme";
import type { Cue, Timeline } from "../timing/types";

export type EpisodeVideoProps = {
  episodeId: string;
  /** "throw": a layout violation aborts the render. "collect": only log (used by validate-layout). */
  layoutMode: "throw" | "collect";
  /** permit rendering/validating without narration audio (draft / validation only) */
  allowDraft: boolean;
  timeline: Timeline | null;
  audioSrc: string | null;
  cues: Cue[];
};

export const defaultEpisodeProps = (episodeId: string): EpisodeVideoProps => ({
  episodeId,
  layoutMode: "throw",
  allowDraft: false,
  timeline: null,
  audioSrc: null,
  cues: [],
});

const safeRect = (captions: boolean): SafeRect => ({
  x0: theme.layout.safeX,
  y0: theme.layout.safeTop,
  x1: theme.canvas.width - theme.layout.safeX,
  y1: captions ? theme.canvas.height - 130 : theme.canvas.height - theme.layout.safeBottom,
});

/** Full-screen brand wipe bridging "চলুন, শুরু করি" -> sentence 161. Decorative (no text). */
const Wipe: React.FC<{ boundary: number }> = ({ boundary }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const inLen = sec(theme.motion.wipeSec * 0.8, fps);
  const outLen = sec(theme.motion.wipeSec, fps);
  let y: number | null = null;
  if (frame >= boundary - inLen && frame < boundary) y = ease(frame, [boundary - inLen, boundary], [height, 0], theme.easings.inOut);
  else if (frame >= boundary && frame < boundary + outLen) y = ease(frame, [boundary, boundary + outLen], [0, -height], theme.easings.inOut);
  if (y === null) return null;
  return <AbsoluteFill data-lignore="true" style={{ background: theme.colors.primary, transform: `translateY(${y}px)` }} />;
};

const DraftBanner: React.FC<{ source: string }> = ({ source }) => {
  const env = getRemotionEnvironment();
  if (env.isRendering) return null;
  return (
    <div
      data-lignore="true"
      style={{ position: "absolute", left: 70, right: 70, bottom: 40, padding: "14px 20px", borderRadius: 16, background: theme.colors.accentSoft, color: theme.colors.text, fontFamily: theme.fonts.latin, fontWeight: 600, fontSize: 26, textAlign: "center", opacity: 0.95 }}
    >
      DRAFT PREVIEW - timing source: {source}. Studio only; not part of the render.
    </div>
  );
};

export const EpisodeVideo: React.FC<EpisodeVideoProps> = ({ episodeId, layoutMode, timeline, audioSrc, cues }) => {
  const { fps } = useVideoConfig();
  if (!timeline) throw new Error("EpisodeVideo: timeline missing - calculateMetadata did not run.");
  const config = getEpisode(episodeId);
  const safe = safeRect(config.showCaptions);
  const intro = timeline.scenes.find((s) => s.kind === "intro")!;
  const outro = timeline.scenes.find((s) => s.kind === "outro")!;
  const beat = (id: string) => timeline.beats.find((b) => b.id === id)!;
  const firstSentenceStart = beat(`${config.sentences[0].id}-lead`).startFrame;

  return (
    <AbsoluteFill>
      <FontGate>
        <Background />
        <AudioPlayer publicPath={audioSrc} />
        <Sequence from={intro.startFrame} durationInFrames={intro.endFrame - intro.startFrame} layout="none">
          <EpisodeIntro config={config} timeline={timeline} safe={safe} layoutMode={layoutMode} />
        </Sequence>
        {config.sentences.map((s) => {
          const scene = timeline.scenes.find((x) => x.id === s.id)!;
          const lead = beat(`${s.id}-lead`);
          const phrase = beat(`${s.id}-phrase`);
          const meaning = beat(`${s.id}-meaning`);
          const st = timeline.sentenceTimings[s.id];
          const toLocal = (sec_: number) => Math.round(sec_ * fps) - scene.startFrame;
          return (
            <Sequence key={s.id} from={scene.startFrame} durationInFrames={scene.endFrame - scene.startFrame} name={`${s.id} (${s.titleEn})`}>
              <SentenceScene
                sentence={s}
                dayNumber={config.dayNumber}
                safe={safe}
                layoutMode={layoutMode}
                cues={{
                  durationFrames: scene.endFrame - scene.startFrame,
                  phraseStart: phrase.startFrame - lead.startFrame,
                  meaningStart: meaning.startFrame - lead.startFrame,
                  unitStarts: st.unitStartsSec.map(toLocal),
                  emphasis: st.emphasisSec.map(toLocal),
                }}
              />
            </Sequence>
          );
        })}
        <Sequence from={outro.startFrame} durationInFrames={outro.endFrame - outro.startFrame} name="outro">
          <EpisodeOutro config={config} timeline={timeline} sceneStart={outro.startFrame} safe={safe} layoutMode={layoutMode} />
        </Sequence>
        <Wipe boundary={firstSentenceStart} />
        {config.showCaptions && cues.length ? <SubtitleSync cues={cues} offsetSec={config.syncOffsetSec} top={theme.canvas.height - 260} /> : null}
        {!timeline.hasAudio || timeline.source !== "srt" ? <DraftBanner source={timeline.hasAudio ? `${timeline.source} (approximate)` : "ESTIMATED - no audio found"} /> : null}
      </FontGate>
    </AbsoluteFill>
  );
};
