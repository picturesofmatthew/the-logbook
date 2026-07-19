// The Glade, painted in code — the Oga structure in one SVG: a wash ground,
// big silhouette bands, then a few crisp details. Light states ride the
// --glade-* CSS variables, so this same scene is morning paper, amber hour,
// and lantern night. Generated placeholder art: Matthew's masters replace
// layers one-for-one later.

import type { GladeTier } from "@/lib/engine/glade";

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

const TIER_COUNTS: Record<
  GladeTier,
  { tufts: number; blooms: number; wicks: number; mosslings: number }
> = {
  hushed: { tufts: 3, blooms: 0, wicks: 1, mosslings: 1 },
  waking: { tufts: 5, blooms: 1, wicks: 2, mosslings: 2 },
  green: { tufts: 8, blooms: 3, wicks: 3, mosslings: 3 },
  flourishing: { tufts: 10, blooms: 5, wicks: 5, mosslings: 4 },
  radiant: { tufts: 12, blooms: 7, wicks: 7, mosslings: 4 },
};

function Tuft({ x }: { x: number }) {
  return (
    <path
      d={`M ${x} 146 q -2 -6 -4 -9 M ${x} 146 q 0 -8 1 -10 M ${x} 146 q 2 -5 4 -8`}
      fill="none"
      stroke="var(--color-moss-deep)"
      strokeWidth="1.3"
      strokeLinecap="round"
      opacity="0.8"
    />
  );
}

// The Stag at the tree line — silhouette-first, dignified, utterly still.
function Stag({ stage }: { stage: number }) {
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
function Heron({ stage }: { stage: number }) {
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

export function GladeScene({
  tier,
  stagStage,
  heronStage,
}: {
  tier: GladeTier;
  stagStage: number;
  heronStage: number;
}) {
  const counts = TIER_COUNTS[tier];
  const poolExists = heronStage >= 1;

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
      <rect width="360" height="150" fill="url(#glade-sky)" />

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

      {/* the firepit, embered after dark */}
      <g>
        <circle cx="218" cy="132" r="1.8" fill="var(--glade-fauna)" />
        <circle cx="223" cy="133.5" r="1.6" fill="var(--glade-fauna)" />
        <circle cx="213.5" cy="133.5" r="1.5" fill="var(--glade-fauna)" />
        <circle className="glade-dark-only lantern-breathe" cx="218" cy="131" r="2.2" fill="var(--color-gold)" />
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

      {/* beings */}
      <Stag stage={stagStage} />
      <Heron stage={heronStage} />

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
    </svg>
  );
}
