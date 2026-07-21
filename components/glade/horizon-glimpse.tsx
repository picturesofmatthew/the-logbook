// The horizon glimpse — the home's window onto the quest. The sea opens into the
// distance, the Dream's far shore glows on the horizon, and your vessel rides the
// water, small, sailing toward it. Ambient and inviting: tapping it travels to
// the far-shore focus view, where the ship is built in full. Given real estate on
// the home so the pull of the distant land is felt, without crowding the glade.

import type { BoatState } from "@/lib/engine/boat";
import { Vessel } from "./vessel";

export function HorizonGlimpse({
  boat,
  dreamName,
}: {
  boat: BoatState;
  dreamName: string;
}) {
  return (
    <svg
      viewBox="0 0 360 130"
      className="block h-auto w-full"
      role="img"
      aria-label={`The sea toward ${dreamName} — your vessel: ${boat.planksLaid} of ${boat.plankGoal} planks set.`}
    >
      <defs>
        <linearGradient id="glimpse-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-moss-deep)" stopOpacity="0.16" />
          <stop offset="1" stopColor="var(--color-moss-deep)" stopOpacity="0.30" />
        </linearGradient>
        <radialGradient id="glimpse-glow">
          <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.55" />
          <stop offset="55%" stopColor="var(--color-gold)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* the sea, opening from the horizon down toward us */}
      <rect x="0" y="46" width="360" height="84" fill="url(#glimpse-sea)" />
      <g stroke="var(--color-glow)" strokeWidth="0.6" strokeLinecap="round" opacity="0.3">
        <path d="M 40 66 q 12 -3 24 0 t 24 0" fill="none" />
        <path d="M 250 60 q 12 -3 24 0 t 24 0" fill="none" />
        <path d="M 150 92 q 10 -3 20 0 t 20 0" fill="none" />
        <path d="M 60 104 q 10 -3 20 0 t 20 0" fill="none" />
      </g>

      {/* the Dream's far shore — glowing on the horizon, up and to the right */}
      <ellipse
        className="lantern-breathe"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        cx="278"
        cy="42"
        rx="52"
        ry="22"
        fill="url(#glimpse-glow)"
      />
      <g fill="var(--glade-fauna)">
        <path d="M 246 50 Q 268 28 282 28 Q 298 28 320 50 Z" />
        <g stroke="var(--glade-fauna)" strokeWidth="1.5" strokeLinecap="round" fill="none">
          <path d="M 276 26 q -2 -8 -5 -13" />
          <path d="M 276 12 q -6 -1 -10 2 M 276 12 q 6 -1 10 2" />
          <path d="M 290 26 q 1 -7 3 -10" />
          <path d="M 293 15 q -5 -1 -8 1 M 293 15 q 5 0 8 2" />
        </g>
      </g>

      {/* your vessel, small on the water, sailing toward the shore */}
      <g transform="translate(36 34) scale(0.44)">
        <Vessel boat={boat} idSuffix="glimpse" />
      </g>
    </svg>
  );
}
