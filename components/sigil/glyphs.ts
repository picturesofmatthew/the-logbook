// The Seal — a swappable parts registry.
//
// Iron-Man rule: every visual element of the sigil is an independently
// swappable module here — a hall's rune, a lift's ornament, a nature-core, the
// frame, the ring, the crown. To upgrade or fix a design, replace ONE entry;
// the composer (`composeSeal`) assembles from these, so nothing else changes.
// The engine (`lib/engine/sigil.ts`) decides WHAT a day is; this file decides
// how it is DRAWN. Parts return SVG-markup strings on a 240×240 canvas.

import type { SigilSpec } from "@/lib/engine/sigil";
import type { Hall } from "@/lib/halls";
import type { SplitFamily } from "@/lib/engine/training";

// ── palette (mirrors globals.css tokens) ──
const P = {
  paper: "#f5eddc", paperDeep: "#ece0c6", cream: "#fbf6ea", ink: "#4a3b2a", inkSoft: "#7a6a52",
  moss: "#7c8a4d", mossDeep: "#5b6b3c", terra: "#c4704b", terraDeep: "#a85838",
  gold: "#d9a441", goldSoft: "#ecd9a8", violet: "#8d7aa8", violetDeep: "#453a54", violetBright: "#c9b3e3",
  carveInk: "#4a3b2a", carveGold: "#9c7526", carveGoldLeg: "#b8912f", lipGold: "#f6e8bf", lipInk: "#fdf8ec",
};

