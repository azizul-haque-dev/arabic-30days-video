import React from "react";
import { theme } from "../theme";
import { useEnter } from "../anim";
import { useFittedText } from "./useFittedText";

type Props = { text: string; enterFrame: number; maxWidth?: number };

/** Arabic script — secondary: RTL, clearly smaller than the Bengali pronunciation. */
export const ArabicText: React.FC<Props> = ({ text, enterFrame, maxWidth = 800 }) => {
  const e = useEnter(enterFrame, { y: 28, from: 0.94 });
  const fitted = useFittedText(text, {
    fontFamily: "Noto Sans Arabic",
    fontWeight: 700,
    maxWidth,
    maxHeight: 90,
    maxSize: 60,
    minSize: 44,
    maxLines: 1,
    lineHeight: 1.5,
  });
  return (
    <div style={{ height: 120, paddingTop: 8, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
      <div
        dir="rtl"
        lang="ar"
        style={{
          opacity: e.opacity,
          transform: e.transform,
          background: theme.colors.soft,
          color: theme.colors.dark,
          borderRadius: theme.radius.md,
          padding: "10px 40px",
          fontFamily: theme.fonts.ar,
          fontWeight: 700,
          fontSize: fitted.fontSize,
          lineHeight: 1.5,
          whiteSpace: "nowrap",
          unicodeBidi: "isolate",
          textAlign: "center",
        }}
      >
        {text}
      </div>
    </div>
  );
};
