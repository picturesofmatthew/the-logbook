import Link from "next/link";
import { DailyRituals } from "@/components/journal/daily-rituals";
import { OwnColumn } from "@/components/journal/own-column";
import { PartnerColumn } from "@/components/journal/partner-column";
import { FoxHeader } from "@/components/pet/fox-header";
import { DISPLAY_NAMES, PROFILES, partnerOf } from "@/lib/auth";
import {
  getAllSpecimens,
  getDayExtras,
  getJournalDay,
  getPetState,
  getRecentSpecimens,
  getWeighIn,
} from "@/lib/data";
import { addDays, currentTz, diffDays, friendlyDate, todayIso } from "@/lib/dates";
import { totalOf } from "@/lib/engine/totals";
import { stampsForDay } from "@/lib/engine/stamps";
import { currentProfile } from "@/lib/session";

export default async function Home({
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

  const [journal, specimens, recents, petState, extras, weighInLb] =
    await Promise.all([
      getJournalDay(day),
      getAllSpecimens(),
      getRecentSpecimens(profile),
      getPetState(today),
      getDayExtras(day),
      getWeighIn(profile, day),
    ]);

  const dayNumber =
    diffDays(day, petState.adoptedAt.toISOString().slice(0, 10)) + 1;

  const stamps = stampsForDay({
    people: PROFILES.map((p) => ({
      name: DISPLAY_NAMES[p],
      total: totalOf(
        journal[p].entries.map((e) => ({ ...e.food, servings: e.servings })),
      ),
      target: journal[p].target,
      loggedAny: journal[p].entries.length > 0,
      training: extras.meta[p].training,
      waterCups: extras.meta[p].waterCups,
    })),
    newSpecimens: extras.newSpecimens,
  });

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4 pb-24">
      <FoxHeader petState={petState} today={today} dayNumber={dayNumber} />

      <nav className="flex items-center justify-between">
        <Link
          href={`/?d=${addDays(day, -1)}`}
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
              href="/"
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
            href={`/?d=${addDays(day, 1)}`}
            className="wobbly-sm border-2 border-ink/20 bg-cream px-3 py-1 text-sm shadow-card"
          >
            ▶
          </Link>
        )}
      </nav>

      {stamps.length > 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {stamps.map((s) => (
            <span
              key={s.id}
              title={s.label}
              className="wobbly-sm border border-gold bg-gold-soft px-2 py-0.5 text-xs"
            >
              {s.emoji} {s.label}
            </span>
          ))}
        </div>
      ) : null}

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
          />
        </div>
      </div>

      <DailyRituals day={day} meta={extras.meta[profile]} weighInLb={weighInLb} />

      {journal[profile].target === null ? (
        <Link
          href="/settings"
          className="wobbly-sm border-2 border-dashed border-ink/30 bg-transparent px-4 py-2 text-center text-sm text-ink-soft hover:border-gold"
        >
          no targets yet — set up your cut →
        </Link>
      ) : null}

      <footer className="mt-2 flex items-center justify-center gap-5 text-sm text-ink-soft">
        <Link
          href="/museum"
          className="underline decoration-dotted underline-offset-4"
        >
          🏛 museum
        </Link>
        <Link
          href="/trends"
          className="underline decoration-dotted underline-offset-4"
        >
          📈 trends
        </Link>
        <Link
          href="/settings"
          className="underline decoration-dotted underline-offset-4"
        >
          settings
        </Link>
        <Link
          href="/enter"
          className="underline decoration-dotted underline-offset-4"
        >
          switch profile
        </Link>
      </footer>
    </main>
  );
}
