"use client";

import Link from "next/link";
import { useEffect } from "react";

// The in-book fallback when a route segment throws — a Neon cold-start, a
// timeout, a query that rejects. Never the raw Next stack trace: the grimoire
// holds still for a beat, then offers to open the page again. Rendered inside
// the chrome (top bar + ribbon stay), since error.tsx wraps the page, not the
// root layout. Root-layout failures fall through to global-error.tsx.
export default function GladeError({
  error,
  unstable_retry,
  reset,
}: {
  error: Error & { digest?: string };
  // 16.2+ prefers unstable_retry (re-fetches + re-renders the segment); reset
  // is the older fallback. Accept both so the button always works.
  unstable_retry?: () => void;
  reset?: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-8 text-center">
      <p aria-hidden className="font-display text-4xl text-gold">
        ✦
      </p>
      <h1 className="font-display text-2xl text-ink">the ink smudged</h1>
      <p className="max-w-xs font-sans text-sm text-ink-soft">
        A page wouldn&apos;t settle just now — nothing&apos;s lost, the book
        waits. Try turning to it again in a moment.
      </p>
      {error.digest ? (
        <p className="font-sans text-[11px] tracking-wide text-ink-soft/60">
          mark {error.digest}
        </p>
      ) : null}
      <div className="mt-2 flex items-center gap-4">
        <button
          type="button"
          onClick={() => retry?.()}
          className="wobbly border-2 border-ink bg-cream px-5 py-2 font-display text-sm text-ink"
        >
          turn the page again
        </button>
        <Link
          href="/"
          className="font-sans text-sm text-terracotta underline-offset-4 hover:underline"
        >
          back to the glade
        </Link>
      </div>
    </main>
  );
}
