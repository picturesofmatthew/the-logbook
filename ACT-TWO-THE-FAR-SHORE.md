# signed × sealed — Act Two: The Far Shore

> **World frame updated 2026-07-22 by `THE-LIGHTHOUSE.md`.** The far shore now lives at the **east
> Docks** of the lighthouse (the Glade → the west garden). The multi-tenant foundation this doc calls
> "deferred" (households / `household_id` / auth / pairing) **shipped** as the `bond` / `Slot` model +
> B2 accounts. The Act-Two *vision* (the vessel, the Dream, the Coffer) stands; read the old naming and
> "requires deferred foundation" caveats as historical.

*The vision doc for the app's second act. Act One (shipped, live at signedxsealed.com) built the world, the daily seal, and the living Glade. Act Two gives that world a soul and a destination: two people walking toward their treasure together, while the world conspires to help them.*

*Written 2026-07-20 from a long build-and-brainstorm session. This is the canon — read it cold and you're oriented. Pair it with `DIRECTION.md` (the Inklight art bible) and the repo `CLAUDE.md` (operational Quick Resume).*

---

## The thesis (the soul)

**Signed × Sealed is not a fitness tracker. It is a tool for two people to walk toward their treasure together — and the world conspires to help them.**

The spine is borrowed, in spirit, from *The Alchemist*: when you commit to your treasure, all the universe conspires to help you reach it. The daily discipline (the deficit, the workouts, the logging) is the *journey*; the Dream (Kauai, for Matthew & Kennedy) is the *treasure on the far shore*; and the community's faith in you is *the universe conspiring* — rendered, literally, as lights.

Everything in Act Two must serve that sentence, and everything must wear the Inklight costume. The moment the crowdfunding or the sponsorship or the community looks like a fintech feature bolted onto a grimoire, it dies. If they feel like they were always part of the book, it's cohesive *and* beautiful.

**IP discipline (same law as the Glade):** we borrow *the spirit* of the treasure-journey — the far shore, the conspiring world, the pilgrimage — in **our own language**. We never use the book's title, characters, or coined terms as product assets. "Personal Legend" is Coelho's phrase and stays out of the UI; ours are **the Dream**, **the far shore**, **your treasure**, **the boat**.

---

## What Act One already built (the ground we stand on)

Act Two is additive — it presumes and protects everything below:

- **The living world (Inklight):** crisp ink over gouache wash; one ~20-swatch earth palette in three light states (day/dusk/night from a tz cookie); **violet reserved for union moments only**.
- **The daily seal:** each day composes a deterministic sigil from **both** keepers' data. *The seal cannot close alone.* This is the two-player-mandatory moat.
- **The Glade:** a living scene whose vitality = the couple's consistency; ~10 beings + 10 legendaries arrive slowly and never leave; drifting **motes** of light in the sky. *(Roster of record: `DIRECTION.md` — the fox familiar + 10 wandering beings.)*
- **The retention spine (non-negotiable):**
  - **No streaks, ever.** A streak is a debt you default on. We run on *accumulating memory* + *two-player accountability*.
  - **The world states the score wordlessly and never scolds.** No red numbers; over-target is soft terracotta; a hushed Glade is winter, not death.
  - **The daily act is dead simple** — log fast, seal, glance. If it ever takes more than ~15 seconds, we've failed.

Act Two's job: give that beautiful, inert world something to be *about*.

---

## The core loop, reframed as a season

Act One's loop was *log → seal → the world grows*. Act Two wraps that in a **season** — a goal-cycle with a beginning, a middle, and an end, matched to how disciplined people actually work (a cut, a challenge, an 8–12 week push), and pointedly **not** an endless Duolingo treadmill.

```
THE PACT  ──►  THE KEEPING  ──►  THE RECKONING  ──►  rest  ──►  (a new Pact)
(promise,      (daily seal;       (verified payoff;
 name the      the boat           the Dream made
 Dream)        sails)             real, or a quiet season)
```

The daily *act* never gets more complex. The season's richness — the Pact, the Coffer, the Commons — is **set once and witnessed daily**, never daily work.

---

## The mechanics

### 1 · The Pact — the founding promise

A season opens with a ceremony heavier than the daily seal, made once. The two keepers **sign and seal** a promise together, naming two things:

