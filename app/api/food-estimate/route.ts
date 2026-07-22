import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import {
  gramsFor,
  parseFoodLine,
  portionConfidence,
} from "@/lib/engine/food-parse";
import type { Hall } from "@/lib/halls";
import { searchFoods, type FoodSearchResult } from "@/lib/usda";

const r1 = (n: number) => Math.round(n * 10) / 10;

// A light hall guess so an estimated specimen files itself; a multi-item meal
// falls through to the Dish Gallery.
const HALL_HINTS: [Hall, string[]][] = [
  ["dairy", ["milk", "yogurt", "cheese", "butter", "cream", "kefir"]],
  ["drinks", ["coffee", "tea", "juice", "soda", "latte", "smoothie", "cola", "beer", "wine", "water"]],
  ["sweets", ["cookie", "cake", "chocolate", "candy", "ice cream", "donut", "brownie", "pie", "syrup", "honey", "sugar"]],
  ["snacks", ["chips", "cracker", "almond", "peanut", "cashew", "popcorn", "pretzel", "jerky", "granola", " bar"]],
  ["grains", ["rice", "bread", "oat", "pasta", "cereal", "bagel", "quinoa", "tortilla", "noodle"]],
  ["produce", ["apple", "banana", "spinach", "broccoli", "berry", "avocado", "tomato", "salad", "carrot", "fruit", "kale", "potato"]],
  ["protein", ["chicken", "beef", "pork", "turkey", "fish", "salmon", "tuna", "egg", "tofu", "steak", "shrimp", "bacon", "sausage"]],
];

function guessHall(name: string): Hall {
  const n = ` ${name.toLowerCase()} `;
  for (const [hall, words] of HALL_HINTS) {
    if (words.some((w) => n.includes(w))) return hall;
  }
  return "dishes";
}

// Whole-food databases beat branded products for a plain "eggs" or "banana" —
// this is what keeps "2 eggs" from matching eggnog.
const DATA_TYPE_BONUS: Record<string, number> = {
  Foundation: 7,
  "SR Legacy": 6,
  Branded: 0,
};

// Prefer the plain, fresh form over a processed derivative — "eggs" should mean
// whole raw eggs, not dried egg-white powder.
// "raw" is deliberately absent: it's right for eggs but wrong for grains
// (raw rice ≫ a cooked cup). "whole" still carries eggs.
const BASIC_WORDS = ["whole", "fresh"];
const PROCESSED_WORDS = [
  "dried", "powder", "dehydrated", "concentrate", "substitute", "imitation",
  "cooked", "fried", "roasted", "canned", "flour", "juice",
];

// Count matching tokens, stem-aware so "eggs" finds "Egg, whole, raw" — USDA's
// whole foods are singular, and missing that match is what let branded junk win.
function hitCount(name: string, tokens: string[]): number {
  return tokens.filter((t) => {
    if (name.includes(t)) return true;
    const singular = t.replace(/s$/, "");
    return singular.length >= 3 && name.includes(singular);
  }).length;
}

// Pick the USDA result that best matches the written name: reward matching all
// tokens and whole foods, penalize long brand-y names and zero-calorie rows.
function bestMatch(
  results: FoodSearchResult[],
  query: string,
): FoodSearchResult | null {
  if (results.length === 0) return null;
  const q = query.toLowerCase().split(/\s+/).filter(Boolean);
  let best = results[0];
  let bestScore = -Infinity;
  for (const it of results) {
    const name = it.name.toLowerCase();
    const hits = hitCount(name, q);
    const score =
      hits * 8 +
      (hits === q.length ? 3 : 0) +
      (DATA_TYPE_BONUS[it.dataType] ?? 0) +
      (BASIC_WORDS.some((w) => name.includes(w)) ? 2.5 : 0) -
      (PROCESSED_WORDS.some((w) => name.includes(w)) ? 3.5 : 0) -
      name.length * 0.03 +
      (it.per100.calories > 0 ? 0.5 : -8);
    if (score > bestScore) {
      bestScore = score;
      best = it;
    }
  }
  return best;
}

function capitalize(s: string): string {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

export async function GET(request: NextRequest) {
  // Defense in depth — the proxy already gates this, but the handler shouldn't
  // trust that alone (and it keeps the USDA quota behind the passcode).
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!(await verifySession(token))) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ error: "Write in a meal to estimate." }, { status: 400 });
  }

  const items = parseFoodLine(q).slice(0, 6);
  if (items.length === 0) {
    return NextResponse.json({ error: "Couldn't read a food in that." });
  }

  const total = { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 };
  const breakdown: { label: string; matched: string | null; calories: number }[] = [];
  let anyMatch = false;
  let anyRough = false;
  let usdaDown = false;
  let firstMatchName: string | null = null;

  // Look every item up in parallel (was sequential — up to 6×2 blocking round
  // trips). Whole foods first (a written meal is home cooking); branded only if
  // the whole-food guides are empty — keeps "eggs" off the candy shelf. Then
  // aggregate in written order so the total is deterministic.
  const lookups = await Promise.all(
    items.map(async (item) => {
      try {
        let results = await searchFoods(item.name, "Foundation,SR Legacy");
        if (results.length === 0) {
          results = await searchFoods(item.name, "Branded");
        }
        return { item, results, down: false };
      } catch {
        return { item, results: [] as FoodSearchResult[], down: true };
      }
    }),
  );

  for (const { item, results, down } of lookups) {
    if (down) usdaDown = true;
    const match = bestMatch(results, item.name);
    if (!match || match.per100.calories === 0) {
      breakdown.push({ label: item.raw, matched: null, calories: 0 });
      anyRough = true;
      continue;
    }
    anyMatch = true;
    if (!firstMatchName) firstMatchName = match.name;

    const grams =
      gramsFor(item.qty, item.unit) ??
      (match.servingGrams != null ? item.qty * match.servingGrams : item.qty * 100);
    const factor = grams / 100;
    const macros = {
      calories: Math.round(match.per100.calories * factor),
      proteinG: r1(match.per100.proteinG * factor),
      carbsG: r1(match.per100.carbsG * factor),
      fatG: r1(match.per100.fatG * factor),
    };
    if (portionConfidence(item.unit) === "rough") anyRough = true;
    total.calories += macros.calories;
    total.proteinG += macros.proteinG;
    total.carbsG += macros.carbsG;
    total.fatG += macros.fatG;
    breakdown.push({
      label: `${item.qty}${item.unit ? ` ${item.unit}` : ""} ${match.name}`,
      matched: match.name,
      calories: macros.calories,
    });
  }

  if (!anyMatch) {
    return NextResponse.json({
      error: usdaDown
        ? "The field guide is unreachable — you can still write the numbers in."
        : "Couldn't find those in the field guide.",
      items: breakdown,
    });
  }

  const name =
    items.length === 1 && firstMatchName ? firstMatchName : capitalize(q);

  return NextResponse.json({
    estimate: {
      name,
      hall: guessHall(q),
      icon: items.length > 1 ? "🍽" : "🥣",
      servingLabel: "your serving",
      calories: Math.round(total.calories),
      proteinG: r1(total.proteinG),
      carbsG: r1(total.carbsG),
      fatG: r1(total.fatG),
      confidence: anyRough ? "rough" : "high",
      items: breakdown,
    },
  });
}
