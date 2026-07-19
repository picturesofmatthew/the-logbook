import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// The two keepers of the logbook. Rows are seeded once; `id` doubles as the
// session profile value ('matthew' | 'kennedy').
export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  displayName: text("display_name").notNull(),
  // Calculator inputs (Mifflin-St Jeor). All optional until set up in settings.
  sex: text("sex", { enum: ["male", "female"] }),
  birthdate: date("birthdate"),
  heightIn: real("height_in"),
  activityLevel: text("activity_level", {
    enum: ["sedentary", "light", "moderate", "active", "very_active"],
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Daily calorie/macro targets. New rows are appended when targets change so
// history stays honest as the cut progresses.
export const targets = pgTable("targets", {
  id: serial("id").primaryKey(),
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
export const foods = pgTable("foods", {
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
  fdcId: integer("fdc_id"),
  discoveredBy: text("discovered_by")
    .references(() => profiles.id)
    .notNull(),
  discoveredAt: timestamp("discovered_at").defaultNow().notNull(),
});

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

export const entries = pgTable("entries", {
  id: serial("id").primaryKey(),
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
});

export const weighIns = pgTable(
  "weigh_ins",
  {
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
    profileId: text("profile_id")
      .references(() => profiles.id)
      .notNull(),
    day: date("day").notNull(),
    training: text("training", { enum: ["lift", "cardio", "rest"] }),
    waterCups: integer("water_cups").notNull().default(0),
    note: text("note"),
    mood: text("mood"),
  },
  (t) => [primaryKey({ columns: [t.profileId, t.day] })],
);

// The shared arctic fox. Exactly one row. Mood and growth stage are always
// derived from logging data, never stored.
export const pet = pgTable("pet", {
  id: integer("id").primaryKey().default(1),
  name: text("name"),
  adoptedAt: timestamp("adopted_at").defaultNow().notNull(),
});

// The Training Log: real workouts, not a toggle. A day may hold several.
export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  profileId: text("profile_id")
    .references(() => profiles.id)
    .notNull(),
  day: date("day").notNull(),
  title: text("title").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Sets: weight x reps for lifts, minutes for cardio. Bodyweight = null weight.
export const workoutSets = pgTable("workout_sets", {
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
});

// First discoveries of legendary sigils — one ceremony each, ever. The sigil
// itself is always derived from day data; only the discovery moment is stored.
export const sigilDiscoveries = pgTable("sigil_discoveries", {
  id: serial("id").primaryKey(),
  sigilId: text("sigil_id").notNull().unique(),
  day: date("day").notNull(),
  discoveredAt: timestamp("discovered_at").defaultNow().notNull(),
});
