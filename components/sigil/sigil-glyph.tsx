// The sigil, drawn. Pure SVG from a SigilSpec — placeholder geometry that the
// real parts library (Matthew's masters, clean SVG strokes) will replace
// shape-for-shape. Colors ride the light-script tokens, so a sigil is paper
// ink by day and cream ink at night; violet only ever arrives with union.

import type { SigilSpec } from "@/lib/engine/sigil";
import type { SplitFamily } from "@/lib/engine/training";
import type { Hall } from "@/lib/halls";

const R_RING = 44;

const WEIGHTS = { lean: 2.5, even: 3.5, feast: 5, open: 1.5 } as const;

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

// One small mark per hall, placed on the ring at `deg`.
function Radical({ hall, deg }: { hall: Hall; deg: number }) {
  const p = polar(60, 60, 54, deg);
  const q = polar(60, 60, 59, deg);
  const stroke = "var(--color-ink-soft)";
  switch (hall) {
    case "protein": // anchor bar
      return (
        <g stroke={stroke} strokeWidth="1.5" strokeLinecap="round">
          <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} />
          <circle cx={q.x} cy={q.y} r="1.3" fill={stroke} stroke="none" />
        </g>
      );
    case "produce": // leaf curl
      return (
        <path
          d={`M ${p.x} ${p.y} q 3 -4 6 -1`}
          fill="none"
          stroke="var(--color-moss)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      );
    case "grains": // sheaf ticks
      return (
        <g stroke={stroke} strokeWidth="1.2" strokeLinecap="round">
          <line x1={p.x - 1.5} y1={p.y} x2={q.x - 1.5} y2={q.y} />
          <line x1={p.x + 1.5} y1={p.y} x2={q.x + 1.5} y2={q.y} />
        </g>
      );
    case "dairy": // crescent
      return (
        <path
          d={`M ${p.x - 2} ${p.y} a 3 3 0 1 0 4 -2`}
          fill="none"
          stroke={stroke}
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      );
    case "sweets": // spark
      return (
        <g stroke="var(--color-gold)" strokeWidth="1.3" strokeLinecap="round">
          <line x1={p.x - 2.4} y1={p.y} x2={p.x + 2.4} y2={p.y} />
          <line x1={p.x} y1={p.y - 2.4} x2={p.x} y2={p.y + 2.4} />
        </g>
      );
    case "drinks": // wave
      return (
        <path
          d={`M ${p.x - 3} ${p.y} q 1.5 -2.5 3 0 t 3 0`}
          fill="none"
          stroke={stroke}
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      );
    case "dishes": // knot
      return (
        <circle
          cx={p.x}
          cy={p.y}
          r="2.4"
          fill="none"
          stroke={stroke}
          strokeWidth="1.3"
        />
      );
  }
}

// The cardinal ornament for a split family, placed outside the ring.
function Ornament({ family, deg }: { family: SplitFamily; deg: number }) {
  const p = polar(60, 60, 51, deg);
  const stroke = "var(--color-ink)";
  const g = { stroke, strokeWidth: 1.6, strokeLinecap: "round" as const };
  switch (family) {
    case "push": // twin pillars
      return (
        <g {...g}>
          <line x1={p.x - 2} y1={p.y - 4} x2={p.x - 2} y2={p.y + 4} />
          <line x1={p.x + 2} y1={p.y - 4} x2={p.x + 2} y2={p.y + 4} />
        </g>
      );
    case "pull": // hooks
      return (
        <g {...g} fill="none">
          <path d={`M ${p.x - 3} ${p.y - 4} q -2 4 2 6`} />
          <path d={`M ${p.x + 3} ${p.y - 4} q 2 4 -2 6`} />
        </g>
      );
    case "legs": // roots
      return (
        <g {...g}>
          <line x1={p.x} y1={p.y - 4} x2={p.x} y2={p.y + 1} />
          <line x1={p.x} y1={p.y + 1} x2={p.x - 3} y2={p.y + 5} />
          <line x1={p.x} y1={p.y + 1} x2={p.x + 3} y2={p.y + 5} />
        </g>
      );
    case "full": // the square
      return (
        <rect
          x={p.x - 3.5}
          y={p.y - 3.5}
          width="7"
          height="7"
          fill="none"
          {...g}
        />
      );
    case "cardio": // wind spiral
      return (
        <path
          d={`M ${p.x - 4} ${p.y} a 4 4 0 1 1 4 4 a 2 2 0 1 1 -2 -2`}
          fill="none"
          {...g}
        />
      );
    case "mobility": // still curve
      return (
        <path d={`M ${p.x - 4} ${p.y + 2} q 4 -6 8 0`} fill="none" {...g} />
      );
    case "rest": // still horizon
      return (
        <line x1={p.x - 4} y1={p.y} x2={p.x + 4} y2={p.y} {...g} />
      );
  }
}

