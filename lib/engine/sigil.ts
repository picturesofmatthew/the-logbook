// The Sigil Engine — the heart of the app. Pure functions.
//
// Each keeper's logged day composes half a sigil; the halves join into a seal
// unique to that day. Aligned conditions strike CHORDS; chords raise the
// seal's tier; named combinations are LEGENDARY — secret until first earned.
//
// EXTENSIBILITY (the point of this file's shape): chords and legendaries are
// table-driven registries. To add a sigil component you add ONE entry — see
// the "HOW TO ADD" notes on CHORD_REGISTRY and LEGENDARY_REGISTRY. Detection,
// the CHORDS/LEGENDARIES lookups, and the compendium all derive from them.
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

const LIFT_FAMILIES: SplitFamily[] = ["push", "pull", "legs", "full"];

const both = (a: KeeperDay, b: KeeperDay, f: (k: KeeperDay) => boolean) =>
  f(a) && f(b);

export type ChordDef = {
  id: ChordId;
  name: string;
  line: string;
  detect: (a: KeeperDay, b: KeeperDay) => boolean;
  subsumes?: ChordId[]; // lesser chords suppressed when this one strikes
};

// HOW TO ADD A CHORD:
//   1) add its id to the ChordId union above,
//   2) append a ChordDef here (array order = seat order on the ring).
// Use `subsumes` when a richer chord should hide a lesser one it implies.
export const CHORD_REGISTRY: ChordDef[] = [
  {
    id: "lean",
    name: "the Lean Chord",
    line: "both under target",
    detect: (a, b) =>
      both(a, b, (k) => k.targetCalories != null && k.calories > 0) &&
      both(a, b, (k) => k.calories <= (k.targetCalories as number)),
  },
  {
    id: "iron",
    name: "the Iron Chord",
    line: "both hit protein",
    detect: (a, b) =>
      both(a, b, (k) => k.targetProteinG != null) &&
      both(a, b, (k) => k.proteinG >= (k.targetProteinG as number)),
  },
  {
    id: "twin-split",
    name: "the Twin Split",
    line: "same split, same day",
    detect: (a, b) =>
      a.training.primaryFamily != null &&
      a.training.primaryFamily === b.training.primaryFamily &&
      LIFT_FAMILIES.includes(a.training.primaryFamily),
    subsumes: ["anvil"],
  },
  {
    id: "anvil",
    name: "the Anvil",
    line: "both lifted",
    detect: (a, b) => both(a, b, (k) => k.training.volumeLb > 0),
  },
  {
    id: "long-road",
    name: "the Long Road",
    line: "both did cardio",
    detect: (a, b) => both(a, b, (k) => k.training.cardioMin >= 10),
  },
  {
    id: "spring",
    name: "the Spring",
    line: "both watered",
    detect: (a, b) => both(a, b, (k) => k.waterCups >= 8),
  },
  {
    id: "green",
    name: "the Green Chord",
    line: "both ate from the earth",
    detect: (a, b) => both(a, b, (k) => k.halls.includes("produce")),
  },
  {
    id: "hearth",
    name: "the Hearth Chord",
    line: "both cooked",
    detect: (a, b) => both(a, b, (k) => k.halls.includes("dishes")),
  },
  {
    id: "mirror",
    name: "the Mirror",
    line: "the same mood, twice",
    detect: (a, b) => a.mood != null && a.mood === b.mood,
  },
  {
    id: "scribe",
    name: "the Scribe's Chord",
    line: "both wrote it down",
    detect: (a, b) => both(a, b, (k) => k.wroteNote),
  },
  {
    id: "twin-peaks",
    name: "the Twin Peaks",
    line: "two records, one day",
    detect: (a, b) => both(a, b, (k) => k.training.prCount >= 1),
    subsumes: ["new-mark"],
  },
  {
    id: "new-mark",
    name: "the New Mark",
    line: "a record fell",
    detect: (a, b) => a.training.prCount + b.training.prCount >= 1,
  },
];

// Backward-compatible lookup, derived from the registry.
export const CHORDS: Record<ChordId, { name: string; line: string }> =
  Object.fromEntries(
    CHORD_REGISTRY.map((c) => [c.id, { name: c.name, line: c.line }]),
  ) as Record<ChordId, { name: string; line: string }>;

