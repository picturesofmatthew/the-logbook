import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DaySeal } from "@/components/sigil/day-seal";
import { MealGlyph, MoodFace, WaterDrop, WorkoutGlyph } from "@/components/glyphs";
import { requireBond, SLOTS, type Slot } from "@/lib/bond";
import {
  getDayExtras,
  getExerciseHistories,
  getFirstLogTimes,
  getJournalDay,
  getWeighIn,
  getWorkoutsForDay,
  keeperDayFromDay,
  recordLegendary,
  type WorkoutView,
} from "@/lib/data";
import { addDays, currentTz, friendlyDate, todayIso } from "@/lib/dates";
import { composeSigil } from "@/lib/engine/sigil";
import { totalOf } from "@/lib/engine/totals";
import { MEALS, type JournalEntry } from "@/lib/meals";
import { getFirstBothDay } from "@/lib/ledger";

export const metadata: Metadata = {
  title: "A day's page - signed × sealed",
};

function foldWorkout(w: WorkoutView): { label: string; detail: string }[] {
  const byExercise = new Map<string, WorkoutView["sets"]>();
  for (const s of w.sets) {
    const list = byExercise.get(s.exercise) ?? [];
    list.push(s);
    byExercise.set(s.exercise, list);
  }
  return [...byExercise.entries()].map(([exercise, list]) => ({
    label: exercise,
    detail: list
      .map((s) =>
        s.kind === "cardio"
          ? `${s.minutes} min`
          : s.weightLb != null
            ? `${s.weightLb}×${s.reps}`
            : `bw×${s.reps}`,
      )
      .join(" · "),
  }));
}

