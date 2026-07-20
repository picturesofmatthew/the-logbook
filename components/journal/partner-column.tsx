import { MoodFace } from "@/components/glyphs";
import { totalOf } from "@/lib/engine/totals";
import { MEALS, type JournalEntry, type Target } from "@/lib/meals";
import { MacroBars } from "./macro-bars";

export function PartnerColumn({
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
    <section className="flex flex-col gap-3">
      <h2 className="font-pixel text-sm tracking-wide text-ink-soft">
        {displayName.toUpperCase()}
      </h2>
      {hasLogged && (mood || note) ? (
        <div className="flex items-start gap-1.5 text-ink-soft">
          {mood ? (
            <span className="shrink-0 pt-0.5">
              <MoodFace mood={mood} size={18} />
            </span>
          ) : null}
          {note ? (
            <span className="text-[11px] italic leading-snug">
              &ldquo;{note}&rdquo;
            </span>
          ) : null}
        </div>
      ) : null}
      <MacroBars total={total} target={target} />

      {MEALS.map((m) => {
        const mealEntries = entries.filter((e) => e.meal === m.id);
        return (
          <div key={m.id} className="flex flex-col gap-1">
            <span className="text-sm text-ink-soft">
              {m.emoji} {m.label}
            </span>
            {mealEntries.length === 0 ? (
              <p className="pl-1 text-xs text-ink-soft/60">—</p>
            ) : (
              <ul className="flex flex-col gap-0.5">
                {mealEntries.map((e) => (
                  <li key={e.id} className="flex items-center gap-1.5 pl-1 text-sm">
                    <span>{e.food.icon}</span>
                    <span className="min-w-0 flex-1 truncate">
                      {e.food.name}
                      {e.servings !== 1 ? (
                        <span className="text-ink-soft"> ×{e.servings}</span>
                      ) : null}
                    </span>
                    <span className="font-pixel text-[11px] text-ink-soft">
                      {Math.round(e.food.calories * e.servings)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </section>
  );
}
