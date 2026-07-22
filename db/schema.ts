import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
  unique,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// A bond: the two-person tenant — a couple, gym partners, or friends. Every
// per-bond row carries bond_id, and the seal still cannot close alone. `kind`
// only flavors copy; `tz` is the future per-bond timezone (column added now,
// wired to todayIso() in a later phase). `id` is app-generated + globally unique.
export const bondKindEnum = pgEnum("bond_kind", [
  "couple",
  "gym_partners",
  "friends",
]);
export const slotEnum = pgEnum("slot", ["moss", "ember"]);

export const bonds = pgTable("bonds", {
  id: text("id").primaryKey(),
  kind: bondKindEnum("kind").notNull().default("couple"),
  tz: text("tz"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// A keeper: one side of a bond. `bondId` + `slot` (moss|ember) place them; the
// engine composes the seal from the bond's moss and ember. (bond_id/slot are
// nullable through the tenancy backfill, then made NOT NULL once every row is
// stamped.)
export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  bondId: text("bond_id")
    .references(() => bonds.id)
    .notNull(),
  slot: slotEnum("slot").notNull(),
  displayName: text("display_name").notNull(),
  // Credentials (B2). Nullable through the seed of the two existing keepers;
  // every real signup sets both. `email` is the login identity, always stored
  // lowercased so a plain unique guards case-insensitively (NULLs are distinct,
  // so the pre-account keepers can share "no email" until seeded).
  // `password_hash` is a scrypt `salt:key`.
  email: text("email").unique(),
  passwordHash: text("password_hash"),
  // Calculator inputs (Mifflin-St Jeor). All optional until set up in settings.
  sex: text("sex", { enum: ["male", "female"] }),
  birthdate: date("birthdate"),
  heightIn: real("height_in"),
  activityLevel: text("activity_level", {
    enum: ["sedentary", "light", "moderate", "active", "very_active"],
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Server-side sessions (B2): DB-backed so they can expire and be revoked. The
// cookie carries a random token + its HMAC (edge-verifiable, no DB hit); only
// the token's sha256 is stored here, so a DB leak alone can't forge a live
// cookie. Deleting the row (logout / sever) revokes instantly.
export const sessions = pgTable("sessions", {
  // sha256(token) — the raw token lives only in the cookie.
  tokenHash: text("token_hash").primaryKey(),
  profileId: text("profile_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

// Daily calorie/macro targets. New rows are appended when targets change so
// history stays honest as the cut progresses.
export const targets = pgTable("targets", {
  id: serial("id").primaryKey(),
  bondId: text("bond_id")
    .references(() => bonds.id)
    .notNull(),
  profileId: text("profile_id")
    .references(() => profiles.id)
    .notNull(),
  effectiveDate: date("effective_date").notNull(),
  calories: integer("calories").notNull(),
  proteinG: integer("protein_g").notNull(),
  carbsG: integer("carbs_g").notNull(),
  fatG: integer("fat_g").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const hallEnum = pgEnum("hall", [
  "protein",
  "produce",
  "grains",
  "dairy",
  "snacks",
  "sweets",
  "drinks",
  "dishes",
]);

// Specimens: the museum collection IS the food database. First log of a new
// food "donates" it; every later log is a 2-tap re-use.
export const foods = pgTable(
  "foods",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    hall: hallEnum("hall").notNull(),
    icon: text("icon").notNull().default("🍽"),
    servingLabel: text("serving_label").notNull(),
    calories: real("calories").notNull(),
    proteinG: real("protein_g").notNull(),
    carbsG: real("carbs_g").notNull(),
    fatG: real("fat_g").notNull(),
    isRecipe: boolean("is_recipe").notNull().default(false),
    // A deterministic macro estimate (from the written-in "eat" line), not an
    // exact label — the card wears a soft ~ and stays gently editable.
    estimated: boolean("estimated").notNull().default(false),
    fdcId: integer("fdc_id"),
    discoveredBy: text("discovered_by")
      .references(() => profiles.id)
      .notNull(),
    discoveredAt: timestamp("discovered_at").defaultNow().notNull(),
  },
  // The donate flow dedupes by lower(name); this makes it a hard guarantee and
  // closes the check-then-insert race. The museum is shared (global) across all
  // bonds — deliberately no bond_id here.
  (t) => [uniqueIndex("foods_name_lower_idx").on(sql`lower(${t.name})`)],
);

// Composite specimens: a recipe's macros are the sum of its ingredients.
export const recipeItems = pgTable(
  "recipe_items",
  {
    recipeFoodId: integer("recipe_food_id")
      .references(() => foods.id, { onDelete: "cascade" })
      .notNull(),
    ingredientFoodId: integer("ingredient_food_id")
      .references(() => foods.id)
      .notNull(),
    servings: real("servings").notNull().default(1),
  },
  (t) => [primaryKey({ columns: [t.recipeFoodId, t.ingredientFoodId] })],
);

export const mealEnum = pgEnum("meal", [
  "breakfast",
  "lunch",
  "dinner",
  "snacks",
]);

export const entries = pgTable(
  "entries",
  {
    id: serial("id").primaryKey(),
    bondId: text("bond_id")
    .references(() => bonds.id)
    .notNull(),
    profileId: text("profile_id")
      .references(() => profiles.id)
      .notNull(),
    day: date("day").notNull(),
    meal: mealEnum("meal").notNull(),
    foodId: integer("food_id")
      .references(() => foods.id)
      .notNull(),
    servings: real("servings").notNull().default(1),
    loggedAt: timestamp("logged_at").defaultNow().notNull(),
  },
  // The ledger scans by day-range and buckets per profile; deletes and the
  // journal read filter by (profile, day); logs join to foods. Without these
  // every one of those is a sequential scan (flagged: stack M1, DB M2).
  // Queries now lead with bond_id (ledger range scans, the journal read); the
  // per-profile and foods-join indexes stay useful.
  (t) => [
    index("entries_bond_day_idx").on(t.bondId, t.day),
    index("entries_profile_day_idx").on(t.profileId, t.day),
    index("entries_food_idx").on(t.foodId),
  ],
);

export const weighIns = pgTable(
  "weigh_ins",
  {
    bondId: text("bond_id")
    .references(() => bonds.id)
    .notNull(),
    profileId: text("profile_id")
      .references(() => profiles.id)
      .notNull(),
    day: date("day").notNull(),
    weightLb: real("weight_lb").notNull(),
  },
  (t) => [primaryKey({ columns: [t.profileId, t.day] })],
);

// One row per person per day for everything that isn't food:
// training stamp, water cups, a one-line note, a mood.
export const dayMeta = pgTable(
  "day_meta",
  {
    bondId: text("bond_id")
    .references(() => bonds.id)
    .notNull(),
    profileId: text("profile_id")
      .references(() => profiles.id)
      .notNull(),
    day: date("day").notNull(),
    training: text("training", { enum: ["lift", "cardio", "rest"] }),
    waterCups: integer("water_cups").notNull().default(0),
    note: text("note"),
    mood: text("mood"),
  },
  // The composite PK covers (profile, day) lookups, but the ledger reads meta
  // by day-range across both keepers — a leading-day index the PK can't serve.
  (t) => [
    primaryKey({ columns: [t.profileId, t.day] }),
    index("day_meta_bond_day_idx").on(t.bondId, t.day),
  ],
);

// The shared familiar (an arctic fox). Exactly one row. Mood and growth stage
// are always derived from logging data, never stored. (The physical table stays
// named "pet" until the multi-user pass renames it and adds household_id.)
export const familiar = pgTable("pet", {
  // One familiar per bond — bond_id is the natural key (the old singleton `id`
  // is retired). The physical table stays named "pet"; that rename is cosmetic.
  bondId: text("bond_id")
    .primaryKey()
    .references(() => bonds.id),
  name: text("name"),
  adoptedAt: timestamp("adopted_at").defaultNow().notNull(),
});

// The Training Log: real workouts, not a toggle. A day may hold several.
export const workouts = pgTable(
  "workouts",
  {
    id: serial("id").primaryKey(),
    bondId: text("bond_id")
    .references(() => bonds.id)
    .notNull(),
    profileId: text("profile_id")
      .references(() => profiles.id)
      .notNull(),
    day: date("day").notNull(),
    title: text("title").notNull(),
    note: text("note"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  // Read by bond + day-range (ledger, rolling PRs) and by (profile, day).
  (t) => [
    index("workouts_bond_day_idx").on(t.bondId, t.day),
    index("workouts_profile_day_idx").on(t.profileId, t.day),
  ],
);

// Sets: weight x reps for lifts, minutes for cardio. Bodyweight = null weight.
export const workoutSets = pgTable(
  "workout_sets",
  {
    id: serial("id").primaryKey(),
    workoutId: integer("workout_id")
      .references(() => workouts.id, { onDelete: "cascade" })
      .notNull(),
    kind: text("kind", { enum: ["lift", "cardio"] }).notNull(),
    exercise: text("exercise").notNull(),
    setIndex: integer("set_index").notNull().default(0),
    weightLb: real("weight_lb"),
    reps: integer("reps"),
    minutes: real("minutes"),
  },
  // The ledger lifts sets by workoutId (inArray join) on every history scan.
  (t) => [index("workout_sets_workout_idx").on(t.workoutId)],
);

// First discoveries of legendary sigils — one ceremony each, ever. The sigil
// itself is always derived from day data; only the discovery moment is stored.
export const sigilDiscoveries = pgTable(
  "sigil_discoveries",
  {
    id: serial("id").primaryKey(),
    bondId: text("bond_id")
      .references(() => bonds.id)
      .notNull(),
    sigilId: text("sigil_id").notNull(),
    day: date("day").notNull(),
    discoveredAt: timestamp("discovered_at").defaultNow().notNull(),
  },
  // One discovery per legendary PER BOND (was a global unique, which let the
  // first bond to earn a legendary block every other bond from recording it).
  (t) => [unique("sigil_discoveries_bond_sigil").on(t.bondId, t.sigilId)],
);

// First witnessing of an anchor being — one arrival ceremony each, ever.
// Being state itself is always derived from chord history.
export const beingArrivals = pgTable(
  "being_arrivals",
  {
    id: serial("id").primaryKey(),
    bondId: text("bond_id")
      .references(() => bonds.id)
      .notNull(),
    beingId: text("being_id").notNull(),
    day: date("day").notNull(),
    arrivedAt: timestamp("arrived_at").defaultNow().notNull(),
  },
  // One arrival per being PER BOND (mirrors sigil_discoveries).
  (t) => [unique("being_arrivals_bond_being").on(t.bondId, t.beingId)],
);

// The shared Dream — the far shore both keepers build toward. Exactly one row
// is `active` at a time; reached shores are kept as `reached` history. Planks
// are never stored — a plank is a both-logged day on/after `startedDay`,
// derived from the ledger. Only the Dream itself and the once-ever arrival
// moment (`reachedDay`) live here. Modeled on the singleton `familiar`, but the
// "choose your next shore" arc means more than one row over time.
export const dreams = pgTable("dreams", {
  id: serial("id").primaryKey(),
  bondId: text("bond_id")
    .references(() => bonds.id)
    .notNull(),
  name: text("name").notNull(),
  // Both-logged days (planks) to reach the shore. No deadline; never regresses.
  distanceDays: integer("distance_days").notNull(),
  // The day this vessel's build began counting from.
  startedDay: date("started_day").notNull(),
  // Set once, when the couple arrives — gates the arrival ceremony (claim-once).
  reachedDay: date("reached_day"),
  status: text("status", { enum: ["active", "reached"] })
    .notNull()
    .default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
