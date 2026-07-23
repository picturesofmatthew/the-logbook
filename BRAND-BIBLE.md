# Signed × Sealed — The Brand Bible

*The founding brand design bible. This is the bedrock — the absolute place. Everything else is built
on it: `art/ART-BIBLE.md` is **how the brand is drawn** (Inklight production detail); `THE-SIGIL-TURN.md`
and `THE-LIGHTHOUSE.md` are **where the brand lives** (the world). Where this doc and those overlap
(palette, motion), this is the parent; they inherit. v1, decided 2026-07-22. Committed, not tentative —
argue against the decisions, not against vagueness.*

> **One system, three registers.** The **wax seal** is the sigil (the day both keepers close).
> **Correspondence** is the shared book + the voice notes (two people writing to each other over time).
> The **ledger** is the Almanac (the honest record). The **lighthouse** is the world these materials
> furnish. The brand root is tactile — wax, paper, ink, brass — and the arcane sits on top of it, never
> instead of it.

---

## 1 · Brand essence

**One sentence:** Signed × Sealed is a keepsake you build with one other person — a warm, tactile
record that only closes when you both show up, and stays closed forever.

**Three adjectives:** *Tactile. Intimate. Enduring.*

**Five seconds after opening:** *"This is a real place, and it's ours."* Warmth and hush, not a
dashboard. The feeling of a candlelit desk with a letter half-written and a seal waiting — calm,
personal, a little sacred. Never the itch of a notification.

---

## 2 · Color system

Built on the existing Inklight palette (unchanged hexes — do not fork), extended with one new
foundational accent: **sealing wax.** Logic: **surfaces are warm paper; ink is cocoa, never black;
each keeper owns one earth color; the union owns two — garnet wax (matter) and violet (light);
gold is the igniting leaf of achievement.** No pure white, black, gray, pink, magenta, or cool blue —
ever.

### Light (day / the desk)
| Role | Token | Hex |
|---|---|---|
| Surface — cream (primary) | `base.cream` | `#fbf6ea` |
| Surface — paper (raised/cards) | `base.paper` | `#f5eddc` |
| Ink — cocoa (text) | `ink.cocoa` | `#4a3b2a` |
| Ink — soft (secondary text) | `ink.soft` | `#7a6a54` *(derived; the muted cocoa in use)* |
| Keeper A — moss | `flora.moss` | `#7c8a4d` |
| Keeper A — deep pine | `flora.pine` | `#5b6b3c` |
| Keeper B — terracotta | `ember.terracotta` | `#c4704b` |
| Keeper B — muted gold | `ember.gold` | `#d9a441` |
| **Union — sealing wax (NEW)** | `seal.wax` | `#93372b` |
| Union — violet (light only) | `arcane.violet` | `#8d7aa8` |
| Union — sigil illumination | `arcane.illumination` | `#c9b3e3` |
| Glow — wick/candle | `glow.wick` | `#f7e3ae` |

### Dark (night / the lantern)
Not a cold dark theme — the app's **night light-state**. Warm umber, lantern-lit.
| Role | Token | Hex |
|---|---|---|
| Surface — night ground | `night.ground` | `#2f2820` |
| Surface — raised (night) | `night.raised` | `#3a3128` |
| Ink on night | `night.ink` | `#f5eddc` |
| Sky — night violet-deep | `night.sky` | `#453a54` |
| Sky — dusk violet-top | `dusk.sky` | `#6f5a78` |
| Wax on night | `seal.wax.night` | `#a8443338` → glows to `#c25a45` at the seal |

### Semantic states (warm, never alarming)
- **Affirmation / growth** → `flora.moss #7c8a4d` (a thing *grew*, not a green checkmark).
- **Attention / soft caution** → `ember.gold #d9a441` (a lantern raised, not an alarm).
- **Error / trouble** → burnt umber `#7a4b32` (serious, warm, quiet). *Rationale:* the world hushes,
  it doesn't shout. **No red error numbers, no alarm-red, ever** (design law: the score is stated
  wordlessly). `seal.wax` garnet is the *brand* red — reserved for the seal, never for failure.

