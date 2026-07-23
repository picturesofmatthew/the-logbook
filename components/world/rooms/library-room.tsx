// The Library — the Compendium, up the spiral stair (THE-LIGHTHOUSE.md).
//
// The first stub made real. The room is a warm reading sanctum; its heart is
// the shelf of FIVE bound books, each a doorway to its content. The books ARE
// the inspiration engine, read at a glance: a book's spine is gold for what
// you've lived and silver ghost-outline for what still waits. Two kinds —
//   · LURING (Legendarium, Bestiary): bounded, so the silver you can see is a
//     lure — "aspiration you can see", inked to gold as you strike/befriend.
//   · GROWING (Book of Days, Apothecary, Almanac): open-ended, so they simply
//     accumulate gold; silver only while a book is still empty.
// A mantel above keeps the Dreams you've already sailed to (where Relics went).
//
// Tapping a book opens it (the shell routes to its page). The book interiors
// stay as the current pages for now; Phase 2b makes them in-world spreads.

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
  spine: string;
  emblem: Emblem;
  height: number;
  goldFrac: number;
  count: string;
};

function buildBooks(s: LibrarySnapshot): BookView[] {
  const has = (n: number) => (n > 0 ? 1 : 0);
  return [
    {
      id: "days",
      title: "Book of Days",
      href: "/book",
      spine: "#9c5238",
      emblem: "days",
      height: 288,
      goldFrac: has(s.days),
      count: `${s.days} ${s.days === 1 ? "day" : "days"}`,
    },
    {
      id: "legendarium",
      title: "Legendarium",
      href: "/library#legendarium",
      spine: "#6a4f96",
      emblem: "star",
      height: 312,
      goldFrac: s.legendary.total ? s.legendary.got / s.legendary.total : 0,
      count: `${s.legendary.got}/${s.legendary.total}`,
    },
    {
      id: "bestiary",
      title: "Bestiary",
      href: "/library#bestiary",
      spine: "#5f7442",
      emblem: "antler",
      height: 264,
      goldFrac: s.beasts.total ? s.beasts.got / s.beasts.total : 0,
      count: `${s.beasts.got}/${s.beasts.total}`,
    },
    {
      id: "apothecary",
      title: "Apothecary",
      href: "/library#apothecary",
      spine: "#a8823f",
      emblem: "vessel",
      height: 246,
      goldFrac: has(s.provisions),
      count: `${s.provisions}`,
    },
    {
      id: "almanac",
      title: "Almanac",
      href: "/trends",
      spine: "#465a86",
      emblem: "almanac",
      height: 224,
      goldFrac: has(s.days),
      count: s.days ? "the arc" : "—",
    },
  ];
}

