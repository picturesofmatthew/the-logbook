import assert from "node:assert/strict";
import { test } from "node:test";
import { boatState, type BoatDay, type Dream } from "../lib/engine/boat";
import type { SigilTier } from "../lib/engine/sigil";

const day = (
  d: string,
  completed: boolean,
  tier: SigilTier = "common",
): BoatDay => ({ day: d, completed, tier });

const kauai = (over: Partial<Dream> = {}): Dream => ({
  name: "Kauai",
  plankGoal: 3,
  startedDay: "2026-07-01",
  ...over,
});

test("boat: a plank is set only when the seal closed (both logged)", () => {
  const history = [
    day("2026-07-01", true),
    day("2026-07-02", false), // one keeper only — no plank
    day("2026-07-03", true),
  ];
  const b = boatState(history, kauai());
  assert.equal(b.planksLaid, 2);
  assert.deepEqual(
    b.planks.map((p) => p.day),
    ["2026-07-01", "2026-07-03"],
  );
});

test("boat: days before the build began add no plank", () => {
  const history = [
    day("2026-06-28", true), // before startedDay — a previous vessel's day
    day("2026-07-01", true),
    day("2026-07-02", true),
  ];
  const b = boatState(history, kauai({ startedDay: "2026-07-01" }));
  assert.equal(b.planksLaid, 2);
});

test("boat: remaining and completion track the plank goal", () => {
  const three = [
    day("2026-07-01", true),
    day("2026-07-02", true),
    day("2026-07-03", true),
  ];
  const partway = boatState(three.slice(0, 2), kauai({ plankGoal: 3 }));
  assert.equal(partway.remaining, 1);
  assert.equal(partway.complete, false);

  const whole = boatState(three, kauai({ plankGoal: 3 }));
  assert.equal(whole.remaining, 0);
  assert.equal(whole.complete, true);

  // Extra both-logged days past completion don't break it or go negative.
  const beyond = boatState(
    [...three, day("2026-07-04", true)],
    kauai({ plankGoal: 3 }),
  );
  assert.equal(beyond.remaining, 0);
  assert.equal(beyond.complete, true);
  assert.equal(beyond.planksLaid, 4);
});

test("boat: legendary and resonant days set a golden plank", () => {
  const history = [
    day("2026-07-01", true, "common"),
    day("2026-07-02", true, "resonant"),
    day("2026-07-03", true, "legendary"),
    day("2026-07-04", true, "fine"),
  ];
  const b = boatState(history, kauai({ plankGoal: 10 }));
  assert.equal(b.goldenCount, 2);
  assert.deepEqual(
    b.planks.map((p) => p.golden),
    [false, true, true, false],
  );
});

test("boat: an empty history yields a bare keel — no planks", () => {
  const b = boatState([], kauai({ plankGoal: 14 }));
  assert.equal(b.planksLaid, 0);
  assert.equal(b.remaining, 14);
  assert.equal(b.complete, false);
});

test("boat: planks come out keel-first (chronological) regardless of input order", () => {
  const history = [
    day("2026-07-05", true),
    day("2026-07-01", true),
    day("2026-07-03", true),
  ];
  const b = boatState(history, kauai({ plankGoal: 10 }));
  assert.deepEqual(
    b.planks.map((p) => p.day),
    ["2026-07-01", "2026-07-03", "2026-07-05"],
  );
});
