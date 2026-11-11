export type Pt = { x: number; y: number };
export type Seg = [Pt, Pt, Pt, Pt]; // cubic bezier

export const P = (x: number, y: number): Pt => ({ x, y });
const K = 0.5523;

export const line = (a: Pt, b: Pt): Seg => [a, P(a.x + (b.x - a.x) / 3, a.y + (b.y - a.y) / 3), P(a.x + ((b.x - a.x) * 2) / 3, a.y + ((b.y - a.y) * 2) / 3), b];
/** Quarter arc from a to b around centre c (cubic approximation). */
export const arc = (a: Pt, b: Pt, c: Pt): Seg => {
  const va = P(a.x - c.x, a.y - c.y);
  const vb = P(b.x - c.x, b.y - c.y);
  // tangent directions (perpendicular to radius, towards b)
  const ta = P(-va.y, va.x);
  const sign = ta.x * (b.x - a.x) + ta.y * (b.y - a.y) >= 0 ? 1 : -1;
  const tA = P(ta.x * sign, ta.y * sign);
  const tb = P(-vb.y, vb.x);
  const signb = tb.x * (a.x - b.x) + tb.y * (a.y - b.y) >= 0 ? 1 : -1;
  const tB = P(tb.x * signb, tb.y * signb);
  return [a, P(a.x + tA.x * K, a.y + tA.y * K), P(b.x + tB.x * K, b.y + tB.y * K), b];
};
export const curve = (a: Pt, c1: Pt, c2: Pt, b: Pt): Seg => [a, c1, c2, b];

const bez = (s: Seg, t: number): Pt => {
  const u = 1 - t;
  return P(
    u * u * u * s[0].x + 3 * u * u * t * s[1].x + 3 * u * t * t * s[2].x + t * t * t * s[3].x,
    u * u * u * s[0].y + 3 * u * u * t * s[1].y + 3 * u * t * t * s[2].y + t * t * t * s[3].y,
  );
};

export class Route {
  d: string;
  private pts: { x: number; y: number; len: number }[] = [];
  length = 0;
  constructor(public segs: Seg[]) {
    this.d = `M ${segs[0][0].x} ${segs[0][0].y} ` + segs.map((s) => `C ${s[1].x} ${s[1].y} ${s[2].x} ${s[2].y} ${s[3].x} ${s[3].y}`).join(" ");
    let acc = 0;
    let prev = segs[0][0];
    this.pts.push({ ...prev, len: 0 });
    for (const s of segs) {
      for (let i = 1; i <= 40; i++) {
        const p = bez(s, i / 40);
        acc += Math.hypot(p.x - prev.x, p.y - prev.y);
        this.pts.push({ ...p, len: acc });
        prev = p;
      }
    }
    this.length = acc;
  }
  /** Position + heading (degrees, 0 = pointing up / -y) at u in 0..1 (arc-length param). */
  at(u: number): { x: number; y: number; angle: number } {
    const target = Math.min(Math.max(u, 0), 1) * this.length;
    let i = 1;
    while (i < this.pts.length - 1 && this.pts[i].len < target) i++;
    const a = this.pts[i - 1];
    const b = this.pts[i];
    const span = b.len - a.len || 1;
    const f = (target - a.len) / span;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return { x: a.x + dx * f, y: a.y + dy * f, angle: (Math.atan2(dx, -dy) * 180) / Math.PI };
  }
}