---

## 3 · Typography

Three registers — **the title, the letter, the ledger** — all free/OFL. Reads like correspondence and
a ledger, never SaaS. No neutral sans anywhere.

- **Display — Fraunces** (OFL, Google Fonts). Soft "old-style" serif with an optical display cut and a
  little wonk. *Rationale:* an engraved storybook title, warm and hand-cut — the opposite of a clean
  geometric sans.
- **Text — EB Garamond** (OFL). A letter-writer's serif for running inscription and body.
  *Rationale:* words look *written*, not shipped; it carries the "correspondence" promise in every
  paragraph.
- **Ledger / labels — Courier Prime** (OFL). A refined typewriter mono for timestamps, data labels,
  marginalia, the Almanac's ruled entries, and the postmark voice. *Rationale:* the typed receipt /
  ledger line — the honest, mechanical counter-voice to the ornate.

### Type scale (px · line-height · face)
| Role | Size | LH | Face |
|---|---|---|---|
| Seal / hero title | 40 | 1.1 | Fraunces |
| Room / section title | 28 | 1.15 | Fraunces |
| Card title | 20 | 1.2 | Fraunces |
| Body | 17 | 1.6 | EB Garamond |
| Small / caption | 14 | 1.5 | EB Garamond |
| Ledger label / meta | 12 | 1.4, +2% tracking, uppercase | Courier Prime |

Figures: **oldstyle** in prose (EB Garamond), **tabular lining** in the Almanac/data. Numbers are
inscribed, not tallied.

---

## 4 · Material & texture language

Three signature materials. Everything in the app is made of one of them.

1. **Sealing wax** — the seal/sigil, the app icon, achievement objects. *Show up:* a domed disc with a
   soft matte sheen (not gloss), rounded pressed edges, a faint gilt rim-catch on the upper-left, tiny
   surface irregularities (real wax is never perfect). Casts a short warm shadow.
2. **Aged paper / parchment** — every surface. *Show up:* a subtle laid/deckle grain (visible tooth,
   no smooth gradients), **deckle or torn edges** on hero cards (never a clean CSS rectangle for the
   important ones), a warm cream-to-paper wash. Fold creases where two halves meet.
3. **Brass / gilt** — hardware, illumination, the lamp, rules and corners. *Show up:* thin single-weight
   lines that *catch* light (a lighter warm edge), used sparingly as the "igniting leaf" of achievement
   — never a full metallic fill, never chrome.

Under all three: **ink** — crisp cocoa single-weight line — is the mark-making layer (the drawing, the
sigil strokes, the icons). Coarse cross-hatching only for shadow, sparingly.

---

## 5 · Lighting rule

**One light source, upper-left, warm candle/lantern (~2700–3000 K), soft-diffuse.** Every hero object
and render is lit as if on the same candlelit desk. Shadows fall short to the lower-right, warm brown,
**never black, never long/dramatic.** Raised objects (wax, brass) get a faint warm rim on the lit edge.
No rim light from behind, no cool fill, no studio three-point drama. *Rationale:* consistency of light
is what makes a set of separately-made assets read as one physical world.

---

## 6 · Motif system

Five recurring motifs. Each has one job.

1. **The Seal** — the wax sigil. *Where:* the app icon, the daily close, achievement, the wordmark's
   heart. The brand's whole thesis in one object: two into one, pressed and permanent.
2. **The Fold** — the letter crease / two halves meeting. *Where:* transitions and reveals, the
   two-keeper join, the seam down the middle of a shared entry. Motion of *closing*.
3. **The Ledger Line** — the ruled entry line. *Where:* logs, lists, the Almanac, form fields. Honesty
   and record; the counter-weight to ornament.
4. **The Signet (×)** — the crossed monogram. *Where:* the wordmark, loading/idle marks, small stamps,
   the seal's core figure. Two strokes crossing into one.
