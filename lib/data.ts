import { and, countDistinct, desc, eq, inArray, lte, max, min } from "drizzle-orm";
import { db } from "@/db";
import { dayMeta, entries, foods, pet, targets } from "@/db/schema";
import { PROFILES, type Profile } from "@/lib/auth";
import { addDays, diffDays } from "@/lib/dates";
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
    .select({ foodId: entries.foodId, first: min(entries.day) })
    .from(entries)
    .groupBy(entries.foodId);
  const newSpecimens = firstDays.filter((r) => r.first === day).length;

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
