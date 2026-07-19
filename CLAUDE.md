@AGENTS.md

## Quick Resume

- **Current focus:** shipped v1 to Vercel (all six build milestones done)
- **Last meaningful change:** full v1 build — journal, museum, fox, trends, chimes, recipes; deployed via `vercel --prod`
- **Open questions:** passcode is still the placeholder `mochi` (change via `vercel env`); `FDC_API_KEY` is `DEMO_KEY` — grab a free key at https://api.data.gov/signup when USDA searches start rate-limiting

## Project notes

- Two users only: `matthew` and `kennedy` (profile ids are hardcoded in `lib/auth.ts`)
- The pet is a shared arctic fox that grows antlers by **lifetime both-logged days** (thresholds in `lib/engine/pet.ts`); it is never punished — tone rule: no red numbers, no broken streaks, over-target renders in soft terracotta
- The museum collection IS the food database; USDA is only touched when donating a new specimen
- Engine logic (`lib/engine/*`) is pure and unit-tested: `npm test`
- Sprites are string maps in `components/sprites.ts`; preview to PNG with `node scripts/preview-sprite.mjs <outDir>`; icons regenerate with `npm run icons`
- "Today" follows a timezone cookie (`components/tz-sync.tsx`) — survives the move to Chiang Mai
- DB is Neon via the Vercel marketplace integration; schema changes: edit `db/schema.ts` then `npx drizzle-kit push`

## Session Logs

`~/.claude/sessions/the-logbook/`
