/** Proves the validator really fails on overlap/outside/too-close cases (and passes clean ones). */
import { CANVAS, MIN_GAP, SAFE } from "../src/config/layout";
import { LayoutItem, validateFrame } from "../src/utils/layoutValidation";

const item = (id: string, x: number, y: number, w: number, h: number, kind: LayoutItem["kind"] = "text"): LayoutItem => ({
  id, kind, box: { x, y, w, h }, slot: { x: 70, y: 100, w: 940, h: 300 }, slotId: "s", opacity: 1,
});
const run = (items: LayoutItem[]) => validateFrame(items, CANVAS, SAFE, MIN_GAP).map((i) => i.code);
let bad = 0;
const expect = (name: string, got: string[], want: string[]) => {
  const okk = want.length === 0 ? got.length === 0 : want.every((w) => got.includes(w));
  console.log(`${okk ? "✓" : "✗"} ${name}: ${got.join(",") || "no issues"}`);
  if (!okk) bad++;
};
expect("clean layout", run([item("a", 100, 120, 400, 80), item("b", 100, 240, 400, 80)]), []);
expect("text over text", run([item("a", 100, 120, 400, 80), item("b", 300, 160, 400, 80)]), ["OVERLAP"]);
expect("text over illustration", run([item("a", 100, 120, 400, 80), item("art", 200, 150, 300, 200, "illustration")]), ["OVERLAP"]);
expect("too close (8px)", run([item("a", 100, 120, 400, 80), item("b", 100, 208, 400, 80)]), ["TOO_CLOSE"]);
expect("leaves slot", run([item("a", 100, 120, 400, 400)]), ["OUTSIDE_SLOT"]);
expect("outside safe area", run([{ ...item("a", 20, 120, 400, 80), slot: undefined }]), ["OUTSIDE_SAFE_AREA"]);
expect("invisible items ignored", run([item("a", 100, 120, 400, 80), { ...item("b", 150, 130, 400, 80), opacity: 0.01 }]), []);
if (bad > 0) process.exit(1);
console.log("Validator self-test passed.");
