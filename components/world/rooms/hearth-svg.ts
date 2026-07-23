// AUTO-PORTED from art/proto/hearth-hall.html (Fable, 2026-07-22) — the feeling
// target for the Hearth Room. These are the room's bespoke hero SVG layers, kept
// as raw markup strings (the same pattern as components/sigil/glyphs.ts) so the
// port is byte-faithful and injected via dangerouslySetInnerHTML. Palette hexes
// are the committed warm-night world (BRAND-BIBLE §2 night table + the proto's
// stone/wood/firebox shades) — this room is one fixed theme, not data-light.
//
// Do not hand-edit — edit art/proto/hearth-hall.html and re-extract. The HEART
// layer (the seal + its emanation) is NOT here — it's authored as JSX in
// hearth-scene.tsx so it can wire the real composeSeal + the press bloom.

export const HEARTH_DEFS = `
<!-- grounds -->
  <linearGradient id="wallG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#332b22"/><stop offset=".55" stop-color="#3a3128"/><stop offset="1" stop-color="#2f2820"/>
  </linearGradient>
  <linearGradient id="floorG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2c251d"/><stop offset="1" stop-color="#241e18"/>
  </linearGradient>
  <!-- west: dusk garden -->
  <linearGradient id="skyW" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#6f5a78"/><stop offset=".62" stop-color="#574862"/><stop offset="1" stop-color="#453a54"/>
  </linearGradient>
  <!-- east: night sea -->
  <linearGradient id="skyE" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#382f47"/><stop offset="1" stop-color="#453a54"/>
  </linearGradient>
  <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2a2436"/><stop offset="1" stop-color="#241e18"/>
  </linearGradient>
  <!-- light -->
  <radialGradient id="haloG">
    <stop offset="0" stop-color="#c9b3e3" stop-opacity=".32"/>
    <stop offset=".45" stop-color="#c9b3e3" stop-opacity=".14"/>
    <stop offset=".72" stop-color="#d9a441" stop-opacity=".07"/>
    <stop offset="1" stop-color="#d9a441" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="coreG">
    <stop offset="0" stop-color="#c9b3e3" stop-opacity=".26"/>
    <stop offset="1" stop-color="#c9b3e3" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="bloomG">
    <stop offset="0" stop-color="#c9b3e3" stop-opacity=".95"/>
    <stop offset=".4" stop-color="#8d7aa8" stop-opacity=".55"/>
    <stop offset="1" stop-color="#8d7aa8" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="fireInG">
    <stop offset="0" stop-color="#f7e3ae" stop-opacity=".55"/>
    <stop offset=".55" stop-color="#c4704b" stop-opacity=".3"/>
    <stop offset="1" stop-color="#c4704b" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="spillG">
    <stop offset="0" stop-color="#f7e3ae" stop-opacity=".26"/>
    <stop offset=".55" stop-color="#c4704b" stop-opacity=".11"/>
    <stop offset="1" stop-color="#c4704b" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="glowSmG">
    <stop offset="0" stop-color="#f7e3ae" stop-opacity=".4"/>
    <stop offset="1" stop-color="#f7e3ae" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="stairG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#d9a441" stop-opacity=".42"/>
    <stop offset="1" stop-color="#d9a441" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="shaftDn" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#c9b3e3" stop-opacity=".11"/>
    <stop offset="1" stop-color="#c9b3e3" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="shaftUp" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#c9b3e3" stop-opacity=".07"/>
    <stop offset="1" stop-color="#c9b3e3" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="shadG">
    <stop offset="0" stop-color="#1e1913" stop-opacity=".55"/>
    <stop offset="1" stop-color="#1e1913" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="vignG" cx=".5" cy=".52" r=".72">
    <stop offset="0" stop-color="#241e18" stop-opacity="0"/>
    <stop offset=".58" stop-color="#241e18" stop-opacity="0"/>
    <stop offset=".82" stop-color="#241e18" stop-opacity=".5"/>
    <stop offset="1" stop-color="#241e18" stop-opacity=".93"/>
  </radialGradient>
  <linearGradient id="pageG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#f5eddc"/><stop offset="1" stop-color="#e6d9bd"/>
  </linearGradient>
  <clipPath id="clipW"><path d="M 138 570 L 138 300 A 87 87 0 0 1 312 300 L 312 570 Z"/></clipPath>
  <clipPath id="clipE"><path d="M 688 570 L 688 300 A 87 87 0 0 1 862 300 L 862 570 Z"/></clipPath>
  <line id="spk" x1="500" y1="552" x2="500" y2="498"/>
`;

