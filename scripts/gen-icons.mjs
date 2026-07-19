// Generates the PWA/app icons as PNGs from a pixel map — no image tooling needed.
// Run: node scripts/gen-icons.mjs
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Keep in sync with components/sprites.ts (PET_HAPPY)
const SPRITE = [
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
];

const COLORS = {
  ".": null, // paper shows through
  "#": [0x4a, 0x3b, 0x2a], // cocoa ink
  m: [0x7c, 0x8a, 0x4d], // moss
  M: [0x5b, 0x6b, 0x3c], // deep moss
  t: [0xc4, 0x70, 0x4b], // terracotta blush
  g: [0xd9, 0xa4, 0x41], // muted gold
};
const PAPER = [0xf5, 0xed, 0xdc];

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
  out.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, "ascii"), data])), 8 + data.length);
  return out;
}

function encodePng(size, pixels) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: truecolor RGB
  const raw = Buffer.alloc(size * (size * 3 + 1));
  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 3 + 1);
    raw[rowStart] = 0; // filter: none
    pixels.copy(raw, rowStart + 1, y * size * 3, (y + 1) * size * 3);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function renderIcon(size) {
  const grid = SPRITE.length;
  const cell = Math.floor((size * 0.62) / grid);
  const offset = Math.floor((size - cell * grid) / 2);
  const px = Buffer.alloc(size * size * 3);
  for (let i = 0; i < size * size; i++) {
    px[i * 3] = PAPER[0];
    px[i * 3 + 1] = PAPER[1];
    px[i * 3 + 2] = PAPER[2];
  }
  for (let sy = 0; sy < grid; sy++) {
    for (let sx = 0; sx < grid; sx++) {
      const color = COLORS[SPRITE[sy][sx]];
      if (!color) continue;
      for (let dy = 0; dy < cell; dy++) {
        for (let dx = 0; dx < cell; dx++) {
          const x = offset + sx * cell + dx;
          const y = offset + sy * cell + dy;
          const i = (y * size + x) * 3;
          px[i] = color[0];
          px[i + 1] = color[1];
          px[i + 2] = color[2];
        }
      }
    }
  }
  return encodePng(size, px);
}

mkdirSync(join(root, "public"), { recursive: true });
const targets = [
  ["public/icon-192.png", 192],
  ["public/icon-512.png", 512],
  ["app/icon.png", 192],
  ["app/apple-icon.png", 180],
];
for (const [file, size] of targets) {
  writeFileSync(join(root, file), renderIcon(size));
  console.log(`wrote ${file} (${size}x${size})`);
}
