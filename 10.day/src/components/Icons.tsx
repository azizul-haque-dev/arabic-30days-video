import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import type { IconId } from "../content";

const C = theme.colors;
const sw = 7; // stroke width for clean line art
const ink = {
  stroke: C.text,
  strokeWidth: sw,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const Sparkle: React.FC<{ x: number; y: number; s?: number; r?: number }> = ({
  x,
  y,
  s = 1,
  r = 0,
}) => (
  <path
    d="M0 -14 C2 -4 4 -2 14 0 C4 2 2 4 0 14 C-2 4 -4 2 -14 0 C-4 -2 -2 -4 0 -14Z"
    transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
    fill={C.white}
    stroke={C.text}
    strokeWidth={4}
    strokeLinejoin="round"
  />
);

/** Flat vector duotone icon (ink line + mint/amber fills). 240×240 box, animated with local frame. */
export const Icon: React.FC<{ id: IconId; size?: number; delay?: number }> = ({
  id,
  size = 240,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delay;
  const pop = spring({ frame: f, fps, config: theme.spring.bouncy });
  const t = Math.max(0, f);

  const body = (() => {
    switch (id) {
      // 91. Restaurant order takeout
      case "order": {
        const float = Math.sin(t / 8) * 4;
        return (
          <>
            {/* Takeout Bag */}
            <g transform={`translate(0, ${float})`}>
              <path
                d="M60 90 L75 200 C76 210 85 218 95 218 L145 218 C155 218 164 210 165 200 L180 90 Z"
                fill={C.white}
                {...ink}
              />
              {/* Bag Handles */}
              <path
                d="M92 90 C92 65 104 50 120 50 C136 50 148 65 148 90"
                fill="none"
                {...ink}
                strokeWidth={sw}
              />
              {/* Receipt Tag / Badge */}
              <rect x={100} y={115} width={40} height={50} rx={6} fill={C.primarySoft} stroke={C.text} strokeWidth={4} />
              <line x1={108} y1={128} x2={132} y2={128} stroke={C.primaryDeep} strokeWidth={4} strokeLinecap="round" />
              <line x1={108} y1={140} x2={126} y2={140} stroke={C.primaryDeep} strokeWidth={4} strokeLinecap="round" />
              <line x1={108} y1={152} x2={122} y2={152} stroke={C.primaryDeep} strokeWidth={4} strokeLinecap="round" />
              {/* Amber seal */}
              <circle cx={145} cy={105} r={14} fill={C.accent} stroke={C.text} strokeWidth={4} />
            </g>
            <Sparkle x={186} y={64} s={1.1} />
          </>
        );
      }

      // 92. Refrigerator
      case "fridge": {
        const shudder = Math.sin(t / 5) * 2;
        return (
          <>
            <g transform={`translate(${shudder}, 0)`}>
              {/* Fridge body */}
              <rect x={65} y={40} width={110} height={170} rx={20} fill={C.white} {...ink} />
              {/* Split freezer / fridge */}
              <line x1={65} y1={105} x2={175} y2={105} stroke={C.text} strokeWidth={sw} strokeLinecap="round" />
              {/* Handles */}
              <line x1={80} y1={70} x2={80} y2={92} stroke={C.primary} strokeWidth={6} strokeLinecap="round" />
              <line x1={80} y1={120} x2={80} y2={165} stroke={C.primary} strokeWidth={6} strokeLinecap="round" />
              {/* Snowflake cooling badge */}
              <circle cx={135} cy={72} r={16} fill={C.primarySoft} stroke={C.text} strokeWidth={4} />
              <line x1={135} y1={62} x2={135} y2={82} stroke={C.primaryDeep} strokeWidth={3} strokeLinecap="round" />
              <line x1={125} y1={72} x2={145} y2={72} stroke={C.primaryDeep} strokeWidth={3} strokeLinecap="round" />
              {/* Food shelf inside hint */}
              <line x1={85} y1={145} x2={155} y2={145} stroke={C.accentSoft} strokeWidth={4} strokeLinecap="round" />
            </g>
            <Sparkle x={50} y={44} s={0.9} />
          </>
        );
      }

      // 93. Bread / Khubz
      case "bread": {
        const float = Math.sin(t / 7) * 3;
        return (
          <>
            <g transform={`translate(0, ${float})`}>
              {/* Bread loaf */}
              <path
                d="M45 135 C45 90 75 60 120 60 C165 60 195 90 195 135 C195 160 180 180 155 180 L85 180 C60 180 45 160 45 135 Z"
                fill={C.accentSoft}
                {...ink}
              />
              {/* Base crust shadow */}
              <path
                d="M50 155 C70 175 170 175 190 155"
                fill="none"
                stroke={C.accent}
                strokeWidth={5}
                strokeLinecap="round"
              />
              {/* Score cuts on bread */}
              <line x1={85} y1={85} x2={95} y2={125} stroke={C.text} strokeWidth={sw} strokeLinecap="round" />
              <line x1={118} y1={80} x2={124} y2={122} stroke={C.text} strokeWidth={sw} strokeLinecap="round" />
              <line x1={150} y1={85} x2={145} y2={125} stroke={C.text} strokeWidth={sw} strokeLinecap="round" />
              {/* Golden butter/wheat badge */}
              <circle cx={165} cy={75} r={16} fill={C.primary} stroke={C.text} strokeWidth={4} />
            </g>
            <Sparkle x={190} y={55} s={1.1} />
          </>
        );
      }

      // 94. Milk & Eggs
      case "groceries": {
        const tilt = Math.sin(t / 8) * 3;
        return (
          <>
            <g transform={`rotate(${tilt} 120 120)`}>
              {/* Milk bottle */}
              <rect x={60} y={85} width={65} height={115} rx={14} fill={C.white} {...ink} />
              <path d="M72 85 L78 60 L108 60 L114 85" fill={C.white} {...ink} />
              <rect x={76} y={48} width={34} height={14} rx={5} fill={C.primary} stroke={C.text} strokeWidth={4} />
              {/* Milk label */}
              <rect x={68} y={115} width={49} height={40} rx={6} fill={C.primarySoft} stroke={C.text} strokeWidth={4} />
              <line x1={78} y1={135} x2={107} y2={135} stroke={C.primaryDeep} strokeWidth={4} strokeLinecap="round" />

              {/* Egg beside milk */}
              <ellipse cx={155} cy={160} rx={28} ry={36} fill={C.accentSoft} {...ink} />
              <circle cx={155} cy={165} r={12} fill={C.accent} opacity={0.5} />
            </g>
            <Sparkle x={185} y={80} s={1.0} />
          </>
        );
      }

      // 95. Cold Tea
      case "coldTea": {
        const iceBob = Math.sin(t / 6) * 3;
        return (
          <>
            {/* Saucer */}
            <path d="M40 185 C40 185 80 205 120 205 C160 205 200 185 200 185" fill={C.white} {...ink} strokeWidth={sw} />
            {/* Teacup body */}
            <path
              d="M60 85 L68 150 C70 170 85 180 120 180 C155 180 170 170 172 150 L180 85 Z"
              fill={C.accentSoft}
              {...ink}
            />
            {/* Tea Handle */}
            <path
              d="M174 100 C195 100 205 115 205 130 C205 145 190 155 170 155"
              fill="none"
              {...ink}
              strokeWidth={sw}
            />
            {/* Ice cubes floating inside */}
            <g transform={`translate(0, ${iceBob})`}>
              <rect x={90} y={75} width={24} height={24} rx={6} fill={C.white} stroke={C.text} strokeWidth={4} />
              <rect x={122} y={70} width={22} height={22} rx={6} fill={C.primarySoft} stroke={C.text} strokeWidth={4} />
            </g>
            {/* Cold snowflakes / frost sparks */}
            <Sparkle x={75} y={50} s={0.8} />
            <Sparkle x={145} y={45} s={1.1} />
          </>
        );
      }

      // 96. Salt shaker
      case "salt": {
        const shake = Math.sin(t / 4) * 4;
        return (
          <>
            <g transform={`translate(${shake}, 0)`}>
              {/* Shaker body */}
              <path
                d="M75 95 L85 190 C86 200 95 208 105 208 L135 208 C145 208 154 200 155 190 L165 95 Z"
                fill={C.white}
                {...ink}
              />
              {/* Metal Cap */}
              <path d="M85 95 L92 65 C93 58 100 52 108 52 L132 52 C140 52 147 58 148 65 L155 95 Z" fill={C.primarySoft} {...ink} />
              {/* Cap holes */}
              <circle cx={108} cy={72} r={3} fill={C.text} />
              <circle cx={120} cy={66} r={3} fill={C.text} />
              <circle cx={132} cy={72} r={3} fill={C.text} />
              {/* "S" or salt crystal icon */}
              <circle cx={120} cy={140} r={18} fill={C.accentSoft} stroke={C.text} strokeWidth={4} />
              <line x1={112} y1={140} x2={128} y2={140} stroke={C.accent} strokeWidth={4} strokeLinecap="round" />
            </g>
            {/* Falling salt crystals */}
            <circle cx={95} cy={225} r={3} fill={C.text} />
            <circle cx={120} cy={230} r={3.5} fill={C.text} />
            <circle cx={142} cy={224} r={3} fill={C.text} />
            <Sparkle x={185} y={75} s={1.0} />
          </>
        );
      }

      // 97. Dinner plate & cutlery
      case "dinner": {
        const pulse = 1 + 0.04 * Math.sin(t / 7);
        return (
          <>
            <g transform={`scale(${pulse}) translate(${120 * (1 - pulse)}, ${120 * (1 - pulse)})`}>
              {/* Plate outer ring */}
              <circle cx={120} cy={120} r={75} fill={C.white} {...ink} />
              {/* Plate inner rim */}
              <circle cx={120} cy={120} r={52} fill={C.primarySoft} stroke={C.text} strokeWidth={4} />
              <circle cx={120} cy={120} r={30} fill={C.white} stroke={C.text} strokeWidth={3} />

              {/* Fork on left */}
              <line x1={25} y1={75} x2={25} y2={165} stroke={C.text} strokeWidth={sw} strokeLinecap="round" />
              <path d="M16 75 L16 100 C16 108 25 114 25 114 C25 114 34 108 34 100 L34 75" fill="none" stroke={C.text} strokeWidth={5} strokeLinecap="round" />

              {/* Spoon/knife on right */}
              <line x1={215} y1={75} x2={215} y2={165} stroke={C.text} strokeWidth={sw} strokeLinecap="round" />
              <path d="M215 72 C204 72 202 92 208 112 C212 118 215 118 215 118" fill="none" stroke={C.text} strokeWidth={5} strokeLinecap="round" />
            </g>
            <Sparkle x={175} y={55} s={1.1} />
          </>
        );
      }

      // 98. Light food / salad leaf / snack
      case "lightFood": {
        const float = Math.sin(t / 6) * 5;
        return (
          <>
            <g transform={`translate(0, ${float})`}>
              {/* Fresh leaf shape */}
              <path
                d="M60 150 C50 90 90 50 170 50 C170 130 130 170 70 170 Z"
                fill={C.primarySoft}
                {...ink}
              />
              {/* Leaf spine */}
              <path d="M68 158 C100 130 135 95 165 55" fill="none" stroke={C.primaryDeep} strokeWidth={5} strokeLinecap="round" />
              {/* Leaf veins */}
              <path d="M105 125 C125 125 135 135 135 135" fill="none" stroke={C.primaryDeep} strokeWidth={4} strokeLinecap="round" />
              <path d="M125 105 C145 105 155 115 155 115" fill="none" stroke={C.primaryDeep} strokeWidth={4} strokeLinecap="round" />
              {/* Warm snack feather spark */}
              <circle cx={145} cy={165} r={18} fill={C.accent} stroke={C.text} strokeWidth={4} />
            </g>
            <Sparkle x={60} y={60} s={1.2} />
          </>
        );
      }

      // 99. Wash hands / Hygiene
      case "washHands": {
        const drop = (t * 2) % 30;
        return (
          <>
            {/* Water Faucet hint */}
            <path d="M100 40 L120 40 C128 40 134 46 134 54 L134 70" fill="none" stroke={C.text} strokeWidth={sw} strokeLinecap="round" />
            {/* Water Drops */}
            <circle cx={134} cy={85 + drop} r={6} fill={C.primary} stroke={C.text} strokeWidth={3} />
            {/* Clean Hands meeting */}
            <path
              d="M55 165 C65 140 90 130 115 140 L135 148 C145 152 155 150 165 142 L185 165 C170 185 140 195 110 190 Z"
              fill={C.white}
              {...ink}
            />
            {/* Soap bubbles */}
            <circle cx={90} cy={125} r={14} fill={C.primarySoft} stroke={C.text} strokeWidth={4} />
            <circle cx={155} cy={120} r={10} fill={C.accentSoft} stroke={C.text} strokeWidth={3} />
            <circle cx={170} cy={140} r={8} fill={C.primarySoft} stroke={C.text} strokeWidth={3} />
            <Sparkle x={180} y={70} s={1.1} />
          </>
        );
      }

      // 100. Bon Appetit / Satisfaction Cloche
      case "bonAppetit": {
        const rise = Math.sin(t / 7) * 4;
        return (
          <>
            <g transform={`translate(0, ${rise})`}>
              {/* Platter base */}
              <line x1={45} y1={175} x2={195} y2={175} stroke={C.text} strokeWidth={sw} strokeLinecap="round" />
              {/* Cloche Dome */}
              <path
                d="M58 175 C58 110 85 85 120 85 C155 85 182 110 182 175 Z"
                fill={C.white}
                {...ink}
              />
              {/* Cloche Handle Knob */}
              <circle cx={120} cy={72} r={13} fill={C.accent} stroke={C.text} strokeWidth={4} />
              {/* Heart/Aroma swirl rising */}
              <path
                d="M108 52 C108 40 120 35 120 25"
                fill="none"
                stroke={C.primary}
                strokeWidth={5}
                strokeLinecap="round"
              />
              <path
                d="M132 50 C132 42 125 36 128 28"
                fill="none"
                stroke={C.primary}
                strokeWidth={4}
                strokeLinecap="round"
              />
              {/* 100 Landmark Star */}
              <circle cx={120} cy={135} r={22} fill={C.primarySoft} stroke={C.text} strokeWidth={4} />
              <path
                d="M120 122 L124 131 L133 132 L127 138 L129 147 L120 142 L111 147 L113 138 L107 132 L116 131 Z"
                fill={C.accent}
                stroke={C.text}
                strokeWidth={2}
              />
            </g>
            <Sparkle x={190} y={65} s={1.2} />
          </>
        );
      }
    }
  })();

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${interpolate(pop, [0, 1], [0.6, 1])})`,
        opacity: interpolate(pop, [0, 0.4], [0, 1]),
      }}
    >
      <svg viewBox="0 0 240 240" width={size} height={size} fill="none">
        {body}
      </svg>
    </div>
  );
};

