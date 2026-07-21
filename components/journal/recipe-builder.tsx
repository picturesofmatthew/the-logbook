"use client";

import { useMemo, useState, useTransition } from "react";
import { createRecipe } from "@/app/log/actions";
import type { Meal, Specimen } from "@/lib/meals";
import type { LogResult } from "./donate-flow";

const inputCls =
  "wobbly-sm border-2 border-ink/30 bg-cream px-3 py-2 outline-none focus:border-gold w-full";
const labelCls = "font-display text-[10px] tracking-wide text-ink-soft";

type Item = { specimen: Specimen; servings: number };

export function RecipeBuilder({
  meal,
  day,
  donorName,
  specimens,
  onDone,
  onBack,
}: {
  meal: Meal;
  day: string;
  donorName: string;
  specimens: Specimen[];
  onDone: (result: LogResult) => void;
  onBack: () => void;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [servings, setServings] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const available = useMemo(() => {
    const chosen = new Set(items.map((i) => i.specimen.id));
    const q = search.trim().toLowerCase();
    return specimens.filter(
      (s) =>
        !s.isRecipe &&
        !chosen.has(s.id) &&
        (!q || s.name.toLowerCase().includes(q)),
    );
  }, [specimens, items, search]);

  const sum = items.reduce(
    (acc, i) => ({
      calories: acc.calories + i.specimen.calories * i.servings,
      proteinG: acc.proteinG + i.specimen.proteinG * i.servings,
      carbsG: acc.carbsG + i.specimen.carbsG * i.servings,
      fatG: acc.fatG + i.specimen.fatG * i.servings,
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 },
  );

  function adjust(id: number, delta: number) {
    setItems((prev) =>
      prev
        .map((i) =>
          i.specimen.id === id
            ? { ...i, servings: Math.max(0, i.servings + delta) }
            : i,
        )
        .filter((i) => i.servings > 0),
    );
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      const result = await createRecipe({
        name,
        icon,
        servingLabel: "1 serving",
        items: items.map((i) => ({
          foodId: i.specimen.id,
          servings: i.servings,
        })),
        logAs: { meal, servings, day },
      });
      if (result.error) {
        setError(result.error);
      } else {
        onDone({
          message: `🍲 ${name} assembled and logged.`,
          ceremony: {
            icon: icon || "🍲",
            name,
            hallLabel: "Dish Gallery",
            donorName,
            servingLabel: "1 serving",
            calories: Math.round(sum.calories),
          },
        });
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm tracking-wide">ASSEMBLE A DISH</h3>
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer text-sm text-ink-soft underline decoration-dotted"
        >
          back
        </button>
      </div>

      {items.length > 0 ? (
        <ul className="flex flex-col gap-1">
          {items.map((i) => (
            <li
              key={i.specimen.id}
              className="wobbly-sm flex items-center gap-2 border-2 border-moss-deep/40 bg-cream px-2 py-1 text-sm"
            >
              <span>{i.specimen.icon}</span>
              <span className="min-w-0 flex-1 truncate">{i.specimen.name}</span>
              <button
                type="button"
                onClick={() => adjust(i.specimen.id, -0.5)}
                className="cursor-pointer px-1.5 text-lg leading-none"
              >
                −
              </button>
              <span className="w-8 text-center font-display text-xs">
                {i.servings}
              </span>
              <button
                type="button"
                onClick={() => adjust(i.specimen.id, 0.5)}
                className="cursor-pointer px-1.5 text-lg leading-none"
              >
                +
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-xs text-ink-soft">
          Tap specimens below to add them to the pot.
        </p>
      )}

      {items.length > 0 ? (
        <p className="text-center font-display text-[11px] text-ink-soft">
          {Math.round(sum.calories)} kcal · P{Math.round(sum.proteinG)} · C
          {Math.round(sum.carbsG)} · F{Math.round(sum.fatG)}
        </p>
      ) : null}

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Find an ingredient..."
        className={inputCls}
      />
      <ul className="flex max-h-40 flex-col gap-1 overflow-y-auto">
        {available.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() =>
                setItems((prev) => [...prev, { specimen: s, servings: 1 }])
              }
              className="wobbly-sm flex w-full cursor-pointer items-center gap-2 border-2 border-ink/20 bg-cream px-2 py-1 text-left text-sm hover:border-gold"
            >
              <span>{s.icon}</span>
              <span className="min-w-0 flex-1 truncate">{s.name}</span>
              <span className="font-display text-[10px] text-ink-soft">
                {Math.round(s.calories)}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-[1fr_5rem] gap-2">
        <label className="flex flex-col gap-1">
          <span className={labelCls}>DISH NAME</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Kennedy's chili"
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelCls}>EMOJI</span>
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="🍲"
            className={inputCls}
          />
        </label>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className={labelCls}>SERVINGS TO LOG</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setServings(Math.max(0.5, servings - 0.5))}
            className="wobbly-sm h-9 w-9 cursor-pointer border-2 border-ink/30 bg-cream text-lg"
          >
            −
          </button>
          <span className="w-10 text-center font-display">{servings}</span>
          <button
            type="button"
            onClick={() => setServings(Math.min(20, servings + 0.5))}
            className="wobbly-sm h-9 w-9 cursor-pointer border-2 border-ink/30 bg-cream text-lg"
          >
            +
          </button>
        </div>
      </div>

      {error ? (
        <p className="text-center font-display text-xs text-terracotta">{error}</p>
      ) : null}

      <button
        type="button"
        disabled={pending || items.length < 2 || name.trim().length < 2}
        onClick={submit}
        className="wobbly cursor-pointer bg-terracotta py-2.5 text-lg text-cream shadow-card transition-all active:translate-y-0.5 active:shadow-pressed disabled:opacity-60"
      >
        {pending ? "assembling..." : `donate dish & log to ${meal}`}
      </button>
    </div>
  );
}
