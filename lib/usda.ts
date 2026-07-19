// USDA FoodData Central search, normalized for the donate flow.
// Only used when donating a NEW specimen — daily logging never touches it.

const FDC_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";

// FDC nutrient ids
const N_KCAL = 1008;
const N_PROTEIN = 1003;
const N_FAT = 1004;
const N_CARBS = 1005;

export type FoodSearchResult = {
  fdcId: number;
  name: string;
  brand: string | null;
  servingLabel: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

type FdcNutrient = { nutrientId: number; value: number };
type FdcFood = {
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

export async function searchFoods(query: string): Promise<FoodSearchResult[]> {
  const key = process.env.FDC_API_KEY || "DEMO_KEY";
  const url = new URL(FDC_URL);
  url.searchParams.set("api_key", key);
  url.searchParams.set("query", query);
  url.searchParams.set("dataType", "Foundation,SR Legacy,Branded");
  url.searchParams.set("pageSize", "12");

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) {
    throw new Error(`USDA search failed: ${res.status}`);
  }
  const data = (await res.json()) as { foods?: FdcFood[] };

  return (data.foods ?? []).map((food) => {
    // FDC nutrient values are per 100 g. Branded foods often carry a real
    // serving size — scale to it so the card matches the label on the bag.
    const per100 = {
      calories: nutrient(food, N_KCAL),
      proteinG: nutrient(food, N_PROTEIN),
      carbsG: nutrient(food, N_CARBS),
      fatG: nutrient(food, N_FAT),
    };
    const grams =
      food.servingSize && food.servingSizeUnit?.toLowerCase().startsWith("g")
        ? food.servingSize
        : null;
    const factor = grams ? grams / 100 : 1;
    const servingLabel = grams
      ? food.householdServingFullText?.trim() || `${grams} g`
      : "100 g";

    const r1 = (n: number) => Math.round(n * 10) / 10;
    return {
      fdcId: food.fdcId,
      name: titleCase(food.description),
      brand: food.brandName || food.brandOwner || null,
      servingLabel,
      calories: Math.round(per100.calories * factor),
      proteinG: r1(per100.proteinG * factor),
      carbsG: r1(per100.carbsG * factor),
      fatG: r1(per100.fatG * factor),
    };
  });
}
