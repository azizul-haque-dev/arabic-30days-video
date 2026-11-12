import React from "react";
import { theme } from "../../../theme";
import { breathe, entrance, lerp, prog, springIn } from "../../../lib/anim";
import {
  Bubble, Chair, Clock, Counter, Dots, Glass, Heart, IllusProps, Mango, Person, Plate, QuestionMark, Sparkle, Stage, Table,
} from "./kit";

const I = theme.illus;
const C = theme.colors;
const E = theme.ease;

const wrap = (e: { opacity: number; transform: string }, children: React.ReactNode, key?: string) => (
  <g key={key} opacity={e.opacity} style={{ transform: e.transform, transformBox: "fill-box", transformOrigin: "center" }}>{children}</g>
);

/** 171 — customer tastes food and likes it */
export const DeliciousFood: React.FC<IllusProps> = ({ frame, fps, cues }) => {
  const plate = springIn(frame, fps, 4, theme.spring.bouncy);
  const bite = prog(frame, cues.pron1 - 6, 18, E.inOut) * (1 - prog(frame, cues.pron1 + 40, 16, E.inOut));
  const yum = prog(frame, cues.pron1 + 4, 16);
  return (
    <Stage floorY={440}>
      <Chair x={250} y={440} />
      <Table x={470} y={330} w={420} />
      <Person x={290} y={440} sitting skin={I.skin[2]} shirt={I.shirtB} pose={{ armR: lerp(8, 122, bite), armL: 26, mouth: bite, bob: breathe(frame, fps, 1.5, 2.4) }}
        handR={<g transform={`rotate(${-8})`}><rect x="-2" y="2" width="4" height="26" rx="2" fill={I.metal} /></g>} />
      <g transform={`translate(0 ${(1 - plate) * -90})`} opacity={prog(frame, 4, 10)}>
        <Plate x={500} y={324} scale={1.25} steam={2 + breathe(frame, fps, 2, 1.6)} />
      </g>
      <Sparkle x={380} y={128} s={1.6 * yum} o={yum} rot={frame * 1.5} />
      <Heart x={430} y={190} s={1.7 * yum} o={yum} />
      <Sparkle x={330} y={186} s={1.1 * yum} o={yum} color={C.primary} />
      <Person x={780} y={440} flip skin={I.skin[0]} shirt={I.shirtC} hair={I.hair[1]} pose={{ armL: 12, armR: 12 }} />
    </Stage>
  );
};

/** 172 — asks the waiter for dessert */
export const Dessert: React.FC<IllusProps> = ({ frame, fps, cues }) => {
  const slide = prog(frame, 6, 26, E.out);
  const wave = Math.sin(prog(frame, 0, 90, E.soft) * Math.PI * 5);
  const ask = prog(frame, cues.pron1 - 8, 12);
  return (
    <Stage floorY={440}>
      <Table x={470} y={338} w={430} />
      <g transform={`translate(${(1 - slide) * 140} 0)`} opacity={slide}>
        {/* dessert stand + cake */}
        <rect x="438" y="304" width="12" height="30" fill={I.metal} />
        <ellipse cx="444" cy="336" rx="48" ry="9" fill={I.metal} />
        <ellipse cx="444" cy="300" rx="66" ry="12" fill={C.white} stroke={C.line} strokeWidth="4" />
        <path d="M392 296 h104 v-52 a52 40 0 0 0 -104 0z" fill="#F7C9D4" />
        <rect x="392" y="262" width="104" height="14" fill="#FFF4F7" />
        <circle cx="444" cy="204" r="12" fill={I.red} />
      </g>
      <Person x={200} y={440} skin={I.skin[1]} shirt={I.shirtA} pose={{ armR: 150 + wave * 14, armL: 10, mouth: ask * 0.8, bob: breathe(frame, fps, 1.4, 2.6) }} />
      <g transform={`translate(0 ${breathe(frame, fps, 3, 2)})`}>{wrap(entrance(frame, fps, 14, { y: 12 }),
        <Bubble x={250} y={104} w={130} h={74} tail="down"><Dots x={0} y={0} active={Math.floor(frame / 9) % 3} /></Bubble>)}</g>
      <Person x={770} y={440} flip skin={I.skin[3]} shirt={C.white} hair={I.hair[2]}
        pose={{ armR: 60 + 18 * wave, armL: 12, bob: breathe(frame, fps, 1.2, 2.2, 1) }}
        front={<g><rect x="-36" y="-150" width="72" height="44" rx="10" fill={I.shirtC} /><path d="M-8 -206 L0 -190 L8 -206Z" fill={C.accent} /></g>} />
    </Stage>
  );
};

