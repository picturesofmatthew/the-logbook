"use client";

import { useActionState } from "react";

type FormState = { error: string } | null;
type DreamAction = (prev: FormState, formData: FormData) => Promise<FormState>;

// The light setter for a shore — name it and say how many planks the crossing
// takes. Used for both renaming the active Dream and choosing the next shore.
export function DreamForm({
  action,
  name,
  distanceDays = 14,
  cta,
  namePlaceholder,
}: {
  action: DreamAction;
  name?: string;
  distanceDays?: number;
  cta: string;
  namePlaceholder: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 font-pixel text-[10px] tracking-wide text-ink-soft">
        the shore
        <input
          name="name"
          defaultValue={name}
          placeholder={namePlaceholder}
          maxLength={40}
          className="wobbly-sm border border-ink/20 bg-cream px-3 py-2 font-sans text-sm text-ink outline-none focus:border-violet/50"
        />
      </label>
      <label className="flex flex-col gap-1 font-pixel text-[10px] tracking-wide text-ink-soft">
        planks to build the vessel (both-logged days)
        <input
          name="distance"
          type="number"
          min={3}
          max={365}
          defaultValue={distanceDays}
          className="wobbly-sm w-24 border border-ink/20 bg-cream px-3 py-2 font-sans text-sm text-ink outline-none focus:border-violet/50"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="wobbly-sm self-start border border-violet/50 bg-violet-soft/40 px-4 py-2 font-pixel text-xs tracking-widest text-violet disabled:opacity-50"
      >
        {pending ? "setting…" : cta}
      </button>
      {state?.error ? (
        <p className="font-pixel text-[10px] tracking-wide text-terracotta">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
