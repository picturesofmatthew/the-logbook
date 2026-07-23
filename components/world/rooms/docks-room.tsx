// The Docks — east — the quest (THE-LIGHTHOUSE.md).
//
// The island's FUTURE pole, ported from art/proto/docks-shore.html at the proto's
// fidelity, bound to real data. Depth is the hero: you look OUT across dark water
// at something far and gold — the far shore (the Dream) — and the couple's vessel
// sails that depth, built plank by plank. The vessel's PLACE along the depth IS
// the wordless score (planksLaid of plankGoal), and its hull wears GOLD seams for
// the days lived and SILVER ghost-strakes for the days still waiting. A dim,
// LOCKED coffer waits on the dock: this room is built to hold real money honestly
// later (COFFERS.md) without faking any now.
//
// Tapping the vessel opens the full shore page; the boat/Dream engine
// (lib/engine/boat.ts, /shore) stays the source of truth.
//
// Rendering: a flat SVG fragment drawn INTO the shell's shared 1000×1500 svg — no
// document, no canvas, no parallax, no inscription (the shell owns one atmosphere
// + grain + vignette + the eyebrow/line; air config = docksAir in world-air.ts).
// Every id is dk_-prefixed so it can't collide with the other rooms sharing that
// svg. Motion lives in globals.css as .dk-*.

import { Hotspot } from "./hotspot";

export type DocksSnapshot = {
  dream: {
    name: string;
    distanceDays: number;
    reachedDay: string | null;
  } | null;
  planksLaid: number;
  plankGoal: number;
  complete: boolean;
};

// the five hull strakes, bottom → top: three seams on the hull, two above the
// gunwale. The bottom `goldBands` are lived (solid gold); the rest still wait
// (silver, dash-outlined). Geometry is the proto's, lit by the real score.
const HULL_BANDS: { d: string; w: number; above?: boolean }[] = [
  { d: "M -66 16 C -24 24, 24 24, 66 13", w: 1 }, // A — lowest seam
  { d: "M -76 8 C -28 17, 28 17, 76 4", w: 1.1 }, // B
  { d: "M -84 -2 C -30 8, 30 8, 84 -6", w: 1.2 }, // C — top hull seam
  { d: "M -88 -20 C -34 -10, 30 -9, 86 -26", w: 1.6, above: true }, // D — lower strake
  { d: "M -84 -28 C -32 -18, 28 -17, 80 -34", w: 1.3, above: true }, // E — upper strake
];
const GHOST_CLS = ["dk-ghost", "dk-ghost-2", "dk-ghost-3", "dk-ghost", "dk-ghost-2"];

