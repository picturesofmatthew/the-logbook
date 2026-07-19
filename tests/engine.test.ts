import assert from "node:assert/strict";
import { test } from "node:test";
import { addDays, diffDays } from "../lib/dates-client";
import {
  ageFromBirthdate,
  calorieFloor,
  mifflinStJeor,
  suggestTargets,
  tdeeFromBmr,
} from "../lib/engine/tdee";
import { add, scale, totalOf, ZERO } from "../lib/engine/totals";
import { moodFor, nextStageIn, speechFor, stageForDays } from "../lib/engine/pet";
import { stampsForDay } from "../lib/engine/stamps";

test("dates: addDays crosses month and year boundaries", () => {
  assert.equal(addDays("2026-07-31", 1), "2026-08-01");
  assert.equal(addDays("2026-01-01", -1), "2025-12-31");
  assert.equal(addDays("2024-02-28", 1), "2024-02-29"); // leap
  assert.equal(diffDays("2026-08-01", "2026-07-18"), 14);
  assert.equal(diffDays("2026-07-18", "2026-08-01"), -14);
});

test("tdee: Mifflin-St Jeor matches hand-computed values", () => {
  // Male, 180 lb (81.65 kg), 71 in (180.3 cm), age 30:
  // 10*81.65 + 6.25*180.34 - 5*30 + 5 = 816.5 + 1127.1 - 150 + 5 ≈ 1799
  const bmr = mifflinStJeor({
    sex: "male",
    weightLb: 180,
    heightIn: 71,
    age: 30,
  });
  assert.ok(Math.abs(bmr - 1799) <= 2, `bmr was ${bmr}`);
  assert.equal(tdeeFromBmr(1800, "moderate"), 2790);
});

test("tdee: age computation respects birthdays", () => {
  assert.equal(ageFromBirthdate("1996-07-18", "2026-07-18"), 30);
  assert.equal(ageFromBirthdate("1996-07-19", "2026-07-18"), 29);
});

test("tdee: targets respect the calorie floor", () => {
  const s = suggestTargets({
    tdeeKcal: 1300,
    weightLb: 110,
    deficitKcal: 500,
    sex: "female",
  });
  assert.equal(s.calories, calorieFloor("female"));
  assert.equal(s.flooredAt, 1200);
  assert.ok(s.carbsG >= 0);
});

test("totals: scale, add, and sum entries", () => {
  const chicken = { calories: 165, proteinG: 31, carbsG: 0, fatG: 3.6 };
  const rice = { calories: 205, proteinG: 4.3, carbsG: 44.5, fatG: 0.4 };
  const total = totalOf([
    { ...chicken, servings: 1.5 },
    { ...rice, servings: 1 },
  ]);
  assert.ok(Math.abs(total.calories - (165 * 1.5 + 205)) < 0.001);
  assert.ok(Math.abs(total.proteinG - (31 * 1.5 + 4.3)) < 0.001);
  assert.deepEqual(add(ZERO, ZERO), ZERO);
  assert.equal(scale(chicken, 2).calories, 330);
});

test("pet: growth stages hit their thresholds and never regress order", () => {
  assert.equal(stageForDays(0), "kit");
  assert.equal(stageForDays(6), "kit");
  assert.equal(stageForDays(7), "yearling");
  assert.equal(stageForDays(20), "yearling");
  assert.equal(stageForDays(21), "young");
  assert.equal(stageForDays(44), "young");
  assert.equal(stageForDays(45), "adult");
  assert.equal(stageForDays(89), "adult");
  assert.equal(stageForDays(90), "elder");
  assert.equal(stageForDays(400), "elder");
  assert.deepEqual(nextStageIn(0), { label: "yearling", daysLeft: 7 });
  assert.equal(nextStageIn(90), null);
});

test("pet: moods are gentle — never punished for eating, only absence", () => {
  assert.equal(moodFor({ loggedTodayCount: 2, daysSinceAnyEntry: 0 }), "thriving");
  assert.equal(moodFor({ loggedTodayCount: 1, daysSinceAnyEntry: 0 }), "cozy");
  assert.equal(moodFor({ loggedTodayCount: 0, daysSinceAnyEntry: 1 }), "waiting");
  assert.equal(moodFor({ loggedTodayCount: 0, daysSinceAnyEntry: 2 }), "lonely");
  assert.equal(moodFor({ loggedTodayCount: 0, daysSinceAnyEntry: null }), "waiting");
});

test("pet: speech is deterministic for a given day and fills the blank", () => {
  const a = speechFor("cozy", "2026-07-18cozy", "Kennedy");
  const b = speechFor("cozy", "2026-07-18cozy", "Kennedy");
  assert.equal(a, b);
  assert.ok(!a.includes("{missing}"));
});

test("stamps: protein, both-logged, hydration, training, specimens", () => {
  const target = { calories: 2000, proteinG: 150, carbsG: 180, fatG: 60 };
  const stamps = stampsForDay({
    people: [
      {
        name: "Matthew",
        total: { calories: 1900, proteinG: 155, carbsG: 170, fatG: 55 },
        target,
        loggedAny: true,
        training: "lift",
        waterCups: 8,
      },
      {
        name: "Kennedy",
        total: { calories: 1500, proteinG: 100, carbsG: 150, fatG: 50 },
        target,
        loggedAny: true,
        training: null,
        waterCups: 3,
      },
    ],
    newSpecimens: 2,
  });
  const ids = stamps.map((s) => s.id);
  assert.ok(ids.includes("both-logged"));
  assert.ok(ids.includes("protein-Matthew"));
  assert.ok(!ids.includes("protein-Kennedy"));
  assert.ok(ids.includes("training-Matthew"));
  assert.ok(ids.includes("water-Matthew"));
  assert.ok(ids.includes("new-specimens"));
});

test("stamps: an empty day earns nothing, quietly", () => {
  const stamps = stampsForDay({
    people: [
      {
        name: "Matthew",
        total: ZERO,
        target: null,
        loggedAny: false,
        training: null,
        waterCups: 0,
      },
      {
        name: "Kennedy",
        total: ZERO,
        target: null,
        loggedAny: false,
        training: null,
        waterCups: 0,
      },
    ],
    newSpecimens: 0,
  });
  assert.equal(stamps.length, 0);
});
