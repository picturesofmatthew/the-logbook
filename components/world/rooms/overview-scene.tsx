// The Overview — the whole world, seen from afar (THE-LIGHTHOUSE.md, the cold
// open). The establishing vista the app opens on: the island in the dark sea,
// the lighthouse rising from it with its lamp lit and a slow beam, the garden to
// the west and the docks + far shore to the east. Already alive — stars twinkle,
// the beam sweeps, a warm window glows at the hearth. On "enter," the shell
// zooms THROUGH that warm window and arrives inside, at the hearth.
//
// The zoom origin is the warm window (~50% / 55% of the frame), so the push-in
// flies into the lighthouse and dissolves to the hearth interior.

export const OVERVIEW_VIEWBOX = { width: 1000, height: 1500 };

const STARS: [number, number, number][] = [
  [90, 150, 2.2],
  [220, 90, 1.6],
  [360, 180, 2.0],
  [520, 110, 1.5],
  [660, 200, 2.4],
  [790, 120, 1.8],
  [900, 210, 2.2],
  [160, 300, 1.5],
  [430, 340, 1.8],
  [700, 360, 1.6],
  [840, 420, 2.0],
  [280, 470, 1.5],
];

export function OverviewScene() {
  return (
    <>
      <defs>
        <linearGradient id="ov_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#12102a" />
          <stop offset="0.6" stopColor="#1d1938" />
          <stop offset="1" stopColor="#2a2446" />
        </linearGradient>
        <linearGradient id="ov_sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#221d38" />
          <stop offset="1" stopColor="#100d1a" />
        </linearGradient>
        <radialGradient id="ov_moon" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f4ead0" />
          <stop offset="1" stopColor="#f4ead0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ov_lamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe6a6" />
          <stop offset="1" stopColor="#ffe6a6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ov_beam" x1="0" y1="0" x2="1" y2="0.5">
          <stop offset="0" stopColor="#ffe6a6" stopOpacity="0.42" />
          <stop offset="1" stopColor="#ffe6a6" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ov_window" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f3c574" />
          <stop offset="1" stopColor="#f3c574" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ov_shore" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f0c878" />
          <stop offset="1" stopColor="#f0c878" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="1000" height="1500" fill="url(#ov_sky)" />

      {/* the moon */}
      <circle cx="806" cy="300" r="150" fill="url(#ov_moon)" opacity="0.4" />
      <circle cx="806" cy="300" r="56" fill="#f1e6c8" opacity="0.9" />

      {/* stars, twinkling */}
      <g fill="#f2e6c4">
        {STARS.map(([x, y, r], i) => (
          <circle
            key={i}
            className="ov-twinkle"
            cx={x}
            cy={y}
            r={r}
            style={{ animationDelay: `${(i % 5) * 0.9}s` }}
          />
        ))}
      </g>

      {/* the sea */}
      <rect x="0" y="912" width="1000" height="588" fill="url(#ov_sea)" />
      {/* the far shore — a speck of gold on the eastern horizon */}
      <ellipse cx="884" cy="912" rx="120" ry="22" fill="url(#ov_shore)" opacity="0.7" />
      <rect x="866" y="906" width="34" height="9" rx="4" fill="#f0c878" opacity="0.85" />

      {/* the beam, sweeping slowly out over the water */}
      <g
        className="ov-beam"
        style={{ transformBox: "fill-box", transformOrigin: "0% 50%" }}
      >
        <polygon points="500,700 1120,560 1120,900 500,760" fill="url(#ov_beam)" />
      </g>

      {/* the island — a silhouette landmass on the sea */}
      <path
        d="M150 970 Q300 860 500 872 Q720 884 860 976 Q900 1010 900 1060 L100 1060 Q100 1006 150 970 Z"
        fill="#241f30"
      />
      <path
        d="M150 970 Q300 860 500 872 Q720 884 860 976"
        fill="none"
        stroke="#3a3350"
        strokeWidth="3"
        opacity="0.6"
      />

      {/* the garden, west on the island — a cluster of trees */}
      <g opacity="0.9">
        <path d="M250 966 V930" stroke="#1c2418" strokeWidth="7" strokeLinecap="round" />
        <circle cx="250" cy="918" r="30" fill="#2c3a26" />
        <path d="M300 970 V940" stroke="#1c2418" strokeWidth="6" strokeLinecap="round" />
        <circle cx="300" cy="930" r="24" fill="#33422a" />
        <path d="M210 972 V948" stroke="#1c2418" strokeWidth="5" strokeLinecap="round" />
        <circle cx="210" cy="940" r="20" fill="#2c3a26" />
      </g>

      {/* the docks, east on the island — a little pier and the vessel */}
      <g opacity="0.92">
        <rect x="700" y="988" width="120" height="10" rx="3" fill="#2a2018" />
        <path d="M726 998 V1030 M786 998 V1030" stroke="#1c150e" strokeWidth="5" />
        <g transform="translate(660 966) scale(0.5)">
          <path d="M-60 0 Q0 30 60 0 L46 22 Q0 34 -46 22 Z" fill="#1e1811" />
          <path d="M0 2 V-70" stroke="#2a2016" strokeWidth="8" strokeLinecap="round" />
          <path d="M4 -68 L40 -26 L4 -26 Z" fill="#b7a37c" opacity="0.85" />
        </g>
      </g>

      {/* THE LIGHTHOUSE — the heart, rising from the island centre. The push-in
          flies into the warm window and arrives at the hearth. */}
      <g>
        {/* the tower */}
        <path d="M456 1012 L468 700 L532 700 L544 1012 Z" fill="#c9bfa8" />
        <path d="M456 1012 L468 700 L500 700 L500 1012 Z" fill="#b3a98f" />
        {/* barber stripes */}
        <path d="M461 880 L539 880 L541 924 L459 924 Z" fill="#9c5238" opacity="0.85" />
        <path d="M465 780 L535 780 L537 820 L463 820 Z" fill="#9c5238" opacity="0.7" />
        {/* the warm hearth window — the zoom target */}
        <ellipse cx="500" cy="836" rx="70" ry="70" fill="url(#ov_window)" opacity="0.9" />
        <rect x="484" y="828" width="32" height="40" rx="14" fill="#f3c574" />
        <rect x="488" y="832" width="24" height="32" rx="11" fill="#ffe6b0" />
        {/* the gallery + lamp housing */}
        <rect x="446" y="676" width="108" height="30" rx="5" fill="#2f2740" />
        <rect x="462" y="628" width="76" height="52" rx="6" fill="#3a3050" stroke="#c9a86a" strokeWidth="4" />
        {/* the lit lamp */}
        <circle cx="500" cy="654" r="120" fill="url(#ov_lamp)" opacity="0.85" />
        <circle cx="500" cy="654" r="26" fill="#ffe6a6" />
        <circle cx="500" cy="654" r="13" fill="#fff6df" />
        {/* the cap */}
        <path d="M456 628 L500 588 L544 628 Z" fill="#2a2236" stroke="#c9a86a" strokeWidth="3" />
        <circle cx="500" cy="584" r="6" fill="#c9a86a" />
      </g>
    </>
  );
}
