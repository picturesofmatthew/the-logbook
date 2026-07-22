// The Seal — a swappable parts registry.
//
// Iron-Man rule: every visual element of the sigil is an independently
// swappable module here — a hall's rune, a lift's ornament, a nature-core, the
// frame, the band, the crown. To upgrade or fix a design, replace ONE entry;
// the composer (`composeSeal`) assembles from these, so nothing else changes.
// The engine (`lib/engine/sigil.ts`) decides WHAT a day is; this file decides
// how it is DRAWN. Parts return SVG-markup strings on a 240×240 canvas.
//
// The seal carries its own DARK CARTOUCHE (a vignetted teal-ink medallion) so
// the gold and the glow read on any surface — matching the north-star
// reference (art/reference/hero-sigil.png). Structure, outer → inner:
//   frame (ornate gold plate) → air → the fat braided band (moss + ember) →
//   the dark middle field (carved runes + lift ornaments float here) →
//   the bright star-cartouche (the compass core + chord-studs) → the crown gem.

import type { SigilSpec, ChordId, LegendaryId } from "@/lib/engine/sigil";
import type { Hall } from "@/lib/halls";
import type { SplitFamily } from "@/lib/engine/training";

// ── palette (mirrors globals.css tokens + the dark medallion) ──
const P = {
  paper: "#f5eddc", paperDeep: "#ece0c6", cream: "#fbf6ea", ink: "#4a3b2a", inkSoft: "#7a6a52",
  moss: "#7c8a4d", mossDeep: "#5b6b3c", mossLit: "#98a664", terra: "#c4704b", terraDeep: "#a85838", terraLit: "#d68a63",
  gold: "#d9a441", goldSoft: "#ecd9a8", goldDeep: "#9c7526", lipGold: "#f6e8bf",
  violet: "#8d7aa8", violetDeep: "#453a54", violetBright: "#c9b3e3",
  pine: "#4f5c3e", mist: "#9aa88f", // calm earth-greens for the still-water legendary
  // the dark cartouche the seal floats in
  groundMid: "#3b4f52", groundEdge: "#243638", groundCore: "#42585a", flake: "#243638",
};

const CX = 120, CY = 120;
// geometry — one ladder of radii, tuned to the reference proportions
const R_MEDAL = 118;   // the dark cartouche disc
const R_FRAME_OUT = 112, R_FRAME_IN = 104, R_FRAME_NODE = 108;
const R_BAND_OUT = 92; // the fat braided band's outer edge
const BAND_W: Record<string, number> = { open: 9, lean: 18, even: 24, feast: 28 };
const R_CART = 38;     // the bright star-cartouche
const R_RUNE = 57;     // outer field ring — food halls + training lifts (what you did)
const R_CHORD = 47;    // inner field ring — chord-runes (how you're in sync)

const f = (n: number) => n.toFixed(2);
const polar = (r: number, d: number): [number, number] => [
  CX + r * Math.sin((d * Math.PI) / 180),
  CY - r * Math.cos((d * Math.PI) / 180),
];
function rng(seed: number) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
function starPath(cx: number, cy: number, outer: number, inner: number, pts: number) {
  const n = pts * 2;
  let d = "";
  for (let i = 0; i < n; i++) {
    const r = i % 2 ? inner : outer, a = (i / n) * 360;
    d += (i ? "L" : "M") + f(cx + r * Math.sin((a * Math.PI) / 180)) + " " + f(cy - r * Math.cos((a * Math.PI) / 180)) + " ";
  }
  return d + "Z";
}
// a full semicircle band (one keeper's half): "left" = moss, "right" = ember
function halfBand(side: "left" | "right", innerR: number, outerR: number) {
  const [otx, oty] = polar(outerR, 0), [obx, oby] = polar(outerR, 180);
  const [itx, ity] = polar(innerR, 0), [ibx, iby] = polar(innerR, 180);
  const oS = side === "left" ? 0 : 1, iS = side === "left" ? 1 : 0;
  return `M ${f(otx)} ${f(oty)} A ${outerR} ${outerR} 0 0 ${oS} ${f(obx)} ${f(oby)} L ${f(ibx)} ${f(iby)} A ${innerR} ${innerR} 0 0 ${iS} ${f(itx)} ${f(ity)} Z`;
}
// a partial arc band between two angles (for the braid crossover at the seam)
function arcBand(a0: number, a1: number, innerR: number, outerR: number) {
  const [ox0, oy0] = polar(outerR, a0), [ox1, oy1] = polar(outerR, a1);
  const [ix1, iy1] = polar(innerR, a1), [ix0, iy0] = polar(innerR, a0);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0, sweep = a1 > a0 ? 1 : 0;
  return `M ${f(ox0)} ${f(oy0)} A ${outerR} ${outerR} 0 ${large} ${sweep} ${f(ox1)} ${f(oy1)} L ${f(ix1)} ${f(iy1)} A ${innerR} ${innerR} 0 ${large} ${1 - sweep} ${f(ix0)} ${f(iy0)} Z`;
}

type Glyph = (x: number, y: number, s: number) => string;

