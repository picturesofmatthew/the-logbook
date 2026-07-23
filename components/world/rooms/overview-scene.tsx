// The Overview — the whole world, seen from afar (THE-LIGHTHOUSE.md, the cold
// open). The gate the app opens on: the island the world lives on, the
// lighthouse rising from it with its lamp lit (the ONE light) and a slow beam,
// the garden to the west and the docks at the water's edge to the east with the
// vessel moored, a far-off island low on the horizon, small lanterns dotting the
// shore, and a sky of stars strung into constellations. Already alive — stars
// twinkle, the beam sweeps, a warm window glows at the hearth. On "begin," the
// shell zooms THROUGH that warm window and arrives inside, at the hearth.
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
  [
    [96, 210],
    [170, 168],
    [244, 196],
    [316, 150],
    [352, 214],
    [300, 268],
  ],
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

// a small warm lantern dotting the shore — a soft halo over a bright core
function Lantern({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g className="ov-lantern-glow" style={{ animationDelay: `${(x % 5) * 0.6}s` }}>
      <circle cx={x} cy={y} r={26 * s} fill="url(#ov_lantern)" opacity="0.8" />
      <circle cx={x} cy={y} r={4.5 * s} fill="#ffdf9e" />
      <circle cx={x} cy={y} r={2.2 * s} fill="#fff4d6" />
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
          <stop offset="0" stopColor="#f4ead0" stopOpacity="0.28" />
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
        <radialGradient id="ov_lantern" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffcf7a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffcf7a" stopOpacity="0" />
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

      {/* the sea — the whole foreground is water */}
      <rect x="0" y="906" width="1000" height="594" fill="url(#ov_sea)" />
      {/* the moon's path, softly shimmering toward us */}
      <path d="M812 908 L852 1500 L772 1500 Z" fill="url(#ov_moonpath)" />
      {/* a couple of slow swells on the open water */}
      <g stroke="#312b48" strokeWidth="3" opacity="0.5" fill="none">
        <path d="M120 1200 q70 -16 140 0 t140 0" />
        <path d="M540 1320 q70 -16 140 0 t140 0" />
      </g>

      {/* the far-off island — the Dream, low on the eastern horizon, its own
          small light burning */}
      <path d="M812 908 Q872 882 936 904 Q972 916 972 910 L972 922 Q890 934 812 922 Z" fill="#181425" />
      <ellipse cx="900" cy="906" rx="70" ry="16" fill="url(#ov_far)" opacity="0.7" />
      <circle cx="900" cy="902" r="4" fill="#ffe6a6" />

      {/* the beam, sweeping slowly out over the water — cast FROM the lamp */}
      <g
        className="ov-beam"
        style={{ transformBox: "fill-box", transformOrigin: "0% 50%" }}
      >
        <polygon points="500,640 1140,528 1140,868 500,702" fill="url(#ov_beam)" />
      </g>

      {/* the island the world lives on — a landmass on the sea, with a shore */}
      <path
        d="M120 970 Q300 862 500 876 Q706 890 872 980 Q912 1002 908 1052 L92 1052 Q88 1000 120 970 Z"
        fill="#241f30"
      />
      {/* the shore-line where the land meets the water */}
      <path
        d="M92 1052 L908 1052"
        stroke="#3a3652"
        strokeWidth="3"
        opacity="0.5"
      />

      {/* the garden, west on the island — a cluster of trees */}
      <g opacity="0.92">
        <path d="M232 1006 V966" stroke="#1a2216" strokeWidth="7" strokeLinecap="round" />
        <circle cx="232" cy="952" r="30" fill="#2c3a26" />
        <path d="M286 1010 V978" stroke="#1a2216" strokeWidth="6" strokeLinecap="round" />
        <circle cx="286" cy="968" r="24" fill="#33422a" />
        <path d="M190 1012 V988" stroke="#1a2216" strokeWidth="5" strokeLinecap="round" />
        <circle cx="190" cy="980" r="19" fill="#2c3a26" />
      </g>

      {/* the docks — a pier reaching from the island's shore OUT into the water,
          with the vessel moored at its end (in the water, below the shoreline) */}
      <g>
        <path d="M636 1050 L820 1090 L816 1104 L632 1064 Z" fill="#2a2018" />
        <g stroke="#160f09" strokeWidth="5" opacity="0.8">
          <path d="M672 1058 V1092" />
          <path d="M744 1074 V1108" />
          <path d="M812 1092 V1128" />
        </g>
      </g>
      <g transform="translate(742 1120)">
        {/* a soft ripple where the hull sits in the water */}
        <ellipse cx="0" cy="22" rx="58" ry="7" fill="#3a3450" opacity="0.45" />
        <path d="M-52 0 Q0 26 52 0 L40 20 Q0 30 -40 20 Z" fill="#1c160f" />
        <path d="M0 2 V-66" stroke="#2a2016" strokeWidth="7" strokeLinecap="round" />
        <path d="M4 -64 L40 -24 L4 -24 Z" fill="#b7a37c" opacity="0.85" />
      </g>

      {/* THE LIGHTHOUSE — the heart, rising from the island centre. The push-in
          flies into the warm window and arrives at the hearth. */}
      <g>
        {/* the tower */}
        <path d="M456 1050 L468 700 L532 700 L544 1050 Z" fill="#cabfa8" />
        <path d="M456 1050 L468 700 L500 700 L500 1050 Z" fill="#b2a88e" />
        {/* barber stripes */}
        <path d="M461 890 L539 890 L541 934 L459 934 Z" fill="#9c5238" opacity="0.85" />
        <path d="M465 786 L535 786 L537 826 L463 826 Z" fill="#9c5238" opacity="0.7" />
        {/* the warm hearth window — a small glow, not a second light (the zoom
            target lives here) */}
        <ellipse cx="500" cy="840" rx="30" ry="30" fill="url(#ov_window)" opacity="0.55" />
        <rect x="488" y="828" width="24" height="30" rx="10" fill="#e6b56a" opacity="0.85" />
        <rect x="491" y="831" width="18" height="24" rx="8" fill="#f5cd84" opacity="0.9" />
        {/* the gallery + lamp housing */}
        <rect x="446" y="676" width="108" height="30" rx="5" fill="#2f2740" />
        <rect x="462" y="628" width="76" height="52" rx="6" fill="#3a3050" stroke="#c9a86a" strokeWidth="4" />
        {/* THE LAMP — the one light, at the top */}
        <circle cx="500" cy="654" r="134" fill="url(#ov_lamp)" opacity="0.9" />
        <circle cx="500" cy="654" r="27" fill="#ffe6a6" />
        <circle cx="500" cy="654" r="13" fill="#fff6df" />
        {/* the cap */}
        <path d="M456 628 L500 586 L544 628 Z" fill="#2a2236" stroke="#c9a86a" strokeWidth="3" />
        <circle cx="500" cy="582" r="6" fill="#c9a86a" />
      </g>

      {/* small lanterns dotting the shore — warmth scattered through the world */}
      <Lantern x={330} y={1030} s={0.85} />
      <Lantern x={430} y={1044} s={0.7} />
      <Lantern x={604} y={1040} s={0.8} />
      <Lantern x={700} y={1064} s={0.9} />
    </>
  );
}
