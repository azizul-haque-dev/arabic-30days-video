import React from "react";
import { entrance } from "../lib/anim";
import { BrandLogo } from "./BrandLogo";
import { Chip } from "./Chip";
import { MARGIN, CONTENT_W } from "../lib/layout";
import { episodeConfig } from "../episodes/day-18/config";

/** Brand header used by intro scenes (y 170–254). */
export const TopBar: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => (
  <div style={{ position: "absolute", left: MARGIN, top: 170, width: CONTENT_W, height: 84, display: "flex", justifyContent: "space-between", alignItems: "center", ...entrance(frame, fps, 0, { y: -16 }) }}>
    <BrandLogo size={76} />
    <Chip label={`Day ${episodeConfig.day}`} size={34} bg={"#F59E0B"} color={"#10231D"} />
  </div>
);
