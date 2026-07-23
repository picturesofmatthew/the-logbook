"use client";

import { useState, useTransition } from "react";
import { eraseMe, leaveBook, removePartner } from "./actions";

// The quiet exits. Kept understated (not a scary red "danger zone") — but the
// sever is a real safety tool, so each is gated by a plain confirm.
export function DangerZone({ partnerName }: { partnerName: string | null }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function sever() {
    if (!partnerName) return;
    if (
      !confirm(
        `Remove ${partnerName} from this book? It's immediate and can't be undone — they lose access, and you keep the book.`,
      )
    )
      return;
    setError(null);
    start(async () => {
      const res = await removePartner();
      if (res?.error) setError(res.error);
    });
  }

  function leave() {
    if (
      !confirm(
        "Leave this book? Your name and private notes are removed; your partner keeps the shared history as a keepsake. You'll be signed out.",
      )
    )
      return;
    start(() => leaveBook());
  }

  function erase() {
    if (
      !confirm(
        "Erase EVERYTHING you've logged? This permanently removes all your food, workouts, weight, and notes. It can't be undone.",
      )
    )
      return;
    start(() => eraseMe());
  }

  return (
    <div className="mt-8 flex flex-col gap-3 border-t border-ink/10 pt-6">
      <p className="font-display text-[11px] uppercase tracking-widest text-ink-soft/70">
        the quiet exits
      </p>

      {partnerName ? (
        <button
          type="button"
          onClick={sever}
          disabled={pending}
          className="wobbly-sm border-2 border-terracotta/40 bg-cream px-4 py-2 text-left text-sm text-terracotta shadow-card active:scale-[0.98] disabled:opacity-60"
        >
          Remove {partnerName} from this book
          <span className="block text-[11px] text-ink-soft/70">
            immediate · silent · you keep the book
          </span>
        </button>
      ) : null}

      <button
        type="button"
        onClick={leave}
        disabled={pending}
        className="wobbly-sm border-2 border-ink/20 bg-cream px-4 py-2 text-left text-sm text-ink-soft shadow-card active:scale-[0.98] disabled:opacity-60"
      >
        Leave this book
        <span className="block text-[11px] text-ink-soft/60">
          your name + notes removed · the book stays as their keepsake
        </span>
      </button>

      <button
        type="button"
        onClick={erase}
        disabled={pending}
        className="wobbly-sm border-2 border-terracotta/30 bg-cream px-4 py-2 text-left text-xs text-terracotta/80 shadow-card active:scale-[0.98] disabled:opacity-60"
      >
        Erase everything I&apos;ve logged
      </button>

      {error ? <p className="text-sm text-terracotta">{error}</p> : null}
    </div>
  );
}
