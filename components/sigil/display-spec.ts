// Display-only sigil specs — a seal drawn as ART rather than as a day.
//
// The brand's face is the seal, not the familiar (the fox is the bond's resident
// creature; it was never the mark). Pre-account surfaces and the compendium need
// a seal to show before there is a day to compose one from, so they compose a
// spec by hand here. Nothing derived from this is ever recorded — no discovery,
// no ledger — it is a picture of a seal, seeded so it is stable across renders.

import type { LegendaryId, SigilSpec } from "@/lib/engine/sigil";

export function legendarySpec(id: LegendaryId): SigilSpec {
  let seed = 0;
  for (const ch of id) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  return {
    completed: true,
    moss: { inked: true, weight: "even" },
    ember: { inked: true, weight: "even" },
    radicals: [],
    ornaments: [],
    newMark: false,
    chords: [],
    legendary: id,
    tier: "legendary",
    seed,
    moon: false,
    water: false,
    lowMood: false,
  };
}
