import type { Metadata } from "next";
import { WorldShell } from "@/components/world/world-shell";
import { requireBond, SLOTS } from "@/lib/bond";
import {
  getAllSpecimens,
  getDayExtras,
  getDiscoveries,
  getExerciseHistories,
  getFamiliarState,
  getFirstLogTimes,
  getJournalDay,
  getReachedShores,
  getWorkoutsForDay,
  keeperDayFromDay,
} from "@/lib/data";
import { diffDays, todayIso } from "@/lib/dates";
import { getGladeState } from "@/lib/ledger";
import { BEINGS, paleElkGlimpsed } from "@/lib/engine/beings";
import { stageForDays } from "@/lib/engine/familiar";
import { composeSigil, LEGENDARIES } from "@/lib/engine/sigil";
import type { BeingStages } from "@/components/glade/glade-scene";

// The Lighthouse — the whole inhabited world, entered at the hearth. The World
// Shell holds all five rooms on one spatial canvas and moves a camera between
// them (swipe the island, rise the tower). The hearth's mantle seal is today's
// ACTUAL seal (composeSigil off both keepers' logs) and the lamp at the top
// burns by that same seal, so the world's one light is honest from day one.
// Full-screen — the shell is fixed to the viewport, above the app chrome.
export const metadata: Metadata = {
  title: "the lighthouse",
};

export default async function HearthPage() {
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

  // The Compendium's live counts — the five books' gold-vs-silver progress,
  // fetched here so the Library room up the stair reads the real bond.
  const [familiarState, discoveries, specimens, shores] = await Promise.all([
    getFamiliarState(bondId, today),
    getDiscoveries(bondId),
    getAllSpecimens(),
    getReachedShores(bondId),
  ]);
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

  // The Docks read the boat/Dream already composed in the glade state — the
  // vessel's place in the depth is planksLaid / plankGoal toward the far shore.
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
    // The same firstPage flag the glade home passes, so the mantle seal reads
    // the couple's first both-logged day at its true tier (not a common seal).
    firstPage: glade.firstBothDay === today,
  });

  // The Garden is the REAL glade — the same living scene the home grew, wired to
  // the same vitality/beings/familiar (reflecting the engine, not redrawn).
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
    paleElk: paleElkGlimpsed({
      gladeTier: glade.tier,
      daysSinceLegendary: glade.lastLegendaryDay
        ? diffDays(today, glade.lastLegendaryDay)
        : null,
    }),
  };

  // The standing line — warm, viewer-aware, never a scold (mirrors the glade
  // home). A solo log is a kept half awaiting the second hand; a sealed day is
  // the light, kept together.
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

  return (
    <WorldShell
      spec={sigil}
      standingLine={standingLine}
      library={library}
      docks={docks}
      garden={garden}
    />
  );
}
