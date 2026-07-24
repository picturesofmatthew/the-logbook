// The keeper — the human at the hearth. At onboarding each keeper elects a
// character: a small storybook figure who stands at the mantle flanking the
// seal. Drawn in Inklight (crisp cocoa line over matte gouache washes, warm
// earth only — no white/black/gray, and violet stays reserved for the union,
// so it never appears here). Eight archetypes, one cast: same proportions,
// same line weight, same palette, each set apart by silhouette + one or two
// signature attributes.
//
// Same contract as the fox (components/familiar) and the seal (components/sigil):
// a PURE `keeperSvg(archetype)` composer returning inner SVG markup + a thin
// renderer, deterministic (SSR-safe) and swappable for a hand-drawn master.

// ── palette (Inklight — warm earth only; mirrors the fox + seal tokens) ──
const C = {
  ink: "#4a3b2a",
  inkSoft: "#7a6a54",
  cream: "#fbf6ea",
  paper: "#f5eddc",
  moss: "#7c8a4d",
  pine: "#5b6b3c",
  terra: "#c4704b",
  terraDeep: "#a85838",
  umber: "#6b533a",
  dusk: "#544636",
  leather: "#6e4a2e",
  gold: "#d9a441",
  goldSoft: "#ecd9a8",
  goldDeep: "#9c7526",
  wick: "#f7e3ae",
};

// the standard body outline + a lighter detail line
const line = `stroke="${C.ink}" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round"`;
const fine = `fill="none" stroke="${C.ink}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"`;
// an ink outline at an arbitrary weight (use instead of `line` when a shape
// needs a lighter stroke — a duplicated stroke-width attribute would be ignored)
const ink = (w: number) =>
  `stroke="${C.ink}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

// ── shared parts — every keeper is built from these, so the cast coheres ──

const shadow = () =>
  `<ellipse cx="60" cy="113" rx="23" ry="3.2" fill="${C.ink}" opacity="0.13"/>`;

// a limb / sleeve: an ink-outlined colored stroke (draw ink under, color over)
const limb = (d: string, fill: string, w = 6) =>
  `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="${w + 2}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

const hand = (x: number, y: number) =>
  `<circle cx="${x}" cy="${y}" r="2.6" fill="${C.cream}" stroke="${C.ink}" stroke-width="1.6"/>`;

const neck = () =>
  `<path d="M 55.5 44 L 55.5 51 Q 60 54 64.5 51 L 64.5 44 Z" fill="${C.cream}" ${line}/>`;

const headCircle = () =>
  `<circle cx="60" cy="33" r="13" fill="${C.cream}" ${line}/>`;

// the face — two eyes, warm blush, a soft mouth. `shadowed` (hooded) drops the
// blush/mouth and lights the eyes gold, so the Mystic reads from the dark.
function face(opts: { shadowed?: boolean } = {}): string {
  const eye = opts.shadowed ? C.goldSoft : C.ink;
  let s =
    `<ellipse cx="55.5" cy="33.5" rx="1.5" ry="1.9" fill="${eye}"/>` +
    `<ellipse cx="64.5" cy="33.5" rx="1.5" ry="1.9" fill="${eye}"/>`;
  if (!opts.shadowed) {
    s +=
      `<circle cx="51" cy="37.5" r="2.6" fill="${C.terra}" opacity="0.32"/>` +
      `<circle cx="69" cy="37.5" r="2.6" fill="${C.terra}" opacity="0.32"/>`;
    s += `<path d="M 57 39.5 q 3 2.1 6 0" ${fine}/>`;
  }
  return s;
}

// the standard bell robe (shoulders → hem) with the letter-fold seam down the
// center — the two-into-one motif, in every keeper who wears one
function robe(fill: string): string {
  return (
    `<path d="M 49 50 C 42 55 41 66 40 80 L 38 105 L 82 105 L 80 80 C 79 66 78 55 71 50 C 68 55 52 55 49 50 Z" fill="${fill}" ${line}/>` +
    `<path d="M 60 55 L 60 103" fill="none" stroke="${C.ink}" stroke-width="1.1" stroke-linecap="round" opacity="0.32"/>`
  );
}

// a four-point star (the guiding star / the smith's spark / small night sparks)
function star4(cx: number, cy: number, r: number): string {
  const i = r * 0.34;
  return `M ${cx} ${cy - r} L ${cx + i} ${cy - i} L ${cx + r} ${cy} L ${cx + i} ${cy + i} L ${cx} ${cy + r} L ${cx - i} ${cy + i} L ${cx - r} ${cy} L ${cx - i} ${cy - i} Z`;
}

