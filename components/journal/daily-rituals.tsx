"use client";

import { useState, useTransition } from "react";
import { saveNote, saveWeighIn, setTraining, setWater } from "@/app/day/actions";
import type { DayMetaRow } from "@/lib/data";

const MOODS = ["😊", "😌", "😤", "🥱", "🥲"];
const labelCls = "font-pixel text-[10px] tracking-wide text-ink-soft";

export function DailyRituals({
  day,
  meta,
  weighInLb,
}: {
  day: string;
  meta: DayMetaRow;
  weighInLb: number | null;
}) {
  const [weight, setWeight] = useState(
    weighInLb != null ? String(weighInLb) : "",
  );
  const [weightSaved, setWeightSaved] = useState(weighInLb != null);
  const [note, setNote] = useState(meta.note ?? "");
  const [mood, setMood] = useState(meta.mood ?? "");
  const [noteSaved, setNoteSaved] = useState(meta.note != null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function run(fn: () => Promise<{ error?: string }>) {
    startTransition(async () => {
      const result = await fn();
      setError(result.error ?? null);
    });
  }

  return (
    <section className="wobbly flex flex-col gap-4 border-2 border-ink/20 bg-cream/70 p-4 shadow-card">
      <h2 className="font-pixel text-sm tracking-wide">DAILY RITUALS</h2>

      <div className="flex items-center justify-between gap-3">
        <span className={labelCls}>MORNING WEIGH-IN</span>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            min={60}
            max={600}
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              setWeightSaved(false);
            }}
            placeholder="lb"
            className="wobbly-sm w-20 border-2 border-ink/30 bg-cream px-2 py-1 text-right outline-none focus:border-gold"
          />
          <button
            type="button"
            disabled={weightSaved || !weight}
            onClick={() =>
              run(async () => {
                const r = await saveWeighIn({
                  day,
                  weightLb: Number(weight),
                });
                if (!r.error) setWeightSaved(true);
                return r;
              })
            }
            className="wobbly-sm cursor-pointer border-2 border-moss-deep bg-moss px-2 py-1 text-sm text-cream disabled:border-ink/20 disabled:bg-paper-deep disabled:text-ink-soft"
          >
            {weightSaved ? "✓" : "save"}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className={labelCls}>WATER</span>
        <div className="flex gap-1">
          {Array.from({ length: 8 }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${i + 1} cups`}
              onClick={() =>
                run(() =>
                  setWater({
                    day,
                    cups: meta.waterCups === i + 1 ? i : i + 1,
                  }),
                )
              }
              className={`cursor-pointer text-lg transition-transform active:scale-125 ${
                i < meta.waterCups ? "" : "opacity-25 grayscale"
              }`}
            >
              💧
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className={labelCls}>TRAINING</span>
        <div className="flex gap-1.5">
          {(
            [
              ["lift", "🏋 lift"],
              ["cardio", "👟 cardio"],
              ["rest", "🛏 rest"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() =>
                run(() =>
                  setTraining({
                    day,
                    training: meta.training === id ? null : id,
                  }),
                )
              }
              className={`wobbly-sm cursor-pointer border-2 px-2 py-1 text-xs transition-all ${
                meta.training === id
                  ? "border-moss-deep bg-moss text-cream"
                  : "border-ink/20 bg-cream text-ink-soft"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className={labelCls}>A LINE FOR THE JOURNAL</span>
        <div className="flex gap-1">
          {MOODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMood(mood === m ? "" : m);
                setNoteSaved(false);
              }}
              className={`cursor-pointer text-lg transition-transform active:scale-125 ${
                mood === m ? "" : "opacity-30 grayscale"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <input
            value={note}
            maxLength={240}
            onChange={(e) => {
              setNote(e.target.value);
              setNoteSaved(false);
            }}
            placeholder="how did today feel?"
            className="wobbly-sm min-w-0 flex-1 border-2 border-ink/30 bg-cream px-2 py-1 text-sm outline-none focus:border-gold"
          />
          <button
            type="button"
            disabled={noteSaved}
            onClick={() =>
              run(async () => {
                const r = await saveNote({ day, note, mood });
                if (!r.error) setNoteSaved(true);
                return r;
              })
            }
            className="wobbly-sm cursor-pointer border-2 border-moss-deep bg-moss px-2 py-1 text-sm text-cream disabled:border-ink/20 disabled:bg-paper-deep disabled:text-ink-soft"
          >
            {noteSaved ? "✓" : "save"}
          </button>
        </div>
      </div>

      {error ? (
        <p className="text-center font-pixel text-xs text-terracotta">{error}</p>
      ) : null}
    </section>
  );
}
