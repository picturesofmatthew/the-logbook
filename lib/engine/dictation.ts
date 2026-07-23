// The "speak your day" brain — turn a spoken paragraph into a structured,
// editable day. Pure + unit-tested. It does NOT reinvent parsing: it routes
// clauses and then delegates to the existing food/workout parsers.
//
// The hard part is that "," and "and" are simultaneously life-event separators
// and the *item* separators the food/workout parsers split on. So we extract
// the rituals first (anchored regexes, spliced out), then split the remainder
// and cut each segment into its food half and its workout half.
//
// Nothing here is ever the final word — everything it returns is shown in a
// review card and edited before a single "seal it" tap. The classifier only
// has to get close; `clauses[]` is the trace we tune from real transcripts.

import { parseFoodLine, type ParsedItem } from "./food-parse";
import { parseWorkoutLine, type ParsedSet } from "./workout-parse";
import { mealForHour, type Meal } from "../meals";
import { wordsToNumber } from "./words-to-number";

export type ClauseRoute = "food" | "workout" | "water" | "weight" | "mood" | "note";
export type ClassifiedClause = { raw: string; route: ClauseRoute; mealCue?: Meal };
export type DictationFood = { meal: Meal; line: string; items: ParsedItem[] };
export type DictationWorkout = { title: string; sets: ParsedSet[] };
export type DictationRituals = {
  waterCups: number | null; // "three waters" -> 3   (clamped 0..20)
  weightLb: number | null; //  "weighed 172" -> 172  (kept only if 60..600)
  mood: string | null; //      "feeling good" -> "good" (<=8 chars)
};
export type DayDictation = {
  foods: DictationFood[]; //     grouped by resolved meal
  workout: DictationWorkout | null;
  rituals: DictationRituals;
  note: string | null; //        leftover / unclassified text (<=240)
  clauses: ClassifiedClause[]; // full routing trace — the tuning surface
};

// Verbs that mean "a workout" on their own — no nearby number required.
const STRONG_VERBS = [
  "bench", "benched", "squat", "squats", "squatted", "deadlift", "deadlifts",
  "deadlifted", "curl", "curls", "curled", "lunge", "lunges", "lunged",
  "plank", "planks", "planked", "pushup", "pushups", "pullup", "pullups",
  "burpee", "burpees", "ohp", "jog", "jogged", "treadmill", "elliptical",
  "rowed",
];
// Verbs that are everyday words too ("pressed juice", "a walk to the store"),
// so they only count as a workout when a number is in the same segment.
const AMBIG_VERBS = [
  "press", "pressed", "row", "run", "ran", "walk", "walked", "bike", "biked",
  "cycle", "cycled", "swim", "swam", "hike", "hiked", "lift", "lifted",
];

const STRONG_RE = new RegExp(`\\b(?:${STRONG_VERBS.join("|")})\\b`);
const AMBIG_RE = new RegExp(`\\b(?:${AMBIG_VERBS.join("|")})\\b`);
// A rep/weight/time signature: "135x5", "135 for 5", "20 min", "185 lbs".
const REP_PAT =
  /\b\d+(?:\.\d+)?\s*(?:[x×@]\s*\d+|(?:for|by)\s+\d+|reps?|sets?|lbs?|pounds?|kg|mins?|minutes?)\b/;

// Weight must be anchored to a weigh-verb, within a short window, so a 185
// squat is never mistaken for a bodyweight. Window kept tight (12 non-digits)
// so "weighed then benched 135" doesn't grab the bench weight.
const WEIGHT_RE = /\b(?:weigh(?:ed|ing|s|t)?|scale)\b[^\d]{0,12}(\d{2,3}(?:\.\d)?)/;
// "drank 3 waters" / "3 glasses" / "2 bottles" — glasses/bottles/waters are
// always water; the optional leading "drank" is consumed so no stub remains.
const WATER_RE = /\b(?:drank\s+)?(\d{1,2})\s*(?:glass(?:es)?|bottles?|waters?)\b/;
// "drank 3 cups" counts as water (a bare "cup" elsewhere stays food).
const WATER_CUPS_RE = /\bdrank\s+(\d{1,2})\s*cups?\b/;
// One adjective after a feel/mood verb; the rest of the clause becomes note.
const MOOD_RE =
  /\b(?:feel(?:ing|s)?|felt|mood(?:\s+(?:is|was))?)\s+(?:really\s+|pretty\s+|super\s+|kinda\s+|so\s+|a\s+bit\s+|a\s+little\s+)?([a-z]+)([^.,;\n]*)/;

const MEAL_CUE = /\bfor\s+(breakfast|lunch|dinner|snacks?|brunch)\b/;

function clampWater(n: number): number {
  return Math.max(0, Math.min(20, Math.round(n)));
}

function matchIndex(s: string, re: RegExp): number | undefined {
  return s.match(re)?.index;
}

