// Parse a written workout into sets — "bench 185x8x3, squat 225x5x5",
// "run 30min", "pullups bw x12 x3". Pure and unit-tested. The Training Log's
// existing engine (splitFamilyFor, WorkoutSet) does the rest.

import { splitFamilyFor, type SplitFamily, type WorkoutSet } from "./training";

export type ParsedSet = {
  kind: "lift" | "cardio";
  exercise: string;
  weightLb: number | null; // null = bodyweight
  reps: number | null;
  minutes: number | null;
};

// weight can be a number or "bw" (bodyweight); reps; optional set count.
const LIFT_RE = /^(.*?)\s*(bw|\d+(?:\.\d+)?)\s*[x×@]\s*(\d+)(?:\s*[x×]\s*(\d+))?\s*$/i;
// "name 185 8" — space-separated weight then reps.
const LIFT_SPACES_RE = /^(.+?)\s+(\d+(?:\.\d+)?)\s+(\d+)\s*$/;
// "run 30min" / "30 min" / "45m".
const CARDIO_RE = /^(.*?)\s*(\d+(?:\.\d+)?)\s*(?:mins?|m)\s*$/i;

function clean(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

// Parse one segment. `prev` supplies the exercise when a segment is just sets
// ("185x8"), so "bench 185x8, 185x6" reads as two sets of bench.
function parseSegment(
  seg: string,
  prev: string,
): { exercise: string; sets: ParsedSet[] } | null {
  // Cardio first (it carries a time unit, so it won't be mistaken for a lift).
  const cardio = seg.match(CARDIO_RE);
  if (cardio) {
    const name = clean(cardio[1]) || prev;
    const minutes = Number(cardio[2]);
    if (name && minutes > 0) {
      return {
        exercise: name,
        sets: [{ kind: "cardio", exercise: name, weightLb: null, reps: null, minutes }],
      };
    }
  }

  // A bare cardio word with no number ("rest", "walk") — skip (not a set).
  const lift = seg.match(LIFT_RE) ?? spacesToLift(seg);
  if (lift) {
    const name = clean(lift[1]) || prev;
    if (!name) return null;
    const rawWeight = lift[2].toLowerCase();
    const weightLb = rawWeight === "bw" ? null : Number(rawWeight);
    const reps = Number(lift[3]);
    const count = lift[4] ? Number(lift[4]) : 1;
    if (!(reps >= 1) || (weightLb != null && !(weightLb > 0))) return null;
    const one: ParsedSet = { kind: "lift", exercise: name, weightLb, reps, minutes: null };
    return { exercise: name, sets: Array.from({ length: Math.min(count, 30) }, () => ({ ...one })) };
  }

  return null;
}

// Adapt the space-separated form to the same capture groups as LIFT_RE.
function spacesToLift(seg: string): RegExpMatchArray | null {
  const m = seg.match(LIFT_SPACES_RE);
  if (!m) return null;
  // [full, name, weight, reps, setCount] — no set count in this form.
  return [m[0], m[1], m[2], m[3], undefined] as unknown as RegExpMatchArray;
}

const FAMILY_TITLES: Record<SplitFamily, string> = {
  push: "Push",
  pull: "Pull",
  legs: "Legs",
  full: "Full Body",
  cardio: "Cardio",
  mobility: "Mobility",
  rest: "Rest",
};

export function parseWorkoutLine(text: string): {
  sets: ParsedSet[];
  titleGuess?: string;
} {
  const segments = text
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const sets: ParsedSet[] = [];
  let prev = "";
  for (const seg of segments) {
    const parsed = parseSegment(seg, prev);
    if (parsed) {
      prev = parsed.exercise;
      sets.push(...parsed.sets);
    }
  }

  if (sets.length === 0) return { sets };

  // Guess the split from the exercise names — feeding them as the "title" lets
  // splitFamilyFor's keyword match (bench→push, squat→legs, …) do the work.
  const family = splitFamilyFor({
    title: sets.map((s) => s.exercise).join(" "),
    sets: sets as WorkoutSet[],
  });
  return { sets, titleGuess: FAMILY_TITLES[family] };
}
