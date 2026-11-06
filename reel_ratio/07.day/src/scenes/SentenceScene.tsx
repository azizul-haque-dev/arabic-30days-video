import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile} from "remotion";
import {C, E, FONT, STAGE} from "../theme";
import {ip, useSpr, useT, breathe} from "../anim";
import {CONTENT} from "../content";
import {BOUNDARIES, SENTENCES} from "../timing";
import {PronBlock, MeaningBlock, ArabicPill} from "../components/SentenceText";
import {S61, S62, S63, S64, S65} from "./ill/part1";
import {S66, S67, S68, S69, S70} from "./ill/part2";

const ILL = [S61, S62, S63, S64, S65, S66, S67, S68, S69, S70];

export const SentenceScene: React.FC<{i: number; len: number}> = ({i, len}) => {
  const {t, fps} = useT();
  const start = BOUNDARIES[i];
  const T = SENTENCES[i];
  const c = CONTENT[i];
  const g = t + start; // global narration time
  const L = {t, p1: T.p1 - start, p2: T.p2 - start, m: T.meaning - start, end: T.end - start};
  const Ill = ILL[i];

  const stage = useSpr(0.12, "soft");
  const exitT = len / fps - t;
  const exit = ip(exitT, [0, 0.22], [0, 1], E.in); // 1 → fully present
  const chip = useSpr(0.05, "pop");
  const rep1 = g >= T.p1 && g < T.p2;
  const rep2 = g >= T.p2 && g < T.meaning;

  const dot = (on: boolean, k: number) => (
    <div key={k} style={{width: 30, height: 30, borderRadius: 15, background: on ? C.primary : C.soft, border: `3px solid ${C.primary}`,
      transform: `scale(${on ? 1.2 : 1})`, boxShadow: on ? `0 0 0 8px ${C.primary}33` : "none"}} />
  );

  return (
    <AbsoluteFill style={{opacity: 0.1 + 0.9 * exit, transform: `scale(${0.97 + 0.03 * exit})`}}>
      {/* header */}
      <div style={{position: "absolute", top: 120, left: 60, right: 60, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: Math.min(1, chip * 1.5)}}>
        <div style={{display: "flex", alignItems: "center", gap: 14}}>
          <div style={{width: 54, height: 54, borderRadius: 27, background: C.primary, color: C.white, fontFamily: FONT.latin, fontWeight: 800, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center"}}>AM</div>
          <div style={{fontFamily: FONT.latin, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: C.dark}}>ARABIC MASTER</div>
        </div>
        <div style={{fontFamily: FONT.latin, fontWeight: 800, fontSize: 28, padding: "8px 26px", borderRadius: 30, background: C.amber, color: C.white}}>DAY 7</div>
      </div>

      {/* illustration stage */}
      <div
        style={{
          position: "absolute", left: STAGE.x, top: STAGE.y, width: STAGE.w, height: STAGE.h, borderRadius: 48, overflow: "hidden",
          background: C.white, border: `8px solid ${C.white}`, boxShadow: `0 34px 70px ${C.dark}40`,
          opacity: Math.min(1, stage * 1.6), transform: `translateY(${(1 - stage) * 70}px) scale(${0.93 + 0.07 * stage})`,
        }}
      >
        <svg width={STAGE.w - 16} height={STAGE.h - 16} viewBox="0 0 920 580" preserveAspectRatio="xMidYMid slice"
          style={{display: "block", transform: `translateX(${breathe(t, 5, 0.7)}px) scale(1.02)`}}>
          <Ill {...L} />
        </svg>
        <div style={{position: "absolute", left: 22, top: 20, padding: "6px 22px", borderRadius: 24, background: C.dark, color: C.white, fontFamily: FONT.latin, fontWeight: 700, fontSize: 26, letterSpacing: 2}}>
          {c.n} / 70
        </div>
      </div>

      {/* text block */}
      <div style={{position: "absolute", left: 50, right: 50, top: 862, display: "flex", flexDirection: "column", alignItems: "center", gap: 18}}>
        <div style={{display: "flex", alignItems: "center", gap: 16, height: 40}}>
          {dot(rep1, 1)}
          {dot(rep2, 2)}
          <div style={{fontFamily: FONT.bn, fontWeight: 700, fontSize: 28, color: C.muted, marginLeft: 6}}>
            {g < T.p1 ? "শুনুন" : g < T.meaning ? "শুনুন ও বলুন" : "মনে রাখুন"}
          </div>
        </div>
        <PronBlock text={c.pron} g={g} p1={T.p1} p2={T.p2} m={T.meaning} />
        <div style={{height: 6}} />
        <MeaningBlock text={c.meaning} g={g} m={T.meaning} end={T.end} />
        <ArabicPill text={c.ar} at={0.4} />
      </div>

      {/* progress dots */}
      <div style={{position: "absolute", left: 0, right: 0, top: 1456, display: "flex", justifyContent: "center", gap: 12}}>
        {CONTENT.map((_, k) => (
          <div key={k} style={{height: 16, width: k === i ? 54 : 16, borderRadius: 8, background: k < i ? C.primary : k === i ? C.amber : C.soft, border: `2px solid ${C.primary}55`}} />
        ))}
      </div>

      {i === 9 && (
        <Sequence from={Math.round((T.p1 - start + 0.9) * fps)} durationInFrames={Math.round(0.6 * fps)}>
          <Audio src={staticFile("sfx/thunk.wav")} volume={0.3} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
