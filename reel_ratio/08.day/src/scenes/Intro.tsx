import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Enter, WordReveal } from "../components/Motion";
import { LogoMark, Pill, TopLabel } from "../components/Ui";
import { Person } from "../illustrations/primitives";
import { theme } from "../theme";

const c = theme.colors;
const en = theme.fonts.en;
const bn = theme.fonts.bn;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const center: React.CSSProperties = { position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center", textAlign: "center" };

export const Counter: React.FC<{ from: number; to: number; start: number; end: number; style?: React.CSSProperties }> = ({ from, to, start, end, style }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, end], [from, to], { easing: theme.ease.out, ...clamp });
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{Math.round(v)}</span>;
};

export const ProgressBar: React.FC<{ fromPct: number; toPct: number; start: number; end: number }> = ({ fromPct, toPct, start, end }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, end], [fromPct, toPct], { easing: theme.ease.inOut, ...clamp });
  return (
    <div style={{ width: 880, height: 48, borderRadius: 24, background: c.primarySoft, overflow: "hidden", boxShadow: "inset 0 4px 10px rgba(16,35,29,0.12)" }}>
      <div style={{ width: `${v}%`, height: "100%", borderRadius: 24, background: `linear-gradient(90deg, ${c.primary}, ${c.primaryDark})` }} />
    </div>
  );
};

// I1 — hook question
export const IntroHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const solved = frame >= 58;
  const ok = spring({ frame: frame - 58, fps, config: theme.spring.bouncy });
  return (
    <>
      <TopLabel delay={3} />
      <div style={{ ...center, top: 330 }}>
        <WordReveal text="আরব দেশে থাকেন কিন্তু আরবি কথা বলতে গিয়ে আটকে যান?" delay={4} per={3} gap={20}
          style={{ fontFamily: bn, fontWeight: 700, fontSize: 78, lineHeight: 1.3, color: c.text, width: 920 }} />
      </div>
      <div style={{ position: "absolute", left: 140, top: 760, width: 800, height: 560 }}>
        <Enter delay={14} y={40}>
          <svg width={800} height={560} viewBox="0 0 800 560">
            <circle cx={400} cy={290} r={250} fill={c.primarySoft} opacity={0.7} />
            {!solved && [[170, 110, "?"], [620, 90, "؟"], [690, 280, "?"], [90, 300, "؟"]].map(([x, y, t], i) => (
              <g key={i} transform={`translate(${x},${Number(y) + Math.sin(frame / 10 + i * 1.6) * 12})`}>
                <circle r={50} fill={c.accent} stroke={c.text} strokeWidth={6} />
                <text textAnchor="middle" y={22} fontFamily={t === "?" ? en : theme.fonts.ar} fontWeight={800} fontSize={64} fill={c.text}>{t}</text>
              </g>
            ))}
            {solved && [[170, 110], [620, 90], [690, 280], [90, 300]].map(([x, y], i) => (
              <g key={i} transform={`translate(${x},${y}) scale(${Math.max(0, ok - i * 0.05)})`}>
                <circle r={46} fill={c.primary} stroke={c.text} strokeWidth={6} />
                <path d="M-18,2 l12,14 l24,-28" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            ))}
            <Person x={400} y={520} s={1.7} frame={frame} shirt={c.primary} mouth={solved ? "smile" : "o"}
              armFront={solved ? 12 : 150} armBack={solved ? -12 : -150} />
          </svg>
        </Enter>
      </div>
      <div style={{ ...center, top: 1380 }}>
        <Enter delay={58} y={50} from={0.8} config={theme.spring.bouncy}>
          <div style={{ fontFamily: bn, fontWeight: 800, fontSize: 136, color: c.primary, lineHeight: 1.2 }}>চিন্তা নেই।</div>
        </Enter>
      </div>
    </>
  );
};

// I2 — brand + series + day
export const IntroBrand: React.FC = () => (
  <>
    <TopLabel delay={3} />
    <div style={{ ...center, top: 400 }}><Enter delay={4} from={0.5} config={theme.spring.bouncy}><LogoMark size={230} /></Enter></div>
    <div style={{ ...center, top: 690 }}>
      <Enter delay={14}><div style={{ fontFamily: en, fontWeight: 800, fontSize: 92, color: c.text, letterSpacing: "0.02em" }}>ARABIC MASTER</div></Enter>
    </div>
    <div style={{ ...center, top: 830 }}>
      <Enter delay={22}><div style={{ fontFamily: bn, fontWeight: 600, fontSize: 56, color: c.textDim }}>আপনার প্রতিদিনের আরবি শেখার সঙ্গী</div></Enter>
    </div>
    <div style={{ ...center, top: 1010 }}>
      <Enter delay={64} from={0.8}><Pill bg={c.primary} color="#fff" size={44}>30 DAYS SURVIVAL ARABIC</Pill></Enter>
    </div>
    <div style={{ ...center, top: 1170 }}>
      <Enter delay={126} from={0.5} y={60} config={theme.spring.bouncy}>
        <div style={{ background: c.accent, border: `8px solid ${c.card}`, borderRadius: 56, padding: "4px 80px", boxShadow: "0 30px 50px -24px rgba(180,100,0,0.6)", transform: "rotate(-3deg)" }}>
          <div style={{ fontFamily: en, fontWeight: 800, fontSize: 180, lineHeight: 1.2, color: c.text }}>DAY 08</div>
        </div>
      </Enter>
    </div>
  </>
);

