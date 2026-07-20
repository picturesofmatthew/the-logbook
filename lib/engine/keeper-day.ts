// One keeper's day, assembled for the sigil engine. This is the single
// place rows become a KeeperDay — home, the spellbook, and the ledger all
// pass through here, so a day can never seal differently on different pages.

import type { KeeperDay } from "./sigil";
import { trainingSummary, type Workout } from "./training";
import type { Hall } from "@/lib/halls";

export type KeeperDayFacts = {
  calories: number;
  proteinG: number;
  halls: Hall[];
  target: { calories: number; proteinG: number } | null;
  meta: {
    waterCups: number;
    mood: string | null;
    note: string | null;
    training: string | null;
  } | null;
  workouts: Workout[];
  historyBest: Map<string, number>;
  firstLoggedAtMs: number | null;
};

export function buildKeeperDay(f: KeeperDayFacts): KeeperDay {
  const summary = trainingSummary(f.workouts, f.historyBest);
  return {
    loggedAny: f.halls.length > 0 || f.calories > 0,
    calories: f.calories,
    targetCalories: f.target?.calories ?? null,
    proteinG: f.proteinG,
    targetProteinG: f.target?.proteinG ?? null,
    halls: f.halls,
    waterCups: f.meta?.waterCups ?? 0,
    mood: f.meta?.mood ?? null,
    wroteNote: !!f.meta?.note,
    restDay: f.meta?.training === "rest" || summary.families.includes("rest"),
    training: summary,
    firstLoggedAtMs: f.firstLoggedAtMs,
  };
}
