import { inside, intersects, type Rect, type SentenceLayout } from "./engine";

/**
 * Worst-case motion used by the sentence scene (must match SentenceScene.tsx):
 *   Bengali unit : y -14 → 0, scale .92 → 1, emphasis pulse up to 1.035 (+ spring overshoot)
 *   Arabic unit  : y +12 → 0, scale .94 → 1
 *   meaning chip : y +10 → 0, scale .90 → 1   meaning text: y +16 → 0, scale .95 → 1
 */
const OVERSHOOT = 1.03;
type Env = { name: string; dyMin: number; dyMax: number; scaleMax: number; rect: Rect };

const envelope = (e: Env): Rect => {
  const w = e.rect.w * e.scaleMax;
  const h = e.rect.h * e.scaleMax;
  const cx = e.rect.x + e.rect.w / 2;
  const cy = e.rect.y + e.rect.h / 2;
  const top = cy - h / 2 + e.dyMin;
  const bottom = cy + h / 2 + e.dyMax;
  return { x: cx - w / 2, y: top, w, h: bottom - top };
};

export function checkMotionEnvelopes(l: SentenceLayout, label: string): string[] {
  const problems: string[] = [];
  const envs: Env[] = [
    ...l.pron.flatMap((p, i): Env[] => [
      { name: `unit${i}.bn`, dyMin: -14, dyMax: 0, scaleMax: 1.035 * OVERSHOOT, rect: p.bn },
      { name: `unit${i}.ar`, dyMin: 0, dyMax: 12, scaleMax: 1 * OVERSHOOT, rect: p.ar },
    ]),
    { name: "chip", dyMin: 0, dyMax: 10, scaleMax: 1 * OVERSHOOT, rect: l.chip },
    { name: "meaning", dyMin: 0, dyMax: 16, scaleMax: 1 * OVERSHOOT, rect: l.meaningText },
  ];
  const boxes = envs.map((e) => ({ name: e.name, r: envelope(e) }));
  for (const b of boxes) if (!inside(b.r, l.card)) problems.push(`${label}: motion of ${b.name} leaves the card`);
  for (let i = 0; i < boxes.length; i++)
    for (let j = i + 1; j < boxes.length; j++)
      if (intersects(boxes[i].r, boxes[j].r)) problems.push(`${label}: motion envelopes of ${boxes[i].name} and ${boxes[j].name} collide`);
  return problems;
}
