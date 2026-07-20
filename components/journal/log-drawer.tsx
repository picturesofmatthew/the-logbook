"use client";

import { useMemo, useState, useTransition } from "react";
import { logEntry } from "@/app/log/actions";
import { hallInfo } from "@/lib/halls";
import { EatGlyph, StarMark } from "@/components/glyphs";
import type { Meal, Specimen } from "@/lib/meals";
import { DonateFlow, type LogResult } from "./donate-flow";
import { RecipeBuilder } from "./recipe-builder";

const inputCls =
  "wobbly-sm border-2 border-ink/30 bg-cream px-3 py-2 outline-none focus:border-gold w-full";

export function LogDrawer({
  meal,
  day,
  donorName,
  specimens,
  recents,
  onClose,
  onLogged,
}: {
  meal: Meal;
  day: string;
  donorName: string;
  specimens: Specimen[];
  recents: Specimen[];
  onClose: () => void;
  onLogged: (result: LogResult) => void;
}) {
  const [mode, setMode] = useState<"pick" | "donate" | "dish">("pick");
  const [search, setSearch] = useState("");
  const [chosen, setChosen] = useState<Specimen | null>(null);
  const [servings, setServings] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return specimens;
    return specimens.filter((s) => s.name.toLowerCase().includes(q));
  }, [specimens, search]);

  const recentIds = new Set(recents.map((r) => r.id));

  function confirmLog() {
    if (!chosen) return;
    startTransition(async () => {
      const result = await logEntry({
        foodId: chosen.id,
        meal,
        servings,
        day,
      });
      if (result.error) {
        setError(result.error);
      } else {
        onLogged({
          message: `${chosen.icon} ${chosen.name} — logged to ${meal}.`,
        });
      }
    });
  }

  // The fast path: a recent specimen logs itself at one serving, one tap.
  function quickLog(s: Specimen) {
    startTransition(async () => {
      const result = await logEntry({ foodId: s.id, meal, servings: 1, day });
      if (result.error) {
        setError(result.error);
      } else {
        onLogged({ message: `${s.icon} ${s.name} — logged to ${meal}.` });
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/30"
      />
      <div className="relative max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border-2 border-b-0 border-ink/20 bg-paper p-5 shadow-card">
        {mode === "donate" ? (
          <DonateFlow
            meal={meal}
            day={day}
            donorName={donorName}
            onDone={onLogged}
            onBack={() => setMode("pick")}
          />
        ) : mode === "dish" ? (
          <RecipeBuilder
            meal={meal}
            day={day}
            donorName={donorName}
            specimens={specimens}
            onDone={onLogged}
            onBack={() => setMode("pick")}
          />
        ) : chosen ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-pixel text-sm tracking-wide">
                {chosen.icon} {chosen.name.toUpperCase()}
              </h3>
              <button
                type="button"
                onClick={() => setChosen(null)}
                className="cursor-pointer text-sm text-ink-soft underline decoration-dotted"
              >
                back
              </button>
            </div>
            <p className="text-sm text-ink-soft">
              {chosen.servingLabel} · {Math.round(chosen.calories)} kcal · P
              {chosen.proteinG} C{chosen.carbsG} F{chosen.fatG}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setServings(Math.max(0.5, servings - 0.5))}
                className="wobbly-sm h-11 w-11 cursor-pointer border-2 border-ink/30 bg-cream text-xl"
              >
                −
              </button>
              <div className="text-center">
                <span className="block font-pixel text-2xl">{servings}</span>
                <span className="block text-xs text-ink-soft">
                  {Math.round(chosen.calories * servings)} kcal
                </span>
              </div>
              <button
                type="button"
                onClick={() => setServings(Math.min(20, servings + 0.5))}
                className="wobbly-sm h-11 w-11 cursor-pointer border-2 border-ink/30 bg-cream text-xl"
              >
                +
              </button>
            </div>
            {error ? (
              <p className="text-center font-pixel text-xs text-terracotta">
                {error}
              </p>
            ) : null}
            <button
              type="button"
              disabled={pending}
              onClick={confirmLog}
              className="wobbly cursor-pointer bg-moss-deep py-2.5 text-lg text-cream shadow-card transition-all active:translate-y-0.5 active:shadow-pressed disabled:opacity-60"
            >
              {pending ? "logging..." : `log to ${meal}`}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-pixel text-sm tracking-wide">
                ADD TO {meal.toUpperCase()}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer text-sm text-ink-soft underline decoration-dotted"
              >
                close
              </button>
            </div>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search the pantry..."
              className={inputCls}
            />

            {recents.length > 0 && !search ? (
              <>
                <p className="font-pixel text-[10px] tracking-wide text-ink-soft">
                  RECENT · one tap logs one serving
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {recents.slice(0, 8).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      disabled={pending}
                      onClick={() => quickLog(s)}
                      className="wobbly-sm cursor-pointer border-2 border-ink/20 bg-cream p-1.5 text-center hover:border-gold disabled:opacity-60"
                    >
                      <span className="block text-xl">{s.icon}</span>
                      <span className="block truncate text-[10px] leading-tight">
                        {s.estimated ? (
                          <span className="text-terracotta">~</span>
                        ) : null}
                        {s.name}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-ink-soft/80">
                  need a different amount? find it in the collection below.
                </p>
              </>
            ) : null}

            {error ? (
              <p className="text-center font-pixel text-xs text-terracotta">
                {error}
              </p>
            ) : null}

            <p className="font-pixel text-[10px] tracking-wide text-ink-soft">
              {search ? "MATCHES" : "THE WHOLE COLLECTION"}
            </p>
            {filtered.length === 0 ? (
              <p className="py-2 text-center text-sm text-ink-soft">
                {specimens.length === 0
                  ? "The pantry is empty. Donate its first specimen!"
                  : "Nothing in the collection matches."}
              </p>
            ) : (
              <ul className="flex max-h-56 flex-col gap-1.5 overflow-y-auto">
                {filtered.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setChosen(s);
                        setServings(1);
                      }}
                      className="wobbly-sm flex w-full cursor-pointer items-center gap-2 border-2 border-ink/20 bg-cream px-3 py-1.5 text-left hover:border-gold"
                    >
                      <span className="text-lg">{s.icon}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">
                          {s.estimated ? (
                            <span className="text-terracotta" title="an estimate">
                              ~{" "}
                            </span>
                          ) : null}
                          {s.name}
                        </span>
                        <span className="block text-[11px] text-ink-soft">
                          {hallInfo(s.hall).label}
                          {recentIds.has(s.id) ? " · recent" : ""}
                        </span>
                      </span>
                      <span className="font-pixel text-xs text-ink-soft">
                        {Math.round(s.calories)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              onClick={() => setMode("donate")}
              className="wobbly-sm flex items-center justify-center gap-1.5 cursor-pointer border-2 border-dashed border-ink/30 bg-transparent px-3 py-2 text-ink-soft hover:border-gold"
            >
              <StarMark size={14} /> donate a new specimen
            </button>
            {specimens.filter((s) => !s.isRecipe).length >= 2 ? (
              <button
                type="button"
                onClick={() => setMode("dish")}
                className="wobbly-sm flex items-center justify-center gap-1.5 cursor-pointer border-2 border-dashed border-ink/30 bg-transparent px-3 py-2 text-ink-soft hover:border-gold"
              >
                <EatGlyph size={14} /> assemble a dish
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