- **The Goal** — the concrete, verifiable discipline. *Matthew & Kennedy's Pact:* stay in a calorie deficit, train 5×/week, and log every day, for the season.
- **The Dream** — the treasure on the far shore. *Theirs:* **Kauai** — a trip they've spoken of taking together.

This is the emotional peak Act One was missing: **making the promise, out loud, to each other, with the app as witness.** Both keepers' sigil-halves sign it; the seal closes over the Dream.

*Data:* a `seasons` row (goal spec, dream, start/end, status) + both keepers' signatures.

### 2 · The Dream & the Boat — the far shore

The Dream renders as a **far shore beyond the Glade, across the ocean** — for Matthew & Kennedy, a warm green Kauai coastline you can *almost* make out through the haze. Between here and there: open water, and a **boat you build.**

- **Every day you both seal sets a plank into the boat.** The vessel rises plank by plank; the far shore sharpens; Kauai comes into focus.
- **Hard weeks, the sea runs rough** and the shore blurs — but the planks **never wash away**. You don't *lose* planks, you simply don't set new ones (never-punish, made literal).
- **Blessings from your Circle** (below) are lights strung along the water, guiding the way across.
- **Arrival is the Reckoning:** the boat arrives at the shore, and the treasure is real.

This is the fix for the hollowness: the daily seal stops being abstract "progress" and becomes *a plank in the boat to Kauai.* The Glade grows lush from consistency (the retention texture); the boat sails toward the Dream (the driver). Two things, one continuous world.

*Progress model:* every both-logged day sets **a plank** into the boat — planks are derived from the ledger, never stored, and they only accrue. The **vessel scales with the Dream's gravity**: a light goal builds a dory (≤21 planks), a middling one a sloop (≤55), a grand one a full tall ship (~90 planks — a three-month deficit). Its parts **rig on as the planks accrue** — keel and hull first, then deck, masts, and sails — and **legendary or resonant days set a golden plank**. Keep it honest and legible; never punitive.

### 3 · The Keeping — the daily act (unchanged, protected)

Still: **log fast, seal, watch the boat near.** The single biggest existential risk to the whole product is **logging friction** — two busy people must both log daily for months. Guardrails:

- Protect the **15-second seal**. Rigorous macros are an *opt-in layer for the gym-serious*, never a tax on the ritual.
- Lean on one-tap recents (built), and pursue **faster capture** over time — photo-of-meal estimate, "same as yesterday," voice. The lighter the daily act, the longer the season survives.

### 4 · The Coffer & its three springs — funding the Dream

Every Dream has a **Coffer** — the couple's fund toward it — that fills from up to three springs (the couple chooses which). This is the single object that unifies self-stake, crowdfunding, and sponsorship:

- **Spring 1 · The Stake** — you two put your own skin in. A wager on yourselves, returned (with warmth) when you keep the Pact. This is the proven [DietBet / HealthyWage / StepBet] spine: real money, real motivation, no lottery.
- **Spring 2 · The Circle** — the people who love you **back your Dream**. A beautiful, personal crowdfund: your mom, your training partner, your followers pledge to your Kauai trip, **released only when the Pact is verifiably kept.** Clean, because it's a pledge to a *verified achievement*, not a bet of chance.
- **Spring 3 · The Patron** — for the big Dreams, a **sponsor** funds a grand prize (a travel brand for a *travel* Dream; a supplement brand; a gym). The gate is always objective achievement; the community's esteem only helps a Patron *choose whom to favor* — **love is the tiebreak, never the judge.**

**The legal reality (load-bearing — design with counsel from the first sketch):** the tempting version — *pool all subscription revenue and award it to a couple by community vote* — is, almost exactly, the definition of an illegal lottery (prize + chance + consideration) and a money-transmission problem. We do **not** build that. Instead: the **Circle** (pledge-released-on-verified-achievement) is the cleanest spring and the one to build first; the Stake and Patron are skill-based/sponsor-funded, not sub-redistribution. Subscriptions fund the *platform*; they never get raffled to users by vote.

*Data:* `coffers`, `pledges` (Circle backers), `stakes`, `patronages`.

### 5 · The Commons — community as love made visible

