// THE LANTERN — the top of the tower, the light. The climax the whole world
// builds toward: the couple's completed seal risen up the spine and become the
// beam that reaches the far shore. Ported from art/proto/lantern-lamp.html at the
// proto's fidelity, driven by the LIVE seal state so one true thing moves in the
// world from day one.
//
// THE THREE STATES (the room's whole point — the machine is honest):
//   · LIT      (spec.completed) → the great lamp blazes, the × signet burns with
//     the union's violet at its heart, and the BEAM sweeps out over the water to
//     the tiny gold far shore + its broken reflection track.
//   · KINDLED  (one keeper inked) → the lamp glows low and warm, no beam. Waiting,
//     never a scold.
//   · DARK     (neither) → the lamp rests unlit under the stars. A quiet night.
// The beam + far shore render ONLY when lit; the core brightness/colour steps down
// lit → solo → dark; the engraved "three watches" plate keeps all three visible.
//
// Rendering: a flat SVG fragment drawn INTO the shell's shared 1000×1500 svg — no
// document, no canvas, no parallax, no inscription (the shell owns one atmosphere
// + grain + vignette + the eyebrow/line; air configs live in world-air.ts). Every
// id is ln_-prefixed so it can't collide with the other rooms sharing that svg.
// Motion lives in globals.css as .ln-*.

import type { SigilSpec } from "@/lib/engine/sigil";

