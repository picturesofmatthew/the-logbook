"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { donateSpecimen } from "@/app/log/actions";
import { HALLS, hallInfo, type Hall } from "@/lib/halls";
import type { Meal } from "@/lib/meals";
import type { CeremonyData } from "./ceremony";
import { QuillRune } from "@/components/shell/rune-icons";

export type LogResult = { message: string; ceremony?: CeremonyData };

type SearchResult = {
  fdcId: number;
  name: string;
  brand: string | null;
  servingLabel: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

const inputCls =
  "wobbly-sm border-2 border-ink/30 bg-cream px-3 py-2 outline-none focus:border-gold w-full";
const labelCls = "font-pixel text-[10px] tracking-wide text-ink-soft";

export function DonateFlow({
  meal,
  day,
  donorName,
  onDone,
  onBack,
}: {
  meal: Meal;
  day: string;
  donorName: string;
  onDone: (result: LogResult) => void;
  onBack: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [drafting, setDrafting] = useState(false);

  // Draft card fields
  const [name, setName] = useState("");
  const [hall, setHall] = useState<Hall | "">("");
  const [icon, setIcon] = useState("");
  const [servingLabel, setServingLabel] = useState("");
  const [calories, setCalories] = useState("");
  const [proteinG, setProteinG] = useState("");
  const [carbsG, setCarbsG] = useState("");
  const [fatG, setFatG] = useState("");
  const [fdcId, setFdcId] = useState<number | null>(null);
  const [servings, setServings] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, []);

  function handleQueryChange(value: string) {
    setQuery(value);
    if (debounce.current) clearTimeout(debounce.current);
    const q = value.trim();
    if (q.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    debounce.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/food-search?q=${encodeURIComponent(q)}`);
        const data = (await res.json()) as {
          results: SearchResult[];
          error?: string;
        };
        setResults(data.results);
        setSearchError(data.error ?? null);
      } catch {
        setSearchError("The field guide is unreachable right now.");
      } finally {
        setSearching(false);
      }
    }, 450);
  }

  function pickResult(r: SearchResult) {
    setName(r.brand ? `${r.name} (${r.brand})` : r.name);
    setServingLabel(r.servingLabel);
    setCalories(String(r.calories));
    setProteinG(String(r.proteinG));
    setCarbsG(String(r.carbsG));
    setFatG(String(r.fatG));
    setFdcId(r.fdcId);
    setDrafting(true);
  }

  function startManual() {
    setFdcId(null);
    setDrafting(true);
  }

  function submit() {
    if (!hall) {
      setError("Pick a hall for the pantry.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await donateSpecimen({
        name,
        hall,
        icon: icon || HALLS.find((h) => h.id === hall)?.emoji || "🍽",
        servingLabel,
        calories: Number(calories),
        proteinG: Number(proteinG) || 0,
        carbsG: Number(carbsG) || 0,
        fatG: Number(fatG) || 0,
        fdcId,
        logAs: { meal, servings, day },
      });
      if (result.error) {
        setError(result.error);
      } else if (result.alreadyKnown) {
        onDone({ message: `Already in the pantry — logged it for ${meal}.` });
      } else {
        onDone({
          message: `✦ New specimen donated: ${name}`,
          ceremony: {
            icon: icon || (hall ? hallInfo(hall).emoji : "🍽"),
            name,
            hallLabel: hall ? hallInfo(hall).label : "",
            donorName,
            servingLabel,
            calories: Number(calories) || 0,
          },
        });
      }
    });
  }

  if (!drafting) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-pixel text-sm tracking-wide">NEW SPECIMEN</h3>
          <button
            type="button"
            onClick={onBack}
            className="cursor-pointer text-sm text-ink-soft underline decoration-dotted"
          >
            back
          </button>
        </div>
        <input
          autoFocus
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search the field guide (USDA)..."
          className={inputCls}
        />
        {searching ? (
          <p className="text-center text-sm text-ink-soft">leafing through...</p>
        ) : null}
        {searchError ? (
          <p className="text-center text-sm text-terracotta">{searchError}</p>
        ) : null}
        <ul className="flex max-h-64 flex-col gap-1.5 overflow-y-auto">
          {results.map((r) => (
            <li key={r.fdcId}>
              <button
                type="button"
                onClick={() => pickResult(r)}
                className="wobbly-sm w-full cursor-pointer border-2 border-ink/20 bg-cream px-3 py-2 text-left hover:border-gold"
              >
                <span className="block truncate">{r.name}</span>
                <span className="block text-xs text-ink-soft">
                  {r.brand ? `${r.brand} · ` : ""}
                  {r.servingLabel} · {r.calories} kcal · P{r.proteinG} C
                  {r.carbsG} F{r.fatG}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={startManual}
          className="wobbly-sm flex items-center justify-center gap-1.5 cursor-pointer border-2 border-dashed border-ink/30 bg-transparent px-3 py-2 text-ink-soft hover:border-gold"
        >
          <QuillRune size={14} /> write it in by hand
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-pixel text-sm tracking-wide">SPECIMEN CARD</h3>
        <button
          type="button"
          onClick={() => setDrafting(false)}
          className="cursor-pointer text-sm text-ink-soft underline decoration-dotted"
        >
          back
        </button>
      </div>

      <label className="flex flex-col gap-1">
        <span className={labelCls}>NAME</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className={labelCls}>SERVING</span>
          <input
            value={servingLabel}
            onChange={(e) => setServingLabel(e.target.value)}
            placeholder="1 cup"
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelCls}>EMOJI (OPTIONAL)</span>
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder={hall ? HALLS.find((h) => h.id === hall)?.emoji : "🍽"}
            className={inputCls}
          />
        </label>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {(
          [
            ["KCAL", calories, setCalories],
            ["P (G)", proteinG, setProteinG],
            ["C (G)", carbsG, setCarbsG],
            ["F (G)", fatG, setFatG],
          ] as const
        ).map(([label, value, set]) => (
          <label key={label} className="flex flex-col gap-1">
            <span className={labelCls}>{label}</span>
            <input
              type="number"
              inputMode="decimal"
              value={value}
              onChange={(e) => set(e.target.value)}
              className={inputCls}
            />
          </label>
        ))}
      </div>

      <fieldset className="flex flex-col gap-1">
        <legend className={labelCls}>HALL</legend>
        <div className="grid grid-cols-2 gap-1.5">
          {HALLS.map((h) => (
            <label key={h.id} className="cursor-pointer">
              <input
                type="radio"
                name="hall"
                checked={hall === h.id}
                onChange={() => setHall(h.id)}
                className="peer sr-only"
              />
              <span className="wobbly-sm block border-2 border-ink/20 bg-cream px-2 py-1.5 text-sm peer-checked:border-moss-deep peer-checked:bg-moss peer-checked:text-cream">
                {h.emoji} {h.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex items-center justify-between gap-3">
        <span className={labelCls}>SERVINGS</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setServings(Math.max(0.5, servings - 0.5))}
            className="wobbly-sm h-9 w-9 cursor-pointer border-2 border-ink/30 bg-cream text-lg"
          >
            −
          </button>
          <span className="w-10 text-center font-pixel">{servings}</span>
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
        <p className="text-center font-pixel text-xs text-terracotta">{error}</p>
      ) : null}

      <button
        type="button"
        disabled={pending}
        onClick={submit}
        className="wobbly cursor-pointer bg-terracotta py-2.5 text-lg text-cream shadow-card transition-all active:translate-y-0.5 active:shadow-pressed disabled:opacity-60"
      >
        {pending ? "donating..." : `donate & log to ${meal}`}
      </button>
    </div>
  );
}
