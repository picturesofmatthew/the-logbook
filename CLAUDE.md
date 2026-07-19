@AGENTS.md

## Quick Resume

- **Current focus:** "Inklight" overhaul (spec: `DIRECTION.md` v3). **Phases 0–1 BUILT locally, not yet committed/deployed** (2026-07-19): light script (day/dusk/night via `data-light` on html, tokens in globals.css), engines `lib/engine/{sigil,training,glade,beings}.ts` (27 tests green), workout tables pushed to Neon, Training Log UI, DaySeal + SigilGlyph on home. Next: commit/deploy, then Phase 2 (Spellbook `/book`) and ceremonies; Glade naming = **Glade** (not Vale); first-wave beings = Stag + Heron
- **Repo:** https://github.com/picturesofmatthew/the-logbook (public) · **Live:** https://the-logbook-six.vercel.app
- **Last meaningful change:** DIRECTION.md v3 + visual brief v3 (https://claude.ai/code/artifact/217589f0-834c-42bd-9a8d-afc1b0094572); art production = Matthew via ChatGPT + human direction (engines start on placeholder geometry)
- **Open questions:** Glade vs. Vale naming; first-wave beings (proposed Stag + Heron); passcode still placeholder `mochi`; `FDC_API_KEY` is `DEMO_KEY` (free key: https://api.data.gov/signup)

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
