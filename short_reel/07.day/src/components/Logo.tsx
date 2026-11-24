import React from "react";
import {theme} from "../theme";

/** Arabic Master brand mark: 8-point geometric star + the letter ع */
export const LogoMark: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{display: "block"}}>
    <g fill={theme.colors.mintSoft}>
      <rect x="14" y="14" width="72" height="72" rx="10" />
      <rect x="14" y="14" width="72" height="72" rx="10" transform="rotate(45 50 50)" />
    </g>
    <circle cx="50" cy="50" r="27" fill={theme.colors.greenDark} />
    <text
      x="50"
      y="66"
      textAnchor="middle"
      fontSize="46"
      fontWeight="800"
      fill={theme.colors.white}
      style={{fontFamily: theme.fonts.arabic}}
    >
      ع
    </text>
  </svg>
);
