"use client";

// The World Shell — the Lighthouse made one place (THE-LIGHTHOUSE.md).
//
// The Shell IS the world engine: a single spatial canvas that holds all five
// rooms as positioned layers and moves a camera between them. (It superseded the
// earlier per-room stage; scenes now render directly into a shared svg.) Two
// gestures, exactly as the world is built:
//
//   · SWIPE — cross the island (ground floor, y=0):  GARDEN ← HEARTH → DOCKS
//   · RISE  — climb the tower  (centre column, x=0):  HEARTH ↑ LIBRARY ↑ LANTERN
//
// The tower is literally the centre column and the island literally the ground
// floor, so the two gestures never collide. You land at the hearth. A swipe
// travels the way you swiped (left → garden, up → the tower); the room glides to
// you. Edge affordances + arrow keys give the same moves for discoverability and
// reduced-motion. The camera + gestures live in useWorldCamera, the cold-open
// gate in useColdOpen — this file builds the rooms and renders the world.

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import { useShell } from "@/components/shell/shell-provider";
import { composeSeal } from "@/components/sigil/glyphs";
import type { SigilSpec } from "@/lib/engine/sigil";
import { Atmosphere } from "./atmosphere";
import {
  HearthDefs,
  HearthFar,
  HearthHeart,
  HearthKeepers,
  HearthMid,
} from "./rooms/hearth-scene";
import { HEARTH_ATMOSPHERE } from "./rooms/hearth-atmosphere";
import { LibraryRoom, type LibrarySnapshot } from "./rooms/library-room";
import { DocksRoom, type DocksSnapshot } from "./rooms/docks-room";
import { OverviewScene, OVERVIEW_VIEWBOX } from "./rooms/overview-scene";
import { GardenRoom, type GardenSnapshot } from "./rooms/garden-room";
import { LanternRoom } from "./rooms/lantern-room";
import {
  WORLD_VIEWBOX,
  docksAir,
  gardenAir,
  lanternDarkAir,
  lanternLitAir,
  libraryAir,
} from "./rooms/world-air";
import type { AtmosphereConfig } from "./atmosphere-config";
import { useColdOpen } from "./use-cold-open";
import {
  cameraTransform,
  neighborFor,
  useWorldCamera,
  type Dir,
} from "./use-world-camera";

type WorldSlot = {
  id: string;
  col: number;
  row: number;
  className?: string;
  viewBox: { width: number; height: number };
  /** the room's SVG content, drawn into the shared world-scene svg. */
  scene: React.ReactNode;
  /** OR a full custom layer (a room that isn't a single svg — e.g. the Garden,
   *  which embeds the real GladeScene + familiar). Takes precedence over scene. */
  render?: React.ReactNode;
  air: AtmosphereConfig;
  eyebrow: string;
  line: string;
  aria: string;
};

