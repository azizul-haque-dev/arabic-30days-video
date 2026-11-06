import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Enter } from "../components/Motion";
import { LogoMark, Pill, TopLabel } from "../components/Ui";
import { theme } from "../theme";
import { Counter, ProgressBar } from "./Intro";

const c = theme.colors;
const en = theme.fonts.en;
const bn = theme.fonts.bn;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const center: React.CSSProperties = { position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center", textAlign: "center" };

// O1 — Day 08 completed
export const OutroDone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(frame, [10, 34], [1, 0], { easing: theme.ease.out, ...clamp });
  const pop = spring({ frame: frame - 4, fps, config: theme.spring.bouncy });
  return (
    <>
      <TopLabel delay={3} />
      <div style={{ ...center, top: 360 }}>
        <svg width={380} height={380} viewBox="-190 -190 380 380" style={{ transform: `scale(${pop})` }}>
          <circle r={170} fill={c.primary} stroke={c.card} strokeWidth={14} />
          <path d="M-70,6 l48,52 l96,-110" fill="none" stroke="#fff" strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={draw} />
        </svg>
      </div>
      <div style={{ ...center, top: 800, flexDirection: "column", alignItems: "center" }}>
        <Enter delay={14}><div style={{ fontFamily: en, fontWeight: 800, fontSize: 130, lineHeight: 1.1, color: c.text }}>DAY 08</div></Enter>
        <Enter delay={20}><div style={{ fontFamily: en, fontWeight: 800, fontSize: 112, lineHeight: 1.15, color: c.primary }}>COMPLETED!</div></Enter>
      </div>
      <div style={{ ...center, top: 1160 }}>
        <Enter delay={36}><div style={{ fontFamily: bn, fontWeight: 600, fontSize: 54, color: c.text }}>আজকের দশটি দরকারী বাক্য শেখা শেষ।</div></Enter>
      </div>
      <div style={{ ...center, top: 1300, gap: 14 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <Enter key={i} delay={42 + i * 3} y={20} from={0.5}><div style={{ width: 30, height: 30, borderRadius: 15, background: i % 2 ? c.primary : c.accent }} /></Enter>
        ))}
      </div>
    </>
  );
};

// O2 — 80 / 300
export const OutroProgress: React.FC = () => (
  <>
    <TopLabel delay={3} />
    <div style={{ ...center, top: 400 }}><Enter delay={4}><div style={{ fontFamily: bn, fontWeight: 800, fontSize: 96, color: c.primary }}>আলহামদুলিল্লাহ</div></Enter></div>
    <div style={{ ...center, top: 640 }}>
      <Enter delay={12} from={0.85}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20, fontFamily: en, fontWeight: 800 }}>
          <Counter from={70} to={80} start={24} end={64} style={{ fontSize: 300, color: c.text, lineHeight: 1.1 }} />
          <span style={{ fontSize: 120, color: c.textDim }}>/ 300</span>
        </div>
      </Enter>
    </div>
    <div style={{ ...center, top: 1010 }}><Enter delay={18}><ProgressBar fromPct={(70 / 300) * 100} toPct={(80 / 300) * 100} start={24} end={64} /></Enter></div>
    <div style={{ ...center, top: 1130 }}><Enter delay={30}><Pill bg={c.accent} size={40}>SENTENCES LEARNED</Pill></Enter></div>
    <div style={{ ...center, top: 1290 }}><Enter delay={40}><div style={{ fontFamily: bn, fontWeight: 600, fontSize: 56, color: c.text }}>আশিটি শিখে ফেলেছি</div></Enter></div>
  </>
);

