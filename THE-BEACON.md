# The Beacon — the light you send across the water

*Canon, decided 2026-07-24 (Matthew). The lamp at the top of the lighthouse is not only your own
score — it is the app's **social organ**. From it you can aim your beam across dark water to **another
bond's island** and send them light. This doc catalogues that future so we build **toward** it; it
**evolves** the archipelago section of `THE-LIGHTHOUSE.md` (private islands, shared heavens — now
*inhabited*) and is the home for every social / relational decision. Future-facing: **nothing here
ships until the guardrails at the bottom are cleared.** Living — iterate as we see it.*

---

## What's built vs. canon-only (2026-07-24)

- **Built:** the Lantern room renders the lamp's three watches (lit / kindled / dark) and the beam
  sweeping the far shore — but it is the **one room with zero interactivity** (pure display, by
  design, until this). Partner-pairing exists (one bond, moss + ember). The archipelago is *written*
  in `THE-LIGHTHOUSE.md` but not built.
- **Canon-only (this whole doc):** any bond-to-bond connection, the inhabited archipelago, aiming the
  beam, sending light, and the money pledge. None of it exists in code.

## The world in one breath

**Keepers watched for each other's fires.** When your own lamp is lit, you can turn your beam to a
neighbor's island and send them light — a being to their glade, a mote to their sky — or, one day, a
plank toward their Dream. You never enter their world or read their book; you send warmth across the
water. *Private islands, shared heavens — now with someone waving from the next island over.*

## Why the lamp (the machine, not the costume)

- **The Lantern is the one dead room** — pure display, no verb. It has been waiting for exactly this.
- **The mechanic already exists.** Canon's beam "reaches across dark water toward the far shore."
  Aiming it at *another island* is the same gesture, a longer throw — no new metaphor invented.
- **It doesn't break two-player intimacy.** You send **light**, never entry. The seal still cannot
  close except with your own keeper. Encouraging a neighbor is not keeping their light *for* them.

## The architecture — the archipelago, inhabited

1. **The neighbor's island.** Pull all the way out (the pinch-out gesture canon already reserves) →
   the archipelago: your island, and the islands of bonds you've **mutually connected** with. No
   public directory, no discovery feed (intimacy first). Each neighbor shows only what's honest at a
   distance: their **lamp** (lit or dark tonight, wordlessly) and their **far shore** (their Dream),
   small and gold. Never their logs, book, or bodies.
2. **Connecting = a neighbor invite.** Bond-to-bond, the grown cousin of partner-pairing: one bond
   sends a "neighboring" letter, the other accepts. Mutual, revocable. (Same token machinery as
   `lib/invites.ts`, one tier up — a relation between two `bond_id`s.)
3. **Aiming the beam.** From the lamp room, you select a connected island and aim. This is the verb
   the Lantern lacks today.

## The two gifts you send across the water

- **A light (free, now-era).** Encouragement. You send a **being** to visit their glade, or a mote of
  light to their sky — a warm, wordless *"I see you keeping your light."* Costs nothing, punishes
  nothing.
  **The rule that makes it beautiful and on-thesis: you can only send light on a day you kept your
  own.** Generosity is earned by practice; no drive-by cheerleading, no empty taps. When your own
  lamp is dark, the beam won't reach.
  **The mote is *yours*, and it lingers.** What you send carries your own signature hue and drift —
  tap it and they see who, and when. It glows bright for a season, then **softens and fades unless
  you keep showing up**, so a sky full of light means neighbors are *still* with them, not that they
  once went viral. (The drifting sky-mote from `ACT-TWO §5`, made personal.)
- **A plank (real money, future-era).** You pledge real money toward *their* Dream — a plank in
  *their* boat toward *their* far shore. This is `COFFERS.md`'s **witness-not-holder** model extended
  socially. It carries the most trust weight in the whole product and ships **last**, on the
  couple-owned coffers rail — never Stripe Connect.

## The intimacy law (non-negotiable)

- You see a neighbor's **lamp-state** and **Dream-distance** — nothing else. No logs, no book, no
  weight, no mood, no notes.
- **Mutual opt-in only.** No public profiles, no discovery, no follower counts.
- **No leaderboards, ever.** Ranking couples against each other violates the tone law (no scold, no
  streak; the world states the score wordlessly). The Beacon is warmth, not competition.
- **You cannot keep someone else's light for them.** Encouragement ≠ logging. The seal is still
  two-people-one-bond.

## Why this is the moat's second layer + the growth engine

- **Two-player made the product un-retrofittable.** The Beacon makes *leaving* costly — your
  neighbors' encouragement, the shared archipelago — **without ever gamifying or punishing.**
- **It's the invite grown up.** The partner-invite is the first viral loop (the half-lit seal one
  keeper sends). The neighbor-invite is the second (couples pulling in couples). Beachhead:
  **long-distance couples** — who already live by the cross-distance love-tap and are the most likely
  to want a *community* of other LDR couples keeping their lights.

## How it maps to what exists (build toward, don't foreclose)

- **The Lantern** (`components/world/rooms/lantern-room.tsx`) — today no `Hotspot`, no handler; the
  beam is SVG polygons in `.ln-beam-sway` (already sways ±0.7°). *Guardrail: when the Lantern gets
  its first verb, build it so the beam can later **aim** — a rotation target + a selectable neighbor —
  rather than hard-coding it to the far shore only.*
- **The coffer** (`components/world/rooms/docks-room.tsx`, the "LATER" chest) — this becomes the
  **pledge rail**. Keep it honest and dim until the coffers work lands.
- **The archipelago** (`THE-LIGHTHOUSE.md` §archipelago) — keep "private islands, shared heavens"
  clean; the Beacon is its inhabited form. Don't let private data leak into the shared-heavens layer.
- **Invites** (`lib/invites.ts`, the token-hash pattern) — the neighbor-invite reuses this machinery
  one tier up (a mutual, revocable `beacon_links` / `neighbors` relation between two `bond_id`s).

## Guardrails before ANY of this ships

- **$0 until users.** Cross-bond infra, moderation, and especially money pledges wait for paying
  couples. This is a north-star catalogue, not a next-sprint build.
- **Moderation surface.** The moment one bond can send *anything* to another, there's an abuse
  surface. The free tier is deliberately low-abuse (a being, a mote — **no free text across the
  water** in v1). Any free-text greeting needs a moderation answer first.
- **Real money = real legal duty** (`RISK-REGISTER.md` Tier 2 + `COFFERS.md`). The pledge tier ships
  only on the couple-owned rail, with counsel.

## Still open (Matthew's calls)

- **The name.** `THE-BEACON` (working) / "the Answering Light" / "the Signal Fires" / "the Watch."
  Keepers historically watched for each other's lights across the water — that's the feeling to name.
- **The free gift's exact form** — a being to their glade, a mote to their sky, or both.
- **The archipelago's v1 shape** — a full spatial pull-out view, or a simpler "neighbors" panel to
  start.
- **Twinned Pacts (catalogued future).** Two couples who know each other **twin their Pacts for a
  season** — push each other, visible to each other. The tightest on-ramp to community
  (bring-your-own-rival) and a way past cold-start — still warmth, never a leaderboard. (From
  `ACT-TWO §5`.)
