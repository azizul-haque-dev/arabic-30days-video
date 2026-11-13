import React from "react";
import { interpolate } from "remotion";
import { colors, ease, fonts } from "../design/tokens";
import type { IllustrationId } from "../types";
import {
  ARMS,
  Backdrop,
  Bubble,
  Briefcase,
  Calendar,
  Checklist,
  Clock,
  Cup,
  Desk,
  Float,
  Laptop,
  Paper,
  Person,
  Phone,
  Pop,
  QMark,
  TaskCard,
  ill,
  useAnim,
} from "./primitives";

const THOBE = "#E2E8F0";
const clampOpts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* --------------------------- small local props ---------------------------- */

const MiniCalendarIcon: React.FC = () => (
  <g>
    <rect x="-34" y="-30" width="68" height="62" rx="12" fill="#fff" stroke={colors.dark} strokeWidth="4" />
    <path d="M-34 -14 v-6 a12 12 0 0 1 12 -12 h44 a12 12 0 0 1 12 12 v6 Z" fill={colors.primary} />
    <rect x="-16" y="-38" width="7" height="16" rx="3.5" fill={colors.dark} />
    <rect x="9" y="-38" width="7" height="16" rx="3.5" fill={colors.dark} />
    <rect x="-20" y="0" width="12" height="12" rx="3" fill={colors.soft} />
    <rect x="-2" y="0" width="12" height="12" rx="3" fill={colors.amber} />
    <rect x="16" y="0" width="12" height="12" rx="3" fill={colors.soft} />
  </g>
);

const DifficultyMeter: React.FC<{ x: number; y: number; level?: number }> = ({ x, y, level = 3 }) => {
  const { frame } = useAnim();
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const t = interpolate(frame, [26 + i * 8, 38 + i * 8], [0, 1], { easing: ease.out, ...clampOpts });
        const h = 24 + i * 12;
        return (
          <g key={i}>
            <rect x={i * 34} y={-h} width="24" height={h} rx="8" fill={colors.border} />
            {i < level ? <rect x={i * 34} y={-h * t} width="24" height={h * t} rx="8" fill={colors.amber} /> : null}
          </g>
        );
      })}
    </g>
  );
};

const StepsBoard: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => {
  const { frame } = useAnim();
  const colW = w / 3;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx="26" fill="#fff" stroke={colors.border} strokeWidth="4" />
      <rect x="26" y="24" width={w * 0.34} height="14" rx="7" fill={colors.primary} />
      {[0, 1, 2].map((i) => {
        const t = interpolate(frame, [18 + i * 22, 34 + i * 22], [0, 1], { easing: ease.out, ...clampOpts });
        const cx = colW * i + colW / 2;
        return (
          <g key={i} opacity={t} transform={`translate(0 ${(1 - t) * 18})`}>
            <circle cx={cx} cy="110" r="34" fill={i === 2 ? colors.primary : colors.soft} stroke={colors.primary} strokeWidth="4" />
            <text x={cx} y="124" textAnchor="middle" fontFamily={fonts.latin} fontWeight="700" fontSize="38" fill={i === 2 ? "#fff" : colors.dark}>
              {i + 1}
            </text>
            <rect x={cx - 52} y="172" width="104" height="12" rx="6" fill={colors.border} />
            <rect x={cx - 52} y="194" width="70" height="10" rx="5" fill="#F0F0F0" />
            <rect x={cx - 52} y="222" width="104" height={i === 2 ? 40 : 30} rx="12" fill={i === 2 ? colors.soft : "#F5F5F5"} />
          </g>
        );
      })}
      {[0, 1].map((i) => {
        const t = interpolate(frame, [30 + i * 22, 44 + i * 22], [0, 1], { easing: ease.out, ...clampOpts });
        const ax = colW * (i + 1);
        return (
          <path key={i} d={`M${ax - 26} 110 H${ax + 26} m-12 -12 l12 12 l-12 12`} stroke={colors.amber} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="90" strokeDashoffset={90 * (1 - t)} />
        );
      })}
    </g>
  );
};

