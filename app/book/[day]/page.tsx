import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DaySeal } from "@/components/sigil/day-seal";
import { MealGlyph, MoodFace, WaterDrop, WorkoutGlyph } from "@/components/glyphs";
import { DISPLAY_NAMES, PROFILES, type Profile } from "@/lib/auth";
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
import { currentProfile } from "@/lib/session";

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
  await currentProfile();
  const { day } = await params;
  const today = await todayIso();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day > today) notFound();
  const tz = await currentTz();

  const [journal, extras, dayWorkouts, firstLogs, firstBothDay] =
    await Promise.all([
      getJournalDay(day),
      getDayExtras(day),
      getWorkoutsForDay(day),
      getFirstLogTimes(day),
      getFirstBothDay(),
    ]);
  const [histories, matthewWeighIn, kennedyWeighIn] = await Promise.all([
    getExerciseHistories(day),
    getWeighIn("matthew", day),
    getWeighIn("kennedy", day),
  ]);
  const weighIns = { matthew: matthewWeighIn, kennedy: kennedyWeighIn };

  const totals = Object.fromEntries(
    PROFILES.map((p) => [
      p,
      totalOf(
        journal[p].entries.map((e) => ({ ...e.food, servings: e.servings })),
      ),
    ]),
  ) as Record<Profile, ReturnType<typeof totalOf>>;

  const dayData = {
    journal,
    meta: extras.meta,
    workouts: dayWorkouts,
    histories,
    firstLogs,
  };
  const spec = composeSigil({
    day,
    moss: keeperDayFromDay("matthew", dayData),
    ember: keeperDayFromDay("kennedy", dayData),
    firstPage: firstBothDay === day,
  });
  if (spec.legendary) await recordLegendary(spec.legendary, day);

  const notLogged = PROFILES.filter((p) => journal[p].entries.length === 0);
  const missingName =
    notLogged.length === 2
      ? "you both"
      : notLogged.length === 1
        ? DISPLAY_NAMES[notLogged[0]]
        : null;

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
        <DaySeal spec={spec} missingName={missingName} isToday={false} />
      </div>

      <div className="wobbly grid grid-cols-2 gap-4 border-2 border-ink/20 bg-cream/70 p-4 shadow-card">
        {PROFILES.map((p, i) => {
          const target = journal[p].target;
          const over =
            target != null && totals[p].calories > target.calories;
          return (
            <div
              key={p}
              className={
                i === 1 ? "border-l-2 border-dashed border-ink/15 pl-4" : ""
              }
            >
              <p
                className={`font-display text-xs tracking-wide ${
                  p === "matthew" ? "text-moss-deep" : "text-terracotta"
                }`}
              >
                {DISPLAY_NAMES[p].toUpperCase()}
              </p>

              {journal[p].entries.length === 0 ? (
                <p className="mt-2 text-xs text-ink-soft/70">
                  this page stayed quiet
                </p>
              ) : (
                <>
                  {mealsFor(journal[p].entries).map(({ meal, items }) => (
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
                    {Math.round(totals[p].calories)} kcal
                    {target ? ` / ${target.calories}` : ""} ·{" "}
                    {Math.round(totals[p].proteinG)}g protein
                    {over ? " · a feast" : ""}
                  </p>
                </>
              )}

              {dayWorkouts[p].map((w) => (
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
                {extras.meta[p].waterCups > 0 ? (
                  <span className="flex items-center gap-1">
                    <WaterDrop filled size={12} /> {extras.meta[p].waterCups} cups
                  </span>
                ) : null}
                {extras.meta[p].mood ? (
                  <MoodFace mood={extras.meta[p].mood} size={15} />
                ) : null}
                {weighIns[p] != null ? <span>{weighIns[p]} lb</span> : null}
              </p>
              {extras.meta[p].note ? (
                <p className="mt-1 text-xs italic text-ink-soft">
                  “{extras.meta[p].note}”
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
