CREATE TYPE "public"."status_enum" AS ENUM('yes', 'no');--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "status" "status_enum" NOT NULL;