5. **The Ribbon / Thread** — binding and keepsake. *Where:* the book's page marker, tying two things,
   the "saved forever" gesture. Never decorative-only — it always *binds*.

*(World-scale motif, from `THE-LIGHTHOUSE.md`: the **Beam** — the cast reaching the far shore. Used
only at the world level, not in chrome.)*

---

## 7 · Iconography & illustration

**Icons are stamped, not drawn-in-Figma.** Rules that keep everything coherent:

- **Single-weight cocoa ink line**, silhouette-first — every icon must read at **24px** as a solid
  shape before detail. One idea per icon.
- **Slight hand-wobble** (the existing `wobbly` treatment) — corners softly imperfect, as if inked by
  hand or pressed from a worn stamp. No perfectly geometric vector icons.
- **Diegetic where possible** — an icon is an object in the world (a wax seal, a ledger line, a lantern,
  a key), not an abstract glyph.
- **Illustration = ink line + matte gouache wash**, warm-earth palette locked to §2, one light source
  (§5). No gradients, gloss, 3D, photoreal, lens-flare, or flat cartoon-vector.
- **Violet only at the union.** Gold only as igniting achievement. Wax-garnet only for the seal.
- Emoji are never primary iconography (fine as a private, human touch inside a user's own note).

---

## 8 · Voice & tone

**Three principles:**
1. **Write like a letter, not a notification.** Second person, warm, unhurried. It's addressed to two
   people who chose each other.
2. **Name the effort, never the streak.** We honor showing up. We never threaten loss, count against
   you, or manufacture urgency.
3. **Say less; let the world show the score.** The wax, the light, the growing book carry the state.
   Copy points, it doesn't cheer.

**Do / Don't:**
| Do | Don't |
|---|---|
| "Your keeper left their half of the day." | "⚠️ You're about to lose your streak!" |
| "Sealed. It stays." | "Great job!! 🎉🔥 +10 XP" |
| Name the person / "both of you" | Corporate "we"/"users" |
| Concrete objects (wax, page, mantle) | Abstract SaaS ("engagement," "sync") |
| Let a quiet day be quiet | Shame, nags, red counts, FOMO |
| Understate the win | Hype words / exclamation-driven cheer |

**Three microcopy samples (in voice):**
- **Empty state (unwritten day):** *"An unwritten page, and the wax is still cool. Set your half down
  whenever the day's ready — the seal keeps for both of you."*
- **The moment a seal closes (both logged):** *"Both hands on it. Today is sealed, pressed into the
  book — and it stays."*
- **Gentle nudge (partner logged, waiting on you):** *"Your keeper set their half on the mantle. The
  wax is still soft — close it whenever you can."*

---

## 9 · Motion & ritual

**Stillness is the resting state.** Motion is reserved for the ritual, and the ritual has weight.

- **Input is fast; ritual is slow.** Logging is quick and native (seconds, no friction). The *reward*
  — the seal closing — is where time slows and the craft shows. Never make someone sit through
  ceremony to log; the ceremony wraps the *payoff*.
- **The two-keeper close** (the signature moment): each keeper's half is drawn in their own color
  (moss / terracotta); the two halves move toward each other and **press** — a real wax press, with a
  slight weight-squash and settle (a touch of overshoot, then rest), not a bouncy pop. **Gold ignites**
  along the closed lines; **violet blooms** at the exact seam where they meet.
- **Pacing shape** (from `THE-LIGHTHOUSE.md`): *fast up, slow down.* The cast releases upward
  (exhilaration), then returns and settles (ceremony). Up like a struck match; down like a held breath.
- **No idle jitter, no confetti, no particles-as-reward.** The one permitted "particle" is drifting
  ink-dot motes — sparks off the drawing, never lens-flare.

---

## 10 · Application examples

- **App icon:** the **Seal** — a domed disc of sealing-wax garnet (`#93372b`) impressed with the ×
  signet (two strokes crossing into one), a gilt rim-catch upper-left, on a torn sliver of paper, lit
  per §5. Reads as a warm red seal at 16px. *(The lighthouse is the world/marketing hero; the icon is
  the seal — the brand root, and legible small.)*
- **Onboarding:** the letter arrives before the world. Open on a sealed envelope / a wax seal on paper;
  breaking it reveals the wide island under a shared sky (`THE-LIGHTHOUSE.md` cold open), then the
  camera settles at the hearth. Correspondence → world, one move.
- **The core "seal" moment:** the mantle; two halves in moss + terracotta; the press; gold ignites,
  violet blooms at the seam; the day's sigil settles onto the page as it turns. This is the app's peak
  and the only place spectacle is allowed — because it's *earned* by two real people.
- **A shared entry:** a spread like a letter answered — the day's seal at the head, both keepers'
  inscriptions **facing each other** across a center fold, a voice-note wax-dot pressed in the margin.
  Ledger lines below in Courier; the human record above in Garamond.

---

## 11 · Do-not list

- No **streaks**, streak-loss language, or any count that can go *down* as punishment.
- No **confetti, XP, badges-as-slot-machine, dopamine bursts, or reward particles.**
- No **neon, no gloss, no gradients, no 3D/photoreal, no lens-flare, no chrome.**
- No **pure white / pure black / flat gray** as primary surfaces; no pink/magenta/cool-blue in the art.
- No **red error/alarm states**, no red numbers, no shame or nag copy.
- No **cold SaaS minimalism** — empty white space as "clean," Inter/Helvetica neutrality, dashboard
  energy.
- No **hype words** (stunning, amazing, revolutionary) and **no manufactured urgency** (limited-time,
  don't-miss, act-now) anywhere in copy.
- No **generic flat-vector icons**, no emoji as primary iconography, no material-design drop shadows.
- No **object that couldn't physically exist** — everything obeys real material + one warm light.

---

## Open decisions (my call logged, argue if you disagree)

1. **Wax color ownership.** *Call:* the sealing-wax garnet `#93372b` belongs to the **union** (both
   keepers), distinct from terracotta (keeper B). *Alt:* make the seal simply keeper B's terracotta.
   *Rec:* keep it union — the seal is the one thing neither owns alone.
2. **Fonts vs. what's live.** *Call:* adopt **Fraunces / EB Garamond / Courier Prime** as canonical.
   *Rec:* adopt, and reconcile with the current in-app `font-display` in the redesign (need to confirm
   what's live).
3. **App icon.** *Call:* the **wax seal**, not the lighthouse. *Rec:* seal for the icon (brand root +
   small-size legibility); lighthouse for the marketing/world hero.
4. **Dark mode.** *Call:* the **night light-state** (warm lantern), driven by time of day — not a user
   toggle, not a cold theme. *Rec:* keep it diegetic.
5. **Violet's range.** *Call:* violet stays **union-only** (load-bearing); wax-garnet + gilt gold are
   the everyday accents. *Rec:* hold the line — violet's scarcity is what makes union feel sacred.

## The five questions that would most sharpen v2

1. Should the **sealing wax** read redder/brighter (more obviously "wax") or stay in the burnt-earth
   family it's in now — and does its color shift at the *moment* of sealing (cool garnet → lit ember)?
2. How **literal** is the correspondence metaphor in the UI — do we use actual envelopes, letters, and
   postmarks, or keep it abstracted into the seal + book language?
3. What is the **× in the wordmark** — always a *crossing/press* (two into one), or can it also read as
   "times/and"? (Decides whether the signet is a seal-figure or a ligature.)
4. Is there a **secondary human record** we want the brand to hold beyond food/workouts — letters
   between keepers, photos, anniversaries — that the "correspondence" language should be designed for
   now?
5. What's the **one object** you'd want a user to feel they own after a year — the book, the seal
   collection, the island, the light? (Whichever it is becomes the brand's center of gravity.)
