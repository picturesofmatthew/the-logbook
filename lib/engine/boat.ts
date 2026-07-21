// The Boat to the far shore — pure functions.
//
// The second half of the spine: both keepers log → the day's sigil completes →
// a plank is added to the boat, the vessel that will carry the two of you to the
// shared Dream. Plank by plank the hull rises; when the last plank is set, the
// boat is whole and you set sail. It never un-builds (planks only accrue) and it
// is strictly two-player — a plank cannot be added alone, because the seal
// cannot close alone. Legendary and resonant days set a golden plank. Planks are
// never stored: they are derived from the ledger here, like beings in beings.ts.

import type { SigilTier } from "./sigil";

// One row of the shared history, as the boat hears it.
export type BoatDay = {
  day: string;
  completed: boolean; // both keepers logged — the seal closed
  tier: SigilTier;
};

// The active Dream, as the boat needs it (a projection of the `dreams` row).
export type Dream = {
  name: string;
  plankGoal: number; // planks to finish the vessel
  startedDay: string; // this boat's build counts from here
};

// A single plank of the hull — one both-logged day, keel-up in order.
export type PlankMark = {
  day: string;
  tier: SigilTier;
  golden: boolean; // legendary or resonant — a brighter board
};

export type BoatState = {
  planks: PlankMark[]; // chronological, one per completed day, keel first
  planksLaid: number;
  plankGoal: number;
  remaining: number; // planks still to set before the vessel is whole
  complete: boolean; // the boat is finished — ready to sail
  goldenCount: number;
};

const isGolden = (tier: SigilTier) => tier === "legendary" || tier === "resonant";

// The whole boat for the active Dream, derived from history. Days before the
// build began, and days the seal didn't close, add no plank.
export function boatState(history: BoatDay[], dream: Dream): BoatState {
  const planks: PlankMark[] = history
    .filter((d) => d.completed && d.day >= dream.startedDay)
    .sort((a, b) => a.day.localeCompare(b.day))
    .map((d) => ({ day: d.day, tier: d.tier, golden: isGolden(d.tier) }));

  const plankGoal = Math.max(1, dream.plankGoal);
  const planksLaid = planks.length;
  return {
    planks,
    planksLaid,
    plankGoal,
    remaining: Math.max(0, plankGoal - planksLaid),
    complete: planksLaid >= plankGoal,
    goldenCount: planks.filter((p) => p.golden).length,
  };
}