// ── signature props (shared where two keepers might reach for the same tool) ──

function book(): string {
  let s = "";
  // the two pages
  s += `<path d="M 60 70 C 54 66 47 66 43 69 L 43 80 C 47 77 54 77 60 80 Z" fill="${C.cream}" ${line}/>`;
  s += `<path d="M 60 70 C 66 66 73 66 77 69 L 77 80 C 73 77 66 77 60 80 Z" fill="${C.cream}" ${line}/>`;
  s += `<path d="M 60 70 L 60 80" fill="none" stroke="${C.ink}" stroke-width="1.4" stroke-linecap="round"/>`;
  // inscription lines
  s += `<g fill="none" stroke="${C.inkSoft}" stroke-width="0.9" stroke-linecap="round" opacity="0.75">`;
  s += `<path d="M 47 71.5 q 6 -1.4 11 0.6"/><path d="M 47 74.2 q 6 -1.4 11 0.6"/>`;
  s += `<path d="M 62 72 q 6 -2 11 -0.2"/><path d="M 62 74.7 q 6 -2 11 -0.2"/>`;
  s += `</g>`;
  // gilt lower edge
  s += `<path d="M 43 80 C 47 77 54 77 60 79.5 C 66 77 73 77 77 80" fill="none" stroke="${C.gold}" stroke-width="1.4" stroke-linecap="round"/>`;
  return s;
}

function wateringCan(x: number, y: number): string {
  let s = "";
  s += `<path d="M ${x - 6} ${y - 5} L ${x + 6} ${y - 5} L ${x + 5} ${y + 6} L ${x - 5} ${y + 6} Z" fill="${C.gold}" ${line}/>`;
  s += `<path d="M ${x - 6} ${y - 2} L ${x - 15} ${y - 8}" fill="none" stroke="${C.gold}" stroke-width="3.4" stroke-linecap="round"/>`;
  s += `<path d="M ${x - 15} ${y - 8} L ${x - 19} ${y - 10}" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round"/>`;
  s += `<path d="M ${x - 2} ${y - 5} q 4 -5 8 0" fill="none" stroke="${C.ink}" stroke-width="1.6" stroke-linecap="round"/>`;
  s += `<path d="M ${x - 6} ${y - 5} L ${x + 6} ${y - 5}" fill="none" stroke="${C.ink}" stroke-width="1.6"/>`;
  // a soft fall of water
  s += `<circle cx="${x - 20}" cy="${y - 5}" r="1.1" fill="${C.goldSoft}"/><circle cx="${x - 19}" cy="${y - 1}" r="1" fill="${C.goldSoft}"/><circle cx="${x - 22}" cy="${y - 2}" r="0.9" fill="${C.goldSoft}"/>`;
  return s;
}

function lantern(x: number, y: number): string {
  let s = "";
  s += `<path d="M ${x - 3.5} ${y - 8} q 3.5 -4 7 0" fill="none" stroke="${C.ink}" stroke-width="1.5" stroke-linecap="round"/>`;
  s += `<path d="M ${x - 5.5} ${y - 6} L ${x + 5.5} ${y - 6} L ${x + 3.5} ${y - 8.5} L ${x - 3.5} ${y - 8.5} Z" fill="${C.gold}" ${ink(1.4)}/>`;
  s += `<path d="M ${x - 5} ${y - 6} L ${x - 5} ${y + 7} L ${x + 5} ${y + 7} L ${x + 5} ${y - 6} Z" fill="${C.goldSoft}" ${line}/>`;
  s += `<path d="M ${x} ${y + 5} q -3 -1.5 -1.5 -4.5 q 0.6 1.8 2 1 q 0.8 -1.8 -0.6 -3.6 q 3.6 1.8 2 5 q -0.8 1.6 -1.9 2.1 Z" fill="${C.gold}" stroke="${C.terraDeep}" stroke-width="0.7"/>`;
  s += `<path d="M ${x - 6} ${y + 7} L ${x + 6} ${y + 7}" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round"/>`;
  return s;
}