// ── SWAPPABLE: hall runes — "what fed you" ──
export const HALL_GLYPHS: Record<Hall, Glyph> = {
  protein: (x, y, s) => `<path d="M ${x} ${y - s} L ${x} ${y + s * 0.55} M ${x - s * 0.62} ${y - s * 0.5} L ${x + s * 0.62} ${y - s * 0.5} M ${x - s * 0.8} ${y + s * 0.05} A ${s * 0.8} ${s * 0.8} 0 0 0 ${x + s * 0.8} ${y + s * 0.05}"/><circle cx="${x}" cy="${y - s}" r="${s * 0.2}" fill="currentColor" stroke="none"/>`,
  produce: (x, y, s) => `<path d="M ${x} ${y + s} L ${x} ${y - s * 0.5}"/><path d="M ${x} ${y - s * 0.05} q ${-s} ${-s * 0.45} ${-s * 0.15} ${-s * 1.05} q ${s * 0.85} ${s * 0.1} ${s * 0.15} ${s * 1.05}"/><path d="M ${x} ${y + s * 0.2} q ${s} ${-s * 0.4} ${s * 0.15} ${-s * 0.95} q ${-s * 0.85} ${s * 0.12} ${-s * 0.15} ${s * 0.95}"/>`,
  grains: (x, y, s) => `<path d="M ${x} ${y + s} L ${x} ${y - s}"/><path d="M ${x} ${y - s * 0.55} l ${s * 0.55} ${-s * 0.32} M ${x} ${y - s * 0.55} l ${-s * 0.55} ${-s * 0.32} M ${x} ${y - s * 0.05} l ${s * 0.55} ${-s * 0.32} M ${x} ${y - s * 0.05} l ${-s * 0.55} ${-s * 0.32} M ${x} ${y + s * 0.45} l ${s * 0.55} ${-s * 0.32} M ${x} ${y + s * 0.45} l ${-s * 0.55} ${-s * 0.32}"/>`,
  dairy: (x, y, s) => `<path d="M ${x + s * 0.55} ${y - s * 0.75} a ${s} ${s} 0 1 0 ${s * 0.05} ${s * 1.6} a ${s * 0.72} ${s * 0.72} 0 1 1 ${-s * 0.05} ${-s * 1.6} Z"/>`,
  snacks: (x, y, s) => `<circle cx="${x}" cy="${y - s * 0.55}" r="${s * 0.34}" fill="currentColor" stroke="none"/><circle cx="${x - s * 0.6}" cy="${y + s * 0.45}" r="${s * 0.34}" fill="currentColor" stroke="none"/><circle cx="${x + s * 0.6}" cy="${y + s * 0.45}" r="${s * 0.34}" fill="currentColor" stroke="none"/>`,
  sweets: (x, y, s) => `<path d="M ${x} ${y - s} L ${x} ${y + s} M ${x - s} ${y} L ${x + s} ${y} M ${x - s * 0.7} ${y - s * 0.7} L ${x + s * 0.7} ${y + s * 0.7} M ${x - s * 0.7} ${y + s * 0.7} L ${x + s * 0.7} ${y - s * 0.7}"/>`,
  drinks: (x, y, s) => `<path d="M ${x - s} ${y - s * 0.2} q ${s * 0.5} ${-s * 0.7} ${s} 0 t ${s} 0 M ${x - s} ${y + s * 0.5} q ${s * 0.5} ${-s * 0.7} ${s} 0 t ${s} 0"/>`,
  dishes: (x, y, s) => `<path d="M ${x - s} ${y - s * 0.2} L ${x + s} ${y - s * 0.2} M ${x - s * 0.85} ${y - s * 0.2} a ${s * 0.85} ${s * 0.85} 0 0 0 ${s * 1.7} 0"/><path d="M ${x - s * 0.2} ${y - s * 0.7} q ${s * 0.2} ${s * 0.25} 0 ${s * 0.45} M ${x + s * 0.2} ${y - s * 0.75} q ${s * 0.2} ${s * 0.25} 0 ${s * 0.45}"/>`,
};

// ── SWAPPABLE: lift ornaments — "how you moved" ──
export const LIFT_GLYPHS: Record<SplitFamily, Glyph> = {
  push: (x, y, s) => `<path d="M ${x - s * 0.5} ${y - s} L ${x - s * 0.5} ${y + s} M ${x + s * 0.5} ${y - s} L ${x + s * 0.5} ${y + s}"/>`,
  pull: (x, y, s) => `<path d="M ${x - s * 0.6} ${y - s} q ${-s * 0.5} ${s} ${s * 0.5} ${s * 1.4} M ${x + s * 0.6} ${y - s} q ${s * 0.5} ${s} ${-s * 0.5} ${s * 1.4}"/>`,
  legs: (x, y, s) => `<path d="M ${x} ${y - s} L ${x} ${y + s * 0.1} M ${x} ${y + s * 0.1} L ${x - s * 0.7} ${y + s} M ${x} ${y + s * 0.1} L ${x + s * 0.7} ${y + s}"/>`,
  full: (x, y, s) => `<path d="M ${x} ${y - s} L ${x + s} ${y} L ${x} ${y + s} L ${x - s} ${y} Z"/>`,
  cardio: (x, y, s) => `<path d="M ${x - s} ${y} a ${s} ${s} 0 1 1 ${s} ${s * 0.9} a ${s * 0.5} ${s * 0.5} 0 1 1 ${-s * 0.5} ${-s * 0.5}"/>`,
  mobility: (x, y, s) => `<path d="M ${x - s} ${y + s * 0.5} q ${s} ${-s * 1.4} ${s * 2} 0"/>`,
  rest: (x, y, s) => `<path d="M ${x - s} ${y} L ${x + s} ${y}"/>`,
};

