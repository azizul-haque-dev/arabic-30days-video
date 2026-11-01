import React from "react";
import { IconId } from "../content";
import { theme } from "../theme";

export const Icon: React.FC<{ id: IconId; size?: number }> = ({
  id,
  size = 84,
}) => {
  const stroke = theme.colors.primary;
  const accent = theme.colors.accent;
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 64 64",
    fill: "none",
  };

  switch (id) {
    case "question":
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="26" fill={theme.colors.primarySoft} stroke={stroke} strokeWidth="3.5" />
          <path d="M25 24C25 20 28 17 32 17C36 17 39 20 39 24C39 27 36 29 33 31C32 32 32 34 32 36" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
          <circle cx="32" cy="45" r="3" fill={accent} />
        </svg>
      );
    case "repeat":
      return (
        <svg {...common}>
          <rect x="8" y="8" width="48" height="48" rx="16" fill={theme.colors.primarySoft} />
          <path d="M20 26H42L36 20M44 38H22L28 44" stroke={stroke} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "volume":
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="26" fill={theme.colors.primarySoft} />
          <path d="M18 26H26L36 18V46L26 38H18V26Z" fill={stroke} />
          <path d="M43 24C46 27 46 37 43 40" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "pointer":
      return (
        <svg {...common}>
          <rect x="8" y="8" width="48" height="48" rx="16" fill={theme.colors.primarySoft} />
          <circle cx="32" cy="28" r="10" stroke={stroke} strokeWidth="4" />
          <circle cx="32" cy="28" r="4" fill={accent} />
          <path d="M32 38V48" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "shrug":
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="26" fill={theme.colors.primarySoft} />
          <circle cx="32" cy="24" r="7" fill={stroke} />
          <path d="M18 44C22 36 42 36 46 44" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
          <circle cx="46" cy="20" r="4" fill={accent} />
        </svg>
      );
    case "userTag":
      return (
        <svg {...common}>
          <rect x="10" y="12" width="44" height="40" rx="12" fill={theme.colors.primarySoft} stroke={stroke} strokeWidth="3.5" />
          <circle cx="26" cy="30" r="6" fill={stroke} />
          <path d="M18 43C19 38 33 38 34 43" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M38 26H46M38 34H44" stroke={accent} strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
    case "bell":
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="26" fill={theme.colors.primarySoft} />
          <path d="M22 38V29C22 23 26 19 32 19C38 19 42 23 42 29V38L46 42H18L22 38Z" fill={stroke} />
          <circle cx="32" cy="46" r="4" fill={accent} />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M32 10L50 18V31C50 43 42 51 32 55C22 51 14 43 14 31V18L32 10Z" fill={theme.colors.primarySoft} stroke={stroke} strokeWidth="3.5" />
          <path d="M25 32L30 37L40 26" stroke={stroke} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="26" fill={theme.colors.primarySoft} />
          <path d="M32 14L36 26L48 30L36 34L32 46L28 34L16 30L28 26L32 14Z" fill={accent} stroke={stroke} strokeWidth="2.5" />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="26" fill={theme.colors.primarySoft} />
          <path d="M32 46C32 46 18 36 18 26C18 21 22 18 26 18C29 18 31 20 32 22C33 20 35 18 38 18C42 18 46 21 46 26C46 36 32 46 32 46Z" fill={stroke} />
        </svg>
      );
  }
};
