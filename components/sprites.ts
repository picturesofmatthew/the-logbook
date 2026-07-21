// Pixel maps for the arctic fox. Chars map to FAMILIAR_PALETTE colors; unmapped
// chars ('.') are transparent. The fox grows antlers as Matthew & Kennedy log
// days together — stage art below, stage thresholds in lib/engine/familiar.ts.
// scripts/gen-icons.mjs renders the kit into the app icons (adult at ship).

export const FAMILIAR_PALETTE: Record<string, string> = {
  "#": "#4a3b2a", // cocoa ink (outline, eyes, nose, antlers)
  c: "#fbf6ea", // arctic cream (body)
  s: "#ece0c6", // warm shadow (snout)
  t: "#c4704b", // terracotta (inner ears, blush)
  g: "#d9a441", // muted gold (antler tips)
  m: "#7c8a4d", // moss (accents)
};

export const FAMILIAR_KIT = [
  "................",
  "..##........##..",
  ".#tt#......#tt#.",
  ".#ttc#....#ctt#.",
  ".#cccc####cccc#.",
  ".#cccccccccccc#.",
  "#cccccccccccccc#",
  "#cc#cccccccc#cc#",
  "#cccccccccccccc#",
  "#cctcccssccctcc#",
  "#cccccs##sccccc#",
  "#cccccssssccccc#",
  ".#ccccsssscccc#.",
  "..#cccssssccc#..",
  "...##cccccc##...",
  ".....######.....",
];

export const FAMILIAR_YEARLING = [
  "...g........g...",
  "...#........#...",
  "..##........##..",
  ".#tt#......#tt#.",
  ".#ttc#....#ctt#.",
  ".#cccc####cccc#.",
  ".#cccccccccccc#.",
  "#cccccccccccccc#",
  "#cc#cccccccc#cc#",
  "#cccccccccccccc#",
  "#cctcccssccctcc#",
  ".#cccss##ssccc#.",
  ".#ccccsssscccc#.",
  "..#cccssssccc#..",
  "...##cccccc##...",
  ".....######.....",
];

// Grown stages share the same face; only the antlers change.
const GROWN_EARS = [
  "....##..#......#..##....",
  "...#tt#.#......#.#tt#...",
  "...#ttc#.#....#.#ctt#...",
];

const GROWN_FACE = [
  "...#ccc##########ccc#...",
  "..#cccccccccccccccccc#..",
  ".#cccccccccccccccccccc#.",
  ".#cccc##cccccccc##cccc#.",
  ".#cccccccccccccccccccc#.",
  "#cctccccc######ccccctcc#",
  "#ccccccc#ssssss#ccccccc#",
  "#cccccc#ssssssss#cccccc#",
  ".#ccccc#sss##sss#ccccc#.",
  "..#cccc#ssssssss#cccc#..",
  "...##ccc#ssssss#ccc##...",
  "......############......",
];

export const FAMILIAR_YOUNG = [
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........g......g........",
  "........#......#........",
  "........#......#........",
  "........#......#........",
  ...GROWN_EARS,
  ...GROWN_FACE,
];

export const FAMILIAR_ADULT = [
  "........................",
  ".....g............g.....",
  ".....#..g......g..#.....",
  "......#.#......#.#......",
  ".......##......##.......",
  "........#......#........",
  "........#......#........",
  "........#......#........",
  "........#......#........",
  ...GROWN_EARS,
  ...GROWN_FACE,
];

export const FAMILIAR_ELDER = [
  ".....g..g......g..g.....",
  ".....#..#.g..g.#..#.....",
  "......#.#.#..#.#.#......",
  ".......###....###.......",
  "........#......#........",
  "........#......#........",
  "........#......#........",
  "........#......#........",
  "........#......#........",
  ...GROWN_EARS,
  ...GROWN_FACE,
];

export const FAMILIAR_SPRITES = {
  kit: FAMILIAR_KIT,
  yearling: FAMILIAR_YEARLING,
  young: FAMILIAR_YOUNG,
  adult: FAMILIAR_ADULT,
  elder: FAMILIAR_ELDER,
} as const;