// I3 — progress so far
export const IntroProgress: React.FC = () => (
  <>
    <TopLabel delay={3} />
    <div style={{ ...center, top: 400 }}>
      <Enter delay={4}><div style={{ fontFamily: bn, fontWeight: 800, fontSize: 96, color: c.primary }}>আলহামদুলিল্লাহ</div></Enter>
    </div>
    <div style={{ ...center, top: 640, alignItems: "baseline", gap: 18 }}>
      <Enter delay={14} from={0.85}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20, fontFamily: en, fontWeight: 800 }}>
          <Counter from={0} to={70} start={26} end={90} style={{ fontSize: 300, color: c.text, lineHeight: 1.1 }} />
          <span style={{ fontSize: 120, color: c.textDim }}>/ 300</span>
        </div>
      </Enter>
    </div>
    <div style={{ ...center, top: 1010 }}><Enter delay={20}><ProgressBar fromPct={0} toPct={(70 / 300) * 100} start={26} end={90} /></Enter></div>
    <div style={{ ...center, top: 1130 }}>
      <Enter delay={34}><Pill bg={c.accent} size={40}>SENTENCES LEARNED</Pill></Enter>
    </div>
    <div style={{ ...center, top: 1290, padding: "0 70px" }}>
      <Enter delay={44}><div style={{ fontFamily: bn, fontWeight: 600, fontSize: 56, lineHeight: 1.35, color: c.text }}>৩০০টি দরকারী বাক্যর মধ্যে ৭০টি শিখেছি</div></Enter>
    </div>
  </>
);

// I4 — today's range + "one step forward"
export const IntroToday: React.FC = () => {
  const frame = useCurrentFrame();
  const stairStart = 77;
  const hop = interpolate(frame, [stairStart + 28, stairStart + 74], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const bx = interpolate(hop, [0, 1], [-250, 250]);
  const by = interpolate(hop, [0, 1], [-96, -296]) - Math.sin(hop * Math.PI * 3) * 22 * (hop > 0 && hop < 1 ? 1 : 0);
  return (
    <>
      <TopLabel delay={3} />
      <div style={{ ...center, top: 330 }}><Enter delay={4}><div style={{ fontFamily: bn, fontWeight: 700, fontSize: 70, color: c.textDim }}>আজ শিখব</div></Enter></div>
      <div style={{ ...center, top: 420 }}>
        <Enter delay={10} from={0.8} config={theme.spring.bouncy}>
          <div style={{ fontFamily: en, fontWeight: 800, fontSize: 230, lineHeight: 1.1, color: c.primary, letterSpacing: "-0.02em" }}>71 – 80</div>
        </Enter>
      </div>
      <div style={{ position: "absolute", top: 740, left: 100, width: 880, display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <Enter key={i} delay={22 + i * 4} y={30} from={0.7} config={theme.spring.snappy}>
            <div style={{ width: 152, height: 112, borderRadius: 28, background: c.card, boxShadow: "0 14px 26px -16px rgba(16,35,29,0.4)", display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: en, fontWeight: 700, fontSize: 58, color: c.text, borderBottom: `8px solid ${i % 2 ? c.primary : c.accent}` }}>{71 + i}</div>
          </Enter>
        ))}
      </div>
      <div style={{ ...center, top: 1110, padding: "0 90px" }}>
        <Enter delay={stairStart} y={40}><div style={{ fontFamily: bn, fontWeight: 600, fontSize: 52, lineHeight: 1.35, color: c.text }}>আরবি শেখার যাত্রা আরও এক ধাপ এগিয়ে</div></Enter>
      </div>
      <div style={{ position: "absolute", left: 140, top: 1320, width: 800, height: 340 }}>
        <svg width={800} height={340} viewBox="-400 -340 800 340">
          {[0, 1, 2].map((i) => {
            const p = spring({ frame: frame - stairStart - 4 - i * 6, fps: 30, config: theme.spring.snappy });
            const h = 100 * (i + 1) * p;
            return <rect key={i} x={-400 + i * 267} y={-h} width={267} height={h} rx={10} fill={i === 2 ? c.primary : c.primarySoft} stroke={c.text} strokeWidth={6} />;
          })}
          <g opacity={interpolate(frame, [stairStart + 8, stairStart + 24], [0, 1], { ...clamp })} transform={`translate(${bx},${by - 34})`}><circle r={34} fill={c.accent} stroke={c.text} strokeWidth={6} /><circle cx={10} cy={-6} r={5} fill={c.text} /></g>
        </svg>
      </div>
    </>
  );
};
