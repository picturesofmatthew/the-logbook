import {
  and,
  asc,
  countDistinct,
  desc,
  eq,
  gte,
  inArray,
  lte,
  max,
  min,
} from "drizzle-orm";
import { db } from "@/db";
import {
  beingArrivals,
  dayMeta,
  entries,
  foods,
  pet,
  sigilDiscoveries,
  targets,
  weighIns,
  workouts,
  workoutSets,
} from "@/db/schema";
import { PROFILES, type Profile } from "@/lib/auth";
import { addDays, diffDays } from "@/lib/dates";
import { bestByExercise, type WorkoutSet } from "@/lib/engine/training";
import type { JournalEntry, Specimen, Target } from "@/lib/meals";

export type JournalDay = Record<
  Profile,
  { entries: JournalEntry[]; target: Target }
>;

export async function getJournalDay(day: string): Promise<JournalDay> {
  const rows = await db
    .select({ entry: entries, food: foods })
    .from(entries)
    .innerJoin(foods, eq(entries.foodId, foods.id))
    .where(eq(entries.day, day))
    .orderBy(entries.loggedAt);

  const result = {} as JournalDay;
  for (const profile of PROFILES) {
    const [target] = await db
      .select()
      .from(targets)
      .where(
        and(eq(targets.profileId, profile), lte(targets.effectiveDate, day)),
      )
      .orderBy(desc(targets.effectiveDate), desc(targets.id))
      .limit(1);

    result[profile] = {
      target: target
        ? {
            calories: target.calories,
            proteinG: target.proteinG,
            carbsG: target.carbsG,
            fatG: target.fatG,
          }
        : null,
      entries: rows
        .filter((r) => r.entry.profileId === profile)
        .map((r) => ({
          id: r.entry.id,
          meal: r.entry.meal,
          servings: r.entry.servings,
          food: r.food as Specimen,
        })),
    };
  }
  return result;
}

export async function getAllSpecimens(): Promise<Specimen[]> {
  const rows = await db.select().from(foods).orderBy(foods.name);
  return rows as Specimen[];
}

export type PetStateRaw = {
  name: string | null;
  adoptedAt: Date;
  lifetimeDays: number;
  currentRun: number;
  loggedToday: Profile[];
  daysSinceAnyEntry: number | null;
};

export async function getPetState(today: string): Promise<PetStateRaw> {
  const [petRow] = await db.select().from(pet).where(eq(pet.id, 1));

  const dayRows = await db
    .select({ day: entries.day, n: countDistinct(entries.profileId) })
    .from(entries)
    .groupBy(entries.day);

  const bothDays = new Set(
    dayRows.filter((r) => Number(r.n) >= 2).map((r) => r.day),
  );
  const lifetimeDays = bothDays.size;

  // Run of consecutive both-logged days. An unfinished today doesn't break
  // it — the run just waits.
  let currentRun = 0;
  let cursor = bothDays.has(today) ? today : addDays(today, -1);
  while (bothDays.has(cursor)) {
    currentRun += 1;
    cursor = addDays(cursor, -1);
  }

  const todayRows = await db
    .selectDistinct({ p: entries.profileId })
    .from(entries)
    .where(eq(entries.day, today));
  const loggedToday = todayRows
    .map((r) => r.p)
    .filter((p): p is Profile => PROFILES.includes(p as Profile));

  const lastDay = dayRows.reduce((mx, r) => (r.day > mx ? r.day : mx), "");
  const daysSinceAnyEntry = lastDay ? diffDays(today, lastDay) : null;

  return {
    name: petRow?.name ?? null,
    adoptedAt: petRow?.adoptedAt ?? new Date(),
    lifetimeDays,
    currentRun,
    loggedToday,
    daysSinceAnyEntry,
  };
}

export type DayMetaRow = {
  training: "lift" | "cardio" | "rest" | null;
  waterCups: number;
  note: string | null;
  mood: string | null;
};

export async function getDayExtras(day: string): Promise<{
  meta: Record<Profile, DayMetaRow>;
  newSpecimens: number;
}> {
  const metaRows = await db.select().from(dayMeta).where(eq(dayMeta.day, day));

  const firstDays = await db
    .select({ foodId: entries.foodId })
    .from(entries)
    .groupBy(entries.foodId)
    .having(eq(min(entries.day), day));
  const newSpecimens = firstDays.length;

  const meta = {} as Record<Profile, DayMetaRow>;
  for (const profile of PROFILES) {
    const row = metaRows.find((m) => m.profileId === profile);
    meta[profile] = {
      training: row?.training ?? null,
      waterCups: row?.waterCups ?? 0,
      note: row?.note ?? null,
      mood: row?.mood ?? null,
    };
  }
  return { meta, newSpecimens };
}

