// Seeds the two profiles and the (unnamed) fox. Idempotent.
// Run: node scripts/seed.mjs
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)="?([^"\r\n]*)"?\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const sql = neon(process.env.DATABASE_URL);

await sql`
  INSERT INTO profiles (id, display_name) VALUES
    ('matthew', 'Matthew'),
    ('kennedy', 'Kennedy')
  ON CONFLICT (id) DO NOTHING
`;
await sql`
  INSERT INTO pet (id) VALUES (1)
  ON CONFLICT (id) DO NOTHING
`;

// The first Dream — the far shore both keepers build toward. Seeded once; if an
// active shore already exists we leave it alone. `distance_days` is the tuning
// knob (a reachable first shore); `started_day` back-dates to the couple's first
// both-logged day so planks already earned count toward Kauai from day one.
await sql`
  INSERT INTO dreams (name, distance_days, started_day, status)
  SELECT 'Kauai', 14,
    COALESCE(
      (SELECT MIN(day) FROM (
         SELECT day FROM entries GROUP BY day HAVING COUNT(DISTINCT profile_id) >= 2
       ) both_days),
      CURRENT_DATE
    ),
    'active'
  WHERE NOT EXISTS (SELECT 1 FROM dreams WHERE status = 'active')
`;

const rows = await sql`SELECT id, display_name FROM profiles ORDER BY id`;
console.log("profiles:", rows.map((r) => r.id).join(", "));
const [dream] = await sql`SELECT name, distance_days, started_day FROM dreams WHERE status = 'active' LIMIT 1`;
if (dream) {
  console.log(`the far shore: ${dream.name} — ${dream.distance_days} planks, from ${dream.started_day}.`);
}
console.log("the fox is waiting to be named.");
