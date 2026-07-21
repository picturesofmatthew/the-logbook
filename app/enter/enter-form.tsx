"use client";

import { useActionState } from "react";
import { PROFILES, type Profile } from "@/lib/auth";
import { enter, type EnterState } from "./actions";

const NICE_NAMES: Record<Profile, string> = {
  matthew: "Matthew",
  kennedy: "Kennedy",
};

export function EnterForm() {
  const [state, formAction, pending] = useActionState<EnterState, FormData>(
    enter,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 font-display text-sm tracking-wide text-ink-soft">
          WHO GOES THERE?
        </legend>
        <div className="grid grid-cols-2 gap-3">
          {PROFILES.map((p) => (
            <label key={p} className="cursor-pointer">
              <input
                type="radio"
                name="profile"
                value={p}
                required
                className="peer sr-only"
              />
              <span className="wobbly-sm block border-2 border-ink/30 bg-cream px-4 py-3 text-center text-lg shadow-card transition-all peer-checked:border-moss-deep peer-checked:bg-moss peer-checked:text-cream peer-checked:shadow-pressed">
                {NICE_NAMES[p]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1">
        <span className="font-display text-sm tracking-wide text-ink-soft">
          SECRET WORD
        </span>
        <input
          name="passcode"
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
