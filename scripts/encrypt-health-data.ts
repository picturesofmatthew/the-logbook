// Cutover backfill: encrypt the existing plaintext health data (day_meta.note,
// day_meta.mood, weigh_ins.weight_lb) in place, AFTER migration 0008 changes
// weight_lb to text. Idempotent — a value that already decrypts is skipped, so
// a re-run never double-encrypts.
//
// Needs ENCRYPTION_KEY (and DATABASE_URL) in .env.local. Run with tsx:
//   node --import tsx scripts/encrypt-health-data.ts
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { decrypt, encrypt } from "../lib/crypto";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)="?([^"\r\n]*)"?\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const sql = neon(process.env.DATABASE_URL!);

// Encrypt only if it's still plaintext (already-encrypted values decrypt).
const enc = (v: string | null): string | null =>
  v == null || v === "" ? null : decrypt(v) != null ? v : encrypt(v);

const metas = await sql`SELECT profile_id, day, note, mood FROM day_meta`;
let mc = 0;
for (const m of metas) {
  const note = enc(m.note);
  const mood = enc(m.mood);
  if (note !== m.note || mood !== m.mood) {
    await sql`UPDATE day_meta SET note = ${note}, mood = ${mood}
              WHERE profile_id = ${m.profile_id} AND day = ${m.day}`;
    mc++;
  }
}
console.log(`day_meta: encrypted ${mc} row(s)`);

const weighs = await sql`SELECT profile_id, day, weight_lb FROM weigh_ins`;
let wc = 0;
for (const w of weighs) {
  const encW = enc(w.weight_lb);
  if (encW !== w.weight_lb) {
    await sql`UPDATE weigh_ins SET weight_lb = ${encW}
              WHERE profile_id = ${w.profile_id} AND day = ${w.day}`;
    wc++;
  }
}
console.log(`weigh_ins: encrypted ${wc} row(s)`);
console.log("health-data encryption backfill complete.");