export function SigilGlyph({
  spec,
  size = 96,
  bloom = false,
}: {
  spec: SigilSpec;
  size?: number;
  bloom?: boolean;
}) {
  const jitter = (spec.seed % 9) - 4;
  const violet = spec.tier === "legendary" || spec.tier === "resonant";

  // Radicals live between the cardinals; ornaments claim N (and S if two).
  const radicalSlots = [40, 75, 110, 250, 285, 320];
  const ornamentSlots = [0, 180];

  // Left half is moss (Matthew), right half is ember (Kennedy). An un-inked
  // half waits as a faint dashed arc.
  const half = (inked: boolean, weight: keyof typeof WEIGHTS, flip: boolean) => (
    <path
      d={
        flip
          ? `M 60 ${60 - R_RING} A ${R_RING} ${R_RING} 0 0 1 60 ${60 + R_RING}`
          : `M 60 ${60 - R_RING} A ${R_RING} ${R_RING} 0 0 0 60 ${60 + R_RING}`
      }
      fill="none"
      stroke={flip ? "var(--color-terracotta)" : "var(--color-moss)"}
      strokeWidth={WEIGHTS[inked ? weight : "open"]}
      strokeLinecap="round"
      strokeDasharray={inked ? undefined : "4 6"}
      opacity={inked ? 1 : 0.35}
    />
  );

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role="img"
      aria-label={
        spec.completed
          ? `The day's seal, ${spec.tier}`
          : "The day's seal, still open"
      }
    >
      <g transform={`rotate(${jitter} 60 60)`}>
        {/* guide ring */}
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="0.75"
          opacity="0.18"
        />

        {/* the two halves: moss is Matthew, ember is Kennedy */}
        {half(spec.moss.inked, spec.moss.weight, false)}
        {half(spec.ember.inked, spec.ember.weight, true)}

        {/* union's color arrives only when the ring closes */}
        {spec.completed ? (
          <g className={bloom ? "seal-bloom" : undefined}>
            {/* union's color arrives — bloomed brighter on today's close */}
            {bloom ? (
              <circle
                cx="60"
                cy="60"
                r="36"
                fill="none"
                stroke="var(--color-violet-bright)"
                strokeWidth="3.5"
                opacity="0.25"
              />
            ) : null}
            <circle
              cx="60"
              cy="60"
              r="36"
              fill="none"
              stroke={
                violet ? "var(--color-violet-bright)" : "var(--color-violet)"
              }
              strokeWidth={violet ? 1.8 : 1.4}
              opacity={violet ? 0.95 : 0.78}
            />
          </g>
        ) : null}

        {/* core by tier */}
        {spec.tier === "common" ? (
          <circle cx="60" cy="60" r="2.5" fill="var(--color-ink)" />
        ) : null}
        {spec.tier === "fine" ? (
          <rect
            x="56.5"
            y="56.5"
            width="7"
            height="7"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="1.5"
            transform="rotate(45 60 60)"
          />
        ) : null}
        {spec.tier === "resonant" ? (
          <g stroke="var(--color-violet-bright)" strokeWidth="1.4" strokeLinecap="round">
            <line x1="60" y1="52" x2="60" y2="68" />
            <line x1="52" y1="60" x2="68" y2="60" />
          </g>
        ) : null}
        {spec.tier === "legendary" ? (
          <g>
            <circle
              cx="60"
              cy="60"
              r="28"
              fill="none"
              stroke="var(--color-violet-bright)"
              strokeWidth="1.6"
            />
            <g
              stroke="var(--color-violet-bright)"
              strokeWidth="1.4"
              strokeLinecap="round"
            >
              {[45, 135, 225, 315].map((d) => {
                const a = polar(60, 60, 20, d);
                const b = polar(60, 60, 26, d);
                return <line key={d} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
              })}
              <line x1="60" y1="53" x2="60" y2="67" />
              <line x1="53" y1="60" x2="67" y2="60" />
            </g>
          </g>
        ) : null}

        {/* radicals from what was eaten */}
        {spec.radicals.map((hall, i) => (
          <Radical
            key={hall}
            hall={hall}
            deg={radicalSlots[i % radicalSlots.length]}
          />
        ))}

        {/* cardinal ornaments from how you moved */}
        {spec.ornaments.slice(0, 2).map((family, i) => (
          <Ornament key={family} family={family} deg={ornamentSlots[i]} />
        ))}

        {/* a New Mark: the star at the apex */}
        {spec.newMark ? (
          <g
            stroke="var(--color-gold)"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <line x1="60" y1="2" x2="60" y2="10" />
            <line x1="56" y1="6" x2="64" y2="6" />
          </g>
        ) : null}
      </g>
    </svg>
  );
}
