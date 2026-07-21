// The second beat of a completed day: the spell sets a plank into the boat, the
// vessel that will carry the two of you to the far shore. Rendered inside the
// seal and legendary ceremonies (a legendary day sets a golden plank). Purely
// presentational — the draw-on and the delayed rise live in CSS (.plank-beat /
// .plank-draw). Only shown when a Dream exists.

export function PlankBeat({
  dreamName,
  planksLaid,
  remaining,
  golden,
}: {
  dreamName?: string;
  planksLaid?: number | null;
  remaining?: number | null;
  golden?: boolean;
}) {
  if (!dreamName || planksLaid == null) return null;

  const tail =
    remaining == null
      ? ""
      : remaining <= 0
        ? " — the vessel is whole"
        : remaining === 1
          ? " — one plank from setting sail"
          : ` — ${remaining} planks to go`;

  return (
    <div className="plank-beat mt-3 flex flex-col items-center gap-1">
      <svg width="88" height="12" viewBox="0 0 88 12" aria-hidden="true">
        {/* the plank, setting itself into the hull in the same ink (gold if
            legendary/resonant) */}
        <rect
          className="plank-draw"
          x="8"
          y="4"
          width="72"
          height="3.6"
          rx="1.8"
          fill={golden ? "var(--color-gold)" : "var(--color-ink)"}
        />
      </svg>
      <p className="font-pixel text-[10px] tracking-wide text-ink-soft">
        {golden ? "a golden plank" : "a plank"} set into the boat{tail}
      </p>
    </div>
  );
}
