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

const rows = await sql`SELECT id, display_name FROM profiles ORDER BY id`;
console.log("profiles:", rows.map((r) => r.id).join(", "));
console.log("the fox is waiting to be named.");
