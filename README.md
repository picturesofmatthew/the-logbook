# The Logbook 🦊

A food museum for two. Matthew & Kennedy track calories, meals, and macros
through a safe, nourishing cut — Animal Crossing museum × Tamagotchi, in
earth tones on warm paper.

**The core trick:** the first time either person logs a new food, it's
*donated* to the shared museum as a specimen card (macros, discoverer,
date). The collection **is** the food database, so daily logging converges
to 2–3 taps. A shared arctic fox grows antlers as you log days together —
kit → yearling → young → adult → elder. It never scolds; at worst it gets
a little lonely.

## Stack

Next.js 16 (App Router) · Tailwind v4 · Drizzle + Neon Postgres ·
USDA FoodData Central (donations only) · Vercel · installable PWA.
No auth service — a shared passcode signs an HMAC session cookie.

## Commands

```
npm run dev      # local dev
npm run build    # production build
npm test         # engine unit tests (totals, TDEE, pet, stamps)
npm run seed     # seed profiles + pet (idempotent)
npm run icons    # regenerate pixel icons from the sprite map
npx drizzle-kit push   # push schema changes to Neon
```

## Environment

Copy `.env.example` → `.env.local`. Vars: `DATABASE_URL` (Neon, via
Vercel marketplace), `APP_PASSCODE` (the shared secret word),
`AUTH_SECRET` (cookie signing), `FDC_API_KEY` (free at
https://api.data.gov/signup — `DEMO_KEY` works but is tightly
rate-limited).

## Where things live

- `lib/engine/` — pure logic: totals, TDEE calculator, pet growth/moods, stamps
- `components/sprites.ts` — the fox pixel maps (preview with `scripts/preview-sprite.mjs`)
- `db/schema.ts` — profiles, targets (history), foods/specimens, recipe_items, entries, weigh_ins, day_meta, pet
- `app/` — journal (`/`), museum, trends, settings, enter (the door)
