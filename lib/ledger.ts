// The Spellbook's ledger: computes the sigil for every day of a range from
// bulk queries. Sigils are always derived, never stored — which means the
// whole history grows seals retroactively the moment it is read. The same
// pass feeds the Glade: chords call beings, effort sets vitality.

import { and, asc, countDistinct, eq, gte, inArray, lte } from "drizzle-orm";
import { db } from "@/db";
import {
  dayMeta,
  entries,
  foods,
  targets,
  workouts,
  workoutSets,
} from "@/db/schema";
import { PROFILES, type Profile } from "@/lib/auth";
import { beingStates, type BeingState, type LedgerDay } from "@/lib/engine/beings";
import {
  gladeTier,
  tierForScore,
  vitalityScore,
  WINDOW_DAYS,
  type GladeDay,
  type GladeTier,
} from "@/lib/engine/glade";
import {
  composeSigil,
  isLowMood,
  type KeeperDay,
  type SigilSpec,
} from "@/lib/engine/sigil";
import {
  trainingSummary,
  type Workout,
  type WorkoutSet,
} from "@/lib/engine/training";
import type { Hall } from "@/lib/halls";

export type LedgerEntry = {
  day: string;
  spec: SigilSpec;
  bothRest: boolean;
  bothLowLogged: boolean;
  workoutCount: number;
  bothWatered: boolean;
};

type DayFacts = {
  calories: number;
  proteinG: number;
  halls: Set<Hall>;
  firstLoggedAtMs: number | null;
};

const emptyFacts = (): DayFacts => ({
  calories: 0,
  proteinG: 0,
  halls: new Set(),
  firstLoggedAtMs: null,
});

// The earliest day both keepers logged — the First Page.
export async function getFirstBothDay(): Promise<string | null> {
  const rows = await db
    .select({ day: entries.day, n: countDistinct(entries.profileId) })
    .from(entries)
    .groupBy(entries.day);
  const both = rows
    .filter((r) => Number(r.n) >= 2)
    .map((r) => r.day)
    .sort();
  return both[0] ?? null;
}

async function getFirstEntryDay(): Promise<string | null> {
  const rows = await db
    .select({ day: entries.day })
    .from(entries)
    .orderBy(asc(entries.day))
    .limit(1);
  return rows[0]?.day ?? null;
}

