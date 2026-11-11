import React from "react";
import { sentenceSlots as L } from "../config/layout";
import { theme } from "../config/theme";
import { Pill } from "../components/Brand";
import { WordRow } from "../components/WordRow";
import { Illustration } from "../illustrations/Illustration";
import { VIEW_H, VIEW_W, sentenceIllustrations } from "../illustrations/compose";
import type { SceneData } from "../timeline/build";
import { Header } from "./common";

const C = theme.colors;

type Props = Extract<SceneData, { kind: "sentence" }>;

/**
 * One learning sentence.
 * Top: brand + badge · number. Centre: illustration. Then Arabic (small),
 * pronunciation (LARGE, animated word by word), meaning.
 * Arabic and pronunciation are the animated focus; both pulse on every repeat.
 */
export const SentenceScene: React.FC<Props> = ({ content, arabic, arabicAt, pron, meaningAt }) => {
  const Art = sentenceIllustrations[content.illustration];
  const allPulses = pron.flatMap((p) => p.pulses);

  return (
    <>
      <Header />
      <Pill id="number" slotId="number" rect={L.number} text={`Sentence ${content.number}`} fontSize={48}
        background={C.primary} color={C.white} delay={2} />
      <Illustration id="art" slotId="illustration" rect={L.illustration} viewW={VIEW_W} viewH={VIEW_H} delay={8}
        render={(t) => <Art t={t} qty={content.qty} />} />
      <WordRow id="arabic" slotId="arabic" rect={L.arabic} text={arabic} font="ar" weight={600} color={C.textDim}
        maxFont={64} minFont={40} lineHeight={1.5} delay={arabicAt} stagger={6} rtl pulses={allPulses} padY={14} travel={10} />
      {pron.map((p, i) => (
        <React.Fragment key={i}>
          <WordRow id={`pron-label-${i}`} slotId="pronLabel" rect={L.pronLabel} text={p.label} font="bn" weight={600}
            color={C.textDim} maxFont={34} minFont={24} padY={8} travel={6} delay={p.startFrame} exitAt={p.exitAt} />
          <WordRow id={`pron-${i}`} slotId="pron" rect={L.pron} text={p.text} font="bn" weight={700} color={C.primaryDark}
            maxFont={110} minFont={64} delay={p.startFrame + 4} stagger={5} exitAt={p.exitAt} pulses={p.pulses}
            preset="snappy" />
        </React.Fragment>
      ))}
      <WordRow id="meaning" slotId="meaning" rect={L.meaning} text={content.meaning} font="bn" weight={600} color={C.text}
        maxFont={56} minFont={40} delay={meaningAt} />
    </>
  );
};
