// Pixel maps for the pet and friends. Chars map to PET_PALETTE colors;
// unmapped chars ('.') are transparent. Keep PET_KIT in sync with
// scripts/gen-icons.mjs, which renders the same fox into the app icons.
//
// The pet is an arctic fox that grows antlers as Matthew & Kennedy log
// days together: Kit -> Yearling -> Young -> Adult -> Elder. Stage sprites
// land with the pet milestone; PET_KIT is the newborn.

export const PET_PALETTE: Record<string, string> = {
  "#": "#4a3b2a", // cocoa ink (outline, eyes, nose)
  c: "#fbf6ea", // arctic cream (body)
  s: "#ece0c6", // warm shadow (shading)
  t: "#c4704b", // terracotta (inner ears, blush)
  g: "#d9a441", // muted gold (antler tips, sparkle)
  m: "#7c8a4d", // moss (accents)
};

export const PET_KIT = [
  "................",
  "..##........##..",
  ".#tt#......#tt#.",
  ".#ttc#....#ctt#.",
  ".#cccc####cccc#.",
  ".#cccccccccccc#.",
  "#cccccccccccccc#",
  "#cc#cccccccc#cc#",
  "#cccccccccccccc#",
  "#cctccc##ccctcc#",
  ".#ccccc##ccccc#.",
  ".#cccccccccccc#.",
  "..#cccccccccc#..",
  "...##cccccc##...",
  ".....######.....",
  "................",
] as const;
