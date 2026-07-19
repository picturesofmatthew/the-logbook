// The Sigil Engine — the heart of the app. Pure functions.
//
// Each keeper's logged day composes half a sigil; the halves join into a seal
// unique to that day. Aligned conditions strike CHORDS; chords raise the
// seal's tier; named combinations are LEGENDARY — secret until first earned.
//
// Tone law (load-bearing): legendaries span every kind of good day. Deficit,
// rest, hard days, and feasts all have one. Nothing here ever renders a day
// as bad — a feast draws the *thickest* ring.

import type { Hall } from "@/lib/halls";
import type { SplitFamily, TrainingSummary } from "./training";

export type KeeperDay = {
  loggedAny: boolean;
  calories: number;
  targetCalories: number | null;
  proteinG: number;
  targetProteinG: number | null;
  halls: Hall[];
  waterCups: number;
  mood: string | null;
  wroteNote: boolean;
  restDay: boolean; // marked rest (toggle or a Rest workout)
  training: TrainingSummary;
  firstLoggedAtMs: number | null;
};

// ── Chords ──

export type ChordId =
  | "lean"
  | "iron"
  | "anvil"
  | "twin-split"
  | "long-road"
  | "spring"
  | "green"
  | "hearth"
  | "mirror"
  | "scribe"
  | "new-mark"
  | "twin-peaks";

export const CHORDS: Record<ChordId, { name: string; line: string }> = {
  lean: { name: "the Lean Chord", line: "both under target" },
  iron: { name: "the Iron Chord", line: "both hit protein" },
  anvil: { name: "the Anvil", line: "both lifted" },
  "twin-split": { name: "the Twin Split", line: "same split, same day" },
  "long-road": { name: "the Long Road", line: "both did cardio" },
  spring: { name: "the Spring", line: "both watered" },
  green: { name: "the Green Chord", line: "both ate from the earth" },
  hearth: { name: "the Hearth Chord", line: "both cooked" },
  mirror: { name: "the Mirror", line: "the same mood, twice" },
  scribe: { name: "the Scribe's Chord", line: "both wrote it down" },
  "new-mark": { name: "the New Mark", line: "a record fell" },
  "twin-peaks": { name: "the Twin Peaks", line: "two records, one day" },
};

const LIFT_FAMILIES: SplitFamily[] = ["push", "pull", "legs", "full"];

export function chordsForDay(a: KeeperDay, b: KeeperDay): ChordId[] {
  // Chords are two-player by definition: no closed ring, no music.
  if (!a.loggedAny || !b.loggedAny) return [];

  const chords: ChordId[] = [];
  const both = (f: (k: KeeperDay) => boolean) => f(a) && f(b);

  if (
    both((k) => k.targetCalories != null && k.calories > 0) &&
    both((k) => k.calories <= (k.targetCalories as number))
  ) {
    chords.push("lean");
  }
  if (
    both((k) => k.targetProteinG != null) &&
    both((k) => k.proteinG >= (k.targetProteinG as number))
  ) {
    chords.push("iron");
  }

  const sameLiftSplit =
    a.training.primaryFamily != null &&
    a.training.primaryFamily === b.training.primaryFamily &&
    LIFT_FAMILIES.includes(a.training.primaryFamily);
  if (sameLiftSplit) {
    chords.push("twin-split"); // subsumes the Anvil
  } else if (both((k) => k.training.volumeLb > 0)) {
    chords.push("anvil");
  }

  if (both((k) => k.training.cardioMin >= 10)) chords.push("long-road");
  if (both((k) => k.waterCups >= 8)) chords.push("spring");
  if (both((k) => k.halls.includes("produce"))) chords.push("green");
  if (both((k) => k.halls.includes("dishes"))) chords.push("hearth");
  if (a.mood != null && a.mood === b.mood) chords.push("mirror");
  if (both((k) => k.wroteNote)) chords.push("scribe");

  const peaks = both((k) => k.training.prCount >= 1);
  if (peaks) {
    chords.push("twin-peaks"); // subsumes the New Mark
  } else if (a.training.prCount + b.training.prCount >= 1) {
    chords.push("new-mark");
  }

  return chords;
}

// ── Tiers ──

export type SigilTier = "open" | "common" | "fine" | "resonant" | "legendary";

export function tierFor(input: {
  completed: boolean;
  chordCount: number;
  legendary: LegendaryId | null;
}): SigilTier {
  if (!input.completed) return "open";
  if (input.legendary) return "legendary";
  if (input.chordCount >= 2) return "resonant";
  if (input.chordCount === 1) return "fine";
  return "common";
}

// ── Legendaries ──

export type LegendaryId =
  | "first-page"
  | "quiet-moon"
  | "twin-foxes"
  | "twin-peaks"
  | "green-cathedral"
  | "long-road-home"
  | "mirror-at-dusk"
  | "still-water"
  | "ember-vigil"
  | "feast-seal";

export const LEGENDARIES: Record<
  LegendaryId,
  { name: string; epigraph: string }