// ── SWAPPABLE: chord-runes — cohesion made legible. Each chord the two of you
//    strike together inscribes its OWN mark on the seal (canon: THE-SIGIL-TURN).
//    Reading the seal becomes reading how you were in sync. ──
export const CHORD_GLYPHS: Record<ChordId, Glyph> = {
  // both under target — a downward chevron (leanness)
  lean: (x, y, s) => `<path d="M ${x - s} ${y - s * 0.4} L ${x} ${y + s * 0.6} L ${x + s} ${y - s * 0.4}"/>`,
  // both hit protein — a dumbbell (iron)
  iron: (x, y, s) => `<path d="M ${x - s} ${y} L ${x + s} ${y} M ${x - s} ${y - s * 0.55} L ${x - s} ${y + s * 0.55} M ${x + s} ${y - s * 0.55} L ${x + s} ${y + s * 0.55}"/>`,
  // same split, same day — twin bars
  "twin-split": (x, y, s) => `<path d="M ${x - s * 0.42} ${y - s} L ${x - s * 0.42} ${y + s} M ${x + s * 0.42} ${y - s} L ${x + s * 0.42} ${y + s}"/>`,
  // both lifted — an anvil (a bar over a block)
  anvil: (x, y, s) => `<path d="M ${x - s} ${y - s * 0.25} L ${x + s} ${y - s * 0.25} M ${x - s * 0.4} ${y - s * 0.25} L ${x - s * 0.4} ${y + s * 0.7} L ${x + s * 0.4} ${y + s * 0.7} L ${x + s * 0.4} ${y - s * 0.25}"/>`,
  // both did cardio — a winding road
  "long-road": (x, y, s) => `<path d="M ${x - s} ${y + s * 0.3} q ${s * 0.5} ${-s} ${s} 0 q ${s * 0.5} ${s} ${s} 0"/>`,
  // both watered — a water drop
  spring: (x, y, s) => `<path d="M ${x} ${y - s} q ${s * 0.72} ${s * 0.9} 0 ${s * 1.7} q ${-s * 0.72} ${-s * 0.8} 0 ${-s * 1.7} Z"/>`,
  // both ate from the earth — a sprouting leaf
  green: (x, y, s) => `<path d="M ${x} ${y + s} L ${x} ${y - s * 0.25} M ${x} ${y - s * 0.05} q ${-s * 0.78} ${-s * 0.3} ${-s * 0.58} ${-s} q ${s * 0.72} ${s * 0.08} ${s * 0.58} ${s}"/>`,
  // both cooked — a hearth flame
  hearth: (x, y, s) => `<path d="M ${x} ${y + s} q ${-s * 0.78} ${-s * 0.35} ${-s * 0.42} ${-s} q ${-s * 0.04} ${s * 0.42} ${s * 0.26} ${s * 0.36} q ${s * 0.26} ${-s * 0.46} ${-s * 0.06} ${-s} q ${s * 0.86} ${s * 0.46} ${s * 0.5} ${s * 1.34} q ${-s * 0.16} ${s * 0.4} ${-s * 0.3} ${s * 0.3}"/>`,
  // the same mood, twice — two facing arcs
  mirror: (x, y, s) => `<path d="M ${x - s * 0.15} ${y - s} q ${-s * 0.68} ${s} 0 ${s * 2} M ${x + s * 0.15} ${y - s} q ${s * 0.68} ${s} 0 ${s * 2}"/>`,
  // both wrote it down — a quill nib
  scribe: (x, y, s) => `<path d="M ${x - s * 0.7} ${y + s} L ${x + s * 0.6} ${y - s * 0.8} M ${x + s * 0.18} ${y - s * 0.34} L ${x + s * 0.9} ${y - s * 0.5}"/>`,
  // a record fell — a spark star
  "new-mark": (x, y, s) => `<path d="${starPath(x, y, s, s * 0.38, 4)}"/>`,
  // two records, one day — twin peaks
  "twin-peaks": (x, y, s) => `<path d="M ${x - s} ${y + s * 0.6} L ${x - s * 0.45} ${y - s * 0.5} L ${x + s * 0.1} ${y + s * 0.25} M ${x - s * 0.1} ${y + s * 0.25} L ${x + s * 0.45} ${y - s * 0.5} L ${x + s} ${y + s * 0.6}"/>`,
};

// ── SWAPPABLE: nature cores — the day's character, at the cartouche center ──
export type Nature = "star" | "effort" | "nourish" | "vigil" | "rest";
type Core = (cx: number, cy: number, line: string, fill: string, pts: number, z: number) => string;
const strk = (line: string) => `stroke="${line}" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"`;
export const NATURE_CORES: Record<Nature, Core> = {
  star: (cx, cy, line, fill, pts, z) => `<path d="${starPath(cx, cy, 9 * z, 3.4 * z, pts || 8)}" fill="${fill}" ${strk(line)}/><circle cx="${cx}" cy="${cy}" r="${1.7 * z}" fill="${line}"/>`,
  effort: (cx, cy, line, fill, _pts, z) => `<path d="${starPath(cx, cy, 9 * z, 3.2 * z, 6)}" fill="${fill}" ${strk(line)}/><circle cx="${cx}" cy="${cy}" r="${2 * z}" fill="${line}"/>`,
  nourish: (cx, cy, line, _fill, _pts, z) => `<g fill="none" ${strk(line)}><path d="M ${cx} ${cy + 8 * z} L ${cx} ${cy - 7 * z}"/><path d="M ${cx} ${cy - 2 * z} q ${-7 * z} ${-4 * z} ${-2.5 * z} ${-8.5 * z} q ${6 * z} ${1 * z} ${2.5 * z} ${8.5 * z}"/><path d="M ${cx} ${cy} q ${7 * z} ${-3.5 * z} ${2.5 * z} ${-8 * z} q ${-6 * z} ${1 * z} ${-2.5 * z} ${8 * z}"/></g>`,
  vigil: (cx, cy, line, fill, _pts, z) => `<path d="M ${cx + 4 * z} ${cy - 7 * z} a ${8 * z} ${8 * z} 0 1 0 ${0.5 * z} ${14 * z} a ${6 * z} ${6 * z} 0 1 1 ${-0.5 * z} ${-14 * z} Z" fill="${fill}" ${strk(line)}/>`,
  rest: (cx, cy, line, fill, _pts, z) => `<circle cx="${cx}" cy="${cy}" r="${8 * z}" fill="${fill}" ${strk(line)}/><path d="M ${cx - 5.5 * z} ${cy} q ${2.7 * z} ${-3 * z} ${5.5 * z} 0 t ${5.5 * z} 0" fill="none" ${strk(line)}/>`,
};