export function DocksRoom({
  snapshot,
  onOpen,
}: {
  snapshot: DocksSnapshot;
  onOpen: (href: string) => void;
}) {
  const { dream, planksLaid, plankGoal, complete } = snapshot;
  const frac = plankGoal > 0 ? Math.min(1, planksLaid / plankGoal) : 0;

  // the vessel sails UP the depth toward the shore as planks accrue, shrinking
  // with distance; the shore glows brighter the nearer you are (logic preserved)
  const vy = complete ? 792 : 1180 - frac * 372;
  const vx = 452 + frac * 96;
  const vs = complete ? 0.5 : 1 - frac * 0.46;
  const shoreGlow = complete ? 1 : 0.36 + frac * 0.5;

  // gold seams laid vs silver strakes waiting — the hull, read as the score
  const goldBands = complete
    ? HULL_BANDS.length
    : planksLaid <= 0
      ? 0
      : Math.max(1, Math.min(HULL_BANDS.length - 1, Math.round(frac * HULL_BANDS.length)));

  const shoreName = dream
    ? dream.name.length > 8
      ? dream.name.slice(0, 8).toUpperCase()
      : dream.name.toUpperCase()
    : "UNNAMED";

  const vesselLabel = dream
    ? complete
      ? `Open the shore — ${dream.name}, reached`
      : `Open the shore — toward ${dream.name}, ${planksLaid} of ${plankGoal} planks`
    : "Open the shore — name the Dream you sail toward";

  return (
    <>
      <defs>
        {/* the shared sky, and the sea that keeps it */}
        <linearGradient id="dk_skyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2436" />
          <stop offset=".5" stopColor="#382f47" />
          <stop offset=".84" stopColor="#453a54" />
          <stop offset="1" stopColor="#574862" />
        </linearGradient>
        <linearGradient id="dk_seaG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2436" />
          <stop offset=".55" stopColor="#241f28" />
          <stop offset="1" stopColor="#241e18" />
        </linearGradient>
        <linearGradient id="dk_deckG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#33291d" />
          <stop offset="1" stopColor="#241e18" />
        </linearGradient>
        <linearGradient id="dk_pageG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f5eddc" />
          <stop offset="1" stopColor="#e6d9bd" />
        </linearGradient>
        {/* the beam, leaving the lamp for the shore it knows */}
        <linearGradient id="dk_beamG" gradientUnits="userSpaceOnUse" x1="92" y1="244" x2="700" y2="590">
          <stop offset="0" stopColor="#f7e3ae" stopOpacity=".2" />
          <stop offset=".55" stopColor="#d9a441" stopOpacity=".07" />
          <stop offset="1" stopColor="#d9a441" stopOpacity=".025" />
        </linearGradient>
        <linearGradient id="dk_lanceG" gradientUnits="userSpaceOnUse" x1="92" y1="244" x2="700" y2="590">
          <stop offset="0" stopColor="#fbf6ea" stopOpacity=".3" />
          <stop offset=".6" stopColor="#f7e3ae" stopOpacity=".1" />
          <stop offset="1" stopColor="#f7e3ae" stopOpacity=".03" />
        </linearGradient>
        {/* light */}
        <radialGradient id="dk_glowSmG">
          <stop offset="0" stopColor="#f7e3ae" stopOpacity=".4" />
          <stop offset="1" stopColor="#f7e3ae" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dk_moonGlowG">
          <stop offset="0" stopColor="#f5eddc" stopOpacity=".16" />
          <stop offset="1" stopColor="#f5eddc" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dk_haloG">
          <stop offset="0" stopColor="#f7e3ae" stopOpacity=".3" />
          <stop offset=".5" stopColor="#d9a441" stopOpacity=".12" />
          <stop offset="1" stopColor="#d9a441" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dk_silverRingG">
          <stop offset="0" stopColor="#bdb7a8" stopOpacity=".2" />
          <stop offset=".6" stopColor="#bdb7a8" stopOpacity=".1" />
          <stop offset="1" stopColor="#bdb7a8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dk_shadG">
          <stop offset="0" stopColor="#1e1913" stopOpacity=".55" />
          <stop offset="1" stopColor="#1e1913" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ═══════════ FAR: the night, the water, the shore the world points at ═══════════ */}
      <g>
        {/* the sky, drawn far past the frame so the night holds the edges */}
        <rect x="-700" y="-400" width="2900" height="1002" fill="url(#dk_skyG)" />

        {/* stars: the same heavens every room keeps */}
        <g fill="#fbf6ea">
          <circle cx="150" cy="86" r="1.2" opacity=".55" />
          <circle cx="238" cy="140" r="1" opacity=".45" />
          <circle cx="330" cy="70" r="1.3" opacity=".6" />
          <circle cx="420" cy="150" r=".9" opacity=".4" />
          <circle cx="520" cy="96" r="1.2" opacity=".55" />
          <circle cx="600" cy="60" r="1" opacity=".45" />
          <circle cx="700" cy="120" r="1.3" opacity=".6" />
          <circle cx="920" cy="90" r="1.2" opacity=".5" />
          <circle cx="960" cy="180" r="1" opacity=".42" />
          <circle cx="884" cy="286" r="1" opacity=".42" />
          <circle cx="60" cy="180" r="1" opacity=".42" />
          <circle cx="130" cy="260" r=".9" opacity=".36" />
          <circle cx="382" cy="238" r="1" opacity=".44" />
          <circle cx="470" cy="300" r=".9" opacity=".38" />
          <circle cx="560" cy="212" r="1.1" opacity=".48" />
          <circle cx="656" cy="286" r=".9" opacity=".4" />
          <circle cx="760" cy="220" r="1" opacity=".44" />
          <circle cx="330" cy="366" r=".9" opacity=".36" />
          <circle cx="450" cy="420" r="1" opacity=".4" />
          <circle cx="580" cy="384" r=".9" opacity=".35" />
          <circle cx="760" cy="420" r="1" opacity=".4" />
          <circle cx="900" cy="470" r=".9" opacity=".36" />
          <circle cx="620" cy="480" r=".9" opacity=".33" />
          <circle cx="500" cy="520" r=".8" opacity=".3" />
          <circle cx="486" cy="176" r="1.1" opacity=".5" className="dk-twinkle" style={{ animationDelay: "-3s" }} />
          <circle cx="810" cy="140" r="1.2" opacity=".55" className="dk-twinkle" style={{ animationDelay: "-5.4s" }} />
          <circle cx="204" cy="330" r="1" opacity=".45" className="dk-twinkle" style={{ animationDelay: "-1.8s" }} />
        </g>
        {/* THE FERRY — the boat asterism, written in the heavens */}
        <g>
          <path d="M 250 268 L 278 281 L 315 278 L 342 261" fill="none" stroke="#fbf6ea" strokeWidth=".9" strokeOpacity=".28" />
          <line x1="297" y1="279" x2="297" y2="222" stroke="#fbf6ea" strokeWidth=".9" strokeOpacity=".28" />
          <circle cx="250" cy="268" r="1.8" fill="#fbf6ea" opacity=".8" />
          <circle cx="278" cy="281" r="1.5" fill="#fbf6ea" opacity=".7" />
          <circle cx="315" cy="278" r="1.7" fill="#fbf6ea" opacity=".75" />
          <circle cx="342" cy="261" r="1.5" fill="#fbf6ea" opacity=".7" />
          <circle cx="297" cy="222" r="2.1" fill="#fbf6ea" opacity=".9" className="dk-twinkle" style={{ animationDelay: "-2s" }} />
        </g>
        {/* the small × asterism: two hands crossing */}
        <g stroke="#fbf6ea" strokeWidth=".9" strokeOpacity=".26">
          <line x1="828" y1="196" x2="846" y2="216" />
          <line x1="846" y1="196" x2="828" y2="216" />
        </g>
        <circle cx="828" cy="196" r="1.4" fill="#fbf6ea" opacity=".7" />
        <circle cx="846" cy="216" r="1.4" fill="#fbf6ea" opacity=".65" />
        <circle cx="846" cy="196" r="1.2" fill="#fbf6ea" opacity=".6" className="dk-twinkle" style={{ animationDelay: "-5s" }} />
        <circle cx="828" cy="216" r="1.2" fill="#fbf6ea" opacity=".6" />

        {/* THE LOW MOON — warm parchment, near the water it silvers */}
        <circle cx="176" cy="470" r="62" fill="url(#dk_moonGlowG)" />
        <circle cx="176" cy="470" r="21" fill="#e6d9bd" />
        <circle cx="169" cy="463" r="3.2" fill="#bdb7a8" opacity=".32" />
        <circle cx="184" cy="474" r="2.2" fill="#bdb7a8" opacity=".26" />
        <circle cx="174" cy="481" r="1.6" fill="#bdb7a8" opacity=".22" />
        <path d="M 158 478 A 21 21 0 0 0 194 478" fill="none" stroke="#d9a441" strokeWidth="1.2" strokeOpacity=".22" />

        {/* THE LIGHTHOUSE, west — behind you; one light, seen from every room */}
        <g>
          {/* the garden headland, dark, its two lanterns still lit */}
          <path
            d="M -700 602 L -700 566 C -300 540, -80 546, 30 552 C 120 557, 200 574, 244 590 C 258 596, 266 599, 270 602 Z"
            fill="#1e1913"
            opacity=".95"
          />
          <path d="M 148 566 l 9 -18 l 9 18 Z" fill="#241e18" />
          <path d="M 176 572 l 8 -15 l 8 15 Z" fill="#241e18" />
          <path d="M 206 580 l 7 -13 l 7 13 Z" fill="#241e18" />
          <circle cx="120" cy="576" r="1.4" fill="#d9a441" opacity=".6" className="dk-twinkle" style={{ animationDuration: "8s" }} />
          <circle cx="164" cy="584" r="1.2" fill="#d9a441" opacity=".5" />
          {/* the tower */}
          <path d="M 56 602 L 72 262 L 100 262 L 116 602 Z" fill="#241e18" />
          <line x1="99" y1="270" x2="113" y2="596" stroke="#d9a441" strokeWidth="1" strokeOpacity=".1" />
          {/* two windows lit on the spine: the hearth below, the library above */}
          <rect x="82" y="470" width="7" height="11" rx="2" fill="#d9a441" opacity=".3" />
          <rect x="80" y="382" width="7" height="11" rx="2" fill="#d9a441" opacity=".24" />
          {/* gallery + lamp room */}
          <rect x="62" y="252" width="48" height="10" rx="2" fill="#241e18" />
          <g stroke="#241e18" strokeWidth="2">
            <line x1="68" y1="252" x2="68" y2="242" />
            <line x1="86" y1="252" x2="86" y2="242" />
            <line x1="104" y1="252" x2="104" y2="242" />
          </g>
          <line x1="64" y1="243" x2="108" y2="243" stroke="#241e18" strokeWidth="2.5" />
          <rect x="70" y="222" width="32" height="22" rx="2" fill="#241e18" stroke="#d9a441" strokeWidth="1" strokeOpacity=".3" />
          <path d="M 66 222 Q 86 206 106 222 Z" fill="#241e18" />
          <line x1="86" y1="208" x2="86" y2="198" stroke="#d9a441" strokeWidth="1.4" strokeOpacity=".5" />
          <path d="M 82 200 L 90 206 M 90 200 L 82 206" stroke="#d9a441" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".6" />
          {/* the lamp itself: lit, because the light is the world's one light */}
          <circle cx="86" cy="234" r="26" fill="url(#dk_glowSmG)" opacity=".9" />
          <circle cx="86" cy="234" r="5" fill="#f7e3ae" />
          <circle cx="86" cy="234" r="9" fill="#f7e3ae" opacity=".25" />
        </g>

        {/* THE BEAM — it exists because the light is kept; it knows where the shore is */}
        <g className="dk-beam">
          <polygon points="94,234 94,252 718,608 686,570" fill="url(#dk_beamG)" />
          <polygon points="94,240 94,247 708,600 698,588" fill="url(#dk_lanceG)" />
        </g>

        {/* the horizon: eye level, as it always is */}
        <rect x="-700" y="600" width="2900" height="556" fill="url(#dk_seaG)" />
        <line x1="-700" y1="600" x2="2200" y2="600" stroke="#453a54" strokeWidth="1.3" strokeOpacity=".85" />

        {/* THE FAR SHORE: the Dream on the horizon — the same thumbnail every room keeps */}
        {dream ? (
          <>
            <circle cx="700" cy="596" r="30" fill="url(#dk_glowSmG)" opacity={0.3 + shoreGlow * 0.35} />
            <g fill="#d9a441" opacity={Math.min(1, shoreGlow)}>
              <rect x="688" y="594.4" width="7" height="1.9" rx=".9" />
              <rect x="697" y="593.8" width="5" height="1.7" rx=".8" />
              <rect x="705" y="594.6" width="4" height="1.5" rx=".7" />
            </g>
            <circle
              cx="697"
              cy="592.2"
              r="1.5"
              fill="#f7e3ae"
              className="dk-twinkle"
              style={{ animationDelay: "-1s", animationDuration: "9s" }}
            />
            <path d="M 697 602 q 2 10 -1 20 q -2 10 1 22" fill="none" stroke="#d9a441" strokeWidth="1.4" strokeOpacity=".3" />
          </>
        ) : (
          <>
            {/* the Dream unnamed — a silver speck, waiting to be found and named */}
            <circle cx="700" cy="596" r="26" fill="url(#dk_silverRingG)" />
            <g fill="none" stroke="#bdb7a8" strokeWidth="1.3" strokeDasharray="4 3" strokeOpacity=".55" className="dk-ghost">
              <rect x="688" y="594" width="7" height="2" rx=".9" />
              <rect x="697" y="593.4" width="5" height="1.8" rx=".8" />
              <rect x="705" y="594.2" width="4" height="1.6" rx=".7" />
            </g>
          </>
        )}

        {/* the wide water: far lines tight, near lines loose — depth doing its work */}
        <g stroke="#453a54" strokeWidth="1.2" strokeOpacity=".5">
          <line x1="80" y1="622" x2="146" y2="622" />
          <line x1="330" y1="616" x2="398" y2="616" />
          <line x1="520" y1="628" x2="590" y2="628" />
          <line x1="840" y1="620" x2="908" y2="620" />
          <line x1="250" y1="648" x2="332" y2="648" />
          <line x1="560" y1="660" x2="640" y2="660" />
          <line x1="806" y1="656" x2="890" y2="656" />
          <line x1="60" y1="676" x2="150" y2="676" />
        </g>
        <g stroke="#453a54" strokeWidth="1.4" strokeOpacity=".42">
          <line x1="360" y1="712" x2="470" y2="712" />
          <line x1="740" y1="736" x2="850" y2="736" />
          <line x1="90" y1="760" x2="200" y2="760" />
          <line x1="460" y1="796" x2="580" y2="796" />
          <line x1="820" y1="820" x2="940" y2="820" />
          <line x1="230" y1="850" x2="360" y2="850" />
        </g>
        <g stroke="#453a54" strokeWidth="1.7" strokeOpacity=".32">
          <line x1="520" y1="900" x2="670" y2="900" />
          <line x1="60" y1="940" x2="220" y2="940" />
          <line x1="770" y1="980" x2="930" y2="980" />
          <line x1="300" y1="1010" x2="470" y2="1010" />
        </g>
        {/* the last slow swells before the dock */}
        <g stroke="#453a54" strokeWidth="3" strokeOpacity=".32" fill="none">
          <path d="M 100 1064 q 60 -16 120 0 t 120 0" />
          <path d="M 560 1096 q 66 -18 132 0 t 132 0" />
          <path d="M 230 1128 q 60 -16 120 0 t 120 0" />
        </g>
        {/* a dusky glint or two where the moon touches the swell */}
        <g stroke="#6f5a78" strokeWidth="1.6" strokeOpacity=".3" className="dk-shim-3">
          <line x1="256" y1="742" x2="300" y2="742" />
          <line x1="130" y1="892" x2="186" y2="892" />
        </g>

        {/* THE SILVER ROAD — the moon's track: the waiting, laid on the water */}
        <g stroke="#bdb7a8" strokeLinecap="round">
          <g className="dk-shim">
            <line x1="168" y1="618" x2="186" y2="618" strokeWidth="1.4" strokeOpacity=".3" />
            <line x1="160" y1="660" x2="192" y2="660" strokeWidth="1.5" strokeOpacity=".26" />
            <line x1="152" y1="714" x2="198" y2="714" strokeWidth="1.6" strokeOpacity=".2" />
          </g>
          <g className="dk-shim-2">
            <line x1="146" y1="782" x2="206" y2="782" strokeWidth="1.8" strokeOpacity=".16" />
            <line x1="138" y1="866" x2="214" y2="866" strokeWidth="2" strokeOpacity=".12" />
            <line x1="128" y1="964" x2="222" y2="964" strokeWidth="2.2" strokeOpacity=".08" />
          </g>
        </g>

        {/* THE GOLD ROAD — the beam's track: the lived, and the vessel rides it */}
        <g stroke="#d9a441" strokeLinecap="round">
          <g className="dk-shim-2">
            <line x1="692" y1="618" x2="712" y2="618" strokeWidth="1.5" strokeOpacity=".3" />
            <line x1="686" y1="650" x2="718" y2="650" strokeWidth="1.6" strokeOpacity=".26" />
            <line x1="680" y1="696" x2="724" y2="696" strokeWidth="1.7" strokeOpacity=".22" />
          </g>
          <g className="dk-shim">
            <line x1="672" y1="756" x2="732" y2="756" strokeWidth="1.9" strokeOpacity=".18" />
            <line x1="660" y1="830" x2="742" y2="830" strokeWidth="2.1" strokeOpacity=".14" />
            <line x1="646" y1="908" x2="754" y2="908" strokeWidth="2.3" strokeOpacity=".1" />
          </g>
          <g className="dk-shim-3">
            <line x1="620" y1="1052" x2="756" y2="1052" strokeWidth="2.5" strokeOpacity=".07" />
            <line x1="600" y1="1120" x2="770" y2="1120" strokeWidth="2.6" strokeOpacity=".05" />
          </g>
        </g>
      </g>

      {/* ═══════════ MID: the vessel, out on the depth — the wordless score ═══════════ */}
      <g>
        {/* the vessel's warmth, wake and reflection — they track it along the depth */}
        <g transform={`translate(${vx} ${vy}) scale(${vs})`}>
          {/* the halo the kept light lays around the vessel */}
          <circle cx="0" cy="-2" r="120" fill="url(#dk_haloG)" opacity=".5" />
          {/* its wake, already giving itself back to the sea */}
          <g fill="none" stroke="#f5eddc" strokeWidth="2" strokeOpacity=".07">
            <path d="M -63 34 C -115 80, -175 130, -235 186" />
            <path d="M 45 40 C 71 84, 93 132, 109 182" />
          </g>
          {/* the reflection holds the boat the way the book holds the day */}
          <g className="dk-reflect">
            <ellipse cx="0" cy="38" rx="64" ry="8" fill="#1e1913" opacity=".55" />
            <line x1="-35" y1="40" x2="13" y2="40" stroke="#d9a441" strokeWidth="1.4" strokeOpacity=".18" className="dk-shim" />
            <line x1="-15" y1="46" x2="21" y2="46" stroke="#f5eddc" strokeWidth="1" strokeOpacity=".08" className="dk-shim-2" />
          </g>
        </g>

        {/* THE VESSEL — planks laid gold-seam the hull, planks waiting hang in silver
            ghost-strakes above the gunwale; the garnet × on the sail is the seal,
            posted to the future. Its place along the depth IS the score. */}
        <Hotspot label={vesselLabel} onActivate={() => onOpen("/shore")} transform={`translate(${vx} ${vy}) scale(${vs})`}>
          <g className="dk-bob">
            {/* the hull that exists: laid plank by plank */}
            <path
              d="M -92 -12 C -34 -2, 34 -2, 92 -18 L 74 18 C 30 30, -32 30, -64 20 Z"
              fill="#3a2c1e"
              stroke="#241e18"
              strokeWidth="2"
            />
            <path d="M -92 -12 C -34 -2, 34 -2, 92 -18" fill="none" stroke="#241e18" strokeWidth="2.5" />
            {/* the gunwale gilt: the built edge, always there while a hull is */}
            <path d="M -89 -14.5 C -34 -5, 34 -5, 89 -20.5" fill="none" stroke="#d9a441" strokeWidth="1" strokeOpacity=".35" />

            {/* the five strakes, lit by the score: gold = lived, silver = waiting */}
            {HULL_BANDS.map((band, i) => {
              const isGold = i < goldBands;
              return isGold ? (
                <path
                  key={i}
                  d={band.d}
                  fill="none"
                  stroke="#d9a441"
                  strokeWidth={band.w}
                  strokeOpacity={band.above ? 0.55 : 0.5 - i * 0.07}
                />
              ) : (
                <path
                  key={i}
                  d={band.d}
                  fill="none"
                  stroke="#bdb7a8"
                  strokeWidth={band.w}
                  strokeDasharray={band.above ? "5 5" : "4 5"}
                  strokeOpacity={band.above ? 0.5 : 0.4}
                  className={GHOST_CLS[i]}
                />
              );
            })}

            {/* plank butts: the joins of real carpentry */}
            <g stroke="#241e18" strokeWidth="1" strokeOpacity=".4">
              <line x1="-30" y1="-6" x2="-31" y2="4" />
              <line x1="34" y1="-7" x2="33" y2="3" />
              <line x1="0" y1="6" x2="-1" y2="15" />
              <line x1="52" y1="2" x2="51" y2="11" />
            </g>

            {/* mast, yard, and the sail that carries their days */}
            <rect x="1.5" y="-122" width="4.5" height="112" rx="2" fill="#3a2c1e" />
            <line x1="5.5" y1="-118" x2="5.5" y2="-14" stroke="#d9a441" strokeWidth=".8" strokeOpacity=".2" />
            <line x1="-2" y1="-112" x2="30" y2="-121" stroke="#3a2c1e" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 9 -114 C 50 -92, 62 -58, 58 -26 L 9 -30 Z" fill="#f5eddc" opacity=".93" />
            <path d="M 16 -102 C 40 -83, 48 -58, 46 -34" fill="none" stroke="#e6d9bd" strokeWidth="2" />
            <path d="M 9 -114 C 50 -92, 62 -58, 58 -26" fill="none" stroke="#2b2014" strokeWidth="1" strokeOpacity=".25" />
            {/* the seal, pressed on the sail: a letter posted to the future */}
            <g stroke="#93372b" strokeWidth="2.4" strokeLinecap="round" opacity=".82">
              <line x1="28" y1="-64" x2="40" y2="-52" />
              <line x1="40" y1="-64" x2="28" y2="-52" />
            </g>
            <circle cx="34" cy="-58" r="8.5" fill="none" stroke="#93372b" strokeWidth="1" strokeOpacity=".4" />
            {/* pennant: garnet, flying home */}
            <path d="M 3.7 -122 L -20 -115 L 3.7 -109 Z" fill="#93372b" opacity=".95" />
            {/* the stern lantern: a little of the hearth rides along */}
            <circle cx="-83" cy="-22" r="13" fill="url(#dk_glowSmG)" opacity=".8" />
            <rect x="-87.5" y="-28" width="8" height="10" rx="2" fill="#241e18" stroke="#d9a441" strokeWidth="1" strokeOpacity=".7" />
            <circle cx="-83.5" cy="-23" r="1.8" fill="#f7e3ae" />
            {/* tiller, lashed: nobody steers; the days do */}
            <path d="M -80 -10 L -98 -22" stroke="#3a2c1e" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </Hotspot>
      </g>

      {/* ═══════════ HEART: the dock underfoot — where the future is kept honestly ═══════════ */}
      <g>
        {/* the dock's edge beam, catching the lantern */}
        <rect x="-700" y="1148" width="2900" height="18" fill="#3a2c1e" />
        <line x1="-700" y1="1150" x2="2200" y2="1150" stroke="#f7e3ae" strokeWidth="1.4" strokeOpacity=".13" />
        <line x1="-700" y1="1165" x2="2200" y2="1165" stroke="#1e1913" strokeWidth="2.5" strokeOpacity=".6" />
        {/* the deck */}
        <rect x="-700" y="1166" width="2900" height="700" fill="url(#dk_deckG)" />
        <g stroke="#1e1913" strokeWidth="2" strokeOpacity=".45">
          <line x1="-700" y1="1206" x2="2200" y2="1206" />
          <line x1="-700" y1="1250" x2="2200" y2="1250" />
          <line x1="-700" y1="1300" x2="2200" y2="1300" />
          <line x1="-700" y1="1358" x2="2200" y2="1358" />
          <line x1="-700" y1="1426" x2="2200" y2="1426" />
        </g>
        <g stroke="#1e1913" strokeWidth="1.6" strokeOpacity=".26">
          <line x1="140" y1="1166" x2="136" y2="1206" />
          <line x1="440" y1="1206" x2="434" y2="1250" />
          <line x1="780" y1="1166" x2="776" y2="1206" />
          <line x1="262" y1="1250" x2="256" y2="1300" />
          <line x1="660" y1="1250" x2="654" y2="1300" />
          <line x1="920" y1="1300" x2="912" y2="1358" />
          <line x1="80" y1="1300" x2="72" y2="1358" />
          <line x1="540" y1="1358" x2="530" y2="1426" />
          <line x1="350" y1="1426" x2="340" y2="1490" />
        </g>
        {/* the lantern's warmth pooled on the boards */}
        <ellipse cx="790" cy="1240" rx="310" ry="92" fill="#d9a441" opacity=".06" />
        <ellipse cx="780" cy="1210" rx="160" ry="52" fill="#f7e3ae" opacity=".05" />

        {/* ── WEST BOLLARD + the coil that waits for the vessel's return ── */}
        <g>
          <ellipse cx="150" cy="1184" rx="34" ry="7" fill="url(#dk_shadG)" />
          <rect x="136" y="1096" width="30" height="84" rx="8" fill="#3a2c1e" stroke="#241e18" strokeWidth="1.6" />
          <ellipse cx="151" cy="1096" rx="15" ry="5.5" fill="#46402f" stroke="#241e18" strokeWidth="1.2" />
          <line x1="140" y1="1102" x2="140" y2="1174" stroke="#d9a441" strokeWidth="1" strokeOpacity=".16" />
          {/* rope wraps */}
          <g stroke="#6b5a44" strokeWidth="4.5" fill="none">
            <path d="M 136 1116 Q 151 1121 166 1116" />
            <path d="M 136 1126 Q 151 1131 166 1126" />
            <path d="M 136 1136 Q 151 1141 166 1136" />
          </g>
          <path d="M 138 1140 C 122 1160, 108 1186, 100 1212" fill="none" stroke="#6b5a44" strokeWidth="4.5" />
          {/* the coil, patient */}
          <g fill="none" stroke="#6b5a44" strokeWidth="4.5" opacity=".9">
            <ellipse cx="96" cy="1232" rx="36" ry="13" />
            <ellipse cx="96" cy="1224" rx="28" ry="10" />
            <ellipse cx="96" cy="1217" rx="20" ry="7.5" />
          </g>
          <path d="M 78 1224 A 28 10 0 0 1 92 1215" fill="none" stroke="#d9a441" strokeWidth="1" strokeOpacity=".2" />
        </g>

        {/* ── THE COFFER — locked, dim, honest: built to hold real money LATER.
            Non-interactive; the keyhole waits for the world's one key. ── */}
        <g>
          <ellipse cx="205" cy="1396" rx="108" ry="13" fill="url(#dk_shadG)" />
          {/* domed lid */}
          <path d="M 118 1290 L 118 1272 Q 205 1234 292 1272 L 292 1290 Z" fill="#33291d" stroke="#241e18" strokeWidth="2" />
          {/* body */}
          <rect x="118" y="1290" width="174" height="102" rx="8" fill="#2e2418" stroke="#241e18" strokeWidth="2" />
          <line x1="118" y1="1291" x2="292" y2="1291" stroke="#1e1913" strokeWidth="2" strokeOpacity=".7" />
          {/* dim brass straps: they will shine when the coffer earns its gold */}
          <g>
            <rect x="148" y="1252" width="11" height="140" rx="3" fill="#3a3128" />
            <rect x="251" y="1252" width="11" height="140" rx="3" fill="#3a3128" />
            <line x1="150" y1="1256" x2="150" y2="1388" stroke="#d9a441" strokeWidth="1" strokeOpacity=".22" />
            <line x1="253" y1="1256" x2="253" y2="1388" stroke="#d9a441" strokeWidth="1" strokeOpacity=".22" />
          </g>
          {/* corner caps */}
          <g fill="#3a3128" stroke="#d9a441" strokeWidth=".8" strokeOpacity=".2">
            <path d="M 118 1378 l 14 0 l -14 14 Z" />
            <path d="M 292 1378 l -14 0 l 14 14 Z" />
          </g>
          {/* the plate: it says what it is, and no more */}
          <rect x="168" y="1300" width="74" height="15" rx="2" fill="#3a3128" stroke="#d9a441" strokeWidth=".9" strokeOpacity=".3" />
          <text
            x="205"
            y="1310.5"
            textAnchor="middle"
            fontFamily="'Courier New', Courier, monospace"
            fontSize="7"
            letterSpacing="1.2"
            fill="#d9a441"
            opacity=".55"
          >
            THE COFFER
          </text>
          {/* hasp + padlock; the keyhole waits for the world's one key */}
          <rect x="193" y="1282" width="24" height="26" rx="3" fill="#3a3128" stroke="#241e18" strokeWidth="1.4" />
          <path d="M 197 1330 L 197 1322 A 8 8 0 0 1 213 1322 L 213 1330" fill="none" stroke="#6b5a44" strokeWidth="4" />
          <rect x="190" y="1330" width="30" height="25" rx="5" fill="#33291d" stroke="#241e18" strokeWidth="1.6" />
          <line x1="193" y1="1333" x2="193" y2="1351" stroke="#d9a441" strokeWidth="1" strokeOpacity=".18" />
          <circle cx="205" cy="1339" r="3" fill="#241e18" stroke="#d9a441" strokeWidth=".8" strokeOpacity=".3" />
          <line x1="205" y1="1341" x2="205" y2="1348" stroke="#241e18" strokeWidth="2.4" />
          {/* the paper tag, tied to the lock: one word, kept */}
          <path d="M 218 1338 C 226 1338, 232 1342, 236 1348" fill="none" stroke="#e6d9bd" strokeWidth="1" strokeOpacity=".5" />
          <g transform="rotate(9 254 1356)">
            <rect x="236" y="1347" width="37" height="19" rx="2" fill="url(#dk_pageG)" opacity=".9" />
            <circle cx="240.5" cy="1356.5" r="1.4" fill="none" stroke="#4a3a28" strokeWidth=".8" />
            <text x="258" y="1359.5" textAnchor="middle" fontFamily="'Courier New', Courier, monospace" fontSize="6.2" letterSpacing="1" fill="#4a3a28">
              LATER
            </text>
          </g>
        </g>

        {/* ── THE PLACARD: a fingerboard for the Dream — named, or waiting to be ── */}
        <g transform="rotate(-1.5 401 1080)">
          <rect x="396" y="1030" width="10" height="142" rx="3" fill="#3a2c1e" stroke="#241e18" strokeWidth="1.4" />
          <line x1="398" y1="1036" x2="398" y2="1166" stroke="#d9a441" strokeWidth="1" strokeOpacity=".16" />
          <path d="M 396 1172 L 386 1180 L 416 1180 L 406 1172 Z" fill="#33291d" />
          {/* the Dream's name, pointing out across the water */}
          <path
            d="M 410 1042 L 540 1042 L 562 1057 L 540 1072 L 410 1072 Z"
            fill="#3a2c1e"
            stroke="#241e18"
            strokeWidth="1.6"
          />
          <path
            d="M 414 1046 L 538 1046 L 556 1057 L 538 1068 L 414 1068 Z"
            fill="none"
            stroke={dream ? "#d9a441" : "#bdb7a8"}
            strokeWidth="1"
            strokeOpacity=".35"
          />
          <text
            x="478"
            y="1062"
            textAnchor="middle"
            fontFamily="'Courier New', Courier, monospace"
            fontSize="14"
            letterSpacing="3"
            fill={dream ? "#d9a441" : "#bdb7a8"}
            opacity={dream ? 0.9 : 0.7}
          >
            {shoreName}
          </text>
          {/* and under it, what it is */}
          <path
            d="M 410 1082 L 512 1082 L 528 1092.5 L 512 1103 L 410 1103 Z"
            fill="#3a2c1e"
            stroke="#241e18"
            strokeWidth="1.4"
          />
          <text x="464" y="1096" textAnchor="middle" fontFamily="'Courier New', Courier, monospace" fontSize="7" letterSpacing="1.6" fill="#bdb7a8" opacity=".75">
            THE FAR SHORE
          </text>
          <circle cx="401" cy="1052" r="1.8" fill="#d9a441" opacity=".5" />
          <circle cx="401" cy="1092" r="1.6" fill="#d9a441" opacity=".4" />
        </g>

        {/* ── THE PLANK STACK + TALLY: the days not yet lived, stacked and patient;
            the tally states the real score in words ── */}
        <g>
          <ellipse cx="608" cy="1352" rx="96" ry="10" fill="url(#dk_shadG)" />
          {/* two ghost planks: dash-outlined, still only intentions */}
          <g fill="none" stroke="#bdb7a8" strokeDasharray="6 5">
            <rect x="552" y="1258" width="132" height="14" rx="3" strokeWidth="1.3" strokeOpacity=".3" className="dk-ghost-3" transform="rotate(-1.5 618 1265)" />
            <rect x="546" y="1276" width="138" height="15" rx="3" strokeWidth="1.5" strokeOpacity=".42" className="dk-ghost" transform="rotate(1 615 1283)" />
          </g>
          {/* two cut planks: real wood, silver-edged, ready for their days */}
          <g transform="rotate(1.5 611 1304)">
            <rect x="538" y="1296" width="146" height="16" rx="3" fill="#33291d" stroke="#241e18" strokeWidth="1.4" />
            <line x1="542" y1="1299" x2="680" y2="1299" stroke="#bdb7a8" strokeWidth="1" strokeOpacity=".4" />
            <ellipse cx="684" cy="1304" rx="2.6" ry="4.5" fill="#46402f" />
          </g>
          <g transform="rotate(-2 608 1322)">
            <rect x="532" y="1314" width="152" height="17" rx="3" fill="#3a2c1e" stroke="#241e18" strokeWidth="1.4" />
            <line x1="536" y1="1317" x2="680" y2="1317" stroke="#bdb7a8" strokeWidth="1" strokeOpacity=".45" />
            <ellipse cx="532" cy="1322.5" rx="3" ry="5" fill="#46402f" />
          </g>
          {/* the tally, pinned: the score in words, and the law under it */}
          <g transform="rotate(-2 608 1362)">
            <rect x="546" y="1344" width="124" height="36" rx="2" fill="url(#dk_pageG)" opacity=".95" />
            <rect x="546" y="1344" width="124" height="36" rx="2" fill="none" stroke="#2b2014" strokeWidth=".9" strokeOpacity=".25" />
            <circle cx="608" cy="1348.5" r="2" fill="#d9a441" />
            <text x="608" y="1360" textAnchor="middle" fontFamily="'Courier New', Courier, monospace" fontSize="7.2" letterSpacing="1" fill="#4a3a28">
              {complete ? "ALL PLANKS LAID" : `PLANKS LAID · ${planksLaid} OF ${plankGoal}`}
            </text>
            <text x="608" y="1372" textAnchor="middle" fontFamily="'Courier New', Courier, monospace" fontSize="5" letterSpacing=".7" fill="#7a6a54">
              ONE PLANK · ONE SIGNED DAY
            </text>
          </g>
        </g>

        {/* ── EAST BOLLARD: the rope cast off — the vessel has sailed ── */}
        <g>
          <ellipse cx="900" cy="1160" rx="30" ry="6" fill="url(#dk_shadG)" />
          <rect x="886" y="1082" width="28" height="76" rx="7" fill="#3a2c1e" stroke="#241e18" strokeWidth="1.6" />
          <ellipse cx="900" cy="1082" rx="14" ry="5" fill="#46402f" stroke="#241e18" strokeWidth="1.2" />
          <line x1="909" y1="1088" x2="909" y2="1152" stroke="#f7e3ae" strokeWidth="1" strokeOpacity=".18" />
          <g stroke="#6b5a44" strokeWidth="4" fill="none">
            <path d="M 886 1102 Q 900 1106 914 1102" />
            <path d="M 886 1112 Q 900 1116 914 1112" />
          </g>
          {/* the last of the line, over the edge; a ring of water where it touches */}
          <path d="M 898 1116 C 908 1128, 916 1138, 919 1150" fill="none" stroke="#6b5a44" strokeWidth="4" />
          <path d="M 912 1144 A 8 3 0 1 0 928 1144" fill="none" stroke="#f5eddc" strokeWidth="1" strokeOpacity=".12" />
        </g>

        {/* ── THE DOCK LANTERN: the one warm near light; a wick-spirit keeps watch ── */}
        <g>
          <ellipse cx="800" cy="1246" rx="36" ry="7" fill="url(#dk_shadG)" />
          <rect x="794" y="1012" width="12" height="230" rx="3" fill="#3a2c1e" stroke="#241e18" strokeWidth="1.4" />
          <line x1="797" y1="1018" x2="797" y2="1236" stroke="#d9a441" strokeWidth="1" strokeOpacity=".2" />
          <path d="M 786 1242 L 814 1242 L 810 1224 L 790 1224 Z" fill="#33291d" stroke="#241e18" strokeWidth="1.2" />
          {/* the bracket arm, and its brass curl */}
          <path d="M 800 1020 C 782 1012, 764 1014, 752 1024" fill="none" stroke="#3a3128" strokeWidth="6" />
          <path d="M 800 1019 C 783 1011, 766 1013, 754 1022" fill="none" stroke="#d9a441" strokeWidth="1" strokeOpacity=".35" />
          <circle cx="750" cy="1026" r="3" fill="none" stroke="#d9a441" strokeWidth="1.1" strokeOpacity=".45" />
          <line x1="752" y1="1027" x2="752" y2="1034" stroke="#6b5a44" strokeWidth="1.6" />
          {/* the lantern, and its light on the water below */}
          <circle cx="752" cy="1072" r="46" fill="url(#dk_glowSmG)" opacity=".9" />
          <circle cx="752" cy="1030" r="3.5" fill="none" stroke="#d9a441" strokeWidth="1.2" strokeOpacity=".6" />
          <path d="M 734 1046 L 770 1046 L 762 1034 L 742 1034 Z" fill="#241e18" stroke="#d9a441" strokeWidth="1.3" strokeOpacity=".75" />
          <rect x="732" y="1046" width="40" height="50" rx="4" fill="#241e18" opacity=".85" stroke="#d9a441" strokeWidth="1.5" strokeOpacity=".8" />
          <line x1="744" y1="1048" x2="744" y2="1094" stroke="#d9a441" strokeWidth="1" strokeOpacity=".4" />
          <line x1="760" y1="1048" x2="760" y2="1094" stroke="#d9a441" strokeWidth="1" strokeOpacity=".4" />
          <ellipse cx="752" cy="1099" rx="12" ry="3" fill="#3a3128" stroke="#d9a441" strokeWidth="1" strokeOpacity=".4" />
          {/* the wick-spirit: it leans out over the water, watching the boat */}
          <g className="dk-wisp">
            <path d="M 752 1058 C 758 1065, 759 1072, 752 1078 C 745 1072, 746 1065, 752 1058 Z" fill="#d9a441" />
            <path d="M 752 1063 C 755.5 1067, 756 1071, 752 1075 C 748 1071, 748.5 1067, 752 1063 Z" fill="#f7e3ae" />
            <circle cx="749.8" cy="1068.5" r=".9" fill="#2b2014" />
            <circle cx="754.2" cy="1068.5" r=".9" fill="#2b2014" />
          </g>
          {/* the lantern's own small road on the water: near gold, humbler than the beam's */}
          <g stroke="#d9a441" strokeLinecap="round" className="dk-shim-3">
            <line x1="742" y1="1116" x2="762" y2="1116" strokeWidth="1.6" strokeOpacity=".22" />
            <line x1="736" y1="1134" x2="768" y2="1134" strokeWidth="1.8" strokeOpacity=".16" />
          </g>
        </g>
      </g>
    </>
  );
}
