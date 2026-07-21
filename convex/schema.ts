// ⚑ ARCHIVED — PARKED, NOT IN THE BUILD.
// This is the Convex schema from the Expo/Convex/Rive native-rewrite
// exploration (LAUNCH-PATH.md), kept for reference to learn/iterate from if the
// native realtime path is ever revived. The live app is the Next.js + Neon
// (Postgres) PWA; this directory is excluded from tsconfig and ships nothing.
// Do not delete. See convex/README.md.
//
// Signed × Sealed — Convex backend spine.
//
// The realtime-native backend (LAUNCH-PATH.md). Mirrors the pure engine types
// in lib/engine/* so the seal composition ports 1:1 and binds mechanically to
// the Rive view model (art/RIVE-SEAL-BLUEPRINT.md).
//
// Design intent: dayLogs deliberately captures the EXPANSION DIMENSIONS
// (time-of-day, timezone-of-logging, shared specimens via foodEntries) so the
// sigil grammar can grow expansive + unique without a schema migration. The
// love-tap is a mutation-on-ring-close -> push (pushTokens), Convex's native
// strength. Convex auto-adds `_id` and `_creationTime` to every row.

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// ── Shared literal unions (mirror lib/engine/sigil.ts + lib/halls.ts) ──
// Confirm `hall` ids against lib/halls.ts when wiring.
const hall = v.union(
  v.literal("protein"), v.literal("produce"), v.literal("grains"),
  v.literal("dairy"), v.literal("sweets"), v.literal("drinks"), v.literal("dishes"),
);
const splitFamily = v.union(
  v.literal("push"), v.literal("pull"), v.literal("legs"),
  v.literal("full"), v.literal("cardio"), v.literal("rest"),
);
const sigilTier = v.union(
  v.literal("open"), v.literal("common"), v.literal("fine"),
  v.literal("resonant"), v.literal("legendary"),
);
const halfWeight = v.union(
  v.literal("open"), v.literal("lean"), v.literal("even"), v.literal("feast"),
);
// Chord + legendary ids are stored as plain strings on purpose: the seal is
// COMPUTED by the engine (never user input), and lib/engine/sigil.ts's
// CHORD_REGISTRY / LEGENDARY_REGISTRY are the single source of truth for what's
// valid. That way a new sigil component ships with ONE engine edit and needs
// no schema change here. (hall/splitFamily/tier/weight stay strict — they're
// stable, small enums where validation earns its keep.)

