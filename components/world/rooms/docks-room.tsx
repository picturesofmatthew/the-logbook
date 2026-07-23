// The Docks — east — the quest (THE-LIGHTHOUSE.md).
//
// The island's FUTURE pole: the vessel builds plank by plank and the far shore
// sits small and gold on the horizon, drawn nearer with every both-logged day.
// Depth is the hero — you look OUT across dark water at something far, and the
// vessel's position along that depth IS the wordless score (planksLaid of
// plankGoal). A dim, LOCKED coffer waits on the dock: this room is built to hold
// real money honestly later (COFFERS.md) without faking any now.
//
// Tapping the vessel opens the full shore page; the boat/Dream engine
// (lib/engine/boat.ts, /shore) stays the source of truth.

import { Hotspot } from "./hotspot";

export type DocksSnapshot = {
  dream: {
    name: string;
    distanceDays: number;
    reachedDay: string | null;
  } | null;
  planksLaid: number;
  plankGoal: number;
  complete: boolean;
};

const STARS: [number, number, number][] = [
  [120, 150, 2.4],
  [280, 96, 1.8],
  [450, 200, 2.1],
  [640, 120, 1.6],
  [800, 220, 2.6],
  [900, 120, 1.9],
  [360, 320, 1.6],
  [720, 340, 2.0],
];

export function DocksRoom({
  snapshot,
  onOpen,
}: {
  snapshot: DocksSnapshot;
  onOpen: (href: string) => void;
}) {
  const { dream, planksLaid, plankGoal, complete } = snapshot;
  const frac = plankGoal > 0 ? Math.min(1, planksLaid / plankGoal) : 0;

  // the vessel sails UP the depth toward the shore as planks accrue, shrinking
  // with distance; the shore glows brighter the nearer you are
  const vy = complete ? 792 : 1180 - frac * 372;
  const vx = 452 + frac * 96;
  const vs = complete ? 0.5 : 1 - frac * 0.46;
  const shoreGlow = complete ? 1 : 0.36 + frac * 0.5;

  return (
    <>
      <defs>
        <linearGradient id="dk2_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e1a34" />
          <stop offset="1" stopColor="#342c4a" />
        </linearGradient>
        <linearGradient id="dk2_sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2440" />
          <stop offset="1" stopColor="#141019" />
        </linearGradient>
        <radialGradient id="dk2_shore" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f0c878" />
          <stop offset="1" stopColor="#f0c878" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="1000" height="760" fill="url(#dk2_sky)" />
      <g fill="#f2e6c4" opacity="0.8">
        {STARS.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
      </g>

      {/* the sea */}
      <rect x="0" y="756" width="1000" height="744" fill="url(#dk2_sea)" />

      {/* the far shore — small, gold, on the horizon */}
      <ellipse cx="560" cy="756" rx="176" ry="36" fill="url(#dk2_shore)" opacity={shoreGlow} />
      <rect
        x="532"
        y="748"
        width="56"
        height="13"
        rx="6"
        fill="#f4d089"
        opacity={Math.min(1, shoreGlow + 0.25)}
      />
      {dream ? (
        <text
          x="560"
          y="722"
          textAnchor="middle"
          fontSize="17"
          letterSpacing="2"
          fill="#e8c886"
          fontFamily="Georgia, serif"
          fontStyle="italic"
          opacity={0.7 + frac * 0.3}
        >
          {dream.name}
        </text>
      ) : null}

      {/* slow swells across the depth */}
      <g stroke="#3a3450" strokeWidth="4" opacity="0.45" fill="none">
        <path d="M120 900 q60 -18 120 0 t120 0" />
        <path d="M620 1010 q60 -18 120 0 t120 0" />
        <path d="M300 1130 q60 -18 120 0 t120 0" />
      </g>

      {/* the vessel — a tap opens the shore; its place in the depth is the score */}
      <Hotspot
        label={
          dream
            ? complete
              ? `Open the shore — ${dream.name}, reached`
              : `Open the shore — toward ${dream.name}, ${planksLaid} of ${plankGoal} planks`
            : "Open the shore — name the Dream you sail toward"
        }
        onActivate={() => onOpen("/shore")}
        transform={`translate(${vx} ${vy}) scale(${vs})`}
      >
        <path d="M-74 42 Q0 72 74 42" stroke="#3a3450" strokeWidth="5" fill="none" opacity="0.4" />
        <path d="M-120 0 Q0 60 120 0 L92 44 Q0 68 -92 44 Z" fill="#2a2118" stroke="#4a3c28" strokeWidth="3" />
        <g stroke="#4a3c28" strokeWidth="2" opacity="0.5" fill="none">
          <path d="M-98 16 Q0 40 98 16" />
          <path d="M-86 31 Q0 51 86 31" />
        </g>
        <path d="M0 6 V-152" stroke="#3a2f22" strokeWidth="10" strokeLinecap="round" />
        <path d="M8 -148 Q72 -102 76 -54 L8 -54 Z" fill="#d8c39a" opacity="0.9" />
        <path d="M-8 -142 Q-56 -102 -52 -60 L-8 -60 Z" fill="#c2ad84" opacity="0.8" />
        <path d="M0 -152 l30 8 l-30 9 Z" fill="#c9754a" />
      </Hotspot>

      {/* the dock, underfoot */}
      <rect x="0" y="1348" width="1000" height="152" fill="#211a12" />
      <g stroke="#130d08" strokeWidth="6" opacity="0.55">
        <path d="M130 1348 V1500" />
        <path d="M370 1348 V1500" />
        <path d="M630 1348 V1500" />
        <path d="M870 1348 V1500" />
      </g>

      {/* the coffer — the trip fund, built to hold real money honestly LATER;
          dim and locked until COFFERS is real. Not yet interactive. */}
      <text
        x="164"
        y="1352"
        textAnchor="middle"
        fontSize="12"
        letterSpacing="2.5"
        fill="#7a6a50"
        fontFamily="ui-monospace, monospace"
      >
        THE COFFER · LATER
      </text>
      <g transform="translate(164 1416)" opacity="0.9">
        <rect x="-58" y="-46" width="116" height="76" rx="8" fill="#2a2018" stroke="#5a4a30" strokeWidth="4" />
        <path d="M-58 -18 H58" stroke="#5a4a30" strokeWidth="4" />
        <path d="M-24 -46 V30 M24 -46 V30" stroke="#5a4a30" strokeWidth="4" opacity="0.7" />
        <rect x="-15" y="-30" width="30" height="26" rx="4" fill="#3a2f1e" stroke="#7a6038" strokeWidth="3" />
        <circle cx="0" cy="-18" r="4" fill="#c9a86a" />
        <path d="M0 -18 V-9" stroke="#c9a86a" strokeWidth="3" />
      </g>
    </>
  );
}
