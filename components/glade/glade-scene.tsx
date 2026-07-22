// The Glade, painted in code — the Oga structure in one SVG: a wash ground,
// big silhouette bands, then a few crisp details. Light states ride the
// --glade-* CSS variables, so this same scene is morning paper, amber hour,
// and lantern night. Generated placeholder art: Matthew's masters replace
// layers one-for-one later.

import type { BeingId } from "@/lib/engine/beings";
import type { GladeTier } from "@/lib/engine/glade";

export type BeingStages = Record<BeingId, number>;

const WICK_SPOTS = [
  { x: 120, y: 96 },
  { x: 210, y: 104 },
  { x: 252, y: 88 },
  { x: 96, y: 110 },
  { x: 286, y: 102 },
  { x: 176, y: 84 },
  { x: 60, y: 92 },
];
const MOSSLING_SPOTS = [
  { x: 116, y: 128 },
  { x: 236, y: 134 },
  { x: 66, y: 131 },
  { x: 200, y: 127 },
];
const TUFT_SPOTS = [
  30, 58, 92, 128, 168, 205, 238, 262, 292, 322, 344, 14,
];
const BLOOM_SPOTS = [
  { x: 46, y: 136, c: "var(--color-gold)" },
  { x: 142, y: 131, c: "var(--color-terracotta-soft)" },
  { x: 222, y: 138, c: "var(--color-gold)" },
  { x: 274, y: 130, c: "var(--color-terracotta-soft)" },
  { x: 106, y: 139, c: "var(--color-gold)" },
  { x: 330, y: 136, c: "var(--color-violet-bright)" },
  { x: 186, y: 140, c: "var(--color-violet-bright)" },
];
const STAR_SPOTS = [
  { x: 40, y: 22 },
  { x: 96, y: 14 },
  { x: 150, y: 28 },
  { x: 208, y: 12 },
  { x: 262, y: 24 },
  { x: 316, y: 16 },
  { x: 340, y: 34 },
];

const DEWDROP_SPOTS = [
  { x: 64, y: 120 },
  { x: 93, y: 121 },
  { x: 78, y: 117 },
];
const INKLING_SPOTS = [
  { x: 321, y: 117 },
  { x: 339, y: 112 },
];
const EMBERLING_SPOTS = [
  { x: 216, y: 128 },
  { x: 220, y: 126 },
  { x: 224, y: 128 },
];

const TIER_COUNTS: Record<
  GladeTier,
  {
    tufts: number;
    blooms: number;
    wicks: number;
    mosslings: number;
    dewdrops: number;
  }
> = {
  hushed: { tufts: 3, blooms: 0, wicks: 1, mosslings: 1, dewdrops: 0 },
  waking: { tufts: 5, blooms: 1, wicks: 2, mosslings: 2, dewdrops: 1 },
  green: { tufts: 8, blooms: 3, wicks: 3, mosslings: 3, dewdrops: 2 },
  flourishing: { tufts: 10, blooms: 5, wicks: 5, mosslings: 4, dewdrops: 2 },
  radiant: { tufts: 12, blooms: 7, wicks: 7, mosslings: 4, dewdrops: 3 },
};

function Tuft({ x }: { x: number }) {
  // Upright blades in a small clump — grass, not chevrons.
  return (
    <g
      fill="none"
      stroke="var(--color-moss-deep)"
      strokeWidth="1.1"
      strokeLinecap="round"
      opacity="0.7"
    >
      <path d={`M ${x - 2} 147 q -0.5 -4 -1.5 -7`} />
      <path d={`M ${x} 147 q 0 -5 0.4 -9`} />
      <path d={`M ${x + 2} 147 q 0.5 -4 1.5 -6.5`} />
    </g>
  );
}

