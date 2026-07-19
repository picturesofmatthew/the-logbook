@AGENTS.md

## Quick Resume

- **Current focus:** "Inklight" overhaul (spec: `DIRECTION.md` v3). **Phases 0–3 SHIPPED to prod** (2026-07-19): light script, engines (27 tests), Training Log, DaySeal, the Spellbook, and now **the Glade** — generated SVG scene in the home header (`components/glade/*`): sky/canopy/ground bands per light state via `--glade-*` vars, pixel fox living by the lantern, Stag + Heron silhouettes appear/deepen via `getGladeState` (full-history chord ledger), vitality drives tufts/blooms/wicks/mosslings, hushed = mist. Masters from `art/prompts.md` replace layers later. Next: Phase 4 (sound pass, settings polish), being-arrival ceremonies, remaining beings' art
- **Repo:** https://github.com/picturesofmatthew/the-logbook (public) · **Live:** https://the-logbook-six.vercel.app (serving the signxsealed build)
- **⚠ One manual step:** https://signxsealed.vercel.app exists only as a deployment alias → gated by Vercel SSO deployment protection. Fix in dashboard: signxsealed project → Settings → Domains → add `signxsealed.vercel.app` (becomes the tracking production domain, public). CLI can't do it (`domains add` rejects vercel.app; API needs token). Deploys are CLI-driven (`npm exec --yes vercel@latest -- deploy --prod --yes`) — no Git auto-deploy
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
