"use client";

import { useActionState } from "react";
import {
  KEEPER_ARCHETYPES,
  KeeperGlyph,
} from "@/components/keeper/keeper-glyph";
import { signup, type JoinState } from "./actions";

const KINDS: { id: string; label: string }[] = [
  { id: "couple", label: "a couple" },
  { id: "gym_partners", label: "gym partners" },
  { id: "friends", label: "friends" },
];

// Why you keep the light — a compass, never a scored target (tone law). The
// kinds are coarse on purpose; the line under them is the real answer.
const VOWS: { id: string; label: string }[] = [
  { id: "grow", label: "to grow" },
  { id: "learn", label: "to learn" },
  { id: "tend", label: "to tend" },
  { id: "steady", label: "to steady" },
  { id: "other", label: "something else" },
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

      {/* WHO KEEPS THE LIGHT — each keeper elects the figure who stands at
          their side of the mantle. Optional: the mantle simply stays plain. */}
      <fieldset className="flex flex-col gap-2">
        <legend className={`mb-1 ${labelClass}`}>WHO KEEPS THE LIGHT?</legend>
        <div className="grid grid-cols-4 gap-1.5">
          {KEEPER_ARCHETYPES.map((a) => (
            <label key={a.id} className="cursor-pointer">
              <input
                type="radio"
                name="character"
                value={a.id}
                className="peer sr-only"
              />
              <span className="wobbly-sm flex flex-col items-center gap-0.5 border-2 border-ink/25 bg-cream p-1 text-center shadow-card transition-all peer-checked:border-gold peer-checked:bg-gold-soft/40 peer-checked:shadow-pressed">
                <KeeperGlyph archetype={a.id} size={46} title={a.label} />
                <span className="font-display text-[9px] leading-tight text-ink-soft">
                  {a.label.replace("The ", "")}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* THE VOW — why you keep it. A compass, never a target. */}
      <fieldset className="flex flex-col gap-2">
        <legend className={`mb-1 ${labelClass}`}>WHY YOU KEEP IT</legend>
        <div className="flex flex-wrap gap-1.5">
          {VOWS.map((v) => (
            <label key={v.id} className="cursor-pointer">
              <input
                type="radio"
                name="vowKind"
                value={v.id}
                className="peer sr-only"
              />
              <span className="wobbly-sm block border-2 border-ink/25 bg-cream px-2.5 py-1.5 text-sm shadow-card transition-all peer-checked:border-moss-deep peer-checked:bg-moss peer-checked:text-cream peer-checked:shadow-pressed">
                {v.label}
              </span>
            </label>
          ))}
        </div>
        <input
          name="vow"
          maxLength={160}
          placeholder="so we're both still climbing at sixty"
          className="wobbly-sm border-2 border-ink/30 bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
        />
        <span className="text-[11px] italic text-ink-soft/80">
          kept, never scored — you can change it later
        </span>
      </fieldset>

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
