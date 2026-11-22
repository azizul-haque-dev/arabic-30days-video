import React from "react";
import {IconKey} from "../../data/vocab";
import {theme} from "../../theme";
import {DashArrow, Heart, Person, Ping} from "./Parts";

type Props = {icon: IconKey; /** 0..1 progress of the small indicator marks */ p: number};

const feet = (y: number, s: number) => y + 132 * s;

/** One 400x400 vector illustration per vocabulary item. */
export const IconArt: React.FC<Props> = ({icon, p}) => {
  const c = theme.colors;
  let content: React.ReactNode = null;

  switch (icon) {
    case "self": // first person, singular: hand on chest
      content = (
        <>
          <Person gender="m" pose="self" x={215} y={215} s={1.15} />
          <DashArrow x1={20} x2={118} y={192} progress={p} />
        </>
      );
      break;
    case "you-m": // second person, male: pointing toward the viewer
      content = (
        <>
          <Person gender="m" pose="toward" x={170} y={215} s={1.15} />
          <Ping x={290} y={232} progress={p} />
        </>
      );
      break;
    case "you-f":
      content = (
        <>
          <Person gender="f" pose="toward" x={170} y={215} s={1.15} />
          <Ping x={290} y={232} progress={p} />
        </>
      );
      break;
    case "he": // third person, male: pointing away
      content = (
        <>
          <Person gender="m" pose="away" x={115} y={215} s={1.05} />
          <DashArrow x1={262} x2={382} y={170} progress={p} />
        </>
      );
      break;
    case "she":
      content = (
        <>
          <Person gender="f" pose="away" x={115} y={215} s={1.05} />
          <DashArrow x1={262} x2={382} y={170} progress={p} />
        </>
      );
      break;
    case "we": // first person plural: group inside a shared ring
      content = (
        <>
          <ellipse
            cx={200}
            cy={212}
            rx={186}
            ry={172}
            fill="none"
            stroke={c.primary}
            strokeWidth={7}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - p}
            opacity={0.55}
          />
          <Person gender="m" pose="down" x={98} y={230} s={0.86} />
          <Person gender="f" pose="down" x={302} y={230} s={0.86} />
          <Person gender="f" pose="self" x={200} y={215} s={1.0} />
        </>
      );
      break;
    case "you-all": // second person plural: group facing the viewer
      content = (
        <>
          <Person gender="f" pose="down" x={88} y={230} s={0.86} />
          <Person gender="m" pose="down" x={218} y={230} s={0.86} />
          <Person gender="m" pose="toward" x={150} y={215} s={1.0} />
          <Ping x={262} y={232} progress={p} />
        </>
      );
      break;
    case "they": // third person plural: a group over there
      content = (
        <>
          <DashArrow x1={18} x2={122} y={215} progress={p} />
          <Person gender="f" pose="down" x={205} y={248} s={0.68} />
          <Person gender="m" pose="down" x={270} y={248} s={0.68} />
          <Person gender="f" pose="down" x={335} y={248} s={0.68} />
        </>
      );
      break;
    case "father":
      content = <Person gender="m" role="father" x={200} y={215} s={1.15} />;
      break;
    case "mother":
      content = <Person gender="f" role="mother" x={200} y={215} s={1.15} />;
      break;
    case "father-mine":
    case "mother-mine": {
      const dad = icon === "father-mine";
      content = (
        <>
          <Person gender={dad ? "m" : "f"} role={dad ? "father" : "mother"} x={235} y={215} s={1.05} />
          <Person gender={dad ? "m" : "f"} pose="self" x={92} y={feet(215, 1.05) - 132 * 0.62} s={0.62} />
          <g transform={`translate(140 ${86 - (1 - p) * 10}) scale(${0.6 + 0.4 * p})`} opacity={p}>
            <Heart x={0} y={0} size={64} />
          </g>
        </>
      );
      break;
    }
  }

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%" style={{overflow: "visible"}}>
      {content}
    </svg>
  );
};
