# Signed × Sealed — The Path to v1 on the Stores

*Build + render + ship plan of record. **Stack decided 2026-07-20 via a 4-agent adversarial round**
(foundation, backend, animation, cost) after an initial two-agent pass. The first pass said "wrap with
Capacitor / keep Neon"; the adversarial round revised it. Fast-moving policy is confidence-flagged;
re-verify billing law before hard-committing.*

---

## The decision: Expo + Convex + Rive

Native-first, realtime-native, authored-magic. Chosen because **cost is neutral across every stack**
(~$30–56/mo to exist on both stores, ~$75/mo infra at 1,000 couples — the pricing agent proved the
framework choice barely moves the needle), so the foundation is chosen on **fit and the "build it
right" bar**, not price.

| Layer | Choice | Why |
|---|---|---|
| **App** | **Expo (React Native, New Architecture)** | Native rendering clears the ceremony's ceiling a WebView can't; first-class push for the love-tap; no App Store 4.2 "just a website" risk; best no-Mac build story (EAS). Your **pure-TS engine ports ~1:1** — only the views are rewritten (AI-assisted). Built once, not wrapped-then-rebuilt. |
| **Backend** | **Convex** | Realtime-native — the two-player seal, love-tap, and presence *are* the product, and Convex hands you the **DB-trigger→push** as a primitive. Cleanest Expo fit; per-developer-seat pricing (cheap at couples scale). |
| **Auth** | **Clerk** (free ≤50k MRU ≈ $0 to ~25k couples) *or Better Auth (OSS)* | Convex Auth is beta — don't ship on it. **Email/password only** to dodge the Sign-in-with-Apple obligation. Model the **couple as your own Convex table** (invite-code pairing) — don't rent an "organization" primitive. |
| **Animation** | **Rive** (spine) + **react-native-skia** (legendary-tier shaders) | Rive: visually authorable, state machines = the emblem ladder, real particles (Luau, Jan 2026). Going native retires the web-path risks (no iOS-Safari glow fallback). Skia is native to Expo — real shaders for the stained-glass legendary moment, free. |
| **Billing** | **Stripe, reader model** (pay on web) | No store cut either platform. The single biggest cost lever — bigger than the whole infra stack. Push annual plans (halves Stripe's per-charge drag). |
| **iOS builds (no Mac)** | **EAS Build + EAS Submit** (Codemagic as alt) | Cloud macOS runners; Expo manages signing/certs/push keys. Build + submit from Windows. Test on a physical iPhone (APNs needs a real device). |
| **Web presence** | **Keep the Next.js app** as marketing site + web Stripe checkout | The reader-model signup/payment surface. The app backend moves to Convex; the pure-TS engine moves into the Expo/Convex codebase. |

## Spend discipline — $0 until there are users

**Governing principle (Matthew, 2026-07-20): don't burn money before launch.** The chosen stack
supports it — nearly everything is free through development and first users; cost scales *with* users,
not ahead of them.

- **$0 for the entire build:** Expo/EAS (free build tier), Convex (free tier covers dev + ~first 100
  couples), Clerk (free ≤50k MRU), FCM push (free), Cloudflare R2 + Pages (free), AI Studio / Nano
  Banana (free bootstrap), Stripe (per-transaction only — $0 with no sales).
- **Rive $9/mo — only while exporting.** Author and design for free; the Cadet plan is needed only to
  *export* `.riv`. Subscribe for the export month(s), cancel between. ~$9–18 total, not perpetual.
- **The only real pre-launch spend, deferrable to the last minute:** Apple Developer $99/yr (needed
  only for iOS device testing + submission — build and test on **Android free** until then) + Google
  Play $25 once. ~$125, spent *at* launch, not before.
- **Deferred entirely until proven:** Scenario ($45 paid style-lock — bootstrap free first), Vercel
  Pro (use **Cloudflare Pages** for the marketing site instead), Convex Pro / any scale tier (only
  past the free ceiling = real users).

**Net: build and test the whole app for ~$0**, pay ~$125 one-time at first submission, and start
recurring spend only once paying couples exist — where it's a fraction of their subscription revenue.
Nothing bleeds while there are no users.

## De-risk FIRST — before the full rewrite

The animation research left exactly one caution that survives into the native path: **nobody has
proven the Rive renderer holds 60fps on a mid-range Android at our spark density.** So the first real
build task is a throwaway prototype, not the rewrite:

1. **Author a Rive ceremony prototype** — the seal assembling from parts, ink draw-on, gold ignite,
   feathered glow, scripted spark particles, and one tier transition (common→legendary via state
   machine + artboard swap).
2. **Run it in an Expo dev build on a real ~$200 Android** and watch the FPS.
3. If it holds → proceed with confidence. If it stutters → tune particle density / reserve the dense
   spray for the legendary tier only. This is a test, not a research question.

The Safari-feathering risk from the research is **moot on native** — there's no browser fallback.

## The real critical path is the BACKEND — "Phase C" on Convex

Going from *two hardcoded users + shared passcode* to a public multi-user app is the actual work:
1. **Real per-user accounts** (Clerk, email/password).
2. **Couple-pairing model in Convex** — a `couples` table linking two user IDs; an invite-code `pair`
   mutation; most data scoped to the couple. A few lines in Convex's reactive model.
3. **The love-tap** — a Convex mutation on "ring closed" schedules a push via Convex's Expo Push
   component. **Presence** ("your partner is logging now") via reactive queries — Convex's native
   strength.
4. **Mandatory in-app account deletion** (both stores enforce it) + a public web deletion page.
   Decide: does deleting one partner dissolve the couple or anonymize it?

## Billing — the reader model dodges the store cut

Couples sign up + pay on the **website (Stripe)**; the app just logs them in → **no store commission**.
- Apple US external-payment commission is **0% today** (post-Epic) but **temporary** — court-set fee
  coming, SCOTUS Oct 2026 term. `[re-verify before locking billing]`
- Google Play (Billing Choice): ~**10%** small-dev on your own billing; the reader model sidesteps it.
- **Annual billing ≈ halves Stripe's effective rate** (kills the 30¢-per-charge drag at a low price).

## The sequence to v1

1. **Art + Rive foundation** *(where the energy is — path-independent).* Lock the Inklight look (AI
   Studio bootstrap → 12–15 masters); art bible + DTCG palette/material/tier tokens; the `sharp`→AVIF
   asset pipeline (assets on **Cloudflare R2** — free egress, big win for an image-heavy app); **build
   the seal as a data-bound Rive file** with the tier state machine; author the ceremony. *This IS the
   de-risk prototype.* Rive Cadet $9/mo.
2. **Expo app skeleton** — scaffold Expo (New Arch); wire **EAS Build** for no-Mac iOS; **port the
   pure-TS engine** (`lib/engine/*` — sigil, training, glade, totals, tdee — moves ~1:1); rebuild the
   views in React Native.
3. **Convex backend — Phase C** — the four items above (accounts, pairing, love-tap, deletion).
4. **Web-first Stripe billing** (reader model) on the retained Next.js site.
5. **Store setup + submission** — Apple $99/yr + Google $25; cloud iOS build (EAS/Codemagic, no Mac);
   **two pre-paired demo accounts** + reviewer notes (a pairing-mandatory flow they can't exercise =
   2.1 rejection); Apple privacy labels + Google Data Safety form.

**Realistic solo timeline ≈ 6–10 weeks** once the store push starts (the Expo rewrite is ~+1 month
over wrapping, but done once). **Long pole = Google Play's 12-testers-for-14-days closed-test gate** —
recruit testers early. **Hedge:** ship the **Android build first** via EAS (no 4.2 equivalent, faster
approval), get real couples using it while you polish iOS.

## Cost shape (from the TCO agent)

- **Fixed floor:** ~$30–40/mo (Apple $8.25 + one managed backend + Rive $9) + $25 Google once.
- **At 1,000 paying couples:** ~$75/mo infra; ~$620/mo Stripe (the real cost); **~92% of total is
  payment processing**, which the reader model already minimizes.
- **Per-couple marginal cost** ≈ $0.62/mo monthly billing, ~$0.03/mo on annual. Backend is ~fixed.
- Watch: Vercel Hobby forbids commercial use (Next.js marketing site → Pro $20, or move to Cloudflare
  Pages); Convex free tier covers 100 couples, ~$25/mo beyond; Clerk free to ~25k couples.

## The v2 door (unchanged in spirit)

The Expo codebase can later target **web** too (React Native Web) if we want to regenerate a PWA from
one source. Rive `.riv` files and the Convex backend are already cross-platform.

## Confidence caveats

- **Billing/anti-steering law is the fastest-moving piece** — re-verify the reader-model commissions
  before locking billing (SCOTUS Oct 2026 term).
- **Rive mid-range mobile perf is the one unproven technical risk** — the prototype test above settles
  it before any real investment.
- Convex Auth is beta (use Clerk/Better Auth); Convex offline is online-first with optimistic updates
  (acceptable — we chose realtime-first over offline-first).
