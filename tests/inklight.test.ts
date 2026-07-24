import assert from "node:assert/strict";
import { test } from "node:test";
import { lightStateForHour } from "../lib/light";
import {
  bestByExercise,
  est1Rm,
  newMarks,
  splitFamilyFor,
  totalVolumeLb,
  trainingSummary,
  type Workout,
  type WorkoutSet,
} from "../lib/engine/training";
import {
  chordsForDay,
  composeSigil,
  legendaryForDay,
  moonIsFull,
  tierFor,
  type KeeperDay,
} from "../lib/engine/sigil";
import {
  gladeTier,
  tierForScore,
  vitalityScore,
  type GladeDay,
} from "../lib/engine/glade";
import { beingStates, paleElkGlimpsed, type LedgerDay } from "../lib/engine/beings";

// ── light ──

test("light: the day turns amber at 17 and lantern at 20", () => {
  assert.equal(lightStateForHour(6), "day");
  assert.equal(lightStateForHour(12), "day");
  assert.equal(lightStateForHour(16), "day");
  assert.equal(lightStateForHour(17), "dusk");
  assert.equal(lightStateForHour(19), "dusk");
  assert.equal(lightStateForHour(20), "night");
  assert.equal(lightStateForHour(23), "night");
  assert.equal(lightStateForHour(0), "night");
  assert.equal(lightStateForHour(5), "night");
});

// ── training ──

const lift = (exercise: string, weightLb: number, reps: number): WorkoutSet => ({
  kind: "lift",
  exercise,
  weightLb,
  reps,
  minutes: null,
});
const cardio = (minutes: number): WorkoutSet => ({
  kind: "cardio",
  exercise: "run",
  weightLb: null,
  reps: null,
  minutes,
});

test("training: split families read from real titles", () => {
  const w = (title: string, sets: WorkoutSet[] = []): Workout => ({ title, sets });
  assert.equal(splitFamilyFor(w("Chest & Triceps")), "push");
  assert.equal(splitFamilyFor(w("Back & Biceps")), "pull");
  assert.equal(splitFamilyFor(w("Leg Day")), "legs");
  assert.equal(splitFamilyFor(w("morning run")), "cardio");
  assert.equal(splitFamilyFor(w("Rest")), "rest");
  assert.equal(splitFamilyFor(w("Yoga flow")), "mobility");
  // Untitled falls back to what was actually done.
  assert.equal(splitFamilyFor(w("evening", [lift("bench", 135, 5)])), "full");
  assert.equal(splitFamilyFor(w("evening", [cardio(20)])), "cardio");
});

test("training: volume, Epley 1RM, and New Marks", () => {
  const sets = [lift("Bench Press", 185, 8), lift("Bench Press", 185, 8)];
  assert.equal(totalVolumeLb(sets), 185 * 8 * 2);
  assert.equal(est1Rm(200, 1), 200);
  assert.ok(Math.abs(est1Rm(185, 8) - 185 * (1 + 8 / 30)) < 0.001);

  const history = bestByExercise([lift("Bench Press", 185, 5)]);
  // 185x8 beats 185x5; a lighter set does not.
  assert.deepEqual(newMarks([lift("bench press", 185, 8)], history), [
    "bench press",
  ]);
  assert.deepEqual(newMarks([lift("Bench Press", 135, 5)], history), []);
  // An exercise never seen before is a first, not a record.
  assert.deepEqual(newMarks([lift("Incline Press", 95, 10)], history), []);
});

test("training: summary aggregates a real day", () => {
  const day: Workout[] = [
    {
      title: "Chest & Triceps",
      sets: [lift("Bench Press", 185, 8), lift("Pushdown", 47.5, 12), cardio(10)],
    },
  ];
  const s = trainingSummary(day, new Map());
  assert.equal(s.trained, true);
  assert.equal(s.primaryFamily, "push");
  assert.equal(s.volumeLb, 185 * 8 + 47.5 * 12);
  assert.equal(s.cardioMin, 10);
});

