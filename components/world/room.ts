// The World Engine — the Room contract.
//
// "A room = { parallax layers, atmosphere config, hotspots, its own bespoke
// art }. Every room conforms." (WORLD-ENGINE.md). Room #1 (the hearth) births
// the engine; rooms #2–N (glade, docks, library) implement THIS interface and
// inherit the RoomStage + Atmosphere for free — they author only their own art.
//
// HOW TO ADD THE NEXT ROOM (e.g. the docks):
//   1) Author its three SVG layers (far/mid/heart) — bespoke hero art as JSX or
//      raw markup injected with dangerouslySetInnerHTML (see hearth-scene.tsx).
//   2) Write an AtmosphereConfig for it (emitters + glows in ITS viewBox units).
//   3) Build a `Room` object from those + optional hotspots/inscription/defs.
//   4) Render `<RoomStage room={room} />` from a client component, and add a
//      route (app/<room>/page.tsx). That's the whole cost.

import type { ReactNode } from "react";
import type { AtmosphereConfig } from "./atmosphere-config";

/** The three parallax planes, back to front. Each is drawn into the shared
 *  scene SVG and given a whisper of pointer-parallax by the RoomStage:
 *   · far   — the room shell (walls, windows, the stair)
 *   · mid   — the furniture of a shared life (desk, keepers, the familiar)
 *   · heart — the one living thing (the seal and its emanation) */
export type RoomLayers = {
  far: ReactNode;
  mid: ReactNode;
  heart: ReactNode;
};

/** Per-layer parallax travel (px at full pointer deflection), back→front. */
export type Parallax = {
  far: readonly [number, number];
  mid: readonly [number, number];
  heart: readonly [number, number];
};

/** A tappable region in scene-space — for future interactivity (a door to the
 *  next room, an object to inspect). Optional; the hearth uses one for the
 *  seal's press-bloom. */
export type Hotspot = {
  id: string;
  x: number;
  y: number;
  r: number;
  label: string;
};

/** Lore at the foot — a line addressed to two people, never a notification. */
export type Inscription = {
  eyebrow: string;
  line: string;
};

export type Room = {
  id: string;
  /** scene-space; the SVG viewBox AND the atmosphere's coordinate system. */
  viewBox: { width: number; height: number };
  layers: RoomLayers;
  atmosphere: AtmosphereConfig;
  /** shared SVG <defs> (gradients, clip-paths) rendered once atop the scene. */
  defs?: ReactNode;
  parallax?: Parallax;
  hotspots?: Hotspot[];
  inscription?: Inscription;
  /** an accessible one-paragraph description of the whole scene. */
  ariaLabel?: string;
};

/** The engine's default parallax — the proto's "whisper of depth". */
export const DEFAULT_PARALLAX: Parallax = {
  far: [6, 4],
  mid: [10, 6],
  heart: [14, 9],
};
