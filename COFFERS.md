# COFFERS — the real-money trip fund (research + funding decision)

*The coffer is Act Two's real-money layer: the fund that fills as a couple actually saves
(and friends actually chip in) toward the far shore, so reaching Kauai on the boat coincides
with a **real, funded** trip. This doc records what we found and the path we're taking.*

**Status:** research complete (2026-07-21), **not yet built.** This is the decision spec for the
coffer; the boat/quest engine already ships. Build sequenced **after** the foundation/consolidation
pass.

> ⚠️ **General product + regulatory research, NOT legal or tax advice.** Before shipping any
> real-money feature, get a U.S. money-transmission + tax review for the specific design and states.
> No primary source in this round analyzed the money-transmitter-vs-mere-conduit legal *test* itself —
> the "witness not holder" conclusion is **inferred** from how compliant registries structure custody
> and from Stripe's payee/PSE framing, not from a cited regulatory ruling.

---

## The one principle: **witness, not holder**

The coffer's whole safety comes from one rule: **the app never holds, moves, or transmits money.**
It only *reflects* money the couple holds on rails they own. Keep that, and we stay outside
money-transmitter licensing, KYC/AML, PCI custody, and platform tax-reporting — the things a tiny
solo app cannot take on. The moment the app takes custody (even a "wallet" or "escrow" balance), it
becomes fintech. We don't.

## Recommendation + phased path

| Phase | What ships | Money flow | Compliance surface | Cost |
|---|---|---|---|---|
| **1 — now** | **Manual shared tracker.** Both keepers log money they set aside in their *own* account; the coffer is a shared thermometer. | App touches **nothing**. | **None** — outside money-transmission, KYC, PCI, tax entirely. | **$0** |
| **2 — when couples want real / friends' contributions** | **Link out to a rail the couple OWNS** — a couple-controlled Stripe Payment Link/Checkout, or a couple-owned cash registry (Hitchd/Zola). Coffer mirrors the total. | Money flows to the **couple's** account; app only reflects the number. | Couple is merchant-of-record; **they** get any 1099-K. App has no tax duty. Card data never touches us (Stripe-hosted = SAQ A). | **$0** to link/mirror manually |
| **3 — deferred nice-to-have** | **Auto-mirror a real savings balance** (coffer fills itself). | Read-only balance via aggregator. | Read-only; but ingesting financial data adds privacy/GLBA-style + trust weight a manual coffer avoids. | **Teller** free tier only; **not Plaid** |

**Ship Phase 1 first.** It's the only model that's unconditionally $0, zero-onboarding, and fully
outside every compliance surface. Its safety is *logical* (the app literally never touches funds) —
note it is **not** externally validated: the one shipping precedent researched (Loot, a savings
tracker that markets *not* linking banks) was **refuted** in verification, so lean on the logic, not
on "others do it."

---

## Crowdfunding — how friends really contribute (without us holding a dime)

The magic of "friends chip in toward your Kauai trip through the grimoire" is achievable — the trick
is the **couple owns the crowdfunding rail; our coffer only mirrors its total.** Options, best-fit
first:

1. **Couple-owned Stripe Payment Link / Checkout — the keystone.** The couple creates it in *their
   own* Stripe account; friends pay by card on a Stripe-hosted page; funds settle to the couple's
   bank. Why it stays clean:
   - The couple is the **payee / merchant-of-record**, so the payment processor (the PSE) — not our
     app — issues any **Form 1099-K**.
   - Stripe-hosted card entry means **card data never touches the app** (lightest **PCI SAQ A**;
     the couple's validation duty is minimized, not zero).
   - Our app has **no** tax-reporting obligation.
   - 🚫 **Never use Stripe Connect.** Connect shifts 1099 reporting + fund custody onto the *platform*
     (us) and drags the app into scope. The entire trick is a **standalone couple-owned** account.
   - *Precedent:* **Hitchd** ships exactly this — it provisions each couple a Stripe account they
     fully control, so funds can only reach the couple's own bank.

2. **Couple-owned cash registry (turnkey crowdfunding-for-couples).** Registries take a **0% platform
   fee** — every fee is a pass-through processor charge:
   - **Zola** — a genuinely **zero-fee** cash path (Venmo balance / bank / debit; couple gets the
     full gift), with a 2.5% credit-card path. Zola earns nothing on cash funds.
   - **Hitchd** — the couple-owned-Stripe model above.
   - **Honeyfund** — 0% platform fee too, **but it takes intermediate custody** via a "Wallet" that
     holds contributions until redemption. **Copy registries' *outsourcing to Stripe/PayPal*, not
     their fund-holding.** (Hitchd's "escrow" is marketing language — the real custodian is Stripe.)

3. **GoFundMe / Buy-Me-a-Coffee** — possible, but weaker fit: framed for causes/charity, prompts
   tips, less couple-controlled. A couple-owned Stripe link or Zola cash fund is cleaner and cheaper.

**Crowdfunding tax nuance (not tax advice):** genuine **gifts** from friends (detached generosity)
are generally **not** taxable income to the couple, but crowdfunding proceeds *can* be depending on
facts — recordkeeping matters (IRS guidance). A couple's own Stripe/registry account only triggers a
**1099-K past the federal threshold** — after OBBBA the federal threshold **reverted to over
~$20,000** (historically paired with 200+ transactions); **some states set lower thresholds.** Confirm
the current-year federal + state numbers before relying on them.

---

## Balance-mirroring (Phase 3, deferred): Teller, not Plaid

Auto-reflecting a real savings-account balance is the "nicest" coffer, but defer it until there's
demand — and mind the cost cliff:

- **Teller** — genuinely free developer tier: **100 live bank connections**, "you won't owe us a
  penny." The only realistic $0 path. (Free-tier rate limits are undocumented — verify.)
- **Plaid** — free Trial plan is **hard-capped at 10 Production Items** (proof-of-concept only; and
  only for new US/Canada teams created on/after 2026-04-15). Pay-as-you-go has no minimum but **bills
  per Item** — not $0. Also carries the trust baggage of the aggregator model (Plaid was litigated
  over harvesting bank credentials).
- Read-only linking also raises a **privacy/trust** question a manual coffer sidesteps entirely
  (storing a couple's financial-account data).

---

## Key risks / landmines

- 🚫 **Stripe Connect** — the single "do not do." Flips custody + tax onto us.
- **Custody creep** — any app-side "wallet"/"escrow"/balance = fintech. Honeyfund's Wallet and
  Hitchd's "escrow" are the anti-patterns; the couple-owned-Stripe (Hitchd) is the pattern.
- **Time-sensitivity** — Plaid Trial terms are effective 2026-04-15; Teller's free tier + limits can
  change; 1099-K thresholds are mid-flux (OBBBA). Re-verify before building.

## Open questions (for the pre-build legal check)

1. Does read-only bank/balance linking stay fully outside money-transmission scope, or does ingesting
   a couple's financial data trigger separate privacy/GLBA-style duties a manual coffer avoids?
2. For the crowdfunding variant, does the tax treatment (gift vs. income) or 1099-K threshold differ
   from pure self-funding, and at what current-year amount does the couple's own account get a 1099-K?
3. What are Teller's actual free-tier production terms + rate limits, and would a growing cohort stay
   under 100 connections before paid pricing?
4. At the U.S. **state** level, does even a pure "pointer" app that links out need any
   money-transmitter / agent-of-payee analysis — and does **displaying a running total or firing a
   "reward unlocked" on funding** change that answer?

---

## Provenance

Verified deep-research run, 2026-07-21 — 6 search angles, **25 sources**, 71 extracted claims,
**top 15 adversarially verified** by 3 independent skeptic panels (≥2/3 refutes kills a claim):
**14 confirmed, 1 refuted, 0 unverified.** The refuted claim: that Loot (a savings tracker marketing
*not* linking banks) proves "witness not holder" is a *marketable* stance — refuted 1-2, so treat the
manual coffer's safety as logical, not market-proven.

Key sources (primary unless noted): Stripe 1099-K + PCI guides; Hitchd honeymoon-fund-safety;
Honeyfund fees + honeymoon-fund; Zola cash-fund FAQ; Plaid billing docs + Teller.io; IRS crowdfunding
guidance + Taxpayer Advocate 1099-K; RSM (OBBBA thresholds); Modern Treasury / Venable (agent-of-payee
& money-transmission framing, secondary); Proskauer (Plaid data settlement, secondary).
