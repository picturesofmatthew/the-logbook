// The vessel, built plank by plank — and its grandeur scales with the gravity
// of the Dream. A small goal earns a humble dory; a season-long one (≈90 planks,
// three months) earns a grand tall ship. The finished ship shows as a faint
// blueprint from day one; as planks accrue the parts rig on in build order —
// hull, deck, bowsprit, figurehead, masts, yards, sails, then the flag. Pure and
// data-driven, drawn in a local ~160×120 box (masts reach to y≈16, keel to
// y≈116); the parent positions and scales it. Shared by the Glade (ambient,
// small) and the far-shore focus view (large).

import type { BoatState } from "@/lib/engine/boat";

export type VesselClass = "dory" | "sloop" | "tallship";

// Gravity → class. Thresholds are tunable; a ~90-plank season is a tall ship.
export function vesselClass(plankGoal: number): VesselClass {
  if (plankGoal <= 21) return "dory";
  if (plankGoal <= 55) return "sloop";
  return "tallship";
}

const HULL =
  "M 30 90 C 22 94 25 105 35 107 C 72 117 112 113 142 99 L 137 91 C 118 94 66 94 44 91 Z";
const FAUNA = "var(--glade-fauna)";
const HULL_KEEL = 106;
const HULL_DECK = 91;
const STRAKES = 8;

// A square sail hung from a yard, bellied toward the bow (the wind astern).
function sail(
  x1: number,
  x2: number,
  yTop: number,
  yBot: number,
  belly = 3,
) {
  const midY = (yTop + yBot) / 2;
  return `M ${x1} ${yTop} L ${x2} ${yTop} Q ${x2 + belly} ${midY} ${x2 - 1} ${yBot} L ${x1 + 1} ${yBot} Q ${x1 + belly} ${midY} ${x1} ${yTop} Z`;
}

export function Vessel({
  boat,
  idSuffix,
}: {
  boat: BoatState;
  idSuffix: string;
}) {
  const cls = vesselClass(boat.plankGoal);
  const p = boat.complete ? 1 : boat.planksLaid / Math.max(1, boat.plankGoal);
  const has = (t: number) => p >= t;
  const clipId = `hull-${idSuffix}`;

  const masts = cls === "dory" ? 0 : cls === "sloop" ? 1 : 3;
  const goldTrim = boat.goldenCount > 0;

  // The hull fills keel-up over the first ~30% of the build; the rest of the
  // planks raise the masts, spars, and canvas.
  const strakesLaid = Math.round(Math.min(1, p / 0.3) * STRAKES);
  const strakeH = (HULL_KEEL - HULL_DECK) / STRAKES;

  return (
    <g aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <path d={HULL} />
        </clipPath>
      </defs>

      {/* the finished vessel, a faint blueprint of what you're building toward */}
      <g
        fill="none"
        stroke={FAUNA}
        strokeWidth="0.7"
        strokeDasharray="1.5 2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.38"
      >
        <path d={HULL} />
        {masts >= 1 ? <line x1="84" y1="90" x2="84" y2="18" /> : null}
        {masts >= 1 ? <line x1="60" y1="46" x2="108" y2="46" /> : null}
        {masts === 3 ? <line x1="116" y1="89" x2="116" y2="30" /> : null}
        {masts === 3 ? <line x1="52" y1="91" x2="52" y2="34" /> : null}
      </g>

      {/* the hull, planked keel-up (a gold wale if any golden days are aboard) */}
      <g clipPath={`url(#${clipId})`}>
        {Array.from({ length: STRAKES }, (_, i) => {
          if (i >= strakesLaid) return null;
          const wale = goldTrim && i === strakesLaid - 1 && strakesLaid === STRAKES;
          const y = HULL_KEEL - (i + 1) * strakeH;
          return (
            <rect
              key={i}
              x="18"
              y={y + 0.2}
              width="128"
              height={Math.max(0.7, strakeH - 0.35)}
              fill={wale ? "var(--color-gold)" : FAUNA}
              opacity={wale ? 0.95 : 0.85}
            />
          );
        })}
      </g>

      {/* deck rail + a lantern-lit stern window, once the hull is whole */}
      {has(0.32) ? (
        <g stroke={FAUNA} strokeWidth="0.8" strokeLinecap="round">
          <line x1="42" y1="91" x2="132" y2="90" opacity="0.7" />
          {[52, 68, 84, 100, 116].map((x) => (
            <line key={x} x1={x} y1="90" x2={x} y2="87" opacity="0.6" />
          ))}
          <rect x="31" y="93" width="4" height="4" rx="0.6" fill="var(--color-gold)" opacity="0.5" stroke="none" />
        </g>
      ) : null}

      {/* bowsprit reaching from the bow, toward the far shore */}
      {has(0.35) ? (
        <line x1="140" y1="93" x2="164" y2="83" stroke={FAUNA} strokeWidth="1.4" strokeLinecap="round" />
      ) : null}

      {/* the figurehead — a carved prow, a later flourish of a grand ship */}
      {masts === 3 && has(0.62) ? (
        <path
          d="M 141 97 q 6 -1 8 -5 q -1 5 -4 7 z"
          fill={FAUNA}
        />
      ) : null}

      {/* masts, raised in turn */}
      <g stroke={FAUNA} strokeWidth="1.8" strokeLinecap="round">
        {masts >= 1 && has(0.4) ? <line x1="84" y1="90" x2="84" y2="18" /> : null}
        {masts === 3 && has(0.48) ? <line x1="116" y1="89" x2="116" y2="30" /> : null}
        {masts === 3 && has(0.55) ? <line x1="52" y1="91" x2="52" y2="34" /> : null}
      </g>

      {/* yards — the cross-spars the canvas hangs from */}
      {has(0.6) ? (
        <g stroke={FAUNA} strokeWidth="1.2" strokeLinecap="round">
          {masts >= 1 ? <line x1="62" y1="66" x2="106" y2="66" /> : null}
          {masts >= 1 ? <line x1="68" y1="44" x2="100" y2="44" /> : null}
          {masts === 3 ? <line x1="100" y1="52" x2="132" y2="52" /> : null}
          {masts === 3 ? <line x1="38" y1="54" x2="66" y2="54" /> : null}
        </g>
      ) : null}

      {/* the canvas, unfurling mast by mast */}
      <g fill="var(--color-cream)" stroke={FAUNA} strokeWidth="0.6" opacity="0.94">
        {masts >= 1 && has(0.66) ? <path d={sail(64, 104, 66, 87)} /> : null}
        {masts >= 1 && has(0.72) ? <path d={sail(70, 98, 44, 63)} /> : null}
        {masts === 3 && has(0.78) ? <path d={sail(101, 131, 52, 72, 2.4)} /> : null}
        {masts === 3 && has(0.84) ? <path d={sail(39, 65, 54, 73, 2.4)} /> : null}
        {/* the jib, off the bowsprit */}
        {has(0.8) ? (
          <path d="M 140 92 L 162 84 L 141 66 Z" opacity="0.9" />
        ) : null}
      </g>

      {/* the pennant at the mainmast head — the last flourish */}
      {masts >= 1 && has(0.94) ? (
        <path
          d="M 84 19 L 102 22 L 84 25 Z"
          fill="var(--color-terracotta)"
          opacity="0.92"
        />
      ) : null}
    </g>
  );
}
