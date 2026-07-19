"use client";

import { useState, useTransition } from "react";
import { deleteWorkout, logWorkout, type SetInput } from "@/app/train/actions";
import { SPLIT_PRESETS, totalVolumeLb } from "@/lib/engine/training";

export type WorkoutItem = {
  id: number;
  title: string;
  sets: {
    kind: "lift" | "cardio";
    exercise: string;
    weightLb: number | null;
    reps: number | null;
    minutes: number | null;
  }[];
};

type Row = {
  kind: "lift" | "cardio";
  exercise: string;
  weightLb: string;
  reps: string;
  minutes: string;
};

const emptyLift: Row = {
  kind: "lift",
  exercise: "",
  weightLb: "",
  reps: "",
  minutes: "",
};

const labelCls = "font-pixel text-[10px] tracking-wide text-ink-soft";
const inputCls =
  "wobbly-sm border-2 border-ink/30 bg-cream px-2 py-1 outline-none focus:border-gold";

// One exercise's sets, folded for display: "185×8 · 185×6".
function foldSets(sets: WorkoutItem["sets"]): { label: string; detail: string }[] {
  const byExercise = new Map<string, WorkoutItem["sets"]>();
  for (const s of sets) {
    const list = byExercise.get(s.exercise) ?? [];
    list.push(s);
    byExercise.set(s.exercise, list);
  }
  return [...byExercise.entries()].map(([exercise, list]) => ({
    label: exercise,
    detail: list
      .map((s) =>
        s.kind === "cardio"
          ? `${s.minutes} min`
          : s.weightLb != null
            ? `${s.weightLb}×${s.reps}`
            : `bw×${s.reps}`,
      )
      .join(" · "),
  }));
}