export default async function DayPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { bondId, members } = await requireBond();
  const { day } = await params;
  const today = await todayIso();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day > today) notFound();
  const tz = await currentTz();

  const [journal, extras, dayWorkouts, firstLogs, firstBothDay] =
    await Promise.all([
      getJournalDay(bondId, day),
      getDayExtras(bondId, day),
      getWorkoutsForDay(bondId, day),
      getFirstLogTimes(bondId, day),
      getFirstBothDay(bondId),
    ]);
  const [histories, mossWeighIn, emberWeighIn] = await Promise.all([
    getExerciseHistories(bondId, day),
    getWeighIn(bondId, "moss", day),
    getWeighIn(bondId, "ember", day),
  ]);
  const weighIns = { moss: mossWeighIn, ember: emberWeighIn };

  const totals = Object.fromEntries(
    SLOTS.map((slot) => [
      slot,
      totalOf(
        journal[slot].entries.map((e) => ({
          ...e.food,
          servings: e.servings,
        })),
      ),
    ]),
  ) as Record<Slot, ReturnType<typeof totalOf>>;

  const dayData = {
    journal,
    meta: extras.meta,
    workouts: dayWorkouts,
    histories,
    firstLogs,
  };
  const spec = composeSigil({
    day,
    moss: keeperDayFromDay("moss", dayData),
    ember: keeperDayFromDay("ember", dayData),
    firstPage: firstBothDay === day,
  });
  if (spec.legendary) await recordLegendary(bondId, spec.legendary, day);

  // Where a past day stands when the ring didn't close — warm, past-tense,
  // never a scold. A solo log was still a kept half.
  const soloKept = spec.moss.inked !== spec.ember.inked;
  const keptName = spec.moss.inked
    ? (members.moss?.displayName ?? "")
    : (members.ember?.displayName ?? "");
  const standingLine = spec.completed
    ? null
    : soloKept
      ? `${keptName} kept their half that day`
      : "an open page, unkept";

  const mealsFor = (entriesList: JournalEntry[]) =>
    MEALS.map((meal) => ({
      meal,
      items: entriesList.filter((e) => e.meal === meal.id),
    })).filter((g) => g.items.length > 0);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4 pb-16">
      <header className="text-center">
        <p className="font-display text-sm tracking-wide">
          {friendlyDate(day, tz).toLowerCase()}
        </p>
        <Link
          href={`/book?m=${day.slice(0, 7)}`}
          className="text-xs text-ink-soft underline decoration-dotted underline-offset-2"
        >
          back to the spellbook
        </Link>
      </header>

      <div className="wobbly hatch border-2 border-ink/20 bg-cream/70 p-3 shadow-card">
        <DaySeal spec={spec} standingLine={standingLine} isToday={false} />
      </div>

      <div className="wobbly grid grid-cols-2 gap-4 border-2 border-ink/20 bg-cream/70 p-4 shadow-card">
        {SLOTS.map((slot, i) => {
          const target = journal[slot].target;
          const over =
            target != null && totals[slot].calories > target.calories;
          return (
            <div
              key={slot}
              className={
                i === 1 ? "border-l-2 border-dashed border-ink/15 pl-4" : ""
              }
            >
              <p
                className={`font-display text-xs tracking-wide ${
                  slot === "moss" ? "text-moss-deep" : "text-terracotta"
                }`}
              >
                {(members[slot]?.displayName ?? "").toUpperCase()}
              </p>

              {journal[slot].entries.length === 0 ? (
                <p className="mt-2 text-xs text-ink-soft/70">
                  this page stayed quiet
                </p>
              ) : (
                <>
                  {mealsFor(journal[slot].entries).map(({ meal, items }) => (
                    <div key={meal.id} className="mt-2">
                      <p className="flex items-center gap-1 text-[10px] text-ink-soft">
                        <MealGlyph meal={meal.id} size={11} /> {meal.label}
                      </p>
                      {items.map((e) => (
                        <p key={e.id} className="text-xs leading-snug">
                          {e.food.icon} {e.food.name}
                          {e.servings !== 1 ? ` ×${e.servings}` : ""}
                        </p>
                      ))}
                    </div>
                  ))}
                  <p
                    className={`mt-2 text-xs ${
                      over ? "text-terracotta-soft" : "text-ink-soft"
                    }`}
                  >
                    {Math.round(totals[slot].calories)} kcal
                    {target ? ` / ${target.calories}` : ""} ·{" "}
                    {Math.round(totals[slot].proteinG)}g protein
                    {over ? " · a feast" : ""}
                  </p>
                </>
              )}

              {dayWorkouts[slot].map((w) => (
                <div key={w.id} className="mt-2">
                  <p className="flex items-center gap-1 text-[10px] text-ink-soft">
                    <WorkoutGlyph kind="lift" size={11} /> {w.title}
                  </p>
                  {foldWorkout(w).map((line) => (
                    <p key={line.label} className="text-xs leading-snug">
                      {line.label} — {line.detail}
                    </p>
                  ))}
                </div>
              ))}

              <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-ink-soft">
                {extras.meta[slot].waterCups > 0 ? (
                  <span className="flex items-center gap-1">
                    <WaterDrop filled size={12} /> {extras.meta[slot].waterCups} cups
                  </span>
                ) : null}
                {extras.meta[slot].mood ? (
                  <MoodFace mood={extras.meta[slot].mood} size={15} />
                ) : null}
                {weighIns[slot] != null ? <span>{weighIns[slot]} lb</span> : null}
              </p>
              {extras.meta[slot].note ? (
                <p className="mt-1 text-xs italic text-ink-soft">
                  “{extras.meta[slot].note}”
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <nav className="flex items-center justify-between">
        <Link
          href={`/book/${addDays(day, -1)}`}
          className="wobbly-sm border-2 border-ink/20 bg-cream px-3 py-1 text-sm shadow-card"
        >
          ◀ {addDays(day, -1).slice(5)}
        </Link>
        {addDays(day, 1) <= today ? (
          <Link
            href={`/book/${addDays(day, 1)}`}
            className="wobbly-sm border-2 border-ink/20 bg-cream px-3 py-1 text-sm shadow-card"
          >
            {addDays(day, 1).slice(5)} ▶
          </Link>
        ) : (
          <span className="wobbly-sm border-2 border-transparent px-3 py-1 text-sm opacity-30">
            ▶
          </span>
        )}
      </nav>
    </main>
  );
}
