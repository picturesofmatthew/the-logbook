// The Overview — the whole world, seen from afar (THE-LIGHTHOUSE.md, the cold
// open). The gate the app opens on: the island the world lives on, the
// lighthouse rising from it with its lamp lit and a slow beam, the garden to the
// west and the docks to the east, a far-off island low on the horizon, and a sky
// of stars strung into constellations. Already alive — stars twinkle, the beam
// sweeps, a warm window glows at the hearth. On "begin," the shell zooms THROUGH
// that warm window and arrives inside, at the hearth.
//
// The zoom origin is the warm window (~50% / 55% of the frame), so the push-in
// flies into the lighthouse and dissolves to the hearth interior.

export const OVERVIEW_VIEWBOX = { width: 1000, height: 1500 };

// scattered field stars — [x, y, r]
const STARS: [number, number, number][] = [
  [70, 150, 2.0],
  [150, 250, 1.4],
  [250, 90, 1.6],
  [330, 210, 1.5],
  [420, 130, 1.4],
  [470, 300, 1.6],
  [560, 90, 1.5],
  [610, 250, 1.4],
  [720, 300, 1.6],
  [820, 180, 1.5],
  [890, 120, 1.7],
  [940, 260, 1.5],
  [120, 360, 1.4],
  [300, 420, 1.5],
  [520, 440, 1.4],
  [700, 400, 1.6],
  [860, 400, 1.4],
  [180, 470, 1.3],
  [400, 520, 1.3],
];

// constellations — vertices strung by faint lines, the stars to steer by
const CONSTELLATIONS: [number, number][][] = [
  // a keeper's plough, upper left
  [
    [96, 210],
    [170, 168],
    [244, 196],
    [316, 150],
    [352, 214],
    [300, 268],
  ],
  // a diamond, near the moon
  [
    [640, 150],
    [712, 108],
    [786, 158],
    [712, 214],
    [640, 150],
  ],
];

function Constellations() {
  return (
    <g>
      {CONSTELLATIONS.map((pts, ci) => (
        <g key={ci}>
          <polyline
            points={pts.map(([x, y]) => `${x},${y}`).join(" ")}
            fill="none"
            stroke="#e8d9a8"
            strokeWidth="1.1"
            opacity="0.22"
          />
          {pts.map(([x, y], i) => (
            <circle
              key={i}
              className="ov-twinkle"
              cx={x}
              cy={y}
              r="2.4"
              fill="#f4ead0"
              style={{ animationDelay: `${(i % 4) * 0.8}s` }}
            />
          ))}
        </g>
      ))}
    </g>
  );
}

