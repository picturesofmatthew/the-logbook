import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type TransitionEvent,
} from "react";
import type { ColdOpenPhase } from "./use-cold-open";

export type Cell = { col: number; row: number };
export type Dir = "west" | "east" | "up" | "down";

export const HEARTH: Cell = { col: 0, row: 0 };
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
export function neighborFor(cam: Cell, dir: Dir): Cell | null {
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

// the camera's transform for a cell — the whole world slides under one lens.
export const cameraTransform = (c: Cell) =>
  `translate(${-c.col * 100}%, ${c.row * 100}%)`;

// The camera: where the lens sits (cam), whether it's mid-glide (moving), and the
// two gestures that move it — swipe (pointer) + arrow keys — with the guards that
// keep them from firing behind the gate or while the capture sheet owns the input.
export function useWorldCamera({
  phase,
  captureOpen,
  reduced,
}: {
  phase: ColdOpenPhase;
  captureOpen: boolean;
  reduced: boolean;
}) {
  const [cam, setCam] = useState<Cell>(HEARTH);
  const [moving, setMoving] = useState(false);

  // swipe bookkeeping (a ref, so tracking a gesture never re-renders React)
  const drag = useRef<{ down: boolean; sx: number; sy: number; fired: boolean }>(
    { down: false, sx: 0, sy: 0, fired: false },
  );

  const ease = reduced
    ? "none"
    : "transform 560ms cubic-bezier(0.33, 1, 0.68, 1)";

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

  // latest phase/cam/captureOpen for the once-bound window key listener, so it
  // never fires behind the gate or while the capture sheet owns the keyboard.
  const liveRef = useRef({ phase, cam, captureOpen });
  liveRef.current = { phase, cam, captureOpen };

  // ── swipe to travel — flick toward the room you want ──
  const onPointerDown = (e: PointerEvent) => {
    if (phase !== "live" || moving) return;
    // let the affordance chips, the exit link, and the books take their own taps
    if ((e.target as HTMLElement).closest("button, a, [data-hotspot]")) return;
    const d = drag.current;
    d.down = true;
    d.sx = e.clientX;
    d.sy = e.clientY;
    d.fired = false;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  // a confident flick fires mid-gesture (instant), so the world feels quick
  const onPointerMove = (e: PointerEvent) => {
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
  const onPointerUp = (e: PointerEvent) => {
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
    const map: Record<string, Dir> = {
      ArrowLeft: "west",
      ArrowRight: "east",
      ArrowUp: "up",
      ArrowDown: "down",
    };
    const onKey = (e: KeyboardEvent) => {
      const { phase, cam, captureOpen } = liveRef.current;
      // only when you're actually in the world — not behind the gate, and not
      // while the capture sheet or any dialog/field owns the keyboard
      if (phase !== "live" || captureOpen) return;
      const t = e.target as HTMLElement | null;
      if (
        t?.closest("input, textarea, select, [contenteditable], [role='dialog']")
      )
        return;
      const dir = map[e.key];
      if (!dir || !neighborFor(cam, dir)) return; // no move here → let the key be
      e.preventDefault();
      goRef.current(dir);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // the camera settles: clear the `moving` guard when the slide's transform ends
  const endMove = (e: TransitionEvent) => {
    if (e.propertyName === "transform") setMoving(false);
  };

  return {
    cam,
    moving,
    ease,
    go,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    endMove,
  };
}
