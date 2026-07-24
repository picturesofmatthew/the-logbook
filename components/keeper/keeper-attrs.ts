// THE MANTLE ATTRIBUTES — the elected character, at hearth scale.
//
// The hearth's two keepers are hand-drawn robed figures (114 × 351 scene units,
// `hearth-svg.ts`); the 8 archetypes are square figures in a 120 box
// (`keeper-glyph.tsx`), so the glyph can't stand in for the figure. Instead each
// archetype contributes an ADDITIVE overlay — the smith's hammer and anvil, the
// navigator's sextant — drawn in the moss keeper's own scene coordinates and
// laid over the figure. The ember side reuses the same fragment inside the
// mirror transform the hearth art already applies, so one drawing serves both.
//
// Same contract as the rest of the Inklight layer (`foxSvg`, `keeperSvg`,
// `composeSeal`): a PURE composer returning inner SVG markup, deterministic and
// SSR-safe, swappable for a hand-drawn master.

import type { Slot } from "@/lib/auth";
import { lightFor } from "@/lib/keeper-light";
import { KEEPER_ARCHETYPES, type KeeperArchetype } from "./keeper-glyph";

// Attributes that need to match the cloth they hang on take the keeper's light
// through the {{ROBE}} / {{ROBE_LIGHT}} tokens. The hues are never written here
// — they resolve through lib/keeper-light, the one place a keeper's color is
// decided, so a chosen light (a later feature) reaches the mantle for free.