export function OverviewScene() {
  return (
    <>
      <defs>
        <linearGradient id="ov_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#100e26" />
          <stop offset="0.55" stopColor="#1b1736" />
          <stop offset="1" stopColor="#2a2446" />
        </linearGradient>
        <linearGradient id="ov_sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#241f3c" />
          <stop offset="1" stopColor="#0e0b17" />
        </linearGradient>
        <radialGradient id="ov_moon" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f4ead0" />
          <stop offset="1" stopColor="#f4ead0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ov_moonpath" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4ead0" stopOpacity="0.5" />
          <stop offset="1" stopColor="#f4ead0" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ov_lamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe6a6" />
          <stop offset="1" stopColor="#ffe6a6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ov_beam" x1="0" y1="0" x2="1" y2="0.5">
          <stop offset="0" stopColor="#ffe6a6" stopOpacity="0.4" />
          <stop offset="1" stopColor="#ffe6a6" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ov_window" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f3c574" />
          <stop offset="1" stopColor="#f3c574" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ov_far" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f0c878" />
          <stop offset="1" stopColor="#f0c878" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="1000" height="1500" fill="url(#ov_sky)" />

      {/* the moon */}
      <circle cx="812" cy="286" r="160" fill="url(#ov_moon)" opacity="0.4" />
      <circle cx="812" cy="286" r="58" fill="#f1e6c8" opacity="0.92" />
      <circle cx="792" cy="272" r="9" fill="#e4d7b4" opacity="0.5" />
      <circle cx="828" cy="300" r="6" fill="#e4d7b4" opacity="0.45" />

      {/* the sky to steer by */}
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
      <Constellations />

      {/* the sea */}
      <rect x="0" y="912" width="1000" height="588" fill="url(#ov_sea)" />
      {/* the moon's path shimmering on the water */}
      <path d="M812 912 L860 1500 L764 1500 Z" fill="url(#ov_moonpath)" opacity="0.6" />

      {/* the far-off island — the Dream, low on the eastern horizon, its own
          small light burning */}
      <path d="M812 912 Q872 884 936 906 Q972 918 972 912 L972 924 Q890 936 812 924 Z" fill="#1a1628" />
      <ellipse cx="900" cy="910" rx="70" ry="16" fill="url(#ov_far)" opacity="0.7" />
      <circle cx="900" cy="906" r="4" fill="#ffe6a6" />

      {/* the beam, sweeping slowly out over the water */}
      <g
        className="ov-beam"
        style={{ transformBox: "fill-box", transformOrigin: "0% 50%" }}
      >
        <polygon points="500,700 1120,560 1120,900 500,760" fill="url(#ov_beam)" />
      </g>

      {/* the island the world lives on — a silhouette landmass on the sea */}
      <path
        d="M120 976 Q300 856 500 872 Q720 890 880 984 Q916 1006 916 1060 L84 1060 Q84 1004 120 976 Z"
        fill="#221d2e"
      />
      <path
        d="M120 976 Q300 856 500 872 Q720 890 880 984"
        fill="none"
        stroke="#3a3350"
        strokeWidth="3"
        opacity="0.55"
      />

      {/* the garden, west on the island — a cluster of trees */}
      <g opacity="0.92">
        <path d="M244 970 V930" stroke="#1a2216" strokeWidth="7" strokeLinecap="round" />
        <circle cx="244" cy="916" r="32" fill="#2c3a26" />
        <path d="M298 972 V940" stroke="#1a2216" strokeWidth="6" strokeLinecap="round" />
        <circle cx="298" cy="930" r="25" fill="#33422a" />
        <path d="M202 974 V950" stroke="#1a2216" strokeWidth="5" strokeLinecap="round" />
        <circle cx="202" cy="942" r="20" fill="#2c3a26" />
        <path d="M330 976 V956" stroke="#1a2216" strokeWidth="4" strokeLinecap="round" />
        <circle cx="330" cy="948" r="15" fill="#38472d" />
      </g>

      {/* the docks, east on the island — a pier and the vessel at rest */}
      <g opacity="0.92">
        <rect x="694" y="992" width="128" height="10" rx="3" fill="#2a2018" />
        <path d="M720 1002 V1034 M786 1002 V1034" stroke="#170f09" strokeWidth="5" />
        <g transform="translate(656 968) scale(0.52)">
          <path d="M-60 0 Q0 30 60 0 L46 22 Q0 34 -46 22 Z" fill="#1c160f" />
          <path d="M0 2 V-72" stroke="#2a2016" strokeWidth="8" strokeLinecap="round" />
          <path d="M4 -70 L42 -28 L4 -28 Z" fill="#b7a37c" opacity="0.85" />
        </g>
      </g>

      {/* THE LIGHTHOUSE — the heart, rising from the island centre. The push-in
          flies into the warm window and arrives at the hearth. */}
      <g>
        {/* the tower */}
        <path d="M456 1016 L468 700 L532 700 L544 1016 Z" fill="#cabfa8" />
        <path d="M456 1016 L468 700 L500 700 L500 1016 Z" fill="#b2a88e" />
        {/* barber stripes */}
        <path d="M461 884 L539 884 L541 928 L459 928 Z" fill="#9c5238" opacity="0.85" />
        <path d="M465 784 L535 784 L537 824 L463 824 Z" fill="#9c5238" opacity="0.7" />
        {/* the warm hearth window — the zoom target */}
        <ellipse cx="500" cy="838" rx="74" ry="74" fill="url(#ov_window)" opacity="0.9" />
        <rect x="484" y="830" width="32" height="40" rx="14" fill="#f3c574" />
        <rect x="488" y="834" width="24" height="32" rx="11" fill="#ffe6b0" />
        {/* the gallery + lamp housing */}
        <rect x="446" y="676" width="108" height="30" rx="5" fill="#2f2740" />
        <rect x="462" y="628" width="76" height="52" rx="6" fill="#3a3050" stroke="#c9a86a" strokeWidth="4" />
        {/* the lit lamp */}
        <circle cx="500" cy="654" r="130" fill="url(#ov_lamp)" opacity="0.85" />
        <circle cx="500" cy="654" r="27" fill="#ffe6a6" />
        <circle cx="500" cy="654" r="13" fill="#fff6df" />
        {/* the cap */}
        <path d="M456 628 L500 586 L544 628 Z" fill="#2a2236" stroke="#c9a86a" strokeWidth="3" />
        <circle cx="500" cy="582" r="6" fill="#c9a86a" />
      </g>
    </>
  );
}
