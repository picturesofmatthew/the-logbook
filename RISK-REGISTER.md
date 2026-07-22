# Signed × Sealed — Risk Register

*Consolidated from a 4-agent adversarial contingency round + a scope/validation pass (2026-07-20).
Deduped and ranked by severity. Each item: the risk, the fix, and which phase it belongs to.
The striking result: four independent lenses (product, technical, business, scope) converged on one
root — see below.*

> **Code-verified refresh (2026-07-21):** a second 3-lens audit (`AUDIT.md`) read the *current build*
> and confirmed Tiers 1, 5, and 6 are still live (with file:line evidence), and found new technical
> items — see **`## Audit refresh`** at the foot of this doc.

## The convergent finding

**The mechanic that makes the app magical — the seal only closes when both show up — is the same
mechanic that makes it fragile, along every axis at once:**
- *Product:* one partner skipping strands the engaged one at a locked screen; one quit churns two.
- *Technical:* once the couple is in two timezones, the two halves file under different `day` keys and
  the seal silently never closes — a correctness bug in the exact long-distance scenario the app is for.
- *Business:* a paying unit that 100%-churns on breakup, with a "who pays" deadlock.
- *Scope:* we were about to *rewrite* this un-validated loop natively instead of testing it cheaply on
  the working PWA that already runs it.

The fixes cluster too: **make the day async, give one person's log standalone value, and design the
breakup as a first-class state** solves the top finding of three agents at once.

---

## Tier 1 — Core-loop fragility (fix the DESIGN before validating anything)

- **No standalone value for one person.** Logging your own half must be a complete, satisfying artifact
  — lights your side, lays a *personal* plank — even if your partner never shows. The joint ceremony
  *fuses* two halves into something rarer. Magic still gated; engaged partner never left with nothing.
- **Same-day-mandatory close → async rolling window (~36–48h).** "Together" = both *eventually*, not
  both before midnight. Fixes the timezone bug AND the least-engaged-partner problem in one move.
- **The app must survive one person leaving.** A solo "tend the flame" fallback; re-pair later without
  losing your identity/collection.

## Tier 2 — Safety & legal (must-fix before ANY external user touches it)

