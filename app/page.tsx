import Link from "next/link";
import { eq } from "drizzle-orm";
import { OwnColumn } from "@/components/journal/own-column";
import { PartnerColumn } from "@/components/journal/partner-column";
import { PixelSprite } from "@/components/pixel-sprite";
import { PET_KIT, PET_PALETTE } from "@/components/sprites";
import { db } from "@/db";
import { pet } from "@/db/schema";
import { DISPLAY_NAMES, partnerOf } from "@/lib/auth";
import { getAllSpecimens, getJournalDay, getRecentSpecimens } from "@/lib/data";
import { addDays, currentTz, friendlyDate, todayIso } from "@/lib/dates";
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

  const [journal, specimens, recents, [petRow]] = await Promise.all([
    getJournalDay(day),
    getAllSpecimens(),
    getRecentSpecimens(profile),
    db.select().from(pet).where(eq(pet.id, 1)),
  ]);

  const adopted = petRow?.adoptedAt ?? new Date();
  const dayNumber =
    Math.floor(
      (new Date(day + "T12:00:00Z").getTime() -
        new Date(adopted.toISOString().slice(0, 10) + "T12:00:00Z").getTime()) /
        86400000,
    ) + 1;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4 pb-24">
      <header className="wobbly flex items-center gap-3 border-2 border-ink/20 bg-cream/70 p-3 shadow-card">
        <PixelSprite
          map={PET_KIT}
          palette={PET_PALETTE}
          className="h-14 w-14 shrink-0"
          title="A small arctic fox kit"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-pixel text-sm tracking-wide">
            {petRow?.name ?? "the little fox"}
          </p>
          <p className="text-xs text-ink-soft">
            waiting by the museum door
          </p>
        </div>
        <div className="text-right">
          <p className="font-pixel text-sm">day {Math.max(dayNumber, 1)}</p>
          <Link
            href="/settings"
            className="text-xs text-ink-soft underline decoration-dotted underline-offset-2"
          >
            settings
          </Link>
        </div>
      </header>

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

      {journal[profile].target === null ? (
        <Link
          href="/settings"
          className="wobbly-sm border-2 border-dashed border-ink/30 bg-transparent px-4 py-2 text-center text-sm text-ink-soft hover:border-gold"
        >
          no targets yet — set up your cut →
        </Link>
      ) : null}

      <footer className="mt-2 flex items-center justify-center gap-5 text-sm text-ink-soft">
        <span className="opacity-50">museum (soon)</span>
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