export const HEARTH_FAR = `
<!-- wall + floor, drawn far past the frame so wide panels stay inside the room -->
  <rect x="-700" y="-400" width="2900" height="1612" fill="url(#wallG)"/>
  <rect x="-700" y="1210" width="2900" height="700" fill="url(#floorG)"/>
  <line x1="-700" y1="1211" x2="2200" y2="1211" stroke="#1e1913" stroke-opacity=".55" stroke-width="2.5"/>
  <!-- floorboards -->
  <g stroke="#1e1913" stroke-width="2" stroke-opacity=".42">
    <line x1="-700" y1="1252" x2="2200" y2="1252"/><line x1="-700" y1="1296" x2="2200" y2="1296"/>
    <line x1="-700" y1="1346" x2="2200" y2="1346"/><line x1="-700" y1="1404" x2="2200" y2="1404"/>
    <line x1="-700" y1="1472" x2="2200" y2="1472"/>
  </g>
  <g stroke="#1e1913" stroke-width="1.6" stroke-opacity=".26">
    <line x1="120" y1="1211" x2="116" y2="1252"/><line x1="420" y1="1252" x2="414" y2="1296"/>
    <line x1="806" y1="1211" x2="802" y2="1252"/><line x1="252" y1="1296" x2="246" y2="1346"/>
    <line x1="646" y1="1296" x2="640" y2="1346"/><line x1="940" y1="1346" x2="932" y2="1404"/>
    <line x1="60" y1="1346" x2="52" y2="1404"/><line x1="520" y1="1404" x2="510" y2="1472"/>
  </g>
  <ellipse cx="500" cy="1300" rx="430" ry="92" fill="#d9a441" opacity=".05"/>
  <!-- ceiling beams -->
  <rect x="-700" y="-80" width="2900" height="70" fill="#2e261d"/>
  <rect x="-700" y="40" width="2900" height="56" fill="#332a20"/>
  <line x1="-700" y1="96" x2="2200" y2="96" stroke="#1e1913" stroke-width="2.5" stroke-opacity=".7"/>
  <g stroke="#241e18" stroke-width="1" stroke-opacity=".35">
    <path d="M -700 58 C 100 54, 900 62, 2200 56" fill="none"/>
    <path d="M -700 78 C 200 82, 1100 74, 2200 80" fill="none"/>
  </g>
  <!-- sparse stone ticks on the wall -->
  <g stroke="#241e18" stroke-width="1.4" stroke-opacity=".14">
    <line x1="96" y1="806" x2="150" y2="806"/><line x1="176" y1="1050" x2="240" y2="1050"/>
    <line x1="700" y1="1010" x2="760" y2="1010"/><line x1="880" y1="1080" x2="950" y2="1080"/>
    <line x1="60" y1="640" x2="112" y2="640"/><line x1="890" y1="220" x2="952" y2="220"/>
    <line x1="70" y1="180" x2="126" y2="180"/><line x1="660" y1="660" x2="700" y2="660"/>
  </g>

  <!-- ── WEST WINDOW: the dusk garden, a hush ── -->
  <g>
    <path d="M 122 588 L 122 300 A 103 103 0 0 1 328 300 L 328 588 Z" fill="#463c30"/>
    <path d="M 122 588 L 122 300 A 103 103 0 0 1 328 300 L 328 588 Z" fill="none" stroke="#241e18" stroke-width="2" stroke-opacity=".6"/>
    <path d="M 138 570 L 138 300 A 87 87 0 0 1 312 300 L 312 570 Z" fill="url(#skyW)"/>
    <g clip-path="url(#clipW)">
      <path d="M 130 470 C 170 452, 210 460, 240 448 C 270 436, 300 446, 320 440 L 320 580 L 130 580 Z" fill="#453a54" opacity=".55"/>
      <path d="M 130 500 C 168 486, 206 492, 244 484 C 282 476, 306 484, 320 480 L 320 580 L 130 580 Z" fill="#3f4a2b"/>
      <path d="M 130 526 C 172 514, 220 522, 262 514 C 292 509, 310 514, 320 512 L 320 580 L 130 580 Z" fill="#38452a"/>
      <path d="M 196 508 C 190 468, 196 430, 204 404 C 212 430, 218 468, 212 508 Z" fill="#334026"/>
      <path d="M 258 520 C 250 492, 254 466, 262 448 C 270 466, 274 492, 268 520 Z" fill="#334026"/>
      <g fill="#f5eddc" opacity=".22">
        <ellipse cx="222" cy="548" rx="5" ry="2"/><ellipse cx="238" cy="558" rx="4" ry="1.8"/>
        <ellipse cx="252" cy="566" rx="5" ry="2"/>
      </g>
      <circle cx="176" cy="472" r="1.4" fill="#d9a441" opacity=".55"/>
      <circle cx="286" cy="452" r="1.2" fill="#d9a441" opacity=".45" class="twinkle" style="animation-delay:-3s"/>
      <circle cx="242" cy="500" r="1.1" fill="#d9a441" opacity=".4"/>
    </g>
    <!-- brass mullions catching the room light -->
    <g stroke="#d9a441" stroke-width="1.5" stroke-opacity=".42" fill="none">
      <line x1="225" y1="213" x2="225" y2="570"/><line x1="138" y1="424" x2="312" y2="424"/>
      <line x1="225" y1="300" x2="163" y2="240"/><line x1="225" y1="300" x2="287" y2="240"/>
    </g>
    <path d="M 138 570 L 138 300 A 87 87 0 0 1 312 300" fill="none" stroke="#1e1913" stroke-width="7" stroke-opacity=".3"/>
    <rect x="114" y="570" width="222" height="20" rx="3" fill="#4a4034"/>
    <line x1="118" y1="572" x2="332" y2="572" stroke="#f7e3ae" stroke-width="1.5" stroke-opacity=".18"/>
  </g>

  <!-- ── EAST WINDOW: the sea, the shared sky, the far gold shore ── -->
  <g>
    <path d="M 672 588 L 672 300 A 103 103 0 0 1 878 300 L 878 588 Z" fill="#463c30"/>
    <path d="M 672 588 L 672 300 A 103 103 0 0 1 878 300 L 878 588 Z" fill="none" stroke="#241e18" stroke-width="2" stroke-opacity=".6"/>
    <path d="M 688 570 L 688 300 A 87 87 0 0 1 862 300 L 862 570 Z" fill="url(#skyE)"/>
    <g clip-path="url(#clipE)">
      <!-- scattered faint stars -->
      <g fill="#fbf6ea">
        <circle cx="706" cy="238" r="1.1" opacity=".5"/><circle cx="726" cy="212" r=".9" opacity=".4"/>
        <circle cx="748" cy="196" r="1.3" opacity=".6"/><circle cx="796" cy="206" r="1" opacity=".45"/>
        <circle cx="842" cy="238" r="1.2" opacity=".55"/><circle cx="852" cy="316" r=".9" opacity=".4"/>
        <circle cx="700" cy="330" r="1" opacity=".42"/><circle cx="718" cy="392" r=".9" opacity=".35"/>
        <circle cx="838" cy="396" r="1" opacity=".4"/><circle cx="782" cy="176" r=".9" opacity=".4"/>
      </g>
      <!-- THE FERRY — the boat asterism the star-chart maps -->
      <g>
        <path d="M 730 295 L 755 305 L 785 302 L 808 288" fill="none" stroke="#fbf6ea" stroke-width=".8" stroke-opacity=".28"/>
        <line x1="770" y1="303" x2="770" y2="252" stroke="#fbf6ea" stroke-width=".8" stroke-opacity=".28"/>
        <circle cx="730" cy="295" r="1.7" fill="#fbf6ea" opacity=".8"/>
        <circle cx="755" cy="305" r="1.4" fill="#fbf6ea" opacity=".7"/>
        <circle cx="785" cy="302" r="1.6" fill="#fbf6ea" opacity=".75"/>
        <circle cx="808" cy="288" r="1.4" fill="#fbf6ea" opacity=".7"/>
        <circle cx="770" cy="252" r="2" fill="#fbf6ea" opacity=".9" class="twinkle" style="animation-delay:-2s"/>
      </g>
      <!-- the small × asterism: two hands crossing, written in the heavens -->
      <g stroke="#fbf6ea" stroke-width=".8" stroke-opacity=".25">
        <line x1="818" y1="212" x2="832" y2="228"/><line x1="832" y1="212" x2="818" y2="228"/>
      </g>
      <circle cx="818" cy="212" r="1.3" fill="#fbf6ea" opacity=".7"/>
      <circle cx="832" cy="228" r="1.3" fill="#fbf6ea" opacity=".65"/>
      <circle cx="832" cy="212" r="1.1" fill="#fbf6ea" opacity=".6" class="twinkle" style="animation-delay:-5s"/>
      <circle cx="818" cy="228" r="1.1" fill="#fbf6ea" opacity=".6"/>
      <!-- the sea -->
      <rect x="688" y="450" width="174" height="120" fill="url(#seaG)"/>
      <line x1="688" y1="450" x2="862" y2="450" stroke="#453a54" stroke-width="1.2" stroke-opacity=".8"/>
      <g stroke="#453a54" stroke-width="1.2" stroke-opacity=".5">
        <line x1="700" y1="472" x2="738" y2="472"/><line x1="760" y1="488" x2="812" y2="488"/>
        <line x1="716" y1="512" x2="762" y2="512"/><line x1="800" y1="530" x2="846" y2="530"/>
        <line x1="694" y1="548" x2="742" y2="548"/>
      </g>
      <!-- the far shore: a thumbnail of gold on the horizon (the Dream) -->
      <g fill="#d9a441">
        <rect x="790" y="447.4" width="7" height="1.8" rx=".9"/>
        <rect x="800" y="446.8" width="5" height="1.6" rx=".8"/>
        <rect x="808" y="447.6" width="4" height="1.4" rx=".7"/>
      </g>
      <circle cx="801" cy="445.6" r="1.4" fill="#f7e3ae" class="twinkle" style="animation-delay:-1s;animation-duration:9s"/>
      <path d="M 800 452 q 2 10 -1 20 q -2 10 1 22" fill="none" stroke="#d9a441" stroke-width="1.4" stroke-opacity=".28"/>
    </g>
    <g stroke="#d9a441" stroke-width="1.5" stroke-opacity=".42" fill="none">
      <line x1="775" y1="213" x2="775" y2="570"/><line x1="688" y1="424" x2="862" y2="424"/>
      <line x1="775" y1="300" x2="713" y2="240"/><line x1="775" y1="300" x2="837" y2="240"/>
    </g>
    <path d="M 688 570 L 688 300 A 87 87 0 0 1 862 300" fill="none" stroke="#1e1913" stroke-width="7" stroke-opacity=".3"/>
    <rect x="664" y="570" width="222" height="20" rx="3" fill="#4a4034"/>
    <line x1="668" y1="572" x2="882" y2="572" stroke="#f7e3ae" stroke-width="1.5" stroke-opacity=".18"/>
  </g>

  <!-- ── SPIRAL STAIR: the ascent to the Library, and above it the Lamp ── -->
  <g>
    <path d="M 818 910 L 818 430 A 92 92 0 0 1 1002 430 L 1002 910 Z" fill="#463c30"/>
    <path d="M 830 900 L 830 430 A 80 80 0 0 1 990 430 L 990 900 Z" fill="#1e1913"/>
    <!-- warm light bleeding down the stairwell from the floors above -->
    <rect x="830" y="352" width="160" height="290" fill="url(#stairG)" opacity=".8"/>
    <ellipse cx="912" cy="452" rx="66" ry="80" fill="url(#glowSmG)" opacity=".5"/>
    <!-- wedge treads climbing into shadow -->
    <path d="M 832 900 L 988 900 L 988 852 L 832 868 Z" fill="#2a231b"/>
    <path d="M 838 868 L 988 852 L 976 812 L 842 838 Z" fill="#272119"/>
    <path d="M 848 838 L 974 812 L 950 780 L 856 808 Z" fill="#241e17"/>
    <path d="M 860 808 L 948 780 L 920 754 L 866 782 Z" fill="#221c16"/>
    <path d="M 872 782 L 918 754 L 896 736 L 874 760 Z" fill="#201a14"/>
    <g fill="none" stroke="#f7e3ae" stroke-width="1.5">
      <path d="M 832 868 L 988 852" stroke-opacity=".38"/>
      <path d="M 842 838 L 976 812" stroke-opacity=".3"/>
      <path d="M 856 808 L 950 780" stroke-opacity=".22"/>
      <path d="M 866 782 L 920 754" stroke-opacity=".15"/>
      <path d="M 874 760 L 896 736" stroke-opacity=".09"/>
    </g>
    <!-- rope rail -->
    <path d="M 856 894 C 878 832, 908 788, 944 766" fill="none" stroke="#3a2c1e" stroke-width="5"/>
    <path d="M 856 894 C 878 832, 908 788, 944 766" fill="none" stroke="#d9a441" stroke-width="1" stroke-opacity=".3"/>
    <path d="M 818 910 L 818 430 A 92 92 0 0 1 1002 430 L 1002 910" fill="none" stroke="#241e18" stroke-width="2" stroke-opacity=".55"/>
    <!-- voussoir ticks on the arch -->
    <g stroke="#241e18" stroke-width="1.4" stroke-opacity=".4">
      <line x1="846" y1="376" x2="858" y2="392"/><line x1="910" y1="338" x2="910" y2="358"/>
      <line x1="974" y1="376" x2="962" y2="392"/>
    </g>
  </g>
  <!-- the key to the lamp room, on its brass hook -->
  <g fill="none" stroke="#d9a441" stroke-width="2" stroke-linecap="round">
    <path d="M 796 630 C 803 629, 806 636, 801 641" stroke-opacity=".85"/>
    <circle cx="800" cy="650" r="6.5" stroke-opacity=".8"/>
    <line x1="800" y1="656.5" x2="800" y2="684" stroke-opacity=".8" stroke-width="2.5"/>
    <line x1="800" y1="676" x2="808" y2="676" stroke-opacity=".8" stroke-width="2.5"/>
    <line x1="800" y1="684" x2="806" y2="684" stroke-opacity=".8" stroke-width="2.5"/>
    <path d="M 796 646 A 6.5 6.5 0 0 1 802 643.6" stroke="#f7e3ae" stroke-width="1" stroke-opacity=".6"/>
  </g>

  <!-- ── CHIMNEY BREAST + STAR-CHART ── -->
  <rect x="350" y="96" width="300" height="784" fill="#3b322a"/>
  <rect x="350" y="96" width="12" height="784" fill="#241e18" opacity=".35"/>
  <rect x="638" y="96" width="12" height="784" fill="#241e18" opacity=".35"/>
  <g stroke="#241e18" stroke-width="1.3" stroke-opacity=".16">
    <line x1="352" y1="148" x2="648" y2="148"/><line x1="352" y1="200" x2="648" y2="200"/>
    <line x1="352" y1="356" x2="648" y2="356"/><line x1="352" y1="408" x2="648" y2="408"/>
    <line x1="352" y1="460" x2="648" y2="460"/><line x1="352" y1="512" x2="648" y2="512"/>
    <line x1="352" y1="564" x2="648" y2="564"/><line x1="352" y1="616" x2="648" y2="616"/>
    <line x1="352" y1="668" x2="648" y2="668"/><line x1="352" y1="720" x2="648" y2="720"/>
    <line x1="352" y1="772" x2="648" y2="772"/><line x1="352" y1="824" x2="648" y2="824"/>
  </g>
  <g stroke="#241e18" stroke-width="1.2" stroke-opacity=".12">
    <line x1="430" y1="408" x2="430" y2="460"/><line x1="540" y1="460" x2="540" y2="512"/>
    <line x1="470" y1="512" x2="470" y2="564"/><line x1="580" y1="564" x2="580" y2="616"/>
    <line x1="410" y1="616" x2="410" y2="668"/><line x1="520" y1="668" x2="520" y2="720"/>
    <line x1="450" y1="720" x2="450" y2="772"/><line x1="590" y1="772" x2="590" y2="824"/>
    <line x1="500" y1="356" x2="500" y2="408"/><line x1="560" y1="148" x2="560" y2="200"/>
  </g>
  <!-- the star-chart: the shared sky, mapped and pinned -->
  <g transform="rotate(-2 500 240)">
    <path d="M 418 156 L 582 152 C 585 210, 584 268, 581 326 L 421 330 C 417 272, 416 214, 418 156 Z"
      fill="#f5eddc" opacity=".95"/>
    <path d="M 426 164 L 574 160.5 C 576.5 212, 575.7 262, 573.2 318 L 429 321.4 C 425.7 268, 425 216, 426 164 Z"
      fill="none" stroke="#2b2014" stroke-width="1" stroke-opacity=".28"/>
    <circle cx="428" cy="161" r="2.6" fill="#d9a441"/>
    <circle cx="574" cy="158" r="2.6" fill="#d9a441"/>
    <text x="500" y="182" text-anchor="middle" font-family="'Courier New',Courier,monospace"
      font-size="8.5" letter-spacing="1.4" fill="#2b2014" opacity=".7">THE SHARED SKY</text>
    <text x="500" y="194" text-anchor="middle" font-family="'Courier New',Courier,monospace"
      font-size="6.5" letter-spacing="1.2" fill="#2b2014" opacity=".55">SEASON OF THE FERRY</text>
    <!-- the ferry, inked; a dashed route runs to a gold shore in the corner -->
    <path d="M 448 268 L 470 281 L 520 283 L 548 266" fill="none" stroke="#2b2014" stroke-width="1" stroke-opacity=".5"/>
    <line x1="500" y1="282" x2="500" y2="236" stroke="#2b2014" stroke-width="1" stroke-opacity=".5"/>
    <path d="M 500 240 L 532 268 L 500 268 Z" fill="none" stroke="#2b2014" stroke-width=".9" stroke-opacity=".4"/>
    <circle cx="448" cy="268" r="1.8" fill="#2b2014" opacity=".7"/>
    <circle cx="470" cy="281" r="1.5" fill="#2b2014" opacity=".6"/>
    <circle cx="520" cy="283" r="1.7" fill="#2b2014" opacity=".65"/>
    <circle cx="548" cy="266" r="1.5" fill="#2b2014" opacity=".6"/>
    <circle cx="500" cy="236" r="2.2" fill="#d9a441"/>
    <circle cx="500" cy="236" r="5.5" fill="none" stroke="#2b2014" stroke-width=".8" stroke-opacity=".4"/>
    <path d="M 552 262 C 558 244, 562 222, 564 202" fill="none" stroke="#2b2014" stroke-width="1"
      stroke-opacity=".38" stroke-dasharray="3 4"/>
    <circle cx="565" cy="198" r="2.2" fill="#d9a441"/>
    <!-- compass rose -->
    <g stroke="#2b2014" stroke-width=".9" stroke-opacity=".5">
      <line x1="444" y1="298" x2="444" y2="316"/><line x1="435" y1="307" x2="453" y2="307"/>
      <line x1="438" y1="301" x2="450" y2="313"/><line x1="450" y1="301" x2="438" y2="313"/>
    </g>
    <circle cx="444" cy="307" r="2" fill="none" stroke="#2b2014" stroke-width=".9" stroke-opacity=".5"/>
    <!-- curled corner -->
    <path d="M 581 326 L 561 326 C 570 318, 577 318, 581 312 Z" fill="#e6d9bd"/>
    <path d="M 581 326 L 561 326" stroke="#2b2014" stroke-width=".8" stroke-opacity=".3"/>
  </g>

  <!-- ── MANTLE + FIREBOX ── -->
  <rect x="356" y="914" width="288" height="34" fill="#463c30"/>
  <g stroke="#241e18" stroke-width="1.3" stroke-opacity=".35">
    <line x1="420" y1="916" x2="428" y2="946"/><line x1="500" y1="914" x2="500" y2="948"/>
    <line x1="580" y1="916" x2="572" y2="946"/>
  </g>
  <path d="M 384 1196 L 384 1010 Q 384 952 448 950 L 552 950 Q 616 952 616 1010 L 616 1196 Z" fill="#1e1913"/>
  <ellipse cx="500" cy="1130" rx="108" ry="98" fill="url(#fireInG)"/>
  <path d="M 420 986 Q 460 964 500 962 Q 540 964 580 986" fill="none" stroke="#1a1510" stroke-width="10" stroke-opacity=".6"/>
  <path d="M 384 1196 L 384 1010 Q 384 952 448 950 L 552 950 Q 616 952 616 1010 L 616 1196"
    fill="none" stroke="#241e18" stroke-width="2.5" stroke-opacity=".6"/>
  <!-- logs + embers -->
  <ellipse cx="500" cy="1184" rx="72" ry="11" fill="#c4704b" opacity=".5"/>
  <g transform="rotate(-7 500 1162)">
    <rect x="434" y="1152" width="132" height="20" rx="9" fill="#3a2c1e"/>
    <ellipse cx="436" cy="1162" rx="8" ry="10" fill="#4a3826"/>
    <ellipse cx="436" cy="1162" rx="4" ry="5" fill="none" stroke="#2b2014" stroke-width="1"/>
  </g>
  <g transform="rotate(6 512 1176)">
    <rect x="448" y="1166" width="128" height="20" rx="9" fill="#33271b"/>
    <ellipse cx="574" cy="1176" rx="8" ry="10" fill="#4a3826"/>
  </g>
  <g stroke-linecap="round">
    <line x1="470" y1="1180" x2="482" y2="1178" stroke="#d9a441" stroke-width="2.2" stroke-opacity=".85"/>
    <line x1="520" y1="1186" x2="534" y2="1184" stroke="#c4704b" stroke-width="2.2" stroke-opacity=".9"/>
    <circle cx="498" cy="1182" r="1.6" fill="#f7e3ae" opacity=".9"/>
    <circle cx="548" cy="1178" r="1.3" fill="#d9a441" opacity=".8"/>
  </g>
  <!-- the fire: three tongues, breathing at different tempos -->
  <g>
    <path id="flame-o" class="flame" d="M 500 1040 C 526 1076, 545 1104, 539 1136 C 535 1161, 521 1174, 500 1176
      C 479 1174, 465 1161, 461 1136 C 455 1104, 474 1076, 500 1040 Z" fill="#c4704b" opacity=".88"/>
    <path id="flame-m" class="flame" d="M 500 1072 C 519 1099, 532 1119, 528 1142 C 525 1160, 514 1170, 500 1172
      C 486 1170, 475 1160, 472 1142 C 468 1119, 481 1099, 500 1072 Z" fill="#d9a441" opacity=".92"/>
    <path id="flame-c" class="flame" d="M 500 1108 C 511 1124, 517 1138, 514 1152 C 512 1163, 507 1169, 500 1170
      C 493 1169, 488 1163, 486 1152 C 483 1138, 489 1124, 500 1108 Z" fill="#f7e3ae"/>
  </g>
  <!-- mantle shelf -->
  <rect x="240" y="878" width="520" height="36" rx="4" fill="#4a4034"/>
  <line x1="246" y1="880.5" x2="754" y2="880.5" stroke="#f7e3ae" stroke-width="2" stroke-opacity=".16"/>
  <line x1="240" y1="913" x2="760" y2="913" stroke="#241e18" stroke-width="2" stroke-opacity=".5"/>
  <path d="M 258 914 L 302 914 L 294 952 L 266 952 Z" fill="#3b322a" stroke="#241e18" stroke-width="1.2" stroke-opacity=".4"/>
  <path d="M 698 914 L 742 914 L 734 952 L 706 952 Z" fill="#3b322a" stroke="#241e18" stroke-width="1.2" stroke-opacity=".4"/>
  <!-- hearthstone -->
  <rect x="330" y="1196" width="440" height="66" rx="6" fill="#453b2f"/>
  <line x1="338" y1="1199" x2="762" y2="1199" stroke="#f7e3ae" stroke-width="1.5" stroke-opacity=".12"/>
  <rect x="330" y="1196" width="440" height="66" rx="6" fill="none" stroke="#241e18" stroke-width="1.6" stroke-opacity=".45"/>

  <!-- warm pool of firelight over the floor and the two who stand in it -->
  <ellipse cx="500" cy="1130" rx="430" ry="300" fill="url(#spillG)"/>

  <!-- ── THE SPELLBOOK, splayed on the mantle ── -->
  <g>
    <ellipse cx="500" cy="886" rx="132" ry="11" fill="#1e1913" opacity=".4"/>
    <!-- boards -->
    <path d="M 372 872 L 494 850 L 500 886 L 380 898 Z" fill="#3a2b1e"/>
    <path d="M 628 872 L 506 850 L 500 886 L 620 898 Z" fill="#3a2b1e"/>
    <path d="M 381 872.5 L 490 853 L 494 879 L 388 890 Z" fill="none" stroke="#d9a441" stroke-width="1" stroke-opacity=".45"/>
    <path d="M 619 872.5 L 510 853 L 506 879 L 612 890 Z" fill="none" stroke="#d9a441" stroke-width="1" stroke-opacity=".45"/>
    <!-- brass corners -->
    <path d="M 372 872 l 10 -2 l -8 8 Z" fill="#d9a441" opacity=".8"/>
    <path d="M 628 872 l -10 -2 l 8 8 Z" fill="#d9a441" opacity=".8"/>
    <path d="M 380 898 l 11 -1 l -9 -7 Z" fill="#d9a441" opacity=".7"/>
    <path d="M 620 898 l -11 -1 l 9 -7 Z" fill="#d9a441" opacity=".7"/>
    <!-- pages -->
    <path d="M 386 868 C 412 846, 458 838, 498 842 L 498 878 C 458 872, 420 878, 392 890 Z" fill="url(#pageG)"/>
    <path d="M 614 868 C 588 846, 542 838, 502 842 L 502 878 C 542 872, 580 878, 608 890 Z" fill="url(#pageG)"/>
    <g fill="none" stroke="#2b2014" stroke-opacity=".3" stroke-width="1">
      <path d="M 390 886 C 418 874, 456 868, 496 874"/>
      <path d="M 392 890.5 C 420 879, 458 873, 497 879"/>
      <path d="M 610 886 C 582 874, 544 868, 504 874"/>
      <path d="M 608 890.5 C 580 879, 542 873, 503 879"/>
    </g>
    <path d="M 498 842 C 499 854, 499 866, 500 878 C 501 866, 501 854, 502 842" fill="#d9c9a8"/>
    <!-- the ink of past days -->
    <g fill="none" stroke="#2b2014" stroke-width=".9" stroke-opacity=".26">
      <path d="M 408 858 q 12 -4 24 -2 q 12 2 26 -1"/>
      <path d="M 406 864 q 14 -3 28 -1 q 14 2 30 -1"/>
      <path d="M 410 870 q 10 -3 22 -1 q 10 2 20 0"/>
      <path d="M 540 856 q 12 -2 24 0"/>
      <path d="M 536 869 q 16 -3 32 0 q 8 1 18 0"/>
    </g>
    <!-- the recipe of the seal, drawn small on the right page -->
    <circle cx="560" cy="860" r="7" fill="none" stroke="#2b2014" stroke-width=".9" stroke-opacity=".38"/>
    <path d="M 556.5 856.5 L 563.5 863.5 M 563.5 856.5 L 556.5 863.5" stroke="#2b2014" stroke-width=".9" stroke-opacity=".38"/>
    <!-- the sigil's light on the pages -->
    <ellipse cx="500" cy="858" rx="92" ry="24" fill="#c9b3e3" opacity=".13"/>
    <!-- ribbon bookmark, spilling over the mantle's edge -->
    <path d="M 502 882 C 507 918, 495 950, 501 984 C 502 994, 499 1002, 496 1008
      L 486 1004 C 490 996, 492 988, 490 976 C 485 946, 497 916, 494 884 Z" fill="#c4704b"/>
    <path d="M 496 1008 L 486 1004 L 493 996 Z" fill="#2f2820"/>
    <path d="M 500 890 C 503 920, 494 950, 499 982" fill="none" stroke="#8a4c33" stroke-width="1" stroke-opacity=".6"/>
  </g>

  <!-- ── MANTLE STILL-LIFE ── -->
  <!-- left candle -->
  <g>
    <circle cx="262" cy="820" r="27" fill="url(#glowSmG)"/>
    <ellipse cx="262" cy="876" rx="16" ry="5" fill="#3a3128" stroke="#d9a441" stroke-width="1.2" stroke-opacity=".6"/>
    <rect x="254" y="830" width="16" height="44" rx="3" fill="#f5eddc"/>
    <path d="M 254 842 q -3 8 0 14 q 2 4 1 8" fill="none" stroke="#e6d9bd" stroke-width="3"/>
    <line x1="262" y1="830" x2="262" y2="824" stroke="#2b2014" stroke-width="1.2"/>
    <path class="candleflame" d="M 262 806 C 267 812, 268 818, 262 823 C 256 818, 257 812, 262 806 Z" fill="#d9a441"/>
    <path class="candleflame" d="M 262 812 C 264.5 815, 265 818, 262 821 C 259 818, 259.5 815, 262 812 Z" fill="#f7e3ae"/>
  </g>
  <!-- ship-in-a-bottle: the vessel, dry-docked in glass until the far shore calls -->
  <g>
    <path d="M 296 866 l 16 12 l -22 0 Z" fill="#3a2c1e"/>
    <path d="M 352 866 l 16 12 l -22 0 Z" fill="#3a2c1e"/>
    <rect x="284" y="838" width="92" height="34" rx="15" fill="#46402f" opacity=".82"/>
    <rect x="374" y="848" width="20" height="13" rx="4" fill="#46402f" opacity=".82"/>
    <rect x="393" y="845" width="9" height="19" rx="2.5" fill="#c4704b"/>
    <path d="M 292 846 C 318 839, 350 839, 368 843" fill="none" stroke="#fbf6ea" stroke-width="2" stroke-opacity=".25"/>
    <line x1="292" y1="862" x2="368" y2="862" stroke="#5b6b3c" stroke-width="1.6" stroke-opacity=".65"/>
    <path d="M 316 862 C 320 867, 340 867, 344 862 L 341 855 L 319 855 Z" fill="#2b2014"/>
    <line x1="330" y1="855" x2="330" y2="842" stroke="#2b2014" stroke-width="1.2"/>
    <path d="M 330 842 L 343 852 L 330 852 Z" fill="#f5eddc" opacity=".92"/>
    <path d="M 330 842 L 343 852" stroke="#d9a441" stroke-width=".9" stroke-opacity=".8" fill="none"/>
    <rect x="284" y="838" width="92" height="34" rx="15" fill="none" stroke="#241e18" stroke-width="1.2" stroke-opacity=".5"/>
  </g>
  <!-- sealing-wax sticks, a stub, the press, and a warm drip over the edge -->
  <g>
    <g transform="rotate(-14 648 866)">
      <rect x="620" y="861" width="56" height="9.5" rx="4.5" fill="#93372b"/>
      <rect x="620" y="861" width="7" height="9.5" rx="3.5" fill="#6e2a20"/>
      <line x1="630" y1="863.5" x2="668" y2="863.5" stroke="#fbf6ea" stroke-width="1" stroke-opacity=".18"/>
    </g>
    <g transform="rotate(8 656 872)">
      <rect x="628" y="868" width="56" height="9.5" rx="4.5" fill="#93372b"/>
      <rect x="677" y="868" width="7" height="9.5" rx="3.5" fill="#6e2a20"/>
    </g>
    <rect x="690" y="866" width="13" height="9" rx="4" fill="#6e2a20"/>
    <!-- brass seal-press: dark body, brass lines that catch the light -->
    <path d="M 705 878 L 729 878 L 725 866 L 709 866 Z" fill="#3a3128" stroke="#d9a441" stroke-width="1.1" stroke-opacity=".7"/>
    <rect x="708" y="838" width="18" height="28" rx="3" fill="#3a3128" stroke="#d9a441" stroke-width="1.1" stroke-opacity=".7"/>
    <rect x="713" y="826" width="8" height="12" fill="#3a3128" stroke="#d9a441" stroke-width="1" stroke-opacity=".6"/>
    <circle cx="717" cy="818" r="9" fill="#3a3128" stroke="#d9a441" stroke-width="1.2" stroke-opacity=".75"/>
    <path d="M 710.5 813 A 9 9 0 0 1 717 809" fill="none" stroke="#f7e3ae" stroke-width="1" stroke-opacity=".6"/>
    <line x1="710" y1="842" x2="710" y2="862" stroke="#f7e3ae" stroke-width="1" stroke-opacity=".4"/>
    <!-- the puddle that ran over the edge while two people were busy laughing -->
    <path d="M 656 880 C 662 876, 684 876, 690 881 C 694 885, 688 889, 678 889 C 666 889, 652 885, 656 880 Z" fill="#93372b"/>
    <ellipse cx="668" cy="881" rx="5" ry="1.8" fill="#fbf6ea" opacity=".22"/>
    <path d="M 674 889 C 673 902, 676 912, 675 922 C 675 926, 677 926, 678 922 C 679 912, 677 902, 678 890 Z" fill="#93372b"/>
    <circle cx="676.5" cy="927" r="4" fill="#93372b"/>
    <circle cx="676.5" cy="946" r="2" fill="#93372b" opacity=".9"/>
  </g>
  <!-- right candle -->
  <g>
    <circle cx="748" cy="822" r="27" fill="url(#glowSmG)"/>
    <ellipse cx="748" cy="876" rx="16" ry="5" fill="#3a3128" stroke="#d9a441" stroke-width="1.2" stroke-opacity=".6"/>
    <rect x="740" y="832" width="16" height="42" rx="3" fill="#f5eddc"/>
    <path d="M 756 844 q 3 8 0 14 q -2 4 -1 8" fill="none" stroke="#e6d9bd" stroke-width="3"/>
    <line x1="748" y1="832" x2="748" y2="826" stroke="#2b2014" stroke-width="1.2"/>
    <path class="candleflame slow" d="M 748 808 C 753 814, 754 820, 748 825 C 742 820, 743 814, 748 808 Z" fill="#d9a441"/>
    <path class="candleflame slow" d="M 748 814 C 750.5 817, 751 820, 748 823 C 745 820, 745.5 817, 748 814 Z" fill="#f7e3ae"/>
  </g>

  <!-- ── HANGING LANTERN, with one of the small folk inside ── -->
  <g>
    <line x1="352" y1="96" x2="352" y2="118" stroke="#6b5a44" stroke-width="1.6"/>
    <circle cx="352" cy="104" r="3" fill="none" stroke="#d9a441" stroke-width="1.2" stroke-opacity=".6"/>
    <circle cx="352" cy="112" r="3" fill="none" stroke="#d9a441" stroke-width="1.2" stroke-opacity=".6"/>
    <circle cx="352" cy="172" r="36" fill="url(#glowSmG)" opacity=".85"/>
    <path d="M 336 130 L 368 130 L 360 119 L 344 119 Z" fill="#241e18" stroke="#d9a441" stroke-width="1.3" stroke-opacity=".75"/>
    <rect x="334" y="130" width="36" height="48" rx="4" fill="#241e18" opacity=".85"
      stroke="#d9a441" stroke-width="1.5" stroke-opacity=".8"/>
    <line x1="345" y1="132" x2="345" y2="176" stroke="#d9a441" stroke-width="1" stroke-opacity=".4"/>
    <line x1="359" y1="132" x2="359" y2="176" stroke="#d9a441" stroke-width="1" stroke-opacity=".4"/>
    <!-- the wick-spirit: it leans when it listens -->
    <g id="wisp">
      <path d="M 352 152 C 358 159, 359 166, 352 172 C 345 166, 346 159, 352 152 Z" fill="#d9a441"/>
      <path d="M 352 157 C 355.5 161, 356 165, 352 169 C 348 165, 348.5 161, 352 157 Z" fill="#f7e3ae"/>
      <circle cx="349.8" cy="162.5" r=".9" fill="#2b2014"/>
      <circle cx="354.2" cy="162.5" r=".9" fill="#2b2014"/>
    </g>
  </g>

  <!-- ── DRIED HERBS, hung to keep the winter honest ── -->
  <g>
    <line x1="620" y1="96" x2="620" y2="118" stroke="#6b5a44" stroke-width="1.4"/>
    <circle cx="620" cy="119" r="2.2" fill="none" stroke="#d9a441" stroke-width="1" stroke-opacity=".55"/>
    <g stroke="#5b6b3c" stroke-width="2" stroke-opacity=".9" fill="none">
      <path d="M 620 121 C 616 142, 610 162, 604 184"/>
      <path d="M 620 121 C 619 144, 616 166, 613 188"/>
      <path d="M 620 121 C 622 144, 625 166, 628 186"/>
      <path d="M 620 121 C 626 140, 632 158, 637 176"/>
      <path d="M 620 121 C 613 138, 607 152, 598 166"/>
    </g>
    <g fill="#7c8a4d" opacity=".7">
      <ellipse cx="607" cy="160" rx="3.4" ry="1.6" transform="rotate(-62 607 160)"/>
      <ellipse cx="616" cy="170" rx="3.4" ry="1.6" transform="rotate(-80 616 170)"/>
      <ellipse cx="626" cy="168" rx="3.4" ry="1.6" transform="rotate(80 626 168)"/>
      <ellipse cx="634" cy="156" rx="3.4" ry="1.6" transform="rotate(62 634 156)"/>
      <ellipse cx="601" cy="150" rx="3.2" ry="1.5" transform="rotate(-55 601 150)"/>
    </g>
    <circle cx="604" cy="186" r="2.4" fill="#c4704b"/>
    <circle cx="628" cy="188" r="2.2" fill="#c4704b"/>
    <circle cx="638" cy="178" r="2" fill="#c4704b" opacity=".9"/>
  </g>

  <!-- ── THE APOTHECARY: jars with hand-inked labels ── -->
  <g>
    <rect x="88" y="700" width="244" height="11" rx="2" fill="#3a2c1e"/>
    <line x1="92" y1="701.5" x2="328" y2="701.5" stroke="#f7e3ae" stroke-width="1" stroke-opacity=".14"/>
    <path d="M 106 711 l 14 0 l -14 16 Z" fill="#33291d"/>
    <path d="M 314 711 l -14 0 l 14 16 Z" fill="#33291d"/>
    <!-- vervain: round-bellied, half dried leaves -->
    <circle cx="115" cy="680" r="18" fill="#46402f" opacity=".85"/>
    <path d="M 100 686 A 18 18 0 0 0 130 686 L 130 680 L 100 680 Z" fill="#5b6b3c" opacity=".8"/>
    <rect x="108" y="650" width="14" height="14" rx="2" fill="#46402f" opacity=".85"/>
    <rect x="106" y="644" width="18" height="8" rx="3" fill="#c4704b"/>
    <path d="M 102 668 A 18 18 0 0 1 110 664" fill="none" stroke="#fbf6ea" stroke-width="1.4" stroke-opacity=".25"/>
    <g transform="rotate(-2 115 677)">
      <rect x="102" y="671" width="26" height="11" rx="1" fill="#f5eddc" opacity=".92"/>
      <text x="115" y="679" text-anchor="middle" font-family="'Courier New',Courier,monospace"
        font-size="5.6" letter-spacing=".6" fill="#4a3a28">VERVAIN</text>
    </g>
    <!-- emberroot: tall, amber -->
    <rect x="138" y="630" width="28" height="70" rx="4" fill="#46402f" opacity=".85"/>
    <rect x="141" y="662" width="22" height="35" rx="3" fill="#d9a441" opacity=".55"/>
    <rect x="143" y="622" width="18" height="9" rx="3" fill="#8a4c33"/>
    <line x1="141" y1="636" x2="141" y2="694" stroke="#fbf6ea" stroke-width="1.3" stroke-opacity=".22"/>
    <rect x="139" y="672" width="26" height="10" rx="1" fill="#f5eddc" opacity=".92" transform="rotate(1.5 152 677)"/>
    <text x="152" y="679.6" text-anchor="middle" font-family="'Courier New',Courier,monospace"
      font-size="4.8" letter-spacing=".3" fill="#4a3a28" transform="rotate(1.5 152 677)">EMBERROOT</text>
    <!-- ochre: squat -->
    <rect x="174" y="668" width="24" height="32" rx="4" fill="#46402f" opacity=".85"/>
    <rect x="177" y="682" width="18" height="14" rx="2" fill="#c4704b" opacity=".7"/>
    <rect x="178" y="662" width="16" height="8" rx="3" fill="#5b6b3c"/>
    <rect x="175" y="672" width="22" height="9" rx="1" fill="#f5eddc" opacity=".9"/>
    <text x="186" y="678.8" text-anchor="middle" font-family="'Courier New',Courier,monospace"
      font-size="5.4" letter-spacing=".6" fill="#4a3a28">OCHRE</text>
    <!-- salt of dawn: pale grains -->
    <path d="M 206 700 L 206 664 Q 206 650 221 650 Q 236 650 236 664 L 236 700 Z" fill="#46402f" opacity=".85"/>
    <path d="M 209 700 L 209 680 L 233 680 L 233 700 Z" fill="#f5eddc" opacity=".6"/>
    <circle cx="215" cy="676" r="1" fill="#f5eddc" opacity=".7"/>
    <circle cx="224" cy="673" r="1" fill="#f5eddc" opacity=".6"/>
    <rect x="214" y="644" width="14" height="8" rx="3" fill="#c4704b"/>
    <rect x="203" y="668" width="36" height="9" rx="1" fill="#f5eddc" opacity=".92" transform="rotate(-1.5 221 672)"/>
    <text x="221" y="674.8" text-anchor="middle" font-family="'Courier New',Courier,monospace"
      font-size="5" letter-spacing=".3" fill="#4a3a28" transform="rotate(-1.5 221 672)">SALT OF DAWN</text>
    <!-- quiet: a small empty vial, kept for when it's needed -->
    <rect x="248" y="666" width="16" height="34" rx="3" fill="#46402f" opacity=".8"/>
    <rect x="251" y="658" width="10" height="9" rx="2" fill="#8a4c33"/>
    <line x1="250.5" y1="670" x2="250.5" y2="694" stroke="#fbf6ea" stroke-width="1.1" stroke-opacity=".2"/>
    <rect x="246" y="676" width="20" height="9" rx="1" fill="#f5eddc" opacity=".9" transform="rotate(2 256 680)"/>
    <text x="256" y="682.8" text-anchor="middle" font-family="'Courier New',Courier,monospace"
      font-size="5.2" letter-spacing=".5" fill="#4a3a28" transform="rotate(2 256 680)">QUIET</text>
    <!-- for winter: wide, cloth-tied -->
    <rect x="274" y="654" width="46" height="46" rx="6" fill="#46402f" opacity=".85"/>
    <path d="M 276 662 Q 297 652 318 662 L 318 656 Q 297 646 276 656 Z" fill="#f5eddc" opacity=".85"/>
    <path d="M 280 660 q 4 6 0 10 M 314 660 q -4 6 0 10" stroke="#c4704b" stroke-width="1.4" fill="none"/>
    <line x1="277" y1="662" x2="277" y2="694" stroke="#fbf6ea" stroke-width="1.3" stroke-opacity=".2"/>
    <rect x="278" y="672" width="38" height="10" rx="1" fill="#f5eddc" opacity=".92" transform="rotate(-1 297 677)"/>
    <text x="297" y="679.4" text-anchor="middle" font-family="'Courier New',Courier,monospace"
      font-size="5.2" letter-spacing=".4" fill="#4a3a28" transform="rotate(-1 297 677)">FOR WINTER</text>
  </g>

  <!-- ── WINGS: the room keeps going past the frame (wide panels only) ── -->
  <g>
    <!-- left: the case of read-aloud books -->
    <rect x="-380" y="560" width="320" height="840" fill="#2a231b"/>
    <g stroke="#1e1913" stroke-width="3" stroke-opacity=".7">
      <line x1="-380" y1="760" x2="-60" y2="760"/><line x1="-380" y1="970" x2="-60" y2="970"/>
      <line x1="-380" y1="1180" x2="-60" y2="1180"/>
    </g>
    <g opacity=".85">
      <rect x="-352" y="682" width="20" height="76" fill="#5b6b3c"/><rect x="-328" y="674" width="16" height="84" fill="#8a4c33"/>
      <rect x="-308" y="690" width="24" height="68" fill="#3a3128"/><rect x="-280" y="678" width="14" height="80" fill="#c4704b" opacity=".8"/>
      <rect x="-262" y="694" width="22" height="64" fill="#5b6b3c" opacity=".8"/><rect x="-236" y="668" width="18" height="90" fill="#f5eddc" opacity=".55"/>
      <rect x="-214" y="686" width="26" height="72" fill="#8a4c33" opacity=".9"/><rect x="-184" y="676" width="15" height="82" fill="#3a3128"/>
      <rect x="-344" y="898" width="18" height="70" fill="#8a4c33"/><rect x="-322" y="888" width="24" height="80" fill="#3a3128"/>
      <rect x="-294" y="902" width="15" height="66" fill="#5b6b3c"/><rect x="-274" y="884" width="20" height="84" fill="#f5eddc" opacity=".5"/>
      <rect x="-250" y="906" width="26" height="62" fill="#c4704b" opacity=".75"/><rect x="-220" y="892" width="17" height="76" fill="#5b6b3c" opacity=".85"/>
      <rect x="-198" y="900" width="22" height="68" fill="#8a4c33" opacity=".8"/>
      <rect x="-348" y="1108" width="24" height="70" fill="#3a3128"/><rect x="-320" y="1096" width="16" height="82" fill="#5b6b3c"/>
      <rect x="-300" y="1112" width="20" height="66" fill="#8a4c33" opacity=".85"/><rect x="-276" y="1102" width="18" height="76" fill="#f5eddc" opacity=".5"/>
      <rect x="-254" y="1116" width="24" height="62" fill="#3a3128" opacity=".9"/>
    </g>
    <!-- right: rope, oar, barrel — the docks are not far -->
    <g fill="none" stroke="#6b5a44" stroke-width="6" opacity=".9">
      <ellipse cx="1140" cy="1330" rx="52" ry="20"/>
      <ellipse cx="1140" cy="1318" rx="44" ry="17"/>
      <ellipse cx="1140" cy="1307" rx="35" ry="14"/>
    </g>
    <g transform="rotate(11 1235 1140)">
      <rect x="1229" y="890" width="12" height="420" rx="6" fill="#3a2c1e"/>
      <ellipse cx="1235" cy="1340" rx="17" ry="52" fill="#33291d"/>
      <line x1="1235" y1="1300" x2="1235" y2="1382" stroke="#241e18" stroke-width="1.4" stroke-opacity=".5"/>
    </g>
    <g>
      <path d="M 1282 1252 C 1282 1236, 1358 1236, 1358 1252 L 1364 1380 C 1364 1396, 1276 1396, 1276 1380 Z" fill="#3a2c1e"/>
      <ellipse cx="1320" cy="1248" rx="38" ry="10" fill="#33291d"/>
      <path d="M 1279 1290 C 1305 1298, 1335 1298, 1361 1290" fill="none" stroke="#d9a441" stroke-width="1.4" stroke-opacity=".35"/>
      <path d="M 1277 1344 C 1305 1352, 1335 1352, 1363 1344" fill="none" stroke="#d9a441" stroke-width="1.4" stroke-opacity=".3"/>
      <g stroke="#241e18" stroke-width="1.2" stroke-opacity=".4">
        <line x1="1298" y1="1246" x2="1294" y2="1390"/><line x1="1320" y1="1250" x2="1320" y2="1392"/>
        <line x1="1342" y1="1246" x2="1346" y2="1390"/>
      </g>
    </g>
  </g>
`;

