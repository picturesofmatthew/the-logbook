"use client";

// The Garden — west — the living present (THE-LIGHTHOUSE.md).
//
// The island's PRESENT pole, opposite the Docks' far future. Revamped straight
// onto the engine: it renders the REAL glade — the same GladeScene the home grew
// (vitality tiers, the firepit, the beings in their zones, the keepers'
// lanterns) plus the real familiar over it. It is the one room lit by NOW: the
// glade rides the app's light-script (morning / dusk / night), so the Garden
// breathes with the actual day while the interiors stay timeless night.
//
// Around that living band the ornate SETTING is drawn — the walled garden of
// art/proto/garden-west.html, ported at the proto's fidelity: the dry-set stone
// wall, the EAST arbor gate back to the Hearth Hall (hearthlight and the union
// violet rose in its crown), the two keepers' raised beds (vervain / emberroot),
// the stepping-stone path, the bench built for two, the sundial that tells only
// now, the espalier, the crook lantern and the birdbath. The setting is an SVG
// layered IN FRONT of the CSS light-script sky and BEHIND / AROUND the live
// .garden-band at the foot — the architecture reads in any light; the sky and
// the glade are the parts that re-skin with the hour. The proto's own sky, sun,
// vignette, grain, canvas breath and parallax are the shell's job, not ported;
// its mock glade band is the placeholder the real GladeScene replaces whole.

import { FamiliarGlyph } from "@/components/familiar/familiar-glyph";
import { GladeScene, type BeingStages } from "@/components/glade/glade-scene";
import type { GladeTier } from "@/lib/engine/glade";
import { stageForDays } from "@/lib/engine/familiar";

export type GardenSnapshot = {
  tier: GladeTier;
  beings: BeingStages;
  familiarStage: ReturnType<typeof stageForDays>;
  familiarName: string | null;
  /** keepers who inscribed today's page — inklings gather at the book */
  inklings: number;
  hearthDay: boolean;
  mossLit: boolean;
  emberLit: boolean;
  paleElk: boolean;
};

