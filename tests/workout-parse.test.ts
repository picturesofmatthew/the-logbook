import assert from "node:assert/strict";
import { test } from "node:test";
import { parseWorkoutLine } from "../lib/engine/workout-parse";

test("workout-parse: weight x reps x sets expands into that many sets", () => {
  const { sets } = parseWorkoutLine("bench 185x8x3");
  assert.equal(sets.length, 3);
  assert.deepEqual(sets[0], {
    kind: "lift",
    exercise: "bench",
    weightLb: 185,
    reps: 8,
    minutes: null,
  });
  assert.equal(sets[2].reps, 8);
});

test("workout-parse: comma-separated sets continue the same exercise", () => {
  const { sets } = parseWorkoutLine("incline db 60x10, 60x9, 60x8");
  assert.equal(sets.length, 3);
  assert.ok(sets.every((s) => s.exercise === "incline db"));
  assert.deepEqual(
    sets.map((s) => s.reps),
    [10, 9, 8],
  );
});

test("workout-parse: bodyweight (bw) leaves weight null", () => {
  const { sets } = parseWorkoutLine("pullups bwx12x3");
  assert.equal(sets.length, 3);
  assert.equal(sets[0].weightLb, null);
  assert.equal(sets[0].reps, 12);
});

test("workout-parse: cardio reads minutes, not a lift", () => {
  const { sets } = parseWorkoutLine("run 30min");
  assert.equal(sets.length, 1);
  assert.deepEqual(sets[0], {
    kind: "cardio",
    exercise: "run",
    weightLb: null,
    reps: null,
    minutes: 30,
  });
});

test("workout-parse: a full line mixes lifts and cardio, ×/x/@ all work", () => {
  const { sets } = parseWorkoutLine("bench 185×8×3; squat 225 5; row 45m");
  const bench = sets.filter((s) => s.exercise === "bench");
  const squat = sets.filter((s) => s.exercise === "squat");
  const row = sets.filter((s) => s.exercise === "row");
  assert.equal(bench.length, 3);
  assert.equal(squat.length, 1);
  assert.equal(squat[0].weightLb, 225);
  assert.equal(squat[0].reps, 5);
  assert.equal(row[0].kind, "cardio");
  assert.equal(row[0].minutes, 45);
});

test("workout-parse: guesses the split from the exercises", () => {
  assert.equal(parseWorkoutLine("bench 185x8, dips bwx12").titleGuess, "Push");
  assert.equal(parseWorkoutLine("squat 225x5, rdl 185x8").titleGuess, "Legs");
  assert.equal(parseWorkoutLine("run 40min").titleGuess, "Cardio");
});

test("workout-parse: junk yields no sets and no title", () => {
  const r = parseWorkoutLine("felt pretty good today");
  assert.equal(r.sets.length, 0);
  assert.equal(r.titleGuess, undefined);
});
