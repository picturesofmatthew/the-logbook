// The world's air — one atmosphere factory + the five rooms' configs.
//
// The World Shell swaps a single shell-level Atmosphere to the active room's air
// on arrival (see world-shell.tsx). Every room shares one recipe — a gentle
// mote-drift + one warm glow — tuned by palette and glow placement, so the five
// rooms breathe as one place. Pure data (no React/DOM) — safe to import anywhere.

import type { AtmosphereConfig, RGB } from "../atmosphere-config";
import { hexToRgb } from "../atmosphere-config";

// Every room is authored in the hearth's portrait frame, so all five scale into
// a phone screen the same way.
export const WORLD_VIEWBOX = { width: 1000, height: 1500 };

// The one room-air recipe: a slow mote-drift + a single warm glow.
export function roomAir(
  colors: RGB[],
  glow: { x: number; y: number; r: number; color: RGB; alpha: number },
): AtmosphereConfig {
  return {
    viewBox: WORLD_VIEWBOX,
    density: 44000,
    minParticles: 14,
    maxParticles: 38,
    emitters: [
      {
        kind: "mote",
        weight: 1,
        spawn: { type: "rect", x: [40, 960], y: [120, 1360] },
        vx: [-5, 5],
        vy: [-16, -4],
        life: [7, 14],
        radius: [1.1, 2.6],
        alpha: [0.1, 0.34],
        colors,
        twinkle: true,
        wobble: [0.4, 1.6],
      },
    ],
    glows: [{ ...glow, flicker: { amp: glow.alpha * 0.4, freq: 1.1 } }],
  };
}

const GOLD = hexToRgb("#e8b866");
const VIOLET = hexToRgb("#b9a2d6");
const MOSS = hexToRgb("#9fb27a");
const SEAFOAM = hexToRgb("#8fb2c8");

export const gardenAir = roomAir([MOSS, GOLD], {
  x: 500,
  y: 1180,
  r: 520,
  color: hexToRgb("#4a5a38"),
  alpha: 0.16,
});
export const docksAir = roomAir([SEAFOAM, GOLD], {
  x: 540,
  y: 800,
  r: 560,
  color: hexToRgb("#2a3350"),
  alpha: 0.14,
});
export const libraryAir = roomAir([GOLD, VIOLET], {
  x: 500,
  y: 660,
  r: 560,
  color: hexToRgb("#5a3f24"),
  alpha: 0.2,
});
export const lanternLitAir = roomAir([GOLD], {
  x: 500,
  y: 500,
  r: 660,
  color: hexToRgb("#e8b866"),
  alpha: 0.28,
});
export const lanternDarkAir = roomAir([hexToRgb("#8a7a5a")], {
  x: 500,
  y: 500,
  r: 420,
  color: hexToRgb("#3a3020"),
  alpha: 0.12,
});
