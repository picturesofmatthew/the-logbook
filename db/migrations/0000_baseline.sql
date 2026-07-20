CREATE TYPE "public"."hall" AS ENUM('protein', 'produce', 'grains', 'dairy', 'snacks', 'sweets', 'drinks', 'dishes');--> statement-breakpoint
CREATE TYPE "public"."meal" AS ENUM('breakfast', 'lunch', 'dinner', 'snacks');--> statement-breakpoint
CREATE TABLE "being_arrivals" (
	"id" serial PRIMARY KEY NOT NULL,
	"being_id" text NOT NULL,
	"day" date NOT NULL,
	"arrived_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "being_arrivals_being_id_unique" UNIQUE("being_id")
);
--> statement-breakpoint
CREATE TABLE "day_meta" (
	"profile_id" text NOT NULL,
	"day" date NOT NULL,
	"training" text,
	"water_cups" integer DEFAULT 0 NOT NULL,
	"note" text,
	"mood" text,
	CONSTRAINT "day_meta_profile_id_day_pk" PRIMARY KEY("profile_id","day")
);
--> statement-breakpoint
CREATE TABLE "entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"day" date NOT NULL,
	"meal" "meal" NOT NULL,
	"food_id" integer NOT NULL,
	"servings" real DEFAULT 1 NOT NULL,
	"logged_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "foods" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"hall" "hall" NOT NULL,
	"icon" text DEFAULT '🍽' NOT NULL,
	"serving_label" text NOT NULL,
	"calories" real NOT NULL,
	"protein_g" real NOT NULL,
	"carbs_g" real NOT NULL,
	"fat_g" real NOT NULL,
	"is_recipe" boolean DEFAULT false NOT NULL,
	"fdc_id" integer,
	"discovered_by" text NOT NULL,
	"discovered_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"name" text,
	"adopted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"sex" text,
	"birthdate" date,
	"height_in" real,
	"activity_level" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_items" (
	"recipe_food_id" integer NOT NULL,
	"ingredient_food_id" integer NOT NULL,
	"servings" real DEFAULT 1 NOT NULL,
	CONSTRAINT "recipe_items_recipe_food_id_ingredient_food_id_pk" PRIMARY KEY("recipe_food_id","ingredient_food_id")
);
--> statement-breakpoint
CREATE TABLE "sigil_discoveries" (
	"id" serial PRIMARY KEY NOT NULL,
	"sigil_id" text NOT NULL,
	"day" date NOT NULL,
	"discovered_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sigil_discoveries_sigil_id_unique" UNIQUE("sigil_id")
);
--> statement-breakpoint
CREATE TABLE "targets" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"effective_date" date NOT NULL,
	"calories" integer NOT NULL,
	"protein_g" integer NOT NULL,
	"carbs_g" integer NOT NULL,
	"fat_g" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weigh_ins" (
	"profile_id" text NOT NULL,
	"day" date NOT NULL,
	"weight_lb" real NOT NULL,
	CONSTRAINT "weigh_ins_profile_id_day_pk" PRIMARY KEY("profile_id","day")
);
--> statement-breakpoint
CREATE TABLE "workout_sets" (
	"id" serial PRIMARY KEY NOT NULL,
	"workout_id" integer NOT NULL,
	"kind" text NOT NULL,
	"exercise" text NOT NULL,
	"set_index" integer DEFAULT 0 NOT NULL,
	"weight_lb" real,
	"reps" integer,
	"minutes" real
);
--> statement-breakpoint
CREATE TABLE "workouts" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"day" date NOT NULL,
	"title" text NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "day_meta" ADD CONSTRAINT "day_meta_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entries" ADD CONSTRAINT "entries_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entries" ADD CONSTRAINT "entries_food_id_foods_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."foods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foods" ADD CONSTRAINT "foods_discovered_by_profiles_id_fk" FOREIGN KEY ("discovered_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_items" ADD CONSTRAINT "recipe_items_recipe_food_id_foods_id_fk" FOREIGN KEY ("recipe_food_id") REFERENCES "public"."foods"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_items" ADD CONSTRAINT "recipe_items_ingredient_food_id_foods_id_fk" FOREIGN KEY ("ingredient_food_id") REFERENCES "public"."foods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "targets" ADD CONSTRAINT "targets_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weigh_ins" ADD CONSTRAINT "weigh_ins_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_sets" ADD CONSTRAINT "workout_sets_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;