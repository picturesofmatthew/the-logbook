"use client";

// A being's first arrival — witnessed once, ever, by whichever keeper loads
// the Glade first after it is called. Server-gated by being_arrivals.

import { useEffect, useState } from "react";
import { BEINGS, type BeingId } from "@/lib/engine/beings";
import { arrivalTone } from "@/lib/sounds";
import { Heron, Stag } from "./glade-scene";

// Tight viewBox windows around each being's scene-space position.
function BeingPortrait({ being }: { being: BeingId }) {
  if (being === "stag") {
    return (
      <svg viewBox="276 50 60 78" width="120" height="156" aria-hidden>
        <Stag stage={1} />
      </svg>
    );
  }
  if (being === "heron") {
    return (
      <svg viewBox="60 76 40 56" width="100" height="140" aria-hidden>
        <Heron stage={1} />
      </svg>
    );
  }
  return null;
}

export function ArrivalCeremony({ being }: { being: BeingId }) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    arrivalTone();
  }, []);
  if (!open) return null;
  const def = BEINGS.find((b) => b.id === being);
  if (!def) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-label={`${def.name} has arrived`}
    >
      <div className="absolute inset-0 bg-ink/60" />
      <div className="ceremony-card relative w-full max-w-xs">
        <p className="mb-3 text-center font-pixel text-sm tracking-widest text-gold-soft">
          ✦ SOMETHING HAS COME ✦
        </p>
        <div className="arch hatch border-2 border-ink/30 bg-cream p-6 pt-8 text-center shadow-card">
          <div className="flex justify-center">
            <BeingPortrait being={being} />
          </div>
          <p className="mt-2 font-pixel text-lg capitalize leading-tight">
            {def.name}
          </p>
          <p className="mt-1 text-sm italic text-ink-soft">{def.line}</p>
          <p className="wobbly-sm mt-4 inline-block border border-gold bg-gold-soft px-3 py-1 text-xs">
            it keeps {def.zone} now
          </p>
        </div>
        <p className="mt-3 text-center text-xs text-cream/90">
          tap anywhere to continue
        </p>
      </div>
    </div>
  );
}
