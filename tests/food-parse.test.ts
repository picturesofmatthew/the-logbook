import assert from "node:assert/strict";
import { test } from "node:test";
import {
  atwaterCheck,
  atwaterKcal,
  gramsFor,
  parseFoodLine,
  portionConfidence,
} from "../lib/engine/food-parse";

test("food-parse: splits a line and reads counts vs mass", () => {
  const items = parseFoodLine("2 eggs and a banana");
  assert.equal(items.length, 2);
  assert.deepEqual(
    { qty: items[0].qty, unit: items[0].unit, name: items[0].name },
    { qty: 2, unit: "egg", name: "eggs" },
  );
  assert.deepEqual(
    { qty: items[1].qty, unit: items[1].unit, name: items[1].name },
    { qty: 1, unit: null, name: "banana" },
  );
});

test("food-parse: mass and volume units, stuck-together or spaced", () => {
  const items = parseFoodLine("200g chicken, 1 cup rice, 1.5 tbsp olive oil");
  assert.deepEqual(
    items.map((i) => [i.qty, i.unit, i.name]),
    [
      [200, "g", "chicken"],
      [1, "cup", "rice"],
      [1.5, "tbsp", "olive oil"],
    ],
  );
});

test("food-parse: fractions, 'half an', and multi-word foods", () => {
  const items = parseFoodLine("half an avocado + greek yogurt");
  assert.deepEqual(
    items.map((i) => [i.qty, i.unit, i.name]),
    [
      [0.5, null, "avocado"],
      [1, null, "greek yogurt"],
    ],
  );
});

test("food-parse: gramsFor resolves mass and household portions", () => {
  assert.equal(gramsFor(200, "g"), 200);
  assert.equal(gramsFor(2, "egg"), 100);
  assert.equal(gramsFor(1, "cup"), 240);
  assert.ok(Math.abs(gramsFor(3, "oz")! - 85.05) < 0.001);
  assert.equal(gramsFor(1, null), null); // a count with no known weight
});

test("food-parse: Atwater computes and sanity-checks kcal", () => {
  assert.equal(atwaterKcal(24, 52, 11), 96 + 208 + 99);
  assert.equal(atwaterCheck(410, 24, 52, 11).agrees, true);
  assert.equal(atwaterCheck(900, 24, 52, 11).agrees, false);
});

test("food-parse: precise units are high-confidence, counts are rough", () => {
  assert.equal(portionConfidence("g"), "high");
  assert.equal(portionConfidence("oz"), "high");
  assert.equal(portionConfidence("cup"), "rough");
  assert.equal(portionConfidence(null), "rough");
});
