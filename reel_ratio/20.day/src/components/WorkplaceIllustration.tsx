import React from "react";
import { theme } from "../theme";
import { IllustrationKey } from "../episode/day20";
import { Blessing, Equipment, IqamaExpired, IqamaRenew, JobSearch, License, Meeting, NotMyTask, Organized, Salary } from "../illustrations/SentenceIllustrations";

const MAP: Record<IllustrationKey, React.FC> = {
  notMyTask: NotMyTask,
  organized: Organized,
  meeting: Meeting,
  equipment: Equipment,
  iqamaExpired: IqamaExpired,
  iqamaRenew: IqamaRenew,
  license: License,
  jobSearch: JobSearch,
  salary: Salary,
  blessing: Blessing,
};

/** Fixed illustration slot (960×580) — illustrations never leave it, so they can never overlap the card. */
export const WorkplaceIllustration: React.FC<{ kind: IllustrationKey }> = ({ kind }) => {
  const { x, y, w, h } = theme.layout.illus;
  const Comp = MAP[kind];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", borderRadius: theme.radius.lg }}>
      <Comp />
    </div>
  );
};
