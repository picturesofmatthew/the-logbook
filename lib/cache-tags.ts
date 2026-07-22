// Shared cache-invalidation tags. Kept in one place so a typo can't silently
// desync the cache from the write that should bust it — the core risk of
// tag-based invalidation.
//
// LEDGER_TAG covers the derived full-history ledger (the sigil composed for
// every day, wrapped in unstable_cache in lib/ledger.ts). Every write that
// changes a ledger INPUT must call revalidateTag(LEDGER_TAG, { expire: 0 }) —
// the { expire: 0 } form expires immediately (read-your-writes: a keeper sees
// their log land on the next render), where "max" would serve a stale seal:
//   • food entries        (app/log/actions.ts)
//   • workouts + sets      (app/train/actions.ts)
//   • day-meta: training/water/mood/note (app/day/actions.ts)
//   • calorie/macro targets (app/settings/actions.ts)
// Writes that do NOT feed the ledger deliberately skip it: weigh-ins, the
// shared Dream (boat is computed fresh, outside the cache), and the familiar's
// name. When the household boundary lands, the cache key gains couple_id and
// this becomes a per-couple tag.
export const LEDGER_TAG = "ledger";