const Door: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const { frame } = useAnim();
  const open = interpolate(frame, [40, 80], [0, 1], { easing: ease.inOut, ...clampOpts });
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="128" height="330" rx="10" fill={colors.dark} />
      <rect x="10" y="10" width="108" height="320" fill="#BBF7D0" />
      <path d={`M10 10 L${10 + 108 * (1 - open * 0.55)} ${10 + 14 * open} V${330 - 14 * open} L10 330 Z`} fill={ill.wood} stroke={colors.border} strokeWidth="2" />
      <circle cx={10 + 108 * (1 - open * 0.55) - 16} cy="180" r="6" fill={colors.amber} />
      <rect x="14" y="-58" width="100" height="40" rx="10" fill={colors.primary} />
      <path d="M32 -38 H84 m-12 -12 l12 12 l-12 12" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" transform="translate(0 0)" />
    </g>
  );
};

const Battery: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const { frame } = useAnim();
  const blink = 0.55 + 0.45 * Math.sin(frame / 12);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="140" height="68" rx="16" fill="#fff" stroke={ill.slate} strokeWidth="6" />
      <rect x="146" y="20" width="10" height="28" rx="4" fill={ill.slate} />
      <rect x="10" y="10" width="30" height="48" rx="8" fill={colors.amber} opacity={blink} />
    </g>
  );
};

const Box: React.FC = () => (
  <g>
    <rect x="-70" y="-90" width="140" height="90" rx="8" fill="#E7B25B" />
    <rect x="-70" y="-90" width="140" height="26" rx="8" fill="#D99A3D" />
    <rect x="-14" y="-90" width="28" height="90" fill="#F3D08F" opacity="0.8" />
  </g>
);

const Thought: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const { frame } = useAnim();
  return (
    <Pop x={x} y={y} delay={14} rise={18}>
      <circle cx="-46" cy="150" r="9" fill="#fff" stroke={colors.border} strokeWidth="3" />
      <circle cx="-22" cy="122" r="15" fill="#fff" stroke={colors.border} strokeWidth="3" />
      <ellipse cx="90" cy="48" rx="130" ry="74" fill="#fff" stroke={colors.border} strokeWidth="3" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={46 + i * 44} cy="48" r={11 + 4 * Math.max(0, Math.sin((frame - i * 7) / 8))} fill={colors.amber} />
      ))}
    </Pop>
  );
};

/* -------------------------------- scenes ---------------------------------- */

const LeaveRequest: React.FC = () => {
  const { frame } = useAnim();
  const t = interpolate(frame, [26, 84], [0, 1], { easing: ease.inOut, ...clampOpts });
  const px = 350 + (572 - 350) * t;
  const py = 206 + (378 - 206) * t - Math.sin(Math.PI * t) * 46;
  return (
    <g>
      <Backdrop window={{ x: 610, y: 36 }} plant={884} />
      <Pop delay={2}>
        <Person x={250} expression="asking" rArm={ARMS.raiseR} wave />
      </Pop>
      <Pop delay={6}>
        <Person x={670} headwear="ghutra" shirt={THOBE} collar="#CBD5E1" skin={ill.skinB} expression="neutral" />
      </Pop>
      <Pop delay={4}>
        <Desk x={250} w={330} />
      </Pop>
      <Pop delay={8}>
        <Desk x={670} w={330} />
      </Pop>
      <Pop delay={8}>
        <Laptop x={700} w={104} />
      </Pop>
      <Bubble x={130} y={30} w={200} h={112} tail="down-right" delay={14}>
        <g transform="translate(100 56)">
          <MiniCalendarIcon />
        </g>
      </Bubble>
      <g transform={`translate(${px} ${py}) rotate(${-8 + 8 * t})`} opacity={interpolate(frame, [18, 26], [0, 1], clampOpts)}>
        <Paper w={84} h={104} lines={3} accent={colors.amber} />
      </g>
    </g>
  );
};

