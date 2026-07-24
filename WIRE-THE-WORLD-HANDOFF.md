# Wire the World — handoff for full interactivity

*Pickup doc, 2026-07-24 (Matthew). The four ported rooms are built (a visual audit is pending —
`WORLD-AUDIT-HANDOFF.md`). This doc is the **next arc: give the live world verbs.** Three initiatives
+ the interiors-deepening backbone, each speced to its real code seam. Discipline unchanged.*

---

## The reframe (start here)

**The rooms are not shells — they are live tableaux missing interactions.** `app/page.tsx` runs ~15
real Neon queries and hands each room a typed snapshot; every room reads true data *today*. What's
thin is **verbs, not wiring.** (The Lantern is the only room with *zero* interactivity — pure display,
by design, until the Beacon.) So this handoff is not "connect a mockup to a database." It is **"add
verbs to live rooms."** Good news, and it sharpens the work.

## Decisions locked this session (2026-07-24)

- **Food alternatives = pure deterministic.** Same hall, better macros. No curated seed, no LLM. The
  simplest honest version. (Escape hatches catalogued under Initiative A, explicitly deferred.)
- **Character = curated Inklight archetypes** (**6–8**, get creative — each a distinct keeper
  temperament), same procedural-SVG lineage as the sigil / familiar.
- **Invite delivery = $0 share-link.** The craft is in how the letter *unfurls when opened*, not the
  transport. No email in v1.

---

## Initiative A — The Apothecary's Counsel (healthy alternatives)

**Intent.** Bring a provision, see *of the same materia, more virtue* — lower-calorie /
higher-protein kin. Framed as the Apothecary's **transmutation**, NOT a MyFitnessPal browse (canon
retired "food as the Library's star" — keep this a **whisper**, not the room's center).

**The engine (build first — pure + tested).**
- New `lib/engine/alternatives.ts`, pure fn, unit-tested (`npm test`; add to the 75).
- `finerProvisions(target, pool)` → filter `pool` to the **same `hall`**, exclude self; rank by a
  **serving-invariant** metric; return the top few that beat the target by a real margin.
- **The honest subtlety to get right:** macros are stored **per `servingLabel`**, and serving labels
  vary ("1 cup" vs "per 100 g" vs "your serving"). So raw "lower calories per serving" across two
  foods is apples-to-oranges. The clean serving-invariant metric is **protein density =
  `proteinG / calories`** — "more protein, fewer calories" in one ratio, independent of serving size.
  Rank by descending density; surface only kin that beat the target's density by a meaningful margin.
- **Tone-law guard:** if the target is already dense (already lean), return few/none —
  *"already a fine provision."* Never imply what they ate was wrong.
- **Data in:** `getAllSpecimens()` (`lib/data.ts`) for the pool (the global `foods` table — columns:
  `hall`, `calories`, `proteinG`, `carbsG`, `fatG`, `servingLabel`). For a *personalized* version,
  anchor to the couple's own high-frequency foods via `entries` (bond-scoped) — a v1.1 nicety.

**The surfaces.**
1. **The Library (Matthew's ask — the home).** `app/library/page.tsx` `#apothecary` already loads
   every `Specimen` grouped by `HALLS` and renders `SpecimenCard`
   (`components/museum/specimen-card.tsx`). Add "finer kin" to a specimen's detail (on tap/expand) —
   the data's already in hand.
2. **Log-time (highest value — strong secondary).** In the capture flow
   (`components/shell/capture-sheet.tsx`, which already holds `recents: Specimen[]`), when a food is
   picked, whisper *"a finer provision exists →"* — non-blocking, dismissible. This is where a swap
   actually changes a choice.
3. **In-world Apothecary spread (later).** ⚠ `world-spread.tsx` was **cut 2026-07-24** (hotspots open
   the real pages now) — this surface returns only when the in-world interiors are rebuilt deep.
   Requires widening `LibrarySnapshot` beyond the current `provisions: number` count.

**v1 vs deferred.**
- **v1:** the engine + surfaces 1 & 2. Pure deterministic protein-density ranking within a hall.
- **Deferred (catalogued per this session's decision — NOT in scope):** (a) a curated swap seed for
  culinary cross-hall swaps (burger → turkey burger); (b) an LLM ideation layer for the long tail
  (proposes *directions*, USDA grounds the *macros* — the split architecture, mirroring
  `app/api/food-estimate`). Reach for these only if the same-hall proxy proves weak in dogfood.

---

## Initiative B — The Beacon (the lamp as social organ) — CATALOGUED, not built

See **`THE-BEACON.md`** (new canon this session). Summary: the lamp's future verb is aiming your beam
across the water to another bond's island — encourage them (a being to their glade, free, only on
days you kept your own light) or pledge money toward their Dream (future, coffers rail). It's the
archipelago inhabited + the moat's second layer + the invite grown up.

**Nothing ships now.** The only *present* obligations are guardrails so we don't foreclose it:
- **Lantern** (`lantern-room.tsx`): when it gets its first verb, keep the **beam aimable** (rotation
  target + selectable neighbor), not hard-wired to the far shore.
- **Coffer** (`docks-room.tsx` "LATER" chest): stays the future **pledge rail** — keep it honest/dim.
- **Archipelago** (`THE-LIGHTHOUSE.md`): keep "private islands, shared heavens" clean; no private data
  in the shared layer.
- **Neighbor-invite** reuses `lib/invites.ts` machinery one tier up (a mutual `bond_id`↔`bond_id`
  relation).

---

## Initiative C — Onboarding as cold-open + the Letter

**Intent.** Signup stops being a flat form and becomes the **cold-open** (canon: arrive pulled-out on
a dark island → light it). Beats: **name yourself → choose your keeper → speak your vow → seal the
letter.** Both keepers go through it (moss at signup, ember on accept — symmetrical).

**Schema** (edit `db/schema.ts` → `npx drizzle-kit generate` + `npm run migrate`; **never `push`**;
watch the drizzle PK/USING gotchas per `CLAUDE.md`):
- `profiles.character` — the chosen keeper archetype (enum of 6–8, or text). Greenfield.
- `profiles.vow` (text, the per-user intent line) + optional `profiles.vowKind` (enum:
  grow / learn / tend / steady / other). **Tone-law: a compass, never a scored target.** Greenfield.
- `invites.message` (text) — the summons line the inviter writes, so the letter can show it.
  (Personal, not health-tier; encryption optional — note it.)

**Character system.**
- New `components/keeper/keeper-glyph.tsx` — procedural SVG composer `keeperSvg(archetype)`, mirroring
  `components/familiar/familiar-glyph.tsx` (`foxSvg(stage)`) and `components/sigil/glyphs.ts`
  (`composeSeal`). **6–8 archetypes** — get creative, each a distinct keeper temperament (a starting
  cast: the Scholar / Athlete / Wanderer / Tender / Mystic / Forager / Smith / Navigator…), swappable
  for hand-drawn masters. Inklight: ink line over matte gouache, warm earth.
- Bind to the hearth mantle: `components/world/rooms/hearth-scene.tsx` — canon says two chosen sprites
  flank the mantle; today generic. Each side reads its profile's `character` (moss = viewer,
  ember = partner).