// A keeper's lantern, standing in the glade. Unlit until that keeper logs
// today, then its flame catches and it pools colored light — soft green for
// Matthew (moss), brilliant auburn for Kennedy (ember). Both lit = the ring
// closes and the world warms.
function KeeperLantern({
  x,
  lit,
  color,
}: {
  x: number;
  lit: boolean;
  color: string;
}) {
  const gid = `kl-${x}`;
  return (
    <g transform={`translate(${x} 132)`} aria-hidden="true">
      {lit ? (
        <>
          <defs>
            <radialGradient id={gid}>
              <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.8" />
              <stop offset="40%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* a soft, warm-cored glow — reads as lantern light, not a flat disc,
              and the gold heart keeps Matthew's moss light legible on green */}
          <circle className="glade-dark-only" cx="0" cy="-11" r="24" fill={`url(#${gid})`} opacity="0.7" />
          <circle cx="0" cy="-11" r="14" fill={`url(#${gid})`} />
        </>
      ) : null}
      <line x1="0" y1="-5" x2="0" y2="7" stroke="var(--glade-fauna)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M -3 -19 h6" stroke="var(--glade-fauna)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="0" y1="-19" x2="0" y2="-16" stroke="var(--glade-fauna)" strokeWidth="1.2" />
      <rect
        x="-3.5"
        y="-16"
        width="7"
        height="10"
        rx="2.5"
        fill={lit ? color : "var(--color-cream)"}
        stroke="var(--glade-fauna)"
        strokeWidth="1.4"
      />
      <ellipse
        className={lit ? "lantern-breathe" : undefined}
        cx="0"
        cy="-11"
        rx="1.3"
        ry="2.3"
        fill={lit ? color : "color-mix(in srgb, var(--glade-fauna) 28%, transparent)"}
      />
    </g>
  );
}

// The Stag at the tree line — silhouette-first, dignified, utterly still.
// Exported for the arrival ceremony, which frames the same silhouette.
export function Stag({ stage }: { stage: number }) {
  if (stage < 1) return null;
  const c = "var(--glade-fauna)";
  return (
    <g transform="translate(296 84) scale(0.95)" aria-label="the Stag">
      {/* legs */}
      <g stroke={c} strokeWidth="2.2" strokeLinecap="round">
        <line x1="-9" y1="18" x2="-10" y2="34" />
        <line x1="-4" y1="19" x2="-4" y2="34" />
        <line x1="7" y1="19" x2="6" y2="34" />
        <line x1="11" y1="18" x2="13" y2="34" />
      </g>
      {/* body and neck */}
      <ellipse cx="0" cy="13" rx="14" ry="7" fill={c} />
      <path d="M 10 10 Q 16 2 18 -6 L 22 -5 Q 19 4 14 12 Z" fill={c} />
      {/* head */}
      <ellipse cx="21" cy="-7" rx="4.5" ry="3.2" fill={c} />
      <line x1="25" y1="-6" x2="27" y2="-4" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
      {/* antlers — young oak branches */}
      <g stroke={c} strokeWidth="1.7" strokeLinecap="round" fill="none">
        <path d="M 20 -10 Q 18 -20 13 -25" />
        <path d="M 18 -16 Q 14 -18 11 -17" />
        <path d="M 22 -10 Q 24 -20 29 -24" />
        <path d="M 24 -16 Q 28 -19 31 -18" />
      </g>
      {/* trust: gold leaf-buds, then one violet bloom */}
      {stage >= 2 ? (
        <g fill="var(--color-gold)">
          <circle cx="13" cy="-25" r="1.6" />
          <circle cx="29" cy="-24" r="1.6" />
          <circle cx="11" cy="-17" r="1.3" />
        </g>
      ) : null}
      {stage >= 3 ? (
        <circle cx="31" cy="-18" r="2" fill="var(--color-violet-bright)" />
      ) : null}
    </g>
  );
}

// The Heron at its pool — pale in every light, one leg, perfectly patient.
// Exported for the arrival ceremony, which frames the same silhouette.
export function Heron({ stage }: { stage: number }) {
  if (stage < 1) return null;
  const c = "var(--color-glow)";
  return (
    <g transform="translate(78 96)" aria-label="the Heron">
      {stage >= 3 ? (
        <ellipse
          cx="2"
          cy="27"
          rx="14"
          ry="3.5"
          fill="none"
          stroke="var(--color-violet)"
          strokeWidth="1"
          opacity="0.6"
        />
      ) : null}
      {/* one leg into the water */}
      <line x1="2" y1="12" x2="2" y2="27" stroke={c} strokeWidth="1.6" />
      {/* body */}
      <ellipse cx="0" cy="8" rx="7.5" ry="4.8" fill={c} transform="rotate(-12 0 8)" />
      {/* S-neck and head */}
      <path
        d="M 5 4 Q 12 2 11 -6 Q 10 -11 6 -11"
        fill="none"
        stroke={c}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="6" cy="-11" r="2.4" fill={c} />
      <line x1="4" y1="-11" x2="-2" y2="-9.5" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
      {/* the ink eye */}
      <circle cx="6.6" cy="-11.4" r="0.7" fill="var(--glade-fauna)" />
    </g>
  );
}

