import React from "react";
import { episodeConfig as E } from "../config/episode";
import { brandSlots, episodeIntroSlots, hookSlots, topicIntroSlots, outroSlots } from "../config/layout";
import { FONT_WEIGHTS, theme } from "../config/theme";
import { texts } from "../episode/content";
import { percentOf } from "../utils/bn";
import { useReveal, useSpringProgress } from "../animation/motion";
import { Pill, LogoMark } from "../components/Brand";
import { Lv, Slot } from "../components/layoutPrimitives";
import { ProgressBlock } from "../components/Progress";
import { WordRow } from "../components/WordRow";
import { Illustration } from "../illustrations/Illustration";
import { IconRow, MarketCluster, TaxiCluster } from "../illustrations/compose";
import { Header, body } from "./common";

const C = theme.colors;

/** Scene 1: the thumbnail. Frame 0 is already a finished design (instant = no entrance). */
export const HookScene: React.FC = () => (
  <>
    <Header instant />
    <WordRow
      id="series" slotId="series" rect={hookSlots.series} text={texts.series}
      font="bn" weight={700} color={C.primaryDark} maxFont={50} minFont={30} padY={14} travel={8} instant
    />
    <Illustration id="market" slotId="market" rect={hookSlots.market} viewW={450} viewH={640} instant
      render={(t) => <MarketCluster t={t} />} />
    <Illustration id="taxi" slotId="taxi" rect={hookSlots.taxi} viewW={450} viewH={640} instant
      render={(t) => <TaxiCluster t={t} />} />
    <WordRow
      id="hook" slotId="hook" rect={hookSlots.hook} text={texts.hook}
      font="bn" weight={700} color={C.text} maxFont={72} minFont={48} instant
    />
  </>
);

const LogoLockup: React.FC<{ slotId: string; rect: typeof brandSlots.logo; markSize: number; nameSize: number; delay?: number }> = ({
  slotId, rect, markSize, nameSize, delay = 0,
}) => {
  const style = useReveal(delay);
  return (
    <Slot id={slotId} rect={rect}>
      <Lv id={`${slotId}-lockup`} kind="badge" slotId={slotId} style={style}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <LogoMark name={E.brandName} size={markSize} />
          <span style={{
            fontFamily: theme.fonts.en, fontWeight: FONT_WEIGHTS.en, fontSize: nameSize,
            lineHeight: 1.15, color: C.text, letterSpacing: "-0.02em", whiteSpace: "nowrap",
          }}>
            {E.brandName}
          </span>
        </div>
      </Lv>
    </Slot>
  );
};

/** Scene 2: brand introduction. */
export const BrandScene: React.FC = () => (
  <>
    <LogoLockup slotId="logo" rect={brandSlots.logo} markSize={230} nameSize={84} />
    <WordRow id="brand-text" slotId="text" rect={brandSlots.text} text={texts.brand} {...body} delay={10} />
    <Illustration id="icons" slotId="icons" rect={brandSlots.icons} viewW={940} viewH={380} delay={16}
      render={(t) => <IconRow t={t} />} />
  </>
);

/** Scene 3: episode introduction + 120 / 300 progress. */
export const EpisodeIntroScene: React.FC<{ lineBAt: number }> = ({ lineBAt }) => (
  <>
    <Header />
    <WordRow id="episode-a" slotId="lineA" rect={episodeIntroSlots.lineA} text={texts.episodeA} {...body} delay={6} />
    <WordRow id="episode-b" slotId="lineB" rect={episodeIntroSlots.lineB} text={texts.episodeB} {...body} delay={lineBAt} />
    <ProgressBlock
      slotId="progress" rect={episodeIntroSlots.progress}
      from={E.previousCompletedSentences} to={E.previousCompletedSentences} total={E.totalSentences}
      fromPercent={0} toPercent={percentOf(E.previousCompletedSentences, E.totalSentences)}
      delay={lineBAt + 6} animateFrames={36}
    />
    <Illustration id="icons" slotId="icons" rect={episodeIntroSlots.icons} viewW={940} viewH={380} delay={lineBAt + 12}
      render={(t) => <IconRow t={t} />} />
  </>
);

const Dot: React.FC<{ index: number; at: number }> = ({ index, at }) => {
  const reveal = useReveal(4 + index * 2);
  const lit = useSpringProgress(at + index * 4, "snappy");
  return (
    <Lv id={`dot-${index}`} kind="shape" slotId="dots" style={{ ...reveal, width: 56, height: 56 }}>
      <div style={{
        width: 56, height: 56, borderRadius: 999,
        background: lit > 0.5 ? C.primary : C.line,
        boxShadow: `0 6px 14px ${C.shadow}`,
      }} />
    </Lv>
  );
};

/** Scene 4: today's topic, 10 learning indicators. */
export const TopicIntroScene: React.FC<{ lineBAt: number }> = ({ lineBAt }) => {
  const count = E.sentenceEnd - E.sentenceStart + 1;
  return (
    <>
      <Header />
      <WordRow id="topic-a" slotId="lineA" rect={topicIntroSlots.lineA} text={texts.topicA} {...body} delay={6} />
      <WordRow id="topic-b" slotId="lineB" rect={topicIntroSlots.lineB} text={texts.topicB} {...body}
        color={C.primaryDark} weight={700} delay={lineBAt} />
      <Illustration id="market" slotId="market" rect={topicIntroSlots.market} viewW={450} viewH={640} delay={10}
        render={(t) => <MarketCluster t={t} />} />
      <Illustration id="taxi" slotId="taxi" rect={topicIntroSlots.taxi} viewW={450} viewH={640} delay={14}
        render={(t) => <TaxiCluster t={t} />} />
      <Slot id="dots" rect={topicIntroSlots.dots}>
        <div style={{ display: "flex", gap: 34 }}>
          {Array.from({ length: count }, (_, i) => <Dot key={i} index={i} at={lineBAt} />)}
        </div>
      </Slot>
    </>
  );
};

/** Scene 17: final goodbye. */
export const OutroScene: React.FC = () => (
  <>
    <LogoLockup slotId="logo" rect={outroSlots.logo} markSize={220} nameSize={80} />
    <WordRow id="outro-text" slotId="text" rect={outroSlots.text} text={texts.outro} {...body} delay={8} />
    <Pill id="next-badge" slotId="badge" rect={outroSlots.badge} text={texts.nextBadge} fontSize={88}
      background={C.accent} color={C.text} delay={16} paddingX={60} />
  </>
);
