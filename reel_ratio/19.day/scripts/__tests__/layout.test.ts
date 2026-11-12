import assert from "node:assert/strict";
import { test } from "node:test";
import { SAFE, VIDEO } from "../../src/config";
import { L } from "../../src/design/layout";

test("vertical bands never overlap and stay inside the safe area", () => {
  const bands = [
    { name: "number", top: L.numberRow.top, bottom: L.numberRow.top + L.numberRow.height },
    { name: "illustration", top: L.illustration.top, bottom: L.illustration.top + L.illustration.height },
    { name: "card", top: L.card.top, bottom: L.card.top + L.card.height },
  ];
  for (let i = 1; i < bands.length; i++) {
    assert.ok(bands[i]!.top >= bands[i - 1]!.bottom, `${bands[i]!.name} overlaps ${bands[i - 1]!.name}`);
  }
  assert.ok(bands[0]!.top >= SAFE.top, "number row above safe area");
  assert.ok(bands[2]!.bottom <= SAFE.bottom, "card below safe area");
  assert.ok(bands[2]!.bottom <= VIDEO.height);
});

test("text slots fit inside the card", () => {
  const inner = L.card.height - L.cardPadY * 2;
  const used = L.slots.pron + L.slots.arabic + L.slots.meaning + L.slots.gap * 2;
  assert.ok(used <= inner, `slots need ${used}px but card inner height is ${inner}px`);
});

test("illustration and card share the same horizontal margins", () => {
  assert.equal(L.side * 2 + L.contentWidth, VIDEO.width);
});
