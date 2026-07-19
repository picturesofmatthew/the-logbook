import { and, desc, eq, inArray, lte, max } from "drizzle-orm";
import { db } from "@/db";
import { entries, foods, targets } from "@/db/schema";
import { PROFILES, type Profile } from "@/lib/auth";
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
