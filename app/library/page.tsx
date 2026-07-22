import type { Metadata } from "next";
import Link from "next/link";
import { BeingPortrait } from "@/components/glade/being-portrait";
import { SigilGlyph } from "@/components/sigil/sigil-glyph";
import {
  SpecimenCard,
  type SpecimenCardData,
} from "@/components/museum/specimen-card";
import { LibraryRune, PantryRune, BestiaryRune } from "@/components/shell/rune-icons";
import { StarMark } from "@/components/glyphs";
import { GiltHeading } from "@/components/shell/plate";
import { DISPLAY_NAMES, PROFILES, type Profile } from "@/lib/auth";
import {
  getAllSpecimens,
  getArrivals,
  getDiscoveries,
  getReachedShores,
} from "@/lib/data";
import { currentTz, friendlyDate, todayIso } from "@/lib/dates";
import { HALLS } from "@/lib/halls";
import { BEINGS } from "@/lib/engine/beings";
import { LEGENDARIES, type LegendaryId, type SigilSpec } from "@/lib/engine/sigil";
import { getGladeState } from "@/lib/ledger";
import { currentProfile } from "@/lib/session";

export const metadata: Metadata = {
  title: "The Field Book - signed × sealed",
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
    moon: false,
    water: false,
    lowMood: false,
  };
}

