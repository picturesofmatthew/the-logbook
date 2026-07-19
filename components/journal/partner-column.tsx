import { totalOf } from "@/lib/engine/totals";
import { MEALS, type JournalEntry, type Target } from "@/lib/meals";
import { MacroBars } from "./macro-bars";

export function PartnerColumn({
  displayName,
  entries,
  target,
}: {
  displayName: string;
  entries: JournalEntry[];
  target: Target;
}) {
  const total = totalOf(
    entries.map((e) => ({ ...e.food, servings: e.servings })),
  );

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-pixel text-sm tracking-wide text-ink-soft">
        {displayName.toUpperCase()}
      </h2>
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
