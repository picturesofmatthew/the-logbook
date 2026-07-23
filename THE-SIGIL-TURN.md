# The Sigil Turn — the thesis re-centered

*Canon, decided 2026-07-20 (Matthew). Supersedes the pet-raising emphasis in `DIRECTION.md` and
fuses the sigil engine with `ACT-TWO-THE-FAR-SHORE.md`. Living — iterate as we see it in-app.*

---

## The turn, in one line

**The sigil is the spell. The spell lays the plank. Each plank sets into the boat; the boat carries you to the far shore.**

We are no longer raising a pet. The maturing-creature loop is demoted from *the game* to *a bonus*.
The focal point of the entire app is the **sigil** — the daily seal both keepers compose together —
and the **magic of casting it.**

## The causal spine (the daily loop)

> both keepers log → the day composes its **sigil** → the **completion ceremony** fires (the magic
> moment) → a **spell** is cast → a **plank** sets into the **boat** → the **far shore** (the
> Dream — Matthew & Kennedy's is Kauai) draws one step closer.

Everything the app does now points at that one moment. Retention flows from it: not "show up or the
pet is sad" (streak-logic in a cuter coat), but **the spell you can only cast together, and the
boat that only grows when you both show up.** Two-player-mandatory *magic*, not guilt. This is the
moat — an incumbent solo tracker cannot retrofit a spell that requires two hands.

## The sigil, elevated

The seal is the star, so it earns real craft:

- **Chord-runes — cohesion made legible.** Each chord (struck when the two logs align — Lean, Iron,
  Anvil, Spring, Green, Hearth, Mirror, Scribe's, the New Mark…) **inscribes its own rune into the
  seal.** The sigil doesn't just look richer when you're in sync — it *spells out how* you were in
  sync. More cohesion → more runes ignite → a more complex, more illuminated seal. Reading each
  other's day becomes reading the art itself. (The engine already computes the chords; this makes
  each one *visible* as a mark.)
- **Complexity scales with the partnership.** Common (both logged) → Fine → Resonant (violet
  linework) → Legendary (fully illuminated, an ornate frame). The seal is a portrait of the day the
  two of you made.
- **Violet is the crescendo.** Violet = union. The completion ceremony is the app's magic peak, so
  violet blooms there and (almost) only there.

## The emblem ladder — the material escalates with the tier

Think **ranked emblems in matchmaking / ELO** (Iron → Gold → Diamond): each rung isn't just more
ornament, it's a higher-quality *object*. The sigil does the same — the day's tier changes what the
seal is *made of*, so rarity is felt as a **change of state, not a label** (design law: the world
states the score wordlessly):

- **Common / Fine** — matte ink-and-gouache on parchment. The everyday seal.
- **Resonant** — gold leaf catches; edges and chord-runes illuminate; violet linework enters.
- **Legendary** — the whole seal lights up like **stained glass**, glowing from within — a different
  material entirely.

The completion ceremony's climax is literally this state-change (paper → lit glass). Reference: the
two 2026-07-20 boards — the matte slate seal is the **base state**; the stained-glass panel is the
**legendary state**. Render **matte-first**; reserve glass-glow and any near-photoreal richness for
the legendary peak, never the default. *(Validation: Nano Banana held the full palette + chord-runes
+ violet-at-union on the first try — the generation pipeline can carry our world.)*

## The completion ceremony — the most important animation in the app

North star: **an illuminated manuscript coming alive** — the *feeling* of a Doctor Strange sling ring
(rotating rune mandala, orbiting sparks, a portal opening) translated entirely into our idiom. Never
literal Marvel VFX — that would break the matte-gouache Inklight law and the IP.

The one place we let motion break the stillness:
- the ink **draws itself** on, stroke by stroke;
- **gold leaf ignites** along the lines; the ring **rotates like an orrery**;
- **violet blooms** at the union point where the two halves meet;
- **ink-dot motes** spark off and drift (our particles — sparks, not lens-flare);
- the "portal" is not a hole in space — it is the **plank setting into the boat, drawn in the
  same ink.**

Magical, and unmistakably *our book*. Deserves its own motion spec (frames + timing) before build.

## The grimoire feeling

The record should feel like **looking back on a photo album or a long-standing diary** — accumulating
memory, never a streak to default on. The book fills; you flip back through the life the two of you
built. This is the second retention pillar under the ceremony.

## The bestiary, demoted and thereby saved

Creatures are now a **cute bonus**, not the loop — and the fix that keeps them meaningful is that
they are **summoned, not raised.** Every being is already tied to a chord family; lean in:

- Beings are **drawn to the glade by the spells you cast.** Cast enough Iron spells → the Stag
  arrives. Sustain the Spring → the Heron comes and the pool appears.
- **Maturing still happens** — a being deepens with continued spells of its kind — but it is ambient
  reward, never the daily driver.
- The bonus **expands** beyond creatures: **artifacts, glade details, special unlocks** — all things
  your spells collect over time.
- **The pantry/museum folds in** — the food collection becomes one shelf of the Compendium.

Consequence of the magic, not a parallel toy.

## The four books — a shelf you keep

> **Evolved 2026-07-22 by `THE-LIGHTHOUSE.md`** — the books are now **five**, and they live **up the
> stairs in the Library** of the Lighthouse; the *hearth hall* is home, not the shelf. The human/arcane
> split below still holds; the count and location changed.

Navigation becomes **diegetic** (design law #4): a shelf of books; tap a spine to open. Keep the
**shelf as home**; the open-flip is quick and **skippable after the first time** (it must not become
a chore on a phone checked daily).

| Book (proposed) | Holds | The feeling |
|---|---|---|
| **The Scrapbook** *(or "The Days")* | daily entries — food, mood, the note, someday a photo | photo album / long diary — the **human** record |
| **The Spellbook** *(or "The Grimoire")* | sigils cast + the boat & the Dream advancing | the heart — the **arcane** record |
| **The Compendium** *(or "The Field Book")* | beings + pantry/museum + artifacts + glade details | everything collected by casting |
| **The Almanac** *(or "The Ledger")* | trends, numbers, patterns over time | the quiet data book |

Deliberate split so two don't overlap: **Scrapbook = the human record** (what you ate, how you felt);
**Spellbook = the arcane record** (the seal, the chords, the plank). Same day, two lenses.

## What this changes downstream

- **Art priority flips: sigils first.** The sigil parts library, the composed-seal showcase (common →
  legendary), the completion-ceremony frames, and the four book-spines/covers are now the lead
  assets. Beings drop to bonus priority. See `art/asset-sheets.md` (re-prioritized).
- **Engine:** the sigil engine (`lib/engine/sigil.ts`) is already the core; add **chord-runes** (a
  rune per chord seated in the seal) and the **spell → plank → boat** link (the boat/Dream from
  Act Two becomes the sigil's output surface).
- **IA:** the single `/book` becomes a **shelf of four books**; the pantry is absorbed into the
  Compendium.

## Still open (Matthew's calls)

- **Book names** — the four titles above are proposals; land your own.
- **Ceremony intensity** — how far the "sling-ring" spectacle goes before it tips from magical to
  much. Tune live.
- **Glade vs. Vale** — still your naming call (spec says Glade).
