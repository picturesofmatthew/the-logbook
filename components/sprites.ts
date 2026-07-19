// Pixel maps for the pet and friends. Chars map to PET_PALETTE colors;
// unmapped chars ('.') are transparent. Keep PET_HAPPY in sync with
// scripts/gen-icons.mjs, which renders the same critter into the app icons.

export const PET_PALETTE: Record<string, string> = {
  "#": "#4a3b2a", // cocoa ink
  m: "#7c8a4d", // moss
  M: "#5b6b3c", // deep moss
  t: "#c4704b", // terracotta blush
  g: "#d9a441", // muted gold
  c: "#fbf6ea", // cream
};

export const PET_HAPPY = [
  "................",
  "...##......##...",
  "..#mm#....#mm#..",
  "..#mm######mm#..",
  ".#mmmmmmmmmmmm#.",
  ".#mmmmmmmmmmmm#.",
  ".#mm#mmmmmm#mm#.",
  ".#mm#mmmmmm#mm#.",
  ".#mmmmmmmmmmmm#.",
  ".#mtmmm##mmmtm#.",
  ".#mmmmmmmmmmmm#.",
  "..#mmmmmmmmmm#..",
  "...##mmmmmm##...",
  ".....######.....",
  "................",
  "................",
] as const;
