import { MoodFace } from "@/components/glyphs";
import { totalOf } from "@/lib/engine/totals";
import type { JournalEntry, Target } from "@/lib/meals";
import { MacroBars } from "./macro-bars";

// The partner's day, at a glance — read-only, beneath your own full ledger.
// Their macros, their mood, their one line; never the crammed meal column.
export function PartnerGlance({
  displayName,
  entries,
  target,
  mood,
  note,
}: {
  displayName: string;
  entries: JournalEntry[];
  target: Target;
  mood?: string | null;
  note?: string | null;
}) {
  const total = totalOf(
    entries.map((e) => ({ ...e.food, servings: e.servings })),
  );
  const hasLogged = entries.length > 0;

  return (
    <section className="wobbly-sm flex flex-col gap-2.5 border-2 border-dashed border-ink/25 bg-cream/50 p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-xs tracking-wide text-ink-soft">
          {displayName.toUpperCase()}
        </h2>
        {mood ? (
          <MoodFace mood={mood} size={18} className="text-ink-soft" />
        ) : null}
      </div>

      {hasLogged ? (
        <>
          <MacroBars total={total} target={target} />
          {note ? (
            <p className="text-[11px] italic leading-snug text-ink-soft">
              &ldquo;{note}&rdquo;
            </p>
          ) : null}
        </>
      ) : (
        <p className="text-xs italic text-ink-soft/70">
          still an open page today
        </p>
      )}
    </section>
  );
}
