import assert from "node:assert/strict";
import { test } from "node:test";
import { parseDayDictation } from "../lib/engine/dictation";

test("dictation: the canonical spoken day", () => {
  const d = parseDayDictation(
    "two eggs and toast for breakfast, benched 135 for 5, drank three waters, feeling good, weighed 172",
    { hour: 8 },
  );

  assert.equal(d.rituals.waterCups, 3);
  assert.equal(d.rituals.weightLb, 172);
  assert.equal(d.rituals.mood, "good");

  assert.equal(d.foods.length, 1);
  assert.equal(d.foods[0].meal, "breakfast");
  assert.equal(d.foods[0].items.length, 2);

  assert.ok(d.workout);
  assert.equal(d.workout?.sets.length, 1);
  assert.equal(d.workout?.sets[0].weightLb, 135);
  assert.equal(d.workout?.sets[0].reps, 5);

  assert.equal(d.note, null);
});

test("dictation: 'cup of rice' stays food, not water", () => {
  const d = parseDayDictation("one cup of rice for lunch", { hour: 12 });
  assert.equal(d.rituals.waterCups, null);
  assert.equal(d.foods.length, 1);
  assert.equal(d.foods[0].meal, "lunch");
  assert.equal(d.foods[0].items[0].unit, "cup");
});

test("dictation: weight is weigh-anchored, not any workout number", () => {
  const d = parseDayDictation("squatted 185 for 5, weighed myself at 172", {
    hour: 17,
  });
  assert.equal(d.rituals.weightLb, 172);
  assert.ok(d.workout);
  assert.equal(d.workout?.sets[0].weightLb, 185);
});

test("dictation: 'pressed juice' with no number is food, not a workout", () => {
  const d = parseDayDictation("pressed some juice", { hour: 9 });
  assert.equal(d.workout, null);
  assert.equal(d.foods.length, 1);
});

test("dictation: a meal cue routes food to the named meal", () => {
  const d = parseDayDictation("grilled chicken and rice for dinner", { hour: 13 });
  assert.equal(d.foods.length, 1);
  assert.equal(d.foods[0].meal, "dinner");
  assert.equal(d.foods[0].items.length, 2);
});

test("dictation: multiple lifts collapse into one workout", () => {
  const d = parseDayDictation("bench 135x5, squat 225x5", { hour: 18 });
  assert.ok(d.workout);
  assert.equal(d.workout?.sets.length, 2);
});
