# Phase 4 Hand-off — the-logbook ("signed × sealed")

*Read cold and you're oriented. A fresh session should be able to finish Phase 4 and deploy from this alone.*

## Where things stand

Phases 1–3 are **built, committed (`22cf024` on branch `inklight-v1-polish`), and verified**: tsc clean, lint clean, **44/44 tests**, prod `next build` passes. Phone-first PWA, Next 16.2.10 + Neon + Vercel. Repo: github.com/picturesofmatthew/the-logbook.

**What works (verified in a real browser at phone size):**
- **Living glade home** (`app/page.tsx`): fullscreen sky, the ring/seal, and **two in-scene keeper lanterns** that light by who's logged — Matthew = moss green, Kennedy = ember auburn (`KeeperLantern` in `components/glade/glade-scene.tsx`; driven by `mossLit`/`emberLit`, true on **food OR workout** today). Fox + world at the foot (skyless GladeScene, height-cropped so the page gradient is the only sky — no seam).
- **App shell** (`app/layout.tsx` + `components/shell/*`): top bar (glade rune left → home, profile right → settings popover with sound toggle), bottom ribbon (Today · Pantry · **LOG** · Book · Trends — carved rune-buttons + center quill), capture sheet. Constrained to a centered device column on desktop; `allowedDevOrigins` lets a LAN phone hydrate.
- **Directional transitions**: page-turn forward/back + a glade **homecoming bloom** (not a flip). React `<ViewTransition>` in `components/shell/page-transition.tsx` (`default="flip-fwd"`; `update` maps `nav-back`→`flip-back`, `nav-home`→`bloom-home`). The ribbon sets each link's direction by tab order (`components/shell/ribbon.tsx`); the glade rune sends `nav-home`. Keyframes in `app/globals.css` under `::view-transition-*`; chrome pinned via `view-transition-name`. **All three verified via `getAnimations()`.**
- **Workout capture** (Phase 2): `lib/engine/workout-parse.ts` parses "bench 185x8x3, squat 225x5x5". Capture **Train** pane: write-in → editable preview → **inscribe** (`logWorkout`); repeat-last chips (`getRecentWorkouts` in `lib/data.ts`, deduped by split family); quick-mark. Verified end-to-end.
- **Food capture** (Phase 3): `lib/engine/food-parse.ts` (parse a meal → items, `gramsFor`, `atwaterCheck`). Fixed `lib/usda.ts` (extracted pure `scaleToServing` — handles g/ml/oz/household, no more mislabeling "100 g"; adds `dataType` + `per100`). `app/api/food-estimate/route.ts` — **whole-foods-first** search (Foundation/SR Legacy, then Branded), stem-aware + basic/processed-aware matching. Capture **Eat** pane: write-in → editable **estimated card (soft `~`)** → log (donates an `estimated` specimen + logs it, so it becomes a one-tap recent). Verified against the real USDA key: "2 eggs and a banana" → 233 kcal / 13g P; greek yogurt → 83 kcal; "1 cup white rice" → 362 kcal.
- **Migration applied**: `foods.estimated` boolean (`db/migrations/0001_*`, already run against Neon). The `~` mark shows in `own-column` + the capture recents grid.

## Environment / commands
- Dev: `npm run dev` — localhost:3000; **LAN http://192.168.1.7:3000** (`allowedDevOrigins` in `next.config.ts`). Test on the phone in a **private/incognito tab** (a normal tab caches the HTML). Cross-origin hydration only works because of `allowedDevOrigins` — if the phone's buttons are dead, that's the first thing to check.
- `npm test` · `npm run lint` · `npm run build` all pass. **Never `curl`** (Windows SSL). Migrations: edit `db/schema.ts` → `npx drizzle-kit generate` → `npm run migrate` (never `push`).
- Real `FDC_API_KEY` is in `.env.local` (gitignored, working). Passcode `mochi`. Two hardcoded profiles: matthew/kennedy (`lib/auth.ts`).

## Phase 4 — what's left
1. **Finish the `~` estimate mark** on the remaining surfaces: `components/journal/log-drawer.tsx` (recents grid + collection list) and `app/museum/page.tsx` (pantry cards). It reads `specimen.estimated` (already on the `Specimen` type). Pattern: a small terracotta `~` before the name (see `own-column.tsx`).
2. **On-device pass** (private tab on the phone): log a food estimate end-to-end — confirm the `~` specimen lands in the pantry + becomes a one-tap recent, the lantern lights, the seal reacts. Confirm the page-turn/bloom *feel* on iOS (View Transitions need Safari/WebKit **18.2+**; older iOS degrades to instant nav, which is fine).
3. **Estimator polish (optional — it's a rough, editable estimator by design, never a scold)**: the "cup" portion runs high for cooked rice (~362 vs ~205 real); consider a couple food-specific portion tweaks in `PORTION_GRAMS`/matching, or leave it (the card is editable, and write-once→pantry means one correction sticks forever). Matcher is `bestMatch` in `app/api/food-estimate/route.ts`.
4. **New-Mark on capture inscribe (optional)**: the Training-Log New-Mark ceremony fires on `/today`, not in the capture sheet — could thread `bestEntries` into the sheet to celebrate a PR there too.

## Deploy (the goal — Matthew is doing the domain DNS)
1. **Vercel env vars** (Settings → Environment Variables → Production): `AUTH_SECRET`, `APP_PASSCODE` (`mochi`), `FDC_API_KEY` (the real key in `.env.local`). `DATABASE_URL*` come from the Neon marketplace integration. CLI (needs Vercel auth): `npm exec --yes vercel@latest -- env add FDC_API_KEY production` then verify end-to-end (the plugin-wrapped global `vercel` silently stores empty values — always verify).
2. **Deploy** the branch to prod (project convention is CLI-driven): `npm exec --yes vercel@latest -- --prod`. The migration is already applied to the shared Neon DB, so prod picks up `estimated` automatically.
3. **Domain** `signedxsealed.com`: Vercel project (`signxsealed`) → Settings → Domains → add `signedxsealed.com` + `www`; DNS at the registrar (A `@` → 76.76.21.21, CNAME `www` → cname.vercel-dns.com). Vercel auto-issues SSL.

## Notes
- LF→CRLF git warnings on commit are harmless (Windows).
- Never-punishing law: no red numbers, no broken streaks; estimates are "a rough estimate — nudge the numbers," never a scold.
- Full plan lives at `~/.claude/plans/precious-greeting-kernighan.md`.