const SalaryMissing: React.FC = () => (
  <g>
    <Backdrop window={null} plant={null} />
    <Pop delay={2}>
      <Person x={220} expression="worried" rArm={ARMS.pointR} />
    </Pop>
    <Pop delay={4}>
      <Desk x={220} w={330} />
    </Pop>
    <Pop delay={6}>
      <Laptop x={150} w={96} />
    </Pop>
    <Pop delay={10} rise={34}>
      <Float amp={5} period={110}>
        <Phone x={470} y={96} w={200} h={380} />
      </Float>
    </Pop>
    <Calendar x={716} y={70} w={170} pulseLast delay={14} />
    <Pop x={802} y={382} delay={22}>
      <Float amp={4} period={100} phase={20}>
        <Paper w={116} h={140} lines={3} accent={ill.slateLight} dashed />
      </Float>
    </Pop>
  </g>
);

const SalaryQuestion: React.FC = () => (
  <g>
    <Backdrop window={null} plant={null} />
    <Pop delay={2}>
      <Person x={240} expression="asking" rArm={ARMS.raiseR} wave />
    </Pop>
    <Pop delay={4}>
      <Desk x={240} w={340} />
    </Pop>
    <Pop delay={6}>
      <Laptop x={170} w={96} />
    </Pop>
    <Bubble x={110} y={34} w={190} h={110} tail="down-right" delay={12}>
      <g transform="translate(95 55)">
        <rect x="-44" y="-26" width="88" height="52" rx="8" fill={colors.soft} stroke={colors.primary} strokeWidth="4" />
        <circle r="15" fill={colors.primary} />
        <text y="8" textAnchor="middle" fontFamily={fonts.latin} fontWeight="700" fontSize="22" fill="#fff">
          $
        </text>
      </g>
    </Bubble>
    <Calendar x={520} y={96} w={290} pulseLast delay={10} />
    <QMark x={800} y={110} size={112} delay={34} />
  </g>
);

