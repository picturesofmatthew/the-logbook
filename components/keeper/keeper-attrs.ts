// THE MANTLE ATTRIBUTES — the elected character, at hearth scale.
//
// The hearth's two keepers are hand-drawn robed figures (114 × 351 scene units,
// `hearth-svg.ts`); the 8 archetypes are square figures in a 120 box
// (`keeper-glyph.tsx`), so the glyph can't stand in for the figure. Instead each
// archetype contributes an ADDITIVE overlay — the smith's hammer and anvil, the
// navigator's sextant — drawn in the moss keeper's own scene coordinates and
// laid over the figure. The ember side reuses the same fragment inside the
// mirror transform the hearth art already applies, so one drawing serves both.
//
// Same contract as the rest of the Inklight layer (`foxSvg`, `keeperSvg`,
// `composeSeal`): a PURE composer returning inner SVG markup, deterministic and
// SSR-safe, swappable for a hand-drawn master.

import { KEEPER_ARCHETYPES, type KeeperArchetype } from "./keeper-glyph";

// Each keeper's robe color, for attributes that need to match the cloth they
// hang on. Fragments opt in with the {{ROBE}} / {{ROBE_LIGHT}} tokens.
const ROBE = {
  moss: { main: "#5b6b3c", light: "#7c8a4d" },
  ember: { main: "#8a4c33", light: "#c4704b" },
} as const;

export type KeeperSide = keyof typeof ROBE;

// ── SWAPPABLE: the eight attributes, in hearth scene coordinates ──
// Landmarks they hang on: the hand at (365, 918), the shoulder near (322, 870),
// the waist cord at y≈1012, the hem/ground at y≈1192.
export const KEEPER_ATTRS: Record<KeeperArchetype, string> = {
  scholar: "",
  athlete: "",
  wanderer: "",
  tender: "",
  mystic: "",
  forager: "",
  smith: "",
  navigator: "",
};

export function isKeeperArchetype(v: string | null): v is KeeperArchetype {
  return v != null && KEEPER_ARCHETYPES.some((a) => a.id === v);
}

// An elected character + which side of the mantle they keep → the overlay
// markup. Unknown or unelected characters draw nothing: the mantle simply keeps
// the two robed figures it has always had.
export function keeperAttrSvg(
  character: string | null,
  side: KeeperSide,
): string {
  if (!isKeeperArchetype(character)) return "";
  const robe = ROBE[side];
  return KEEPER_ATTRS[character]
    .replaceAll("{{ROBE_LIGHT}}", robe.light)
    .replaceAll("{{ROBE}}", robe.main);
}
