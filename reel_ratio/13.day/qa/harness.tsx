/**
 * Browser QA harness (NOT part of the Remotion project, never renders video).
 * Mounts the composition in @remotion/player, seeks to a frame and measures the
 * real DOM boxes of every visible layout item (transforms included).
 */
import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Player, PlayerRef } from "@remotion/player";
import srtRaw from "../public/subtitles.srt";
import { ArabicMasterComposition } from "../src/compositions/ArabicMasterComposition";
import { episodeConfig as E } from "../src/config/episode";
import { parseSrtStrict } from "../src/parsers/srt";
import { buildTimeline } from "../src/timeline/build";

type Box = { x: number; y: number; w: number; h: number };
type Item = { id: string; kind: string; slotId: string; box: Box; slot: Box; opacity: number; clipped: boolean; sceneHint: string };

declare global {
  interface Window {
    __qa?: { total: number; scenes: Array<{ id: string; from: number; durationInFrames: number }>; measure: (frame: number) => Promise<Item[]> };
  }
}

const timeline = buildTimeline(parseSrtStrict(srtRaw as unknown as string));

const effOpacity = (el: Element | null): number => {
  let o = 1;
  for (let n: Element | null = el; n; n = n.parentElement) o *= Number(getComputedStyle(n).opacity);
  return o;
};
const rectOf = (r: DOMRect): Box => ({ x: r.left, y: r.top, w: r.width, h: r.height });
const frames = (n: number) => new Promise<void>((res) => {
  const step = (k: number) => (k === 0 ? res() : requestAnimationFrame(() => step(k - 1)));
  step(n);
});

const App: React.FC = () => {
  const ref = useRef<PlayerRef>(null);
  useEffect(() => {
    window.__qa = {
      total: timeline.durationInFrames,
      scenes: timeline.scenes.map((s) => ({ id: s.id, from: s.from, durationInFrames: s.durationInFrames })),
      measure: async (frame: number) => {
        ref.current?.seekTo(frame);
        await frames(3);
        const items: Item[] = [];
        document.querySelectorAll<HTMLElement>("[data-lv]").forEach((el) => {
          const slotEl = el.closest<HTMLElement>("[data-slot]");
          if (!slotEl) return;
          const parts = Array.from(el.querySelectorAll<HTMLElement>("[data-lv-part]"));
          let box = rectOf(el.getBoundingClientRect());
          let opacity = effOpacity(el);
          if (parts.length > 0) {
            const vis = parts.map((p) => ({ r: p.getBoundingClientRect(), o: effOpacity(p) })).filter((p) => p.o >= 0.04);
            if (vis.length === 0) { opacity = 0; } else {
              const x1 = Math.min(...vis.map((p) => p.r.left)), y1 = Math.min(...vis.map((p) => p.r.top));
              const x2 = Math.max(...vis.map((p) => p.r.right)), y2 = Math.max(...vis.map((p) => p.r.bottom));
              box = { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
              opacity = Math.max(...vis.map((p) => p.o));
            }
          }
          // Glyph ink (Bengali matras, fallback fonts) can exceed the line box by a few px:
          // text boxes are inflated by INK px top/bottom, and only HORIZONTAL cropping is flagged.
          const INK = 6;
          if (el.dataset.lvKind === "text") box = { x: box.x, y: box.y - INK, w: box.w, h: box.h + 2 * INK };
          const clipped = el.scrollWidth > el.clientWidth + 1;
          items.push({
            id: el.dataset.lv ?? "?", kind: el.dataset.lvKind ?? "?", slotId: el.dataset.lvSlot ?? "?",
            box, slot: rectOf(slotEl.getBoundingClientRect()), opacity, clipped, sceneHint: "",
          });
        });
        return items;
      },
    };
  }, []);
  return (
    <div style={{ width: E.video.width, height: E.video.height, position: "relative" }}>
      <Player
        ref={ref}
        component={ArabicMasterComposition}
        inputProps={{ timeline }}
        durationInFrames={timeline.durationInFrames}
        fps={timeline.fps}
        compositionWidth={E.video.width}
        compositionHeight={E.video.height}
        style={{ width: E.video.width, height: E.video.height }}
        controls={false}
        acknowledgeRemotionLicense
      />
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