export function GardenRoom({ snapshot }: { snapshot: GardenSnapshot }) {
  const {
    tier,
    beings,
    familiarStage,
    familiarName,
    inklings,
    hearthDay,
    mossLit,
    emberLit,
    paleElk,
  } = snapshot;

  return (
    <div
      className="garden-room"
      role="img"
      aria-label={`The garden west of the hearth — a walled garden lit by the real hour. The lighthouse tower rises beyond the east wall, its arched window warm with hearthlight; an arbor gate crowned by a single violet rose leads back to the hall. Raised beds of vervain and emberroot, a stepping-stone path, a bench built for two, and a sundial that tells only now frame the living glade at its foot, ${tier}, where the familiar keeps watch by the kindled fire between the two keeper lanterns.`}
    >
      {/* ═══ THE SETTING — the ornate walled garden, drawn in front of the
          light-script sky and around the live glade band below. Architecture
          only: the sky, sun, vignette, grain and breath belong to the shell. ═══ */}
      <svg
        className="garden-scene"
        viewBox="0 0 1000 1500"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="gd_towerG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#4d4236" />
            <stop offset=".45" stopColor="#463c30" />
            <stop offset="1" stopColor="#372f25" />
          </linearGradient>
          <radialGradient id="gd_winGlassG">
            <stop offset="0" stopColor="#f7e3ae" />
            <stop offset=".6" stopColor="#d9a441" />
            <stop offset="1" stopColor="#8a4c33" />
          </radialGradient>
          <radialGradient id="gd_doorGlowG">
            <stop offset="0" stopColor="#f7e3ae" stopOpacity=".95" />
            <stop offset=".55" stopColor="#d9a441" stopOpacity=".7" />
            <stop offset="1" stopColor="#8a4c33" stopOpacity=".4" />
          </radialGradient>
          <radialGradient id="gd_glowSmG">
            <stop offset="0" stopColor="#f7e3ae" stopOpacity=".4" />
            <stop offset="1" stopColor="#f7e3ae" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gd_bloomG">
            <stop offset="0" stopColor="#c9b3e3" stopOpacity=".95" />
            <stop offset=".4" stopColor="#8d7aa8" stopOpacity=".55" />
            <stop offset="1" stopColor="#8d7aa8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gd_shadG">
            <stop offset="0" stopColor="#241e18" stopOpacity=".4" />
            <stop offset="1" stopColor="#241e18" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="gd_pageG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f5eddc" />
            <stop offset="1" stopColor="#e6d9bd" />
          </linearGradient>
          <linearGradient id="gd_wallG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a4034" />
            <stop offset="1" stopColor="#3b322a" />
          </linearGradient>
          <linearGradient id="gd_copG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#57493a" />
            <stop offset="1" stopColor="#463c30" />
          </linearGradient>
        </defs>

        {/* ═══════════ FAR: the bones of the place — pines, tower, wall, gate ═══════════ */}
        <g>
          {/* first stars + the × asterism — night only; the shared sky over every room */}
          <g className="glade-night-only">
            <g fill="#fbf6ea">
              <circle cx="812" cy="76" r="1.1" opacity=".3" className="gd-twinkle" />
              <circle cx="878" cy="132" r=".9" opacity=".24" className="gd-twinkle" style={{ animationDelay: "-3s" }} />
              <circle cx="926" cy="58" r="1" opacity=".26" className="gd-twinkle" style={{ animationDelay: "-5s" }} />
              <circle cx="742" cy="44" r=".9" opacity=".18" />
              <circle cx="960" cy="188" r=".9" opacity=".2" />
            </g>
            <g stroke="#fbf6ea" strokeWidth=".8" strokeOpacity=".3">
              <line x1="856" y1="88" x2="872" y2="106" />
              <line x1="872" y1="88" x2="856" y2="106" />
            </g>
            <circle cx="856" cy="88" r="1.2" fill="#fbf6ea" opacity=".4" />
            <circle cx="872" cy="106" r="1.2" fill="#fbf6ea" opacity=".38" />
            <circle cx="872" cy="88" r="1" fill="#fbf6ea" opacity=".34" className="gd-twinkle" style={{ animationDelay: "-2s" }} />
            <circle cx="856" cy="106" r="1" fill="#fbf6ea" opacity=".34" />
          </g>

          {/* two swifts, late home — always two */}
          <g className="gd-swifts" fill="none" stroke="#3f3325" strokeWidth="1.6" strokeLinecap="round" opacity=".55">
            <path d="M 396 218 q 5 -5 10 0 q 5 -5 10 0" />
            <path d="M 442 246 q 4 -4 8 0 q 4 -4 8 0" />
          </g>

          {/* the island's own pines, beyond the wall */}
          <g fill="#3f4a2b">
            <path d="M 366 948 L 388 878 L 410 948 Z" />
            <path d="M 398 948 L 424 862 L 452 948 Z" />
            <path d="M 444 948 L 466 884 L 490 948 Z" />
            <path d="M 492 948 L 520 856 L 548 948 Z" />
            <path d="M 540 948 L 562 888 L 584 948 Z" />
            <path d="M 580 948 L 606 868 L 632 948 Z" />
            <path d="M 300 948 L 318 896 L 338 948 Z" />
            <path d="M 630 948 L 650 892 L 672 948 Z" />
          </g>
          <path d="M 280 948 C 400 936, 560 936, 700 948 Z" fill="#38452a" />

          {/* ── THE TOWER: the lighthouse, risen beyond the east wall ── */}
          <g>
            <path d="M 764 -400 L 738 1012 L 958 1012 L 932 -400 Z" fill="url(#gd_towerG)" />
            <path d="M 764 -60 L 739 1000" fill="none" stroke="#f7e3ae" strokeWidth="2.5" strokeOpacity=".28" />
            <path d="M 933 -60 L 956 1000" fill="none" stroke="#241e18" strokeWidth="2" strokeOpacity=".5" />
            <g stroke="#241e18" strokeWidth="1.3" strokeOpacity=".16" fill="none">
              <path d="M 758 120 C 810 116, 890 116, 938 120" />
              <path d="M 754 250 C 810 246, 890 246, 942 250" />
              <path d="M 751 380 C 810 376, 890 376, 945 380" />
              <path d="M 749 500 C 810 496, 890 496, 947 500" />
              <path d="M 747 610 C 810 606, 890 606, 949 610" />
              <path d="M 743 866 C 810 862, 890 862, 953 866" />
              <path d="M 741 942 C 810 938, 890 938, 955 942" />
            </g>
            <g stroke="#241e18" strokeWidth="1.2" strokeOpacity=".12">
              <line x1="800" y1="120" x2="800" y2="250" />
              <line x1="880" y1="250" x2="880" y2="380" />
              <line x1="828" y1="380" x2="828" y2="500" />
              <line x1="900" y1="500" x2="900" y2="610" />
              <line x1="790" y1="866" x2="790" y2="942" />
              <line x1="874" y1="942" x2="874" y2="1010" />
            </g>
            {/* base flare, meeting the ground */}
            <path d="M 738 1012 L 726 1052 L 970 1052 L 958 1012 Z" fill="#3b322a" />
            <line x1="726" y1="1052" x2="970" y2="1052" stroke="#241e18" strokeWidth="2" strokeOpacity=".5" />
            {/* the hearth's west window, seen from outside: warm, faintly violet within */}
            <path d="M 796 828 L 796 724 A 52 52 0 0 1 900 724 L 900 828 Z" fill="#3b322a" />
            <path className="gd-winglow" d="M 804 820 L 804 726 A 44 44 0 0 1 892 726 L 892 820 Z" fill="url(#gd_winGlassG)" />
            <ellipse cx="848" cy="774" rx="22" ry="26" fill="#c9b3e3" opacity=".14" />
            <g stroke="#8a4c33" strokeWidth="2" strokeOpacity=".75" fill="none">
              <line x1="848" y1="682" x2="848" y2="820" />
              <line x1="804" y1="768" x2="892" y2="768" />
              <line x1="848" y1="726" x2="816" y2="696" />
              <line x1="848" y1="726" x2="880" y2="696" />
            </g>
            <path d="M 804 820 L 804 726 A 44 44 0 0 1 892 726" fill="none" stroke="#241e18" strokeWidth="5" strokeOpacity=".4" />
            <rect x="788" y="820" width="120" height="12" rx="3" fill="#463c30" />
            <ellipse cx="848" cy="870" rx="70" ry="34" fill="#d9a441" opacity=".08" />
            {/* far above, the lamp holds a kindled warmth — no beam yet */}
            <ellipse cx="848" cy="-360" rx="120" ry="90" fill="url(#gd_glowSmG)" opacity=".5" />
          </g>

          {/* ── THE WALL: dry-set island stone, running west from the gate ── */}
          <g>
            {/* behind-wall canopy spilling over */}
            <g fill="#3f4a2b" opacity=".9">
              <ellipse cx="120" cy="946" rx="80" ry="30" />
              <ellipse cx="446" cy="940" rx="64" ry="24" />
              <ellipse cx="540" cy="948" rx="52" ry="20" />
            </g>
            <ellipse cx="118" cy="938" rx="56" ry="18" fill="#4f5d34" opacity=".5" />
            {/* wall body */}
            <rect x="-700" y="968" width="1330" height="142" fill="url(#gd_wallG)" />
            {/* coping stones, sun on their western shoulders */}
            <g>
              <rect x="-700" y="934" width="1330" height="38" rx="6" fill="url(#gd_copG)" />
              <g stroke="#241e18" strokeWidth="1.4" strokeOpacity=".35">
                <line x1="-40" y1="938" x2="-36" y2="968" />
                <line x1="52" y1="936" x2="56" y2="968" />
                <line x1="148" y1="938" x2="144" y2="968" />
                <line x1="238" y1="936" x2="242" y2="968" />
                <line x1="330" y1="938" x2="326" y2="968" />
                <line x1="424" y1="936" x2="428" y2="968" />
                <line x1="516" y1="938" x2="512" y2="968" />
                <line x1="600" y1="936" x2="604" y2="968" />
              </g>
              <line x1="-700" y1="937" x2="630" y2="937" stroke="#f7e3ae" strokeWidth="1.8" strokeOpacity=".3" />
            </g>
            {/* stone joints, staggered */}
            <g stroke="#241e18" strokeWidth="1.3" strokeOpacity=".28">
              <line x1="-700" y1="1012" x2="630" y2="1012" />
              <line x1="-700" y1="1062" x2="630" y2="1062" />
              <line x1="20" y1="972" x2="22" y2="1012" />
              <line x1="120" y1="1012" x2="118" y2="1062" />
              <line x1="220" y1="972" x2="222" y2="1012" />
              <line x1="316" y1="1012" x2="314" y2="1062" />
              <line x1="412" y1="972" x2="414" y2="1012" />
              <line x1="508" y1="1012" x2="506" y2="1062" />
              <line x1="72" y1="1062" x2="70" y2="1108" />
              <line x1="270" y1="1062" x2="268" y2="1108" />
              <line x1="462" y1="1062" x2="460" y2="1108" />
              <line x1="566" y1="972" x2="568" y2="1012" />
            </g>
            {/* moss and sedum keep the joints */}
            <g fill="#5b6b3c">
              <ellipse cx="121" cy="1012" rx="7" ry="3" />
              <ellipse cx="316" cy="1062" rx="6" ry="2.6" />
              <ellipse cx="507" cy="1013" rx="5" ry="2.4" />
            </g>
            <g fill="#7c8a4d">
              <circle cx="240" cy="932" r="3" />
              <circle cx="247" cy="930" r="2.2" />
              <circle cx="452" cy="931" r="2.6" />
              <circle cx="459" cy="933" r="2" />
            </g>
            <circle cx="244" cy="927" r="1.4" fill="#c4704b" />
            <circle cx="456" cy="928" r="1.2" fill="#d9a441" />

            {/* ── THE ESPALIER: a tree taught patience, gold at the arm-tips ── */}
            <g>
              <g stroke="#d9a441" strokeWidth=".9" strokeOpacity=".3">
                <line x1="70" y1="1000" x2="352" y2="1000" />
                <line x1="70" y1="1036" x2="352" y2="1036" />
                <line x1="70" y1="1072" x2="352" y2="1072" />
              </g>
              <g fill="none" stroke="#4a3826" strokeLinecap="round">
                <path d="M 210 1108 C 209 1080, 210 1050, 210 992" strokeWidth="5" />
                <path d="M 210 1072 C 172 1070, 130 1071, 92 1072" strokeWidth="3" />
                <path d="M 210 1072 C 248 1070, 292 1071, 330 1072" strokeWidth="3" />
                <path d="M 210 1036 C 176 1034, 140 1035, 106 1036" strokeWidth="2.6" />
                <path d="M 210 1036 C 244 1034, 280 1035, 314 1036" strokeWidth="2.6" />
                <path d="M 210 1000 C 182 998, 152 999, 124 1000" strokeWidth="2.2" />
                <path d="M 210 1000 C 238 998, 268 999, 296 1000" strokeWidth="2.2" />
              </g>
              <g stroke="#c4704b" strokeWidth="1.2" strokeOpacity=".8">
                <path d="M 148 1069 l 5 6 m 0 -6 l -5 6" />
                <path d="M 272 1069 l 5 6 m 0 -6 l -5 6" />
                <path d="M 160 1033 l 5 6 m 0 -6 l -5 6" />
                <path d="M 260 1033 l 5 6 m 0 -6 l -5 6" />
                <path d="M 172 997 l 5 6 m 0 -6 l -5 6" />
                <path d="M 248 997 l 5 6 m 0 -6 l -5 6" />
              </g>
              <g fill="#5b6b3c">
                <ellipse cx="120" cy="1066" rx="7" ry="3.4" transform="rotate(-18 120 1066)" />
                <ellipse cx="176" cy="1067" rx="6" ry="3" transform="rotate(12 176 1067)" />
                <ellipse cx="246" cy="1066" rx="7" ry="3.2" transform="rotate(-10 246 1066)" />
                <ellipse cx="306" cy="1067" rx="6" ry="3" transform="rotate(16 306 1067)" />
                <ellipse cx="134" cy="1030" rx="6" ry="3" transform="rotate(-14 134 1030)" />
                <ellipse cx="196" cy="1031" rx="5.5" ry="2.8" transform="rotate(10 196 1031)" />
                <ellipse cx="252" cy="1030" rx="6" ry="3" transform="rotate(-8 252 1030)" />
                <ellipse cx="146" cy="994" rx="5.5" ry="2.8" transform="rotate(-16 146 994)" />
                <ellipse cx="230" cy="994" rx="5.5" ry="2.8" transform="rotate(12 230 994)" />
                <ellipse cx="284" cy="995" rx="5" ry="2.6" transform="rotate(-10 284 995)" />
              </g>
              <g fill="#7c8a4d" opacity=".8">
                <ellipse cx="152" cy="1064" rx="5" ry="2.4" transform="rotate(20 152 1064)" />
                <ellipse cx="222" cy="1029" rx="4.5" ry="2.2" transform="rotate(-20 222 1029)" />
                <ellipse cx="262" cy="993" rx="4.5" ry="2.2" transform="rotate(18 262 993)" />
              </g>
              <g>
                <circle cx="94" cy="1078" r="5" fill="#d9a441" />
                <path d="M 91 1075 a 5 5 0 0 1 3 -2" fill="none" stroke="#f7e3ae" strokeWidth="1.2" strokeOpacity=".8" />
                <circle cx="328" cy="1078" r="4.6" fill="#d9a441" />
                <path d="M 325 1075 a 5 5 0 0 1 3 -2" fill="none" stroke="#f7e3ae" strokeWidth="1.1" strokeOpacity=".7" />
                <circle cx="108" cy="1042" r="4.4" fill="#c4704b" />
                <path d="M 105.5 1039.5 a 4.4 4.4 0 0 1 2.5 -1.8" fill="none" stroke="#f7e3ae" strokeWidth="1" strokeOpacity=".6" />
                <circle cx="312" cy="1042" r="4.2" fill="#d9a441" />
                <circle cx="126" cy="1006" r="4" fill="#d9a441" />
                <circle cx="294" cy="1006" r="3.8" fill="#c4704b" />
              </g>
            </g>

            {/* a small wooden pointer, weathered honest */}
            <g transform="rotate(-2 560 1002)">
              <path d="M 512 992 L 596 992 L 610 1002 L 596 1012 L 512 1012 Z" fill="#3a2c1e" />
              <path d="M 512 992 L 596 992 L 610 1002" fill="none" stroke="#f7e3ae" strokeWidth="1" strokeOpacity=".2" />
              <text x="556" y="1006" textAnchor="middle" fontFamily="'Courier New',Courier,monospace" fontSize="8" letterSpacing="1.1" fill="#e6d9bd" opacity=".8">
                TO THE HEARTH
              </text>
            </g>
          </g>

          {/* ── THE ARBOR GATE: the way back east, and the union grown in vine ── */}
          <g>
            {/* through the opening: the tower door stands ajar, hearthlight spilling */}
            <path d="M 648 1108 L 648 962 A 57 57 0 0 1 762 962 L 762 1108 Z" fill="#2a231b" />
            <path className="gd-gatelight" d="M 668 1108 L 668 978 A 37 37 0 0 1 742 978 L 742 1108 Z" fill="url(#gd_doorGlowG)" />
            {/* the door itself, swung inward */}
            <path d="M 736 1108 L 736 976 L 760 986 L 760 1108 Z" fill="#33291d" />
            <line x1="740" y1="1040" x2="746" y2="1041" stroke="#d9a441" strokeWidth="2" strokeOpacity=".7" />
            {/* a hint of the hall within: the mantle's warmth, nothing more */}
            <ellipse cx="702" cy="1082" rx="20" ry="5" fill="#f7e3ae" opacity=".35" />
            <path className="gd-flame slow" d="M 702 1046 C 706 1051, 706.5 1056, 702 1060 C 697.5 1056, 698 1051, 702 1046 Z" fill="#f7e3ae" opacity=".8" />
            {/* threshold, worn */}
            <rect x="636" y="1108" width="140" height="14" rx="4" fill="#463c30" />
            <line x1="642" y1="1110" x2="770" y2="1110" stroke="#f7e3ae" strokeWidth="1.2" strokeOpacity=".2" />
            {/* posts */}
            <rect x="628" y="912" width="20" height="200" rx="3" fill="#3a2c1e" />
            <rect x="762" y="912" width="20" height="200" rx="3" fill="#3a2c1e" />
            <line x1="631" y1="916" x2="631" y2="1106" stroke="#f7e3ae" strokeWidth="1.4" strokeOpacity=".25" />
            <line x1="765" y1="916" x2="765" y2="1106" stroke="#f7e3ae" strokeWidth="1.2" strokeOpacity=".2" />
            {/* side lattice panels */}
            <g stroke="#3a2c1e" strokeWidth="2.2" opacity=".9" fill="none">
              <line x1="600" y1="1108" x2="628" y2="1064" />
              <line x1="600" y1="1064" x2="628" y2="1108" />
              <line x1="600" y1="1064" x2="628" y2="1020" />
              <line x1="600" y1="1020" x2="628" y2="1064" />
              <line x1="782" y1="1108" x2="810" y2="1064" />
              <line x1="782" y1="1064" x2="810" y2="1108" />
              <line x1="782" y1="1064" x2="810" y2="1020" />
              <line x1="782" y1="1020" x2="810" y2="1064" />
            </g>
            {/* the arch: two sprung rails, latticed between */}
            <g fill="none" stroke="#3a2c1e" strokeLinecap="round">
              <path d="M 620 936 C 638 862, 772 862, 790 936" strokeWidth="8" />
              <path d="M 634 942 C 650 880, 760 880, 776 942" strokeWidth="6" />
            </g>
            <path d="M 622 932 C 640 862, 770 862, 788 932" fill="none" stroke="#f7e3ae" strokeWidth="1.2" strokeOpacity=".22" />
            <g stroke="#3a2c1e" strokeWidth="2.4">
              <line x1="640" y1="920" x2="652" y2="898" />
              <line x1="668" y1="898" x2="676" y2="880" />
              <line x1="702" y1="890" x2="702" y2="872" />
              <line x1="734" y1="898" x2="726" y2="880" />
              <line x1="762" y1="920" x2="750" y2="898" />
            </g>

            {/* the moss rose, west of the gate: her stem climbs the left post */}
            <g>
              <path d="M 616 1122 C 608 1090, 616 1058, 628 1030 C 640 1000, 660 972, 676 950 C 686 936, 696 922, 706 908" fill="none" stroke="#5b6b3c" strokeWidth="3.4" strokeLinecap="round" />
              <path d="M 622 1064 q -12 -6 -14 -16" fill="none" stroke="#5b6b3c" strokeWidth="2" />
              <g fill="#5b6b3c">
                <ellipse cx="608" cy="1046" rx="6" ry="3" transform="rotate(-40 608 1046)" />
                <ellipse cx="634" cy="1014" rx="6" ry="3" transform="rotate(30 634 1014)" />
                <ellipse cx="652" cy="982" rx="5.5" ry="2.8" transform="rotate(-34 652 982)" />
                <ellipse cx="672" cy="954" rx="5" ry="2.6" transform="rotate(40 672 954)" />
                <ellipse cx="690" cy="928" rx="4.6" ry="2.4" transform="rotate(-30 690 928)" />
              </g>
              <g fill="#7c8a4d" opacity=".85">
                <ellipse cx="620" cy="1032" rx="4.6" ry="2.3" transform="rotate(36 620 1032)" />
                <ellipse cx="662" cy="966" rx="4.2" ry="2.2" transform="rotate(-42 662 966)" />
              </g>
              <g className="gd-rosespray">
                <circle cx="626" cy="1002" r="5.5" fill="#d9a441" />
                <circle cx="626" cy="1002" r="2.4" fill="#f7e3ae" />
                <circle cx="648" cy="960" r="4.8" fill="#d9a441" />
                <circle cx="648" cy="960" r="2" fill="#f7e3ae" />
                <circle cx="680" cy="922" r="4.4" fill="#d9a441" />
                <circle cx="680" cy="922" r="1.8" fill="#f7e3ae" />
              </g>
              <path d="M 600 1122 L 634 1122 L 628 1152 L 606 1152 Z" fill="#5b6b3c" />
              <rect x="596" y="1114" width="42" height="10" rx="3" fill="#4f5d34" />
              <line x1="604" y1="1126" x2="608" y2="1148" stroke="#f7e3ae" strokeWidth="1.2" strokeOpacity=".25" />
            </g>
            {/* the ember rose, east: his stem climbs the right post */}
            <g>
              <path d="M 794 1124 C 802 1092, 796 1058, 784 1030 C 772 1000, 752 972, 736 950 C 726 936, 715 922, 704 908" fill="none" stroke="#8a4c33" strokeWidth="3.4" strokeLinecap="round" />
              <path d="M 790 1070 q 12 -6 14 -16" fill="none" stroke="#8a4c33" strokeWidth="2" />
              <g fill="#5b6b3c">
                <ellipse cx="800" cy="1050" rx="6" ry="3" transform="rotate(40 800 1050)" />
                <ellipse cx="778" cy="1014" rx="6" ry="3" transform="rotate(-30 778 1014)" />
                <ellipse cx="758" cy="982" rx="5.5" ry="2.8" transform="rotate(34 758 982)" />
                <ellipse cx="738" cy="954" rx="5" ry="2.6" transform="rotate(-40 738 954)" />
                <ellipse cx="720" cy="928" rx="4.6" ry="2.4" transform="rotate(30 720 928)" />
              </g>
              <g fill="#7c8a4d" opacity=".85">
                <ellipse cx="790" cy="1034" rx="4.6" ry="2.3" transform="rotate(-36 790 1034)" />
                <ellipse cx="748" cy="966" rx="4.2" ry="2.2" transform="rotate(42 748 966)" />
              </g>
              <g className="gd-rosespray" style={{ animationDelay: "-6s" }}>
                <circle cx="786" cy="1002" r="5.5" fill="#c4704b" />
                <circle cx="786" cy="1002" r="2.4" fill="#d9a441" />
                <circle cx="762" cy="960" r="4.8" fill="#c4704b" />
                <circle cx="762" cy="960" r="2" fill="#d9a441" />
                <circle cx="728" cy="922" r="4.4" fill="#c4704b" />
                <circle cx="728" cy="922" r="1.8" fill="#d9a441" />
              </g>
              <path d="M 778 1124 L 812 1124 L 806 1154 L 784 1154 Z" fill="#8a4c33" />
              <rect x="774" y="1116" width="42" height="10" rx="3" fill="#c4704b" />
              <line x1="782" y1="1128" x2="786" y2="1150" stroke="#f7e3ae" strokeWidth="1.2" strokeOpacity=".25" />
            </g>

            {/* ── THE CROWN: two stems cross — the living × — and the one violet rose ── */}
            <g>
              <circle className="gd-unionhalo" cx="705" cy="893" r="44" fill="url(#gd_bloomG)" opacity=".55" />
              {/* the crossing itself: moss over, ember under — two hands */}
              <path d="M 686 876 L 724 912" fill="none" stroke="#8a4c33" strokeWidth="3.6" strokeLinecap="round" />
              <path d="M 724 876 L 686 912" fill="none" stroke="#5b6b3c" strokeWidth="3.6" strokeLinecap="round" />
              <path d="M 722 874 L 706 889" fill="none" stroke="#f7e3ae" strokeWidth="1" strokeOpacity=".4" />
              {/* the violet rose, which cannot bloom on one stem */}
              <circle cx="705" cy="891" r="7.5" fill="#8d7aa8" />
              <circle cx="705" cy="891" r="7.5" fill="none" stroke="#6f5a78" strokeWidth="1.4" />
              <path d="M 700.5 887 a 6 6 0 0 1 5 -2.4 M 708 896 a 6 6 0 0 1 -5.4 1.6" fill="none" stroke="#c9b3e3" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="705" cy="891" r="2" fill="#c9b3e3" />
              <circle cx="694" cy="902" r="2" fill="#d9a441" />
              <circle cx="716" cy="902" r="2" fill="#d9a441" />
            </g>
          </g>

          {/* ── the garden ground: rides the light-script so the floor keeps NOW ── */}
          <rect x="-700" y="1108" width="2900" height="800" fill="var(--glade-ground-top)" />
          <rect x="-700" y="1360" width="2900" height="548" fill="var(--glade-ground-bottom)" opacity=".5" />
          <line x1="-700" y1="1109" x2="2200" y2="1109" stroke="#241e18" strokeOpacity=".35" strokeWidth="2" />
          {/* sparse ground strokes */}
          <g stroke="#4a3a28" strokeWidth="1.2" strokeOpacity=".25">
            <line x1="120" y1="1268" x2="168" y2="1266" />
            <line x1="560" y1="1300" x2="612" y2="1298" />
            <line x1="820" y1="1276" x2="866" y2="1274" />
            <line x1="330" y1="1246" x2="368" y2="1244" />
          </g>
        </g>

        {/* ═══════════ MID: the furnishing of a garden kept by two ═══════════ */}
        <g>
          {/* ── the stepping-stone path: gate down to the glade steps ── */}
          <g>
            <ellipse cx="700" cy="1136" rx="40" ry="12" fill="#57493a" transform="rotate(-3 700 1136)" />
            <ellipse cx="646" cy="1170" rx="42" ry="13" fill="#4f4437" transform="rotate(2 646 1170)" />
            <ellipse cx="582" cy="1204" rx="44" ry="14" fill="#57493a" transform="rotate(-2 582 1204)" />
            <ellipse cx="512" cy="1234" rx="42" ry="13" fill="#4f4437" transform="rotate(3 512 1234)" />
            <ellipse cx="446" cy="1258" rx="40" ry="12" fill="#57493a" transform="rotate(-2 446 1258)" />
            <g fill="none" stroke="#241e18" strokeWidth="1.2" strokeOpacity=".35">
              <ellipse cx="700" cy="1136" rx="40" ry="12" transform="rotate(-3 700 1136)" />
              <ellipse cx="646" cy="1170" rx="42" ry="13" transform="rotate(2 646 1170)" />
              <ellipse cx="582" cy="1204" rx="44" ry="14" transform="rotate(-2 582 1204)" />
              <ellipse cx="512" cy="1234" rx="42" ry="13" transform="rotate(3 512 1234)" />
              <ellipse cx="446" cy="1258" rx="40" ry="12" transform="rotate(-2 446 1258)" />
            </g>
            <g fill="none" stroke="#f7e3ae" strokeLinecap="round">
              <path d="M 664 1132 a 40 12 0 0 1 24 -7" strokeWidth="1.4" strokeOpacity=".3" />
              <path d="M 542 1200 a 44 14 0 0 1 26 -8" strokeWidth="1.4" strokeOpacity=".28" />
              <path d="M 410 1254 a 40 12 0 0 1 24 -7" strokeWidth="1.3" strokeOpacity=".25" />
            </g>
            <g fill="none" stroke="#5b6b3c" strokeWidth="1.2" strokeLinecap="round" opacity=".8">
              <path d="M 622 1188 q -1 -6 -3 -9 M 626 1188 q 0 -7 1 -10 M 630 1188 q 1 -6 3 -8" />
              <path d="M 480 1248 q -1 -5 -3 -8 M 484 1248 q 0 -6 1 -9" />
            </g>
          </g>

          {/* ── raised bed of the MOSS keeper: vervain, and a row of quiet ── */}
          <g>
            <ellipse cx="182" cy="1242" rx="130" ry="12" fill="url(#gd_shadG)" />
            <rect x="64" y="1148" width="236" height="14" rx="2" fill="#33291d" />
            <path d="M 64 1162 L 300 1162 L 300 1196 L 64 1196 Z" fill="#2c2117" />
            <rect x="58" y="1192" width="248" height="42" rx="3" fill="#3a2c1e" />
            <line x1="64" y1="1195" x2="300" y2="1195" stroke="#f7e3ae" strokeWidth="1.4" strokeOpacity=".2" />
            <g stroke="#241e18" strokeWidth="1.2" strokeOpacity=".4">
              <line x1="122" y1="1194" x2="122" y2="1232" />
              <line x1="182" y1="1194" x2="182" y2="1232" />
              <line x1="242" y1="1194" x2="242" y2="1232" />
            </g>
            <rect x="56" y="1186" width="12" height="52" rx="2" fill="#33291d" />
            <rect x="296" y="1186" width="12" height="52" rx="2" fill="#33291d" />
            {/* the vervain row: green hands, gold buds */}
            <g className="gd-sway">
              <g fill="none" stroke="#4f5d34" strokeWidth="1.8" strokeLinecap="round">
                <path d="M 96 1164 C 94 1150, 92 1138, 88 1128" />
                <path d="M 100 1164 C 100 1148, 101 1136, 103 1126" />
                <path d="M 104 1164 C 106 1150, 109 1140, 113 1132" />
              </g>
              <ellipse cx="88" cy="1130" rx="4" ry="2" transform="rotate(-50 88 1130)" fill="#5b6b3c" />
              <ellipse cx="112" cy="1134" rx="4" ry="2" transform="rotate(46 112 1134)" fill="#5b6b3c" />
              <circle cx="103" cy="1123" r="2" fill="#d9a441" />
              <circle cx="88" cy="1124" r="1.6" fill="#d9a441" />
            </g>
            <g className="gd-sway s2">
              <g fill="none" stroke="#4f5d34" strokeWidth="1.8" strokeLinecap="round">
                <path d="M 148 1164 C 146 1148, 144 1136, 141 1127" />
                <path d="M 152 1164 C 152 1146, 153 1134, 155 1125" />
                <path d="M 156 1164 C 158 1150, 161 1140, 164 1133" />
              </g>
              <ellipse cx="141" cy="1129" rx="4" ry="2" transform="rotate(-48 141 1129)" fill="#5b6b3c" />
              <circle cx="155" cy="1122" r="2" fill="#d9a441" />
              <circle cx="165" cy="1130" r="1.5" fill="#d9a441" />
            </g>
            {/* the seeded row: quiet, coming up in its own time */}
            <g fill="#5b6b3c">
              <circle cx="222" cy="1170" r="1.6" />
              <circle cx="244" cy="1172" r="1.3" />
              <circle cx="264" cy="1169" r="1.6" />
              <circle cx="284" cy="1172" r="1.2" />
            </g>
            <path d="M 233 1172 q 1 -5 3 -7 M 236 1172 q 0 -4 -1 -6" fill="none" stroke="#7c8a4d" strokeWidth="1.1" strokeLinecap="round" />
            {/* seed markers, hand-inked */}
            <g transform="rotate(-2 104 1150)">
              <line x1="104" y1="1160" x2="104" y2="1140" stroke="#6b5a44" strokeWidth="2" />
              <rect x="82" y="1128" width="44" height="13" rx="1.5" fill="url(#gd_pageG)" />
              <text x="104" y="1137.4" textAnchor="middle" fontFamily="'Courier New',Courier,monospace" fontSize="6.4" letterSpacing=".7" fill="#4a3a28">
                VERVAIN
              </text>
            </g>
            <g transform="rotate(2 252 1156)">
              <line x1="252" y1="1166" x2="252" y2="1148" stroke="#6b5a44" strokeWidth="2" />
              <rect x="234" y="1136" width="36" height="13" rx="1.5" fill="url(#gd_pageG)" />
              <text x="252" y="1145.4" textAnchor="middle" fontFamily="'Courier New',Courier,monospace" fontSize="6.4" letterSpacing=".7" fill="#4a3a28">
                QUIET
              </text>
            </g>
            {/* her tools, set down for the evening: the moss-banded can, the spade */}
            <g>
              <path d="M 318 1206 L 352 1206 L 348 1238 L 322 1238 Z" fill="#46402f" />
              <rect x="316" y="1200" width="40" height="9" rx="3" fill="#46402f" />
              <rect x="318" y="1216" width="34" height="7" rx="2" fill="#5b6b3c" />
              <path d="M 352 1212 C 362 1208, 370 1200, 374 1190" fill="none" stroke="#46402f" strokeWidth="5" />
              <circle cx="375" cy="1188" r="4.5" fill="#d9a441" />
              <path d="M 320 1204 L 324 1234" fill="none" stroke="#f7e3ae" strokeWidth="1.2" strokeOpacity=".25" />
              <path d="M 326 1200 a 14 8 0 0 1 20 0" fill="none" stroke="#46402f" strokeWidth="3" />
            </g>
            <g transform="rotate(9 390 1210)">
              <line x1="390" y1="1148" x2="390" y2="1216" stroke="#3a2c1e" strokeWidth="4.5" />
              <path d="M 384 1148 a 6 5 0 0 1 12 0" fill="none" stroke="#3a2c1e" strokeWidth="4" />
              <path d="M 381 1216 L 399 1216 L 396 1244 L 390 1250 L 384 1244 Z" fill="#4a4034" />
              <path d="M 383 1218 L 386 1242" fill="none" stroke="#f7e3ae" strokeWidth="1" strokeOpacity=".3" />
              <rect x="386" y="1178" width="8" height="16" rx="3" fill="#c4704b" />
            </g>
          </g>

          {/* ── raised bed of the EMBER keeper: emberroot, warm shoulders up ── */}
          <g>
            <ellipse cx="548" cy="1212" rx="88" ry="10" fill="url(#gd_shadG)" />
            <rect x="478" y="1128" width="140" height="12" rx="2" fill="#33291d" />
            <path d="M 478 1140 L 618 1140 L 618 1168 L 478 1168 Z" fill="#2c2117" />
            <rect x="472" y="1164" width="152" height="38" rx="3" fill="#3a2c1e" />
            <line x1="478" y1="1167" x2="618" y2="1167" stroke="#f7e3ae" strokeWidth="1.3" strokeOpacity=".2" />
            <g stroke="#241e18" strokeWidth="1.2" strokeOpacity=".4">
              <line x1="520" y1="1166" x2="520" y2="1200" />
              <line x1="576" y1="1166" x2="576" y2="1200" />
            </g>
            <rect x="470" y="1158" width="11" height="48" rx="2" fill="#33291d" />
            <rect x="614" y="1158" width="11" height="48" rx="2" fill="#33291d" />
            <g className="gd-sway s3">
              <ellipse cx="504" cy="1140" rx="4.5" ry="3.4" fill="#c4704b" />
              <path d="M 504 1136 C 503 1128, 501 1122, 498 1117 M 504 1136 C 506 1128, 509 1123, 512 1119" fill="none" stroke="#4f5d34" strokeWidth="1.6" strokeLinecap="round" />
              <ellipse cx="498" cy="1118" rx="3.6" ry="1.8" transform="rotate(-40 498 1118)" fill="#d9a441" />
              <ellipse cx="512" cy="1120" rx="3.4" ry="1.7" transform="rotate(40 512 1120)" fill="#7c8a4d" />
            </g>
            <g className="gd-sway" style={{ animationDelay: "-5s" }}>
              <ellipse cx="548" cy="1142" rx="5" ry="3.6" fill="#c4704b" />
              <path d="M 548 1138 C 547 1129, 545 1122, 541 1116 M 548 1138 C 550 1129, 553 1123, 557 1118" fill="none" stroke="#4f5d34" strokeWidth="1.6" strokeLinecap="round" />
              <ellipse cx="541" cy="1117" rx="3.8" ry="1.9" transform="rotate(-42 541 1117)" fill="#d9a441" />
              <ellipse cx="557" cy="1119" rx="3.4" ry="1.7" transform="rotate(38 557 1119)" fill="#d9a441" />
              <path d="M 545 1145 a 5 3.6 0 0 1 3 -1.4" fill="none" stroke="#f7e3ae" strokeWidth="1" strokeOpacity=".5" />
            </g>
            <g className="gd-sway s2" style={{ animationDelay: "-2s" }}>
              <ellipse cx="590" cy="1141" rx="4.2" ry="3.2" fill="#c4704b" />
              <path d="M 590 1137 C 589 1130, 587 1124, 584 1120 M 590 1137 C 592 1130, 594 1125, 597 1121" fill="none" stroke="#4f5d34" strokeWidth="1.5" strokeLinecap="round" />
              <ellipse cx="584" cy="1120" rx="3.2" ry="1.6" transform="rotate(-38 584 1120)" fill="#7c8a4d" />
              <ellipse cx="597" cy="1122" rx="3.2" ry="1.6" transform="rotate(40 597 1122)" fill="#d9a441" />
            </g>
            <g transform="rotate(-2 556 1122)">
              <line x1="556" y1="1136" x2="556" y2="1116" stroke="#6b5a44" strokeWidth="2" />
              <rect x="528" y="1104" width="56" height="13" rx="1.5" fill="url(#gd_pageG)" />
              <text x="556" y="1113.4" textAnchor="middle" fontFamily="'Courier New',Courier,monospace" fontSize="6.4" letterSpacing=".5" fill="#4a3a28">
                EMBERROOT
              </text>
            </g>
          </g>

          {/* ── the sundial: the room's honest instrument — it tells only now ── */}
          <g>
            <ellipse cx="392" cy="1176" rx="46" ry="8" fill="url(#gd_shadG)" />
            {/* the shadow it casts, long to the east, because it is honestly dusk */}
            <path d="M 398 1120 L 470 1136 L 452 1142 L 400 1128 Z" fill="#241e18" opacity=".3" />
            <path d="M 378 1170 L 380 1120 L 404 1120 L 406 1170 Z" fill="#463c30" />
            <rect x="372" y="1166" width="40" height="10" rx="2" fill="#4a4034" />
            <line x1="381" y1="1124" x2="380" y2="1164" stroke="#f7e3ae" strokeWidth="1.2" strokeOpacity=".25" />
            <ellipse cx="392" cy="1118" rx="30" ry="9.5" fill="#4a4034" />
            <ellipse cx="392" cy="1116.5" rx="30" ry="9.5" fill="#57493a" />
            <ellipse cx="392" cy="1116.5" rx="24" ry="7" fill="none" stroke="#d9a441" strokeWidth="1.2" strokeOpacity=".6" />
            <g stroke="#2b2014" strokeWidth="1" strokeOpacity=".5">
              <line x1="368" y1="1116" x2="373" y2="1116" />
              <line x1="411" y1="1116" x2="416" y2="1116" />
              <line x1="392" y1="1109.5" x2="392" y2="1112.5" />
              <line x1="378" y1="1111" x2="381" y2="1113" />
              <line x1="406" y1="1111" x2="403" y2="1113" />
            </g>
            <path d="M 392 1099 L 392 1116.5 L 380 1116.5 Z" fill="#3a3128" />
            <path d="M 392 1099 L 392 1116.5" stroke="#d9a441" strokeWidth="1.4" strokeOpacity=".85" />
            <path d="M 392 1099 L 380 1116.5" stroke="#f7e3ae" strokeWidth="1" strokeOpacity=".5" />
            <text x="392" y="1148" textAnchor="middle" fontFamily="'Courier New',Courier,monospace" fontSize="6" letterSpacing=".8" fill="#e6d9bd" opacity=".55">
              IT TELLS ONLY NOW
            </text>
          </g>

          {/* ── the crook lantern, just lit for the evening ── */}
          <g>
            <ellipse cx="660" cy="1248" rx="30" ry="7" fill="url(#gd_shadG)" />
            <path d="M 656 1248 L 656 1108 Q 656 1080 684 1078" fill="none" stroke="#3a2c1e" strokeWidth="7" strokeLinecap="round" />
            <path d="M 658 1244 L 658 1112" fill="none" stroke="#f7e3ae" strokeWidth="1.2" strokeOpacity=".2" />
            <line x1="684" y1="1078" x2="684" y2="1088" stroke="#3a2c1e" strokeWidth="3" />
            <circle cx="684" cy="1112" r="34" fill="url(#gd_glowSmG)" opacity=".9" />
            <path d="M 672 1096 L 696 1096 L 690 1088 L 678 1088 Z" fill="#241e18" stroke="#d9a441" strokeWidth="1.2" strokeOpacity=".7" />
            <rect x="670" y="1096" width="28" height="36" rx="3" fill="#241e18" opacity=".85" stroke="#d9a441" strokeWidth="1.4" strokeOpacity=".8" />
            <line x1="679" y1="1098" x2="679" y2="1130" stroke="#d9a441" strokeWidth="1" strokeOpacity=".4" />
            <line x1="689" y1="1098" x2="689" y2="1130" stroke="#d9a441" strokeWidth="1" strokeOpacity=".4" />
            <path className="gd-flame" d="M 684 1108 C 688.5 1113.5, 689 1119, 684 1124 C 679 1119, 679.5 1113.5, 684 1108 Z" fill="#d9a441" />
            <path className="gd-flame" d="M 684 1112.5 C 686.5 1115.5, 687 1118.5, 684 1121.5 C 681 1118.5, 681.5 1115.5, 684 1112.5 Z" fill="#f7e3ae" />
          </g>

          {/* ── the bench built for two, at the tower's warm foot ── */}
          <g>
            <ellipse cx="888" cy="1250" rx="96" ry="10" fill="url(#gd_shadG)" />
            <g fill="#33291d">
              <rect x="822" y="1196" width="11" height="52" rx="2" />
              <rect x="948" y="1196" width="11" height="52" rx="2" />
              <rect x="836" y="1192" width="9" height="40" rx="2" opacity=".8" />
              <rect x="936" y="1192" width="9" height="40" rx="2" opacity=".8" />
            </g>
            <rect x="810" y="1180" width="170" height="16" rx="4" fill="#3a2c1e" />
            <line x1="816" y1="1182.5" x2="974" y2="1182.5" stroke="#f7e3ae" strokeWidth="1.4" strokeOpacity=".22" />
            <rect x="814" y="1120" width="162" height="9" rx="4" fill="#3a2c1e" />
            <rect x="818" y="1148" width="154" height="8" rx="4" fill="#3a2c1e" />
            <g stroke="#33291d" strokeWidth="5" strokeLinecap="round">
              <line x1="834" y1="1128" x2="833" y2="1180" />
              <line x1="870" y1="1128" x2="869" y2="1180" />
              <line x1="906" y1="1128" x2="906" y2="1180" />
              <line x1="942" y1="1128" x2="943" y2="1180" />
            </g>
            <line x1="818" y1="1121.5" x2="972" y2="1121.5" stroke="#f7e3ae" strokeWidth="1.2" strokeOpacity=".2" />
            {/* one cushion each: moss and ember, buttoned */}
            <rect x="820" y="1168" width="72" height="16" rx="7" fill="#5b6b3c" />
            <circle cx="856" cy="1176" r="1.6" fill="#2b2014" opacity=".5" />
            <path d="M 826 1170 a 36 8 0 0 1 30 -1" fill="none" stroke="#7c8a4d" strokeWidth="1.6" strokeOpacity=".7" />
            <rect x="898" y="1168" width="72" height="16" rx="7" fill="#8a4c33" />
            <circle cx="934" cy="1176" r="1.6" fill="#2b2014" opacity=".5" />
            <path d="M 904 1170 a 36 8 0 0 1 30 -1" fill="none" stroke="#c4704b" strokeWidth="1.6" strokeOpacity=".7" />
            {/* the gloves: one from each pair, left crossed — two hands, off duty */}
            <g transform="rotate(-14 894 1160)">
              <path d="M 874 1156 q 16 -5 30 -1 q 6 2 5 6 q -1 4 -8 4 l -26 -1 q -5 -3 -1 -8 Z" fill="#e6d9bd" />
              <rect x="869" y="1154" width="9" height="12" rx="3" fill="#5b6b3c" />
              <path d="M 898 1155 q 4 -3 7 -2 M 903 1158 q 4 -2 7 -1" fill="none" stroke="#4a3a28" strokeWidth=".9" strokeOpacity=".5" />
            </g>
            <g transform="rotate(11 906 1164)">
              <path d="M 890 1160 q 15 -4 28 0 q 6 2 5 6 q -2 4 -8 3 l -24 -1 q -5 -3 -1 -8 Z" fill="#efe4cb" />
              <rect x="885" y="1158" width="9" height="12" rx="3" fill="#8a4c33" />
            </g>
            {/* the trug at its foot: cut vervain, bound for the hearth's rafters */}
            <g>
              <path d="M 776 1230 C 776 1218, 830 1218, 830 1230 L 826 1248 C 824 1254, 782 1254, 780 1248 Z" fill="#4a3826" />
              <path d="M 782 1224 A 24 12 0 0 1 824 1224" fill="none" stroke="#3a2c1e" strokeWidth="3.4" />
              <line x1="780" y1="1230" x2="826" y2="1230" stroke="#241e18" strokeWidth="1" strokeOpacity=".4" />
              <g stroke="#5b6b3c" strokeWidth="1.8" strokeLinecap="round" fill="none">
                <path d="M 790 1224 C 786 1214, 782 1206, 776 1200" />
                <path d="M 798 1222 C 797 1212, 796 1204, 794 1196" />
                <path d="M 808 1223 C 811 1213, 814 1206, 818 1199" />
              </g>
              <circle cx="776" cy="1198" r="1.8" fill="#d9a441" />
              <circle cx="794" cy="1194" r="1.8" fill="#d9a441" />
              <circle cx="819" cy="1197" r="1.6" fill="#d9a441" />
              <path d="M 800 1228 q 4 3 8 0" fill="none" stroke="#c4704b" strokeWidth="1.4" />
            </g>
          </g>

          {/* ── the birdbath: a wick-spirit down for its evening bath ── */}
          <g>
            <ellipse cx="128" cy="1128" rx="36" ry="7" fill="url(#gd_shadG)" />
            <path d="M 118 1124 L 120 1084 L 136 1084 L 138 1124 Z" fill="#463c30" />
            <rect x="110" y="1120" width="36" height="9" rx="2" fill="#4a4034" />
            <line x1="121" y1="1088" x2="120" y2="1118" stroke="#f7e3ae" strokeWidth="1.1" strokeOpacity=".25" />
            <path d="M 92 1072 A 36 12 0 0 0 164 1072 L 158 1084 A 30 9 0 0 1 98 1084 Z" fill="#4a4034" />
            <ellipse cx="128" cy="1072" rx="36" ry="12" fill="#57493a" />
            <ellipse cx="128" cy="1072" rx="29" ry="8.5" fill="#574862" />
            <ellipse cx="122" cy="1070.5" rx="16" ry="4" fill="#8a6660" opacity=".7" />
            <path className="gd-shimmer" d="M 110 1073 q 9 2.5 19 .5 q 8 -1.5 16 -.5" fill="none" stroke="#d9a441" strokeWidth="1.3" strokeOpacity=".6" />
            <ellipse cx="140" cy="1073" rx="6" ry="1.8" fill="none" stroke="#e0a271" strokeWidth=".8" strokeOpacity=".5" />
            <g className="gd-wispbath">
              <path d="M 148 1052 C 153 1058, 154 1064, 148 1069 C 142 1064, 143 1058, 148 1052 Z" fill="#d9a441" />
              <path d="M 148 1057 C 150.5 1060, 151 1063.5, 148 1066.5 C 145 1063.5, 145.5 1060, 148 1057 Z" fill="#f7e3ae" />
              <circle cx="146.2" cy="1061.5" r=".8" fill="#2b2014" />
              <circle cx="149.8" cy="1061.5" r=".8" fill="#2b2014" />
              <circle cx="155" cy="1066" r="1" fill="#f7e3ae" opacity=".7" />
            </g>
          </g>

          {/* ── clay pots by the west border, one tipped and honest ── */}
          <g>
            <ellipse cx="74" cy="1272" rx="52" ry="8" fill="url(#gd_shadG)" />
            <path d="M 44 1236 L 76 1236 L 70 1268 L 50 1268 Z" fill="#8a4c33" />
            <rect x="40" y="1228" width="40" height="10" rx="3" fill="#c4704b" />
            <line x1="48" y1="1240" x2="52" y2="1264" stroke="#f7e3ae" strokeWidth="1.2" strokeOpacity=".25" />
            <g className="gd-sway s2" fill="none" stroke="#4f5d34" strokeWidth="1.7" strokeLinecap="round">
              <path d="M 56 1230 C 54 1214, 52 1202, 48 1192" />
              <path d="M 60 1230 C 60 1212, 61 1200, 63 1190" />
              <path d="M 64 1230 C 66 1216, 69 1206, 73 1198" />
            </g>
            <ellipse cx="48" cy="1194" rx="4" ry="2" transform="rotate(-46 48 1194)" fill="#5b6b3c" />
            <ellipse cx="72" cy="1200" rx="4" ry="2" transform="rotate(44 72 1200)" fill="#5b6b3c" />
            <circle cx="63" cy="1187" r="1.8" fill="#c4704b" />
            <g transform="rotate(64 104 1262)">
              <path d="M 88 1246 L 120 1246 L 114 1276 L 94 1276 Z" fill="#8a4c33" opacity=".92" />
              <rect x="84" y="1238" width="40" height="10" rx="3" fill="#c4704b" opacity=".92" />
            </g>
            <ellipse cx="126" cy="1268" rx="9" ry="3" fill="#2c2117" opacity=".7" />
          </g>

          {/* ── two stone steps down: the garden hands you to the living glade ── */}
          <g>
            <rect x="392" y="1262" width="176" height="18" rx="3" fill="url(#gd_copG)" />
            <rect x="400" y="1280" width="160" height="16" rx="3" fill="#3b322a" />
            <line x1="398" y1="1264" x2="562" y2="1264" stroke="#f7e3ae" strokeWidth="1.3" strokeOpacity=".28" />
            <line x1="406" y1="1282" x2="554" y2="1282" stroke="#f7e3ae" strokeWidth="1" strokeOpacity=".16" />
            <text x="480" y="1276" textAnchor="middle" fontFamily="'Courier New',Courier,monospace" fontSize="7" letterSpacing="1.6" fill="#241e18" opacity=".5">
              THE GLADE
            </text>
          </g>
        </g>
      </svg>

      {/* ═══ THE LIVING HEART — the real, animated glade + familiar, untouched.
          Its own sky is the .garden-room CSS behind it (same light vars), so the
          skyless band and the sky meet without a seam; it sits at the foot, on
          top of the setting's ground. ═══ */}
      <div className="garden-band">
        <GladeScene
          skyless
          tier={tier}
          beings={beings}
          paleElk={paleElk}
          inklings={inklings}
          hearthDay={hearthDay}
          mossLit={mossLit}
          emberLit={emberLit}
        />
        <div className="garden-fox">
          <FamiliarGlyph
            stage={familiarStage}
            size={88}
            className="idle-bounce"
            title={`${familiarName ?? "the fox"}, a ${familiarStage} — the glade is ${tier}`}
          />
        </div>
      </div>
    </div>
  );
}