export async function buildLedgerRange(
  start: string,
  end: string,
  today: string,
): Promise<LedgerEntry[]> {
  const [entryRows, metaRows, workoutRows, targetRows, firstBothDay] =
    await Promise.all([
      db
        .select({ entry: entries, food: foods })
        .from(entries)
        .innerJoin(foods, eq(entries.foodId, foods.id))
        .where(and(gte(entries.day, start), lte(entries.day, end))),
      db
        .select()
        .from(dayMeta)
        .where(and(gte(dayMeta.day, start), lte(dayMeta.day, end))),
      db
        .select()
        .from(workouts)
        .where(and(gte(workouts.day, start), lte(workouts.day, end))),
      db
        .select()
        .from(targets)
        .orderBy(asc(targets.effectiveDate), asc(targets.id)),
      getFirstBothDay(),
    ]);

  const setRows =
    workoutRows.length > 0
      ? await db
          .select()
          .from(workoutSets)
          .where(
            inArray(
              workoutSets.workoutId,
              workoutRows.map((w) => w.id),
            ),
          )
          .orderBy(asc(workoutSets.id))
      : [];

  // Every lift set ever, by profile and day, for rolling PR history.
  const allSetRows = await db
    .select({
      set: workoutSets,
      day: workouts.day,
      profileId: workouts.profileId,
    })
    .from(workoutSets)
    .innerJoin(workouts, eq(workoutSets.workoutId, workouts.id))
    .orderBy(asc(workouts.day), asc(workoutSets.id));

  // Food facts per profile per day.
  const facts = new Map<string, DayFacts>(); // `${profile}:${day}`
  for (const { entry, food } of entryRows) {
    const key = `${entry.profileId}:${entry.day}`;
    const f = facts.get(key) ?? emptyFacts();
    f.calories += food.calories * entry.servings;
    f.proteinG += food.proteinG * entry.servings;
    f.halls.add(food.hall as Hall);
    const ms = new Date(entry.loggedAt).getTime();
    if (f.firstLoggedAtMs == null || ms < f.firstLoggedAtMs) {
      f.firstLoggedAtMs = ms;
    }
    facts.set(key, f);
  }

  // Workouts per profile per day, in engine shape.
  const workoutsByKey = new Map<string, Workout[]>();
  for (const w of workoutRows) {
    const key = `${w.profileId}:${w.day}`;
    const sets: WorkoutSet[] = setRows
      .filter((s) => s.workoutId === w.id)
      .map((s) => ({
        kind: s.kind,
        exercise: s.exercise,
        weightLb: s.weightLb,
        reps: s.reps,
        minutes: s.minutes,
      }));
    const list = workoutsByKey.get(key) ?? [];
    list.push({ title: w.title, sets });
    workoutsByKey.set(key, list);
  }

  // Rolling per-exercise bests per profile, snapshotted before each day.
  const historyBefore = new Map<Profile, Map<string, Map<string, number>>>();
  for (const profile of PROFILES) {
    const mine = allSetRows.filter((r) => r.profileId === profile);
    const byDay = new Map<string, WorkoutSet[]>();
    for (const r of mine) {
      const list = byDay.get(r.day) ?? [];
      list.push({
        kind: r.set.kind,
        exercise: r.set.exercise,
        weightLb: r.set.weightLb,
        reps: r.set.reps,
        minutes: r.set.minutes,
      });
      byDay.set(r.day, list);
    }
    const snapshots = new Map<string, Map<string, number>>();
    const rolling = new Map<string, number>();
    for (const day of [...byDay.keys()].sort()) {
      snapshots.set(day, new Map(rolling));
      for (const s of byDay.get(day) ?? []) {
        if (s.kind !== "lift" || s.weightLb == null || !s.reps) continue;
        const k = s.exercise.trim().replace(/\s+/g, " ").toLowerCase();
        const rm = s.weightLb * (s.reps <= 1 ? 1 : 1 + s.reps / 30);
        if (rm > (rolling.get(k) ?? 0)) rolling.set(k, rm);
      }
    }
    historyBefore.set(profile, snapshots);
  }

  const targetFor = (profile: Profile, day: string) => {
    let match: (typeof targetRows)[number] | null = null;
    for (const t of targetRows) {
      if (t.profileId === profile && t.effectiveDate <= day) match = t;
    }
    return match;
  };

  const keeperDayFor = (profile: Profile, day: string): KeeperDay => {
    const f = facts.get(`${profile}:${day}`) ?? emptyFacts();
    const meta = metaRows.find(
      (m) => m.profileId === profile && m.day === day,
    );
    const dayWorkouts = workoutsByKey.get(`${profile}:${day}`) ?? [];
    const history =
      historyBefore.get(profile)?.get(day) ?? new Map<string, number>();
    const summary = trainingSummary(dayWorkouts, history);
    const target = targetFor(profile, day);
    return {
      loggedAny: f.calories > 0 || f.halls.size > 0,
      calories: f.calories,
      targetCalories: target?.calories ?? null,
      proteinG: f.proteinG,
      targetProteinG: target?.proteinG ?? null,
      halls: [...f.halls],
      waterCups: meta?.waterCups ?? 0,
      mood: meta?.mood ?? null,
      wroteNote: !!meta?.note,
      restDay: meta?.training === "rest" || summary.families.includes("rest"),
      training: summary,
      firstLoggedAtMs: f.firstLoggedAtMs,
    };
  };

  const days: LedgerEntry[] = [];
  for (let d = start; d <= end && d <= today; d = nextDay(d)) {
    const moss = keeperDayFor("matthew", d);
    const ember = keeperDayFor("kennedy", d);
    const spec = composeSigil({
      day: d,
      moss,
      ember,
      firstPage: firstBothDay === d,
    });
    days.push({
      day: d,
      spec,
      bothRest: moss.restDay && ember.restDay,
      bothLowLogged:
        spec.completed && isLowMood(moss.mood) && isLowMood(ember.mood),
      workoutCount:
        (workoutsByKey.get(`matthew:${d}`)?.length ?? 0) +
        (workoutsByKey.get(`kennedy:${d}`)?.length ?? 0),
      bothWatered: moss.waterCups >= 8 && ember.waterCups >= 8,
    });
  }
  return days;
}

export async function buildMonthLedger(
  monthPrefix: string, // "YYYY-MM"
  today: string,
): Promise<LedgerEntry[]> {
  const end = lastDayOfMonth(monthPrefix);
  return buildLedgerRange(`${monthPrefix}-01`, end, today);
}

// The Glade's whole memory: beings called by the full history, vitality from
// the last two weeks (with the falls-slowly clamp against yesterday's tier).
export type GladeState = {
  tier: GladeTier;
  beings: BeingState[];
};

export async function getGladeState(today: string): Promise<GladeState> {
  const firstDay = await getFirstEntryDay();
  if (!firstDay) {
    return { tier: "hushed", beings: beingStates([]) };
  }

  const ledger = await buildLedgerRange(firstDay, today, today);

  const history: LedgerDay[] = ledger.map((e) => ({
    day: e.day,
    chords: e.spec.chords,
    legendary: e.spec.legendary,
    bothRest: e.bothRest,
    bothLowLogged: e.bothLowLogged,
  }));

  const toGladeDay = (e: LedgerEntry): GladeDay => ({
    bothLogged: e.spec.completed,
    chordCount: e.spec.chords.length,
    workoutCount: e.workoutCount,
    bothWatered: e.bothWatered,
    legendary: e.spec.legendary != null,
  });
  const window = ledger.slice(-WINDOW_DAYS).map(toGladeDay);
  const yesterdayWindow = ledger
    .slice(0, -1)
    .slice(-WINDOW_DAYS)
    .map(toGladeDay);

  return {
    tier: gladeTier(
      vitalityScore(window),
      tierForScore(vitalityScore(yesterdayWindow)),
    ),
    beings: beingStates(history),
  };
}

function nextDay(iso: string): string {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

function lastDayOfMonth(monthPrefix: string): string {
  const d = new Date(`${monthPrefix}-01T12:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + 1);
  d.setUTCDate(0);
  return d.toISOString().slice(0, 10);
}
