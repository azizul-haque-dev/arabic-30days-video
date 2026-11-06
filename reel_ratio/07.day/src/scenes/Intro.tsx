import React from "react";
import {AbsoluteFill} from "remotion";
import {C, E, FONT} from "../theme";
import {ip, useSpr, useT, breathe} from "../anim";
import {INTRO, captionAt} from "../timing";
import {KeyIcon, DoorIcon, WindowIcon, ACIcon, BoltIcon, DropIcon} from "../components/Icons";

export const Caption: React.FC<{text: string; seed: number; top: number; settled?: boolean}> = ({text, seed, top, settled}) => {
  const {t} = useT();
  void t;
  const sp = useSpr(0, "soft");
  const p = settled ? 1 : sp; // first caption is already on screen at frame 0
  void seed;
  return (
    <div style={{position: "absolute", left: 50, right: 50, top, display: "flex", alignItems: "flex-start", justifyContent: "center"}}>
      <div
        style={{
          fontFamily: FONT.bn, fontWeight: 700, fontSize: 40, lineHeight: 1.45, color: C.text, textAlign: "center",
          padding: "12px 30px", borderRadius: 36, background: `${C.white}E6`, boxShadow: `0 14px 34px ${C.dark}22`,
          opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * 26}px) scale(${0.96 + 0.04 * p})`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const TILES = [
  {Icon: KeyIcon, ar: "مفتاح"}, {Icon: DoorIcon, ar: "باب"}, {Icon: WindowIcon, ar: "شباك"},
  {Icon: ACIcon, ar: "مكيّف"}, {Icon: BoltIcon, ar: "كهرباء"}, {Icon: DropIcon, ar: "مية"},
];

export const Intro: React.FC = () => {
  const {t} = useT();
  const cap = captionAt(t, {until: "Sentence"});

  // progress: thumbnail shows 70 → rewinds to 60 ("already learned") → climbs to 70 (today)
  const down = ip(t, [INTRO.learned, INTRO.learned + 0.9], [70, 60], E.inOut);
  const up = ip(t, [INTRO.today, INTRO.today + 2.4], [60, 70], E.inOut);
  const value = t < INTRO.today ? down : up;
  const shown = Math.round(value);
  const pulseDay = t > INTRO.brand ? ip(t, [INTRO.brand, INTRO.brand + 0.5], [1.14, 1], E.back) : 1;
  const ring = ((t - INTRO.brand) % 2.4) / 2.4;
  const chips = useSpr(INTRO.today, "pop");
  const label = t < INTRO.learned ? "SENTENCES LEARNED" : t < INTRO.today ? "ALREADY LEARNED" : "SENTENCES LEARNED";

  return (
    <AbsoluteFill>
      {/* brand */}
      <div style={{position: "absolute", top: 232, left: 0, right: 0, textAlign: "center"}}>
        <div style={{display: "inline-flex", alignItems: "center", gap: 22, transform: `translateY(${breathe(t, 4, 1.3)}px)`}}>
          <div style={{width: 96, height: 96, borderRadius: 48, background: C.primary, color: C.white, fontFamily: FONT.latin, fontWeight: 800, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 14px 30px ${C.primary}66`}}>AM</div>
          <div style={{fontFamily: FONT.latin, fontWeight: 800, fontSize: 86, letterSpacing: 4, color: C.dark}}>ARABIC MASTER</div>
        </div>
        <div style={{marginTop: 10, display: "inline-block", fontFamily: FONT.latin, fontWeight: 700, fontSize: 36, letterSpacing: 5, color: C.white, background: C.primary, padding: "8px 40px", borderRadius: 40}}>
          30 DAYS SURVIVAL ARABIC
        </div>
      </div>

      {/* DAY 7 */}
      <div style={{position: "absolute", top: 470, left: 0, right: 0, display: "flex", justifyContent: "center"}}>
        <div style={{position: "relative", transform: `scale(${pulseDay}) rotate(${breathe(t, 1, 1.2)}deg)`}}>
          {t > INTRO.brand && (
            <div style={{position: "absolute", inset: -10, borderRadius: 60, border: `6px solid ${C.amber}`, opacity: 1 - ring, transform: `scale(${1 + ring * 0.45})`}} />
          )}
          <div style={{fontFamily: FONT.latin, fontWeight: 800, fontSize: 112, lineHeight: 1.05, color: C.white, background: C.amber, padding: "8px 80px 14px", borderRadius: 56, boxShadow: `0 22px 44px ${C.amber}77`, letterSpacing: 6}}>
            DAY 7
          </div>
        </div>
      </div>

      {/* icon cluster with Arabic speech bubbles */}
      <svg style={{position: "absolute", left: 0, top: 618}} width={1080} height={430} viewBox="0 0 1080 430">
        {TILES.map(({Icon, ar}, i) => {
          const col = i % 3, row = Math.floor(i / 3);
          const cx = 190 + col * 350, cy = 78 + row * 200;
          const bob = breathe(t, 7, 1.5, i * 1.1);
          return (
            <g key={i} transform={`translate(0 ${bob})`}>
              <rect x={cx - 66} y={cy + 12} width={132} height={122} rx={34} fill={C.white} />
              <Icon x={cx} y={cy + 73} size={84} />
              <g transform={`translate(${cx} ${cy - 40})`}>
                <rect x={-62} y={-26} width={124} height={50} rx={22} fill={C.dark} />
                <path d="M-10 22 l10 16 l10 -16Z" fill={C.dark} />
                <text x={0} y={11} textAnchor="middle" direction="rtl" fontFamily="'Noto Naskh Arabic'" fontWeight={700} fontSize={32} fill={C.white}>{ar}</text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* supporting text */}
      <div style={{position: "absolute", top: 1046, left: 40, right: 40, textAlign: "center", fontFamily: FONT.latin, fontWeight: 700, fontSize: 42, color: C.text}}>
        10 Essential Everyday Arabic Sentences
      </div>

      {/* progress */}
      <div style={{position: "absolute", top: 1114, left: 90, right: 90, padding: "18px 36px 22px", borderRadius: 40, background: C.white, boxShadow: `0 20px 44px ${C.dark}26`}}>
        <div style={{display: "flex", alignItems: "baseline", justifyContent: "center", gap: 14, fontFamily: FONT.latin, fontWeight: 800}}>
          <span style={{fontSize: 74, color: C.primary}}>{shown}</span>
          <span style={{fontSize: 40, color: C.muted}}>/ 300</span>
          <span style={{fontSize: 28, color: C.dark, letterSpacing: 2, marginLeft: 6}}>{label}</span>
        </div>
        <div style={{position: "relative", height: 26, borderRadius: 13, background: C.soft, overflow: "hidden", marginTop: 6}}>
          <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: `${(value / 300) * 100}%`, borderRadius: 13, background: `linear-gradient(90deg, ${C.primary}, #4ADE80)`}} />
          <div style={{position: "absolute", left: `${(60 / 300) * 100}%`, width: 4, top: 0, bottom: 0, background: C.dark, opacity: 0.5}} />
        </div>
        {t >= INTRO.today && (
          <div style={{position: "absolute", right: 26, top: -22, padding: "4px 22px", borderRadius: 24, background: C.amber, color: C.white, fontFamily: FONT.latin, fontWeight: 800, fontSize: 32, opacity: Math.min(1, chips * 1.5), transform: `scale(${0.7 + 0.3 * chips})`}}>
            +10 TODAY
          </div>
        )}
      </div>

      {cap && <Caption key={cap.idx} text={cap.text} seed={cap.idx} top={1320} settled={cap.idx === 0} />}
    </AbsoluteFill>
  );
};
