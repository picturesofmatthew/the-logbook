// The Hearth Room — its Atmosphere config.
//
// The proto's breath, expressed as data: three emitters (embers off the fire,
// sigil-motes around the seal + rising off the open book, dust in the shaft of
// light) and the room's warm flicker-glows (fire, two candles, the hanging
// lantern, the stairwell, the seal's halo). All in the hearth's 1000×1500
// scene-space, so the same engine renders it registered at any viewport.

import type { AtmosphereConfig } from "../atmosphere-config";
import { hexToRgb } from "../atmosphere-config";

const GOLD = hexToRgb("#d9a441");
const WICK = hexToRgb("#f7e3ae");
const TERRA = hexToRgb("#c4704b");
const ILLUM = hexToRgb("#c9b3e3");
const PAPER = hexToRgb("#f5eddc");

export const HEARTH_ATMOSPHERE: AtmosphereConfig = {
  viewBox: { width: 1000, height: 1500 },
  density: 22000,
  minParticles: 36,
  maxParticles: 84,
  emitters: [
    {
      // embers lifting off the fire
      kind: "ember",
      weight: 0.3,
      spawn: { type: "rect", x: [452, 548], y: [1108, 1168] },
      vx: [-4, 4],
      vy: [-58, -26],
      life: [2.2, 4.6],
      radius: [0.9, 2.3],
      alpha: [0.35, 0.8],
      colors: [WICK, GOLD, GOLD, TERRA],
    },
    {
      // sigil-motes — orbiting the seal, or rising off the open book (35%)
      kind: "sigil",
      weight: 0.42,
      spawn: { type: "ring", cx: 500, cy: 600, r: [118, 168], yScale: 0.9, burstR: [60, 120] },
      alt: { chance: 0.35, x: [425, 575], y: [842, 880] },
      vx: [-2, 2],
      vxFromCenter: { cx: 500, factor: 0.015 },
      vy: [-18, -6],
      vyBurst: [-40, -6],
      life: [3.5, 7],
      radius: [0.7, 1.9],
      alpha: [0.3, 0.7],
      colors: [ILLUM, ILLUM, ILLUM, GOLD, WICK],
      twinkle: true,
    },
    {
      // dust drifting in the shaft of light
      kind: "dust",
      weight: 0.28,
      spawn: { type: "rect", x: [365, 635], y: [330, 900] },
      vx: [-2.5, 2.5],
      vy: [-5.5, -1.5],
      life: [6, 12],
      radius: [0.5, 1.2],
      alpha: [0.05, 0.16],
      colors: [PAPER],
    },
  ],
  glows: [
    { x: 500, y: 1122, r: 340, color: GOLD, alpha: 0.11, flicker: { amp: 0.05, freq: 7.3 } },
    { x: 500, y: 1152, r: 155, color: WICK, alpha: 0.092, flicker: { amp: 0.045, freq: 7.3, phase: 1.2 } },
    { x: 262, y: 818, r: 55, color: WICK, alpha: 0.09, flicker: { amp: 0.045, freq: 9.1 } },
    { x: 748, y: 820, r: 55, color: WICK, alpha: 0.09, flicker: { amp: 0.045, freq: 8.3, phase: 2 } },
    { x: 352, y: 168, r: 72, color: WICK, alpha: 0.11, flicker: { amp: 0.04, freq: 6.7, phase: 1 } },
    { x: 912, y: 468, r: 120, color: GOLD, alpha: 0.06, flicker: { amp: 0.02, freq: 1.7 } },
    { x: 500, y: 600, r: 245, color: ILLUM, alpha: 0.05, flicker: { amp: 0.02, freq: 1.43 } },
  ],
};
