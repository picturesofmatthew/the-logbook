// Parse a written meal into items — "2 eggs and a banana", "200g chicken,
// 1 cup rice", "greek yogurt". Pure and unit-tested. Turning items into
// macros needs the USDA lookup (impure) — that lives in the food-estimate
// route; this file does the language + the portion math + the Atwater check.

export type ParsedItem = {
  qty: number;
  unit: string | null; // normalized; null = a count ("2 eggs", "a banana")
  name: string;
  raw: string;
};

const WORD_QTY: Record<string, number> = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
  half: 0.5, quarter: 0.25, couple: 2, few: 3,
  "½": 0.5, "¼": 0.25, "¾": 0.75, "⅓": 1 / 3, "⅔": 2 / 3,
};

// Spelling variants → a canonical unit.
const UNIT_ALIASES: Record<string, string> = {
  g: "g", gram: "g", grams: "g",
  kg: "kg", kgs: "kg", mg: "mg",
  oz: "oz", ounce: "oz", ounces: "oz",
  lb: "lb", lbs: "lb", pound: "lb", pounds: "lb",
  ml: "ml", milliliter: "ml", milliliters: "ml", l: "l", liter: "l", liters: "l",
  cup: "cup", cups: "cup",
  tbsp: "tbsp", tablespoon: "tbsp", tablespoons: "tbsp",
  tsp: "tsp", teaspoon: "tsp", teaspoons: "tsp",
  slice: "slice", slices: "slice",
  piece: "piece", pieces: "piece",
  egg: "egg", eggs: "egg",
  handful: "handful", handfuls: "handful",
  bowl: "bowl", bowls: "bowl",
  plate: "plate", plates: "plate",
  scoop: "scoop", scoops: "scoop",
  clove: "clove", cloves: "clove",
  can: "can", cans: "can",
  glass: "glass", glasses: "glass",
  strip: "strip", strips: "strip",
  serving: "serving", servings: "serving",
};

// Approximate grams for a household measure. Volume→grams assumes ~water
// density (an honest approximation the card shows as an estimate).
export const PORTION_GRAMS: Record<string, number> = {
  g: 1, mg: 0.001, kg: 1000,
  oz: 28.35, lb: 453.6,
  ml: 1, l: 1000,
  cup: 240, tbsp: 15, tsp: 5,
  slice: 30, piece: 55, egg: 50,
  handful: 30, bowl: 350, plate: 400, scoop: 30,
  clove: 5, can: 350, glass: 250, strip: 12, serving: 100,
};

const PRECISE_UNITS = new Set(["g", "kg", "mg", "oz", "lb", "ml", "l"]);

function parseAmount(t: string): number | null {
  if (t in WORD_QTY) return WORD_QTY[t];
  if (/^\d+\/\d+$/.test(t)) {
    const [a, b] = t.split("/").map(Number);
    return b ? a / b : null;
  }
  if (/^\d+(?:\.\d+)?$/.test(t)) return Number(t);
  return null;
}

function parseItem(raw: string): ParsedItem | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  // Split a stuck-together amount+unit: "200g" → "200 g".
  const s = trimmed.toLowerCase().replace(/^(\d+(?:\.\d+)?)([a-z])/, "$1 $2");
  const tokens = s.split(/\s+/);

  let qty = 1;
  let unit: string | null = null;
  let i = 0;

  const amount = parseAmount(tokens[i]);
  if (amount !== null) {
    qty = amount;
    i++;
  }
  if (tokens[i] === "of") i++;
  if (tokens[i] === "a" || tokens[i] === "an") i++;
  if (tokens[i] && UNIT_ALIASES[tokens[i]]) {
    unit = UNIT_ALIASES[tokens[i]];
    i++;
  }
  if (tokens[i] === "of") i++;

  let name = tokens.slice(i).join(" ").trim();
  // "2 eggs" — the food *is* the unit word; recover it as the name.
  if (!name && unit) name = tokens[i - 1] ?? unit;
  if (!name) name = trimmed;

  return { qty, unit, name, raw: trimmed };
}

export function parseFoodLine(text: string): ParsedItem[] {
  return text
    .split(/\s*(?:,|\band\b|\+|&|\n|;)\s*/i)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(parseItem)
    .filter((i): i is ParsedItem => i !== null);
}

// Grams for a portion, when the unit maps to a mass/measure. Count/no-unit
// items ("2 eggs" with unit "egg" does map; "a banana" does not) return null,
// and the estimator falls back to the food's USDA serving weight.
export function gramsFor(qty: number, unit: string | null): number | null {
  if (unit && unit in PORTION_GRAMS) return qty * PORTION_GRAMS[unit];
  return null;
}

export function atwaterKcal(proteinG: number, carbsG: number, fatG: number): number {
  return proteinG * 4 + carbsG * 4 + fatG * 9;
}

// Does the stated kcal roughly agree with 4/4/9? A cheap sanity signal, and a
// way to fill a missing kcal. Tolerance is the looser of 30 kcal or 15%.
export function atwaterCheck(
  kcal: number,
  proteinG: number,
  carbsG: number,
  fatG: number,
): { computed: number; agrees: boolean } {
  const computed = Math.round(atwaterKcal(proteinG, carbsG, fatG));
  if (kcal <= 0) return { computed, agrees: false };
  const agrees = Math.abs(computed - kcal) <= Math.max(30, kcal * 0.15);
  return { computed, agrees };
}

// A precise mass/volume unit means we trust the portion; a count or household
// measure ("a bowl") is a rougher guess.
export function portionConfidence(unit: string | null): "high" | "rough" {
  return unit && PRECISE_UNITS.has(unit) ? "high" : "rough";
}