// Where does the workout half of a segment begin? -1 = no workout in it.
function workoutAnchorIndex(seg: string): number {
  let min = -1;
  const consider = (i?: number) => {
    if (i != null && i >= 0 && (min < 0 || i < min)) min = i;
  };
  consider(matchIndex(seg, STRONG_RE));
  if (/\d/.test(seg)) consider(matchIndex(seg, AMBIG_RE));
  consider(matchIndex(seg, REP_PAT));
  return min;
}

// Cut a segment into its food half and workout half. Most segments are purely
// one or the other (anchor at 0 or -1); the cut only bites on a run-on with no
// spoken boundary ("two eggs and toast benched 135").
function splitFoodWorkout(seg: string): { food: string; workout: string } {
  const idx = workoutAnchorIndex(seg);
  if (idx < 0) return { food: seg, workout: "" };
  if (idx === 0) return { food: "", workout: seg };
  return {
    food: seg.slice(0, idx).replace(/[,;]+\s*$/, "").trim(),
    workout: seg.slice(idx).trim(),
  };
}

function resolveMeal(text: string, hour: number): { meal: Meal; line: string } {
  const m = text.match(MEAL_CUE);
  if (!m) return { meal: mealForHour(hour), line: text.trim() };
  const cue = m[1];
  const meal: Meal =
    cue.startsWith("snack") ? "snacks" : cue === "brunch" ? "breakfast" : (cue as Meal);
  const line = text.replace(MEAL_CUE, " ").replace(/\s+/g, " ").trim();
  return { meal, line };
}

export function parseDayDictation(
  transcript: string,
  opts?: { hour?: number },
): DayDictation {
  const hour = opts?.hour ?? new Date().getHours();
  const clauses: ClassifiedClause[] = [];
  const rituals: DictationRituals = { waterCups: null, weightLb: null, mood: null };
  const noteParts: string[] = [];

  // A. Normalize: spoken numbers -> digits, and "135 for 5" -> "135x5" so the
  // existing workout parser (which only knows x/×/@) can read spoken reps.
  let work = wordsToNumber(transcript.toLowerCase());
  work = work.replace(/\b(\d+(?:\.\d+)?)\s*(?:for|by|times)\s*(\d+)\b/g, "$1x$2");
  work = work.replace(/\s+/g, " ").trim();

  // B. Extract rituals and splice them out so nothing is double-counted.
  work = work.replace(WEIGHT_RE, (m, n) => {
    const w = Number(n);
    if (w >= 60 && w <= 600) {
      rituals.weightLb = w;
      clauses.push({ raw: m.trim(), route: "weight" });
      return " ";
    }
    return m;
  });
  const beforeWater = work;
  work = work.replace(WATER_RE, (m, n) => {
    rituals.waterCups = clampWater(Number(n));
    clauses.push({ raw: m.trim(), route: "water" });
    return " ";
  });
  if (work === beforeWater) {
    work = work.replace(WATER_CUPS_RE, (m, n) => {
      rituals.waterCups = clampWater(Number(n));
      clauses.push({ raw: m.trim(), route: "water" });
      return " ";
    });
  }
  work = work.replace(MOOD_RE, (m, adj, rest) => {
    rituals.mood = String(adj).slice(0, 8);
    clauses.push({ raw: m.trim(), route: "mood" });
    const r = String(rest).trim();
    if (r) noteParts.push(r);
    return " ";
  });
  work = work.replace(/\s+/g, " ").trim();

  // C. Split on strong boundaries (comma included — multi-item food is rejoined
  // per meal, so this is safe).
  const segments = work
    .split(/[.,;\n]+|\bthen\b|\balso\b/)
    .map((s) => s.trim())
    .filter(Boolean);

  // D/E. Classify each segment, delegate to the existing parsers.
  const workoutSegs: string[] = [];
  const foodByMeal = new Map<Meal, string[]>();
  for (const seg of segments) {
    const cut = splitFoodWorkout(seg);
    if (cut.workout) {
      workoutSegs.push(cut.workout);
      clauses.push({ raw: cut.workout, route: "workout" });
    }
    if (cut.food) {
      const { meal, line } = resolveMeal(cut.food, hour);
      if (line && parseFoodLine(line).length > 0) {
        clauses.push({ raw: cut.food, route: "food", mealCue: meal });
        const arr = foodByMeal.get(meal) ?? [];
        arr.push(line);
        foodByMeal.set(meal, arr);
      } else if (line) {
        noteParts.push(line);
        clauses.push({ raw: cut.food, route: "note" });
      }
    }
  }

  const foods: DictationFood[] = [];
  for (const [meal, lines] of foodByMeal) {
    const line = lines.join(", ");
    foods.push({ meal, line, items: parseFoodLine(line) });
  }

  let workout: DictationWorkout | null = null;
  if (workoutSegs.length) {
    const { sets, titleGuess } = parseWorkoutLine(workoutSegs.join(", "));
    if (sets.length) workout = { title: titleGuess ?? "Workout", sets };
  }

  const note = noteParts.length ? noteParts.join(". ").slice(0, 240) : null;
  return { foods, workout, rituals, note, clauses };
}
