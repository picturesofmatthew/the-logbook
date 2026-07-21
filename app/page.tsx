import Link from "next/link";
import { ArrivalCeremony } from "@/components/glade/arrival-ceremony";
import { GladeScene, type BeingStages } from "@/components/glade/glade-scene";
import { HorizonGlimpse } from "@/components/glade/horizon-glimpse";
import { PixelSprite } from "@/components/pixel-sprite";
import { HeartMark, StampMark, StarMark } from "@/components/glyphs";
import { DaySeal } from "@/components/sigil/day-seal";
import { LegendaryCeremony } from "@/components/sigil/legendary-ceremony";
import { SealCeremony } from "@/components/sigil/seal-ceremony";
import { ShoreArrivalCeremony } from "@/components/sigil/shore-arrival-ceremony";
import { FAMILIAR_PALETTE, FAMILIAR_SPRITES } from "@/components/sprites";
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
import { moodFor, nextStageIn, FAMILIAR_STAGES, speechFor, stageForDays } from "@/lib/engine/familiar";
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

  // The fox living in the ground band.
  const stage = stageForDays(familiarState.lifetimeDays);
  const stageLabel = FAMILIAR_STAGES.find((s) => s.id === stage)?.label ?? stage;
  const mood = moodFor({
    loggedTodayCount: familiarState.loggedToday.length,
    daysSinceAnyEntry: familiarState.daysSinceAnyEntry,
  });
  const missing = PROFILES.find((p) => !familiarState.loggedToday.includes(p));
  const speech = speechFor(
    mood,
    today + mood,
    missing ? DISPLAY_NAMES[missing] : undefined,
  );
  const beingStages = Object.fromEntries(
    glade.beings.map((b) => [b.id, b.stage]),
  ) as BeingStages;

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

  // The fox's next growth mark — a gentle pull forward, in both-logged days.
  const foxNext = nextStageIn(familiarState.lifetimeDays);

  return (
    <main
      className="relative -mt-16 flex min-h-[calc(100dvh-6rem)] flex-col overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--glade-sky-top) 0%, var(--glade-sky-bottom) 58%, var(--glade-ground-top) 100%)",
      }}
    >
      {/* THE SIGIL — the day's seal, the hero of the home */}
      <div className="flex flex-col items-center gap-3 px-6 pt-16 pb-2 text-center">
        <div className="w-full max-w-[300px]">
          <DaySeal spec={sigil} missingName={missingName} isToday={isToday} />
        </div>

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
            <p className="font-pixel text-[10px] tracking-widest text-ink-soft">
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
            <p className="mt-1 font-pixel text-[9px] tracking-wide text-ink-soft/70">
              {glade.boat.planksLaid} of {glade.boat.plankGoal} planks
            </p>
          </div>
        </Link>
      ) : null}

      {/* THE GLADE — demoted to a quiet strip at the foot; the fox and the
          creatures live here as ambient life, no longer the focus. */}
      <div className="relative h-[150px] overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 flex justify-center">
          <div className="relative w-[128%] shrink-0">
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
            <div
              className={`absolute bottom-[6%] left-1/2 -translate-x-1/2 ${
                mood === "lonely" ? "opacity-80 saturate-50" : ""
              }`}
            >
              <div className="relative flex flex-col items-center">
                <PixelSprite
                  map={FAMILIAR_SPRITES[stage]}
                  palette={FAMILIAR_PALETTE}
                  className="idle-bounce h-11 w-11 pixelated"
                  title={`${familiarState.name ?? "The fox"}, a ${stageLabel} — the Glade is ${glade.tier}`}
                />
                <span
                  className="-mt-1 h-1.5 w-7 rounded-[50%] bg-ink/25 blur-[1.5px]"
                  aria-hidden
                />
                {mood === "thriving" ? (
                  <span className="absolute -right-0.5 top-0 animate-pulse text-gold">
                    <StarMark size={11} />
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* the fox's quiet voice — small at the foot, ambient */}
      <div className="px-6 pb-2 text-center">
        <p className="mx-auto max-w-[240px] text-[10px] italic leading-snug text-ink-soft/80">
          “{speech}”
        </p>
        <p className="mt-0.5 font-pixel text-[9px] tracking-wide text-ink-soft/70">
          {familiarState.name ? `${familiarState.name} the ${stageLabel}` : `a ${stageLabel}`} ·{" "}
          <HeartMark size={9} className="inline-block align-[-1px] text-terracotta" />{" "}
          {familiarState.lifetimeDays}
          {familiarState.lifetimeDays === 1 ? " day" : " days"} fed
          {foxNext
            ? ` · ${foxNext.daysLeft === 1 ? "one day" : `${foxNext.daysLeft} days`} to the ${foxNext.label}`
            : ""}
        </p>
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
