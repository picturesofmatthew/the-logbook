import {
  and,
  asc,
  countDistinct,
  desc,
  eq,
  gte,
  inArray,
  isNull,
  lte,
  max,
  min,
} from "drizzle-orm";
import { db } from "@/db";
import {
  dayMeta,
  dreams,
  entries,
  familiar,
  foods,
  sigilDiscoveries,
  targets,
  weighIns,
  workouts,
  workoutSets,
} from "@/db/schema";
import { getBondMembers, SLOTS, type Slot } from "@/lib/bond";
import { decrypt, decryptOrNull } from "@/lib/crypto";
import { diffDays } from "@/lib/dates";
import { buildKeeperDay } from "@/lib/engine/keeper-day";
import type { KeeperDay } from "@/lib/engine/sigil";
import { totalOf } from "@/lib/engine/totals";
import {
  bestByExercise,
  splitFamilyFor,
  type SplitFamily,
  type WorkoutSet,
} from "@/lib/engine/training";
import type { JournalEntry, Specimen, Target } from "@/lib/meals";

// Every per-bond reader takes a `bondId` (resolved once per request via
// requireBond()) and returns state keyed by Slot (moss | ember), bucketed from
// the bond's two members. The shared food museum (`foods`) stays global.

export type JournalDay = Record<
  Slot,
  { entries: JournalEntry[]; target: Target }
>;

export async function getJournalDay(
  bondId: string,
  day: string,
): Promise<JournalDay> {
  const members = await getBondMembers(bondId);
  const rows = await db
    .select({ entry: entries, food: foods })
    .from(entries)
    .innerJoin(foods, eq(entries.foodId, foods.id))
    .where(and(eq(entries.bondId, bondId), eq(entries.day, day)))
    .orderBy(entries.loggedAt);

  const result = {} as JournalDay;
  for (const slot of SLOTS) {
    const pid = members[slot]?.id;
    const [target] = pid
      ? await db
          .select()
          .from(targets)
          .where(
            and(
              eq(targets.bondId, bondId),
              eq(targets.profileId, pid),
              lte(targets.effectiveDate, day),
            ),
          )
          .orderBy(desc(targets.effectiveDate), desc(targets.id))
          .limit(1)
      : [];

    result[slot] = {
      target: target
        ? {
            calories: target.calories,
            proteinG: target.proteinG,
            carbsG: target.carbsG,
            fatG: target.fatG,
          }
        : null,
      entries: pid
        ? rows
            .filter((r) => r.entry.profileId === pid)
            .map((r) => ({
              id: r.entry.id,
              meal: r.entry.meal,
              servings: r.entry.servings,
              food: r.food as Specimen,
            }))
        : [],
    };
  }
  return result;
}

// The museum is a single shared library across all bonds (the "collection IS the
// food database" thesis) — deliberately not bond-scoped.
export async function getAllSpecimens(): Promise<Specimen[]> {
  const rows = await db.select().from(foods).orderBy(foods.name);
  return rows as Specimen[];
}

export type FamiliarStateRaw = {
  name: string | null;
  adoptedAt: Date;
  lifetimeDays: number;
  loggedToday: Slot[];
  daysSinceAnyEntry: number | null;
};

// The one definition of a "both-logged day" for a bond: both keepers logged food
// that day. Same rule the sigil engine encodes as `moss.loggedAny &&
// ember.loggedAny`. Bond-scoped — this is THE cross-bond contamination point if
// left global (two strangers logging the same date would forge a both-day).
export async function bothLoggedDays(
  bondId: string,
  range?: { start: string; end: string },
): Promise<Set<string>> {
  const rows = await db
    .select({ day: entries.day, n: countDistinct(entries.profileId) })
    .from(entries)
    .where(
      range
        ? and(
            eq(entries.bondId, bondId),
            gte(entries.day, range.start),
            lte(entries.day, range.end),
          )
        : eq(entries.bondId, bondId),
    )
    .groupBy(entries.day);
  return new Set(rows.filter((r) => Number(r.n) >= 2).map((r) => r.day));
}