export function TrainLog({
  day,
  workouts,
  exerciseNames,
  newMarkExercises,
}: {
  day: string;
  workouts: WorkoutItem[];
  exerciseNames: string[];
  newMarkExercises: string[];
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [rows, setRows] = useState<Row[]>([{ ...emptyLift }]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function patchRow(i: number, patch: Partial<Row>) {
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  }

  function duplicateRow(i: number) {
    setRows((rs) => [...rs.slice(0, i + 1), { ...rs[i] }, ...rs.slice(i + 1)]);
  }

  function removeRow(i: number) {
    setRows((rs) => rs.filter((_, j) => j !== i));
  }

  function save() {
    const isRest = title.trim().toLowerCase() === "rest";
    const sets: SetInput[] = rows
      .filter((r) => r.exercise.trim() !== "")
      .map((r) => ({
        kind: r.kind,
        exercise: r.exercise,
        weightLb: r.kind === "lift" && r.weightLb ? Number(r.weightLb) : null,
        reps: r.kind === "lift" ? Number(r.reps) : null,
        minutes: r.kind === "cardio" ? Number(r.minutes) : null,
      }));
    if (!isRest && sets.length === 0) {
      setError("Add at least one set, or mark the day Rest.");
      return;
    }
    startTransition(async () => {
      const result = await logWorkout({ day, title, sets: isRest ? [] : sets });
      setError(result.error ?? null);
      if (!result.error) {
        setOpen(false);
        setTitle("");
        setRows([{ ...emptyLift }]);
      }
    });
  }

  return (
    <section className="wobbly flex flex-col gap-3 border-2 border-ink/20 bg-cream/70 p-4 shadow-card">
      <h2 className="font-pixel text-sm tracking-wide">TRAINING LOG</h2>

      {workouts.map((w) => (
        <div
          key={w.id}
          className="wobbly-sm border-2 border-ink/15 bg-cream px-3 py-2"
        >
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-pixel text-xs tracking-wide">{w.title}</p>
            <div className="flex items-center gap-2">
              {totalVolumeLb(w.sets) > 0 ? (
                <span className="text-[11px] text-ink-soft">
                  {Math.round(totalVolumeLb(w.sets)).toLocaleString()} lb moved
                </span>
              ) : null}
              <button
                type="button"
                aria-label={`Remove ${w.title}`}
                onClick={() =>
                  startTransition(async () => {
                    await deleteWorkout({ id: w.id });
                  })
                }
                className="cursor-pointer text-ink-soft/60 hover:text-terracotta"
              >
                ✕
              </button>
            </div>
          </div>
          {foldSets(w.sets).map((line) => (
            <p key={line.label} className="mt-0.5 text-xs text-ink-soft">
              {line.label} — {line.detail}
              {newMarkExercises.includes(line.label.toLowerCase()) ? (
                <span className="ml-1.5 text-gold" title="A New Mark">
                  ✦ new mark
                </span>
              ) : null}
            </p>
          ))}
        </div>
      ))}

      {workouts.length === 0 && !open ? (
        <p className="text-xs text-ink-soft/80">
          Nothing inscribed yet. Iron, road, or rest — all of it counts.
        </p>
      ) : null}

      {open ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {SPLIT_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setTitle(p.label)}
                className={`wobbly-sm cursor-pointer border px-2 py-0.5 text-xs ${
                  title === p.label
                    ? "border-gold bg-gold-soft"
                    : "border-ink/25 bg-cream"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="or name it yourself"
            className={`${inputCls} text-sm`}
          />

          {title.trim().toLowerCase() !== "rest" ? (
            <div className="flex flex-col gap-2">
              {rows.map((r, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  {r.kind === "lift" ? (
                    <>
                      <input
                        type="text"
                        list="exercise-names"
                        value={r.exercise}
                        onChange={(e) => patchRow(i, { exercise: e.target.value })}
                        placeholder="exercise"
                        className={`${inputCls} min-w-0 flex-1 text-sm`}
                      />
                      <input
                        type="number"
                        inputMode="decimal"
                        value={r.weightLb}
                        onChange={(e) => patchRow(i, { weightLb: e.target.value })}
                        placeholder="lb"
                        className={`${inputCls} w-16 text-right text-sm`}
                      />
                      <input
                        type="number"
                        inputMode="numeric"
                        value={r.reps}
                        onChange={(e) => patchRow(i, { reps: e.target.value })}
                        placeholder="reps"
                        className={`${inputCls} w-14 text-right text-sm`}
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={r.exercise}
                        onChange={(e) => patchRow(i, { exercise: e.target.value })}
                        placeholder="run, bike, walk…"
                        className={`${inputCls} min-w-0 flex-1 text-sm`}
                      />
                      <input
                        type="number"
                        inputMode="numeric"
                        value={r.minutes}
                        onChange={(e) => patchRow(i, { minutes: e.target.value })}
                        placeholder="min"
                        className={`${inputCls} w-16 text-right text-sm`}
                      />
                    </>
                  )}
                  <button
                    type="button"
                    aria-label="Repeat this set"
                    title="repeat set"
                    onClick={() => duplicateRow(i)}
                    className="cursor-pointer px-1 text-ink-soft hover:text-ink"
                  >
                    ⧉
                  </button>
                  <button
                    type="button"
                    aria-label="Remove this set"
                    onClick={() => removeRow(i)}
                    className="cursor-pointer px-1 text-ink-soft/60 hover:text-terracotta"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <datalist id="exercise-names">
                {exerciseNames.map((n) => (
                  <option key={n} value={n} />
                ))}
              </datalist>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRows((rs) => [...rs, { ...emptyLift }])}
                  className="wobbly-sm cursor-pointer border-2 border-ink/25 bg-cream px-2 py-1 text-xs"
                >
                  + set
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setRows((rs) => [
                      ...rs,
                      { ...emptyLift, kind: "cardio" as const },
                    ])
                  }
                  className="wobbly-sm cursor-pointer border-2 border-ink/25 bg-cream px-2 py-1 text-xs"
                >
                  + cardio
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-ink-soft">
              A rest day, inscribed. The moth approves.
            </p>
          )}

          {error ? <p className="text-xs text-terracotta">{error}</p> : null}

          <div className="flex gap-2">
            <button
              type="button"
              disabled={pending || !title.trim()}
              onClick={save}
              className="wobbly-sm cursor-pointer border-2 border-moss-deep bg-moss px-3 py-1 text-sm text-cream disabled:border-ink/20 disabled:bg-paper-deep disabled:text-ink-soft"
            >
              inscribe
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setError(null);
              }}
              className="wobbly-sm cursor-pointer border-2 border-ink/25 bg-cream px-3 py-1 text-sm"
            >
              cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="wobbly-sm cursor-pointer border-2 border-dashed border-ink/30 px-3 py-1.5 text-sm text-ink-soft hover:border-gold"
        >
          + inscribe a workout
        </button>
      )}
    </section>
  );
}
