# Signed × Sealed

A **two-player-mandatory** logbook for couples and gym partners, reframed as a shared arcane grimoire.
Two people log food + workouts; each day composes a deterministic **sigil (the seal)** from *both*
their data — and **the seal cannot close alone.** That one rule is the product.

Retention runs on *the spell you can only cast together* and an *accumulating shared book* — no
streaks, never punishing. The world states the score wordlessly.

**Live:** https://www.signedxsealed.com · IG [@signed_x_sealed](https://instagram.com/signed_x_sealed)

## Stack

Next.js 16 (App Router) · Tailwind v4 · Drizzle + Neon Postgres · USDA FoodData Central (food
donations only) · Vercel · installable PWA with an offline fallback. Real accounts (email/password,
DB-backed sessions); consumer-health data (notes, mood, weight, voice notes) is **encrypted at rest**.

## Commands

```
npm run dev      # local dev
npm run build    # production build
npm test         # engine unit tests (pure logic in lib/engine/*)
npm run icons    # regenerate app icons
npx drizzle-kit generate   # write a versioned migration after editing db/schema.ts
npm run migrate            # apply pending migrations to Neon
```

Schema changes are versioned: edit `db/schema.ts`, then `generate` + `migrate` (never `push` — history
lives in `db/migrations/`).

## Environment

Copy `.env.example` → `.env.local`. Key vars: `DATABASE_URL` (Neon), `ENCRYPTION_KEY` (32-byte hex —
at-rest encryption; never rotate once data exists), `COUPLE_TZ` (the shared day-bucketing timezone),
and `FDC_API_KEY` (free at https://api.data.gov/signup), plus the session-signing secret. See
`.env.example` for the full list.

## Orientation (for contributors)

Read **`PROJECT-BRAIN.md`** first. Canon: `BRAND-BIBLE.md` (brand bedrock), `THE-LIGHTHOUSE.md` (the
world), `WORLD-ENGINE.md` (how it's built), `art/ART-BIBLE.md` (Inklight art direction). The pure
engine + its unit tests live in `lib/engine/*` (`npm test`).
