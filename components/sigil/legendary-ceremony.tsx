"use client";

// The first-discovery ceremony. The server only renders this on the request
// that actually claimed the discovery row, so it fires exactly once, ever,
// per legendary — the moment it is first earned.

import { useEffect, useState } from "react";
import { LEGENDARIES, type LegendaryId, type SigilSpec } from "@/lib/engine/sigil";
import { legendaryTone } from "@/lib/sounds";
import { StarMark } from "@/components/glyphs";
import { SigilGlyph } from "./sigil-glyph";

export function LegendaryCeremony({
  legendary,
  spec,
}: {
  legendary: LegendaryId;
  spec: SigilSpec;
}) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    legendaryTone();
  }, []);
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
        <p className="mb-3 flex items-center justify-center gap-2 font-pixel text-sm tracking-widest text-violet-bright">
          <StarMark size={13} /> A LEGENDARY SIGIL <StarMark size={13} />
        </p>
        <div className="wobbly hatch lantern-pool border-2 border-violet/60 bg-cream p-6 text-center shadow-card">
          <div className="flex justify-center">
            <SigilGlyph spec={spec} size={120} bloom />
          </div>
          <p className="mt-2 font-pixel text-lg leading-tight text-violet">
            {l.name}
          </p>
          <p className="mt-1 text-sm italic text-ink-soft">{l.epigraph}</p>
          <p className="wobbly-sm mt-4 inline-block border border-violet/50 bg-paper-deep px-3 py-1 text-xs">
            inked into the spellbook, forever
          </p>
        </div>
        <p className="mt-3 text-center text-xs text-cream/90">
          tap anywhere to continue
        </p>
      </div>
    </div>
  );
}
