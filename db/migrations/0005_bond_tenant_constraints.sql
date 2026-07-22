ALTER TABLE "being_arrivals" DROP CONSTRAINT "being_arrivals_being_id_unique";--> statement-breakpoint
ALTER TABLE "sigil_discoveries" DROP CONSTRAINT "sigil_discoveries_sigil_id_unique";--> statement-breakpoint
DROP INDEX "day_meta_day_idx";--> statement-breakpoint
DROP INDEX "entries_day_idx";--> statement-breakpoint
DROP INDEX "workouts_day_idx";--> statement-breakpoint
ALTER TABLE "being_arrivals" ALTER COLUMN "bond_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "day_meta" ALTER COLUMN "bond_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "dreams" ALTER COLUMN "bond_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "entries" ALTER COLUMN "bond_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "bond_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "slot" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sigil_discoveries" ALTER COLUMN "bond_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "targets" ALTER COLUMN "bond_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "weigh_ins" ALTER COLUMN "bond_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "workouts" ALTER COLUMN "bond_id" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "day_meta_bond_day_idx" ON "day_meta" USING btree ("bond_id","day");--> statement-breakpoint
CREATE INDEX "entries_bond_day_idx" ON "entries" USING btree ("bond_id","day");--> statement-breakpoint
CREATE UNIQUE INDEX "foods_name_lower_idx" ON "foods" USING btree (lower("name"));--> statement-breakpoint
CREATE INDEX "workouts_bond_day_idx" ON "workouts" USING btree ("bond_id","day");--> statement-breakpoint
ALTER TABLE "pet" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "pet" ALTER COLUMN "bond_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pet" ADD PRIMARY KEY ("bond_id");--> statement-breakpoint
ALTER TABLE "being_arrivals" ADD CONSTRAINT "being_arrivals_bond_being" UNIQUE("bond_id","being_id");--> statement-breakpoint
ALTER TABLE "sigil_discoveries" ADD CONSTRAINT "sigil_discoveries_bond_sigil" UNIQUE("bond_id","sigil_id");