> **Evolved 2026-07-24 by `THE-BEACON.md`** (the social canon). The Commons became the **Beacon** — the
> lamp aimed across dark water to a neighbor bond's island. Two ideas below are carried forward there as
> catalogued future: the **persistent signature mote** (the lingering, fading encouragement-light) and
> **Twinned Pacts** (partnering with one specific couple for a season). The money side (backing a Dream)
> lives in `COFFERS.md` + the Beacon's plank tier. Read the Beacon first for current shape; this section
> is the origin.

Beyond your Glade is a **village of other couples' Glades** — Matthew's Animal-Crossing instinct, made native. You wander in, and you witness.

- **Blessing = a mote of light.** Each blesser leaves a **unique, persistent mote** — a signature hue and drift that is *theirs*. Tap it and you see who, and when. A well-loved Glade holds a *constellation of everyone rooting for you* — **this is the universe conspiring**, rendered. Design rules:
  - **Scarce.** You carry only a few blessings to give per day. A mote you can spend infinitely is spam; a mote that costs you something is a real gift.
  - **Tied to ongoing love.** A mote glows bright for a season, then softens unless that person returns — so a radiant sky means people are *still* with you, not that you once went viral.
  - **Reuses the built mote system** (the drifting sky motes from the empty-sky fix — they were quietly waiting to become this).
- **Backing a Dream** = pledging to another couple's Coffer (the Circle, from the giving side).
- **Twinned Pacts** — pair with another couple you know for a season; push each other; visible to each other. This is the *tightest on-ramp to community* — bring-your-own-rival — and it sidesteps the cold-start problem of needing a public crowd.

**Community is witnessing, warmth, and generosity — never a leaderboard.** No toxic comparison engine. The only thing the crowd *does* with money is *choose to give it* (pledges) and *lend esteem* (which sways Patrons); the gate is always the couple's own verified effort.

### 6 · Attestation — verification (the moment money enters)

The day real money is on the line, **fraud is guaranteed.** Keeping the Pact must be *objectively provable*:

- **Weigh-ins** as photo/scale attestations (the DietBet solution); **workout logs**; deficit inferred from logged intake vs. target.
- In-world language: **attestations** / **witnessing** — testimony the book records.
- No money spring (Stake/Circle/Patron) ships without this in place.

### 7 · The Reckoning — the season's end

- **Kept** (objectively): the boat arrives at the far shore, the Glade blooms fully radiant, the Coffer opens, and **the Dream is real** — Kauai is booked. A ceremony larger than anything in the app. *You didn't hit a macro goal; you crossed an ocean together.*
- **Not kept:** **no rot, no red.** A **quiet season** — the Glade wintered but alive, the boat becalmed mid-water, waiting. The Stake rolls forward to the next season — or, gorgeously, you may **gift it to another couple's Dream** (generosity as the anti-punishment). Then you rest, and someday make a new Pact.

---

## Why this lasts a year (the retention spine, extended)

- **The Dream is the driver; the world is the reward.** You open it because you're both walking to Kauai and your partner is counting on you today.
- **No streaks; accumulating, un-loseable memory** (the book, the Glade, the boat, the constellation of blessings).
- **Two-player-mandatory** — accountability + relationship ritual, not solo willpower.
- **Never-punish** — everyone lapses; coming back is always warm; a becalmed boat is not a broken one.
- **Community as love, not comparison** — the conspiring world.
- **Seasons give rhythm** — intent, a finish, a rest — the cadence disciplined people actually want, not an infinite dopamine loop.

**The one metric that means it's working:** *both-logged days per couple per week, sustained into months 2–6.* Not signups, not DAU. Instrument the beta to watch **where couples drop** — the likely cliff is logging fatigue around week 2–3, which is why protecting the 15-second seal is existential.

---

## The niche (decided)

> **Superseded 2026-07-24.** Current canon narrows the beachhead to **long-distance couples** — the
> cross-distance love-tap is the native hero there (`RISK-REGISTER.md` Tier 7, `PROJECT-BRAIN.md`,
> `AGENTS.md`). **Gym-partners are a second wedge after PMF,** not the launch target. The
> "keeper ≠ spouse" flexibility below still holds.

**Beachhead: romantic partners prioritizing their gym health** — couples who already track, are motivated, and *want* accountability, for whom two-player-lock is a feature not friction. **Allow, don't chase:** competitive gym friends and supportive (non-romantic) partners can use the same machine — "keeper" is deliberately not "spouse." Don't dilute the beachhead trying to be for everyone at launch.

---

## Aesthetic coherence (how it stays beautiful)

