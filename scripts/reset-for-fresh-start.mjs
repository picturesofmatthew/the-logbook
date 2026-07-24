// DESTRUCTIVE — wipes ALL user data (keeps the schema) so the B2 cutover can end
// with a clean, real signup + invite. Run AFTER migrations 0006–0009 are applied
// (it clears the sessions/invites tables too). Guarded: pass --confirm to run.
//
//   node scripts/reset-for-fresh-start.mjs --confirm
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

if (!process.argv.includes("--confirm")) {
  console.error(
    "Refusing to run without --confirm — this deletes ALL user data.",
  );
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)="?([^"\r\n]*)"?\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const sql = neon(process.env.DATABASE_URL);

// FK-safe order: children before parents.
await sql`DELETE FROM sessions`;
await sql`DELETE FROM invites`;
await sql`DELETE FROM entries`;
await sql`DELETE FROM voice_notes`;
await sql`DELETE FROM weigh_ins`;
await sql`DELETE FROM day_meta`;
await sql`DELETE FROM targets`;
await sql`DELETE FROM workout_sets`;
await sql`DELETE FROM workouts`;
await sql`DELETE FROM sigil_discoveries`;
await sql`DELETE FROM being_arrivals`;
await sql`DELETE FROM dreams`;
await sql`DELETE FROM pet`;
await sql`DELETE FROM recipe_items`;
await sql`DELETE FROM foods`;
await sql`DELETE FROM profiles`;
await sql`DELETE FROM bonds`;

console.log("wiped. fresh start ready — sign up at /join, then /invite Kennedy.");