// ── The second wave and the deep wood ──
// Same recipe as the Stag and Heron: silhouette-first, one color, trust
// stages adding gold then violet. Each group is a swappable layer.

// The Tortoise on the moss bank — a garden riding a patient dome.
export function Tortoise({ stage }: { stage: number }) {
  if (stage < 1) return null;
  const c = "var(--glade-fauna)";
  return (
    <g transform="translate(118 133)" aria-label="the Tortoise">
      <path d="M -8 3 Q -8 -5 0 -5 Q 8 -5 8 3 Z" fill={c} />
      <rect x="-9.5" y="2" width="19" height="2.4" rx="1.2" fill={c} />
      <ellipse cx="10.5" cy="1.6" rx="2.6" ry="2" fill={c} />
      {/* the shell-garden deepens with trust */}
      <path
        d="M -3 -5 q 0 -3 1.5 -4 M 2 -5 q 1 -2.5 3 -3"
        fill="none"
        stroke="var(--color-moss-deep)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {stage >= 2 ? (
        <g fill="var(--color-gold)">
          <circle cx="-1.5" cy="-9.5" r="1.2" />
          <circle cx="5" cy="-8.5" r="1" />
        </g>
      ) : null}
      {stage >= 3 ? (
        <circle cx="2" cy="-11" r="1.5" fill="var(--color-violet-bright)" />
      ) : null}
    </g>
  );
}

// The Moth at the lantern — night-only in the scene; a portrait shows it
// in any light.
export function Moth({ stage, portrait }: { stage: number; portrait?: boolean }) {
  if (stage < 1) return null;
  const c = "var(--color-glow)";
  return (
    <g className={portrait ? undefined : "glade-dark-only"} aria-label="the Moth">
      <g
        className="moth-flutter"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        transform="translate(172 99)"
      >
        <ellipse cx="0" cy="0" rx="1.2" ry="2.6" fill={c} />
        <path d="M -1 -1 Q -6 -4 -6.5 0 Q -6 3 -1 1 Z" fill={c} opacity="0.85" />
        <path d="M 1 -1 Q 6 -4 6.5 0 Q 6 3 1 1 Z" fill={c} opacity="0.85" />
        {stage >= 2 ? (
          <g fill="var(--color-gold)" opacity="0.9">
            <circle cx="-4" cy="0" r="0.6" />
            <circle cx="4" cy="0" r="0.6" />
          </g>
        ) : null}
        {stage >= 3 ? (
          <circle cx="0" cy="-2.8" r="0.8" fill="var(--color-violet-bright)" />
        ) : null}
      </g>
    </g>
  );
}

// The Crow at the dark edge — a watcher with a lantern eye.
export function Crow({ stage, portrait }: { stage: number; portrait?: boolean }) {
  if (stage < 1) return null;
  const c = "var(--glade-fauna)";
  return (
    <g transform="translate(26 66)" aria-label="the Crow">
      <ellipse cx="0" cy="0" rx="5" ry="3.4" fill={c} transform="rotate(-8)" />
      <path d="M 3 -2 Q 6 -5 5 -7 Q 8 -6 8 -3 Z" fill={c} />
      <path d="M -4 1 L -10 3.5 L -4 3 Z" fill={c} />
      <line x1="-1" y1="3" x2="-1" y2="6" stroke={c} strokeWidth="1.1" />
      <line x1="2" y1="3" x2="2" y2="6" stroke={c} strokeWidth="1.1" />
      {/* the lantern eye, lit after dark */}
      <circle
        className={portrait ? undefined : "glade-dark-only"}
        cx="5.6"
        cy="-4.6"
        r="0.8"
        fill="var(--color-gold)"
      />
      {stage >= 2 ? (
        <circle cx="-2" cy="-2" r="0.9" fill="var(--color-gold)" opacity="0.8" />
      ) : null}
      {stage >= 3 ? (
        <circle cx="1" cy="-3.4" r="1" fill="var(--color-violet-bright)" opacity="0.9" />
      ) : null}
    </g>
  );
}