- **Everything is named in the world's voice:** the Pact, the Dream, the far shore, the boat, the Coffer, the Stake, the Circle, the Patron, the Commons, the blessing, the attestation, the Reckoning.
- **Violet stays reserved for union** — the Pact-sealing and the Reckoning are the biggest violet moments in the app.
- **The far shore + ocean + boat** live in the existing palette and light script — Kauai renders warm and specific by day, silvered by moon at night.
- **Blessings are motes** — the system already exists; they just become personal and persistent.
- **The Alchemist is spirit, never asset** (see IP discipline up top).

---

## The build sequence (the honest path — one builder, ruthless order)

Each phase is gated on the previous one *proving out*. The vision is the north star; the first build is small.

**Phase 0 — The boat that proves it (BUILT + deployed).**
Just Matthew & Kennedy, on the current two-hardcoded-user setup. **Shipped:** the **Dream** (goal + far shore), the **far shore (Kauai)** on the horizon, and the **boat** that takes a plank each day you both seal — with a dedicated **`/shore` focus view** where the vessel is built in full. *No money, no Circle, no Commons, no verification yet.* The only question it answers: **does watching the boat sail toward Kauai get the two of you to open it every single day for a month?** If yes, everything else is worth building. If no, we learn it for free. **It needed almost no new infrastructure** — a rendering (`lib/engine/boat.ts`, pure + tested) + a `dreams` row.

**Phase 1 — The Circle + Attestation (the first money spring).**
Requires the deferred **multi-tenant foundation** (households schema + `household_id` on every table, per-user auth, invite pairing) — *any* real other person implies this. Then the **Circle** (pledge-released-on-verified-achievement) + **weigh-in/log attestation** + payment rails. Lawyer engaged before the first line. The Stake can ride the same rails.

**Phase 2 — The Commons (community).**
Visiting Glades, **blessings/motes**, twinned Pacts, backing others' Dreams. The village. This is where retention and acquisition compound (blessings are reciprocal and visible).

**Phase 3 — The Patron + seasons-as-skins + launch.**
Sponsor grand prizes; seasonal world-skins (autumn/winter/spring — long-arc freshness); per-couple billing; the **10-couple beta** as a real learning loop (watch the drop-off). The full art pipeline (being sprite-sheets, SVG sigil parts) matures alongside. Run from Chiang Mai.

---

## The hard truths (so this stays real)

1. **Simplicity is the product.** The daily seal stays ~15 seconds forever. All Act-Two richness is ambient, set-once, witnessed — never daily friction.
2. **Money means a lawyer from sketch one.** The Circle is cleanest; avoid the sub-redistribution-by-vote lottery entirely; verification is not optional once cash is real.
3. **Two-player is the moat *and* the single point of failure.** Design **graceful degradation** for the one-sided week (the present partner can "hold the boat"; solo days still feed the Glade at a lower rate; the love-tap gently pulls the other back). The app must never feel *dead* when one person lapses.
4. **One builder.** Sequence ruthlessly. Prove Phase 0 before touching money or community.

---

## Data-model sketch (additive to the current Drizzle schema)

New tables/fields, at altitude (not final):

- `seasons` — id, householdId, goalSpec (deficit? workoutsPerWeek?, logDaily?), dreamTitle, dreamRender (e.g. "kauai"), startDay, endDay, status (open | kept | quiet).
- `pact_signatures` — seasonId, profileId, signedAt.
- `coffers` — seasonId, targetAmount, currency; springs on child rows.
- `stakes` — cofferId, profileId, amount, status.
- `pledges` — cofferId, backerRef (a Circle member), amount, status (pledged | released | refunded).
- `patronages` — cofferId, patronId (sponsor), amount, terms.
- `blessings` — fromProfileId, toHouseholdId, hue, givenAt, lastRenewedAt (for the fade).
- `attestations` — seasonId, profileId, kind (weigh-in | workout | intake), evidenceRef, verifiedAt.
- **Prerequisite (Phase 1):** `households` + `household_id` on every existing table; per-user auth; invite pairing. (The Phase-C blocker list from the Act-One audit is the on-ramp to all of the above.)

---

## The one-line north star

*Two people, one promise, a boat across the water toward the thing they've always wanted — and a sky slowly filling with the lights of everyone who believes they'll make it.*

That's the app. Everything we build gets measured against it.
