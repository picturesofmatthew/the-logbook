# Review & Simplification Plan — the World build

*Pickup plan for the next context. This session (2026-07-23) shipped the Lighthouse
world as the app — **9 commits, "World Engine 1–9/n"** on `main`. It was built fast
and deployed live; this plan is the disciplined pass to make it correct and clean
before we build further. Do it roughly in order: **canon → review → simplify →
triage the punch list.***

---

## 0. What was built (the review surface)

The app is now **one inhabited world**. `/` renders the Lighthouse; opening the
site crosses a **mandatory cold-open gate** (the whole world → tap *begin* → a
fluid push-in to the hearth). The old glade home retired; its glade is the Garden
room, its seal the hearth mantle, its horizon the Docks. The five rooms
(hearth · garden · docks · library · lantern) are all real and swipe/rise-navigable.

**Commit range:** `d8a57b6..HEAD` (World Engine 1–9/n).

**Key files touched / added:**
- `app/page.tsx` — **rewritten**: the world + the relocated core-loop pipeline + ceremonies. *(highest-risk file)*
- `app/hearth/page.tsx` — now a redirect to `/`.
- `components/world/world-shell.tsx` — **the big one**: camera + swipe + the cold-open gate + the room slots + in-world logging. ~500 lines.
- `components/world/rooms/` — `overview-scene.tsx`, `library-room.tsx`, `docks-room.tsx`, `garden-room.tsx` (new); `stub-rooms.tsx` (now just the Lantern + air configs + Stars); `hearth-scene.tsx` / `hearth-svg.ts` / `hearth-atmosphere.ts` (pre-existing); `hearth-room.tsx` **deleted**.
- `components/world/room.ts`, `room-stage.tsx`, `atmosphere.tsx`, `atmosphere-config.ts` — the engine (mostly pre-existing; `RoomStage` is now **unused** since the shell renders scenes directly — decide keep vs delete).
- `components/shell/ribbon.tsx` — repointed to a single "home" tab; `rune-icons.tsx` — `HearthRune` added.
- `app/library/page.tsx` — "Pantry" → "The Apothecary"; Relics section removed. `app/museum/page.tsx` — redirect anchor updated.
- `app/globals.css` — a large block of world CSS (`.world-shell/-camera/-slot/-coldopen/-wordmark/-begin/-log/-nav/-hotspot`, `.garden-*`, `.ov-*`).

---

## 1. Canon refresh — DO FIRST (cheap, orients everything)

The docs describe a world that changed under them. Fix before reviewing so the
review has a true north.

- **`CLAUDE.md` Quick Resume** — still says "voice shipped / B2 cutover / next = the Lighthouse build." Now: **the world IS the app** (`/`), entered through the gate; all five rooms real; logging at the hearth; old home retired.
- **`PROJECT-BRAIN.md`** — status snapshot + a decision-log entry for the world-as-home (World Engine 1–9/n).
- **`THE-LIGHTHOUSE.md`** — annotate **built vs. still-canon-only** (built: rooms, swipe/rise, gate, lantern-by-spell; not yet: full cast cinematic, in-world book interiors, archipelago).
- **`WORLD-ENGINE.md`** — note the shell superseded per-room `RoomStage` (scenes render directly; one shell-level atmosphere swapped per room).
- Memory: `world-shell-phase1.md` already tracks the play-by-play — keep it as the source of truth for what shipped.

---

## 2. Code review — `/code-review` on the branch diff

Ranked by risk. The first two are the ones that can silently break the product.

