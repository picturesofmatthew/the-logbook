"use client";

import { useActionState } from "react";
import { nameFamiliar } from "@/app/familiar/actions";

export function NameForm() {
  const [state, formAction, pending] = useActionState(nameFamiliar, null);

  return (
    <form action={formAction} className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <input
          name="name"
          maxLength={20}
          required
          placeholder="name the fox..."
          className="wobbly-sm w-32 border-2 border-ink/30 bg-cream px-2 py-1 text-sm outline-none focus:border-gold"
        />
        <button
          type="submit"
          disabled={pending}
          className="wobbly-sm cursor-pointer border-2 border-moss-deep bg-moss px-2 py-1 text-sm text-cream disabled:opacity-60"
        >
          ✓
        </button>
      </div>
      {state?.error ? (
        <p className="font-pixel text-[10px] text-terracotta">{state.error}</p>
      ) : null}
    </form>
  );
}
