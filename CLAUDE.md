@AGENTS.md

## Quick Resume

- **Current focus:** iteration phase — Matthew art-directing a custom graphics pass (replace hand-rolled sprites with a designed asset system) and expanding the concept
- **Repo:** https://github.com/picturesofmatthew/the-logbook (public) · **Live:** https://the-logbook-six.vercel.app
- **Last meaningful change:** v1 shipped + prod login fixed (empty env vars via wrapped Vercel CLI — see memory `feedback_environment_constraints` item 5; always `npm exec --yes vercel@latest -- env add ... --value`)
- **Open questions:** passcode is still placeholder `mochi`; `FDC_API_KEY` is `DEMO_KEY` (free key: https://api.data.gov/signup); graphics direction undecided — refined pixel vs. illustrated

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
