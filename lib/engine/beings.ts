// The Bestiary — pure functions.
//
// Consistency calls creatures, and the KIND of consistency decides who: each
// being listens for its own chord family across the whole history. Beings
// arrive at a threshold, deepen through trust stages, and never leave.
// The fox (the familiar) is founding and lives in lib/engine/familiar.ts, untouched.

import type { ChordId, LegendaryId } from "./sigil";
import type { GladeTier } from "./glade";

export type BeingId =
  | "stag"
  | "heron"
  | "tortoise"
  | "moth"
  | "crow"
  | "hare"
  | "salamander"
  | "owl"
  | "koi";

export type BeingWave = "first" | "second" | "deep";

// One row of the shared history ledger, as the beings hear it.
export type LedgerDay = {
  day: string;
  chords: ChordId[];
  legendary: LegendaryId | null;
  bothRest: boolean; // both keepers marked rest
  bothLowLogged: boolean; // both logged with low moods (an ember-vigil shape)
};

export type BeingDef = {
  id: BeingId;
  name: string;
  wave: BeingWave;
  zone: string;
  line: string;
  // How many of its calls must sound before it arrives, then before each
  // deeper trust stage (cumulative counts; stages beyond arrival are 2..N).
  thresholds: [number, number, number];
  countsFor(d: LedgerDay): number;
};

const chordCount =
  (...ids: ChordId[]) =>
  (d: LedgerDay) =>
    d.chords.filter((c) => ids.includes(c)).length;

export const BEINGS: BeingDef[] = [
  {
    id: "stag",
    name: "the Stag",
    wave: "first",
    zone: "the tree line",
    line: "Called by iron: lifting and protein, kept together.",
    thresholds: [5, 15, 35],
    countsFor: chordCount("iron", "anvil", "twin-split", "new-mark", "twin-peaks"),
  },
  {
    id: "heron",
    name: "the Heron",
    wave: "first",
    zone: "the pool it brings with it",
    line: "Called by water. Its arrival creates the pool.",
    thresholds: [5, 15, 35],
    countsFor: chordCount("spring"),
  },
  {
    id: "tortoise",
    name: "the Tortoise",
    wave: "second",
    zone: "the moss bank",
    line: "Called by green things. Carries a garden on its shell.",
    thresholds: [7, 18, 40],
    countsFor: chordCount("green"),
  },
  {
    id: "moth",
    name: "the Moth",
    wave: "second",
    zone: "the lantern, at night",
    line: "Called by rest taken seriously.",
    thresholds: [4, 12, 26],
    countsFor: (d) => (d.bothRest ? 1 : 0),
  },
  {
    id: "crow",
    name: "the Crow",
    wave: "second",
    zone: "the dark edge of the woods",
    line: "Called by hard days shown up for.",
    thresholds: [3, 9, 21],
    countsFor: (d) => (d.bothLowLogged ? 1 : 0),
  },
  {
    id: "hare",
    name: "the Hare",
    wave: "deep",
    zone: "the meadow grass",
    line: "Called by the long road.",
    thresholds: [5, 15, 35],
    countsFor: chordCount("long-road"),
  },
  {
    id: "salamander",
    name: "the Salamander",
    wave: "deep",
    zone: "the firepit",
    line: "Called by hearth and feast. Abundance, honored.",
    thresholds: [5, 14, 30],
    countsFor: (d) =>
      chordCount("hearth")(d) + (d.legendary === "feast-seal" ? 1 : 0),
  },
  {
    id: "owl",
    name: "the Owl",
    wave: "deep",
    zone: "the book-stand",
    line: "Called by the writing-down of things.",
    thresholds: [7, 18, 40],
    countsFor: chordCount("scribe"),
  },
  {
    id: "koi",
    name: "the Koi",
    wave: "deep",
    zone: "the pool, once it exists",
    line: "Violet-flecked. A luck omen for sustained water.",
    thresholds: [20, 40, 70],
    countsFor: chordCount("spring"),
  },
];

export type BeingState = {
  id: BeingId;
  arrived: boolean;
  stage: 0 | 1 | 2 | 3; // 0 = not yet arrived
  count: number;
  nextAt: number | null; // null once fully deepened
};

export function beingStates(history: LedgerDay[]): BeingState[] {
  return BEINGS.map((def) => {
    const count = history.reduce((sum, d) => sum + def.countsFor(d), 0);
    const [t1, t2, t3] = def.thresholds;
    const stage = count >= t3 ? 3 : count >= t2 ? 2 : count >= t1 ? 1 : 0;
    const nextAt = stage === 3 ? null : stage === 2 ? t3 : stage === 1 ? t2 : t1;
    return {
      id: def.id,
      arrived: stage >= 1,
      stage: stage as BeingState["stage"],
      count,
      nextAt,
    };
  });
}

// The Pale Elk is not a resident — it is glimpsed, and only when the Glade is
// radiant within a few days of a legendary. Secret until the first glimpse.
export function paleElkGlimpsed(input: {
  gladeTier: GladeTier;
  daysSinceLegendary: number | null;
}): boolean {
  return (
    input.gladeTier === "radiant" &&
    input.daysSinceLegendary != null &&
    input.daysSinceLegendary <= 3
  );
}