export async function getFamiliarState(
  bondId: string,
  today: string,
): Promise<FamiliarStateRaw> {
  const members = await getBondMembers(bondId);
  const [familiarRow] = await db
    .select()
    .from(familiar)
    .where(eq(familiar.bondId, bondId));

  const bothDays = await bothLoggedDays(bondId);
  const lifetimeDays = bothDays.size;

  const idToSlot = new Map<string, Slot>();
  for (const slot of SLOTS) {
    const m = members[slot];
    if (m) idToSlot.set(m.id, slot);
  }

  const todayRows = await db
    .selectDistinct({ p: entries.profileId })
    .from(entries)
    .where(and(eq(entries.bondId, bondId), eq(entries.day, today)));
  const loggedToday = todayRows
    .map((r) => idToSlot.get(r.p))
    .filter((s): s is Slot => !!s);

  // Days since anyone in the bond logged at all — feeds the fox's mood. Never a streak.
  const [lastRow] = await db
    .select({ last: max(entries.day) })
    .from(entries)
    .where(eq(entries.bondId, bondId));
  const lastDay = lastRow?.last ?? null;
  const daysSinceAnyEntry = lastDay ? diffDays(today, lastDay) : null;

  return {
    name: familiarRow?.name ?? null,
    adoptedAt: familiarRow?.adoptedAt ?? new Date(),
    lifetimeDays,
    loggedToday,
    daysSinceAnyEntry,
  };
}

export type DayMetaRow = {
  training: "lift" | "cardio" | "rest" | null;
  waterCups: number;
  note: string | null;
  mood: string | null;
  // Decrypted here; the REVEAL gate (own vs. theirs, ring open vs. closed) is
  // the renderer's job — see lib/sealed-word. Never hand a keeper's word to the
  // client without passing it through revealSealedWord() first.
  sealedWord: string | null;
};

export async function getDayExtras(
  bondId: string,
  day: string,
): Promise<{
  meta: Record<Slot, DayMetaRow>;
  newSpecimens: number;
}> {
  const members = await getBondMembers(bondId);
  const metaRows = await db
    .select()
    .from(dayMeta)
    .where(and(eq(dayMeta.bondId, bondId), eq(dayMeta.day, day)));

  // "New specimen" = a food this bond logged for the first time on `day` (their
  // discovery moment). Bond-scoped over entries; the shared museum may already
  // hold it from another bond, but the stamp celebrates it being new to you.
  const firstDays = await db
    .select({ foodId: entries.foodId })
    .from(entries)
    .where(eq(entries.bondId, bondId))
    .groupBy(entries.foodId)
    .having(eq(min(entries.day), day));
  const newSpecimens = firstDays.length;

  const meta = {} as Record<Slot, DayMetaRow>;
  for (const slot of SLOTS) {
    const pid = members[slot]?.id;
    const row = pid ? metaRows.find((m) => m.profileId === pid) : undefined;
    meta[slot] = {
      training: row?.training ?? null,
      waterCups: row?.waterCups ?? 0,
      note: decryptOrNull(row?.note),
      mood: decryptOrNull(row?.mood),
      sealedWord: decryptOrNull(row?.sealedWord),
    };
  }
  return { meta, newSpecimens };
}

export async function getWeighIn(
  bondId: string,
  slot: Slot,
  day: string,
): Promise<number | null> {
  const members = await getBondMembers(bondId);
  const pid = members[slot]?.id;
  if (!pid) return null;
  const [row] = await db
    .select({ weightLb: weighIns.weightLb })
    .from(weighIns)
    .where(
      and(
        eq(weighIns.bondId, bondId),
        eq(weighIns.profileId, pid),
        eq(weighIns.day, day),
      ),
    );
  if (!row?.weightLb) return null;
  const dec = decrypt(row.weightLb);
  return dec != null ? Number(dec) : null;
}

export type WeighInPoint = { day: string; weightLb: number };

export async function getAllWeighIns(
  bondId: string,
): Promise<Record<Slot, WeighInPoint[]>> {
  const members = await getBondMembers(bondId);
  const rows = await db
    .select()
    .from(weighIns)
    .where(eq(weighIns.bondId, bondId))
    .orderBy(asc(weighIns.day));
  const result = {} as Record<Slot, WeighInPoint[]>;
  for (const slot of SLOTS) {
    const pid = members[slot]?.id;
    result[slot] = pid
      ? rows
          .filter((r) => r.profileId === pid)
          .map((r) => {
            const dec = decrypt(r.weightLb);
            return dec != null ? { day: r.day, weightLb: Number(dec) } : null;
          })
          .filter((p): p is WeighInPoint => p != null)
      : [];
  }
  return result;
}

export type DailyTotal = { day: string; calories: number; proteinG: number };

