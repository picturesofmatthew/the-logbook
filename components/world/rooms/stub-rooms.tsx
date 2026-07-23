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

// ── THE GARDEN — west, the glade (dusk, mossy, the familiar at rest) ──
export function GardenStub() {
  return (
    <>
      <defs>
        <linearGradient id="gd_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b5170" />
          <stop offset=".55" stopColor="#585564" />
          <stop offset="1" stopColor="#49493f" />
        </linearGradient>
        <linearGradient id="gd_ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3c4a30" />
          <stop offset="1" stopColor="#28331f" />
        </linearGradient>
        <radialGradient id="gd_moon" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f3e6c0" />
          <stop offset="1" stopColor="#f3e6c0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="1000" height="1500" fill="url(#gd_sky)" />
      <circle cx="742" cy="360" r="150" fill="url(#gd_moon)" opacity="0.5" />
      <circle cx="742" cy="360" r="64" fill="#f1e4bf" opacity="0.85" />
      {/* far hills */}
      <path d="M0 1040 Q260 940 520 1010 T1000 980 V1500 H0 Z" fill="#3a4636" opacity="0.65" />
      {/* the near ground */}
      <path d="M0 1120 Q300 1060 560 1120 T1000 1100 V1500 H0 Z" fill="url(#gd_ground)" />
      {/* a tree */}
      <g opacity="0.92">
        <path d="M300 1200 V960" stroke="#2b241c" strokeWidth="16" strokeLinecap="round" />
        <circle cx="300" cy="912" r="120" fill="#33422a" />
        <circle cx="228" cy="964" r="78" fill="#2e3b26" />
        <circle cx="372" cy="962" r="84" fill="#38472d" />
      </g>
      {/* the familiar, curled — a resting silhouette on the warm ground */}
      <g transform="translate(636 1236)" opacity="0.92">
        <ellipse cx="0" cy="0" rx="84" ry="50" fill="#d8c9a6" />
        <path d="M62 -22 q64 -30 74 26 q-42 -8 -74 -4 Z" fill="#cbb98f" />
        <circle cx="-58" cy="-12" r="30" fill="#e2d4b3" />
        <path d="M-72 -30 l10 -22 l14 18 Z" fill="#e2d4b3" />
        <path d="M-46 -32 l6 -22 l16 16 Z" fill="#e2d4b3" />
      </g>
    </>
  );
}

// ── THE DOCKS — east, the sea, the vessel, the far gold shore on the horizon ──
export function DocksStub() {
  return (
    <>
      <defs>
        <linearGradient id="dk_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#221d38" />
          <stop offset="1" stopColor="#3a3350" />
        </linearGradient>
        <linearGradient id="dk_sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2640" />
          <stop offset="1" stopColor="#191521" />
        </linearGradient>
        <radialGradient id="dk_shore" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f0c878" />
          <stop offset="1" stopColor="#f0c878" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="1000" height="820" fill="url(#dk_sky)" />
      <Stars />
      {/* the sea */}
      <rect x="0" y="800" width="1000" height="700" fill="url(#dk_sea)" />
      {/* the far shore — a speck of gold on the horizon, and its glow */}
      <ellipse cx="560" cy="800" rx="160" ry="34" fill="url(#dk_shore)" opacity="0.75" />
      <rect x="536" y="792" width="48" height="12" rx="6" fill="#f0c878" />
      {/* the vessel, sailing toward it */}
      <g transform="translate(372 980)" opacity="0.95">
        <path d="M-120 0 Q0 58 120 0 L92 42 Q0 66 -92 42 Z" fill="#2a2118" />
        <path d="M0 4 V-152" stroke="#3a2f22" strokeWidth="10" strokeLinecap="round" />
        <path d="M4 -150 L74 -58 L4 -58 Z" fill="#c9b48c" opacity="0.85" />
      </g>
      {/* a few slow swells */}
      <g stroke="#3a3450" strokeWidth="4" opacity="0.5" fill="none">
        <path d="M120 900 q60 -18 120 0 t120 0" />
        <path d="M640 1010 q60 -18 120 0 t120 0" />
      </g>
      {/* the dock, underfoot */}
      <rect x="0" y="1320" width="1000" height="180" fill="#241c14" />
      <g stroke="#150e09" strokeWidth="6" opacity="0.55">
        <path d="M130 1320 V1500" />
        <path d="M370 1320 V1500" />
        <path d="M630 1320 V1500" />
        <path d="M870 1320 V1500" />
      </g>
    </>
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
