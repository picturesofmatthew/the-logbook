"use client";

import { useState, useTransition } from "react";
import { removeEntry } from "@/app/log/actions";
import { ceremonyChime, logChime } from "@/lib/sounds";
import { MealGlyph } from "@/components/glyphs";
import { totalOf } from "@/lib/engine/totals";
import { MEALS, type JournalEntry, type Meal, type Specimen, type Target } from "@/lib/meals";
import { Ceremony, type CeremonyData } from "./ceremony";
import type { LogResult } from "./donate-flow";
import { MacroBars } from "./macro-bars";
import { LogDrawer } from "./log-drawer";

export function OwnColumn({
  displayName,
  day,
  entries,
  target,
  specimens,
  recents,
}: {
  displayName: string;
  day: string;
  entries: JournalEntry[];
  target: Target;
  specimens: Specimen[];
  recents: Specimen[];
}) {
  const [drawerMeal, setDrawerMeal] = useState<Meal | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [ceremony, setCeremony] = useState<CeremonyData | null>(null);
  const [, startTransition] = useTransition();

  const total = totalOf(
    entries.map((e) => ({ ...e.food, servings: e.servings })),
  );

  function handleLogged(result: LogResult) {
    setDrawerMeal(null);
    if (result.ceremony) {
      ceremonyChime();
      setCeremony(result.ceremony);
    } else {
      logChime();
      setToast(result.message);
      setTimeout(() => setToast(null), 3500);
    }
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-pixel text-sm tracking-wide">
        {displayName.toUpperCase()}
      </h2>
      <MacroBars total={total} target={target} />

      {MEALS.map((m) => {
        const mealEntries = entries.filter((e) => e.meal === m.id);
        return (
          <div key={m.id} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-sm text-ink-soft">
                <MealGlyph meal={m.id} size={13} /> {m.label}
              </span>
              <button
                type="button"
                onClick={() => setDrawerMeal(m.id)}
                className="wobbly-sm cursor-pointer border-2 border-ink/20 bg-cream px-2 py-0.5 text-xs text-ink-soft hover:border-gold"
              >
                + add
              </button>
            </div>
            {mealEntries.length === 0 ? (
              <p className="pl-1 text-xs text-ink-soft/60">—</p>
            ) : (
              <ul className="flex flex-col gap-0.5">
                {mealEntries.map((e) => (
                  <li
                    key={e.id}
                    className="group flex items-center gap-1.5 pl-1 text-sm"
                  >
                    <span>{e.food.icon}</span>
                    <span className="min-w-0 flex-1 truncate">
                      {e.food.estimated ? (
                        <span className="text-terracotta" title="an estimate">
                          ~{" "}
                        </span>
                      ) : null}
                      {e.food.name}
                      {e.servings !== 1 ? (
                        <span className="text-ink-soft"> ×{e.servings}</span>
                      ) : null}
                    </span>
                    <span className="font-pixel text-[11px] text-ink-soft">
                      {Math.round(e.food.calories * e.servings)}
                    </span>
                    <button
                      type="button"
                      aria-label={`remove ${e.food.name}`}
                      onClick={() =>
                        startTransition(async () => {
                          await removeEntry(e.id);
                        })
                      }
                      className="cursor-pointer px-1 text-ink-soft/50 hover:text-terracotta"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}

      {toast ? (
        <div className="wobbly-sm fixed bottom-4 left-1/2 z-40 -translate-x-1/2 border-2 border-ink/20 bg-cream px-4 py-2 text-sm shadow-card">
          {toast}
        </div>
      ) : null}

      {drawerMeal ? (
        <LogDrawer
          meal={drawerMeal}
          day={day}
          donorName={displayName}
          specimens={specimens}
          recents={recents}
          onClose={() => setDrawerMeal(null)}
          onLogged={handleLogged}
        />
      ) : null}

      {ceremony ? (
        <Ceremony data={ceremony} onClose={() => setCeremony(null)} />
      ) : null}
    </section>
  );
}
