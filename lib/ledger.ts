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
import { getActiveDream, type DreamRow } from "@/lib/data";
import { beingStates, type BeingState, type LedgerDay } from "@/lib/engine/beings";
import { boatState, type BoatDay, type BoatState } from "@/lib/engine/boat";
import {
  gladeTier,
  tierForScore,
  vitalityScore,
  WINDOW_DAYS,
  type GladeDay,
  type GladeTier,
} from "@/lib/engine/glade";
import { buildKeeperDay } from "@/lib/engine/keeper-day";
import {
  composeSigil,
  isLowMood,
  type KeeperDay,
  type SigilSpec,
} from "@/lib/engine/sigil";
import {
  est1Rm,
  normalizeExercise,
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

  // Lift sets up to the range's end, narrow columns only, for rolling PR
  // history. Sets after `end` can never affect a day inside the range.
  const allSetRows = await db
    .select({
      exercise: workoutSets.exercise,
      weightLb: workoutSets.weightLb,
      reps: workoutSets.reps,
      day: workouts.day,
      profileId: workouts.profileId,
    })
    .from(workoutSets)
    .innerJoin(workouts, eq(workoutSets.workoutId, workouts.id))
    .where(and(eq(workoutSets.kind, "lift"), lte(workouts.day, end)))
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
  // (Days with no lift sets have no snapshot; the empty-map fallback is
  // harmless there — a day without lifts can't strike a New Mark.)
  const historyBefore = new Map<Profile, Map<string, Map<string, number>>>();
  for (const profile of PROFILES) {
    const mine = allSetRows.filter((r) => r.profileId === profile);
    const byDay = new Map<string, typeof mine>();
    for (const r of mine) {
      const list = byDay.get(r.day) ?? [];
      list.push(r);
      byDay.set(r.day, list);
    }
    const snapshots = new Map<string, Map<string, number>>();
    const rolling = new Map<string, number>();
    for (const day of [...byDay.keys()].sort()) {
      snapshots.set(day, new Map(rolling));
      for (const s of byDay.get(day) ?? []) {
        if (s.weightLb == null || !s.reps) continue;
        const k = normalizeExercise(s.exercise);
        const rm = est1Rm(s.weightLb, s.reps);
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
    return buildKeeperDay({
      calories: f.calories,
      proteinG: f.proteinG,
      halls: [...f.halls],
      target: targetFor(profile, day),
      meta: meta ?? null,
      workouts: workoutsByKey.get(`${profile}:${day}`) ?? [],
      historyBest:
        historyBefore.get(profile)?.get(day) ?? new Map<string, number>(),
      firstLoggedAtMs: f.firstLoggedAtMs,
    });
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

// Ledger results are always derived from source rows, never stored — the
// whole history grows seals retroactively the moment it is read. Reads run
// on dynamic (cookie-gated) pages that already recompute per request; the
// bounded queries below keep that cheap. Per-household caching is a
// scale-time concern, designed alongside the household boundary.
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
  // The most recent legendary day, if any — the Pale Elk listens for it.
  lastLegendaryDay: string | null;
  // The far shore and the boat you're building toward it — derived from the
  // same ledger scan.
  dream: DreamRow | null;
  boat: BoatState | null;
};

export async function getGladeState(today: string): Promise<GladeState> {
  const [firstDay, dream] = await Promise.all([
    getFirstEntryDay(),
    getActiveDream(),
  ]);

  // Planks ride the same ledger the beings do — a completed day since this
  // vessel's build began sets one. No second full-history scan.
  const boatFrom = (entriesForBoat: LedgerEntry[]): BoatState | null => {
    if (!dream) return null;
    const boatDays: BoatDay[] = entriesForBoat.map((e) => ({
      day: e.day,
      completed: e.spec.completed,
      tier: e.spec.tier,
    }));
    return boatState(boatDays, {
      name: dream.name,
      plankGoal: dream.distanceDays,
      startedDay: dream.startedDay,
    });
  };

  if (!firstDay) {
    return {
      tier: "hushed",
      beings: beingStates([]),
      lastLegendaryDay: null,
      dream,
      boat: boatFrom([]),
    };
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

  const lastLegendaryDay =
    ledger.filter((e) => e.spec.legendary != null).at(-1)?.day ?? null;

  return {
    tier: gladeTier(
      vitalityScore(window),
      tierForScore(vitalityScore(yesterdayWindow)),
    ),
    beings: beingStates(history),
    lastLegendaryDay,
    dream,
    boat: boatFrom(ledger),
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
