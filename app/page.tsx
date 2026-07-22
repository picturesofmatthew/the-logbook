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
import { DISPLAY_NAMES, PROFILES, type Profile } from "@/lib/auth";
import {
  getArrivals,
  getDayExtras,
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
import { currentProfile } from "@/lib/session";

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
  const viewer = await currentProfile(); // route guard (redirects to /enter if unauthenticated)
  const today = await todayIso();
  const day = today;
  const isToday = true;

  const [journal, familiarState, extras] = await Promise.all([
    getJournalDay(day),
    getFamiliarState(today),
    getDayExtras(day),
  ]);
  const [dayWorkouts, firstLogs, histories, glade] = await Promise.all([
    getWorkoutsForDay(day),
    getFirstLogTimes(day),
    getExerciseHistories(day),
    getGladeState(today),
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
    moss: keeperDayFromDay("matthew", dayData),
    ember: keeperDayFromDay("kennedy", dayData),
  });
  const notLogged = PROFILES.filter((p) => journal[p].entries.length === 0);
  const missingName =
    notLogged.length === 2
      ? "you both"
      : notLogged.length === 1
        ? DISPLAY_NAMES[notLogged[0]]
        : null;
  const hearthDay =
    sigil.chords.includes("hearth") || sigil.legendary === "feast-seal";

  // The request that claims the discovery row throws the ceremony — once, ever.
  const newlyDiscovered =
    sigil.legendary != null
      ? await recordLegendary(sigil.legendary, day)
      : false;

  // Every being announces its first arrival — one ceremony per load.
  let newBeing: BeingId | null = null;
  if (!newlyDiscovered) {
    const recorded = await getArrivals();
    const pending = glade.beings.filter((b) => b.arrived && !recorded.has(b.id));
    for (const b of pending) {
      if (await recordArrival(b.id, today)) {
        newBeing = b.id;
        break;
      }
    }
  }

  // The Pale Elk: glimpsed, never resident. First glimpse recorded silently.
  const paleElk = paleElkGlimpsed({
    gladeTier: glade.tier,
    daysSinceLegendary: glade.lastLegendaryDay
      ? diffDays(today, glade.lastLegendaryDay)
      : null,
  });
  if (paleElk) await recordArrival("pale-elk", today);

  // The boat is whole and the far shore is reached — the rarest moment, claimed
  // once. The request that stamps `reachedDay` throws the arrival ceremony; the
  // Dream stays active (the finished vessel keeps showing) until the couple
  // chooses the next one.
  const reachedShore =
    glade.boat?.complete && glade.dream && glade.dream.reachedDay == null
      ? await reachShore(glade.dream.id, today)
      : false;

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

  const beingStages = Object.fromEntries(
    glade.beings.map((b) => [b.id, b.stage]),
  ) as BeingStages;
  const familiarStage = stageForDays(familiarState.lifetimeDays);

  // Who set down the second lantern — the keeper whose log closed the ring
  // today (the later first-log wins). Named only when both times are known.
  const bothTimed = firstLogs.matthew != null && firstLogs.kennedy != null;
  const closer: Profile | null =
    sigil.completed && bothTimed
      ? firstLogs.matthew! >= firstLogs.kennedy!
        ? "matthew"
        : "kennedy"
      : null;
  const closerLine =
    closer == null
      ? null
      : closer === viewer
        ? "you closed the ring"
        : `${DISPLAY_NAMES[closer]} closed the ring`;

  return (
    <main
      className="relative -mt-16 flex min-h-[calc(100dvh-6rem)] flex-col overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--glade-sky-top) 0%, var(--glade-sky-bottom) 58%, var(--glade-ground-top) 100%)",
      }}
    >
      {/* THE SIGIL — the day's seal, the hero of the home */}
      <div className="flex flex-col items-center gap-4 px-6 pt-14 pb-3 text-center">
        <DaySeal spec={sigil} missingName={missingName} isToday={isToday} />

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
                familiarState.loggedToday.includes("matthew") ||
                dayWorkouts.matthew.length > 0
              }
              emberLit={
                familiarState.loggedToday.includes("kennedy") ||
                dayWorkouts.kennedy.length > 0
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
      {reachedShore && glade.dream ? (
        <ShoreArrivalCeremony dreamName={glade.dream.name} />
      ) : null}
      {!reachedShore && newlyDiscovered && sigil.legendary ? (
        <LegendaryCeremony
          legendary={sigil.legendary}
          spec={sigil}
          dreamName={glade.dream?.name}
          planksLaid={glade.boat?.planksLaid}
          remaining={glade.boat?.remaining}
        />
      ) : null}
      {!reachedShore && newBeing ? <ArrivalCeremony being={newBeing} /> : null}
      {sigil.completed && isToday ? (
        <SealCeremony
          spec={sigil}
          day={day}
          closerLine={closerLine}
          sealedCount={familiarState.lifetimeDays}
          suppressed={reachedShore || newlyDiscovered || newBeing != null}
          dreamName={glade.dream?.name}
          planksLaid={glade.boat?.planksLaid}
          remaining={glade.boat?.remaining}
        />
      ) : null}
    </main>
  );
}
