import React from "react";
import type { IllustrationKey } from "../episodes/types";
import {
  BillScene,
  BreadScene,
  ColdFoodScene,
  LateOrderScene,
  LeftoversScene,
  MissingSpoonScene,
  OrderScene,
  RestaurantScene,
  ReservedScene,
  SceneProps,
  TableTwoScene,
  TakeawayScene,
  ThumbnailScene,
} from "./scenes";

export const ART_W = 940;
export const ART_H = 680;

export const ILLUSTRATIONS: Record<IllustrationKey, React.FC<SceneProps>> = {
  thumbnail: ThumbnailScene,
  restaurant: RestaurantScene,
  bill: BillScene,
  order: OrderScene,
  "late-order": LateOrderScene,
  "cold-food": ColdFoodScene,
  bread: BreadScene,
  "missing-spoon": MissingSpoonScene,
  leftovers: LeftoversScene,
  takeaway: TakeawayScene,
  reserved: ReservedScene,
  "table-two": TableTwoScene,
};