function sextant(x: number, y: number): string {
  let s = "";
  s += `<path d="M ${x} ${y - 11} L ${x - 11} ${y + 7} L ${x + 11} ${y + 7} Z" fill="none" stroke="${C.gold}" stroke-width="2.2" stroke-linejoin="round"/>`;
  s += `<path d="M ${x - 11} ${y + 7} A 16 16 0 0 0 ${x + 11} ${y + 7}" fill="none" stroke="${C.gold}" stroke-width="2.4" stroke-linecap="round"/>`;
  s += `<path d="M ${x} ${y - 11} L ${x + 4} ${y + 9}" fill="none" stroke="${C.ink}" stroke-width="1.3" stroke-linecap="round"/>`;
  s += `<path d="M ${x - 6} ${y - 5} L ${x + 2} ${y - 9}" fill="none" stroke="${C.ink}" stroke-width="2.6" stroke-linecap="round"/>`;
  s += `<circle cx="${x}" cy="${y - 11}" r="1.4" fill="${C.gold}" stroke="${C.ink}" stroke-width="0.7"/>`;
  return s;
}

function anvil(x: number, y: number): string {
  let s = "";
  s += `<path d="M ${x - 7} ${y} L ${x + 7} ${y} L ${x + 5} ${y + 7} L ${x - 5} ${y + 7} Z" fill="${C.inkSoft}" ${line}/>`;
  s += `<path d="M ${x - 9} ${y - 5} L ${x + 7} ${y - 5} L ${x + 12} ${y - 2.5} L ${x + 6} ${y - 1} L ${x - 6} ${y - 1} Z" fill="${C.inkSoft}" ${line}/>`;
  s += `<path d="M ${x - 5} ${y - 1} L ${x - 4} ${y} M ${x + 5} ${y - 1} L ${x + 4} ${y}" fill="none" stroke="${C.ink}" stroke-width="1.4"/>`;
  return s;
}

// ── the eight keepers — each a distinct silhouette from the same cloth ──

// SCHOLAR — an open book, round spectacles, a quill at the shoulder.
function scholar(): string {
  let s = shadow();
  s += `<path d="M 72 48 L 86 26" fill="none" stroke="${C.ink}" stroke-width="1.6" stroke-linecap="round"/>`;
  s += `<path d="M 86 26 q 6 -2 7 -9 q -7 1 -10 7 q 2 0 3 2 Z" fill="${C.goldSoft}" ${ink(1.4)}/>`;
  s += robe(C.pine);
  s += limb("M 49 53 C 44 62 43 73 44 79", C.pine, 6);
  s += limb("M 71 53 C 76 62 77 73 76 79", C.pine, 6);
  s += hand(44, 80) + hand(76, 80);
  s += book();
  s += neck() + headCircle();
  s += `<path d="M 47 32 Q 48 19 60 19 Q 72 19 73 32 Q 66 25 60 26 Q 54 25 47 32 Z" fill="${C.ink}"/>`;
  s += face();
  s += `<g fill="none" stroke="${C.ink}" stroke-width="1.2" stroke-linecap="round">`;
  s += `<circle cx="55.5" cy="33.5" r="3.4"/><circle cx="64.5" cy="33.5" r="3.4"/>`;
  s += `<path d="M 58.9 33.5 L 61.1 33.5"/><path d="M 52.1 33 L 49 32"/><path d="M 67.9 33 L 71 32"/>`;
  s += `</g>`;
  return s;
}

// ATHLETE — mid-stride, bare limbs, a headband crowned with a gold laurel.
function athlete(): string {
  let s = shadow();
  s += limb("M 57 74 L 51 90 L 49 103", C.cream, 7);
  s += limb("M 63 74 L 71 90 L 77 102", C.cream, 7);
  s += `<path d="M 49 103 l -5 2 l 1 -4 Z" fill="${C.ink}"/>`;
  s += `<path d="M 77 102 l 5 2 l -1 -4 Z" fill="${C.ink}"/>`;
  s += `<path d="M 50 50 C 46 56 47 68 53 76 L 67 76 C 73 68 74 56 70 50 C 67 54 53 54 50 50 Z" fill="${C.terra}" ${line}/>`;
  s += `<path d="M 52 73 L 68 73" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round"/>`;
  s += limb("M 52 54 L 45 61 L 49 51", C.cream, 5.5);
  s += limb("M 68 54 L 76 59 L 81 51", C.cream, 5.5);
  s += hand(49, 50) + hand(81, 50);
  s += neck() + headCircle();
  s += `<path d="M 48 31 Q 49 20 60 20 Q 71 20 72 31 Q 66 26 60 26 Q 54 26 48 31 Z" fill="${C.ink}"/>`;
  s += `<path d="M 47 30 Q 60 26 73 30" fill="none" stroke="${C.terra}" stroke-width="3" stroke-linecap="round"/>`;
  s += `<path d="M 47 30 q -3 -2 -2 -5 q 3 1 4 4 Z" fill="${C.gold}" ${ink(1)}/>`;
  s += `<g fill="none" stroke="${C.gold}" stroke-width="1.6" stroke-linecap="round" opacity="0.7"><path d="M 86 58 l 5 -1"/><path d="M 84 66 l 5 -1"/><path d="M 87 74 l 5 -1"/></g>`;
  s += face();
  return s;
}