// ── sigil ──

const quietDay = (over: Partial<KeeperDay> = {}): KeeperDay => ({
  loggedAny: true,
  calories: 1800,
  targetCalories: 2000,
  proteinG: 120,
  targetProteinG: 150,
  halls: ["protein"],
  waterCups: 0,
  mood: null,
  wroteNote: false,
  restDay: false,
  training: {
    trained: false,
    families: [],
    primaryFamily: null,
    volumeLb: 0,
    cardioMin: 0,
    prCount: 0,
  },
  firstLoggedAtMs: null,
  ...over,
});

test("sigil: no chords sound until both keepers have logged", () => {
  const a = quietDay({ waterCups: 8, mood: "😊" });
  const b = quietDay({ loggedAny: false, waterCups: 8, mood: "😊" });
  assert.deepEqual(chordsForDay(a, b), []);
});

test("sigil: chords strike on real alignment", () => {
  const a = quietDay({
    proteinG: 160,
    waterCups: 8,
    halls: ["protein", "produce"],
    mood: "😌",
    wroteNote: true,
  });
  const b = quietDay({
    proteinG: 155,
    waterCups: 9,
    halls: ["produce", "dishes"],
    mood: "😌",
    wroteNote: true,
  });
  const chords = chordsForDay(a, b);
  assert.ok(chords.includes("lean"));
  assert.ok(chords.includes("iron"));
  assert.ok(chords.includes("spring"));
  assert.ok(chords.includes("green"));
  assert.ok(chords.includes("mirror"));
  assert.ok(chords.includes("scribe"));
  assert.ok(!chords.includes("hearth")); // only one cooked
});

test("sigil: the Twin Split subsumes the Anvil; Twin Peaks subsumes the New Mark", () => {
  const lifting = (family: "push" | "pull", prCount = 0) =>
    quietDay({
      training: {
        trained: true,
        families: [family],
        primaryFamily: family,
        volumeLb: 5000,
        cardioMin: 0,
        prCount,
      },
    });
  const same = chordsForDay(lifting("push"), lifting("push"));
  assert.ok(same.includes("twin-split"));
  assert.ok(!same.includes("anvil"));

  const different = chordsForDay(lifting("push"), lifting("pull"));
  assert.ok(different.includes("anvil"));
  assert.ok(!different.includes("twin-split"));

  const onePr = chordsForDay(lifting("push", 1), lifting("pull"));
  assert.ok(onePr.includes("new-mark"));
  const twoPr = chordsForDay(lifting("push", 1), lifting("pull", 2));
  assert.ok(twoPr.includes("twin-peaks"));
  assert.ok(!twoPr.includes("new-mark"));
});

test("sigil: the Carry strikes on asymmetry — one low, one strong", () => {
  const low = quietDay({ mood: "🥲" });
  const strong = quietDay({ mood: "😊", proteinG: 160 });

  // the strong light reaches over — and it reads the same from either seat
  assert.ok(chordsForDay(low, strong).includes("carry"));
  assert.ok(chordsForDay(strong, low).includes("carry"));

  // both low is the Ember Vigil's register, not the Carry's
  assert.ok(
    !chordsForDay(low, quietDay({ mood: "😤", proteinG: 160 })).includes("carry"),
  );
  // two good days: nobody needed carrying
  assert.ok(
    !chordsForDay(strong, quietDay({ mood: "😊", proteinG: 155 })).includes("carry"),
  );
  // a hard day with no strong shoulder beside it doesn't strike either
  assert.ok(!chordsForDay(low, quietDay({ mood: "😊" })).includes("carry"));
  // training counts as showing up strong, not just protein
  const trained = quietDay({
    mood: "😊",
    training: {
      trained: true,
      families: ["push"],
      primaryFamily: "push",
      volumeLb: 4000,
      cardioMin: 0,
      prCount: 0,
    },
  });
  assert.ok(chordsForDay(low, trained).includes("carry"));
});