export function LanternRoom({ spec }: { spec: SigilSpec }) {
  const lit = spec.completed;
  const solo = !lit && spec.moss.inked !== spec.ember.inked;
  const dark = !lit && !solo;

  // the lamp core steps down through the three states
  const coreFill = lit ? "#fbf6ea" : solo ? "#f0d29a" : "#6b5a3c";
  const coreR = lit ? 30 : solo ? 24 : 18;
  const coreOpacity = lit ? 0.95 : solo ? 0.8 : 0.5;
  const bloomOpacity = lit ? 1 : solo ? 0.55 : 0.2; // the heat bloom (coreG)
  const haloStatic = solo ? 0.5 : 0.22; // lit lets the pulse animation own opacity
  const xOpacity = lit ? 1 : solo ? 0.6 : 0.32;
  const xGoldOpacity = lit ? 0.8 : solo ? 0.4 : 0.2;

  return (
    <>
      <defs>
        {/* the shared sky, seen whole from the top of the tower */}
        <linearGradient id="ln_skyHi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2436" />
          <stop offset=".55" stopColor="#382f47" />
          <stop offset=".85" stopColor="#453a54" />
          <stop offset="1" stopColor="#574862" />
        </linearGradient>
        <linearGradient id="ln_seaG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2436" />
          <stop offset="1" stopColor="#241e18" />
        </linearGradient>
        <linearGradient id="ln_floorG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c251d" />
          <stop offset="1" stopColor="#241e18" />
        </linearGradient>
        <linearGradient id="ln_muretteG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b322a" />
          <stop offset="1" stopColor="#332b23" />
        </linearGradient>
        <linearGradient id="ln_pageG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f5eddc" />
          <stop offset="1" stopColor="#e6d9bd" />
        </linearGradient>
        {/* the beam: brightest at the lens, giving itself to the distance */}
        <linearGradient id="ln_beamG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f7e3ae" stopOpacity=".3" />
          <stop offset=".5" stopColor="#d9a441" stopOpacity=".13" />
          <stop offset="1" stopColor="#d9a441" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ln_lanceG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fbf6ea" stopOpacity=".45" />
          <stop offset=".55" stopColor="#f7e3ae" stopOpacity=".16" />
          <stop offset="1" stopColor="#f7e3ae" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ln_spillW" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#f7e3ae" stopOpacity=".08" />
          <stop offset="1" stopColor="#f7e3ae" stopOpacity="0" />
        </linearGradient>
        {/* light */}
        <radialGradient id="ln_haloG">
          <stop offset="0" stopColor="#f7e3ae" stopOpacity=".34" />
          <stop offset=".45" stopColor="#f7e3ae" stopOpacity=".15" />
          <stop offset=".72" stopColor="#d9a441" stopOpacity=".07" />
          <stop offset="1" stopColor="#d9a441" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ln_coreG">
          <stop offset="0" stopColor="#fbf6ea" stopOpacity=".5" />
          <stop offset=".55" stopColor="#f7e3ae" stopOpacity=".2" />
          <stop offset="1" stopColor="#f7e3ae" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ln_unionG">
          <stop offset="0" stopColor="#c9b3e3" stopOpacity=".4" />
          <stop offset=".55" stopColor="#c9b3e3" stopOpacity=".14" />
          <stop offset="1" stopColor="#c9b3e3" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ln_glowSmG">
          <stop offset="0" stopColor="#f7e3ae" stopOpacity=".4" />
          <stop offset="1" stopColor="#f7e3ae" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ln_shadG">
          <stop offset="0" stopColor="#1e1913" stopOpacity=".55" />
          <stop offset="1" stopColor="#1e1913" stopOpacity="0" />
        </radialGradient>
        {/* the library's light, rising through the hatch */}
        <linearGradient id="ln_hatchUpG" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#f7e3ae" stopOpacity=".5" />
          <stop offset=".55" stopColor="#d9a441" stopOpacity=".2" />
          <stop offset="1" stopColor="#d9a441" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ln_violUpG" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#c9b3e3" stopOpacity=".16" />
          <stop offset="1" stopColor="#c9b3e3" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ═══════════ FAR: the cap, the sky it stands in, the sea it stands over ═══════════ */}
      <g>
        {/* the night, whole; up here there is nothing between you and it */}
        <rect x="-700" y="-400" width="2900" height="1441" fill="url(#ln_skyHi)" />

        {/* stars — nearer than they have ever been; the lamp washes them when lit */}
        <g fill="#fbf6ea" opacity={lit ? 0.6 : 1}>
          <circle cx="60" cy="120" r="1.3" opacity=".6" />
          <circle cx="120" cy="210" r="1" opacity=".45" />
          <circle cx="94" cy="360" r="1.2" opacity=".5" />
          <circle cx="906" cy="140" r="1.4" opacity=".6" />
          <circle cx="944" cy="260" r="1" opacity=".45" />
          <circle cx="880" cy="86" r="1.1" opacity=".5" />
          <circle cx="248" cy="472" r="1.2" opacity=".55" />
          <circle cx="292" cy="590" r=".9" opacity=".4" />
          <circle cx="222" cy="620" r="1" opacity=".42" />
          <circle cx="386" cy="380" r="1.3" opacity=".6" />
          <circle cx="442" cy="460" r="1" opacity=".45" />
          <circle cx="366" cy="520" r=".9" opacity=".38" />
          <circle cx="618" cy="372" r="1.2" opacity=".55" />
          <circle cx="586" cy="470" r=".9" opacity=".4" />
          <circle cx="646" cy="540" r="1.1" opacity=".45" />
          <circle cx="742" cy="470" r="1.3" opacity=".55" />
          <circle cx="782" cy="560" r="1" opacity=".42" />
          <circle cx="716" cy="610" r=".9" opacity=".36" />
          <circle cx="60" cy="520" r="1.1" opacity=".45" />
          <circle cx="30" cy="680" r=".9" opacity=".35" />
          <circle cx="966" cy="420" r="1.2" opacity=".5" />
          <circle cx="936" cy="560" r=".9" opacity=".4" />
          <circle cx="560" cy="352" r="1" opacity=".45" className="ln-twinkle" style={{ animationDelay: "-3s" }} />
          <circle cx="330" cy="430" r="1.1" opacity=".5" className="ln-twinkle" style={{ animationDelay: "-5.4s" }} />
          <circle cx="852" cy="470" r="1" opacity=".45" className="ln-twinkle" style={{ animationDelay: "-1.8s" }} />
        </g>
        {/* the ferry, closer here than any window has shown it */}
        <g>
          <path d="M 216 402 L 250 417 L 292 413 L 324 393" fill="none" stroke="#fbf6ea" strokeWidth=".9" strokeOpacity=".3" />
          <line x1="270" y1="414" x2="270" y2="344" stroke="#fbf6ea" strokeWidth=".9" strokeOpacity=".3" />
          <circle cx="216" cy="402" r="2" fill="#fbf6ea" opacity=".8" />
          <circle cx="250" cy="417" r="1.6" fill="#fbf6ea" opacity=".7" />
          <circle cx="292" cy="413" r="1.9" fill="#fbf6ea" opacity=".75" />
          <circle cx="324" cy="393" r="1.6" fill="#fbf6ea" opacity=".7" />
          <circle cx="270" cy="344" r="2.4" fill="#fbf6ea" opacity=".9" className="ln-twinkle" style={{ animationDelay: "-2s" }} />
        </g>
        {/* the × asterism: two hands, written in the heavens; the lamp answers it below */}
        <g stroke="#fbf6ea" strokeWidth=".9" strokeOpacity=".28">
          <line x1="704" y1="356" x2="722" y2="376" />
          <line x1="722" y1="356" x2="704" y2="376" />
        </g>
        <circle cx="704" cy="356" r="1.5" fill="#fbf6ea" opacity=".7" />
        <circle cx="722" cy="376" r="1.5" fill="#fbf6ea" opacity=".65" />
        <circle cx="722" cy="356" r="1.3" fill="#fbf6ea" opacity=".6" className="ln-twinkle" style={{ animationDelay: "-5s" }} />
        <circle cx="704" cy="376" r="1.3" fill="#fbf6ea" opacity=".6" />

        {/* the horizon, at eye level as it always is, and the sea a tower's height down */}
        <rect x="-700" y="641" width="2900" height="393" fill="url(#ln_seaG)" />
        <line x1="-700" y1="641" x2="2200" y2="641" stroke="#453a54" strokeWidth="1.3" strokeOpacity=".85" />
        <g stroke="#453a54" strokeWidth="1.2" strokeOpacity=".5">
          <line x1="120" y1="690" x2="196" y2="690" />
          <line x1="330" y1="724" x2="422" y2="724" />
          <line x1="560" y1="700" x2="640" y2="700" />
          <line x1="240" y1="790" x2="330" y2="790" />
          <line x1="620" y1="820" x2="742" y2="820" />
          <line x1="90" y1="880" x2="210" y2="880" />
          <line x1="430" y1="905" x2="560" y2="905" />
          <line x1="700" y1="950" x2="850" y2="950" />
          <line x1="200" y1="975" x2="320" y2="975" />
        </g>

        {/* THE FAR SHORE + the beam's track on the water — lit ONLY: the beam reaches it */}
        {lit ? (
          <>
            <g fill="#d9a441">
              <rect x="824" y="638.4" width="7" height="1.9" rx=".9" />
              <rect x="833" y="637.8" width="5" height="1.7" rx=".8" />
              <rect x="841" y="638.6" width="4" height="1.5" rx=".7" />
            </g>
            <circle cx="833" cy="636.4" r="1.5" fill="#f7e3ae" className="ln-twinkle" style={{ animationDelay: "-1s", animationDuration: "9s" }} />
            <path d="M 833 644 q 2 10 -1 20 q -2 10 1 22" fill="none" stroke="#d9a441" strokeWidth="1.4" strokeOpacity=".3" />
            {/* the beam's track: broken gold, the way light really lies on a sea */}
            <g stroke="#d9a441" strokeLinecap="round">
              <line x1="828" y1="672" x2="846" y2="672" strokeWidth="1.6" strokeOpacity=".3" />
              <line x1="836" y1="712" x2="858" y2="712" strokeWidth="1.7" strokeOpacity=".26" />
              <line x1="830" y1="762" x2="856" y2="762" strokeWidth="1.8" strokeOpacity=".22" />
              <line x1="842" y1="826" x2="874" y2="826" strokeWidth="2" strokeOpacity=".18" />
              <line x1="836" y1="898" x2="872" y2="898" strokeWidth="2.2" strokeOpacity=".14" />
              <line x1="846" y1="962" x2="890" y2="962" strokeWidth="2.4" strokeOpacity=".1" />
            </g>
          </>
        ) : null}

        {/* the island itself, far beneath the glass: the world this light stands over */}
        <path d="M 150 1012 L 150 972 C 206 958, 258 970, 318 982 C 352 989, 380 1000, 392 1012 Z" fill="#1e1913" opacity=".85" />
        <circle cx="252" cy="990" r="1.4" fill="#d9a441" opacity=".55" />
        <g stroke="#1e1913" strokeWidth="3" strokeOpacity=".9">
          <line x1="612" y1="1012" x2="676" y2="1004" />
          <line x1="676" y1="1004" x2="676" y2="1012" />
        </g>
        <circle cx="628" cy="1002" r="1.4" fill="#d9a441" opacity=".65" className="ln-twinkle" style={{ animationDuration: "8s" }} />
        <circle cx="664" cy="1000" r="1.2" fill="#d9a441" opacity=".55" />

        {/* THE GALLERY RAILING, circling outside the glass */}
        <g>
          <path d="M 118 874 C 320 858, 680 858, 882 874" fill="none" stroke="#241e18" strokeWidth="7" strokeOpacity=".9" />
          <path d="M 118 872 C 320 856, 680 856, 882 872" fill="none" stroke="#d9a441" strokeWidth="1.2" strokeOpacity=".3" />
          <path d="M 118 938 C 320 924, 680 924, 882 938" fill="none" stroke="#241e18" strokeWidth="4.5" strokeOpacity=".8" />
          <g stroke="#241e18" strokeWidth="3.6" strokeOpacity=".62">
            <line x1="160" y1="869" x2="160" y2="1012" />
            <line x1="220" y1="864" x2="220" y2="1012" />
            <line x1="280" y1="861" x2="280" y2="1012" />
            <line x1="340" y1="859" x2="340" y2="1012" />
            <line x1="400" y1="858" x2="400" y2="1012" />
            <line x1="460" y1="857" x2="460" y2="1012" />
            <line x1="540" y1="857" x2="540" y2="1012" />
            <line x1="600" y1="858" x2="600" y2="1012" />
            <line x1="660" y1="859" x2="660" y2="1012" />
            <line x1="720" y1="861" x2="720" y2="1012" />
            <line x1="780" y1="864" x2="780" y2="1012" />
            <line x1="840" y1="869" x2="840" y2="1012" />
          </g>
        </g>

        {/* ── THE GLAZING: astragal bars, diagonal the way real lanterns brace their glass ── */}
        {/* edge bars past the corner posts: the cap curving away */}
        <g>
          <rect x="56" y="312" width="9" height="722" fill="#3a3128" />
          <rect x="96" y="312" width="8" height="722" fill="#3a3128" />
          <rect x="896" y="312" width="8" height="722" fill="#3a3128" />
          <rect x="935" y="312" width="9" height="722" fill="#3a3128" />
          <line x1="98" y1="316" x2="98" y2="1030" stroke="#d9a441" strokeWidth="1" strokeOpacity=".14" />
          <line x1="898" y1="316" x2="898" y2="1030" stroke="#d9a441" strokeWidth="1" strokeOpacity=".22" />
        </g>
        {/* corner posts */}
        <rect x="150" y="312" width="36" height="722" fill="#3a3128" />
        <rect x="814" y="312" width="36" height="722" fill="#3a3128" />
        <g stroke="#241e18" strokeWidth="1.6" strokeOpacity=".6">
          <line x1="158" y1="312" x2="158" y2="1034" />
          <line x1="178" y1="312" x2="178" y2="1034" />
          <line x1="822" y1="312" x2="822" y2="1034" />
          <line x1="842" y1="312" x2="842" y2="1034" />
        </g>
        <line x1="184" y1="316" x2="184" y2="1030" stroke="#d9a441" strokeWidth="1.3" strokeOpacity=".3" />
        <line x1="816" y1="316" x2="816" y2="1030" stroke="#d9a441" strokeWidth="1.3" strokeOpacity=".38" />
        {/* mid astragals */}
        <rect x="331" y="312" width="10" height="722" fill="#3a3128" />
        <rect x="659" y="312" width="10" height="722" fill="#3a3128" />
        <line x1="336" y1="316" x2="336" y2="1030" stroke="#d9a441" strokeWidth="1.3" strokeOpacity=".32" />
        <line x1="664" y1="316" x2="664" y2="1030" stroke="#d9a441" strokeWidth="1.3" strokeOpacity=".4" />
        {/* diagonals, west pane */}
        <g stroke="#3a3128" strokeWidth="6">
          <line x1="190" y1="344" x2="327" y2="536" />
          <line x1="327" y1="344" x2="190" y2="536" />
          <line x1="190" y1="544" x2="327" y2="736" />
          <line x1="327" y1="544" x2="190" y2="736" />
          <line x1="190" y1="744" x2="327" y2="936" />
          <line x1="327" y1="744" x2="190" y2="936" />
        </g>
        <g stroke="#d9a441" strokeWidth="1.1" strokeOpacity=".2">
          <line x1="190" y1="344" x2="327" y2="536" />
          <line x1="327" y1="344" x2="190" y2="536" />
          <line x1="190" y1="544" x2="327" y2="736" />
          <line x1="327" y1="544" x2="190" y2="736" />
          <line x1="190" y1="744" x2="327" y2="936" />
          <line x1="327" y1="744" x2="190" y2="936" />
        </g>
        {/* diagonals, east pane — warmer: the beam lives on this side */}
        <g stroke="#3a3128" strokeWidth="6">
          <line x1="673" y1="344" x2="810" y2="536" />
          <line x1="810" y1="344" x2="673" y2="536" />
          <line x1="673" y1="544" x2="810" y2="736" />
          <line x1="810" y1="544" x2="673" y2="736" />
          <line x1="673" y1="744" x2="810" y2="936" />
          <line x1="810" y1="744" x2="673" y2="936" />
        </g>
        <g stroke="#d9a441" strokeWidth="1.1" strokeOpacity=".32">
          <line x1="673" y1="344" x2="810" y2="536" />
          <line x1="810" y1="344" x2="673" y2="536" />
          <line x1="673" y1="544" x2="810" y2="736" />
          <line x1="810" y1="544" x2="673" y2="736" />
          <line x1="673" y1="744" x2="810" y2="936" />
          <line x1="810" y1="744" x2="673" y2="936" />
        </g>
        {/* diagonals, center pane: the lamp hides most of them, as it should */}
        <g stroke="#3a3128" strokeWidth="6">
          <line x1="346" y1="330" x2="466" y2="446" />
          <line x1="654" y1="330" x2="534" y2="446" />
        </g>
        <g stroke="#d9a441" strokeWidth="1.1" strokeOpacity=".22">
          <line x1="346" y1="330" x2="466" y2="446" />
          <line x1="654" y1="330" x2="534" y2="446" />
        </g>
        {/* glass sheen: the panes admit the night, and admit to being glass */}
        <g stroke="#fbf6ea" strokeOpacity=".045" strokeWidth="10" strokeLinecap="round">
          <line x1="228" y1="600" x2="300" y2="430" />
          <line x1="262" y1="640" x2="316" y2="512" />
          <line x1="700" y1="470" x2="770" y2="330" />
          <line x1="212" y1="900" x2="258" y2="796" />
        </g>

        {/* ── THE CORNICE + DOME, in section; the finial that breathes for the flame ── */}
        <rect x="132" y="288" width="736" height="26" fill="#4a4034" />
        <line x1="138" y1="290.5" x2="862" y2="290.5" stroke="#f7e3ae" strokeWidth="1.6" strokeOpacity=".18" />
        <line x1="132" y1="313" x2="868" y2="313" stroke="#241e18" strokeWidth="2" strokeOpacity=".6" />
        <g stroke="#241e18" strokeWidth="1.3" strokeOpacity=".4">
          <line x1="240" y1="290" x2="244" y2="312" />
          <line x1="404" y1="290" x2="406" y2="312" />
          <line x1="594" y1="290" x2="596" y2="312" />
          <line x1="756" y1="290" x2="760" y2="312" />
        </g>
        {/* the dome's underside, ribbed, warmed from below by the lamp */}
        <path d="M 162 288 C 200 190, 332 112, 500 108 C 668 112, 800 190, 838 288 Z" fill="#332a20" />
        <ellipse cx="500" cy="252" rx="250" ry="70" fill="#d9a441" opacity={lit ? 0.05 : solo ? 0.035 : 0.02} />
        <g fill="none" stroke="#241e18" strokeWidth="2.2" strokeOpacity=".55">
          <path d="M 500 176 Q 350 208 212 288" />
          <path d="M 500 176 Q 424 220 342 288" />
          <path d="M 500 176 Q 490 230 478 288" />
          <path d="M 500 176 Q 510 230 522 288" />
          <path d="M 500 176 Q 576 220 658 288" />
          <path d="M 500 176 Q 650 208 788 288" />
        </g>
        <g fill="none" stroke="#d9a441" strokeWidth="1" strokeOpacity=".12">
          <path d="M 500 180 Q 428 222 350 286" />
          <path d="M 500 180 Q 572 222 650 286" />
        </g>
        {/* the roof shell */}
        <path d="M 132 288 C 172 176, 322 84, 500 80 C 678 84, 828 176, 868 288 L 838 288 C 800 190, 668 112, 500 108 C 332 112, 200 190, 162 288 Z" fill="#2e261d" />
        <path d="M 148 260 C 196 164, 336 92, 500 88 C 664 92, 804 164, 852 260" fill="none" stroke="#d9a441" strokeWidth="1.2" strokeOpacity=".2" />
        <g stroke="#241e18" strokeWidth="1.4" strokeOpacity=".45">
          <line x1="288" y1="150" x2="300" y2="128" />
          <line x1="500" y1="104" x2="500" y2="82" />
          <line x1="712" y1="150" x2="700" y2="128" />
          <line x1="392" y1="118" x2="398" y2="96" />
          <line x1="608" y1="118" x2="602" y2="96" />
        </g>
        {/* finial + ventilator ball: the chimney of a living flame; the × keeps the weather */}
        <g>
          <rect x="488" y="58" width="24" height="24" rx="3" fill="#3a3128" stroke="#d9a441" strokeWidth="1.2" strokeOpacity=".55" />
          <line x1="493" y1="62" x2="493" y2="78" stroke="#241e18" strokeWidth="1.2" strokeOpacity=".6" />
          <line x1="507" y1="62" x2="507" y2="78" stroke="#241e18" strokeWidth="1.2" strokeOpacity=".6" />
          <circle cx="500" cy="46" r="11" fill="#3a3128" stroke="#d9a441" strokeWidth="1.4" strokeOpacity=".65" />
          <path d="M 492 40 A 11 11 0 0 1 500 35" fill="none" stroke="#f7e3ae" strokeWidth="1" strokeOpacity=".5" />
          <line x1="500" y1="35" x2="500" y2="14" stroke="#d9a441" strokeWidth="1.8" strokeOpacity=".7" />
          <path d="M 494 20 L 506 30 M 506 20 L 494 30" stroke="#d9a441" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".85" />
        </g>
        {/* the ventilator boss inside, and its pull-chain */}
        <g>
          <circle cx="500" cy="168" r="17" fill="#3a3128" stroke="#d9a441" strokeWidth="1.3" strokeOpacity=".6" />
          <g stroke="#241e18" strokeWidth="1.4" strokeOpacity=".6">
            <line x1="490" y1="162" x2="510" y2="162" />
            <line x1="488" y1="168" x2="512" y2="168" />
            <line x1="490" y1="174" x2="510" y2="174" />
          </g>
          <line x1="500" y1="185" x2="500" y2="212" stroke="#6b5a44" strokeWidth="1.4" />
          <circle cx="500" cy="217" r="4" fill="none" stroke="#d9a441" strokeWidth="1.2" strokeOpacity=".6" />
        </g>

        {/* ── THE MURETTE: the parapet the glass stands on ── */}
        <rect x="132" y="1012" width="736" height="24" fill="#4a4034" />
        <line x1="138" y1="1014.5" x2="862" y2="1014.5" stroke="#f7e3ae" strokeWidth="1.5" strokeOpacity=".15" />
        <line x1="132" y1="1035" x2="868" y2="1035" stroke="#241e18" strokeWidth="2" strokeOpacity=".55" />
        <rect x="-700" y="1036" width="2900" height="174" fill="url(#ln_muretteG)" />
        <g stroke="#241e18" strokeWidth="1.4" strokeOpacity=".16">
          <line x1="120" y1="1092" x2="180" y2="1092" />
          <line x1="420" y1="1120" x2="478" y2="1120" />
          <line x1="600" y1="1076" x2="656" y2="1076" />
          <line x1="760" y1="1150" x2="820" y2="1150" />
          <line x1="40" y1="1160" x2="96" y2="1160" />
          <line x1="900" y1="1090" x2="958" y2="1090" />
        </g>
        {/* past the parapet's ends the wall wraps out of sight */}
        <rect x="-700" y="1012" width="832" height="24" fill="#463c30" />
        <rect x="868" y="1012" width="1332" height="24" fill="#463c30" />

        {/* ── THE FLOOR ── */}
        <rect x="-700" y="1210" width="2900" height="700" fill="url(#ln_floorG)" />
        <line x1="-700" y1="1211" x2="2200" y2="1211" stroke="#1e1913" strokeOpacity=".55" strokeWidth="2.5" />
        <g stroke="#1e1913" strokeWidth="2" strokeOpacity=".42">
          <line x1="-700" y1="1252" x2="2200" y2="1252" />
          <line x1="-700" y1="1296" x2="2200" y2="1296" />
          <line x1="-700" y1="1346" x2="2200" y2="1346" />
          <line x1="-700" y1="1404" x2="2200" y2="1404" />
          <line x1="-700" y1="1472" x2="2200" y2="1472" />
        </g>
        <g stroke="#1e1913" strokeWidth="1.6" strokeOpacity=".26">
          <line x1="430" y1="1211" x2="426" y2="1252" />
          <line x1="736" y1="1252" x2="730" y2="1296" />
          <line x1="96" y1="1211" x2="92" y2="1252" />
          <line x1="562" y1="1296" x2="556" y2="1346" />
          <line x1="908" y1="1296" x2="902" y2="1346" />
          <line x1="250" y1="1404" x2="242" y2="1472" />
          <line x1="680" y1="1404" x2="672" y2="1472" />
        </g>
        {/* the lamp's warmth pooled on the boards — only where it truly falls */}
        <ellipse cx="500" cy="1290" rx="400" ry="86" fill="#d9a441" opacity={lit ? 0.06 : solo ? 0.04 : 0.015} />
      </g>

      {/* ═══════════ MID: the keeping of the light ═══════════ */}
      <g>
        {/* ── THE STAIR HATCH: the Library below, its book-light climbing to meet you ── */}
        <g>
          {/* the shaft of light standing in the room, the path the cast climbs */}
          <polygon points="196,1286 300,1274 272,1000 218,1006" fill="url(#ln_hatchUpG)" opacity=".5" />
          <polygon className="ln-hatchbreath" points="186,1286 310,1272 292,940 202,948" fill="url(#ln_violUpG)" />
          <ellipse cx="248" cy="1180" rx="70" ry="110" fill="url(#ln_glowSmG)" opacity=".4" />
          {/* the opening itself */}
          <polygon points="150,1292 330,1272 354,1332 170,1354" fill="#1e1913" />
          {/* the top treads, arriving out of the warm */}
          <polygon points="196,1330 322,1314 330,1298 208,1312" fill="#33291d" />
          <polygon points="222,1312 326,1300 330,1288 232,1298" fill="#2e2418" />
          <line x1="208" y1="1312" x2="330" y2="1298" stroke="#f7e3ae" strokeWidth="1.5" strokeOpacity=".4" />
          <line x1="232" y1="1298" x2="330" y2="1288" stroke="#f7e3ae" strokeWidth="1.4" strokeOpacity=".28" />
          {/* the rim, coamed like a deck hatch */}
          <g fill="none" stroke="#33291d" strokeWidth="9" strokeLinejoin="round">
            <polygon points="150,1292 330,1272 354,1332 170,1354" />
          </g>
          <polygon points="150,1292 330,1272 354,1332 170,1354" fill="none" stroke="#d9a441" strokeWidth="1.1" strokeOpacity=".28" />
          {/* rail post + rope: something to hold with the hand that isn't carrying oil */}
          <rect x="344" y="1252" width="9" height="82" rx="3" fill="#3a2c1e" />
          <line x1="345.5" y1="1256" x2="345.5" y2="1330" stroke="#d9a441" strokeWidth="1" strokeOpacity=".25" />
          <path d="M 348 1262 C 388 1252, 424 1258, 452 1276" fill="none" stroke="#3a2c1e" strokeWidth="5" />
          <path d="M 348 1262 C 388 1252, 424 1258, 452 1276" fill="none" stroke="#d9a441" strokeWidth="1" strokeOpacity=".3" />
          <circle cx="454" cy="1279" r="4" fill="none" stroke="#6b5a44" strokeWidth="2" />
          {/* the lamp-room key, home on its hook at last */}
          <g fill="none" stroke="#d9a441" strokeWidth="2" strokeLinecap="round">
            <path d="M 356 1240 C 363 1239, 366 1246, 361 1251" strokeOpacity=".85" />
            <circle cx="360" cy="1260" r="6.5" strokeOpacity=".8" />
            <line x1="360" y1="1266.5" x2="360" y2="1292" strokeOpacity=".8" strokeWidth="2.5" />
            <line x1="360" y1="1284" x2="368" y2="1284" strokeOpacity=".8" strokeWidth="2.5" />
            <line x1="360" y1="1292" x2="366" y2="1292" strokeOpacity=".8" strokeWidth="2.5" />
            <path d="M 356 1256 A 6.5 6.5 0 0 1 362 1253.6" stroke="#f7e3ae" strokeWidth="1" strokeOpacity=".6" />
          </g>
          {/* rope coil: oil comes up the same way you did */}
          <g fill="none" stroke="#6b5a44" strokeWidth="5" opacity=".9">
            <ellipse cx="108" cy="1420" rx="44" ry="16" />
            <ellipse cx="108" cy="1410" rx="36" ry="13" />
            <ellipse cx="108" cy="1401" rx="28" ry="10" />
          </g>
        </g>

        {/* ── THE THREE WATCHES: the lamp's honest states, engraved small on the parapet ── */}
        <g transform="rotate(-1.2 198 1122)">
          <rect x="60" y="1054" width="276" height="136" rx="3" fill="#3a2c1e" />
          <rect x="70" y="1064" width="256" height="116" rx="2" fill="url(#ln_pageG)" />
          <rect x="70" y="1064" width="256" height="116" rx="2" fill="none" stroke="#2b2014" strokeWidth="1" strokeOpacity=".25" />
          <circle cx="198" cy="1070" r="2" fill="#d9a441" />
          <text x="198" y="1084" textAnchor="middle" fontFamily="'Courier New', Courier, monospace" fontSize="8.5" letterSpacing="1.6" fill="#4a3a28">
            THE THREE WATCHES OF THE LAMP
          </text>
          {/* DARK: a quiet night — the stars keep the room */}
          <g>
            <circle cx="126" cy="1122" r="24" fill="#241e18" />
            <circle cx="126" cy="1122" r="24" fill="none" stroke="#bdb7a8" strokeWidth="1.3" strokeOpacity=".55" />
            <circle cx="117" cy="1112" r="1" fill="#f5eddc" opacity=".6" />
            <circle cx="136" cy="1108" r=".8" fill="#f5eddc" opacity=".5" />
            <circle cx="140" cy="1120" r=".9" fill="#f5eddc" opacity=".45" />
            <rect x="119" y="1122" width="14" height="12" rx="2" fill="none" stroke="#f5eddc" strokeWidth="1" strokeOpacity=".28" />
            <path d="M 122 1122 Q 126 1116 130 1122" fill="none" stroke="#f5eddc" strokeWidth="1" strokeOpacity=".28" />
          </g>
          {/* KINDLED: one hand on it — warm, no beam, never a scold */}
          <g>
            <circle cx="198" cy="1122" r="24" fill="#241e18" />
            <circle cx="198" cy="1122" r="24" fill="none" stroke="#d9a441" strokeWidth="1.3" strokeOpacity=".4" />
            <ellipse className="ln-kindle" cx="198" cy="1130" rx="13" ry="8" fill="#d9a441" opacity=".38" />
            <line x1="191" y1="1115" x2="205" y2="1129" stroke="#f5eddc" strokeWidth="2" strokeLinecap="round" strokeOpacity=".85" />
            <line x1="205" y1="1115" x2="191" y2="1129" stroke="#f5eddc" strokeWidth="1.6" strokeLinecap="round" strokeOpacity=".3" strokeDasharray="2 3" />
          </g>
          {/* LIT: both — the beam */}
          <g>
            <circle cx="270" cy="1122" r="24" fill="#3a3128" />
            <circle cx="270" cy="1122" r="24" fill="none" stroke="#d9a441" strokeWidth="1.5" strokeOpacity=".65" />
            <path d="M 274 1116 L 293 1110 L 293 1134 L 274 1128 Z" fill="#d9a441" opacity=".4" />
            <circle cx="268" cy="1122" r="6" fill="#f7e3ae" />
            <line x1="263" y1="1117" x2="273" y2="1127" stroke="#93372b" strokeWidth="1.5" strokeLinecap="round" strokeOpacity=".8" />
            <line x1="273" y1="1117" x2="263" y2="1127" stroke="#93372b" strokeWidth="1.5" strokeLinecap="round" strokeOpacity=".8" />
            <circle cx="290" cy="1122" r="1.3" fill="#f7e3ae" />
          </g>
          <g fontFamily="'Courier New', Courier, monospace" textAnchor="middle" fill="#4a3a28">
            <text x="126" y="1160" fontSize="6.5" letterSpacing="1">DARK</text>
            <text x="198" y="1160" fontSize="6.5" letterSpacing="1">KINDLED</text>
            <text x="270" y="1160" fontSize="6.5" letterSpacing="1">LIT</text>
          </g>
          <g fontFamily="'Courier New', Courier, monospace" textAnchor="middle" fill="#7a6a54">
            <text x="126" y="1170" fontSize="4.8" letterSpacing=".4">A QUIET NIGHT</text>
            <text x="198" y="1170" fontSize="4.8" letterSpacing=".4">ONE HAND ON IT</text>
            <text x="270" y="1170" fontSize="4.8" letterSpacing=".4">BOTH - THE BEAM</text>
          </g>
        </g>

        {/* ── THE KEEPER'S LOG, on its lectern: the ledger voice of the light ── */}
        <g>
          <ellipse cx="828" cy="1420" rx="96" ry="11" fill="url(#ln_shadG)" />
          <rect x="816" y="1310" width="20" height="104" fill="#33291d" />
          <line x1="819" y1="1314" x2="819" y2="1410" stroke="#d9a441" strokeWidth="1" strokeOpacity=".18" />
          <path d="M 796 1414 L 856 1414 L 848 1394 L 804 1394 Z" fill="#33291d" />
          {/* the slanted top */}
          <path d="M 752 1286 L 898 1270 L 910 1312 L 764 1330 Z" fill="#3a2c1e" />
          <line x1="756" y1="1288" x2="900" y2="1272" stroke="#f7e3ae" strokeWidth="1.4" strokeOpacity=".14" />
          {/* the open log */}
          <g transform="rotate(-4 828 1296)">
            <path d="M 764 1290 L 824 1283 L 827 1313 L 768 1320 Z" fill="url(#ln_pageG)" />
            <path d="M 894 1289 L 826 1283 L 823 1313 L 890 1320 Z" fill="url(#ln_pageG)" />
            <line x1="825" y1="1283" x2="825" y2="1314" stroke="#d9c9a8" strokeWidth="1.8" />
            <path d="M 768 1322.5 L 826 1315.5 M 890 1322.5 L 824 1315.5" stroke="#e6d9bd" strokeWidth="1.1" fill="none" />
            <g fill="none" stroke="#2b2014" strokeWidth=".7" strokeOpacity=".2">
              <line x1="772" y1="1296" x2="818" y2="1291" />
              <line x1="773" y1="1303" x2="819" y2="1298" />
              <line x1="774" y1="1310" x2="820" y2="1305" />
            </g>
            <g fontFamily="'Courier New', Courier, monospace" fontSize="5.4" fill="#6b5a44" letterSpacing=".3">
              <text x="830" y="1296">DAY 214 - SEALED</text>
              <text x="830" y="1304">OIL FULL, WICK TRIM</text>
              <text x="830" y="1312">BOTH HANDS ON IT</text>
            </g>
            {/* the entry sealed: a drop of garnet, and the two-stroke stamp */}
            <circle cx="808" cy="1289" r="4.4" fill="#93372b" stroke="#6e2a20" strokeWidth="1" />
            <path d="M 806.2 1287.2 l 3.6 3.6 m 0 -3.6 l -3.6 3.6" stroke="#fbf6ea" strokeWidth=".8" strokeOpacity=".45" />
          </g>
          {/* the wick trimmer, set down where it will be wanted */}
          <g stroke="#d9a441" strokeWidth="1.5" strokeOpacity=".7" fill="none" transform="rotate(14 884 1332)">
            <line x1="872" y1="1326" x2="896" y2="1338" />
            <line x1="896" y1="1326" x2="872" y2="1338" />
            <circle cx="869" cy="1325" r="3.4" />
            <circle cx="869" cy="1339" r="3.4" />
          </g>
        </g>

        {/* ── THE OIL CAN + LENS CLOTH: the machine is tended, not magic ── */}
        <g>
          <ellipse cx="654" cy="1234" rx="42" ry="6" fill="url(#ln_shadG)" />
          <path d="M 632 1230 L 676 1230 L 671 1174 L 637 1174 Z" fill="#3a3128" />
          <path d="M 637 1174 Q 654 1164 671 1174" fill="#3a3128" />
          <line x1="640" y1="1180" x2="644" y2="1226" stroke="#d9a441" strokeWidth="1.1" strokeOpacity=".4" />
          <path d="M 654 1168 L 654 1158" stroke="#3a3128" strokeWidth="7" />
          <path d="M 668 1176 C 682 1166, 692 1156, 698 1144" fill="none" stroke="#3a3128" strokeWidth="5" />
          <path d="M 668 1175 C 682 1165, 691 1156, 697 1145" fill="none" stroke="#d9a441" strokeWidth="1" strokeOpacity=".5" />
          <path d="M 640 1186 A 26 22 0 0 0 636 1206" fill="none" stroke="#f7e3ae" strokeWidth="1.2" strokeOpacity=".25" />
          <rect x="638" y="1196" width="32" height="10" rx="1" fill="#f5eddc" opacity=".9" transform="rotate(-1.5 654 1201)" />
          <text x="654" y="1203.4" textAnchor="middle" fontFamily="'Courier New', Courier, monospace" fontSize="5.2" letterSpacing=".6" fill="#4a3a28" transform="rotate(-1.5 654 1201)">
            LAMP OIL
          </text>
        </g>
      </g>

      {/* ═══════════ HEART: the lamp — the seal, risen and burning ═══════════ */}
      <g>
        {/* ── THE BEAM: it exists because today is sealed; it knows where the shore is ── */}
        {lit ? (
          <g className="ln-beam-sway">
            <g className="ln-beam-shim">
              {/* the lens leaks a little light the other way; real glass always does */}
              <polygon points="412,576 240,538 240,700 412,628" fill="url(#ln_spillW)" opacity=".6" />
              {/* the full throw */}
              <polygon points="592,558 1060,448 1060,852 592,646" fill="url(#ln_beamG)" />
              {/* the hot lance, laid on the far shore */}
              <polygon points="592,586 1060,662 1060,690 592,614" fill="url(#ln_lanceG)" />
              {/* the beam crossing its own glass: the bars catch it */}
              <line x1="666" y1="548" x2="666" y2="700" stroke="#f7e3ae" strokeWidth="2.5" strokeOpacity=".3" />
              <line x1="818" y1="530" x2="818" y2="740" stroke="#f7e3ae" strokeWidth="2" strokeOpacity=".22" />
              <rect x="700" y="520" width="130" height="220" fill="url(#ln_spillW)" opacity=".35" transform="scale(-1 1) translate(-1530 0)" />
            </g>
            {/* where the light lands: the shore, answering */}
            <circle cx="834" cy="640" r="26" fill="url(#ln_glowSmG)" opacity=".6" />
          </g>
        ) : null}

        {/* the great halo the lamp lays on the room */}
        <circle cx="500" cy="600" r="260" fill="url(#ln_haloG)" className={lit ? "ln-halo" : undefined} opacity={lit ? undefined : haloStatic} />

        {/* ── THE PEDESTAL: clockwork that turns the light; kept wound by hand ── */}
        <ellipse cx="500" cy="1218" rx="210" ry="16" fill="url(#ln_shadG)" />
        <g>
          {/* base plinth */}
          <path d="M 396 1214 L 604 1214 L 596 1160 L 404 1160 Z" fill="#463c30" />
          <line x1="404" y1="1162.5" x2="596" y2="1162.5" stroke="#f7e3ae" strokeWidth="1.4" strokeOpacity=".16" />
          <line x1="400" y1="1208" x2="600" y2="1208" stroke="#241e18" strokeWidth="1.6" strokeOpacity=".5" />
          {/* column */}
          <rect x="428" y="828" width="144" height="332" fill="#3a3128" />
          <line x1="434" y1="832" x2="434" y2="1156" stroke="#241e18" strokeWidth="1.6" strokeOpacity=".5" />
          <line x1="566" y1="832" x2="566" y2="1156" stroke="#241e18" strokeWidth="1.6" strokeOpacity=".5" />
          <line x1="440" y1="832" x2="440" y2="1156" stroke="#f7e3ae" strokeWidth="1" strokeOpacity=".12" />
          {/* the clockwork window: the gear that walks the lens around the night */}
          <path d="M 452 1042 L 452 962 A 48 48 0 0 1 548 962 L 548 1042 Z" fill="#241e18" />
          <path d="M 452 1042 L 452 962 A 48 48 0 0 1 548 962 L 548 1042" fill="none" stroke="#d9a441" strokeWidth="1.2" strokeOpacity=".4" />
          <circle cx="500" cy="1002" r="34" fill="none" stroke="#d9a441" strokeWidth="2.2" strokeOpacity=".65" />
          <circle cx="500" cy="1002" r="26" fill="none" stroke="#d9a441" strokeWidth="1" strokeOpacity=".3" />
          <g stroke="#d9a441" strokeWidth="2" strokeOpacity=".55">
            <line x1="500" y1="968" x2="500" y2="962" />
            <line x1="500" y1="1036" x2="500" y2="1042" />
            <line x1="466" y1="1002" x2="460" y2="1002" />
            <line x1="534" y1="1002" x2="540" y2="1002" />
            <line x1="476" y1="978" x2="472" y2="974" />
            <line x1="524" y1="978" x2="528" y2="974" />
            <line x1="476" y1="1026" x2="472" y2="1030" />
            <line x1="524" y1="1026" x2="528" y2="1030" />
          </g>
          <g stroke="#d9a441" strokeWidth="1.6" strokeOpacity=".5">
            <line x1="500" y1="1002" x2="500" y2="976" />
            <line x1="500" y1="1002" x2="522" y2="1016" />
            <line x1="500" y1="1002" x2="478" y2="1016" />
          </g>
          <circle cx="500" cy="1002" r="4.5" fill="#3a3128" stroke="#d9a441" strokeWidth="1.4" strokeOpacity=".7" />
          {/* the winding crank, resting until the evening round */}
          <path d="M 566 1096 L 594 1096" stroke="#3a3128" strokeWidth="8" />
          <path d="M 594 1096 L 594 1072" stroke="#3a3128" strokeWidth="6" />
          <circle cx="594" cy="1066" r="6" fill="#3a3128" stroke="#d9a441" strokeWidth="1.3" strokeOpacity=".6" />
          <line x1="568" y1="1094" x2="590" y2="1094" stroke="#d9a441" strokeWidth="1" strokeOpacity=".35" />
          {/* the maker's plate: the machine states its one law */}
          <rect x="448" y="1108" width="104" height="20" rx="3" fill="#3a3128" stroke="#d9a441" strokeWidth="1" strokeOpacity=".65" />
          <text x="500" y="1121.5" textAnchor="middle" fontFamily="'Courier New', Courier, monospace" fontSize="8" letterSpacing="2" fill="#d9a441" opacity=".85">
            KEPT BY TWO
          </text>
          {/* capital under the lens */}
          <rect x="384" y="800" width="232" height="30" rx="4" fill="#4a4034" />
          <line x1="390" y1="802.5" x2="610" y2="802.5" stroke="#f7e3ae" strokeWidth="1.6" strokeOpacity=".2" />
          <line x1="384" y1="829" x2="616" y2="829" stroke="#241e18" strokeWidth="1.8" strokeOpacity=".55" />
          <g fill="#d9a441" opacity=".6">
            <circle cx="400" cy="815" r="2.2" />
            <circle cx="500" cy="815" r="2.2" />
            <circle cx="600" cy="815" r="2.2" />
          </g>
          {/* the lens cloth, left where the polishing ended */}
          <path d="M 390 806 C 380 826, 376 850, 380 874 C 381 884, 376 890, 370 894 L 362 886 C 368 880, 370 872, 368 860 C 365 838, 372 818, 382 804 Z" fill="#f5eddc" opacity=".9" />
          <path d="M 384 812 C 377 830, 374 850, 376 868" fill="none" stroke="#e6d9bd" strokeWidth="2" />
          <path d="M 370 894 L 362 886 L 368 880 Z" fill="#e6d9bd" />
        </g>

        {/* ── THE LENS: rings of glass and brass, gathered around one bright thing ── */}
        <g>
          {/* prism hood, above */}
          <g>
            <path d="M 450 420 Q 500 404 550 420 L 542 446 Q 500 432 458 446 Z" fill="#3a3128" />
            <path d="M 458 446 Q 500 432 542 446 L 534 474 Q 500 462 466 474 Z" fill="#46402f" />
            <path d="M 466 474 Q 500 462 534 474 L 526 502 Q 500 492 474 502 Z" fill="#46402f" />
            <path d="M 452 420 Q 500 405 548 420" fill="none" stroke="#d9a441" strokeWidth="1.4" strokeOpacity=".5" />
            <path d="M 460 446 Q 500 433 540 446" fill="none" stroke="#d9a441" strokeWidth="1.2" strokeOpacity=".4" />
            <path d="M 468 474 Q 500 463 532 474" fill="none" stroke="#d9a441" strokeWidth="1.2" strokeOpacity=".4" />
            <path d="M 474 502 Q 500 493 526 502" fill="none" stroke="#d9a441" strokeWidth="1.2" strokeOpacity=".45" />
            <path d="M 462 470 Q 500 459 538 470" fill="none" stroke="#f7e3ae" strokeWidth="1" strokeOpacity=".22" />
          </g>
          {/* the throat: the bronze ring the lens stands on */}
          <path d="M 444 774 L 556 774 L 562 802 L 438 802 Z" fill="#3a3128" />
          <line x1="442" y1="798" x2="558" y2="798" stroke="#241e18" strokeWidth="1.4" strokeOpacity=".55" />
          {/* prism skirt, below */}
          <g>
            <path d="M 474 698 Q 500 708 526 698 L 534 726 Q 500 738 466 726 Z" fill="#46402f" />
            <path d="M 466 726 Q 500 738 534 726 L 542 754 Q 500 768 458 754 Z" fill="#46402f" />
            <path d="M 458 754 Q 500 768 542 754 L 550 780 Q 500 796 450 780 Z" fill="#3a3128" />
            <path d="M 474 700 Q 500 710 526 700" fill="none" stroke="#d9a441" strokeWidth="1.2" strokeOpacity=".45" />
            <path d="M 466 728 Q 500 740 534 728" fill="none" stroke="#d9a441" strokeWidth="1.2" strokeOpacity=".4" />
            <path d="M 458 756 Q 500 770 542 756" fill="none" stroke="#d9a441" strokeWidth="1.2" strokeOpacity=".4" />
            <path d="M 452 780 Q 500 795 548 780" fill="none" stroke="#d9a441" strokeWidth="1.4" strokeOpacity=".5" />
            <path d="M 470 732 Q 500 743 530 732" fill="none" stroke="#f7e3ae" strokeWidth="1" strokeOpacity=".2" />
          </g>
          {/* the barrel: warm glass holding the light */}
          <path d="M 474 502 C 430 512, 402 552, 402 600 C 402 648, 430 688, 474 698 L 526 698 C 570 688, 598 648, 598 600 C 598 552, 570 512, 526 502 Z" fill="#f7e3ae" opacity=".1" />
          <path d="M 474 502 C 430 512, 402 552, 402 600 C 402 648, 430 688, 474 698 L 526 698 C 570 688, 598 648, 598 600 C 598 552, 570 512, 526 502 Z" fill="none" stroke="#d9a441" strokeWidth="2.2" strokeOpacity=".6" />
          <path d="M 470 508 C 434 520, 410 556, 410 600" fill="none" stroke="#f7e3ae" strokeWidth="1.2" strokeOpacity=".35" />
          {/* cage ribs */}
          <line x1="446" y1="508" x2="446" y2="694" stroke="#3a3128" strokeWidth="5" />
          <line x1="554" y1="508" x2="554" y2="694" stroke="#3a3128" strokeWidth="5" />
          <line x1="444" y1="510" x2="444" y2="692" stroke="#d9a441" strokeWidth="1" strokeOpacity=".3" />
          <line x1="556" y1="510" x2="556" y2="692" stroke="#d9a441" strokeWidth="1" strokeOpacity=".35" />
          {/* the turning glints: clockwork you can only see by its light (still in the dark) */}
          <rect className={dark ? undefined : "ln-glint"} x="462" y="516" width="9" height="168" rx="4" fill="#fbf6ea" opacity=".1" />
          <rect className={dark ? undefined : "ln-glint ln-glint2"} x="530" y="524" width="6" height="152" rx="3" fill="#fbf6ea" opacity=".08" />

          {/* ── the bullseye: the day's seal, become the light itself ── */}
          <g className={dark ? undefined : "ln-breathe"}>
            <circle cx="500" cy="600" r="86" fill="none" stroke="#d9a441" strokeWidth="1.8" strokeOpacity=".5" />
            <circle cx="500" cy="600" r="86" fill="#f7e3ae" opacity=".07" />
            <circle cx="500" cy="600" r="64" fill="none" stroke="#d9a441" strokeWidth="1.6" strokeOpacity=".6" />
            <circle cx="500" cy="600" r="64" fill="#f7e3ae" opacity=".1" />
            <circle cx="500" cy="600" r="44" fill="none" stroke="#d9a441" strokeWidth="1.6" strokeOpacity=".75" />
            <circle cx="500" cy="600" r="44" fill="#f7e3ae" opacity=".16" />
            <path d="M 445 545 A 78 78 0 0 1 500 522" fill="none" stroke="#fbf6ea" strokeWidth="1.4" strokeOpacity=".4" />
            {/* the heat bloom — steps down with the state */}
            <circle cx="500" cy="600" r="120" fill="url(#ln_coreG)" opacity={bloomOpacity} />
            {/* the core: cream heat when lit, warm-low when kindled, an ember when dark */}
            <circle cx="500" cy="600" r={coreR} fill={coreFill} opacity={coreOpacity} />
            {/* the union's violet — a completed seal is both keepers; LIT only */}
            {lit ? <circle cx="500" cy="600" r="52" fill="url(#ln_unionG)" /> : null}
            {/* the × — both hands set; what the whole tower exists to raise */}
            <path d="M 484 584 L 516 616" stroke="#f7e3ae" strokeWidth="5.5" strokeLinecap="round" fill="none" strokeOpacity={xOpacity} />
            <path d="M 516 584 L 484 616" stroke="#f7e3ae" strokeWidth="5.5" strokeLinecap="round" fill="none" strokeOpacity={xOpacity} />
            <path d="M 486 582 L 502 598" stroke="#d9a441" strokeWidth="1.4" strokeOpacity={xGoldOpacity} fill="none" />
            <path d="M 514 582 L 498 598" stroke="#d9a441" strokeWidth="1.4" strokeOpacity={xGoldOpacity} fill="none" />
            {lit ? <circle cx="500" cy="600" r="3.2" fill="#c9b3e3" /> : null}
          </g>
        </g>
      </g>
    </>
  );
}
