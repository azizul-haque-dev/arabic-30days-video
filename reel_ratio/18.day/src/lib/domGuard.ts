// Browser-only: real bounding-box validation of what is actually on screen (used by scripts/validate-layout.ts --dom).
type R = { l: number; t: number; r: number; b: number; label: string };

const effectiveOpacity = (el: Element | null): number => {
  let o = 1;
  for (let e = el; e; e = e.parentElement) {
    const cs = getComputedStyle(e);
    if (cs.display === "none" || cs.visibility === "hidden") return 0;
    o *= Number(cs.opacity);
  }
  return o;
};

const inSvg = (el: Element | null) => !!el?.closest("svg");

export const runDomGuard = (root: Element, o: { W: number; H: number; margin: number }): string[] => {
  const issues: string[] = [];
  const texts: R[] = [];
  const arts: R[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const content = (n.textContent ?? "").trim();
    const parent = n.parentElement;
    if (!content || !parent || inSvg(parent) || effectiveOpacity(parent) < 0.05) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    const rr = range.getBoundingClientRect();
    if (rr.width < 1 || rr.height < 1) continue;
    // use the fixed-height line box (not the taller glyph box) for the vertical extent
    let blk: Element | null = parent;
    while (blk && getComputedStyle(blk).display === "inline") blk = blk.parentElement;
    const br = blk ? blk.getBoundingClientRect() : rr;
    const useBlk = blk && br.height <= rr.height * 1.45 && br.height >= rr.height * 0.6;
    texts.push({ l: rr.left, r: rr.right, t: useBlk ? br.top : rr.top, b: useBlk ? br.bottom : rr.bottom, label: `text "${content.slice(0, 28)}"` });
  }
  root.querySelectorAll("svg").forEach((s, i) => {
    if (s.parentElement?.closest("svg") || effectiveOpacity(s) < 0.05) return;
    const r = s.getBoundingClientRect();
    if (r.width < 1) return;
    arts.push({ l: r.left, r: r.right, t: r.top, b: r.bottom, label: `art#${i}(${Math.round(r.width)}x${Math.round(r.height)}@${Math.round(r.left)},${Math.round(r.top)})` });
  });

  const tol = 2;
  for (const t of texts) {
    if (t.l < o.margin - tol || t.r > o.W - o.margin + tol) issues.push(`MARGIN ${t.label} spans x ${Math.round(t.l)}–${Math.round(t.r)} (min margin ${o.margin}px)`);
    if (t.t < -tol || t.b > o.H + tol) issues.push(`SCREEN-EDGE ${t.label} y ${Math.round(t.t)}–${Math.round(t.b)}`);
  }
  for (const a of arts) {
    if (a.l < -tol || a.r > o.W + tol || a.t < -tol || a.b > o.H + tol) issues.push(`SCREEN-EDGE ${a.label}`);
  }
  const hit = (x: R, y: R) => Math.min(x.r, y.r) - Math.max(x.l, y.l) > tol && Math.min(x.b, y.b) - Math.max(x.t, y.t) > tol;
  const all = [...texts, ...arts];
  for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) if (hit(all[i], all[j])) issues.push(`OVERLAP ${all[i].label}  ×  ${all[j].label}`);
  return issues;
};
