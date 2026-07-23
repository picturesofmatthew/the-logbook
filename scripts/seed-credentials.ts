// One-time (B2 cutover): give the two original keepers their login credentials.
// Their B1 profiles have null email/password_hash, so they can't sign in under
// B2 until this runs. Passwords are read from env vars so they never land in a
// file. Run it YOURSELF (so I never see the passwords), via tsx:
//
//   MATTHEW_EMAIL="you@x.com" MATTHEW_PASSWORD="…" \
//   KENNEDY_EMAIL="her@x.com" KENNEDY_PASSWORD="…" \
//   node --import tsx scripts/seed-credentials.ts
//
// (In PowerShell: set $env:MATTHEW_EMAIL="…" etc. first, then run the node line.)
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { hashPassword } from "../lib/passwords";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)="?([^"\r\n]*)"?\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const sql = neon(process.env.DATABASE_URL!);

const keepers = [
  {
    id: "matthew",
    email: process.env.MATTHEW_EMAIL,
    password: process.env.MATTHEW_PASSWORD,
  },
  {
    id: "kennedy",
    email: process.env.KENNEDY_EMAIL,
    password: process.env.KENNEDY_PASSWORD,
  },
];

for (const k of keepers) {
  if (!k.email || !k.password) {
    console.error(`✖ missing ${k.id.toUpperCase()}_EMAIL / _PASSWORD`);
    process.exit(1);
  }
  if (k.password.length < 8) {
    console.error(`✖ ${k.id}'s password must be at least 8 characters`);
    process.exit(1);
  }
  const hash = await hashPassword(k.password);
  const rows = await sql`
    UPDATE profiles SET email = ${k.email.toLowerCase()}, password_hash = ${hash}
    WHERE id = ${k.id} RETURNING id`;
  console.log(
    rows.length
      ? `✓ ${k.id} → ${k.email.toLowerCase()}`
      : `✖ no profile with id '${k.id}' (already migrated to a uuid?)`,
  );
}
console.log("done — the two keepers can now sign in with email + password.");
