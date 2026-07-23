// The World Engine — Atmosphere config.
//
// One Canvas particle/glow system, lifted from the hearth proto and made
// config-driven so every room parameterizes the same engine (WORLD-ENGINE.md:
// "Atmosphere engine — one Canvas particle/glow system, parameterized per
// room"). Coordinates are SCENE-SPACE (the room's viewBox units), so emitters
// and glows stay registered to the art at any viewport — the renderer maps
// scene → screen with the same xMidYMid-meet scale the RoomStage SVG uses.
//
// Pure types + one helper. No React, no DOM — safe to import anywhere.

export type RGB = readonly [number, number, number];

/** #rrggbb → [r,g,b], for canvas gradient stops. */
export function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

export type Range = readonly [number, number];

/** A rectangular spawn region, in scene units. */
export type RectSpawn = {
  type: "rect";
  x: Range;
  y: Range;
};

/** A ring/annulus spawn around a center, in scene units (yScale squashes it
 *  into the seal's slightly-oval halo). `burstR` is the tighter radius used
 *  when a particle is spawned as part of an interaction burst. */
export type RingSpawn = {
  type: "ring";
  cx: number;
  cy: number;
  r: Range;
  yScale?: number;
  burstR?: Range;
};

export type Spawn = RectSpawn | RingSpawn;

/** One emitter — a family of particles (embers, sigil-motes, dust…). */
export type Emitter = {
  kind: string;
  /** share of the pool (weights are normalized across emitters). */
  weight: number;
  spawn: Spawn;
  /** an alternate rect spawn, taken `chance` of the time (e.g. sigil-motes
   *  rising off the open book instead of orbiting the seal). */
  alt?: { chance: number } & Omit<RectSpawn, "type">;
  /** velocity ranges, scene-units/sec. Negative vy drifts upward. */
  vx: Range;
  vy: Range;
  /** vy range used specifically for interaction bursts (livelier). */
  vyBurst?: Range;
  /** add (x - cx) * factor to vx, so motes fan outward from a center. */
  vxFromCenter?: { cx: number; factor: number };
  life: Range;
  radius: Range;
  alpha: Range;
  colors: RGB[];
  /** sigil-motes twinkle as they drift. */
  twinkle?: boolean;
  /** horizontal sway amplitude range (default [0.6, 2.2]). */
  wobble?: Range;
};

/** A warm light source painted as a soft radial glow, with optional flicker. */
export type GlowPoint = {
  x: number;
  y: number;
  r: number;
  color: RGB;
  /** base alpha at rest. */
  alpha: number;
  /** flicker adds `amp` of a slow multi-sine breath at `freq` (rad/sec). */
  flicker?: { amp: number; freq: number; phase?: number };
};

export type AtmosphereConfig = {
  /** scene-space, must match the RoomStage viewBox so particles register. */
  viewBox: { width: number; height: number };
  emitters: Emitter[];
  glows: GlowPoint[];
  /** target particle count = clamp(area / density, min, max). Lower density =
   *  more particles. Defaults tuned for the hearth. */
  density?: number;
  minParticles?: number;
  maxParticles?: number;
};

/** Imperative handle a room can hold to spark a burst on interaction. */
export type AtmosphereHandle = {
  /** spark `count` particles of `kind` centered on a scene-space point. */
  burst: (sceneX: number, sceneY: number, kind: string, count: number) => void;
};
