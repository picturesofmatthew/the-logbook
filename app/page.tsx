import { ArrivalCeremony } from "@/components/glade/arrival-ceremony";
import { GladeScene, type BeingStages } from "@/components/glade/glade-scene";
import { PixelSprite } from "@/components/pixel-sprite";
import { HeartMark, StampMark, StarMark } from "@/components/glyphs";
import { DaySeal } from "@/components/sigil/day-seal";
import { LegendaryCeremony } from "@/components/sigil/legendary-ceremony";
import { SealCeremony } from "@/components/sigil/seal-ceremony";
import { PET_PALETTE, PET_SPRITES } from "@/components/sprites";
import { DISPLAY_NAMES, PROFILES, type Profile } from "@/lib/auth";
import {
  getArrivals,
  getDayExtras,
  getExerciseHistories,
  getFirstLogTimes,
  getJournalDay,
  getPetState,
  getWorkoutsForDay,
  recordArrival,
  recordLegendary,
} from "@/lib/data";
import { diffDays, todayIso } from "@/lib/dates";
import { getGladeState } from "@/lib/ledger";
import { paleElkGlimpsed, type BeingId } from "@/lib/engine/beings";
import { buildKeeperDay } from "@/lib/engine/keeper-day";
import { moodFor, nextStageIn, PET_STAGES, speechFor, stageForDays } from "@/lib/engine/pet";
import { composeSigil, type KeeperDay } from "@/lib/engine/sigil";
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

  const [journal, petState, extras] = await Promise.all([
    getJournalDay(day),
    getPetState(today),
    getDayExtras(day),
  ]);
  const [dayWorkouts, firstLogs, histories, glade] = await Promise.all([
    getWorkoutsForDay(day),
    getFirstLogTimes(day),
    getExerciseHistories(day),
    getGladeState(today),
  ]);

  const keeperDay = (p: Profile): KeeperDay => {
    const total = totalOf(
      journal[p].entries.map((e) => ({ ...e.food, servings: e.servings })),
    );
    return buildKeeperDay({
      calories: total.calories,
      proteinG: total.proteinG,
      halls: [...new Set(journal[p].entries.map((e) => e.food.hall))],
      target: journal[p].target,
      meta: extras.meta[p],
      workouts: dayWorkouts[p],
      historyBest: histories[p].best,
      firstLoggedAtMs: firstLogs[p],
    });
  };

  const sigil = composeSigil({
    day,
    moss: keeperDay("matthew"),
    ember: keeperDay("kennedy"),
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
  const stage = stageForDays(petState.lifetimeDays);
  const stageLabel = PET_STAGES.find((s) => s.id === stage)?.label ?? stage;
  const mood = moodFor({
    loggedTodayCount: petState.loggedToday.length,
    daysSinceAnyEntry: petState.daysSinceAnyEntry,
  });
  const missing = PROFILES.find((p) => !petState.loggedToday.includes(p));
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
  const foxNext = nextStageIn(petState.lifetimeDays);

  return (
    <main
      className="relative -mt-16 flex min-h-[calc(100dvh-6rem)] flex-col overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--glade-sky-top) 0%, var(--glade-sky-bottom) 58%, var(--glade-ground-top) 100%)",
      }}
    >
      {/* SKY — the ring narrates the day, up top */}
      <div className="flex flex-col items-center gap-3 px-6 pt-16 pb-2 text-center">
        <div className="w-full max-w-[280px]">
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

        <p className="max-w-[240px] text-[11px] italic leading-snug text-ink-soft">
          “{speech}”
        </p>
        <p className="font-pixel text-[10px] tracking-wide text-ink-soft">
          {petState.name ? `${petState.name} the ${stageLabel}` : `a ${stageLabel}`}{" "}
          ·{" "}
          <HeartMark size={10} className="inline-block align-[-1px] text-terracotta" />{" "}
          {petState.lifetimeDays}
          {petState.lifetimeDays === 1 ? " day" : " days"} fed
        </p>
        {foxNext ? (
          <p className="text-[10px] italic leading-snug text-ink-soft/80">
            {foxNext.daysLeft === 1 ? "one day" : `${foxNext.daysLeft} days`} to
            the {foxNext.label}
          </p>
        ) : null}
      </div>

      {/* ambient motes, drifting up through the sky's empty middle */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[34%] bottom-[20%] overflow-hidden"
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

      {/* THE WORLD — skyless so the page gradient shows straight through (no
          seam), cropped to the treeline + ground, sitting above the ribbon.
          The keepers' lanterns light within it by who has logged. */}
      <div className="relative h-[140px] overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 flex justify-center">
          <div className="relative w-[132%] shrink-0">
            <GladeScene
              skyless
              tier={glade.tier}
              beings={beingStages}
              paleElk={paleElk}
              inklings={petState.loggedToday.length}
              hearthDay={isToday && hearthDay}
              mossLit={
                petState.loggedToday.includes("matthew") ||
                dayWorkouts.matthew.length > 0
              }
              emberLit={
                petState.loggedToday.includes("kennedy") ||
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
                  map={PET_SPRITES[stage]}
                  palette={PET_PALETTE}
                  className="idle-bounce h-14 w-14 pixelated"
                  title={`${petState.name ?? "The fox"}, a ${stageLabel} — the Glade is ${glade.tier}`}
                />
                {/* a soft shadow so the fox sits on the grass, not above it */}
                <span
                  className="-mt-1 h-1.5 w-8 rounded-[50%] bg-ink/25 blur-[1.5px]"
                  aria-hidden
                />
                {mood === "thriving" ? (
                  <span className="absolute -right-0.5 top-0 animate-pulse text-gold">
                    <StarMark size={12} />
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ceremonies — overlays that fire on arrival */}
      {newlyDiscovered && sigil.legendary ? (
        <LegendaryCeremony legendary={sigil.legendary} spec={sigil} />
      ) : null}
      {newBeing ? <ArrivalCeremony being={newBeing} /> : null}
      {sigil.completed && isToday ? (
        <SealCeremony
          spec={sigil}
          day={day}
          closerLine={closerLine}
          sealedCount={petState.lifetimeDays}
          suppressed={newlyDiscovered || newBeing != null}
        />
      ) : null}
    </main>
  );
}
