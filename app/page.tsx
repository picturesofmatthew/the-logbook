import Link from "next/link";
import { ArrivalCeremony } from "@/components/glade/arrival-ceremony";
import { GladeScene, type BeingStages } from "@/components/glade/glade-scene";
import { HorizonGlimpse } from "@/components/glade/horizon-glimpse";
import { FamiliarGlyph } from "@/components/familiar/familiar-glyph";
import { StampMark } from "@/components/glyphs";
import { DaySeal } from "@/components/sigil/day-seal";
import { LegendaryCeremony } from "@/components/sigil/legendary-ceremony";
import { SealCeremony } from "@/components/sigil/seal-ceremony";
import { ShoreArrivalCeremony } from "@/components/sigil/shore-arrival-ceremony";
import { requireBond, SLOTS, type Slot } from "@/lib/bond";
import {
  getArrivals,
  getDayExtras,
  getDiscoveries,
  getExerciseHistories,
  getFirstLogTimes,
  getJournalDay,
  getFamiliarState,
  getWorkoutsForDay,
  keeperDayFromDay,
  reachShore,
  recordArrival,
  recordLegendary,
} from "@/lib/data";
import { diffDays, todayIso } from "@/lib/dates";
import { getGladeState } from "@/lib/ledger";
import { paleElkGlimpsed, type BeingId } from "@/lib/engine/beings";
import { stageForDays } from "@/lib/engine/familiar";
import { composeSigil } from "@/lib/engine/sigil";
import { totalOf } from "@/lib/engine/totals";
import { stampsForDay } from "@/lib/engine/stamps";

// The glade — home, and one continuous living world (not stacked cards). The
// sky fills the screen behind the chrome; the ring narrates the day in it; two
// lanterns stand for the keepers; the fox and its company live in the ground
// band at the foot. The ledger's numbers live at /today.
// A handful of drifting motes for the sky band — position %, size px, delay s.
const MOTES = [
  { x: 16, y: 74, s: 3, d: 0 },
  { x: 33, y: 34, s: 2, d: 2.6 },
  { x: 50, y: 58, s: 3, d: 4.2 },
  { x: 68, y: 28, s: 2, d: 1.3 },
  { x: 83, y: 66, s: 3, d: 5.6 },
  { x: 44, y: 82, s: 2, d: 3.4 },
];

