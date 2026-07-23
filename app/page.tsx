import { ArrivalCeremony } from "@/components/glade/arrival-ceremony";
import { LegendaryCeremony } from "@/components/sigil/legendary-ceremony";
import { SealCeremony } from "@/components/sigil/seal-ceremony";
import { ShoreArrivalCeremony } from "@/components/sigil/shore-arrival-ceremony";
import { WorldShell } from "@/components/world/world-shell";
import { requireBond, SLOTS, type Slot } from "@/lib/bond";
import {
  getAllSpecimens,
  getArrivals,
  getDayExtras,
  getDiscoveries,
  getExerciseHistories,
  getFamiliarState,
  getFirstLogTimes,
  getJournalDay,
  getReachedShores,
  getWorkoutsForDay,
  keeperDayFromDay,
  reachShore,
  recordArrival,
  recordLegendary,
} from "@/lib/data";
import { diffDays, todayIso } from "@/lib/dates";
import { getGladeState } from "@/lib/ledger";
import { BEINGS, paleElkGlimpsed } from "@/lib/engine/beings";
import { stageForDays } from "@/lib/engine/familiar";
import { composeSigil, LEGENDARIES } from "@/lib/engine/sigil";
import type { BeingStages } from "@/components/glade/glade-scene";

// HOME — the Lighthouse world IS the app now. Opening the site lands you in the
// mandatory cold-open gate (the whole world, then the push-in to the hearth);
// the hearth is home. This page renders the world AND carries the core loop's
// invisible work — recording legendaries / arrivals / reached shores and firing
// the completion ceremonies — relocated intact from the old glade home so the
// loop never drops. The glade itself now lives as the Garden room to the west.
export default async function Home() {
  const { bondId, viewerSlot, members } = await requireBond(); // → /enter if unauthed
  const today = await todayIso();
  const day = today;

  const [journal, extras] = await Promise.all([
    getJournalDay(bondId, day),
    getDayExtras(bondId, day),
  ]);
  const [dayWorkouts, firstLogs, histories, glade] = await Promise.all([
    getWorkoutsForDay(bondId, day),
    getFirstLogTimes(bondId, day),
    getExerciseHistories(bondId, day),
    getGladeState(bondId, today),
  ]);
  const [familiarState, discoveries, arrivals, specimens, shores] =
    await Promise.all([
      getFamiliarState(bondId, today),
      getDiscoveries(bondId),
      getArrivals(bondId),
      getAllSpecimens(),
      getReachedShores(bondId),
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
    firstPage: glade.firstBothDay === today,
  });

  // ── The invisible loop — persist the earned facts (claim-once, idempotent),
  // exactly as the old home did, so both keepers witness each moment. ──
  if (sigil.legendary && !discoveries.has(sigil.legendary)) {
    await recordLegendary(bondId, sigil.legendary, day);
    discoveries.set(sigil.legendary, day);
  }
  for (const b of glade.beings.filter((b) => b.arrived && !arrivals.has(b.id))) {
    await recordArrival(bondId, b.id, today);
    arrivals.set(b.id, today);
  }
  const paleElk = paleElkGlimpsed({
    gladeTier: glade.tier,
    daysSinceLegendary: glade.lastLegendaryDay
      ? diffDays(today, glade.lastLegendaryDay)
      : null,
  });
  if (paleElk) await recordArrival(bondId, "pale-elk", today);
  const reachingNow =
    glade.boat?.complete === true &&
    glade.dream != null &&
    glade.dream.reachedDay == null;
  if (reachingNow) await reachShore(bondId, glade.dream!.id, today);

  // ── What to celebrate tonight — from the recorded facts (grandest wins; each
  // ceremony then gates itself once-per-device). ──
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

  // Who set down the second lantern — the later first-log closed the ring today.
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

  // ── The standing line — warm, viewer-aware, never a scold. ──
  const notLogged = SLOTS.filter((slot) => journal[slot].entries.length === 0);
  const missingName =
    notLogged.length === 2
      ? "you both"
      : notLogged.length === 1
        ? (members[notLogged[0]]?.displayName ?? "your partner")
        : null;
  const viewerKept = journal[viewerSlot].entries.length > 0;
  const soloKept = sigil.moss.inked !== sigil.ember.inked;
  const keptName = sigil.moss.inked
    ? (members.moss?.displayName ?? "")
    : (members.ember?.displayName ?? "");
  const standingLine = sigil.completed
    ? "the day is sealed — the light is yours to keep, together"
    : soloKept
      ? viewerKept
        ? `your half is kept — ${missingName} closes the ring`
        : `${keptName} kept their half — your hand closes it`
      : "an open page, still to keep together";

  // ── The five books' live gold-vs-silver progress (the Library room). ──
  const library = {
    days: familiarState.lifetimeDays,
    legendary: {
      got: discoveries.size,
      total: Object.keys(LEGENDARIES).length,
    },
    beasts: {
      got: glade.beings.filter((b) => b.arrived).length,
      total: BEINGS.length,
    },
    provisions: specimens.length,
    shores: shores.map((s) => ({
      id: s.id,
      name: s.name,
      reachedDay: s.reachedDay,
    })),
  };

  // ── The vessel's place in the depth toward the far shore (the Docks room). ──
  const docks = {
    dream: glade.dream
      ? {
          name: glade.dream.name,
          distanceDays: glade.dream.distanceDays,
          reachedDay: glade.dream.reachedDay,
        }
      : null,
    planksLaid: glade.boat?.planksLaid ?? 0,
    plankGoal: glade.boat?.plankGoal ?? 0,
    complete: glade.boat?.complete ?? false,
  };

  // ── The real living glade (the Garden room). ──
  const beingStages = Object.fromEntries(
    glade.beings.map((b) => [b.id, b.stage]),
  ) as BeingStages;
  const garden = {
    tier: glade.tier,
    beings: beingStages,
    familiarStage: stageForDays(familiarState.lifetimeDays),
    familiarName: familiarState.name,
    inklings: familiarState.loggedToday.length,
    hearthDay:
      sigil.chords.includes("hearth") || sigil.legendary === "feast-seal",
    mossLit:
      familiarState.loggedToday.includes("moss") || dayWorkouts.moss.length > 0,
    emberLit:
      familiarState.loggedToday.includes("ember") ||
      dayWorkouts.ember.length > 0,
    paleElk,
  };

  return (
    <>
      <WorldShell
        spec={sigil}
        standingLine={standingLine}
        library={library}
        docks={docks}
        garden={garden}
      />

      {/* the completion ceremonies — overlays that fire over the world, grandest
          first (shore > legendary > being > seal); a grander one suppresses the
          rest for the night. Each then gates itself once-per-device. */}
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
      {sigil.completed ? (
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
    </>
  );
}
