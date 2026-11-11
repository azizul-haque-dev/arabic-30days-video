/**
 * Browser harness used only by scripts/validate-layout.ts.
 * Mounts the real composition inside @remotion/player so every frame can be seeked and every
 * [data-layout] element measured with getBoundingClientRect().
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { Player, PlayerRef } from "@remotion/player";
import { ArabicMasterDay } from "../compositions/ArabicMasterDay";
import { episodeConfig as cfg } from "../config/episodeConfig";
import { buildTimeline } from "../config/timeline";
import { parseSrt } from "../utils/srt";

type Box = { id: string; kind: string; zone?: string; x: number; y: number; w: number; h: number; overflowX: boolean; overflowY: boolean };

const effectiveOpacity = (el: Element) => {
  let o = 1;
  let n: Element | null = el;
  while (n && n instanceof Element) {
    const cs = getComputedStyle(n);
    o *= Number(cs.opacity);
    if (cs.visibility === "hidden" || cs.display === "none") return 0;
    n = n.parentElement ?? (n.parentNode as Element | null);
    if (n && (n as unknown) === document) break;
  }
  return o;
};

const inter = (a: DOMRect, b: DOMRect) => {
  const x1 = Math.max(a.left, b.left), y1 = Math.max(a.top, b.top), x2 = Math.min(a.right, b.right), y2 = Math.min(a.bottom, b.bottom);
  return x2 > x1 && y2 > y1 ? new DOMRect(x1, y1, x2 - x1, y2 - y1) : null;
};

const measure = (root: HTMLElement): { boxes: Box[]; zones: Record<string, Box> } => {
  const base = root.getBoundingClientRect();
  const rel = (r: DOMRect): Box => ({ id: "", kind: "", x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height, overflowX: false, overflowY: false });
  const zones: Record<string, Box> = {};
  root.querySelectorAll("[data-zone-box]").forEach((z) => {
    zones[(z as HTMLElement).dataset.zoneBox!] = rel(z.getBoundingClientRect());
  });
  const boxes: Box[] = [];
  root.querySelectorAll("[data-layout]").forEach((el) => {
    const h = el as HTMLElement;
    if (effectiveOpacity(el) < 0.08) return;
    let r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const kind = h.dataset.layout!;
    if (kind === "art") {
      const stage = el.closest("[data-stage]");
      if (stage) {
        const clipped = inter(r, stage.getBoundingClientRect());
        if (!clipped) return;
        r = clipped;
      }
    }
    const b = rel(r);
    b.id = h.dataset.id ?? "?";
    b.kind = kind;
    b.zone = h.dataset.zone;
    if (kind !== "art") {
      const fs = parseFloat(getComputedStyle(h).fontSize) || 16;
      b.overflowX = h.scrollWidth > h.clientWidth + 1 && h.clientWidth > 0;
      // vertical: allow glyph ascent/descent beyond tight line-heights (20% of font size)
      b.overflowY = h.scrollHeight > h.clientHeight + fs * 0.2 && h.clientHeight > 0;
    }
    boxes.push(b);
  });
  return { boxes, zones };
};

const App: React.FC<{ cues: ReturnType<typeof parseSrt>; frames: number; onReady: (api: unknown) => void }> = ({ cues, frames, onReady }) => {
  const ref = React.useRef<PlayerRef>(null);
  const box = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    onReady({
      seek: async (f: number) => {
        ref.current!.seekTo(f);
        await new Promise((r) => setTimeout(r, 35));
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        return measure(box.current!);
      },
    });
  }, [onReady]);
  return (
    <div ref={box} style={{ width: cfg.video.width, height: cfg.video.height, position: "relative" }}>
      <Player
        ref={ref}
        component={ArabicMasterDay}
        inputProps={{ cues }}
        durationInFrames={frames}
        compositionWidth={cfg.video.width}
        compositionHeight={cfg.video.height}
        fps={cfg.video.fps}
        style={{ width: cfg.video.width, height: cfg.video.height }}
        controls={false}
        acknowledgeRemotionLicense
        clickToPlay={false}
      />
    </div>
  );
};

(async () => {
  const res = await fetch("/public/" + cfg.srtFile);
  const cues = parseSrt(await res.text());
  const tl = buildTimeline(cues, cfg.video.fps);
  const w = window as unknown as Record<string, unknown>;
  w.__timeline = tl;
  // preload fonts through the same code path the composition uses
  const { loadFonts } = await import("../utils/fonts");
  await loadFonts().catch(() => undefined);
  createRoot(document.getElementById("root")!).render(
    <App cues={cues} frames={tl.totalFrames} onReady={(api) => { w.__api = api; }} />,
  );
})();