- **Breakup is a safety surface, not just churn.** A shared food/workout log + cross-distance pings is,
  in a bad dynamic, a coercive-control/stalking vector. Need a **unilateral instant "sever"** (kills the
  ex's access + taps, no escalating notification). Model on Apple Safety Check.
- **Health-adjacent data has real legal teeth.** Mood + weight = "consumer health data." **Washington's
  My Health My Data Act has NO revenue threshold and a private right of action** — one WA user can sue.
  **GDPR Art 9** treats mood/intimacy as special-category → needs *separate, unbundled* explicit consent.
  Fix: a dedicated consumer-health privacy policy linked on the homepage; explicit consent at signup;
  encrypt at rest; strongly consider **E2E for private notes** (trust is the whole brand).
- **Unpair ≠ delete.** Two distinct flows. On delete, remove that user's data but **tombstone the shared
  book to a read-only keepsake** for the remaining partner (the "book stays readable forever" promise).
  Both stores enforce full in-app account deletion.

## Tier 3 — Sequencing (the meta-call)

- **Don't rewrite a working app before validating demand.** The live PWA already delivers the core loop;
  the native rewrite adds *zero* retention evidence and collides with the STR launch + the Asia move +
  debt paydown. **Validate on the PWA first; defer the native rewrite.** (See the re-pointed plan.)

## Tier 4 — Money & tax (before charging a cent)

- **Web billing makes YOU the merchant of record** — the stores used to remit sales tax/VAT/GST in ~175
  jurisdictions; Stripe does not. Plus **Stripe isn't fully available in Thailand.** Fix: strongly
  consider a **Merchant-of-Record (Paddle / Lemon Squeezy, ~5% blended)** over raw Stripe — they handle
  global tax + are seller of record; cheaper than a US LLC + Stripe Tax + an accountant + owning
  chargebacks solo-from-Asia.
- **Reader-model cut fear is largely stale in the US** (courts opened external payments; fallback is 15%
  small-biz, not 30%). Architect as a **reader app** (web signup, login-only in-app) as the durable
  baseline; add a US external checkout link while the window is open.
- **Map the paid unit to the COUPLE** (one payer unlocks both, à la Paired) — dissolves "who pays."
  **Charge for the accumulating archive/keepsake, not the daily tap.** Push annual/lifetime early
  (front-loads cash vs debt).

## Tier 5 — Accessibility (cheap; do anytime, applies to the current PWA too)

- **The relational colors fail colorblind users.** Moss-green vs terracotta = textbook red-green
  confusion, and the seal's meaning rides on telling the halves apart. Fix: give each keeper a
  **shape/texture identity** (not just hue); widen the lightness gap; ship an **Okabe–Ito CVD-safe
  palette** toggle (`keeperAColor`/`keeperBColor` are already bindings).
- **Reduced motion:** gate the ceremony on `isReduceMotionEnabled()` — render the static composed tier
  instead of firing `cast`.
- **Screen reader:** derive an `accessibilityLabel` from `SigilSpec` using the chord `line`s +
  legendary `epigraph` you already wrote. A formatter, not new copy.

## Tier 6 — Native-rewrite technical debt (BANK for the native build; not now)

- **Neon→Convex migration can rewrite earned history.** Recomputing seals with *today's* target instead
  of the historical `targets.effective_date` can turn a Feast Seal into Lean and move a legendary's
  first-earned date. Migrate `discoveries` verbatim as immutable; snapshot historical targets; pin
  `firstPage`. Also: the Convex schema silently drops `weighIns`, `beingArrivals`, recipes, meal,
  `pet.name`, and mismatches the `snacks` hall — decide each on purpose.
- **Canonical couple-day invariant.** `couples.tz` is the ONLY thing that buckets `day`; `users.tz` /
  `loggedTz` stay descriptive (they power the Long Distance / Dawn chords). Write it as an engine
  invariant. *(This one also applies to the current engine before long-distance dogfooding.)*
- **Online-first needs a durable outbox** or gym logs vanish on app-kill. A thin MMKV/SQLite persisted
  queue + client-generated UUIDs (idempotent replay). The data model is conflict-free (per-user,
  append-only), so no CRDTs needed.
- **Decouple the love-tap from best-effort push.** Durable channel = the reactive Convex query (lands
  next app-open); push is the nice-to-have buzz. Set `priority: high`; degrade gracefully if permission
  denied; use the Convex Expo Push component.
- **Security/cost:** ≥128-bit single-use invite tokens + a Convex rate limiter on invite acceptance &
  love-taps (brute-forcing a short code = pairing into a stranger's book); Clerk `tokenCache` via
  `expo-secure-store`; move the USDA key into a Convex action.
- **Test the multiplayer surface:** `convex-test` for pairing/compose/love-tap; golden cross-tz seal
  tests; Maestro E2E on pairing (doubles as the reviewer walkthrough). Confirm Rive RN reqs
  (RN 0.78+, Nitro 0.25.2+) before authoring 30+ parts; measure the 4s orrery + spark burst together.

## Tier 7 — GTM / positioning / pricing / name

- **The two-player rule IS the distribution engine** — every activation is a built-in two-person invite;
  K-factor is baked in. Instrument the invite as the primary funnel; solo-seed a half-lit seal the
  inviter *sends* ("Kennedy started your first seal — it's waiting for your hand").
- **One beachhead: long-distance couples** (the love-tap is the native hero there; it's your own Oct-2026
  case). Gym-partners is a *second* wedge after PMF, not alongside.
- **The moat is NOT the aesthetic** (copyable in a weekend) — it's **accumulating shared history +
  two-person lock-in.** Real competitor = iMessage/WhatsApp. Design to deepen the keepsake and the
  can't-leave-without-abandoning-your-partner.
- **North-star metric: mutually-active pairs** (% of couples where *both* logged in the last 7 days) —
  not DAU.
- **Pricing:** ~**$72/yr ($8.99/mo) per couple** + an early **lifetime/founder tier (~$99–129)** for
  cash-vs-debt. Per-couple framing = a shared gift.
- **Name:** "Signed × Sealed" — the `×` is unpronounceable/unsearchable in stores. Lock searchable
  variants; run a USPTO + App Store/Play collision check before you're attached.
- **No money-wager mechanic in v1** (DietBet-style staking pulls in gambling regulation).
- **App Store review:** ship **two pre-paired demo accounts** + notes (a two-player flow a reviewer
  can't exercise = a 2.1 rejection loop). Keep the love-tap affection non-sexual (age rating).

---

## Audit refresh (2026-07-21 — code-verified)

A second adversarial audit (`AUDIT.md`) read the current build. It **confirmed against live code**:

- **Tier 1 (core-loop fragility) — partly addressed.** **Solo standalone value: DECIDED + shipped
  (2026-07-21)** — a solo log kindles the glade firepit + lights that keeper's lantern and the seal
  caption reframes to "your half is kept" (a warm artifact, not a scold). **Deliberately NOT a boat
  plank** — the boat stays strictly two-player (`boat.ts` unchanged: planks only on joint days). Still
  open: the **async ~36–48h close window** and **survive-a-leave** (`seal-ceremony.tsx` still fires
  only on `completed && isToday`).
- **Tier 5 (colorblind seal) — still live, unmitigated.** Halves differ only by hue at near-equal
  luminance (`glyphs.ts:261`); no shape/texture/CVD toggle.
- **Tier 6 (canonical couple-day) — still live, and it applies to the CURRENT engine, not just the
  native build.** `todayIso()` buckets on the per-device tz cookie (`lib/dates.ts:8`,
  `tz-sync.tsx`); it auto-activates on the Oct-2026 move. Elevated to **Track A** in `ROADMAP.md`.

**New findings** (not previously in this register):

- **[High] Ceremonies fire from DB writes during GET render and are silently consumable.** Opening
  `/book` (which scans the month, incl. today) before home consumes today's legendary claim →
  the ceremony never shows for anyone. `app/page.tsx:91`, `book/page.tsx:42`, `book/[day]/page.tsx:98`.
  **→ Addressed (2026-07-21):** the legendary / arrival / shore ceremonies now trigger on **facts**
  (the composed sigil, recorded arrival days, boat state) + a **per-device seen-gate**
  (`lib/ceremony-seen`), mirroring the seal — so **both** keepers witness each moment once, whatever
  the browse order. The DB writes remain only to persist the collections. *(Residual: the writes still
  run on the home render — idempotent; moving them fully to the log action is a later purity cleanup.)*
- **[High] Legendarium under-reports + wrong "found-on" date** — discoveries are recorded lazily by
  whatever page happens to scan a day; a legendary on an un-revisited day is never recorded, and the
  stored day is first-*observed*, not first-*earned*.
- **[High] `food-estimate`** — up to ~12 sequential USDA fetches, no cache/rate-limit/in-handler auth
  (`app/api/food-estimate/route.ts:111`); risks Vercel duration + DEMO_KEY quota.
- **[Med→High at scale] Full-history recompute uncached** on every home + library load
  (`lib/ledger.ts:124,223`, `lib/data.ts:105`); latency cliff as history/couples grow.
- **[Med] Duplicate-specimen race** — no `UNIQUE(lower(name))` on `foods` (`app/log/actions.ts:109`).
- **[Med] Seal needs FOOD from both** — workouts alone never close it (`keeper-day.ts:26`); decide
  on purpose.
- **[Med] Incomplete revalidation** — log actions only `revalidatePath("/")`; `/today`/`/library`/
  `/book` can serve stale client-cached copies.
- **[Test gap] The impure data + ledger layer is untested** — the exact layer holding the tz bucketing,
  both-logged rule, and discovery recording.
