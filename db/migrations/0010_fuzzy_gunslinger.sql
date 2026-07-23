CREATE TABLE "voice_notes" (
	"bond_id" text NOT NULL,
	"profile_id" text NOT NULL,
	"day" date NOT NULL,
	"audio" text NOT NULL,
	"mime" text NOT NULL,
	"transcript" text,
	"duration_s" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "voice_notes_profile_id_day_pk" PRIMARY KEY("profile_id","day")
);
--> statement-breakpoint
ALTER TABLE "voice_notes" ADD CONSTRAINT "voice_notes_bond_id_bonds_id_fk" FOREIGN KEY ("bond_id") REFERENCES "public"."bonds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voice_notes" ADD CONSTRAINT "voice_notes_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "voice_notes_bond_day_idx" ON "voice_notes" USING btree ("bond_id","day");