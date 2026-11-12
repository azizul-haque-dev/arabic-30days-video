import React from "react";
import { theme } from "../../../theme";
import { breathe, entrance, lerp, prog, springIn } from "../../../lib/anim";
import {
  Bubble, Building, Chair, Clock, Dots, IllusProps, Monitor, Person, Phone, QuestionMark, Stage, Sun,
} from "./kit";

const I = theme.illus;
const C = theme.colors;
const E = theme.ease;

const Bag: React.FC = () => (
  <g transform="translate(-44 -176)">
    <rect x="-18" y="0" width="36" height="64" rx="14" fill={I.shirtB} />
    <rect x="-10" y="14" width="20" height="14" rx="5" fill={I.mangoDark} />
  </g>
);

/** 176 — employee walks to work with a bag */
export const GoingToWork: React.FC<IllusProps> = ({ frame, fps, cues }) => {
  const walk = Math.sin(frame / 4.5);
  const x = lerp(110, 520, prog(frame, 6, cues.meaning + 20, E.soft));
  const b = springIn(frame, fps, 10, theme.spring.smooth);
  return (
    <Stage floorY={450}>
      <g transform={`translate(${(1 - b) * 120} 0)`} opacity={prog(frame, 10, 14)}>
        <Building x={640} y={450} w={230} h={320} />
      </g>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={(((i * 330 - frame * 3) % 990) + 990) % 990 - 40} y="470" width="90" height="10" rx="5" fill={C.line} />
      ))}
      <Person x={x} y={450} skin={I.skin[1]} shirt={I.shirtA} front={<Bag />}
        pose={{ legSwing: walk * 18, armL: 24 - walk * 22, armR: 24 + walk * 22, bob: Math.abs(walk) * -4 }} />
    </Stage>
  );
};

/** 177 — sunrise, clock, duty starts in the morning */
export const MorningShift: React.FC<IllusProps> = ({ frame, fps, cues }) => {
  const rise = prog(frame, 4, 60, E.inOut);
  const minute = lerp(0, 360 * 1.0, prog(frame, cues.pron1 - 10, 70, E.inOut)) + 0;
  const enter = prog(frame, cues.pron1 + 20, 40, E.inOut);
  return (
    <Stage floorY={450} wall={C.accentSoft}>
      <rect width="940" height="450" fill={C.bgAlt} opacity={0.55} />
      <g transform={`translate(0 ${lerp(150, 0, rise)})`}>
        <Sun x={160} y={230} r={56} rays={rise} />
      </g>
      <Building x={560} y={450} w={250} h={330} lit={rise} />
      <g opacity={prog(frame, 14, 12)}>
        <Clock x={380} y={118} r={58} hour={6 + Math.floor(minute / 360)} minute={(minute % 360) / 6 % 60} />
      </g>
      <Person x={lerp(250, 640, enter)} y={450} skin={I.skin[2]} shirt={I.shirtC} hair={I.hair[2]} front={<Bag />}
        pose={{ legSwing: Math.sin(frame / 4.5) * 16 * (1 - Math.max(0, enter - 0.95) * 20), armL: 24, armR: 24 + Math.sin(frame / 4.5) * 18, bob: breathe(frame, fps, 1.2, 1.2) }} />
    </Stage>
  );
};

/** 178 — clock, computer shutdown, employee stands up */
export const FinishWork: React.FC<IllusProps> = ({ frame, fps, cues }) => {
  const shut = prog(frame, cues.pron1, 12);
  const stand = prog(frame, cues.pron1 + 18, 24, E.inOut);
  const clockMin = lerp(0, 0, 0);
  return (
    <Stage floorY={450}>
      <g opacity={prog(frame, 2, 12)}><Clock x={150} y={110} r={58} hour={5} minute={clockMin + Math.round(prog(frame, 6, 40, E.inOut) * 0)} /></g>
      <g transform="translate(0 2)">
        <rect x="250" y="338" width="420" height="22" rx="10" fill={I.wood} />
        <rect x="280" y="360" width="16" height="92" rx="6" fill={I.woodDark} />
        <rect x="624" y="360" width="16" height="92" rx="6" fill={I.woodDark} />
      </g>
      <Monitor x={560} y={226} on={shut > 0.35 ? 0 : 1} />
      {shut > 0.05 && shut < 0.4 ? <rect x="472" y="118" width="176" height="100" rx="8" fill="#FFFFFF" opacity={1 - shut * 2.5} /> : null}
      <Chair x={380} y={452} flip />
      <Person x={lerp(430, 320, stand)} y={450} skin={I.skin[1]} shirt={I.shirtA} sitting={stand < 0.5} flip
        pose={{ armL: lerp(70, 20, stand), armR: lerp(60, 150, Math.sin(stand * Math.PI)) + 0, bob: breathe(frame, fps, 1.2, 2.4), mouth: shut * 0.4 }} />
      <Dots x={800} y={110} active={Math.floor(frame / 10) % 3} />
    </Stage>
  );
};

