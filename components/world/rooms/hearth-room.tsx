"use client";

// The Hearth Room — the first real room, composed THROUGH the World Engine.
//
// This is the whole cost of a room once the engine exists: a Room object (its
// three art layers + an atmosphere config + a hotspot + lore), a representative
// bit of game state (the seal's SigilSpec), and one interaction (press the seal
// → a bloom + a spark of motes). Everything else — the stage, the parallax, the
// canvas breath, the reduced-motion path — is inherited from RoomStage.

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { composeSeal } from "@/components/sigil/glyphs";
import type { SigilSpec } from "@/lib/engine/sigil";
import type { AtmosphereHandle } from "../atmosphere-config";
import { RoomStage } from "../room-stage";
import type { Hotspot, Room } from "../room";
import { HEARTH_ATMOSPHERE } from "./hearth-atmosphere";
import { HearthDefs, HearthFar, HearthHeart, HearthMid } from "./hearth-scene";

// A plausible not-yet-both-logged day: one keeper (moss) has set their half —
// a nourishing day, and they lifted — while the other's is still soft. The real
// engine renders this exactly as it renders a live day; when the second hand
// presses, the same seal closes with real chords + tier. Swap this for the live
// SigilSpec (composeSigil off the bond's day) when the room joins the data loop.
const AWAITING_SPEC: SigilSpec = {
  completed: false,
  moss: { inked: true, weight: "even" }, // Matthew's half is set
  ember: { inked: false, weight: "open" }, // Kennedy's half, still awaiting
  radicals: ["produce", "grains", "protein"],
  ornaments: ["push"],
  newMark: false,
  chords: [],
  legendary: null,
  tier: "open",
  seed: 20260722,
  moon: false,
  water: false,
  lowMood: false,
};

// composed once — ground:"none" drops the seal's own dark cartouche so it
// floats in the room's warm violet halo instead of a pasted-on medallion.
const AWAITING_SEAL = composeSeal(AWAITING_SPEC, { ground: "none" });

const SEAL_HOTSPOT: Hotspot = {
  id: "seal",
  x: 500,
  y: 600,
  r: 175,
  label: "the day's seal",
};

const HEARTH_ARIA =
  "A warm lamplit hearth-hall at the base of a lighthouse, at night. Two hooded " +
  "keepers — one moss-green, one ember-terracotta — flank a stone mantle where an " +
  "open spellbook raises a slowly breathing luminous seal, its moss half set and " +
  "its ember half still soft, awaiting the second hand. An arctic fox with small " +
  "antlers sleeps on the hearthstone. A west window looks onto a dusk garden; an " +
  "east window onto a starlit sea with a tiny gold shore on the horizon. A spiral " +
  "stair climbs into warm shadow toward the lamp above.";

export function HearthRoom() {
  const atmo = useRef<AtmosphereHandle>(null);
  const bloomTimer = useRef<number | undefined>(undefined);
  const [bloom, setBloom] = useState(false);

  const onScenePress = useCallback(
    (_pt: { x: number; y: number }, hit: Hotspot | null) => {
      if (!hit) return;
      // press a warm hand near the seal: it blooms, and a few motes spark — and
      // still it waits (the seal cannot close alone; this is a touch, not a log)
      atmo.current?.burst(500, 600, "sigil", 12);
      setBloom(true);
      window.clearTimeout(bloomTimer.current);
      bloomTimer.current = window.setTimeout(() => setBloom(false), 240);
    },
    [],
  );

  const room: Room = useMemo(
    () => ({
      id: "hearth",
      viewBox: { width: 1000, height: 1500 },
      atmosphere: HEARTH_ATMOSPHERE,
      defs: <HearthDefs />,
      hotspots: [SEAL_HOTSPOT],
      ariaLabel: HEARTH_ARIA,
      inscription: {
        eyebrow: "Hearth Hall · the day unsealed",
        line: "the wax is warm whenever you're ready — both of you.",
      },
      layers: {
        far: <HearthFar />,
        mid: <HearthMid />,
        heart: <HearthHeart sealHtml={AWAITING_SEAL} bloom={bloom} />,
      },
    }),
    [bloom],
  );

  return (
    <RoomStage room={room} atmosphereRef={atmo} onScenePress={onScenePress} className="hearth-room">
      <Link href="/" className="world-exit" aria-label="Return to the glade">
        <span aria-hidden>❮</span> the glade
      </Link>
    </RoomStage>
  );
}
