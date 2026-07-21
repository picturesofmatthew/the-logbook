"use client";

// Reaching the far shore — the rarest, grandest ceremony. The server renders
// this only on the request that claimed the arrival (reachShore), so it fires
// exactly once per shore, the moment the last plank lands. From here the couple
// chooses where to sail next.

import Link from "next/link";
import { useEffect, useState } from "react";
import { StarMark } from "@/components/glyphs";
import { shoreArrivalTone } from "@/lib/sounds";

export function ShoreArrivalCeremony({ dreamName }: { dreamName: string }) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    shoreArrivalTone();
  }, []);
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center p-6"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-label={`You reached ${dreamName}`}
    >
      <div className="absolute inset-0 bg-ink/70" />
      <div className="ceremony-card relative w-full max-w-xs">
        <p className="mb-3 flex items-center justify-center gap-2 font-pixel text-sm tracking-widest text-gold">
          <StarMark size={13} /> LANDFALL <StarMark size={13} />
        </p>
        <div className="wobbly hatch lantern-pool border-2 border-gold/70 bg-cream p-6 text-center shadow-card">
          <p className="font-pixel text-[10px] tracking-widest text-violet-bright">
            the far shore, reached
          </p>
          <h2 className="mt-2 font-serif text-3xl leading-tight text-ink">
            {dreamName}
          </h2>
          <p className="mt-2 text-sm italic text-ink-soft">
            every plank set together — the boat carried you home.
          </p>
          <Link
            href="/shore"
            onClick={(e) => e.stopPropagation()}
            className="wobbly-sm mt-4 inline-block border border-violet/50 bg-violet-soft/40 px-4 py-2 font-pixel text-xs tracking-widest text-violet"
          >
            choose your next shore →
          </Link>
        </div>
        <p className="mt-3 text-center text-xs text-cream/90">
          tap anywhere to continue
        </p>
      </div>
    </div>
  );
}
