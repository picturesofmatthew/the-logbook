// Glade vitality — pure functions.
//
// A rolling window of both keepers' effort sets the Glade's tier. It rises
// fast and falls slow, and the floor is serene: Hushed is winter, not ruin.
// Beings doze; they never leave.

export type GladeTier = "hushed" | "waking" | "green" | "flourishing" | "radiant";

export const GLADE_TIERS: GladeTier[] = [
  "hushed",
  "waking",
  "green",
  "flourishing",
  "radiant",
];

export type GladeDay = {
  bothLogged: boolean;
  chordCount: number;
  workoutCount: number; // both keepers combined
  bothWatered: boolean;
  legendary: boolean;
};

export const WINDOW_DAYS = 14;

// Weights: showing up together is the trunk; everything else is foliage.
export function vitalityScore(window: GladeDay[]): number {
  return window.reduce((sum, d) => {
    let day = 0;
    if (d.bothLogged) day += 3;
    day += Math.min(d.chordCount, 4);
    day += Math.min(d.workoutCount, 2);
    if (d.bothWatered) day += 1;
    if (d.legendary) day += 5;
    return sum + day;
  }, 0);
}

// Thresholds tuned to a 14-day window (max plausible ~15/day; a steady
// both-logged fortnight with a few chords lands in "green").
const THRESHOLDS: { tier: GladeTier; min: number }[] = [
  { tier: "radiant", min: 110 },
  { tier: "flourishing", min: 70 },
  { tier: "green", min: 40 },
  { tier: "waking", min: 12 },
  { tier: "hushed", min: 0 },
];

export function tierForScore(score: number): GladeTier {
  for (const t of THRESHOLDS) {
    if (score >= t.min) return t.tier;
  }
  return "hushed";
}

// Rises fast, falls slow: vitality may drop at most one tier from where it
// stood yesterday, no matter how the score moved.
export function gladeTier(score: number, prevTier?: GladeTier): GladeTier {
  const target = tierForScore(score);
  if (!prevTier) return target;
  const prev = GLADE_TIERS.indexOf(prevTier);
  const next = GLADE_TIERS.indexOf(target);
  if (next < prev - 1) return GLADE_TIERS[prev - 1];
  return target;
}