const CX = 120, CY = 120;
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
function halfBand(side: "left" | "right", innerR: number, outerR: number) {
  const [otx, oty] = polar(outerR, 0), [obx, oby] = polar(outerR, 180);
  const [itx, ity] = polar(innerR, 0), [ibx, iby] = polar(innerR, 180);
  const oS = side === "left" ? 0 : 1, iS = side === "left" ? 1 : 0;
  return `M ${f(otx)} ${f(oty)} A ${outerR} ${outerR} 0 0 ${oS} ${f(obx)} ${f(oby)} L ${f(ibx)} ${f(iby)} A ${innerR} ${innerR} 0 0 ${iS} ${f(itx)} ${f(ity)} Z`;
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

// ── SWAPPABLE: nature cores — the day's character ──
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

// carve a rune into the vellum: a lit lower lip beneath a dark cut
function carved(inner: string, main: string, high: string) {
  return `<g transform="translate(0.5,1.2)" stroke="currentColor" fill="none" opacity="0.55" style="color:${high}">${inner}</g><g stroke="currentColor" fill="none" style="color:${main}">${inner}</g>`;
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

// ── SWAPPABLE PART: the gold-fleck field ──
function goldFleck(rand: () => number, gold: string, count: number) {
  let s = "";
  for (let i = 0; i < count; i++) {
    const [x, y] = polar(100 + rand() * 128, rand() * 360);
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${(0.5 + rand() * 1.3).toFixed(2)}" fill="${gold}" opacity="${(0.2 + rand() * 0.45).toFixed(2)}"/>`;
  }
  return s;
}

// ── SWAPPABLE PART: the ornate gold frame ──
function ornateFrame(gold: string, op: number) {
  let s = `<g opacity="${op}" fill="none" stroke="${gold}"><circle cx="120" cy="120" r="112" stroke-width="1.6"/><circle cx="120" cy="120" r="104" stroke-width="0.9" opacity="0.8"/>`;
  for (const a of [45, 135, 225, 315]) {
    const [x, y] = polar(108, a);
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="4.6" fill="${P.ink}" stroke="${gold}" stroke-width="1.2"/><circle cx="${f(x)}" cy="${f(y)}" r="2.2" fill="${gold}" stroke="none" opacity="0.9"/>`;
  }
  for (const a of [0, 180]) {
    const [x, y] = polar(108, a), d = a === 0 ? 1 : -1;
    s += `<path d="M ${f(x - 7)} ${f(y + 2 * d)} q 7 ${-8 * d} 14 0" stroke-width="1.3"/><path d="M ${f(x - 3.4)} ${f(y - 1.5 * d)} q 3.4 ${4 * d} 6.8 0" stroke-width="1"/>`;
  }
  return s + `</g>`;
}

// ── SWAPPABLE PART: the two braided halves (moss = Matthew, ember = Kennedy) ──
const WEIGHT: Record<string, number> = { open: 6, lean: 10, even: 13, feast: 16 };
function braidedRing(spec: SigilSpec, gold: string, lit: boolean, legendary: boolean) {
  const mI = 92 - WEIGHT[spec.moss.inked ? spec.moss.weight : "open"];
  const eI = 92 - WEIGHT[spec.ember.inked ? spec.ember.weight : "open"];
  let s = "";
  if (spec.moss.inked) s += `<path d="${halfBand("left", mI, 92)}" fill="${P.moss}" stroke="${P.ink}" stroke-width="1"/><path d="${halfBand("left", mI, mI + 3)}" fill="${P.mossDeep}" opacity="0.5" stroke="none"/>`;
  else s += `<path d="${halfBand("left", 84, 92)}" fill="none" stroke="${P.inkSoft}" stroke-width="1" stroke-dasharray="3 5" opacity="0.5"/>`;
  if (spec.ember.inked) s += `<path d="${halfBand("right", eI, 92)}" fill="${P.terra}" stroke="${P.ink}" stroke-width="1"/><path d="${halfBand("right", eI, eI + 3)}" fill="${P.terraDeep}" opacity="0.45" stroke="none"/>`;
  else s += `<path d="${halfBand("right", 84, 92)}" fill="none" stroke="${P.inkSoft}" stroke-width="1" stroke-dasharray="3 5" opacity="0.5"/>`;
  if (lit) s += `<circle cx="120" cy="120" r="${Math.min(mI, eI) - 1}" fill="none" stroke="${gold}" stroke-width="${legendary ? 1.6 : 1}" opacity="${legendary ? 0.95 : 0.7}"/>`;
  return s;
}

// ── SWAPPABLE PART: the parchment heart (the vellum the spell is drawn on) ──
function parchmentHeart(gold: string, legendary: boolean, nat: NatureInfo) {
  let s = `<circle cx="120" cy="120" r="70" fill="${legendary ? P.cream : P.paper}"/>`;
  if (nat.nature === "vigil" || nat.moon) s += `<circle cx="120" cy="120" r="68" fill="${P.violetDeep}" opacity="0.14"/>`;
  s += `<circle cx="120" cy="120" r="70" fill="none" stroke="${gold}" stroke-width="1.6"/><circle cx="120" cy="120" r="65" fill="none" stroke="${gold}" stroke-width="0.8" opacity="0.7"/>`;
  return s;
}

// ── SWAPPABLE PART: the spell-circle (signs from halls, weave from chords) ──
function spellCircle(spec: SigilSpec, gold: string, lit: boolean, legendary: boolean, nat: NatureInfo) {
  const rand = rng(spec.seed * 7 + 3);
  const rot = Math.floor(rand() * 360);
  const carveMain = legendary ? P.carveGoldLeg : lit ? P.carveGold : P.carveInk;
  const carveHigh = lit ? P.lipGold : P.lipInk;
  const structC = lit ? gold : P.inkSoft;
  // Signs are the food halls (never inflated by chords — chords are the weave).
  const halls: Hall[] = spec.radicals.length ? spec.radicals.slice(0, 6) : ["dishes"];
  const n = halls.length;
  const nodes: [number, number][] = [];
  for (let i = 0; i < n; i++) nodes.push(polar(42, (i / n) * 360));
  const chordN = spec.chords.length;

  let s = `<g stroke-linecap="round" stroke-linejoin="round">`;
  // structural — delicate connective lines
  s += `<g transform="rotate(${rot} ${CX} ${CY})" fill="none" stroke="${structC}">`;
  if (spec.completed) {
    s += `<circle cx="${CX}" cy="${CY}" r="58" stroke-width="0.8" opacity="${lit ? 0.6 : 0.4}"/>`;
    if (nat.water) s += `<circle cx="${CX}" cy="${CY}" r="61" stroke-width="0.6" opacity="0.5"/>`;
  } else {
    const [x0, y0] = polar(58, 22), [x1, y1] = polar(58, 338);
    s += `<path d="M ${f(x0)} ${f(y0)} A 58 58 0 1 1 ${f(x1)} ${f(y1)}" stroke-width="0.8" stroke-dasharray="3 5" opacity="0.5"/>`;
  }
  for (const [x, y] of nodes) s += `<line x1="${CX}" y1="${CY}" x2="${f(x)}" y2="${f(y)}" stroke-width="0.5" opacity="0.3"/>`;
  if (spec.completed && n >= 3) {
    let d = `M ${f(nodes[0][0])} ${f(nodes[0][1])}`;
    for (let i = 1; i < n; i++) d += ` L ${f(nodes[i][0])} ${f(nodes[i][1])}`;
    s += `<path d="${d} Z" stroke-width="0.7" opacity="${lit ? 0.55 : 0.4}"/>`;
  }
  if (n >= 3) {
    const maxK = Math.floor(n / 2);
    for (let k = 2; k <= Math.min(2 + chordN, maxK); k++)
      for (let i = 0; i < n; i++) {
        const j = (i + k) % n, [x1, y1] = nodes[i], [x2, y2] = nodes[j];
        s += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width="${legendary ? 0.65 : 0.5}" opacity="${lit ? 0.45 : 0.32}"/>`;
      }
  }
  s += `</g>`;

  // carved hall-runes at nodes
  let runes = "";
  nodes.forEach(([x, y], i) => { runes += HALL_GLYPHS[halls[i]](x, y, 7); });
  s += `<g transform="rotate(${rot} ${CX} ${CY})" opacity="${spec.completed ? 1 : 0.45}">${carved(runes, carveMain, carveHigh)}</g>`;

  // carved lift ornaments, interleaved between the runes and the ring
  const lifts = spec.ornaments.filter((o) => o !== "rest").slice(0, 4);
  if (lifts.length) {
    const seats = [0, 90, 270, 180];
    let lm = "";
    lifts.forEach((lf, i) => { const [x, y] = polar(54, seats[i] + 18); lm += LIFT_GLYPHS[lf](x, y, 4.6); });
    s += `<g>${carved(lm, carveMain, carveHigh)}</g>`;
  }

  // the nature core
  const coreLine = lit ? gold : P.ink;
  const coreFill = legendary ? P.goldSoft : lit ? gold : P.cream;
  const pts = legendary ? 8 : spec.tier === "resonant" ? 6 : spec.tier === "fine" ? 5 : 4;
  if (legendary) s += `<circle cx="${CX}" cy="${CY}" r="24" fill="${P.violetBright}" opacity="0.16" filter="url(#soft-${spec.seed})"/>`;
  s += `<circle cx="${CX}" cy="${CY}" r="17" fill="none" stroke="${coreLine}" stroke-width="0.9" opacity="0.55"/>`;
  if (lit) s += `<circle cx="${CX}" cy="${CY}" r="10" fill="none" stroke="${P.violet}" stroke-width="0.8" opacity="0.7"/>`;
  s += NATURE_CORES[nat.nature](CX, CY, coreLine, coreFill, pts, 1.55);
  s += `</g>`;
  return s;
}

// ── SWAPPABLE PART: the crown — the drop of ink that closes the ring ──
function crown(spec: SigilSpec, gold: string, lit: boolean, legendary: boolean, nat: NatureInfo, bloom: boolean) {
  if (!spec.completed) return "";
  if (nat.moon)
    return `<circle cx="120" cy="30" r="9" fill="${P.goldSoft}" stroke="${gold}" stroke-width="1.2"/><path d="M 123.5 24 a 7 7 0 1 0 0 12 a 5.4 5.4 0 1 1 0 -12 Z" fill="${P.violetDeep}" opacity="0.55"/>`;
  if (lit) {
    const glow = bloom || legendary ? `<circle cx="120" cy="30" r="15" fill="${P.violetBright}" opacity="0.4" filter="url(#soft-${spec.seed})"/>` : "";
    return `${glow}<circle cx="120" cy="30" r="9" fill="${P.violet}" stroke="${gold}" stroke-width="1.3"/><path d="M 120 23 L 125 30 L 120 37 L 115 30 Z" fill="${P.violetBright}" opacity="0.8"/><circle cx="117.6" cy="27.6" r="1.6" fill="${P.cream}" opacity="0.85"/>`;
  }
  return `<circle cx="120" cy="30" r="4" fill="${P.paperDeep}" stroke="${P.ink}" stroke-width="1"/>`;
}

// ── the composer: assemble the seal from the parts above ──
export function composeSeal(spec: SigilSpec, opts: { bloom?: boolean } = {}): string {
  const legendary = spec.tier === "legendary";
  const lit = spec.tier === "resonant" || legendary;
  const gold = legendary ? P.goldSoft : P.gold;
  const nat = natureFor(spec);
  const rand = rng(spec.seed);

  let s = `<defs><filter id="soft-${spec.seed}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3"/></filter></defs>`;
  if (legendary) s += `<circle cx="120" cy="120" r="98" fill="${P.violetBright}" opacity="0.3" filter="url(#soft-${spec.seed})"/><circle cx="120" cy="120" r="60" fill="none" stroke="${P.gold}" stroke-width="6" opacity="0.16" filter="url(#soft-${spec.seed})"/>`;
  s += `<g>${goldFleck(rand, gold, spec.tier === "open" ? 6 : lit ? 30 : 14)}</g>`;
  s += ornateFrame(gold, spec.tier === "open" ? 0.5 : 1);
  s += braidedRing(spec, gold, lit, legendary);
  s += parchmentHeart(gold, legendary, nat);
  s += spellCircle(spec, gold, lit, legendary, nat);
  s += crown(spec, gold, lit, legendary, nat, !!opts.bloom);
  return s;
}
