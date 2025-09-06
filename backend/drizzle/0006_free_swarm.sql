ALTER TABLE "users" ADD COLUMN "provider" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider_id" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
CREATE UNIQUE INDEX "users_provider_providerId_idx" ON "users" USING btree ("provider","provider_id");