// The Hare in the meadow grass — ears first, always listening.
export function Hare({ stage }: { stage: number }) {
  if (stage < 1) return null;
  const c = "var(--glade-fauna)";
  return (
    <g transform="translate(256 131)" aria-label="the Hare">
      <ellipse cx="0" cy="0" rx="5.5" ry="4" fill={c} />
      <circle cx="5.5" cy="-3.5" r="2.8" fill={c} />
      <path d="M 4.5 -6 Q 3.5 -13 5.5 -14 Q 7 -12 6.5 -6 Z" fill={c} />
      <path d="M 7 -6 Q 8 -12 10 -12.5 Q 10.5 -10 8.8 -5.5 Z" fill={c} />
      <circle cx="-4.5" cy="-2" r="1.6" fill={c} />
      {stage >= 2 ? (
        <circle cx="5.5" cy="-14.5" r="1" fill="var(--color-gold)" />
      ) : null}
      {stage >= 3 ? (
        <circle cx="10" cy="-13" r="1.2" fill="var(--color-violet-bright)" />
      ) : null}
    </g>
  );
}

// The Salamander in the firepit — the anti-guilt being, warm-bellied.
export function Salamander({ stage }: { stage: number }) {
  if (stage < 1) return null;
  const c = "var(--glade-fauna)";
  return (
    <g transform="translate(224 129)" aria-label="the Salamander">
      <path
        d="M -6 2 Q -2 -1 2 1 Q 6 3 9 1"
        fill="none"
        stroke={c}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="-7" cy="1.5" r="1.9" fill={c} />
      <circle className="glade-dark-only lantern-breathe" cx="0" cy="0.6" r="1" fill="var(--color-gold)" />
      {stage >= 2 ? (
        <g fill="var(--color-gold)" opacity="0.9">
          <circle cx="3" cy="1.4" r="0.7" />
          <circle cx="6" cy="1.6" r="0.7" />
        </g>
      ) : null}
      {stage >= 3 ? (
        <circle cx="9.5" cy="0.6" r="0.9" fill="var(--color-violet-bright)" />
      ) : null}
    </g>
  );
}

// The Owl at the book-stand — the night reader.
export function Owl({ stage, portrait }: { stage: number; portrait?: boolean }) {
  if (stage < 1) return null;
  const c = "var(--glade-fauna)";
  return (
    <g transform="translate(330 116)" aria-label="the Owl">
      <ellipse cx="0" cy="0" rx="4.2" ry="5.2" fill={c} />
      <path d="M -3.4 -4 L -4.6 -7 L -1.8 -5.2 Z" fill={c} />
      <path d="M 3.4 -4 L 4.6 -7 L 1.8 -5.2 Z" fill={c} />
      {/* eyes catch the lantern after dark */}
      <g className={portrait ? undefined : "glade-dark-only"} fill="var(--color-gold)">
        <circle cx="-1.6" cy="-2.2" r="0.9" />
        <circle cx="1.6" cy="-2.2" r="0.9" />
      </g>
      {stage >= 2 ? (
        <path
          d="M -2.5 2 q 2.5 1.6 5 0"
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.9"
        />
      ) : null}
      {stage >= 3 ? (
        <circle cx="0" cy="-6.8" r="1" fill="var(--color-violet-bright)" />
      ) : null}
    </g>
  );
}

// The Koi in the pool — violet-flecked luck, drifting.
export function Koi({ stage }: { stage: number }) {
  if (stage < 1) return null;
  const c = "var(--color-glow)";
  return (
    <g aria-label="the Koi">
      <g
        className="koi-drift"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        transform="translate(90 124)"
      >
        <path d="M -4 0 Q 0 -2.2 4 0 Q 0 2.2 -4 0 Z" fill={c} opacity="0.9" />
        <path d="M 4 0 L 6.5 -1.6 L 6.5 1.6 Z" fill={c} opacity="0.8" />
        <circle cx="-1" cy="-0.4" r="0.7" fill="var(--color-violet-bright)" />
        {stage >= 2 ? (
          <circle cx="1.5" cy="0.4" r="0.6" fill="var(--color-violet-bright)" opacity="0.8" />
        ) : null}
      </g>
    </g>
  );
}

