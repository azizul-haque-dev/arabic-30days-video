import React from "react";
import { interpolateColors } from "remotion";
import { episodeConfig as E } from "../config/episode";
import { ctaSlots, summarySlots } from "../config/layout";
import { FONT_WEIGHTS, theme } from "../config/theme";
import { texts, sentences } from "../episode/content";
import { percentOf } from "../utils/bn";
import { useReveal, useSpringProgress } from "../animation/motion";
import { LogoMark } from "../components/Brand";
import { Lv, Slot } from "../components/layoutPrimitives";
import { ProgressBlock } from "../components/Progress";
import { WordRow } from "../components/WordRow";
import { Illustration } from "../illustrations/Illustration";
import { DriveStrip } from "../illustrations/compose";
import { Header, body } from "./common";

const C = theme.colors;
const CHIP_W = 164;
const CHIP_H = 136;

const Chip: React.FC<{ index: number; label: string }> = ({ index, label }) => {
  const reveal = useReveal(8 + index * 4, { y: 16 });
  const done = useSpringProgress(30 + index * 6, "snappy");
  const bg = interpolateColors(done, [0, 1], [C.white, C.primary]);
  const fg = interpolateColors(done, [0, 1], [C.text, C.white]);
  return (
    <Lv id={`chip-${label}`} kind="badge" slotId="grid" style={{ ...reveal, width: CHIP_W, height: CHIP_H }}>
      <div style={{
        width: CHIP_W, height: CHIP_H, borderRadius: 28, background: bg, border: `4px solid ${C.primary}`,
        boxShadow: `0 10px 22px ${C.shadow}`, display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 6, boxSizing: "border-box",
      }}>
        <span style={{ fontFamily: theme.fonts.en, fontWeight: FONT_WEIGHTS.en, fontSize: 52, lineHeight: 1.1, color: fg }}>
          {label}
        </span>
        <svg width={40} height={40} viewBox="0 0 40 40">
          <circle cx={20} cy={20} r={18} fill={done > 0.5 ? C.white : C.line} />
          <path d="M11 21 L18 28 L30 13" stroke={done > 0.5 ? C.primary : C.white} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Lv>
  );
};

/** Final summary: 10 completed sentences, 130 / 300, 43.33%. */
export const SummaryScene: React.FC<{ lineAt: number }> = ({ lineAt }) => (
  <>
    <Header />
    <WordRow id="summary-title" slotId="title" rect={summarySlots.title} text={texts.summaryTitle} {...body} delay={6} />
    <Slot id="grid" rect={summarySlots.grid}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(5, ${CHIP_W}px)`, columnGap: 30, rowGap: 24 }}>
        {sentences.map((s, i) => <Chip key={s.number} index={i} label={String(s.number)} />)}
      </div>
    </Slot>
    <WordRow id="summary-line" slotId="line" rect={summarySlots.line} text={texts.summaryLine} {...body} delay={lineAt} />
    <ProgressBlock
      slotId="progress" rect={summarySlots.progress}
      from={E.previousCompletedSentences} to={E.completedSentences} total={E.totalSentences}
      fromPercent={percentOf(E.previousCompletedSentences, E.totalSentences)} toPercent={E.progressPercentage}
      delay={lineAt + 10} animateFrames={44}
    />
    <Illustration id="strip" slotId="strip" rect={summarySlots.strip} viewW={940} viewH={110} delay={lineAt + 16}
      render={(t) => <DriveStrip t={t} />} />
  </>
);

const FollowCard: React.FC = () => {
  const style = useReveal(14);
  const press = useSpringProgress(46, "snappy");
  const btn = interpolateColors(press, [0, 1], [C.primary, C.primaryDark]);
  return (
    <Slot id="follow" rect={ctaSlots.follow}>
      <Lv id="follow-card" kind="badge" slotId="follow" style={{ ...style, width: 880, height: 270 }}>
        <div style={{
          width: 880, height: 270, boxSizing: "border-box", borderRadius: 40, background: C.white,
          boxShadow: `0 18px 40px ${C.shadow}`, padding: 28, display: "flex", flexDirection: "column", gap: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, height: 120 }}>
            <LogoMark name={E.brandName} size={120} />
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span style={{ fontFamily: theme.fonts.en, fontWeight: FONT_WEIGHTS.en, fontSize: 48, lineHeight: 1.15, color: C.text, whiteSpace: "nowrap" }}>
                {E.brandName}
              </span>
              <span style={{ fontFamily: theme.fonts.en, fontWeight: 600, fontSize: 30, lineHeight: 1.3, color: C.textDim, whiteSpace: "nowrap" }}>
                {E.seriesName}
              </span>
            </div>
          </div>
          <div style={{
            height: 82, borderRadius: 41, background: btn, color: C.white, display: "flex", alignItems: "center",
            justifyContent: "center", fontFamily: theme.fonts.en, fontWeight: FONT_WEIGHTS.en, fontSize: 44,
          }}>
            {texts.follow}
          </div>
        </div>
      </Lv>
    </Slot>
  );
};

const CommentBubble: React.FC<{ at: number }> = ({ at }) => {
  const style = useReveal(at + 6, { y: 16 });
  return (
    <Slot id="comment" rect={ctaSlots.comment}>
      <Lv id="comment-bubble" kind="badge" slotId="comment" style={{ ...style, width: 860, height: 250 }}>
        <svg width={860} height={250} viewBox="0 0 860 250" style={{ display: "block" }}>
          <path d="M60 4 H800 Q856 4 856 60 V150 Q856 206 800 206 H150 L96 246 L106 206 H60 Q4 206 4 150 V60 Q4 4 60 4 Z"
            fill={C.white} stroke={C.primary} strokeWidth={8} />
          <text x={430} y={132} textAnchor="middle" fontFamily={theme.fonts.en} fontWeight={800} fontSize={88} fill={C.primaryDark}>
            {E.ctaText}
          </text>
        </svg>
      </Lv>
    </Slot>
  );
};

/** Follow CTA + "DAY 13 DONE!". */
export const CtaScene: React.FC<{ commentAt: number }> = ({ commentAt }) => (
  <>
    <Header />
    <WordRow id="cta-a" slotId="lineA" rect={ctaSlots.lineA} text={texts.ctaA} {...body} delay={6} />
    <FollowCard />
    <WordRow id="cta-b" slotId="lineB" rect={ctaSlots.lineB} text={texts.ctaB} {...body} maxFont={64} delay={commentAt} />
    <CommentBubble at={commentAt} />
  </>
);