/** 173 — "do you have mango juice?" */
export const MangoJuice: React.FC<IllusProps> = ({ frame, fps, cues }) => {
  const fill = prog(frame, cues.pron1 - 4, 56, E.inOut) * 0.78;
  const q = springIn(frame, fps, cues.pron1 + 10, theme.spring.bouncy);
  return (
    <Stage floorY={450}>
      <Counter x={250} y={346} w={520} />
      <g opacity={prog(frame, 2, 12)}>
        <g transform={`translate(0 ${(1 - springIn(frame, fps, 2, theme.spring.bouncy)) * -70})`}>
          <Mango x={360} y={304} scale={1.1} rot={-12} />
          <Mango x={448} y={316} scale={0.85} rot={14} />
        </g>
      </g>
      <Glass id="glassMango" x={560} y={176} w={118} h={170} fill={fill} liquid={I.mango} />
      <rect x="640" y="150" width="9" height="150" rx="4" fill={I.red} transform="rotate(14 640 150)" opacity={prog(frame, 12, 12)} />
      <Person x={150} y={450} skin={I.skin[1]} shirt={I.shirtA} hair={I.hair[1]} hairStyle="long" pose={{ armR: 40, armL: 10, mouth: prog(frame, cues.pron1, 8) * 0.7, bob: breathe(frame, fps, 1.4, 2.6) }} />
      <Person x={830} y={450} flip skin={I.skin[2]} shirt={C.white} hair={I.hair[0]} pose={{ armL: 10, armR: 10, bob: breathe(frame, fps, 1.2, 2.2, 1.2) }}
        front={<rect x="-36" y="-160" width="72" height="56" rx="10" fill={I.shirtC} />} />
      <g transform={`translate(0 ${-4 * q})`} opacity={Math.min(1, q)}>
        <Bubble x={120} y={110} w={120} h={90} tail="down"><QuestionMark x={0} y={28} size={78} /></Bubble>
      </g>
    </Stage>
  );
};

/** 174 — a glass of ice */
export const IceGlass: React.FC<IllusProps> = ({ frame, fps, cues }) => {
  const g = springIn(frame, fps, 4, theme.spring.smooth);
  const cubes = [0, 1, 2, 3, 4];
  const point = prog(frame, cues.pron1 - 6, 14);
  return (
    <Stage floorY={450}>
      <Counter x={300} y={372} w={400} />
      <g transform={`translate(${(1 - g) * 140} 0)`} opacity={prog(frame, 4, 12)}>
        <Glass id="glassIce" x={410} y={120} w={150} h={236} fill={0} liquid={I.ice}>
          {cubes.map((i) => {
            const t = prog(frame, 20 + i * 8, 22, E.in);
            const land = 236 - 44 - Math.floor(i / 2) * 42;
            const xs = 14 + (i % 2) * 52 + (i === 4 ? 26 : 0);
            return <rect key={i} x={xs} y={lerp(-120, land, t)} width="44" height="42" rx="9" fill={I.ice} stroke={I.iceEdge} strokeWidth="4" opacity={0.95} transform={`rotate(${(i - 2) * 6} ${xs + 22} ${land})`} />;
          })}
        </Glass>
      </g>
      <Person x={170} y={450} skin={I.skin[0]} shirt={I.shirtB} hair={I.hair[3]} pose={{ armR: lerp(10, 92, point), armL: 10, mouth: point * 0.6, bob: breathe(frame, fps, 1.4, 2.6) }} />
      <Sparkle x={380} y={96} s={1.2} o={0.5 + 0.5 * Math.sin(frame / 8)} color={I.iceEdge} />
      <Sparkle x={610} y={140} s={0.9} o={0.5 + 0.5 * Math.cos(frame / 9)} color={I.iceEdge} />
      <Person x={810} y={450} flip skin={I.skin[2]} shirt={C.white} hair={I.hair[2]} pose={{ armL: 12, armR: 12, bob: breathe(frame, fps, 1.2, 2.2, 1) }}
        front={<rect x="-36" y="-160" width="72" height="56" rx="10" fill={I.shirtC} />} />
    </Stage>
  );
};

