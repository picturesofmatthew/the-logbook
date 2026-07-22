// Backfill the tenancy spine: create the one existing bond and stamp bond_id on
// every per-bond row, assign moss/ember slots, and dedupe the food museum so the
// UNIQUE(lower(name)) index in migration 0005 can build. Idempotent + re-runnable
// (uses `WHERE bond_id IS NULL`), so a mid-run failure is safe to retry.
//
// Run BETWEEN migration 0004 (adds nullable bond_id) and 0005 (SET NOT NULL):
//   node scripts/backfill-bonds.mjs
import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)="?([^"\r\n]*)"?\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const sql = neon(process.env.DATABASE_URL);

// 1. The one existing bond (idempotent — reuse it if the backfill already ran).
let [bond] = await sql`SELECT id FROM bonds LIMIT 1`;
if (!bond) {
  const id = randomUUID();
  await sql`INSERT INTO bonds (id, kind) VALUES (${id}, 'couple')`;
  bond = { id };
  console.log(`created bond ${id} (kind: couple)`);
} else {
  console.log(`reusing existing bond ${bond.id}`);
}
const bondId = bond.id;

// 2. Stamp bond_id on every per-bond table (only rows not yet stamped).
//    Explicit per-table statements — a table name can't be a bound parameter,
//    and the tagged-template form is the API path proven in seed.mjs.
await sql`UPDATE profiles SET bond_id = ${bondId} WHERE bond_id IS NULL`;
await sql`UPDATE targets SET bond_id = ${bondId} WHERE bond_id IS NULL`;
await sql`UPDATE entries SET bond_id = ${bondId} WHERE bond_id IS NULL`;
await sql`UPDATE weigh_ins SET bond_id = ${bondId} WHERE bond_id IS NULL`;
await sql`UPDATE day_meta SET bond_id = ${bondId} WHERE bond_id IS NULL`;
await sql`UPDATE workouts SET bond_id = ${bondId} WHERE bond_id IS NULL`;
await sql`UPDATE dreams SET bond_id = ${bondId} WHERE bond_id IS NULL`;
await sql`UPDATE sigil_discoveries SET bond_id = ${bondId} WHERE bond_id IS NULL`;
await sql`UPDATE being_arrivals SET bond_id = ${bondId} WHERE bond_id IS NULL`;
await sql`UPDATE pet SET bond_id = ${bondId} WHERE bond_id IS NULL`;
const [{ profiles: pc }] = await sql`SELECT COUNT(*)::int AS profiles FROM profiles WHERE bond_id = ${bondId}`;
const [{ entries: ec }] = await sql`SELECT COUNT(*)::int AS entries FROM entries WHERE bond_id = ${bondId}`;
console.log(`  stamped bond_id — ${pc} profile(s), ${ec} entr(y/ies), + 8 other tables`);

// 3. Slots: the existing couple keeps today's binding (matthew=moss,
//    kennedy=ember), matching the engine's moss=matthew / ember=kennedy.
await sql`UPDATE profiles SET slot = 'moss' WHERE id = 'matthew' AND slot IS NULL`;
await sql`UPDATE profiles SET slot = 'ember' WHERE id = 'kennedy' AND slot IS NULL`;
const unslotted = await sql`SELECT id FROM profiles WHERE slot IS NULL`;
if (unslotted.length) {
  console.warn(
    `  ⚠ ${unslotted.length} profile(s) still without a slot: ${unslotted
      .map((r) => r.id)
      .join(", ")} — assign moss/ember before running 0005.`,
  );
} else {
  console.log("  slots assigned: matthew=moss, kennedy=ember");
}

// 4. Dedupe the shared museum by lower(name). The donate flow already prevents
//    case-insensitive dupes at insert (log/actions.ts checks lower(name)), so
//    this is expected to find nothing — it's the safety net before the unique
//    index. Merges losers into the lowest-id survivor.
const dupes = await sql`
  SELECT lower(name) AS lname, array_agg(id ORDER BY id) AS ids
  FROM foods GROUP BY lower(name) HAVING COUNT(*) > 1
`;
if (!dupes.length) {
  console.log("  food museum: no case-insensitive duplicates");
}
for (const d of dupes) {
  const [survivor, ...losers] = d.ids;
  for (const loser of losers) {
    await sql`UPDATE entries SET food_id = ${survivor} WHERE food_id = ${loser}`;
    // Repoint recipe ingredient references off the loser before it's deleted.
    await sql`UPDATE recipe_items SET ingredient_food_id = ${survivor}
              WHERE ingredient_food_id = ${loser}
              AND recipe_food_id NOT IN (
                SELECT recipe_food_id FROM recipe_items WHERE ingredient_food_id = ${survivor}
              )`;
    const isRecipe = await sql`SELECT 1 FROM recipe_items WHERE recipe_food_id = ${loser} LIMIT 1`;
    if (isRecipe.length) {
      console.warn(
        `  ⚠ dup "${d.lname}" (food ${loser}) is itself a recipe — review manually, skipping delete.`,
      );
      continue;
    }
    await sql`DELETE FROM foods WHERE id = ${loser}`;
  }
  console.log(`  merged ${losers.length} dup(s) of "${d.lname}" into food ${survivor}`);
}

console.log(`\nbackfill complete for bond ${bondId}. Safe to apply migration 0005.`);