// Per-person daily calorie/protein sums since a date — for weekly averages.
export async function getDailyTotalsSince(
  bondId: string,
  sinceDay: string,
): Promise<Record<Slot, DailyTotal[]>> {
  const members = await getBondMembers(bondId);
  const rows = await db
    .select({ entry: entries, food: foods })
    .from(entries)
    .innerJoin(foods, eq(entries.foodId, foods.id))
    .where(and(eq(entries.bondId, bondId), gte(entries.day, sinceDay)));

  const result = {} as Record<Slot, DailyTotal[]>;
  for (const slot of SLOTS) {
    const pid = members[slot]?.id;
    const byDay = new Map<string, DailyTotal>();
    if (pid) {
      for (const r of rows) {
        if (r.entry.profileId !== pid) continue;
        const t = byDay.get(r.entry.day) ?? {
          day: r.entry.day,
          calories: 0,
          proteinG: 0,
        };
        t.calories += r.food.calories * r.entry.servings;
        t.proteinG += r.food.proteinG * r.entry.servings;
        byDay.set(r.entry.day, t);
      }
    }
    result[slot] = [...byDay.values()].sort((a, b) =>
      a.day.localeCompare(b.day),
    );
  }
  return result;
}

// Marks for the stamp calendar: which days that month were both-logged,
// and who trained on which day.
export async function getMonthMarks(
  bondId: string,
  monthPrefix: string,
): Promise<{
  bothDays: Set<string>;
  training: Record<Slot, Record<string, string>>;
}> {
  const start = `${monthPrefix}-01`;
  const end = `${monthPrefix}-31`;
  const members = await getBondMembers(bondId);
  const bothDays = await bothLoggedDays(bondId, { start, end });

  const metaRows = await db
    .select()
    .from(dayMeta)
    .where(
      and(
        eq(dayMeta.bondId, bondId),
        gte(dayMeta.day, start),
        lte(dayMeta.day, end),
      ),
    );
  const training = {} as Record<Slot, Record<string, string>>;
  for (const slot of SLOTS) {
    training[slot] = {};
    const pid = members[slot]?.id;
    if (!pid) continue;
    for (const m of metaRows) {
      if (m.profileId === pid && m.training && m.training !== "rest") {
        training[slot][m.day] = m.training;
      }
    }
  }
  return { bothDays, training };
}

// Earliest log moment per keeper for a day — the Mirror at Dusk listens.
export async function getFirstLogTimes(
  bondId: string,
  day: string,
): Promise<Record<Slot, number | null>> {
  const members = await getBondMembers(bondId);
  const rows = await db
    .select({ p: entries.profileId, first: min(entries.loggedAt) })
    .from(entries)
    .where(and(eq(entries.bondId, bondId), eq(entries.day, day)))
    .groupBy(entries.profileId);
  const result = {} as Record<Slot, number | null>;
  for (const slot of SLOTS) {
    const pid = members[slot]?.id;
    const row = pid ? rows.find((r) => r.p === pid) : undefined;
    result[slot] = row?.first ? new Date(row.first).getTime() : null;
  }
  return result;
}

// ── The Training Log ──

export type WorkoutView = {
  id: number;
  title: string;
  note: string | null;
  sets: {
    kind: "lift" | "cardio";
    exercise: string;
    setIndex: number;
    weightLb: number | null;
    reps: number | null;
    minutes: number | null;
  }[];
};

export async function getWorkoutsForDay(
  bondId: string,
  day: string,
): Promise<Record<Slot, WorkoutView[]>> {
  const members = await getBondMembers(bondId);
  const workoutRows = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.bondId, bondId), eq(workouts.day, day)))
    .orderBy(asc(workouts.createdAt));

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

  const result = {} as Record<Slot, WorkoutView[]>;
  for (const slot of SLOTS) {
    const pid = members[slot]?.id;
    result[slot] = pid
      ? workoutRows
          .filter((w) => w.profileId === pid)
          .map((w) => ({
            id: w.id,
            title: w.title,
            note: w.note,
            sets: setRows
              .filter((s) => s.workoutId === w.id)
              .map((s) => ({
                kind: s.kind,
                exercise: s.exercise,
                setIndex: s.setIndex,
                weightLb: s.weightLb,
                reps: s.reps,
                minutes: s.minutes,
              })),
          }))
      : [];
  }
  return result;
}

// History for PR detection (best est. 1RM per exercise from sets logged
// strictly before the day) and autocomplete (every exercise name ever used).
// One narrow, lift-only query serves both keepers.
export type ExerciseHistory = { best: Map<string, number>; names: string[] };

