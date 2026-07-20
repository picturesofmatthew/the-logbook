import assert from "node:assert/strict";
import { test } from "node:test";
import { scaleToServing, servingGrams, type FdcFood } from "../lib/usda";

function food(over: Partial<FdcFood>): FdcFood {
  return {
    fdcId: 1,
    description: "test food",
    dataType: "Branded",
    foodNutrients: [
      { nutrientId: 1008, value: 100 }, // kcal / 100 g
      { nutrientId: 1003, value: 10 }, // protein
      { nutrientId: 1005, value: 5 }, // carbs
      { nutrientId: 1004, value: 4 }, // fat
    ],
    ...over,
  };
}

test("usda: gram servings scale and keep per-100 g", () => {
  const r = scaleToServing(food({ servingSize: 150, servingSizeUnit: "g" }));
  assert.equal(r.servingGrams, 150);
  assert.equal(r.calories, 150);
  assert.equal(r.proteinG, 15);
  assert.equal(r.servingLabel, "150 g");
  assert.equal(r.per100.calories, 100);
});

test("usda: ml and oz servings convert to grams (the old bug)", () => {
  const ml = scaleToServing(food({ servingSize: 250, servingSizeUnit: "ml" }));
  assert.equal(ml.servingGrams, 250);
  assert.equal(ml.calories, 250);
  assert.equal(ml.servingLabel, "250 ml");

  const oz = scaleToServing(food({ servingSize: 2, servingSizeUnit: "oz" }));
  assert.ok(Math.abs(servingGrams(food({ servingSize: 2, servingSizeUnit: "oz" }))! - 56.7) < 0.01);
  assert.equal(oz.calories, 57); // 100 * 0.567
});

test("usda: household text wins the label when we have grams", () => {
  const r = scaleToServing(
    food({ servingSize: 240, servingSizeUnit: "g", householdServingFullText: "1 cup" }),
  );
  assert.equal(r.servingLabel, "1 cup");
  assert.equal(r.calories, 240);
});

test("usda: unknown/absent serving stays honest per-100 g", () => {
  const r = scaleToServing(food({}));
  assert.equal(r.servingGrams, null);
  assert.equal(r.servingLabel, "per 100 g");
  assert.equal(r.calories, 100);
});
