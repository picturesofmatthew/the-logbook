"use client";

import { useActionState, useMemo, useState } from "react";
import {
  ACTIVITY_LEVELS,
  DEFICITS,
  ageFromBirthdate,
  mifflinStJeor,
  suggestTargets,
  tdeeFromBmr,
  type ActivityLevel,
  type Sex,
} from "@/lib/engine/tdee";
import { saveSetup, type SetupState } from "./actions";

export type SetupInitial = {
  sex: Sex | null;
  birthdate: string | null;
  heightIn: number | null;
  activityLevel: ActivityLevel | null;
  weightLb: number | null;
  calories: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  todayIso: string;
};

const inputCls =
  "wobbly-sm border-2 border-ink/30 bg-cream px-3 py-2 text-lg outline-none focus:border-gold w-full";
const labelCls = "font-pixel text-xs tracking-wide text-ink-soft";

export function SetupForm({ initial }: { initial: SetupInitial }) {
  const [state, formAction, pending] = useActionState<SetupState, FormData>(
    saveSetup,
    null,
  );

  const [sex, setSex] = useState<Sex | "">(initial.sex ?? "");
  const [birthdate, setBirthdate] = useState(initial.birthdate ?? "");
  const [heightFt, setHeightFt] = useState(
    initial.heightIn ? String(Math.floor(initial.heightIn / 12)) : "",
  );
  const [heightIn, setHeightIn] = useState(
    initial.heightIn != null ? String(initial.heightIn % 12) : "",
  );
  const [activity, setActivity] = useState<ActivityLevel | "">(
    initial.activityLevel ?? "",
  );
  const [weightLb, setWeightLb] = useState(
    initial.weightLb != null ? String(initial.weightLb) : "",
  );

  const [calories, setCalories] = useState(
    initial.calories != null ? String(initial.calories) : "",
  );
  const [proteinG, setProteinG] = useState(
    initial.proteinG != null ? String(initial.proteinG) : "",
  );
  const [carbsG, setCarbsG] = useState(
    initial.carbsG != null ? String(initial.carbsG) : "",
  );
  const [fatG, setFatG] = useState(
    initial.fatG != null ? String(initial.fatG) : "",
  );

  const tdee = useMemo(() => {
    const w = Number(weightLb);
    const hFt = Number(heightFt);
    const hIn = Number(heightIn || "0");
    if (!sex || !birthdate || !activity || !(w > 0) || !(hFt > 0)) return null;
    const age = ageFromBirthdate(birthdate, initial.todayIso);
    if (!(age > 10 && age < 100)) return null;
    const bmr = mifflinStJeor({
      sex,
      weightLb: w,
      heightIn: hFt * 12 + hIn,
      age,
    });
    return tdeeFromBmr(bmr, activity);
  }, [sex, birthdate, heightFt, heightIn, activity, weightLb, initial.todayIso]);

  const [flooredAt, setFlooredAt] = useState<number | null>(null);

  function applyDeficit(deficitKcal: number) {
    if (!tdee || !sex) return;
    const s = suggestTargets({
      tdeeKcal: tdee,
      weightLb: Number(weightLb),
      deficitKcal,
      sex,
    });
    setCalories(String(s.calories));
    setProteinG(String(s.proteinG));
    setCarbsG(String(s.carbsG));
    setFatG(String(s.fatG));
    setFlooredAt(s.flooredAt);
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <section className="wobbly border-2 border-ink/20 bg-cream/70 p-6 shadow-card">
        <h2 className="mb-4 font-pixel text-lg tracking-wide">ABOUT YOU</h2>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            {(["male", "female"] as const).map((s) => (
              <label key={s} className="cursor-pointer">
                <input
                  type="radio"
                  name="sex"
                  value={s}
                  checked={sex === s}
                  onChange={() => setSex(s)}
                  className="peer sr-only"
                />
                <span className="wobbly-sm block border-2 border-ink/30 bg-cream px-3 py-2 text-center peer-checked:border-moss-deep peer-checked:bg-moss peer-checked:text-cream">
                  {s === "male" ? "Male-bodied" : "Female-bodied"}
                </span>
              </label>
            ))}
          </div>

          <label className="flex flex-col gap-1">
            <span className={labelCls}>BIRTHDAY</span>
            <input
              type="date"
              name="birthdate"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              required
              className={inputCls}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className={labelCls}>HEIGHT (FT)</span>
              <input
                type="number"
                name="heightFt"
                min={3}
                max={7}
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
                required
                className={inputCls}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className={labelCls}>+ INCHES</span>
              <input
                type="number"
                name="heightIn"
                min={0}
                max={11}
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
                className={inputCls}
              />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className={labelCls}>CURRENT WEIGHT (LB)</span>
            <input
              type="number"
              name="weightLb"
              min={60}
              max={600}
              step="0.1"
              value={weightLb}
              onChange={(e) => setWeightLb(e.target.value)}
              required
              className={inputCls}
            />
          </label>

          <fieldset className="flex flex-col gap-2">
            <legend className={labelCls}>MOST DAYS, YOU ARE...</legend>
            {ACTIVITY_LEVELS.map((a) => (
              <label key={a.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="activity"
                  value={a.id}
                  checked={activity === a.id}
                  onChange={() => setActivity(a.id)}
                  className="peer sr-only"
                />
                <span className="wobbly-sm flex items-baseline justify-between gap-2 border-2 border-ink/30 bg-cream px-3 py-2 peer-checked:border-moss-deep peer-checked:bg-moss peer-checked:text-cream">
                  <span>{a.label}</span>
                  <span className="text-sm opacity-70">{a.hint}</span>
                </span>
              </label>
            ))}
          </fieldset>
        </div>
      </section>

      <section className="wobbly border-2 border-ink/20 bg-cream/70 p-6 shadow-card">
        <h2 className="mb-1 font-pixel text-lg tracking-wide">YOUR TARGETS</h2>
        {tdee ? (
          <p className="mb-4 text-ink-soft">
            Maintenance is about{" "}
            <span className="font-pixel text-ink">{tdee.toLocaleString()}</span>{" "}
            kcal a day. Pick a pace:
          </p>
        ) : (
          <p className="mb-4 text-ink-soft">
            Fill in the card above and maintenance appears here.
          </p>
        )}

        <div className="mb-4 grid grid-cols-3 gap-2">
          {DEFICITS.map((d) => (
            <button
              key={d.id}
              type="button"
              disabled={!tdee}
              onClick={() => applyDeficit(d.kcal)}
              className="wobbly-sm cursor-pointer border-2 border-ink/30 bg-cream px-2 py-2 text-center transition-all hover:border-gold disabled:opacity-40"
            >
              <span className="block">{d.label}</span>
              <span className="block text-xs text-ink-soft">
                &minus;{d.kcal} / day
              </span>
              <span className="block text-xs text-ink-soft">
                ~{d.perWeekLb} lb / wk
              </span>
            </button>
          ))}
        </div>

        {flooredAt ? (
          <p className="mb-4 text-sm text-terracotta">
            Rounded up to {flooredAt.toLocaleString()} kcal — a nourishing
            floor. Slower is safer.
          </p>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className={labelCls}>CALORIES</span>
            <input
              type="number"
              name="calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
              className={inputCls}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className={labelCls}>PROTEIN (G)</span>
            <input
              type="number"
              name="proteinG"
              value={proteinG}
              onChange={(e) => setProteinG(e.target.value)}
              required
              className={inputCls}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className={labelCls}>CARBS (G)</span>
            <input
              type="number"
              name="carbsG"
              value={carbsG}
              onChange={(e) => setCarbsG(e.target.value)}
              required
              className={inputCls}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className={labelCls}>FAT (G)</span>
            <input
              type="number"
              name="fatG"
              value={fatG}
              onChange={(e) => setFatG(e.target.value)}
              required
              className={inputCls}
            />
          </label>
        </div>
      </section>

      {state?.error ? (
        <p className="text-center font-pixel text-sm text-terracotta">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="wobbly cursor-pointer bg-terracotta py-3 text-xl text-cream shadow-card transition-all active:translate-y-0.5 active:shadow-pressed disabled:opacity-60"
      >
        {pending ? "writing it down..." : "save to the logbook"}
      </button>
    </form>
  );
}