export async function getExerciseHistories(
  bondId: string,
  beforeDay: string,
): Promise<Record<Slot, ExerciseHistory>> {
  const members = await getBondMembers(bondId);
  const rows = await db
    .select({
      profileId: workouts.profileId,
      day: workouts.day,
      exercise: workoutSets.exercise,
      weightLb: workoutSets.weightLb,
      reps: workoutSets.reps,
    })
    .from(workoutSets)
    .innerJoin(workouts, eq(workoutSets.workoutId, workouts.id))
    .where(and(eq(workouts.bondId, bondId), eq(workoutSets.kind, "lift")));

  const result = {} as Record<Slot, ExerciseHistory>;
  for (const slot of SLOTS) {
    const pid = members[slot]?.id;
    const mine = pid ? rows.filter((r) => r.profileId === pid) : [];
    const prior: WorkoutSet[] = mine
      .filter((r) => r.day < beforeDay)
      .map((r) => ({
        kind: "lift" as const,
        exercise: r.exercise,
        weightLb: r.weightLb,
        reps: r.reps,
        minutes: null,
      }));
    result[slot] = {
      best: bestByExercise(prior),
      names: [...new Set(mine.map((r) => r.exercise))].sort(),
    };
  }
  return result;
}

// One keeper's day assembled from the per-day data-function outputs. The home
// glade and a day's page in the spellbook share this exact assembly, so a day
// can never seal differently between them. (The ledger builds its KeeperDays a
// second way — from bulk range queries — but through the same buildKeeperDay.)
export function keeperDayFromDay(
  slot: Slot,
  d: {
    journal: JournalDay;
    meta: Record<Slot, DayMetaRow>;
    workouts: Record<Slot, WorkoutView[]>;
    histories: Record<Slot, ExerciseHistory>;
    firstLogs: Record<Slot, number | null>;
  },
): KeeperDay {
  const total = totalOf(
    d.journal[slot].entries.map((e) => ({ ...e.food, servings: e.servings })),
  );
  return buildKeeperDay({
    calories: total.calories,
    proteinG: total.proteinG,
    halls: [...new Set(d.journal[slot].entries.map((e) => e.food.hall))],
    target: d.journal[slot].target,
    meta: d.meta[slot],
    workouts: d.workouts[slot],
    historyBest: d.histories[slot].best,
    firstLoggedAtMs: d.firstLogs[slot],
  });
}

// ── Legendary discoveries ──
// One row per legendary PER BOND, ever. Returns true only for the row that
// landed — the caller that gets `true` throws the ceremony.

export async function recordLegendary(
  bondId: string,
  sigilId: string,
  day: string,
): Promise<boolean> {
  const rows = await db
    .insert(sigilDiscoveries)
    .values({ bondId, sigilId, day })
    .onConflictDoNothing({
      target: [sigilDiscoveries.bondId, sigilDiscoveries.sigilId],
    })
    .returning({ id: sigilDiscoveries.id });
  return rows.length > 0;
}

export async function getDiscoveries(
  bondId: string,
): Promise<Map<string, string>> {
  const rows = await db
    .select()
    .from(sigilDiscoveries)
    .where(eq(sigilDiscoveries.bondId, bondId));
  return new Map(rows.map((r) => [r.sigilId, r.day]));
}

// (Beings used to record arrivals here, mirroring the legendary gate above.
// They no longer do: the ledger already knows the day each being's threshold
// was crossed, so the Bestiary reads `arrivedOn` from lib/engine/beings and the
// home render writes nothing. The `being_arrivals` table is retired — kept in
// the schema so old rows aren't dropped, read by nothing.)

// ── The Dream / the boat to the far shore ──
// Exactly one shore is `active` at a time PER BOND; reached shores are kept as
// history. Planks are never stored — derived from the ledger (lib/engine/boat).

export type DreamRow = {
  id: number;
  name: string;
  distanceDays: number;
  startedDay: string;
  reachedDay: string | null;
  status: "active" | "reached";
};

export async function getActiveDream(bondId: string): Promise<DreamRow | null> {
  const [row] = await db
    .select()
    .from(dreams)
    .where(and(eq(dreams.bondId, bondId), eq(dreams.status, "active")))
    .orderBy(desc(dreams.id))
    .limit(1);
  return row ?? null;
}

