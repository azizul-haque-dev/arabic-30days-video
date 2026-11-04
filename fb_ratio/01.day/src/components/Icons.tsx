import React from "react";

export type IconName = "mic" | "micOff" | "headphones" | "bulb" | "check" | "play" | "plus" | "send" | "volume" | "arrow" | "chat";

export const Icon: React.FC<{ name: IconName; size: number; color: string; stroke?: number; progress?: number }> = ({ name, size, color, stroke = 2.2, progress = 1 }) => {
  const p = { fill: "none", stroke: color, strokeWidth: stroke, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  // progress (0..1) draws the path (used for the check mark)
  const dash = { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - progress };
  const body = (() => {
    switch (name) {
      case "mic": return (<><rect x="9" y="2.5" width="6" height="12" rx="3" {...p} /><path d="M5 11.5a7 7 0 0 0 14 0M12 18.5v3M8.5 21.5h7" {...p} /></>);
      case "micOff": return (<><rect x="9" y="2.5" width="6" height="12" rx="3" {...p} /><path d="M5 11.5a7 7 0 0 0 14 0M12 18.5v3M8.5 21.5h7M3.5 3.5l17 17" {...p} /></>);
      case "headphones": return (<><path d="M4 15.5v-3.5a8 8 0 0 1 16 0v3.5" {...p} /><rect x="3" y="14.5" width="4.2" height="7" rx="2.1" {...p} /><rect x="16.8" y="14.5" width="4.2" height="7" rx="2.1" {...p} /></>);
      case "bulb": return (<><path d="M9.2 18h5.6M10.2 21.2h3.6M12 2.8a6.2 6.2 0 0 0-3.6 11.2c.5.4.8 1 .8 1.6v.8h5.6v-.8c0-.6.3-1.2.8-1.6A6.2 6.2 0 0 0 12 2.8z" {...p} /></>);
      case "check": return <path d="M5 12.8l4.6 4.6L19.2 7.4" {...p} {...dash} />;
      case "play": return <path d="M8 5.2v13.6a1 1 0 0 0 1.5.86l11-6.8a1 1 0 0 0 0-1.72l-11-6.8A1 1 0 0 0 8 5.2z" fill={color} stroke={color} strokeWidth={1.2} strokeLinejoin="round" />;
      case "plus": return <path d="M12 5v14M5 12h14" {...p} />;
      case "send": return <path d="M3.5 11.6l16.4-7.5c.7-.3 1.4.4 1.1 1.1l-7.5 16.4c-.4.8-1.5.7-1.7-.1l-1.6-6.3-6.3-1.6c-.8-.2-.9-1.3-.1-1.7z" fill={color} stroke={color} strokeWidth={1} strokeLinejoin="round" />;
      case "volume": return (<><path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" fill={color} stroke={color} strokeWidth={1.2} strokeLinejoin="round" /><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18.3 6.3a8 8 0 0 1 0 11.4" {...p} /></>);
      case "arrow": return <path d="M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5" {...p} />;
      case "chat": return <path d="M4 4.8h16a1.2 1.2 0 0 1 1.2 1.2v10a1.2 1.2 0 0 1-1.2 1.2h-8l-5 3.8v-3.8H4A1.2 1.2 0 0 1 2.8 16V6A1.2 1.2 0 0 1 4 4.8z" {...p} />;
    }
  })();
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", overflow: "visible" }}>{body}</svg>;
};
