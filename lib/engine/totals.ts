// Pure macro math over logged entries.

export type Macros = {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export type EntryWithFood = Macros & {
  servings: number;
};

export const ZERO: Macros = { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 };

export function scale(m: Macros, servings: number): Macros {
  return {
    calories: m.calories * servings,
    proteinG: m.proteinG * servings,
    carbsG: m.carbsG * servings,
    fatG: m.fatG * servings,
  };
}

export function add(a: Macros, b: Macros): Macros {
  return {
    calories: a.calories + b.calories,
    proteinG: a.proteinG + b.proteinG,
    carbsG: a.carbsG + b.carbsG,
    fatG: a.fatG + b.fatG,
  };
}

export function totalOf(entries: EntryWithFood[]): Macros {
  return entries.reduce((acc, e) => add(acc, scale(e, e.servings)), ZERO);
}

export function round(m: Macros): Macros {
  return {
    calories: Math.round(m.calories),
    proteinG: Math.round(m.proteinG),
    carbsG: Math.round(m.carbsG),
    fatG: Math.round(m.fatG),
  };
}
