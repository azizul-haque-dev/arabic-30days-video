import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { BrandChip, Entrance, Pill, clampI } from "../components/fx";
import { ArtCanvas } from "../components/art";
import { f, sentences, toBn } from "../data";

const C = theme.colors;
const O = 156.64;
const r = (s: number) => f(s) - f(O); // local frame for absolute second

const Pop: React.FC<{ at: number; end?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, end, children, style }) => {
  const fr = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: fr - at, fps, config: theme.spring.bouncy });
  const out = end === undefined ? 0 : clampI(fr, [end, end + 9], [0, 1], theme.ease.in);
  return <div style={{ opacity: p * (1 - out), transform: `translateY(${(1 - p) * 50 - out * 24}px) scale(${0.7 + 0.3 * p})`, ...style }}>{children}</div>;
};

export const Outro: React.FC = () => {
  const fr = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapOut = clampI(fr, [r(158.6), r(158.6) + 9], [0, 1], theme.ease.in);
  const quizIn = r(158.7);
  const qPulse = 1 + Math.sin(fr / 7) * 0.06;
  const typedText = Array.from(new Intl.Segmenter("bn", { granularity: "grapheme" }).segment("আপনার উত্তর লিখুন"), (x) => x.segment);
  const typed = Math.max(0, Math.min(1, (fr - r(165.4)) / 40));
  const finalP = spring({ frame: fr - r(173.0), fps, config: theme.spring.smooth });
  const quizOut = clampI(fr, [r(172.7), r(172.7) + 9], [0, 1], theme.ease.in);
  const ctaIn = r(166.9);
  const ctaOut = quizOut;

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 60, top: 40 }}><BrandChip /></div>

      {/* recap: 10 sentences */}
      <AbsoluteFill style={{ opacity: 1 - recapOut, transform: `translateY(${-recapOut * 30}px)` }}>
        <div style={{ position: "absolute", top: 170, width: "100%", textAlign: "center" }}>
          <Entrance delay={r(156.7) + 4}><div style={{ fontFamily: theme.fonts.bn, fontWeight: 800, fontSize: 76, color: C.text }}>আজকের <span style={{ color: C.primary }}>১০টি</span> বাক্য</div></Entrance>
        </div>
        <div style={{ position: "absolute", top: 300, left: 60, right: 60, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
          {sentences.map((s, i) => (
            <Pop key={s.n} at={r(156.7) + 8 + i * 4} style={{}}>
              <div style={{ height: 258, borderRadius: 32, background: C.white, boxShadow: `0 20px 40px -18px ${C.shadow}`, padding: 18, boxSizing: "border-box", textAlign: "center",
                display: "flex", flexDirection: "column", justifyContent: "space-between", border: `4px solid ${C.primarySoft}` }}>
                <div style={{ fontFamily: theme.fonts.bn, fontWeight: 800, fontSize: 34, color: C.accent }}>{toBn(s.n)}</div>
                <div dir="rtl" style={{ fontFamily: theme.fonts.ar, fontWeight: 700, fontSize: s.ar.length > 14 ? 42 : 52, lineHeight: 1.45, color: C.text }}>{s.ar}</div>
                <div style={{ fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 28, lineHeight: 1.3, color: C.primaryDeep }}>{s.meaning}</div>
              </div>
            </Pop>
          ))}
        </div>
      </AbsoluteFill>

      {/* quiz */}
      <Sequence from={quizIn} layout="none">
        <AbsoluteFill style={{ opacity: 1 - quizOut, transform: `translateY(${-quizOut * 26}px)` }}>
          <div style={{ position: "absolute", right: 60, top: 48 }}>
            <Entrance delay={4}><Pill bg={C.accent} color={C.ink2} size={34}>ছোট্ট টেস্ট!</Pill></Entrance>
          </div>
          <Entrance delay={6} dx={-70} style={{ position: "absolute", left: 60, top: 140 }}>
            <div style={{ width: 960, height: 873, borderRadius: 44, overflow: "hidden", border: `6px solid ${C.white}`, boxShadow: `0 40px 80px -30px ${C.shadow}`, position: "relative" }}>
              <ArtCanvas art="ticket" width={948} />
              <div style={{ position: "absolute", right: 30, top: 28, width: 130, height: 130, borderRadius: "50%", background: C.accent, display: "grid", placeItems: "center",
                fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 90, color: C.ink2, transform: `scale(${qPulse})`, boxShadow: `0 0 50px ${C.accent}88` }}>?</div>
            </div>
          </Entrance>
          <div style={{ position: "absolute", left: 60, top: 1060, width: 960 }}>
            <Entrance delay={10}><Pill bg={C.primary} size={42}>আজকের প্রশ্ন</Pill></Entrance>
            <Pop at={r(161.3) - quizIn} style={{ marginTop: 30 }}>
              <div style={{ fontFamily: theme.fonts.bn, fontWeight: 800, fontSize: 76, lineHeight: 1.3, color: C.text }}>
                “আমি একটা <span style={{ color: C.primary }}>টিকিট</span> চাই”
              </div>
              <div style={{ fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 52, color: C.textDim, marginTop: 6 }}>— এর আরবি কী?</div>
            </Pop>
            <Pop at={r(164.4) - quizIn} style={{ marginTop: 34 }}>
              <div style={{ background: C.white, borderRadius: 30, border: `4px solid ${C.primary}`, padding: "26px 34px", boxShadow: `0 22px 44px -22px ${C.shadow}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ width: 70, height: 70, borderRadius: "50%", background: C.primary, display: "grid", placeItems: "center", fontFamily: theme.fonts.display, fontWeight: 800, color: "#fff", fontSize: 34 }}>A</div>
                  <div style={{ fontFamily: theme.fonts.bn, fontWeight: 500, fontSize: 40, color: C.textDim, flex: 1 }}>
                    {typedText.slice(0, Math.floor(typed * typedText.length)).join("")}<span style={{ opacity: Math.floor(fr / 10) % 2 ? 0 : 1, color: C.primary }}>|</span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 26 }}><Pill bg={C.accent} color={C.ink2} size={52}>এখনই Comment করুন</Pill></div>
            </Pop>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* CTA: like + follow */}
      <Sequence from={ctaIn} layout="none">
        <AbsoluteFill style={{ opacity: 1 - ctaOut, background: "transparent" }}>
          <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.bg}F2, ${C.bgAlt}F2)`, opacity: clampI(fr - ctaIn, [0, 10], [0, 1]) }} />
          <div style={{ position: "absolute", left: 60, top: 40 }}><BrandChip /></div>
          <div style={{ position: "absolute", top: 200, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
            <Pop at={4}>
              <div style={{ width: 960, height: 700, borderRadius: 44, background: C.white, boxShadow: `0 30px 60px -24px ${C.shadow}`, display: "grid", placeItems: "center", textAlign: "center" }}>
                <div>
                  <svg width={230} height={230} viewBox="0 0 100 100" style={{ transform: `scale(${1 + Math.max(0, Math.sin(fr / 8)) * 0.1}) rotate(${Math.sin(fr / 8) * -4}deg)` }}>
                    <rect x={6} y={44} width={22} height={46} rx={5} fill={C.primary} />
                    <path d="M34 48 L52 12 Q64 10 62 28 L58 42 L84 42 Q96 44 92 58 L86 82 Q84 90 74 90 L34 90Z" fill={C.accent} />
                  </svg>
                  <div style={{ fontFamily: theme.fonts.bn, fontWeight: 800, fontSize: 76, color: C.text, marginTop: 10 }}>একটি Like দিন</div>
                </div>
              </div>
            </Pop>
            <Pop at={r(169.2) - ctaIn}>
              <div style={{ width: 960, height: 700, borderRadius: 44, background: C.primary, boxShadow: `0 30px 60px -24px ${C.shadow}`, display: "grid", placeItems: "center", textAlign: "center", color: "#fff" }}>
                <div>
                  <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 190, lineHeight: 1 }}>Day 16</div>
                  <div style={{ fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: 52, marginTop: 22 }}>পেতে Follow করে রাখুন</div>
                  <div style={{ marginTop: 22 }}><Pill bg={C.accent} color={C.ink2} size={42}>Arabic Master Page</Pill></div>
                </div>
              </div>
            </Pop>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* final farewell */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: finalP, background: `${C.bg}F7` }}>
        <div style={{ textAlign: "center", transform: `scale(${0.85 + 0.15 * finalP}) translateY(${(1 - finalP) * 40}px)` }}>
          <div style={{ fontFamily: theme.fonts.ar, fontWeight: 700, fontSize: 150, color: C.primary, lineHeight: 1.4, textShadow: `0 0 70px ${C.glow}` }}>في أمان الله</div>
          <div style={{ fontFamily: theme.fonts.bn, fontWeight: 800, fontSize: 100, color: C.text }}>ফি আমানিল্লাহ</div>
          <div style={{ marginTop: 30 }}><Pill bg={C.accent} color={C.ink2} size={48}>দেখা হচ্ছে আগামীকাল • Day 16</Pill></div>
          <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}><BrandChip /></div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
