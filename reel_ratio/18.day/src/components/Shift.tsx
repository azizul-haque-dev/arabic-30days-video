import React from "react";

/** Moves a block of scene content vertically (keeps compositions optically centred). */
export const Shift: React.FC<{ dy: number; children: React.ReactNode }> = ({ dy, children }) => (
  <div style={{ position: "absolute", inset: 0, transform: `translateY(${dy}px)` }}>{children}</div>
);
