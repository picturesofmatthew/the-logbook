import type { Metadata } from "next";
import Link from "next/link";
import { SigilGlyph } from "@/components/sigil/sigil-glyph";
import { BookRune } from "@/components/shell/rune-icons";
import { requireBond } from "@/lib/bond";
import { getDiscoveries, recordLegendary } from "@/lib/data";
import { currentTz, friendlyDate, todayIso } from "@/lib/dates";
import { Plate } from "@/components/shell/plate";
import { buildMonthLedger } from "@/lib/ledger";

export const metadata: Metadata = {
  title: "The Spellbook - signed × sealed",
};

function monthShift(monthPrefix: string, delta: number): string {
  const d = new Date(`${monthPrefix}-01T12:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + delta);
  return d.toISOString().slice(0, 7);
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const { bondId } = await requireBond();
  const today = await todayIso();
  const tz = await currentTz();
  const thisMonth = today.slice(0, 7);

  const { m } = await searchParams;
  const requested = m && /^\d{4}-\d{2}$/.test(m) ? m : thisMonth;
  const month = requested > thisMonth ? thisMonth : requested;

  const ledger = await buildMonthLedger(bondId, month, today);

  // Lazy discovery: any legendary this month's ledger reveals that history hasn't
  // claimed yet gets recorded here (earliest day first). The Legendarium itself
  // now lives in the Field Book (/library) and reads these back — recording stays
  // with the calendar so titles keep accruing as you flip through the months.
  const known = await getDiscoveries(bondId);
  for (const { day, spec } of ledger) {
    if (spec.legendary && !known.has(spec.legendary)) {
      await recordLegendary(bondId, spec.legendary, day);
    }
  }

  const monthLabel = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  }).format(new Date(`${month}-01T12:00:00Z`));

  const firstWeekday = new Date(`${month}-01T12:00:00Z`).getUTCDay();
  const sealedCount = ledger.filter((l) => l.spec.completed).length;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 p-4 pb-16">
      <header className="text-center">
        <h1 className="gilt-heading text-2xl tracking-wide">
          <BookRune size={24} /> THE SPELLBOOK
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          every day you both kept, sealed and remembered
        </p>
      </header>

      <nav className="flex items-center justify-between">
        <Link
          href={`/book?m=${monthShift(month, -1)}`}
          className="wobbly-sm border-2 border-ink/20 bg-cream px-3 py-1 text-sm shadow-card"
        >
          ◀
        </Link>
        <p className="font-display text-sm tracking-wide">
          {monthLabel.toLowerCase()}
          <span className="ml-2 text-[10px] text-ink-soft">
            {sealedCount} sealed
          </span>
        </p>
        {month < thisMonth ? (
          <Link
            href={`/book?m=${monthShift(month, 1)}`}
            className="wobbly-sm border-2 border-ink/20 bg-cream px-3 py-1 text-sm shadow-card"
          >
            ▶
          </Link>
        ) : (
          <span className="wobbly-sm border-2 border-transparent px-3 py-1 text-sm opacity-30">
            ▶
          </span>
        )}
      </nav>

      <Plate className="p-3">
        <div className="grid grid-cols-7 gap-1 text-center">
          {["s", "m", "t", "w", "t", "f", "s"].map((d, i) => (
            <span
              key={`${d}${i}`}
              className="font-display text-[9px] text-ink-soft/70"
            >
              {d}
            </span>
          ))}
          {Array.from({ length: firstWeekday }, (_, i) => (
            <span key={`pad${i}`} />
          ))}
          {ledger.map(({ day, spec }) => (
            <Link
              key={day}
              href={`/book/${day}`}
              title={friendlyDate(day, tz)}
              className={`flex flex-col items-center rounded-lg py-0.5 hover:bg-paper-deep/60 ${
                spec.tier === "legendary" ? "lantern-pool" : ""
              }`}
            >
              <SigilGlyph spec={spec} size={38} />
              <span className="text-[9px] text-ink-soft">
                {Number(day.slice(8))}
              </span>
            </Link>
          ))}
        </div>
      </Plate>
    </main>
  );
}
