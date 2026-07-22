"use client";

// The first-discovery ceremony. The home decides a legendary was earned today
// (a fact from the composed sigil); this gates itself once-per-device so BOTH
// keepers witness it, not just whoever loaded the page first.

import { useEffect, useState } from "react";
import { LEGENDARIES, type LegendaryId, type SigilSpec } from "@/lib/engine/sigil";
import { ceremonyUnseen } from "@/lib/ceremony-seen";
import { legendaryTone, plankTone } from "@/lib/sounds";
import { StarMark } from "@/components/glyphs";
import { PlankBeat } from "./plank-beat";
import { SigilGlyph } from "./sigil-glyph";

export function LegendaryCeremony({
  legendary,
  spec,
  day,
  dreamName,
  planksLaid,
  remaining,
}: {
  legendary: LegendaryId;
  spec: SigilSpec;
  day: string;
  // A legendary day also sets a plank — a golden one — into the boat.
  dreamName?: string;
  planksLaid?: number | null;
  remaining?: number | null;
}) {
  const [open, setOpen] = useState(false);
  const laysPlank = planksLaid != null && dreamName != null;
  useEffect(() => {
    if (!ceremonyUnseen("logbook_legendary_seen_", day)) return;
    setOpen(true);
    legendaryTone();
    const plank = laysPlank ? window.setTimeout(() => plankTone(), 1900) : undefined;
    return () => {
      if (plank) window.clearTimeout(plank);
    };
  }, [day, laysPlank]);
  if (!open) return null;
  const l = LEGENDARIES[legendary];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-label={`Legendary sigil discovered: ${l.name}`}
    >
      <div className="absolute inset-0 bg-ink/60" />
      <div className="ceremony-card relative w-full max-w-xs">
        <p className="mb-3 flex items-center justify-center gap-2 font-display text-sm tracking-widest text-violet-bright">
          <StarMark size={13} /> A LEGENDARY SIGIL <StarMark size={13} />
        </p>
        <div className="wobbly hatch lantern-pool border-2 border-violet/60 bg-cream p-6 text-center shadow-card">
          <div className="flex justify-center">
            <SigilGlyph spec={spec} size={120} bloom />
          </div>
          <p className="mt-2 font-display text-lg leading-tight text-violet">
            {l.name}
          </p>
          <p className="mt-1 text-sm italic text-ink-soft">{l.epigraph}</p>
          <p className="wobbly-sm mt-4 inline-block border border-violet/50 bg-paper-deep px-3 py-1 text-xs">
            inked into the spellbook, forever
          </p>
          <PlankBeat
            dreamName={dreamName}
            planksLaid={planksLaid}
            remaining={remaining}
            golden
          />
        </div>
        <p className="mt-3 text-center text-xs text-cream/90">
          tap anywhere to continue
        </p>
      </div>
    </div>
  );
}
