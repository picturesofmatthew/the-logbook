CREATE INDEX "day_meta_day_idx" ON "day_meta" USING btree ("day");--> statement-breakpoint
CREATE INDEX "entries_day_idx" ON "entries" USING btree ("day");--> statement-breakpoint
CREATE INDEX "entries_profile_day_idx" ON "entries" USING btree ("profile_id","day");--> statement-breakpoint
CREATE INDEX "entries_food_idx" ON "entries" USING btree ("food_id");--> statement-breakpoint
CREATE INDEX "workout_sets_workout_idx" ON "workout_sets" USING btree ("workout_id");--> statement-breakpoint
CREATE INDEX "workouts_day_idx" ON "workouts" USING btree ("day");--> statement-breakpoint
CREATE INDEX "workouts_profile_day_idx" ON "workouts" USING btree ("profile_id","day");