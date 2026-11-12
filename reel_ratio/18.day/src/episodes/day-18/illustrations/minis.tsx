import React from "react";
import { theme } from "../../../theme";
import { breathe, entrance } from "../../../lib/anim";
import { Bubble, Dots, Glass, Heart, Monitor, Person, Plate, Stage, Table, Sparkle } from "./kit";

const I = theme.illus;
const C = theme.colors;

type MiniProps = { frame: number; fps: number; w: number; h: number; speech?: number };

/** Compact restaurant vignette (customer + waiter + food) for any w×h. */
export const RestaurantMini: React.FC<MiniProps> = ({ frame, fps, w, h, speech = 0 }) => {
  const floorY = h - 40;
  const s = Math.max(0.5, Math.min(1.45, (h - 120) / 285));
  const tableTop = floorY - 110 * s;
  const bob = breathe(frame, fps, 1.4, 2.6);
  return (
    <Stage w={w} h={h} floorY={floorY}>
      <g transform={`translate(${w / 2} ${tableTop}) scale(${s})`}><Table x={0} y={0} w={Math.min(300, w * 0.34 / s)} /></g>
      <g><Plate x={w / 2} y={tableTop - 2} scale={0.8 * s} steam={2} /></g>
      <Glass id={`miniGlass${w}${h}`} x={w / 2 + 46 * s} y={tableTop - 70 * s} w={44 * s} h={66 * s} fill={0.8} liquid={I.mango} />
      <Person x={w * 0.17} y={floorY + 12} scale={s} skin={I.skin[1]} shirt={I.shirtA} pose={{ armR: 60 + speech * 20, armL: 10, bob, mouth: speech * 0.7 }} />
      <Person x={w * 0.83} y={floorY + 12} scale={s} flip skin={I.skin[3]} shirt={C.white} hair={I.hair[2]} pose={{ armR: 50, armL: 10, bob: -bob }}
        front={<rect x="-36" y="-160" width="72" height="56" rx="10" fill={I.shirtC} />} />
      <Bubble x={w * 0.17} y={floorY - 285 * s - 40} w={110 * s + 20} h={64} tail="down" scale={0.9}><Dots x={0} y={0} active={Math.floor(frame / 9) % 3} /></Bubble>
    </Stage>
  );
};

/** Compact office vignette (employee + colleague + desk). */
export const OfficeMini: React.FC<MiniProps> = ({ frame, fps, w, h, speech = 0 }) => {
  const floorY = h - 40;
  const s = Math.max(0.5, Math.min(1.45, (h - 120) / 285));
  const deskTop = floorY - 110 * s;
  const bob = breathe(frame, fps, 1.4, 2.6);
  return (
    <Stage w={w} h={h} floorY={floorY}>
      <g transform={`translate(${w / 2} ${deskTop}) scale(${s})`}>
        <rect x="-110" y="0" width="220" height="18" rx="9" fill={I.wood} />
        <rect x="-96" y="18" width="12" height="100" rx="5" fill={I.woodDark} />
        <rect x="84" y="18" width="12" height="100" rx="5" fill={I.woodDark} />
        <Monitor x={0} y={-16} on={1} />
      </g>
      <Person x={w * 0.17} y={floorY + 12} scale={s} skin={I.skin[2]} shirt={I.shirtA} pose={{ armR: 60 + speech * 20, armL: 10, bob, mouth: speech * 0.7 }} />
      <Person x={w * 0.83} y={floorY + 12} scale={s} flip skin={I.skin[0]} shirt={I.shirtE} hair={I.hair[3]} hairStyle="long" pose={{ armR: 50, armL: 10, bob: -bob }} />
      <Bubble x={w * 0.83} y={floorY - 285 * s - 40} w={110 * s + 20} h={64} tail="down" scale={0.9}><Dots x={0} y={0} active={Math.floor(frame / 9 + 1) % 3} /></Bubble>
      <Sparkle x={w * 0.5} y={floorY - 285 * s} s={0.8} o={0.7} />
    </Stage>
  );
};

/** Two characters facing each other with confident speech bubbles (intro scene 3). */
export const ConfidentPair: React.FC<{ frame: number; fps: number; w: number; h: number }> = ({ frame, fps, w, h }) => {
  const floorY = h - 40;
  const s = Math.min(1, (h - 130) / 285);
  const a = entrance(frame, fps, 10, { y: 14, scale: 0.8 });
  const b = entrance(frame, fps, 26, { y: 14, scale: 0.8 });
  return (
    <Stage w={w} h={h} floorY={floorY}>
      <Person x={w * 0.25} y={floorY + 12} scale={s} skin={I.skin[1]} shirt={I.shirtA} pose={{ armR: 90 + 10 * Math.sin(frame / 8), armL: 10, mouth: 0.6, bob: breathe(frame, fps, 1.4, 2.4) }} />
      <Person x={w * 0.75} y={floorY + 12} scale={s} flip skin={I.skin[2]} shirt={I.shirtB} hair={I.hair[1]} hairStyle="long" pose={{ armR: 80 - 10 * Math.sin(frame / 8), armL: 10, mouth: 0.4, bob: breathe(frame, fps, 1.4, 2.4, 1) }} />
      <g opacity={a.opacity} style={{ transform: a.transform, transformBox: "fill-box", transformOrigin: "center" }}>
        <Bubble x={w * 0.27} y={floorY - 285 * s - 50} w={150} h={84} tail="down"><Heart x={0} y={4} s={1.6} /></Bubble>
      </g>
      <g opacity={b.opacity} style={{ transform: b.transform, transformBox: "fill-box", transformOrigin: "center" }}>
        <Bubble x={w * 0.73} y={floorY - 285 * s - 50} w={150} h={84} tail="down"><Sparkle x={0} y={0} s={1.7} /></Bubble>
      </g>
    </Stage>
  );
};