// O3 — follow CTA
export const OutroFollow: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 6) * 0.04;
  return (
    <>
      <TopLabel delay={3} />
      <div style={{ ...center, top: 400 }}><Enter delay={4} from={0.5} config={theme.spring.bouncy}><LogoMark size={220} /></Enter></div>
      <div style={{ ...center, top: 700, flexDirection: "column", alignItems: "center" }}>
        <Enter delay={14}><div style={{ fontFamily: en, fontWeight: 800, fontSize: 104, lineHeight: 1.1, color: c.text }}>FOLLOW</div></Enter>
        <Enter delay={20}><div style={{ fontFamily: en, fontWeight: 800, fontSize: 104, lineHeight: 1.2, color: c.primary }}>ARABIC MASTER</div></Enter>
      </div>
      <div style={{ ...center, top: 1060 }}>
        <Enter delay={30} from={0.7} config={theme.spring.bouncy}>
          <div style={{ transform: `scale(${pulse})` }}>
            <Pill bg={c.primary} color="#fff" size={50}>+ FOLLOW</Pill>
          </div>
        </Enter>
      </div>
      <div style={{ ...center, top: 1250, padding: "0 80px" }}>
        <Enter delay={40}><div style={{ fontFamily: bn, fontWeight: 600, fontSize: 54, lineHeight: 1.35, color: c.text }}>প্রতিদিন নতুন আরবি বাক্য শিখতে</div></Enter>
      </div>
    </>
  );
};

// O4 — comment CTA, then clean branded end card
export const OutroEnd: React.FC = () => {
  const frame = useCurrentFrame();
  const split = 78;
  const typed = "Day 8 Done";
  const n = Math.max(0, Math.min(typed.length, Math.floor((frame - 14) / 3)));
  const aOut = interpolate(frame, [split - 12, split - 2], [1, 0], { easing: theme.ease.in, ...clamp });
  const bIn = frame - split;
  return (
    <>
      <TopLabel delay={3} />
      <div style={{ position: "absolute", inset: 0, opacity: aOut, transform: `translateY(${interpolate(aOut, [0, 1], [-40, 0])}px)` }}>
        <div style={{ ...center, top: 460, flexDirection: "column", alignItems: "center" }}>
          <Enter delay={4}><div style={{ fontFamily: en, fontWeight: 800, fontSize: 100, lineHeight: 1.15, color: c.text }}>COMMENT:</div></Enter>
          <Enter delay={10}><div style={{ fontFamily: en, fontWeight: 800, fontSize: 112, lineHeight: 1.2, color: c.primary }}>DAY 8 DONE!</div></Enter>
        </div>
        <div style={{ ...center, top: 920 }}>
          <Enter delay={14} y={50}>
            <div style={{ width: 860, background: c.card, borderRadius: 48, padding: "36px 44px", boxShadow: "0 40px 70px -34px rgba(16,35,29,0.45)", display: "flex", alignItems: "center", gap: 28 }}>
              <div style={{ width: 96, height: 96, borderRadius: 48, background: c.primarySoft, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: 18, background: c.primary }} />
              </div>
              <div style={{ fontFamily: en, fontWeight: 600, fontSize: 64, color: c.text, textAlign: "left", flex: 1 }}>
                {typed.slice(0, n)}<span style={{ opacity: Math.floor(frame / 8) % 2 ? 0 : 1, color: c.accent }}>|</span>
              </div>
            </div>
          </Enter>
        </div>
      </div>
      {bIn >= 0 && (
        <>
          <div style={{ ...center, top: 520 }}><Enter delay={split} from={0.5} config={theme.spring.bouncy}><LogoMark size={240} /></Enter></div>
          <div style={{ ...center, top: 820 }}><Enter delay={split + 6}><div style={{ fontFamily: en, fontWeight: 800, fontSize: 92, color: c.text, letterSpacing: "0.02em" }}>ARABIC MASTER</div></Enter></div>
          <div style={{ ...center, top: 960 }}><Enter delay={split + 12}><Pill bg={c.accent} size={52}>DAY 9 COMING SOON</Pill></Enter></div>
          <div style={{ ...center, top: 1130 }}><Enter delay={split + 20}><div style={{ fontFamily: en, fontWeight: 600, fontSize: 36, letterSpacing: "0.1em", color: c.textDim }}>30 DAYS SURVIVAL ARABIC</div></Enter></div>
        </>
      )}
    </>
  );
};
