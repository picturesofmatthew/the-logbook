// Dev tool: renders sprite maps to PNGs for visual checking.
// Usage: node scripts/preview-sprite.mjs <outDir>
// Reads every exported *_MAP-style const from components/sprites.ts is TS,
// so maps to preview are duplicated here temporarily during art iteration.
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const outDir = process.argv[2] || ".";
mkdirSync(outDir, { recursive: true });

const PALETTE = {
  "#": [0x4a, 0x3b, 0x2a], // cocoa outline
  c: [0xfb, 0xf6, 0xea], // arctic cream
  s: [0xec, 0xe0, 0xc6], // warm shadow
  t: [0xc4, 0x70, 0x4b], // terracotta
  g: [0xd9, 0xa4, 0x41], // muted gold
  m: [0x7c, 0x8a, 0x4d], // moss
};
const BG = [0xf5, 0xed, 0xdc]; // paper

const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const out = Buffer.alloc(8 + data.length + 4);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "ascii");
  data.copy(out, 8);
  out.writeUInt32BE(
    crc32(Buffer.concat([Buffer.from(type, "ascii"), data])),
    8 + data.length,
  );
  return out;
}
function png(w, h, pixels) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const raw = Buffer.alloc(h * (w * 3 + 1));
  for (let y = 0; y < h; y++) {
    const rs = y * (w * 3 + 1);
    raw[rs] = 0;
    pixels.copy(raw, rs + 1, y * w * 3, (y + 1) * w * 3);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

export function render(name, map, scale = 12) {
  const gh = map.length;
  const gw = Math.max(...map.map((r) => r.length));
  const badRows = map
    .map((r, i) => [r.length, i])
    .filter(([len]) => len !== gw);
  if (badRows.length) {
    console.log(
      `!! ${name}: uneven rows (width ${gw}): rows ${badRows.map(([, i]) => i).join(", ")}`,
    );
  }
  const w = gw * scale;
  const h = gh * scale;
  const px = Buffer.alloc(w * h * 3);
  for (let i = 0; i < w * h; i++) {
    px[i * 3] = BG[0];
    px[i * 3 + 1] = BG[1];
    px[i * 3 + 2] = BG[2];
  }
  for (let sy = 0; sy < gh; sy++) {
    for (let sx = 0; sx < (map[sy] || "").length; sx++) {
      const color = PALETTE[map[sy][sx]];
      if (!color) continue;
      for (let dy = 0; dy < scale; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          const i = ((sy * scale + dy) * w + sx * scale + dx) * 3;
          px[i] = color[0];
          px[i + 1] = color[1];
          px[i + 2] = color[2];
        }
      }
    }
  }
  writeFileSync(join(outDir, `${name}.png`), png(w, h, px));
  console.log(`wrote ${name}.png (${gw}x${gh})`);
}

// ---- maps under iteration ----

// Shared face rows (r12-r23) so every grown stage has the same fox.
const FACE = [
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

const EARS_PLAIN = [
  "....##............##....",
  "...#tt#..........#tt#...",
  "...#ttc#........#ctt#...",
];

const EARS_WITH_BEAMS = [
  "....##..#......#..##....",
  "...#tt#.#......#.#tt#...",
  "...#ttc#.#....#.#ctt#...",
];

const YOUNG = [
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........g......g........",
  "........#......#........",
  "........#......#........",
  "........#......#........",
  ...EARS_WITH_BEAMS,
  ...FACE,
];

const ADULT = [
  "........................",
  ".....g............g.....",
  ".....#..g......g..#.....",
  "......#.#......#.#......",
  ".......##......##.......",
  "........#......#........",
  "........#......#........",
  "........#......#........",
  "........#......#........",
  ...EARS_WITH_BEAMS,
  ...FACE,
];

const ELDER = [
  ".....g..g......g..g.....",
  ".....#..#.g..g.#..#.....",
  "......#.#.#..#.#.#......",
  ".......###....###.......",
  "........#......#........",
  "........#......#........",
  "........#......#........",
  "........#......#........",
  "........#......#........",
  ...EARS_WITH_BEAMS,
  ...FACE,
];

// Yearling: the kit face with two shy nubs.
const YEARLING = [
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
  "#cctccc##ccctcc#",
  ".#ccccc##ccccc#.",
  ".#cccccccccccc#.",
  "..#cccccccccc#..",
  "...##cccccc##...",
  ".....######.....",
];

render("young", YOUNG);
render("adult", ADULT);
render("elder", ELDER);
render("yearling", YEARLING);