export const HEARTH_MID = `
<!-- ── the writing desk: ledger, letters, quill — the typed-and-inked record ── -->
  <g>
    <ellipse cx="176" cy="1398" rx="132" ry="12" fill="url(#shadG)"/>
    <rect x="52" y="1198" width="14" height="196" fill="#33291d"/>
    <rect x="286" y="1198" width="14" height="196" fill="#33291d"/>
    <rect x="52" y="1330" width="248" height="10" fill="#33291d" opacity=".9"/>
    <rect x="40" y="1178" width="272" height="22" rx="3" fill="#3a2c1e"/>
    <line x1="46" y1="1180.5" x2="306" y2="1180.5" stroke="#f7e3ae" stroke-width="1.5" stroke-opacity=".13"/>
    <!-- loose letters under a brass weight -->
    <g>
      <g transform="rotate(-4 139 1161)"><rect x="100" y="1140" width="78" height="42" rx="1.5" fill="#efe4cb"/></g>
      <g transform="rotate(3 141 1156)"><rect x="104" y="1136" width="74" height="40" rx="1.5" fill="#f5eddc"/></g>
      <g transform="rotate(-1 140 1152)">
        <rect x="102" y="1132" width="76" height="40" rx="1.5" fill="url(#pageG)"/>
        <g fill="none" stroke="#2b2014" stroke-width=".9" stroke-opacity=".3">
          <path d="M 112 1146 q 14 -3 28 -1 q 12 2 24 0"/>
          <path d="M 112 1153 q 16 -3 30 -1 q 10 1 20 0"/>
          <path d="M 112 1160 q 10 -2 20 -1"/>
        </g>
        <rect x="160" y="1137" width="11" height="13" fill="#c4704b" opacity=".55" stroke="#2b2014" stroke-opacity=".3" stroke-width=".8"/>
      </g>
      <circle cx="140" cy="1131" r="11" fill="#3a3128" stroke="#d9a441" stroke-width="1.2" stroke-opacity=".75"/>
      <circle cx="140" cy="1131" r="3" fill="none" stroke="#d9a441" stroke-width="1" stroke-opacity=".7"/>
      <path d="M 131.5 1126 A 11 11 0 0 1 140 1120" fill="none" stroke="#f7e3ae" stroke-width="1" stroke-opacity=".55"/>
    </g>
    <!-- a sealed envelope, waiting to be sent -->
    <g transform="rotate(-12 226 1146)">
      <rect x="198" y="1126" width="56" height="38" rx="2" fill="#f5eddc" stroke="#e6d9bd" stroke-width="1"/>
      <path d="M 198 1126 L 226 1146 L 254 1126" fill="none" stroke="#2b2014" stroke-width="1" stroke-opacity=".35"/>
      <circle cx="226" cy="1148" r="5.2" fill="#93372b" stroke="#6e2a20" stroke-width="1"/>
      <path d="M 224 1146 l 4 4 m 0 -4 l -4 4" stroke="#fbf6ea" stroke-width=".8" stroke-opacity=".45"/>
    </g>
    <!-- the open ledger, ruled in the typed hand -->
    <g transform="rotate(-3 172 1160)">
      <path d="M 96 1148 L 170 1141 L 173 1179 L 100 1187 Z" fill="url(#pageG)"/>
      <path d="M 248 1148 L 174 1141 L 171 1179 L 244 1187 Z" fill="url(#pageG)"/>
      <line x1="172" y1="1141" x2="172" y2="1180" stroke="#d9c9a8" stroke-width="2"/>
      <path d="M 100 1189.5 L 173 1181.5 M 244 1189.5 L 171 1181.5" stroke="#e6d9bd" stroke-width="1.2" fill="none"/>
      <g fill="none" stroke="#2b2014" stroke-width=".8" stroke-opacity=".22">
        <line x1="104" y1="1154" x2="166" y2="1148"/><line x1="105" y1="1163" x2="167" y2="1157"/>
        <line x1="106" y1="1172" x2="168" y2="1166"/>
      </g>
      <g font-family="'Courier New',Courier,monospace" font-size="5.6" fill="#6b5a44" letter-spacing=".3">
        <text x="178" y="1154">DAY 214 - BOTH HANDS</text>
        <text x="178" y="1163">OATS, MISO, TWO MILES</text>
        <text x="178" y="1172">SEALED AT DUSK</text>
      </g>
    </g>
    <!-- quill in its pot -->
    <path d="M 258 1178 L 286 1178 L 282 1154 L 262 1154 Z" fill="#241e18"/>
    <ellipse cx="272" cy="1154" rx="10" ry="3" fill="#1e1913" stroke="#d9a441" stroke-width="1" stroke-opacity=".55"/>
    <path d="M 276 1158 C 286 1128, 296 1102, 310 1080" fill="none" stroke="#6b5a44" stroke-width="1.6"/>
    <path d="M 310 1080 C 299 1073, 287 1081, 282 1097 C 287 1109, 296 1107, 301 1098 C 305 1090, 308 1085, 310 1080 Z"
      fill="#f5eddc" opacity=".92"/>
    <g stroke="#e6d9bd" stroke-width=".8" fill="none" opacity=".8">
      <path d="M 288 1092 L 296 1086"/><path d="M 290 1099 L 299 1092"/><path d="M 293 1104 L 301 1097"/>
    </g>
  </g>

  <!-- ── the round table: the orrery, the rolled charts ── -->
  <g>
    <ellipse cx="845" cy="1398" rx="118" ry="12" fill="url(#shadG)"/>
    <g fill="#33291d">
      <rect x="779" y="1206" width="12" height="186" transform="rotate(3 785 1206)"/>
      <rect x="839" y="1210" width="12" height="184"/>
      <rect x="899" y="1206" width="12" height="186" transform="rotate(-3 905 1206)"/>
    </g>
    <rect x="754" y="1192" width="182" height="15" rx="5" fill="#33291d"/>
    <ellipse cx="845" cy="1192" rx="92" ry="15" fill="#3a2c1e"/>
    <path d="M 758 1189 A 92 15 0 0 1 932 1189" fill="none" stroke="#f7e3ae" stroke-width="1.8" stroke-opacity=".13"/>
    <!-- the brass orrery: two small worlds, kept in one orbit -->
    <g>
      <ellipse cx="845" cy="1184" rx="24" ry="6" fill="#3a3128" stroke="#d9a441" stroke-width="1.1" stroke-opacity=".6"/>
      <line x1="845" y1="1184" x2="845" y2="1126" stroke="#d9a441" stroke-width="2" stroke-opacity=".85"/>
      <ellipse cx="845" cy="1138" rx="54" ry="15" transform="rotate(-8 845 1138)" fill="none"
        stroke="#d9a441" stroke-width="1.3" stroke-opacity=".78"/>
      <path d="M 800 1130 A 54 15 -8 0 1 843 1123.5" fill="none" stroke="#f7e3ae" stroke-width="1" stroke-opacity=".55"/>
      <ellipse cx="845" cy="1140" rx="34" ry="9" transform="rotate(7 845 1140)" fill="none"
        stroke="#d9a441" stroke-width="1.2" stroke-opacity=".82"/>
      <circle cx="845" cy="1122" r="2.5" fill="#d9a441"/>
      <circle cx="793" cy="1143" r="3.5" fill="#7c8a4d"/>
      <circle cx="877" cy="1132" r="4.5" fill="#c4704b"/>
      <circle cx="818" cy="1146" r="2.5" fill="#f5eddc"/>
    </g>
    <!-- sea-charts, rolled and tied: vessel plans for the ferry -->
    <g transform="rotate(14 938 1290)">
      <rect x="928" y="1206" width="19" height="164" rx="8" fill="url(#pageG)" stroke="#e6d9bd" stroke-width="1"/>
      <ellipse cx="937.5" cy="1206" rx="9.5" ry="4" fill="#e6d9bd"/>
      <path d="M 932 1206 a 5 2.5 0 1 0 10 0" fill="none" stroke="#2b2014" stroke-width=".9" stroke-opacity=".4"/>
      <rect x="928" y="1282" width="19" height="10" fill="#c4704b"/>
      <line x1="931" y1="1214" x2="931" y2="1366" stroke="#2b2014" stroke-width=".8" stroke-opacity=".18"/>
    </g>
    <g transform="rotate(24 966 1310)">
      <rect x="958" y="1248" width="15" height="124" rx="7" fill="#efe4cb" stroke="#e6d9bd" stroke-width="1"/>
      <ellipse cx="965.5" cy="1248" rx="7.5" ry="3.2" fill="#e6d9bd"/>
      <rect x="958" y="1310" width="15" height="8" fill="#5b6b3c"/>
    </g>
  </g>

  <!-- ── KEEPER OF THE MOSS HAND (west side of the altar) ── -->
  <g>
    <ellipse cx="300" cy="1197" rx="74" ry="11" fill="url(#shadG)"/>
    <path d="M 300 846 C 318 848, 332 862, 337 884 C 344 928, 349 1000, 346 1070
      C 344 1122, 349 1160, 357 1192 L 243 1192 C 251 1152, 249 1092, 251 1032
      C 253 972, 257 908, 267 878 C 273 858, 285 846, 300 846 Z" fill="#5b6b3c"/>
    <path d="M 320 868 C 336 896, 343 956, 341 1026 C 340 1098, 344 1150, 352 1190
      L 330 1190 C 324 1142, 322 1082, 323 1022 C 324 952, 318 902, 308 874 Z"
      fill="#7c8a4d" opacity=".85"/>
    <path d="M 302 848 C 320 854, 332 866, 337 886 C 344 930, 349 1002, 346 1072
      C 344 1124, 349 1160, 357 1190" fill="none" stroke="#fbf6ea" stroke-width="1.5" stroke-opacity=".4"/>
    <ellipse cx="318" cy="884" rx="13" ry="17" fill="#241e18"/>
    <path d="M 322 878 q 5 5 3 11" fill="none" stroke="#fbf6ea" stroke-width="1" stroke-opacity=".3"/>
    <path d="M 326 869 q 7 9 6 20" fill="none" stroke="#c9b3e3" stroke-width="1.5" stroke-opacity=".5"/>
    <path d="M 316 940 C 334 928, 350 920, 364 917 C 369 916, 371 921, 367 925
      C 353 931, 339 940, 325 952 Z" fill="#4f5d34"/>
    <path d="M 363 913 c 6 -2 11 2 9 8 c -2 5 -9 6 -12 2 c -2 -3 -1 -8 3 -10 Z" fill="#f5eddc"/>
    <path d="M 362 912 q 6 -2 10 2" fill="none" stroke="#c9b3e3" stroke-width="1" stroke-opacity=".55"/>
    <path d="M 262 1012 C 290 1020, 320 1020, 343 1012" fill="none" stroke="#d9a441" stroke-width="2" stroke-opacity=".7"/>
    <line x1="300" y1="1019" x2="297" y2="1046" stroke="#d9a441" stroke-width="1.5" stroke-opacity=".6"/>
    <circle cx="297" cy="1050" r="2" fill="#d9a441" opacity=".7"/>
    <!-- a sprig of the garden, tucked in the cord -->
    <path d="M 334 1016 l 6 -14 M 334 1016 l 10 -10" stroke="#5b6b3c" stroke-width="1.5" fill="none"/>
    <ellipse cx="341" cy="1004" rx="3" ry="1.5" transform="rotate(-60 341 1004)" fill="#7c8a4d"/>
    <ellipse cx="346" cy="1008" rx="3" ry="1.5" transform="rotate(-40 346 1008)" fill="#7c8a4d"/>
    <g stroke="#241e18" stroke-width="1.5" stroke-opacity=".3" fill="none">
      <path d="M 268 1130 q 2 30 0 58"/><path d="M 292 1140 q 1 26 0 50"/><path d="M 320 1140 q -1 26 0 50"/>
    </g>
  </g>

  <!-- ── KEEPER OF THE EMBER HAND (east side, mirrored, a breath shorter) ── -->
  <g transform="translate(991 36) scale(-0.97 0.97)">
    <ellipse cx="300" cy="1197" rx="74" ry="11" fill="url(#shadG)"/>
    <path d="M 300 846 C 318 848, 332 862, 337 884 C 344 928, 349 1000, 346 1070
      C 344 1122, 349 1160, 357 1192 L 243 1192 C 251 1152, 249 1092, 251 1032
      C 253 972, 257 908, 267 878 C 273 858, 285 846, 300 846 Z" fill="#8a4c33"/>
    <path d="M 320 868 C 336 896, 343 956, 341 1026 C 340 1098, 344 1150, 352 1190
      L 330 1190 C 324 1142, 322 1082, 323 1022 C 324 952, 318 902, 308 874 Z"
      fill="#c4704b" opacity=".85"/>
    <path d="M 302 848 C 320 854, 332 866, 337 886 C 344 930, 349 1002, 346 1072
      C 344 1124, 349 1160, 357 1190" fill="none" stroke="#fbf6ea" stroke-width="1.5" stroke-opacity=".4"/>
    <ellipse cx="318" cy="884" rx="13" ry="17" fill="#241e18"/>
    <path d="M 322 878 q 5 5 3 11" fill="none" stroke="#fbf6ea" stroke-width="1" stroke-opacity=".3"/>
    <path d="M 326 869 q 7 9 6 20" fill="none" stroke="#c9b3e3" stroke-width="1.5" stroke-opacity=".5"/>
    <path d="M 316 940 C 334 928, 350 920, 364 917 C 369 916, 371 921, 367 925
      C 353 931, 339 940, 325 952 Z" fill="#7a4029"/>
    <path d="M 363 913 c 6 -2 11 2 9 8 c -2 5 -9 6 -12 2 c -2 -3 -1 -8 3 -10 Z" fill="#f5eddc"/>
    <path d="M 362 912 q 6 -2 10 2" fill="none" stroke="#c9b3e3" stroke-width="1" stroke-opacity=".55"/>
    <path d="M 262 1012 C 290 1020, 320 1020, 343 1012" fill="none" stroke="#d9a441" stroke-width="2" stroke-opacity=".7"/>
    <line x1="300" y1="1019" x2="297" y2="1046" stroke="#d9a441" stroke-width="1.5" stroke-opacity=".6"/>
    <g stroke="#241e18" stroke-width="1.5" stroke-opacity=".3" fill="none">
      <path d="M 268 1130 q 2 30 0 58"/><path d="M 292 1140 q 1 26 0 50"/><path d="M 320 1140 q -1 26 0 50"/>
    </g>
  </g>
  <!-- the ember keeper wears a small × charm at the cord -->
  <path d="M 699 1048 L 707 1056 M 707 1048 L 699 1056" stroke="#d9a441" stroke-width="1.8"
    stroke-linecap="round" fill="none" opacity=".85"/>

  <!-- ── THE FAMILIAR: the arctic fox, antlered, dozing where the stone is warmest ── -->
  <g>
    <ellipse cx="706" cy="1259" rx="80" ry="9" fill="url(#shadG)"/>
    <g id="foxbody">
      <path d="M 636 1252 C 628 1226, 644 1202, 678 1194 C 714 1186, 750 1194, 764 1214
        C 776 1230, 770 1248, 748 1254 C 712 1262, 656 1262, 636 1252 Z" fill="#f5eddc"/>
      <path d="M 748 1254 C 770 1248, 776 1230, 764 1214 C 758 1206, 748 1200, 736 1196
        C 752 1206, 760 1224, 752 1238 C 746 1248, 736 1252, 726 1254 Z" fill="#e6d9bd" opacity=".85"/>
      <path d="M 636 1252 C 628 1226, 644 1202, 678 1194 C 664 1206, 654 1224, 658 1244 Z"
        fill="#d9a441" opacity=".14"/>
      <!-- ears -->
      <path d="M 646 1202 L 638 1180 L 658 1194 Z" fill="#f5eddc"/>
      <path d="M 647 1198 L 643 1187 L 653 1194 Z" fill="#c4704b" opacity=".4"/>
      <path d="M 664 1198 L 662 1177 L 678 1192 Z" fill="#f5eddc"/>
      <path d="M 665 1194 L 664 1184 L 672 1191 Z" fill="#c4704b" opacity=".4"/>
      <!-- the antlers it has grown, day by shared day -->
      <path d="M 654 1180 c 1 -9 6 -14 12 -17 m -9 9 c 5 -2 7 -6 8 -10" fill="none"
        stroke="#6b5a44" stroke-width="2" stroke-linecap="round"/>
      <path d="M 668 1178 c 2 -7 6 -11 11 -13 m -8 7 c 4 -2 6 -5 7 -8" fill="none"
        stroke="#6b5a44" stroke-width="2" stroke-linecap="round"/>
      <!-- sleeping face -->
      <path d="M 644 1208 q 7 4 14 1" fill="none" stroke="#2b2014" stroke-width="1.5"
        stroke-linecap="round" stroke-opacity=".65"/>
      <circle cx="636" cy="1216" r="1.8" fill="#8a4c33"/>
      <!-- tail curled over the paws -->
      <path d="M 632 1252 C 618 1244, 616 1230, 626 1222 C 634 1216, 648 1214, 658 1220
        C 664 1224, 664 1230, 658 1233 C 648 1228, 640 1230, 636 1236 C 633 1241, 636 1246, 644 1250 Z"
        fill="#efe4cb"/>
      <ellipse cx="656" cy="1222" rx="6" ry="4" transform="rotate(-25 656 1222)" fill="#f5eddc"/>
      <g stroke="#2b2014" stroke-width=".8" stroke-opacity=".25" fill="none">
        <path d="M 700 1194 q 4 -3 8 -3"/><path d="M 726 1198 q 4 -2 8 -1"/><path d="M 688 1258 q 6 1 12 0"/>
      </g>
    </g>
  </g>
`;
