@AGENTS.md

## Quick Resume

- **Current focus:** post-audit **v1 polish batch** — branch `inklight-v1-polish` (commit `b8481b0`), **deployed to prod 2026-07-20** (`dpl_79yvwcbqM83u5yQkzz6onJVixm4F`, live at https://the-logbook-six.vercel.app). Full logistics audit (technical + UX) → 23-task catalogue, all closed. **Next session (see `NEXT-SESSION.md`): art-generation tooling + macro/calorie estimation logic.** **Daily loop:** mood persists on tap · one-tap RECENT logging · seal-closing ceremony + `sealTone` · New Mark moment + `newMarkTone` · `ritualChime` wired · training toggle folded into the Training Log as a quick-mark · copy pass (pantry naming unified, "chart your course", em-dashes). **World now visible:** all 9 beings + Pale Elk render in the Glade (Inklight-language SVG), bestiary compendium in `/book` (silhouetted until glimpsed), arrival ceremonies for every being, small folk (inklings/dewdrops/emberlings), trends restyled as engraved in-book plates, grimoire chrome (`RuledHeading` + hatch) on core surfaces. **Base hardened:** windowed ledger recompute (lift-only/day-bounded queries, `buildKeeperDay` dedupe), versioned Drizzle migrations, `safely()` error handling on all actions, security (timing-safe passcode, door rate-limit, headers, JSON 401), conservative service worker + offline page. Code-review pass ran (high effort): critical `updateTag`/`unstable_cache` mismatch caught by 4 angles → resolved by **removing the cache layer** (kept the windowing; per-household caching is a Phase-C concern).
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
