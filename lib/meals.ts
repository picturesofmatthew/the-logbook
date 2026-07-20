// Client-safe types and constants for the journal (no db imports).
import type { Hall } from "@/lib/halls";

export type Meal = "breakfast" | "lunch" | "dinner" | "snacks";

export const MEALS: { id: Meal; label: string; emoji: string }[] = [
  { id: "breakfast", label: "breakfast", emoji: "☀️" },
  { id: "lunch", label: "lunch", emoji: "🥪" },
  { id: "dinner", label: "dinner", emoji: "🌙" },
  { id: "snacks", label: "snacks", emoji: "🍿" },
];

// The meal the clock suggests — so capture never makes you pick one first.
// (Phase 3 refines this; kept pure and small so it can be unit-tested.)
export function mealForHour(hour: number): Meal {
  if (hour < 5) return "snacks"; // late night
  if (hour < 11) return "breakfast";
  if (hour < 15) return "lunch";
  if (hour < 21) return "dinner";
  return "snacks";
}

export type Specimen = {
  id: number;
  name: string;
  hall: Hall;
  icon: string;
  servingLabel: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  isRecipe: boolean;
  estimated: boolean;
  discoveredBy: string;
  discoveredAt: Date;
};

export type JournalEntry = {
  id: number;
  meal: Meal;
  servings: number;
  food: Specimen;
};

export type Target = {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
} | null;