**Onboarding flow.**
- `/join` (`app/join/join-form.tsx` + `signup()` in `app/join/actions.ts`) → rework the single flat
  form into the world-beats sequence. Persist `character` + `vow` in `signup()`. **Keep the consent
  gate (B4b) intact + server-enforced.**
- Ember keeper: same beats after `redeemInvite`, on accept.

**The Letter (the centerpiece — lavish it).**
- **Compose (inviter):** `app/invite/invite-panel.tsx` + `makeInvite()` (`app/invite/actions.ts`) →
  `createInvite()` (`lib/invites.ts`). Reframe the UI from the utility "create an invite link"
  (today: generate → copy) into **sealing a letter**: write a summons line, press your seal (the
  living half-lit ×). Persist the line on `invites.message`. Output stays a **shared link** ($0 —
  share-sheet/copy; the natural channel for LDR couples).
- **The unfurl (recipient):** `app/join/page.tsx` when `?invite=` is present. Today it's a small card
  (*"{inviterName} is waiting for you"*). Transform into the **letter**: addressed to them, the
  inviter's summons line, the **living half-lit seal** (render the sender's inked side of the sigil,
  awaiting the second hand), the dark island that lights on accept. Extend `invitePreview(token)`
  (`lib/invites.ts`, today returns `{inviterName}`) to also return
  `{ message, inviterCharacter, halfSealSpec }`.
- **The acceptance ceremony (sender's side):** when ember joins, the sender's world gains the second
  sprite at the hearth and the seal can finally close. `needsKeeper` (`app/page.tsx`, drives the
  hearth `world-invite` button) already flips false — make the arrival a small **ceremony**, not just
  a state change.
- **Delivery:** $0 share-link (decided). Owl-by-email catalogued as a later nicety (introduces an
  email service — cost / deliverability; not now).

**⚠ Sequencing note (important).** The DB is clean-wiped awaiting the **first signup** (Matthew +
Kennedy). Land the onboarding rework **before** they sign up, so they go through the real cold-open
and their profiles carry `character` + `vow` from day one. If they sign up on the old flow first, make
character/vow editable in `/settings` as a fallback (less magical).

---

## The backbone — deepen the interiors (carries all three)

⚠ **Superseded 2026-07-24 (the atoms audit): the interiors are FROZEN and `world-spread.tsx` is cut**
— room hotspots open the real pages. Kept here for when the deep spreads are built. All three
initiatives touched it or its neighbors:
- The Apothecary's in-world surface (A.3) lives here.
- The Letter's unfurl is a cousin pattern (an overlay bound to real data).
- Cross-ref `WORLD-AUDIT-HANDOFF.md` — the Book of Days → true rereadable spread, the shore interior —
  same file, same arc.

## Discipline (unchanged, load-bearing)

- **Game-*feel*, not scope.** Verbs wrap the payoff, never toll the input. Logging stays ten seconds.
- **Current web stack.** DOM/SVG/canvas + transforms. This does **NOT** un-park the native rewrite
  (`LAUNCH-PATH.md`). If a build starts reaching for native, stop and flag.
- **Spectacle stays earned.** Every ornament sits on a **true** number.
- **Tone-law.** No red numbers, no streaks, no leaderboards; the world states the score wordlessly.
- **$0 until users.** No recurring spend before paying couples (the Beacon's money tier, an email pipe
  — all wait).

## Build order (suggested)

1. **Onboarding + the Letter** (C) — land before first signup; it's the first thing Matthew + Kennedy
   touch, and the invite is the growth engine.
2. **The Apothecary's Counsel** (A) — engine first (pure, tested), then Library + log-time surfaces.
3. **Beacon guardrails** (B) — only *don't-foreclose* work; the feature itself is future.