> = {
  "first-page": {
    name: "The First Page",
    epigraph: "The day the book began.",
  },
  "quiet-moon": {
    name: "The Quiet Moon",
    epigraph: "A hard day, kept, under a full moon.",
  },
  "twin-foxes": {
    name: "The Twin Foxes",
    epigraph: "The grind, honored.",
  },
  "twin-peaks": {
    name: "The Twin Peaks",
    epigraph: "Two records, one day.",
  },
  "green-cathedral": {
    name: "The Green Cathedral",
    epigraph: "The clean day.",
  },
  "long-road-home": {
    name: "The Long Road Home",
    epigraph: "Endurance, shared.",
  },
  "mirror-at-dusk": {
    name: "The Mirror at Dusk",
    epigraph: "Timing as tenderness.",
  },
  "still-water": {
    name: "The Still Water",
    epigraph: "Recovery is a discipline.",
  },
  "ember-vigil": {
    name: "The Ember Vigil",
    epigraph: "Showing up on a hard day is its own magic.",
  },
  "feast-seal": {
    name: "The Feast Seal",
    epigraph: "A feast together is celebrated, never punished.",
  },
};

// Moods that mark a hard day. The set matches the mood picker.
const LOW_MOODS = ["😤", "🥱", "🥲"];

export function isLowMood(mood: string | null): boolean {
  return mood != null && LOW_MOODS.includes(mood);
}

// Moon phase, pure and offline: fraction of the synodic cycle at noon UTC of
// the given day, from the known new moon of 2000-01-06 18:14 UTC. "Full"
// means within about half a day of the peak.
const SYNODIC_DAYS = 29.530588;
const EPOCH_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14);

export function moonIsFull(dayIso: string): boolean {
  const noon = Date.parse(dayIso + "T12:00:00Z");
  const days = (noon - EPOCH_NEW_MOON_MS) / 86_400_000;
  const phase = ((days % SYNODIC_DAYS) + SYNODIC_DAYS) % SYNODIC_DAYS / SYNODIC_DAYS;
  return Math.abs(phase - 0.5) <= 0.017; // ~±0.5 day window
}

const HOUR_MS = 3_600_000;

export function legendaryForDay(input: {
  a: KeeperDay;
  b: KeeperDay;
  chords: ChordId[];
  fullMoon: boolean;
  firstPage: boolean;
}): LegendaryId | null {
  const { a, b, chords, fullMoon, firstPage } = input;
  if (!a.loggedAny || !b.loggedAny) return null;
  const has = (c: ChordId) => chords.includes(c);

  const emberVigil =
    a.mood != null &&
    b.mood != null &&
    LOW_MOODS.includes(a.mood) &&
    LOW_MOODS.includes(b.mood);
  const feast =
    a.targetCalories != null &&
    b.targetCalories != null &&
    a.calories > a.targetCalories &&
    b.calories > b.targetCalories;
  const closeInTime =
    a.firstLoggedAtMs != null &&
    b.firstLoggedAtMs != null &&
    Math.abs(a.firstLoggedAtMs - b.firstLoggedAtMs) <= HOUR_MS;
  const bothTrained = a.training.trained && b.training.trained;

  // One legendary per day; sentiment first, then rarity.
  if (firstPage) return "first-page";
  if (emberVigil && fullMoon) return "quiet-moon";
  if (has("lean") && has("twin-split") && has("iron")) return "twin-foxes";
  if (has("twin-peaks")) return "twin-peaks";
  if (has("green") && has("spring") && bothTrained) return "green-cathedral";
  if (has("long-road") && has("spring") && has("lean")) return "long-road-home";
  if (has("mirror") && closeInTime) return "mirror-at-dusk";
  if (a.restDay && b.restDay && has("spring")) return "still-water";
  if (emberVigil) return "ember-vigil";
  if (feast) return "feast-seal";
  return null;
}

// ── The composed spec ──

export type HalfWeight = "lean" | "even" | "feast" | "open";

export type SigilHalf = {
  inked: boolean;
  weight: HalfWeight;
};

export type SigilSpec = {
  completed: boolean;
  moss: SigilHalf; // Matthew
  ember: SigilHalf; // Kennedy
  radicals: Hall[];
  ornaments: SplitFamily[];
  newMark: boolean;
  chords: ChordId[];
  legendary: LegendaryId | null;
  tier: SigilTier;
  seed: number;
};

function halfFor(k: KeeperDay): SigilHalf {
  if (!k.loggedAny) return { inked: false, weight: "open" };
  if (k.targetCalories == null) return { inked: true, weight: "even" };
  if (k.calories > k.targetCalories) return { inked: true, weight: "feast" };
  if (k.calories <= k.targetCalories * 0.97)
    return { inked: true, weight: "lean" };
  return { inked: true, weight: "even" };
}

function seedFor(day: string): number {
  let hash = 0;
  for (const ch of day) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return hash;
}

export function composeSigil(input: {
  day: string;
  moss: KeeperDay;
  ember: KeeperDay;
  firstPage?: boolean;
}): SigilSpec {
  const { day, moss, ember } = input;
  const completed = moss.loggedAny && ember.loggedAny;
  const chords = chordsForDay(moss, ember);
  const legendary = legendaryForDay({
    a: moss,
    b: ember,
    chords,
    fullMoon: moonIsFull(day),
    firstPage: input.firstPage ?? false,
  });

  const radicals = [...new Set([...moss.halls, ...ember.halls])].slice(0, 6);
  const ornaments = [
    ...new Set(
      [moss.training.primaryFamily, ember.training.primaryFamily].filter(
        (f): f is SplitFamily => f != null && f !== "rest",
      ),
    ),
  ];

  return {
    completed,
    moss: halfFor(moss),
    ember: halfFor(ember),
    radicals,
    ornaments,
    newMark: moss.training.prCount + ember.training.prCount > 0,
    chords,
    legendary,
    tier: tierFor({ completed, chordCount: chords.length, legendary }),
    seed: seedFor(day),
  };
}