// ── SWAPPABLE: the eight attributes, in hearth scene coordinates ──
// Landmarks they hang on: the hand at (365, 918), the shoulder near (322, 870),
// the waist cord at y≈1012, the hem/ground at y≈1192.
export const KEEPER_ATTRS: Record<KeeperArchetype, string> = {
  // gold spectacles on the hood, a quill at the shoulder, an open gilt-edged book cupped at the hip
  scholar: `    <path d="M 336 874 L 351 833" fill="none" stroke="#241e18" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M 338 870 C 333 855, 336 841, 349 829 C 354 838, 351 857, 343 871 Z" fill="#f5eddc" stroke="#241e18" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M 341 864 C 341 852, 344 841, 348 833" fill="none" stroke="#241e18" stroke-width="1" stroke-opacity=".45"/>
    <path d="M 336 874 L 333 881" fill="none" stroke="#9c7526" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="312" cy="887" r="4.4" fill="none" stroke="#d9a441" stroke-width="1.6"/>
    <circle cx="324" cy="884.5" r="4.4" fill="none" stroke="#d9a441" stroke-width="1.6"/>
    <path d="M 316.2 886.2 Q 318.4 884.6 319.8 885.2" fill="none" stroke="#d9a441" stroke-width="1.4"/>
    <path d="M 307.6 887.6 L 305 888.6" fill="none" stroke="#d9a441" stroke-width="1.3"/>
    <path d="M 326 881.4 a 4.4 4.4 0 0 1 1.9 1.7" fill="none" stroke="#fbf6ea" stroke-width="1" stroke-opacity=".6"/>
    <path d="M 283 1040 C 272 1032, 258 1032, 250 1038 L 253 1062 C 261 1056, 273 1056, 282 1062 Z" fill="#f5eddc" stroke="#241e18" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M 283 1040 C 292 1031, 305 1030, 313 1035 L 311 1059 C 303 1054, 291 1055, 282 1062 Z" fill="#fbf6ea" stroke="#241e18" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M 283 1040 L 282 1062" fill="none" stroke="#241e18" stroke-width="1.2"/>
    <g fill="none" stroke="#241e18" stroke-width=".9" stroke-opacity=".35">
      <path d="M 257 1041 q 10 -3 21 1"/><path d="M 258 1047 q 10 -3 20 1"/>
      <path d="M 289 1039 q 9 -3 19 0"/><path d="M 289 1045 q 9 -3 18 0"/>
    </g>
    <path d="M 253 1062 C 261 1056, 273 1056, 282 1061.5 C 291 1055, 303 1054, 311 1059" fill="none" stroke="#d9a441" stroke-width="1.5" stroke-opacity=".8"/>
    <circle cx="297" cy="1063" r="4" fill="#f5eddc" stroke="#241e18" stroke-width="1.4"/>`,
  // a terracotta headband crowned with gold laurel, cream wraps on the reaching wrist, a training cloth over the shoulder
  athlete: `    <path d="M 302 849 C 289 856, 281 872, 279 893 L 291 895 C 293 875, 299 861, 309 853 Z" fill="#f5eddc" stroke="#241e18" stroke-width="1.7" stroke-linejoin="round"/>
    <path d="M 285 890 C 286 875, 291 862, 299 854" fill="none" stroke="#241e18" stroke-width="1" stroke-opacity=".35"/>
    <path d="M 279 893 L 291 895" fill="none" stroke="#c4704b" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M 305 871 C 313 866, 326 867, 331 874 L 330 880 C 325 873, 313 873, 306 878 Z" fill="#c4704b" stroke="#241e18" stroke-width="1.3" stroke-linejoin="round"/>
    <path d="M 333 878 C 330 871, 327 865, 325 858" fill="none" stroke="#9c7526" stroke-width="1.2"/>
    <ellipse cx="331" cy="869" rx="4.6" ry="2" transform="rotate(-52 331 869)" fill="#d9a441"/>
    <ellipse cx="327" cy="862" rx="4.2" ry="1.9" transform="rotate(-68 327 862)" fill="#d9a441"/>
    <ellipse cx="334" cy="875" rx="4" ry="1.8" transform="rotate(-30 334 875)" fill="#d9a441"/>
    <g fill="none" stroke="#241e18" stroke-width="4" stroke-linecap="round" stroke-opacity=".8">
      <path d="M 347 923 L 343 931"/><path d="M 352 921 L 348 929"/><path d="M 357 919 L 353 927"/>
    </g>
    <g fill="none" stroke="#f5eddc" stroke-width="2.4" stroke-linecap="round">
      <path d="M 347 923 L 343 931"/><path d="M 352 921 L 348 929"/><path d="M 357 919 L 353 927"/>
    </g>`,
  // a leather staff with a gilt pommel planted at the foot, a bedroll and buckled pack, a strap across the torso
  wanderer: `    <path d="M 251 824 L 246 1188" fill="none" stroke="#241e18" stroke-width="4.6" stroke-linecap="round"/>
    <path d="M 251 824 L 246 1188" fill="none" stroke="#6e4a2e" stroke-width="3" stroke-linecap="round"/>
    <circle cx="251.5" cy="819" r="5.6" fill="#d9a441" stroke="#241e18" stroke-width="1.5"/>
    <path d="M 247.5 816 A 5.6 5.6 0 0 1 251.5 813.4" fill="none" stroke="#f7e3ae" stroke-width="1" stroke-opacity=".7"/>
    <path d="M 250 848 L 259 843" fill="none" stroke="#6e4a2e" stroke-width="1.6" stroke-linecap="round"/>
    <rect x="223" y="886" width="46" height="13" rx="6.5" fill="#f5eddc" stroke="#241e18" stroke-width="1.6"/>
    <path d="M 234 887 L 234 898 M 256 887 L 256 898" fill="none" stroke="#241e18" stroke-width="1" stroke-opacity=".45"/>
    <path d="M 231 902 Q 225 902 226 914 L 229 952 Q 230 962 240 961 L 263 959 L 259 902 Z" fill="#6e4a2e" stroke="#241e18" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M 228 918 L 261 915" fill="none" stroke="#241e18" stroke-width="1.1" stroke-opacity=".5"/>
    <rect x="240" y="912" width="7" height="9" rx="1.5" fill="none" stroke="#d9a441" stroke-width="1.4"/>
    <path d="M 331 861 C 310 888, 285 946, 264 988" fill="none" stroke="#241e18" stroke-width="6" stroke-linecap="round" stroke-opacity=".85"/>
    <path d="M 331 861 C 310 888, 285 946, 264 988" fill="none" stroke="#6e4a2e" stroke-width="4" stroke-linecap="round"/>
    <rect x="292" y="912" width="8" height="10" rx="1.5" transform="rotate(-24 296 917)" fill="none" stroke="#d9a441" stroke-width="1.3"/>`,
  // a straw sun-hat over the hood, a watering can hung from the cord, a green sprig held out in the reaching hand
  tender: `    <ellipse cx="318" cy="871" rx="27" ry="7" fill="#ecd9a8" stroke="#241e18" stroke-width="1.8"/>
    <path d="M 296 873 Q 306 877 316 877" fill="none" stroke="#241e18" stroke-width="1" stroke-opacity=".35"/>
    <path d="M 305 869 Q 307 848 318 847 Q 329 848 331 869 Z" fill="#ecd9a8" stroke="#241e18" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M 306 866 Q 318 872 330 866" fill="none" stroke="#5b6b3c" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M 271 1016 L 267 1032" fill="none" stroke="#241e18" stroke-width="1.4"/>
    <path d="M 253 1036 L 281 1034 L 278 1060 L 257 1062 Z" fill="#d9a441" stroke="#241e18" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M 253 1036 L 281 1034" fill="none" stroke="#241e18" stroke-width="1.6"/>
    <path d="M 259 1034 Q 266 1022 276 1032" fill="none" stroke="#241e18" stroke-width="1.7"/>
    <path d="M 254 1042 L 240 1031" fill="none" stroke="#d9a441" stroke-width="4.6" stroke-linecap="round"/>
    <path d="M 240 1031 L 235 1027" fill="none" stroke="#241e18" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M 258 1040 L 257 1056" fill="none" stroke="#fbf6ea" stroke-width="1.3" stroke-opacity=".4"/>
    <path d="M 366 915 C 371 906, 374 899, 380 892 M 366 915 C 373 910, 381 906, 388 903" fill="none" stroke="#4f5d34" stroke-width="1.8" stroke-linecap="round"/>
    <ellipse cx="381" cy="891" rx="4.4" ry="2.1" transform="rotate(-48 381 891)" fill="#7c8a4d"/>
    <ellipse cx="389" cy="903" rx="4.2" ry="2" transform="rotate(-22 389 903)" fill="#7c8a4d"/>
    <ellipse cx="374" cy="901" rx="3.6" ry="1.8" transform="rotate(-60 374 901)" fill="#5b6b3c"/>
    <circle cx="384" cy="887" r="2" fill="#ecd9a8" stroke="#241e18" stroke-width="1"/>`,
  // a lit lantern hanging from the reaching hand; the crescent and stars stitched into the robe (the hood is already up)
  mystic: `    <circle cx="366" cy="943" r="17" fill="#f7e3ae" opacity=".12"/>
    <circle cx="366" cy="943" r="9" fill="#f7e3ae" opacity=".14"/>
    <path d="M 366 921 L 366 927" fill="none" stroke="#241e18" stroke-width="1.5"/>
    <circle cx="366" cy="923.5" r="2.4" fill="none" stroke="#241e18" stroke-width="1.3"/>
    <path d="M 361 933 L 371 933 L 368.5 928 L 363.5 928 Z" fill="#d9a441" stroke="#241e18" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M 360 933 L 360 953 L 372 953 L 372 933 Z" fill="#ecd9a8" stroke="#241e18" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M 366 950 q -3.2 -1.6 -1.6 -5 q .7 2 2.1 1.1 q .9 -2 -.6 -3.9 q 3.8 2 2.1 5.4 q -.8 1.7 -2 2.4 Z" fill="#d9a441" stroke="#9c7526" stroke-width=".7"/>
    <path d="M 358 953 L 374 953" fill="none" stroke="#241e18" stroke-width="2" stroke-linecap="round"/>
    <path d="M 361.5 936 L 361.5 950" fill="none" stroke="#fbf6ea" stroke-width="1" stroke-opacity=".5"/>
    <path d="M 291 1080 a 10.5 10.5 0 1 0 5.5 19 a 8 8 0 1 1 -5.5 -19 Z" fill="#9c7526" opacity=".85"/>
    <path d="M 320 1062 L 321 1065 L 324 1066 L 321 1067 L 320 1070 L 319 1067 L 316 1066 L 319 1065 Z" fill="#d9a441" opacity=".8"/>
    <path d="M 274 1122 L 274.9 1124.4 L 277.4 1125.4 L 274.9 1126.4 L 274 1129 L 273.1 1126.4 L 270.6 1125.4 L 273.1 1124.4 Z" fill="#d9a441" opacity=".7"/>
    <path d="M 311 1143 L 311.8 1145 L 314 1146 L 311.8 1147 L 311 1149 L 310.2 1147 L 308 1146 L 310.2 1145 Z" fill="#d9a441" opacity=".7"/>
    <circle cx="303" cy="1112" r="1.2" fill="#d9a441" opacity=".6"/>
    <circle cx="282" cy="1058" r="1.1" fill="#d9a441" opacity=".55"/>`,
  // a kerchief knotted at the brow, a woven basket of berries, mushroom and leaf set down at the foot
  forager: `    <path d="M 304 874 C 311 867, 326 868, 331 876 L 330 882 C 324 875, 312 876, 305 881 Z" fill="#ecd9a8" stroke="#241e18" stroke-width="1.3" stroke-linejoin="round"/>
    <path d="M 305 877 l -9 3 l 4 5 Z" fill="#ecd9a8" stroke="#241e18" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M 306 880 l -7 9 l 5 2 Z" fill="#ecd9a8" stroke="#241e18" stroke-width="1.2" stroke-linejoin="round"/>
    <ellipse cx="246" cy="1191" rx="27" ry="3.5" fill="#1e1913" opacity=".35"/>
    <path d="M 231 1171 Q 246 1150 261 1171" fill="none" stroke="#241e18" stroke-width="1.8"/>
    <circle cx="237" cy="1166" r="3.6" fill="#c4704b" stroke="#241e18" stroke-width="1.1"/>
    <circle cx="247" cy="1168" r="3" fill="#c4704b" stroke="#241e18" stroke-width="1.1"/>
    <path d="M 253 1168 q 0 -7 6.5 -7 q 6.5 0 6.5 7 Z" fill="#f5eddc" stroke="#241e18" stroke-width="1.2"/>
    <path d="M 259 1168 L 259 1172" fill="none" stroke="#241e18" stroke-width="1.3"/>
    <ellipse cx="228" cy="1164" rx="4" ry="1.8" transform="rotate(-35 228 1164)" fill="#7c8a4d"/>
    <path d="M 221 1173 A 25 17 0 0 0 271 1173 Z" fill="#d9a441" stroke="#241e18" stroke-width="1.8"/>
    <g fill="none" stroke="#9c7526" stroke-width="1.1" stroke-opacity=".8">
      <path d="M 231 1175 q 2 8 6 12"/><path d="M 243 1176 q 1 8 2 13"/><path d="M 256 1175 q -1 8 -4 12"/>
      <path d="M 222 1180 q 24 7 48 0"/>
    </g>
    <path d="M 218 1173 L 274 1173" fill="none" stroke="#241e18" stroke-width="2.2" stroke-linecap="round"/>`,
  // a leather apron over the robe, an iron hammer shouldered, an anvil and its gold spark at the foot
  smith: `    <ellipse cx="242" cy="1193" rx="27" ry="3.5" fill="#1e1913" opacity=".35"/>
    <path d="M 219 1150 L 255 1150 L 267 1154 L 255 1161 L 221 1161 Z" fill="#241e18"/>
    <path d="M 233 1161 L 249 1161 L 251 1176 L 231 1176 Z" fill="#241e18"/>
    <path d="M 225 1176 L 257 1176 L 253 1190 L 229 1190 Z" fill="#241e18"/>
    <path d="M 221 1150 L 255 1150" fill="none" stroke="#d9a441" stroke-width="1" stroke-opacity=".65"/>
    <path d="M 267 1154 L 255 1161" fill="none" stroke="#d9a441" stroke-width=".9" stroke-opacity=".4"/>
    <path d="M 262 1136 L 263.4 1139.6 L 267 1141 L 263.4 1142.4 L 262 1146 L 260.6 1142.4 L 257 1141 L 260.6 1139.6 Z" fill="#d9a441"/>
    <path d="M 262 1128 L 262 1131 M 254 1133 L 256 1135 M 270 1133 L 268 1135" fill="none" stroke="#f7e3ae" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M 302 934 L 310 906 M 330 934 L 322 906" fill="none" stroke="#6e4a2e" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M 298 934 C 306 930, 326 930, 334 934 L 337 1006 L 349 1012 L 354 1162 C 327 1174, 287 1174, 260 1162 L 265 1012 L 277 1006 L 281 934 Z" fill="#6e4a2e" stroke="#241e18" stroke-width="2" stroke-linejoin="round"/>
    <path d="M 302 940 C 308 937, 324 937, 330 940" fill="none" stroke="#9c7526" stroke-width="1" stroke-dasharray="4 3" stroke-opacity=".7"/>
    <path d="M 269 1018 L 273 1156 M 347 1018 L 349 1156" fill="none" stroke="#9c7526" stroke-width="1" stroke-dasharray="4 3" stroke-opacity=".5"/>
    <path d="M 300 1078 L 334 1078 L 332 1106 L 302 1106 Z" fill="#241e18" fill-opacity=".22" stroke="#241e18" stroke-width="1.2" stroke-opacity=".5"/>
    <path d="M 265 1013 C 292 1021, 322 1021, 350 1013" fill="none" stroke="#241e18" stroke-width="4.6" stroke-linecap="round" stroke-opacity=".85"/>
    <path d="M 265 1013 C 292 1021, 322 1021, 350 1013" fill="none" stroke="#6e4a2e" stroke-width="3" stroke-linecap="round"/>
    <path d="M 344 1016 l 6 8 M 348 1015 l 9 5" fill="none" stroke="#6e4a2e" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M 292 954 L 265 866" fill="none" stroke="#241e18" stroke-width="5.6" stroke-linecap="round"/>
    <path d="M 292 954 L 265 866" fill="none" stroke="#6e4a2e" stroke-width="3.6" stroke-linecap="round"/>
    <path d="M 249 858 L 281 850 L 284 863 L 252 871 Z" fill="#241e18"/>
    <path d="M 251 858 L 280 851" fill="none" stroke="#d9a441" stroke-width="1" stroke-opacity=".6"/>
    <path d="M 281 851 L 284 862" fill="none" stroke="#f5eddc" stroke-width="1.2" stroke-opacity=".4"/>
    <circle cx="291" cy="950" r="4" fill="#f5eddc" stroke="#241e18" stroke-width="1.4"/>`,
  // a gilt-trimmed bicorne on the hood, a sextant on a lanyard at the cord, a rolled chart tucked beside it
  navigator: `    <path d="M 291 869 Q 318 837 345 869 Q 331 860 318 861 Q 305 860 291 869 Z" fill="#9c7526" stroke="#241e18" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M 295 866 Q 318 873 341 866" fill="none" stroke="#d9a441" stroke-width="1.5"/>
    <path d="M 318 852 L 319.3 855.7 L 323 857 L 319.3 858.3 L 318 862 L 316.7 858.3 L 313 857 L 316.7 855.7 Z" fill="#d9a441" stroke="#241e18" stroke-width=".8"/>
    <g transform="rotate(-22 344 1002)">
      <rect x="339" y="980" width="10" height="44" rx="5" fill="#f5eddc" stroke="#241e18" stroke-width="1.3"/>
      <rect x="339" y="1000" width="10" height="6" fill="#c4704b"/>
      <ellipse cx="344" cy="980" rx="5" ry="2.2" fill="#ecd9a8" stroke="#241e18" stroke-width=".9"/>
    </g>
    <path d="M 277 1017 C 279 1024, 280 1030, 281 1036" fill="none" stroke="#241e18" stroke-width="1.3"/>
    <path d="M 281 1036 L 268 1062 L 295 1062 Z" fill="none" stroke="#d9a441" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M 267 1063 A 19 19 0 0 0 296 1063" fill="none" stroke="#d9a441" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M 281 1036 L 287 1066" fill="none" stroke="#241e18" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M 273 1048 L 285 1041" fill="none" stroke="#241e18" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="281" cy="1036" r="1.8" fill="#d9a441" stroke="#241e18" stroke-width=".8"/>`,
};

export function isKeeperArchetype(v: string | null): v is KeeperArchetype {
  return v != null && KEEPER_ARCHETYPES.some((a) => a.id === v);
}

// An elected character + which side of the mantle they keep → the overlay
// markup. Unknown or unelected characters draw nothing: the mantle simply keeps
// the two robed figures it has always had.
export function keeperAttrSvg(
  character: string | null,
  slot: Slot,
  chosenLight?: string | null,
): string {
  if (!isKeeperArchetype(character)) return "";
  const robe = lightFor(slot, chosenLight);
  return KEEPER_ATTRS[character]
    .replaceAll("{{ROBE_LIGHT}}", robe.light)
    .replaceAll("{{ROBE}}", robe.main);
}