/** 175 — chef cooks; someone appreciates (usage explanation = interaction) */
export const ChefCompliment: React.FC<IllusProps> = ({ frame, fps, cues }) => {
  const usage = cues.usage ?? cues.meaning;
  const cook = Math.sin(frame / 5) * 7;
  const reveal = springIn(frame, fps, cues.pron1 - 10, theme.spring.bouncy);
  const thanks = prog(frame, usage, 14);
  const hearts = prog(frame, usage + 8, 18);
  return (
    <Stage floorY={450}>
      <Counter x={70} y={340} w={440} />
      {/* pan on stove */}
      <ellipse cx="190" cy="334" rx="62" ry="12" fill={C.text} />
      <rect x="236" y="322" width="76" height="9" rx="4" fill={C.text} />
      <g opacity={prog(frame, 14, 10)} fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round">
        <path d={`M170 ${300 + cook / 2} q10 -16 0 -30`} /><path d={`M200 ${300 - cook / 2} q10 -14 0 -26`} />
      </g>
      <Person x={310} y={450} skin={I.skin[1]} shirt={C.white} hair={I.hair[0]} pose={{ armR: 62 + cook, armL: 70, mouth: 0.2 + thanks * 0.3, bob: breathe(frame, fps, 1.2, 1.6) }}
        top={<g><rect x="-30" y="-296" width="60" height="38" rx="14" fill={C.white} stroke={C.line} strokeWidth="3" /><circle cx="-18" cy="-296" r="18" fill={C.white} stroke={C.line} strokeWidth="3" /><circle cx="18" cy="-296" r="18" fill={C.white} stroke={C.line} strokeWidth="3" /><circle cx="0" cy="-306" r="20" fill={C.white} stroke={C.line} strokeWidth="3" /></g>}
        front={<rect x="-30" y="-170" width="60" height="64" rx="10" fill={I.shirtC} />} />
      <g transform={`translate(0 ${(1 - reveal) * -80})`} opacity={prog(frame, cues.pron1 - 10, 10)}>
        <Plate x={520} y={340} scale={1.15} steam={3} />
      </g>
      <Person x={760} y={450} flip skin={I.skin[2]} shirt={I.shirtA} hair={I.hair[1]} pose={{ armR: lerp(10, 160, thanks), armL: lerp(10, 40, thanks), mouth: thanks * 0.7, bob: breathe(frame, fps, 1.4, 2.4, 1) }} />
      <Heart x={640} y={150} s={1.8 * hearts} o={hearts} />
      <Heart x={700} y={110} s={1.2 * hearts} o={hearts} />
      <Sparkle x={610} y={100} s={1.3 * hearts} o={hearts} rot={frame} />
    </Stage>
  );
};

/** restaurant overview used by the section intro + thumbnail + intro split */
export const RestaurantOverview: React.FC<{ frame: number; fps: number; compact?: boolean }> = ({ frame, fps, compact }) => {
  const a = entrance(frame, fps, 4, { y: 30 });
  const b = entrance(frame, fps, 12, { y: 30 });
  return (
    <Stage floorY={430}>
      <Table x={470} y={326} w={400} />
      {wrap(a, <Plate x={420} y={320} scale={1.1} steam={2} />)}
      {wrap(b, <Glass id="ovGlass" x={520} y={230} w={70} h={86} fill={0.8} liquid={I.mango} />)}
      <Person x={170} y={430} skin={I.skin[1]} shirt={I.shirtA} pose={{ armR: 40, armL: 12, bob: breathe(frame, fps, 1.4, 2.6) }} />
      <Person x={780} y={430} flip skin={I.skin[3]} shirt={C.white} hair={I.hair[2]} pose={{ armR: 70, armL: 12, bob: breathe(frame, fps, 1.2, 2.2, 1) }}
        front={<rect x="-36" y="-160" width="72" height="56" rx="10" fill={I.shirtC} />} />
      {!compact ? <Clock x={470} y={110} r={42} hour={12} minute={0} /> : null}
      <Sparkle x={290} y={140} s={1} o={0.7} />
    </Stage>
  );
};
