CREATE TABLE "dreams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"distance_days" integer NOT NULL,
	"started_day" date NOT NULL,
	"reached_day" date,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