export async function getWeighIn(
  profile: Profile,
  day: string,
): Promise<number | null> {
  const [row] = await db
    .select({ weightLb: weighIns.weightLb })
    .from(weighIns)
    .where(and(eq(weighIns.profileId, profile), eq(weighIns.day, day)));
  return row?.weightLb ?? null;
}

export type WeighInPoint = { day: string; weightLb: number };

export async function getAllWeighIns(): Promise<
  Record<Profile, WeighInPoint[]>
> {
  const rows = await db
    .select()
    .from(weighIns)
    .orderBy(asc(weighIns.day));
  const result = {} as Record<Profile, WeighInPoint[]>;
  for (const profile of PROFILES) {
    result[profile] = rows
      .filter((r) => r.profileId === profile)
      .map((r) => ({ day: r.day, weightLb: r.weightLb }));
  }
  return result;
}

export type DailyTotal = { day: string; calories: number; proteinG: number };

// Per-person daily calorie/protein sums since a date — for weekly averages.
export async function getDailyTotalsSince(
  sinceDay: string,
): Promise<Record<Profile, DailyTotal[]>> {
  const rows = await db
    .select({ entry: entries, food: foods })
    .from(entries)
    .innerJoin(foods, eq(entries.foodId, foods.id))
    .where(gte(entries.day, sinceDay));

  const result = {} as Record<Profile, DailyTotal[]>;
  for (const profile of PROFILES) {
    const byDay = new Map<string, DailyTotal>();
    for (const r of rows) {
      if (r.entry.profileId !== profile) continue;
      const t = byDay.get(r.entry.day) ?? {
        day: r.entry.day,
        calories: 0,
        proteinG: 0,
      };
      t.calories += r.food.calories * r.entry.servings;
      t.proteinG += r.food.proteinG * r.entry.servings;
      byDay.set(r.entry.day, t);
    }
    result[profile] = [...byDay.values()].sort((a, b) =>
      a.day.localeCompare(b.day),
    );
  }
  return result;
}

// Marks for the stamp calendar: which days that month were both-logged,
// and who trained on which day.
export async function getMonthMarks(monthPrefix: string): Promise<{
  bothDays: Set<string>;
  training: Record<Profile, Record<string, string>>;
}> {
  const start = `${monthPrefix}-01`;
  const end = `${monthPrefix}-31`;
  const dayRows = await db
    .select({ day: entries.day, n: countDistinct(entries.profileId) })
    .from(entries)
    .where(and(gte(entries.day, start), lte(entries.day, end)))
    .groupBy(entries.day);
  const bothDays = new Set(
    dayRows.filter((r) => Number(r.n) >= 2).map((r) => r.day),
  );

  const metaRows = await db
    .select()
    .from(dayMeta)
    .where(and(gte(dayMeta.day, start), lte(dayMeta.day, end)));
  const training = {} as Record<Profile, Record<string, string>>;
  for (const profile of PROFILES) {
    training[profile] = {};
    for (const m of metaRows) {
      if (m.profileId === profile && m.training && m.training !== "rest") {
        training[profile][m.day] = m.training;
      }
    }
  }
  return { bothDays, training };
}

// Earliest log moment per keeper for a day — the Mirror at Dusk listens.
export async function getFirstLogTimes(
  day: string,
): Promise<Record<Profile, number | null>> {
  const rows = await db
    .select({ p: entries.profileId, first: min(entries.loggedAt) })
    .from(entries)
    .where(eq(entries.day, day))
    .groupBy(entries.profileId);
  const result = {} as Record<Profile, number | null>;
  for (const profile of PROFILES) {
    const row = rows.find((r) => r.p === profile);
    result[profile] = row?.first ? new Date(row.first).getTime() : null;
  }
  return result;
}

// ── The Training Log ──

export type WorkoutView = {
  id: number;
  title: string;
  note: string | null;
  sets: {
    kind: "lift" | "cardio";
    exercise: string;
    setIndex: number;
    weightLb: number | null;
    reps: number | null;
    minutes: number | null;
  }[];
};

