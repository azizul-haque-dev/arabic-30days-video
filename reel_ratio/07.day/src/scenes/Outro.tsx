import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile} from "remotion";
import {C, E, FONT} from "../theme";
import {ip, useSpr, useT, breathe} from "../anim";
import {OUTRO, captionAt} from "../timing";
import {Caption} from "./Intro";

export const Outro: React.FC = () => {
  const {t, fps} = useT();
  const g = t + 0; // local seconds (scene starts at outro boundary)
  const cap = captionAt(g + OUTRO_START, {from: "এই ছিল"});
  const check = useSpr(0.1, "pop");
  const draw = ip(t, [0.25, 0.9], [1, 0], E.out);
  const title = useSpr(0.35, "pop");

  const tProg = OUTRO.progress - OUTRO_START;
  const tFollow = OUTRO.follow - OUTRO_START;
  const tDay8 = OUTRO.day8 - OUTRO_START;
  const value = ip(t, [tProg, tProg + 1.6], [60, 70], E.inOut);
  const follow = useSpr(tFollow, "pop");
  const ripple = ((t - tFollow) % 1.4) / 1.4;
  const comment = useSpr(tFollow + 0.5, "soft");
  const day8 = useSpr(tDay8, "pop");
  const swap = ip(t, [tDay8 - 0.05, tDay8 + 0.3], [0, 1], E.in);

  return (
    <AbsoluteFill>
      {/* completion badge */}
      <div style={{position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center"}}>
        <svg width={230} height={230} viewBox="0 0 230 230" style={{transform: `scale(${0.6 + 0.4 * check}) translateY(${breathe(t, 5, 1.6)}px)`, opacity: Math.min(1, check * 1.6)}}>
          <circle cx={115} cy={115} r={104} fill={C.primary} />
          <circle cx={115} cy={115} r={104} fill="none" stroke={C.white} strokeWidth={8} opacity={0.5} />
          <path d="M62 120 l36 36 l72 -80" fill="none" stroke={C.white} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={draw} />
        </svg>
      </div>
      <div style={{position: "absolute", top: 480, left: 0, right: 0, textAlign: "center", fontFamily: FONT.latin, fontWeight: 800, fontSize: 70, letterSpacing: 3, color: C.dark, opacity: Math.min(1, title * 1.5), transform: `translateY(${(1 - title) * 30}px) scale(${0.92 + 0.08 * title})`}}>
        DAY 7 COMPLETED
      </div>

      {/* ten sentence chips */}
      <div style={{position: "absolute", top: 612, left: 90, right: 90, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14}}>
        {Array.from({length: 10}).map((_, i) => (
          <Chip key={i} n={61 + i} at={0.6 + i * 0.12} />
        ))}
      </div>

      {/* progress */}
      <div style={{position: "absolute", top: 782, left: 90, right: 90, padding: "18px 36px 22px", borderRadius: 40, background: C.white, boxShadow: `0 20px 44px ${C.dark}26`}}>
        <div style={{display: "flex", alignItems: "baseline", justifyContent: "center", gap: 14, fontFamily: FONT.latin, fontWeight: 800}}>
          <span style={{fontSize: 74, color: C.primary}}>{Math.round(value)}</span>
          <span style={{fontSize: 40, color: C.muted}}>/ 300</span>
          <span style={{fontSize: 28, color: C.dark, letterSpacing: 2, marginLeft: 6}}>SENTENCES LEARNED</span>
        </div>
        <div style={{height: 26, borderRadius: 13, background: C.soft, overflow: "hidden", marginTop: 6}}>
          <div style={{width: `${(value / 300) * 100}%`, height: "100%", borderRadius: 13, background: `linear-gradient(90deg, ${C.primary}, #4ADE80)`}} />
        </div>
      </div>

      {/* follow button (activates when narrated) */}
      <div style={{position: "absolute", top: 990, left: 0, right: 0, display: "flex", justifyContent: "center"}}>
        <div style={{position: "relative", opacity: 0.55 + 0.45 * follow, transform: `scale(${0.94 + 0.08 * follow})`}}>
          {t >= tFollow && <div style={{position: "absolute", inset: 0, borderRadius: 50, border: `5px solid ${C.primary}`, opacity: 1 - ripple, transform: `scale(${1 + ripple * 0.35})`}} />}
          <div style={{fontFamily: FONT.latin, fontWeight: 800, fontSize: 40, letterSpacing: 2, color: C.white, background: follow > 0.5 ? C.primary : C.muted, padding: "18px 56px", borderRadius: 50, boxShadow: `0 16px 34px ${C.primary}55`}}>
            + FOLLOW ARABIC MASTER
          </div>
        </div>
      </div>

      {/* comment prompt ↔ Day 8 teaser share one slot */}
      <div style={{position: "absolute", top: 1112, left: 90, right: 90, height: 150}}>
        <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 - Math.min(1, ip(t, [tFollow + 0.3, tFollow + 0.7], [0, 1], E.in)), transform: `translateY(${breathe(t, 4, 1.4)}px)`}}>
          <div style={{textAlign: "center"}}>
            <div style={{fontFamily: FONT.latin, fontWeight: 800, fontSize: 52, letterSpacing: 4, color: C.dark}}>ARABIC MASTER</div>
            <div style={{display: "inline-block", marginTop: 8, fontFamily: FONT.latin, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: C.white, background: C.primary, padding: "6px 30px", borderRadius: 30}}>30 DAYS SURVIVAL ARABIC</div>
          </div>
        </div>
        <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: (1 - swap) * Math.min(1, comment * 1.5), transform: `translateY(${(1 - comment) * 40 - swap * 30}px) scale(${0.94 + 0.06 * comment})`}}>
          <div style={{background: C.white, borderRadius: 40, padding: "18px 40px", boxShadow: `0 16px 34px ${C.dark}26`, display: "flex", alignItems: "center", gap: 22}}>
            <div style={{width: 64, height: 64, borderRadius: 32, background: C.soft, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.latin, fontWeight: 800, color: C.primary, fontSize: 28}}>AM</div>
            <div>
              <div style={{fontFamily: FONT.bn, fontWeight: 700, fontSize: 28, color: C.muted}}>Comment করুন</div>
              <div style={{fontFamily: FONT.latin, fontWeight: 800, fontSize: 54, color: C.dark}}>DAY 7 DONE!</div>
            </div>
          </div>
        </div>
        <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: Math.min(1, day8 * 1.5) * swap, transform: `translateY(${(1 - day8) * 40}px) scale(${0.94 + 0.06 * day8})`}}>
          <div style={{background: C.dark, borderRadius: 40, padding: "20px 56px", textAlign: "center", boxShadow: `0 16px 34px ${C.dark}55`}}>
            <div style={{fontFamily: FONT.latin, fontWeight: 800, fontSize: 60, color: C.white, letterSpacing: 3}}>DAY 8</div>
            <div style={{fontFamily: FONT.latin, fontWeight: 700, fontSize: 32, color: C.amber, letterSpacing: 4}}>COMING SOON</div>
          </div>
        </div>
      </div>

      {cap && <Caption key={cap.idx} text={cap.text} seed={cap.idx} top={1320} />}

      <Sequence from={Math.round(0.2 * fps)} durationInFrames={Math.round(1 * fps)}>
        <Audio src={staticFile("sfx/ding.wav")} volume={0.22} />
      </Sequence>
      <Sequence from={Math.max(0, Math.round(tFollow * fps))} durationInFrames={Math.round(1 * fps)}>
        <Audio src={staticFile("sfx/ding.wav")} volume={0.18} />
      </Sequence>
    </AbsoluteFill>
  );
};

import {BOUNDARIES} from "../timing";
const OUTRO_START = BOUNDARIES[10];

const Chip: React.FC<{n: number; at: number}> = ({n, at}) => {
  const p = useSpr(at, "pop");
  return (
    <div style={{width: 138, height: 62, borderRadius: 31, background: C.white, border: `3px solid ${C.primary}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 24}px) scale(${0.8 + 0.2 * p})`}}>
      <svg width={26} height={26} viewBox="0 0 26 26"><circle cx={13} cy={13} r={13} fill={C.primary} /><path d="M7 13.5 l4 4 l8 -9" stroke={C.white} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span style={{fontFamily: FONT.latin, fontWeight: 800, fontSize: 30, color: C.dark}}>{n}</span>
    </div>
  );
};