export default defineSchema({
  // ── People & pairing ──
  users: defineTable({
    clerkId: v.string(),          // Clerk subject / token identifier
    name: v.string(),
    handle: v.optional(v.string()),
    tz: v.string(),               // IANA tz — drives "today" (survives the Chiang Mai move)
    // keeper color (moss vs ember) is DERIVED from couple position, not stored here
  }).index("by_clerkId", ["clerkId"]),

  couples: defineTable({
    memberA: v.id("users"),                 // moss (green) keeper
    memberB: v.optional(v.id("users")),     // ember (terracotta) keeper — null until paired
    status: v.union(v.literal("pending"), v.literal("sealed"), v.literal("dissolved")),
    dreamName: v.optional(v.string()),      // Act Two: the far shore (e.g. "Kauai")
    tz: v.optional(v.string()),             // couple "today" boundary; fallback to memberA.tz
    sealedAtMs: v.optional(v.number()),
  }).index("by_memberA", ["memberA"]).index("by_memberB", ["memberB"]),

  invites: defineTable({
    code: v.string(),                       // short human code or deep-link token
    coupleId: v.id("couples"),
    fromUser: v.id("users"),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("expired")),
    expiresAtMs: v.number(),
  }).index("by_code", ["code"]).index("by_couple", ["coupleId"]),

  // ── The food library / museum / pantry (the collection IS the food db) ──
  specimens: defineTable({
    coupleId: v.id("couples"),
    name: v.string(),
    kcal: v.number(), proteinG: v.number(), carbsG: v.number(), fatG: v.number(),
    servingLabel: v.string(),
    hall: hall,
    fdcId: v.optional(v.string()),          // USDA source, if donated
    estimated: v.optional(v.boolean()),     // soft "estimated" mark — never a warning (tone law)
    firstDonatedDay: v.string(),
  }).index("by_couple", ["coupleId"]),

  // ── Raw logs ──
  foodEntries: defineTable({
    coupleId: v.id("couples"),
    userId: v.id("users"),
    day: v.string(),                        // tz-based ISO date
    specimenId: v.id("specimens"),          // shared specimen id -> unlocks the "Same Table" chord
    servings: v.number(),
    loggedAtMs: v.number(),
  }).index("by_user_day", ["userId", "day"]).index("by_couple_day", ["coupleId", "day"]),

  workouts: defineTable({
    coupleId: v.id("couples"),
    userId: v.id("users"),
    day: v.string(),
    title: v.string(),
    family: splitFamily,
    note: v.optional(v.string()),
    loggedAtMs: v.number(),
  }).index("by_user_day", ["userId", "day"]),

  workoutSets: defineTable({
    workoutId: v.id("workouts"),
    kind: v.union(v.literal("lift"), v.literal("cardio")),
    exercise: v.string(),
    setIndex: v.number(),
    weightLb: v.optional(v.number()),
    reps: v.optional(v.number()),
    minutes: v.optional(v.number()),
    distanceMi: v.optional(v.number()),
  }).index("by_workout", ["workoutId"]),

  // ── The per-user, per-day summary (== engine KeeperDay) ──
  // Computed from raw logs; the seal composes from two of these.
  dayLogs: defineTable({
    coupleId: v.id("couples"),
    userId: v.id("users"),
    day: v.string(),
    loggedAny: v.boolean(),
    calories: v.number(),
    targetCalories: v.union(v.number(), v.null()),
    proteinG: v.number(),
    targetProteinG: v.union(v.number(), v.null()),
    halls: v.array(hall),
    waterCups: v.number(),
    mood: v.union(v.string(), v.null()),
    wroteNote: v.boolean(),
    restDay: v.boolean(),
    // training summary (denormalized for the seal)
    trainingVolumeLb: v.number(),
    trainingCardioMin: v.number(),
    trainingPrCount: v.number(),
    trainingPrimaryFamily: v.union(splitFamily, v.null()),
    trained: v.boolean(),
    // ── expansion dimensions (feed the growing sigil grammar) ──
    firstLoggedAtMs: v.union(v.number(), v.null()),
    firstLoggedHour: v.union(v.number(), v.null()), // local hour 0-23 -> Dawn / Vigil chords
    loggedTz: v.optional(v.string()),               // -> the Long Distance chord (tz differs)
    updatedAtMs: v.number(),
  }).index("by_user_day", ["userId", "day"]).index("by_couple_day", ["coupleId", "day"]),

  // ── The composed seal (== engine SigilSpec), per couple per day ──
  seals: defineTable({
    coupleId: v.id("couples"),
    day: v.string(),
    completed: v.boolean(),
    tier: sigilTier,
    mossWeight: halfWeight,
    emberWeight: halfWeight,
    radicals: v.array(hall),
    ornaments: v.array(splitFamily),
    newMark: v.boolean(),
    chords: v.array(v.string()), // ChordId — engine registry is source of truth
    legendary: v.union(v.string(), v.null()), // LegendaryId | null
    seed: v.number(),
    composedAtMs: v.number(),
  }).index("by_couple_day", ["coupleId", "day"]),

  // ── First-earned log (Compendium; secrets silhouetted until earned) ──
  discoveries: defineTable({
    coupleId: v.id("couples"),
    kind: v.union(v.literal("chord"), v.literal("legendary")),
    entryId: v.string(),                    // the chord/legendary id
    firstEarnedDay: v.string(),
    firstEarnedAtMs: v.number(),
  }).index("by_couple", ["coupleId"]),

  // ── The bridge to the far shore — each completed seal lays a plank (Act Two) ──
  bridgePlanks: defineTable({
    coupleId: v.id("couples"),
    day: v.string(),
    sealId: v.id("seals"),
    laidAtMs: v.number(),
  }).index("by_couple", ["coupleId"]),

  // ── Push tokens for the love-tap ──
  pushTokens: defineTable({
    userId: v.id("users"),
    token: v.string(),
    platform: v.union(v.literal("ios"), v.literal("android")),
    updatedAtMs: v.number(),
  }).index("by_user", ["userId"]),
});
