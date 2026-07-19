"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { entries, foods } from "@/db/schema";
import { todayIso } from "@/lib/dates";
import { currentProfile } from "@/lib/session";
import type { Hall } from "@/lib/halls";

const MEALS = ["breakfast", "lunch", "dinner", "snacks"] as const;
type Meal = (typeof MEALS)[number];
const HALL_IDS = [
  "protein",
  "produce",
  "grains",
  "dairy",
  "snacks",
  "sweets",
  "drinks",
  "dishes",
] as const;

function validDay(day: unknown): day is string {
  return typeof day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day);
}

function validServings(n: number): boolean {
  return Number.isFinite(n) && n >= 0.25 && n <= 20;
}

export async function logEntry(input: {
  foodId: number;
  meal: Meal;
  servings: number;
  day: string;
}): Promise<{ error?: string }> {
  const profileId = await currentProfile();
  if (!MEALS.includes(input.meal)) return { error: "Unknown meal." };
  if (!validDay(input.day)) return { error: "Unknown day." };
  if (!validServings(input.servings)) return { error: "Servings look off." };
  const today = await todayIso();
  if (input.day > today) return { error: "The future is unwritten." };

  const [food] = await db
    .select({ id: foods.id })
    .from(foods)
    .where(eq(foods.id, input.foodId));
  if (!food) return { error: "That specimen is missing from the museum." };

  await db.insert(entries).values({
    profileId,
    day: input.day,
    meal: input.meal,
    foodId: input.foodId,
    servings: input.servings,
  });
  revalidatePath("/");
  return {};
}

export async function removeEntry(entryId: number): Promise<void> {
  const profileId = await currentProfile();
  await db
    .delete(entries)
    .where(and(eq(entries.id, entryId), eq(entries.profileId, profileId)));
  revalidatePath("/");
}

export type DonateInput = {
  name: string;
  hall: Hall;
  icon: string;
  servingLabel: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fdcId: number | null;
  // If set, log it right away too.
  logAs: { meal: Meal; servings: number; day: string } | null;
};

export async function donateSpecimen(
  input: DonateInput,
): Promise<{ error?: string; foodId?: number; alreadyKnown?: boolean }> {
  const profileId = await currentProfile();

  const name = input.name.trim().slice(0, 80);
  if (name.length < 2) return { error: "Give the specimen a name." };
  if (!HALL_IDS.includes(input.hall)) return { error: "Pick a hall." };
  const icon = (input.icon || "🍽").slice(0, 8);
  const servingLabel = input.servingLabel.trim().slice(0, 40) || "1 serving";
  const nums = [input.calories, input.proteinG, input.carbsG, input.fatG];
  if (nums.some((n) => !Number.isFinite(n) || n < 0 || n > 5000)) {
    return { error: "Those numbers look off." };
  }

  // Same name (case-insensitive) = same specimen; museums hate duplicates.
  const [existing] = await db
    .select({ id: foods.id })
    .from(foods)
    .where(sql`lower(${foods.name}) = ${name.toLowerCase()}`);

  let foodId: number;
  let alreadyKnown = false;
  if (existing) {
    foodId = existing.id;
    alreadyKnown = true;
  } else {
    const [created] = await db
      .insert(foods)
      .values({
        name,
        hall: input.hall,
        icon,
        servingLabel,
        calories: input.calories,
        proteinG: input.proteinG,
        carbsG: input.carbsG,
        fatG: input.fatG,
        fdcId: input.fdcId,
        discoveredBy: profileId,
      })
      .returning({ id: foods.id });
    foodId = created.id;
  }

  if (input.logAs) {
    const result = await logEntry({
      foodId,
      meal: input.logAs.meal,
      servings: input.logAs.servings,
      day: input.logAs.day,
    });
    if (result.error) return { error: result.error };
  }

  revalidatePath("/");
  return { foodId, alreadyKnown };
}