// prefers-reduced-motion as an external store — server false, client live, so
// there's no setState-in-effect and no hydration mismatch on the transition.
function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia("(prefers-reduced-motion: reduce)");
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function WorldShell({
  spec,
  standingLine,
  library,
  docks,
  garden,
  keepers,
  needsKeeper,
}: {
  spec: SigilSpec;
  standingLine: string | null;
  library: LibrarySnapshot;
  docks: DocksSnapshot;
  garden: GardenSnapshot;
  /** each keeper's elected character — worn by the figures at the mantle */
  keepers: { moss: string | null; ember: string | null };
  /** the bond has no second keeper yet — surface the invite at the hearth. */
  needsKeeper: boolean;
}) {
  const router = useRouter();
  const navTo = useCallback((href: string) => router.push(href), [router]);
  const { openCapture, captureOpen } = useShell();
  const reduced = useReducedMotion();

  // the two behaviours, each its own hook: the gate you cross, then the camera
  // you steer. The camera stays quiet behind the gate and while the log sheet
  // owns the input.
  const { phase, enter } = useColdOpen(reduced);
  const {
    cam,
    moving,
    ease,
    go,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    endMove,
  } = useWorldCamera({ phase, captureOpen, reduced });

  // focus anchors — the gate holds focus while it's up; the world root takes it
  // on arrival, so a keyboard user always has a landing spot (and arrow-nav works).
  const rootRef = useRef<HTMLDivElement>(null);
  const gateRef = useRef<HTMLDivElement>(null);

  // move focus with the gate: onto it while it's up, into the world on arrival.
  useEffect(() => {
    if (phase === "overview") gateRef.current?.focus();
    else if (phase === "live") rootRef.current?.focus();
  }, [phase]);

  const sealHtml = useMemo(() => composeSeal(spec, { ground: "none" }), [spec]);

  const lit = spec.completed;
  const solo = !lit && spec.moss.inked !== spec.ember.inked;

  const libraryLine =
    library.days === 0
      ? "five books, waiting for their first page."
      : "your kept self — the silver waits to be inked to gold.";

  const docksLine = docks.dream
    ? docks.complete
      ? `${docks.dream.name} — reached. the vessel rests at the shore.`
      : `toward ${docks.dream.name} · ${docks.planksLaid} of ${docks.plankGoal} planks`
    : "no far shore yet — name the Dream you sail toward.";

  const gardenLine =
    garden.mossLit && garden.emberLit
      ? `both fires are lit — the glade is ${garden.tier}`
      : garden.mossLit || garden.emberLit
        ? `a fire is kept — the glade is ${garden.tier}`
        : `the living present — the glade is ${garden.tier}`;

  const slots: WorldSlot[] = useMemo(
    () => [
      {
        id: "garden",
        col: -1,
        row: 0,
        viewBox: WORLD_VIEWBOX,
        scene: null,
        render: <GardenRoom snapshot={garden} />,
        air: gardenAir,
        eyebrow: "The Garden · west",
        line: gardenLine,
        aria:
          "The garden west of the hearth: the living glade with the familiar and the beings that keep it, blooming or hushed with the day's vitality.",
      },
      {
        id: "hearth",
        col: 0,
        row: 0,
        className: "hearth-room",
        viewBox: { width: 1000, height: 1500 },
        scene: (
          <>
            <HearthDefs />
            <HearthFar />
            <HearthMid />
            <HearthKeepers moss={keepers.moss} ember={keepers.ember} />
            <HearthHeart sealHtml={sealHtml} bloom={false} />
          </>
        ),
        air: HEARTH_ATMOSPHERE,
        eyebrow: lit ? "Hearth Hall · the day sealed" : "Hearth Hall · the day unsealed",
        line: standingLine ?? "the wax is warm whenever you're ready — both of you.",
        aria:
          "The hearth hall at the base of the lighthouse, where the two keepers flank a mantle and the day's seal breathes over an open spellbook.",
      },
      {
        id: "docks",
        col: 1,
        row: 0,
        viewBox: WORLD_VIEWBOX,
        scene: <DocksRoom snapshot={docks} onOpen={navTo} />,
        air: docksAir,
        eyebrow: "The Docks · east",
        line: docksLine,
        aria:
          "The docks east of the hearth: a night sea under stars, the vessel sailing out across the depth toward a speck of gold on the horizon — the far shore, your Dream. A locked coffer waits on the dock. Tap the vessel to look toward the shore.",
      },
      {
        id: "library",
        col: 0,
        row: 1,
        viewBox: WORLD_VIEWBOX,
        scene: <LibraryRoom snapshot={library} onOpenBook={navTo} />,
        air: libraryAir,
        eyebrow: "The Compendium · up the stair",
        line: libraryLine,
        aria:
          "The library up the spiral stair: warm shelves and the five bound books of the Compendium — Book of Days, Legendarium, Bestiary, Apothecary, Almanac — each gold for what you have lived and silver for what still waits. A mantel above keeps the shores you have reached.",
      },
      {
        id: "lantern",
        col: 0,
        row: 2,
        viewBox: WORLD_VIEWBOX,
        scene: <LanternRoom spec={spec} />,
        air: lit ? lanternLitAir : lanternDarkAir,
        eyebrow: "The Lantern · the light",
        line: lit
          ? "the light is lit — it reaches the far shore."
          : solo
            ? "the lamp kindles — one hand is on it."
            : "the lamp is dark — keep the light, together.",
        aria: lit
          ? "The lamp room at the top of the tower: the light is lit and its beam sweeps across the water to the far shore."
          : "The lamp room at the top of the tower: the light is dark, waiting for the day's seal to close.",
      },
    ],
    [
      sealHtml,
      standingLine,
      keepers.moss,
      keepers.ember,
      lit,
      solo,
      spec,
      library,
      libraryLine,
      docks,
      docksLine,
      garden,
      gardenLine,
      navTo,
    ],
  );

  const active =
    slots.find((s) => s.col === cam.col && s.row === cam.row) ?? slots[1];

  const dirs: { dir: Dir; cls: string; glyph: string; label: string }[] = [
    { dir: "west", cls: "west", glyph: "❮", label: "West to the garden" },
    { dir: "east", cls: "east", glyph: "❯", label: "East to the docks" },
    { dir: "up", cls: "up", glyph: "︿", label: "Rise up the tower" },
    { dir: "down", cls: "down", glyph: "﹀", label: "Descend the tower" },
  ];

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      className={`world-shell${phase === "entering" ? " arriving" : ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <div
        className="world-camera"
        style={{ transform: cameraTransform(cam), transition: ease }}
        onTransitionEnd={endMove}
      >
        {slots.map((s) => (
          <div
            key={s.id}
            className={`world-slot ${s.className ?? ""}`}
            style={{ transform: `translate(${s.col * 100}%, ${-s.row * 100}%)` }}
            aria-hidden={s.id !== active.id}
            inert={s.id !== active.id}
          >
            {s.render ?? (
              <svg
                className="world-scene"
                viewBox={`0 0 ${s.viewBox.width} ${s.viewBox.height}`}
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label={s.aria}
              >
                {s.scene}
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* one atmosphere, the active room's air — swapped on arrival, faded
          through the move so the particle change is never seen */}
      <Atmosphere
        key={active.id}
        config={active.air}
        className={`world-air${moving ? " world-air-dim" : ""}`}
      />

      <div className="world-grain" aria-hidden="true" />
      <div className="world-vignette" aria-hidden="true" />

      <div className={`world-inscription${moving ? " world-air-dim" : ""}`}>
        <div className="world-eyebrow">{active.eyebrow}</div>
        <div className="world-line">{active.line}</div>
      </div>

      {/* the ways through the world — shown only where a room actually is, and
          only once you've arrived (never during the cold open) */}
      {phase === "live"
        ? dirs.map(({ dir, cls, glyph, label }) =>
            neighborFor(cam, dir) ? (
              <button
                key={dir}
                type="button"
                className={`world-nav world-nav-${cls}`}
                aria-label={label}
                onClick={() => go(dir)}
              >
                <span aria-hidden>{glyph}</span>
              </button>
            ) : null,
          )
        : null}

      {/* log the day — the diegetic capture at the hearth. The ribbon retires;
          the daily loop needs zero navigation, so the day is logged from home. */}
      {phase === "live" && cam.col === 0 && cam.row === 0 ? (
        <button
          type="button"
          className="world-log"
          aria-label="Log the day — speak, eat, or train"
          onClick={() => openCapture()}
        >
          <span aria-hidden>❧</span> log the day
        </button>
      ) : null}

      {/* the second keeper — a book can't seal alone, so a solo bond's first
          call is to invite. Shown at the hearth until the ember arrives. */}
      {phase === "live" && cam.col === 0 && cam.row === 0 && needsKeeper ? (
        <button
          type="button"
          className="world-invite"
          aria-label="Invite your keeper — your book waits for its second keeper"
          onClick={() => navTo("/invite")}
        >
          your book waits for its second keeper —{" "}
          <span className="world-invite-cta">invite them ❯</span>
        </button>
      ) : null}

      {/* THE COLD OPEN — the whole world held a beat, then a fluid push-in
          through the warm window to the hearth. Tap (or wait) to enter. */}
      {phase !== "live" ? (
        <div
          ref={gateRef}
          className={`world-coldopen${phase === "entering" ? " entering" : ""}`}
          onClick={enter}
          onKeyDown={(e) => {
            if (phase === "overview" && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              enter();
            }
          }}
          role={phase === "overview" ? "button" : undefined}
          tabIndex={phase === "overview" ? 0 : -1}
          aria-label={
            phase === "overview" ? "Begin — enter the lighthouse" : undefined
          }
        >
          <svg
            className="world-scene"
            viewBox={`0 0 ${OVERVIEW_VIEWBOX.width} ${OVERVIEW_VIEWBOX.height}`}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="The whole world from afar: the island in a dark sea, the lighthouse rising with its lamp lit, a garden to the west, the docks to the east, a far-off island on the horizon, and the stars strung into constellations."
          >
            <OverviewScene />
          </svg>
          <div className="world-wordmark" aria-hidden>
            <span>Signed</span>
            <span className="world-wordmark-x">✕</span>
            <span>Sealed</span>
          </div>
          {phase === "overview" ? (
            <span className="world-begin">begin</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
