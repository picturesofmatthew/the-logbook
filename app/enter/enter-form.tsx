"use client";

import { useActionState } from "react";
import { enter, type EnterState } from "./actions";

export function EnterForm() {
  const [state, formAction, pending] = useActionState<EnterState, FormData>(
    enter,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <label className="flex flex-col gap-1">
        <span className="font-display text-sm tracking-wide text-ink-soft">
          EMAIL
        </span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="wobbly-sm border-2 border-ink/30 bg-cream px-4 py-3 text-lg outline-none focus:border-gold"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="font-display text-sm tracking-wide text-ink-soft">
          SECRET WORD
        </span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="wobbly-sm border-2 border-ink/30 bg-cream px-4 py-3 text-lg outline-none focus:border-gold"
        />
      </label>

      {state?.error ? (
        <p className="text-center font-display text-sm text-terracotta">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="wobbly cursor-pointer bg-terracotta py-3 text-xl text-cream shadow-card transition-all active:translate-y-0.5 active:shadow-pressed disabled:opacity-60"
      >
        {pending ? "unlocking..." : "open the door"}
      </button>
    </form>
  );
}