// Past shores, most recent first — the "shores reached" record.
export async function getReachedShores(bondId: string): Promise<DreamRow[]> {
  return db
    .select()
    .from(dreams)
    .where(and(eq(dreams.bondId, bondId), eq(dreams.status, "reached")))
    .orderBy(desc(dreams.reachedDay));
}

// Rename / re-scope THIS bond's active shore. Scoped by bond_id — without it,
// one bond's edit would rewrite every bond's active dream (the contamination
// bug the audit flagged).
export async function updateActiveDream(
  bondId: string,
  fields: { name: string; distanceDays: number },
): Promise<void> {
  await db
    .update(dreams)
    .set({ name: fields.name, distanceDays: fields.distanceDays })
    .where(and(eq(dreams.bondId, bondId), eq(dreams.status, "active")));
}

// The arrival gate — claim-once, like recordLegendary. Bond-scoped in the WHERE
// as defense-in-depth (a forged dreamId can't reach another bond's shore).
export async function reachShore(
  bondId: string,
  dreamId: number,
  day: string,
): Promise<boolean> {
  const rows = await db
    .update(dreams)
    .set({ reachedDay: day })
    .where(
      and(
        eq(dreams.bondId, bondId),
        eq(dreams.id, dreamId),
        eq(dreams.status, "active"),
        isNull(dreams.reachedDay),
      ),
    )
    .returning({ id: dreams.id });
  return rows.length > 0;
}

// Choose the next shore for THIS bond: archive its reached one, begin a fresh
// vessel. Scoped by bond_id so it never archives another bond's active dream.
export async function chooseNextShore(
  bondId: string,
  fields: { name: string; distanceDays: number; startedDay: string },
): Promise<void> {
  await db
    .update(dreams)
    .set({ status: "reached" })
    .where(and(eq(dreams.bondId, bondId), eq(dreams.status, "active")));
  await db.insert(dreams).values({
    bondId,
    name: fields.name,
    distanceDays: fields.distanceDays,
    startedDay: fields.startedDay,
    status: "active",
  });
}

// The specimens this person logs most recently within their bond — the
// quick-tap grid.
export async function getRecentSpecimens(
  bondId: string,
  profileId: string,
  limit = 12,
): Promise<Specimen[]> {
  const recent = await db
    .select({ foodId: entries.foodId, last: max(entries.loggedAt) })
    .from(entries)
    .where(and(eq(entries.bondId, bondId), eq(entries.profileId, profileId)))
    .groupBy(entries.foodId)
    .orderBy(desc(max(entries.loggedAt)))
    .limit(limit);

  if (recent.length === 0) return [];
  const ids = recent.map((r) => r.foodId);
  const rows = await db.select().from(foods).where(inArray(foods.id, ids));
  const byId = new Map(rows.map((r) => [r.id, r as Specimen]));
  return ids.map((id) => byId.get(id)).filter((s): s is Specimen => !!s);
}

// This keeper's recent workouts (with sets), most-recent first, tagged by
// split family — the source for capture's "repeat last Push/Pull/Legs…".
// Rest days (no sets) are skipped; there's nothing to repeat.
export type RecentWorkout = {
  id: number;
  title: string;
  day: string;
  family: SplitFamily;
  sets: {
    kind: "lift" | "cardio";
    exercise: string;
    weightLb: number | null;
    reps: number | null;
    minutes: number | null;
  }[];
};

export async function getRecentWorkouts(
  bondId: string,
  profileId: string,
  limit = 12,
): Promise<RecentWorkout[]> {
  const workoutRows = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.bondId, bondId), eq(workouts.profileId, profileId)))
    .orderBy(desc(workouts.day), desc(workouts.createdAt))
    .limit(limit);
  if (workoutRows.length === 0) return [];

  const setRows = await db
    .select()
    .from(workoutSets)
    .where(
      inArray(
        workoutSets.workoutId,
        workoutRows.map((w) => w.id),
      ),
    )
    .orderBy(asc(workoutSets.id));

  return workoutRows
    .map((w) => {
      const sets = setRows
        .filter((s) => s.workoutId === w.id)
        .map((s) => ({
          kind: s.kind,
          exercise: s.exercise,
          weightLb: s.weightLb,
          reps: s.reps,
          minutes: s.minutes,
        }));
      return {
        id: w.id,
        title: w.title,
        day: w.day,
        family: splitFamilyFor({ title: w.title, sets: sets as WorkoutSet[] }),
        sets,
      };
    })
    .filter((w) => w.sets.length > 0);
}