test("sigil: tiers climb with chords and yield to legendaries", () => {
  assert.equal(tierFor({ completed: false, chordCount: 3, legendary: null }), "open");
  assert.equal(tierFor({ completed: true, chordCount: 0, legendary: null }), "common");
  assert.equal(tierFor({ completed: true, chordCount: 1, legendary: null }), "fine");
  assert.equal(tierFor({ completed: true, chordCount: 3, legendary: null }), "resonant");
  assert.equal(
    tierFor({ completed: true, chordCount: 0, legendary: "feast-seal" }),
    "legendary",
  );
});

test("sigil: the moon is full when it should be", () => {
  // 2000-01-06 was a new moon; 2000-01-21 was the following full moon.
  assert.equal(moonIsFull("2000-01-06"), false);
  assert.equal(moonIsFull("2000-01-21"), true);
});

test("sigil: legendaries span the archetypes, not just the grind", () => {
  const base = { fullMoon: false, firstPage: false };

  // The Feast Seal: a shared over-target day is celebrated.
  const feastA = quietDay({ calories: 2600 });
  const feastB = quietDay({ calories: 2500 });
  assert.equal(
    legendaryForDay({ a: feastA, b: feastB, chords: chordsForDay(feastA, feastB), ...base }),
    "feast-seal",
  );

  // The Ember Vigil: both logged, both low.
  const lowA = quietDay({ mood: "🥲" });
  const lowB = quietDay({ mood: "🥱" });
  assert.equal(
    legendaryForDay({ a: lowA, b: lowB, chords: chordsForDay(lowA, lowB), ...base }),
    "ember-vigil",
  );

  // ...which becomes the Quiet Moon under a full moon.
  assert.equal(
    legendaryForDay({
      a: lowA,
      b: lowB,
      chords: chordsForDay(lowA, lowB),
      fullMoon: true,
      firstPage: false,
    }),
    "quiet-moon",
  );

  // The Still Water: both rest, both watered.
  const restA = quietDay({ restDay: true, waterCups: 8 });
  const restB = quietDay({ restDay: true, waterCups: 8 });
  assert.equal(
    legendaryForDay({ a: restA, b: restB, chords: chordsForDay(restA, restB), ...base }),
    "still-water",
  );

  // The Twin Foxes: lean + twin split + iron.
  const grindDay = (): KeeperDay =>
    quietDay({
      proteinG: 160,
      training: {
        trained: true,
        families: ["push"],
        primaryFamily: "push",
        volumeLb: 6000,
        cardioMin: 0,
        prCount: 0,
      },
    });
  const gA = grindDay();
  const gB = grindDay();
  assert.equal(
    legendaryForDay({ a: gA, b: gB, chords: chordsForDay(gA, gB), ...base }),
    "twin-foxes",
  );

  // The First Page outranks everything on its day.
  assert.equal(
    legendaryForDay({
      a: gA,
      b: gB,
      chords: chordsForDay(gA, gB),
      fullMoon: false,
      firstPage: true,
    }),
    "first-page",
  );
});

test("sigil: the composed spec is deterministic and never renders a bad day", () => {
  const moss = quietDay({ halls: ["protein", "produce"] });
  const ember = quietDay({ calories: 2400, halls: ["sweets"] }); // a feast half
  const one = composeSigil({ day: "2026-07-19", moss, ember });
  const two = composeSigil({ day: "2026-07-19", moss, ember });
  assert.deepEqual(one, two);
  assert.equal(one.completed, true);
  assert.equal(one.moss.weight, "lean");
  // Over target draws the thickest ring — abundance, not failure.
  assert.equal(one.ember.weight, "feast");
  assert.deepEqual(one.radicals, ["protein", "produce", "sweets"]);
  const otherDay = composeSigil({ day: "2026-07-20", moss, ember });
  assert.notEqual(one.seed, otherDay.seed);
});

