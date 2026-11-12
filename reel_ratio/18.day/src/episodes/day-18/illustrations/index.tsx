import type React from "react";
import type { IllustrationKey } from "../sentences";
import type { IllusProps } from "./kit";
import { ChefCompliment, DeliciousFood, Dessert, IceGlass, MangoJuice } from "./restaurant";
import { AskManager, FinishWork, GoingToWork, MorningShift, SponsorNoReply } from "./workplace";

export const ILLUSTRATIONS: Record<IllustrationKey, React.FC<IllusProps>> = {
  deliciousFood: DeliciousFood,
  dessert: Dessert,
  mangoJuice: MangoJuice,
  iceGlass: IceGlass,
  chefCompliment: ChefCompliment,
  goingToWork: GoingToWork,
  morningShift: MorningShift,
  finishWork: FinishWork,
  askManager: AskManager,
  sponsorNoReply: SponsorNoReply,
};
export { RestaurantOverview } from "./restaurant";
export { OfficeOverview } from "./workplace";
