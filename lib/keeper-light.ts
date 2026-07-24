// A KEEPER'S LIGHT — the hue their side of the world is lit in.
//
// Today a bond ships two: moss (a green light) and ember (an auburn one). They
// are NOT the same thing as the `Slot` they're attached to. A slot is a seat —
// which side of the mantle you stand on, what the `bond_id + slot` rows mean —
// and it keeps its id forever, the way the `pet` table kept its name. A light is
// a CHOICE, and the roster below is meant to grow: the app is a lighthouse, and
// picking the color of your light is the most on-theme customization it has.
// (Direction, 2026-07-24: keepers become selectable across lights, archetypes
// and styles. Not a priority — but nothing should be written that forecloses it,
// which is why every keeper hue resolves through this one module.)
//
// THE RULE THAT SURVIVES CUSTOMIZATION: violet is the UNION's color and is never
// choosable (BRAND-BIBLE — its scarcity is what makes the union sacred). A user
// picks the two lights that meet; they never pick the color of the meeting.

import type { Slot } from "@/lib/auth";

export type KeeperLightId = "moss" | "ember";

export type KeeperLight = {
  id: KeeperLightId;
  /** what a keeper would call it when choosing — never shown as an identity */
  label: string;
  /** the robe / body fill */
  main: string;
  /** the lit face of it — highlights, the side the fire catches */
  light: string;
  /** the deep of it — shadow, the seal's heavier band */
  deep: string;
};

export const KEEPER_LIGHTS: Record<KeeperLightId, KeeperLight> = {
  moss: { id: "moss", label: "moss", main: "#5b6b3c", light: "#7c8a4d", deep: "#4f5d34" },
  ember: { id: "ember", label: "ember", main: "#8a4c33", light: "#c4704b", deep: "#7a4029" },
};

// Which light a seat carries when its keeper hasn't chosen one. When a chosen
// light lands (a `profiles.light` column), it arrives as the second argument and
// nothing else in the app has to move.
const DEFAULT_FOR_SLOT: Record<Slot, KeeperLightId> = {
  moss: "moss",
  ember: "ember",
};

export function isKeeperLight(v: string | null | undefined): v is KeeperLightId {
  return v === "moss" || v === "ember";
}

export function lightFor(slot: Slot, chosen?: string | null): KeeperLight {
  return KEEPER_LIGHTS[isKeeperLight(chosen) ? chosen : DEFAULT_FOR_SLOT[slot]];
}
