// The Hearth Room — the scene, in three planes.
//
// FAR (the room shell) and MID (the furniture of a shared life) are the proto's
// bespoke hero art, injected verbatim from hearth-svg.ts (raw SVG, the same
// pattern as components/sigil/glyphs.ts). HEART is authored here as JSX so it
// can carry the ONE living thing — the seal — wired to the real engine
// (composeSeal), inside the proto's emanation (the halo, the shafts of light,
// the press-bloom). See hearth-room.tsx for the composition + interaction.

import { HEARTH_DEFS, HEARTH_FAR, HEARTH_MID } from "./hearth-svg";

/** Shared gradients + clip-paths, rendered once atop the scene SVG. */
export function HearthDefs() {
  return <defs dangerouslySetInnerHTML={{ __html: HEARTH_DEFS }} />;
}

/** The room itself — walls, floor, the two windows, the stair to the lamp,
 *  the chimney-breast + star-chart, the mantle + fire, the apothecary. */
export function HearthFar() {
  return <g dangerouslySetInnerHTML={{ __html: HEARTH_FAR }} />;
}

/** The furniture of a shared life — the writing desk, the round table + orrery,
 *  the two keepers flanking the mantle, and the antlered fox on the warm stone. */
export function HearthMid() {
  return <g dangerouslySetInnerHTML={{ __html: HEARTH_MID }} />;
}

/** The heart — the seal that cannot close alone, raised over the open book and
 *  spilling violet light into the room. The proto's hand-drawn ring is replaced
 *  by the real composed seal (passed in as `sealHtml`); the halo, the shafts,
 *  and the press-bloom are the proto's emanation, preserved. */
export function HearthHeart({
  sealHtml,
  bloom,
  seal = 330,
}: {
  sealHtml: string;
  bloom: boolean;
  /** the seal's footprint in scene units (240-canvas scaled to fit). */
  seal?: number;
}) {
  return (
    <>
      {/* shafts of the seal's light — down onto the open book, up toward the lamp */}
      <polygon points="462,652 538,652 566,876 434,876" fill="url(#shaftDn)" />
      <polygon points="472,556 528,556 518,378 482,378" fill="url(#shaftUp)" />

      <g
        className="hearth-breathe"
        style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
      >
        <circle
          className="hearth-halo"
          cx={500}
          cy={600}
          r={250}
          fill="url(#haloG)"
        />
        <circle cx={500} cy={600} r={150} fill="url(#coreG)" />
        {/* a warm hand pressed near the seal blooms the ring — and still it waits */}
        <circle
          className={`hearth-bloomring${bloom ? " on" : ""}`}
          cx={500}
          cy={600}
          r={195}
          fill="url(#haloG)"
        />
        {/* the real seal, awaiting: one keeper's half is set, the other still soft */}
        <svg
          x={500 - seal / 2}
          y={600 - seal / 2}
          width={seal}
          height={seal}
          viewBox="0 0 240 240"
          overflow="visible"
          dangerouslySetInnerHTML={{ __html: sealHtml }}
        />
      </g>
    </>
  );
}