export default async function GladeHome() {
  const { bondId, viewerSlot, members } = await requireBond(); // guard (→ /enter if unauthed)
  const today = await todayIso();
  const day = today;
  const isToday = true;

  const [journal, familiarState, extras] = await Promise.all([
    getJournalDay(bondId, day),
    getFamiliarState(bondId, today),
    getDayExtras(bondId, day),
  ]);
  const [dayWorkouts, firstLogs, histories, glade] = await Promise.all([
    getWorkoutsForDay(bondId, day),
    getFirstLogTimes(bondId, day),
    getExerciseHistories(bondId, day),
    getGladeState(bondId, today),
  ]);

  const dayData = {
    journal,
    meta: extras.meta,
    workouts: dayWorkouts,
    histories,
    firstLogs,
  };
  const sigil = composeSigil({
    day,
    moss: keeperDayFromDay("moss", dayData),
    ember: keeperDayFromDay("ember", dayData),
    // First Page fires on the couple's first both-logged day. The home seal
    // must pass the same flag the ledger does — omitting it (the old default of
    // false) left the hero seal reading "common" on the one day the boat below
    // it showed a golden plank and the glade counted +5. Derived from the scan
    // getGladeState already ran, so this costs no extra query.
    firstPage: glade.firstBothDay === today,
  });
  const notLogged = SLOTS.filter((slot) => journal[slot].entries.length === 0);
  const missingName =
    notLogged.length === 2
      ? "you both"
      : notLogged.length === 1
        ? (members[notLogged[0]]?.displayName ?? "your partner")
        : null;

  // Where the day stands before the ring closes — warm and viewer-aware, never
  // a scold. A solo log is a kept half (your lantern's lit, the fire's up), not
  // a failure to close; and it seeds the "your hand closes it" love-tap.
  const viewerKept = journal[viewerSlot].entries.length > 0;
  const soloKept = sigil.moss.inked !== sigil.ember.inked;
  const keptName = sigil.moss.inked
    ? (members.moss?.displayName ?? "")
    : (members.ember?.displayName ?? "");
  const standingLine = sigil.completed
    ? null
    : soloKept
      ? viewerKept
        ? `your half is kept — ${missingName} closes the ring`
        : `${keptName} kept their half — your hand closes it`
      : "an open page, still to keep together";
  const hearthDay =
    sigil.chords.includes("hearth") || sigil.legendary === "feast-seal";

  // Persist the earned facts (claim-once, idempotent). Which page-load wins the
  // claim no longer decides who SEES the ceremony — that's the fact + per-device
  // gate below, so BOTH keepers witness each moment on their own screen.
  const discoveries = await getDiscoveries(bondId);
  if (sigil.legendary && !discoveries.has(sigil.legendary)) {
    // recordLegendary is idempotent (onConflictDoNothing). Whether this load
    // wins the insert or a partner's concurrent load already did, the discovery
    // is now stamped for `day` — so stamp it locally regardless of the return.
    // Gating on the insert win meant the keeper who LOST the race read a stale
    // map and never saw the ceremony, defeating the "both witness it" refactor.
    await recordLegendary(bondId, sigil.legendary, day);
    discoveries.set(sigil.legendary, day);
  }

  const arrivals = await getArrivals(bondId);
  for (const b of glade.beings.filter((b) => b.arrived && !arrivals.has(b.id))) {
    // Same as legendaries: stamp locally regardless of who won the write, so
    // the arrival ceremony fires for both keepers on the day it arrives.
    await recordArrival(bondId, b.id, today);
    arrivals.set(b.id, today);
  }

  // The Pale Elk: glimpsed, never resident. First glimpse recorded silently.
  const paleElk = paleElkGlimpsed({
    gladeTier: glade.tier,
    daysSinceLegendary: glade.lastLegendaryDay
      ? diffDays(today, glade.lastLegendaryDay)
      : null,
  });
  if (paleElk) await recordArrival(bondId, "pale-elk", today);

  // The boat is whole and the far shore is reached — claimed once (stamps
  // `reachedDay`); the Dream stays active until the couple chooses the next one.
  // getGladeState fetched the dream fresh this request, so reachedDay == null
  // here means it wasn't reached before now: if the boat is complete, it is
  // reached TODAY — independent of who wins the idempotent write — so both
  // keepers witness the shore, not just the one whose load ran reachShore first.
  const reachingNow =
    glade.boat?.complete === true &&
    glade.dream != null &&
    glade.dream.reachedDay == null;
  if (reachingNow) await reachShore(bondId, glade.dream!.id, today);

  // ── What to celebrate today — computed from FACTS (the composed sigil, the
  // recorded arrival days, the boat), not the claim booleans. The grandest wins
  // the night (shore > legendary > being > seal); each ceremony then gates
  // itself once-per-device (lib/ceremony-seen) so neither keeper is skipped. ──
  // Only the FIRST-discovery day fires the ceremony (like beings/shore) — many
  // legendaries recur (feast-seal, ember-vigil…), and the grand "inked forever"
  // overlay must not re-fire every time the couple earns that condition again.
  const legendaryToday =
    sigil.legendary && discoveries.get(sigil.legendary) === today
      ? sigil.legendary
      : null;
  const beingArrivedToday =
    glade.beings.find((b) => b.arrived && arrivals.get(b.id) === today)?.id ??
    null;
  const shoreReachedToday =
    !!glade.dream &&
    glade.boat?.complete === true &&
    (reachingNow || glade.dream.reachedDay === today);

  const stamps = stampsForDay({
    people: SLOTS.map((slot) => ({
      name: members[slot]?.displayName ?? "",
      total: totalOf(
        journal[slot].entries.map((e) => ({
          ...e.food,
          servings: e.servings,
        })),
      ),
      target: journal[slot].target,
      loggedAny: journal[slot].entries.length > 0,
      training: extras.meta[slot].training,
      waterCups: extras.meta[slot].waterCups,
    })),
    newSpecimens: extras.newSpecimens,
  });

  const beingStages = Object.fromEntries(
    glade.beings.map((b) => [b.id, b.stage]),
  ) as BeingStages;
  const familiarStage = stageForDays(familiarState.lifetimeDays);

  // Who set down the second lantern — the keeper whose log closed the ring
  // today (the later first-log wins). Named only when both times are known.
  const bothTimed = firstLogs.moss != null && firstLogs.ember != null;
  const closer: Slot | null =
    sigil.completed && bothTimed
      ? firstLogs.moss! >= firstLogs.ember!
        ? "moss"
        : "ember"
      : null;
  const closerLine =
    closer == null
      ? null
      : closer === viewerSlot
        ? "you closed the ring"
        : `${members[closer]?.displayName ?? ""} closed the ring`;

  return (
    <main
      className="relative -mt-16 flex min-h-[calc(100dvh-6rem)] flex-col overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--glade-sky-top) 0%, var(--glade-sky-bottom) 58%, var(--glade-ground-top) 100%)",
      }}
    >
      {/* THE SIGIL — the day's seal, the hero of the home. Sized to leave the
          glade + the distant shore on-screen without scrolling. */}
      <div className="flex flex-col items-center gap-3 px-6 pt-12 pb-2 text-center">
        {/* tap the seal to open today's ledger — the numbers behind the mark.
            the hint gives the art object a visible "this is a door" affordance. */}
        <Link
          href="/today"
          transitionTypes={["nav-forward"]}
          aria-label="Open today's page — food, water, mood, the ledger"
          className="group block cursor-pointer transition-transform active:scale-[0.98]"
        >
          <DaySeal
            spec={sigil}
            standingLine={standingLine}
            isToday={isToday}
            size={208}
          />
          <span className="mt-2 inline-flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-[0.14em] text-terracotta/75 transition-colors group-hover:text-terracotta">
            today&apos;s page
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              ❯
            </span>
          </span>
        </Link>

        {stamps.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {stamps.map((s) => (
              <span
                key={s.id}
                title={s.label}
                className="wobbly-sm flex items-center gap-1 border border-gold bg-gold-soft/70 px-2 py-0.5 text-xs"
              >
                <StampMark kind={s.kind} size={13} /> {s.label}
              </span>
            ))}
          </div>
        ) : null}

        {!members.ember ? (
          <Link
            href="/invite"
            className="wobbly-sm border-2 border-dashed border-terracotta/40 bg-cream/60 px-4 py-1.5 text-sm text-terracotta"
          >
            your book waits for its second keeper — invite them ❯
          </Link>
        ) : null}
      </div>

      {/* ambient motes, drifting up through the sky's empty middle */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[22%] bottom-[48%] overflow-hidden"
        aria-hidden
      >
        {MOTES.map((m, i) => (
          <span
            key={i}
            className="mote absolute block rounded-full"
            style={{
              left: `${m.x}%`,
              top: `${m.y}%`,
              width: m.s,
              height: m.s,
              background:
                i % 3 === 0 && sigil.completed
                  ? "var(--color-violet-bright)"
                  : "var(--color-gold)",
              animationDelay: `${m.d}s`,
            }}
          />
        ))}
      </div>

      {/* push the world to the foot of the screen */}
      <div className="flex-1" />

      {/* THE GLIMPSE — the home's window onto the quest. The sea, the far shore
          glowing, your vessel sailing toward it. Tap to travel there and build
          the ship in full. */}
      {glade.dream && glade.boat ? (
        <Link
          href="/shore"
          className="relative block"
          aria-label={`Toward ${glade.dream.name} — ${glade.boat.planksLaid} of ${glade.boat.plankGoal} planks set. Tap to look toward it.`}
        >
          <HorizonGlimpse boat={glade.boat} dreamName={glade.dream.name} />
          <div className="px-6 pb-1 pt-1 text-center">
            <p className="font-display text-[10px] tracking-widest text-ink-soft">
              toward {glade.dream.name}
            </p>
            <div className="mx-auto mt-1 h-[3px] w-40 max-w-[68%] overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-gold"
                style={{
                  width: `${Math.min(100, Math.round((glade.boat.planksLaid / glade.boat.plankGoal) * 100))}%`,
                }}
              />
            </div>
            <p className="mt-1 font-display text-[9px] tracking-wide text-ink-soft/70">
              {glade.boat.planksLaid} of {glade.boat.plankGoal} planks
            </p>
          </div>
        </Link>
      ) : null}

      {/* THE GLADE — the living world, full-bleed at the foot of the screen:
          the immersive foreground where the familiar and creatures roam, no
          frame, edge to edge, so the home reads as one continuous world. */}
      <div className="relative w-full overflow-hidden">
        <div className="flex justify-center">
          <div className="relative w-[150%] shrink-0">
            <GladeScene
              skyless
              tier={glade.tier}
              beings={beingStages}
              paleElk={paleElk}
              inklings={familiarState.loggedToday.length}
              hearthDay={isToday && hearthDay}
              mossLit={
                familiarState.loggedToday.includes("moss") ||
                dayWorkouts.moss.length > 0
              }
              emberLit={
                familiarState.loggedToday.includes("ember") ||
                dayWorkouts.ember.length > 0
              }
            />
            <div className="absolute bottom-[7%] left-1/2 -translate-x-1/2">
              <FamiliarGlyph
                stage={familiarStage}
                size={72}
                className="idle-bounce"
                title={`${familiarState.name ?? "the fox"}, a ${familiarStage} — the glade is ${glade.tier}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ceremonies — overlays that fire on arrival, grandest first. Reaching
          the far shore outranks a legendary, a legendary a being, a being the
          plain seal; a grander one suppresses the rest for the night. */}
      {shoreReachedToday && glade.dream ? (
        <ShoreArrivalCeremony dreamName={glade.dream.name} day={today} />
      ) : null}
      {!shoreReachedToday && legendaryToday ? (
        <LegendaryCeremony
          legendary={legendaryToday}
          spec={sigil}
          day={today}
          dreamName={glade.dream?.name}
          planksLaid={glade.boat?.planksLaid}
          remaining={glade.boat?.remaining}
        />
      ) : null}
      {!shoreReachedToday && !legendaryToday && beingArrivedToday ? (
        <ArrivalCeremony being={beingArrivedToday} day={today} />
      ) : null}
      {sigil.completed && isToday ? (
        <SealCeremony
          spec={sigil}
          day={day}
          closerLine={closerLine}
          sealedCount={familiarState.lifetimeDays}
          suppressed={
            shoreReachedToday || !!legendaryToday || !!beingArrivedToday
          }
          dreamName={glade.dream?.name}
          planksLaid={glade.boat?.planksLaid}
          remaining={glade.boat?.remaining}
        />
      ) : null}
    </main>
  );
}
