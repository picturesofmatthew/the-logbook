// THE LANTERN — the top of the tower, the light. The one stub that already
// reads the LIVE spell, so one true thing moves in the world from day one: the
// lamp lit by the day's seal (lit / solo-kindled / dark), the beam sweeping out
// to the far shore when the day is sealed. The air configs live in world-air.ts.

import type { SigilSpec } from "@/lib/engine/sigil";

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

function Stars({ opacity = 0.8 }: { opacity?: number }) {
  return (
    <g fill="#f2e6c4" opacity={opacity}>
      {STARS.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} />
      ))}
    </g>
  );
}

export function LanternRoom({ spec }: { spec: SigilSpec }) {
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
