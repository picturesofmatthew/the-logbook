"use client";

// A being's first arrival — witnessed once, ever, by whichever keeper loads
// the Glade first after it is called. Server-gated by being_arrivals.

import { useEffect, useState } from "react";
import { BEINGS, type BeingId } from "@/lib/engine/beings";
import { arrivalTone } from "@/lib/sounds";
import { StarMark } from "@/components/glyphs";
import { BeingPortrait } from "./being-portrait";

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
        <p className="mb-3 flex items-center justify-center gap-2 font-display text-sm tracking-widest text-gold-soft">
          <StarMark size={13} /> SOMETHING HAS COME <StarMark size={13} />
        </p>
        <div className="arch hatch border-2 border-ink/30 bg-cream p-6 pt-8 text-center shadow-card">
          <div className="flex justify-center">
            <BeingPortrait being={being} />
          </div>
          <p className="mt-2 font-display text-lg capitalize leading-tight">
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