/** 179 — reception desk, asking if the manager is in */
export const AskManager: React.FC<IllusProps> = ({ frame, fps, cues }) => {
  const q = springIn(frame, fps, cues.pron1 + 4, theme.spring.bouncy);
  const mgr = prog(frame, cues.pron1 - 6, 16);
  return (
    <Stage floorY={450}>
      <g opacity={prog(frame, 2, 14)}>
        <rect x="360" y="330" width="360" height="124" rx="12" fill={I.wood} />
        <rect x="360" y="318" width="360" height="22" rx="10" fill={I.woodDark} />
        <rect x="560" y="300" width="130" height="18" rx="6" fill={I.metal} />
      </g>
      <Person x={170} y={450} skin={I.skin[2]} shirt={I.shirtA} hair={I.hair[0]} pose={{ armR: lerp(10, 70, mgr) + Math.sin(frame / 6) * 6, armL: 10, mouth: mgr * 0.8, bob: breathe(frame, fps, 1.4, 2.6) }} />
      <g opacity={Math.min(1, q)} transform={`translate(0 ${-4 * q})`}>
        <Bubble x={130} y={96} w={116} h={84} tail="down"><QuestionMark x={0} y={26} size={72} /></Bubble>
      </g>
      <g opacity={mgr} transform={`translate(${(1 - mgr) * 40} 0)`}>
        <Bubble x={800} y={88} w={130} h={116} tail="down">
          <circle cx="0" cy="-14" r="24" fill={I.skin[3]} />
          <path d="M-36 40 q36 -52 72 0z" fill={I.shirtE} />
          <path d="M-6 40 l6 -14 l6 14z" fill={C.white} />
        </Bubble>
      </g>
      <Person x={840} y={450} flip={false} skin={I.skin[3]} shirt={I.shirtE} hair={I.hair[2]} pose={{ armL: 10, armR: 10, bob: breathe(frame, fps, 1.2, 2.2, 1) }}
        front={<path d="M-8 -206 L0 -150 L8 -206Z" fill={C.white} />} />
    </Stage>
  );
};

/** 180 — unanswered call to the sponsor (neutral, respectful visual) */
export const SponsorNoReply: React.FC<IllusProps> = ({ frame, fps, cues }) => {
  const ring = (frame % 36) / 36;
  const calling = frame < cues.pron2 + 12;
  const miss = prog(frame, cues.pron2 + 10, 14);
  const phone = springIn(frame, fps, 4, theme.spring.bouncy);
  return (
    <Stage floorY={450}>
      <Person x={220} y={450} skin={I.skin[1]} shirt={I.shirtA} pose={{ armR: 118 - 4 * Math.sin(frame / 7), armL: 12, bob: breathe(frame, fps, 1.4, 2.6), mouth: 0 }} />
      <g transform={`translate(0 ${(1 - phone) * 70})`} opacity={prog(frame, 4, 12)}>
        <Phone x={560} y={250} scale={1.1}>
          <circle cx="0" cy="-60" r="34" fill={C.primarySoft} />
          <circle cx="0" cy="-70" r="12" fill={C.primary} />
          <path d="M-24 -38 q24 -34 48 0z" fill={C.primary} />
          <rect x="-48" y="0" width="96" height="10" rx="5" fill={C.line} />
          {calling ? (
            <g>
              <circle cx="0" cy="76" r="30" fill={C.primary} />
              <path d="M-12 84 q6 -26 24 -20 l0 8 q-8 0 -8 6z" fill={C.white} />
            </g>
          ) : (
            <g opacity={miss}>
              <circle cx="0" cy="76" r="30" fill={I.red} />
              <path d="M-12 64 l24 24 M12 64 l-24 24" stroke={C.white} strokeWidth="7" strokeLinecap="round" />
            </g>
          )}
        </Phone>
      </g>
      {calling ? [0, 1, 2].map((i) => {
        const t = (ring + i / 3) % 1;
        return <circle key={i} cx="560" cy="250" r={120 + t * 90} fill="none" stroke={C.primary} strokeWidth="5" opacity={(1 - t) * 0.5} />;
      }) : null}
      <g opacity={1 - miss}><Dots x={800} y={110} active={Math.floor(frame / 10) % 3} r={9} /></g>
      <g opacity={miss}>
        <Bubble x={800} y={110} w={130} h={80} tail="left"><path d="M-26 0 h52" stroke={C.textDim} strokeWidth="8" strokeLinecap="round" /></Bubble>
      </g>
    </Stage>
  );
};

/** office overview used by the section intro + thumbnail + intro split */
export const OfficeOverview: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const a = entrance(frame, fps, 4, { y: 30 });
  return (
    <Stage floorY={430}>
      <g opacity={a.opacity} style={{ transform: a.transform, transformBox: "fill-box", transformOrigin: "center" }}>
        <rect x="320" y="318" width="360" height="20" rx="10" fill={I.wood} />
        <rect x="350" y="338" width="14" height="92" rx="6" fill={I.woodDark} />
        <rect x="636" y="338" width="14" height="92" rx="6" fill={I.woodDark} />
        <Monitor x={500} y={210} on={1} />
      </g>
      <Chair x={300} y={432} flip />
      <Person x={150} y={430} skin={I.skin[1]} shirt={I.shirtA} pose={{ armR: 60, armL: 12, bob: breathe(frame, fps, 1.4, 2.6) }} />
      <Person x={800} y={430} flip skin={I.skin[3]} shirt={I.shirtE} hair={I.hair[2]} pose={{ armR: 70, armL: 12, bob: breathe(frame, fps, 1.2, 2.2, 1) }}
        front={<path d="M-8 -206 L0 -150 L8 -206Z" fill={C.white} />} />
      <Clock x={110} y={96} r={40} hour={9} minute={0} />
    </Stage>
  );
};