// The Pale Elk — never a resident, only a glimpse at the far tree line:
// moon-pale, moss-hung antlers, footsteps that bloom where it stood.
export function PaleElk() {
  const c = "var(--color-glow)";
  return (
    <g transform="translate(44 80)" opacity="0.55" aria-label="the Pale Elk">
      <g stroke={c} strokeWidth="1.8" strokeLinecap="round">
        <line x1="-7" y1="12" x2="-8" y2="26" />
        <line x1="-2" y1="13" x2="-2" y2="26" />
        <line x1="6" y1="13" x2="5" y2="26" />
        <line x1="9" y1="12" x2="11" y2="26" />
      </g>
      <ellipse cx="0" cy="8" rx="11.5" ry="5.5" fill={c} />
      <path d="M 8 6 Q 13 0 14 -7 L 17 -6 Q 15 1 11 8 Z" fill={c} />
      <ellipse cx="16.5" cy="-7.5" rx="3.6" ry="2.6" fill={c} />
      <g stroke={c} strokeWidth="1.4" strokeLinecap="round" fill="none">
        <path d="M 15 -10 Q 12 -22 5 -27" />
        <path d="M 12 -17 Q 8 -20 4 -19" />
        <path d="M 17 -10 Q 20 -22 27 -26" />
        <path d="M 20 -17 Q 25 -20 28 -19" />
        <path d="M 9 -22 Q 6 -24 3 -23" />
      </g>
      {/* moss hangs from the crown */}
      <g stroke="var(--color-moss)" strokeWidth="1" strokeLinecap="round" opacity="0.9">
        <line x1="5" y1="-27" x2="4.5" y2="-23" />
        <line x1="27" y1="-26" x2="26.5" y2="-22" />
      </g>
      {/* footsteps bloom and fade behind it */}
      <g fill="var(--color-gold)" opacity="0.7">
        <circle cx="-14" cy="27" r="1" />
        <circle cx="-20" cy="28" r="0.8" />
        <circle cx="-26" cy="27.5" r="0.6" />
      </g>
    </g>
  );
}

