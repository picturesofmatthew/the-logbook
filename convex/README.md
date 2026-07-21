# convex/ — ARCHIVED (parked, not in the build)

This directory holds the **Convex backend schema** from the Expo + Convex + Rive
**native-rewrite exploration** (`LAUNCH-PATH.md`). It is **kept on purpose** as a
reference artifact — **not deleted.**

## Why it's here
The live app is the **Next.js 16 + Neon (Postgres) + Vercel PWA**. The native
rewrite is **PARKED** per the strategic decision (2026-07-21): revisit only once
multiple couples are willing to pay. This schema encodes real design thinking
worth keeping to learn/iterate from if that path is ever revived:

- the **two-player** couple / invite / pairing model (auth, `couples`, `invites`)
- the **love-tap** as a mutation-on-ring-close → push (`pushTokens`)
- the sigil grammar's intended **expansion dimensions** (time-of-day, logging
  timezone for the Long-Distance chord) baked into `dayLogs`

## Build status
`convex/` is **excluded from `tsconfig.json`** — nothing here compiles or ships.
Leave it excluded. If you're "cleaning up," **archive/ignore it, don't remove it.**