export default async function LibraryPage() {
  await currentProfile();
  const today = await todayIso();
  const tz = await currentTz();

  const [specimens, glade, arrivals, discoveries, shores] = await Promise.all([
    getAllSpecimens(),
    getGladeState(today),
    getArrivals(),
    getDiscoveries(),
    getReachedShores(),
  ]);

  // ── Pantry ──
  const donationCounts = Object.fromEntries(
    PROFILES.map((p) => [
      p,
      specimens.filter((s) => s.discoveredBy === p).length,
    ]),
  ) as Record<Profile, number>;

  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    month: "short",
    day: "numeric",
  });

  function toCard(s: (typeof specimens)[number]): SpecimenCardData {
    return {
      id: s.id,
      name: s.name,
      icon: s.icon,
      servingLabel: s.servingLabel,
      calories: s.calories,
      proteinG: s.proteinG,
      carbsG: s.carbsG,
      fatG: s.fatG,
      estimated: s.estimated,
      donorName: DISPLAY_NAMES[s.discoveredBy as Profile] ?? s.discoveredBy,
      discoveredLabel: fmt.format(new Date(s.discoveredAt)),
    };
  }

  // ── Bestiary ──
  const beingById = new Map(glade.beings.map((b) => [b.id, b]));
  const arrivedCount = glade.beings.filter((b) => b.arrived).length;
  const elkGlimpsedOn = arrivals.get("pale-elk");

  // The section-jump — a live table of contents for the one book.
  const sections = [
    { id: "pantry", label: "pantry", count: specimens.length },
    { id: "bestiary", label: "beasts", count: arrivedCount },
    { id: "legendarium", label: "legends", count: discoveries.size },
    { id: "relics", label: "relics", count: shores.length },
  ];

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 p-4 pb-16">
      <header className="text-center">
        <h1 className="gilt-heading text-2xl tracking-wide">
          <LibraryRune size={24} /> THE FIELD BOOK
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          everything the two of you have gathered
        </p>
      </header>

      {/* the shelf's table of contents — jump to any collection */}
      <nav className="sticky top-16 z-20 -mx-4 border-y-2 border-ink/15 bg-paper/95 px-4 py-2 backdrop-blur">
        <div className="flex items-stretch justify-between gap-1.5">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="wobbly-sm flex flex-1 flex-col items-center border-2 border-ink/20 bg-cream px-1 py-1 text-center shadow-card active:scale-95"
            >
              <span className="font-display text-[9px] uppercase tracking-wide">
                {s.label}
              </span>
              <span className="text-[9px] text-ink-soft">{s.count}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* ── THE PANTRY ── */}
      <section id="pantry" className="flex scroll-mt-32 flex-col gap-3">
        <GiltHeading className="text-sm tracking-wide">
          <PantryRune size={16} /> THE PANTRY
        </GiltHeading>
        <p className="-mt-2 text-center text-[10px] text-ink-soft">
          {specimens.length}{" "}
          {specimens.length === 1 ? "specimen" : "specimens"} ·{" "}
          {PROFILES.map((p) => `${DISPLAY_NAMES[p]} ${donationCounts[p]}`).join(
            " · ",
          )}
        </p>

        {specimens.length === 0 ? (
          <div className="wobbly border-2 border-dashed border-ink/25 p-8 text-center text-ink-soft">
            <p className="flex justify-center text-ink-soft">
              <PantryRune size={40} />
            </p>
            <p className="mt-2">
              The halls are empty and echoing. Log your first meal to donate the
              pantry&apos;s very first specimen.
            </p>
          </div>
        ) : (
          HALLS.map((hall) => {
            const inHall = specimens.filter((s) => s.hall === hall.id);
            return (
              <section key={hall.id}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-display text-sm tracking-wide">
                    {hall.emoji} {hall.label.toUpperCase()}
                  </span>
                  <span className="h-px flex-1 bg-ink/20" />
                  <span className="font-display text-[10px] text-ink-soft">
                    {inHall.length || "—"}
                  </span>
                </div>
                {inHall.length === 0 ? (
                  <p className="wobbly-sm border-2 border-dashed border-ink/15 px-3 py-2 text-xs text-ink-soft/70">
                    awaiting its first donation
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {inHall.map((s) => (
                      <SpecimenCard key={s.id} s={toCard(s)} />
                    ))}
                  </div>
                )}
              </section>
            );
          })
        )}
      </section>

      {/* ── THE BESTIARY ── */}
      <section id="bestiary" className="scroll-mt-32">
        <GiltHeading className="mb-3 text-sm tracking-wide">
          <BestiaryRune size={16} /> THE BESTIARY
        </GiltHeading>
        <p className="-mt-2 mb-2 text-center text-[10px] text-ink-soft">
          {arrivedCount}/{BEINGS.length} arrived
        </p>
        <div className="grid grid-cols-2 gap-2">
          {BEINGS.map((def) => {
            const state = beingById.get(def.id);
            const stage = state?.stage ?? 0;
            const arrivedOn = arrivals.get(def.id);
            return stage >= 1 ? (
              <div
                key={def.id}
                className="plate flex flex-col items-center p-2.5 text-center"
              >
                <span className="plate-corner tl" aria-hidden />
                <span className="plate-corner tr" aria-hidden />
                <span className="plate-corner bl" aria-hidden />
                <span className="plate-corner br" aria-hidden />
                <div className="flex h-24 items-center justify-center">
                  <BeingPortrait being={def.id} stage={stage} />
                </div>
                <p className="font-display text-[10px] capitalize leading-tight">
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
                  <p className="mt-0.5 font-display text-[9px] tracking-wide text-gold">
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
                <p className="mt-1 font-display text-[10px] text-ink-soft/70">
                  still in the wood
                </p>
                <p className="mt-0.5 text-[10px] italic leading-tight text-ink-soft/70">
                  {def.line}
                </p>
                {state && state.count > 0 && state.nextAt != null ? (
                  <p className="mt-1 font-display text-[9px] tracking-wide text-moss-deep">
                    the wood stirs — {state.nextAt - state.count} more
                  </p>
                ) : null}
              </div>
            );
          })}
          {elkGlimpsedOn ? (
            <div className="wobbly-sm lantern-pool col-span-2 flex flex-col items-center border-2 border-violet/50 bg-cream/70 p-3 text-center shadow-card">
              <BeingPortrait being="pale-elk" />
              <p className="mt-1 font-display text-[10px] capitalize leading-tight text-violet">
                the Pale Elk
              </p>
              <p className="mt-0.5 text-[10px] italic leading-tight text-ink-soft">
                Glimpsed {friendlyDate(elkGlimpsedOn, tz)}. It did not stay. They
                never do.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* ── THE LEGENDARIUM ── */}
      <section id="legendarium" className="scroll-mt-32">
        <GiltHeading className="mb-3 text-sm tracking-wide">
          <StarMark size={15} /> THE LEGENDARIUM
        </GiltHeading>
        <p className="-mt-2 mb-2 text-center text-[10px] text-ink-soft">
          {discoveries.size}/{Object.keys(LEGENDARIES).length} discovered
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(LEGENDARIES) as LegendaryId[]).map((id) => {
            const foundOn = discoveries.get(id);
            return foundOn ? (
              <Link
                key={id}
                href={`/book/${foundOn}`}
                className="plate lantern-pool flex flex-col items-center p-2.5 text-center"
              >
                <span className="plate-corner tl" aria-hidden />
                <span className="plate-corner tr" aria-hidden />
                <span className="plate-corner bl" aria-hidden />
                <span className="plate-corner br" aria-hidden />
                <SigilGlyph spec={legendarySpec(id)} size={56} />
                <p className="font-display text-[10px] leading-tight text-violet">
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
                <p className="mt-1 font-display text-[10px] text-ink-soft/70">
                  undiscovered
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── RELICS ── the Dreams the two of you sailed to ── */}
      <section id="relics" className="scroll-mt-32">
        <GiltHeading className="mb-3 text-sm tracking-wide">
          <StarMark size={15} /> RELICS
        </GiltHeading>
        <p className="-mt-2 mb-2 text-center text-[10px] text-ink-soft">
          {shores.length} {shores.length === 1 ? "shore" : "shores"} reached
        </p>
        {shores.length === 0 ? (
          <div className="wobbly border-2 border-dashed border-ink/25 p-6 text-center text-ink-soft">
            <p className="flex justify-center text-gold/70">
              <StarMark size={30} />
            </p>
            <p className="mt-2 text-sm">
              No relics yet. The far shore is still ahead of you — the first
              Dream you reach together will rest here, kept forever.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {shores.map((shore) => (
              <div
                key={shore.id}
                className="plate lantern-pool flex items-center gap-3 p-3"
              >
                <span className="plate-corner tl" aria-hidden />
                <span className="plate-corner tr" aria-hidden />
                <span className="plate-corner bl" aria-hidden />
                <span className="plate-corner br" aria-hidden />
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-gold/50 bg-cream text-gold">
                  <StarMark size={20} />
                </span>
                <div className="flex-1 text-left">
                  <p className="font-display text-sm leading-tight text-gold">
                    {shore.name}
                  </p>
                  <p className="mt-0.5 text-[11px] italic leading-tight text-ink-soft">
                    a {shore.distanceDays}-day voyage, reached together
                  </p>
                  {shore.reachedDay ? (
                    <p className="mt-0.5 text-[9px] text-ink-soft/70">
                      {friendlyDate(shore.reachedDay, tz)}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