// small gilt emblem, drawn ~18px around its local origin
function BookEmblem({ kind }: { kind: Emblem }) {
  const c = "#e8c886";
  switch (kind) {
    case "days":
      return (
        <g fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round">
          <path d="M0 -8 C-5 -11 -11 -11 -13 -9 V7 C-11 5 -5 5 0 8 C5 5 11 5 13 7 V-9 C11 -11 5 -11 0 -8 Z" />
          <path d="M0 -8 V8" />
        </g>
      );
    case "star":
      return (
        <path
          d="M0 -12 L3.3 -3.6 L12 -3 L5.2 2.4 L7.6 11 L0 6 L-7.6 11 L-5.2 2.4 L-12 -3 L-3.3 -3.6 Z"
          fill={c}
        />
      );
    case "antler":
      return (
        <g fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
          <path d="M0 10 Q-2 2 -1 -6 M-1 -1 Q-6 -3 -9 -2 M-0.6 -5 Q-4 -8 -8 -8" />
          <path d="M0 10 Q2 2 1 -6 M1 -1 Q6 -3 9 -2 M0.6 -5 Q4 -8 8 -8" />
        </g>
      );
    case "vessel":
      return (
        <g fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round">
          <path d="M-5 -10 H5 M-4 -10 V-4 L-8 6 Q-8 11 -3 11 H3 Q8 11 8 6 L4 -4 V-10" />
          <path d="M-7 3 H7" />
        </g>
      );
    case "almanac":
      return (
        <g fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M-11 8 L-3 -1 L2 3 L11 -9" />
          <circle cx="-11" cy="8" r="1.6" fill={c} />
          <circle cx="2" cy="3" r="1.6" fill={c} />
          <circle cx="11" cy="-9" r="1.6" fill={c} />
        </g>
      );
  }
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

  const w = 62;
  const gap = 14;
  const span = books.length * w + (books.length - 1) * gap;
  const x0 = 500 - span / 2;
  const baseY = 992;

  return (
    <>
      <defs>
        <linearGradient id="lr_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2c1e" />
          <stop offset="1" stopColor="#281e14" />
        </linearGradient>
        <radialGradient id="lr_lamp" cx="0.5" cy="0.44" r="0.56">
          <stop offset="0" stopColor="#f0cb7e" stopOpacity="0.5" />
          <stop offset="1" stopColor="#f0cb7e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="1000" height="1500" fill="url(#lr_wall)" />
      <ellipse cx="500" cy="700" rx="480" ry="480" fill="url(#lr_lamp)" />

      {/* shelves down both walls */}
      <g fill="#20180f" opacity="0.9">
        {[300, 470, 640, 810].map((y) => (
          <g key={`sh${y}`}>
            <rect x="34" y={y} width="150" height="128" rx="4" />
            <rect x="816" y={y} width="150" height="128" rx="4" />
          </g>
        ))}
      </g>
      <g fill="#7a5a34" opacity="0.6">
        {[300, 470, 640, 810].map((y) =>
          [50, 78, 106, 134, 162].map((x) => (
            <g key={`${y}-${x}`}>
              <rect x={x} y={y + 14} width="18" height="100" rx="2" />
              <rect x={x + 766} y={y + 14} width="18" height="100" rx="2" />
            </g>
          )),
        )}
      </g>

      {/* the trophy mantel — the Dreams you've sailed to */}
      <g>
        <rect x="330" y="214" width="340" height="16" rx="5" fill="#33261a" />
        <text
          x="500"
          y="196"
          textAnchor="middle"
          fontSize="15"
          letterSpacing="3"
          fill="#c9b48c"
          fontFamily="ui-monospace, monospace"
        >
          SHORES REACHED
        </text>
        {reached.length === 0 ? (
          <text
            x="500"
            y="176"
            textAnchor="middle"
            fontSize="15"
            fontStyle="italic"
            fill="#8a7d68"
            fontFamily="Georgia, serif"
          >
            the mantel awaits your first shore
          </text>
        ) : (
          <g>
            {reached.slice(0, 5).map((s, i) => {
              const n = Math.min(reached.length, 5);
              const rx = 500 + (i - (n - 1) / 2) * 84;
              return (
                <g key={s.id} transform={`translate(${rx} 176)`}>
                  <circle r="24" fill="#241c14" stroke="#e8c886" strokeWidth="2" />
                  <g transform="scale(1.15)">
                    <BookEmblem kind="star" />
                  </g>
                </g>
              );
            })}
          </g>
        )}
      </g>

      {/* the lectern the books stand on */}
      <rect x={x0 - 22} y={baseY} width={span + 44} height="26" rx="7" fill="#33261a" />
      <rect x={x0 - 22} y={baseY + 24} width={span + 44} height="10" rx="4" fill="#241a10" />

      {/* THE FIVE BOOKS — gold for the lived, silver for what waits */}
      {books.map((b, i) => {
        const x = x0 + i * (w + gap);
        const goldH = Math.max(b.goldFrac > 0 ? 22 : 0, b.height * b.goldFrac);
        return (
          <g
            key={b.id}
            className="lib-book"
            data-hotspot="true"
            role="button"
            tabIndex={0}
            aria-label={`Open the ${b.title} — ${b.count}`}
            onClick={() => onOpenBook(b.href)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpenBook(b.href);
              }
            }}
          >
            {/* the whole of what's possible — silver ghost-outline */}
            <rect
              x={x}
              y={baseY - b.height}
              width={w}
              height={b.height}
              rx="5"
              fill="none"
              stroke="#bdb7a8"
              strokeWidth="2"
              strokeDasharray="5 5"
              opacity="0.5"
            />
            {/* the lived portion — gold-edged, risen from the shelf */}
            {goldH > 0 ? (
              <g>
                <rect
                  x={x}
                  y={baseY - goldH}
                  width={w}
                  height={goldH}
                  rx="5"
                  fill={b.spine}
                  stroke="#e8c886"
                  strokeWidth="2.5"
                />
                <rect
                  x={x + 9}
                  y={baseY - goldH + 14}
                  width={w - 18}
                  height="7"
                  rx="3"
                  fill="#e8c886"
                  opacity="0.5"
                />
              </g>
            ) : null}
            {/* the emblem, near the top of the spine */}
            <g transform={`translate(${x + w / 2} ${baseY - b.height + 40})`} opacity={goldH > 40 ? 0.95 : 0.4}>
              <BookEmblem kind={b.emblem} />
            </g>
            {/* title + count, on the shelf under the book */}
            <text
              x={x + w / 2}
              y={baseY + 52}
              textAnchor="middle"
              fontSize="15"
              fill="#d8c7a4"
              fontFamily="Georgia, serif"
            >
              {b.title}
            </text>
            <text
              x={x + w / 2}
              y={baseY + 72}
              textAnchor="middle"
              fontSize="13"
              fill="#9a8a6a"
              fontFamily="ui-monospace, monospace"
            >
              {b.count}
            </text>
          </g>
        );
      })}

      {/* the spiral stair, arriving from below */}
      <g stroke="#3a2c1c" strokeWidth="12" fill="none" opacity="0.65" strokeLinecap="round">
        <path d="M430 1500 Q500 1360 570 1420" />
        <path d="M430 1440 Q500 1300 570 1360" />
        <path d="M430 1380 Q500 1240 570 1300" />
      </g>
    </>
  );
}
