import type { Metadata } from "next";
import Link from "next/link";
import { BeingPortrait } from "@/components/glade/being-portrait";
import { SigilGlyph } from "@/components/sigil/sigil-glyph";
import { getArrivals, getDiscoveries, recordLegendary } from "@/lib/data";
import { currentTz, friendlyDate, todayIso } from "@/lib/dates";
import { BEINGS } from "@/lib/engine/beings";
import { LEGENDARIES, type LegendaryId, type SigilSpec } from "@/lib/engine/sigil";
import { buildMonthLedger, getGladeState } from "@/lib/ledger";
import { currentProfile } from "@/lib/session";

export const metadata: Metadata = {
  title: "The Spellbook - signed × sealed",
};

// A display-only spec for a discovered legendary's plate in the Legendarium.
function legendarySpec(id: LegendaryId): SigilSpec {
  let seed = 0;
  for (const ch of id) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  return {
    completed: true,
    moss: { inked: true, weight: "even" },
    ember: { inked: true, weight: "even" },
    radicals: [],
    ornaments: [],
    newMark: false,
    chords: [],
    legendary: id,
    tier: "legendary",
    seed,
  };
}

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
  await currentProfile();
  const today = await todayIso();
  const tz = await currentTz();
  const thisMonth = today.slice(0, 7);

  const { m } = await searchParams;
  const requested = m && /^\d{4}-\d{2}$/.test(m) ? m : thisMonth;
  const month = requested > thisMonth ? thisMonth : requested;

  const ledger = await buildMonthLedger(month, today);

  const [initialDiscoveries, glade, arrivals] = await Promise.all([
    getDiscoveries(),
    getGladeState(today),
    getArrivals(),
  ]);

  // Lazy discovery: any legendary this page just computed and hasn't recorded
  // yet gets its row — earliest day first, so history claims titles in order.
  // Skipping already-known ids avoids a no-op INSERT per legendary per view.
  const undiscovered = ledger.filter(
    (e) => e.spec.legendary && !initialDiscoveries.has(e.spec.legendary),
  );
  for (const { day, spec } of undiscovered) {
    if (spec.legendary) await recordLegendary(spec.legendary, day);
  }
  const discoveries =
    undiscovered.length > 0 ? await getDiscoveries() : initialDiscoveries;
  const beingById = new Map(glade.beings.map((b) => [b.id, b]));
  const arrivedCount = glade.beings.filter((b) => b.arrived).length;
  const elkGlimpsedOn = arrivals.get("pale-elk");

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
        <h1 className="font-pixel text-2xl tracking-wide">📖 THE SPELLBOOK</h1>
        <p className="mt-1 text-sm text-ink-soft">
          every day you both kept, sealed and remembered
        </p>
        <Link
          href="/"
          className="mt-1 inline-block text-sm text-ink-soft underline decoration-dotted underline-offset-4"
        >
          back to the journal
        </Link>
      </header>

      <nav className="flex items-center justify-between">
        <Link
          href={`/book?m=${monthShift(month, -1)}`}
          className="wobbly-sm border-2 border-ink/20 bg-cream px-3 py-1 text-sm shadow-card"
        >
          ◀
        </Link>
        <p className="font-pixel text-sm tracking-wide">
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

      <section className="wobbly hatch border-2 border-ink/20 bg-cream/70 p-3 shadow-card">
        <div className="grid grid-cols-7 gap-1 text-center">
          {["s", "m", "t", "w", "t", "f", "s"].map((d, i) => (
            <span
              key={`${d}${i}`}
              className="font-pixel text-[9px] text-ink-soft/70"
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
      </section>

      <section>
        <h2 className="mb-2 font-pixel text-sm tracking-wide">
          ✦ THE LEGENDARIUM
          <span className="ml-2 text-[10px] text-ink-soft">
            {discoveries.size}/{Object.keys(LEGENDARIES).length} discovered
          </span>
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(LEGENDARIES) as LegendaryId[]).map((id) => {
            const foundOn = discoveries.get(id);
            return foundOn ? (
              <Link
                key={id}
                href={`/book/${foundOn}`}
                className="wobbly-sm flex flex-col items-center border-2 border-violet/50 bg-cream/70 p-2 text-center shadow-card"
              >
                <SigilGlyph spec={legendarySpec(id)} size={56} />
                <p className="font-pixel text-[10px] leading-tight text-violet">
                  {LEGENDARIES[id].name}
                </p>
                <p className="mt-0.5 text-[10px] italic leading-tight text-ink-soft">
                  {LEGENDARIES[id].epigraph}
                </p>
                <p className="mt-0.5 text-[9px] text-ink-soft/70">
                  {friendlyDate(foundOn, tz)}
                </p>
              </Link>
            ) : (
              <div
                key={id}
                className="wobbly-sm hatch flex flex-col items-center justify-center border-2 border-dashed border-ink/25 p-2 py-4 text-center"
              >
                <span className="text-2xl opacity-40">?</span>
                <p className="mt-1 font-pixel text-[10px] text-ink-soft/70">
                  undiscovered
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-2 font-pixel text-sm tracking-wide">
          🦌 THE BESTIARY
          <span className="ml-2 text-[10px] text-ink-soft">
            {arrivedCount}/{BEINGS.length} arrived
          </span>
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {BEINGS.map((def) => {
            const state = beingById.get(def.id);
            const stage = state?.stage ?? 0;
            const arrivedOn = arrivals.get(def.id);
            return stage >= 1 ? (
              <div
                key={def.id}
                className="wobbly-sm flex flex-col items-center border-2 border-gold bg-cream/70 p-2 text-center shadow-card"
              >
                <div className="flex h-24 items-center justify-center">
                  <BeingPortrait being={def.id} stage={stage} />
                </div>
                <p className="font-pixel text-[10px] capitalize leading-tight">
                  {def.name}
                </p>
                <p className="mt-0.5 text-[10px] italic leading-tight text-ink-soft">
                  {def.line}
                </p>
                <p className="mt-0.5 text-[9px] text-ink-soft/70">
                  keeps {def.zone}
                  {arrivedOn ? ` · since ${friendlyDate(arrivedOn, tz)}` : ""}
                </p>
                {state && state.stage < 3 && state.nextAt != null ? (
                  <p className="mt-0.5 font-pixel text-[9px] tracking-wide text-gold">
                    deeper trust — {state.nextAt - state.count} more
                  </p>
                ) : null}
              </div>
            ) : (
              <div
                key={def.id}
                className="wobbly-sm hatch flex flex-col items-center justify-center border-2 border-dashed border-ink/25 p-2 py-4 text-center"
              >
                <span className="text-2xl opacity-40">?</span>
                <p className="mt-1 font-pixel text-[10px] text-ink-soft/70">
                  still in the wood
                </p>
                <p className="mt-0.5 text-[10px] italic leading-tight text-ink-soft/70">
                  {def.line}
                </p>
                {state && state.count > 0 && state.nextAt != null ? (
                  <p className="mt-1 font-pixel text-[9px] tracking-wide text-moss-deep">
                    the wood stirs — {state.nextAt - state.count} more
                  </p>
                ) : null}
              </div>
            );
          })}
          {elkGlimpsedOn ? (
            <div className="wobbly-sm lantern-pool col-span-2 flex flex-col items-center border-2 border-violet/50 bg-cream/70 p-3 text-center shadow-card">
              <BeingPortrait being="pale-elk" />
              <p className="mt-1 font-pixel text-[10px] capitalize leading-tight text-violet">
                the Pale Elk
              </p>
              <p className="mt-0.5 text-[10px] italic leading-tight text-ink-soft">
                Glimpsed {friendlyDate(elkGlimpsedOn, tz)}. It did not stay.
                They never do.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <footer className="mt-2 flex items-center justify-center gap-5 text-sm text-ink-soft">
        <Link
          href="/museum"
          className="underline decoration-dotted underline-offset-4"
        >
          🏛 the pantry
        </Link>
        <Link
          href="/trends"
          className="underline decoration-dotted underline-offset-4"
        >
          📈 trends
        </Link>
      </footer>
    </main>
  );
}
