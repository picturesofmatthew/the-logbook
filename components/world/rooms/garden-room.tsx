"use client";

// The Garden — west — the living present (THE-LIGHTHOUSE.md).
//
// The island's PRESENT pole, opposite the Docks' far future. Revamped straight
// onto the engine: it renders the REAL glade — the same GladeScene the home grew
// (vitality tiers, the firepit, the beings in their zones, the keepers'
// lanterns) plus the real familiar over it. It is the one room lit by NOW: the
// glade rides the app's light-script (morning / dusk / night), so the Garden
// breathes with the actual day while the interiors stay timeless night.

import { FamiliarGlyph } from "@/components/familiar/familiar-glyph";
import { GladeScene, type BeingStages } from "@/components/glade/glade-scene";
import type { GladeTier } from "@/lib/engine/glade";
import { stageForDays } from "@/lib/engine/familiar";

export type GardenSnapshot = {
  tier: GladeTier;
  beings: BeingStages;
  familiarStage: ReturnType<typeof stageForDays>;
  familiarName: string | null;
  /** keepers who inscribed today's page — inklings gather at the book */
  inklings: number;
  hearthDay: boolean;
  mossLit: boolean;
  emberLit: boolean;
  paleElk: boolean;
};

export function GardenRoom({ snapshot }: { snapshot: GardenSnapshot }) {
  const {
    tier,
    beings,
    familiarStage,
    familiarName,
    inklings,
    hearthDay,
    mossLit,
    emberLit,
    paleElk,
  } = snapshot;

  return (
    <div
      className="garden-room"
      role="img"
      aria-label={`The garden west of the hearth — the living glade, ${tier}, with the familiar and the beings that keep it.`}
    >
      {/* the glade, skyless, at the foot — the room's own sky is painted behind
          it with the same light vars, so the two meet without a seam */}
      <div className="garden-band">
        <GladeScene
          skyless
          tier={tier}
          beings={beings}
          paleElk={paleElk}
          inklings={inklings}
          hearthDay={hearthDay}
          mossLit={mossLit}
          emberLit={emberLit}
        />
        <div className="garden-fox">
          <FamiliarGlyph
            stage={familiarStage}
            size={88}
            className="idle-bounce"
            title={`${familiarName ?? "the fox"}, a ${familiarStage} — the glade is ${tier}`}
          />
        </div>
      </div>
    </div>
  );
}
