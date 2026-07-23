// The World Engine — honest room stubs.
//
// Phase 1 of the Lighthouse world (THE-LIGHTHOUSE.md) is the SPINE: the camera
// that lets you cross the island (swipe) and climb the tower (rise). The hearth
// is the one real room; these four are honest placeholders — each a named,
// atmospheric scene that says "coming into focus," never a fake finished room.
// Phase 2 replaces each with its true room (garden ← the glade, docks ← the
// shore + vessel, library ← the five books, lantern ← the full beam cinematic).
//
// The Lantern is the exception: it already reads the LIVE spell, so one true
// thing is moving in the world from day one — the light lit by the seal.

import type { AtmosphereConfig, RGB } from "../atmosphere-config";
import { hexToRgb } from "../atmosphere-config";
import type { SigilSpec } from "@/lib/engine/sigil";

// Every stub is authored in the hearth's portrait frame, so all five rooms
// scale into a phone screen the same way.
export const STUB_VIEWBOX = { width: 1000, height: 1500 };

// A gentle mote-drift + one warm glow — the light breath of a room not yet
// fully built, so even the stubs feel inhabited rather than empty.
function stubAir(
  colors: RGB[],
  glow: { x: number; y: number; r: number; color: RGB; alpha: number },
): AtmosphereConfig {
  return {
    viewBox: STUB_VIEWBOX,
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

export const gardenAir = stubAir([MOSS, GOLD], {
  x: 500,
  y: 1180,
  r: 520,
  color: hexToRgb("#4a5a38"),
  alpha: 0.16,
});
export const docksAir = stubAir([SEAFOAM, GOLD], {
  x: 540,
  y: 800,
  r: 560,
  color: hexToRgb("#2a3350"),
  alpha: 0.14,
});
export const libraryAir = stubAir([GOLD, VIOLET], {
  x: 500,
  y: 660,
  r: 560,
  color: hexToRgb("#5a3f24"),
  alpha: 0.2,
});
export const lanternLitAir = stubAir([GOLD], {
  x: 500,
  y: 500,
  r: 660,
  color: hexToRgb("#e8b866"),
  alpha: 0.28,
});
export const lanternDarkAir = stubAir([hexToRgb("#8a7a5a")], {
  x: 500,
  y: 500,
  r: 420,
  color: hexToRgb("#3a3020"),
  alpha: 0.12,
});

// a few fixed stars (deterministic — no Math.random, which the world must not
// depend on) as [x, y, r]
const STARS: [number, number, number][] = [
  [120, 150, 2.4],
  [260, 90, 1.8],
  [430, 190, 2.1],
  [610, 120, 1.6],
  [780, 210, 2.6],
  [880, 110, 1.9],
  [340, 300, 1.6],
  [700, 330, 2.0],
  [180, 380, 1.7],
];

function Stars({ fill = "#f2e6c4", opacity = 0.8 }: { fill?: string; opacity?: number }) {
  return (
    <g fill={fill} opacity={opacity}>
      {STARS.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} />
      ))}
    </g>
  );
}

// ── THE LANTERN — the top, the light. Lit by the LIVE spell. ──
export function LanternStub({ spec }: { spec: SigilSpec }) {
  const lit = spec.completed;
  const solo = !lit && spec.moss.inked !== spec.ember.inked;
  const core = lit ? "#ffe6a6" : solo ? "#e0b878" : "#5f5238";
  const coreGlow = lit ? 0.9 : solo ? 0.5 : 0.18;
  return (
    <>
      <defs>
        <linearGradient id="ln_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#181530" />
          <stop offset="1" stopColor="#2b2545" />
        </linearGradient>
        <radialGradient id="ln_core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={core} stopOpacity={coreGlow} />
          <stop offset="1" stopColor={core} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ln_beam" x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0" stopColor="#ffe6a6" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffe6a6" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ln_far" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f0c878" />
          <stop offset="1" stopColor="#f0c878" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="1000" height="1500" fill="url(#ln_sky)" />
      <Stars opacity={lit ? 0.5 : 0.85} />
      {/* the sea far below, and the far shore the beam is reaching for */}
      <rect x="0" y="1180" width="1000" height="320" fill="#141122" />
      {lit ? (
        <>
          {/* the beam, sweeping out over the water toward the shore */}
          <path d="M500 520 L1080 1000 L1080 1200 L500 560 Z" fill="url(#ln_beam)" />
          <path d="M500 520 L-80 1000 L-80 1200 L500 560 Z" fill="url(#ln_beam)" opacity="0.6" />
          {/* the far shore, lit */}
          <ellipse cx="880" cy="1180" rx="150" ry="30" fill="url(#ln_far)" opacity="0.8" />
          <rect x="856" y="1172" width="48" height="12" rx="6" fill="#f0c878" />
        </>
      ) : null}
      {/* the lamp glow */}
      <circle cx="500" cy="500" r="360" fill="url(#ln_core)" />
      {/* the lantern housing */}
      <g>
        <path d="M420 620 L580 620 L560 380 L440 380 Z" fill="#2a2236" stroke="#c9a86a" strokeWidth="6" opacity="0.9" />
        <rect x="452" y="300" width="96" height="86" rx="8" fill="#3a3048" stroke="#c9a86a" strokeWidth="6" />
        <path d="M470 300 Q500 250 530 300" fill="none" stroke="#c9a86a" strokeWidth="6" />
        {/* the light itself */}
        <circle cx="500" cy="500" r={lit ? 84 : 60} fill={core} opacity={lit ? 0.95 : solo ? 0.7 : 0.4} />
        <circle cx="500" cy="500" r={lit ? 40 : 26} fill="#fff6df" opacity={lit ? 0.95 : 0.5} />
        {/* glass panes */}
        <g stroke="#c9a86a" strokeWidth="4" opacity="0.5">
          <path d="M500 386 V620" />
          <path d="M436 420 H564" />
        </g>
      </g>
      <rect x="404" y="620" width="192" height="30" rx="6" fill="#241c2e" stroke="#c9a86a" strokeWidth="5" opacity="0.9" />
    </>
  );
}
