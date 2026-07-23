// The Library — the Compendium, one floor up the spiral stair (THE-LIGHTHOUSE.md).
//
// A candlelit tower chamber of bound books, ported from art/proto/library-
// compendium.html at the proto's fidelity, bound to real data. Its heart is the
// GREAT CASE of FIVE books — the Compendium — read at a glance: a book is GOLD-
// edged and risen for what a couple has lived, SILVER ghost-outline for what
// still waits. The gold MENISCUS (the shimmering seam where gold meets silver)
// sits at each book's real gold height — the line where the next lived day inks.
//   · LURING (Legendarium, Bestiary): bounded, so the silver you see is a lure —
//     the struck/arrived turn to gold, the rest wait in silver.
//   · GROWING (Book of Days, Apothecary): open-ended — solid gold once begun.
//   · The Almanac tracks the long arc (a multi-year cycle) — mostly silver still,
//     a gold sliver for the first season.
// A MANTEL above keeps the far SHORES (Dreams) the couple has already reached.
// The PORTHOLE shows the night sea and the far-shore speck; the STAIR descends to
// the warm hearth (violet breath below) and climbs on toward the Lamp (gold above).
//
// Rendering: a flat SVG fragment drawn INTO the shell's shared 1000×1500 svg — no
// document, no canvas, no parallax (the shell owns one atmosphere + grain +
// vignette + the eyebrow/line). Every id is lib_-prefixed so it can't collide
// with the other rooms sharing that svg. Motion lives in globals.css as .lib-*.
// Tapping a book opens it (the shell routes to its page).

import { Hotspot } from "./hotspot";

export type LibrarySnapshot = {
  /** sealed (both-logged) days — the Book of Days */
  days: number;
  legendary: { got: number; total: number };
  beasts: { got: number; total: number };
  /** provisions catalogued — the Apothecary */
  provisions: number;
  /** the Dreams reached — the trophy mantel */
  shores: { id: number; name: string; reachedDay: string | null }[];
};

type Emblem = "days" | "star" | "antler" | "vessel" | "almanac";

type BookView = {
  id: string;
  title: string;
  href: string;
  /** the lived-board gouache colour */
  spine: string;
  emblem: Emblem;
  /** left edge of the 72-wide spine (proto coordinates) */
  x: number;
  /** the ghost extent's top — the whole of what's possible */
  fullTop: number;
  /** 0..1 — how much has been lived */
  goldFrac: number;
  /** growing = open-ended (solid once begun); luring = bounded (meniscus) */
  mode: "growing" | "luring";
  /** the small caption under the book, on the cabinet face */
  count: string;
  labelSub: string;
  /** the small lean the proto stacks each book with */
  rot: number;
  /** bounded books carry a struck/arrived tally for gold-vs-ghost marks */
  bounded?: { got: number; total: number };
};

const BASE = 972; // the shelf the books stand on
const BW = 72; // spine width
// the Almanac's long arc — four years, one leap cycle: "the long arc, begun."
const ALMANAC_ARC = 1461;

function buildBooks(s: LibrarySnapshot): BookView[] {
  const has = (n: number) => (n > 0 ? 1 : 0);
  return [
    {
      id: "days",
      title: "Book of Days",
      href: "/book",
      spine: "#9c5238",
      emblem: "days",
      x: 292,
      fullTop: 672,
      goldFrac: has(s.days),
      mode: "growing",
      count: `${s.days} ${s.days === 1 ? "day" : "days"}`,
      labelSub: `${s.days} DAYS SEALED`,
      rot: -0.8,
    },
    {
      id: "legendarium",
      title: "Legendarium",
      href: "/library#legendarium",
      spine: "#5c4d78",
      emblem: "star",
      x: 378,
      fullTop: 642,
      goldFrac: s.legendary.total ? s.legendary.got / s.legendary.total : 0,
      mode: "luring",
      count: `${s.legendary.got}/${s.legendary.total}`,
      labelSub: `${s.legendary.got} OF ${s.legendary.total} STRUCK`,
      rot: 0.6,
      bounded: s.legendary,
    },
    {
      id: "bestiary",
      title: "Bestiary",
      href: "/library#bestiary",
      spine: "#5f7442",
      emblem: "antler",
      x: 464,
      fullTop: 702,
      goldFrac: s.beasts.total ? s.beasts.got / s.beasts.total : 0,
      mode: "luring",
      count: `${s.beasts.got}/${s.beasts.total}`,
      labelSub: `${s.beasts.got} OF ${s.beasts.total} ARRIVED`,
      rot: -0.5,
      bounded: s.beasts,
    },
    {
      id: "apothecary",
      title: "Apothecary",
      href: "/library#apothecary",
      spine: "#8a6a2f",
      emblem: "vessel",
      x: 550,
      fullTop: 722,
      goldFrac: has(s.provisions),
      mode: "growing",
      count: `${s.provisions} provisions`,
      labelSub: `${s.provisions} PROVISIONS`,
      rot: 0.7,
    },
    {
      id: "almanac",
      title: "Almanac",
      href: "/trends",
      spine: "#453a54",
      emblem: "almanac",
      x: 636,
      fullTop: 742,
      goldFrac: Math.min(1, s.days / ALMANAC_ARC),
      mode: "luring",
      count: s.days ? "the first season" : "—",
      labelSub: s.days ? "THE FIRST SEASON" : "UNBEGUN",
      rot: -0.6,
    },
  ];
}

