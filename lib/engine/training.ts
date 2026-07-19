// The training log's brain — pure functions.
//
// Workouts are real entries (split title + sets of weight x reps, or cardio
// minutes). The engine reads three things from a day: split family, total
// volume, and personal records. A PR is "a New Mark" — celebrated, never
// demanded; a rest day is a legitimate entry, not an absence.

export type SetKind = "lift" | "cardio";

export type WorkoutSet = {
  kind: SetKind;
  exercise: string;
  weightLb: number | null; // null = bodyweight
  reps: number | null;
  minutes: number | null;
};

export type Workout = {
  title: string;
  sets: WorkoutSet[];
};

export type SplitFamily =
  | "push"
  | "pull"
  | "legs"
  | "full"
  | "cardio"
  | "mobility"
  | "rest";

export const SPLIT_PRESETS: { label: string; family: SplitFamily }[] = [
  { label: "Chest & Triceps", family: "push" },
  { label: "Back & Biceps", family: "pull" },
  { label: "Shoulders", family: "push" },
  { label: "Legs", family: "legs" },
  { label: "Push", family: "push" },
  { label: "Pull", family: "pull" },
  { label: "Full Body", family: "full" },
  { label: "Cardio", family: "cardio" },
  { label: "Mobility", family: "mobility" },
  { label: "Rest", family: "rest" },
];

const FAMILY_KEYWORDS: { family: SplitFamily; words: string[] }[] = [
  { family: "rest", words: ["rest", "off day"] },
  {
    family: "cardio",
    words: ["cardio", "run", "jog", "bike", "cycling", "swim", "walk", "hike", "rowing"],
  },
  { family: "mobility", words: ["mobility", "yoga", "stretch"] },
  {
    family: "legs",
    words: ["leg", "squat", "quad", "hamstring", "glute", "calf", "calves"],
  },
  {
    family: "pull",
    words: ["pull", "back", "bicep", "row", "lat", "deadlift"],
  },
  {
    family: "push",
    words: ["push", "chest", "tricep", "bench", "shoulder", "press", "delt"],
  },
  { family: "full", words: ["full", "total", "upper", "lower", "body"] },
];

// Title first, sets as fallback: "Chest & Triceps" -> push even if it also
// hits a "press" keyword later in the list (first match wins by list order,
// which puts the most specific families before "full").
export function splitFamilyFor(workout: Workout): SplitFamily {
  const title = workout.title.toLowerCase();
  for (const { family, words } of FAMILY_KEYWORDS) {
    if (words.some((w) => title.includes(w))) return family;
  }
  const hasLift = workout.sets.some((s) => s.kind === "lift");
  const hasCardio = workout.sets.some((s) => s.kind === "cardio");
  if (hasLift) return "full";
  if (hasCardio) return "cardio";
  return "rest";
}

export function totalVolumeLb(sets: WorkoutSet[]): number {
  return sets
    .filter((s) => s.kind === "lift")
    .reduce((sum, s) => sum + (s.weightLb ?? 0) * (s.reps ?? 0), 0);
}

export function cardioMinutes(sets: WorkoutSet[]): number {
  return sets
    .filter((s) => s.kind === "cardio")
    .reduce((sum, s) => sum + (s.minutes ?? 0), 0);
}

// Epley estimated one-rep max. Bodyweight sets (weight null) have no 1RM.
export function est1Rm(weightLb: number, reps: number): number {
  if (reps <= 1) return weightLb;
  return weightLb * (1 + reps / 30);
}

export function normalizeExercise(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

// Best est. 1RM per exercise from a pile of historical sets.
export function bestByExercise(sets: WorkoutSet[]): Map<string, number> {
  const best = new Map<string, number>();
  for (const s of sets) {
    if (s.kind !== "lift" || s.weightLb == null || !s.reps) continue;
    const key = normalizeExercise(s.exercise);
    const rm = est1Rm(s.weightLb, s.reps);
    if (rm > (best.get(key) ?? 0)) best.set(key, rm);
  }
  return best;
}

// Exercises where today strictly beat all prior history: the New Marks.
export function newMarks(
  todaySets: WorkoutSet[],
  history: Map<string, number>,
): string[] {
  const today = bestByExercise(todaySets);
  const marks: string[] = [];
  for (const [key, rm] of today) {
    const prior = history.get(key);
    if (prior != null && rm > prior) marks.push(key);
  }
  return marks;
}

export type TrainingSummary = {
  trained: boolean;
  families: SplitFamily[];
  primaryFamily: SplitFamily | null;
  volumeLb: number;
  cardioMin: number;
  prCount: number;
};

export function trainingSummary(
  workouts: Workout[],
  historyBest: Map<string, number>,
): TrainingSummary {
  const allSets = workouts.flatMap((w) => w.sets);
  const families = [...new Set(workouts.map(splitFamilyFor))];
  const volumeLb = totalVolumeLb(allSets);
  const cardioMin = cardioMinutes(allSets);
  return {
    trained: workouts.length > 0 && (volumeLb > 0 || cardioMin > 0),
    families,
    primaryFamily: families[0] ?? null,
    volumeLb,
    cardioMin,
    prCount: newMarks(allSets, historyBest).length,
  };
}
