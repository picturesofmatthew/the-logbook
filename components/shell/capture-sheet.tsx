"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setTraining } from "@/app/day/actions";
import { loadCaptureData } from "@/app/capture/actions";
import { donateSpecimen, logEntry } from "@/app/log/actions";
import { logWorkout } from "@/app/train/actions";
import type { RecentWorkout } from "@/lib/data";
import { parseWorkoutLine, type ParsedSet } from "@/lib/engine/workout-parse";
import type { Hall } from "@/lib/halls";
import { MEALS, mealForHour, type Meal, type Specimen } from "@/lib/meals";

type Estimate = {
  name: string;
  hall: Hall;
  icon: string;
  servingLabel: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  confidence: "high" | "rough";
};
import { inscribeTick, logChime, ritualChime } from "@/lib/sounds";
import { EatGlyph, MealGlyph, WorkoutGlyph } from "@/components/glyphs";
import { PantryRune, QuillRune } from "@/components/shell/rune-icons";
import { useShell } from "./shell-provider";

type Pane = "eat" | "train";
type CaptureData = {
  day: string;
  recents: Specimen[];
  recentWorkouts: RecentWorkout[];
};

// One exercise's sets, folded for display: "185×8 · 185×6".
function foldSets(sets: ParsedSet[]): { ex: string; detail: string }[] {
  const order: string[] = [];
  const by = new Map<string, ParsedSet[]>();
  for (const s of sets) {
    if (!by.has(s.exercise)) {
      by.set(s.exercise, []);
      order.push(s.exercise);
    }
    by.get(s.exercise)!.push(s);
  }
  return order.map((ex) => ({
    ex,
    detail: by
      .get(ex)!
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

export function CaptureSheet() {
  const { captureOpen, preselectMeal, closeCapture } = useShell();
  const router = useRouter();

  const [pane, setPane] = useState<Pane>("eat");
  const [data, setData] = useState<CaptureData | null>(null);
  const [meal, setMeal] = useState<Meal>(() => mealForHour(new Date().getHours()));
  const [prevOpen, setPrevOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Train pane.
  const [trainText, setTrainText] = useState("");
  const [preview, setPreview] = useState<{
    title: string;
    sets: ParsedSet[];
  } | null>(null);

  // Eat pane (write-in estimator).
  const [eatText, setEatText] = useState("");
  const [estimating, setEstimating] = useState(false);
  const [est, setEst] = useState<Estimate | null>(null);
  const [estError, setEstError] = useState<string | null>(null);

  // Reset the meal to the clock's suggestion each time the sheet opens
  // (render-time adjustment, not a set-state effect).
  if (captureOpen !== prevOpen) {
    setPrevOpen(captureOpen);
    if (captureOpen) {
      setMeal(preselectMeal ?? mealForHour(new Date().getHours()));
    }
  }

  useEffect(() => {
    if (captureOpen && !data) loadCaptureData().then(setData);
  }, [captureOpen, data]);

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }

  function quickLog(s: Specimen) {
    if (!data) return;
    startTransition(async () => {
      const result = await logEntry({ foodId: s.id, meal, servings: 1, day: data.day });
      if (result.error) flash(result.error);
      else {
        logChime();
        flash(`${s.icon} ${s.name} — logged to ${meal}`);
        router.refresh();
      }
    });
  }

  function markTraining(kind: "lift" | "cardio" | "rest") {
    if (!data) return;
    startTransition(async () => {
      const result = await setTraining({ day: data.day, training: kind });
      if (result.error) flash(result.error);
      else {
        ritualChime();
        flash(`Day marked — ${kind}`);
        router.refresh();
      }
    });
  }

  function readWorkout() {
    const { sets, titleGuess } = parseWorkoutLine(trainText);
    if (sets.length === 0) {
      flash("Couldn't read any sets — try “bench 185x8x3”.");
      return;
    }
    setPreview({ title: titleGuess ?? "Workout", sets });
  }

  function inscribe() {
    if (!data || !preview) return;
    startTransition(async () => {
      const result = await logWorkout({
        day: data.day,
        title: preview.title,
        sets: preview.sets,
      });
      if (result.error) flash(result.error);
      else {
        inscribeTick();
        flash(`${preview.title} inscribed — ${preview.sets.length} sets`);
        router.refresh();
        setPreview(null);
        setTrainText("");
      }
    });
  }

  async function runEstimate() {
    if (eatText.trim().length < 2) return;
    setEstimating(true);
    setEstError(null);
    setEst(null);
    try {
      const res = await fetch(
        `/api/food-estimate?q=${encodeURIComponent(eatText.trim())}`,
      );
      const d = (await res.json()) as { estimate?: Estimate; error?: string };
      if (d.estimate) setEst(d.estimate);
      else setEstError(d.error ?? "Couldn't estimate that.");
    } catch {
      setEstError("The field guide is unreachable right now.");
    } finally {
      setEstimating(false);
    }
  }

  function logEstimate() {
    if (!data || !est) return;
    startTransition(async () => {
      const result = await donateSpecimen({
        name: est.name,
        hall: est.hall,
        icon: est.icon,
        servingLabel: est.servingLabel,
        calories: Number(est.calories) || 0,
        proteinG: Number(est.proteinG) || 0,
        carbsG: Number(est.carbsG) || 0,
        fatG: Number(est.fatG) || 0,
        fdcId: null,
        estimated: true,
        logAs: { meal, servings: 1, day: data.day },
      });
      if (result.error) flash(result.error);
      else {
        logChime();
        flash(`~ ${est.name} — logged to ${meal}`);
        router.refresh();
        setEst(null);
        setEatText("");
      }
    });
  }

  // Most recent workout per split family — the repeat-last chips.
  const repeatChips: RecentWorkout[] = [];
  const seenFamily = new Set<string>();
  for (const w of data?.recentWorkouts ?? []) {
    if (seenFamily.has(w.family)) continue;
    seenFamily.add(w.family);
    repeatChips.push(w);
    if (repeatChips.length >= 4) break;
  }

  const seg =
    "flex-1 font-display text-xs tracking-wide uppercase py-2.5 cursor-pointer border-2 flex items-center justify-center gap-1.5";
  const label = "font-display text-[10px] tracking-wide text-ink-soft";

  return (
    <>
      <button
        type="button"
        aria-label="Close"
        onClick={closeCapture}
        className={`fixed inset-0 z-40 bg-ink/40 transition-opacity duration-300 ${
          captureOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-label="Log"
        aria-hidden={!captureOpen}
        className={`fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[86dvh] w-full max-w-md overflow-y-auto overscroll-contain rounded-t-3xl border-2 border-b-0 border-ink/20 bg-paper p-4 pb-8 shadow-card transition-transform duration-300 ${
          captureOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-ink/20" aria-hidden />
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setPane("eat")}
            className={`${seg} wobbly-sm ${
              pane === "eat"
                ? "border-moss-deep bg-moss-deep text-cream"
                : "border-ink/20 bg-cream text-ink-soft"
            }`}
          >
            <EatGlyph size={15} /> eat
          </button>
          <button
            type="button"
            onClick={() => setPane("train")}
            className={`${seg} wobbly-sm ${
              pane === "train"
                ? "border-moss-deep bg-moss-deep text-cream"
                : "border-ink/20 bg-cream text-ink-soft"
            }`}
          >
            <WorkoutGlyph kind="lift" size={15} /> train
          </button>
        </div>

        {pane === "eat" ? (
          <div className="flex flex-col gap-3">
            <div className="flex gap-1.5">
              {MEALS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMeal(m.id)}
                  className={`wobbly-sm flex flex-1 items-center justify-center gap-1 cursor-pointer border-2 px-1 py-1.5 text-xs ${
                    meal === m.id
                      ? "border-gold bg-gold-soft"
                      : "border-ink/20 bg-cream text-ink-soft"
                  }`}
                >
                  <MealGlyph meal={m.id} size={12} /> {m.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={eatText}
                onChange={(e) => setEatText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") runEstimate();
                }}
                placeholder="greek yogurt, honey, granola…"
                className="wobbly-sm w-full border-2 border-ink/30 bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
              />
              <button
                type="button"
                onClick={runEstimate}
                disabled={estimating}
                className="wobbly-sm cursor-pointer border-2 border-terracotta bg-terracotta px-4 font-display text-xs text-cream disabled:opacity-60"
              >
                {estimating ? "…" : "est."}
              </button>
            </div>
            {estError ? (
              <p className="text-center text-xs text-terracotta">{estError}</p>
            ) : null}

            {est ? (
              <div className="rise-in wobbly-sm flex flex-col gap-2 border-2 border-dashed border-gold/70 bg-gold-soft/30 p-3">
                <div className="flex items-center gap-2">
                  <span
                    className="font-display text-base text-terracotta"
                    title="an estimate"
                  >
                    ~
                  </span>
                  <input
                    value={est.name}
                    onChange={(e) => setEst({ ...est, name: e.target.value })}
                    className="wobbly-sm min-w-0 flex-1 border-2 border-ink/25 bg-cream px-2 py-1 text-sm outline-none focus:border-gold"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      ["KCAL", "calories"],
                      ["P", "proteinG"],
                      ["C", "carbsG"],
                      ["F", "fatG"],
                    ] as const
                  ).map(([lbl, key]) => (
                    <label key={key} className="flex flex-col gap-0.5">
                      <span className="font-display text-[9px] tracking-wide text-ink-soft">
                        {lbl}
                      </span>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={est[key]}
                        onChange={(e) =>
                          setEst({
                            ...est,
                            [key]: e.target.value === "" ? 0 : Number(e.target.value),
                          })
                        }
                        className="wobbly-sm border-2 border-ink/25 bg-cream px-1 py-1 text-center text-sm outline-none focus:border-gold"
                      />
                    </label>
                  ))}
                </div>
                <p className="text-[11px] italic leading-snug text-ink-soft">
                  {est.confidence === "rough"
                    ? "a rough estimate — nudge the numbers if you know better"
                    : "estimated — tap any number to adjust"}
                </p>
                <button
                  type="button"
                  disabled={pending}
                  onClick={logEstimate}
                  className="wobbly-sm cursor-pointer border-2 border-moss-deep bg-moss py-2 text-sm text-cream disabled:opacity-60"
                >
                  log to {meal}
                </button>
              </div>
            ) : null}

            <p className={label}>RECENT · one tap logs one serving to {meal}</p>
            {data == null ? (
              <p className="py-3 text-center text-sm text-ink-soft">leafing through…</p>
            ) : data.recents.length === 0 ? (
              <p className="py-3 text-center text-sm text-ink-soft">
                Nothing logged yet — donate a first specimen in the pantry.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-1.5">
                {data.recents.slice(0, 8).map((s) => (
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
            )}

            <Link
              href="/library#pantry"
              onClick={closeCapture}
              className="wobbly-sm flex items-center justify-center gap-1.5 cursor-pointer border-2 border-dashed border-ink/30 px-3 py-2 text-center text-sm text-ink-soft hover:border-gold"
            >
              <PantryRune size={15} /> find more in the pantry →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input
                value={trainText}
                onChange={(e) => setTrainText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") readWorkout();
                }}
                placeholder="bench 185x8x3, squat 225x5x5…"
                className="wobbly-sm w-full border-2 border-ink/30 bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
              />
              <button
                type="button"
                onClick={readWorkout}
                className="wobbly-sm cursor-pointer border-2 border-terracotta bg-terracotta px-4 font-display text-xs text-cream"
              >
                read
              </button>
            </div>

            {preview ? (
              <div className="rise-in wobbly-sm flex flex-col gap-2 border-2 border-gold/60 bg-gold-soft/30 p-3">
                <input
                  value={preview.title}
                  onChange={(e) =>
                    setPreview((p) => (p ? { ...p, title: e.target.value } : p))
                  }
                  className="wobbly-sm border-2 border-ink/25 bg-cream px-2 py-1 font-display text-xs outline-none focus:border-gold"
                />
                {foldSets(preview.sets).map((line) => (
                  <p key={line.ex} className="text-xs text-ink-soft">
                    <span className="text-ink">{line.ex}</span> — {line.detail}
                  </p>
                ))}
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={inscribe}
                    className="wobbly-sm flex-1 cursor-pointer border-2 border-moss-deep bg-moss py-2 text-sm text-cream disabled:opacity-60"
                  >
                    inscribe · {preview.sets.length} sets
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreview(null)}
                    className="cursor-pointer px-2 text-sm text-ink-soft underline decoration-dotted"
                  >
                    clear
                  </button>
                </div>
              </div>
            ) : (
              <>
                {repeatChips.length > 0 ? (
                  <>
                    <p className={label}>REPEAT LAST · prefills every set</p>
                    <div className="flex flex-col gap-1.5">
                      {repeatChips.map((w) => (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => setPreview({ title: w.title, sets: w.sets })}
                          className="wobbly-sm flex cursor-pointer items-center justify-between gap-2 border-2 border-ink/20 bg-cream px-3 py-2 text-left hover:border-gold"
                        >
                          <span className="min-w-0">
                            <span className="block truncate font-display text-[11px]">
                              {w.title}
                            </span>
                            <span className="block truncate text-[11px] text-ink-soft">
                              {foldSets(w.sets)
                                .map((l) => `${l.ex} ${l.detail}`)
                                .join(" · ")}
                            </span>
                          </span>
                          <span className="font-display text-[10px] uppercase text-terracotta">
                            repeat →
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : null}

                <p className={label}>OR MARK THE DAY</p>
                <div className="flex gap-2">
                  {(
                    [
                      ["lift", "lift"],
                      ["cardio", "cardio"],
                      ["rest", "rest"],
                    ] as const
                  ).map(([id, text]) => (
                    <button
                      key={id}
                      type="button"
                      disabled={pending}
                      onClick={() => markTraining(id)}
                      className="wobbly-sm flex flex-1 items-center justify-center gap-1 cursor-pointer border-2 border-ink/20 bg-cream py-2 text-sm text-ink-soft hover:border-gold disabled:opacity-60"
                    >
                      <WorkoutGlyph kind={id} size={14} /> {text}
                    </button>
                  ))}
                </div>

                <Link
                  href="/today"
                  onClick={closeCapture}
                  className="wobbly-sm flex items-center justify-center gap-1.5 cursor-pointer border-2 border-dashed border-ink/30 px-3 py-2 text-center text-sm text-ink-soft hover:border-gold"
                >
                  <QuillRune size={14} /> the full training log →
                </Link>
              </>
            )}
          </div>
        )}

        {toast ? (
          <p className="mt-3 text-center font-display text-xs text-moss-deep">{toast}</p>
        ) : null}

        <button
          type="button"
          onClick={closeCapture}
          className="mt-4 w-full cursor-pointer text-center text-sm text-ink-soft underline decoration-dotted"
        >
          close
        </button>
      </div>
    </>
  );
}