// ── SWAPPABLE: legendary faces — each named legendary gets its OWN emblem at
//    the cartouche center + its own color cast (the field/glow), instead of
//    sharing the 5 nature-cores and a uniform violet. `cast` tints the dark
//    medallion + field; `glow` is the luminous halo; `core` is the emblem. ──
type LegCore = (cx: number, cy: number, line: string, fill: string, z: number) => string;
type LegendaryFace = { cast: string; glow: string; core: LegCore };
export const LEGENDARY_FACES: Record<LegendaryId, LegendaryFace> = {
  // The First Page — an open book: the day the record began. Gilt.
  "first-page": {
    cast: P.goldDeep, glow: P.goldSoft,
    core: (cx, cy, line, fill, z) => `<g fill="${fill}" ${strk(line)}><path d="M ${cx} ${cy - 5 * z} q ${-7 * z} ${-2.5 * z} ${-9 * z} ${0.5 * z} l 0 ${9 * z} q ${2 * z} ${-3 * z} ${9 * z} ${-0.5 * z} Z"/><path d="M ${cx} ${cy - 5 * z} q ${7 * z} ${-2.5 * z} ${9 * z} ${0.5 * z} l 0 ${9 * z} q ${-2 * z} ${-3 * z} ${-9 * z} ${-0.5 * z} Z"/></g><path d="M ${cx} ${cy - 5 * z} L ${cx} ${cy + 4 * z}" fill="none" ${strk(line)}/>`,
  },
  // The Quiet Moon — a full moon with craters. Violet night.
  "quiet-moon": {
    cast: P.violetDeep, glow: P.violetBright,
    core: (cx, cy, line, fill, z) => `<circle cx="${cx}" cy="${cy}" r="${7.5 * z}" fill="${fill}" ${strk(line)}/><circle cx="${cx - 2.5 * z}" cy="${cy - 2 * z}" r="${1.4 * z}" fill="none" ${strk(line)} opacity="0.55"/><circle cx="${cx + 2.8 * z}" cy="${cy + 1.6 * z}" r="${1 * z}" fill="none" ${strk(line)} opacity="0.55"/><circle cx="${cx + 0.4 * z}" cy="${cy + 3.6 * z}" r="${0.8 * z}" fill="none" ${strk(line)} opacity="0.55"/>`,
  },
  // The Twin Foxes — a paw print: the grind, honored. Earthy ember.
  "twin-foxes": {
    cast: P.terraDeep, glow: P.gold,
    core: (cx, cy, line, fill, z) => `<g fill="${fill}" ${strk(line)}><path d="M ${cx} ${cy + 5.5 * z} q ${-5 * z} ${-1 * z} ${-4 * z} ${-4.5 * z} q ${1 * z} ${-2 * z} ${4 * z} ${-0.5 * z} q ${3 * z} ${-1.5 * z} ${4 * z} ${0.5 * z} q ${1 * z} ${3.5 * z} ${-4 * z} ${4.5 * z} Z"/><circle cx="${cx - 4.2 * z}" cy="${cy - 2.6 * z}" r="${1.5 * z}"/><circle cx="${cx - 1.4 * z}" cy="${cy - 5 * z}" r="${1.5 * z}"/><circle cx="${cx + 1.4 * z}" cy="${cy - 5 * z}" r="${1.5 * z}"/><circle cx="${cx + 4.2 * z}" cy="${cy - 2.6 * z}" r="${1.5 * z}"/></g>`,
  },
  // The Twin Peaks — two summits, two stars: two records, one day. Cool night.
  "twin-peaks": {
    cast: P.violetDeep, glow: P.goldSoft,
    core: (cx, cy, line, fill, z) => `<path d="M ${cx - 7.5 * z} ${cy + 5 * z} L ${cx - 3 * z} ${cy - 4.5 * z} L ${cx + 1.5 * z} ${cy + 5 * z} Z" fill="${fill}" ${strk(line)}/><path d="M ${cx - 1.5 * z} ${cy + 5 * z} L ${cx + 3 * z} ${cy - 4.5 * z} L ${cx + 7.5 * z} ${cy + 5 * z} Z" fill="${fill}" ${strk(line)}/><path d="${starPath(cx - 3 * z, cy - 6.4 * z, 1.9 * z, 0.7 * z, 4)}" fill="${line}"/><path d="${starPath(cx + 3 * z, cy - 6.4 * z, 1.9 * z, 0.7 * z, 4)}" fill="${line}"/>`,
  },
  // The Green Cathedral — a tree: the clean day. Verdant.
  "green-cathedral": {
    cast: P.mossDeep, glow: P.mossLit,
    core: (cx, cy, line, fill, z) => `<path d="M ${cx} ${cy + 6 * z} L ${cx} ${cy - 1 * z}" fill="none" ${strk(line)}/><path d="M ${cx} ${cy - 6.5 * z} q ${-6 * z} ${2 * z} ${-5.2 * z} ${6 * z} q ${5.2 * z} ${1.5 * z} ${5.2 * z} ${-1 * z} q 0 ${2.5 * z} ${5.2 * z} ${1 * z} q ${0.8 * z} ${-4 * z} ${-5.2 * z} ${-6 * z} Z" fill="${fill}" ${strk(line)}/>`,
  },
  // The Long Road Home — a winding path to a marker: endurance, shared. Dusk.
  "long-road-home": {
    cast: P.terraDeep, glow: P.gold,
    core: (cx, cy, line, fill, z) => `<path d="M ${cx - 5 * z} ${cy + 6 * z} Q ${cx + 4 * z} ${cy + 3 * z} ${cx - 2 * z} ${cy - 1 * z} Q ${cx - 6 * z} ${cy - 4 * z} ${cx + 1.5 * z} ${cy - 5.5 * z}" fill="none" ${strk(line)}/><path d="M ${cx + 0.5 * z} ${cy - 7.6 * z} l ${4.5 * z} ${2.1 * z} l ${-4.5 * z} ${2.1 * z} Z" fill="${fill}" ${strk(line)}/>`,
  },
  // The Mirror at Dusk — a reflection axis, two facing arcs: timing as tenderness.
  "mirror-at-dusk": {
    cast: P.violetDeep, glow: P.violetBright,
    core: (cx, cy, line, fill, z) => `<path d="M ${cx} ${cy - 6 * z} L ${cx} ${cy + 6 * z}" fill="none" ${strk(line)} opacity="0.5"/><path d="M ${cx - 1.6 * z} ${cy - 5 * z} q ${-6 * z} ${5 * z} 0 ${10 * z}" fill="none" ${strk(line)}/><path d="M ${cx + 1.6 * z} ${cy - 5 * z} q ${6 * z} ${5 * z} 0 ${10 * z}" fill="none" ${strk(line)}/><circle cx="${cx - 4.2 * z}" cy="${cy}" r="${1.1 * z}" fill="${line}"/><circle cx="${cx + 4.2 * z}" cy="${cy}" r="${1.1 * z}" fill="${line}"/>`,
  },
  // The Still Water — three ripples: recovery is a discipline. Calm green.
  "still-water": {
    cast: P.pine, glow: P.mist,
    core: (cx, cy, line, fill, z) => `<g fill="none" ${strk(line)}><path d="M ${cx - 4 * z} ${cy - 3.5 * z} q ${2 * z} ${-2 * z} ${4 * z} 0 q ${2 * z} ${2 * z} ${4 * z} 0"/><path d="M ${cx - 6.5 * z} ${cy + 0.5 * z} q ${3.25 * z} ${-3 * z} ${6.5 * z} 0 q ${3.25 * z} ${3 * z} ${6.5 * z} 0"/><path d="M ${cx - 5.5 * z} ${cy + 4.5 * z} q ${2.75 * z} ${-2.6 * z} ${5.5 * z} 0 q ${2.75 * z} ${2.6 * z} ${5.5 * z} 0"/></g>`,
  },
  // The Ember Vigil — a candle kept burning: showing up on a hard day. Ember.
  "ember-vigil": {
    cast: P.terraDeep, glow: P.terraLit,
    core: (cx, cy, line, fill, z) => `<path d="M ${cx} ${cy + 6 * z} L ${cx} ${cy - 1 * z} M ${cx - 2.6 * z} ${cy + 6 * z} L ${cx + 2.6 * z} ${cy + 6 * z}" fill="none" ${strk(line)}/><path d="M ${cx} ${cy - 1 * z} q ${-3.6 * z} ${-2 * z} ${-1.8 * z} ${-5.6 * z} q ${-0.3 * z} ${2.3 * z} ${1.3 * z} ${1.9 * z} q ${1.4 * z} ${-2.6 * z} ${-0.3 * z} ${-5.6 * z} q ${4.6 * z} ${2.6 * z} ${2.7 * z} ${7.2 * z} q ${-0.8 * z} ${2 * z} ${-1.9 * z} ${1.7 * z} Z" fill="${fill}" ${strk(line)}/>`,
  },
  // The Feast Seal — a bowl of plenty: a feast together, celebrated. Gold.
  "feast-seal": {
    cast: P.goldDeep, glow: P.gold,
    core: (cx, cy, line, fill, z) => `<circle cx="${cx - 2.6 * z}" cy="${cy - 2.6 * z}" r="${1.9 * z}" fill="${fill}" ${strk(line)}/><circle cx="${cx + 2.6 * z}" cy="${cy - 2 * z}" r="${2.1 * z}" fill="${fill}" ${strk(line)}/><path d="M ${cx} ${cy - 3.6 * z} l 0 ${-3 * z} M ${cx} ${cy - 5.6 * z} l ${1.6 * z} ${1 * z} M ${cx} ${cy - 5.6 * z} l ${-1.6 * z} ${1 * z}" fill="none" ${strk(line)}/><path d="M ${cx - 6.5 * z} ${cy + 0.4 * z} a ${6.5 * z} ${6.5 * z} 0 0 0 ${13 * z} 0 Z" fill="${fill}" ${strk(line)}/><path d="M ${cx - 7.5 * z} ${cy + 0.4 * z} L ${cx + 7.5 * z} ${cy + 0.4 * z}" fill="none" ${strk(line)}/>`,
  },
};

