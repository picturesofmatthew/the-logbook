"use client";

// The World Shell — the Lighthouse made one place (THE-LIGHTHOUSE.md).
//
// The World Engine gave us the per-room stage (RoomStage). The Shell is the
// thing above it: a single spatial canvas that holds all five rooms as
// positioned layers and moves a camera between them. Two gestures, exactly as
// the world is built:
//
//   · SWIPE — cross the island (ground floor, y=0):  GARDEN ← HEARTH → DOCKS
//   · RISE  — climb the tower  (centre column, x=0):  HEARTH ↑ LIBRARY ↑ LANTERN
//
// The tower is literally the centre column and the island literally the ground
// floor, so the two gestures never collide. You land at the hearth. A swipe
// travels the way you swiped (left → garden, up → the tower); the room glides
// to you. Edge affordances + arrow keys give the same moves for discoverability
// and reduced-motion. The hearth is the one real room; the other four are honest
// stubs — except the Lantern, which already burns by the LIVE spell.

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { composeSeal } from "@/components/sigil/glyphs";
import type { SigilSpec } from "@/lib/engine/sigil";
import { Atmosphere } from "./atmosphere";
import { HearthDefs, HearthFar, HearthHeart, HearthMid } from "./rooms/hearth-scene";
import { HEARTH_ATMOSPHERE } from "./rooms/hearth-atmosphere";
import {
  DocksStub,
  GardenStub,
  LanternStub,
  LibraryStub,
  STUB_VIEWBOX,
  docksAir,
  gardenAir,
  lanternDarkAir,
  lanternLitAir,
  libraryAir,
} from "./rooms/stub-rooms";
import type { AtmosphereConfig } from "./atmosphere-config";

type Cell = { col: number; row: number };
type Dir = "west" | "east" | "up" | "down";

type WorldSlot = {
  id: string;
  col: number;
  row: number;
  className?: string;
  viewBox: { width: number; height: number };
  scene: React.ReactNode;
  air: AtmosphereConfig;
  eyebrow: string;
  line: string;
  aria: string;
};

const HEARTH: Cell = { col: 0, row: 0 };
const SWIPE_MIN = 42; // px of travel on release to count as a swipe
const FLICK = 66; // px mid-gesture that fires the move instantly (snappy)

// a swipe means "travel the way you swiped" — turn your head across the world
// (THE-LIGHTHOUSE.md): left → west/garden, right → east/docks, up → rise the
// tower, down → descend. One rule for both axes; the room glides to you.
const swipeDir = (dx: number, dy: number): Dir =>
  Math.abs(dx) >= Math.abs(dy)
    ? dx < 0
      ? "west"
      : "east"
    : dy < 0
      ? "up"
      : "down";

// The room a compass move lands on — swipe on the ground, rise on the centre.
function neighborFor(cam: Cell, dir: Dir): Cell | null {
  switch (dir) {
    case "west":
      return cam.row === 0 && cam.col > -1 ? { col: cam.col - 1, row: 0 } : null;
    case "east":
      return cam.row === 0 && cam.col < 1 ? { col: cam.col + 1, row: 0 } : null;
    case "up":
      return cam.col === 0 && cam.row < 2 ? { col: 0, row: cam.row + 1 } : null;
    case "down":
      return cam.col === 0 && cam.row > 0 ? { col: 0, row: cam.row - 1 } : null;
  }
}