// a small five-point star, centred, for the struck legendaries
function starPath(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.42;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)} ${(cy + rad * Math.sin(a)).toFixed(1)}`);
  }
  return `M ${pts.join(" L ")} Z`;
}

// ── one book on the great case: ghost extent, data-bound gold, the meniscus,
//    and the book's own gilt ornament (identity + goldFrac) ──
function Book({ b, onOpen }: { b: BookView; onOpen: (href: string) => void }) {
  const cx = b.x + BW / 2;
  const fullH = BASE - b.fullTop;
  const frac = Math.max(0, Math.min(1, b.goldFrac));
  const goldH = frac <= 0 ? 0 : Math.max(28, frac * fullH);
  const goldTop = BASE - goldH;
  const hasGold = goldH > 0;
  const partial = frac > 0 && frac < 1; // the meniscus lives here
  const showSilver = frac < 1;

  // ── the ghost extent: the whole of what still waits, faintly shimmering ──
  const ghostCls = b.id === "bestiary" ? "lib-ghost-2" : b.id === "almanac" ? "lib-ghost-3" : "lib-ghost";
  const ghost = showSilver ? (
    <g className={ghostCls}>
      <rect x={b.x} y={b.fullTop} width={BW} height={fullH} rx={5} fill="#bdb7a8" opacity={0.06} />
      <rect
        x={b.x}
        y={b.fullTop}
        width={BW}
        height={fullH}
        rx={5}
        fill="none"
        stroke="#bdb7a8"
        strokeWidth={1.8}
        strokeDasharray="7 5"
      />
      <path
        d={`M ${b.x + 6} ${b.fullTop + 6} q 30 -5 60 0`}
        fill="none"
        stroke="#bdb7a8"
        strokeWidth={1}
        strokeOpacity={0.5}
      />
      {/* the waiting ornament, drawn in silver up the spine */}
      {b.id === "legendarium" && b.bounded ? <LegendGhostMarks cx={cx} b={b} goldTop={goldTop} /> : null}
      {b.id === "bestiary" ? <BestiaryGhost cx={cx} fullTop={b.fullTop} /> : null}
      {b.id === "almanac" ? <AlmanacGhost cx={cx} /> : null}
    </g>
  ) : null;

  // ── the lived board: gold-edged, risen from the shelf ──
  const board = hasGold ? (
    <g>
      <rect x={b.x} y={goldTop} width={BW} height={goldH} rx={5} fill={b.spine} stroke="#d9a441" strokeWidth={2.5} />
      {/* the shadowed hinge at the spine's back edge */}
      <rect x={b.x} y={goldTop} width={10} height={goldH} rx={5} fill="#241e18" opacity={0.3} />
      {/* a solid growing book rises proud with a gilded page-block cap */}
      {b.mode === "growing" && frac >= 1 ? (
        <>
          <rect x={b.x + 6} y={goldTop - 6} width={BW - 12} height={10} rx={4} fill="#d9a441" />
          <line
            x1={b.x + 10}
            y1={goldTop - 3.5}
            x2={b.x + BW - 6}
            y2={goldTop - 3.5}
            stroke="#f7e3ae"
            strokeWidth={1.6}
            strokeOpacity={0.8}
          />
        </>
      ) : null}
    </g>
  ) : null;

  // ── the meniscus: the seam where the next lived day will ink to gold ──
  const meniscus =
    partial && hasGold ? (
      <rect className="lib-meniscus" x={b.x - 2} y={goldTop - 1} width={BW + 4} height={3} fill="url(#lib_menisG)" />
    ) : null;

  // ── the gilt ornament: identity, only where life has reached gold ──
  const gilt = hasGold ? <BookGilt b={b} cx={cx} goldTop={goldTop} goldH={goldH} /> : null;

  return (
    <Hotspot label={`Open the ${b.title} — ${b.count}`} onActivate={() => onOpen(b.href)}>
      <g transform={`rotate(${b.rot} ${cx} ${BASE})`}>
        <g className="lib-bk">
          {ghost}
          {board}
          {gilt}
          {meniscus}
        </g>
      </g>
    </Hotspot>
  );
}

// the seven-still-waiting: ghost stars/circles up the silver spine
function LegendGhostMarks({ cx, b, goldTop }: { cx: number; b: BookView; goldTop: number }) {
  const total = b.bounded!.total;
  const got = b.bounded!.got;
  if (total <= 0) return null;
  const top = 690;
  const bottom = 940;
  const step = total > 1 ? (bottom - top) / (total - 1) : 0;
  const marks = [];
  for (let i = 0; i < total; i++) {
    const y = total > 1 ? top + i * step : (top + bottom) / 2;
    const isGold = i >= total - got; // the struck ones live at the bottom, in gold
    if (isGold) continue; // gold stars are drawn over the board, not in the ghost
    if (y > goldTop - 4) continue; // stays clear of the risen board
    marks.push(
      i === 0 ? (
        <path
          key={i}
          d={starPath(cx, y, 5.2)}
          fill="none"
          stroke="#bdb7a8"
          strokeWidth={1.2}
          strokeLinejoin="round"
          opacity={0.65}
        />
      ) : (
        <circle key={i} cx={cx} cy={y} r={3.4} fill="none" stroke="#bdb7a8" strokeWidth={1.2} opacity={0.65} />
      ),
    );
  }
  return <g>{marks}</g>;
}

// the struck legendaries, small and certain, in gold within the board
function LegendGoldMarks({ cx, b, goldTop }: { cx: number; b: BookView; goldTop: number }) {
  const total = b.bounded!.total;
  const got = b.bounded!.got;
  if (total <= 0 || got <= 0) return null;
  const top = 690;
  const bottom = 940;
  const step = total > 1 ? (bottom - top) / (total - 1) : 0;
  const stars = [];
  for (let i = total - got; i < total; i++) {
    const y = total > 1 ? top + i * step : (top + bottom) / 2;
    if (y < goldTop + 6) continue; // only where the board has actually risen
    stars.push(<path key={i} d={starPath(cx, y, 5.4)} fill="#f0cb7e" opacity={0.92} />);
  }
  return <g>{stars}</g>;
}

// an antler crown not yet grown, ghosted at the top of the silver
function BestiaryGhost({ cx, fullTop }: { cx: number; fullTop: number }) {
  const y = fullTop + 42;
  return (
    <g>
      <g
        fill="none"
        stroke="#bdb7a8"
        strokeWidth={1.4}
        strokeLinecap="round"
        opacity={0.65}
        transform={`translate(${cx} ${y})`}
      >
        <path d="M 0 12 Q -2 2 -1 -8 M -1 -2 Q -7 -4 -11 -3 M -.6 -6 Q -5 -10 -10 -10" />
        <path d="M 0 12 Q 2 2 1 -8 M 1 -2 Q 7 -4 11 -3 M .6 -6 Q 5 -10 10 -10" />
      </g>
      <g fill="#bdb7a8" opacity={0.5}>
        <circle cx={cx - 14} cy={y + 42} r={1.6} />
        <circle cx={cx} cy={y + 48} r={1.6} />
        <circle cx={cx + 14} cy={y + 42} r={1.6} />
      </g>
    </g>
  );
}

// the moons of seasons not yet witnessed, and the arc it will one day draw
function AlmanacGhost({ cx }: { cx: number }) {
  return (
    <g>
      <g stroke="#bdb7a8" strokeWidth={1.2} fill="none" opacity={0.65}>
        <circle cx={cx} cy={782} r={5} />
        <path d={`M ${cx} 817 a 5 5 0 1 0 0 10 a 7 7 0 0 1 0 -10`} />
        <circle cx={cx} cy={862} r={5} fill="#bdb7a8" opacity={0.35} />
        <path d={`M ${cx} 897 a 5 5 0 1 1 0 10 a 7 7 0 0 0 0 -10`} />
      </g>
      <path
        d={`M ${cx - 22} 940 C ${cx - 14} 920 ${cx} 892 ${cx + 22} 758`}
        fill="none"
        stroke="#bdb7a8"
        strokeWidth={1}
        strokeDasharray="3 6"
        opacity={0.5}
      />
    </g>
  );
}

// the book's gilt ornament — each Compendium book wears its own, in gold
function BookGilt({ b, cx, goldTop, goldH }: { b: BookView; cx: number; goldTop: number; goldH: number }) {
  const gold = "#f0cb7e";
  switch (b.emblem) {
    case "days":
      return (
        <g>
          {/* raised bands */}
          <g fill="#d9a441" opacity={0.55}>
            <rect x={b.x + 8} y={goldTop + 84} width={BW - 16} height={7} rx={3} />
            <rect x={b.x + 8} y={goldTop + 174} width={BW - 16} height={7} rx={3} />
            <rect x={b.x + 8} y={goldTop + 258} width={BW - 16} height={7} rx={3} />
          </g>
          {/* the open-book emblem, gilt */}
          <g transform={`translate(${cx} ${goldTop + 44})`} fill="none" stroke={gold} strokeWidth={2.4} strokeLinejoin="round">
            <path d="M 0 -9 C -6 -13 -13 -13 -16 -10 L -16 8 C -13 5 -6 5 0 9 C 6 5 13 5 16 8 L 16 -10 C 13 -13 6 -13 0 -9 Z" />
            <path d="M 0 -9 L 0 9" />
          </g>
          {/* the garnet cabochon: a drop of the seal itself, set in the spine */}
          <circle cx={cx} cy={goldTop + 218} r={8} fill="#93372b" stroke="#d9a441" strokeWidth={1.6} />
          <ellipse cx={cx - 3} cy={goldTop + 215} rx={3} ry={2} transform={`rotate(-30 ${cx - 3} ${goldTop + 215})`} fill="#c9b3e3" opacity={0.25} />
          {/* a ribbon marker escaping the boards — it always binds */}
          <path
            d={`M ${b.x + 60} ${goldTop + 2} C ${b.x + 64} ${goldTop + 28} ${b.x + 58} ${goldTop + 48} ${b.x + 63} ${goldTop + 72} C ${b.x + 64} ${goldTop + 78} ${b.x + 62} ${goldTop + 83} ${b.x + 60} ${goldTop + 86} L ${b.x + 54} ${goldTop + 83} C ${b.x + 57} ${goldTop + 78} ${b.x + 58} ${goldTop + 72} ${b.x + 56} ${goldTop + 64} C ${b.x + 53} ${goldTop + 44} ${b.x + 59} ${goldTop + 24} ${b.x + 56} ${goldTop + 4} Z`}
            fill="#c4704b"
          />
        </g>
      );
    case "star":
      return <LegendGoldMarks cx={cx} b={b} goldTop={goldTop} />;
    case "antler":
      return (
        <g>
          {/* the antlers it HAS grown, gilt */}
          <g fill="none" stroke={gold} strokeWidth={2.2} strokeLinecap="round" transform={`translate(${cx} ${goldTop + 40})`}>
            <path d="M 0 14 Q -3 2 -1 -9 M -1 -2 Q -8 -5 -13 -4 M -.6 -7 Q -6 -11 -12 -12" />
            <path d="M 0 14 Q 3 2 1 -9 M 1 -2 Q 8 -5 13 -4 M .6 -7 Q 6 -11 12 -12" />
          </g>
          {goldH > 100 ? (
            <>
              <rect x={b.x + 8} y={goldTop + 86} width={BW - 16} height={6} rx={3} fill="#d9a441" opacity={0.7} />
              {/* small paw-marks of the ones who came */}
              <g fill={gold} opacity={0.8}>
                <circle cx={cx - 14} cy={BASE - 28} r={1.8} />
                <circle cx={cx - 7} cy={BASE - 24} r={1.8} />
                <circle cx={cx + 7} cy={BASE - 24} r={1.8} />
                <circle cx={cx + 14} cy={BASE - 28} r={1.8} />
              </g>
            </>
          ) : null}
        </g>
      );
    case "vessel":
      return (
        <g>
          {/* brass straps + clasp: opened daily, and closed well */}
          <g fill="#3a3128" stroke="#d9a441" strokeWidth={1.2} strokeOpacity={0.75}>
            <rect x={b.x - 2} y={goldTop + 58} width={BW + 4} height={12} rx={3} />
            <rect x={b.x - 2} y={goldTop + 178} width={BW + 4} height={12} rx={3} />
          </g>
          <rect x={cx + 14} y={goldTop + 55} width={14} height={18} rx={3} fill="#3a3128" stroke="#d9a441" strokeWidth={1.4} />
          <circle cx={cx + 21} cy={goldTop + 64} r={2.2} fill="#d9a441" opacity={0.8} />
          {/* the vessel emblem, gilt */}
          <g transform={`translate(${cx} ${goldTop + 34})`} fill="none" stroke={gold} strokeWidth={2.2} strokeLinejoin="round">
            <path d="M -5 -11 L 5 -11 M -4 -11 L -4 -4 L -8 6 Q -8 11 -3 11 L 3 11 Q 8 11 8 6 L 4 -4 L 4 -11" />
            <path d="M -7 3 L 7 3" />
          </g>
          {/* sprigs pressed between pages, peeking from the fore-edge */}
          <g stroke="#5b6b3c" strokeWidth={1.4} fill="none" opacity={0.9}>
            <path d={`M ${b.x + BW} ${goldTop + 120} q 8 -2 12 -7`} />
            <path d={`M ${b.x + BW} ${goldTop + 126} q 7 1 11 5`} />
          </g>
          <ellipse cx={b.x + BW + 11} cy={goldTop + 114} rx={3} ry={1.5} transform={`rotate(-35 ${b.x + BW + 11} ${goldTop + 114})`} fill="#7c8a4d" />
        </g>
      );
    case "almanac":
      // the first season, inked: one small gold moon in the sliver
      return <circle cx={cx} cy={BASE - 15} r={4.5} fill={gold} />;
  }
}

// a far Dream already sailed to — cast small in gold on the mantel
function ShoreToken({ cx, name }: { cx: number; name: string }) {
  const label = (name.length > 10 ? name.slice(0, 9) + "…" : name).toUpperCase();
  return (
    <g>
      <rect x={cx - 27} y={586} width={54} height={14} rx={2} fill="#3a2c1e" />
      <line x1={cx - 24} y1={587.6} x2={cx + 24} y2={587.6} stroke="#d9a441" strokeWidth={1} strokeOpacity={0.4} />
      <rect x={cx - 21} y={589} width={42} height={9} rx={1} fill="#f5eddc" opacity={0.9} />
      <text x={cx} y={595.8} textAnchor="middle" fontFamily="'Courier New', Courier, monospace" fontSize={5} letterSpacing={0.5} fill="#4a3a28">
        {label}
      </text>
      {/* the island, cast small in gold */}
      <path d={`M ${cx - 22} 586 C ${cx - 16} 578 ${cx - 6} 574 ${cx + 4} 575 C ${cx + 14} 576 ${cx + 20} 580 ${cx + 23} 586 Z`} fill="#d9a441" />
      <path d={`M ${cx - 18} 584 C ${cx - 12} 579 ${cx - 4} 577 ${cx + 2} 577`} fill="none" stroke="#f7e3ae" strokeWidth={1.2} strokeOpacity={0.7} />
      {/* a single palm, in gold */}
      <path d={`M ${cx - 4} 575 C ${cx - 5} 566 ${cx - 3} 558 ${cx + 2} 552 C ${cx + 3} 560 ${cx + 5} 566 ${cx + 4} 575 Z`} fill="#d9a441" />
      <path
        d={`M ${cx + 2} 552 C ${cx + 6} 554 ${cx + 10} 554 ${cx + 13} 552 M ${cx + 2} 552 C ${cx} 548 ${cx} 545 ${cx + 2} 541 M ${cx + 2} 552 C ${cx - 3} 551 ${cx - 6} 549 ${cx - 8} 546`}
        fill="none"
        stroke="#d9a441"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <circle cx={cx + 16} cy={580} r={1.5} fill="#f7e3ae" className="lib-twinkle" style={{ animationDuration: "9s" }} />
    </g>
  );
}

// a plinth that waits, in silver — a Dream not yet reached
function ShoreWaiting({ cx, cls }: { cx: number; cls: string }) {
  return (
    <g className={cls} fill="none" stroke="#bdb7a8">
      <rect x={cx - 23} y={586} width={46} height={14} rx={2} strokeWidth={1.4} strokeDasharray="5 4" />
      <path
        d={`M ${cx - 18} 586 C ${cx - 13} 579 ${cx - 5} 576 ${cx} 577 C ${cx + 6} 578 ${cx + 13} 581 ${cx + 17} 586`}
        strokeWidth={1.2}
        strokeDasharray="4 4"
      />
    </g>
  );
}

export function LibraryRoom({
  snapshot,
  onOpenBook,
}: {
  snapshot: LibrarySnapshot;
  onOpenBook: (href: string) => void;
}) {
  const books = buildBooks(snapshot);
  const reached = snapshot.shores.filter((s) => s.reachedDay);
  const MANTEL = [340, 448, 556, 664]; // four token slots across the crown

  return (
    <>
      <defs>
        <linearGradient id="lib_wallG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#332b22" />
          <stop offset=".55" stopColor="#3a3128" />
          <stop offset="1" stopColor="#2f2820" />
        </linearGradient>
        <linearGradient id="lib_floorG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c251d" />
          <stop offset="1" stopColor="#241e18" />
        </linearGradient>
        <linearGradient id="lib_skyE" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#382f47" />
          <stop offset="1" stopColor="#453a54" />
        </linearGradient>
        <linearGradient id="lib_seaG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2436" />
          <stop offset="1" stopColor="#241e18" />
        </linearGradient>
        <linearGradient id="lib_pageG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f5eddc" />
          <stop offset="1" stopColor="#e6d9bd" />
        </linearGradient>
        <radialGradient id="lib_glowSmG">
          <stop offset="0" stopColor="#f7e3ae" stopOpacity=".4" />
          <stop offset="1" stopColor="#f7e3ae" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lib_spillG">
          <stop offset="0" stopColor="#f7e3ae" stopOpacity=".24" />
          <stop offset=".55" stopColor="#d9a441" stopOpacity=".1" />
          <stop offset="1" stopColor="#c4704b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lib_shadG">
          <stop offset="0" stopColor="#1e1913" stopOpacity=".55" />
          <stop offset="1" stopColor="#1e1913" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lib_stairDnG" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#d9a441" stopOpacity=".5" />
          <stop offset=".55" stopColor="#c4704b" stopOpacity=".2" />
          <stop offset="1" stopColor="#c4704b" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lib_violUpG" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#c9b3e3" stopOpacity=".22" />
          <stop offset="1" stopColor="#c9b3e3" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lib_stairUpG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7e3ae" stopOpacity=".5" />
          <stop offset=".6" stopColor="#d9a441" stopOpacity=".18" />
          <stop offset="1" stopColor="#d9a441" stopOpacity="0" />
        </linearGradient>
        {/* the gold meniscus — where life has inked to, and where tomorrow writes */}
        <linearGradient id="lib_menisG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d9a441" stopOpacity="0" />
          <stop offset=".5" stopColor="#f7e3ae" stopOpacity=".95" />
          <stop offset="1" stopColor="#d9a441" stopOpacity="0" />
        </linearGradient>
        <clipPath id="lib_clipPort">
          <circle cx={500} cy={318} r={78} />
        </clipPath>
      </defs>

      {/* ═══════════ FAR: the tower chamber ═══════════ */}
      <g>
        <rect x={-700} y={-400} width={2900} height={1612} fill="url(#lib_wallG)" />
        <rect x={-700} y={1210} width={2900} height={700} fill="url(#lib_floorG)" />
        <line x1={-700} y1={1211} x2={2200} y2={1211} stroke="#1e1913" strokeOpacity={0.55} strokeWidth={2.5} />
        <g stroke="#1e1913" strokeWidth={2} strokeOpacity={0.42}>
          <line x1={-700} y1={1252} x2={2200} y2={1252} />
          <line x1={-700} y1={1296} x2={2200} y2={1296} />
          <line x1={-700} y1={1346} x2={2200} y2={1346} />
          <line x1={-700} y1={1404} x2={2200} y2={1404} />
          <line x1={-700} y1={1472} x2={2200} y2={1472} />
        </g>
        {/* ceiling beams; the tower goes on above */}
        <rect x={-700} y={-80} width={2900} height={70} fill="#2e261d" />
        <rect x={-700} y={40} width={2900} height={56} fill="#332a20" />
        <line x1={-700} y1={96} x2={2200} y2={96} stroke="#1e1913" strokeWidth={2.5} strokeOpacity={0.7} />
        <g stroke="#241e18" strokeWidth={1} strokeOpacity={0.35}>
          <path d="M -700 58 C 100 54, 900 62, 2200 56" fill="none" />
          <path d="M -700 78 C 200 82, 1100 74, 2200 80" fill="none" />
        </g>
        {/* sparse stone ticks: a tower wall, not wallpaper */}
        <g stroke="#241e18" strokeWidth={1.4} strokeOpacity={0.14}>
          <line x1={70} y1={180} x2={126} y2={180} />
          <line x1={640} y1={200} x2={700} y2={200} />
          <line x1={60} y1={560} x2={112} y2={560} />
          <line x1={250} y1={620} x2={300} y2={620} />
          <line x1={700} y1={560} x2={752} y2={560} />
          <line x1={270} y1={176} x2={322} y2={176} />
          <line x1={80} y1={1120} x2={140} y2={1120} />
          <line x1={600} y1={1140} x2={652} y2={1140} />
        </g>

        {/* ── THE PORTHOLE: the night sea, and the reason for towers ── */}
        <g>
          <circle cx={500} cy={318} r={98} fill="#463c30" />
          <circle cx={500} cy={318} r={98} fill="none" stroke="#241e18" strokeWidth={2} strokeOpacity={0.6} />
          <circle cx={500} cy={318} r={78} fill="url(#lib_skyE)" />
          <g clipPath="url(#lib_clipPort)">
            <g fill="#fbf6ea">
              <circle cx={462} cy={270} r={1.1} opacity={0.5} />
              <circle cx={492} cy={256} r={0.9} opacity={0.4} />
              <circle cx={530} cy={266} r={1.3} opacity={0.6} />
              <circle cx={552} cy={292} r={1} opacity={0.45} />
              <circle cx={444} cy={300} r={1} opacity={0.42} />
              <circle cx={470} cy={330} r={0.9} opacity={0.35} />
              <circle cx={548} cy={330} r={1} opacity={0.4} />
            </g>
            {/* the small × asterism — two hands, written in the heavens */}
            <g stroke="#fbf6ea" strokeWidth={0.8} strokeOpacity={0.25}>
              <line x1={512} y1={276} x2={526} y2={292} />
              <line x1={526} y1={276} x2={512} y2={292} />
            </g>
            <circle cx={512} cy={276} r={1.3} fill="#fbf6ea" opacity={0.7} />
            <circle cx={526} cy={292} r={1.3} fill="#fbf6ea" opacity={0.65} />
            <circle cx={526} cy={276} r={1.1} fill="#fbf6ea" opacity={0.6} className="lib-twinkle" style={{ animationDelay: "-5s" }} />
            <circle cx={512} cy={292} r={1.1} fill="#fbf6ea" opacity={0.6} />
            {/* the sea, and the far gold shore on its horizon */}
            <rect x={422} y={352} width={156} height={46} fill="url(#lib_seaG)" />
            <line x1={422} y1={352} x2={578} y2={352} stroke="#453a54" strokeWidth={1.2} strokeOpacity={0.8} />
            <g stroke="#453a54" strokeWidth={1.1} strokeOpacity={0.5}>
              <line x1={436} y1={366} x2={470} y2={366} />
              <line x1={496} y1={378} x2={540} y2={378} />
              <line x1={452} y1={390} x2={492} y2={390} />
            </g>
            <g fill="#d9a441">
              <rect x={530} y={349.6} width={6} height={1.7} rx={0.8} />
              <rect x={538} y={349} width={4.4} height={1.5} rx={0.7} />
            </g>
            <circle cx={536} cy={348} r={1.3} fill="#f7e3ae" className="lib-twinkle" style={{ animationDelay: "-1s", animationDuration: "9s" }} />
            <path d="M 535 354 q 2 8 -1 16 q -2 8 1 18" fill="none" stroke="#d9a441" strokeWidth={1.3} strokeOpacity={0.28} />
          </g>
          {/* brass mullions + rivetted ring */}
          <g stroke="#d9a441" strokeWidth={1.5} strokeOpacity={0.42} fill="none">
            <line x1={500} y1={240} x2={500} y2={396} />
            <line x1={422} y1={318} x2={578} y2={318} />
          </g>
          <circle cx={500} cy={318} r={78} fill="none" stroke="#1e1913" strokeWidth={7} strokeOpacity={0.3} />
          <circle cx={500} cy={318} r={88} fill="none" stroke="#d9a441" strokeWidth={2} strokeOpacity={0.5} />
          <path d="M 434 254 A 88 88 0 0 1 500 230" fill="none" stroke="#f7e3ae" strokeWidth={1.4} strokeOpacity={0.5} />
          <g fill="#d9a441" opacity={0.7}>
            <circle cx={500} cy={226} r={2.2} />
            <circle cx={592} cy={318} r={2.2} />
            <circle cx={500} cy={410} r={2.2} />
            <circle cx={408} cy={318} r={2.2} />
            <circle cx={565} cy={253} r={1.8} />
            <circle cx={435} cy={253} r={1.8} />
            <circle cx={565} cy={383} r={1.8} />
            <circle cx={435} cy={383} r={1.8} />
          </g>
        </g>

        {/* ── THE STAIR, UP: on toward the Lamp; gold falls down the treads ── */}
        <g>
          <path d="M 812 340 L 812 190 A 88 88 0 0 1 988 190 L 988 340 Z" fill="#463c30" />
          <path d="M 824 332 L 824 194 A 76 76 0 0 1 976 194 L 976 332 Z" fill="#1e1913" />
          <g className="lib-lampbleed">
            <rect x={824} y={118} width={152} height={200} fill="url(#lib_stairUpG)" />
            <ellipse cx={900} cy={176} rx={58} ry={52} fill="url(#lib_glowSmG)" opacity={0.55} />
          </g>
          <path d="M 826 332 L 974 332 L 974 300 L 826 312 Z" fill="#2a231b" />
          <path d="M 832 312 L 974 300 L 962 270 L 838 288 Z" fill="#272119" />
          <path d="M 842 288 L 960 270 L 940 246 L 848 266 Z" fill="#241e17" />
          <path d="M 852 266 L 938 246 L 916 228 L 858 248 Z" fill="#221c16" />
          <g fill="none" stroke="#f7e3ae" strokeWidth={1.5}>
            <path d="M 826 312 L 974 300" strokeOpacity={0.42} />
            <path d="M 838 288 L 962 270" strokeOpacity={0.34} />
            <path d="M 848 266 L 940 246" strokeOpacity={0.26} />
            <path d="M 858 248 L 916 228" strokeOpacity={0.16} />
          </g>
          <path d="M 812 340 L 812 190 A 88 88 0 0 1 988 190 L 988 340" fill="none" stroke="#241e18" strokeWidth={2} strokeOpacity={0.55} />
          <g stroke="#241e18" strokeWidth={1.4} strokeOpacity={0.4}>
            <line x1={838} y1={140} x2={850} y2={156} />
            <line x1={900} y1={98} x2={900} y2={118} />
            <line x1={962} y1={140} x2={950} y2={156} />
          </g>
        </g>

        {/* ── THE STAIR, DOWN: back to the hearth; its warmth climbs to meet you ── */}
        <g>
          <path d="M 800 1210 L 800 760 A 100 100 0 0 1 1000 760 L 1000 1210 Z" fill="#463c30" />
          <path d="M 812 1200 L 812 764 A 88 88 0 0 1 988 764 L 988 1200 Z" fill="#1e1913" />
          <rect x={812} y={920} width={176} height={282} fill="url(#lib_stairDnG)" />
          <rect className="lib-stairbreath" x={812} y={860} width={176} height={342} fill="url(#lib_violUpG)" />
          <path d="M 814 1200 L 986 1200 L 986 1162 L 814 1174 Z" fill="#2a231b" />
          <path d="M 820 1174 L 986 1162 L 972 1124 L 826 1144 Z" fill="#272119" />
          <path d="M 832 1144 L 970 1124 L 948 1092 L 840 1116 Z" fill="#241e17" />
          <path d="M 846 1116 L 946 1092 L 920 1066 L 852 1090 Z" fill="#221c16" />
          <path d="M 858 1090 L 918 1066 L 896 1048 L 862 1068 Z" fill="#201a14" />
          <g fill="none" stroke="#f7e3ae" strokeWidth={1.5}>
            <path d="M 814 1174 L 986 1162" strokeOpacity={0.4} />
            <path d="M 826 1144 L 972 1124" strokeOpacity={0.32} />
            <path d="M 840 1116 L 948 1092" strokeOpacity={0.24} />
            <path d="M 852 1090 L 920 1066" strokeOpacity={0.15} />
          </g>
          <path d="M 836 1194 C 858 1140, 886 1098, 922 1074" fill="none" stroke="#3a2c1e" strokeWidth={5} />
          <path d="M 836 1194 C 858 1140, 886 1098, 922 1074" fill="none" stroke="#d9a441" strokeWidth={1} strokeOpacity={0.3} />
          <path d="M 800 1210 L 800 760 A 100 100 0 0 1 1000 760 L 1000 1210" fill="none" stroke="#241e18" strokeWidth={2} strokeOpacity={0.55} />
          <g stroke="#241e18" strokeWidth={1.4} strokeOpacity={0.4}>
            <line x1={828} y1={706} x2={840} y2={722} />
            <line x1={900} y1={664} x2={900} y2={684} />
            <line x1={972} y1={706} x2={960} y2={722} />
          </g>
          {/* the hearth's own key, on its hook by the way down */}
          <g fill="none" stroke="#d9a441" strokeWidth={2} strokeLinecap="round">
            <path d="M 776 806 C 783 805, 786 812, 781 817" strokeOpacity={0.85} />
            <circle cx={780} cy={826} r={6} strokeOpacity={0.8} />
            <line x1={780} y1={832} x2={780} y2={856} strokeOpacity={0.8} strokeWidth={2.5} />
            <line x1={780} y1={849} x2={787} y2={849} strokeOpacity={0.8} strokeWidth={2.5} />
            <line x1={780} y1={856} x2={786} y2={856} strokeOpacity={0.8} strokeWidth={2.5} />
          </g>
        </g>

        {/* ── SHELF WINGS: the ordinary nights, unlabeled and many ── */}
        <g>
          <rect x={30} y={392} width={216} height={792} fill="#2a231b" />
          <g stroke="#1e1913" strokeWidth={3} strokeOpacity={0.7}>
            <line x1={30} y1={590} x2={246} y2={590} />
            <line x1={30} y1={788} x2={246} y2={788} />
            <line x1={30} y1={986} x2={246} y2={986} />
          </g>
          <line x1={34} y1={394.5} x2={242} y2={394.5} stroke="#f7e3ae" strokeWidth={1.2} strokeOpacity={0.1} />
          <g opacity={0.85}>
            <rect x={48} y={512} width={17} height={76} fill="#5b6b3c" />
            <rect x={69} y={504} width={14} height={84} fill="#8a4c33" />
            <rect x={87} y={520} width={21} height={68} fill="#3a3128" />
            <rect x={112} y={508} width={12} height={80} fill="#c4704b" opacity={0.8} />
            <rect x={128} y={524} width={19} height={64} fill="#5b6b3c" opacity={0.8} />
            <rect x={151} y={498} width={16} height={90} fill="#f5eddc" opacity={0.5} />
            <rect x={171} y={516} width={23} height={72} fill="#8a4c33" opacity={0.9} />
            <rect x={198} y={506} width={13} height={82} fill="#3a3128" />
            <g transform="rotate(-8 224 560)">
              <rect x={216} y={516} width={16} height={74} fill="#93372b" opacity={0.7} />
            </g>
            <rect x={46} y={716} width={16} height={70} fill="#8a4c33" />
            <rect x={66} y={706} width={21} height={80} fill="#3a3128" />
            <rect x={91} y={720} width={13} height={66} fill="#5b6b3c" />
            <rect x={108} y={702} width={18} height={84} fill="#f5eddc" opacity={0.5} />
            <rect x={130} y={724} width={23} height={62} fill="#c4704b" opacity={0.75} />
            <rect x={157} y={710} width={15} height={76} fill="#5b6b3c" opacity={0.85} />
            <rect x={176} y={718} width={20} height={68} fill="#8a4c33" opacity={0.8} />
            <rect x={200} y={708} width={14} height={78} fill="#d9a441" opacity={0.4} />
            <rect x={52} y={912} width={21} height={72} fill="#3a3128" />
            <rect x={77} y={900} width={14} height={84} fill="#5b6b3c" />
            <rect x={95} y={916} width={18} height={68} fill="#8a4c33" opacity={0.85} />
            <rect x={117} y={906} width={16} height={78} fill="#f5eddc" opacity={0.5} />
            <rect x={137} y={920} width={22} height={64} fill="#3a3128" opacity={0.9} />
            <rect x={163} y={908} width={13} height={76} fill="#c4704b" opacity={0.7} />
            <rect x={180} y={914} width={19} height={70} fill="#5b6b3c" opacity={0.8} />
            {/* a short stack lying flat — someone was reading here recently */}
            <rect x={46} y={1150} width={88} height={14} rx={2} fill="#8a4c33" />
            <rect x={54} y={1136} width={80} height={14} rx={2} fill="#3a3128" />
            <rect x={60} y={1122} width={70} height={14} rx={2} fill="#5b6b3c" />
          </g>
          <line x1={30} y1={1184} x2={246} y2={1184} stroke="#1e1913" strokeWidth={1.2} strokeOpacity={0.3} />
        </g>
        <g>
          <rect x={768} y={400} width={196} height={330} fill="#2a231b" />
          <line x1={768} y1={566} x2={964} y2={566} stroke="#1e1913" strokeWidth={3} strokeOpacity={0.7} />
          <g opacity={0.85}>
            <rect x={782} y={488} width={16} height={76} fill="#8a4c33" />
            <rect x={802} y={478} width={20} height={86} fill="#3a3128" />
            <rect x={826} y={494} width={13} height={70} fill="#5b6b3c" />
            <rect x={843} y={482} width={17} height={82} fill="#f5eddc" opacity={0.5} />
            <rect x={864} y={498} width={22} height={66} fill="#c4704b" opacity={0.78} />
            <rect x={890} y={486} width={14} height={78} fill="#5b6b3c" opacity={0.85} />
            <rect x={908} y={492} width={19} height={72} fill="#8a4c33" opacity={0.8} />
            <rect x={931} y={500} width={12} height={64} fill="#93372b" opacity={0.65} />
            <rect x={780} y={656} width={19} height={70} fill="#3a3128" />
            <rect x={803} y={646} width={13} height={80} fill="#c4704b" opacity={0.7} />
            <rect x={820} y={660} width={17} height={66} fill="#5b6b3c" />
            <rect x={841} y={650} width={21} height={76} fill="#8a4c33" opacity={0.85} />
            <rect x={866} y={662} width={14} height={64} fill="#f5eddc" opacity={0.5} />
            <rect x={884} y={654} width={18} height={72} fill="#3a3128" opacity={0.9} />
            <rect x={906} y={648} width={15} height={78} fill="#d9a441" opacity={0.38} />
          </g>
        </g>
        {/* the room's one written rule, framed small on the wall */}
        <g transform="rotate(-1.5 148 262)">
          <rect x={70} y={212} width={156} height={100} rx={3} fill="#3a2c1e" />
          <rect x={78} y={220} width={140} height={84} rx={2} fill="url(#lib_pageG)" />
          <rect x={78} y={220} width={140} height={84} rx={2} fill="none" stroke="#2b2014" strokeWidth={1} strokeOpacity={0.25} />
          <g fontFamily="'Courier New', Courier, monospace" fontSize={9.5} letterSpacing={1.6} fill="#4a3a28" textAnchor="middle">
            <text x={148} y={244}>WHAT IS LIVED</text>
            <text x={148} y={260}>TURNS TO GOLD.</text>
            <text x={148} y={282}>WHAT WAITS</text>
            <text x={148} y={298}>KEEPS SILVER.</text>
          </g>
          <circle cx={148} cy={226} r={2} fill="#d9a441" />
        </g>
        {/* wings past the frame: the shelves keep going */}
        <g opacity={0.9}>
          <rect x={-360} y={480} width={300} height={720} fill="#2a231b" />
          <g stroke="#1e1913" strokeWidth={3} strokeOpacity={0.7}>
            <line x1={-360} y1={720} x2={-60} y2={720} />
            <line x1={-360} y1={960} x2={-60} y2={960} />
          </g>
          <g opacity={0.8}>
            <rect x={-330} y={620} width={18} height={90} fill="#5b6b3c" />
            <rect x={-306} y={632} width={24} height={78} fill="#8a4c33" />
            <rect x={-276} y={612} width={15} height={98} fill="#3a3128" />
            <rect x={-256} y={640} width={20} height={70} fill="#c4704b" opacity={0.8} />
            <rect x={-230} y={622} width={17} height={88} fill="#f5eddc" opacity={0.5} />
            <rect x={-208} y={636} width={22} height={74} fill="#5b6b3c" opacity={0.8} />
            <rect x={-330} y={862} width={22} height={88} fill="#8a4c33" />
            <rect x={-302} y={874} width={16} height={76} fill="#3a3128" />
            <rect x={-282} y={858} width={19} height={92} fill="#5b6b3c" opacity={0.85} />
            <rect x={-258} y={880} width={24} height={70} fill="#c4704b" opacity={0.7} />
          </g>
          <rect x={1020} y={520} width={300} height={700} fill="#2a231b" />
          <g opacity={0.8}>
            <rect x={1042} y={640} width={20} height={86} fill="#8a4c33" />
            <rect x={1066} y={652} width={15} height={74} fill="#5b6b3c" />
            <rect x={1086} y={632} width={22} height={94} fill="#3a3128" />
            <rect x={1112} y={656} width={17} height={70} fill="#f5eddc" opacity={0.5} />
          </g>
        </g>
      </g>

      {/* ═══════════ MID: the Compendium — what two people have kept ═══════════ */}
      <g>
        {/* a woven rug: this room expects you to stay a while */}
        <g>
          <ellipse cx={470} cy={1318} rx={300} ry={58} fill="#5a3a28" opacity={0.75} />
          <ellipse cx={470} cy={1318} rx={300} ry={58} fill="none" stroke="#3a2c1e" strokeWidth={3} strokeOpacity={0.6} />
          <ellipse cx={470} cy={1318} rx={252} ry={46} fill="none" stroke="#7c8a4d" strokeWidth={2} strokeOpacity={0.35} strokeDasharray="10 7" />
          <ellipse cx={470} cy={1318} rx={190} ry={33} fill="#46402f" opacity={0.6} />
          <ellipse cx={470} cy={1318} rx={120} ry={20} fill="none" stroke="#c4704b" strokeWidth={1.6} strokeOpacity={0.3} strokeDasharray="6 6" />
        </g>

        {/* ── THE GREAT CASE ── */}
        <ellipse cx={500} cy={1092} rx={268} ry={15} fill="url(#lib_shadG)" />
        {/* crown: the mantel of shores */}
        <rect x={240} y={600} width={520} height={34} rx={4} fill="#4a4034" />
        <line x1={246} y1={602.5} x2={754} y2={602.5} stroke="#f7e3ae" strokeWidth={2} strokeOpacity={0.16} />
        <line x1={240} y1={633} x2={760} y2={633} stroke="#241e18" strokeWidth={2} strokeOpacity={0.5} />
        <g stroke="#241e18" strokeWidth={1.3} strokeOpacity={0.35}>
          <line x1={300} y1={602} x2={306} y2={632} />
          <line x1={500} y1={600} x2={500} y2={634} />
          <line x1={700} y1={602} x2={694} y2={632} />
        </g>
        {/* the crown's brass plate */}
        <rect x={436} y={608} width={128} height={19} rx={3} fill="#3a3128" stroke="#d9a441" strokeWidth={1} strokeOpacity={0.65} />
        <text x={500} y={621} textAnchor="middle" fontFamily="'Courier New', Courier, monospace" fontSize={8} letterSpacing={2} fill="#d9a441" opacity={0.85}>
          THE SHORES REACHED
        </text>
        {/* columns + corbels */}
        <path d="M 262 634 l 24 0 l -4 14 l -16 0 Z" fill="#3b322a" />
        <path d="M 714 634 l 24 0 l -4 14 l -16 0 Z" fill="#3b322a" />
        <rect x={262} y={634} width={24} height={338} fill="#3a2c1e" />
        <rect x={714} y={634} width={24} height={338} fill="#3a2c1e" />
        <g stroke="#241e18" strokeWidth={1.2} strokeOpacity={0.45}>
          <line x1={270} y1={652} x2={270} y2={962} />
          <line x1={278} y1={652} x2={278} y2={962} />
          <line x1={722} y1={652} x2={722} y2={962} />
          <line x1={730} y1={652} x2={730} y2={962} />
        </g>
        {/* back panel, with a faint carved arch behind the books */}
        <rect x={286} y={634} width={428} height={338} fill="#2a231b" />
        <path d="M 316 972 L 316 730 A 184 184 0 0 1 684 730 L 684 972" fill="none" stroke="#241e18" strokeWidth={2} strokeOpacity={0.5} />
        <path d="M 330 972 L 330 736 A 170 170 0 0 1 670 736 L 670 972" fill="none" stroke="#d9a441" strokeWidth={1} strokeOpacity={0.12} />
        {/* the shelf the books stand on */}
        <rect x={250} y={972} width={500} height={20} rx={3} fill="#4a4034" />
        <line x1={256} y1={974.5} x2={744} y2={974.5} stroke="#f7e3ae" strokeWidth={1.6} strokeOpacity={0.14} />
        {/* base cabinet */}
        <rect x={262} y={992} width={476} height={92} rx={4} fill="#3a2c1e" />
        <g fill="none" stroke="#241e18" strokeWidth={1.6} strokeOpacity={0.55}>
          <path d="M 292 1076 L 292 1022 A 44 44 0 0 1 380 1022 L 380 1076" />
          <path d="M 620 1076 L 620 1022 A 44 44 0 0 1 708 1022 L 708 1076" />
        </g>
        <circle cx={392} cy={1046} r={3} fill="#d9a441" opacity={0.7} />
        <circle cx={608} cy={1046} r={3} fill="#d9a441" opacity={0.7} />
        <path d="M 268 1084 l 26 0 l -6 18 l -14 0 Z" fill="#33291d" />
        <path d="M 706 1084 l 26 0 l -6 18 l -14 0 Z" fill="#33291d" />

        {/* ── THE SHORES, on the mantel: the Dreams already sailed to ── */}
        {reached.length === 0 ? (
          <text x={500} y={580} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize={13} fill="#8a7d68">
            no shores yet — the mantel waits for your first
          </text>
        ) : (
          MANTEL.map((mx, i) =>
            i < reached.length ? (
              <ShoreToken key={reached[i].id} cx={mx} name={reached[i].name} />
            ) : (
              <ShoreWaiting key={`wait-${i}`} cx={mx} cls={i % 2 === 0 ? "lib-ghost" : "lib-ghost-2"} />
            ),
          )
        )}

        {/* ══ THE FIVE BOOKS — gold for the lived, silver for what waits ══ */}
        {books.map((b) => (
          <Book key={b.id} b={b} onOpen={onOpenBook} />
        ))}

        {/* shelf labels, inked small on the cabinet face */}
        <g fontFamily="'Courier New', Courier, monospace" textAnchor="middle">
          {books.map((b) => {
            const cx = b.x + BW / 2;
            return (
              <g key={b.id} transform={`rotate(${b.rot} ${cx} 1010)`}>
                <rect x={cx - 40} y={1000} width={80} height={22} rx={1.5} fill="#f5eddc" opacity={0.92} />
                <text x={cx} y={1009} fontSize={6.2} letterSpacing={0.5} fill="#4a3a28">
                  {b.title.toUpperCase()}
                </text>
                <text x={cx} y={1018} fontSize={5.4} letterSpacing={0.4} fill="#7a6a54">
                  {b.labelSub}
                </text>
              </g>
            );
          })}
        </g>

        {/* the ladder, leaned where the high nights are kept */}
        <g>
          <ellipse cx={182} cy={1208} rx={42} ry={7} fill="url(#lib_shadG)" />
          <line x1={158} y1={1206} x2={198} y2={516} stroke="#3a2c1e" strokeWidth={9} />
          <line x1={192} y1={1206} x2={228} y2={516} stroke="#3a2c1e" strokeWidth={9} />
          <line x1={160} y1={1206} x2={200} y2={516} stroke="#d9a441" strokeWidth={1} strokeOpacity={0.22} />
          <g stroke="#33291d" strokeWidth={6}>
            <line x1={164} y1={1130} x2={197} y2={1132} />
            <line x1={168} y1={1052} x2={201} y2={1054} />
            <line x1={172} y1={974} x2={205} y2={976} />
            <line x1={176} y1={896} x2={209} y2={898} />
            <line x1={180} y1={818} x2={213} y2={820} />
            <line x1={184} y1={740} x2={217} y2={742} />
            <line x1={188} y1={662} x2={220} y2={664} />
            <line x1={192} y1={588} x2={224} y2={590} />
          </g>
        </g>
      </g>

      {/* ═══════════ HEART: the lamplight, and the two who read here ═══════════ */}
      <g>
        {/* the warm pool the lantern lays over the books */}
        <ellipse cx={500} cy={850} rx={430} ry={330} fill="url(#lib_spillG)" />

        {/* ── THE READING LANTERN, hung from the crown ── */}
        <g>
          <line x1={500} y1={634} x2={500} y2={654} stroke="#6b5a44" strokeWidth={1.6} />
          <circle cx={500} cy={642} r={3} fill="none" stroke="#d9a441" strokeWidth={1.2} strokeOpacity={0.6} />
          <circle cx={500} cy={650} r={3} fill="none" stroke="#d9a441" strokeWidth={1.2} strokeOpacity={0.6} />
          <circle cx={500} cy={682} r={42} fill="url(#lib_glowSmG)" opacity={0.9} />
          <path d="M 486 664 L 514 664 L 507 654 L 493 654 Z" fill="#241e18" stroke="#d9a441" strokeWidth={1.3} strokeOpacity={0.75} />
          <rect x={484} y={664} width={32} height={40} rx={4} fill="#241e18" opacity={0.85} stroke="#d9a441" strokeWidth={1.5} strokeOpacity={0.8} />
          <line x1={494} y1={666} x2={494} y2={702} stroke="#d9a441" strokeWidth={1} strokeOpacity={0.4} />
          <line x1={506} y1={666} x2={506} y2={702} stroke="#d9a441" strokeWidth={1} strokeOpacity={0.4} />
          <path className="lib-flame" d="M 500 678 C 505 684, 506 690, 500 695 C 494 690, 495 684, 500 678 Z" fill="#d9a441" />
          <path className="lib-flame" d="M 500 683 C 502.5 686, 503 689, 500 692 C 497 689, 497.5 686, 500 683 Z" fill="#f7e3ae" />
          <line x1={500} y1={704} x2={500} y2={710} stroke="#d9a441" strokeWidth={1.4} strokeOpacity={0.6} />
          <circle cx={500} cy={712} r={2} fill="#d9a441" opacity={0.7} />
        </g>
        {/* the paper-moth that reads over your shoulder */}
        <g className="lib-moth" opacity={0.85}>
          <g transform="translate(556 646)">
            <path className="lib-moth-wing-l" d="M 0 0 C -9 -7, -16 -6, -14 1 C -12 6, -5 6, 0 2 Z" fill="#e6d9bd" />
            <path className="lib-moth-wing-r" d="M 3 0 C 12 -7, 19 -6, 17 1 C 15 6, 8 6, 3 2 Z" fill="#f5eddc" />
            <ellipse cx={1.5} cy={2} rx={2} ry={4} fill="#6b5a44" />
            <path d="M 0 -2 q -2 -4 -5 -5 M 3 -2 q 2 -4 5 -5" fill="none" stroke="#6b5a44" strokeWidth={0.8} />
          </g>
        </g>

        {/* ── THE READING DESK: the Book of Days lies open, mid-sentence ── */}
        <g>
          <ellipse cx={184} cy={1396} rx={130} ry={12} fill="url(#lib_shadG)" />
          <rect x={60} y={1198} width={14} height={194} fill="#33291d" />
          <rect x={294} y={1198} width={14} height={194} fill="#33291d" />
          <rect x={60} y={1328} width={248} height={10} fill="#33291d" opacity={0.9} />
          <rect x={48} y={1178} width={272} height={22} rx={3} fill="#3a2c1e" />
          <line x1={54} y1={1180.5} x2={314} y2={1180.5} stroke="#f7e3ae" strokeWidth={1.5} strokeOpacity={0.13} />
          {/* the candle that keeps the page */}
          <g>
            <circle cx={92} cy={1124} r={26} fill="url(#lib_glowSmG)" />
            <ellipse cx={92} cy={1176} rx={15} ry={5} fill="#3a3128" stroke="#d9a441" strokeWidth={1.2} strokeOpacity={0.6} />
            <rect x={85} y={1134} width={14} height={40} rx={3} fill="#f5eddc" />
            <path d="M 85 1146 q -3 7 0 13 q 2 4 1 7" fill="none" stroke="#e6d9bd" strokeWidth={2.6} />
            <line x1={92} y1={1134} x2={92} y2={1128} stroke="#2b2014" strokeWidth={1.2} />
            <path className="lib-flame slow" d="M 92 1110 C 97 1116, 98 1122, 92 1127 C 86 1122, 87 1116, 92 1110 Z" fill="#d9a441" />
            <path className="lib-flame slow" d="M 92 1116 C 94.5 1119, 95 1122, 92 1125 C 89 1122, 89.5 1119, 92 1116 Z" fill="#f7e3ae" />
          </g>
          {/* the slanted stand and the open spread */}
          <g transform="rotate(-3 210 1150)">
            <path d="M 128 1168 L 292 1152 L 300 1180 L 136 1196 Z" fill="#3a2c1e" />
            <path d="M 134 1150 L 208 1141 L 212 1177 L 140 1186 Z" fill="url(#lib_pageG)" />
            <path d="M 286 1150 L 212 1141 L 208 1177 L 282 1186 Z" fill="url(#lib_pageG)" />
            <line x1={210} y1={1141} x2={210} y2={1178} stroke="#d9c9a8" strokeWidth={2} />
            <path d="M 140 1188.5 L 212 1179.5 M 282 1188.5 L 208 1179.5" stroke="#e6d9bd" strokeWidth={1.2} fill="none" />
            {/* the day's seal, small at the head of the fold */}
            <circle cx={210} cy={1150} r={7.5} fill="#93372b" stroke="#6e2a20" strokeWidth={1} />
            <path d="M 206.5 1146.5 L 213.5 1153.5 M 213.5 1146.5 L 206.5 1153.5" stroke="#f5eddc" strokeWidth={1.4} strokeLinecap="round" />
            <path d="M 205 1145 A 7.5 7.5 0 0 1 210 1142.5" fill="none" stroke="#d9a441" strokeWidth={0.9} strokeOpacity={0.8} />
            {/* one hand's lines, then the other's, facing each other across the fold */}
            <g fill="none" stroke="#5b6b3c" strokeWidth={1} strokeOpacity={0.55}>
              <path d="M 146 1158 q 14 -3 28 -1 q 12 2 26 -1" />
              <path d="M 148 1165 q 16 -3 30 -1 q 10 1 22 -1" />
              <path d="M 150 1172 q 10 -2 22 -1" />
            </g>
            <g fill="none" stroke="#8a4c33" strokeWidth={1} strokeOpacity={0.55}>
              <path d="M 222 1157 q 14 -2 28 0 q 12 1 24 -1" />
              <path d="M 224 1164 q 16 -2 30 0" />
              <path d="M 226 1171 q 12 -2 24 0 q 8 1 18 0" />
            </g>
            {/* a voice pressed into the margin: garnet, waiting to be heard again */}
            <circle cx={272} cy={1148} r={4.6} fill="#93372b" stroke="#6e2a20" strokeWidth={1} />
            <g stroke="#d9a441" strokeWidth={1} strokeOpacity={0.7} fill="none">
              <path d="M 279 1145 q 3 3 0 6" />
              <path d="M 283 1142 q 5 6 0 12" />
            </g>
          </g>
          {/* spectacles, set down mid-thought */}
          <g fill="none" stroke="#d9a441" strokeWidth={1.4} strokeOpacity={0.7} transform="rotate(8 262 1192)">
            <circle cx={252} cy={1192} r={7} />
            <circle cx={272} cy={1192} r={7} />
            <path d="M 259 1192 q 3 -3 6 0" />
          </g>
        </g>

        {/* ── THE CHAIR, built wide enough for two ── */}
        <g>
          <ellipse cx={712} cy={1392} rx={128} ry={13} fill="url(#lib_shadG)" />
          <path d="M 612 1348 L 612 1080 Q 612 1044 650 1042 L 774 1042 Q 812 1044 812 1080 L 812 1348 Z" fill="#3a2c1e" />
          <path d="M 626 1330 L 626 1090 Q 626 1058 656 1056 L 768 1056 Q 798 1058 798 1090 L 798 1330 Z" fill="#8a4c33" />
          <path d="M 630 1094 Q 630 1062 658 1060 L 700 1059" fill="none" stroke="#c4704b" strokeWidth={2} strokeOpacity={0.5} />
          <g fill="#6e3a26" opacity={0.8}>
            <circle cx={670} cy={1110} r={2.2} />
            <circle cx={712} cy={1104} r={2.2} />
            <circle cx={754} cy={1110} r={2.2} />
            <circle cx={690} cy={1150} r={2.2} />
            <circle cx={734} cy={1150} r={2.2} />
          </g>
          {/* the two cushions: one moss, one ember, shoulder to shoulder */}
          <g transform="rotate(-3 668 1240)">
            <rect x={632} y={1204} width={76} height={66} rx={10} fill="#5b6b3c" />
            <rect x={638} y={1210} width={64} height={54} rx={8} fill="none" stroke="#7c8a4d" strokeWidth={1.6} strokeOpacity={0.7} strokeDasharray="2 5" />
          </g>
          <g transform="rotate(2.5 756 1240)">
            <rect x={718} y={1206} width={76} height={66} rx={10} fill="#a85a38" />
            <rect x={724} y={1212} width={64} height={54} rx={8} fill="none" stroke="#c4704b" strokeWidth={1.6} strokeOpacity={0.8} strokeDasharray="2 5" />
          </g>
          <path d="M 606 1348 L 818 1348 L 810 1296 Q 806 1276 782 1276 L 642 1276 Q 618 1276 614 1296 Z" fill="#33291d" />
          <path d="M 614 1296 Q 712 1284 810 1296" fill="none" stroke="#f7e3ae" strokeWidth={1.4} strokeOpacity={0.12} />
          <path d="M 618 1348 l 20 0 l -4 42 l -12 0 Z" fill="#33291d" />
          <path d="M 786 1348 l 20 0 l -4 42 l -12 0 Z" fill="#33291d" />
          {/* the blanket, thrown where it landed */}
          <path
            d="M 780 1046 C 802 1064, 810 1102, 806 1148 C 804 1178, 808 1206, 816 1226 L 836 1220 C 828 1196, 826 1168, 828 1140 C 832 1096, 820 1058, 796 1040 Z"
            fill="#f5eddc"
            opacity={0.92}
          />
          <g stroke="#7c8a4d" strokeWidth={2.4} strokeOpacity={0.6} fill="none">
            <path d="M 790 1060 C 806 1078, 812 1108, 810 1140" />
            <path d="M 800 1052 C 816 1072, 822 1104, 820 1138" />
          </g>
          <path d="M 816 1226 L 836 1220 L 830 1236 Q 822 1240 814 1236 Z" fill="#e6d9bd" />
          {/* a small book left on the seat: someone is coming back */}
          <g transform="rotate(-7 668 1290)">
            <rect x={642} y={1282} width={52} height={15} rx={3} fill="#5c4d78" />
            <line x1={646} y1={1284.4} x2={690} y2={1284.4} stroke="#d9a441" strokeWidth={1} strokeOpacity={0.6} />
            <rect x={648} y={1279} width={42} height={4} rx={2} fill="#e6d9bd" />
          </g>
        </g>
      </g>
    </>
  );
}
