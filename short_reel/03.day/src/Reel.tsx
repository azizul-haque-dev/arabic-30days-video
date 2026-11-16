import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import "./fonts";
import { BgMesh, Grade, Grain, Vignette } from "./components/Layers";
import { Header } from "./components/Header";
import { PhraseRow } from "./components/PhraseRow";
import { FollowButton } from "./components/FollowButton";
import { Thumbnail } from "./Thumbnail";
import { CTA_FRAME, PHRASES, SFX_ENABLED, VOICE_FILE, msToFrame } from "./data";

export const Reel: React.FC = () => (
  <AbsoluteFill>
    {/* 1 background */}
    <BgMesh />
    {/* 3 graphics / type */}
    <Header />
    {PHRASES.map((p, i) => <PhraseRow key={p.n} phrase={p} index={i} />)}
    <FollowButton />
    {/* 4 grade, 5 grain + vignette */}
    <Grade />
    <Grain />
    <Vignette />

    {/* Video start thumbnail cover (First 2 frames for social media cover/thumbnail pickup) */}
    <Sequence from={0} durationInFrames={2}>
      <Thumbnail />
    </Sequence>

    {VOICE_FILE && <Audio src={staticFile(VOICE_FILE)} />}
    {SFX_ENABLED && PHRASES.map((p) => (
      <Sequence key={p.n} from={Math.max(0, msToFrame(p.startMs) - 3)} durationInFrames={12}>
        <Audio src={staticFile("sfx/pop.wav")} volume={0.3} />
      </Sequence>
    ))}
    {SFX_ENABLED && (
      <Sequence from={CTA_FRAME - 2} durationInFrames={20}>
        <Audio src={staticFile("sfx/whoosh.wav")} volume={0.35} />
      </Sequence>
    )}
  </AbsoluteFill>
);
