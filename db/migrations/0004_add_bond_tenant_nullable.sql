CREATE TYPE "public"."bond_kind" AS ENUM('couple', 'gym_partners', 'friends');--> statement-breakpoint
CREATE TYPE "public"."slot" AS ENUM('moss', 'ember');--> statement-breakpoint
CREATE TABLE "bonds" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" "bond_kind" DEFAULT 'couple' NOT NULL,
	"tz" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "being_arrivals" ADD COLUMN "bond_id" text;--> statement-breakpoint
ALTER TABLE "day_meta" ADD COLUMN "bond_id" text;--> statement-breakpoint
ALTER TABLE "dreams" ADD COLUMN "bond_id" text;--> statement-breakpoint
ALTER TABLE "entries" ADD COLUMN "bond_id" text;--> statement-breakpoint
ALTER TABLE "pet" ADD COLUMN "bond_id" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "bond_id" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "slot" "slot";--> statement-breakpoint
ALTER TABLE "sigil_discoveries" ADD COLUMN "bond_id" text;--> statement-breakpoint
ALTER TABLE "targets" ADD COLUMN "bond_id" text;--> statement-breakpoint
ALTER TABLE "weigh_ins" ADD COLUMN "bond_id" text;--> statement-breakpoint
ALTER TABLE "workouts" ADD COLUMN "bond_id" text;--> statement-breakpoint
ALTER TABLE "being_arrivals" ADD CONSTRAINT "being_arrivals_bond_id_bonds_id_fk" FOREIGN KEY ("bond_id") REFERENCES "public"."bonds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "day_meta" ADD CONSTRAINT "day_meta_bond_id_bonds_id_fk" FOREIGN KEY ("bond_id") REFERENCES "public"."bonds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dreams" ADD CONSTRAINT "dreams_bond_id_bonds_id_fk" FOREIGN KEY ("bond_id") REFERENCES "public"."bonds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entries" ADD CONSTRAINT "entries_bond_id_bonds_id_fk" FOREIGN KEY ("bond_id") REFERENCES "public"."bonds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet" ADD CONSTRAINT "pet_bond_id_bonds_id_fk" FOREIGN KEY ("bond_id") REFERENCES "public"."bonds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_bond_id_bonds_id_fk" FOREIGN KEY ("bond_id") REFERENCES "public"."bonds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sigil_discoveries" ADD CONSTRAINT "sigil_discoveries_bond_id_bonds_id_fk" FOREIGN KEY ("bond_id") REFERENCES "public"."bonds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "targets" ADD CONSTRAINT "targets_bond_id_bonds_id_fk" FOREIGN KEY ("bond_id") REFERENCES "public"."bonds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weigh_ins" ADD CONSTRAINT "weigh_ins_bond_id_bonds_id_fk" FOREIGN KEY ("bond_id") REFERENCES "public"."bonds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_bond_id_bonds_id_fk" FOREIGN KEY ("bond_id") REFERENCES "public"."bonds"("id") ON DELETE no action ON UPDATE no action;