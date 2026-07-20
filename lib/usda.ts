// USDA FoodData Central search, normalized for the donate flow and the
// deterministic estimator. FDC nutrient values are per 100 g; we scale them to
// the food's real serving when we can convert its unit to grams, and label
// honestly ("per 100 g") when we can't — never pretending an ml/oz serving is
// grams.

const FDC_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";

// FDC nutrient ids
const N_KCAL = 1008;
const N_PROTEIN = 1003;
const N_FAT = 1004;
const N_CARBS = 1005;

export type Macros = {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export type FoodSearchResult = {
  fdcId: number;
  name: string;
  brand: string | null;
  dataType: string; // Foundation | SR Legacy | Branded — the estimator prefers whole foods
  servingLabel: string;
  // Grams in the displayed serving (null when we could only give per-100 g).
  servingGrams: number | null;
  // Macros for the displayed serving.
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  // Per-100 g macros — the estimator scales these by an arbitrary gram amount.
  per100: Macros;
};

type FdcNutrient = { nutrientId: number; value: number };
export type FdcFood = {
  fdcId: number;
  description: string;
  brandName?: string;
  brandOwner?: string;
  dataType: string;
  servingSize?: number;
  servingSizeUnit?: string;
  householdServingFullText?: string;
  foodNutrients?: FdcNutrient[];
};

function nutrient(food: FdcFood, id: number): number {
  return food.foodNutrients?.find((n) => n.nutrientId === id)?.value ?? 0;
}

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/(^|[\s(])([a-z])/g, (_, pre, ch) => pre + ch.toUpperCase());
}

const r1 = (n: number) => Math.round(n * 10) / 10;

// Grams in the food's stated serving, when its unit is convertible to mass.
// ml/l assume ~water density (an honest approximation).
export function servingGrams(food: FdcFood): number | null {
  const size = food.servingSize;
  const unit = food.servingSizeUnit?.toLowerCase().trim();
  if (!size || size <= 0 || !unit) return null;
  if (unit.startsWith("g")) return size; // g, grams
  if (unit === "mg") return size / 1000;
  if (unit === "kg") return size * 1000;
  if (unit === "ml" || unit.startsWith("millilit")) return size;
  if (unit === "l" || unit.startsWith("lit")) return size * 1000;
  if (unit === "oz") return size * 28.35;
  if (unit === "lb") return size * 453.6;
  return null;
}

// Scale FDC per-100 g nutrients to the food's serving — the pure heart of the
// fix. Returns both the display serving and the per-100 g values.
export function scaleToServing(food: FdcFood): FoodSearchResult {
  const per100: Macros = {
    calories: nutrient(food, N_KCAL),
    proteinG: nutrient(food, N_PROTEIN),
    carbsG: nutrient(food, N_CARBS),
    fatG: nutrient(food, N_FAT),
  };

  const grams = servingGrams(food);
  const factor = grams ? grams / 100 : 1;
  const servingLabel = grams
    ? food.householdServingFullText?.trim() ||
      `${r1(food.servingSize!)} ${food.servingSizeUnit}`
    : "per 100 g";

  return {
    fdcId: food.fdcId,
    name: titleCase(food.description),
    brand: food.brandName || food.brandOwner || null,
    dataType: food.dataType,
    servingLabel,
    servingGrams: grams,
    calories: Math.round(per100.calories * factor),
    proteinG: r1(per100.proteinG * factor),
    carbsG: r1(per100.carbsG * factor),
    fatG: r1(per100.fatG * factor),
    per100,
  };
}

export async function searchFoods(
  query: string,
  dataType = "Foundation,SR Legacy,Branded",
): Promise<FoodSearchResult[]> {
  const key = process.env.FDC_API_KEY || "DEMO_KEY";
  const url = new URL(FDC_URL);
  url.searchParams.set("api_key", key);
  url.searchParams.set("query", query);
  url.searchParams.set("dataType", dataType);
  url.searchParams.set("pageSize", "12");

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) {
    throw new Error(`USDA search failed: ${res.status}`);
  }
  const data = (await res.json()) as { foods?: FdcFood[] };
  return (data.foods ?? []).map(scaleToServing);
}
