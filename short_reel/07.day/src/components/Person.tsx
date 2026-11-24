import React, {createContext, useContext} from "react";
import {spring, useCurrentFrame, useVideoConfig} from "remotion";
import {theme} from "../theme";

/** Where pop-in animations start (0 = from nothing). The thumbnail sets this > 0 so frame 0 is already complete. */
export const PopFrom = createContext(0);

export const usePop = (delay: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const from = useContext(PopFrom);
  const p = spring({frame: frame - delay, fps, config: theme.spring.pop});
  return {
    frame,
    fps,
    scale: from + (1 - from) * p,
    opacity: from > 0 ? 1 : Math.min(1, p * 4),
  };
};

export type Kind = "man" | "woman" | "boy" | "girl";
export type PersonProps = {
  kind: Kind;
  /** top-left of the 100×120 figure box, in parent SVG units */
  x: number;
  y: number;
  s?: number;
  delay?: number;
  skin?: string;
  shirt?: string;
  hair?: string;
  scarf?: string;
  beard?: boolean;
  hijab?: boolean;
  cap?: boolean;
  phase?: number;
};

const INK = "#1b1b1b";

/** Flat-vector bust character. Same drawing language for every icon in the video. */
export const Person: React.FC<PersonProps> = ({
  kind,
  x,
  y,
  s = 1,
  delay = 0,
  skin = theme.colors.skin[0],
  shirt = theme.colors.shirts[0],
  hair = theme.colors.hair[0],
  scarf = theme.colors.scarf[0],
  beard = false,
  hijab = false,
  cap = false,
  phase = 0,
}) => {
  const {frame, fps, scale, opacity} = usePop(delay);
  const kid = kind === "boy" || kind === "girl";
  const bob = Math.sin((frame / fps) * 2.4 + phase * 1.7) * 3.2;
  const breathe = 1 + Math.sin((frame / fps) * 1.9 + phase) * 0.012;
  const cy = kid ? 50 : 45;
  const rx = kid ? 22 : 20;
  const ry = kid ? 23 : 22;

  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      <g transform={`translate(50 120) translate(0 ${bob}) scale(${scale * breathe}) translate(-50 -120)`}>
        {/* back hair */}
        {kind === "woman" && !hijab && (
          <path d="M26 46 C20 12 80 12 74 46 L81 102 C81 111 19 111 19 102 Z" fill={hair} />
        )}
        {kind === "girl" && !hijab && (
          <>
            <circle cx="19" cy="62" r="11" fill={hair} />
            <circle cx="81" cy="62" r="11" fill={hair} />
          </>
        )}
        {/* torso */}
        <path
          d={kid ? "M14 124 C14 98 30 86 50 86 C70 86 86 98 86 124 Z" : "M6 124 C6 92 27 79 50 79 C73 79 94 92 94 124 Z"}
          fill={shirt}
        />
        {/* collar */}
        <path d={kid ? "M40 87 L50 100 L60 87" : "M39 80 L50 96 L61 80"} fill="none" stroke="rgba(0,0,0,0.16)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {/* neck */}
        <rect x="43" y={kid ? 66 : 62} width="14" height="22" rx="6" fill={skin} />
        <rect x="43" y={kid ? 66 : 62} width="14" height="9" rx="4" fill="rgba(0,0,0,0.12)" />
        {/* head */}
        <ellipse cx="50" cy={cy} rx={rx} ry={ry} fill={skin} />
        <circle cx={50 - rx} cy={cy + 2} r="4.5" fill={skin} />
        <circle cx={50 + rx} cy={cy + 2} r="4.5" fill={skin} />
        {/* face */}
        <circle cx="42.5" cy={cy + 2} r="2.8" fill={INK} />
        <circle cx="57.5" cy={cy + 2} r="2.8" fill={INK} />
        <circle cx="36.5" cy={cy + 10} r="4.2" fill="rgba(255,110,100,0.28)" />
        <circle cx="63.5" cy={cy + 10} r="4.2" fill="rgba(255,110,100,0.28)" />
        {!beard && <path d={`M43.5 ${cy + 11} Q50 ${cy + 17} 56.5 ${cy + 11}`} fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />}
        {/* front hair */}
        {(kind === "man" || kind === "boy") && !cap && (
          <path d={`M${50 - rx - 1} ${cy + 1} C${50 - rx - 5} ${cy - 28} ${50 + rx + 5} ${cy - 28} ${50 + rx + 1} ${cy + 1} C${50 + rx - 2} ${cy - 9} 62 ${cy - 14} 50 ${cy - 14} C38 ${cy - 14} ${50 - rx + 2} ${cy - 9} ${50 - rx - 1} ${cy + 1}Z`} fill={hair} />
        )}
        {kind === "woman" && !hijab && (
          <path d={`M30 ${cy - 4} C31 ${cy - 24} 69 ${cy - 24} 70 ${cy - 4} C62 ${cy - 13} 40 ${cy - 13} 30 ${cy - 4}Z`} fill={hair} />
        )}
        {kind === "girl" && !hijab && (
          <>
            <path d={`M28 ${cy - 2} C27 ${cy - 28} 73 ${cy - 28} 72 ${cy - 2} C64 ${cy - 14} 36 ${cy - 14} 28 ${cy - 2}Z`} fill={hair} />
            <g transform={`translate(70 ${cy - 22})`}>
              <path d="M0 0 L-11 -8 L-11 8Z M0 0 L11 -8 L11 8Z" fill={theme.colors.coral} />
              <circle r="3.6" fill={theme.colors.coral} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
            </g>
          </>
        )}
        {/* taqiyah (prayer cap) */}
        {cap && (
          <g>
            <path d={`M${50 - rx} ${cy - 8} C${50 - rx + 1} ${cy - 34} ${50 + rx - 1} ${cy - 34} ${50 + rx} ${cy - 8} C60 ${cy - 14} 40 ${cy - 14} ${50 - rx} ${cy - 8}Z`} fill="#F4F1E6" />
            <path d={`M${50 - rx + 2} ${cy - 13} C42 ${cy - 17} 58 ${cy - 17} ${50 + rx - 2} ${cy - 13}`} fill="none" stroke="#C9C2A8" strokeWidth="2" />
          </g>
        )}
        {/* beard */}
        {beard && (
          <>
            <path d={`M${50 - rx} ${cy + 4} C${50 - rx} ${cy + 33} ${50 + rx} ${cy + 33} ${50 + rx} ${cy + 4} C${50 + rx - 3} ${cy + 15} 60 ${cy + 13} 50 ${cy + 13} C40 ${cy + 13} ${50 - rx + 3} ${cy + 15} ${50 - rx} ${cy + 4}Z`} fill={hair} />
            <path d={`M44 ${cy + 19} Q50 ${cy + 24} 56 ${cy + 19}`} fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          </>
        )}
        {/* hijab (ring that frames the face) */}
        {hijab && (
          <path
            fillRule="evenodd"
            fill={scarf}
            d={`M${50 - rx - 3} ${cy + 2} C${50 - rx - 7} ${cy - 36} ${50 + rx + 7} ${cy - 36} ${50 + rx + 3} ${cy + 2} C${50 + rx + 3} ${cy + 22} 92 ${cy + 36} 98 ${cy + 64} L2 ${cy + 64} C8 ${cy + 36} ${50 - rx - 3} ${cy + 22} ${50 - rx - 3} ${cy + 2}Z M${50 - rx + 3} ${cy + 3} a${rx - 3} ${ry - 2} 0 1 0 ${(rx - 3) * 2} 0 a${rx - 3} ${ry - 2} 0 1 0 ${-(rx - 3) * 2} 0Z`}
          />
        )}
      </g>
    </g>
  );
};
