@AGENTS.md

## Quick Resume

- **Current focus (2026-07-21):** ⭐ **Read `PROJECT-BRAIN.md` first** — full orientation + decision log + doc map. In brief: **Act One is LIVE** (the deployed `inklight-v1-polish` PWA at signedxsealed.com — the two-keeper seal + full engine + glade + spellbook all working; 44/44 engine tests pass). This session made three moves: (1) **The Sigil Turn** — re-centered on the sigil-as-spell laying planks toward the far shore (`THE-SIGIL-TURN.md`); (2) a **native build stack decided** — Expo + Convex + Rive — via a 4-agent adversarial round (`LAUNCH-PATH.md`); then (3) a **contingency round (`RISK-REGISTER.md`) reframed the next move to VALIDATE-FIRST on the existing PWA before any rewrite.** The native rewrite + stack are **deferred** (the playbook for later). **One open decision: brakes-and-validate (recommended — all lenses converged) vs build-native-now — awaiting Matthew's explicit go.** Immediate $0 step: on the live PWA, fix the core-loop cluster (async ~36–48h window + standalone half-value + graceful absent-partner state) + the colorblind seal + the canonical-couple-day rule, then run a 30-day both-of-you retention test + build the bridge-to-Kauai Phase 0 (`ACT-TWO-THE-FAR-SHORE.md` §Phase 0). Work committed on branch `sigil-turn-foundation` (`b8151a4`).
- **Repo:** https://github.com/picturesofmatthew/the-logbook (public) · **Live:** https://the-logbook-six.vercel.app (serving the signxsealed build)
- **⚠ Manual steps outstanding:** (1) real passcode (still `mochi`) + real `FDC_API_KEY` (still `DEMO_KEY`; free key https://api.data.gov/signup) — set in `.env.local` **and** Vercel env (`npm exec --yes vercel@latest -- env add … --value "x" --yes`, then verify). (2) `signxsealed.vercel.app` alias still SSO-gated → dashboard → Settings → Domains. (3) Vercel project **rename** (dashboard: https://vercel.com/matthewmakesthings-projects/signxsealed → Settings → General → Project Name). (4) branch `inklight-v1-polish` not yet merged to the default branch — deploys are CLI-driven so prod is current regardless, but merge when ready.
- **Deferred to the subscription (Phase C) track:** households schema + `household_id` on every table, per-user auth + invite pairing, per-household fox/museum/discovery board, session expiry/rotation, manifest depersonalization ("for Matthew & Kennedy"), billing (per-couple), per-household ledger caching. See the audit for the full blocker list.
- **Positioning thesis (v1 marketing spine):** "the tracker you can't use alone" — the seal cannot close solo, chords only strike together, abundance/rest/hard-days are *named achievements* (anti-red-number), the Spellbook is a rereadable shared memory. Moat = two-player-mandatory architecture incumbents can't retrofit + trust (book stays readable forever, even on cancel).

## Project notes

- Two users only: `matthew` and `kennedy` (profile ids are hardcoded in `lib/auth.ts`)
- The pet is a shared arctic fox that grows antlers by **lifetime both-logged days** (thresholds in `lib/engine/pet.ts`); it is never punished — tone rule: no red numbers, no broken streaks, over-target renders in soft terracotta
- The museum collection IS the food database; USDA is only touched when donating a new specimen
- Engine logic (`lib/engine/*`) is pure and unit-tested: `npm test`
- Sprites are string maps in `components/sprites.ts`; preview to PNG with `node scripts/preview-sprite.mjs <outDir>`; icons regenerate with `npm run icons`
- "Today" follows a timezone cookie (`components/tz-sync.tsx`) — survives the move to Chiang Mai
- DB is Neon via the Vercel marketplace integration; schema changes are versioned: edit `db/schema.ts`, then `npx drizzle-kit generate` + `npm run migrate` (never `push` — history lives in `db/migrations/`)

## Session Logs

`~/.claude/sessions/the-logbook/`
