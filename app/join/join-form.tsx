"use client";

import { useActionState } from "react";
import { signup, type JoinState } from "./actions";

const KINDS: { id: string; label: string }[] = [
  { id: "couple", label: "a couple" },
  { id: "gym_partners", label: "gym partners" },
  { id: "friends", label: "friends" },
];

const fieldClass =
  "wobbly-sm border-2 border-ink/30 bg-cream px-4 py-3 text-lg outline-none focus:border-gold";
const labelClass = "font-display text-sm tracking-wide text-ink-soft";

export function JoinForm({ invite }: { invite?: string }) {
  const [state, formAction, pending] = useActionState<JoinState, FormData>(
    signup,
    null,
  );
  const isJoining = !!invite;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {invite ? <input type="hidden" name="invite" value={invite} /> : null}

      <label className="flex flex-col gap-1">
        <span className={labelClass}>YOUR NAME</span>
        <input name="displayName" required maxLength={40} className={fieldClass} />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>EMAIL</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>SECRET WORD</span>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className={fieldClass}
        />
        <span className="text-[11px] text-ink-soft/70">at least 8 characters</span>
      </label>

      {!isJoining ? (
        <fieldset className="flex flex-col gap-2">
          <legend className={`mb-1 ${labelClass}`}>WHAT ARE YOU TWO?</legend>
          <div className="grid grid-cols-3 gap-2">
            {KINDS.map((k, i) => (
              <label key={k.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="kind"
                  value={k.id}
                  defaultChecked={i === 0}
                  className="peer sr-only"
                />
                <span className="wobbly-sm block border-2 border-ink/30 bg-cream px-2 py-2 text-center text-sm shadow-card transition-all peer-checked:border-moss-deep peer-checked:bg-moss peer-checked:text-cream peer-checked:shadow-pressed">
                  {k.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <label className="flex items-start gap-2 text-xs leading-relaxed text-ink-soft">
        <input type="checkbox" name="consent" required className="mt-0.5" />
        <span>
          I agree to the{" "}
          <a
            href="/privacy"
            target="_blank"
            className="text-terracotta underline underline-offset-2"
          >
            privacy policy
          </a>{" "}
          and consent to my health data (food, workouts, mood, notes, weight)
          being processed to run the app.
        </span>
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
        {pending
          ? "opening..."
          : isJoining
            ? "join the book"
            : "begin the book"}
      </button>
    </form>
  );
}