export function chordsForDay(a: KeeperDay, b: KeeperDay): ChordId[] {
  // Chords are two-player by definition: no closed ring, no music.
  if (!a.loggedAny || !b.loggedAny) return [];
  const struck = CHORD_REGISTRY.filter((c) => c.detect(a, b));
  const suppressed = new Set<ChordId>(struck.flatMap((c) => c.subsumes ?? []));
  return struck.filter((c) => !suppressed.has(c.id)).map((c) => c.id);
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

// The signals each legendary's `detect` reads. Derived once per composition.
// Add a field here (and set it in buildContext) when a new legendary needs a
// signal the current context doesn't expose.
export type LegendaryContext = {
  a: KeeperDay;
  b: KeeperDay;
  chords: ChordId[];
  fullMoon: boolean;
  firstPage: boolean;
  has: (c: ChordId) => boolean;
  emberVigil: boolean; // both moods low
  feast: boolean; // both over target
  closeInTime: boolean; // both first-logged within an hour
  bothTrained: boolean;
};

export type LegendaryDef = {
  id: LegendaryId;
  name: string;
  epigraph: string;
  detect: (ctx: LegendaryContext) => boolean;
};

function buildContext(input: {
  a: KeeperDay;
  b: KeeperDay;
  chords: ChordId[];
  fullMoon: boolean;
  firstPage: boolean;
}): LegendaryContext {
  const { a, b, chords, fullMoon, firstPage } = input;
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
  return {
    a,
    b,
    chords,
    fullMoon,
    firstPage,
    has: (c) => chords.includes(c),
    emberVigil,
    feast,
    closeInTime,
    bothTrained,
  };
}

// HOW TO ADD A LEGENDARY:
//   1) add its id to the LegendaryId union above,
//   2) insert a LegendaryDef here at the right PRIORITY (order matters —
//      sentiment first, then rarity; the first matching entry wins).
// If it needs a new signal, add a field to LegendaryContext + buildContext.
export const LEGENDARY_REGISTRY: LegendaryDef[] = [
  {
    id: "first-page",
    name: "The First Page",
    epigraph: "The day the book began.",
    detect: (c) => c.firstPage,
  },
  {
    id: "quiet-moon",
    name: "The Quiet Moon",
    epigraph: "A hard day, kept, under a full moon.",
    detect: (c) => c.emberVigil && c.fullMoon,
  },
  {
    id: "twin-foxes",
    name: "The Twin Foxes",
    epigraph: "The grind, honored.",
    detect: (c) => c.has("lean") && c.has("twin-split") && c.has("iron"),
  },
  {
    id: "twin-peaks",
    name: "The Twin Peaks",
    epigraph: "Two records, one day.",
    detect: (c) => c.has("twin-peaks"),
  },
  {
    id: "green-cathedral",
    name: "The Green Cathedral",
    epigraph: "The clean day.",
    detect: (c) => c.has("green") && c.has("spring") && c.bothTrained,
  },
  {
    id: "long-road-home",
    name: "The Long Road Home",
    epigraph: "Endurance, shared.",
    detect: (c) => c.has("long-road") && c.has("spring") && c.has("lean"),
  },
  {
    id: "mirror-at-dusk",
    name: "The Mirror at Dusk",
    epigraph: "Timing as tenderness.",
    detect: (c) => c.has("mirror") && c.closeInTime,
  },
  {
    id: "still-water",
    name: "The Still Water",
    epigraph: "Recovery is a discipline.",
    detect: (c) => c.a.restDay && c.b.restDay && c.has("spring"),
  },
  {
    id: "ember-vigil",
    name: "The Ember Vigil",
    epigraph: "Showing up on a hard day is its own magic.",
    detect: (c) => c.emberVigil,
  },
  {
    id: "feast-seal",
    name: "The Feast Seal",
    epigraph: "A feast together is celebrated, never punished.",
    detect: (c) => c.feast,
  },
];

// Backward-compatible lookup, derived from the registry.
export const LEGENDARIES: Record<
  LegendaryId,
  { name: string; epigraph: string }
> = Object.fromEntries(
  LEGENDARY_REGISTRY.map((l) => [l.id, { name: l.name, epigraph: l.epigraph }]),
) as Record<LegendaryId, { name: string; epigraph: string }>;

export function legendaryForDay(input: {
  a: KeeperDay;
  b: KeeperDay;
  chords: ChordId[];
  fullMoon: boolean;
  firstPage: boolean;
}): LegendaryId | null {
  // One legendary per day; sentiment first, then rarity (registry order).
  if (!input.a.loggedAny || !input.b.loggedAny) return null;
  const ctx = buildContext(input);
  for (const def of LEGENDARY_REGISTRY) {
    if (def.detect(ctx)) return def.id;
  }
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
  // Latent signals from the real day — the seal reflects the world, not just
  // the logs. The renderer reads these directly instead of guessing them.
  moon: boolean; // a full moon that night
  water: boolean; // both keepers well-watered
  lowMood: boolean; // a hard day for at least one of you — honored, never scolded
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
    moon: moonIsFull(day),
    water: moss.waterCups >= 8 && ember.waterCups >= 8,
    lowMood: isLowMood(moss.mood) || isLowMood(ember.mood),
  };
}