// engrave a mark into the field: a dark cut beneath a lit lower lip
function etch(inner: string, main: string, lip: string) {
  return `<g transform="translate(0.4,0.9)" fill="none" stroke="${lip}" opacity="0.5">${inner}</g><g fill="none" stroke="${main}">${inner}</g>`;
}

// ── presentational modifiers derived from the spec (the engine doesn't expose
//    mood/moon/water directly; we read them off the chords & legendary until
//    those signals are wired into SigilSpec) ──
type NatureInfo = { nature: Nature; moon: boolean; water: boolean; lowMood: boolean };
const LEG_NATURE: Record<string, Nature> = {
  "quiet-moon": "vigil", "ember-vigil": "vigil", "green-cathedral": "nourish",
  "feast-seal": "nourish", "still-water": "rest", "twin-foxes": "effort",
  "long-road-home": "effort", "twin-peaks": "effort",
};
function natureFor(spec: SigilSpec): NatureInfo {
  const chords = spec.chords as readonly string[];
  const leg = spec.legendary as string | null;
  let nature: Nature = "star";
  if (leg) nature = LEG_NATURE[leg] ?? "star";
  else if (spec.ornaments.length) nature = "effort";
  else if (spec.radicals.includes("produce")) nature = "nourish";
  return { nature, moon: leg === "quiet-moon", water: chords.includes("spring"), lowMood: leg === "ember-vigil" || leg === "quiet-moon" };
}

