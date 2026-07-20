import Link from "next/link";
import { DailyRituals } from "@/components/journal/daily-rituals";
import { OwnColumn } from "@/components/journal/own-column";
import { PartnerColumn } from "@/components/journal/partner-column";
import { TrainLog } from "@/components/journal/train-log";
import { TodayRune } from "@/components/shell/rune-icons";
import { DISPLAY_NAMES, partnerOf } from "@/lib/auth";
import {
  getAllSpecimens,
  getDayExtras,
  getExerciseHistories,
  getJournalDay,
  getRecentSpecimens,
  getWeighIn,
  getWorkoutsForDay,
} from "@/lib/data";
import { addDays, currentTz, friendlyDate, todayIso } from "@/lib/dates";
import { newMarks } from "@/lib/engine/training";
import { currentProfile } from "@/lib/session";

// The ledger — the day's numbers, reached from the Today rune. The seal, the
// world, and the ceremonies live on the glade; this page is where the marks
// are made and read.
export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  const profile = await currentProfile();
  const partner = partnerOf(profile);
  const today = await todayIso();
  const tz = await currentTz();

  const { d } = await searchParams;
  const requested = d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : today;
  const day = requested > today ? today : requested;
  const isToday = day === today;

  const [journal, specimens, recents, extras, weighInLb] = await Promise.all([
    getJournalDay(day),
    getAllSpecimens(),
    getRecentSpecimens(profile),
    getDayExtras(day),
    getWeighIn(profile, day),
  ]);
  const [dayWorkouts, histories] = await Promise.all([
    getWorkoutsForDay(day),
    getExerciseHistories(day),
  ]);

  const ownMarks = newMarks(
    dayWorkouts[profile].flatMap((w) => w.sets),
    histories[profile].best,
  );

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 p-4">
      <div className="flex items-center gap-2 text-gold">
        <TodayRune size={16} />
        <h1 className="font-pixel text-sm uppercase tracking-[0.16em] text-ink">
          Today
        </h1>
        <span className="h-0 flex-1 border-t-[1.5px] border-ink/20" />
      </div>

      <nav className="flex items-center justify-between">
        <Link
          href={`/today?d=${addDays(day, -1)}`}
          className="wobbly-sm border-2 border-ink/20 bg-cream px-3 py-1 text-sm shadow-card"
        >
          ◀
        </Link>
        <div className="text-center">
          <p className="font-pixel text-sm tracking-wide">
            {isToday ? "today" : friendlyDate(day, tz)}
          </p>
          {!isToday ? (
            <Link
              href="/today"
              className="text-xs text-ink-soft underline decoration-dotted underline-offset-2"
            >
              back to today
            </Link>
          ) : (
            <p className="text-xs text-ink-soft">{friendlyDate(day, tz)}</p>
          )}
        </div>
        {isToday ? (
          <span className="wobbly-sm border-2 border-transparent px-3 py-1 text-sm opacity-30">
            ▶
          </span>
        ) : (
          <Link
            href={`/today?d=${addDays(day, 1)}`}
            className="wobbly-sm border-2 border-ink/20 bg-cream px-3 py-1 text-sm shadow-card"
          >
            ▶
          </Link>
        )}
      </nav>

      <div className="wobbly grid grid-cols-2 gap-4 border-2 border-ink/20 bg-cream/70 p-4 shadow-card">
        <OwnColumn
          displayName={DISPLAY_NAMES[profile]}
          day={day}
          entries={journal[profile].entries}
          target={journal[profile].target}
          specimens={specimens}
          recents={recents}
        />
        <div className="border-l-2 border-dashed border-ink/15 pl-4">
          <PartnerColumn
            displayName={DISPLAY_NAMES[partner]}
            entries={journal[partner].entries}
            target={journal[partner].target}
            mood={extras.meta[partner].mood}
            note={extras.meta[partner].note}
          />
        </div>
      </div>

      <DailyRituals day={day} meta={extras.meta[profile]} weighInLb={weighInLb} />

      <TrainLog
        day={day}
        workouts={dayWorkouts[profile]}
        exerciseNames={histories[profile].names}
        newMarkExercises={ownMarks}
        bestEntries={[...histories[profile].best]}
        training={extras.meta[profile].training}
      />

      {journal[profile].target === null ? (
        <Link
          href="/settings"
          className="wobbly-sm border-2 border-dashed border-ink/30 bg-transparent px-4 py-2 text-center text-sm text-ink-soft hover:border-gold"
        >
          no targets yet — chart your course →
        </Link>
      ) : null}
    </main>
  );
}