// ── glade ──

test("glade: vitality climbs with effort and the floor is serene", () => {
  const quiet: GladeDay = {
    bothLogged: false,
    chordCount: 0,
    workoutCount: 0,
    bothWatered: false,
    legendary: false,
  };
  const full: GladeDay = {
    bothLogged: true,
    chordCount: 3,
    workoutCount: 2,
    bothWatered: true,
    legendary: false,
  };
  assert.equal(tierForScore(vitalityScore(Array(14).fill(quiet))), "hushed");
  const steady = vitalityScore(Array(14).fill(full));
  assert.equal(tierForScore(steady), "radiant");
  assert.equal(
    tierForScore(vitalityScore(Array(7).fill(full).concat(Array(7).fill(quiet)))),
    "green",
  );
});

test("glade: falls at most one tier a day, rises freely", () => {
  assert.equal(gladeTier(0, "radiant"), "flourishing");
  assert.equal(gladeTier(0, "waking"), "hushed");
  assert.equal(gladeTier(200, "hushed"), "radiant");
});

// ── beings ──

const ledger = (over: Partial<LedgerDay>): LedgerDay => ({
  day: "2026-07-19",
  chords: [],
  legendary: null,
  bothRest: false,
  bothLowLogged: false,
  ...over,
});

test("beings: the kind of consistency decides who arrives", () => {
  const springDays = Array(5).fill(ledger({ chords: ["spring"] }));
  const states = new Map(beingStates(springDays).map((s) => [s.id, s]));
  assert.equal(states.get("heron")?.arrived, true);
  assert.equal(states.get("heron")?.stage, 1);
  assert.equal(states.get("stag")?.arrived, false);
  // The Koi listens to the same water but needs far more of it.
  assert.equal(states.get("koi")?.arrived, false);
  assert.equal(states.get("koi")?.nextAt, 20);
});

test("beings: trust deepens through stages and stops at three", () => {
  const ironDays = Array(40).fill(ledger({ chords: ["iron", "twin-split"] }));
  const stag = beingStates(ironDays).find((s) => s.id === "stag");
  assert.equal(stag?.stage, 3);
  assert.equal(stag?.nextAt, null);
  assert.equal(stag?.count, 80);
});

test("beings: the crow comes to hard days, the moth to rest", () => {
  const days = [
    ...Array(3).fill(ledger({ bothLowLogged: true })),
    ...Array(4).fill(ledger({ bothRest: true })),
  ];
  const states = new Map(beingStates(days).map((s) => [s.id, s]));
  assert.equal(states.get("crow")?.arrived, true);
  assert.equal(states.get("moth")?.arrived, true);
});

test("beings: the arrival day is derived, not recorded", () => {
  // five days of water; the Heron's threshold (5) falls on the fifth.
  const days = ["07-15", "07-16", "07-17", "07-18", "07-19", "07-20"].map((d) =>
    ledger({ day: `2026-${d}`, chords: ["spring"] }),
  );
  const heron = beingStates(days).find((s) => s.id === "heron");
  assert.equal(heron?.arrivedOn, "2026-07-19");
  // a being still in the wood has no arrival day
  assert.equal(
    beingStates(days).find((s) => s.id === "stag")?.arrivedOn,
    null,
  );
  // and none at all before the wood stirs
  assert.equal(
    beingStates([]).find((s) => s.id === "heron")?.arrivedOn,
    null,
  );
});

test("beings: the pale elk is only ever glimpsed", () => {
  assert.equal(
    paleElkGlimpsed({ gladeTier: "radiant", daysSinceLegendary: 1 }),
    true,
  );
  assert.equal(
    paleElkGlimpsed({ gladeTier: "flourishing", daysSinceLegendary: 0 }),
    false,
  );
  assert.equal(
    paleElkGlimpsed({ gladeTier: "radiant", daysSinceLegendary: 9 }),
    false,
  );
});
