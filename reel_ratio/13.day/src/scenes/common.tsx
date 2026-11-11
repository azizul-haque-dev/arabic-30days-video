import React from "react";
import { episodeConfig as E } from "../config/episode";
import { sentenceSlots } from "../config/layout";
import { theme } from "../config/theme";
import { texts } from "../episode/content";
import { BrandHeader, Pill } from "../components/Brand";

const C = theme.colors;

/** Brand lock-up (left) + episode badge (right). Same slots in every scene that has a header. */
export const Header: React.FC<{ instant?: boolean }> = ({ instant }) => (
  <>
    <BrandHeader rect={sentenceSlots.brand} name={E.brandName} instant={instant} />
    <Pill
      id="badge"
      slotId="badge"
      rect={sentenceSlots.badge}
      text={texts.dayBadge}
      fontSize={46}
      background={C.accent}
      color={C.text}
      instant={instant}
      justify="flex-end"
    />
  </>
);

/** Standard body text style (Bengali, large). */
export const body = {
  font: "bn" as const,
  weight: 600,
  color: C.text,
  maxFont: 76,
  minFont: 46,
};
