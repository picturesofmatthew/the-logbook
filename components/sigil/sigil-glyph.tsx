// The sigil, drawn. A thin renderer over the swappable parts registry in
// ./glyphs — composeSeal turns a SigilSpec into layered SVG markup, so every
// mark (a hall's rune, a lift, the core, the frame) can be swapped or upgraded
// from one place. Deterministic + pure: same spec → same seal, so server and
// client render identically.

import type { SigilSpec } from "@/lib/engine/sigil";
import { composeSeal } from "./glyphs";

export function SigilGlyph({
  spec,
  size = 96,
  bloom = false,
}: {
  spec: SigilSpec;
  size?: number;
  bloom?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      role="img"
      aria-label={
        spec.completed
          ? `The day's seal, ${spec.tier}`
          : "The day's seal, still open"
      }
      dangerouslySetInnerHTML={{ __html: composeSeal(spec, { bloom }) }}
    />
  );
}