const BusyDesk: React.FC = () => {
  const { frame } = useAnim();
  const cards = [
    { x: 130, y: 150, d: 8, tone: colors.primary },
    { x: 126, y: 316, d: 16, tone: colors.amber },
    { x: 790, y: 140, d: 12, tone: colors.amber },
    { x: 796, y: 306, d: 20, tone: colors.primary },
  ];
  return (
    <g>
      <Backdrop window={{ x: 380, y: 30, w: 160, h: 100 }} plant={null} />
      {cards.map((c, i) => (
        <Pop key={i} x={c.x} y={c.y} delay={c.d} rise={40}>
          <Float amp={7} period={80 + i * 14} phase={i * 17}>
            <g transform={`rotate(${(i % 2 ? 1 : -1) * 4})`}>
              <TaskCard tone={c.tone} />
            </g>
          </Float>
        </Pop>
      ))}
      <Pop delay={2}>
        <Person x={460} expression="focused" lArm={ARMS.typeL} rArm={ARMS.typeR} />
      </Pop>
      <Pop delay={4}>
        <Desk x={460} w={420} />
      </Pop>
      <Pop delay={6}>
        <Laptop x={460} w={124} />
      </Pop>
      <Pop x={300} y={402} delay={10}>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${i * 3} ${-i * 9})`}>
            <rect x="-34" y="-12" width="68" height="12" rx="3" fill="#fff" stroke={colors.border} strokeWidth="2" />
          </g>
        ))}
      </Pop>
      <g opacity={0.0 + 0 * frame} />
    </g>
  );
};

const TaskDone: React.FC = () => {
  const { frame } = useAnim();
  const badge = interpolate(frame, [96, 112], [0, 1], { easing: ease.out, ...clampOpts });
  return (
    <g>
      <Backdrop window={{ x: 60, y: 36, w: 200, h: 120 }} plant={null} />
      <Pop delay={2}>
        <Person x={300} expression="happy" rArm={ARMS.raiseR} wave />
      </Pop>
      <Pop delay={4}>
        <Desk x={300} w={340} />
      </Pop>
      <Pop delay={6}>
        <Laptop x={230} w={100} />
      </Pop>
      <Pop delay={8}>
        <Checklist x={560} y={90} w={300} h={340} rows={4} start={24} gap={20} />
      </Pop>
      <g transform={`translate(840 90) scale(${badge})`} opacity={badge}>
        <circle r="46" fill={colors.primary} />
        <path d="M-20 2 l14 14 l28 -30" stroke="#fff" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
};

const LeaveEarly: React.FC = () => (
  <g>
    <Backdrop window={null} plant={null} />
    <Pop delay={4}>
      <Clock x={560} y={170} r={92} from={0} to={330} start={14} dur={100} />
    </Pop>
    <Pop delay={10}>
      <Door x={740} y={140} />
    </Pop>
    <Pop delay={2}>
      <Person x={230} expression="focused" rArm={ARMS.pointR} />
    </Pop>
    <Pop delay={4}>
      <Desk x={230} w={320} />
    </Pop>
    <Pop delay={8}>
      <Briefcase x={330} />
    </Pop>
    <Pop delay={6}>
      <Laptop x={150} w={90} />
    </Pop>
  </g>
);

const Tired: React.FC = () => (
  <g>
    <Backdrop window={{ x: 90, y: 40, w: 200, h: 120 }} plant={null} />
    <Pop delay={10}>
      <Float amp={3} period={120}>
        <Battery x={640} y={110} />
      </Float>
    </Pop>
    <Pop delay={2}>
      <Person x={450} expression="tired" tilt={8} lArm={ARMS.typeL} rArm={ARMS.cheekR} breathe />
    </Pop>
    <Pop delay={4}>
      <Desk x={450} w={420} />
    </Pop>
    <Pop delay={6}>
      <Laptop x={350} w={110} />
    </Pop>
    <Pop delay={8}>
      <Cup x={600} />
    </Pop>
  </g>
);

const DifficultTask: React.FC = () => (
  <g>
    <Backdrop window={{ x: 60, y: 36, w: 190, h: 112 }} plant={null} />
    <Pop delay={2}>
      <Person x={270} expression="worried" tilt={-4} lArm={ARMS.typeL} rArm={ARMS.typeR} />
    </Pop>
    <Pop delay={4}>
      <Desk x={270} w={340} />
    </Pop>
    <Pop delay={6}>
      <Laptop x={270} w={112} />
    </Pop>
    <Pop x={640} y={230} delay={10} rise={34}>
      <Float amp={6} period={100}>
        <rect x="-170" y="-150" width="340" height="300" rx="28" fill="#fff" stroke={colors.border} strokeWidth="4" />
        <rect x="-140" y="-118" width="150" height="16" rx="8" fill={colors.primary} />
        <rect x="-140" y="-82" width="270" height="12" rx="6" fill={colors.border} />
        <rect x="-140" y="-58" width="210" height="12" rx="6" fill="#F0F0F0" />
        <rect x="-140" y="-34" width="240" height="12" rx="6" fill="#F0F0F0" />
        <rect x="-140" y="10" width="280" height="110" rx="20" fill={colors.bg} />
        <DifficultyMeter x={-112} y={98} level={3} />
        <circle cx="96" cy="64" r="28" fill={colors.amber} />
        <path d="M84 64 h24 M96 52 v24" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
      </Float>
    </Pop>
  </g>
);

const TeachSteps: React.FC = () => (
  <g>
    <Backdrop window={null} plant={null} />
    <Pop delay={4}>
      <StepsBoard x={50} y={56} w={430} h={300} />
    </Pop>
    <Pop delay={2}>
      <Person x={600} shirt={ill.slate} expression="happy" lArm={ARMS.pointL} rArm={ARMS.restR} />
    </Pop>
    <Pop delay={6}>
      <Person x={790} shirt={colors.dark} skin={ill.skinB} expression="focused" lArm={ARMS.typeL} rArm={ARMS.typeR} />
    </Pop>
    <Pop delay={4}>
      <Desk x={690} w={440} />
    </Pop>
    <Pop x={800} y={402} delay={12}>
      <rect x="-40" y="-14" width="80" height="14" rx="4" fill="#fff" stroke={colors.border} strokeWidth="2" />
    </Pop>
  </g>
);

const Demonstrate: React.FC = () => {
  const { frame } = useAnim();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);
  const bob = Math.sin(frame / 9) * 8;
  return (
    <g>
      <Backdrop window={{ x: 60, y: 36, w: 200, h: 120 }} plant={null} />
      <Pop delay={2}>
        <Person x={270} expression="happy" rArm={ARMS.pointR} />
      </Pop>
      <Pop delay={4}>
        <Desk x={270} w={320} />
      </Pop>
      <Pop delay={4}>
        <Desk x={690} w={300} />
      </Pop>
      <Pop x={690} y={402} delay={10}>
        <Box />
      </Pop>
      <g opacity={interpolate(frame, [24, 36], [0, 1], clampOpts)}>
        <rect x={604 - pulse * 4} y={298 - pulse * 4} width={172 + pulse * 8} height={118 + pulse * 8} rx="18" fill="none" stroke={colors.amber} strokeWidth="5" opacity={0.45 + 0.45 * pulse} />
        <path d={`M690 ${236 + bob} v34 m-14 -14 l14 14 l14 -14`} stroke={colors.amber} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
};

const Challenge: React.FC = () => (
  <g>
    <Backdrop window={{ x: 70, y: 40, w: 200, h: 120 }} plant={null} />
    <Pop delay={2}>
      <Person x={400} expression="asking" lArm={ARMS.restL} rArm={ARMS.cheekR} tilt={-5} />
    </Pop>
    <Pop delay={4}>
      <Desk x={400} w={360} />
    </Pop>
    <Pop delay={6}>
      <Laptop x={330} w={100} />
    </Pop>
    <Thought x={560} y={70} />
  </g>
);

const Section: React.FC = () => (
  <g>
    <Backdrop window={{ x: 60, y: 36, w: 220, h: 130 }} plant={886} />
    <Pop delay={2}>
      <Person x={320} expression="neutral" />
    </Pop>
    <Pop delay={4}>
      <Desk x={320} w={380} />
    </Pop>
    <Pop delay={6}>
      <Laptop x={250} w={104} />
    </Pop>
    <Calendar x={600} y={60} w={200} delay={14} fillTo={20} />
    <Pop x={700} y={380} delay={22}>
      <Float amp={4} period={100}>
        <Paper w={120} h={150} lines={3} />
      </Float>
    </Pop>
  </g>
);

const OpeningSalary: React.FC = () => (
  <g>
    <Backdrop window={null} plant={null} />
    <Pop delay={4} rise={34} visibleAtStart>
      <Float amp={5} period={110}>
        <Phone x={140} y={100} w={210} h={400} />
      </Float>
    </Pop>
    <Calendar x={440} y={90} w={330} pulseLast delay={10} visibleAtStart />
    <Pop x={810} y={430} delay={26} visibleAtStart>
      <Float amp={4} period={90}>
        <Paper w={100} h={124} lines={2} accent={ill.slateLight} dashed />
      </Float>
    </Pop>
  </g>
);

const Outro: React.FC = () => (
  <g>
    <Backdrop window={null} plant={null} />
    <Calendar x={90} y={90} w={380} checks={10} delay={8} />
    <Pop delay={14}>
      <Clock x={680} y={220} r={110} from={0} to={360} start={20} dur={120} />
    </Pop>
    <Pop x={680} y={420} delay={30}>
      <rect x="-90" y="-20" width="180" height="40" rx="20" fill={colors.primary} />
      <circle cx="-62" cy="0" r="8" fill="#fff" />
      <rect x="-42" y="-6" width="96" height="12" rx="6" fill="#fff" opacity="0.85" />
    </Pop>
  </g>
);

export const illustrations: Record<IllustrationId, React.FC> = {
  opening: OpeningSalary,
  section: Section,
  "leave-request": LeaveRequest,
  "salary-missing": SalaryMissing,
  "salary-question": SalaryQuestion,
  "busy-desk": BusyDesk,
  "task-done": TaskDone,
  "leave-early": LeaveEarly,
  tired: Tired,
  "difficult-task": DifficultTask,
  "teach-steps": TeachSteps,
  demonstrate: Demonstrate,
  challenge: Challenge,
  outro: Outro,
};