export async function getWorkoutsForDay(
  day: string,
): Promise<Record<Profile, WorkoutView[]>> {
  const workoutRows = await db
    .select()
    .from(workouts)
    .where(eq(workouts.day, day))
    .orderBy(asc(workouts.createdAt));

  const setRows =
    workoutRows.length > 0
      ? await db
          .select()
          .from(workoutSets)
          .where(
            inArray(
              workoutSets.workoutId,
              workoutRows.map((w) => w.id),
            ),
          )
          .orderBy(asc(workoutSets.id))
      : [];

  const result = {} as Record<Profile, WorkoutView[]>;
  for (const profile of PROFILES) {
    result[profile] = workoutRows
      .filter((w) => w.profileId === profile)
      .map((w) => ({
        id: w.id,
        title: w.title,
        note: w.note,
        sets: setRows
          .filter((s) => s.workoutId === w.id)
          .map((s) => ({
            kind: s.kind,
            exercise: s.exercise,
            setIndex: s.setIndex,
            weightLb: s.weightLb,
            reps: s.reps,
            minutes: s.minutes,
          })),
      }));
  }
  return result;
}

// History for PR detection (best est. 1RM per exercise from sets logged
// strictly before the day) and autocomplete (every exercise name ever used).
// One narrow, lift-only query serves both keepers.
export type ExerciseHistory = { best: Map<string, number>; names: string[] };

export async function getExerciseHistories(
  beforeDay: string,
): Promise<Record<Profile, ExerciseHistory>> {
  const rows = await db
    .select({
      profileId: workouts.profileId,
      day: workouts.day,
      exercise: workoutSets.exercise,
      weightLb: workoutSets.weightLb,
      reps: workoutSets.reps,
    })
    .from(workoutSets)
    .innerJoin(workouts, eq(workoutSets.workoutId, workouts.id))
    .where(eq(workoutSets.kind, "lift"));

  const result = {} as Record<Profile, ExerciseHistory>;
  for (const profile of PROFILES) {
    const mine = rows.filter((r) => r.profileId === profile);
    const prior: WorkoutSet[] = mine
      .filter((r) => r.day < beforeDay)
      .map((r) => ({
        kind: "lift" as const,
        exercise: r.exercise,
        weightLb: r.weightLb,
        reps: r.reps,
        minutes: null,
      }));
    result[profile] = {
      best: bestByExercise(prior),
      names: [...new Set(mine.map((r) => r.exercise))].sort(),
    };
  }
  return result;
}

// ── Legendary discoveries ──
// One row per legendary, ever. Returns true only for the row that landed —
// the caller that gets `true` throws the ceremony.

export async function recordLegendary(
  sigilId: string,
  day: string,
): Promise<boolean> {
  const rows = await db
    .insert(sigilDiscoveries)
    .values({ sigilId, day })
    .onConflictDoNothing({ target: sigilDiscoveries.sigilId })
    .returning({ id: sigilDiscoveries.id });
  return rows.length > 0;
}

export async function getDiscoveries(): Promise<Map<string, string>> {
  const rows = await db.select().from(sigilDiscoveries);
  return new Map(rows.map((r) => [r.sigilId, r.day]));
}

// Same gate for beings: the request that lands the unique row witnesses the
// arrival and throws the ceremony.
export async function recordArrival(
  beingId: string,
  day: string,
): Promise<boolean> {
  const rows = await db
    .insert(beingArrivals)
    .values({ beingId, day })
    .onConflictDoNothing({ target: beingArrivals.beingId })
    .returning({ id: beingArrivals.id });
  return rows.length > 0;
}

export async function getArrivals(): Promise<Map<string, string>> {
  const rows = await db.select().from(beingArrivals);
  return new Map(rows.map((r) => [r.beingId, r.day]));
}

// The specimens this person logs most recently — the quick-tap grid.
export async function getRecentSpecimens(
  profile: Profile,
  limit = 12,
): Promise<Specimen[]> {
  const recent = await db
    .select({ foodId: entries.foodId, last: max(entries.loggedAt) })
    .from(entries)
    .where(eq(entries.profileId, profile))
    .groupBy(entries.foodId)
    .orderBy(desc(max(entries.loggedAt)))
    .limit(limit);

  if (recent.length === 0) return [];
  const ids = recent.map((r) => r.foodId);
  const rows = await db.select().from(foods).where(inArray(foods.id, ids));
  const byId = new Map(rows.map((r) => [r.id, r as Specimen]));
  return ids.map((id) => byId.get(id)).filter((s): s is Specimen => !!s);
}