### 2a. The core-loop relocation — `app/page.tsx` *(most important)*
The recording + ceremony pipeline moved from the old glade home into the new `/`.
**Verify it moved EXACTLY** — diff the new `app/page.tsx` against the old one in git
history (`git show d8a57b6:app/page.tsx`). Confirm:
- `recordLegendary` / `recordArrival` (beings + pale-elk) / `reachShore` all fire with the same conditions and idempotency.
- `legendaryToday` / `beingArrivedToday` / `shoreReachedToday` computed identically (first-discovery-day gating for legendaries).
- The four ceremonies render with the same props + the grandest-wins suppression.
- `closer` / `closerLine` logic intact.
- Nothing the old home did on load was dropped (stamps were intentionally dropped — confirm that's fine).

### 2b. Gate ↔ log ↔ refresh interaction *(verify in a real browser)*
- **Logging must NOT replay the gate.** The log button → `useShell().openCapture()` → after a log, `router.refresh()`. Confirm the `WorldShell` `phase` state is preserved (stays `live`) through the refresh — i.e., the gate does not re-fire. (Client state should survive a soft refresh; verify.)
- The capture sheet (z-50) stacks over the world (z-50, later in layout DOM) — confirm it shows and is usable over the world.
- Completing the seal from the world → the seal updates on the mantle AND the Lantern lights AND the ceremony fires. Walk the full loop.

### 2c. z-index / layering seams
- Capture-sheet **backdrop is z-40 < world z-50** → no dim over the world (sheet shows, but the world isn't dimmed). Decide: bump the sheet's backdrop above the world, or accept.
- Ceremonies (fired in `app/page.tsx`) render over the world but **behind the cold-open** (z-60) during entry — confirm they appear correctly after the gate clears and don't double-animate.

### 2d. Data + correctness
- `app/page.tsx` now fetches a lot in three `Promise.all`s (journal/extras, workouts/logs/histories/glade, familiar/discoveries/arrivals/specimens/shores). Confirm no redundant queries and that every snapshot (`library`/`docks`/`garden`) reads the right fields.
- `DreamRow.id` is a `number` (the `LibrarySnapshot.shores.id` type) — sanity-check the shores mapping.
- The Garden rides the app light-script by design (the one lit-by-now room) — confirm that's intentional-looking, not a bug.

### 2e. Accessibility & motion
- The world `role="img"` + `aria-label` per room; the gate's `aria-label`; hotspots are `role="button"` + `tabIndex` + Enter/Space. Verify keyboard nav (arrows move rooms; books/vessel openable by keyboard).
- **Reduced-motion**: gate skips to `live` on *begin*; camera transition `none`; atmosphere still-frame; `ov-*` animations off. Verify end-to-end with the OS setting on.
- Focus management when the gate clears (does focus land somewhere sensible?).

---

## 3. Simplification — `/simplify` on the world components

After 9 fast commits, cleanup targets:

- **`world-shell.tsx` is large** and does five jobs. Extract:
  - the **cold-open gate** (phase machine + overlay + overview) into `useColdOpen()` / a `<ColdOpen>` component;
  - the **swipe camera** (gesture handling + `neighborFor` + `glide`) into `useCamera()`;
  - leaving the shell as: build slots → render camera + atmosphere + chrome.
- **`app/page.tsx` snapshot-building** (library/docks/garden/sigil/standingLine) → a single `getWorldSnapshot(bondId, today)` in `lib/` so the page is thin and the world data has one home. (This also de-risks 2d.)
- **`stub-rooms.tsx`** is now just the Lantern + air configs + `Stars`. Rename to `lantern-room.tsx` (+ a shared `world-air.ts` for the air configs), and lift `Stars` to a shared helper (overview + lantern both define star fields).
- **`RoomStage` / `room.ts`** — the shell no longer uses `RoomStage`. Decide: keep as the documented single-room engine, or delete (the shell is the real engine now). If keeping, note why.
- **Shared hotspot pattern** — books (library) + vessel (docks) repeat the `data-hotspot` + onClick + onKeyDown; factor a `<Hotspot>` helper.
- **The air configs** (`gardenAir`/`docksAir`/`libraryAir`/`lantern*Air`) are near-duplicates of `stubAir` — one factory.

Quality only — no behavior change. Run `npm test` (75/75) + build after.

---

## 4. Known seams → punch list (schedule; don't fix inside the review)

- **Capture-sheet dim** over the world (z-index) — 2c.
- **Settings / invite** aren't reachable *from* the world (only via a sub-page's ribbon). Needs an in-world route (a hearth affordance, or a small "keep" menu).
- **In-world book/vessel interiors** (Phase 2b) — books/vessel currently route OUT to `/book`, `/trends`, `/library`, `/shore`, breaking immersion; and closing returns to the hearth center (you re-climb). Make them in-world spreads.
- **Full ribbon retirement** — it's transitional chrome for sub-pages; retire once nav is fully in-world.
- **Gate cadence** — confirmed mandatory (Matthew), but tune length/feel; consider a session-flag so internal nav back to `/` doesn't feel like a toll (vs. true app-open).
- **World-wide day/night cycle** — a future pass to tune the whole world (not just the Garden) to time of day.
- **Ornate logo** — the "Signed × Sealed" wordmark is a first-pass CSS gilt; the full ornate script logo is a later design.
- **Overview art polish** — ongoing (the far-off island, the docks, lanterns are v1).
- **Privacy** — real `/privacy` legal review before external users (carried from before).

---

## 5. Sequencing (recommended)

1. **Canon refresh** (§1) — 20 min, orients the review.
2. **`/code-review`** (§2) — lead with 2a + 2b (the loop), then 2c–2e. Fix confirmed correctness issues; log the rest to the punch list.
3. **`/simplify`** (§3) — the world components, tests green after.
4. **Triage §4** into a real next-build order (my read: in-world book interiors + settings-from-world are the highest-value seams).

*Everything in §4 is a "wire it as we build" follow-up — none block the loop, which is live and working.*