// WANDERER — a tall staff with a gilt pommel, a pack on the back, boots.
function wanderer(): string {
  let s = shadow();
  s += `<path d="M 68 52 L 84 52 Q 87 52 87 56 L 87 70 Q 87 73 84 73 L 68 73 Z" fill="${C.goldDeep}" ${line}/>`;
  s += `<path d="M 70 58 L 85 58" fill="none" stroke="${C.ink}" stroke-width="1.1" opacity="0.5"/>`;
  s += `<path d="M 76 52 L 76 55 L 79 55 L 79 52" fill="none" stroke="${C.ink}" stroke-width="1.2"/>`;
  s += `<path d="M 44 40 L 42 108" fill="none" stroke="${C.umber}" stroke-width="2.8" stroke-linecap="round"/>`;
  s += `<circle cx="44.5" cy="39" r="3.4" fill="${C.gold}" ${ink(1.3)}/>`;
  s += `<path d="M 41 50 L 48 48" fill="none" stroke="${C.ink}" stroke-width="1.4" stroke-linecap="round"/>`;
  s += robe(C.umber);
  s += `<path d="M 52 52 L 66 74 M 68 52 L 54 74" fill="none" stroke="${C.leather}" stroke-width="2.2" stroke-linecap="round"/>`;
  s += limb("M 71 54 C 76 62 76 72 73 80", C.umber, 6);
  s += hand(73, 81);
  s += limb("M 49 54 C 46 58 45 62 45 66", C.umber, 6);
  s += hand(44.5, 66);
  s += `<path d="M 46 105 L 46 108 L 54 108 L 54 105 Z" fill="${C.ink}"/><path d="M 66 105 L 66 108 L 74 108 L 74 105 Z" fill="${C.ink}"/>`;
  s += neck() + headCircle();
  s += `<path d="M 47 31 Q 47 20 60 19 Q 73 20 73 31 Q 70 24 65 25 Q 62 22 58 25 Q 53 23 47 31 Z" fill="${C.ink}"/>`;
  s += face();
  return s;
}

// TENDER — a straw sun-hat, a watering can, a green sprig in hand.
function tender(): string {
  let s = shadow();
  s += robe(C.moss);
  s += `<path d="M 47 82 L 73 82" fill="none" stroke="${C.ink}" stroke-width="1.1" stroke-linecap="round" opacity="0.4"/>`;
  s += limb("M 49 53 C 45 60 45 66 47 71", C.moss, 6);
  s += limb("M 71 53 C 77 61 79 72 77 80", C.moss, 6);
  s += hand(47, 72) + hand(77, 81);
  s += `<path d="M 47 72 L 45 58" fill="none" stroke="${C.pine}" stroke-width="1.8" stroke-linecap="round"/>`;
  s += `<path d="M 45 62 q -6 -1 -7 -6 q 5 0 7 4 Z" fill="${C.moss}" ${ink(1.2)}/>`;
  s += `<path d="M 45 58 q 5 -1 6 -6 q -5 0 -6 4 Z" fill="${C.moss}" ${ink(1.2)}/>`;
  s += wateringCan(80, 82);
  s += neck() + headCircle();
  s += face();
  s += `<ellipse cx="60" cy="23" rx="21" ry="4.5" fill="${C.goldSoft}" ${line}/>`;
  s += `<path d="M 49 23 Q 51 11 60 11 Q 69 11 71 23 Z" fill="${C.goldSoft}" ${line}/>`;
  s += `<path d="M 50 22 Q 60 25 70 22" fill="none" stroke="${C.moss}" stroke-width="2.5" stroke-linecap="round"/>`;
  return s;
}