export function GladeScene({
  tier,
  beings,
  paleElk,
  inklings,
  hearthDay,
  skyless,
  mossLit,
  emberLit,
}: {
  tier: GladeTier;
  beings: BeingStages;
  paleElk: boolean;
  // How many keepers inscribed today's page — inklings gather at the book.
  inklings: number;
  // A hearth-chord or feast-seal day — emberlings pop from the firepit.
  hearthDay: boolean;
  // Drop the scene's own sky wash so it sits transparently on a page that
  // already paints the sky (the glade home) — no seam where the two meet.
  skyless?: boolean;
  // Whether each keeper has logged today — lights their lantern in the glade
  // (Matthew = moss green, Kennedy = ember auburn).
  mossLit?: boolean;
  emberLit?: boolean;
}) {
  const counts = TIER_COUNTS[tier];
  const poolExists = beings.heron >= 1;
  // A kept half — solo or joint — kindles the firepit: showing up warms the
  // glade that day, even alone. Fuller when both keep it. (The boat still needs
  // both; the fire is the personal, ambient reward for one.)
  const anyLit = !!mossLit || !!emberLit;
  const bothLit = !!mossLit && !!emberLit;

  return (
    <svg
      viewBox="0 0 360 150"
      className="block h-auto w-full"
      role="img"
      aria-label={`The Glade, ${tier}`}
    >
      <defs>
        <linearGradient id="glade-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--glade-sky-top)" />
          <stop offset="1" stopColor="var(--glade-sky-bottom)" />
        </linearGradient>
        <linearGradient id="glade-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--glade-ground-top)" />
          <stop offset="1" stopColor="var(--glade-ground-bottom)" />
        </linearGradient>
        <filter id="glade-mist">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* wash */}
      {skyless ? null : <rect width="360" height="150" fill="url(#glade-sky)" />}

      {/* stars keep to the night */}
      <g className="glade-night-only" fill="var(--color-glow)">
        {STAR_SPOTS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={i % 3 === 0 ? 1.2 : 0.8} opacity="0.8" />
        ))}
      </g>

      {/* far canopy band — big soft shapes, no detail */}
      <g fill="var(--color-moss-deep)" opacity="0.85">
        <ellipse cx="24" cy="92" rx="52" ry="34" />
        <ellipse cx="96" cy="98" rx="46" ry="26" />
        <ellipse cx="180" cy="94" rx="54" ry="30" />
        <ellipse cx="262" cy="98" rx="44" ry="25" />
        <ellipse cx="336" cy="90" rx="52" ry="34" />
        <rect y="100" width="360" height="18" />
      </g>

      {/* hushed mist — winter, not ruin */}
      {tier === "hushed" ? (
        <rect
          y="78"
          width="360"
          height="34"
          fill="var(--glade-sky-top)"
          opacity="0.35"
          filter="url(#glade-mist)"
        />
      ) : null}

      {/* ground with a gentle rise */}
      <path d="M 0 116 Q 180 102 360 116 L 360 150 L 0 150 Z" fill="url(#glade-ground)" />

      {/* the pool arrives with the Heron */}
      {poolExists ? (
        <g>
          <ellipse cx="80" cy="124" rx="30" ry="7.5" fill="var(--color-moss-deep)" opacity="0.9" />
          <ellipse cx="80" cy="123" rx="22" ry="4.5" fill="var(--glade-sky-top)" opacity="0.3" />
        </g>
      ) : null}

      {/* undergrowth and blooms, by vitality */}
      {TUFT_SPOTS.slice(0, counts.tufts).map((x) => (
        <Tuft key={x} x={x} />
      ))}
      {BLOOM_SPOTS.slice(0, counts.blooms).map((b, i) => (
        <g key={i}>
          <circle cx={b.x} cy={b.y} r="1.7" fill={b.c} />
          <line
            x1={b.x}
            y1={b.y + 2}
            x2={b.x}
            y2={b.y + 5}
            stroke="var(--color-moss-deep)"
            strokeWidth="1"
          />
        </g>
      ))}

      {/* the firepit — a ring of stones. Dormant it only embers after dark;
          the moment a keeper keeps their half it kindles into a living fire
          (day and night), rising fuller when both keep it. */}
      <g>
        <ellipse cx="218" cy="133" rx="7.5" ry="3" fill="none" stroke="var(--glade-fauna)" strokeWidth="1" opacity="0.45" />
        <circle cx="212" cy="133" r="1.4" fill="var(--glade-fauna)" opacity="0.85" />
        <circle cx="218" cy="134.4" r="1.5" fill="var(--glade-fauna)" opacity="0.85" />
        <circle cx="224" cy="133" r="1.4" fill="var(--glade-fauna)" opacity="0.85" />
        {anyLit ? (
          <g aria-hidden>
            <defs>
              <radialGradient id="firelight-pool">
                <stop offset="0%" stopColor="var(--color-gold)" stopOpacity={bothLit ? "0.8" : "0.5"} />
                <stop offset="50%" stopColor="var(--color-terracotta)" stopOpacity="0.22" />
                <stop offset="100%" stopColor="var(--color-terracotta)" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* warm light pooling from the pit — visible in daylight too, so a
                solo log warms the world, not only after dark */}
            <circle className="lantern-breathe" cx="218" cy="129" r={bothLit ? "28" : "20"} fill="url(#firelight-pool)" />
            {/* the flames rising from the coals */}
            <path className="lantern-breathe" d="M 218 133 Q 211 125 218 117 Q 225 125 218 133 Z" fill="var(--color-terracotta)" opacity="0.92" />
            <path className="lantern-breathe" d="M 218 133 Q 214.5 127 218 121 Q 221.5 127 218 133 Z" fill="var(--color-gold)" />
            {bothLit ? (
              <path className="lantern-breathe" d="M 224 133 Q 221 128 224 123 Q 227 128 224 133 Z" fill="var(--color-terracotta)" opacity="0.85" />
            ) : null}
          </g>
        ) : (
          <circle className="glade-dark-only lantern-breathe" cx="218" cy="131.5" r="2.2" fill="var(--color-gold)" />
        )}
      </g>

      {/* the crook'd lantern post */}
      <g>
        <path
          d="M 152 146 L 152 108 Q 152 98 162 97"
          fill="none"
          stroke="var(--glade-fauna)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <line x1="162" y1="97" x2="162" y2="103" stroke="var(--glade-fauna)" strokeWidth="1.4" />
        <circle className="glade-dark-only" cx="162" cy="109" r="11" fill="var(--color-gold)" opacity="0.28" />
        <rect x="158" y="103" width="8" height="11" rx="2" fill="none" stroke="var(--glade-fauna)" strokeWidth="1.8" />
        <rect className="glade-dark-only lantern-breathe" x="160" y="105.5" width="4" height="6" rx="1" fill="var(--color-gold)" />
        <rect className="glade-day-only" x="160" y="105.5" width="4" height="6" rx="1" fill="var(--color-gold-soft)" />
      </g>

      {/* the book-stand, waiting */}
      <g stroke="var(--glade-fauna)" strokeWidth="2" strokeLinecap="round">
        <line x1="330" y1="146" x2="330" y2="128" />
        <line x1="322" y1="129" x2="338" y2="125" />
        <line x1="322" y1="126" x2="338" y2="122" strokeWidth="1.2" />
      </g>

      {/* the keepers' lanterns — lit by who has logged today */}
      <KeeperLantern x={104} lit={!!mossLit} color="var(--color-moss)" />
      <KeeperLantern x={256} lit={!!emberLit} color="var(--color-terracotta)" />

      {/* beings, each in its zone */}
      {paleElk ? <PaleElk /> : null}
      <Crow stage={beings.crow} />
      <Stag stage={beings.stag} />
      <Heron stage={beings.heron} />
      <Tortoise stage={beings.tortoise} />
      <Hare stage={beings.hare} />
      <Salamander stage={beings.salamander} />
      <Owl stage={beings.owl} />
      {poolExists ? <Koi stage={beings.koi} /> : null}
      <Moth stage={beings.moth} />

      {/* the small folk */}
      <g className="glade-dark-only">
        {WICK_SPOTS.slice(0, counts.wicks).map((w, i) => (
          <circle
            key={i}
            className="wick-flicker"
            style={{ animationDelay: `${(i % 3) * -1.1}s` }}
            cx={w.x}
            cy={w.y}
            r="2"
            fill="var(--color-glow)"
          />
        ))}
      </g>
      <g className="glade-day-only">
        {MOSSLING_SPOTS.slice(0, counts.mosslings).map((m, i) => (
          <g
            key={i}
            className="mossling-tilt"
            style={{
              transformBox: "fill-box",
              transformOrigin: "center bottom",
              animationDelay: `${(i % 2) * -2.2}s`,
            }}
          >
            <circle cx={m.x} cy={m.y} r="2.2" fill="var(--color-moss-deep)" />
            <circle cx={m.x} cy={m.y - 2.4} r="1" fill="var(--color-moss)" />
          </g>
        ))}
      </g>

      {/* dewdrops — pool spirits at dusk, only once the Heron's pool exists */}
      {poolExists ? (
        <g className="glade-dusk-only">
          {DEWDROP_SPOTS.slice(0, counts.dewdrops).map((d, i) => (
            <g
              key={i}
              className="lantern-breathe"
              style={{ animationDelay: `${(i % 3) * -1.6}s` }}
            >
              <circle cx={d.x} cy={d.y} r="1.3" fill="var(--color-glow)" />
              <circle
                cx={d.x}
                cy={d.y + 1.5}
                r="2.6"
                fill="none"
                stroke="var(--color-glow)"
                strokeWidth="0.5"
                opacity="0.5"
              />
            </g>
          ))}
        </g>
      ) : null}

      {/* inklings — ink-drop spirits with paper wings, hopping at the book
          for each keeper who inscribed today's page */}
      {INKLING_SPOTS.slice(0, Math.max(0, Math.min(inklings, 2))).map(
        (s, i) => (
          <g
            key={i}
            className="inkling-hop"
            style={{
              transformBox: "fill-box",
              transformOrigin: "center bottom",
              animationDelay: `${i * -1.7}s`,
            }}
          >
            <path
              d={`M ${s.x} ${s.y} q -1 -2.6 0 -3.4 q 1 0.8 0 3.4`}
              fill="var(--glade-fauna)"
            />
            <path
              d={`M ${s.x - 0.6} ${s.y - 2.2} q -2.4 -1.4 -3 0.2`}
              fill="none"
              stroke="var(--color-glow)"
              strokeWidth="0.7"
              strokeLinecap="round"
            />
            <path
              d={`M ${s.x + 0.6} ${s.y - 2.2} q 2.4 -1.4 3 0.2`}
              fill="none"
              stroke="var(--color-glow)"
              strokeWidth="0.7"
              strokeLinecap="round"
            />
          </g>
        ),
      )}

      {/* emberlings — hearth sparks on feast and hearth days */}
      {hearthDay ? (
        <g>
          {EMBERLING_SPOTS.map((e, i) => (
            <circle
              key={i}
              className="emberling-drift"
              style={{ animationDelay: `${i * -0.9}s` }}
              cx={e.x}
              cy={e.y}
              r={i === 1 ? 1.1 : 0.8}
              fill="var(--color-gold)"
            />
          ))}
        </g>
      ) : null}
    </svg>
  );
}