const base = (c: Cell) => `translate(${-c.col * 100}%, ${c.row * 100}%)`;

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
}: {
  spec: SigilSpec;
  standingLine: string | null;
}) {
  const [cam, setCam] = useState<Cell>(HEARTH);
  const [moving, setMoving] = useState(false);
  const reduced = useReducedMotion();

  // swipe bookkeeping (a ref, so tracking a gesture never re-renders React)
  const drag = useRef<{
    down: boolean;
    sx: number;
    sy: number;
    fired: boolean;
  }>({ down: false, sx: 0, sy: 0, fired: false });

  const ease = reduced ? "none" : "transform 560ms cubic-bezier(0.33, 1, 0.68, 1)";

  const sealHtml = useMemo(() => composeSeal(spec, { ground: "none" }), [spec]);

  const lit = spec.completed;
  const solo = !lit && spec.moss.inked !== spec.ember.inked;

  const slots: WorldSlot[] = useMemo(
    () => [
      {
        id: "garden",
        col: -1,
        row: 0,
        viewBox: STUB_VIEWBOX,
        scene: <GardenStub />,
        air: gardenAir,
        eyebrow: "The Garden · west",
        line: "the glade — coming into focus.",
        aria:
          "A dusk garden west of the hearth: a moon over far hills, a tree, and the antlered familiar curled asleep on the ground. This room is coming into focus.",
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
        viewBox: STUB_VIEWBOX,
        scene: <DocksStub />,
        air: docksAir,
        eyebrow: "The Docks · east",
        line: "the vessel, and the far shore — coming into focus.",
        aria:
          "The docks east of the hearth: a night sea, the vessel sailing out, and a speck of gold on the horizon — the far shore. This room is coming into focus.",
      },
      {
        id: "library",
        col: 0,
        row: 1,
        viewBox: STUB_VIEWBOX,
        scene: <LibraryStub />,
        air: libraryAir,
        eyebrow: "The Library · above",
        line: "the Compendium, five books — coming into focus.",
        aria:
          "The library up the spiral stair: warm shelves and the five books of the Compendium standing on a lectern. This room is coming into focus.",
      },
      {
        id: "lantern",
        col: 0,
        row: 2,
        viewBox: STUB_VIEWBOX,
        scene: <LanternStub spec={spec} />,
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
    [sealHtml, standingLine, lit, solo, spec],
  );

  const active =
    slots.find((s) => s.col === cam.col && s.row === cam.row) ?? slots[1];

  // ── glide the camera to a cell (swipe, affordance, or key) ──
  // Just move the state: the camera div's CSS transition eases the transform
  // change into a slide. Under reduced-motion the transition is 'none' (instant,
  // no transitionend), so we don't arm the `moving` guard.
  const glide = (target: Cell) => {
    setCam(target);
    if (!reduced) setMoving(true);
  };

  const go = (dir: Dir) => {
    if (moving) return;
    const target = neighborFor(cam, dir);
    if (target) glide(target);
  };

  // keep the latest `go` reachable from the once-bound key listener
  const goRef = useRef(go);
  useEffect(() => {
    goRef.current = go;
  });

  // ── swipe to travel — flick toward the room you want ──
  const onPointerDown = (e: React.PointerEvent) => {
    if (moving) return;
    // let the affordance chips + the exit link take their own taps
    if ((e.target as HTMLElement).closest("button, a")) return;
    const d = drag.current;
    d.down = true;
    d.sx = e.clientX;
    d.sy = e.clientY;
    d.fired = false;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  // a confident flick fires mid-gesture (instant), so the world feels quick
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.down || d.fired) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < FLICK) return;
    const dir = swipeDir(dx, dy);
    if (neighborFor(cam, dir)) {
      d.fired = true;
      go(dir);
    }
  };

  // a gentler swipe still counts on release
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.down) return;
    d.down = false;
    if (d.fired) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_MIN) return;
    go(swipeDir(dx, dy));
  };

  const onPointerCancel = () => {
    drag.current.down = false;
  };

  // arrow keys — the same moves, for a keyboard (or a reduced-motion pref)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowLeft: "west",
        ArrowRight: "east",
        ArrowUp: "up",
        ArrowDown: "down",
      };
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      goRef.current(dir);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const dirs: { dir: Dir; cls: string; glyph: string; label: string }[] = [
    { dir: "west", cls: "west", glyph: "❮", label: "West to the garden" },
    { dir: "east", cls: "east", glyph: "❯", label: "East to the docks" },
    { dir: "up", cls: "up", glyph: "︿", label: "Rise up the tower" },
    { dir: "down", cls: "down", glyph: "﹀", label: "Descend the tower" },
  ];

  return (
    <div
      className="world-shell"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <div
        className="world-camera"
        style={{ transform: base(cam), transition: ease }}
        onTransitionEnd={(e) => {
          if (e.propertyName === "transform") setMoving(false);
        }}
      >
        {slots.map((s) => (
          <div
            key={s.id}
            className={`world-slot ${s.className ?? ""}`}
            style={{ transform: `translate(${s.col * 100}%, ${-s.row * 100}%)` }}
            aria-hidden={s.id !== active.id}
          >
            <svg
              className="world-scene"
              viewBox={`0 0 ${s.viewBox.width} ${s.viewBox.height}`}
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label={s.aria}
            >
              {s.scene}
            </svg>
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

      {/* the ways through the world — shown only where a room actually is */}
      {dirs.map(({ dir, cls, glyph, label }) =>
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
      )}

      <Link href="/" className="world-exit" aria-label="Leave the lighthouse">
        <span aria-hidden>❮</span> leave
      </Link>
    </div>
  );
}
