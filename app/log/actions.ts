"use server";

import { and, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/db";
import { entries, foods, recipeItems } from "@/db/schema";
import { LEDGER_TAG } from "@/lib/cache-tags";
import { todayIso } from "@/lib/dates";
import { safely } from "@/lib/safe";
import { currentUser } from "@/lib/session";
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
  const { userId: profileId, bondId } = await currentUser();
  if (!MEALS.includes(input.meal)) return { error: "Unknown meal." };
  if (!validDay(input.day)) return { error: "Unknown day." };
  if (!validServings(input.servings)) return { error: "Servings look off." };
  const today = await todayIso();
  if (input.day > today) return { error: "The future is unwritten." };

  return safely(async () => {
    const [food] = await db
      .select({ id: foods.id })
      .from(foods)
      .where(eq(foods.id, input.foodId));
    if (!food) return { error: "That specimen is missing from the pantry." };

    await db.insert(entries).values({
      bondId,
      profileId,
      day: input.day,
      meal: input.meal,
      foodId: input.foodId,
      servings: input.servings,
    });
    revalidatePath("/");
    revalidatePath("/today");
    revalidateTag(LEDGER_TAG, { expire: 0 });
    return {};
  });
}

export async function removeEntry(entryId: number): Promise<void> {
  const { userId: profileId, bondId } = await currentUser();
  await safely(async () => {
    await db
      .delete(entries)
      .where(
        and(
          eq(entries.id, entryId),
          eq(entries.profileId, profileId),
          eq(entries.bondId, bondId),
        ),
      );
    revalidatePath("/");
    revalidatePath("/today");
    revalidateTag(LEDGER_TAG, { expire: 0 });
    return {};
  });
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
  // A deterministic estimate (from the written-in eat line) — wears a soft ~.
  estimated?: boolean;
  // If set, log it right away too.
  logAs: { meal: Meal; servings: number; day: string } | null;
};

export async function donateSpecimen(
  input: DonateInput,
): Promise<{ error?: string; foodId?: number; alreadyKnown?: boolean }> {
  const { userId: profileId } = await currentUser();

  const name = input.name.trim().slice(0, 80);
  if (name.length < 2) return { error: "Give the specimen a name." };
  if (!HALL_IDS.includes(input.hall)) return { error: "Pick a hall." };
  const icon = (input.icon || "🍽").slice(0, 8);
  const servingLabel = input.servingLabel.trim().slice(0, 40) || "1 serving";
  const nums = [input.calories, input.proteinG, input.carbsG, input.fatG];
  if (nums.some((n) => !Number.isFinite(n) || n < 0 || n > 5000)) {
    return { error: "Those numbers look off." };
  }

  return safely(async () => {
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
          estimated: input.estimated ?? false,
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
    revalidatePath("/today");
    return { foodId, alreadyKnown };
  });
}

export async function createRecipe(input: {
  name: string;
  icon: string;
  servingLabel: string;
  items: { foodId: number; servings: number }[];
  logAs: { meal: Meal; servings: number; day: string } | null;
}): Promise<{ error?: string; foodId?: number }> {
  const { userId: profileId } = await currentUser();

  const name = input.name.trim().slice(0, 80);
  if (name.length < 2) return { error: "Give the dish a name." };
  if (input.items.length < 2) {
    return { error: "A dish needs at least two ingredients." };
  }
  if (input.items.some((i) => !validServings(i.servings))) {
    return { error: "Ingredient servings look off." };
  }

  return safely(async () => {
    const [existing] = await db
      .select({ id: foods.id })
      .from(foods)
      .where(sql`lower(${foods.name}) = ${name.toLowerCase()}`);
    if (existing) {
      return { error: "The pantry already has a specimen by that name." };
    }

    const ingredients = await db
      .select()
      .from(foods)
      .where(
        inArray(
          foods.id,
          input.items.map((i) => i.foodId),
        ),
      );
    if (ingredients.length !== input.items.length) {
      return { error: "An ingredient is missing from the pantry." };
    }

    const sum = { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 };
    for (const item of input.items) {
      const f = ingredients.find((x) => x.id === item.foodId)!;
      sum.calories += f.calories * item.servings;
      sum.proteinG += f.proteinG * item.servings;
      sum.carbsG += f.carbsG * item.servings;
      sum.fatG += f.fatG * item.servings;
    }
    const r1 = (n: number) => Math.round(n * 10) / 10;

    const [created] = await db
      .insert(foods)
      .values({
        name,
        hall: "dishes",
        icon: (input.icon || "🍲").slice(0, 8),
        servingLabel: input.servingLabel.trim().slice(0, 40) || "1 serving",
        calories: Math.round(sum.calories),
        proteinG: r1(sum.proteinG),
        carbsG: r1(sum.carbsG),
        fatG: r1(sum.fatG),
        isRecipe: true,
        discoveredBy: profileId,
      })
      .returning({ id: foods.id });

    await db.insert(recipeItems).values(
      input.items.map((i) => ({
        recipeFoodId: created.id,
        ingredientFoodId: i.foodId,
        servings: i.servings,
      })),
    );

    if (input.logAs) {
      const result = await logEntry({
        foodId: created.id,
        meal: input.logAs.meal,
        servings: input.logAs.servings,
        day: input.logAs.day,
      });
      if (result.error) return { error: result.error };
    }

    revalidatePath("/");
    revalidatePath("/today");
    return { foodId: created.id };
  });
}