// MYSTIC — hood up, a raised glowing lantern, a crescent moon and stars.
function mystic(): string {
  let s = shadow();
  s += `<path d="M 26 24 a 8.5 8.5 0 1 0 4 15.5 a 6.4 6.4 0 1 1 -4 -15.5 Z" fill="${C.goldSoft}" ${ink(1.4)}/>`;
  s += `<path d="${star4(20, 44, 2.4)}" fill="${C.gold}"/><path d="${star4(34, 14, 2)}" fill="${C.gold}"/>`;
  s += `<circle cx="90" cy="40" r="12" fill="${C.wick}" opacity="0.38"/>`;
  s += lantern(90, 40);
  s += robe(C.dusk);
  s += limb("M 71 54 C 79 48 85 43 89 41", C.dusk, 6);
  s += limb("M 49 54 C 45 61 47 69 54 74", C.dusk, 6);
  s += hand(89, 41) + hand(54, 74);
  s += headCircle();
  s += `<path d="M 43 42 Q 40 12 60 10 Q 80 12 77 42 Q 60 29 43 42 Z" fill="${C.dusk}" ${line}/>`;
  s += face({ shadowed: true });
  s += `<path d="M 48 34 Q 60 27 72 34" fill="none" stroke="${C.ink}" stroke-width="1.1" opacity="0.5"/>`;
  return s;
}

// FORAGER — a kerchief and a woven basket of gathered goods.
function forager(): string {
  let s = shadow();
  s += robe(C.terraDeep);
  s += limb("M 49 53 C 44 62 44 74 47 82", C.terraDeep, 6);
  s += limb("M 71 53 C 76 62 76 74 73 82", C.terraDeep, 6);
  s += hand(47, 83) + hand(73, 83);
  s += `<path d="M 45 80 A 15 11 0 0 0 75 80 Z" fill="${C.gold}" ${line}/>`;
  s += `<path d="M 52 80 q -4 -8 1 -12 q 3 5 -1 12 Z" fill="${C.moss}" ${ink(1.2)}/>`;
  s += `<circle cx="60" cy="74" r="2.6" fill="${C.terra}" ${ink(1.1)}/><circle cx="64" cy="77" r="2.4" fill="${C.terra}" ${ink(1.1)}/>`;
  s += `<path d="M 66 79 q 0 -5 4 -5 q 4 0 4 5 Z" fill="${C.goldSoft}" ${ink(1.2)}/><path d="M 69 79 L 69 82" fill="none" stroke="${C.ink}" stroke-width="1.4"/>`;
  s += `<path d="M 44 80 L 76 80" fill="none" stroke="${C.ink}" stroke-width="2.2" stroke-linecap="round"/>`;
  s += `<g fill="none" stroke="${C.umber}" stroke-width="1" stroke-linecap="round" opacity="0.8"><path d="M 50 81 L 52 89"/><path d="M 57 82 L 58 91"/><path d="M 63 82 L 63 91"/><path d="M 70 81 L 69 89"/><path d="M 46 84 L 74 84"/></g>`;
  s += `<path d="M 51 79 Q 60 68 69 79" fill="none" stroke="${C.ink}" stroke-width="1.6" stroke-linecap="round"/>`;
  s += neck() + headCircle();
  s += `<path d="M 48 33 Q 49 27 53 26 Q 51 31 52 34 Z" fill="${C.ink}"/><path d="M 72 33 Q 71 27 67 26 Q 69 31 68 34 Z" fill="${C.ink}"/>`;
  s += `<path d="M 46 32 Q 46 17 60 16 Q 74 17 74 32 Q 66 25 60 25 Q 54 25 46 32 Z" fill="${C.goldSoft}" ${line}/>`;
  s += `<path d="M 73 28 l 6 -1 l -2 5 Z" fill="${C.goldSoft}" ${ink(1.2)}/>`;
  s += `<path d="M 48 30 Q 60 33 72 30" fill="none" stroke="${C.terraDeep}" stroke-width="1.4" opacity="0.6"/>`;
  s += face();
  return s;
}

