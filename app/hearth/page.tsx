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
import { todayIso } from "@/lib/dates";
import { getGladeState } from "@/lib/ledger";
import { BEINGS } from "@/lib/engine/beings";
import { composeSigil, LEGENDARIES } from "@/lib/engine/sigil";

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
    <WorldShell spec={sigil} standingLine={standingLine} library={library} />
  );
}
