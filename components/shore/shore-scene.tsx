// The far shore, in focus — reached by tapping the distance on the Glade. The
// boat you're building stands large in the foreground, the Dream's island glows
// across the sea. Pure and data-driven, in the Glade's idiom; the hull itself is
// the shared BoatHull the Glade draws small.

import { Vessel } from "@/components/glade/vessel";
import type { BoatState } from "@/lib/engine/boat";

export function ShoreScene({
  boat,
  dreamName,
}: {
  boat: BoatState;
  dreamName: string;
}) {
  return (
    <svg
      viewBox="0 0 360 200"
      className="block h-auto w-full"
      role="img"
      aria-label={`The boat to ${dreamName}: ${boat.planksLaid} of ${boat.plankGoal} planks set.`}
    >
      <defs>
        <linearGradient id="focus-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-moss-deep)" stopOpacity="0.10" />
          <stop offset="1" stopColor="var(--color-moss-deep)" stopOpacity="0.26" />
        </linearGradient>
        <radialGradient id="focus-shore-glow">
          <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.55" />
          <stop offset="55%" stopColor="var(--color-gold)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* the sea, filling the lower two-thirds */}
      <rect x="0" y="70" width="360" height="130" fill="url(#focus-sea)" />
      <g stroke="var(--color-glow)" strokeWidth="0.6" strokeLinecap="round" opacity="0.28">
        <path d="M 28 128 q 14 -3 28 0 t 28 0" fill="none" />
        <path d="M 236 96 q 14 -3 28 0 t 28 0" fill="none" />
        <path d="M 96 168 q 12 -3 24 0 t 24 0" fill="none" />
      </g>

      {/* the Dream's island — glowing on the far horizon, up and to the right */}
      <ellipse cx="308" cy="52" rx="60" ry="34" fill="url(#focus-shore-glow)" />
      <g fill="var(--glade-fauna)">
        <path d="M 272 66 Q 300 34 314 34 Q 330 34 352 66 Z" />
        <g stroke="var(--glade-fauna)" strokeWidth="1.8" strokeLinecap="round" fill="none">
          <path d="M 306 32 q -2 -12 -6 -19" />
          <path d="M 306 13 q -8 -2 -14 2 M 306 13 q 8 -2 14 2" />
          <path d="M 322 32 q 2 -10 4 -15" />
          <path d="M 326 17 q -7 -2 -11 1 M 326 17 q 7 0 11 3" />
        </g>
      </g>

      {/* the vessel you're building, large in the foreground */}
      <g transform="translate(12 6) scale(1.6)">
        <Vessel boat={boat} idSuffix="focus" />
      </g>
    </svg>
  );
}