// ── SWAPPABLE PART: the dark cartouche — the medallion the seal floats in ──
function medallion(rand: () => number, lit: boolean, legendary: boolean) {
  let s = `<circle cx="${CX}" cy="${CY}" r="${R_MEDAL}" fill="url(#medal-${SEED})"/>`;
  if (legendary) s += `<circle cx="${CX}" cy="${CY}" r="${R_MEDAL - 2}" fill="${LEG?.cast ?? P.violetDeep}" opacity="0.3"/>`;
  // gold flecks scattered on the ground, as in the reference
  const n = lit ? 26 : 14;
  for (let i = 0; i < n; i++) {
    const [x, y] = polar(R_BAND_OUT + 4 + rand() * (R_MEDAL - R_BAND_OUT - 4), rand() * 360);
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${(0.5 + rand() * 1.2).toFixed(2)}" fill="${P.gold}" opacity="${(0.18 + rand() * 0.4).toFixed(2)}"/>`;
  }
  return s;
}

// ── SWAPPABLE PART: the ornate gold frame — the grimoire plate ──
function ornateFrame(gold: string, op: number) {
  let s = `<g opacity="${op}" fill="none" stroke="${gold}"><circle cx="${CX}" cy="${CY}" r="${R_FRAME_OUT}" stroke-width="1.7"/><circle cx="${CX}" cy="${CY}" r="${R_FRAME_IN}" stroke-width="0.9" opacity="0.8"/>`;
  // star-boss nodes at the diagonals
  for (const a of [45, 135, 225, 315]) {
    const [x, y] = polar(R_FRAME_NODE, a);
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="4.6" fill="${P.groundEdge}" stroke="${gold}" stroke-width="1.2"/><circle cx="${f(x)}" cy="${f(y)}" r="2.1" fill="${gold}" stroke="none" opacity="0.9"/>`;
  }
  // a filigree clasp at the base, and a small mount flourish under the crown
  const [bx, by] = polar(R_FRAME_NODE, 180);
  s += `<path d="M ${f(bx - 7)} ${f(by - 2)} q 7 8 14 0" stroke-width="1.3"/><path d="M ${f(bx - 3.4)} ${f(by + 1.5)} q 3.4 -4 6.8 0" stroke-width="1"/>`;
  const [tx, ty] = polar(R_FRAME_NODE, 0);
  s += `<path d="M ${f(tx - 8)} ${f(ty + 3)} q 8 -7 16 0" stroke-width="1.1" opacity="0.85"/>`;
  return s + `</g>`;
}

// ── SWAPPABLE PART: the fat braided band (moss = Matthew, ember = Kennedy) ──
function braidedBand(spec: SigilSpec, gold: string, lit: boolean, legendary: boolean) {
  const mW = BAND_W[spec.moss.inked ? spec.moss.weight : "open"];
  const eW = BAND_W[spec.ember.inked ? spec.ember.weight : "open"];
  const mI = R_BAND_OUT - mW, eI = R_BAND_OUT - eW;
  // Legendary is stained glass: keep the fills SATURATED and add an inner
  // luminous glow (the "lit from within" read) — never wash the color out.
  const litRim = (side: "left" | "right", inner: number, glow: string) =>
    `<path d="${halfBand(side, inner + 2, R_BAND_OUT - 2)}" fill="none" stroke="${glow}" stroke-width="2.6" opacity="0.6" filter="url(#soft-${SEED})"/>`;
  let s = "";
  // moss half (left)
  if (spec.moss.inked) {
    s += `<path d="${halfBand("left", mI, R_BAND_OUT)}" fill="${P.moss}" stroke="${P.ink}" stroke-width="1"/>`;
    s += `<path d="${halfBand("left", mI, mI + 3)}" fill="${P.mossDeep}" opacity="0.5" stroke="none"/>`;
    if (legendary) s += litRim("left", mI, P.mossLit);
    s += `<path d="${halfBand("left", R_BAND_OUT - 2.5, R_BAND_OUT)}" fill="${P.cream}" opacity="0.14" stroke="none"/>`;
  } else s += `<path d="${halfBand("left", R_BAND_OUT - 10, R_BAND_OUT)}" fill="none" stroke="${P.goldSoft}" stroke-width="1" stroke-dasharray="3 6" opacity="0.45"/>`;
  // ember half (right)
  if (spec.ember.inked) {
    s += `<path d="${halfBand("right", eI, R_BAND_OUT)}" fill="${P.terra}" stroke="${P.ink}" stroke-width="1"/>`;
    s += `<path d="${halfBand("right", eI, eI + 3)}" fill="${P.terraDeep}" opacity="0.45" stroke="none"/>`;
    if (legendary) s += litRim("right", eI, P.terraLit);
    s += `<path d="${halfBand("right", R_BAND_OUT - 2.5, R_BAND_OUT)}" fill="${P.cream}" opacity="0.14" stroke="none"/>`;
  } else s += `<path d="${halfBand("right", R_BAND_OUT - 10, R_BAND_OUT)}" fill="none" stroke="${P.goldSoft}" stroke-width="1" stroke-dasharray="3 6" opacity="0.45"/>`;
  // the braid: ember crosses OVER moss at the base seam (the bound-together mark)
  if (spec.moss.inked && spec.ember.inked) {
    s += `<path d="${arcBand(180, 201, eI, R_BAND_OUT)}" fill="${P.terra}" stroke="${P.ink}" stroke-width="1"/>`;
    s += `<path d="${arcBand(180, 201, eI, eI + 3)}" fill="${P.terraDeep}" opacity="0.45" stroke="none"/>`;
  }
  return s;
}

// ── SWAPPABLE PART: the bright star-cartouche + chord-studs + field marks ──
// Built as three reveal layers (field / core / studs) so the ceremony can draw
// them on in sequence; `reveal` wraps each in its timed class.
function spellCore(spec: SigilSpec, gold: string, lit: boolean, legendary: boolean, nat: NatureInfo, reveal = false) {
  const rand = rng(spec.seed * 7 + 3);
  const rot = Math.floor(rand() * 360);
  const runeMain = lit ? P.goldSoft : P.gold, runeLip = P.groundEdge;
  const structC = lit ? gold : P.goldSoft;
  const wrap = (cls: string, inner: string) => (reveal ? `<g class="rv ${cls}">${inner}</g>` : inner);

  // FIELD — the outer ring: what each of you did (food halls + training lifts),
  // carved into the dark field, with a faint structural ring behind.
  let field = `<circle cx="${CX}" cy="${CY}" r="${R_RUNE + 7}" fill="none" stroke="${structC}" stroke-width="0.6" opacity="${lit ? 0.45 : 0.28}"/>`;
  if (nat.water) field += `<circle cx="${CX}" cy="${CY}" r="${R_RUNE + 10}" fill="none" stroke="${structC}" stroke-width="0.5" opacity="0.3" stroke-dasharray="1.5 4"/>`;
  const halls: Hall[] = spec.radicals.length ? spec.radicals.slice(0, 6) : ["dishes"];
  const lifts = spec.ornaments.filter((o) => o !== "rest").slice(0, 3);
  const outer: Array<(x: number, y: number) => string> = [
    ...halls.map((h) => (x: number, y: number) => HALL_GLYPHS[h](x, y, 5.6)),
    ...lifts.map((l) => (x: number, y: number) => LIFT_GLYPHS[l](x, y, 4.6)),
  ];
  let om = "";
  outer.forEach((g, i) => {
    const [x, y] = polar(R_RUNE, rot + (i / outer.length) * 360);
    om += g(x, y);
  });
  field += `<g opacity="${spec.completed ? 1 : 0.4}">${etch(om, runeMain, runeLip)}</g>`;

  // CORE — the bright star-cartouche disc + the emblem, igniting at center.
  // A legendary shows its OWN face (LEGENDARY_FACES); everyone else the nature
  // core. The disc + halo carry the legendary's color cast.
  let core = "";
  if (legendary) core += `<circle cx="${CX}" cy="${CY}" r="${R_CART + 8}" fill="${LEG?.glow ?? P.violetBright}" opacity="0.24" filter="url(#soft-${SEED})"/>`;
  core += `<circle cx="${CX}" cy="${CY}" r="${R_CART}" fill="${legendary ? P.cream : P.paper}"/>`;
  if (legendary) core += `<circle cx="${CX}" cy="${CY}" r="${R_CART}" fill="${LEG?.cast ?? P.violetDeep}" opacity="0.15"/>`;
  else if (nat.nature === "vigil" || nat.moon) core += `<circle cx="${CX}" cy="${CY}" r="${R_CART}" fill="${P.violetDeep}" opacity="0.16"/>`;
  core += `<circle cx="${CX}" cy="${CY}" r="${R_CART}" fill="none" stroke="${gold}" stroke-width="1.6"/>`;
  core += `<circle cx="${CX}" cy="${CY}" r="${R_CART - 4}" fill="none" stroke="${gold}" stroke-width="0.8" opacity="0.7"/>`;
  if (lit) core += `<circle cx="${CX}" cy="${CY}" r="${R_CART - 4}" fill="none" stroke="${P.violet}" stroke-width="0.8" opacity="0.6"/>`;
  const coreLine = lit ? gold : P.ink;
  const coreFill = legendary ? P.goldSoft : lit ? gold : P.cream;
  const pts = spec.tier === "resonant" ? 6 : spec.tier === "fine" ? 5 : 4;
  core += legendary && LEG
    ? LEG.core(CX, CY, coreLine, coreFill, 2.0)
    : NATURE_CORES[nat.nature](CX, CY, coreLine, coreFill, pts, 2.0);

  // CHORD-RUNES — the inner ring: each struck chord inscribes its OWN mark,
  // popping in sequence during the ceremony. Carved gold, lit brighter. A tiny
  // gold seat plants each on the ring so it reads as set into the seal.
  const chords = spec.chords.slice(0, 8);
  let studs = "";
  chords.forEach((c, i) => {
    const [x, y] = polar(R_CHORD, (i / chords.length) * 360 + 18);
    const seat = `<circle cx="${f(x)}" cy="${f(y)}" r="1.1" fill="${legendary ? P.violetBright : gold}" opacity="0.5"/>`;
    const mark = seat + etch(CHORD_GLYPHS[c](x, y, 4.6), runeMain, runeLip);
    studs += reveal ? `<g class="rv-stud" style="--i:${i}">${mark}</g>` : mark;
  });

  return wrap("rv-field", field) + wrap("rv-core", core) + (studs ? wrap("rv-studs", studs) : "");
}

// ── SWAPPABLE PART: the crown — the drop of ink that closes the ring ──
function crown(spec: SigilSpec, gold: string, lit: boolean, legendary: boolean, nat: NatureInfo, bloom: boolean) {
  if (!spec.completed) return "";
  const cy = 30;
  if (nat.moon)
    return `<circle cx="${CX}" cy="${cy}" r="9" fill="${P.goldSoft}" stroke="${gold}" stroke-width="1.2"/><path d="M ${CX + 3.5} ${cy - 6} a 7 7 0 1 0 0 12 a 5.4 5.4 0 1 1 0 -12 Z" fill="${P.violetDeep}" opacity="0.6"/>`;
  if (lit) {
    const glow = bloom || legendary ? `<circle cx="${CX}" cy="${cy}" r="15" fill="${P.violetBright}" opacity="0.45" filter="url(#soft-${SEED})"/>` : "";
    return `${glow}<circle cx="${CX}" cy="${cy}" r="9" fill="${P.violet}" stroke="${gold}" stroke-width="1.3"/><path d="M ${CX} ${cy - 7} L ${CX + 5} ${cy} L ${CX} ${cy + 7} L ${CX - 5} ${cy} Z" fill="${P.violetBright}" opacity="0.85"/><circle cx="${CX - 2.4}" cy="${cy - 2.4}" r="1.6" fill="${P.cream}" opacity="0.9"/>`;
  }
  return `<circle cx="${CX}" cy="${cy}" r="4.5" fill="${P.goldSoft}" stroke="${gold}" stroke-width="1.1"/>`;
}

// the current seal's seed — set per-compose so filter/gradient ids stay unique
let SEED = 0;
// the current legendary's face (cast/glow/core), or null — set per-compose
let LEG: LegendaryFace | null = null;

// ── SWAPPABLE PART: spark-motes — ink-dots that fly off during the ceremony ──
function motes(rand: () => number): string {
  let s = "";
  for (let i = 0; i < 8; i++) {
    const [x, y] = polar(28 + rand() * 74, rand() * 360);
    s += `<circle class="rv-mote" style="--i:${i}" cx="${f(x)}" cy="${f(y)}" r="${(1 + rand() * 1.4).toFixed(2)}" fill="${P.gold}"/>`;
  }
  return s;
}

// ── the composer: assemble the seal from the parts above ──
// `reveal` turns on the completion-ceremony draw-on: a radial wipe inks the
// frame + bands, then the field, core, chord-studs and union gem reveal in a
// staged CSS timeline (classes in globals.css, gated by reduced-motion).
export function composeSeal(
  spec: SigilSpec,
  opts: {
    bloom?: boolean;
    ground?: "dark" | "none";
    detail?: "full" | "thumb";
    reveal?: boolean;
  } = {},
): string {
  SEED = spec.seed;
  const legendary = spec.tier === "legendary";
  LEG = legendary && spec.legendary ? LEGENDARY_FACES[spec.legendary] : null;
  const lit = spec.tier === "resonant" || legendary;
  const gold = legendary ? P.goldSoft : P.gold;
  const ground = opts.ground ?? "dark";
  const thumb = opts.detail === "thumb";
  const reveal = !!opts.reveal;
  const nat = natureFor(spec);
  const rand = rng(spec.seed);

  let s = `<defs>`;
  s += `<radialGradient id="medal-${SEED}" cx="50%" cy="46%" r="62%"><stop offset="0%" stop-color="${P.groundCore}"/><stop offset="70%" stop-color="${P.groundMid}"/><stop offset="100%" stop-color="${P.groundEdge}"/></radialGradient>`;
  s += `<filter id="soft-${SEED}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3"/></filter>`;
  if (reveal)
    s += `<mask id="draw-${SEED}" maskUnits="userSpaceOnUse"><circle cx="${CX}" cy="${CY}" r="58" fill="none" stroke="#fff" stroke-width="120" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0" class="rv-wipe" transform="rotate(-90 ${CX} ${CY})"/></mask>`;
  s += `</defs>`;

  if (ground === "dark") s += medallion(rand, lit, legendary);
  if (legendary) s += `<circle cx="${CX}" cy="${CY}" r="${R_BAND_OUT + 4}" fill="${LEG?.glow ?? P.violetBright}" opacity="0.28" filter="url(#soft-${SEED})"/>`;

  // the frame + bands ink themselves on under the radial wipe
  const ring = ornateFrame(gold, spec.tier === "open" ? 0.55 : 1) + braidedBand(spec, gold, lit, legendary);
  s += reveal ? `<g mask="url(#draw-${SEED})">${ring}</g>` : ring;

  if (thumb) {
    // the 38px book thumbnail: drop the fine field detail, keep the read —
    // frame, band, a small bright core, the crown.
    s += `<circle cx="${CX}" cy="${CY}" r="${R_CART}" fill="${legendary ? P.cream : P.paper}" stroke="${gold}" stroke-width="1.6"/>`;
    s += NATURE_CORES[nat.nature](CX, CY, lit ? gold : P.ink, legendary ? P.goldSoft : lit ? gold : P.cream, legendary ? 8 : 4, 2.0);
    s += crown(spec, gold, lit, legendary, nat, false);
    return s;
  }

  s += spellCore(spec, gold, lit, legendary, nat, reveal);
  const cr = crown(spec, gold, lit, legendary, nat, !!opts.bloom || reveal);
  s += reveal ? `<g class="rv rv-crown">${cr}</g>` : cr;
  if (reveal) s += motes(rand);
  return s;
}