// SMITH — a leather apron, a hammer over the shoulder, an anvil and a spark.
function smith(): string {
  let s = shadow();
  s += anvil(74, 95);
  s += `<path d="${star4(74, 84, 4.5)}" fill="${C.gold}"/>`;
  s += `<g fill="none" stroke="${C.gold}" stroke-width="1.2" stroke-linecap="round" opacity="0.8"><path d="M 74 76 L 74 79"/><path d="M 67 80 L 69 82"/><path d="M 81 80 L 79 82"/></g>`;
  s += robe(C.terra);
  s += `<path d="M 51 56 L 69 56 L 72 101 L 48 101 Z" fill="${C.leather}" ${line}/>`;
  s += `<path d="M 53 56 L 58 47 M 67 56 L 62 47" fill="none" stroke="${C.leather}" stroke-width="2.4" stroke-linecap="round"/>`;
  s += `<path d="M 48 76 L 72 76" fill="none" stroke="${C.ink}" stroke-width="1.1" opacity="0.4"/>`;
  s += limb("M 49 54 L 44 63", C.terra, 6);
  s += limb("M 44 63 L 50 70", C.cream, 5);
  s += hand(51, 71);
  s += limb("M 71 54 L 72 62", C.terra, 6);
  s += limb("M 72 62 L 70 52", C.cream, 5);
  s += hand(70, 51);
  s += `<path d="M 70 52 L 76 40" fill="none" stroke="${C.umber}" stroke-width="3" stroke-linecap="round"/>`;
  s += `<path d="M 71 42 L 84 38 L 86 45 L 73 49 Z" fill="${C.inkSoft}" ${line}/>`;
  s += neck() + headCircle();
  s += `<path d="M 48 31 Q 49 21 60 21 Q 71 21 72 31 Q 66 27 60 27 Q 54 27 48 31 Z" fill="${C.ink}"/>`;
  s += face();
  return s;
}

// NAVIGATOR — a sextant, a bicorne hat, a gilt guiding star.
function navigator(): string {
  let s = shadow();
  s += `<circle cx="86" cy="24" r="9" fill="${C.wick}" opacity="0.3"/>`;
  s += `<path d="${star4(86, 24, 7)}" fill="${C.goldSoft}" ${ink(1.3)}/>`;
  s += `<path d="${star4(86, 24, 3)}" fill="${C.gold}"/>`;
  s += `<path d="${star4(72, 16, 2)}" fill="${C.gold}"/>`;
  s += robe(C.goldDeep);
  s += `<path d="M 55 55 L 52 78 M 65 55 L 68 78" fill="none" stroke="${C.ink}" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>`;
  s += `<g fill="${C.gold}" stroke="${C.ink}" stroke-width="0.7"><circle cx="55" cy="62" r="1.5"/><circle cx="65" cy="62" r="1.5"/><circle cx="55" cy="69" r="1.5"/><circle cx="65" cy="69" r="1.5"/></g>`;
  s += limb("M 49 54 C 45 61 46 68 51 73", C.goldDeep, 6);
  s += limb("M 71 54 C 76 61 75 68 69 73", C.goldDeep, 6);
  s += hand(51, 74) + hand(69, 74);
  s += sextant(60, 72);
  s += neck() + headCircle();
  s += face();
  s += `<path d="M 43 22 Q 60 8 77 22 Q 68 20 60 20 Q 52 20 43 22 Z" fill="${C.goldDeep}" ${line}/>`;
  s += `<path d="M 45 21 Q 60 25 75 21" fill="none" stroke="${C.gold}" stroke-width="1.4"/>`;
  s += `<path d="${star4(60, 18, 2.6)}" fill="${C.gold}"/>`;
  return s;
}

// ── the cast — ids + display labels (the order onboarding presents them in) ──
export const KEEPER_ARCHETYPES = [
  { id: "scholar", label: "The Scholar" },
  { id: "athlete", label: "The Athlete" },
  { id: "wanderer", label: "The Wanderer" },
  { id: "tender", label: "The Tender" },
  { id: "mystic", label: "The Mystic" },
  { id: "forager", label: "The Forager" },
  { id: "smith", label: "The Smith" },
  { id: "navigator", label: "The Navigator" },
] as const;

export type KeeperArchetype = (typeof KEEPER_ARCHETYPES)[number]["id"];

const COMPOSERS: Record<KeeperArchetype, () => string> = {
  scholar,
  athlete,
  wanderer,
  tender,
  mystic,
  forager,
  smith,
  navigator,
};

// PURE composer — an archetype in, inner SVG markup out (mirrors `foxSvg`).
export function keeperSvg(archetype: KeeperArchetype): string {
  return COMPOSERS[archetype]();
}

// the thin renderer (mirrors FamiliarGlyph): deterministic, SSR-safe, a11y title
export function KeeperGlyph({
  archetype,
  size = 72,
  className,
  title,
}: {
  archetype: KeeperArchetype;
  size?: number;
  className?: string;
  title?: string;
}) {
  const meta = KEEPER_ARCHETYPES.find((a) => a.id === archetype);
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={title ?? meta?.label ?? "a keeper"}
      dangerouslySetInnerHTML={{ __html: keeperSvg(archetype) }}
    />
  );
}
