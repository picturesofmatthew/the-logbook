// Marks already-applied migrations as applied in drizzle's bookkeeping
// table WITHOUT running their SQL. Used once to adopt versioned migrations
// on a database that was previously managed with `drizzle-kit push` —
// the baseline migration describes tables that already exist in prod.
//
// Idempotent: rows are only inserted for journal entries newer than the
// last recorded migration. Safe to re-run.
//
// Usage: node scripts/baseline-migrations.mjs

import crypto from "node:crypto";
import fs from "node:fs";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");
const sql = neon(url);

const folder = "db/migrations";
const journal = JSON.parse(
  fs.readFileSync(`${folder}/meta/_journal.json`, "utf8"),
);

await sql`CREATE SCHEMA IF NOT EXISTS drizzle`;
await sql`
  CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
    id SERIAL PRIMARY KEY,
    hash text NOT NULL,
    created_at bigint
  )
`;

const last = await sql`
  SELECT created_at FROM drizzle.__drizzle_migrations
  ORDER BY created_at DESC LIMIT 1
`;
const lastAt = last[0] ? Number(last[0].created_at) : 0;

let marked = 0;
for (const entry of journal.entries) {
  if (entry.when <= lastAt) continue;
  const text = fs.readFileSync(`${folder}/${entry.tag}.sql`, "utf8");
  const hash = crypto.createHash("sha256").update(text).digest("hex");
  await sql`
    INSERT INTO drizzle.__drizzle_migrations ("hash", "created_at")
    VALUES (${hash}, ${entry.when})
  `;
  console.log(`marked as applied: ${entry.tag}`);
  marked += 1;
}
console.log(marked === 0 ? "nothing to mark — up to date" : `done (${marked})`);
